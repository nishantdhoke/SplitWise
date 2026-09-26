import React from 'react';
import { Check, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

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
          padding: '3.5rem 1.5rem',
          background: 'var(--space-panel)',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(3, 4, 11, 0.8) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.5)',
            color: 'var(--cosmic-positive)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 25px rgba(52, 211, 153, 0.35)',
          }}
        >
          <CheckCircle2 size={30} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--star-white)' }}>
          All Debts Settled
        </h4>
        <p className="text-muted mt-1" style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 0' }}>
          Zero debt remaining. Everyone in this group is fully settled up!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
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
              padding: '1.25rem 1.5rem',
              backgroundColor: isUserInvolved ? 'rgba(13, 20, 41, 0.85)' : 'var(--space-panel)',
              border: isUserReceiver
                ? '1px solid rgba(52, 211, 153, 0.45)'
                : isUserPayer
                ? '1px solid rgba(251, 113, 133, 0.45)'
                : '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            {/* Payer ──── Payment Flow ────> Receiver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* Payer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FDA4AF 0%, #E11D48 70%, #03040B 100%)',
                    border: '1.5px solid rgba(251, 113, 133, 0.6)',
                    color: '#F8FAFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxShadow: '0 0 14px rgba(251, 113, 133, 0.35)',
                  }}
                >
                  {s.payerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isUserPayer ? 'var(--cosmic-negative)' : 'var(--star-white)',
                      display: 'block',
                    }}
                  >
                    {isUserPayer ? 'You' : s.payerName}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    Owes
                  </span>
                </div>
              </div>

              {/* Glowing Payment Path: Money Traveling from Payer to Receiver */}
              <div
                className="orbital-path-track"
                title={`Settlement of ₹${s.amount} from ${isUserPayer ? 'You' : s.payerName} to ${isUserReceiver ? 'You' : s.receiverName}`}
                style={{ minWidth: '120px' }}
              >
                <div className="orbital-path-line" />
                <div className="orbital-energy-pulse" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: 'var(--starlight-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Pays
                </span>
              </div>

              {/* Receiver */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #6EE7B7 0%, #059669 70%, #03040B 100%)',
                    border: '1.5px solid rgba(52, 211, 153, 0.6)',
                    color: '#03040B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxShadow: '0 0 14px rgba(52, 211, 153, 0.35)',
                  }}
                >
                  {s.receiverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isUserReceiver ? 'var(--cosmic-positive)' : 'var(--star-white)',
                      display: 'block',
                    }}
                  >
                    {isUserReceiver ? 'You' : s.receiverName}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    Gets
                  </span>
                </div>
              </div>
            </div>

            {/* Amount and Settlement Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  className="finance-number"
                  style={{
                    fontSize: '1.35rem',
                    color: 'var(--star-white)',
                    textShadow: '0 0 14px rgba(56, 217, 255, 0.4)',
                  }}
                >
                  {formattedAmount}
                </div>
                <span className="text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  Settlement
                </span>
              </div>

              {/* Authorization Gate: ONLY the Receiver can settle the debt */}
              {isUserReceiver && onMarkPaid ? (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onMarkPaid(s)}
                  title="Confirm payment reception and mark debt as settled"
                  style={{ height: '38px', padding: '0 1.1rem' }}
                >
                  <Check size={16} />
                  <span>Mark as Paid</span>
                </button>
              ) : isUserPayer ? (
                <div
                  className="badge badge-warning"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                  title={`Only ${s.receiverName} is authorized to confirm and mark this as paid`}
                >
                  <Clock size={13} />
                  <span>Awaiting {s.receiverName}'s confirmation</span>
                </div>
              ) : (
                <div
                  className="badge badge-primary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <Clock size={12} />
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
