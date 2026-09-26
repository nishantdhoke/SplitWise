const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const initDatabase = async () => {
  console.log('🔄 Initializing FairShare Database...');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  const dbName = process.env.DB_NAME || 'fairshare_db';

  try {
    // 1. Connect to MySQL server without database
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server.');

    // 2. Create database if it does not exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅ Database '${dbName}' ready.`);

    // Switch to fairshare_db
    await connection.changeUser({ database: dbName });

    // 3. Create 'users' table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table `users` created or verified.');

    // 4. Create 'groups' table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`created_by\` INT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Table `groups` created or verified.');

    // 5. Create 'group_members' table
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
    console.log('✅ Table `group_members` created or verified.');

    // 6. Create 'expenses' table
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
    console.log('✅ Table `expenses` created or verified.');

    // 7. Create 'expense_participants' table
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
    console.log('✅ Table `expense_participants` created or verified.');

    // 8. Create 'settlements' table
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
    console.log('✅ Table `settlements` created or verified.');

    // 9. Create 'messages' table for group chatting
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
    console.log('✅ Table `messages` created or verified.');

    await connection.end();
    console.log('🎉 FairShare database tables successfully initialized!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
};

initDatabase();
