const { verifyToken } = require('../utils/jwt');
const { findUserById } = require('../models/userModel');

/**
 * JWT Authentication Middleware
 * 
 * Intercepts incoming requests to protected routes.
 * 1. Checks if the HTTP Authorization header is present with "Bearer <token>"
 * 2. Verifies the token's cryptographic signature and expiration
 * 3. Fetches the authenticated user from the database
 * 4. Injects `req.user` into the request object for subsequent controllers
 */
const requireAuth = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required',
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: User account not found',
      });
    }

    // Attach user to the request object (excluding password_hash)
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Access denied: Token is invalid or has expired',
    });
  }
};

module.exports = {
  requireAuth,
};
