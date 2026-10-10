'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getRoleDashboardUrl, getRoleDisplayName } from '@/lib/roleNavigation';
import {
  GraduationCap,
  Users,
  Share2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const destination = getRoleDashboardUrl(user.role);
        router.replace(destination);
      } else {
        router.replace('/login?redirect=/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-sky-50/20 to-orange-50/30">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Directing to your Dashboard...</h1>
          <p className="text-sm text-slate-600 mt-1">
            {isAuthenticated && user
              ? `Authenticating role: ${getRoleDisplayName(user.role)}`
              : 'Verifying session credentials...'}
          </p>
        </div>

        {/* Quick Fallback / Switcher in case client side navigation is delayed */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Direct Role Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/dashboard/student"
              className="p-2.5 rounded-lg border border-slate-200 hover:border-secondary hover:bg-orange-50/50 text-slate-700 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-secondary" />
              Student Portal
            </Link>
            <Link
              href="/dashboard/branch"
              className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              Branch / Franchise
            </Link>
            <Link
              href="/dashboard/staff"
              className="p-2.5 rounded-lg border border-slate-200 hover:border-primary hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              Staff Portal
            </Link>
            <Link
              href="/dashboard/affiliate"
              className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              Affiliate Portal
            </Link>
            <Link
              href="/admin"
              className="col-span-2 p-2.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-slate-700 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Super Admin Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
