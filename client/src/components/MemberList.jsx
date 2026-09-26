import React from 'react';
import { Crown, UserX, LogOut, Compass } from 'lucide-react';

export default function MemberList({
  members = [],
  currentUser,
  creatorId,
  isCreator,
  onRemoveMember,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {members.map((member) => {
        const isThisMemberCreator = member.id === creatorId;
        const isMe = member.id === currentUser?.id;
        const canRemove = (isCreator && !isThisMemberCreator) || (!isCreator && isMe);

        return (
          <div
            key={member.id}
            className="flex-between"
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(6, 9, 20, 0.85)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isThisMemberCreator
                    ? 'radial-gradient(circle at 35% 35%, #FDE047 0%, #D97706 70%, #03040B 100%)'
                    : 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
                  border: isThisMemberCreator ? '1.5px solid rgba(251, 191, 36, 0.5)' : '1.5px solid rgba(56, 217, 255, 0.4)',
                  color: '#F8FAFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: isThisMemberCreator ? '0 0 14px rgba(251, 191, 36, 0.35)' : '0 0 14px rgba(56, 217, 255, 0.3)',
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--star-white)' }}>{member.name}</span>
                  {isThisMemberCreator && (
                    <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                      <Crown size={10} /> Captain
                    </span>
                  )}
                  {isMe && (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                      You
                    </span>
                  )}
                </div>
                <p className="text-muted" style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                  {member.email}
                </p>
              </div>
            </div>

            {canRemove && (
              <button
                className="btn btn-secondary btn-sm"
                style={{
                  color: 'var(--cosmic-negative)',
                  borderColor: 'rgba(251, 113, 133, 0.35)',
                }}
                onClick={() => {
                  const confirmMsg = isMe
                    ? 'Are you sure you want to abandon orbit and leave this planetary world?'
                    : `Disembark crew member ${member.name} from orbit?`;
                  if (window.confirm(confirmMsg)) {
                    onRemoveMember(member.id);
                  }
                }}
                title={isMe ? 'Abandon Orbit' : 'Disembark Member'}
              >
                {isMe ? (
                  <>
                    <LogOut size={13} />
                    <span>Abandon Orbit</span>
                  </>
                ) : (
                  <>
                    <UserX size={13} />
                    <span>Disembark</span>
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
