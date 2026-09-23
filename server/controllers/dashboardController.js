const { findUserGroups } = require('../models/groupModel');
const { calculateGroupBalances } = require('../services/balanceService');
const { pool } = require('../config/db');

/**
 * Dashboard Controller
 * 
 * Aggregates overall financial standing across all groups for the logged-in user:
 * - Total amount user owes
 * - Total amount others owe the user
 * - Recent expenses across user's groups
 * - User's active groups
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Get all groups user belongs to
    const groups = await findUserGroups(userId);

    let totalYouOwePaise = 0;
    let totalYouAreOwedPaise = 0;

    // 2. Compute net balances for each group
    for (const group of groups) {
      const balances = await calculateGroupBalances(group.id);
      const userBalance = balances.find((b) => b.userId === userId);
      if (userBalance) {
        if (userBalance.netPaise > 0) {
          totalYouAreOwedPaise += userBalance.netPaise;
        } else if (userBalance.netPaise < 0) {
          totalYouOwePaise += Math.abs(userBalance.netPaise);
        }
      }
    }

    // 3. Fetch 5 most recent expenses across all groups user belongs to
    let recentExpenses = [];
    if (groups.length > 0) {
      const groupIds = groups.map((g) => g.id);
      const placeholders = groupIds.map(() => '?').join(',');

      const [expenseRows] = await pool.execute(`
        SELECT 
          e.id,
          e.group_id,
          e.title,
          e.amount,
          e.paid_by,
          e.split_method,
          e.expense_date,
          e.created_at,
          u.name AS payer_name,
          g.name AS group_name
        FROM expenses e
        INNER JOIN users u ON e.paid_by = u.id
        INNER JOIN \`groups\` g ON e.group_id = g.id
        WHERE e.group_id IN (${placeholders})
        ORDER BY e.created_at DESC
        LIMIT 5
      `, groupIds);

      recentExpenses = expenseRows;
    }

    res.status(200).json({
      success: true,
      summary: {
        totalYouOwe: parseFloat((totalYouOwePaise / 100).toFixed(2)),
        totalYouAreOwed: parseFloat((totalYouAreOwedPaise / 100).toFixed(2)),
        netTotal: parseFloat(((totalYouAreOwedPaise - totalYouOwePaise) / 100).toFixed(2)),
      },
      groupCount: groups.length,
      groups,
      recentExpenses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
