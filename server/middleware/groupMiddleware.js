const { findGroupById, isGroupMember } = require('../models/groupModel');

/**
 * Group Membership Middleware
 * 
 * Enforces strict authorization: A user can ONLY view or interact with
 * a group if they are an active member of that group.
 * 
 * 1. Validates that the requested groupId exists.
 * 2. Checks if req.user.id is enrolled in the group.
 * 3. Returns 403 Forbidden if the user is not a member.
 * 4. Injects `req.group` into the request object for controllers.
 */
const requireGroupMember = async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);

    if (isNaN(groupId) || groupId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid group ID provided',
      });
    }

    // Check if group exists
    const group = await findGroupById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify user membership
    const isMember = await isGroupMember(groupId, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a member of this group',
      });
    }

    // Attach group to request object
    req.group = group;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireGroupMember,
};
