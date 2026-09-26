import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGroup } from '../services/api';
import { Users, ArrowLeft, AlertCircle, Sparkles, Plus } from 'lucide-react';
import CosmicParticleBurst from '../components/CosmicParticleBurst';

const GROUP_IDEAS = [
  'Goa Trip',
  'Flatmates',
  'Weekend Getaway',
  'Office Lunch',
  'Road Trip',
  'Groceries',
];

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/groups/${data.group.id}`);
      }, 700);
    } catch (err) {
      setError(err.message || 'Failed to create group.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '3rem auto 2rem', position: 'relative' }}>
      <CosmicParticleBurst active={isSuccess} count={26} color="cyan" />

      <Link
        to="/groups"
        className="text-muted"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontSize: '0.88rem',
          transition: 'color var(--transition-fast)',
        }}
      >
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div
        className="cosmic-panel"
        style={{
          padding: '2.5rem 2.25rem',
          background: 'rgba(8, 13, 29, 0.88)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(56, 217, 255, 0.45)',
              color: '#F8FAFF',
            }}
          >
            <Users size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--star-white)', letterSpacing: '-0.03em' }}>
            Create New Group
          </h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Start a group to split expenses with friends, flatmates, or travel buddies
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
            <label className="form-label" htmlFor="group-name">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              className="form-input"
              placeholder="e.g. Goa Trip, Flat 402, Weekend Getaway"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Quick Suggestions */}
          <div style={{ marginTop: '1.5rem' }}>
            <span className="text-muted" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={13} color="var(--starlight-cyan)" /> Suggestions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem' }}>
              {GROUP_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setName(idea)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '2rem', fontSize: '15px', fontWeight: 700 }}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <span className="cosmic-spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                <span>Creating Group...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Create Group</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
