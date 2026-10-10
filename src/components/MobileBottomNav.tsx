'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Video, FileText, Download, ShieldCheck } from 'lucide-react';
import { usePwa } from '@/context/PwaContext';
import { useLiveStatus } from '@/context/LiveStatusContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isRunningStandalone, installApp } = usePwa();
  const { isLiveNow } = useLiveStatus();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    if (path === '/study-material') {
      return (
        pathname.startsWith('/study-material') ||
        pathname.startsWith('/tutorials') ||
        pathname.startsWith('/notes')
      );
    }
    if (path === '/live') {
      return pathname.startsWith('/live') || pathname.startsWith('/live-batches');
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
    },
    {
      name: 'Live',
      href: '/live',
      icon: Video,
      badge: 'LIVE',
    },
    {
      name: 'Material',
      href: '/study-material',
      icon: FileText,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] no-print">
      <nav
        className="max-w-md mx-auto px-3 flex items-center justify-around"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          paddingTop: '0.45rem',
        }}
        aria-label="Mobile Bottom Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 select-none group active:scale-95 ${
                active ? 'text-secondary' : 'text-slate-500 hover:text-primary active:bg-slate-50'
              }`}
            >
              {/* Active Indicator Top Pill with smooth transition */}
              {active && (
                <span className="absolute -top-1.5 w-7 h-1 bg-secondary rounded-full shadow-[0_1px_4px_rgba(255,107,0,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}

              {/* Icon Container with subtle active pill background */}
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  active ? 'bg-orange-50 text-secondary' : 'group-hover:text-primary'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />

                {/* Pulsing Live Beacon Indicator: ONLY visible when live class is running */}
                {item.badge === 'LIVE' && isLiveNow && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white" />
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10.5px] leading-tight mt-0.5 tracking-tight transition-all duration-200 ${
                  active ? 'font-bold text-secondary scale-[1.02]' : 'font-medium text-slate-500'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* 5th Action Tab */}
        {!isRunningStandalone ? (
          <button
            onClick={() => installApp()}
            type="button"
            aria-label="Install MSK Institute App"
            className="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl text-secondary select-none group active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-7 rounded-full bg-gradient-to-tr from-secondary/15 to-orange-100 group-hover:from-secondary/25 group-hover:to-orange-200 transition-colors">
              <Download className="w-4 h-4 text-secondary stroke-[2.2] group-hover:translate-y-0.5 transition-transform duration-200" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-secondary leading-tight mt-0.5 tracking-tight">
              Install
            </span>
          </button>
        ) : (
          <Link
            href="/verify-certificate"
            aria-label="Verify Certificate"
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl select-none group active:scale-95 transition-all ${
              isActive('/verify-certificate')
                ? 'text-secondary'
                : 'text-slate-500 hover:text-primary active:bg-slate-50'
            }`}
          >
            {isActive('/verify-certificate') && (
              <span className="absolute -top-1.5 w-7 h-1 bg-secondary rounded-full shadow-[0_1px_4px_rgba(255,107,0,0.4)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <div
              className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                isActive('/verify-certificate') ? 'bg-orange-50 text-secondary' : 'group-hover:text-primary'
              }`}
            >
              <ShieldCheck
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive('/verify-certificate') ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10.5px] leading-tight mt-0.5 tracking-tight transition-all duration-200 ${
                isActive('/verify-certificate') ? 'font-bold text-secondary' : 'font-medium text-slate-500'
              }`}
            >
              Verify
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
