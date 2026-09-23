const {
  createGroup: createGroupModel,
  findUserGroups,
  getGroupMembers,
  isGroupMember,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup: deleteGroupModel,
} = require('../models/groupModel');
const { findUserByEmail, findUserById } = require('../models/userModel');

/**
 * Create a new group
 * @route POST /api/groups
 * @access Private
 */
const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Group name must be at least 2 characters long',
      });
    }

    if (name.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Group name cannot exceed 150 characters',
      });
    }

    const group = await createGroupModel(name.trim(), req.user.id);

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all groups that the current user belongs to
 * @route GET /api/groups
 * @access Private
 */
const getGroups = async (req, res, next) => {
  try {
    const groups = await findUserGroups(req.user.id);

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed information and member list for a group
 * @route GET /api/groups/:groupId
 * @access Private (Requires group membership)
 */
const getGroupDetails = async (req, res, next) => {
  try {
    const members = await getGroupMembers(req.group.id);

    res.status(200).json({
      success: true,
      group: {
        ...req.group,
        isCreator: req.group.created_by === req.user.id,
        members,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add an existing registered user to the group by email
 * @route POST /api/groups/:groupId/members
 * @access Private (Requires group membership)
 */
const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address to invite',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user is registered in the system
    const targetUser = await findUserByEmail(normalizedEmail);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: `No account found with email "${normalizedEmail}". Ask your friend to register first!`,
      });
    }

    // 2. Prevent duplicate membership
    const alreadyMember = await isGroupMember(req.group.id, targetUser.id);
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: `${targetUser.name} is already a member of this group`,
      });
    }

    // 3. Add to group_members
    await addMemberToGroup(req.group.id, targetUser.id);

    const updatedMembers = await getGroupMembers(req.group.id);

    res.status(201).json({
      success: true,
      message: `${targetUser.name} added to the group successfully`,
      members: updatedMembers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a member from the group
 * @route DELETE /api/groups/:groupId/members/:userId
 * @access Private (Requires group membership)
 */
const removeMember = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);

    if (isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member user ID',
      });
    }

    // Cannot remove the group creator
    if (targetUserId === req.group.created_by) {
      return res.status(400).json({
        success: false,
        message: 'The group creator cannot be removed from the group',
      });
    }

    // Authorization: Only the creator can remove others, but users can always remove themselves
    const isCreator = req.group.created_by === req.user.id;
    const isSelfRemoval = req.user.id === targetUserId;

    if (!isCreator && !isSelfRemoval) {
      return res.status(403).json({
        success: false,
        message: 'Only the group creator can remove other members',
      });
    }

    // Check if target user is actually a member
    const isMember = await isGroupMember(req.group.id, targetUserId);
    if (!isMember) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this group',
      });
    }

    await removeMemberFromGroup(req.group.id, targetUserId);

    const updatedMembers = await getGroupMembers(req.group.id);

    res.status(200).json({
      success: true,
      message: isSelfRemoval ? 'You have left the group' : 'Member removed successfully',
      members: updatedMembers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a group (Creator only)
 * @route DELETE /api/groups/:groupId
 * @access Private (Creator only)
 */
const deleteGroupAction = async (req, res, next) => {
  try {
    if (req.group.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the group creator can delete this group',
      });
    }

    await deleteGroupModel(req.group.id);

    res.status(200).json({
      success: true,
      message: `Group "${req.group.name}" was deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupDetails,
  addMember,
  removeMember,
  deleteGroupAction,
};
