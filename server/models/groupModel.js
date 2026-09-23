const { pool } = require('../config/db');

/**
 * Group Model
 * 
 * Handles all database operations for `groups` and `group_members` tables.
 * Utilizes parameterized queries and MySQL transactions where multiple table
 * operations must succeed together atomically.
 */

/**
 * Creates a new group and automatically enrolls the creator as a group member.
 * Runs inside a database transaction to ensure atomicity.
 * @param {string} name 
 * @param {number} createdBy 
 * @returns {Promise<object>}
 */
const createGroup = async (name, createdBy) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert group record
    const insertGroupQuery = `
      INSERT INTO \`groups\` (name, created_by)
      VALUES (?, ?)
    `;
    const [groupResult] = await connection.execute(insertGroupQuery, [name, createdBy]);
    const groupId = groupResult.insertId;

    // 2. Automatically add creator to group_members
    const insertMemberQuery = `
      INSERT INTO \`group_members\` (group_id, user_id)
      VALUES (?, ?)
    `;
    await connection.execute(insertMemberQuery, [groupId, createdBy]);

    await connection.commit();

    return {
      id: groupId,
      name,
      created_by: createdBy,
      created_at: new Date(),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Retrieves all groups where the specified user is a member.
 * Includes member count and creator's name.
 * @param {number} userId 
 * @returns {Promise<Array>}
 */
const findUserGroups = async (userId) => {
  const query = `
    SELECT 
      g.id,
      g.name,
      g.created_by,
      g.created_at,
      u.name AS creator_name,
      (SELECT COUNT(*) FROM group_members gm2 WHERE gm2.group_id = g.id) AS member_count
    FROM \`groups\` g
    INNER JOIN group_members gm ON g.id = gm.group_id
    INNER JOIN users u ON g.created_by = u.id
    WHERE gm.user_id = ?
    ORDER BY g.created_at DESC
  `;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

/**
 * Retrieves a single group by ID with creator details.
 * @param {number} groupId 
 * @returns {Promise<object|null>}
 */
const findGroupById = async (groupId) => {
  const query = `
    SELECT 
      g.id,
      g.name,
      g.created_by,
      g.created_at,
      u.name AS creator_name,
      u.email AS creator_email
    FROM \`groups\` g
    INNER JOIN users u ON g.created_by = u.id
    WHERE g.id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [groupId]);
  return rows[0] || null;
};

/**
 * Retrieves all members of a specific group.
 * @param {number} groupId 
 * @returns {Promise<Array>}
 */
const getGroupMembers = async (groupId) => {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      gm.joined_at
    FROM group_members gm
    INNER JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = ?
    ORDER BY gm.joined_at ASC
  `;
  const [rows] = await pool.execute(query, [groupId]);
  return rows;
};

/**
 * Checks if a user is an active member of a group.
 * @param {number} groupId 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
const isGroupMember = async (groupId, userId) => {
  const query = `
    SELECT 1 
    FROM group_members 
    WHERE group_id = ? AND user_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [groupId, userId]);
  return rows.length > 0;
};

/**
 * Adds a registered user to a group.
 * @param {number} groupId 
 * @param {number} userId 
 * @returns {Promise<object>}
 */
const addMemberToGroup = async (groupId, userId) => {
  const query = `
    INSERT INTO group_members (group_id, user_id)
    VALUES (?, ?)
  `;
  await pool.execute(query, [groupId, userId]);
  return { groupId, userId, joined_at: new Date() };
};

/**
 * Removes a member from a group.
 * @param {number} groupId 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
const removeMemberFromGroup = async (groupId, userId) => {
  const query = `
    DELETE FROM group_members 
    WHERE group_id = ? AND user_id = ?
  `;
  const [result] = await pool.execute(query, [groupId, userId]);
  return result.affectedRows > 0;
};

/**
 * Deletes a group entirely.
 * Foreign keys with ON DELETE CASCADE will automatically remove associated group_members.
 * @param {number} groupId 
 * @returns {Promise<boolean>}
 */
const deleteGroup = async (groupId) => {
  const query = `
    DELETE FROM \`groups\` 
    WHERE id = ?
  `;
  const [result] = await pool.execute(query, [groupId]);
  return result.affectedRows > 0;
};

module.exports = {
  createGroup,
  findUserGroups,
  findGroupById,
  getGroupMembers,
  isGroupMember,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
};
