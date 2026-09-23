const express = require('express');
const {
  getExpenseDetails,
  deleteExpenseAction,
} = require('../controllers/expenseController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

/**
 * @route   GET /api/expenses/:expenseId
 * @desc    Get detailed breakdown of a single expense
 * @access  Private (Group Member)
 */
router.get('/:expenseId', getExpenseDetails);

/**
 * @route   DELETE /api/expenses/:expenseId
 * @desc    Delete an expense (Payer or Creator)
 * @access  Private (Payer or Group Creator)
 */
router.delete('/:expenseId', deleteExpenseAction);

module.exports = router;
