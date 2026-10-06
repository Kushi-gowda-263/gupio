/**
 * Derives human-readable stock status from stockQuantity.
 * Mirrors the same rule defined in the backend virtual field.
 *   0          → "Out of Stock"
 *   1 – 10     → "Low Stock"
 *   > 10       → "In Stock"
 */
export const getStockStatus = (qty) => {
  if (qty === 0) return 'Out of Stock';
  if (qty <= 10) return 'Low Stock';
  return 'In Stock';
};

export const getStockBadgeClass = (status) => {
  switch (status) {
    case 'In Stock':    return 'badge badge-success';
    case 'Low Stock':   return 'badge badge-warning';
    case 'Out of Stock': return 'badge badge-danger';
    default:            return 'badge badge-neutral';
  }
};

/**
 * Formats a number as currency.
 */
export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value ?? 0);

/**
 * Formats an ISO date string to a readable short date.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

/**
 * Formats a date as relative time (e.g., "2 days ago").
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
};

/**
 * Truncates a string to a given length.
 */
export const truncate = (str, maxLength = 60) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
};

/**
 * Extracts a user-friendly error message from an axios error.
 */
export const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};
