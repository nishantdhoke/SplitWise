const { pool } = require('../config/db');

/**
 * Activity Controller
 * 
 * Aggregates a clean chronological activity feed for a group:
 * - Expenses added ("Ronak added Pizza expense of ₹1200")
 * - Settlements recorded ("Rahul settled ₹300 with Ronak")
 * - New members added ("Amit joined the group")
 */
const getGroupActivity = async (req, res, next) => {
  try {
    const groupId = req.group.id;

    // 1. Fetch expenses
    const [expenses] = await pool.execute(`
      SELECT 
        e.id,
        e.title,
        e.amount,
        e.created_at,
        u.name AS payer_name
      FROM expenses e
      INNER JOIN users u ON e.paid_by = u.id
      WHERE e.group_id = ?
    `, [groupId]);

    // 2. Fetch settlements
    const [settlements] = await pool.execute(`
      SELECT 
        s.id,
        s.amount,
        s.settled_at AS created_at,
        p.name AS payer_name,
        r.name AS receiver_name
      FROM settlements s
      INNER JOIN users p ON s.payer_id = p.id
      INNER JOIN users r ON s.receiver_id = r.id
      WHERE s.group_id = ?
    `, [groupId]);

    // 3. Fetch joined members
    const [members] = await pool.execute(`
      SELECT 
        gm.joined_at AS created_at,
        u.name AS member_name
      FROM group_members gm
      INNER JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = ?
    `, [groupId]);

    // Map each into unified activity objects
    const activities = [];

    expenses.forEach((e) => {
      activities.push({
        id: `exp-${e.id}`,
        type: 'EXPENSE',
        text: `${e.payer_name} added "${e.title}" expense of ₹${Number(e.amount).toFixed(2)}`,
        amount: Number(e.amount),
        actor: e.payer_name,
        timestamp: e.created_at,
      });
    });

    settlements.forEach((s) => {
      activities.push({
        id: `settle-${s.id}`,
        type: 'SETTLEMENT',
        text: `${s.payer_name} settled ₹${Number(s.amount).toFixed(2)} with ${s.receiver_name}`,
        amount: Number(s.amount),
        actor: s.payer_name,
        timestamp: s.created_at,
      });
    });

    members.forEach((m, idx) => {
      activities.push({
        id: `join-${idx}`,
        type: 'MEMBER_JOIN',
        text: `${m.member_name} joined the group`,
        actor: m.member_name,
        timestamp: m.created_at,
      });
    });

    // Sort descending by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      count: activities.length,
      activities: activities.slice(0, 30),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroupActivity,
};
