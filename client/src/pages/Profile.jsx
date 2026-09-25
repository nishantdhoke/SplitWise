import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, KeyRound, LogOut, CheckCircle, Shield } from 'lucide-react';
import SignatureEye from '../components/SignatureEye';

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
    : 'Recently';

  return (
    <div style={{ maxWidth: '640px', margin: '2.5rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(124, 92, 252, 0.4)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.name}</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Member Account #{user?.id}</p>
            </div>
          </div>
          <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem' }}>
            <CheckCircle size={14} />
            <span>Active Session</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--primary)' }}>
              <Mail size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Email Address</span>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{user?.email}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--secondary)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Member Since</span>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{formattedDate}</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ color: 'var(--success)' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Security Status</span>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>Encrypted with bcrypt (10 rounds) & JWT</p>
            </div>
          </div>
        </div>

        <div className="flex-between" style={{ paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
