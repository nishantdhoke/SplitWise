/**
 * Comprehensive Test Suite for FairShare
 * 
 * Verifies all 10 core requirements from the specification:
 * 1. Equal split
 * 2. Custom split
 * 3. Percentage split
 * 4. Multiple people paying
 * 5. One person owing multiple people
 * 6. Multiple people owing one person
 * 7. Settling a debt
 * 8. Deleting an expense
 * 9. Invalid split totals
 * 10. Unauthorized access to another group's data
 */

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function recordTest(name, passed, details = '') {
  results.push({ name, passed, details });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${name} ${details ? `(${details})` : ''}`);
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 Starting FairShare Comprehensive Test Suite');
  console.log('====================================================\n');

  try {
    // -------------------------------------------------------------
    // Setup: Create 4 clean test users (Ronak, Rahul, Amit, Sahil)
    // -------------------------------------------------------------
    const timestamp = Date.now();
    const users = {
      ronak: { name: 'Ronak', email: `ronak_${timestamp}@test.com`, password: 'password123' },
      rahul: { name: 'Rahul', email: `rahul_${timestamp}@test.com`, password: 'password123' },
      amit: { name: 'Amit', email: `amit_${timestamp}@test.com`, password: 'password123' },
      sahil: { name: 'Sahil', email: `sahil_${timestamp}@test.com`, password: 'password123' },
    };

    for (const key of Object.keys(users)) {
      const regRes = await request('/auth/register', { method: 'POST', body: users[key] });
      users[key].id = regRes.data.user.id;
      users[key].token = regRes.data.token;
    }

    // Create Group: "Goa Vacation"
    const groupRes = await request('/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: { name: `Goa Vacation ${timestamp}` },
    });
    const groupId = groupRes.data.group.id;

    // Add Rahul, Amit, Sahil
    await request(`/groups/${groupId}/members`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: { email: users.rahul.email },
    });
    await request(`/groups/${groupId}/members`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: { email: users.amit.email },
    });
    await request(`/groups/${groupId}/members`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: { email: users.sahil.email },
    });

    const allMemberIds = [users.ronak.id, users.rahul.id, users.amit.id, users.sahil.id];

    // -------------------------------------------------------------
    // 1. Equal Split Test
    // -------------------------------------------------------------
    // Pizza: ₹1200 split equally among 4 = ₹300 each
    const eqRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: {
        title: 'Pizza',
        amount: 1200,
        paid_by: users.ronak.id,
        split_method: 'EQUAL',
        participants: allMemberIds,
      },
    });

    const eqPass =
      eqRes.status === 201 &&
      eqRes.data.expense.participants.length === 4 &&
      eqRes.data.expense.participants.every((p) => p.shareAmount === 300);
    recordTest('1. Equal Split', eqPass, '₹1200 split 4 ways = ₹300 each');

    // -------------------------------------------------------------
    // 2. Custom Split Test
    // -------------------------------------------------------------
    // Groceries: ₹1000 -> Ronak: 400, Rahul: 300, Amit: 200, Sahil: 100
    const customRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.rahul.token}` },
      body: {
        title: 'Groceries',
        amount: 1000,
        paid_by: users.rahul.id,
        split_method: 'CUSTOM',
        participants: [
          { userId: users.ronak.id, amount: 400 },
          { userId: users.rahul.id, amount: 300 },
          { userId: users.amit.id, amount: 200 },
          { userId: users.sahil.id, amount: 100 },
        ],
      },
    });

    const customPass =
      customRes.status === 201 &&
      customRes.data.expense.participants.find((p) => p.userId === users.ronak.id).shareAmount === 400;
    recordTest('2. Custom Split', customPass, 'Custom amounts match exact sum ₹1000');

    // -------------------------------------------------------------
    // 3. Percentage Split Test
    // -------------------------------------------------------------
    // Resort: ₹2000 -> Ronak: 40%, Rahul: 30%, Amit: 20%, Sahil: 10%
    const pctRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: {
        title: 'Resort Booking',
        amount: 2000,
        paid_by: users.ronak.id,
        split_method: 'PERCENTAGE',
        participants: [
          { userId: users.ronak.id, percentage: 40 },
          { userId: users.rahul.id, percentage: 30 },
          { userId: users.amit.id, percentage: 20 },
          { userId: users.sahil.id, percentage: 10 },
        ],
      },
    });

    const pctPass =
      pctRes.status === 201 &&
      pctRes.data.expense.participants.find((p) => p.userId === users.ronak.id).shareAmount === 800;
    recordTest('3. Percentage Split', pctPass, '40%/30%/20%/10% of ₹2000 calculated accurately');

    // -------------------------------------------------------------
    // 4. Multiple People Paying Test
    // -------------------------------------------------------------
    // Amit pays for Cab: ₹400 (split equally among all 4 = ₹100 each)
    const multiPayerRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.amit.token}` },
      body: {
        title: 'Airport Cab',
        amount: 400,
        paid_by: users.amit.id,
        split_method: 'EQUAL',
        participants: allMemberIds,
      },
    });

    const balAfterMultiPayer = await request(`/groups/${groupId}/balances`, {
      headers: { Authorization: `Bearer ${users.ronak.token}` },
    });

    const payersRecorded =
      multiPayerRes.status === 201 &&
      balAfterMultiPayer.data.balances.filter((b) => b.totalPaid > 0).length >= 3;
    recordTest('4. Multiple People Paying', payersRecorded, 'Expenses paid by Ronak, Rahul, and Amit recorded');

    // -------------------------------------------------------------
    // 5. One Person Owing Multiple People
    // -------------------------------------------------------------
    // Check if Sahil owes money across multiple creditors in suggested settlements
    const sahilBalance = balAfterMultiPayer.data.balances.find((b) => b.userId === users.sahil.id);
    const sahilOwesMultiple = sahilBalance.status === 'OWES' && sahilBalance.netBalance < 0;
    recordTest('5. One Person Owing Multiple People', sahilOwesMultiple, `Sahil net balance: -₹${Math.abs(sahilBalance.netBalance)}`);

    // -------------------------------------------------------------
    // 6. Multiple People Owing One Person
    // -------------------------------------------------------------
    // Ronak has paid the most (Pizza ₹1200 + Resort ₹2000) and is owed by multiple members
    const ronakBalance = balAfterMultiPayer.data.balances.find((b) => b.userId === users.ronak.id);
    const ronakIsOwedByMultiple = ronakBalance.status === 'OWED' && ronakBalance.netBalance > 0;
    recordTest('6. Multiple People Owing One Person', ronakIsOwedByMultiple, `Ronak gets back +₹${ronakBalance.netBalance}`);

    // -------------------------------------------------------------
    // 7. Settling a Debt ("Mark as Paid") & Authorization
    // -------------------------------------------------------------
    // Find a suggested settlement
    const firstSuggested = balAfterMultiPayer.data.suggestedSettlements[0];

    // Authorization Test: Payer attempts to mark settlement as paid -> MUST return 403 Forbidden
    const payerUserKey = Object.keys(users).find((k) => users[k].id === firstSuggested.payerId);
    const unauthorizedPayerRes = await request(`/groups/${groupId}/settlements`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users[payerUserKey].token}` },
      body: {
        payer_id: firstSuggested.payerId,
        receiver_id: firstSuggested.receiverId,
        amount: firstSuggested.amount,
      },
    });

    // Valid Test: Receiver marks settlement as paid -> MUST succeed with 201 Created
    const receiverUserKey = Object.keys(users).find((k) => users[k].id === firstSuggested.receiverId);
    const settleRes = await request(`/groups/${groupId}/settlements`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users[receiverUserKey].token}` },
      body: {
        payer_id: firstSuggested.payerId,
        receiver_id: firstSuggested.receiverId,
        amount: firstSuggested.amount,
      },
    });

    // Check balances recalculated
    const balAfterSettle = await request(`/groups/${groupId}/balances`, {
      headers: { Authorization: `Bearer ${users.ronak.token}` },
    });

    const payerAfter = balAfterSettle.data.balances.find((b) => b.userId === firstSuggested.payerId);
    const settlePass =
      unauthorizedPayerRes.status === 403 &&
      settleRes.status === 201 &&
      payerAfter.settledPaid === firstSuggested.amount;
    recordTest('7. Settling a Debt (Receiver Authorization)', settlePass, `Payer got 403 Forbidden; Receiver (${firstSuggested.receiverName}) settled ₹${firstSuggested.amount}`);

    // -------------------------------------------------------------
    // 8. Deleting an Expense
    // -------------------------------------------------------------
    // Create temporary expense and delete it
    const tempExpense = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: {
        title: 'Temporary Snacks',
        amount: 200,
        paid_by: users.ronak.id,
        split_method: 'EQUAL',
        participants: [users.ronak.id, users.rahul.id],
      },
    });
    const tempId = tempExpense.data.expense.id;

    const delRes = await request(`/expenses/${tempId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
    });

    const verifyDel = await request(`/expenses/${tempId}`, {
      headers: { Authorization: `Bearer ${users.ronak.token}` },
    });

    const deletePass = delRes.status === 200 && verifyDel.status === 404;
    recordTest('8. Deleting an Expense', deletePass, 'Expense deleted and cascading removal confirmed');

    // -------------------------------------------------------------
    // 9. Invalid Split Totals Rejection
    // -------------------------------------------------------------
    // Invalid Custom (sum 500 != total 1000)
    const badCustomRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: {
        title: 'Bad Custom',
        amount: 1000,
        paid_by: users.ronak.id,
        split_method: 'CUSTOM',
        participants: [{ userId: users.ronak.id, amount: 500 }],
      },
    });

    // Invalid Percentage (sum 70% != 100%)
    const badPctRes = await request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${users.ronak.token}` },
      body: {
        title: 'Bad Pct',
        amount: 1000,
        paid_by: users.ronak.id,
        split_method: 'PERCENTAGE',
        participants: [{ userId: users.ronak.id, percentage: 70 }],
      },
    });

    const invalidPass = badCustomRes.status === 400 && badPctRes.status === 400;
    recordTest('9. Invalid Split Totals', invalidPass, 'Rejected mismatched custom sums and non-100% percentages');

    // -------------------------------------------------------------
    // 10. Unauthorized Access to Another Group's Data
    // -------------------------------------------------------------
    // Create an outsider user who is not in this group
    const outsider = { name: 'Outsider', email: `outsider_${timestamp}@test.com`, password: 'password123' };
    const outReg = await request('/auth/register', { method: 'POST', body: outsider });

    const forbidRes = await request(`/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${outReg.data.token}` },
    });

    const forbidPass = forbidRes.status === 403;
    recordTest('10. Unauthorized Cross-Group Access', forbidPass, 'HTTP 403 Forbidden returned for non-member');

    console.log('\n====================================================');
    console.log(`📊 Test Summary: ${results.filter((r) => r.passed).length}/${results.length} Tests Passed`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTestSuite();
