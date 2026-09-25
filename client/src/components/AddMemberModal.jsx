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
    <div className="modal-backdrop">
      <div className="modal-content glass-card" style={{ maxWidth: '460px' }}>
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
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Invite Member</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Add friend to {groupName}</p>
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

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
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
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
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
                  <span>Adding...</span>
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
