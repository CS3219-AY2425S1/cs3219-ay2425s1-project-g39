module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

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
        socket.emit('roomJoined', roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Notify other clients in the room that a user has joined
        socket.to(roomId).emit('user-joined', socket.id);

        // Room-specific event listeners
        socket.on('offer', (offer) => {
          socket.to(roomId).emit('offer', offer);
        });

        socket.on('answer', (answer) => {
          socket.to(roomId).emit('answer', answer);
        });

        socket.on('candidate', (candidate) => {
          socket.to(roomId).emit('candidate', candidate);
        });

        socket.on('chatMessage', (msg) => {
          io.in(roomId).emit('chatMessage', msg);
        });
      }
    });
  });
};
