'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Sparkles, CheckCircle2, RotateCcw, HelpCircle, X } from 'lucide-react';
import KeyCap from './KeyCap';
import { ShortcutItem } from '@/types/shortcuts';

interface KeystrokeTesterProps {
  toolName: string;
  shortcuts: ShortcutItem[];
  isMac?: boolean;
}

export default function KeystrokeTester({
  toolName,
  shortcuts,
  isMac = false,
}: KeystrokeTesterProps) {
  const [isListening, setIsListening] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [matchedShortcut, setMatchedShortcut] = useState<ShortcutItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isListening) return;

    const normalizeKeyName = (key: string): string => {
      const lower = key.toLowerCase();
      if (lower === 'control') return 'Ctrl';
      if (lower === 'meta' || lower === 'os') return isMac ? 'Cmd' : 'Win';
      if (lower === 'alt') return isMac ? 'Option' : 'Alt';
      if (lower === 'shift') return 'Shift';
      if (lower === 'enter') return 'Enter';
      if (lower === 'escape') return 'Esc';
      if (lower === 'backspace') return 'Backspace';
      if (lower === 'tab') return 'Tab';
      if (lower === ' ') return 'Space';
      if (key.length === 1) return key.toUpperCase();
      return key;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }

      // Prevent default for common shortcut conflicts when testing
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Tab'].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }

      const keys: string[] = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push(isMac ? 'Option' : 'Alt');
      if (e.metaKey) keys.push(isMac ? 'Cmd' : 'Win');

      const mainKey = normalizeKeyName(e.key);
      if (!['Ctrl', 'Shift', 'Alt', 'Option', 'Cmd', 'Win'].includes(mainKey)) {
        keys.push(mainKey);
      }

      setActiveKeys(keys);

      // Search for matched shortcut
      if (keys.length > 0) {
        const joinedKeys = keys.map((k) => k.toLowerCase()).sort().join('+');
        const found = shortcuts.find((sc) => {
          const scKeys = (isMac && sc.macKeys ? sc.macKeys : sc.keys)
            .map((k) => k.toLowerCase().replace(/\s+/g, ''))
            .filter((k) => k !== '/')
            .sort()
            .join('+');
          return scKeys === joinedKeys;
        });

        setMatchedShortcut(found || null);
      }
    };

    const handleKeyUp = () => {
      // We keep the keys visible for a short moment so student can read
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, isMac, shortcuts]);

  const handleReset = () => {
    setActiveKeys([]);
    setMatchedShortcut(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isListening
          ? 'bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-orange-900/10 dark:from-blue-950/40 dark:to-orange-950/20 border-secondary ring-2 ring-secondary/20 shadow-md'
          : 'bg-surface dark:bg-slate-900/60 border-border-subtle dark:border-slate-800'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle/70 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isListening
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-400'
              }`}
            >
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-text-main dark:text-white">
                  Live Keystroke Practice Lab
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary dark:text-orange-400 border border-secondary/25">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-text-muted dark:text-slate-400">
                अपने कीबोर्ड पर कोई भी शॉर्टकट की दबाएं और लाइव रिजल्ट देखें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isListening ? (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsListening(false);
                    handleReset();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Stop Testing
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsListening(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-light shadow-sm transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                Start Testing My Keyboard
              </button>
            )}
          </div>
        </div>

        {/* Practice View */}
        {isListening ? (
          <div className="pt-4 space-y-4">
            <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-white/70 dark:bg-slate-950/60 border border-border-subtle dark:border-slate-800 text-center min-h-[140px]">
              {activeKeys.length === 0 ? (
                <div className="animate-pulse space-y-2">
                  <p className="text-sm font-semibold text-text-main dark:text-slate-200">
                    ⌨️ Ready! Press any key or combo (e.g. <span className="font-mono font-bold text-secondary">Ctrl + Shift + P</span>) on your keyboard now...
                  </p>
                  <p className="text-xs text-text-muted dark:text-slate-400">
                    कीबोर्ड पर एक साथ कीज दबाएं (Press together)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {activeKeys.map((key, index) => (
                      <React.Fragment key={index}>
                        <KeyCap keyName={key} size="lg" isPressed isMac={isMac} />
                        {index < activeKeys.length - 1 && (
                          <span className="text-sm font-bold text-slate-400">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {matchedShortcut ? (
                    <div className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Matched in {toolName}: {matchedShortcut.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 max-w-md">
                        {matchedShortcut.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No direct shortcut in {toolName} catalog, or try holding Ctrl / Alt with another key!
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-text-muted dark:text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-secondary" />
                Tip: Hold modifier keys (Ctrl, Shift, Alt) first, then tap the letter key.
              </span>
              <span>Live Mode: Active</span>
            </div>
          </div>
        ) : (
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted dark:text-slate-400">
            <span>
              🎯 <strong>Student Practice Tip:</strong> Click &quot;Start Testing&quot; to verify your keyboard keys and learn by typing live.
            </span>
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-400">
              Supported: Ctrl, Shift, Alt, Win, Cmd, F1-F12
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
