// JavaScript + Node.js + Express + Socket.IO

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

io.on('connection', (socket) => {
  socket.on('signal', (name, data) => {
    socket.broadcast.emit('signal', name, data);
  });

  socket.on('connectUser', (name) => {
    users.push(name);
    io.emit('connected', users);
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user !== socket.id);
    io.emit('connected', users);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});