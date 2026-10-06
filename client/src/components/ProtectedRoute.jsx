import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Boxes } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        gap: 16,
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
        }}>
          <Boxes size={22} color="white" />
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Initializing ProductHub...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
