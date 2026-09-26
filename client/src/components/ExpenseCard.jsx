import React from 'react';
import {
  Receipt,
  Calendar,
  User,
  Trash2,
  Eye,
  Utensils,
  Car,
  Plane,
  Hotel,
  House,
  ShoppingBag,
  Coffee,
  Clapperboard,
} from 'lucide-react';

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

  const getSplitLabel = () => {
    switch (expense.split_method) {
      case 'EQUAL':
        return 'Equal Split';
      case 'CUSTOM':
        return 'Custom Split';
      case 'PERCENTAGE':
        return 'Percentage Split';
      default:
        return 'Split';
    }
  };

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

  // Determine category icon from expense title
  const getCategoryIcon = () => {
    const title = (expense.title || '').toLowerCase();
    if (title.includes('food') || title.includes('dinner') || title.includes('lunch') || title.includes('pizza') || title.includes('burger') || title.includes('restaurant')) {
      return <Utensils size={20} />;
    }
    if (title.includes('coffee') || title.includes('cafe') || title.includes('tea') || title.includes('drink') || title.includes('beer')) {
      return <Coffee size={20} />;
    }
    if (title.includes('cab') || title.includes('taxi') || title.includes('uber') || title.includes('petrol') || title.includes('diesel') || title.includes('fuel')) {
      return <Car size={20} />;
    }
    if (title.includes('flight') || title.includes('airplane') || title.includes('air') || title.includes('travel')) {
      return <Plane size={20} />;
    }
    if (title.includes('hotel') || title.includes('resort') || title.includes('stay') || title.includes('airbnb')) {
      return <Hotel size={20} />;
    }
    if (title.includes('rent') || title.includes('flat') || title.includes('house') || title.includes('maintenance')) {
      return <House size={20} />;
    }
    if (title.includes('grocery') || title.includes('groceries') || title.includes('supermarket') || title.includes('shopping')) {
      return <ShoppingBag size={20} />;
    }
    if (title.includes('movie') || title.includes('cinema') || title.includes('theatre') || title.includes('show')) {
      return <Clapperboard size={20} />;
    }
    return <Receipt size={20} />;
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
          {getCategoryIcon()}
        </div>

        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--star-white)' }}>{expense.title}</h4>
          <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', marginTop: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <User size={12} color="var(--starlight-cyan)" />
              {isPayer ? <strong style={{ color: 'var(--star-white)' }}>You paid</strong> : `Paid by ${expense.payer_name}`}
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
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', marginTop: '2px' }}
          >
            {getSplitLabel()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewDetails(expense.id)}
            title="View split breakdown"
          >
            <Eye size={14} />
            <span>Details</span>
          </button>

          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm(`Delete expense "${expense.title}"?`)) {
                  onDelete(expense.id);
                }
              }}
              title="Delete expense"
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
