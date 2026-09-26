import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, User } from 'lucide-react';

export default function GroupCard({ group }) {
  const formattedDate = new Date(group.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const colorPalettes = [
    { bg: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #0284C7 100%)', shadow: 'rgba(56, 217, 255, 0.35)', badgeBorder: 'rgba(56, 217, 255, 0.4)' },
    { bg: 'radial-gradient(circle at 35% 35%, #C084FC 0%, #7C3AED 100%)', shadow: 'rgba(155, 92, 255, 0.35)', badgeBorder: 'rgba(155, 92, 255, 0.4)' },
    { bg: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 100%)', shadow: 'rgba(52, 211, 153, 0.35)', badgeBorder: 'rgba(52, 211, 153, 0.4)' },
    { bg: 'radial-gradient(circle at 35% 35%, #FDE047 0%, #D97706 100%)', shadow: 'rgba(251, 191, 36, 0.35)', badgeBorder: 'rgba(251, 191, 36, 0.4)' },
    { bg: 'radial-gradient(circle at 35% 35%, #FDA4AF 0%, #E11D48 100%)', shadow: 'rgba(251, 113, 133, 0.35)', badgeBorder: 'rgba(251, 113, 133, 0.4)' },
  ];

  const paletteIndex = (group.id || group.name.charCodeAt(0)) % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];

  return (
    <div className="cosmic-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Group Header */}
        <div className="flex-between">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: palette.bg,
              color: '#03040B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: `0 0 16px ${palette.shadow}`,
            }}
          >
            {group.name.charAt(0).toUpperCase()}
          </div>

          <span
            className="badge"
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: `1px solid ${palette.badgeBorder}`,
              color: 'var(--star-white)',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Users size={12} color="var(--starlight-cyan)" />
            <span>{group.member_count} {group.member_count === 1 ? 'Member' : 'Members'}</span>
          </span>
        </div>

        {/* Group Name */}
        <h3
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginTop: '1.15rem',
            color: 'var(--star-white)',
            letterSpacing: '-0.02em',
          }}
        >
          {group.name}
        </h3>

        {/* Metadata */}
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <User size={13} color="var(--starlight-cyan)" />
            <span>Created by <strong style={{ color: 'var(--text-secondary)' }}>{group.creator_name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calendar size={13} />
            <span>Created {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* View Group Action */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link
          to={`/groups/${group.id}`}
          className="btn btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'space-between',
            borderColor: 'rgba(124, 58, 237, 0.3)',
          }}
        >
          <span>View Group</span>
          <ArrowRight size={14} color="var(--starlight-cyan)" />
        </Link>
      </div>
    </div>
  );
}
