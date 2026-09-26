const { pool } = require('../config/db');

/**
 * Message Model
 * Handles database queries for member group chat.
 */

/**
 * Save a new message in a group
 * @param {number} groupId 
 * @param {number} userId 
 * @param {string} message 
 * @returns {Promise<object>} Created message object with user information
 */
const createMessage = async (groupId, userId, message) => {
  const insertQuery = `
    INSERT INTO messages (group_id, user_id, message)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(insertQuery, [groupId, userId, message.trim()]);

  const selectQuery = `
    SELECT m.id, m.group_id, m.user_id, m.message, m.created_at,
           u.name AS user_name, u.email AS user_email
    FROM messages m
    INNER JOIN users u ON m.user_id = u.id
    WHERE m.id = ?
  `;
  const [rows] = await pool.execute(selectQuery, [result.insertId]);
  return rows[0];
};

/**
 * Fetch messages for a group in chronological order
 * @param {number} groupId 
 * @param {number} limit 
 * @returns {Promise<Array<object>>} List of messages
 */
const getGroupMessages = async (groupId, limit = 100) => {
  const query = `
    SELECT m.id, m.group_id, m.user_id, m.message, m.created_at,
           u.name AS user_name, u.email AS user_email
    FROM messages m
    INNER JOIN users u ON m.user_id = u.id
    WHERE m.group_id = ?
    ORDER BY m.created_at ASC
    LIMIT ?
  `;
  // Using string conversion for limit in mysql2 execute
  const [rows] = await pool.query(query, [groupId, parseInt(limit, 10) || 100]);
  return rows;
};

module.exports = {
  createMessage,
  getGroupMessages,
};
