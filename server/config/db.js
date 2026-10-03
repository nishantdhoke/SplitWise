const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { createTables } = require('../scripts/initDb');

dotenv.config();
if (!process.env.DB_PASSWORD && !process.env.MYSQL_URL) {
  dotenv.config({ path: require('path').join(__dirname, '../.env') });
}

/**
 * MySQL Connection Pool Configuration
 * 
 * Supports standard environment variables (DB_HOST, DB_USER, etc.)
 * as well as cloud deployment providers like Railway (MYSQL_URL, DATABASE_URL, MYSQLHOST).
 */
const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

let pool;

if (connectionUrl) {
  pool = mysql.createPool({
    uri: connectionUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  const poolConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'fairshare_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  pool = mysql.createPool(poolConfig);
}

/**
 * Tests database connectivity and verifies tables on startup.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [Database] Successfully connected to MySQL database.`);
    
    // Auto-verify or create tables if missing
    try {
      await createTables(connection);
    } catch (tblErr) {
      console.warn(`⚠️ [Database] Notice while verifying schema tables:`, tblErr.message);
    }

    connection.release();
    return {
      connected: true,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'fairshare_db',
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'connected',
      port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    };
  } catch (error) {
    // If the database does not exist yet and we have individual parameters, attempt to create it
    if (error.code === 'ER_BAD_DB_ERROR' && !connectionUrl) {
      const targetDb = process.env.DB_NAME || process.env.MYSQLDATABASE || 'fairshare_db';
      console.warn(`⚠️ [Database] Database '${targetDb}' not found. Attempting to create it...`);
      try {
        const rootConnection = await mysql.createConnection({
          host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
          port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
          user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
          password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
        });

        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${targetDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConnection.end();
        console.log(`✅ [Database] Created database '${targetDb}' successfully!`);

        // Reconnect pool
        pool = mysql.createPool({
          host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
          port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
          user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
          password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
          database: targetDb,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });

        const conn = await pool.getConnection();
        await createTables(conn);
        conn.release();

        return {
          connected: true,
          database: targetDb,
          note: 'Database and tables were created automatically',
        };
      } catch (createErr) {
        console.error(`❌ [Database] Failed to auto-create database '${targetDb}':`, createErr.message);
        return {
          connected: false,
          error: createErr.message,
          code: createErr.code,
        };
      }
    }

    console.error(`❌ [Database] Connection failed (${error.code || 'UNKNOWN'}):`, error.message);
    return {
      connected: false,
      error: error.message,
      code: error.code,
    };
  }
};

module.exports = {
  get pool() {
    return pool;
  },
  testConnection,
};
