'use client';

import React from 'react';

interface KeyCapProps {
  keyName: string;
  size?: 'sm' | 'md' | 'lg';
  isPressed?: boolean;
  className?: string;
  isMac?: boolean;
}

// Map key labels for Mac equivalent glyphs if user prefers macOS
const MAC_GLYPHS: Record<string, string> = {
  ctrl: '⌃ Control',
  control: '⌃ Control',
  alt: '⌥ Option',
  option: '⌥ Option',
  shift: '⇧ Shift',
  win: '⌘ Cmd',
  windows: '⌘ Cmd',
  cmd: '⌘ Cmd',
  command: '⌘ Cmd',
  enter: '↵ Return',
  return: '↵ Return',
  backspace: '⌫ Delete',
  delete: '⌦ Del',
  tab: '⇥ Tab',
  esc: '⎋ Esc',
};

export default function KeyCap({
  keyName,
  size = 'md',
  isPressed = false,
  className = '',
  isMac = false,
}: KeyCapProps) {
  const cleanKey = keyName.trim();
  const lowerKey = cleanKey.toLowerCase();

  // If in Mac mode and key is recognized, format with Mac glyphs
  const displayLabel = isMac && MAC_GLYPHS[lowerKey] ? MAC_GLYPHS[lowerKey] : cleanKey;

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 min-w-[22px] min-h-[22px]',
    md: 'text-xs px-2.5 py-1 min-w-[28px] min-h-[28px]',
    lg: 'text-sm px-3.5 py-1.5 min-w-[34px] min-h-[34px] font-semibold',
  }[size];

  return (
    <kbd
      className={`
        inline-flex items-center justify-center font-mono font-medium rounded-md
        transition-all duration-150 select-none tracking-tight
        ${sizeClasses}
        ${
          isPressed
            ? 'bg-secondary text-white border-b border-orange-700 shadow-inner scale-95 ring-2 ring-secondary/40'
            : 'bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 border-b-[3px] border-b-slate-400 dark:border-b-slate-950 shadow-sm hover:border-slate-400 dark:hover:border-slate-600'
        }
        ${className}
      `}
      title={displayLabel}
    >
      {displayLabel}
    </kbd>
  );
}
