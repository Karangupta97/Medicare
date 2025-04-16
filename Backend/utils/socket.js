import { Server } from 'socket.io';

let io;

// Initialize Socket.IO with the HTTP server
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:4000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Handle connection
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle authentication
    socket.on('authenticate', (userId) => {
      if (userId) {
        // Join a room specific to this user
        socket.join(`user:${userId}`);
        console.log(`User ${userId} authenticated and joined their room`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get the Socket.IO instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Send notification to a specific user
export const sendNotificationToUser = (userId, notification) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }
  
  io.to(`user:${userId}`).emit('notification', notification);
};
