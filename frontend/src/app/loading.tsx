import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white via-slate-50/50 to-white select-none"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mt-20" />
      <div className="absolute w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none mt-20" />

      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl shadow-slate-900/5 text-center space-y-6">
        {/* Animated Brand Emblem with Dual Spinning Rings */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-3 border-secondary/20 border-t-secondary animate-spin" />
          {/* Inner Counter-Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-primary/20 border-b-primary animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />
          {/* Center Icon */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#163a63] text-white flex items-center justify-center shadow-md shadow-primary/20">
            <GraduationCap className="w-6 h-6 text-secondary animate-pulse" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-secondary text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MSK Institute • Shikohabad</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Loading Page Content...
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Preparing courses, live labs, and learning resources.
            <span className="block text-secondary font-medium mt-0.5">
              सामग्री लोड हो रही है, कृपया प्रतीक्षा करें...
            </span>
          </p>
        </div>

        {/* Indeterminate Animated Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative shadow-inner">
            <div className="h-full bg-gradient-to-r from-secondary via-amber-400 to-secondary rounded-full animate-msk-progress w-2/3" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>Connecting server</span>
            <span>Please wait...</span>
          </div>
        </div>

        {/* Reassuring Feature Badges */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-600 font-medium flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
            💻 Practical Labs
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
            🚀 Free Demo
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
            📜 Verified Certificates
          </span>
        </div>
      </div>
    </div>
  );
}
