import { Server } from 'socket.io';
import { getSession } from 'next-auth/react';

import dbConnect from '@/lib/mongoConnect';
import Chat from '@/models/chat';

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

      // subscribe to messages from the Chat model
      // in the database
      await dbConnect();
      const subscriber = Chat.watch([
        {
          $match: {
            'fullDocument.room': room,
          },
        },
      ]);

      // when a new message is added to the database
      // send it to the client
      subscriber.on('change', (change) => {
        if (change.operationType === 'insert') {
          socket.to(room).emit('update-input', {
            message: change.fullDocument.message,
            name: change.fullDocument.sender,
            id: change.fullDocument.nominalId,
          });
        }
      });

      // when a client disconnects
      // unsubscribe from the database
      socket.on('disconnect', () => {
        subscriber.close();
      });

      // get the last 10 messages from the database
      // and send them to the client
      const messages = await Chat.find({ room })
        .sort({
          _id: -1,
        })
        .limit(10);

      messages.reverse().forEach((message) => {
        socket.emit('update-input', {
          message: message.message,
          name: message.sender,
          id: message.nominalId,
        });
      });

      // when we receive a message from a client
      // save it to the database
      socket.on('input-change', async (msg) => {
        const chat = new Chat({
          message: msg.message,
          nominalId: msg.id,
          sender: session.user.email,
          room,
        });
        await chat.save();
      });
    });
  }
  res.end();
}
