import React, { useState, useEffect } from 'react';
import { getExpenseDetails } from '../services/api';
import { X, Receipt, Calendar, User, AlertCircle, PieChart } from 'lucide-react';

export default function ExpenseDetailsModal({ expenseId, isOpen, onClose }) {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !expenseId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getExpenseDetails(expenseId);
        setExpense(data.expense);
      } catch (err) {
        setError(err.message || 'Failed to load expense details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [expenseId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-card" style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(124, 92, 252, 0.3)',
              }}
            >
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Expense Split Details</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>How this expense was distributed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        ) : expense ? (
          <div>
            {/* Header Summary */}
            <div
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <div className="flex-between">
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{expense.title}</span>
                <span className="finance-number" style={{ fontSize: '1.35rem', color: 'var(--secondary)' }}>
                  ₹{Number(expense.amount).toFixed(2)}
                </span>
              </div>
              <div className="text-muted mt-2" style={{ fontSize: '0.82rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} color="var(--primary)" /> Paid by <strong>{expense.payer_name}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {new Date(expense.expense_date).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PieChart size={13} color="var(--secondary)" /> {expense.split_method} Split
                </span>
              </div>
            </div>

            {/* Participants Split Breakdown */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Participant Shares ({expense.participants?.length || 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {expense.participants?.map((p) => (
                <div
                  key={p.participant_record_id}
                  className="flex-between"
                  style={{
                    padding: '0.8rem 1rem',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</span>
                    {p.user_id === expense.paid_by && (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>
                        Payer
                      </span>
                    )}
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{p.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="finance-number" style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      ₹{Number(p.share_amount).toFixed(2)}
                    </span>
                    {p.share_percentage && (
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        ({p.share_percentage}%)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
