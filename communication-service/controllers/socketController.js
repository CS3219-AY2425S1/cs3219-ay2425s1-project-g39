const roomMessages = {};

module.exports = (io) => {
  io.on('connection', (socket) => {

    // Listen for the 'joinRoom' event
    socket.on('joinRoom', (roomId) => {

      if (!roomId) {
        return socket.emit('error', 'Room ID is required.');
      }

      const room = io.sockets.adapter.rooms.get(roomId);

      // Check if the room already has two users
      if (room && room.size === 2) {
        socket.emit('error', `Room ${roomId} is full.`);
      } else {
        socket.join(roomId);
        console.log(`User ${socket.data.user.username} joined room ${roomId}`);

        if (roomMessages[roomId]) {
          socket.emit('loadPreviousMessages', roomMessages[roomId]);
        } else {
          roomMessages[roomId] = []; // Initialize message history for the room
        }

        // Notify other clients in the room that a user has joined
        socket.to(roomId).emit('user-joined', socket.data.user.username);

        // Room-specific event listeners
        socket.on('offer', (offer) => {
          socket.to(roomId).emit('offer', offer);
        });

        socket.on('ready-to-call', () => {
          socket.to(roomId).emit('ready-to-call', socket.data.user.userId);
        });

        socket.on('answer', (answer) => {
          socket.to(roomId).emit('answer', answer);
        });

        socket.on('candidate', (candidate) => {
          socket.to(roomId).emit('candidate', candidate);
        });

        socket.on('chatMessage', (msg) => {
          const message = { body: msg.body, userId: socket.data.user.userId };
          roomMessages[roomId].push(message); // Save message to room history
          io.in(roomId).emit('chatMessage', message);
        });

        socket.on('disconnect', () => {
          socket.to(roomId).emit('user-left', socket.data.user.username);
          
          if (room && room.size == 0 && roomMessages[roomId]) {
            delete roomMessages[roomId];
          }
        });

        socket.emit('roomJoined', roomId);
      }
    });
  });
};
