'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WifiOff, BookOpen, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { getRoleDashboardUrl } from '@/lib/roleNavigation';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isServerOnline } = useServerStatus();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      if (!isServerOnline) return;
      router.replace('/login?redirect=/dashboard');
      return;
    }

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const destination = getRoleDashboardUrl(user.role) + (search || '');
    router.replace(destination);
  }, [isAuthenticated, user, isLoading, router, isServerOnline]);

  if (!isAuthenticated && !isServerOnline) {
    return (
      <div className="min-h-screen bg-[#071B2F] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <WifiOff className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Dashboard Requires Server Connection
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            The MSK backend server is currently offline or unreachable. Sign-in is required to access student, branch, and staff dashboards, but you can freely explore all tutorials, courses, and upcoming live batches without signing in!
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/tutorials"
              className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-secondary" />
              <span>Browse Free Tutorials</span>
            </Link>
            <Link
              href="/courses"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Explore All Courses
            </Link>
            <Link
              href="/live"
              className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Upcoming Live Batches</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold pt-1"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071B2F] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-14 h-14 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse" />
        </div>
      </div>
      <h3 className="text-white text-base font-bold tracking-tight mb-1">
        Routing to Your Workspace
      </h3>
      <p className="text-slate-400 text-xs max-w-sm">
        Authenticating session and routing to your authorized portal...
      </p>
    </div>
  );
}

