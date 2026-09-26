const { createMessage, getGroupMessages } = require('../models/messageModel');

/**
 * Message Controller
 * Handles sending and fetching messages for group discussions.
 */

/**
 * Send a message in a group
 * @route POST /api/groups/:groupId/messages
 * @access Private (Group members only)
 */
const postGroupMessage = async (req, res, next) => {
  try {
    const groupId = req.group.id;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message length cannot exceed 2000 characters',
      });
    }

    const newMessage = await createMessage(groupId, userId, message);

    res.status(201).json({
      success: true,
      message: 'Message sent',
      chatMessage: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent messages for a group
 * @route GET /api/groups/:groupId/messages
 * @access Private (Group members only)
 */
const fetchGroupMessages = async (req, res, next) => {
  try {
    const groupId = req.group.id;
    const messages = await getGroupMessages(groupId, 100);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postGroupMessage,
  fetchGroupMessages,
};
