import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function SettleUpModal({ settlement, isOpen, onClose, onConfirm, currentUserId }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (settlement) {
      setAmount(settlement.amount || '');
      setError('');
      setIsSuccess(false);
    }
  }, [settlement, isOpen]);

  if (!isOpen || !settlement) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (currentUserId && settlement.receiverId !== currentUserId) {
      setError(`Forbidden: Only ${settlement.receiverName || 'the receiver'} is allowed to mark this settlement as paid.`);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm({
        payer_id: settlement.payerId,
        receiver_id: settlement.receiverId,
        amount: numericAmount,
      });

      // Show smooth success state
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to record settlement.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-card" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--success-subtle)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(53, 224, 161, 0.3)',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Record Settlement</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Confirm offline payment (UPI / Cash)</p>
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
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', animation: 'fadeIn 300ms ease' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--success)',
                color: '#080A12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 30px rgba(53, 224, 161, 0.6)',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>Payment Confirmed!</h3>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
              Balances have been recalculated and updated in real-time.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Futuristic Transaction Flow Visual */}
            <div
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Payer Avatar */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger-dark)',
                    border: '1.5px solid var(--danger)',
                    color: 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    margin: '0 auto 6px',
                    boxShadow: '0 0 10px rgba(255, 100, 124, 0.3)',
                  }}
                >
                  {settlement.payerName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                  {settlement.payerName}
                </span>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Payer</span>
              </div>

              {/* Glowing Arrow */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <div
                  style={{
                    padding: '0.4rem',
                    borderRadius: '50%',
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary-hover)',
                  }}
                >
                  <ArrowRight size={20} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary-hover)', fontWeight: 600 }}>paid</span>
              </div>

              {/* Receiver Avatar */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-dark)',
                    border: '1.5px solid var(--success)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    margin: '0 auto 6px',
                    boxShadow: '0 0 10px rgba(53, 224, 161, 0.3)',
                  }}
                >
                  {settlement.receiverName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                  {settlement.receiverName}
                </span>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Receiver</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="settlement-amount">
                  Settlement Amount (₹)
                </label>
                <input
                  id="settlement-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  Receiver confirms having received this payment via UPI, cash, or bank transfer.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                  style={{ minWidth: '150px' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm & Settle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
