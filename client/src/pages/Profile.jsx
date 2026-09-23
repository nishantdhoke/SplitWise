import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, KeyRound, LogOut, CheckCircle } from 'lucide-react';

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
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div className="card">
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              fontWeight: 700,
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{user?.name}</h2>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>User ID: #{user?.id}</p>
            </div>
          </div>
          <span className="badge badge-success">
            <CheckCircle size={13} />
            Authenticated
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <Mail size={18} color="var(--primary)" />
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
              <p style={{ fontWeight: 500, marginTop: '2px' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Member Since</span>
              <p style={{ fontWeight: 500, marginTop: '2px' }}>{formattedDate}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <KeyRound size={18} color="var(--primary)" />
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Security Status</span>
              <p style={{ fontWeight: 500, marginTop: '2px' }}>Password encrypted using bcrypt (10 rounds)</p>
            </div>
          </div>
        </div>

        <div className="flex-between mt-3" style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
          <button className="btn btn-danger" onClick={handleLogout} style={{ background: '#ef4444', color: '#fff' }}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
