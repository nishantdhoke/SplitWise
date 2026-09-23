import React, { useState } from 'react';
import { UserPlus, X, AlertCircle } from 'lucide-react';

export default function AddMemberModal({ isOpen, onClose, onAddMember, groupName }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddMember(email.trim());
      setEmail('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member to the group.');
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
          position: 'relative',
        }}
      >
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
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
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Add Member</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>To {groupName}</p>
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
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="member-email">
              Friend's Registered Email
            </label>
            <input
              id="member-email"
              type="email"
              className="form-input"
              placeholder="e.g. friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Note: The user must already have an account on FairShare.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '0.9rem', height: '0.9rem', borderWidth: '2px' }}></span>
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
