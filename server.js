const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
     

    // Welcome current user
    socket.emit('message', 'Welcome to ChatBot');

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the channel');

    // Runs when client disconnect
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the channel');
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
