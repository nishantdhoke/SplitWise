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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          System Operational Diagnostics
        </h1>
        <p className="text-muted mt-1" style={{ fontSize: '1rem' }}>
          Real-time health verification for React frontend, Express API, and MySQL connection pool.
        </p>
      </div>

      {/* Connection Verification Grid */}
      <div className="grid-2">
        {/* Frontend Status */}
        <div className="glass-card">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ background: 'var(--primary-subtle)', padding: '0.65rem', borderRadius: '12px', color: 'var(--primary-hover)' }}>
                <Monitor size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Frontend (Client)</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>React 19 + Vite Dev Server</p>
              </div>
            </div>
            <span className="badge badge-success">
              <span className="status-dot online"></span>
              Online
            </span>
          </div>
          <div className="mt-3 text-muted" style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p><strong>Port:</strong> 5173</p>
            <p><strong>Proxy:</strong> <code>/api</code> requests routed to backend port 5000</p>
          </div>
        </div>

        {/* Backend & DB Status */}
        <div className="glass-card">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ background: 'var(--secondary-subtle)', padding: '0.65rem', borderRadius: '12px', color: 'var(--secondary)' }}>
                <Server size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Backend (Server)</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>Node.js + Express.js API</p>
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
          <div className="mt-3 text-muted" style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p><strong>Port:</strong> 5000</p>
            <p><strong>Uptime:</strong> {healthData ? `${healthData.uptimeSeconds}s` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* MySQL Database Card */}
      <div className="glass-card">
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'var(--warning-subtle)', padding: '0.65rem', borderRadius: '12px', color: 'var(--warning)' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Database (MySQL 8.0)</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem' }}>Connection Pool via <code>mysql2/promise</code></p>
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
              Connection Pending
            </span>
          )}
        </div>

        {healthData?.database?.connected && (
          <div className="mt-3" style={{ background: 'var(--surface-elevated)', padding: '0.85rem 1.15rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <p>Host: <code>{healthData.database.host}:{healthData.database.port}</code></p>
            <p style={{ marginTop: '4px' }}>Database: <code>{healthData.database.database}</code></p>
          </div>
        )}

        <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchHealth} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Architecture & Security Summary */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          Enterprise Security & Connection Architecture
        </h3>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.85rem', lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          <li>
            <strong>Decoupled Proxy:</strong> Vite proxies all <code>/api/*</code> requests directly to Express port 5000, eliminating CORS friction while keeping client and server cleanly segregated.
          </li>
          <li>
            <strong>Connection Pooling:</strong> <code>mysql2/promise</code> maintains 10 persistent reusable connections, drastically reducing latency compared to single connection per query.
          </li>
          <li>
            <strong>Security & Cryptography:</strong> Salted bcrypt password hashing with 10 rounds and signed JWT authentication tokens protecting all endpoints.
          </li>
        </ul>
      </div>
    </div>
  );
}
