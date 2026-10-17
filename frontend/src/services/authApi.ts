import {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ForgotPasswordResponse,
  CheckAvailabilityResponse
} from '@/types/auth';
import { BACKEND_API_URL } from '@/config/api';

const BASE_URL = BACKEND_API_URL;

export class AuthApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      let errorMsg = 'An error occurred during request.';
      if (data) {
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (typeof data === 'object') {
          // Format validation errors nicely
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          if (Array.isArray(firstVal)) {
            errorMsg = `${firstKey}: ${firstVal[0]}`;
          } else if (typeof firstVal === 'string') {
            errorMsg = `${firstKey}: ${firstVal}`;
          }
        }
      }
      throw new AuthApiError(errorMsg, res.status, data);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof AuthApiError) {
      throw err;
    }
    // Network or CORS failure
    throw new AuthApiError(
      err?.message?.includes('fetch')
        ? 'Could not connect to authentication server. Please ensure the backend is running.'
        : err?.message || 'Network error occurred.',
      0
    );
  }
}

export const authApi = {
  /**
   * Register a new user with required columns:
   * first_name, last_name, email, phone, password, gender
   */
  async checkAvailability(params: { email?: string; phone?: string }): Promise<CheckAvailabilityResponse> {
    const query = new URLSearchParams();
    if (params.email) query.set('email', params.email);
    if (params.phone) query.set('phone', params.phone);
    return request<CheckAvailabilityResponse>(`/api/auth/check-availability/?${query.toString()}`);
  },

  /**
   * Register a new user with required columns:
   * first_name, last_name, email, phone, password, gender, address
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return request<RegisterResponse>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login with identifier (username, email, or mobile) and password
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return request<LoginResponse>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Blacklist refresh token & clear server-side session
   */
  async logout(refreshToken: string, accessToken: string): Promise<{ detail: string }> {
    return request<{ detail: string }>('/api/auth/logout/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  /**
   * Refreshes access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ access: string; refresh?: string }> {
    return request<{ access: string; refresh?: string }>('/api/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  /**
   * Fetches current authenticated user profile
   */
  async getProfile(accessToken: string): Promise<AuthUser> {
    return request<AuthUser>('/api/auth/me/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Request password reset code
   */
  async forgotPassword(identifier: string): Promise<ForgotPasswordResponse> {
    return request<ForgotPasswordResponse>('/api/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  /**
   * Reset password with verification OTP
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ detail: string }> {
    return request<{ detail: string }>('/api/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
