// routes/socketRoutes.js
const express = require('express');
const socketController = require('../controllers/socketController');
const router = express.Router();
const { authGetUser } = require('../middleware/authMiddleware');

module.exports = (io) => {
  // Health Check
  router.get('/', (req, res) => {
    return res.send('hello world');
  });

  /**
   * Authentication
   */
  io.on('connection', (socket) => {
    try {
      const token = socket.handshake.auth.token;
      const user = authGetUser(token);
      socket.data.user = user;
      console.log('A user connected:', socket.data.user?.userId);
    } catch (error) {
      console.log('Error: ', error.message);
      socket.emit('error', 'Unauthorised socket connection.')
      socket.disconnect(true);
    }

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user?.userId);
    });
  })

  // Listen for errors at the server level
  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  socketController(io);  // Attach the controller

  return router;
};
