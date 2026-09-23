const express = require('express');
const {
  register,
  login,
  getMe,
  searchRegisteredUsers,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and retrieve JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user profile
 * @access  Private
 */
router.get('/me', requireAuth, getMe);

/**
 * @route   GET /api/auth/search
 * @desc    Search registered users by email or name
 * @access  Private
 */
router.get('/search', requireAuth, searchRegisteredUsers);

module.exports = router;
