const { pool } = require('../config/db');
const { getGroupMembers } = require('../models/groupModel');
const { toPaise, toRupees } = require('./splitService');

/**
 * Balance & Settlement Simplification Service
 * 
 * Responsible for authoritative balance calculations and debt simplification:
 * 1. Computes exact net balance for each member:
 *    Net Balance = (Expenses Paid + Settlements Paid) - (Expense Shares Owed + Settlements Received)
 * 2. Uses a greedy two-pointer algorithm to simplify debts and minimize the number of repayments.
 */

/**
 * Calculates net balances for all members of a group.
 * @param {number} groupId 
 * @returns {Promise<Array<object>>}
 */
const calculateGroupBalances = async (groupId) => {
  // 1. Get all group members
  const members = await getGroupMembers(groupId);
  if (members.length === 0) return [];

  // 2. Query total amount paid for expenses by each user in this group
  const [expensesPaidRows] = await pool.execute(`
    SELECT paid_by AS user_id, COALESCE(SUM(amount), 0) AS total_paid
    FROM expenses
    WHERE group_id = ?
    GROUP BY paid_by
  `, [groupId]);

  // 3. Query total expense shares owed by each user in this group
  const [sharesOwedRows] = await pool.execute(`
    SELECT ep.user_id, COALESCE(SUM(ep.share_amount), 0) AS total_owed
    FROM expense_participants ep
    INNER JOIN expenses e ON ep.expense_id = e.id
    WHERE e.group_id = ?
    GROUP BY ep.user_id
  `, [groupId]);

  // 4. Query settlements made (payer paid money to receiver)
  const [settlementsPaidRows] = await pool.execute(`
    SELECT payer_id AS user_id, COALESCE(SUM(amount), 0) AS total_settled_paid
    FROM settlements
    WHERE group_id = ?
    GROUP BY payer_id
  `, [groupId]);

  const [settlementsReceivedRows] = await pool.execute(`
    SELECT receiver_id AS user_id, COALESCE(SUM(amount), 0) AS total_settled_received
    FROM settlements
    WHERE group_id = ?
    GROUP BY receiver_id
  `, [groupId]);

  // Build lookups using integer paise to eliminate floating point issues
  const paidMap = new Map();
  const owedMap = new Map();
  const settledPaidMap = new Map();
  const settledReceivedMap = new Map();

  expensesPaidRows.forEach((r) => paidMap.set(r.user_id, toPaise(r.total_paid)));
  sharesOwedRows.forEach((r) => owedMap.set(r.user_id, toPaise(r.total_owed)));
  settlementsPaidRows.forEach((r) => settledPaidMap.set(r.user_id, toPaise(r.total_settled_paid)));
  settlementsReceivedRows.forEach((r) => settledReceivedMap.set(r.user_id, toPaise(r.total_settled_received)));

  // Compute net balance per member
  return members.map((member) => {
    const expensesPaidPaise = paidMap.get(member.id) || 0;
    const sharesOwedPaise = owedMap.get(member.id) || 0;
    const settledPaidPaise = settledPaidMap.get(member.id) || 0;
    const settledReceivedPaise = settledReceivedMap.get(member.id) || 0;

    // Total Paid = Expenses paid + Settlements paid to others
    const totalOutPaise = expensesPaidPaise + settledPaidPaise;
    // Total Consumed/Received = Expense shares owed + Settlements received from others
    const totalInPaise = sharesOwedPaise + settledReceivedPaise;

    const netPaise = totalOutPaise - totalInPaise;
    const netRupees = toRupees(netPaise);

    let status = 'SETTLED';
    if (netPaise > 0) status = 'OWED'; // This person should receive money
    else if (netPaise < 0) status = 'OWES'; // This person owes money

    return {
      userId: member.id,
      name: member.name,
      email: member.email,
      totalPaid: toRupees(expensesPaidPaise),
      totalOwed: toRupees(sharesOwedPaise),
      settledPaid: toRupees(settledPaidPaise),
      settledReceived: toRupees(settledReceivedPaise),
      netBalance: netRupees,
      netPaise,
      status,
    };
  });
};

/**
 * Greedy Debt Simplification Algorithm ("Who Owes Whom")
 * 
 * Converts net balances into the minimal number of direct repayment transactions.
 * 
 * How it works:
 * 1. Filter members into two groups:
 *    - Debtors: People with net balance < 0 (they owe money)
 *    - Creditors: People with net balance > 0 (they should receive money)
 * 2. In each iteration:
 *    - Match the largest remaining debtor with the largest remaining creditor.
 *    - The transaction amount is min(|debtor.balance|, creditor.balance).
 *    - Settle that amount, update remaining balances, and advance pointers.
 * 3. Continues until all debts are 0.
 * 
 * @param {Array<object>} memberBalances 
 * @returns {Array<object>} List of suggested repayments
 */
const simplifyDebts = (memberBalances) => {
  // Separate into debtors and creditors (cloning paise values to prevent mutation)
  const debtors = [];
  const creditors = [];

  memberBalances.forEach((m) => {
    if (m.netPaise < -0) {
      debtors.push({
        userId: m.userId,
        name: m.name,
        email: m.email,
        amountPaise: Math.abs(m.netPaise),
      });
    } else if (m.netPaise > 0) {
      creditors.push({
        userId: m.userId,
        name: m.name,
        email: m.email,
        amountPaise: m.netPaise,
      });
    }
  });

  // Sort descending by amount for greedy matching
  debtors.sort((a, b) => b.amountPaise - a.amountPaise);
  creditors.sort((a, b) => b.amountPaise - a.amountPaise);

  const transactions = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    // Transaction amount is the minimum of what debtor owes and creditor needs
    const settledPaise = Math.min(debtor.amountPaise, creditor.amountPaise);

    if (settledPaise > 0) {
      transactions.push({
        payerId: debtor.userId,
        payerName: debtor.name,
        receiverId: creditor.userId,
        receiverName: creditor.name,
        amount: toRupees(settledPaise),
      });

      debtor.amountPaise -= settledPaise;
      creditor.amountPaise -= settledPaise;
    }

    if (debtor.amountPaise === 0) dIdx++;
    if (creditor.amountPaise === 0) cIdx++;
  }

  return transactions;
};

module.exports = {
  calculateGroupBalances,
  simplifyDebts,
};
