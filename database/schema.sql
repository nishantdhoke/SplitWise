-- ===================================================================
-- FairShare Database Schema (MySQL 8.0+)
-- ===================================================================
-- This schema represents the complete relational model for FairShare.
-- Detailed table creation scripts and initial migrations will be 
-- officially executed and verified in Phase 2.
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `fairshare_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `fairshare_db`;

-- 1. Users Table
-- Stores user account info with securely hashed passwords
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Groups Table
-- Expense splitting groups (e.g. Goa Trip, Flatmates)
CREATE TABLE IF NOT EXISTS `groups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Group Members Table
-- Junction table representing user membership within groups
CREATE TABLE IF NOT EXISTS `group_members` (
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`, `user_id`),
  FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Expenses Table
-- Represents an expense paid by a user within a group
-- Amount is stored in integer paise (e.g. ₹1200.00 -> 120000) or DECIMAL(12,2)
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `paid_by` INT NOT NULL,
  `split_method` ENUM('EQUAL', 'CUSTOM', 'PERCENTAGE') NOT NULL DEFAULT 'EQUAL',
  `expense_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`paid_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Expense Participants Table
-- Junction table mapping how much each participant owes for a given expense
CREATE TABLE IF NOT EXISTS `expense_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `expense_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `share_amount` DECIMAL(12, 2) NOT NULL,
  `share_percentage` DECIMAL(5, 2) NULL,
  UNIQUE KEY `uniq_expense_user` (`expense_id`, `user_id`),
  FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Settlements Table
-- Records when a debtor repays a creditor (e.g., Rahul pays Ronak ₹300)
CREATE TABLE IF NOT EXISTS `settlements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `payer_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `settled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_c;

SHOW TABLES FROM fairshare_db;



