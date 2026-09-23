const { pool } = require('../config/db');

/**
 * Expense Model
 * 
 * Handles all database operations for `expenses` and `expense_participants`.
 * Ensures relational integrity through transactions.
 */

/**
 * Creates an expense and all participant shares within a transaction.
 * @param {number} groupId 
 * @param {string} title 
 * @param {number} amount 
 * @param {number} paidBy 
 * @param {string} splitMethod - 'EQUAL', 'CUSTOM', or 'PERCENTAGE'
 * @param {string} expenseDate 
 * @param {Array<{ userId: number, shareAmount: number, sharePercentage: number|null }>} participants 
 * @returns {Promise<object>} Created expense object with ID
 */
const createExpense = async (
  groupId,
  title,
  amount,
  paidBy,
  splitMethod,
  expenseDate,
  participants
) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into `expenses`
    const insertExpenseQuery = `
      INSERT INTO expenses (group_id, title, amount, paid_by, split_method, expense_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [expenseResult] = await connection.execute(insertExpenseQuery, [
      groupId,
      title,
      amount,
      paidBy,
      splitMethod,
      expenseDate,
    ]);
    const expenseId = expenseResult.insertId;

    // 2. Insert into `expense_participants`
    const insertParticipantQuery = `
      INSERT INTO expense_participants (expense_id, user_id, share_amount, share_percentage)
      VALUES (?, ?, ?, ?)
    `;

    for (const participant of participants) {
      await connection.execute(insertParticipantQuery, [
        expenseId,
        participant.userId,
        participant.shareAmount,
        participant.sharePercentage || null,
      ]);
    }

    await connection.commit();

    return {
      id: expenseId,
      group_id: groupId,
      title,
      amount,
      paid_by: paidBy,
      split_method: splitMethod,
      expense_date: expenseDate,
      participants,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Retrieves all expenses for a group with payer details and participant counts.
 * @param {number} groupId 
 * @returns {Promise<Array>}
 */
const getGroupExpenses = async (groupId) => {
  const query = `
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
      u.email AS payer_email,
      (SELECT COUNT(*) FROM expense_participants ep WHERE ep.expense_id = e.id) AS participant_count
    FROM expenses e
    INNER JOIN users u ON e.paid_by = u.id
    WHERE e.group_id = ?
    ORDER BY e.expense_date DESC, e.created_at DESC
  `;
  const [rows] = await pool.execute(query, [groupId]);
  return rows;
};

/**
 * Retrieves a single expense with full participant breakdown.
 * @param {number} expenseId 
 * @returns {Promise<object|null>}
 */
const getExpenseById = async (expenseId) => {
  const expenseQuery = `
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
      u.email AS payer_email,
      g.name AS group_name,
      g.created_by AS group_creator_id
    FROM expenses e
    INNER JOIN users u ON e.paid_by = u.id
    INNER JOIN \`groups\` g ON e.group_id = g.id
    WHERE e.id = ?
    LIMIT 1
  `;
  const [expenseRows] = await pool.execute(expenseQuery, [expenseId]);
  if (expenseRows.length === 0) return null;

  const expense = expenseRows[0];

  const participantsQuery = `
    SELECT 
      ep.id AS participant_record_id,
      ep.user_id,
      ep.share_amount,
      ep.share_percentage,
      u.name,
      u.email
    FROM expense_participants ep
    INNER JOIN users u ON ep.user_id = u.id
    WHERE ep.expense_id = ?
    ORDER BY ep.share_amount DESC
  `;
  const [participantRows] = await pool.execute(participantsQuery, [expenseId]);

  return {
    ...expense,
    participants: participantRows,
  };
};

/**
 * Deletes an expense by ID.
 * @param {number} expenseId 
 * @returns {Promise<boolean>}
 */
const deleteExpense = async (expenseId) => {
  const query = `
    DELETE FROM expenses 
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [expenseId]);
  return result.affectedRows > 0;
};

module.exports = {
  createExpense,
  getGroupExpenses,
  getExpenseById,
  deleteExpense,
};
