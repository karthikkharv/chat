const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS options
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Apply middleware (if necessary)
app.use(cors());

// Function to handle general message events
const handleMessage = (socket) => {
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('send', data); // Broadcast message to all clients
  });
};

// Function to handle room-related events
const handleRoom = (socket) => {
  socket.on('room', (room) => {
    console.log('Joining room:', room);
    socket.join(room);
    // Log number of clients in the room
    console.log(`Room ${room} has ${io.sockets.adapter.rooms.get(room)?.size} clients`);
  });
};

// Function to handle private messages
const handlePrivateMessage = (socket) => {
  socket.on('private', (roomData) => {
    console.log('Sending private message to room:', roomData.room);
    io.to(roomData.room).emit('send', roomData); // Send message to the specified room
  });
};

// Function to handle user disconnects
const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

// Socket.io connection event handler
io.on('connection', (socket) => {
  console.log('User connected');
  
  // Attach event handlers to the socket
  handleMessage(socket);
  handleRoom(socket);
  handlePrivateMessage(socket);
  handleDisconnect(socket);
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
