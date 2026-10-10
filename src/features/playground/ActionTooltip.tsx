'use client';

import React, { useState } from 'react';

export interface ActionTooltipProps {
  label: string;
  shortcut?: string;
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'top' | 'top-start' | 'top-end';
  children: React.ReactNode;
  className?: string;
}

export default function ActionTooltip({
  label,
  shortcut,
  placement = 'bottom',
  children,
  className = '',
}: ActionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPlacementClass = () => {
    switch (placement) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'bottom-start':
        return 'top-full left-0 mt-2';
      case 'bottom-end':
        return 'top-full right-0 mt-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2.5';
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'top-start':
        return 'bottom-full left-0 mb-2';
      case 'top-end':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-[99999] pointer-events-none flex items-center gap-2 px-2.5 py-1.5 bg-[#18181b] border border-slate-700/90 text-white rounded-lg shadow-2xl text-[11px] font-sans whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 ${getPlacementClass()}`}
        >
          <span className="font-medium text-slate-100">{label}</span>
          {shortcut && (
            <kbd className="px-1.5 py-0.5 bg-[#27272a] text-slate-300 border border-slate-600 rounded text-[10px] font-mono font-semibold shadow-xs">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}
