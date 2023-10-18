'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
let socket;

const Home = () => {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket_io');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
    });

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
    <div>
      <form onSubmit={onSubmit}>
        <input
          className="text-black"
          placeholder="Type something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          className="text-black"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <span className="text-gray-500">{msg.name}:</span>
            {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
