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
    <div>
      {/* Page Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Your Groups</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Groups of friends sharing and splitting expenses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchUserGroups} disabled={loading} title="Refresh">
            <RefreshCw size={15} className={loading ? 'spinner' : ''} />
          </button>
          <Link to="/groups/new" className="btn btn-primary">
            <Plus size={16} />
            Create Group
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        </div>
      ) : groups.length === 0 ? (
        /* Empty State */
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '520px',
            margin: '2rem auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>No Groups Yet</h3>
          <p className="text-muted mt-1" style={{ fontSize: '0.95rem' }}>
            You haven't joined or created any groups. Create a group for a trip, flat expenses, or a night out!
          </p>
          <Link to="/groups/new" className="btn btn-primary mt-3">
            <Plus size={16} />
            Create Your First Group
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
