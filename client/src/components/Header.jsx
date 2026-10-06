import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Bell,
  ChevronRight,
  Shield,
  User as UserIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Header({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Compute breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbName = (part) => {
    switch (part) {
      case 'dashboard': return 'Overview';
      case 'products': return 'Products';
      case 'add': return 'Add Product';
      case 'edit': return 'Edit Product';
      case 'categories': return 'Categories';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      default: return part;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  return (
    <header className="app-header">
      {/* Mobile Menu Toggle */}
      <button
        className="btn btn-ghost btn-icon md:hidden"
        onClick={onMenuToggle}
        id="menu-toggle-btn"
        style={{ width: 32, height: 32, padding: 6 }}
      >
        <Menu size={17} />
      </button>

      {/* Breadcrumb Hierarchy */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }}
          className="hover:text-primary"
        >
          ProductHub
        </span>
        {pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1;
          return (
            <span key={part} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={13} color="var(--color-text-muted)" />
              <span
                style={{
                  color: isLast ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {breadcrumbName(part)}
              </span>
            </span>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Global Quick Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          position: 'relative',
          maxWidth: 260,
          width: '100%',
          display: 'none',
        }}
        className="sm:block"
      >
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search catalog... (Enter)"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="form-input"
            style={{
              height: 32,
              fontSize: 12.5,
              paddingLeft: 30,
              paddingRight: 10,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-subtle)',
            }}
          />
        </div>
      </form>

      {/* Notification Icon */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={() => addToast('No unread inventory alerts.', 'info')}
        title="Notifications"
        id="notifications-btn"
        style={{ width: 32, height: 32, position: 'relative' }}
      >
        <Bell size={15} />
        <span
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--color-accent)',
          }}
        />
      </button>

      {/* Theme Toggle (Sun/Moon) */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={toggleTheme}
        id="theme-toggle-btn"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ width: 32, height: 32 }}
      >
        {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
      </button>

      {/* User Menu Trigger & Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setUserMenuOpen((v) => !v)}
          style={{
            padding: '3px 8px',
            height: 32,
            gap: 7,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
          id="user-menu-btn"
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: isAdmin ? 'var(--color-accent)' : 'var(--color-info)',
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </button>

        {userMenuOpen && (
          <div
            className="dropdown-menu"
            style={{ right: 0, width: 190 }}
            onClick={() => setUserMenuOpen(false)}
          >
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {user?.email}
              </div>
            </div>

            <button
              className="dropdown-item"
              onClick={() => navigate('/settings')}
            >
              Workspace Settings
            </button>

            <button
              className="dropdown-item danger"
              onClick={() => {
                logout();
                addToast('Signed out successfully', 'info');
                navigate('/login');
              }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
