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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div className="flex-between">
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.15rem'
          }}>
            {group.name.charAt(0).toUpperCase()}
          </div>
          <span className="badge badge-warning" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>
            <Users size={12} />
            {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem' }}>
          {group.name}
        </h3>

        <div className="text-muted mt-1" style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={13} />
            <span>Created by {group.creator_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link
          to={`/groups/${group.id}`}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between', padding: '0.5rem 0.85rem' }}
        >
          <span>View Group</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
