'use client';

import React from 'react';
import { Files, Search, Keyboard, Settings, Trophy, BookOpen } from 'lucide-react';
import { SidebarView } from './types';
import ActionTooltip from './ActionTooltip';

interface ActivityBarProps {
  activeView: SidebarView;
  onToggleView: (view: SidebarView) => void;
  onOpenShortcuts: () => void;
  onOpenSettings: () => void;
}

export default function ActivityBar({
  activeView,
  onToggleView,
  onOpenShortcuts,
  onOpenSettings,
}: ActivityBarProps) {
  return (
    <div className="hidden sm:flex flex-col justify-between w-11 bg-[#181818] border-r border-[#2b2b2b] select-none z-10 py-1">
      {/* Top Section: Explorer, Search, & Challenges */}
      <div className="flex flex-col items-center gap-1">
        {/* Explorer Button */}
        <ActionTooltip label="File Explorer" shortcut="Ctrl + Shift + E" placement="right">
          <button
            type="button"
            onClick={() => onToggleView(activeView === 'explorer' ? null : 'explorer')}
            className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer relative ${
              activeView === 'explorer'
                ? 'text-white border-l-2 border-white bg-[#252526]'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="File Explorer (Ctrl + Shift + E)"
          >
            <Files className="w-5 h-5" />
          </button>
        </ActionTooltip>

        {/* Search Button */}
        <ActionTooltip label="Search in Files" shortcut="Ctrl + Shift + F" placement="right">
          <button
            type="button"
            onClick={() => onToggleView(activeView === 'search' ? null : 'search')}
            className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer relative ${
              activeView === 'search'
                ? 'text-white border-l-2 border-white bg-[#252526]'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Search in Files (Ctrl + Shift + F)"
          >
            <Search className="w-5 h-5" />
          </button>
        </ActionTooltip>

        {/* Coding Challenges Button */}
        <ActionTooltip label="Coding Challenges & Practice" shortcut="Trophy" placement="right">
          <button
            type="button"
            onClick={() => onToggleView(activeView === 'challenges' ? null : 'challenges')}
            className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer relative ${
              activeView === 'challenges'
                ? 'text-amber-400 border-l-2 border-amber-400 bg-[#252526]'
                : 'text-slate-400 hover:text-amber-400'
            }`}
            aria-label="Coding Challenges & Practice"
          >
            <Trophy className="w-5 h-5" />
          </button>
        </ActionTooltip>

        {/* Code Examples & Templates Button */}
        <ActionTooltip label="Code Examples & Templates" shortcut="Examples" placement="right">
          <button
            type="button"
            onClick={() => onToggleView(activeView === 'examples' ? null : 'examples')}
            className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer relative ${
              activeView === 'examples'
                ? 'text-emerald-400 border-l-2 border-emerald-400 bg-[#252526]'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
            aria-label="Code Examples & Templates"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </ActionTooltip>
      </div>

      {/* Bottom Section: Shortcuts & Settings with Safe Area Bottom Padding */}
      <div className="flex flex-col items-center gap-1 pb-10 sm:pb-3">
        <ActionTooltip label="Keyboard Shortcuts" shortcut="Shortcuts" placement="right">
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </ActionTooltip>

        <ActionTooltip label="Editor Settings" shortcut="Preferences" placement="right">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Editor Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </ActionTooltip>
      </div>
    </div>
  );
}
