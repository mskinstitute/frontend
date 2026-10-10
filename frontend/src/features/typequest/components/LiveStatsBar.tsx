'use client';

import React from 'react';
import { Gauge, Target, Clock, AlertTriangle, Zap } from 'lucide-react';
import { PracticeMode } from '../types';

interface LiveStatsBarProps {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  timeLeft?: number;
  errorCount: number;
  mode: PracticeMode;
  progressPercent: number;
}

export default function LiveStatsBar({
  wpm,
  accuracy,
  elapsedSeconds,
  timeLeft,
  errorCount,
  mode,
  progressPercent,
}: LiveStatsBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top HUD Cards (Reordered: Timer, Speed, Accuracy, Mistakes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3">
        {/* 1. Time (Elapsed or Countdown) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              {mode === 'timed' ? 'Time Left' : 'Time Elapsed'}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {mode === 'timed' && timeLeft !== undefined ? `${timeLeft}s` : formatTime(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* 2. Speed / WPM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Speed</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {wpm} <span className="text-xs font-sans text-secondary font-semibold">WPM</span>
            </div>
          </div>
        </div>

        {/* 3. Accuracy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Accuracy</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* 4. Mistakes / Errors */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Mistakes</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {errorCount}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-secondary to-amber-400 transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
