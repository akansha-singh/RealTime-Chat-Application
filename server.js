const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentuser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botname = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinChannel', ({ username, room }) => {
        // Welcome current user
            socket.emit('message', formatMessage(botname, 'Welcome to ChatBot'));

        // Broadcast when a user connects
            socket.broadcast.emit('message', formatMessage(botname, 'A user has joined the chat'));

    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    // Runs when client disconnect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botname, 'A user has left the chat'));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
