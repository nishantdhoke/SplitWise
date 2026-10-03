const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');
const { testConnection } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();
if (!process.env.DB_PASSWORD && !process.env.MYSQL_URL) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : true;

app.use(cors({
  origin: allowedOrigins,
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

// Path to compiled client assets
const clientDistPath = path.resolve(__dirname, '../client/dist');

// Serve static frontend assets if built
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving compiled client from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA fallback for client-side routing (React Router)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root route for simple verification in API-only mode
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Fair Split Expense Splitter API',
      documentation: '/api/health',
    });
  });
}

// 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server and verify database connection
const startServer = async () => {
  try {
    app.listen(PORT, async () => {
      console.log(`===============================================`);
      console.log(`🚀 Fair Split Backend running on port ${PORT}`);
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
