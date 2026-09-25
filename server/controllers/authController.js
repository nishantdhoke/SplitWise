const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, findUserById, searchUsers } = require('../models/userModel');
const { signToken } = require('../utils/jwt');

// Simple regex for email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // 3. Hash the password with bcrypt (salt rounds = 10)
    // NEVER store plain-text passwords in the database
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Save the user in MySQL
    const newUser = await createUser(name.trim(), normalizedEmail, passwordHash);

    // 5. Generate JWT token
    const token = signToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Look up user by email
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Verify password with bcrypt.compare
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Generate JWT token
    const token = signToken({ id: user.id, email: user.email });

    // 4. Return user profile without password_hash
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * @route GET /api/auth/me
 * @access Private (Requires JWT)
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Search users by email or name (for group invitations)
 * @route GET /api/auth/search
 * @access Private (Requires JWT)
 */
const searchRegisteredUsers = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const users = await searchUsers(q, req.user.id);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  searchRegisteredUsers,
};
