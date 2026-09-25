import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGroup } from '../services/api';
import { Users, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Goa Trip 🏖️',
  'Flat Expenses 🏠',
  'College Friends 🎓',
  'Weekend Getaway 🚗',
  'Office Lunch 🍕',
  'Monthly Groceries 🛒',
];

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a group name.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await createGroup(name.trim());
      navigate(`/groups/${data.group.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create group.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2.5rem auto' }}>
      <Link
        to="/groups"
        className="text-muted"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary-hover)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 0 15px rgba(124, 92, 252, 0.3)',
            }}
          >
            <Users size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create New Group</h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
            You'll automatically be enrolled as the group creator
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="group-name">Group Name</label>
            <input
              id="group-name"
              type="text"
              className="form-input"
              placeholder="e.g. Goa Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Quick Suggestions */}
          <div style={{ marginTop: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Sparkles size={13} color="var(--primary)" /> Popular Ideas:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem' }}>
              {SUGGESTIONS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setName(idea.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim())}
                  className="demo-chip-btn"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '2rem', fontSize: '15px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                <span>Creating Group...</span>
              </>
            ) : (
              'Create Group'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
