import api from './api.js';

export const authService = {
  /**
   * Log in user with email & password.
   */
  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.data?.token) {
      localStorage.setItem('ph_token', res.data.data.token);
      localStorage.setItem('ph_user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  /**
   * Register a new user account.
   */
  register: async ({ name, email, password, role }) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data?.data?.token) {
      localStorage.setItem('ph_token', res.data.data.token);
      localStorage.setItem('ph_user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  /**
   * Fetch current authenticated user from token.
   */
  getMe: async () => {
    const res = await api.get('/auth/me');
    if (res.data?.data) {
      localStorage.setItem('ph_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  /**
   * Log out user and clean up storage.
   */
  logout: () => {
    localStorage.removeItem('ph_token');
    localStorage.removeItem('ph_user');
  },

  /**
   * Retrieve cached user or null.
   */
  getCachedUser: () => {
    try {
      const stored = localStorage.getItem('ph_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('ph_token'),
};
