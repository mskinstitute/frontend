'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Check,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { renderFormattedText } from '@/components/MarkdownRenderer';
import {
  tokenizeCodeToLines,
  getVSCodeTokenColor,
  getLanguageDisplayName,
} from '@/lib/prism-highlighter';

export interface QuizOption {
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface QuizQuestionCardProps {
  questionNumber?: string | number;
  question: string;
  codeSnippet?: {
    code: string;
    lang: string;
  };
  options: QuizOption[];
  correctAnswer: string; // e.g. 'A', 'B', 'C', 'D'
  explanation?: string;
  index?: number;
}

export default function QuizQuestionCard({
  questionNumber,
  question,
  codeSnippet,
  options,
  correctAnswer,
  explanation,
  index,
}: QuizQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const hasAnswered = selectedOption !== null;
  const isSelectedCorrect =
    hasAnswered && selectedOption.toUpperCase() === correctAnswer.toUpperCase();

  const handleSelect = (label: string) => {
    setSelectedOption(label);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsRevealed(false);
  };

  const toggleReveal = () => {
    setIsRevealed((prev) => !prev);
  };

  const displayNum = questionNumber || (index !== undefined ? index + 1 : '1');

  // Tokenize code snippet if present
  const codeLines = codeSnippet
    ? tokenizeCodeToLines(codeSnippet.code, codeSnippet.lang || 'python')
    : [];

  return (
    <div
      className={`my-6 rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-xs ${
        hasAnswered
          ? isSelectedCorrect
            ? 'border-emerald-200/90 ring-1 ring-emerald-500/20 shadow-emerald-500/5'
            : 'border-amber-200/90 ring-1 ring-amber-500/20 shadow-amber-500/5'
          : isRevealed
          ? 'border-blue-200/90 shadow-blue-500/5'
          : 'border-border-subtle hover:border-border-subtle hover:shadow-sm'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-b border-border-subtle/80">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-secondary/30 text-secondary text-xs font-bold font-mono rounded-lg uppercase tracking-wide">
            Question {displayNum}
          </span>

          {hasAnswered && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold animate-in fade-in zoom-in-95 duration-150 ${
                isSelectedCorrect
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                  : 'bg-rose-100 text-rose-800 border border-rose-300/80'
              }`}
            >
              {isSelectedCorrect ? (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Correct! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-600" />
                  <span>Incorrect</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Quick Actions: Show/Hide Answer button */}
        <div className="flex items-center gap-2">
          {hasAnswered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-text-muted hover:text-primary bg-white hover:bg-slate-100 border border-border-subtle rounded-lg transition-colors cursor-pointer"
              title="Reset question to try again"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleReveal}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isRevealed
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-text-muted hover:text-primary hover:bg-slate-100 border-border-subtle'
            }`}
            title={isRevealed ? 'Hide answer' : 'Reveal answer without selecting'}
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Hide Answer</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Show Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Question Prompt */}
        <div className="text-base sm:text-lg font-bold text-primary leading-snug tracking-tight">
          {renderFormattedText(question)}
        </div>

        {/* Optional Code Snippet */}
        {codeSnippet && codeLines.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#1e1e1e] shadow-sm my-3">
            <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-[#2d2d2d] text-[11px] font-mono text-slate-400">
              <span className="uppercase font-bold tracking-wider text-amber-400">
                {getLanguageDisplayName(codeSnippet.lang || 'python')}
              </span>
              <span>Code Snippet</span>
            </div>
            <div className="overflow-x-auto py-2.5 font-mono text-xs sm:text-sm leading-5">
              {codeLines.map((lineTokens, lineIdx) => (
                <div
                  key={lineIdx}
                  className="flex items-center hover:bg-[#282828] min-w-full transition-colors"
                >
                  <span
                    className="select-none text-right text-[#858585] text-xs font-mono pr-3 pl-2.5 border-r border-[#333333] w-9 sm:w-10 shrink-0"
                    aria-hidden="true"
                  >
                    {lineIdx + 1}
                  </span>
                  <span className="pl-3 pr-3 whitespace-pre font-mono text-[#d4d4d4] flex-1">
                    {lineTokens.length === 0 ? (
                      '\u00A0'
                    ) : (
                      lineTokens.map((tok, tokIdx) => (
                        <span
                          key={tokIdx}
                          style={{
                            color: getVSCodeTokenColor(
                              tok.type,
                              tok.text,
                              codeSnippet.lang || 'python'
                            ),
                          }}
                        >
                          {tok.text}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5 pt-1">
          {options.map((opt) => {
            const isOptSelected = selectedOption === opt.label;
            const isOptCorrect = opt.label.toUpperCase() === correctAnswer.toUpperCase();

            let containerStyle =
              'bg-white hover:bg-orange-50/20 border-slate-200 hover:border-orange-300 text-text-main shadow-2xs cursor-pointer';
            let badgeStyle =
              'bg-slate-100 border-slate-200/80 text-slate-700 group-hover:bg-orange-100 group-hover:text-secondary group-hover:border-orange-200';

            if (hasAnswered) {
              if (isOptSelected && isOptCorrect) {
                containerStyle =
                  'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium shadow-xs ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isOptSelected && !isOptCorrect) {
                containerStyle =
                  'bg-rose-50 border-rose-500 text-rose-950 font-medium shadow-xs ring-1 ring-rose-500';
                badgeStyle = 'bg-rose-600 border-rose-600 text-white';
              } else if (isOptCorrect) {
                // Highlight the correct answer when user picked wrong
                containerStyle =
                  'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-2xs font-medium';
                badgeStyle = 'bg-emerald-500 border-emerald-500 text-white';
              } else {
                containerStyle =
                  'opacity-50 bg-slate-50/60 border-slate-200 text-text-muted';
                badgeStyle = 'bg-slate-200 border-slate-300 text-slate-500';
              }
            } else if (isRevealed) {
              if (isOptCorrect) {
                containerStyle =
                  'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-2xs ring-1 ring-emerald-400';
                badgeStyle = 'bg-emerald-600 border-emerald-600 text-white';
              } else {
                containerStyle =
                  'bg-white border-border-subtle hover:bg-slate-50 text-text-main cursor-pointer';
                badgeStyle = 'bg-slate-100 border-slate-200 text-slate-700';
              }
            }

            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleSelect(opt.label)}
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-start sm:items-center justify-between gap-3 group ${containerStyle}`}
              >
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  {/* Option Letter Pill */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs transition-all ${badgeStyle}`}
                  >
                    {opt.label}
                  </span>

                  {/* Option Text with Markdown Formatting */}
                  <span className="text-sm sm:text-base leading-relaxed break-words flex-1 pt-0.5 sm:pt-0">
                    {renderFormattedText(opt.text)}
                  </span>
                </div>

                {/* Right Status Feedback Indicator */}
                <div className="shrink-0 flex items-center gap-1.5 pt-0.5 sm:pt-0">
                  {hasAnswered && isOptSelected && isOptCorrect && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="hidden sm:inline">Correct</span>
                    </span>
                  )}
                  {hasAnswered && isOptSelected && !isOptCorrect && (
                    <span className="inline-flex items-center gap-1 text-rose-700 text-xs font-bold">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="hidden sm:inline">Incorrect</span>
                    </span>
                  )}
                  {hasAnswered && !isOptSelected && isOptCorrect && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Correct Answer</span>
                    </span>
                  )}
                  {isRevealed && !hasAnswered && isOptCorrect && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Correct Answer</span>
                    </span>
                  )}
                  {!hasAnswered && !isRevealed && (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-secondary transition-colors inline-block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation & Answer Card (Expands when answered or revealed) */}
        {(hasAnswered || isRevealed) && (
          <div
            className={`mt-4 p-4 sm:p-5 rounded-xl border transition-all animate-in fade-in duration-200 ${
              isSelectedCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : hasAnswered && !isSelectedCorrect
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}
          >
            {/* Top Bar of Explanation */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-current/10">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                <Lightbulb
                  className={`w-4 h-4 ${
                    isSelectedCorrect
                      ? 'text-emerald-700'
                      : hasAnswered && !isSelectedCorrect
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }`}
                />
                <span>Explanation & Concept</span>
              </div>

              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-white/80 rounded-md border border-current/15">
                Answer: Option {correctAnswer}
              </span>
            </div>

            {/* Explanation Content */}
            <div className="text-xs sm:text-sm leading-relaxed space-y-1">
              {explanation ? (
                <div>{renderFormattedText(explanation)}</div>
              ) : (
                <div>
                  Option <strong className="font-bold">{correctAnswer}</strong> is the correct
                  answer for this question.
                </div>
              )}
            </div>

            {/* Re-try prompt if incorrect */}
            {hasAnswered && !isSelectedCorrect && (
              <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between text-xs">
                <span className="text-amber-900/80 font-medium">
                  Review the concept above and give it another shot!
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
