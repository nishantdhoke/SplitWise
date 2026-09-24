import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkHealth } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  Zap,
  Users,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Server,
  Database,
  Monitor,
  RefreshCw,
  Wallet,
  Check
} from 'lucide-react';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [demoLoggingIn, setDemoLoggingIn] = useState(false);
  const [demoError, setDemoError] = useState('');

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch {
      // Graceful fallback if offline
      setHealthData(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

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
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Smart Expense Splitting & Debt Minimization</span>
        </div>

        <h1 className="hero-title">
          Split Bills with Friends.<br />
          <span className="gradient-text">Zero Friction. Zero Math Stress.</span>
        </h1>

        <p className="hero-subtitle">
          FairShare makes sharing group costs effortless. Track shared expenses on trips,
          flat rentals, and dinners, divide by equal, exact, or percentage splits, and settle debts
          with the absolute fewest payments.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="btn btn-hero-primary">
            <UserPlus size={18} />
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/login" className="btn btn-hero-secondary">
            <LogIn size={18} />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="demo-quick-bar">
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>🚀 Try Instant Demo:</span>
          <button
            type="button"
            className="demo-chip-btn"
            disabled={demoLoggingIn}
            onClick={() => handleDemoLogin('ronak@example.com')}
          >
            {demoLoggingIn ? 'Logging in...' : 'Login as Ronak'}
          </button>
          <button
            type="button"
            className="demo-chip-btn"
            disabled={demoLoggingIn}
            onClick={() => handleDemoLogin('rahul@example.com')}
          >
            Login as Rahul
          </button>
          <button
            type="button"
            className="demo-chip-btn"
            disabled={demoLoggingIn}
            onClick={() => handleDemoLogin('amit@example.com')}
          >
            Login as Amit
          </button>
        </div>

        {demoError && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {demoError}
          </p>
        )}
      </section>

      {/* Visual Product Showcase / Interactive Mockup */}
      <section className="preview-showcase">
        <div className="preview-browser-header">
          <div className="browser-dots">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <div className="browser-url-bar">
            fairshare.app/groups/goa-vacation
          </div>
          <div style={{ width: '40px' }}></div>
        </div>

        <div className="preview-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🏖️ Goa Beach Trip 2026</h3>
                <span className="badge badge-success">Active Trip</span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                4 Members &bull; 6 shared expenses &bull; Total spent: ₹14,400.00
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-primary" style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                ⚡ Algorithm: Minimal Repayments
              </span>
            </div>
          </div>

          <div className="grid-2">
            {/* Recent Expense Card */}
            <div className="preview-group-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Latest Expense
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Equal Split</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '10px' }}>
                  <Receipt size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.05rem' }}>Seafood Dinner at Brittos</h4>
                  <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                    Paid by <strong>Ronak</strong> &bull; Split among 4 friends
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span className="text-muted">Total Bill:</span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>₹3,600.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                <span className="text-muted">Each person owes:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹900.00</span>
              </div>
            </div>

            {/* Smart Debt Simplification */}
            <div className="preview-debt-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Zap size={18} color="#059669" />
                <strong style={{ color: '#065f46', fontSize: '0.95rem' }}>
                  Optimal Settlement Transfers
                </strong>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#047857', marginBottom: '0.75rem' }}>
                FairShare's algorithm simplified 6 messy circular debts down to just 3 direct transfers:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #d1fae5' }}>
                  <span><strong>Rahul</strong> pays <strong>Ronak</strong></span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>₹900.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #d1fae5' }}>
                  <span><strong>Amit</strong> pays <strong>Ronak</strong></span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>₹900.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #d1fae5' }}>
                  <span><strong>Priya</strong> pays <strong>Ronak</strong></span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>₹900.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section>
        <div className="features-header">
          <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
            <span>Why FairShare</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Built for Real-World Group Spending
          </h2>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            Everything you need to manage roommate costs, road trips, and social dinners without any disputes.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#e0e7ff', color: '#4338ca' }}>
              <Receipt size={24} />
            </div>
            <h3 className="feature-title">3 Precision Split Modes</h3>
            <p className="feature-desc">
              Split bills equally among all members, by exact custom cash amounts, or by percentage.
              Automated rounding safeguards prevent ₹0.01 discrepancies.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Minimal Repayments Engine</h3>
            <p className="feature-desc">
              Tired of person A paying person B who pays person C? Our greedy graph reduction algorithm
              simplifies complex circular debts into the minimum direct payments.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Wallet size={24} />
            </div>
            <h3 className="feature-title">1-Click Settlement Ledger</h3>
            <p className="feature-desc">
              Settle debts via UPI, Google Pay, PhonePe, or cash. Record settlements with a single click
              and balances automatically recalculate for the entire group.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#fce7f3', color: '#db2777' }}>
              <PieChart size={24} />
            </div>
            <h3 className="feature-title">Unified Dashboard</h3>
            <p className="feature-desc">
              Instantly see your overall net financial status across all active groups: total money
              you owe versus total money you are owed, updated dynamically.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <Users size={24} />
            </div>
            <h3 className="feature-title">Group Workspaces</h3>
            <p className="feature-desc">
              Keep your apartment rent separate from your weekend trips and lunch outings. Organize
              members, view chronological activity feeds, and manage access.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="feature-title">Rock-Solid Security</h3>
            <p className="feature-desc">
              Protected by salted bcrypt password hashing, JSON Web Tokens (JWT), and ACID-compliant
              MySQL database transactions with connection pooling.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section>
        <div className="features-header">
          <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
            <span>Simple Workflow</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            How FairShare Works in 3 Easy Steps
          </h2>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Create or Join a Group
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Set up a group for your apartment, road trip, or family event, and add your friends by name and email.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Log Shared Expenses
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enter the amount, select who paid, and pick your split rule: equal division, exact amounts, or percentage shares.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Settle with Minimum Friction
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Check the smart settlement ledger, pay via your favorite UPI app, and mark debts resolved in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Live System Operational Status
      <section className="infra-card">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-dot online"></span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Live Infrastructure & Health Status
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
              Operational
            </span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={fetchHealth}
            disabled={healthLoading}
          >
            <RefreshCw size={13} className={healthLoading ? 'spinner' : ''} />
            <span>Refresh Ping</span>
          </button>
        </div>

        <div className="infra-grid">
          <div className="infra-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Monitor size={16} color="var(--primary)" />
              <strong style={{ fontSize: '0.9rem' }}>Frontend Client</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>React 19 &bull; Vite &bull; Port 5173</p>
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Check size={14} /> Online & Responsive
            </div>
          </div>

          <div className="infra-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Server size={16} color="#059669" />
              <strong style={{ fontSize: '0.9rem' }}>Backend Server</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Node.js &bull; Express API &bull; Port 5000</p>
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: healthData ? 'var(--success)' : 'var(--warning)', fontSize: '0.8rem', fontWeight: 600 }}>
              {healthData ? (
                <>
                  <Check size={14} /> Operational ({healthData.uptimeSeconds}s uptime)
                </>
              ) : (
                'Connecting...'
              )}
            </div>
          </div>

          <div className="infra-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Database size={16} color="#d97706" />
              <strong style={{ fontSize: '0.9rem' }}>Database</strong>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>MySQL 8.0 &bull; fairshare_db &bull; Port 3306</p>
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: healthData?.database?.connected ? 'var(--success)' : 'var(--warning)', fontSize: '0.8rem', fontWeight: 600 }}>
              {healthData?.database?.connected ? (
                <>
                  <CheckCircle2 size={14} /> Connected Pool (10 slots)
                </>
              ) : (
                'Checking connection...'
              )}
            </div>
          </div>
        </div>
      </section> */}

      {/* Bottom Call to Action Banner */}
      <section className="cta-banner">
        <h2>Ready to Split Bills without the Headache?</h2>
        <p>
          Join FairShare today and start managing your group expenses with complete transparency,
          fair math, and zero awkwardness.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-hero-primary" style={{ background: '#ffffff', color: 'var(--primary)' }}>
            <UserPlus size={18} />
            <span>Create Free Account</span>
          </Link>
          <Link to="/login" className="btn btn-hero-secondary" style={{ background: 'transparent', color: '#ffffff', borderColor: '#818cf8' }}>
            <LogIn size={18} />
            <span>Sign In to Existing Account</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
