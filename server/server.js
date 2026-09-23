const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const { testConnection } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Body parser middleware: parses incoming JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📡 [${req.method}] ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api', apiRoutes);

// Ignore favicon requests on the API server
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route for simple verification
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the FairShare Expense Splitter API',
    documentation: '/api/health',
  });
});

// 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server and verify database connection
const startServer = async () => {
  try {
    app.listen(PORT, async () => {
      console.log(`===============================================`);
      console.log(`🚀 FairShare Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);

      // Test MySQL connection on startup
      await testConnection();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
