'use client';

import React, { useEffect } from 'react';
import { X, Keyboard, Command, Play, Terminal, Sliders, FileCode } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'execution' | 'editor' | 'navigation';
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Auto-save & Run Code (executes only selected query if text is highlighted in SQL)',
    category: 'execution',
  },
  {
    keys: ['Ctrl', 'S'],
    description: 'Format document and trigger save',
    category: 'execution',
  },
  {
    keys: ['Ctrl', 'B'],
    description: 'Toggle Primary Side Bar (File Explorer, Search, Challenges, Examples)',
    category: 'navigation',
  },
  {
    keys: ['Ctrl', '`'],
    description: 'Toggle Terminal / Output panel (opens automatically on code run)',
    category: 'execution',
  },
  {
    keys: ['Ctrl', 'Mouse Scroll'],
    description: 'Zoom in / Zoom out editor font',
    category: 'editor',
  },
  {
    keys: ['Ctrl', 'Shift', 'E'],
    description: 'Toggle File Explorer sidebar',
    category: 'navigation',
  },
  {
    keys: ['Ctrl', 'Shift', 'F'],
    description: 'Toggle Search in all files',
    category: 'navigation',
  },
  {
    keys: ['Ctrl', 'O'],
    description: 'Open code/text file(s) from computer or phone',
    category: 'navigation',
  },
  {
    keys: ['Alt', 'O'],
    description: 'Open project folder from device',
    category: 'navigation',
  },
  {
    keys: ['Shift', 'Alt', 'F'],
    description: 'Format Document (Auto-indent & Clean syntax)',
    category: 'editor',
  },
  {
    keys: ['Ctrl', '/'],
    description: 'Toggle Line Comment (# or //)',
    category: 'editor',
  },
  {
    keys: ['Ctrl', 'Space'],
    description: 'Trigger IntelliSense / Code Suggestions',
    category: 'editor',
  },
  {
    keys: ['Alt', '↑ / ↓'],
    description: 'Move current line up or down',
    category: 'editor',
  },
  {
    keys: ['Shift', 'Alt', '↑ / ↓'],
    description: 'Copy line up or down (Duplicate line)',
    category: 'editor',
  },
  {
    keys: ['Ctrl', 'D'],
    description: 'Select next occurrence of current word',
    category: 'editor',
  },
  {
    keys: ['F1'],
    description: 'Open Monaco VS Code Command Palette',
    category: 'navigation',
  },
  {
    keys: ['Esc'],
    description: 'Close active modal / Clear focus',
    category: 'navigation',
  },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-[#161b22] text-slate-200 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0d1117] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>VS Code Keyboard Shortcuts</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Cheat Sheet
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Work faster in the playground using standard Visual Studio Code shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Section: Execution */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 mb-2">
              <Play className="w-3 h-3" />
              <span>Program Execution & Panels</span>
            </span>
            <div className="space-y-1.5 bg-[#0d1117] p-2.5 rounded-xl border border-slate-800/80">
              {SHORTCUTS.filter((s) => s.category === 'execution').map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="text-slate-300">{item.description}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-200 font-semibold shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Editor */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <FileCode className="w-3 h-3" />
              <span>Code Editing & Formatting</span>
            </span>
            <div className="space-y-1.5 bg-[#0d1117] p-2.5 rounded-xl border border-slate-800/80">
              {SHORTCUTS.filter((s) => s.category === 'editor').map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="text-slate-300">{item.description}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-200 font-semibold shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Navigation */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <Sliders className="w-3 h-3" />
              <span>Navigation & Command Palette</span>
            </span>
            <div className="space-y-1.5 bg-[#0d1117] p-2.5 rounded-xl border border-slate-800/80">
              {SHORTCUTS.filter((s) => s.category === 'navigation').map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="text-slate-300">{item.description}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-200 font-semibold shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d1117] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: On macOS, use <strong>Cmd (⌘)</strong> instead of <strong>Ctrl</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
