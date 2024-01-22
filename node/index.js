const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',  // Reemplaza con la URL de tu aplicación cliente
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
  }
});

app.use(cors({
  origin: 'http://localhost:5173',  // Reemplaza con la URL de tu aplicación cliente
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

let users = [];


io.on('connection', (socket) => {
  console.log('New client connectedjjjjjjjj');
  io.emit('nou-usuari', { id: socket.id, nom: 'Nuevo Usuario' }
  
  );

  console.log('New client connected');

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
