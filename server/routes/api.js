const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const groupRoutes = require('./groupRoutes');
const expenseRoutes = require('./expenseRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Health & System status check
router.use('/health', healthRoutes);

// User Authentication (Phase 2)
router.use('/auth', authRoutes);

// Groups & Members (Phase 3)
router.use('/groups', groupRoutes);

// Expenses (Phase 4)
router.use('/expenses', expenseRoutes);

// User Dashboard (Phase 7)
router.use('/dashboard', dashboardRoutes);

module.exports = router;
