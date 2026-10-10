'use client';

import React, { useState } from 'react';
import { BookOpen, X, Play, Search, Sparkles, ChevronRight, Code2 } from 'lucide-react';
import { CodeTemplate, SupportedLanguage } from './types';
import { STARTER_TEMPLATES } from './templates';

interface ExamplesSidebarProps {
  currentLanguage: SupportedLanguage;
  onSelectExample: (template: CodeTemplate) => void;
  onClose: () => void;
}

const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'python', label: 'Python (Pyodide)', icon: '🐍' },
  { value: 'html', label: 'Web (HTML / CSS / JS)', icon: '🌐' },
  { value: 'javascript', label: 'JavaScript (ES6+)', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'cpp', label: 'C++ (OOP & DSA)', icon: '⚙️' },
  { value: 'c', label: 'C Programming', icon: '🔧' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'sql', label: 'SQL (SQLite)', icon: '🗄️' },
  { value: 'markdown', label: 'Markdown (.md)', icon: '📝' },
];

export default function ExamplesSidebar({
  currentLanguage,
  onSelectExample,
  onClose,
}: ExamplesSidebarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewExampleId, setPreviewExampleId] = useState<string | null>(null);

  const templatesForLang = STARTER_TEMPLATES[selectedLanguage] || [];

  const filteredTemplates = templatesForLang.filter((tpl) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tpl.title.toLowerCase().includes(query) ||
      (tpl.description && tpl.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="w-80 sm:w-96 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full text-xs select-none shadow-xl z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f1f] border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs tracking-wide uppercase">
            Code Examples & Templates
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#333] transition-colors cursor-pointer"
          aria-label="Close Examples Panel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Language Selector & Search Header */}
      <div className="p-3 bg-[#202021] border-b border-[#2d2d2d] space-y-2.5">
        {/* Language Select Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Select Language:
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value as SupportedLanguage);
                setPreviewExampleId(null);
              }}
              className="w-full bg-[#181818] border border-slate-700 hover:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${LANGUAGE_OPTIONS.find((l) => l.value === selectedLanguage)?.label} examples...`}
            className="w-full bg-[#181818] border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Subheader Info */}
      <div className="px-3.5 py-1.5 bg-[#1e1e1e] border-b border-[#2a2a2a] text-[10px] text-slate-400 flex items-center justify-between">
        <span className="font-semibold uppercase tracking-wider">
          Available Examples ({filteredTemplates.length})
        </span>
        <span className="text-emerald-400/80 font-mono">
          {LANGUAGE_OPTIONS.find((l) => l.value === selectedLanguage)?.icon} {selectedLanguage}
        </span>
      </div>

      {/* Examples List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500">
            <Code2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="font-medium text-xs text-slate-400 mb-1">No examples found</p>
            <p className="text-[11px] text-slate-500">
              Try searching with another keyword or select a different language.
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const isPreviewing = previewExampleId === template.id;
            const codeLines = template.code.trim().split('\n');
            const previewSnippet = codeLines.slice(0, 4).join('\n');

            return (
              <div
                key={template.id}
                className="bg-[#1e1e1e] hover:bg-[#222223] border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3 transition-all group shadow-sm flex flex-col gap-2"
              >
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-slate-200 text-xs group-hover:text-emerald-300 transition-colors leading-snug">
                    {template.title}
                  </h4>
                </div>

                {/* Description */}
                {template.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                )}

                {/* Code Snippet Box */}
                <div className="bg-[#141414] border border-slate-800/80 rounded-lg p-2 font-mono text-[10px] text-slate-300 overflow-x-hidden relative">
                  <pre className="line-clamp-3 opacity-80 whitespace-pre-wrap break-all">
                    {isPreviewing ? template.code : previewSnippet}
                  </pre>
                  {codeLines.length > 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewExampleId((prev) => (prev === template.id ? null : template.id))
                      }
                      className="text-[9px] text-emerald-400 hover:text-emerald-300 mt-1 font-sans cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{isPreviewing ? 'Show less' : `+${codeLines.length - 4} more lines`}</span>
                      <ChevronRight
                        className={`w-2.5 h-2.5 transition-transform ${isPreviewing ? 'rotate-90' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* Action Button: Load in Editor */}
                <button
                  type="button"
                  onClick={() => onSelectExample(template)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500 rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer mt-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Load into Editor</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
