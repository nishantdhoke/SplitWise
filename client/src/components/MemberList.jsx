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
              padding: '0.85rem 1rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: isThisMemberCreator ? '#fef3c7' : 'var(--primary-light)',
                  color: isThisMemberCreator ? '#b45309' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{member.name}</span>
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
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                  {member.email}
                </p>
              </div>
            </div>

            {canRemove && (
              <button
                className="btn btn-secondary"
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.8rem',
                  color: 'var(--danger)',
                  borderColor: '#fecaca',
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
