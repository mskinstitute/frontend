'use client';

import React, { useState } from 'react';
import { Trophy, X, Play, CheckCircle2, XCircle, Lightbulb, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';
import { CodeChallenge, SupportedLanguage } from './types';
import { CODING_CHALLENGES } from './challengesData';
import toast from 'react-hot-toast';

interface TestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  input: string;
}

interface ChallengesSidebarProps {
  currentLanguage: SupportedLanguage;
  onSelectChallenge: (challenge: CodeChallenge) => void;
  onRunTestCases: (challenge: CodeChallenge) => Promise<TestResult[]>;
  onClose: () => void;
}

export default function ChallengesSidebar({
  currentLanguage,
  onSelectChallenge,
  onRunTestCases,
  onClose,
}: ChallengesSidebarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | 'all'>(currentLanguage);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [activeChallenge, setActiveChallenge] = useState<CodeChallenge | null>(() => {
    return CODING_CHALLENGES.find((c) => c.language === currentLanguage) || CODING_CHALLENGES[0];
  });
  const [showHints, setShowHints] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const filteredChallenges = CODING_CHALLENGES.filter((c) => {
    const matchLang = selectedLanguage === 'all' || c.language === selectedLanguage;
    const matchDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    return matchLang && matchDiff;
  });

  const handleLoadCode = (challenge: CodeChallenge) => {
    setActiveChallenge(challenge);
    setTestResults(null);
    setShowHints(false);
    onSelectChallenge(challenge);
    toast.success(`Loaded challenge: ${challenge.title}`, { icon: '🏆' });
  };

  const handleRunTests = async () => {
    if (!activeChallenge) return;
    setIsRunningTests(true);
    setTestResults(null);
    try {
      const results = await onRunTestCases(activeChallenge);
      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        toast.success('🎉 Congratulations! All test cases passed!', {
          duration: 3500,
          icon: '🏆',
        });
      } else {
        const passedCount = results.filter((r) => r.passed).length;
        toast.error(`${passedCount}/${results.length} test cases passed. Check output below.`);
      }
    } catch (err) {
      toast.error('Error running test cases: ' + String(err));
    } finally {
      setIsRunningTests(false);
    }
  };

  const allPassed = testResults && testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <div className="w-80 sm:w-96 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full text-xs select-none shadow-xl z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1f1f1f] border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white text-xs tracking-wide">PRACTICE CHALLENGES</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#333] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Language & Difficulty Filter Bar */}
      <div className="p-2.5 bg-[#202021] border-b border-[#2d2d2d] space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Lang:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage | 'all')}
            className="flex-1 bg-[#2d2d2d] border border-[#3c3c3c] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option value="all">All Languages ({CODING_CHALLENGES.length})</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`flex-1 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer text-center ${
                selectedDifficulty === diff
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#2a2a2a] text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List or Detail View */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
        {/* Active Challenge Card */}
        {activeChallenge ? (
          <div className="space-y-3 bg-[#1e1e1e] p-3 rounded-xl border border-[#333]">
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wide">
                  {activeChallenge.category}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{activeChallenge.title}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeChallenge.difficulty === 'Easy'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {activeChallenge.difficulty}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeChallenge.description}
            </p>

            {/* Action Buttons: Load Starter Code & Run Tests */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleLoadCode(activeChallenge)}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                title="Reset editor code to challenge template"
              >
                <RotateCcw className="w-3 h-3 text-sky-400" />
                <span>Load Starter</span>
              </button>

              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white font-bold rounded text-[11px] transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isRunningTests ? (
                  <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>{isRunningTests ? 'Testing...' : 'Run Tests'}</span>
              </button>
            </div>

            {/* Celebration Banner */}
            {allPassed && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-200 text-center space-y-1 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-emerald-400">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ALL TEST CASES PASSED!</span>
                </div>
                <p className="text-[10px] text-emerald-300/90">
                  Great work! Your algorithm meets all correctness criteria.
                </p>
              </div>
            )}

            {/* Test Results Section */}
            {testResults && (
              <div className="space-y-2 pt-1 border-t border-[#2d2d2d]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Case Results:
                </span>
                {testResults.map((tr, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border text-[11px] font-mono ${
                      tr.passed
                        ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
                        : 'bg-red-950/30 border-red-900/60 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        {tr.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        Test Case #{i + 1}
                      </span>
                      <span className="text-[10px] font-semibold">{tr.passed ? 'PASSED' : 'FAILED'}</span>
                    </div>
                    {!tr.passed && (
                      <div className="mt-1.5 space-y-1 text-[10px] text-slate-300">
                        {tr.input && <div>Input: <code className="text-sky-300">{tr.input}</code></div>}
                        <div>Expected: <code className="text-emerald-300">{tr.expectedOutput}</code></div>
                        <div>Got: <code className="text-red-400">{tr.actualOutput || '(no output)'}</code></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hints Accordion */}
            {activeChallenge.hints && activeChallenge.hints.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowHints((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHints ? 'Hide Hints' : 'Need a Hint?'}</span>
                </button>
                {showHints && (
                  <ul className="mt-2 pl-4 list-disc space-y-1 text-[11px] text-slate-400 font-sans">
                    {activeChallenge.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Challenge Selector List */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Browse All Challenges ({filteredChallenges.length}):
          </span>
          {filteredChallenges.map((ch) => {
            const isCurrent = activeChallenge?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  setActiveChallenge(ch);
                  setTestResults(null);
                }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-[#1e1e1e] border-secondary/60 text-white'
                    : 'bg-[#202021] border-[#2d2d2d] hover:bg-[#282829] text-slate-300'
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[11px] text-white truncate">{ch.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize">{ch.language} • {ch.difficulty}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
