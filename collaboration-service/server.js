const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sessionRoutes = require('./routes/sessionRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');
const { PORT } = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ['GET', 'POST'],
  },
  path: '/api/collab/socket.io',
  pingTimeout: 60000,  // Set a higher timeout (e.g., 60 seconds)
  pingInterval: 25000,  // Interval between ping packets
});

// Use the session routes at the '/api/collab' path (passing `io` for socket handling)
// Note that socket bypasses authMiddleware here
app.use('/api/collab', authMiddleware, sessionRoutes(io));

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});