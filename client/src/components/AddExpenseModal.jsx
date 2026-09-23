import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createExpense } from '../services/api';
import { X, Receipt, AlertCircle, CheckCircle2, IndianRupee, Percent } from 'lucide-react';

export default function AddExpenseModal({ groupId, members = [], isOpen, onClose, onExpenseAdded }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(user?.id || '');
  const [splitMethod, setSplitMethod] = useState('EQUAL');

  // Participants selection
  // For EQUAL: Set of userIds
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  // For CUSTOM: { [userId]: amount }
  const [customAmounts, setCustomAmounts] = useState({});
  // For PERCENTAGE: { [userId]: percentage }
  const [customPercentages, setCustomPercentages] = useState({});

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize participants to all members when modal opens or members change
  useEffect(() => {
    if (members.length > 0) {
      const allIds = members.map((m) => m.id);
      setSelectedUserIds(allIds);
      if (!paidBy || !allIds.includes(Number(paidBy))) {
        setPaidBy(user?.id || allIds[0]);
      }
    }
  }, [members, isOpen, user?.id]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  // Helpers for live split validation
  const toggleParticipant = (userId) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length === 1) {
        setError('At least one participant must be selected.');
        return;
      }
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
    setError('');
  };

  const selectAll = () => {
    setSelectedUserIds(members.map((m) => m.id));
    setError('');
  };

  // Calculations for Custom Amount
  const customSum = selectedUserIds.reduce((sum, id) => {
    const val = parseFloat(customAmounts[id]) || 0;
    return sum + val;
  }, 0);
  const customDiff = parseFloat((numericAmount - customSum).toFixed(2));

  // Calculations for Percentage
  const percentageSum = selectedUserIds.reduce((sum, id) => {
    const val = parseFloat(customPercentages[id]) || 0;
    return sum + val;
  }, 0);
  const percentageDiff = parseFloat((100 - percentageSum).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title for the expense.');
      return;
    }

    if (numericAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (selectedUserIds.length === 0) {
      setError('Please select at least one participant.');
      return;
    }

    let payloadParticipants = [];

    if (splitMethod === 'EQUAL') {
      payloadParticipants = selectedUserIds;
    } else if (splitMethod === 'CUSTOM') {
      if (Math.abs(customDiff) > 0.01) {
        setError(`Custom amounts must equal exactly ₹${numericAmount} (Difference: ₹${Math.abs(customDiff)})`);
        return;
      }
      payloadParticipants = selectedUserIds.map((id) => ({
        userId: id,
        amount: parseFloat(customAmounts[id]) || 0,
      }));
    } else if (splitMethod === 'PERCENTAGE') {
      if (Math.abs(percentageDiff) > 0.01) {
        setError(`Percentages must sum to exactly 100% (Current sum: ${percentageSum}%)`);
        return;
      }
      payloadParticipants = selectedUserIds.map((id) => ({
        userId: id,
        percentage: parseFloat(customPercentages[id]) || 0,
      }));
    }

    try {
      setIsSubmitting(true);
      await createExpense(groupId, {
        title: title.trim(),
        amount: numericAmount,
        paid_by: Number(paidBy),
        split_method: splitMethod,
        expense_date: expenseDate,
        participants: payloadParticipants,
      });

      // Reset form
      setTitle('');
      setAmount('');
      setCustomAmounts({});
      setCustomPercentages({});
      onExpenseAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Add Expense</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Split a shared bill with your group</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.3rem', borderRadius: '50%', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title & Amount Grid */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="expense-title">Description / Title</label>
              <input
                id="expense-title"
                type="text"
                className="form-input"
                placeholder="e.g. Pizza, Cab, Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">Amount (₹)</label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="1"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Paid By & Date Grid */}
          <div className="grid-2 mt-2">
            <div className="form-group">
              <label className="form-label" htmlFor="expense-payer">Paid By</label>
              <select
                id="expense-payer"
                className="form-input"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.id === user?.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-date">Expense Date</label>
              <input
                id="expense-date"
                type="date"
                className="form-input"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Split Method Selector */}
          <div style={{ marginTop: '1.25rem' }}>
            <label className="form-label">Split Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                className={`btn ${splitMethod === 'EQUAL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem', fontSize: '0.85rem' }}
                onClick={() => setSplitMethod('EQUAL')}
              >
                = Equal
              </button>
              <button
                type="button"
                className={`btn ${splitMethod === 'CUSTOM' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem', fontSize: '0.85rem' }}
                onClick={() => setSplitMethod('CUSTOM')}
              >
                ₹ Exact Amount
              </button>
              <button
                type="button"
                className={`btn ${splitMethod === 'PERCENTAGE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem', fontSize: '0.85rem' }}
                onClick={() => setSplitMethod('PERCENTAGE')}
              >
                % Percentage
              </button>
            </div>
          </div>

          {/* Participants Split Area */}
          <div style={{ marginTop: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', background: '#f8fafc' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Participants ({selectedUserIds.length})
              </span>
              <button
                type="button"
                onClick={selectAll}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                Select All
              </button>
            </div>

            {/* EQUAL SPLIT VIEW */}
            {splitMethod === 'EQUAL' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {members.map((m) => {
                    const isSelected = selectedUserIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className="flex-between"
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: isSelected ? '#ffffff' : 'transparent',
                          border: isSelected ? '1px solid #c7d2fe' : '1px solid transparent',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleParticipant(m.id)}
                          />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {m.name} {m.id === user?.id ? '(You)' : ''}
                          </span>
                        </div>
                        {isSelected && numericAmount > 0 && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                            ₹{(numericAmount / selectedUserIds.length).toFixed(2)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CUSTOM AMOUNT VIEW */}
            {splitMethod === 'CUSTOM' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {members.map((m) => (
                    <div key={m.id} className="flex-between" style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {m.name} {m.id === user?.id ? '(You)' : ''}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '120px' }}>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', textAlign: 'right' }}
                          placeholder="0.00"
                          value={customAmounts[m.id] || ''}
                          onChange={(e) => {
                            setCustomAmounts({ ...customAmounts, [m.id]: e.target.value });
                            if (!selectedUserIds.includes(m.id)) {
                              setSelectedUserIds([...selectedUserIds, m.id]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {numericAmount > 0 && (
                  <div className="flex-between mt-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Sum: ₹{customSum.toFixed(2)} / ₹{numericAmount.toFixed(2)}</span>
                    <span style={{ color: customDiff === 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {customDiff === 0 ? '✓ Exact Match' : `Remaining: ₹${customDiff}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* PERCENTAGE SPLIT VIEW */}
            {splitMethod === 'PERCENTAGE' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {members.map((m) => (
                    <div key={m.id} className="flex-between" style={{ background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {m.name} {m.id === user?.id ? '(You)' : ''}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '110px' }}>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', textAlign: 'right' }}
                          placeholder="0"
                          value={customPercentages[m.id] || ''}
                          onChange={(e) => {
                            setCustomPercentages({ ...customPercentages, [m.id]: e.target.value });
                            if (!selectedUserIds.includes(m.id)) {
                              setSelectedUserIds([...selectedUserIds, m.id]);
                            }
                          }}
                        />
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-between mt-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Total: {percentageSum.toFixed(1)}% / 100%</span>
                  <span style={{ color: percentageDiff === 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {percentageDiff === 0 ? '✓ Exact Match' : `Remaining: ${percentageDiff}%`}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '0.9rem', height: '0.9rem', borderWidth: '2px' }}></span>
                  Recording...
                </>
              ) : (
                'Save Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
