'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  WifiOff,
  BookOpen,
  Video
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useServerStatus } from '@/context/ServerStatusContext';
import { hasRolePermission, getRoleDashboardUrl } from '@/lib/roleNavigation';
import toast from 'react-hot-toast';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: 'orange' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'navy';
  href?: string;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

interface DashboardLayoutProps {
  role: 'student' | 'branch' | 'staff' | 'affiliate' | 'admin';
  roleSubtitle?: string;
  sections: NavSectionConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  customUserName?: string;
}

export default function DashboardLayout({
  role,
  roleSubtitle = 'LEARNING MANAGEMENT',
  sections,
  activeTab,
  onTabChange,
  children,
  customUserName,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isServerOnline } = useServerStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Security & Role-Based Access Control
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      if (!isServerOnline) return;
      toast.error('Authentication required. Please log in to access this portal.');
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const permitted = hasRolePermission(user.role, role);
    if (!permitted) {
      toast.error(`Access denied. You do not have permission to access the ${role} dashboard.`);
      router.replace(getRoleDashboardUrl(user.role));
      return;
    }

    setIsAuthorized(true);
  }, [isLoading, isAuthenticated, user, role, pathname, router, isServerOnline]);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const displayName = customUserName || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Sumit Kumar');

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Role badges using MSK brand color accents
  const roleColors: Record<string, { pillBg: string; label: string }> = {
    student: { pillBg: 'bg-orange-50 text-[#FF6B00] border-orange-200', label: 'Student' },
    branch: { pillBg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Branch' },
    staff: { pillBg: 'bg-blue-50 text-[#0A2540] border-blue-200', label: 'Faculty' },
    affiliate: { pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Affiliate' },
    admin: { pillBg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Admin' },
  };

  const currentRoleMeta = roleColors[role] || roleColors.student;

  const demoNotifications = [
    {
      id: 1,
      title: 'Demo Class Tomorrow at 11:00 AM',
      time: '10m ago',
      unread: true,
      desc: 'Full Stack Web Dev session on Zoom with Er. Sumit Kumar',
    },
    {
      id: 2,
      title: 'Monthly Progress Report Ready',
      time: '2h ago',
      unread: true,
      desc: 'Your academic evaluation scorecard for October 2026 has been published',
    },
    {
      id: 3,
      title: 'System Cloud Sync Active',
      time: '1d ago',
      unread: false,
      desc: 'All attendance & fee records synchronized with MSK Central Server',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A2540] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8533] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-orange-300 transition-colors">
              MSK<span className="text-[#FF6B00] font-black">.</span>Institute
            </h1>
            <p className="text-[10px] tracking-widest text-[#FF8533] font-semibold uppercase mt-1">
              {roleSubtitle}
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 no-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white font-semibold shadow-sm border-l-4 border-[#FF6B00]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#FF8533]' : 'text-slate-400 group-hover:text-white'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#FF6B00] text-white' : 'bg-white/10 text-slate-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E3A5F] text-white font-semibold shadow-sm border-l-4 border-[#FF6B00]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8533]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === 'NEW'
                          ? 'bg-[#FF6B00] text-white animate-pulse'
                          : isActive
                          ? 'bg-[#FF6B00] text-white'
                          : 'bg-white/10 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Link */}
      <div className="p-3 border-t border-white/10 bg-[#071B2F]">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </Link>
      </div>
    </div>
  );

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

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#071B2F] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-14 h-14 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse" />
          </div>
        </div>
        <h3 className="text-white text-base font-bold tracking-tight mb-1">
          Verifying Permissions
        </h3>
        <p className="text-slate-400 text-xs max-w-sm">
          Checking your security credentials and portal access privileges...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row font-sans">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 left-0 z-40 shadow-xl border-r border-[#1E3A5F]/20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Right Main Wrapper */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Offline notice bar for authenticated users */}
        {!isServerOnline && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <span>Backend server is currently offline. Actions and live data updates may be restricted until connection is restored.</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider bg-slate-950/20 px-2 py-0.5 rounded font-black">Offline Mode</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Welcome Greeting */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                    Welcome back, <span className="text-[#0A2540] font-extrabold">{displayName}</span> <span className="text-[#FF6B00]">👋</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Right: Notifications, Avatar, Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role badge */}
              <span className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${currentRoleMeta.pillBg}`}>
                {role === 'student' ? 'Student Portal' : role === 'branch' ? 'Franchise / Branch' : role === 'staff' ? 'Faculty & Staff' : role === 'affiliate' ? 'Affiliate Partner' : 'Super Admin'}
              </span>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      <span className="text-[11px] font-semibold text-[#FF6B00] hover:underline cursor-pointer">
                        Mark all as read
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {demoNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            n.unread ? 'bg-orange-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pt-2 border-t border-slate-100 text-center">
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Circle */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8533] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm ring-2 ring-white">
                  {initials}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden md:inline">
                  {displayName}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 border border-rose-200/80 hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center gap-1.5"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
