const { pool } = require('../config/db');

/**
 * User Model
 * 
 * Contains all direct MySQL queries for the `users` table.
 * All queries strictly use parameterized statements (`?`) to prevent SQL injection.
 */

/**
 * Creates a new user in the database.
 * @param {string} name 
 * @param {string} email 
 * @param {string} passwordHash 
 * @returns {Promise<object>} The created user (excluding password_hash)
 */
const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [name, email, passwordHash]);

  return {
    id: result.insertId,
    name,
    email,
    created_at: new Date(),
  };
};

/**
 * Finds a user by email, including the password_hash for authentication.
 * @param {string} email 
 * @returns {Promise<object|null>}
 */
const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [email.toLowerCase().trim()]);
  return rows[0] || null;
};

/**
 * Finds a user by ID, intentionally omitting password_hash for security.
 * @param {number} id 
 * @returns {Promise<object|null>}
 */
const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

/**
 * Searches users by email or name for group member invitations.
 * @param {string} queryStr 
 * @param {number} excludeUserId 
 * @returns {Promise<Array>}
 */
const searchUsers = async (queryStr = '', excludeUserId) => {
  const trimmed = (queryStr || '').trim();
  if (!trimmed) {
    const query = `
      SELECT id, name, email
      FROM users
      WHERE id != ?
      ORDER BY id DESC
      LIMIT 10
    `;
    const [rows] = await pool.execute(query, [excludeUserId]);
    return rows;
  }
  const searchPattern = `%${trimmed}%`;
  const query = `
    SELECT id, name, email
    FROM users
    WHERE (email LIKE ? OR name LIKE ?) AND id != ?
    ORDER BY name ASC
    LIMIT 10
  `;
  const [rows] = await pool.execute(query, [searchPattern, searchPattern, excludeUserId]);
  return rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  searchUsers,
};
