/**
 * Centralized Error Handling Middleware
 * 
 * In Express, an error-handling middleware function has 4 arguments: (err, req, res, next).
 * Whenever a route handler calls next(error) or throws an uncaught error, Express
 * automatically delegates it to this middleware.
 * 
 * Benefits:
 * 1. Standardizes error responses across all API endpoints.
 * 2. Prevents server crashes on unhandled errors.
 * 3. Hides internal stack traces in production for security.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  console.error(`💥 [Error] ${req.method} ${req.originalUrl}:`, err.message);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * 404 Route Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
