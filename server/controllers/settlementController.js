const {
  createSettlement: createSettlementModel,
  getGroupSettlements: getGroupSettlementsModel,
  deleteSettlement: deleteSettlementModel,
} = require('../models/settlementModel');
const { isGroupMember } = require('../models/groupModel');

/**
 * Record a payment / debt settlement between group members
 * @route POST /api/groups/:groupId/settlements
 * @access Private (Requires group membership)
 */
const recordSettlement = async (req, res, next) => {
  try {
    const groupId = req.group.id;
    const { payer_id, receiver_id, amount } = req.body;

    const payerId = parseInt(payer_id, 10);
    const receiverId = parseInt(receiver_id, 10);
    const numericAmount = parseFloat(amount);

    // 1. Validation
    if (isNaN(payerId) || isNaN(receiverId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payer and receiver IDs are required',
      });
    }

    if (payerId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'A user cannot settle debts with themselves',
      });
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Settlement amount must be greater than ₹0',
      });
    }

    // 2. Verify both users are members of this group
    const isPayerMember = await isGroupMember(groupId, payerId);
    const isReceiverMember = await isGroupMember(groupId, receiverId);

    if (!isPayerMember || !isReceiverMember) {
      return res.status(400).json({
        success: false,
        message: 'Both the payer and receiver must be members of this group',
      });
    }

    // 3. Save settlement record
    const settlement = await createSettlementModel(groupId, payerId, receiverId, numericAmount);

    res.status(201).json({
      success: true,
      message: 'Settlement recorded successfully',
      settlement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all settlement records for a group
 * @route GET /api/groups/:groupId/settlements
 * @access Private (Requires group membership)
 */
const getGroupSettlements = async (req, res, next) => {
  try {
    const settlements = await getGroupSettlementsModel(req.group.id);

    res.status(200).json({
      success: true,
      count: settlements.length,
      settlements,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordSettlement,
  getGroupSettlements,
};
