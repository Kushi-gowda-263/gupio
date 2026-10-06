import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCachedUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  // Validate or refresh session on app mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Token invalid or expired
        console.warn('Session expired or invalid:', err.message);
        authService.logout();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.user && res.data?.token) {
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    if (res.data?.user && res.data?.token) {
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'STAFF',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
