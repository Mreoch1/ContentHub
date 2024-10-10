const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const redditRoutes = require('./routes/reddit');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('./middleware/validate');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const trendingRoutes = require('./routes/trending');

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

// Connect to MongoDB
connectDB().catch(err => {
  logger.error('Failed to connect to MongoDB', { error: err.message });
  process.exit(1);
});

// Routes
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/reddit', redditRoutes);
app.use('/api/items', require('./routes/items'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trending', trendingRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { error: err.message });
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend server is running' });
});
