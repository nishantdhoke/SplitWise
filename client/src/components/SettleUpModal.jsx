import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

export default function SettleUpModal({ settlement, isOpen, onClose, onConfirm }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settlement) {
      setAmount(settlement.amount || '');
      setError('');
    }
  }, [settlement, isOpen]);

  if (!isOpen || !settlement) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record settlement.');
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
          maxWidth: '460px',
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
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Record Payment</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Mark debt as settled</p>
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

        {/* Transaction Flow Diagram */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                margin: '0 auto 4px',
              }}
            >
              {settlement.payerName?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{settlement.payerName}</span>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Payer</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>paid</span>
            <ArrowRight size={20} color="var(--primary)" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                margin: '0 auto 4px',
              }}
            >
              {settlement.receiverName?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{settlement.receiverName}</span>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Receiver</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="settlement-amount">Settlement Amount (₹)</label>
            <input
              id="settlement-amount"
              type="number"
              step="0.01"
              min="1"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
              Records that an offline payment (cash, UPI, Google Pay, bank) was completed.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '0.9rem', height: '0.9rem', borderWidth: '2px' }}></span>
                  Recording...
                </>
              ) : (
                'Mark as Settled'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
