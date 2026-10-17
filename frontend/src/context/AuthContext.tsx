'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ForgotPasswordResponse
} from '@/types/auth';
import { authApi } from '@/services/authApi';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser | null>;
  register: (payload: RegisterPayload) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  forgotPassword: (identifier: string) => Promise<ForgotPasswordResponse | null>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'msk_auth_user';
const STORAGE_KEY_ACCESS = 'msk_auth_access';
const STORAGE_KEY_REFRESH = 'msk_auth_refresh';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage on client-side mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedAccess = localStorage.getItem(STORAGE_KEY_ACCESS);
      const storedRefresh = localStorage.getItem(STORAGE_KEY_REFRESH);

      if (storedAccess && storedUser) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (access: string, refresh: string, authUser: AuthUser) => {
    setUser(authUser);
    setAccessToken(access);
    setRefreshToken(refresh);
    try {
      localStorage.setItem(STORAGE_KEY_ACCESS, access);
      localStorage.setItem(STORAGE_KEY_REFRESH, refresh);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    } catch (e) {
      console.error('Failed to store session in localStorage:', e);
    }
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ACCESS);
      localStorage.removeItem(STORAGE_KEY_REFRESH);
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  };

  const login = async (payload: LoginPayload): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      const res = await authApi.login(payload);
      saveSession(res.access, res.refresh, res.user);
      toast.success(`Welcome back, ${res.user.first_name}!`);
      return res.user;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<AuthUser | null> => {
    try {
      setIsLoading(true);
      const res = await authApi.register(payload);
      saveSession(res.access, res.refresh, res.user);
      toast.success('Registration successful! Welcome to MSK Institute.');
      return res.user;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please check the form.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken && accessToken) {
        await authApi.logout(refreshToken, accessToken).catch(() => {});
      }
    } finally {
      clearSession();
      toast.success('You have been logged out.');
    }
  };

  const forgotPassword = async (identifier: string): Promise<ForgotPasswordResponse | null> => {
    try {
      setIsLoading(true);
      const res = await authApi.forgotPassword(identifier);
      toast.success(res.detail || 'Reset instructions sent!');
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Failed to request password reset.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await authApi.resetPassword(payload);
      toast.success(res.detail || 'Password reset successfully!');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Password reset failed. Invalid or expired code.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return;
    try {
      const profile = await authApi.getProfile(accessToken);
      setUser(profile);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
