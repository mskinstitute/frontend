'use client';

import React from 'react';
import { Star, Sparkles, Code2 } from 'lucide-react';
import KeyCap from './KeyCap';
import { ShortcutItem } from '@/types/shortcuts';

interface ShortcutCardProps {
  shortcut: ShortcutItem;
  isMac?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  accentColor?: string;
}

export default function ShortcutCard({
  shortcut,
  isMac = false,
  isBookmarked = false,
  onToggleBookmark,
  accentColor = '#FF6B00',
}: ShortcutCardProps) {
  const displayKeys = isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys;
  const isSequence = shortcut.category === 'ribbon-access';

  return (
    <div className="group relative rounded-xl bg-white dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Keycaps + Details */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Keys */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-950/70 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
              {displayKeys.map((key, index) => (
                <React.Fragment key={index}>
                  <KeyCap keyName={key} size="sm" isMac={isMac} />
                  {index < displayKeys.length - 1 && (
                    <span className="text-[10px] font-bold text-slate-400 select-none px-0.5">
                      {isSequence ? ',' : '+'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {isSequence && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Alt Sequence
              </span>
            )}

            {shortcut.isStudentPro && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Student Pro
              </span>
            )}

            {shortcut.isPopular && !shortcut.isStudentPro && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                Must Know
              </span>
            )}

            {shortcut.difficulty && (
              <span
                className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-md border ${
                  shortcut.difficulty === 'basic'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : shortcut.difficulty === 'intermediate'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                }`}
              >
                {shortcut.difficulty}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-text-main dark:text-white tracking-tight">
                {shortcut.title}
              </h4>
              {shortcut.vscodeCommand && (
                <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                  <Code2 className="w-2.5 h-2.5" />
                  {shortcut.vscodeCommand}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted dark:text-slate-400 mt-0.5 leading-relaxed">
              {shortcut.description}
            </p>
          </div>
        </div>

        {/* Right Side: Favorite Star Button */}
        {onToggleBookmark && (
          <div className="flex items-center justify-end pt-1 sm:pt-0 shrink-0">
            <button
              onClick={() => onToggleBookmark(shortcut.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title={isBookmarked ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
