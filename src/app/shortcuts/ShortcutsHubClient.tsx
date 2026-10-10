'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Keyboard,
  ArrowRight,
  Sparkles,
  Command,
  FileSpreadsheet,
  FileText,
  Presentation,
  Monitor,
  Globe,
  Palette,
  Calculator,
  GitBranch,
  Terminal,
  Compass,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SOFTWARE_TOOLS } from '@/data/shortcutsData';
import { ShortcutItem } from '@/types/shortcuts';
import KeyCap from '@/components/shortcuts/KeyCap';

// Map icons for software cards
const TOOL_ICONS: Record<string, React.ElementType> = {
  vscode: Terminal,
  excel: FileSpreadsheet,
  word: FileText,
  powerpoint: Presentation,
  windows: Monitor,
  chrome: Globe,
  edge: Compass,
  photoshop: Palette,
  'tally-prime': Calculator,
  git: GitBranch,
  linux: Command,
};

export default function ShortcutsHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Content security: Block Ctrl+P / Cmd+P print attempts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        toast.error('Printing is disabled on this page.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'office', label: 'Office' },
    { id: 'development', label: 'Coding' },
    { id: 'os', label: 'OS & Terminal' },
    { id: 'design', label: 'Design' },
    { id: 'accounting', label: 'Accounting' },
    { id: 'browser', label: 'Browser' },
  ];

  // Filter software tools
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return SOFTWARE_TOOLS.filter((tool) => {
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      const inName = tool.name.toLowerCase().includes(q) || tool.shortName.toLowerCase().includes(q);
      const inTags = tool.tags.some((t) => t.toLowerCase().includes(q));
      const inDesc = tool.description.toLowerCase().includes(q);

      const cleanQ = q.replace(/[\s,+-]/g, '');

      const inShortcuts = tool.categories.some((cat) =>
        cat.shortcuts.some((sc) => {
          const keysStr = sc.keys.join(' ').toLowerCase();
          const keysComma = sc.keys.join(', ').toLowerCase();
          const cleanK = sc.keys.map((k) => k.toLowerCase()).join('');
          return (
            keysStr.includes(q) ||
            keysComma.includes(q) ||
            (cleanQ.length >= 2 && cleanK.includes(cleanQ)) ||
            sc.title.toLowerCase().includes(q)
          );
        })
      );

      return inName || inTags || inDesc || inShortcuts;
    });
  }, [searchQuery, selectedCategory]);

  // Direct matching shortcuts across all tools when searching
  const matchingShortcuts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const cleanQ = q.replace(/[\s,+-]/g, '');
    const matches: Array<{
      toolName: string;
      toolSlug: string;
      shortcut: ShortcutItem;
    }> = [];

    SOFTWARE_TOOLS.forEach((tool) => {
      tool.categories.forEach((cat) => {
        cat.shortcuts.forEach((sc) => {
          const keysStr = sc.keys.join(' ').toLowerCase();
          const keysComma = sc.keys.join(', ').toLowerCase();
          const cleanK = sc.keys.map((k) => k.toLowerCase()).join('');
          if (
            keysStr.includes(q) ||
            keysComma.includes(q) ||
            (cleanQ.length >= 2 && cleanK.includes(cleanQ)) ||
            sc.title.toLowerCase().includes(q)
          ) {
            matches.push({
              toolName: tool.shortName,
              toolSlug: tool.slug,
              shortcut: sc,
            });
          }
        });
      });
    });

    return matches.slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-16">
      {/* Print protection stylesheet */}
      <style jsx global>{`
        @media print {
          html, body {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-primary via-primary-light to-primary text-white pt-8 pb-12 sm:pb-14 border-b border-primary-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-secondary border border-white/15">
            <Keyboard className="w-3.5 h-3.5 text-secondary" />
            <span>Developer & Student Cheatsheets</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Keyboard Shortcuts <span className="text-secondary">Hub</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Quick reference guides and key combinations for popular coding editors, office tools, and operating systems.
          </p>

          {/* Compact Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search software (Excel, VS Code) or keys (Ctrl+P)..."
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 shadow-md border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-secondary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">
        {/* Direct Matching Shortcuts (if user searches a specific key) */}
        {matchingShortcuts.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-secondary/30 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-main dark:text-white">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Matching Shortcuts for &quot;{searchQuery}&quot;</span>
              </div>
              <span className="text-[11px] text-secondary font-medium">
                {matchingShortcuts.length} results
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {matchingShortcuts.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/shortcuts/${item.toolSlug}`}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-secondary transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-secondary uppercase block">
                      {item.toolName}
                    </span>
                    <p className="text-xs font-semibold text-text-main dark:text-white truncate">
                      {item.shortcut.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.shortcut.keys.slice(0, 3).map((k, kIdx) => (
                      <React.Fragment key={kIdx}>
                        <KeyCap keyName={k} size="sm" />
                        {kIdx < Math.min(item.shortcut.keys.length, 3) - 1 && (
                          <span className="text-[9px] text-slate-400 font-bold">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-border-subtle dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
              {cat.id === 'all' && ` (${SOFTWARE_TOOLS.length})`}
            </button>
          ))}
        </div>

        {/* Small & Sleek Software Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredTools.map((tool) => {
            const totalCount = tool.categories.reduce(
              (acc, cat) => acc + cat.shortcuts.length,
              0
            );
            const IconComponent = TOOL_ICONS[tool.id] || Keyboard;

            return (
              <Link
                key={tool.id}
                href={`/shortcuts/${tool.slug}`}
                className="group relative rounded-xl bg-white dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-4 shadow-2xs hover:shadow-md hover:border-secondary/60 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top colored accent indicator */}
                <div
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-b-sm"
                  style={{ backgroundColor: tool.accentColor }}
                />

                <div className="space-y-3">
                  {/* Top Bar: Icon + Category + Count */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: tool.lightBgColor,
                        color: tool.accentColor,
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {totalCount} Keys
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-text-main dark:text-white group-hover:text-secondary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-text-muted dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Top Preview Keys */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Popular:
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {tool.featuredShortcuts.slice(0, 2).map((f, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        >
                          <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {f.keys.join('+')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-secondary transition-colors">
                  <span>View Shortcuts</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredTools.length === 0 && (
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-8 text-center space-y-2">
            <h3 className="text-sm font-bold text-text-main dark:text-white">
              No software matched your search
            </h3>
            <p className="text-xs text-text-muted dark:text-slate-400">
              Try searching with another keyword or select &quot;All Tools&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-white hover:bg-secondary-light transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
