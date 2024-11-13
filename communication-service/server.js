// server.js
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { PORT } = require('./config');
const socketRoutes = require('./routes/socketRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ['GET', 'POST'],
  },
  path: '/api/comm/socket.io',
  pingTimeout: 60000,
  pingInterval: 25000,
});


app.use('/api/collab', authMiddleware, socketRoutes(io));

server.listen(PORT, () => {
  console.log(`Communication service server is running on HTTP, port ${PORT}`);
});

