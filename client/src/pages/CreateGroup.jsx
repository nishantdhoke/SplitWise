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
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <Link to="/groups" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <Users size={24} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Create New Group</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
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
          <div style={{ marginTop: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <Sparkles size={13} color="var(--primary)" /> Popular Ideas:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {SUGGESTIONS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setName(idea.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim())}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.75rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                Creating Group...
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
