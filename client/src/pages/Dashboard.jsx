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
} from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  const { summary, groups = [], recentExpenses = [] } = dashboardData || {};

  return (
    <div>
      {/* Welcome Banner */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700 }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Here is your overall expense and balance summary across all groups
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchDashboard} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <Link to="/groups/new" className="btn btn-primary">
            <Plus size={16} />
            Create Group
          </Link>
        </div>
      </div>

      {/* Financial Standing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Total You Are Owed */}
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="flex-between">
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              You are owed
            </span>
            <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.35rem', borderRadius: '50%' }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem' }}>
            ₹{Number(summary?.totalYouAreOwed || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Total amount others need to repay you
          </p>
        </div>

        {/* Total You Owe */}
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="flex-between">
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              You owe
            </span>
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.35rem', borderRadius: '50%' }}>
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger)', marginTop: '0.5rem' }}>
            ₹{Number(summary?.totalYouOwe || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Total amount you need to settle with friends
          </p>
        </div>

        {/* Overall Net Balance */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="flex-between">
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Net Balance
            </span>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.35rem', borderRadius: '50%' }}>
              <Scale size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              color:
                summary?.netTotal > 0
                  ? 'var(--success)'
                  : summary?.netTotal < 0
                  ? 'var(--danger)'
                  : 'var(--text-main)',
            }}
          >
            {summary?.netTotal > 0 ? '+' : ''}
            ₹{Number(summary?.netTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
            Across all {groups.length} active groups
          </p>
        </div>
      </div>

      {/* Two Column Section: Groups & Recent Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Your Groups */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Groups ({groups.length})</h3>
            <Link to="/groups" className="text-muted" style={{ fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, color: 'var(--primary)' }}>
              View All &rarr;
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <Users size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <h4>No groups yet</h4>
              <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                Create a group to start tracking shared expenses
              </p>
              <Link to="/groups/new" className="btn btn-primary mt-2">
                <Plus size={14} /> Create Group
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {groups.map((g) => (
                <div key={g.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {g.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{g.name}</h4>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {g.member_count} members &bull; Created by {g.creator_name}
                        </span>
                      </div>
                    </div>

                    <Link to={`/groups/${g.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
                      <span>Open</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Expenses Across Groups */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Expenses</h3>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Latest Activity</span>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <Receipt size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <h4>No expenses recorded yet</h4>
              <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                When anyone adds an expense in your groups, it will appear here
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentExpenses.map((exp) => (
                <div key={exp.id} className="card" style={{ padding: '0.85rem 1.15rem' }}>
                  <div className="flex-between">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{exp.title}</h4>
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                          {exp.group_name}
                        </span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                        Paid by {exp.paid_by === user?.id ? 'You' : exp.payer_name} &bull;{' '}
                        {new Date(exp.expense_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        ₹{Number(exp.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
