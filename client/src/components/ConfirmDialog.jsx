import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirmation dialog for destructive actions (e.g. deleting a product).
 * Renders with backdrop blur, enterprise typography, and danger communicating button.
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Delete product?',
  description = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmLabel = 'Delete Product',
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
                background: 'var(--color-danger-bg)',
                border: '1px solid var(--color-danger-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} color="var(--color-danger)" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {title}
              </h3>
              {description && (
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={onCancel}
              style={{ marginLeft: 'auto', flexShrink: 0, width: 28, height: 28 }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onConfirm}
              disabled={isLoading}
              id="confirm-delete-btn"
            >
              {isLoading ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
