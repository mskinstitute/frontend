'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  AlertCircle,
  Building2,
  Users,
  Share2,
  WifiOff,
  BookOpen,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { getRoleDashboardUrl } from '@/lib/roleNavigation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isServerOnline } = useServerStatus();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registered = searchParams.get('registered') === '1';
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (emailParam) {
      setIdentifier(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const target = redirectUrl && redirectUrl !== '/' ? redirectUrl : getRoleDashboardUrl(user.role);
      router.push(target);
    }
  }, [isAuthenticated, user, redirectUrl, router]);

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

    if (!isServerOnline) {
      setError('The authentication server is currently offline. Sign in is only needed for dashboards; you can freely browse tutorials and courses without logging in.');
      return;
    }

    setIsSubmitting(true);
    const loggedInUser = await login({
      identifier: trimmedIdentifier,
      password,
    });
    setIsSubmitting(false);

    if (loggedInUser) {
      const target = redirectUrl && redirectUrl !== '/' ? redirectUrl : getRoleDashboardUrl(loggedInUser.role);
      router.push(target);
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
              <span>Unified Portal Gateway</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              One Login for <span className="text-secondary">All Roles</span>
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Automatic redirection based on your role: Super Admin, Faculty Instructor, Student, or Affiliate Partner.
            </p>
          </div>

          <div className="space-y-3.5 my-8 relative z-10">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Building2 className="w-4 h-4 text-secondary flex-shrink-0" />
              <span><strong>Super Admin:</strong> Franchise, Staff & Finances</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Users className="w-4 h-4 text-secondary flex-shrink-0" />
              <span><strong>Staff / Faculty:</strong> Batches & Attendance</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <GraduationCap className="w-4 h-4 text-secondary flex-shrink-0" />
              <span><strong>Students:</strong> Courses, Live Labs & Certificates</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Share2 className="w-4 h-4 text-secondary flex-shrink-0" />
              <span><strong>Affiliates:</strong> Referrals & Commission Ledger</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Shikohabad, Uttar Pradesh</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO Certified
            </span>
          </div>
        </div>

        {/* Right Side: Login Form & Role Quick-Switcher */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2 lg:hidden">
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span>MSK Institute Unified Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Enter your credentials to access your dedicated role dashboard.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center justify-between gap-2">
              <span className="font-medium">Looking for a Free Demo Class? No account needed!</span>
              <Link href="/book-demo" className="font-extrabold text-[#FF6B00] hover:underline shrink-0">
                Book Demo ➔
              </Link>
            </div>
          </div>

          {/* Backend Offline Notice: Reassures user that all tutorials, courses & live batches are open */}
          {!isServerOnline && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <span>Authentication Server Offline</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-black uppercase">
                      No Login Needed
                    </span>
                  </h3>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                    Account sign-in is only required for student and staff dashboards. All tutorials, course details, study materials, and upcoming live batches are 100% free to browse right now without signing in!
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
                      <span>Explore Courses</span>
                    </Link>
                    <Link
                      href="/live"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-bold shadow-2xs hover:bg-secondary-light transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Upcoming Live Batches</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {registered && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-950">Registration Successful! 🎉</p>
                <p className="mt-0.5 text-emerald-700">Please sign in with your credentials to access your dashboard.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Username, Email, or Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username, email, or mobile"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1">
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
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & SSL */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary border-slate-300"
                />
                <span className="text-slate-600">Remember this session</span>
              </label>

              <span className="text-slate-600 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Auto Role Routing
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading || !isServerOnline}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none group ${
                !isServerOnline
                  ? 'bg-slate-200 text-slate-500 border border-slate-300 shadow-none'
                  : 'bg-secondary hover:bg-secondary-light text-white shadow-secondary/20 cursor-pointer'
              }`}
            >
              {!isServerOnline ? (
                <>
                  <WifiOff className="w-4 h-4 text-slate-400" />
                  <span>Server Offline (Sign In Unavailable)</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating... Please wait</span>
                </>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            {isServerOnline ? (
              <p className="text-xs sm:text-sm text-slate-600">
                New student or partner?{' '}
                <Link
                  href="/register"
                  className="font-bold text-secondary hover:text-secondary-light underline-offset-4 hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                No sign-in or account is required to access Tutorials, Course syllabi, and Upcoming Batches.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-slate-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
