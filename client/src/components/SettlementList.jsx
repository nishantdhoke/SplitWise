import React from 'react';
import { ArrowRight, Check, CheckCircle2, Clock } from 'lucide-react';

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
          padding: '3rem 1.5rem',
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--success-subtle)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 15px rgba(53, 224, 161, 0.3)',
          }}
        >
          <CheckCircle2 size={28} />
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Everyone is Settled Up!</h4>
        <p className="text-muted mt-1" style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 0' }}>
          Zero debts remaining. FairShare has minimized and balanced all debts across group members.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
            className="card"
            style={{
              padding: '1.15rem 1.4rem',
              backgroundColor: isUserInvolved ? 'var(--surface-elevated)' : 'var(--surface)',
              border: isUserReceiver
                ? '1px solid rgba(53, 224, 161, 0.4)'
                : isUserPayer
                ? '1px solid rgba(255, 100, 124, 0.4)'
                : '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Payer Avatar -> Animated Arrow -> Receiver Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* Payer (Owes Money -> Coral) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger-dark)',
                    border: '1.5px solid var(--danger)',
                    color: 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 0 10px rgba(255, 100, 124, 0.25)',
                  }}
                >
                  {s.payerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isUserPayer ? 'var(--danger)' : 'var(--text-main)', display: 'block' }}>
                    {isUserPayer ? 'You' : s.payerName}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Payer (Owes)</span>
                </div>
              </div>

              {/* Dynamic Money Flow Track: Glowing ₹ traveling from Payer to Receiver */}
              <div
                className="money-flow-track"
                title={`₹${s.amount} transfer from ${isUserPayer ? 'You' : s.payerName} to ${isUserReceiver ? 'You' : s.receiverName}`}
                style={{ minWidth: '110px' }}
              >
                <div className="money-flow-line" />
                <div className="money-flow-token" title="In-flight settlement flow">
                  ₹
                </div>
                <span
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  pays
                </span>
              </div>

              {/* Receiver (Receives Money -> Mint) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-dark)',
                    border: '1.5px solid var(--success)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 0 10px rgba(53, 224, 161, 0.25)',
                  }}
                >
                  {s.receiverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isUserReceiver ? 'var(--success)' : 'var(--text-main)', display: 'block' }}>
                    {isUserReceiver ? 'You' : s.receiverName}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Receiver</span>
                </div>
              </div>
            </div>

            {/* Amount and Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div className="finance-number" style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                  {formattedAmount}
                </div>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Direct settlement</span>
              </div>

              {/* Authorization Gate: ONLY the Receiver can mark as paid */}
              {isUserReceiver && onMarkPaid ? (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onMarkPaid(s)}
                  title="Confirm receipt and mark payment as settled"
                  style={{ height: '38px', padding: '0 1rem' }}
                >
                  <Check size={16} />
                  <span>Mark as Paid</span>
                </button>
              ) : isUserPayer ? (
                <div
                  className="badge badge-warning"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title={`Only ${s.receiverName} is authorized to confirm and settle this payment`}
                >
                  <Clock size={13} />
                  <span>Awaiting {s.receiverName}'s confirmation</span>
                </div>
              ) : (
                <div
                  className="badge badge-primary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                >
                  <span>Pending</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
