import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Shield } from 'lucide-react';

export default function GroupCard({ group }) {
  const formattedDate = new Date(group.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        background: 'var(--surface)',
      }}
    >
      <div>
        <div className="flex-between">
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--surface-elevated) 0%, #20263B 100%)',
              border: '1px solid var(--border)',
              color: 'var(--primary-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 0 10px rgba(124, 92, 252, 0.2)',
            }}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>
          <span className="badge badge-primary">
            <Users size={12} />
            {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '1rem', color: 'var(--text-main)' }}>
          {group.name}
        </h3>

        <div className="text-muted mt-2" style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={13} color="var(--primary)" />
            <span>Created by <strong>{group.creator_name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link
          to={`/groups/${group.id}`}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>Open Group</span>
          <ArrowRight size={15} color="var(--primary)" />
        </Link>
      </div>
    </div>
  );
}
