import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { CheckCircle2, XCircle, RefreshCw, Database, Server, Monitor, ShieldCheck, Orbit } from 'lucide-react';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <span
            className="badge"
            style={{
              background: 'rgba(56, 217, 255, 0.15)',
              border: '1px solid rgba(56, 217, 255, 0.35)',
              color: 'var(--starlight-cyan)',
            }}
          >
            <Orbit size={13} />
            <span>NODE TELEMETRY</span>
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--star-white)', letterSpacing: '-0.03em' }}>
          Cosmic System Diagnostics
        </h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.95rem' }}>
          Real-time telemetry verification for React frontend, Express interstellar API, and MySQL connection pool.
        </p>
      </div>

      {/* Connection Verification Grid */}
      <div className="grid-2">
        {/* Frontend Status */}
        <div className="cosmic-panel">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(56, 217, 255, 0.12)', padding: '0.65rem', borderRadius: '12px', color: 'var(--starlight-cyan)' }}>
                <Monitor size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--star-white)' }}>Frontend Spacecraft</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>React 19 + Vite Interstellar Server</p>
              </div>
            </div>
            <span className="badge badge-success">
              <span className="cosmic-status-dot" style={{ width: '6px', height: '6px' }} />
              Active
            </span>
          </div>
          <div className="mt-3 text-muted" style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p><strong>Orbital Port:</strong> 5173</p>
            <p><strong>Proxy:</strong> <code>/api</code> requests routed to backend port 5000</p>
          </div>
        </div>

        {/* Backend & DB Status */}
        <div className="cosmic-panel">
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(124, 58, 237, 0.15)', padding: '0.65rem', borderRadius: '12px', color: 'var(--nebula-violet)' }}>
                <Server size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--star-white)' }}>Core Engine (API)</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>Node.js + Express.js Ledger Engine</p>
              </div>
            </div>
            {loading ? (
              <span className="cosmic-spinner"></span>
            ) : error ? (
              <span className="badge badge-danger">
                Offline
              </span>
            ) : (
              <span className="badge badge-success">
                Operational
              </span>
            )}
          </div>
          <div className="mt-3 text-muted" style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p><strong>Engine Port:</strong> 5000</p>
            <p><strong>Engine Uptime:</strong> {healthData ? `${healthData.uptimeSeconds}s` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* MySQL Database Card */}
      <div className="cosmic-panel">
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.12)', padding: '0.65rem', borderRadius: '12px', color: '#FBBF24' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--star-white)' }}>Cosmic Database (MySQL 8.0)</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem' }}>Connection Pool via <code>mysql2/promise</code></p>
            </div>
          </div>
          {loading ? (
            <span className="cosmic-spinner"></span>
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
          <div className="mt-3" style={{ background: 'rgba(6, 9, 20, 0.85)', padding: '0.85rem 1.15rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <p>Host: <code>{healthData.database.host}:{healthData.database.port}</code></p>
            <p style={{ marginTop: '4px' }}>Database: <code>{healthData.database.database}</code></p>
          </div>
        )}

        <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchHealth} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'cosmic-spinner' : ''} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Architecture & Security Summary */}
      <div className="cosmic-panel" style={{ borderLeft: '4px solid var(--starlight-cyan)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--star-white)' }}>
          <ShieldCheck size={20} color="var(--starlight-cyan)" />
          Cosmic Security & Cryptographic Protocols
        </h3>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.85rem', lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          <li>
            <strong>Decoupled Proxy:</strong> Vite proxies all <code>/api/*</code> requests directly to Express port 5000, eliminating CORS friction while keeping client and server cleanly segregated.
          </li>
          <li>
            <strong>Connection Pooling:</strong> <code>mysql2/promise</code> maintains 10 persistent reusable connections, drastically reducing latency compared to single connection per query.
          </li>
          <li>
            <strong>Cryptographic Authorization:</strong> Salted bcrypt passkey hashing with 10 rounds and signed JWT authentication tokens protecting all endpoints.
          </li>
        </ul>
      </div>
    </div>
  );
}
