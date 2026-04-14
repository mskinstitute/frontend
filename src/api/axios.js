// src/api/axios.js

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logout, setAccessToken } from '../context/AuthHelpers';

// Clean up potentially invalid token values stored by older browsers or syncs.
// Some environments end up writing the literal strings 'null' or 'undefined' into localStorage.
// These cause backend JWT parsing errors like: "Given token not valid for any token type".
try {
  const badValues = new Set(['null', 'undefined', '']);
  const a = localStorage.getItem('access');
  const r = localStorage.getItem('refresh');
  if (a && badValues.has(String(a))) localStorage.removeItem('access');
  if (r && badValues.has(String(r))) localStorage.removeItem('refresh');
} catch (e) {
  // Access to localStorage may fail in some non-browser environments; ignore there.
  // eslint-disable-next-line no-console
  console.warn('Could not sanitize localStorage tokens', e);
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  // baseURL: 'https://api.shikohabad.in',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true // important for CORS with credentials
});

// Separate instance for external URLs (GitHub, etc.) without credentials
// to avoid CORS issues with services that don't support wildcard + credentials
export const externalInstance = axios.create({
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  withCredentials: false // No credentials for external services
});

let backendStatusReporter = null;

export const registerBackendStatusReporter = (reporter) => {
  backendStatusReporter = reporter;
};

export const clearBackendStatusReporter = () => {
  backendStatusReporter = null;
};

const notifyBackendStatus = (isAvailable) => {
  if (typeof backendStatusReporter === 'function') {
    backendStatusReporter(isAvailable);
  }
};

// -----------------------------
// Request Interceptor
// -----------------------------
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    // Protect against invalid tokens stored as literal strings 'null' or 'undefined'
    // Some browsers or storage syncs can write those strings which break JWT parsing on server.
    if (token && token !== 'null' && token !== 'undefined') {
      const trimmed = String(token).trim();
      if (trimmed) config.headers.Authorization = `Bearer ${trimmed}`;
    }
    // Remove Content-Type for FormData to let axios set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Refresh Token Handling
// -----------------------------
let isRefreshing = false;
let failedQueue = [];
let authFailed = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const clearAuthFailed = () => {
  authFailed = false;
};

// -----------------------------
// Response Interceptor
// -----------------------------
instance.interceptors.response.use(
  (response) => {
    notifyBackendStatus(true);
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};

    // Ignore canceled requests
    if (axios.isCancel(error)) return Promise.reject(error);

    // Network error (no response)
    if (!error.response) {
      // Only log and show toast for network errors not related to course-related requests
      const isCourseRelated = error.config.url?.includes('/courses/');
      if (!isCourseRelated) {
        console.error('⚠️ Network error:', error);
        toast.error('Network error. Please check your connection.');
      }
      notifyBackendStatus(false);
      return Promise.reject(error);
    }

    // Backend server error or unavailable
    if (error.response.status >= 500 && error.response.status < 600) {
      notifyBackendStatus(false);
    }

    // 401 Unauthorized → try refresh
      if (authFailed) {
        // Prevent refresh storms after repeated failures
        return Promise.reject(error);
      }

      const isAuthRequest = originalRequest.url?.includes('/auth/me/') || originalRequest.url?.includes('/auth/token/refresh/') || originalRequest.url?.includes('/auth/login/') || originalRequest.url?.includes('/auth/logout/');

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        // No refresh token available — do not force logout here.
        // Let callers handle unauthenticated flows (e.g., payment return pages).
        if (!isAuthRequest) {
          toast.error('Session expired. Please login to continue.');
        }
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${instance.defaults.baseURL}/auth/token/refresh/`,
          { refresh },
          { timeout: 10000 }
        );

        const newAccess = data.access;
        if (!newAccess) throw new Error('No access token in refresh response');

        // Save new token
        localStorage.setItem('access', newAccess);
        setAccessToken(newAccess);
        instance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Refresh failed — mark authFailed to avoid repeated refresh attempts
        authFailed = true;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        if (!isAuthRequest) {
          toast.error('Session expired. Please login to continue.');
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 Forbidden
    if (error.response.status === 403) {
      // Forbidden — do not auto-logout. Let the UI show permission denied.
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Other errors (4xx / 5xx)
    const message =
      error.response.data?.detail ||
      error.response.data?.message ||
      'Something went wrong. Please try again.';
    toast.error(message);

    return Promise.reject(error);
  }
);

export default instance;
