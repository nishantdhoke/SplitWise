const jwt = require('jsonwebtoken');

/**
 * JWT Utility Functions
 * 
 * JSON Web Tokens (JWT) allow stateless authentication:
 * Instead of storing session records in MySQL or Redis, the server cryptographically
 * signs a token containing the user's ID. When the client sends this token in
 * the HTTP Authorization header (`Bearer <token>`), the server verifies the signature.
 */

const getSecret = () => process.env.JWT_SECRET || 'fairshare_jwt_super_secret_key_2026';
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

/**
 * Signs a JWT with the user's payload
 * @param {object} payload - e.g. { id: user.id, email: user.email }
 * @returns {string} Signed JWT token
 */
const signToken = (payload) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: getExpiresIn(),
  });
};

/**
 * Verifies a JWT token
 * @param {string} token 
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};

module.exports = {
  signToken,
  verifyToken,
};
