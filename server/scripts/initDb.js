const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
if (!process.env.DB_PASSWORD && !process.env.MYSQL_URL) {
  dotenv.config({ path: require('path').join(__dirname, '../.env') });
}

const createTables = async (connection) => {
  // 1. Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(100) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL UNIQUE,
      \`password_hash\` VARCHAR(255) NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `users` verified.');

  // 2. Groups table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`groups\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`created_by\` INT NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `groups` verified.');

  // 3. Group Members table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`group_members\` (
      \`group_id\` INT NOT NULL,
      \`user_id\` INT NOT NULL,
      \`joined_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`group_id\`, \`user_id\`),
      FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `group_members` verified.');

  // 4. Expenses table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`expenses\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`group_id\` INT NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`amount\` DECIMAL(12, 2) NOT NULL,
      \`paid_by\` INT NOT NULL,
      \`split_method\` ENUM('EQUAL', 'CUSTOM', 'PERCENTAGE') NOT NULL DEFAULT 'EQUAL',
      \`expense_date\` DATE NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`paid_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `expenses` verified.');

  // 5. Expense Participants table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`expense_participants\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`expense_id\` INT NOT NULL,
      \`user_id\` INT NOT NULL,
      \`share_amount\` DECIMAL(12, 2) NOT NULL,
      \`share_percentage\` DECIMAL(5, 2) NULL,
      UNIQUE KEY \`uniq_expense_user\` (\`expense_id\`, \`user_id\`),
      FOREIGN KEY (\`expense_id\`) REFERENCES \`expenses\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `expense_participants` verified.');

  // 6. Settlements table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`settlements\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`group_id\` INT NOT NULL,
      \`payer_id\` INT NOT NULL,
      \`receiver_id\` INT NOT NULL,
      \`amount\` DECIMAL(12, 2) NOT NULL,
      \`settled_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`payer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `settlements` verified.');

  // 7. Messages table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`messages\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`group_id\` INT NOT NULL,
      \`user_id\` INT NOT NULL,
      \`message\` TEXT NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_group_created\` (\`group_id\`, \`created_at\`),
      FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ Table `messages` verified.');
};

const initDatabase = async () => {
  console.log('🔄 Initializing Fair Split Database schema...');

  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

  try {
    let connection;

    if (connectionUrl) {
      console.log('📡 Connecting via connection URL...');
      connection = await mysql.createConnection(connectionUrl);
    } else {
      const config = {
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      };
      const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'fairshare_db';

      console.log(`📡 Connecting to MySQL server at ${config.host}:${config.port}...`);
      connection = await mysql.createConnection(config);
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
      await connection.changeUser({ database: dbName });
    }

    await createTables(connection);
    await connection.end();
    console.log('🎉 Fair Split database tables successfully initialized!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
};

// If run directly from command line
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = {
  initDatabase,
  createTables,
};
