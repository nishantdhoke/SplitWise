const { pool } = require('../config/db');

/**
 * Settlement Model
 * 
 * Handles all database operations for recording debt repayments between group members.
 */

/**
 * Records a debt repayment transaction.
 * @param {number} groupId 
 * @param {number} payerId 
 * @param {number} receiverId 
 * @param {number} amount 
 * @returns {Promise<object>}
 */
const createSettlement = async (groupId, payerId, receiverId, amount) => {
  const query = `
    INSERT INTO settlements (group_id, payer_id, receiver_id, amount)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [groupId, payerId, receiverId, amount]);

  return {
    id: result.insertId,
    group_id: groupId,
    payer_id: payerId,
    receiver_id: receiverId,
    amount,
    settled_at: new Date(),
  };
};

/**
 * Retrieves all settlement records for a group, ordered chronologically.
 * @param {number} groupId 
 * @returns {Promise<Array>}
 */
const getGroupSettlements = async (groupId) => {
  const query = `
    SELECT 
      s.id,
      s.group_id,
      s.payer_id,
      s.receiver_id,
      s.amount,
      s.settled_at,
      p.name AS payer_name,
      p.email AS payer_email,
      r.name AS receiver_name,
      r.email AS receiver_email
    FROM settlements s
    INNER JOIN users p ON s.payer_id = p.id
    INNER JOIN users r ON s.receiver_id = r.id
    WHERE s.group_id = ?
    ORDER BY s.settled_at DESC
  `;
  const [rows] = await pool.execute(query, [groupId]);
  return rows;
};

/**
 * Deletes a settlement record (to undo accidental settlement).
 * @param {number} settlementId 
 * @returns {Promise<boolean>}
 */
const deleteSettlement = async (settlementId) => {
  const query = `
    DELETE FROM settlements 
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [settlementId]);
  return result.affectedRows > 0;
};

module.exports = {
  createSettlement,
  getGroupSettlements,
  deleteSettlement,
};
