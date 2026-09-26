import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Shield, Sparkles, Orbit } from 'lucide-react';

/**
 * GroupCard Component (GROUPS AS PLANETS)
 * 
 * Renders each expense group as a distinct cosmic world with:
 * - A miniature glowing planet sphere
 * - Tilted planetary orbital ring
 * - Celestial coordinates & star sparkles
 * - Orbiting member count & balance
 */
export default function GroupCard({ group }) {
  const formattedDate = new Date(group.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Assign a distinct planetary archetype based on group id or name
  const planetThemes = [
    { type: 'planet-ice', name: 'Ice Giant', accent: '#38D9FF', ring: 'rgba(56, 217, 255, 0.45)' },
    { type: 'planet-violet', name: 'Nebula Orb', accent: '#9B5CFF', ring: 'rgba(155, 92, 255, 0.45)' },
    { type: 'planet-solar', name: 'Solar Core', accent: '#FBBF24', ring: 'rgba(251, 191, 36, 0.45)' },
    { type: 'planet-emerald', name: 'Emerald Oasis', accent: '#34D399', ring: 'rgba(52, 211, 153, 0.45)' },
    { type: 'planet-coral', name: 'Coral Horizon', accent: '#FB7185', ring: 'rgba(251, 113, 133, 0.45)' },
  ];

  const themeIndex = (group.id || group.name.charCodeAt(0)) % planetThemes.length;
  const currentTheme = planetThemes[themeIndex];

  return (
    <div className="planet-world-card" style={{ height: '100%', justifyContent: 'space-between' }}>
      <div>
        {/* Planetary System Header */}
        <div className="flex-between">
          <div className="planet-orb-wrapper">
            {/* Orbital Ring */}
            <div
              className="planet-orbital-ring"
              style={{
                borderColor: currentTheme.ring,
                boxShadow: `0 0 14px ${currentTheme.ring}`,
              }}
            />
            {/* Planet Sphere */}
            <div className={`planet-sphere ${currentTheme.type}`}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            {/* Orbiting Satellite Star */}
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '-2px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: currentTheme.accent,
                boxShadow: `0 0 8px ${currentTheme.accent}`,
              }}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(124, 58, 237, 0.15)',
                border: `1px solid ${currentTheme.ring}`,
                color: currentTheme.accent,
                fontSize: '0.72rem',
              }}
            >
              <Users size={11} />
              {group.member_count} In Orbit
            </span>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.05em' }}>
              SECTOR 0{themeIndex + 1}
            </div>
          </div>
        </div>

        {/* Planet / Group Name */}
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

        {/* Telemetry metadata */}
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Shield size={13} color="var(--starlight-cyan)" />
            <span>Captain: <strong style={{ color: 'var(--text-secondary)' }}>{group.creator_name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calendar size={13} />
            <span>Chartered {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Enter Orbit Action */}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Orbit size={14} color={currentTheme.accent} />
            <span>Enter Orbit</span>
          </span>
          <ArrowRight size={14} color={currentTheme.accent} />
        </Link>
      </div>
    </div>
  );
}
