'use client';

import React from 'react';
import Link from 'next/link';
import { List, Clock, ChevronRight } from 'lucide-react';
import { TutorialItem } from '@/types';

interface TutorialCardProps {
  tutorial: TutorialItem;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  // Determine technology icon
  const renderIcon = () => {
    switch (tutorial.icon?.toLowerCase()) {
      case 'python':
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            {/* Python Snake Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.016 2.008c-3.13 0-5.016 1.34-5.016 3.793v2.85h5.016v.95H4.258C2.106 9.601 1 11.238 1 13.791c0 2.68 1.488 4.209 4.148 4.209h2.383v-3.082c0-2.453 1.886-3.793 5.016-3.793h4.945v-.95h-7.328V8.65h7.328V5.801c0-2.453-1.886-3.793-5.016-3.793h-.46zm-1.886 1.9a.95.95 0 110 1.9.95.95 0 010-1.9zm1.886 18.084c3.13 0 5.016-1.34 5.016-3.793v-2.85h-5.016v-.95h7.758c2.152 0 3.258-1.637 3.258-4.19 0-2.68-1.488-4.209-4.148-4.209h-2.383v3.082c0 2.453-1.886 3.793-5.016 3.793H6.54v.95h7.328v1.525H6.54v2.85c0 2.453 1.886 3.792 5.016 3.792h.46zm1.886-1.9a.95.95 0 110-1.9.95.95 0 010 1.9z" />
            </svg>
          </div>
        );
      case 'html':
        return (
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
            {/* Globe / Web Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        );
      case 'css':
        return (
          <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shadow-2xs">
            {/* Palette Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
            </svg>
          </div>
        );
      case 'numpy':
        return (
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
            {/* Matrix / Numerical Array Grid Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
            </svg>
          </div>
        );
      case 'computer':
      case 'ccc':
        return (
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            {/* Desktop Monitor & Computer Screen Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>
        );
      case 'markdown':
        return (
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
            {/* Official Markdown M and Arrow Down Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M6 15V9l2.5 3 2.5-3v6" />
              <path d="M15 9v6l2-2" />
              <path d="M15 15l-2-2" />
            </svg>
          </div>
        );
      case 'pandas':
        return (
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
            {/* Pandas Tabular DataFrame Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M10 3v18" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
            </svg>
          </div>
        );
      case 'powerbi':
      case 'power-bi':
        return (
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            {/* Power BI Bar Chart Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
            </svg>
          </div>
        );
      case 'tableau':
        return (
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-2xs">
            {/* Tableau Visual Analytics Star Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
        );
      case 'chart':
      case 'visualization':
        return (
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
            {/* Trend & Chart Line Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
        );
      case 'machinelearning':
      case 'ml':
        return (
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
            {/* AI / Neural Network / ML Nodes Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="12" r="3" />
              <line x1="8.5" y1="7.5" x2="15.5" y2="10.5" />
              <line x1="8.5" y1="16.5" x2="15.5" y2="13.5" />
            </svg>
          </div>
        );
      case 'tailwind':
        return (
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-500 shadow-2xs">
            {/* Tailwind Waves Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
            </svg>
          </div>
        );
      case 'nodejs':
      case 'node':
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs font-bold text-base font-mono">
            {/* Node.js Hexagon / Node Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
              <path d="M12 12l8-4.5" />
              <path d="M12 12v8" />
              <path d="M12 12L4 7.5" />
            </svg>
          </div>
        );
      case 'mongodb':
        return (
          <div className="w-11 h-11 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-2xs">
            {/* MongoDB Leaf Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 6 6 11 6 15c0 4 3 7 6 7s6-3 6-7c0-4-2-9-6-13z" />
              <path d="M12 2v20" />
            </svg>
          </div>
        );
      case 'nextjs':
      case 'next':
        return (
          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-2xs font-bold text-sm">
            ▲
          </div>
        );
      case 'dsa':
      case 'algorithm':
      case 'data-structures':
        return (
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs font-bold">
            {/* Binary Tree / Nodes Algorithm Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <circle cx="5" cy="19" r="3" />
              <circle cx="19" cy="19" r="3" />
              <line x1="12" y1="8" x2="5" y2="16" />
              <line x1="12" y1="8" x2="19" y2="16" />
            </svg>
          </div>
        );
      case 'git':
      case 'github':
        return (
          <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
            {/* Git Branch Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
          </div>
        );
      case 'react':
        return (
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-500 shadow-2xs">
            {/* React Atom Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="10" ry="4.5" />
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
        );
      case 'django':
        return (
          <div className="w-11 h-11 rounded-2xl bg-emerald-900 border border-emerald-800 flex items-center justify-center text-white shadow-2xs font-bold text-sm font-serif">
            dj
          </div>
        );
      case 'flask':
        return (
          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-2xs">
            {/* Flask Chemistry Beaker Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v4.5L5.2 16.2A3 3 0 0 0 7.8 21h8.4a3 3 0 0 0 2.6-4.8L14 6.5V2" />
              <path d="M8.5 2h7" />
              <path d="M7 16h10" />
            </svg>
          </div>
        );
      case 'javascript':
      case 'js':
        return (
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs font-mono font-black text-sm">
            JS
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs font-mono font-black text-sm">
            JS
          </div>
        );
    }
  };

  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-6 group cursor-pointer"
    >
      <div className="space-y-4">
        {/* Top Icon & Badge Row */}
        <div className="flex items-center justify-between">
          {renderIcon()}
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
            {tutorial.badge || 'Beginner'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
            {tutorial.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
            {tutorial.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <List className="w-3.5 h-3.5 text-text-muted" />
            {tutorial.lessonsCount || 9} lessons
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            {tutorial.totalHours || '40h'}
          </span>
        </div>

        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-bold text-xs">
          Explore
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
