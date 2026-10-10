'use client';

import React from 'react';
import {
  FilePlus,
  FolderPlus,
  Play,
  Code2,
  Terminal,
  Search,
  Folder,
  Sparkles,
  FileUp,
  FolderUp,
  Archive,
  BookOpen,
} from 'lucide-react';

interface EmptyEditorStateProps {
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onOpenFirstFile?: () => void;
  onOpenLocalFile?: () => void;
  onOpenLocalFolder?: () => void;
  onOpenLocalZip?: () => void;
  onOpenExamples?: () => void;
  hasFiles: boolean;
}

export default function EmptyEditorState({
  onCreateFile,
  onCreateFolder,
  onOpenFirstFile,
  onOpenLocalFile,
  onOpenLocalFolder,
  onOpenLocalZip,
  onOpenExamples,
  hasFiles,
}: EmptyEditorStateProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#1e1e1e] text-slate-300 select-none overflow-y-auto">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {/* Glowing Watermark Icon */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-secondary/20 to-amber-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#252526] border border-slate-700/80 flex items-center justify-center shadow-2xl">
            <Code2 className="w-8 h-8 text-secondary" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">
          No Editors Open
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm">
          Select a file from the explorer sidebar, create a new file or folder, or open files from your computer or phone.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={onCreateFile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>New File</span>
          </button>

          <button
            type="button"
            onClick={onCreateFolder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Folder</span>
          </button>

          {onOpenLocalFile && (
            <button
              type="button"
              onClick={onOpenLocalFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
              title="Open code/text files from device (Ctrl + O)"
            >
              <FileUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Open Local File</span>
            </button>
          )}

          {onOpenLocalFolder && (
            <button
              type="button"
              onClick={onOpenLocalFolder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
              title="Open project folder from device (Alt + O)"
            >
              <FolderUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Local Folder</span>
            </button>
          )}

          {onOpenLocalZip && (
            <button
              type="button"
              onClick={onOpenLocalZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
              title="Extract & open .zip project from device"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400" />
              <span>Open ZIP</span>
            </button>
          )}

          {onOpenExamples && (
            <button
              type="button"
              onClick={onOpenExamples}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
              title="Browse Code Examples & Templates"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>Browse Examples</span>
            </button>
          )}

          {hasFiles && onOpenFirstFile && (
            <button
              type="button"
              onClick={onOpenFirstFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-sky-400" />
              <span>Open Workspace File</span>
            </button>
          )}
        </div>

        {/* Drag and Drop notice */}
        <p className="text-[11px] text-slate-500 mb-6 flex items-center gap-1.5">
          <span>💡 Tip: You can also drag & drop files or folders anywhere onto the playground</span>
        </p>

        {/* Keyboard Shortcuts Cheat Sheet */}
        <div className="w-full bg-[#181818]/80 border border-slate-800 rounded-xl p-3.5 text-left text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Essential Keyboard Shortcuts</span>
            <Sparkles className="w-3 h-3 text-secondary" />
          </div>

          <div className="space-y-2 text-[11px] font-sans">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Run Code / Active File</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + Enter
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="text-xs">💾</span>
                <span>Save Active File</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + S
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Folder className="w-3 h-3 text-amber-400" />
                <span>Toggle Primary Side Bar</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + B
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-sky-400" />
                <span>Toggle Terminal / Output Panel</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + `
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-amber-400" />
                <span>Search in Files</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + Shift + F
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileUp className="w-3 h-3 text-purple-400" />
                <span>Open File from Device</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-[#252526] text-slate-300 border border-slate-700 rounded font-mono text-[10px]">
                Ctrl + O
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
