import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createExpense } from '../services/api';
import { X, Receipt, AlertCircle, CheckCircle2, IndianRupee, Percent, Scale, Check, Calendar } from 'lucide-react';
import MoneyParticleBurst from './MoneyParticleBurst';

export default function AddExpenseModal({ groupId, members = [], isOpen, onClose, onExpenseAdded }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(user?.id || '');
  const [splitMethod, setSplitMethod] = useState('EQUAL');

  // Participants selection
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [customAmounts, setCustomAmounts] = useState({});
  const [customPercentages, setCustomPercentages] = useState({});

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize participants to all members when modal opens
  useEffect(() => {
    if (members.length > 0) {
      const allIds = members.map((m) => m.id);
      setSelectedUserIds(allIds);
      if (!paidBy || !allIds.includes(Number(paidBy))) {
        setPaidBy(user?.id || allIds[0]);
      }
      setIsSuccess(false);
    }
  }, [members, isOpen, user?.id]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  // Toggle participant
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

  // Custom Split math
  const customSum = selectedUserIds.reduce((sum, id) => {
    const val = parseFloat(customAmounts[id]) || 0;
    return sum + val;
  }, 0);
  const customDiff = parseFloat((numericAmount - customSum).toFixed(2));

  // Percentage Split math
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
        user_id: id,
        amount: parseFloat(customAmounts[id]) || 0,
      }));
    } else if (splitMethod === 'PERCENTAGE') {
      if (Math.abs(percentageDiff) > 0.01) {
        setError(`Percentages must sum to exactly 100% (Difference: ${Math.abs(percentageDiff)}%)`);
        return;
      }
      payloadParticipants = selectedUserIds.map((id) => ({
        user_id: id,
        percentage: parseFloat(customPercentages[id]) || 0,
      }));
    }

    const payload = {
      title: title.trim(),
      amount: numericAmount,
      paid_by: Number(paidBy),
      split_method: splitMethod,
      expense_date: expenseDate,
      participants: payloadParticipants,
    };

    try {
      setIsSubmitting(true);
      await createExpense(groupId, payload);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onExpenseAdded();
        onClose();
        // Reset form
        setTitle('');
        setAmount('');
        setCustomAmounts({});
        setCustomPercentages({});
      }, 1100);
    } catch (err) {
      setError(err.message || 'Failed to create expense.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-card" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(124, 92, 252, 0.3)',
              }}
            >
              <Receipt size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add New Expense</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem' }}>Split costs with group members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
            disabled={isSubmitting || isSuccess}
          >
            <X size={16} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', animation: 'fadeIn 300ms ease', position: 'relative' }}>
            <MoneyParticleBurst active={isSuccess} count={20} color="violet" />
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 35px rgba(124, 92, 252, 0.6)',
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <div
              className="finance-number"
              style={{
                fontSize: '2.1rem',
                color: 'var(--primary-hover)',
                marginBottom: '0.4rem',
                textShadow: '0 0 20px rgba(124, 92, 252, 0.5)',
              }}
            >
              +₹{numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F7FF' }}>Expense Recorded!</h3>
            <p className="text-muted mt-1" style={{ fontSize: '0.92rem' }}>
              Group debts and net balances recalculated instantly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div className="alert alert-danger">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Title & Amount Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="expense-title">Expense Description</label>
                <input
                  id="expense-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Seafood Dinner, Resort Stay"
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
                  min="0.01"
                  className="form-input"
                  style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.5px' }}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Paid By & Date Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="paid-by">Paid By</label>
                <select
                  id="paid-by"
                  className="form-input"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  required
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.id === user?.id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expense-date">Date</label>
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

            {/* Split Method Tabs */}
            <div className="form-group">
              <label className="form-label">Split Method</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  background: 'var(--surface-elevated)',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setSplitMethod('EQUAL')}
                  style={{
                    background: splitMethod === 'EQUAL' ? 'var(--primary)' : 'transparent',
                    color: splitMethod === 'EQUAL' ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: splitMethod === 'EQUAL' ? '0 0 15px rgba(124, 92, 252, 0.4)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  <Scale size={14} />
                  <span>Equal</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setSplitMethod('CUSTOM')}
                  style={{
                    background: splitMethod === 'CUSTOM' ? 'var(--primary)' : 'transparent',
                    color: splitMethod === 'CUSTOM' ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: splitMethod === 'CUSTOM' ? '0 0 15px rgba(124, 92, 252, 0.4)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  <IndianRupee size={14} />
                  <span>Exact</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setSplitMethod('PERCENTAGE')}
                  style={{
                    background: splitMethod === 'PERCENTAGE' ? 'var(--primary)' : 'transparent',
                    color: splitMethod === 'PERCENTAGE' ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: splitMethod === 'PERCENTAGE' ? '0 0 15px rgba(124, 92, 252, 0.4)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  <Percent size={14} />
                  <span>Percent</span>
                </button>
              </div>
            </div>

            {/* Split Distribution Overview Card */}
            {numericAmount > 0 && splitMethod === 'EQUAL' && selectedUserIds.length > 0 && (
              <div
                style={{
                  background: 'var(--primary-subtle)',
                  border: '1px solid rgba(124, 92, 252, 0.25)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.88rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                  Each person owes:
                </span>
                <strong style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800 }}>
                  ₹{(numericAmount / selectedUserIds.length).toFixed(2)}
                </strong>
              </div>
            )}

            {/* Participants Interactive Cards */}
            <div className="form-group">
              <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Participants ({selectedUserIds.length} of {members.length})
                </label>
                <button
                  type="button"
                  onClick={selectAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Select All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {members.map((m) => {
                  const isSelected = selectedUserIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleParticipant(m.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--surface-elevated)' : 'rgba(23, 27, 43, 0.4)',
                        border: isSelected ? '1px solid rgba(124, 92, 252, 0.4)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--text-muted)',
                            background: isSelected ? 'var(--primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {m.name} {m.id === user?.id ? '(You)' : ''}
                        </span>
                      </div>

                      {/* Custom inputs inside participant rows */}
                      {isSelected && splitMethod === 'CUSTOM' && (
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0"
                            style={{
                              width: '90px',
                              padding: '0.3rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: '#080A12',
                              color: 'var(--text-main)',
                              fontSize: '0.85rem',
                              textAlign: 'right',
                            }}
                            value={customAmounts[m.id] || ''}
                            onChange={(e) => setCustomAmounts({ ...customAmounts, [m.id]: e.target.value })}
                          />
                        </div>
                      )}

                      {isSelected && splitMethod === 'PERCENTAGE' && (
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            placeholder="0"
                            style={{
                              width: '70px',
                              padding: '0.3rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: '#080A12',
                              color: 'var(--text-main)',
                              fontSize: '0.85rem',
                              textAlign: 'right',
                            }}
                            value={customPercentages[m.id] || ''}
                            onChange={(e) => setCustomPercentages({ ...customPercentages, [m.id]: e.target.value })}
                          />
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Validation differences for Custom & Percentage */}
            {splitMethod === 'CUSTOM' && numericAmount > 0 && (
              <div style={{ fontSize: '0.82rem', textAlign: 'right', color: Math.abs(customDiff) < 0.01 ? 'var(--success)' : 'var(--danger)' }}>
                Total assigned: ₹{customSum.toFixed(2)} / ₹{numericAmount.toFixed(2)} ({Math.abs(customDiff) < 0.01 ? '✓ Matches' : `Remaining: ₹${customDiff}`})
              </div>
            )}

            {splitMethod === 'PERCENTAGE' && (
              <div style={{ fontSize: '0.82rem', textAlign: 'right', color: Math.abs(percentageDiff) < 0.01 ? 'var(--success)' : 'var(--danger)' }}>
                Total: {percentageSum.toFixed(1)}% / 100% ({Math.abs(percentageDiff) < 0.01 ? '✓ Matches' : `Remaining: ${percentageDiff}%`})
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '160px' }}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Receipt size={16} />
                    <span>Create Expense</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
