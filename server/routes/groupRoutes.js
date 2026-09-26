const express = require('express');
const {
  createGroup,
  getGroups,
  getGroupDetails,
  addMember,
  removeMember,
  deleteGroupAction,
} = require('../controllers/groupController');
const {
  createExpense,
  getGroupExpenses,
} = require('../controllers/expenseController');
const {
  getGroupBalancesHandler,
} = require('../controllers/balanceController');
const {
  recordSettlement,
  getGroupSettlements,
} = require('../controllers/settlementController');
const {
  getGroupActivity,
} = require('../controllers/activityController');
const {
  postGroupMessage,
  fetchGroupMessages,
} = require('../controllers/messageController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireGroupMember } = require('../middleware/groupMiddleware');

const router = express.Router();

// All group routes require authenticated user
router.use(requireAuth);

/**
 * @route   GET /api/groups
 * @desc    Get all groups the logged-in user belongs to
 * @access  Private
 */
router.get('/', getGroups);

/**
 * @route   POST /api/groups
 * @desc    Create a new group
 * @access  Private
 */
router.post('/', createGroup);

/**
 * @route   GET /api/groups/:groupId
 * @desc    Get group details & member list
 * @access  Private (Group Member)
 */
router.get('/:groupId', requireGroupMember, getGroupDetails);

/**
 * @route   POST /api/groups/:groupId/members
 * @desc    Add a registered member by email
 * @access  Private (Group Member)
 */
router.post('/:groupId/members', requireGroupMember, addMember);

/**
 * @route   DELETE /api/groups/:groupId/members/:userId
 * @desc    Remove a member from the group (Creator or self)
 * @access  Private (Group Member)
 */
router.delete('/:groupId/members/:userId', requireGroupMember, removeMember);

/**
 * @route   DELETE /api/groups/:groupId
 * @desc    Delete a group (Creator only)
 * @access  Private (Group Creator)
 */
router.delete('/:groupId', requireGroupMember, deleteGroupAction);

/**
 * @route   GET /api/groups/:groupId/expenses
 * @desc    Get all expenses recorded for this group
 * @access  Private (Group Member)
 */
router.get('/:groupId/expenses', requireGroupMember, getGroupExpenses);

/**
 * @route   POST /api/groups/:groupId/expenses
 * @desc    Record a new shared expense
 * @access  Private (Group Member)
 */
router.post('/:groupId/expenses', requireGroupMember, createExpense);

/**
 * @route   GET /api/groups/:groupId/balances
 * @desc    Get group member net balances and simplified repayment settlements
 * @access  Private (Group Member)
 */
router.get('/:groupId/balances', requireGroupMember, getGroupBalancesHandler);

/**
 * @route   POST /api/groups/:groupId/settlements
 * @desc    Record a debt repayment settlement
 * @access  Private (Group Member)
 */
router.post('/:groupId/settlements', requireGroupMember, recordSettlement);

/**
 * @route   GET /api/groups/:groupId/settlements
 * @desc    Get settlement history for this group
 * @access  Private (Group Member)
 */
router.get('/:groupId/settlements', requireGroupMember, getGroupSettlements);

/**
 * @route   GET /api/groups/:groupId/activity
 * @desc    Get chronological activity feed for this group
 * @access  Private (Group Member)
 */
router.get('/:groupId/activity', requireGroupMember, getGroupActivity);

/**
 * @route   GET /api/groups/:groupId/messages
 * @desc    Get group chat messages
 * @access  Private (Group Member)
 */
router.get('/:groupId/messages', requireGroupMember, fetchGroupMessages);

/**
 * @route   POST /api/groups/:groupId/messages
 * @desc    Send a new message to group members
 * @access  Private (Group Member)
 */
router.post('/:groupId/messages', requireGroupMember, postGroupMessage);

module.exports = router;
