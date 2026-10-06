import { getStockStatus } from '../utils/helpers.js';

/**
 * Stock status badge derived from stockQuantity.
 * 0      → "Out of Stock" (Red)
 * 1–10   → "Low Stock" (Amber)
 * > 10   → "In Stock" (Green)
 */
export default function StockBadge({ status, stockStatus, stockQuantity }) {
  const currentStatus = status || stockStatus || getStockStatus(stockQuantity ?? 0);

  let badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.01em',
  };

  let dotColor = 'var(--color-success)';

  if (currentStatus === 'Out of Stock') {
    badgeStyle = {
      ...badgeStyle,
      background: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      border: '1px solid rgba(220, 38, 38, 0.2)',
    };
    dotColor = 'var(--color-danger)';
  } else if (currentStatus === 'Low Stock') {
    badgeStyle = {
      ...badgeStyle,
      background: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
      border: '1px solid rgba(217, 119, 6, 0.2)',
    };
    dotColor = 'var(--color-warning)';
  } else {
    badgeStyle = {
      ...badgeStyle,
      background: 'var(--color-success-bg)',
      color: 'var(--color-success)',
      border: '1px solid rgba(5, 150, 105, 0.2)',
    };
    dotColor = 'var(--color-success)';
  }

  return (
    <span style={badgeStyle}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dotColor,
        }}
      />
      {currentStatus}
    </span>
  );
}
