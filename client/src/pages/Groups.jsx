import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups } from '../services/api';
import GroupCard from '../components/GroupCard';
import { Plus, Users, RefreshCw, AlertCircle } from 'lucide-react';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGroups();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err.message || 'Failed to load your groups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserGroups();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--star-white)', letterSpacing: '-0.03em' }}>
              My Groups
            </h1>
            <span
              className="badge"
              style={{
                background: 'rgba(56, 217, 255, 0.15)',
                border: '1px solid rgba(56, 217, 255, 0.35)',
                color: 'var(--starlight-cyan)',
              }}
            >
              {groups.length} {groups.length === 1 ? 'Group' : 'Groups'}
            </span>
          </div>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Manage shared expenses with your friends, roommates, and trips
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={fetchUserGroups}
            disabled={loading}
            title="Refresh Groups"
          >
            <RefreshCw size={16} className={loading ? 'cosmic-spinner' : ''} />
          </button>
          <Link to="/groups/new" className="btn btn-primary">
            <Plus size={16} />
            <span>Create Group</span>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
          <div className="cosmic-spinner" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        </div>
      ) : groups.length === 0 ? (
        /* Empty State */
        <div
          className="cosmic-panel"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '540px',
            margin: '2rem auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 217, 255, 0.2) 0%, rgba(3, 4, 11, 0.8) 100%)',
              color: 'var(--starlight-cyan)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 0 25px rgba(56, 217, 255, 0.35)',
            }}
          >
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--star-white)' }}>No Groups Yet</h3>
          <p className="text-muted mt-2" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
            You haven't created or joined any expense groups yet. Create one for a trip, flat expenses, or dinner outings!
          </p>
          <Link to="/groups/new" className="btn btn-primary mt-3" style={{ padding: '0 1.75rem' }}>
            <Plus size={16} />
            <span>Create Your First Group</span>
          </Link>
        </div>
      ) : (
        /* Groups Grid */
        <div className="grid-2">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
