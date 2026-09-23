const {
  calculateGroupBalances,
  simplifyDebts,
} = require('../services/balanceService');

/**
 * Get net balances and suggested repayments for a group
 * @route GET /api/groups/:groupId/balances
 * @access Private (Requires group membership)
 */
const getGroupBalancesHandler = async (req, res, next) => {
  try {
    const groupId = req.group.id;
    const currentUserId = req.user.id;

    // 1. Calculate net balances for each group member
    const balances = await calculateGroupBalances(groupId);

    // 2. Run greedy debt simplification algorithm
    const suggestedSettlements = simplifyDebts(balances);

    // 3. User-specific summary metrics for the currently logged-in user
    const currentUserBalance = balances.find((b) => b.userId === currentUserId) || {
      netBalance: 0,
      totalPaid: 0,
      totalOwed: 0,
      status: 'SETTLED',
    };

    // Calculate how much current user owes vs is owed in suggested settlements
    let currentUserOwes = 0;
    let currentUserOwed = 0;

    suggestedSettlements.forEach((s) => {
      if (s.payerId === currentUserId) {
        currentUserOwes += s.amount;
      }
      if (s.receiverId === currentUserId) {
        currentUserOwed += s.amount;
      }
    });

    res.status(200).json({
      success: true,
      currentUserSummary: {
        netBalance: currentUserBalance.netBalance,
        totalPaid: currentUserBalance.totalPaid,
        totalOwed: currentUserBalance.totalOwed,
        status: currentUserBalance.status,
        youOwe: parseFloat(currentUserOwes.toFixed(2)),
        youAreOwed: parseFloat(currentUserOwed.toFixed(2)),
      },
      balances,
      suggestedSettlements,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroupBalancesHandler,
};
