import React from 'react';
import { Crown, UserX, LogOut } from 'lucide-react';

export default function MemberList({
  members = [],
  currentUser,
  creatorId,
  isCreator,
  onRemoveMember,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {members.map((member) => {
        const isThisMemberCreator = member.id === creatorId;
        const isMe = member.id === currentUser?.id;
        const canRemove = (isCreator && !isThisMemberCreator) || (!isCreator && isMe);

        return (
          <div
            key={member.id}
            className="flex-between"
            style={{
              padding: '0.95rem 1.15rem',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isThisMemberCreator ? 'rgba(251, 191, 36, 0.15)' : 'var(--primary-subtle)',
                  border: isThisMemberCreator ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1.5px solid rgba(124, 92, 252, 0.3)',
                  color: isThisMemberCreator ? 'var(--warning)' : 'var(--primary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{member.name}</span>
                  {isThisMemberCreator && (
                    <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                      <Crown size={10} /> Creator
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
                  color: 'var(--danger)',
                  borderColor: 'rgba(255, 100, 124, 0.3)',
                }}
                onClick={() => {
                  const confirmMsg = isMe
                    ? 'Are you sure you want to leave this group?'
                    : `Remove ${member.name} from the group?`;
                  if (window.confirm(confirmMsg)) {
                    onRemoveMember(member.id);
                  }
                }}
                title={isMe ? 'Leave Group' : 'Remove Member'}
              >
                {isMe ? (
                  <>
                    <LogOut size={13} />
                    <span>Leave</span>
                  </>
                ) : (
                  <>
                    <UserX size={13} />
                    <span>Remove</span>
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
