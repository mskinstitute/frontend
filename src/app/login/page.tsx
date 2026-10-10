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
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getRoleDashboardUrl } from '@/lib/roleNavigation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

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

  const handleSelectDemoRole = (role: 'admin' | 'staff' | 'student' | 'affiliate' | 'branch') => {
    setSelectedDemoRole(role);
    setError(null);
    if (role === 'admin') {
      setIdentifier('admin@mskinstitute.in');
      setPassword('Msk@123456');
    } else if (role === 'branch') {
      setIdentifier('branch@mskinstitute.in');
      setPassword('Msk@123456');
    } else if (role === 'staff') {
      setIdentifier('staff@mskinstitute.in');
      setPassword('Msk@123456');
    } else if (role === 'student') {
      setIdentifier('student@mskinstitute.in');
      setPassword('Msk@123456');
    } else if (role === 'affiliate') {
      setIdentifier('affiliate@mskinstitute.in');
      setPassword('Msk@123456');
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
          </div>

          {/* Quick Demo Role Autofill Bar */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
              <span className="flex items-center gap-1 text-slate-700">
                <Zap className="w-3.5 h-3.5 text-secondary" />
                <span>Test 1-Click Role Login:</span>
              </span>
              <span className="text-slate-600 font-mono">pwd: Msk@123456</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectDemoRole('admin')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDemoRole === 'admin'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
                }`}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoRole('branch')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDemoRole === 'branch'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
                }`}
              >
                🏛️ Branch
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoRole('staff')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDemoRole === 'staff'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
                }`}
              >
                👨‍🏫 Staff
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoRole('student')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDemoRole === 'student'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoRole('affiliate')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDemoRole === 'affiliate'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
                }`}
              >
                🤝 Affiliate
              </button>
            </div>
          </div>

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
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setSelectedDemoRole(null);
                  }}
                  placeholder="e.g. admin@mskinstitute.in, student@mskinstitute.in..."
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
              disabled={isSubmitting || authLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
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
            <p className="text-xs sm:text-sm text-slate-600">
              New student or partner?{' '}
              <Link
                href="/register"
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
