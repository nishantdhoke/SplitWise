/**
 * API Service Layer
 * 
 * Provides a clean abstraction over the browser's native `fetch` API.
 * Features:
 * - Automatically attaches Authorization token if saved in localStorage
 * - Centralizes JSON parsing and error formatting
 * - Easy to test, maintain, and extend
 */

const BASE_URL = '/api';

/**
 * Core HTTP request handler
 * @param {string} endpoint - API path (e.g. '/health' or '/groups')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('fairshare_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------------
// System Health
// -------------------------------------------------------------------
export async function checkHealth() {
  return apiRequest('/health');
}

export async function searchRegisteredUsers(query = '') {
  return apiRequest(`/auth/search?q=${encodeURIComponent(query)}`);
}

// -------------------------------------------------------------------
// Groups & Members (Phase 3)
// -------------------------------------------------------------------
export async function getGroups() {
  return apiRequest('/groups');
}

export async function createGroup(name) {
  return apiRequest('/groups', {
    method: 'POST',
    body: { name },
  });
}

export async function getGroupDetails(groupId) {
  return apiRequest(`/groups/${groupId}`);
}

export async function addMember(groupId, email) {
  return apiRequest(`/groups/${groupId}/members`, {
    method: 'POST',
    body: { email },
  });
}

export async function removeMember(groupId, userId) {
  return apiRequest(`/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
  });
}

export async function deleteGroup(groupId) {
  return apiRequest(`/groups/${groupId}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------------
// Expenses (Phase 4)
// -------------------------------------------------------------------
export async function getGroupExpenses(groupId) {
  return apiRequest(`/groups/${groupId}/expenses`);
}

export async function createExpense(groupId, expenseData) {
  return apiRequest(`/groups/${groupId}/expenses`, {
    method: 'POST',
    body: expenseData,
  });
}

export async function getExpenseDetails(expenseId) {
  return apiRequest(`/expenses/${expenseId}`);
}

export async function deleteExpense(expenseId) {
  return apiRequest(`/expenses/${expenseId}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------------
// Balances & Settlements (Phase 5 & 6)
// -------------------------------------------------------------------
export async function getGroupBalances(groupId) {
  return apiRequest(`/groups/${groupId}/balances`);
}

export async function recordSettlement(groupId, settlementData) {
  return apiRequest(`/groups/${groupId}/settlements`, {
    method: 'POST',
    body: settlementData,
  });
}

export async function getGroupSettlements(groupId) {
  return apiRequest(`/groups/${groupId}/settlements`);
}

// -------------------------------------------------------------------
// Dashboard & Activity (Phase 7)
// -------------------------------------------------------------------
export async function getDashboard() {
  return apiRequest('/dashboard');
}

export async function getGroupActivity(groupId) {
  return apiRequest(`/groups/${groupId}/activity`);
}
