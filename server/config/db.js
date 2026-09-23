const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * MySQL Connection Pool Configuration
 * 
 * Why use a connection pool?
 * Instead of creating a new TCP connection to MySQL for every incoming HTTP request
 * (which is slow and resource-heavy), a connection pool maintains a set of reusable
 * open connections. When a query is made, it borrows a connection from the pool and
 * returns it immediately upon completion.
 */
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fairshare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = mysql.createPool(poolConfig);

/**
 * Tests database connectivity.
 * If the database 'fairshare_db' does not exist yet, this helper attempts to create it
 * automatically so that the developer doesn't run into ER_BAD_DB_ERROR during setup.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [Database] Successfully connected to MySQL database '${poolConfig.database}' on port ${poolConfig.port}`);
    connection.release();
    return {
      connected: true,
      database: poolConfig.database,
      host: poolConfig.host,
      port: poolConfig.port,
    };
  } catch (error) {
    // If the database does not exist yet, attempt to auto-create it
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.warn(`⚠️ [Database] Database '${poolConfig.database}' not found. Attempting to create it...`);
      try {
        // Connect to MySQL server without selecting a database
        const rootConnection = await mysql.createConnection({
          host: poolConfig.host,
          port: poolConfig.port,
          user: poolConfig.user,
          password: poolConfig.password,
        });

        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${poolConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConnection.end();
        console.log(`✅ [Database] Created database '${poolConfig.database}' successfully!`);

        // Recreate pool now that database exists
        pool = mysql.createPool(poolConfig);
        return {
          connected: true,
          database: poolConfig.database,
          host: poolConfig.host,
          port: poolConfig.port,
          note: 'Database was created automatically',
        };
      } catch (createErr) {
        console.error(`❌ [Database] Failed to auto-create database '${poolConfig.database}':`, createErr.message);
        return {
          connected: false,
          error: createErr.message,
          code: createErr.code,
        };
      }
    }

    console.error(`❌ [Database] Connection failed (${error.code || 'UNKNOWN'}):`, error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Hint: Check your MySQL username and password in server/.env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('👉 Hint: Make sure the MySQL service is running on your machine.');
    }

    return {
      connected: false,
      error: error.message,
      code: error.code,
    };
  }
};

module.exports = {
  pool,
  testConnection,
};
