'use client';

import React from 'react';
import { usePwa } from '@/context/PwaContext';
import { Download } from 'lucide-react';

interface InstallAppButtonProps {
  variant?: 'header' | 'mobile-header' | 'bottom-nav' | 'compact' | 'full' | 'hero';
  className?: string;
}

export default function InstallAppButton({
  variant = 'header',
  className = '',
}: InstallAppButtonProps) {
  const { isRunningStandalone, installApp, isInstalling } = usePwa();

  // If currently running inside installed app window, hide completely
  if (isRunningStandalone) {
    return null;
  }

  if (variant === 'mobile-header') {
    return (
      <button
        onClick={() => installApp()}
        aria-label="Install MSK Institute App"
        className={`inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-white rounded-full text-xs font-bold shadow-sm hover:bg-secondary-light active:scale-95 transition-all ${className}`}
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  if (variant === 'bottom-nav') {
    return (
      <button
        onClick={() => installApp()}
        aria-label="Install MSK Institute App"
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-secondary select-none hover:bg-secondary/5 transition-all group ${className}`}
      >
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center">
            <Download className="w-3.5 h-3.5 text-secondary animate-bounce" />
          </div>
        </div>
        <span className="text-[11px] font-bold text-secondary leading-tight mt-1">
          Install
        </span>
      </button>
    );
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={() => installApp()}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary text-white hover:bg-primary-light font-bold rounded-xl shadow-lg border border-primary-light hover:-translate-y-0.5 transition-all text-sm group ${className}`}
      >
        <div className="p-1 rounded-md bg-secondary text-white">
          <Download className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-300 font-normal">Get the App</div>
          <div className="text-sm font-bold leading-tight">Install MSK Institute App</div>
        </div>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={() => installApp()}
        className={`w-full py-3 px-4 bg-secondary hover:bg-secondary-light text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm ${className}`}
      >
        <Download className="w-4 h-4" />
        Install MSK Institute App
      </button>
    );
  }

  // Default: 'header' variant
  return (
    <button
      onClick={() => installApp()}
      aria-label="Install MSK Institute App"
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border bg-secondary/10 border-secondary/30 text-secondary hover:bg-secondary hover:text-white group shadow-sm ${className}`}
    >
      <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
      <span>Install App</span>
      <span className="hidden lg:inline-block px-1.5 py-0.2 bg-secondary text-white group-hover:bg-white group-hover:text-secondary rounded text-[9px] font-black uppercase tracking-wider transition-colors">
        Free
      </span>
    </button>
  );
}
