import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { CheckCircle2, XCircle, RefreshCw, Database, Server, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StatusCheck() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div>
      {/* Hero Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
          FairShare — Expense Splitting Application
        </h1>
        <p className="text-muted mt-1" style={{ fontSize: '1.05rem' }}>
          Phase 1 Foundation: React + Vite Frontend, Express Backend, and MySQL Connection.
        </p>
      </div>

      {/* Connection Verification Grid */}
      <div className="grid-2">
        {/* Frontend Status */}
        <div className="card">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4338ca' }}>
                <Monitor size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Frontend (Client)</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>React 19 + Vite Dev Server</p>
              </div>
            </div>
            <span className="badge badge-success">
              <span className="status-dot online"></span>
              Online
            </span>
          </div>
          <div className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
            <p><strong>Port:</strong> 5173</p>
            <p><strong>Proxy:</strong> <code>/api</code> requests routed to backend port 5000</p>
          </div>
        </div>

        {/* Backend & DB Status */}
        <div className="card">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', color: '#047857' }}>
                <Server size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Backend (Server)</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Node.js + Express.js API</p>
              </div>
            </div>
            {loading ? (
              <span className="spinner"></span>
            ) : error ? (
              <span className="badge badge-danger">
                <span className="status-dot offline"></span>
                Offline
              </span>
            ) : (
              <span className="badge badge-success">
                <span className="status-dot online"></span>
                Operational
              </span>
            )}
          </div>
          <div className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
            <p><strong>Port:</strong> 5000</p>
            <p><strong>Uptime:</strong> {healthData ? `${healthData.uptimeSeconds}s` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* MySQL Database Card */}
      <div className="card mt-2">
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '8px', color: '#b45309' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Database (MySQL)</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Connection Pool via <code>mysql2/promise</code></p>
            </div>
          </div>
          {loading ? (
            <span className="spinner"></span>
          ) : healthData?.database?.connected ? (
            <span className="badge badge-success">
              <CheckCircle2 size={14} />
              Connected ({healthData.database.database})
            </span>
          ) : (
            <span className="badge badge-warning">
              <XCircle size={14} />
              Pending Credentials
            </span>
          )}
        </div>

        {healthData?.database?.connected && (
          <div className="mt-2" style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <p>Host: <code>{healthData.database.host}:{healthData.database.port}</code></p>
            <p>Database: <code>{healthData.database.database}</code></p>
            {healthData.database.note && <p style={{ color: 'var(--success)' }}>Note: {healthData.database.note}</p>}
          </div>
        )}

        {healthData?.database?.connected === false && (
          <div className="mt-2" style={{ background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem', color: '#991b1b' }}>
            <p><strong>MySQL Error:</strong> {healthData.database.error}</p>
            <p className="mt-1" style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
              Tip: Update your MySQL password in <code>server/.env</code> if your MySQL root account requires a password.
            </p>
          </div>
        )}

        <div className="mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={fetchHealth} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Developer Learning Walkthrough Box */}
      <div className="card mt-3" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          Phase 1 Architecture & Learning Summary
        </h3>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--text-main)' }}>
          <li>
            <strong>How React speaks to Express:</strong> In development, Vite runs on port <code>5173</code> and Express on port <code>5000</code>.
            Vite's <code>vite.config.js</code> proxies all <code>/api/*</code> requests directly to port 5000, eliminating browser CORS issues.
          </li>
          <li>
            <strong>Connection Pooling:</strong> Instead of opening and closing an expensive new connection for every query, <code>mysql2/promise</code> maintains a pool of 10 reusable connections.
          </li>
          <li>
            <strong>Folder Separation:</strong> <code>client/</code> and <code>server/</code> are completely decoupled with their own <code>package.json</code>, clean controllers, routes, and services.
          </li>
        </ul>
      </div>

      {/* Next Phase Indicator */}
      <div className="card mt-2" style={{ background: 'var(--primary-light)', border: '1px solid #c7d2fe' }}>
        <div className="flex-between">
          <div>
            <h4 style={{ color: 'var(--primary)', fontWeight: 600 }}>Ready for Phase 2: Database Schema & Authentication</h4>
            <p style={{ fontSize: '0.85rem', color: '#4338ca', marginTop: '0.25rem' }}>
              Next step will create user tables, implement secure bcrypt password hashing, and JWT register/login endpoints.
            </p>
          </div>
          <span className="badge badge-primary" style={{ background: 'var(--primary)', color: '#ffffff' }}>
            Up Next <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
