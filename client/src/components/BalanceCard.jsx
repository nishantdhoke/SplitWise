import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

export default function BalanceCard({ balance, isCurrentUser }) {
  const isPositive = balance.netBalance > 0;
  const isNegative = balance.netBalance < 0;
  const isSettled = balance.netBalance === 0;

  const absAmount = Math.abs(balance.netBalance).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        borderLeft: isPositive
          ? '4px solid var(--success)'
          : isNegative
          ? '4px solid var(--danger)'
          : '4px solid var(--text-muted)',
      }}
    >
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isPositive
                ? 'var(--success-light)'
                : isNegative
                ? 'var(--danger-light)'
                : '#f1f5f9',
              color: isPositive
                ? 'var(--success)'
                : isNegative
                ? 'var(--danger)'
                : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {balance.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{balance.name}</span>
              {isCurrentUser && (
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  You
                </span>
              )}
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{balance.email}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {isPositive && (
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase' }}>
                Gets back
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
                +{absAmount}
              </div>
            </div>
          )}

          {isNegative && (
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase' }}>
                Owes
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>
                -{absAmount}
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
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.8rem',
        }}
      >
        <span>Paid: ₹{Number(balance.totalPaid).toFixed(2)}</span>
        <span>Share Owed: ₹{Number(balance.totalOwed).toFixed(2)}</span>
      </div>
    </div>
  );
}
