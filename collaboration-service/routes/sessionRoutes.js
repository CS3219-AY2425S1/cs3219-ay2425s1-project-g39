const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { viewUserProfile } = require('../middleware/authMiddleware');

// This route serves the socket connection for session handling
module.exports = (io) => {

  // health check
  router.get('/', (req, res) => {
    return res.send('hello world');
  })

  // Handle session check for a specific user
  router.get('/check-session/', (req, res) => {
    const userId = req.userProfile._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const sessionDetails = sessionController.checkSessionForUser(userId);
    return res.status(200).json(sessionDetails);
  });

  io.on('connection', async (socket) => {
    // Delegate session handling to the controller
    try {
      const authHeader = socket.handshake.headers['authorization'];
      const userProfile = await viewUserProfile(authHeader);
      socket.data.userProfile = userProfile;
      sessionController.joinSession(socket, io);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 500)) {
        socket.emit('error', { message: "Unauthorised socket connection." })
      } else {
        socket.emit('error', { message: "Error with authentication." })
      }
      socket.disconnect(true);
    }
  });

  return router;
};
