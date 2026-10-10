'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Keyboard,
  Share2,
  Check,
  ChevronRight,
  Star,
  Monitor,
  Apple,
  FileCode,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SoftwareTool, ShortcutItem } from '@/types/shortcuts';
import ShortcutCard from '@/components/shortcuts/ShortcutCard';
import { SOFTWARE_TOOLS } from '@/data/shortcutsData';

interface ShortcutToolClientProps {
  tool: SoftwareTool;
}

export default function ShortcutToolClient({ tool }: ShortcutToolClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMac, setIsMac] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Content security: Block Ctrl+P / Cmd+P
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

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(`msk_shortcuts_${tool.id}_bookmarks`);
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch {
      // ignore
    }
  }, [tool.id]);

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(`msk_shortcuts_${tool.id}_bookmarks`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Flatten all shortcuts
  const allShortcuts = useMemo(() => {
    const list: ShortcutItem[] = [];
    tool.categories.forEach((cat) => {
      cat.shortcuts.forEach((sc) => {
        list.push(sc);
      });
    });
    return list;
  }, [tool]);

  // Export to VS Code keybindings.json
  const handleExportKeybindingsJson = () => {
    const keybindings = allShortcuts
      .filter((sc) => sc.vscodeCommand || sc.isStudentPro)
      .map((sc) => ({
        key: (isMac && sc.macKeys ? sc.macKeys : sc.keys).join('+').toLowerCase(),
        command: sc.vscodeCommand || `workbench.action.${sc.title.toLowerCase().replace(/\s+/g, '')}`,
      }));

    const jsonString = JSON.stringify(keybindings, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast.success('Copied VS Code keybindings.json to clipboard!', { duration: 3000 });
  };

  // Filter shortcuts
  const filteredShortcuts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return allShortcuts.filter((sc) => {
      if (selectedCategory === 'favorites') {
        if (!bookmarkedIds.includes(sc.id)) return false;
      } else if (selectedCategory !== 'all' && sc.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;

      const rawKeys = isMac && sc.macKeys ? sc.macKeys : sc.keys;
      const keysSpace = rawKeys.join(' ').toLowerCase();
      const keysComma = rawKeys.join(', ').toLowerCase();
      const keysCommaTight = rawKeys.join(',').toLowerCase();
      const keysPlus = rawKeys.join('+').toLowerCase();

      const queryClean = query.replace(/[\s,+-]/g, '');
      const keysClean = rawKeys.map((k) => k.toLowerCase()).join('');
      const inClean = queryClean.length >= 2 && keysClean.includes(queryClean);

      const inKeys =
        keysSpace.includes(query) ||
        keysComma.includes(query) ||
        keysCommaTight.includes(query) ||
        keysPlus.includes(query) ||
        rawKeys.some((k) => k.toLowerCase() === query) ||
        inClean;

      const inTitle = sc.title.toLowerCase().includes(query);
      const inDesc = sc.description.toLowerCase().includes(query);
      const inCommand = sc.vscodeCommand?.toLowerCase().includes(query);

      return inKeys || inTitle || inDesc || inCommand;
    });
  }, [allShortcuts, searchQuery, selectedCategory, isMac, bookmarkedIds]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} Keyboard Shortcuts | MSK Institute`,
          text: `Explore all ${tool.name} keyboard shortcuts on MSK Institute.`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        toast.error('Could not copy link');
      }
    }
  };

  const otherTools = useMemo(() => {
    return SOFTWARE_TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);
  }, [tool.id]);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-16 select-text">
      {/* Print protection */}
      <style jsx global>{`
        @media print {
          html, body {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-primary via-primary-light to-primary text-white pt-8 pb-10 sm:pb-12 border-b border-primary-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/shortcuts" className="hover:text-white transition-colors">
              Shortcuts Hub
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-secondary font-semibold">{tool.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/10 text-secondary border border-white/15">
                  {tool.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {allShortcuts.length} Shortcuts
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {tool.name} <span className="text-secondary">Shortcuts</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Quick Actions (OS Switcher + Export keybindings + Share) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* OS Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
                <button
                  onClick={() => setIsMac(false)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                    !isMac
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Win</span>
                </button>
                <button
                  onClick={() => setIsMac(true)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                    isMac
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Apple className="w-3 h-3" />
                  <span>Mac</span>
                </button>
              </div>

              {/* VS Code keybindings.json export */}
              {tool.id === 'vscode' && (
                <button
                  onClick={handleExportKeybindingsJson}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                  title="Copy keybindings.json for VS Code"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-300" />
                  <span className="hidden sm:inline">keybindings.json</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-secondary" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="space-y-4">
          {/* Search Bar & Category Navigation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border-subtle dark:border-slate-800 p-4 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${tool.shortName} shortcuts by key (e.g. Ctrl+K) or action...`}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded-lg border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-white border-primary shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                All ({allShortcuts.length})
              </button>

              {/* Starred Tab */}
              {bookmarkedIds.length > 0 && (
                <button
                  onClick={() => setSelectedCategory('favorites')}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                    selectedCategory === 'favorites'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Starred ({bookmarkedIds.length})</span>
                </button>
              )}

              {tool.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.name} ({cat.shortcuts.length})
                </button>
              ))}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between text-xs text-text-muted dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>
                Showing <strong>{filteredShortcuts.length}</strong> of {allShortcuts.length} shortcuts
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-secondary hover:underline font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Shortcuts Grid / List */}
          {filteredShortcuts.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-main dark:text-white">
                No shortcuts found
              </h3>
              <p className="text-xs text-text-muted dark:text-slate-400 max-w-sm mx-auto">
                No shortcut matches &quot;{searchQuery}&quot;. Try searching for common key combinations or actions.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-secondary text-white hover:bg-secondary-light transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredShortcuts.map((sc) => (
                <ShortcutCard
                  key={sc.id}
                  shortcut={sc}
                  isMac={isMac}
                  isBookmarked={bookmarkedIds.includes(sc.id)}
                  onToggleBookmark={toggleBookmark}
                  accentColor={tool.accentColor}
                />
              ))}
            </div>
          )}

          {/* Explore Other Software Shortcuts */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main dark:text-white">
                  Explore Other Software
                </h3>
                <p className="text-xs text-text-muted dark:text-slate-400">
                  Quick access to other tools
                </p>
              </div>
              <Link
                href="/shortcuts"
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {otherTools.map((other) => (
                <Link
                  key={other.id}
                  href={`/shortcuts/${other.slug}`}
                  className="group rounded-xl bg-white dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-3 hover:border-secondary hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {other.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-text-main dark:text-white group-hover:text-secondary transition-colors line-clamp-1">
                      {other.name}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-secondary transition-colors">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
