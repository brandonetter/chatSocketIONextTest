'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

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
      setMessages((messages) => [...messages, msg]);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    socket.emit('input-change', { message: input, name: name });
    setMessages((messages) => [...messages, { message: input, name: name }]);
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
        {messages.map((msg, i) => (
          <li key={i}>
            <span className="text-gray-500">{msg.name}:</span>
            {msg.message}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Home;
