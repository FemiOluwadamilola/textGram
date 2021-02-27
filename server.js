const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const cors = require('cors');
const {userJoin,getCurrentUsers,userLogOut, getAllRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = 'Admin';

io.on('connection', socket => {
  socket.on('joinClassRoom', ({username,room}) => {
    const user = userJoin(socket.id,username,room);

    socket.join(user.room);

    socket.emit('message',formatMessage(bot,'welcome to textGram, have a fun chatting experience.'));
   
    socket.broadcast.to(user.room).emit('message',formatMessage(bot,`${user.username} as join the chat`));

    // send users and room info    
    io.to(user.room).emit('showAllUsersInRoom',{
      room:room,
      users:getAllRoomUsers(user.room)
    })

  });
   socket.on('chatMessage', msg => {
     const user = getCurrentUsers(socket.id)
     io.to(user.room).emit('message',formatMessage(user.username, msg));
   });

   socket.on('disconnect', () => {
     const user = userLogOut(socket.id);
     if(user){
      io.to(user.room).emit('message', formatMessage(bot,`${user.username} has left the chat room!!!`));

      // send users and room info
      io.to(user.room).emit('showAllUsersInRoom',{
        room:user.room,
        users:getAllRoomUsers(user.room)
      })
     }
 });
});

app.use(express.static(path.join(__dirname,'public')));

app.use(cors());

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

