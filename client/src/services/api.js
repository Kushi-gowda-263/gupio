import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ph_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages from the server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      error.message = data.errors
        .map((e) => (typeof e === 'string' ? e : e.message))
        .filter(Boolean)
        .join(', ');
    } else if (data?.message) {
      error.message = data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
