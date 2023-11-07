import { Server } from 'socket.io';
import { getSession } from 'next-auth/react';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      // get the room name from the query string
      // this query is sent by the client
      // with they io() call (see Chat.js)
      const room = socket.handshake.query.room;

      // get the session from the request
      // this is the next-auth session
      const session = await getSession({
        req: socket.request,
      });

      // join the room
      // (basically we're subscribing to messages in this 'channel')
      socket.join(room);

      // send message to client
      // to confirm their session / username
      socket.emit('session', session?.user?.email);

      // when we receive a message from a client
      // send it to all other clients in the room
      socket.on('input-change', (msg) => {
        socket.to(room).emit('update-input', {
          message: msg.message,
          name: session.user.email,
        });
      });
    });
  }
  res.end();
}
