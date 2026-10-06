import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

const iconMap = {
  success: <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />,
  error: <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0 }} />,
  warning: <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0 }} />,
  info: <Info size={16} color="var(--color-info)" style={{ flexShrink: 0 }} />,
};

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {iconMap[t.type] || iconMap.info}
          <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>{t.message}</span>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            style={{ width: 22, height: 22, padding: 0, color: 'var(--color-text-muted)' }}
            onClick={() => onRemove(t.id)}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
