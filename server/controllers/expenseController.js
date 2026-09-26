const {
  createExpense: createExpenseModel,
  getGroupExpenses: getGroupExpensesModel,
  getExpenseById: getExpenseByIdModel,
  deleteExpense: deleteExpenseModel,
} = require('../models/expenseModel');
const { isGroupMember, getGroupMembers } = require('../models/groupModel');
const {
  calculateEqualSplit,
  calculateCustomSplit,
  calculatePercentageSplit,
} = require('../services/splitService');

/**
 * Add an expense to a group
 * @route POST /api/groups/:groupId/expenses
 * @access Private (Requires group membership)
 */
const createExpense = async (req, res, next) => {
  try {
    const groupId = req.group.id;
    const { title, amount, paid_by, split_method = 'EQUAL', expense_date, participants } = req.body;

    // 1. Validate Title
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Expense description/title is required',
      });
    }

    // 2. Validate Amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Expense amount must be a positive number greater than 0',
      });
    }

    // 3. Validate Paid By
    const payerId = parseInt(paid_by, 10);
    if (isNaN(payerId)) {
      return res.status(400).json({
        success: false,
        message: 'Please specify who paid for the expense',
      });
    }

    const isPayerMember = await isGroupMember(groupId, payerId);
    if (!isPayerMember) {
      return res.status(400).json({
        success: false,
        message: 'The person who paid must be a member of this group',
      });
    }

    // 4. Validate Split Method
    const normalizedSplitMethod = split_method.toUpperCase();
    if (!['EQUAL', 'CUSTOM', 'PERCENTAGE'].includes(normalizedSplitMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Split method must be EQUAL, CUSTOM, or PERCENTAGE',
      });
    }

    // 5. Validate Participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one participant must be selected for the expense',
      });
    }

    // Ensure all participants are group members
    const groupMembers = await getGroupMembers(groupId);
    const groupMemberIdSet = new Set(groupMembers.map((m) => Number(m.id)));

    // Normalize participants array so every element consistently has numeric userId
    const normalizedParticipants = participants.map((p) => {
      if (typeof p === 'object' && p !== null) {
        const rawId = p.userId !== undefined ? p.userId : p.user_id;
        const uid = parseInt(rawId, 10);
        return {
          ...p,
          userId: uid,
          user_id: uid,
          amount: p.amount !== undefined ? parseFloat(p.amount) : undefined,
          percentage: p.percentage !== undefined ? parseFloat(p.percentage) : undefined,
        };
      }
      const uid = parseInt(p, 10);
      return { userId: uid, user_id: uid };
    });

    for (const p of normalizedParticipants) {
      if (isNaN(p.userId) || !groupMemberIdSet.has(p.userId)) {
        return res.status(400).json({
          success: false,
          message: `Participant with user ID ${p.userId} is not a member of this group`,
        });
      }
    }

    // 6. Calculate Participant Shares using SplitService
    let calculatedShares = [];
    try {
      if (normalizedSplitMethod === 'EQUAL') {
        const userIds = normalizedParticipants.map((p) => p.userId);
        calculatedShares = calculateEqualSplit(numericAmount, userIds);
      } else if (normalizedSplitMethod === 'CUSTOM') {
        calculatedShares = calculateCustomSplit(numericAmount, normalizedParticipants);
      } else if (normalizedSplitMethod === 'PERCENTAGE') {
        calculatedShares = calculatePercentageSplit(numericAmount, normalizedParticipants);
      }
    } catch (splitError) {
      return res.status(400).json({
        success: false,
        message: splitError.message,
      });
    }

    // 7. Date handling (default to current date YYYY-MM-DD if not provided)
    const validDate = expense_date && !isNaN(Date.parse(expense_date))
      ? new Date(expense_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // 8. Save expense in database
    const createdExpense = await createExpenseModel(
      groupId,
      title.trim(),
      numericAmount,
      payerId,
      normalizedSplitMethod,
      validDate,
      calculatedShares
    );

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense: createdExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all expenses for a group
 * @route GET /api/groups/:groupId/expenses
 * @access Private (Requires group membership)
 */
const getGroupExpenses = async (req, res, next) => {
  try {
    const expenses = await getGroupExpensesModel(req.group.id);

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed split breakdown of a specific expense
 * @route GET /api/expenses/:expenseId
 * @access Private (Must be a group member)
 */
const getExpenseDetails = async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    if (isNaN(expenseId)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }

    const expense = await getExpenseByIdModel(expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Verify user is a member of the expense's group
    const isMember = await isGroupMember(expense.group_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a member of this expense\'s group',
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an expense
 * @route DELETE /api/expenses/:expenseId
 * @access Private (Payer or Group Creator only)
 */
const deleteExpenseAction = async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.expenseId, 10);
    if (isNaN(expenseId)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }

    const expense = await getExpenseByIdModel(expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Authorization: only the payer or the group creator can delete
    const isPayer = expense.paid_by === req.user.id;
    const isCreator = expense.group_creator_id === req.user.id;

    if (!isPayer && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Only the person who paid or the group creator can delete this expense',
      });
    }

    await deleteExpenseModel(expenseId);

    res.status(200).json({
      success: true,
      message: `Expense "${expense.title}" was deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getGroupExpenses,
  getExpenseDetails,
  deleteExpenseAction,
};
