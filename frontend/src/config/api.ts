/**
 * Centralized API & Backend URL configuration.
 * In production (e.g. Vercel), defaults to the live Render backend URL.
 * In development, defaults to local Django server at http://localhost:8000.
 */
export const BACKEND_API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://backend-7h7f.onrender.com'
    : 'http://localhost:8000');
