'use client';

import { useEffect, useState, useOptimistic } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

let socket;
const Home = ({ room }) => {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io({
      query: {
        room: room,
      },
    });
    socketInitializer();
    return () => {
      socket.disconnect();
    };
  }, [room]);

  const socketInitializer = async () => {
    await fetch('/api/socket_io');

    // sent by the server when
    // we connect successfully,
    // and will contain the session
    socket.on('session', (msg) => {
      if (msg) {
        setName(msg);
      }
    });

    // sent by the server when
    // someone else sends a message
    socket.on('update-input', (msg) => {
      // if the new message has the same id as one of the
      // messages already in the state, then we're getting
      // a message we already sent, so we need to remove
      // our current message from the state
      setMessages((messages) => [
        ...messages.filter((message) => message.id !== msg.id),
        msg,
      ]);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // generate a unique id for this message
    // so we can remove it from the state
    // if we get it back from the server
    const id = v4();
    socket.emit('input-change', { message: input, name: name, id });
    setMessages((messages) => [
      ...messages,
      { message: input, name: name, id, sending: true },
    ]);
  };

  return (
    <article>
      {name && <h1 className="text-xl">Socket connected as: {name}</h1>}
      {!name && <h1 className="text-xl">Socket not connected</h1>}

      {/* if we're connected and authenticated- display the chatbox */}
      {name && (
        <form onSubmit={onSubmit}>
          <input
            className="text-black"
            placeholder="Type something"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
      )}
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <span className="text-gray-500">{msg.name}:</span>
            {msg.message}

            {/* because we
            use the same id for the message in the state
            and the message from the server
            we can use it to determine if the message
            is sending or not
            and display a message to the user
            */}
            <span
              className={`${
                msg.sending ? 'opacity-90' : 'opacity-0'
              } transition-all duration-1000 ml-8`}
            >
              (sending...)
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Home;
