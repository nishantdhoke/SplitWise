import React from 'react';
import { Receipt, Calendar, User, Trash2, Eye, Orbit } from 'lucide-react';

export default function ExpenseCard({
  expense,
  currentUserId,
  isGroupCreator,
  onViewDetails,
  onDelete,
}) {
  const isPayer = expense.paid_by === currentUserId;
  const canDelete = isPayer || isGroupCreator;

  const formattedDate = new Date(expense.expense_date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedAmount = Number(expense.amount).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const getSplitBadgeColor = () => {
    switch (expense.split_method) {
      case 'EQUAL':
        return 'badge-success';
      case 'CUSTOM':
        return 'badge-warning';
      case 'PERCENTAGE':
        return 'badge-primary';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div
      className="cosmic-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.15rem 1.4rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(8, 13, 29, 0.9) 100%)',
            border: '1px solid rgba(155, 92, 255, 0.4)',
            color: 'var(--starlight-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(124, 58, 237, 0.25)',
          }}
        >
          <Receipt size={20} />
        </div>

        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--star-white)' }}>{expense.title}</h4>
          <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', marginTop: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <User size={12} color="var(--starlight-cyan)" />
              {isPayer ? <strong style={{ color: 'var(--star-white)' }}>You supplied</strong> : `Supplied by ${expense.payer_name}`}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div
            className="finance-number"
            style={{
              fontSize: '1.25rem',
              color: 'var(--star-white)',
              textShadow: '0 0 10px rgba(56, 217, 255, 0.35)',
            }}
          >
            {formattedAmount}
          </div>
          <span
            className={`badge ${getSplitBadgeColor()}`}
            style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', marginTop: '2px' }}
          >
            {expense.split_method} ORBIT
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewDetails(expense.id)}
            title="Inspect orbital split breakdown"
          >
            <Eye size={14} />
            <span>Breakdown</span>
          </button>

          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm(`Expunge expense transmission "${expense.title}"?`)) {
                  onDelete(expense.id);
                }
              }}
              title="Expunge expense"
              style={{ padding: '0 0.65rem' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
