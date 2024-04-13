// dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const formatMessage = require('./utils/messages');
const {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// set static file
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Bomb Bot';

// run when client connects
io.on('connection', (socket) => {
   socket.on('joinRoom', async ({language, username, room}) => {
      console.log(username);
      console.log(language);
      const user = userJoin(socket.id, language, username, room);
      socket.join(user.room);
      const message1 = await formatMessage(botName, 'Welcome to ChatRoom!', user.language);
      console.log(message1);

      setTimeout(() => {
         socket.emit('message', message1);
      }, 4000);
      const message2 = await formatMessage(botName, `${user.username} has joined the chat!`, user.language);
      console.log(message2);
      // broadcast when a user connects
      setTimeout(() => {
         socket.broadcast
             .to(user.room)
             .emit(
                 'message',
                 message2
             );
      }, 4000);

      // send users and room info
      io.to(user.room).emit('roomUsers', {
         room: user.room,
         users: getRoomUsers(user.room),
      });
   });
   // listen for chatMessage
   socket.on('chatMessage', async (msg) => {
      const user = getCurrentUser(socket.id);
      const message3 = await formatMessage(user.username, msg, user.language);
      setTimeout(() => {
         io.to(user.room).emit('message', message3);
      });
   }, 4000);

   // runs when clients disconnects
   socket.on('disconnect', async () => {
      const user = userLeave(socket.id);

      if (user) {
         const message4 = await formatMessage(botName, `${user.username} has left the chat!`, user.language);
         setTimeout(() => {
            io.to(user.room).emit(
                'message',
                message4
            );
         }, 4000);

         // send users and room info
         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
         });
      }
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`🎯 Server is running on PORT: ${PORT}`);
});
