'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError('Please enter your username, email, or mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const success = await login({
      identifier: trimmedIdentifier,
      password,
    });
    setIsSubmitting(false);

    if (success) {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-sky-50/30 to-orange-50/40 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden relative z-10">
        
        {/* Left Side: Brand Showcase & Highlights */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-[#0f345c] to-primary-light text-white p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-secondary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary-light text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Student & Member Portal</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back to <span className="text-secondary">MSK Institute</span>
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Log in to access your course materials, live lab sessions, verified certificates, and coding playground.
            </p>
          </div>

          <div className="space-y-4 my-8 relative z-10">
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Multi-Identifier Login (Username, Email, or Mobile)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Full Access to Hands-on Coding Labs</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Secure JWT Session Management</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Shikohabad, Uttar Pradesh</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO Certified
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2 lg:hidden">
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span>MSK Institute Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Enter your credentials to continue your learning journey.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier input (username, email, or mobile) */}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username, Email, or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sumit, sumit@gmail.com, or +919876543210"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                You can log in with your registered username, email address, or phone number.
              </p>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-secondary hover:text-secondary-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
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

            {/* Remember me & Security badge */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary border-slate-300"
                />
                <span className="text-slate-600 text-xs">Remember this device</span>
              </label>

              <span className="text-slate-600 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account yet?{' '}
              <Link
                href={`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                className="font-bold text-secondary hover:text-secondary-light underline-offset-4 hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
