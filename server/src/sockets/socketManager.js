let io;

const initSocket = (httpServer) => {
  const { Server } = require('socket.io');
  const { verifyAccessToken } = require('../utils/token');

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-order-room', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('leave-order-room', (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    /**
     * A delivery partner's browser calls this repeatedly (e.g. every few
     * seconds) while an order is out for delivery. We verify their token
     * ourselves here (sockets don't go through Express middleware) before
     * relaying the position to everyone else in that order's room.
     */
    socket.on('delivery:sendLocation', ({ orderId, latitude, longitude, token }) => {
      try {
        const decoded = verifyAccessToken(token);
        if (decoded.role !== 'DELIVERY_PARTNER') {
          return; // silently ignore — not authorized to broadcast
        }
      } catch (err) {
        return; // invalid/expired token — ignore
      }

      io.to(`order:${orderId}`).emit('delivery:locationUpdated', {
        orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket first.');
  }
  return io;
};

module.exports = { initSocket, getIO };