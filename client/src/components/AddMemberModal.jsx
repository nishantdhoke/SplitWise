import React, { useState, useEffect } from 'react';
import { UserPlus, X, AlertCircle, Copy, Check, Search, Users, Sparkles, CheckCircle2, Orbit } from 'lucide-react';
import { searchRegisteredUsers } from '../services/api';
import CosmicParticleBurst from './CosmicParticleBurst';

export default function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
  groupName,
  existingMembers = [],
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addedName, setAddedName] = useState('');

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Existing member emails set for fast lookup
  const existingEmailSet = new Set(
    existingMembers.map((m) => (m.email ? m.email.toLowerCase().trim() : ''))
  );
  const existingIdSet = new Set(existingMembers.map((m) => m.id));

  // Fetch available registered users when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setIsSuccess(false);
    setEmail('');
    setCopiedLink(false);

    let isMounted = true;
    setLoadingUsers(true);

    searchRegisteredUsers('')
      .then((data) => {
        if (isMounted && data && Array.isArray(data.users)) {
          // Filter out users already in this group
          const nonMembers = data.users.filter(
            (u) => !existingEmailSet.has(u.email.toLowerCase().trim()) && !existingIdSet.has(u.id)
          );
          setAvailableUsers(nonMembers);
        }
      })
      .catch((err) => {
        console.error('Failed to load registered users:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingUsers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, existingMembers.length]);

  if (!isOpen) return null;

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/register`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInviteUser = async (targetEmail, targetName = '') => {
    setError('');

    const cleanEmail = targetEmail.trim();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddMember(cleanEmail);
      setAddedName(targetName || cleanEmail);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to add member to the group.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleInviteUser(email);
  };

  // Filter available registered users by search text
  const searchFilter = email.trim().toLowerCase();
  const matchingRegisteredUsers = availableUsers.filter((u) => {
    if (!searchFilter) return true;
    return (
      u.name.toLowerCase().includes(searchFilter) ||
      u.email.toLowerCase().includes(searchFilter)
    );
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-card" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
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
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Invite Friends</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Add members to <strong>{groupName}</strong></p>
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
            <CosmicParticleBurst active={isSuccess} count={20} color="violet" />
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #C084FC 0%, #7C3AED 100%)',
                color: '#F8FAFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 30px rgba(155, 92, 255, 0.6)',
              }}
            >
              <Orbit size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--star-white)' }}>
              Crew Member Initialized!
            </h3>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
              <strong>{addedName}</strong> has entered orbit in {groupName}.
            </p>
          </div>
        ) : (
          <>
            {/* Shareable Invite / Register Link Banner */}
            <div
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={16} color="var(--primary-hover)" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                    Friend not on FairShare yet?
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Share registration link so they can create an account
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${copiedLink ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleCopyInviteLink}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                {copiedLink ? (
                  <>
                    <Check size={13} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                  <span>{error}</span>
                  {error.toLowerCase().includes('register') && (
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: '0.25rem', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                    >
                      <Copy size={12} /> Copy Sign-Up Link to Send Friend
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Email / Search Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="member-email">
                  Invite by Email or Name
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="member-email"
                    type="email"
                    className="form-input"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !email.trim()}
                    style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                  >
                    {isSubmitting ? (
                      <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                    ) : (
                      'Invite'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Quick-Add Suggestions from Registered Users */}
            {matchingRegisteredUsers.length > 0 && (
              <div>
                <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Registered Users ({matchingRegisteredUsers.length})
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Click to add instantly
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: '190px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {matchingRegisteredUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'border-color var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--primary-subtle)',
                            color: 'var(--primary-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                            {u.name}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleInviteUser(u.email, u.name)}
                        disabled={isSubmitting}
                        style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
                      >
                        <UserPlus size={13} />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
