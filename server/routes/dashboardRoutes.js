const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

/**
 * @route   GET /api/dashboard
 * @desc    Get aggregate user financial summary across all groups
 * @access  Private
 */
router.get('/', getDashboardSummary);

module.exports = router;
