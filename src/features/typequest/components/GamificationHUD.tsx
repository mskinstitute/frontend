'use client';

import React from 'react';
import { Trophy, Flame, Zap, Award, Sparkles } from 'lucide-react';
import { UserGamification } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/badges';
import { getXpForNextLevel } from '../hooks/useGamification';

interface GamificationHUDProps {
  gamification: UserGamification;
  onOpenAchievements: () => void;
  onOpenCertificate: () => void;
}

export default function GamificationHUD({
  gamification,
  onOpenAchievements,
  onOpenCertificate,
}: GamificationHUDProps) {
  const { currentLevelBaseXp, nextLevelXp } = getXpForNextLevel(gamification.level);
  const levelSpan = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const currentProgressXp = Math.max(0, gamification.xp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((currentProgressXp / levelSpan) * 100));

  const totalBadges = ACHIEVEMENT_BADGES.length;
  const unlockedCount = gamification.unlockedBadgeIds.length;

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
      {/* Left: Level & XP Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-[240px]">
        {/* Level Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-secondary/80 to-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md shadow-secondary/20">
            <span className="text-xs font-mono font-bold leading-none">
              L{gamification.level}
            </span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
        </div>

        {/* Title and XP Progress Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{gamification.levelTitle}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({gamification.xp.toLocaleString()} XP)
              </span>
            </span>
            <span className="text-[11px] text-secondary font-mono font-medium">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-secondary to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,107,0,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Streak & Quick Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Daily Streak */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium text-xs sm:text-sm"
          title={`${gamification.streakDays} Day Practice Streak`}
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
          <span className="font-mono font-bold">{gamification.streakDays}</span>
          <span className="text-amber-400/80 text-[11px] hidden sm:inline">day streak</span>
        </div>

        {/* Badges / Achievements Trigger */}
        <button
          type="button"
          onClick={onOpenAchievements}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-secondary/60 hover:text-white text-slate-300 text-xs sm:text-sm font-medium transition-all group shadow-sm"
        >
          <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Badges</span>
          <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-900 rounded-md text-amber-400/90 border border-slate-800">
            {unlockedCount}/{totalBadges}
          </span>
        </button>

        {/* Official Certificate Trigger */}
        <button
          type="button"
          onClick={onOpenCertificate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-secondary to-orange-500 hover:from-secondary/90 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-secondary/20 transition-all active:scale-95"
        >
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Print</span> Certificate
        </button>
      </div>
    </div>
  );
}
