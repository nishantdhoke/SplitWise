import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import {
  Users,
  Receipt,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Orbit,
  Compass,
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import GroupCard from '../components/GroupCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to sync with cosmic ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '7rem 0', gap: '1.25rem' }}>
        <div className="cosmic-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}></div>
        <span style={{ fontSize: '0.88rem', color: 'var(--starlight-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Calibrating Cosmic Coordinates...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const { summary, groups = [], recentExpenses = [] } = dashboardData || {};

  const totalOwed = Number(summary?.totalYouAreOwed || 0);
  const totalOwe = Number(summary?.totalYouOwe || 0);
  const netTotal = Number(summary?.netTotal || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 4. DRAMATIC COSMIC HERO SECTION */}
      <div
        className="cosmic-panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at top left, rgba(124, 58, 237, 0.25) 0%, rgba(8, 13, 29, 0.9) 65%)',
        }}
      >
        {/* Ambient Nebula Light behind the hero message */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '20%',
            width: '450px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(56, 217, 255, 0.15) 0%, rgba(124, 58, 237, 0.08) 50%, transparent 80%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        <div>
          {/* Cosmic Telemetry Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(56, 217, 255, 0.12)',
                border: '1px solid rgba(56, 217, 255, 0.35)',
                color: 'var(--starlight-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Orbit size={13} />
              <span>ORBIT COMMAND // SECTOR 01</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {groups.length} Planetary {groups.length === 1 ? 'World' : 'Worlds'} in Sync
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'var(--star-white)',
              letterSpacing: '-0.03em',
              textShadow: '0 0 24px rgba(155, 92, 255, 0.45)',
            }}
          >
            Welcome back, <span style={{ color: 'var(--starlight-cyan)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>

          <p className="text-muted" style={{ fontSize: '0.96rem', marginTop: '0.35rem', maxWidth: '560px' }}>
            All orbital financial paths are mapped. Monitor your interstellar balances and cosmic settlements in real time.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={fetchDashboard}
            title="Refresh Cosmic Telemetry"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            to="/groups/new"
            className="btn btn-primary"
            style={{
              padding: '0 1.5rem',
              height: '46px',
            }}
          >
            <Plus size={18} />
            <span>Chart Planet</span>
          </Link>
        </div>
      </div>

      {/* 5. FINANCIAL BALANCE AS COSMIC ENERGY (3 Telemetry Panels) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Total You Are Owed (POSITIVE GREEN COSMIC ENERGY) */}
        <div
          className="cosmic-panel"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 13, 29, 0.85) 0%, rgba(5, 46, 33, 0.35) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--cosmic-positive)',
              }}
            >
              You Are Owed
            </span>
            <div
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--cosmic-positive)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 14px rgba(52, 211, 153, 0.35)',
              }}
            >
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <AnimatedCounter
              value={totalOwed}
              prefix="₹"
              color="mint"
              className="finance-number finance-number-lg"
            />
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Inflowing energy due from fellow travelers
          </p>
        </div>

        {/* Total You Owe (NEGATIVE CORAL COSMIC ENERGY) */}
        <div
          className="cosmic-panel"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 13, 29, 0.85) 0%, rgba(55, 12, 24, 0.35) 100%)',
            border: '1px solid rgba(251, 113, 133, 0.3)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--cosmic-negative)',
              }}
            >
              You Owe
            </span>
            <div
              style={{
                background: 'rgba(251, 113, 133, 0.15)',
                color: 'var(--cosmic-negative)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 14px rgba(251, 113, 133, 0.35)',
              }}
            >
              <ArrowDownLeft size={18} />
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <AnimatedCounter
              value={totalOwe}
              prefix="₹"
              color="coral"
              className="finance-number finance-number-lg"
            />
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Outflowing orbital debt to be cleared
          </p>
        </div>

        {/* Net Cosmic Standing */}
        <div
          className="cosmic-panel"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 13, 29, 0.85) 0%, rgba(20, 16, 50, 0.45) 100%)',
            border: '1px solid rgba(56, 217, 255, 0.35)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--starlight-cyan)',
              }}
            >
              Net Cosmic Orbit
            </span>
            <div
              style={{
                background: 'rgba(56, 217, 255, 0.15)',
                color: 'var(--starlight-cyan)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 14px rgba(56, 217, 255, 0.35)',
              }}
            >
              <Orbit size={18} />
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <AnimatedCounter
              value={netTotal}
              prefix="₹"
              color={netTotal > 0 ? 'mint' : netTotal < 0 ? 'coral' : 'cyan'}
              className="finance-number finance-number-lg"
            />
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Overall gravitational balance across all galaxies
          </p>
        </div>
      </div>

      {/* 7. PLANETARY WORLDS (Your Groups) */}
      <div>
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--star-white)' }}>
              Planetary Worlds ({groups.length})
            </h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Distinct cosmic sectors sharing mutual resource pools
            </p>
          </div>
          <Link to="/groups/new" className="btn btn-secondary btn-sm">
            <Plus size={14} />
            <span>Chart Planet</span>
          </Link>
        </div>

        {groups.length === 0 ? (
          <div
            className="cosmic-panel"
            style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(56, 217, 255, 0.15)',
                color: 'var(--starlight-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 20px rgba(56, 217, 255, 0.3)',
              }}
            >
              <Compass size={28} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--star-white)' }}>
              No Planets Charted Yet
            </h4>
            <p className="text-muted mt-1" style={{ fontSize: '0.88rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
              Chart your first planetary world (e.g. Goa Trip, Flatmates, Road Trip) to begin balancing expenses.
            </p>
            <Link to="/groups/new" className="btn btn-primary">
              <Plus size={16} /> Chart Your First Planet
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Cosmic Transactions */}
      {recentExpenses.length > 0 && (
        <div className="cosmic-panel">
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--star-white)' }}>
                Recent Cosmic Transmissions
              </h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                Latest shared resources entering financial orbits
              </p>
            </div>
            <span className="badge badge-primary">
              <Receipt size={12} /> Live Stream
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex-between"
                style={{
                  padding: '0.9rem 1.2rem',
                  background: 'rgba(6, 9, 20, 0.85)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(8, 13, 29, 0.8) 100%)',
                      border: '1px solid rgba(155, 92, 255, 0.4)',
                      color: 'var(--starlight-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt size={17} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--star-white)' }}>
                      {exp.title}
                    </h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Paid by <strong>{exp.payer_name}</strong> in {exp.group_name}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    className="finance-number"
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--star-white)',
                      textShadow: '0 0 10px rgba(56, 217, 255, 0.35)',
                    }}
                  >
                    ₹{Number(exp.amount).toFixed(2)}
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {new Date(exp.expense_date || exp.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
