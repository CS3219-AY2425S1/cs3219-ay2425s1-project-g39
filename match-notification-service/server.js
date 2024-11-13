const amqp = require('amqplib');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.MATCHING_NOTIFICATION_PORT || 4001;

// Apply CORS middleware
app.use(cors());
app.options('*', cors());

// Add a route handler for the root path
app.get('/', (req, res) => {
  res.send('Match Notification Service is running');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
  path: '/api/matching-notification/socket.io',
  pingTimeout: 60000, // Set a higher timeout (e.g., 60 seconds)
  pingInterval: 25000, // Interval between ping packets
});

// Store connected clients
let connectedClients = {}; // Mapping of userId to socketId

let connection;
let channel;

async function initRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare queues
  await channel.assertQueue('search_queue');
  await channel.assertQueue('disconnect_queue');
  await channel.assertQueue('match_found_queue');
  await channel.assertQueue('error_queue');

  // Listen for matches found
  channel.consume('match_found_queue', (msg) => {
    if (msg) {
      const matchFound = JSON.parse(msg.content.toString());
      console.log(`Match found:`, matchFound);

      const { userId, matchedUserId, sessionId, questionId } = matchFound;

      const userSocketId = connectedClients[userId];
      const matchUserSocketId = connectedClients[matchedUserId];

      if (userSocketId && matchUserSocketId) {
        // Emit to both users
        const matchFoundA = {
          userId,
          matchedUserId,
          sessionId,
          questionId,
        };
        io.to(userSocketId).emit('match_found', matchFoundA);
        const matchFoundB = {
          userId: matchedUserId,
          matchedUserId: userId,
          sessionId,
          questionId,
        };
        io.to(matchUserSocketId).emit('match_found', matchFoundB);
        console.log(
          `Notified user ${userId} and ${matchedUserId} of match at room ${sessionId}`,
        );
      }

      channel.ack(msg); // Acknowledge the message
    }
  });

  channel.consume('error_queue', (msg) => {
    if (msg) {
      const error = JSON.parse(msg.content.toString());
      console.log(`Error:`, error);

      const { userId, errorTag } = error;

      const userSocketId = connectedClients[userId];

      if (userSocketId) {
        io.to(userSocketId).emit(errorTag);
        console.log(`Notified user ${userId} of error: ${errorTag}`);
      }

      channel.ack(msg); // Acknowledge the message
    }
  });
}

// Initialize RabbitMQ connection
initRabbitMQ();

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Register the userId with the socket and send search request to RabbitMQ
  socket.on('register', (userId, difficulty, topics, token) => {
    if (connectedClients[userId]) {
      io.to(socket.id).emit(
        'existing_search',
        'User is already searching in another matching service.',
      );
      console.log(`User ${userId} is already searching in matching service.`);
    } else {
      // Register the new connection
      connectedClients[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
      
      // Send search request to RabbitMQ
      const searchRequest = { userId, difficulty, topics, token };
      channel.sendToQueue(
        'search_queue',
        Buffer.from(JSON.stringify(searchRequest)),
      );
      console.log(`Search request sent for user ${userId}`);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    for (const userId in connectedClients) {
      if (connectedClients[userId] === socket.id) {
        // Send disconnect request to RabbitMQ
        channel.sendToQueue(
          'disconnect_queue',
          Buffer.from(JSON.stringify({ userId })),
        );
        console.log(`Disconnect request sent for user ${userId}`);

        // Remove user from connected clients
        delete connectedClients[userId];
        console.log(
          `User ${userId} disconnected and removed from active clients.`,
        );
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Notification service is running and listening on port ${PORT}`);
});
