import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  BarChart3,
  Settings,
  Boxes,
  X,
  LogOut,
  Shield,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const MAIN_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const WORKSPACE_NAV = [
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Signed out of ProductHub', 'info');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`app-sidebar${isOpen ? ' open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--header-height)',
            padding: '0 18px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.35)',
              }}
            >
              <Boxes size={16} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  lineHeight: 1.1,
                }}
              >
                ProductHub
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost btn-icon md:hidden"
            onClick={onClose}
            style={{ display: 'flex', width: 28, height: 28 }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Navigation */}
          <div>
            <div
              style={{
                marginBottom: 6,
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Platform
            </div>
            {MAIN_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
                id={`nav-${label.toLowerCase()}`}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Workspace Settings */}
          <div>
            <div
              style={{
                marginBottom: 6,
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Workspace
            </div>
            {WORKSPACE_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
                id={`nav-${label.toLowerCase()}`}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: isAdmin ? 'var(--color-accent)' : 'var(--color-info)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12.5,
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.2,
                  }}
                  title={user?.name || 'User'}
                >
                  {user?.name || 'Operator'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 10,
                    fontWeight: 600,
                    color: isAdmin ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    letterSpacing: '0.02em',
                    marginTop: 2,
                  }}
                >
                  {isAdmin ? <Shield size={10} /> : <UserIcon size={10} />}
                  {user?.role || 'STAFF'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={handleLogout}
              title="Sign out"
              id="sidebar-logout-btn"
              style={{
                color: 'var(--color-text-muted)',
                width: 28,
                height: 28,
                flexShrink: 0,
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
