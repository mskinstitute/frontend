'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check, Keyboard, Sliders } from 'lucide-react';
import { ShortcutItem } from '@/types/shortcuts';
import KeyCap from './KeyCap';

interface CustomizeShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: Partial<ShortcutItem>) => void;
  editingShortcut?: ShortcutItem | null;
  categories: Array<{ id: string; name: string }>;
  isMac?: boolean;
}

export default function CustomizeShortcutModal({
  isOpen,
  onClose,
  onSave,
  editingShortcut,
  categories,
  isMac = false,
}: CustomizeShortcutModalProps) {
  const [title, setTitle] = useState('');
  const [keysInput, setKeysInput] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [vscodeCommand, setVscodeCommand] = useState('');

  useEffect(() => {
    if (editingShortcut) {
      setTitle(editingShortcut.title);
      setKeysInput((isMac && editingShortcut.macKeys ? editingShortcut.macKeys : editingShortcut.keys).join(' + '));
      setCategory(editingShortcut.category);
      setDescription(editingShortcut.description);
      setVscodeCommand(editingShortcut.vscodeCommand || '');
    } else {
      setTitle('');
      setKeysInput('');
      setCategory(categories[0]?.id || 'custom');
      setDescription('');
      setVscodeCommand('');
    }
  }, [editingShortcut, categories, isMac, isOpen]);

  if (!isOpen) return null;

  const parsedKeys = keysInput
    .split('+')
    .map((k) => k.trim())
    .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || parsedKeys.length === 0) return;

    onSave({
      id: editingShortcut ? editingShortcut.id : `custom-${Date.now()}`,
      title: title.trim(),
      keys: parsedKeys,
      category: category || 'custom',
      description: description.trim() || 'Custom user defined key combination.',
      vscodeCommand: vscodeCommand.trim() || undefined,
      isCustom: !editingShortcut,
      isCustomized: !!editingShortcut,
      originalKeys: editingShortcut?.originalKeys || editingShortcut?.keys,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              {editingShortcut ? <Sliders className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-bold text-text-main dark:text-white">
              {editingShortcut ? 'Customize Shortcut' : 'Add Custom Shortcut'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              Shortcut Title / Action Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run Python Script, Format & Save..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          {/* Keys Combination */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              Key Combination (Separated by +) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={keysInput}
              onChange={(e) => setKeysInput(e.target.value)}
              placeholder="e.g. Ctrl + Alt + R  or  Ctrl + Shift + S"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-secondary/40"
            />

            {/* Live Keycap Preview */}
            {parsedKeys.length > 0 && (
              <div className="pt-1 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Preview:</span>
                <div className="flex items-center gap-1">
                  {parsedKeys.map((k, idx) => (
                    <React.Fragment key={idx}>
                      <KeyCap keyName={k} size="sm" isMac={isMac} />
                      {idx < parsedKeys.length - 1 && (
                        <span className="text-[10px] text-slate-400 font-bold">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              Category Group
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-secondary/40"
            >
              <option value="student-pro">Student Pro Keybindings</option>
              <option value="custom">My Custom Shortcuts</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this shortcut is used for..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-secondary/40 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-light font-bold transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingShortcut ? 'Save Changes' : 'Add Shortcut'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
