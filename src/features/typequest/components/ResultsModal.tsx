'use client';

import React, { useState } from 'react';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  Target,
  Award,
  Flame,
  Activity,
  X,
} from 'lucide-react';
import { TestResult, KeyHealthStat } from '../types';
import WpmChart from './WpmChart';

interface ResultsModalProps {
  result: TestResult;
  hasNextLesson?: boolean;
  onRetry: () => void;
  onNextLesson?: () => void;
  onClose: () => void;
  onPracticeWeakKeys?: (weakKeys: { key: string; errorCount?: number; accuracy?: number }[]) => void;
  onOpenCertificate?: () => void;
}

export default function ResultsModal({
  result,
  hasNextLesson,
  onRetry,
  onNextLesson,
  onClose,
  onPracticeWeakKeys,
  onOpenCertificate,
}: ResultsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `🔥 I just scored ${result.wpm} WPM with ${result.accuracy}% accuracy in TypeQuest by MSK Institute!
Practice touch typing & coding speed at: https://mskinstitute.in/tools/typing`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `🏆 I scored ${result.wpm} WPM with ${result.accuracy}% accuracy on MSK Institute TypeQuest! 🚀\n\nTest your typing speed & get your free certificate here:\nhttps://www.mskinstitute.in/tools/typing`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Keyboard listener: Escape to close modal (without exiting full screen), Enter to retry
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onRetry();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, onRetry]);

  // Approximate XP earned
  const estimatedXp = Math.round(result.wpm * 2 + (result.accuracy >= 95 ? 40 : 15));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 modal-interactive"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 flex items-center justify-center group"
          title="Close (Esc)"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 text-slate-300 group-hover:text-white" />
        </button>
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 no-scrollbar">
          {/* Modal Header */}
          <div className="relative flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-secondary to-amber-400 p-0.5 shadow-lg mb-2 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-secondary">
                <Trophy className="w-7 h-7 animate-bounce" />
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-secondary font-mono">
              {result.modeLabel} Complete
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {result.rating.title}
            </h2>

            {/* XP and Reward Badge */}
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                +{estimatedXp} XP Earned
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary font-mono text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-secondary" />
                Daily Streak Maintained
              </span>
            </div>
          </div>

          {/* Primary Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {/* Main WPM */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Net Speed
              </div>
              <div className="text-2xl sm:text-4xl font-black font-mono text-secondary">
                {result.wpm}
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">Words / Min</div>
            </div>

            {/* Accuracy */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Accuracy
              </div>
              <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">
                {result.accuracy}%
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">Precision</div>
            </div>

            {/* Raw WPM / CPM */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Raw Speed
              </div>
              <div className="text-2xl sm:text-4xl font-black font-mono text-blue-400">
                {result.rawWpm}
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">{result.cpm} Chars/Min</div>
            </div>

            {/* Time Taken */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Time
              </div>
              <div className="text-2xl sm:text-4xl font-black font-mono text-amber-400">
                {result.timeSpentSeconds}s
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">Active Duration</div>
            </div>
          </div>

          {/* Second-by-Second WPM & Accuracy Graph */}
          {result.timeline && result.timeline.length > 2 && (
            <div className="mb-4">
              <WpmChart timeline={result.timeline} avgWpm={result.wpm} />
            </div>
          )}

          {/* Keystrokes Breakdown & Weak Keys */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            {/* Keystrokes Breakdown */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-secondary" /> Keystrokes Summary
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 flex items-center gap-1">✓ Correct</span>
                  <span className="font-bold text-white">{result.correctChars}</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-rose-400 flex items-center gap-1">✕ Errors</span>
                  <span className="font-bold text-white">{result.errorChars}</span>
                </div>
              </div>
            </div>

            {/* Weak Keys Recommendations */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Keys Needing Practice
                </div>

                {/* Fix weak keys button */}
                {result.weakKeys && result.weakKeys.length > 0 && onPracticeWeakKeys && (
                  <button
                    type="button"
                    onClick={() => onPracticeWeakKeys(result.weakKeys!)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1"
                  >
                    Generate Drill ➔
                  </button>
                )}
              </div>

              {result.weakKeys && result.weakKeys.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.weakKeys.slice(0, 5).map((item) => (
                    <span
                      key={item.key}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-md font-mono text-[11px]"
                    >
                      <span className="font-bold uppercase">{item.key === ' ' ? 'Space' : item.key}</span>
                      <span className="text-[9px] text-rose-400">({item.errorCount} err)</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-emerald-400 flex items-center gap-1.5 font-medium py-1">
                  <CheckCircle2 className="w-4 h-4" /> Flawless typing! No weak keys detected.
                </div>
              )}
            </div>
          </div>

          {/* Official Certificate Banner */}
          {onOpenCertificate && (
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Claim Verified Typing Certificate</div>
                  <div className="text-[11px] text-slate-400">
                    Official PDF with QR verification &amp; your {result.wpm} WPM achievement.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenCertificate}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
              >
                Print Certificate
              </button>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Close
            </button>
            <button
              onClick={handleShare}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Score Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleWhatsAppShare}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors cursor-pointer shadow-sm"
              title="Share typing score on WhatsApp status"
            >
              <span>WhatsApp Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetry}
              type="button"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Enter)</span>
            </button>

            {hasNextLesson && onNextLesson && (
              <button
                onClick={onNextLesson}
                type="button"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-secondary to-orange-500 hover:brightness-110 shadow-lg shadow-secondary/20 transition-all cursor-pointer"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
