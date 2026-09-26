import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Orbit } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function BalanceCard({ balance, isCurrentUser }) {
  const isPositive = balance.netBalance > 0;
  const isNegative = balance.netBalance < 0;
  const isSettled = balance.netBalance === 0;

  const absVal = Math.abs(balance.netBalance || 0);

  return (
    <div
      className="cosmic-panel"
      style={{
        padding: '1.35rem 1.5rem',
        border: isPositive
          ? '1px solid rgba(52, 211, 153, 0.4)'
          : isNegative
          ? '1px solid rgba(251, 113, 133, 0.4)'
          : '1px solid var(--border)',
        boxShadow: isPositive
          ? '0 6px 20px rgba(52, 211, 153, 0.12)'
          : isNegative
          ? '0 6px 20px rgba(251, 113, 133, 0.12)'
          : 'none',
      }}
    >
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isPositive
                ? 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 70%, #03040B 100%)'
                : isNegative
                ? 'radial-gradient(circle at 35% 35%, #FDA4AF 0%, #E11D48 70%, #03040B 100%)'
                : 'radial-gradient(circle at 35% 35%, #94A3B8 0%, #334155 70%, #03040B 100%)',
              border: isPositive
                ? '1.5px solid rgba(52, 211, 153, 0.6)'
                : isNegative
                ? '1.5px solid rgba(251, 113, 133, 0.6)'
                : '1.5px solid var(--border)',
              color: isPositive ? '#03040B' : '#F8FAFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: isPositive
                ? '0 0 14px rgba(52, 211, 153, 0.35)'
                : isNegative
                ? '0 0 14px rgba(251, 113, 133, 0.35)'
                : 'none',
            }}
          >
            {balance.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--star-white)' }}>
                {balance.name}
              </span>
              {isCurrentUser && (
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                  You
                </span>
              )}
            </div>
            <p className="text-muted" style={{ fontSize: '0.76rem' }}>{balance.email}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {isPositive && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cosmic-positive)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Gets Back
              </span>
              <div className="finance-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>
                <AnimatedCounter value={absVal} color="mint" prefix="+₹" />
              </div>
            </div>
          )}

          {isNegative && (
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cosmic-negative)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Owes
              </span>
              <div className="finance-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>
                <AnimatedCounter value={absVal} color="coral" prefix="-₹" />
              </div>
            </div>
          )}

          {isSettled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} color="var(--starlight-cyan)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--starlight-cyan)' }}>
                Settled Up
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex-between text-muted"
        style={{
          marginTop: '1.15rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.78rem',
        }}
      >
        <span>Contributed: <strong style={{ color: 'var(--star-white)' }}>₹{Number(balance.totalPaid).toFixed(2)}</strong></span>
        <span>Their share: <strong style={{ color: 'var(--star-white)' }}>₹{Number(balance.totalOwed).toFixed(2)}</strong></span>
      </div>
    </div>
  );
}
