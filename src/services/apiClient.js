/**
 * Centralized API Client (Axios)
 * 
 * - Base URL from VITE_API_BASE_URL
 * - Auto-attaches JWT Bearer token from localStorage
 * - Auto-handles 401 (expired token → logout)
 * - Normalizes error responses
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ─── Request Interceptor: Attach JWT + Handle FormData ──────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set multipart/form-data with boundary for FormData uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 + Normalize errors ────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Auto-logout on 401 (token expired or invalid)
      if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Redirect to login only if not already on auth page
        if (!window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register') &&
            !window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/login';
        }
      }

      // Extract error message from various backend response formats
      const message =
        data?.error?.message ||
        data?.detail ||
        (Array.isArray(data?.detail) ? data.detail.map(d => d.msg).join(', ') : null) ||
        data?.message ||
        `Request failed with status ${status}`;

      return Promise.reject(new Error(message));
    }

    // Network error
    if (error.request) {
      return Promise.reject(new Error('Network error — backend may be offline'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
