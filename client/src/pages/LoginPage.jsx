import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Boxes,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const from = location.state?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('STAFF');

  const handleQuickFill = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@gupio.dev');
      setPassword('Password123!');
      addToast('Populated Admin demo credentials', 'info');
    } else {
      setEmail('staff@gupio.dev');
      setPassword('Password123!');
      addToast('Populated Staff demo credentials', 'info');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your work email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Welcome back to ProductHub!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim();

    if (!trimmedName || !trimmedEmail || !regPassword) {
      setError('Please complete all fields to create your account.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid work email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: trimmedName,
        email: trimmedEmail.toLowerCase(),
        password: regPassword,
        role: regRole || 'STAFF',
      });
      addToast('Account created successfully! Welcome to ProductHub.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--color-bg)',
        position: 'relative',
      }}
    >
      {/* Theme Toggle in top right */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 20 }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          id="login-theme-toggle"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>

      {/* ─── LEFT HERO BRAND PANEL (Desktop Only) ─────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: '1 1 50%',
          backgroundColor: '#090d16',
          backgroundImage: 'radial-gradient(ellipse at 20% 20%, rgba(79, 70, 229, 0.18), transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(14, 165, 233, 0.12), transparent 70%)',
          color: '#ffffff',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          borderRight: '1px solid #1e293b',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Top Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
            }}
          >
            <Boxes size={20} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            ProductHub
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              letterSpacing: '0.05em',
            }}
          >
            ENTERPRISE
          </span>
        </div>

        {/* Center Tagline & Feature Highlights */}
        <div style={{ maxWidth: 480, position: 'relative', zIndex: 1, margin: '60px 0' }}>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 16px',
              color: '#ffffff',
            }}
          >
            Product intelligence, simplified.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#94a3b8', margin: '0 0 36px' }}>
            Unified catalog orchestration, automated inventory thresholds, and real-time financial valuation powered by MongoDB Atlas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                icon: TrendingUp,
                title: 'Real-Time Stock Analytics',
                desc: 'Automated health tracking across In Stock, Low Stock, and Out of Stock.',
              },
              {
                icon: Shield,
                title: 'Role-Based Access Governance',
                desc: 'Granular ADMIN and STAFF permissions enforced via JWT bearer verification.',
              },
              {
                icon: Layers,
                title: 'Instant Multi-Filter Discovery',
                desc: 'Sub-second faceted search, categorical segmentation, and price sorting.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(99, 102, 241, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Icon size={16} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: 12, color: '#64748b', position: 'relative', zIndex: 1 }}>
          Gupio Development Technical Assignment • Production System
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ────────────────────────────────────────────── */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile Logo Fallback */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 24, justifyContent: 'center' }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'var(--color-accent)',
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Boxes size={20} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              ProductHub
            </span>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                margin: '0 0 6px',
              }}
            >
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', margin: 0 }}>
              {mode === 'login'
                ? 'Sign in to access your inventory and product catalog.'
                : 'Set up your operator credentials to begin managing items.'}
            </p>
          </div>

          {/* Tab Switcher (Sign In / Register) */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-bg-subtle)',
              borderRadius: 8,
              padding: 3,
              marginBottom: 20,
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '7px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'login' ? 'var(--color-surface)' : 'transparent',
                color: mode === 'login' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '7px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'register' ? 'var(--color-surface)' : 'transparent',
                color: mode === 'register' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Register
            </button>
          </div>

          {/* Form Card */}
          <div className="card" style={{ padding: '24px' }}>
            {/* Error Message */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger-border)',
                  color: 'var(--color-danger)',
                  fontSize: 12.5,
                  marginBottom: 18,
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{error}</div>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="login-email">
                      Work Email
                    </label>
                    <div className="search-input-wrapper">
                      <Mail size={15} className="search-icon" />
                      <input
                        id="login-email"
                        type="email"
                        className="form-input"
                        placeholder="admin@gupio.dev"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => addToast('Please contact system administrator to reset credentials.', 'info')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: 12,
                          color: 'var(--color-accent)',
                          cursor: 'pointer',
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={15}
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--color-text-muted)',
                        }}
                      />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: 32, paddingRight: 36 }}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          position: 'absolute',
                          right: 2,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 30,
                          height: 30,
                        }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12.5,
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      Remember this workstation
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: 2 }}
                    disabled={loading}
                    id="login-submit-btn"
                  >
                    {loading ? 'Authenticating…' : 'Sign In'}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">
                      Full Name
                    </label>
                    <div className="search-input-wrapper">
                      <User size={15} className="search-icon" />
                      <input
                        id="reg-name"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Alex Morgan"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">
                      Work Email
                    </label>
                    <div className="search-input-wrapper">
                      <Mail size={15} className="search-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        className="form-input"
                        placeholder="alex@company.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">
                      Password (min. 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={15}
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--color-text-muted)',
                        }}
                      />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        style={{ paddingLeft: 32, paddingRight: 36 }}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          position: 'absolute',
                          right: 2,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 30,
                          height: 30,
                        }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Role Select */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-role">
                      Workspace Authority
                    </label>
                    <select
                      id="reg-role"
                      className="form-select"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                    >
                      <option value="STAFF">STAFF (Operator — View, Create, Edit)</option>
                      <option value="ADMIN">ADMIN (Full Permissions — Includes Delete)</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: 4 }}
                    disabled={loading}
                    id="register-submit-btn"
                  >
                    {loading ? 'Creating account…' : 'Create Operator Account'}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Credentials for Reviewers */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 10,
                }}
              >
                <Sparkles size={12} color="var(--color-accent)" />
                Evaluator Demo Access
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setMode('login'); handleQuickFill('admin'); }}
                  id="quick-fill-admin-btn"
                  style={{ justifyContent: 'center', fontSize: 12 }}
                >
                  <ShieldCheck size={14} color="var(--color-accent)" />
                  Admin
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setMode('login'); handleQuickFill('staff'); }}
                  id="quick-fill-staff-btn"
                  style={{ justifyContent: 'center', fontSize: 12 }}
                >
                  <UserCheck size={14} color="var(--color-info)" />
                  Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
