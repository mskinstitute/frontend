import React from 'react';
import { GraduationCap } from 'lucide-react';

/**
 * Global Fallback Skeleton for Next.js Suspense streaming.
 * Uses neutral non-textual visuals to prevent search engine crawlers (Googlebot)
 * from indexing transient loading strings like "Connecting server" or "Please wait".
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white via-slate-50/50 to-white select-none"
    >
      <div className="relative z-10 max-w-sm w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-slate-200/80 shadow-lg text-center space-y-6">
        {/* Animated Brand Emblem with Dual Spinning Rings */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-3 border-secondary/20 border-t-secondary animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-primary/20 border-b-primary animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#163a63] text-white flex items-center justify-center shadow-md shadow-primary/20">
            <GraduationCap className="w-5 h-5 text-secondary animate-pulse" />
          </div>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-secondary via-amber-400 to-secondary rounded-full animate-msk-progress w-2/3" />
        </div>
      </div>
    </div>
  );
}
