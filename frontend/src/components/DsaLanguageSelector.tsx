'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Code2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Terminal,
  Zap,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface LanguageOption {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  accentBg: string;
  topicsHighlight: string[];
}

export const DSA_LANGUAGES: LanguageOption[] = [
  {
    id: 'python',
    name: 'Python',
    label: 'Beginner Friendly',
    description: 'Learn DSA using clean, expressive, and human-readable Python implementations. Ideal for rapid prototyping and AI foundations.',
    icon: '🐍',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300',
    badgeText: 'text-amber-800',
    accentBorder: 'border-amber-400 ring-amber-400/20 bg-amber-50/40',
    accentBg: 'bg-amber-500',
    topicsHighlight: ['List & Dict Comprehensions', 'collections.deque & heapq', 'Recursion & Dynamic Programming'],
  },
  {
    id: 'c',
    name: 'C',
    label: 'Systems & Pointers',
    description: 'Understand raw pointers, heap allocation with malloc/free, and manual memory mechanics at the hardware level.',
    icon: '⚡',
    badgeBg: 'bg-sky-100/90 text-sky-900 border-sky-300',
    badgeText: 'text-sky-800',
    accentBorder: 'border-sky-400 ring-sky-400/20 bg-sky-50/40',
    accentBg: 'bg-sky-600',
    topicsHighlight: ['Pointers & Address Arithmetic', 'malloc / free & Structs', 'Low-Level Linked Lists & Buffers'],
  },
  {
    id: 'cpp',
    name: 'C++',
    label: 'Competitive Programming',
    description: 'Master lightning-fast problem-solving with the C++ Standard Template Library (STL: vector, map, set, priority_queue).',
    icon: '🚀',
    badgeBg: 'bg-cyan-100/90 text-cyan-900 border-cyan-300',
    badgeText: 'text-cyan-800',
    accentBorder: 'border-cyan-500 ring-cyan-500/20 bg-cyan-50/40',
    accentBg: 'bg-cyan-600',
    topicsHighlight: ['STL Containers & Iterators', 'Custom Comparators & Lambda', 'Graph Traversals & Segment Trees'],
  },
  {
    id: 'java',
    name: 'Java',
    label: 'Enterprise & Interviews',
    description: 'Solve interview problems using Java OOP, Generics, and the Java Collections Framework (ArrayList, HashMap, PriorityQueue).',
    icon: '☕',
    badgeBg: 'bg-orange-100/90 text-orange-900 border-orange-300',
    badgeText: 'text-orange-800',
    accentBorder: 'border-orange-500 ring-orange-500/20 bg-orange-50/40',
    accentBg: 'bg-orange-600',
    topicsHighlight: ['Java Collections Framework', 'OOP & Class Abstractions', 'FAANG Interview Patterns'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    label: 'Web & Full-Stack',
    description: 'Implement core algorithms using modern JavaScript (ES6+), Map, Set, and arrays tailored for full-stack web engineering.',
    icon: '🌐',
    badgeBg: 'bg-yellow-100/90 text-yellow-900 border-yellow-300',
    badgeText: 'text-yellow-800',
    accentBorder: 'border-yellow-500 ring-yellow-500/20 bg-yellow-50/40',
    accentBg: 'bg-yellow-500',
    topicsHighlight: ['ES6+ Map & Set Architectures', 'Call Stack & Event Loop Recursion', 'Tree & Graph Traversal for Web'],
  },
];

export const STORAGE_KEY_SELECTED_LANGS = 'msk_dsa_selected_langs';
export const STORAGE_KEY_ACTIVE_LANG = 'msk_dsa_active_lang';

interface DsaLanguageSelectorProps {
  onContinue?: (selectedLangs: string[]) => void;
  targetHref?: string;
  showEnrollmentNotice?: boolean;
}

export default function DsaLanguageSelector({
  onContinue,
  targetHref = '/tutorials/dsa-mastery-course',
  showEnrollmentNotice = true,
}: DsaLanguageSelectorProps) {
  const router = useRouter();
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['python']);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load selection from localStorage on client-side mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SELECTED_LANGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLangs(parsed);
          setIsConfirmed(true);
          return;
        }
      }
    } catch {}
    // Default: Python selected
    setSelectedLangs(['python']);
  }, []);

  const toggleLanguage = (id: string) => {
    setSelectedLangs((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        if (prev.length === 1) {
          toast.error('Please keep at least one programming language selected.', {
            id: 'min-lang-error',
          });
          return prev;
        }
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }

      // If selection changes, reset confirmed banner to prompt clicking continue
      setIsConfirmed(false);
      return updated;
    });
  };

  const handleSelectAll = () => {
    const all = DSA_LANGUAGES.map((l) => l.id);
    setSelectedLangs(all);
    setIsConfirmed(false);
    toast.success('All 5 programming tracks selected!');
  };

  const handleResetToPython = () => {
    setSelectedLangs(['python']);
    setIsConfirmed(false);
    toast('Reset to default track: Python');
  };

  const handleConfirm = () => {
    if (selectedLangs.length === 0) {
      toast.error('Please select at least one programming language to proceed.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_LANGS, JSON.stringify(selectedLangs));
      // Store the first selected language as the immediate active tab
      const primaryLang = selectedLangs[0] || 'python';
      localStorage.setItem(STORAGE_KEY_ACTIVE_LANG, primaryLang);
    } catch {}

    setIsConfirmed(true);
    toast.success(
      `Saved! You have selected ${selectedLangs.length} track${
        selectedLangs.length > 1 ? 's' : ''
      }: ${selectedLangs.map((id) => id.toUpperCase()).join(', ')}`
    );

    if (onContinue) {
      onContinue(selectedLangs);
    } else if (targetHref) {
      const langParam = selectedLangs.join(',');
      const separator = targetHref.includes('?') ? '&' : '?';
      router.push(`${targetHref}${separator}lang=${langParam}`);
    }
  };

  const selectedNames = selectedLangs
    .map((id) => DSA_LANGUAGES.find((l) => l.id === id)?.name || id)
    .join(', ');

  return (
    <section
      id="choose-dsa-language"
      className="scroll-mt-24 rounded-3xl bg-white border border-border-subtle p-6 sm:p-10 shadow-sm space-y-8"
      aria-labelledby="language-selector-heading"
    >
      {/* Header & Value Proposition */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-secondary text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Language Flagship Curriculum</span>
          </div>
          <h2
            id="language-selector-heading"
            className="text-2xl sm:text-4xl font-black text-primary tracking-tight"
          >
            Choose Your DSA Programming Language
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            Select one language to focus on your core DSA journey, or choose multiple languages to compare algorithms across different paradigms. Python is pre-selected by default.
          </p>
        </div>

        {/* Quick Selection Helper Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3.5 py-1.5 rounded-xl border border-border-subtle hover:border-secondary/40 text-xs font-bold text-text-muted hover:text-secondary hover:bg-orange-50/50 transition-all cursor-pointer"
            title="Select all 5 language tracks"
          >
            Select All 5
          </button>
          <button
            type="button"
            onClick={handleResetToPython}
            className="px-3.5 py-1.5 rounded-xl border border-border-subtle hover:border-slate-400 text-xs font-bold text-text-muted hover:text-primary hover:bg-surface transition-all cursor-pointer"
            title="Reset to Python-only"
          >
            Reset (Python Only)
          </button>
        </div>
      </div>

      {/* 5 Selectable Cards Grid */}
      <div
        role="group"
        aria-label="DSA Programming Language Track Options"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
      >
        {DSA_LANGUAGES.map((lang) => {
          const isSelected = selectedLangs.includes(lang.id);
          return (
            <div
              key={lang.id}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => toggleLanguage(lang.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleLanguage(lang.id);
                }
              }}
              className={`relative rounded-2xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40 select-none ${
                isSelected
                  ? `${lang.accentBorder} shadow-md`
                  : 'border-border-subtle hover:border-slate-300 bg-surface/50 hover:bg-surface shadow-2xs'
              }`}
            >
              {/* Top Row: Icon + Badge + Custom Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl sm:text-3xl" aria-hidden="true">
                      {lang.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-primary group-hover:text-secondary transition-colors">
                        {lang.name}
                      </h3>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-md border text-[10.5px] font-bold uppercase tracking-wider ${lang.badgeBg}`}
                      >
                        {lang.label}
                      </span>
                    </div>
                  </div>

                  {/* Accessible Visual Checkbox Pill */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 mt-1 ${
                      isSelected
                        ? 'bg-secondary border-secondary text-white shadow-xs'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                  {lang.description}
                </p>
              </div>

              {/* Topics Highlights Pill list */}
              <div className="space-y-1.5 pt-3 border-t border-border-subtle/70">
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-secondary" />
                  <span>Key Concepts Covered</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lang.topicsHighlight.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-border-subtle text-slate-700 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing & Single Bundle Guarantee Banner */}
      {showEnrollmentNotice && (
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-surface to-teal-50/50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-primary">
                One Unified Course Package • Full Multi-Language Access
              </h4>
              <p className="text-xs text-text-muted">
                All selected tracks (Python, C, C++, Java, JS) are included in a single enrollment. No extra hidden fees per language.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold whitespace-nowrap">
            All Selected Tracks Included
          </div>
        </div>
      )}

      {/* Confirmation & Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-subtle">
        {/* Selection Status Counter */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-extrabold text-primary">
              {selectedLangs.length} {selectedLangs.length === 1 ? 'Language' : 'Languages'} Selected
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Active tracks:{' '}
            <strong className="text-primary font-semibold">{selectedNames}</strong>
          </p>
        </div>

        {/* Primary CTA & Change Button */}
        <div className="flex items-center gap-3">
          {isConfirmed && (
            <button
              type="button"
              onClick={() => setIsConfirmed(false)}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-white border border-border-subtle hover:bg-surface text-primary font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-text-muted" />
              <span>Modify Tracks</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 group"
          >
            <span>Continue with Selected Languages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
