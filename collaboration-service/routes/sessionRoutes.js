const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authMiddlewareSocket } = require('../middleware/authMiddleware');

// This route serves the socket connection for session handling
module.exports = (io) => {

  // health check
  router.get('/', (req, res) => {
    return res.send('hello world');
  })

  // Handle session check for a specific user
  router.get('/check-session/', (req, res) => {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const sessionDetails = sessionController.checkSessionForUser(userId);
      return res.status(200).json(sessionDetails);
    } catch (error) {
      return res.status(500).json({ error: "Uknown error" });
    }
  });

  io.on('connection', async (socket) => {
    // Delegate session handling to the controller
    console.log(`Socket ${socket.id} connected`);
    try {
      const authHeader = socket.handshake.headers['authorization'];
      const user = await authMiddlewareSocket(authHeader);
      socket.data.user = user;
      sessionController.joinSession(socket, io);
    } catch (error) {
      socket.emit('error', { message: "Unauthorised socket connection." })
      socket.disconnect(true);
    }
  });

  return router;
};
