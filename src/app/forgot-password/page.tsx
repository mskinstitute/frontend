'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  WifiOff,
  BookOpen,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, resetPassword } = useAuth();
  const { isServerOnline } = useServerStatus();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1: Request password reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = identifier.trim();
    if (!trimmed) {
      setError('Please enter your email, phone, or username.');
      return;
    }

    if (!isServerOnline) {
      setError('The authentication server is currently offline. Password reset is temporarily unavailable.');
      return;
    }

    setIsSubmitting(true);
    const res = await forgotPassword(trimmed);
    setIsSubmitting(false);

    if (res) {
      if (res.otp_preview) {
        setOtpPreview(res.otp_preview);
        setOtp(res.otp_preview); // pre-populate for demo convenience
      }
      setStep(2);
    }
  };

  // Step 2: Confirm reset with OTP and new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isServerOnline) {
      setError('The authentication server is currently offline. Password reset is temporarily unavailable.');
      return;
    }

    setIsSubmitting(true);
    const success = await resetPassword({
      identifier: identifier.trim(),
      otp: otp.trim(),
      new_password: newPassword,
    });
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-sky-50/30 to-orange-50/40 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-8 sm:p-10 relative z-10">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-secondary shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isSuccess
              ? 'Password Reset Complete'
              : step === 1
              ? 'Forgot Password?'
              : 'Set New Password'}
          </h1>
          <p className="text-slate-600 text-sm mt-1.5">
            {isSuccess
              ? 'Your password has been reset successfully. Redirecting you to login...'
              : step === 1
              ? 'Enter your registered email, phone, or username to receive a reset code.'
              : 'Enter the verification code and your new password below.'}
          </p>
        </div>

        {/* Server Offline Banner */}
        {!isServerOnline && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                <WifiOff className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-amber-950">Authentication Server Offline</h3>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  The backend server is currently offline. Password reset requires a live server connection, but you can continue browsing all tutorials, courses, and live batches freely!
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/tutorials"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs hover:bg-amber-100 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-secondary" />
                    <span>Browse Tutorials</span>
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs hover:bg-amber-100 transition-colors"
                  >
                    <span>Browse Courses</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Demo OTP Banner if present */}
        {otpPreview && step === 2 && !isSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Demo Verification Code:</strong> {otpPreview}
            </span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm shadow-md transition-colors"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : step === 1 ? (
          /* STEP 1 FORM */
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div>
              <label htmlFor="reset-identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username, Email, or Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="reset-identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sumit@mskinstitute.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isServerOnline}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all duration-150 disabled:pointer-events-none disabled:cursor-not-allowed ${
                !isServerOnline
                  ? 'bg-slate-200 text-slate-500 border border-slate-300 shadow-none'
                  : 'bg-secondary hover:bg-secondary-light text-white shadow-secondary/20 cursor-pointer disabled:opacity-60'
              }`}
            >
              {!isServerOnline ? (
                <>
                  <WifiOff className="w-4 h-4 text-slate-400" />
                  <span>Server Offline (Reset Unavailable)</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Code... Please wait</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2 FORM */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-center tracking-widest font-mono text-lg font-bold placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label htmlFor="new_password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all duration-150 disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Resetting Password... Please wait</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2"
            >
              ← Back to enter another email/username
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure
          </span>
        </div>
      </div>
    </div>
  );
}
