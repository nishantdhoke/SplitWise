import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function BalanceCard({ balance, isCurrentUser }) {
  const isPositive = balance.netBalance > 0;
  const isNegative = balance.netBalance < 0;
  const isSettled = balance.netBalance === 0;

  const absVal = Math.abs(balance.netBalance || 0);

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem 1.4rem',
        background: 'var(--surface)',
        border: isPositive
          ? '1px solid rgba(53, 224, 161, 0.35)'
          : isNegative
          ? '1px solid rgba(255, 100, 124, 0.35)'
          : '1px solid var(--border)',
        boxShadow: isPositive
          ? '0 4px 15px rgba(53, 224, 161, 0.08)'
          : isNegative
          ? '0 4px 15px rgba(255, 100, 124, 0.08)'
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
              backgroundColor: isPositive
                ? 'var(--success-dark)'
                : isNegative
                ? 'var(--danger-dark)'
                : 'var(--surface-elevated)',
              border: isPositive
                ? '1.5px solid var(--success)'
                : isNegative
                ? '1.5px solid var(--danger)'
                : '1px solid var(--border)',
              color: isPositive
                ? 'var(--success)'
                : isNegative
                ? 'var(--danger)'
                : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            {balance.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{balance.name}</span>
              {isCurrentUser && (
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                  You
                </span>
              )}
            </div>
            <p className="text-muted" style={{ fontSize: '0.78rem' }}>{balance.email}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {isPositive && (
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
                Gets back
              </span>
              <div className="finance-number" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                <AnimatedCounter value={absVal} color="mint" prefix="+₹" />
              </div>
            </div>
          )}

          {isNegative && (
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase' }}>
                Owes
              </span>
              <div className="finance-number" style={{ fontSize: '1.25rem', color: 'var(--danger)' }}>
                <AnimatedCounter value={absVal} color="coral" prefix="-₹" />
              </div>
            </div>
          )}

          {isSettled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Settled</span>
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
          fontSize: '0.8rem',
        }}
      >
        <span>Paid: <strong>₹{Number(balance.totalPaid).toFixed(2)}</strong></span>
        <span>Share: <strong>₹{Number(balance.totalOwed).toFixed(2)}</strong></span>
      </div>
    </div>
  );
}
