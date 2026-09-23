import React from 'react';
import { Receipt, Calendar, User, Trash2, Eye } from 'lucide-react';

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
        return 'badge-secondary';
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Receipt size={22} />
        </div>

        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{expense.title}</h4>
          <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', marginTop: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <User size={12} />
              {isPayer ? 'Paid by You' : `Paid by ${expense.payer_name}`}
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
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {formattedAmount}
          </div>
          <span
            className={`badge ${getSplitBadgeColor()}`}
            style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', marginTop: '2px' }}
          >
            {expense.split_method} SPLIT
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => onViewDetails(expense.id)}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            title="View split breakdown"
          >
            <Eye size={14} />
            <span>Split</span>
          </button>

          {canDelete && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (window.confirm(`Delete expense "${expense.title}"?`)) {
                  onDelete(expense.id);
                }
              }}
              style={{
                padding: '0.4rem 0.6rem',
                fontSize: '0.85rem',
                color: 'var(--danger)',
                borderColor: '#fecaca',
              }}
              title="Delete expense"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
