'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  LogOut,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  WifiOff,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isServerOnline } = useServerStatus();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (!isServerOnline) return;
      router.push('/login?redirect=/profile');
    }
  }, [isLoading, isAuthenticated, router, isServerOnline]);

  if (!isAuthenticated && !isServerOnline) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <WifiOff className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Profile Requires Server Connection
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            The MSK backend server is currently offline or unreachable. Profile access requires an active session, but you can freely explore all tutorials, courses, and upcoming live batches without signing in!
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

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* User Card Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-orange-50/60 to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary/20 uppercase">
                {user.first_name?.[0] || 'U'}
                {user.last_name?.[0] || ''}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-secondary">
                    {user.role || 'Student'}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">@{user.username}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              <span>Account Information</span>
            </h2>

            <div className="space-y-3 divide-y divide-slate-100 text-sm">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-900">{user.first_name} {user.last_name}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                </span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile
                </span>
                <span className="font-semibold text-slate-900">{user.phone || 'Not provided'}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500">Gender</span>
                <span className="font-semibold text-slate-900 capitalize">{user.gender || 'Not specified'}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" /> Role
                </span>
                <span className="font-semibold text-slate-900 capitalize">{user.role || 'Student'}</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined
                </span>
                <span className="font-semibold text-slate-900">
                  {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Active Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Learning Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Quick Actions</span>
            </h2>

            <div className="space-y-3">
              <Link
                href="/courses"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/60 hover:border-orange-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-secondary flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-secondary transition-colors">
                      Browse Courses
                    </h3>
                    <p className="text-xs text-slate-500">Explore Python, Web Dev & CCC courses</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/verify-certificate"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/60 hover:border-sky-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-primary flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Verify Certificate
                    </h3>
                    <p className="text-xs text-slate-500">Check official institute graduation status</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/playground"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Code Playground
                    </h3>
                    <p className="text-xs text-slate-500">Practice Python, SQL, JS & HTML in browser</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
