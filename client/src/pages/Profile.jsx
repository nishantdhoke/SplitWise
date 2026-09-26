import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, KeyRound, LogOut, CheckCircle, ArrowLeft, User } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently Joined';

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto 2rem' }}>
      <div
        className="cosmic-panel"
        style={{
          padding: '2.5rem 2.25rem',
          background: 'rgba(8, 13, 29, 0.88)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.2)',
        }}
      >
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
                color: '#F8FAFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: '0 0 25px rgba(56, 217, 255, 0.45)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--star-white)' }}>{user?.name}</h2>
              </div>
              <p className="text-muted" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                USER ID #{user?.id}
              </p>
            </div>
          </div>
          <span
            className="badge"
            style={{
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: 'var(--cosmic-positive)',
              padding: '0.4rem 0.85rem',
            }}
          >
            <CheckCircle size={13} />
            <span>Active Account</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'rgba(6, 9, 20, 0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--starlight-cyan)' }}>
              <Mail size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                Email Address
              </span>
              <p style={{ fontWeight: 600, color: 'var(--star-white)', marginTop: '2px' }}>{user?.email}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'rgba(6, 9, 20, 0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--nebula-violet)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                Member Since
              </span>
              <p style={{ fontWeight: 600, color: 'var(--star-white)', marginTop: '2px' }}>{formattedDate}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'rgba(6, 9, 20, 0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--cosmic-positive)' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                Security & Authentication
              </span>
              <p style={{ fontWeight: 600, color: 'var(--star-white)', marginTop: '2px' }}>
                Protected with bcrypt password hashing & secure JWT tokens
              </p>
            </div>
          </div>
        </div>

        <div className="flex-between" style={{ paddingTop: '1.75rem', marginTop: '1.75rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={15} />
            <span>Return to Dashboard</span>
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
