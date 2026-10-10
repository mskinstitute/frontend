export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | string;
  role?: string;
  picture?: string | null;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  id: number;
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RegisterResponse {
  detail: string;
  id: number;
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  gender: 'male' | 'female' | 'other';
}

export interface LoginPayload {
  identifier: string; // username, email, or mobile number
  password: string;
}

export interface ForgotPasswordResponse {
  detail: string;
  identifier: string;
  otp_preview?: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  otp: string;
  new_password: string;
}
