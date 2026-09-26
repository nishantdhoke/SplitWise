import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Orbit, AlertCircle, Sparkles } from 'lucide-react';
import CosmicParticleBurst from './CosmicParticleBurst';

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
      setError(`Access Restricted: Only ${settlement.receiverName || 'the creditor'} is authorized to confirm and settle this orbit.`);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please specify a cosmic energy balance greater than ₹0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm({
        payer_id: settlement.payerId,
        receiver_id: settlement.receiverId,
        amount: numericAmount,
      });

      // Show cosmic settlement pulse
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to record orbit settlement.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--cosmic-positive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(52, 211, 153, 0.3)',
              }}
            >
              <Orbit size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Confirm Orbit Settlement</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Rebalance energy between celestial bodies</p>
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
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', animation: 'fadeIn 300ms ease', position: 'relative' }}>
            <CosmicParticleBurst active={isSuccess} count={22} color="mint" />
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 100%)',
                color: '#03040B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 35px rgba(52, 211, 153, 0.7)',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <div
              className="finance-number"
              style={{
                fontSize: '1.9rem',
                color: 'var(--cosmic-positive)',
                marginBottom: '0.4rem',
                textShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
              }}
            >
              ₹{parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--star-white)' }}>
              Orbit Cleared & Settled!
            </h3>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
              Gravitational debts have neutralized. All planetary balances updated.
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

            {/* Cosmic Energy Flow Visual */}
            <div
              style={{
                background: 'rgba(6, 9, 20, 0.85)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Debtor Celestial Body */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FDA4AF 0%, #E11D48 70%, #03040B 100%)',
                    border: '1.5px solid rgba(251, 113, 133, 0.6)',
                    color: '#F8FAFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    margin: '0 auto 6px',
                    boxShadow: '0 0 14px rgba(251, 113, 133, 0.35)',
                  }}
                >
                  {settlement.payerName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--star-white)', display: 'block' }}>
                  {settlement.payerName}
                </span>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Debtor</span>
              </div>

              {/* Orbital Energy Path */}
              <div
                className="orbital-path-track"
                style={{ width: '130px' }}
                title="Orbital energy flow"
              >
                <div className="orbital-path-line" />
                <div className="orbital-energy-pulse" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: 'var(--starlight-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Energy Beam
                </span>
              </div>

              {/* Creditor Celestial Body */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 70%, #03040B 100%)',
                    border: '1.5px solid rgba(52, 211, 153, 0.6)',
                    color: '#03040B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    margin: '0 auto 6px',
                    boxShadow: '0 0 14px rgba(52, 211, 153, 0.35)',
                  }}
                >
                  {settlement.receiverName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--star-white)', display: 'block' }}>
                  {settlement.receiverName}
                </span>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Creditor</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="settlement-amount">
                  Settlement Energy Units (₹)
                </label>
                <input
                  id="settlement-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                  Receiver confirms receipt via UPI, cash, or interstellar transfer.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                  style={{ minWidth: '160px' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="cosmic-spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                      <span>Neutralizing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm Settlement</span>
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
