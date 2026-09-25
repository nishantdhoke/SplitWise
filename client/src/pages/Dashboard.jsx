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
  Scale,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import SignatureEye from '../components/SignatureEye';

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
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', gap: '1.5rem' }}>
        <SignatureEye size={70} interactive={false} />
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        <span className="text-muted" style={{ fontSize: '0.9rem' }}>Syncing financial ledger...</span>
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

  // Financial Ratio for visual bar
  const totalVolume = totalOwed + totalOwe;
  const owedPercent = totalVolume > 0 ? Math.round((totalOwed / totalVolume) * 100) : 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Centerpiece: Welcome Hero & Signature Eye */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background ambient lighting */}
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            right: '-10%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 92, 252, 0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Interactive Signature Eye Emblem */}
          <SignatureEye size={82} glowIntensity="high" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">
                <Sparkles size={12} /> Financial Overview
              </span>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                {groups.length} active {groups.length === 1 ? 'group' : 'groups'}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              Your net balance and shared expense ledger are up to date.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={fetchDashboard}
            title="Refresh Ledger"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            to="/groups/new"
            className="btn btn-primary"
            style={{
              padding: '0 1.5rem',
              height: '48px',
              fontSize: '15px',
              boxShadow: '0 8px 30px rgba(124, 92, 252, 0.35)',
            }}
          >
            <Plus size={18} />
            <span>Create Group</span>
          </Link>
        </div>
      </div>

      {/* Financial Standing Cards Grid (3-Tier Visual Hierarchy) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Total You Are Owed (MINT GREEN) */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(180deg, #10131F 0%, #111A24 100%)',
            border: '1px solid rgba(53, 224, 161, 0.25)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--success)',
              }}
            >
              You Are Owed
            </span>
            <div
              style={{
                background: 'rgba(53, 224, 161, 0.15)',
                color: 'var(--success)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 12px rgba(53, 224, 161, 0.3)',
              }}
            >
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div
            className="finance-number finance-number-lg"
            style={{ color: 'var(--success)', marginTop: '0.85rem' }}
          >
            ₹{totalOwed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
            Friends will pay this back to you
          </p>
        </div>

        {/* Total You Owe (CORAL RED) */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(180deg, #10131F 0%, #1E121B 100%)',
            border: '1px solid rgba(255, 100, 124, 0.25)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--danger)',
              }}
            >
              You Owe
            </span>
            <div
              style={{
                background: 'rgba(255, 100, 124, 0.15)',
                color: 'var(--danger)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 12px rgba(255, 100, 124, 0.3)',
              }}
            >
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div
            className="finance-number finance-number-lg"
            style={{ color: 'var(--danger)', marginTop: '0.85rem' }}
          >
            ₹{totalOwe.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
            Amount you need to settle with friends
          </p>
        </div>

        {/* Net Financial Standing (Centerpiece) */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(180deg, #10131F 0%, #17152B 100%)',
            border: '1px solid rgba(124, 92, 252, 0.35)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="flex-between">
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--primary-hover)',
              }}
            >
              Overall Net Balance
            </span>
            <div
              style={{
                background: 'rgba(124, 92, 252, 0.18)',
                color: 'var(--primary-hover)',
                padding: '0.45rem',
                borderRadius: '50%',
                display: 'flex',
                boxShadow: '0 0 12px rgba(124, 92, 252, 0.3)',
              }}
            >
              <Scale size={20} />
            </div>
          </div>
          <div
            className="finance-number finance-number-lg"
            style={{
              marginTop: '0.85rem',
              color:
                netTotal > 0
                  ? 'var(--success)'
                  : netTotal < 0
                  ? 'var(--danger)'
                  : 'var(--text-main)',
            }}
          >
            {netTotal > 0 ? '+' : ''}
            ₹{netTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
            {netTotal > 0
              ? 'Positive net equity across all groups'
              : netTotal < 0
              ? 'Negative balance — settlement needed'
              : 'All settled up! Zero debts'}
          </p>
        </div>
      </div>

      {/* Interactive Visual Balance Bar (Credit vs Debt Ratio) */}
      {totalVolume > 0 && (
        <div
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Financial Distribution Ratio
            </span>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--success)' }}>● Owed ({owedPercent}%)</span>
              <span style={{ color: 'var(--danger)' }}>● Owe ({100 - owedPercent}%)</span>
            </div>
          </div>
          {/* Dual Progress Meter */}
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 100, 124, 0.35)',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: `${owedPercent}%`,
                height: '100%',
                backgroundColor: 'var(--success)',
                boxShadow: '0 0 10px rgba(53, 224, 161, 0.5)',
                transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      )}

      {/* Two Column Layout: Your Groups & Recent Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Left Column: Your Groups */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Users size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Groups</h3>
              <span className="badge badge-primary">{groups.length}</span>
            </div>
            <Link
              to="/groups"
              className="text-violet"
              style={{ fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Users size={36} color="var(--primary)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
              <h4>No groups yet</h4>
              <p className="text-muted mt-1" style={{ fontSize: '0.88rem' }}>
                Create a group to start tracking expenses with friends or flatmates.
              </p>
              <Link to="/groups/new" className="btn btn-primary mt-3">
                <Plus size={16} /> Create Your First Group
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {groups.map((g) => (
                <Link
                  key={g.id}
                  to={`/groups/${g.id}`}
                  className="card"
                  style={{
                    padding: '1.15rem 1.35rem',
                    textDecoration: 'none',
                    display: 'block',
                    background: 'var(--surface)',
                  }}
                >
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, var(--surface-elevated) 0%, #20263B 100%)',
                          border: '1px solid var(--border)',
                          color: 'var(--primary-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}
                      >
                        {g.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{g.name}</h4>
                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {g.member_count} {g.member_count === 1 ? 'member' : 'members'} &bull; Created by {g.creator_name}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block' }}>Spent</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          ₹{Number(g.total_spent || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </strong>
                      </div>
                      <ArrowRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Expenses Ledger */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Receipt size={20} color="var(--secondary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Expenses</h3>
              <span className="badge badge-cyan">{recentExpenses.length}</span>
            </div>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Receipt size={36} color="var(--secondary)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
              <h4>No expenses logged</h4>
              <p className="text-muted mt-1" style={{ fontSize: '0.88rem' }}>
                Expenses logged across your groups will appear here in chronological order.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentExpenses.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/groups/${exp.group_id}`}
                  className="card"
                  style={{
                    padding: '1.15rem 1.35rem',
                    textDecoration: 'none',
                    display: 'block',
                    background: 'var(--surface)',
                  }}
                >
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(53, 214, 255, 0.1)',
                          border: '1px solid rgba(53, 214, 255, 0.25)',
                          color: 'var(--secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Receipt size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                            {exp.group_name}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                            Paid by <strong>{exp.paid_by_name}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="finance-number" style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                        ₹{Number(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(exp.expense_date || exp.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
