'use client';

import React, { useState } from 'react';
import { Trophy, X, Lock, CheckCircle2, Award, Sparkles, Filter } from 'lucide-react';
import { AchievementBadge } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/badges';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export default function AchievementsModal({
  isOpen,
  onClose,
  unlockedBadgeIds,
}: AchievementsModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Escape key closes modal without exiting fullscreen
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'speed', label: 'Speed' },
    { id: 'accuracy', label: 'Accuracy' },
    { id: 'coding', label: 'Coding' },
    { id: 'streak', label: 'Streak' },
    { id: 'milestone', label: 'Milestones' },
  ];

  const filteredBadges =
    activeCategory === 'all'
      ? ACHIEVEMENT_BADGES
      : ACHIEVEMENT_BADGES.filter((b) => b.category === activeCategory);

  const unlockedCount = unlockedBadgeIds.length;
  const totalCount = ACHIEVEMENT_BADGES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const getTierStyles = (tier: AchievementBadge['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60';
    }
    switch (tier) {
      case 'Diamond':
        return 'border-cyan-500/80 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
      case 'Gold':
        return 'border-amber-400/80 bg-gradient-to-br from-amber-950/40 via-slate-900 to-yellow-950/30 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
      case 'Silver':
        return 'border-slate-400/70 bg-gradient-to-br from-slate-800/60 via-slate-900 to-slate-800/40 text-slate-200 shadow-[0_0_10px_rgba(148,163,184,0.15)]';
      case 'Bronze':
      default:
        return 'border-orange-500/60 bg-gradient-to-br from-orange-950/40 via-slate-900 to-amber-950/20 text-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.15)]';
    }
  };

  const getTierBadge = (tier: AchievementBadge['tier']) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Gold':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Silver':
        return 'bg-slate-400/20 text-slate-300 border-slate-400/40';
      case 'Bronze':
      default:
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 modal-interactive"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                TypeQuest Achievements
                <Sparkles className="w-4 h-4 text-secondary" />
              </h2>
              <p className="text-xs text-slate-400">
                Unlock badges and milestones to level up your typing mastery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">
                Trophy Progress: <strong className="text-secondary font-mono">{unlockedCount}</strong> of {totalCount} Badges
              </span>
              <span className="font-mono text-secondary font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 overflow-x-auto border-b border-slate-800/60 bg-slate-900/60 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-secondary text-white shadow-sm shadow-secondary/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 no-scrollbar">
          {filteredBadges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`relative flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${getTierStyles(
                  badge.tier,
                  isUnlocked
                )}`}
              >
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-slate-700/80 shadow-inner'
                      : 'bg-slate-950/60 border-slate-800 grayscale'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-600" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3
                      className={`text-sm font-bold truncate ${
                        isUnlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider ${getTierBadge(
                        badge.tier
                      )}`}
                    >
                      {badge.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Unlocked status */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 font-mono">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Keep practicing to claim all certificates & master touch typing!</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
