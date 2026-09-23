const express = require('express');
const { getHealthStatus } = require('../controllers/healthController');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Check API and database health
 * @access  Public
 */
router.get('/', getHealthStatus);

module.exports = router;
