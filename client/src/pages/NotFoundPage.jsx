import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, background: 'var(--color-bg)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', margin: '16px 0 8px' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 28 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Go Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            <Home size={14} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
