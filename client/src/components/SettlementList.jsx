import React from 'react';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';

export default function SettlementList({
  settlements = [],
  currentUserId,
  onMarkPaid,
}) {
  if (settlements.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          backgroundColor: '#f8fafc',
        }}
      >
        <CheckCircle2 size={32} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Everyone is Settled Up!</h4>
        <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
          There are no pending debts or repayments needed in this group right now.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {settlements.map((s, idx) => {
        const isUserPayer = s.payerId === currentUserId;
        const isUserReceiver = s.receiverId === currentUserId;
        const isUserInvolved = isUserPayer || isUserReceiver;

        const formattedAmount = Number(s.amount).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 2,
        });

        return (
          <div
            key={`${s.payerId}-${s.receiverId}-${idx}`}
            className="flex-between"
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#ffffff',
              border: isUserInvolved ? '1px solid #c7d2fe' : '1px solid var(--border)',
              borderRadius: '8px',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {/* Payer and Receiver Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger-light)',
                    color: 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {s.payerName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {isUserPayer ? 'You' : s.payerName}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.85rem' }}>pays</span>
                <ArrowRight size={16} color="var(--primary)" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {s.receiverName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {isUserReceiver ? 'You' : s.receiverName}
                </span>
              </div>
            </div>

            {/* Amount and Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {formattedAmount}
              </span>

              {isUserReceiver && onMarkPaid ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => onMarkPaid(s)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  title="Confirm and mark this payment as settled"
                >
                  <Check size={14} color="var(--success)" />
                  <span>Mark as Paid</span>
                </button>
              ) : isUserPayer ? (
                <span
                  className="badge badge-warning"
                  style={{ fontSize: '0.78rem', textTransform: 'none', fontWeight: 500 }}
                  title={`Only ${s.receiverName} (receiver) is authorized to mark this settlement as paid`}
                >
                  Waiting for confirmation
                </span>
              ) : (
                <span
                  style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
                  title="Only the receiver is authorized to mark this settlement as paid"
                >
                  Pending
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
