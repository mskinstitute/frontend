'use client';

import React, { useEffect } from 'react';
import { X, Settings, RotateCcw, Palette, Sliders, Type, SplitSquareHorizontal, SplitSquareVertical } from 'lucide-react';
import { PlaygroundSettings, DEFAULT_PLAYGROUND_SETTINGS } from './types';

interface PlaygroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlaygroundSettings;
  onUpdateSettings: (newSettings: Partial<PlaygroundSettings>) => void;
  onResetDefaults: () => void;
}

export default function PlaygroundSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
}: PlaygroundSettingsModalProps) {
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0d1117] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Playground Settings</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  VS Code Preferences
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Customize your editor layout, typography, themes, and typing behaviors
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

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          {/* Section: Layout & Orientation */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-2.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Workspace Layout & Orientation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0d1117] p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Panel Position</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ panelPosition: 'right' })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      settings.panelPosition === 'right'
                        ? 'bg-secondary/20 border-secondary text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <SplitSquareHorizontal className="w-3.5 h-3.5" />
                    <span>Split Right</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ panelPosition: 'bottom' })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      settings.panelPosition === 'bottom'
                        ? 'bg-secondary/20 border-secondary text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    <span>Split Bottom</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {settings.panelPosition === 'right' ? 'Editor on left, Output on right' : 'Integrated terminal below editor'}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tab Indentation</label>
                <select
                  value={settings.tabSize}
                  onChange={(e) => onUpdateSettings({ tabSize: Number(e.target.value) as 2 | 4 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value={4}>4 Spaces (Standard Python & PEP 8)</option>
                  <option value={2}>2 Spaces (Standard Web & JS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Typography & Appearance */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme & Typography</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0d1117] p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Color Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as PlaygroundSettings['theme'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value="vs-dark">VS Code Dark+ (Default)</option>
                  <option value="light">VS Code Light+</option>
                  <option value="hc-black">High Contrast (Accessibility)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Font Size ({settings.fontSize}px)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={12}
                    max={22}
                    step={1}
                    value={settings.fontSize}
                    onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                    className="w-full accent-secondary cursor-pointer"
                  />
                  <span className="font-mono text-slate-300 w-8 text-right">{settings.fontSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value="'Fira Code', 'JetBrains Mono', Consolas, monospace">Fira Code (Ligatures)</option>
                  <option value="'JetBrains Mono', Consolas, monospace">JetBrains Mono</option>
                  <option value="Consolas, 'Courier New', monospace">Consolas (Standard Windows)</option>
                  <option value="Menlo, Monaco, monospace">Menlo / Monaco (macOS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Line Numbers</label>
                <select
                  value={settings.lineNumbers}
                  onChange={(e) => onUpdateSettings({ lineNumbers: e.target.value as PlaygroundSettings['lineNumbers'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="relative">Relative (Vim Style)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Cursor & Editor Behaviors */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
              <Type className="w-3.5 h-3.5" />
              <span>Cursor & Typing Behaviors</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0d1117] p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cursor Style</label>
                <select
                  value={settings.cursorStyle}
                  onChange={(e) => onUpdateSettings({ cursorStyle: e.target.value as PlaygroundSettings['cursorStyle'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value="line">Line (Thin Bar)</option>
                  <option value="block">Block (Full Box)</option>
                  <option value="underline">Underline</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cursor Animation</label>
                <select
                  value={settings.cursorBlinking}
                  onChange={(e) => onUpdateSettings({ cursorBlinking: e.target.value as PlaygroundSettings['cursorBlinking'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
                >
                  <option value="smooth">Smooth (Modern Glide)</option>
                  <option value="blink">Standard Blink</option>
                  <option value="expand">Expand & Contract</option>
                  <option value="solid">Solid (Always On)</option>
                </select>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <label className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => onUpdateSettings({ wordWrap: e.target.checked })}
                    className="accent-secondary w-4 h-4 rounded"
                  />
                  <span className="text-slate-300 font-medium">Word Wrap</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.minimap}
                    onChange={(e) => onUpdateSettings({ minimap: e.target.checked })}
                    className="accent-secondary w-4 h-4 rounded"
                  />
                  <span className="text-slate-300 font-medium">Code Minimap</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.bracketPairColorization}
                    onChange={(e) => onUpdateSettings({ bracketPairColorization: e.target.checked })}
                    className="accent-secondary w-4 h-4 rounded"
                  />
                  <span className="text-slate-300 font-medium">Bracket Colors</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#0d1117] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
