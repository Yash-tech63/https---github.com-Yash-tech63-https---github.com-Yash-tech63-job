const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any Vercel preview deployment automatically
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers (with rawBody capture for webhook HMAC signature verification)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static resume uploads
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Mount API routes
app.use('/api', routes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    platform: 'TrueHire SaaS Platform API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      candidate: '/api/candidate',
      recruiter: '/api/recruiter',
      admin: '/api/admin'
    }
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect Database and Launch Server
const startServer = async () => {
  try {
    await connectDB();
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      logger.info(`TrueHire Server listening on ${HOST}:${PORT}`, 'STARTUP', {
        port: PORT,
        host: HOST,
        env: process.env.NODE_ENV || 'development'
      });
      console.log(`====================================================`);
      console.log(`🚀 TrueHire Server listening on ${HOST}:${PORT}`);
      console.log(`📡 Base API URL: http://0.0.0.0:${PORT}/api`);
      console.log(`📁 Uploads served at: http://0.0.0.0:${PORT}/uploads`);
      console.log(`====================================================`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, 'STARTUP_ERROR');
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
