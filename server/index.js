require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./src/routes');
const notFound = require('./src/middlewares/notFound');
const errorHandler = require('./src/middlewares/errorHandler');
const { initSocket } = require('./src/sockets/socketManager');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Welcome Root & /api handlers ---
const apiWelcomeHandler = (req, res) => {
  res.json({
    message: 'Welcome to CraveCraft Food Delivery REST API Server',
    status: 'online',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      orders: '/api/orders',
      admin: '/api/admin',
      addresses: '/api/addresses',
      favorites: '/api/favorites',
      images: '/api/images'
    }
  });
};

app.get('/', apiWelcomeHandler);
app.get('/api', apiWelcomeHandler);

// --- API routes ---
app.use('/api', routes);

// --- 404 + centralized error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- HTTP server + Socket.IO (Socket.IO needs the raw http.Server, not just Express) ---
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO listening for connections`);
});