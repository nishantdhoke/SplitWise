import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Orbit, Sparkles, KeyRound, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your interstellar credentials.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication rejected. Verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto 2rem' }}>
      {/* Floating Deep Space Command Console */}
      <div
        className="cosmic-panel"
        style={{
          padding: '2.75rem 2.25rem',
          background: 'rgba(8, 13, 29, 0.88)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.25)',
          position: 'relative',
        }}
      >
        {/* Subtle Decorative Star Points around the console */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              color: 'var(--starlight-cyan)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            <span>✦</span>
            <span>·</span>
            <span>SECURE ORBITAL LINK</span>
            <span>·</span>
            <span>✦</span>
          </div>

          {/* Central Orbit Icon */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 25px rgba(56, 217, 255, 0.5)',
              color: '#F8FAFF',
            }}
          >
            <Orbit size={28} />
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--star-white)', letterSpacing: '-0.03em' }}>
            Access Orbit
          </h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Authenticate with FairShare cosmic console
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={13} color="var(--starlight-cyan)" />
              <span>Cosmic Identifier (Email)</span>
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="astronaut@fairshare.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <KeyRound size={13} color="var(--starlight-cyan)" />
              <span>Passkey</span>
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '0.5rem', fontSize: '15px', fontWeight: 700 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="cosmic-spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                <span>Warping into Orbit...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>ENTER ORBIT</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Pre-fills */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            ⚡ TELEMETRY PRE-SETS:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setEmail('ronak@example.com'); setPassword('password123'); }}
            >
              Ronak
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setEmail('rahul@example.com'); setPassword('password123'); }}
            >
              Rahul
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setEmail('amit@example.com'); setPassword('password123'); }}
            >
              Amit
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem' }} className="text-muted">
          New explorer?{' '}
          <Link to="/register" style={{ color: 'var(--starlight-cyan)', fontWeight: 700, textDecoration: 'none' }}>
            Initialize Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
