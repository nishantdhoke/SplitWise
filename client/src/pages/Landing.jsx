import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  Scale,
  Receipt,
  Shield,
  Orbit,
} from 'lucide-react';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);
  const [demoError, setDemoError] = useState('');

  const handleDemoLogin = async (email) => {
    setDemoLoggingIn(true);
    setDemoError('');
    try {
      await login(email, 'password123');
      navigate('/dashboard');
    } catch (err) {
      setDemoError(err.message || 'Demo login failed. Make sure backend is running.');
    } finally {
      setDemoLoggingIn(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', padding: '2rem 0 4rem' }}>
      {/* 1. COSMIC HERO EXPERIENCE */}
      <section style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto', position: 'relative' }}>
        {/* Celestial Orbit Centerpiece */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              position: 'relative',
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Spinning Outer Celestial Rings */}
            <div
              style={{
                position: 'absolute',
                width: '130px',
                height: '46px',
                border: '1.5px solid rgba(56, 217, 255, 0.45)',
                borderRadius: '50%',
                transform: 'rotate(-25deg)',
                boxShadow: '0 0 20px rgba(56, 217, 255, 0.3)',
                animation: 'planetaryRingSpin 14s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '42px',
                border: '1px solid rgba(155, 92, 255, 0.35)',
                borderRadius: '50%',
                transform: 'rotate(35deg)',
                animation: 'planetaryRingSpin 20s linear infinite reverse',
              }}
            />
            {/* Core Planet Orb */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
                boxShadow: '0 0 35px rgba(56, 217, 255, 0.55), inset -8px -8px 16px rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFF',
              }}
            >
              <Orbit size={36} />
            </div>
          </div>
        </div>

        {/* Tag Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 217, 255, 0.1)',
            border: '1px solid rgba(56, 217, 255, 0.3)',
            color: 'var(--starlight-cyan)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <Sparkles size={14} />
          <span>Smart Expense Splitting & Debt Minimization</span>
        </div>

        <h1
          style={{
            fontSize: '3.4rem',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            color: 'var(--star-white)',
            marginBottom: '1.5rem',
            textShadow: '0 0 40px rgba(124, 58, 237, 0.45)',
          }}
        >
          Managing Your Expenses <br />
          <span style={{ color: 'var(--starlight-cyan)', textShadow: '0 0 30px rgba(56, 217, 255, 0.5)' }}>
            Inside The Universe.
          </span>
        </h1>

        <p
          className="text-muted"
          style={{
            fontSize: '1.2rem',
            lineHeight: 1.65,
            maxWidth: '720px',
            margin: '0 auto 2.25rem',
          }}
        >
          FairShare makes splitting expenses with friends effortless and beautiful. Add group expenses, split bills
          equally, by custom amounts or percentages, and let our algorithm calculate the fewest settlement payments.
        </p>

        {/* CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.15rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{
              padding: '0.9rem 2.2rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
            }}
          >
            <UserPlus size={18} />
            <span>GET STARTED FREE</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            className="btn btn-secondary"
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1.05rem',
              fontWeight: 700,
            }}
          >
            <LogIn size={18} />
            <span>SIGN IN</span>
          </Link>
        </div>

        {/* Instant Demo Quick-Login Bar */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(8, 13, 29, 0.85)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1.25rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span>⚡ Instant Demo Access:</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('ronak@example.com')}
            disabled={demoLoggingIn}
          >
            Ronak
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('rahul@example.com')}
            disabled={demoLoggingIn}
          >
            Rahul
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('amit@example.com')}
            disabled={demoLoggingIn}
          >
            Amit
          </button>
        </div>

        {demoError && (
          <div className="alert alert-danger" style={{ maxWidth: '440px', margin: '1rem auto 0' }}>
            <span>{demoError}</span>
          </div>
        )}
      </section>

      {/* 2. THE THREE CORE PILLARS */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--star-white)' }}>
            Smart Financial Architecture
          </h2>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Engineered for precision, algorithmic debt minimization, and zero math friction.
          </p>
        </div>

        <div className="grid-3">
          {/* Pillar 1 */}
          <div className="cosmic-panel" style={{ padding: '2rem 1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(56, 217, 255, 0.12)',
                color: 'var(--starlight-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(56, 217, 255, 0.3)',
              }}
            >
              <Scale size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--star-white)', marginBottom: '0.65rem' }}>
              Debt Minimization Algorithm
            </h3>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              A two-pointer greedy settlement algorithm collapses multi-friend group debts into the absolute minimum
              number of cash repayments.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="cosmic-panel" style={{ padding: '2rem 1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(124, 58, 237, 0.15)',
                color: 'var(--nebula-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(124, 58, 237, 0.35)',
              }}
            >
              <Receipt size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--star-white)', marginBottom: '0.65rem' }}>
              Equal, Custom & Percentage Splits
            </h3>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              Equal, exact rupee amounts, or percentage splits executed in integer paise precision, completely eliminating
              rounding discrepancies.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="cosmic-panel" style={{ padding: '2rem 1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(52, 211, 153, 0.12)',
                color: 'var(--cosmic-positive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid rgba(52, 211, 153, 0.35)',
              }}
            >
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--star-white)', marginBottom: '0.65rem' }}>
              Authorized Receiver Settlements
            </h3>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
              Backend-enforced authorization ensures only the money recipient can mark debts as paid,
              protecting your balance from unauthorized changes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GROUPS CONCEPT PREVIEW */}
      <section className="cosmic-panel" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <span
            className="badge"
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(155, 92, 255, 0.4)',
              color: 'var(--nebula-violet)',
              marginBottom: '0.75rem',
            }}
          >
            Group Splitting
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--star-white)' }}>
            Organized Groups for Every Occasion
          </h2>
          <p className="text-muted" style={{ fontSize: '0.96rem', marginTop: '0.5rem' }}>
            Trips, apartments, and outings have independent member lists and real-time balance calculations.
          </p>
        </div>

        <div className="grid-3">
          {/* World 1 */}
          <div
            style={{
              background: 'rgba(6, 9, 20, 0.9)',
              border: '1px solid rgba(56, 217, 255, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #0284C7 100%)',
                color: '#03040B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                boxShadow: '0 0 16px rgba(56, 217, 255, 0.35)',
              }}
            >
              G
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--star-white)' }}>Goa Trip</h4>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>6 Members sharing expenses</span>
            </div>
          </div>

          {/* World 2 */}
          <div
            style={{
              background: 'rgba(6, 9, 20, 0.9)',
              border: '1px solid rgba(155, 92, 255, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'radial-gradient(circle at 35% 35%, #C084FC 0%, #7C3AED 100%)',
                color: '#03040B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                boxShadow: '0 0 16px rgba(155, 92, 255, 0.35)',
              }}
            >
              F
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--star-white)' }}>Flatmates</h4>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>4 Members sharing rent & groceries</span>
            </div>
          </div>

          {/* World 3 */}
          <div
            style={{
              background: 'rgba(6, 9, 20, 0.9)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 100%)',
                color: '#03040B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                boxShadow: '0 0 16px rgba(52, 211, 153, 0.35)',
              }}
            >
              R
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--star-white)' }}>Road Trip</h4>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>5 Members splitting fuel & food</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
