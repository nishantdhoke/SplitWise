import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Orbit, Sparkles } from 'lucide-react';
import CosmicParticleBurst from '../components/CosmicParticleBurst';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please provide all planetary identification details.');
      return;
    }

    if (password.length < 6) {
      setError('Passkey must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passkeys do not synchronize.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 900);
    } catch (err) {
      setError(err.message || 'Initialization failed. Verify inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '3.5rem auto 2rem', position: 'relative' }}>
      <CosmicParticleBurst active={isSuccess} count={28} color="cyan" />

      {/* Floating Deep Space Initialization Console */}
      <div
        className="cosmic-panel"
        style={{
          padding: '2.5rem 2.25rem',
          background: 'rgba(8, 13, 29, 0.88)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(124, 58, 237, 0.25)',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            <span>INITIALIZE PROFILE</span>
            <span>·</span>
            <span>✦</span>
          </div>

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
            Enter the Universe
          </h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Initialize your profile on FairShare cosmic network
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Cosmic Call-Sign (Full Name)</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="e.g. Nishant Dhoke"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Interstellar Channel (Email)</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="nishant@universe.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Passkey (min 6 characters)</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Passkey</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', marginTop: '0.75rem', fontSize: '15px', fontWeight: 700 }}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <span className="cosmic-spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>
                <span>Calibrating Orbit...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>INITIALIZE PROFILE</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem' }} className="text-muted">
          Already charted?{' '}
          <Link to="/login" style={{ color: 'var(--starlight-cyan)', fontWeight: 700, textDecoration: 'none' }}>
            Access Orbit
          </Link>
        </div>
      </div>
    </div>
  );
}
