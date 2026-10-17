'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  MapPin,
  Loader2,
  Check,
  WifiOff,
  BookOpen,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { authApi } from '@/services/authApi';
import { affiliateApi, AffiliatePreview } from '@/services/affiliateApi';
import toast from 'react-hot-toast';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isServerOnline } = useServerStatus();

  // Referral State
  const [refCode, setRefCode] = useState<string>('');
  const [referralPreview, setReferralPreview] = useState<AffiliatePreview | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    password: '',
    confirm_password: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email availability check states
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailRegistered, setEmailRegistered] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  // Phone availability check states
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [phoneRegistered, setPhoneRegistered] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState(false);

  // 1. Resolve Referral Code (URL param -> Cookie -> localStorage fallback)
  useEffect(() => {
    let code = searchParams.get('ref') || '';

    if (!code && typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )msk_ref_code=([^;]*)/);
      if (match && match[1]) {
        code = decodeURIComponent(match[1]);
      }
    }

    if (!code && typeof window !== 'undefined') {
      code = localStorage.getItem('msk_ref_code') || '';
    }

    if (code) {
      setRefCode(code);
      try {
        localStorage.setItem('msk_ref_code', code);
      } catch {}

      // Fetch affiliate details for live preview banner
      affiliateApi.getAffiliatePreview(code)
        .then((data) => {
          if (data && data.valid) {
            setReferralPreview(data);
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const normalizeIndianPhone = useCallback((rawPhone: string) => {
    const clean = rawPhone.replace(/[\s\-\(\)\+]/g, '');
    let digits = clean;
    if (clean.startsWith('91') && clean.length === 12) {
      digits = clean.slice(2);
    } else if (clean.startsWith('0') && clean.length === 11) {
      digits = clean.slice(1);
    }
    return digits;
  }, []);

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Availability checkers
  const checkEmailAvailability = useCallback(async (emailToTest: string) => {
    const cleaned = emailToTest.trim().toLowerCase();
    if (!isValidEmail(cleaned)) {
      setEmailRegistered(false);
      setEmailAvailable(false);
      return;
    }

    setEmailChecking(true);
    try {
      const res = await authApi.checkAvailability({ email: cleaned });
      if (res.email_exists) {
        setEmailRegistered(true);
        setEmailAvailable(false);
      } else {
        setEmailRegistered(false);
        setEmailAvailable(true);
      }
    } catch {
      // Ignore network errors during background check
    } finally {
      setEmailChecking(false);
    }
  }, []);

  const checkPhoneAvailability = useCallback(async (phoneToTest: string) => {
    const digits = normalizeIndianPhone(phoneToTest);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setPhoneRegistered(false);
      setPhoneAvailable(false);
      return;
    }

    setPhoneChecking(true);
    try {
      const res = await authApi.checkAvailability({ phone: digits });
      if (res.phone_exists) {
        setPhoneRegistered(true);
        setPhoneAvailable(false);
      } else {
        setPhoneRegistered(false);
        setPhoneAvailable(true);
      }
    } catch {
      // Ignore network errors during background check
    } finally {
      setPhoneChecking(false);
    }
  }, [normalizeIndianPhone]);

  // Debounce email availability check as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && isValidEmail(formData.email)) {
        checkEmailAvailability(formData.email);
      } else {
        setEmailRegistered(false);
        setEmailAvailable(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email, checkEmailAvailability]);

  // Debounce phone availability check as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      const digits = normalizeIndianPhone(formData.phone);
      if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
        checkPhoneAvailability(formData.phone);
      } else {
        setPhoneRegistered(false);
        setPhoneAvailable(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.phone, normalizeIndianPhone, checkPhoneAvailability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);

    if (name === 'phone') {
      // Only permit numbers and clean characters
      const cleaned = value.replace(/[^\d\s\+\-]/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      setPhoneRegistered(false);
      setPhoneAvailable(false);
      return;
    }

    if (name === 'email') {
      setEmailRegistered(false);
      setEmailAvailable(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email' && formData.email) {
      checkEmailAvailability(formData.email);
    }
    if (field === 'phone' && formData.phone) {
      checkPhoneAvailability(formData.phone);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Field validations
  const normalizedPhone = normalizeIndianPhone(formData.phone);
  const isFirstNameValid = formData.first_name.trim().length >= 2;
  const isLastNameValid = formData.last_name.trim().length >= 1;
  const isEmailFormatValid = isValidEmail(formData.email);
  const isEmailValid = isEmailFormatValid && !emailRegistered && !emailChecking;
  const isPhoneFormatValid = /^[6-9]\d{9}$/.test(normalizedPhone);
  const isPhoneValid = isPhoneFormatValid && !phoneRegistered && !phoneChecking;
  const isAddressValid = formData.address.trim().length >= 3;
  const isGenderValid = ['male', 'female', 'other'].includes(formData.gender);
  const isPasswordValid = formData.password.length >= 6;
  const passwordsMatch = formData.password.length >= 6 && formData.password === formData.confirm_password;
  const passwordsMismatch = formData.confirm_password.length > 0 && formData.password !== formData.confirm_password;

  // Strict check: Button only enabled when ALL fields are filled properly and no duplicates exist
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isAddressValid &&
    isGenderValid &&
    isPasswordValid &&
    passwordsMatch &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!formData.first_name.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('Please enter your last name.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (emailRegistered) {
      setError('This email address is already registered. Please sign in or use another email.');
      return;
    }
    if (!isPhoneFormatValid) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }
    if (phoneRegistered) {
      setError('This mobile number is already registered. Please sign in or use another number.');
      return;
    }
    if (!isAddressValid) {
      setError('Please enter your complete address (at least 3 characters).');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (!isServerOnline) {
      setError('The registration server is currently offline. Account creation is only needed for dashboards; all tutorials and courses are free to browse without an account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: normalizedPhone,
        address: formData.address.trim(),
        password: formData.password,
        gender: formData.gender,
        ref_code: refCode || undefined,
      });

      if (user) {
        toast.success('Registration successful! Please sign in to access your student dashboard.');
        router.push(`/login?registered=1&email=${encodeURIComponent(formData.email.trim().toLowerCase())}`);
      }
    } catch (err: any) {
      const errorData = err?.data;
      if (errorData) {
        if (errorData.email) {
          setEmailRegistered(true);
          setEmailAvailable(false);
          const msg = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
          setError(msg || 'This email address is already registered.');
          return;
        }
        if (errorData.phone) {
          setPhoneRegistered(true);
          setPhoneAvailable(false);
          const msg = Array.isArray(errorData.phone) ? errorData.phone[0] : errorData.phone;
          setError(msg || 'This mobile number is already registered.');
          return;
        }
      }
      setError(err?.message || 'Registration failed. Please check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-sky-50/30 to-orange-50/40 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden relative z-10">
        
        {/* Left Side: Brand & Perks Showcase */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary via-[#0f345c] to-primary-light text-white p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-secondary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary-light text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Join MSK Institute</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Start Your Coding Journey Today
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Create your account to book your free 2-day demo, experience offline lab training in Shikohabad, and earn verified IT diplomas.
            </p>
          </div>

          <div className="space-y-4 my-8 relative z-10">
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Free 2-Day Practical Demo Class</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>Dedicated PC in Shikohabad Main Campus</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
              <span>1-on-1 Mentorship with Er. Sumit Kumar</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Shikohabad, Uttar Pradesh</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe & Verified
            </span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Student Account
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Join MSK Institute to start your 3-step admission journey.
            </p>
          </div>

          {/* Backend Offline Notice: Informs user that tutorials, courses & live batches do not need an account */}
          {!isServerOnline && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <span>Registration Server Offline</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-black uppercase">
                      No Account Needed
                    </span>
                  </h3>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                    Account creation is only needed if you are accessing internal student/staff dashboards. All tutorials, course syllabi, study materials, and upcoming live batches are 100% open to browse without registering!
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

          {/* Referral Partner Banner */}
          {referralPreview && (
            <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex items-center gap-3 shadow-xs animate-in fade-in">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xs flex-1">
                <p className="font-bold text-slate-900">
                  Referred by {referralPreview.first_name}
                </p>
                <p className="text-slate-600 font-medium">
                  {referralPreview.scholarship_percent}% Student Scholarship Applied on all courses!
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('first_name')}
                    placeholder="e.g. Sumit"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  />
                </div>
                {touched.first_name && formData.first_name.trim().length < 2 && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Please enter your first name.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('last_name')}
                    placeholder="e.g. Kumar"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  />
                </div>
                {touched.last_name && formData.last_name.trim().length < 1 && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Please enter your last name.
                  </p>
                )}
              </div>
            </div>

            {/* Email Address with real-time availability check */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                {emailChecking && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin text-secondary" /> Checking availability...
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. sumit@mskinstitute.in"
                  className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all ${
                    emailRegistered
                      ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400/30'
                      : emailAvailable
                      ? 'bg-emerald-50/30 border border-emerald-400 focus:ring-2 focus:ring-emerald-400/30'
                      : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {emailRegistered && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {emailAvailable && !emailRegistered && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>

              {/* Already registered warning */}
              {emailRegistered && (
                <div className="mt-1.5 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>This email is already registered.</span>
                  </div>
                  <Link
                    href={`/login?email=${encodeURIComponent(formData.email.trim())}`}
                    className="text-secondary font-bold hover:underline underline-offset-2 ml-2 flex items-center gap-0.5 whitespace-nowrap"
                  >
                    Sign In →
                  </Link>
                </div>
              )}

              {/* Available notification */}
              {!emailRegistered && emailAvailable && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Email is available</span>
                </div>
              )}

              {touched.email && !emailRegistered && !emailAvailable && formData.email && !isEmailFormatValid && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Mobile (Indian 10-digit) & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    WhatsApp / Mobile <span className="text-red-500">*</span>
                  </label>
                  {phoneChecking && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin text-secondary" /> Checking...
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="text-xs font-bold text-slate-500">+91</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="98765 43210"
                    className={`w-full pl-12 pr-9 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all ${
                      phoneRegistered
                        ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400/30'
                        : phoneAvailable
                        ? 'bg-emerald-50/30 border border-emerald-400 focus:ring-2 focus:ring-emerald-400/30'
                        : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {phoneRegistered && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {phoneAvailable && !phoneRegistered && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>

                {/* Already registered mobile warning */}
                {phoneRegistered && (
                  <div className="mt-1.5 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>Mobile already registered.</span>
                    </div>
                    <Link
                      href={`/login?identifier=${encodeURIComponent(formData.phone.trim())}`}
                      className="text-secondary font-bold hover:underline underline-offset-2 ml-2 flex items-center gap-0.5 whitespace-nowrap"
                    >
                      Sign In →
                    </Link>
                  </div>
                )}

                {/* Available phone notification */}
                {!phoneRegistered && phoneAvailable && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mobile number is available</span>
                  </div>
                )}

                {touched.phone && !phoneRegistered && !phoneAvailable && formData.phone && !isPhoneFormatValid && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Valid 10-digit Indian number required (e.g. 9876543210).
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Address Field (Replaced Course Interest) */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Address / Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  placeholder="e.g. Station Road, Near Gyan Jyoti School, Shikohabad"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                    touched.address && !isAddressValid
                      ? 'border-red-400 focus:ring-red-400/30'
                      : 'border-slate-200 focus:ring-secondary/50 focus:border-secondary'
                  }`}
                />
              </div>
              {touched.address && !isAddressValid && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Please enter your address or city (min 3 characters).
                </p>
              )}
            </div>

            {/* Password & Confirm Password (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="Min 6 characters"
                    className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all ${
                      touched.password && formData.password.length > 0 && !isPasswordValid
                        ? 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400/30'
                        : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && formData.password.length > 0 && !isPasswordValid && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Password must be at least 6 characters.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirm_password')}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all ${
                      formData.confirm_password.length > 0
                        ? passwordsMatch
                          ? 'bg-emerald-50/30 border border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                          : 'bg-red-50/50 border border-red-400 focus:ring-2 focus:ring-red-400/30'
                        : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Show Live Password Match Feedback */}
                {formData.confirm_password.length > 0 && (
                  <div className="mt-1">
                    {passwordsMatch ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>Passwords match</span>
                      </div>
                    ) : passwordsMismatch ? (
                      <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span>Passwords do not match</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Password strength</span>
                  <span className="font-semibold">
                    {passwordStrength <= 25 && 'Weak'}
                    {passwordStrength === 50 && 'Fair'}
                    {passwordStrength === 75 && 'Good'}
                    {passwordStrength === 100 && 'Strong'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength <= 25
                        ? 'bg-red-500'
                        : passwordStrength <= 50
                        ? 'bg-amber-500'
                        : passwordStrength <= 75
                        ? 'bg-sky-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button: Enabled only when all information is properly filled & server is online */}
            <div className="pt-2">
              <button
                type="submit"
                id="create-account-btn"
                disabled={!isFormValid || isSubmitting || authLoading || !isServerOnline}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all duration-200 disabled:pointer-events-none group ${
                  !isServerOnline
                    ? 'bg-slate-200 text-slate-500 border border-slate-300 shadow-none cursor-not-allowed opacity-90'
                    : isFormValid && !isSubmitting && !authLoading
                    ? 'bg-secondary hover:bg-secondary-light text-white shadow-secondary/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-slate-200 text-slate-400 border border-slate-300/60 shadow-none cursor-not-allowed opacity-80'
                }`}
              >
                {!isServerOnline ? (
                  <>
                    <WifiOff className="w-4 h-4 text-slate-400" />
                    <span>Server Offline (Registration Unavailable)</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering Account... Please wait</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isFormValid ? 'group-hover:translate-x-1' : ''}`} />
                  </>
                )}
              </button>

              {/* Information status helper */}
              {isServerOnline && !isFormValid && (
                <div className="text-center text-[12px] text-slate-500 mt-2 flex items-center justify-center gap-1.5 animate-in fade-in">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {emailRegistered
                      ? 'Please resolve registered email before continuing.'
                      : phoneRegistered
                      ? 'Please resolve registered mobile before continuing.'
                      : passwordsMismatch
                      ? 'Passwords do not match.'
                      : 'Please complete all required fields correctly to enable account creation.'}
                  </span>
                </div>
              )}
            </div>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            {isServerOnline ? (
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                  className="font-bold text-secondary hover:text-secondary-light underline-offset-4 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                No account or sign-in is required to access Tutorials, Course syllabi, and Upcoming Batches.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
