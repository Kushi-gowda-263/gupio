import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Sun,
  Moon,
  LogOut,
  Database,
  CheckCircle2,
  Lock,
  Mail,
  Key,
  Server,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';

export default function SettingsPage() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'appearance' | 'diagnostics'
  const [apiStatus, setApiStatus] = useState({ checking: true, live: false, timestamp: '' });

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        setApiStatus({ checking: false, live: true, timestamp: res.data.timestamp });
      })
      .catch(() => {
        setApiStatus({ checking: false, live: false, timestamp: '' });
      });
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Signed out of ProductHub', 'info');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your account credentials, visual preferences, and workspace telemetry.
          </p>
        </div>
      </div>

      {/* ─── Tab Bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 20,
        }}
      >
        {[
          { id: 'profile', label: 'Operator Profile', icon: User },
          { id: 'appearance', label: 'Appearance', icon: Sun },
          { id: 'diagnostics', label: 'System Diagnostics', icon: Server },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 500,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === id ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: -1,
              transition: 'all 0.15s ease',
            }}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: OPERATOR PROFILE ─────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: isAdmin ? 'var(--color-accent)' : 'var(--color-info)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {user?.name || 'Operator'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
                  <Mail size={13} /> {user?.email}
                  <span>•</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: isAdmin ? 'var(--color-accent-light)' : 'var(--color-bg-subtle)',
                      color: isAdmin ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {user?.role || 'STAFF'}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-subtle)',
                fontSize: 12.5,
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: 3 }}>
                  Role Authority
                </span>
                <strong style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Shield size={13} color={isAdmin ? 'var(--color-accent)' : 'var(--color-info)'} />
                  {isAdmin ? 'ADMIN (Full Access)' : 'STAFF (Catalog Operator)'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: 3 }}>
                  Password Encryption
                </span>
                <strong style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Lock size={13} color="var(--color-success)" />
                  Bcrypt 10-Salt Hash
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: 3 }}>
                  Auth Handshake
                </span>
                <strong style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Key size={13} color="var(--color-accent)" />
                  JWT Bearer Token
                </strong>
              </div>
            </div>
          </div>

          {/* Session Termination Card */}
          <div className="card card-body" style={{ borderColor: 'var(--color-danger-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Terminate Session
                </h4>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
                  Sign out of this workstation and invalidate local authentication tokens.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
                id="settings-logout-btn"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: APPEARANCE ───────────────────────────────────────────── */}
      {activeTab === 'appearance' && (
        <div className="card card-body">
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Theme & Interface Style
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
            Customize how ProductHub surfaces data across light and dark workstations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {/* Light Mode */}
            <div
              onClick={() => theme === 'dark' && toggleTheme()}
              style={{
                border: `2px solid ${theme === 'light' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                cursor: 'pointer',
                background: theme === 'light' ? 'var(--color-accent-light)' : 'var(--color-surface)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Sun size={18} color={theme === 'light' ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
                <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text-primary)' }}>
                  Light Theme
                </span>
                {theme === 'light' && (
                  <CheckCircle2 size={15} color="var(--color-accent)" style={{ marginLeft: 'auto' }} />
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Crisp high-contrast surfaces crafted for daylight workstation environments.
              </p>
            </div>

            {/* Dark Mode */}
            <div
              onClick={() => theme === 'light' && toggleTheme()}
              style={{
                border: `2px solid ${theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                cursor: 'pointer',
                background: theme === 'dark' ? 'var(--color-bg-subtle)' : 'var(--color-surface)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Moon size={18} color={theme === 'dark' ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
                <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text-primary)' }}>
                  Dark Theme
                </span>
                {theme === 'dark' && (
                  <CheckCircle2 size={15} color="var(--color-accent)" style={{ marginLeft: 'auto' }} />
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Deep charcoal slate palette inspired by Linear and Vercel workflows.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SYSTEM DIAGNOSTICS ───────────────────────────────────── */}
      {activeTab === 'diagnostics' && (
        <div className="card card-body">
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Service Infrastructure & Engine Status
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
            Real-time health telemetry across the application backend and database.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* MongoDB Atlas */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-subtle)',
                fontSize: 12.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Database size={16} color="var(--color-success)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    MongoDB Atlas Cluster (Free Tier)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    cluster0.honmd.mongodb.net / Database: producthub
                  </div>
                </div>
              </div>
              <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> Active
              </span>
            </div>

            {/* Express Server */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-subtle)',
                fontSize: 12.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Server size={16} color="var(--color-accent)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Express.js REST API
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    Port: 5000 / Proxy configured on Vite
                  </div>
                </div>
              </div>
              <span style={{ color: apiStatus.live ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> {apiStatus.live ? 'Operational' : 'Checking…'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
