'use client';

import React from 'react';
import { KEYBOARD_ROWS, FINGER_INFO } from '../data/keyboardLayout';
import { FingerName } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextChar: string | null;
  showFingerColors?: boolean;
  keyStats?: Record<string, { total: number; errors: number }> | null;
}

export default function VirtualKeyboard({
  activeKey,
  nextChar,
  showFingerColors = true,
  keyStats = null,
}: VirtualKeyboardProps) {
  const [heatmapMode, setHeatmapMode] = React.useState(false);

  // Determine if Shift is required for nextChar
  const isShiftRequired = React.useMemo(() => {
    if (!nextChar) return false;
    // Check if nextChar is uppercase letter
    if (nextChar.length === 1 && nextChar >= 'A' && nextChar <= 'Z') return true;
    // Check if nextChar is a shift symbol
    for (const row of KEYBOARD_ROWS) {
      for (const keyDef of row) {
        if (keyDef.shiftKey && keyDef.shiftKey === nextChar) {
          return true;
        }
      }
    }
    return false;
  }, [nextChar]);

  // Determine if a key is the next target
  const isTargetKey = (key: string, shiftKey?: string, code?: string) => {
    if (!nextChar) return false;
    if (code === 'Space' && nextChar === ' ') return true;
    if (code === 'Enter' && nextChar === '\n') return true;
    if (key.toLowerCase() === nextChar.toLowerCase()) return true;
    if (shiftKey && shiftKey === nextChar) return true;
    return false;
  };

  // Determine if a key is currently pressed
  const isCurrentActive = (key: string, code?: string) => {
    if (!activeKey) return false;
    if (activeKey === ' ' && code === 'Space') return true;
    if (activeKey.toLowerCase() === key.toLowerCase()) return true;
    if (activeKey === code) return true;
    return false;
  };

  // Count total weak keys
  const weakKeysCount = React.useMemo(() => {
    if (!keyStats) return 0;
    return Object.entries(keyStats).filter(
      ([, stat]) => stat.total >= 3 && stat.errors / stat.total >= 0.15
    ).length;
  }, [keyStats]);

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md select-none transition-all">
      {/* Keyboard Header / Legend & Heatmap Toggle */}
      <div className="flex flex-wrap items-center justify-between px-2 pb-2.5 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${heatmapMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="font-mono font-medium text-slate-200">
              {heatmapMode ? 'Weak-Key Error Heatmap' : 'Interactive Touch-Typing Guide'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setHeatmapMode(!heatmapMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              heatmapMode
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
            }`}
            title="Toggle between finger guide and error heatmap"
          >
            <span>{heatmapMode ? '🔥 Heatmap Active' : '📊 View Heatmap'}</span>
            {weakKeysCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white font-bold rounded-full">
                {weakKeysCount} weak
              </span>
            )}
          </button>
        </div>

        {/* Legend */}
        {heatmapMode ? (
          <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> High Error (&gt;20%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Caution (5-20%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered (&lt;5%)
            </span>
          </div>
        ) : showFingerColors ? (
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" /> Pinky
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Ring
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Middle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Index
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Thumb
            </span>
          </div>
        ) : null}
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((keyDef, keyIndex) => {
              const target = isTargetKey(keyDef.key, keyDef.shiftKey, keyDef.code);
              const active = isCurrentActive(keyDef.key, keyDef.code);
              const isShiftKey = keyDef.code.includes('Shift');
              const highlightShift = isShiftKey && isShiftRequired;
              const finger = FINGER_INFO[keyDef.finger];

              // Heatmap calculation
              const keyStat = keyStats ? keyStats[keyDef.key.toLowerCase()] : null;
              let heatmapClass = '';
              let errorRate = 0;
              if (heatmapMode && keyStat && keyStat.total > 0) {
                errorRate = Math.round((keyStat.errors / keyStat.total) * 100);
                if (errorRate >= 20) {
                  heatmapClass = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                } else if (errorRate >= 5) {
                  heatmapClass = 'bg-amber-950/60 border-amber-500/70 text-amber-200';
                } else {
                  heatmapClass = 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200';
                }
              }

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-mono font-bold transition-all duration-100 ${
                    keyDef.width || 'w-8 sm:w-11 md:w-12'
                  } h-9 sm:h-11 md:h-12 shadow-md ${
                    active
                      ? 'bg-secondary text-white scale-95 shadow-inner translate-y-0.5 border-b-0 border-secondary'
                      : target || highlightShift
                      ? 'bg-slate-800 text-secondary border-2 border-secondary ring-2 ring-secondary/40 animate-pulse'
                      : heatmapMode && heatmapClass
                      ? `${heatmapClass} border-b-2 sm:border-b-4 hover:brightness-110`
                      : 'bg-slate-800/80 text-slate-200 border-b-2 sm:border-b-4 border-slate-950 hover:bg-slate-700/80'
                  }`}
                  style={{
                    boxShadow: active
                      ? 'inset 0 2px 4px rgba(0,0,0,0.4)'
                      : undefined,
                  }}
                >
                  {/* Shift label if present */}
                  {keyDef.shiftKey && (
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal leading-none mb-0.5">
                      {keyDef.shiftKey}
                    </span>
                  )}

                  {/* Primary Key Label */}
                  <span className="leading-tight uppercase">
                    {keyDef.code === 'Space' ? '— Space —' : keyDef.key}
                  </span>

                  {/* Heatmap error badge on key */}
                  {heatmapMode && keyStat && keyStat.total > 0 && (
                    <span
                      className={`text-[8px] sm:text-[9px] font-sans font-semibold leading-none ${
                        errorRate >= 20 ? 'text-rose-400' : errorRate >= 5 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {errorRate > 0 ? `${errorRate}%` : '✓'}
                    </span>
                  )}

                  {/* Tactile bump marker for F and J keys */}
                  {(keyDef.key === 'f' || keyDef.key === 'j') && (
                    <span className="absolute bottom-1 w-2.5 sm:w-3 h-0.5 bg-slate-400 rounded-full" />
                  )}

                  {/* Finger Dot Indicator */}
                  {!heatmapMode && showFingerColors && keyDef.code !== 'Space' && (
                    <span
                      className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: finger.color }}
                      title={`${finger.label} (${finger.hand} Hand)`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
