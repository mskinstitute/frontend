'use client';

import React, { useState } from 'react';
import { Play, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, Clock, Copy, Check } from 'lucide-react';
import { SupportedLanguage } from './types';
import { runRemoteCode } from './compilerApi';

function triggerConfetti() {
  if (typeof window === 'undefined') return;
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#0284c7', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];
    const particles = Array.from({ length: 60 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height * 0.75,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 6,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    }));

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.alpha -= 0.012;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.restore();
        }
      }
      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    };
    render();
  } catch {}
}

export interface TestCaseItem {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  status?: 'idle' | 'running' | 'passed' | 'failed' | 'error';
  elapsedMs?: number;
}

interface MultiTestcaseRunnerProps {
  language: SupportedLanguage;
  code: string;
  onRunSingleCustomInput?: (input: string) => Promise<string>;
}

export default function MultiTestcaseRunner({
  language,
  code,
  onRunSingleCustomInput,
}: MultiTestcaseRunnerProps) {
  const [testCases, setTestCases] = useState<TestCaseItem[]>([
    {
      id: 'case-1',
      name: 'Case 1',
      input: '5\n10 20 30 40 50',
      expectedOutput: '150',
      status: 'idle',
    },
    {
      id: 'case-2',
      name: 'Case 2',
      input: '3\n5 15 25',
      expectedOutput: '45',
      status: 'idle',
    },
    {
      id: 'case-3',
      name: 'Case 3',
      input: '1\n100',
      expectedOutput: '100',
      status: 'idle',
    },
  ]);

  const [activeCaseId, setActiveCaseId] = useState<string>('case-1');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCase = testCases.find((tc) => tc.id === activeCaseId) || testCases[0];

  const handleAddCase = () => {
    const nextNum = testCases.length + 1;
    const newCase: TestCaseItem = {
      id: `case-${Date.now()}`,
      name: `Case ${nextNum}`,
      input: '',
      expectedOutput: '',
      status: 'idle',
    };
    setTestCases((prev) => [...prev, newCase]);
    setActiveCaseId(newCase.id);
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (testCases.length <= 1) return;
    const remaining = testCases.filter((tc) => tc.id !== id);
    setTestCases(remaining);
    if (activeCaseId === id) {
      setActiveCaseId(remaining[0].id);
    }
  };

  const handleUpdateActiveCase = (field: 'input' | 'expectedOutput', value: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === activeCase?.id ? { ...tc, [field]: value } : tc))
    );
  };

  const handleRunAll = async () => {
    if (isRunningAll || !code.trim()) return;
    setIsRunningAll(true);

    let allPassed = true;
    const updatedCases: TestCaseItem[] = [];

    for (let tc of testCases) {
      // Set single case to running
      setTestCases((prev) =>
        prev.map((item) => (item.id === tc.id ? { ...item, status: 'running' } : item))
      );

      const startTime = performance.now();
      try {
        let output = '';
        let errorMsg = '';

        if (language === 'c' || language === 'cpp' || language === 'java') {
          const res = await runRemoteCode(language, code, tc.input);
          output = (res.stdout || '').trim();
          if (res.compilerError || res.stderr) {
            errorMsg = (res.compilerError || res.stderr || '').trim();
          }
        } else if (onRunSingleCustomInput) {
          output = (await onRunSingleCustomInput(tc.input)).trim();
        } else {
          output = 'Testcase evaluation is available for C, C++, Java, and Python.';
        }

        const elapsedMs = Math.round(performance.now() - startTime);

        if (errorMsg) {
          allPassed = false;
          updatedCases.push({
            ...tc,
            status: 'error',
            error: errorMsg,
            actualOutput: output,
            elapsedMs,
          });
        } else {
          const expected = tc.expectedOutput.trim();
          const isMatch = expected ? output === expected : true;
          if (!isMatch) allPassed = false;

          updatedCases.push({
            ...tc,
            status: isMatch ? 'passed' : 'failed',
            actualOutput: output,
            error: undefined,
            elapsedMs,
          });
        }
      } catch (err: any) {
        allPassed = false;
        updatedCases.push({
          ...tc,
          status: 'error',
          error: err.message || String(err),
          elapsedMs: Math.round(performance.now() - startTime),
        });
      }

      // Update state incrementally
      setTestCases([...updatedCases, ...testCases.slice(updatedCases.length)]);
    }

    setTestCases(updatedCases);
    setIsRunningAll(false);

    if (allPassed && updatedCases.length > 0 && updatedCases.some((tc) => tc.expectedOutput.trim().length > 0)) {
      triggerConfetti();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const passedCount = testCases.filter((tc) => tc.status === 'passed').length;
  const failedCount = testCases.filter((tc) => tc.status === 'failed' || tc.status === 'error').length;
  const hasRun = testCases.some((tc) => tc.status !== 'idle');

  return (
    <div className="flex flex-col h-full bg-[#181818] text-slate-200 select-none">
      {/* Top Header / Actions */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#202020] border-b border-[#2d2d2d] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span>
            <span>Test Suite</span>
          </span>

          {hasRun && (
            <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/80">
              <span className="text-emerald-400 font-bold">{passedCount} Passed</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">{testCases.length} Total</span>
              {failedCount > 0 && (
                <span className="text-rose-400 font-semibold ml-1">({failedCount} Failed)</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddCase}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-[#2b2b2b] hover:bg-[#383838] text-slate-200 rounded-lg border border-slate-700 cursor-pointer transition-colors"
            title="Add New Test Case"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" />
            <span className="hidden sm:inline">Add Case</span>
          </button>

          <button
            type="button"
            onClick={handleRunAll}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunningAll ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run All Tests</span>
          </button>
        </div>
      </div>

      {/* Case Pills Tab Bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border-b border-[#2d2d2d] overflow-x-auto">
        {testCases.map((tc) => {
          const isActive = tc.id === activeCase?.id;
          return (
            <button
              key={tc.id}
              type="button"
              onClick={() => setActiveCaseId(tc.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all shrink-0 ${
                isActive
                  ? 'bg-[#2d2d2d] text-white border border-slate-600 shadow-2xs'
                  : 'text-slate-400 hover:bg-[#252525] hover:text-slate-200'
              }`}
            >
              {tc.status === 'passed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {tc.status === 'failed' && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
              {tc.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              {tc.status === 'running' && (
                <div className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {tc.status === 'idle' && <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />}

              <span>{tc.name}</span>

              {tc.elapsedMs !== undefined && (
                <span className="text-[10px] text-slate-500 font-mono">({tc.elapsedMs}ms)</span>
              )}

              {testCases.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleDeleteCase(tc.id, e)}
                  className="hover:text-rose-400 p-0.5 ml-0.5 rounded cursor-pointer transition-colors"
                  title="Delete Test Case"
                >
                  <Trash2 className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Test Case Detail */}
      {activeCase && (
        <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-xs">
          {/* Status Alert Banner */}
          {activeCase.status && activeCase.status !== 'idle' && (
            <div
              className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                activeCase.status === 'passed'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : activeCase.status === 'failed'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : activeCase.status === 'error'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {activeCase.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {activeCase.status === 'failed' && <XCircle className="w-4 h-4 text-rose-400" />}
                {activeCase.status === 'error' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span className="font-bold">
                  {activeCase.status === 'passed' && 'Passed'}
                  {activeCase.status === 'failed' && 'Wrong Answer'}
                  {activeCase.status === 'error' && 'Execution / Compilation Error'}
                  {activeCase.status === 'running' && 'Running test...'}
                </span>
              </div>

              {activeCase.elapsedMs !== undefined && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{activeCase.elapsedMs}ms</span>
                </div>
              )}
            </div>
          )}

          {/* Input Block */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 font-semibold">
              <span>Input (stdin):</span>
              <button
                type="button"
                onClick={() => handleCopy(activeCase.input, 'input')}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                title="Copy Input"
              >
                {copiedId === 'input' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <textarea
              value={activeCase.input}
              onChange={(e) => handleUpdateActiveCase('input', e.target.value)}
              placeholder="Enter input values separated by spaces or newlines..."
              rows={3}
              className="w-full bg-[#121212] border border-[#333] focus:border-secondary rounded-lg p-2.5 text-slate-200 outline-none resize-y text-xs font-mono"
            />
          </div>

          {/* Expected vs Actual Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Expected Output */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 font-semibold">
                <span>Expected Output:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeCase.expectedOutput, 'expected')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title="Copy Expected"
                >
                  {copiedId === 'expected' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                value={activeCase.expectedOutput}
                onChange={(e) => handleUpdateActiveCase('expectedOutput', e.target.value)}
                placeholder="Expected result (e.g. 150)..."
                rows={3}
                className="w-full bg-[#121212] border border-[#333] focus:border-secondary rounded-lg p-2.5 text-slate-200 outline-none resize-y text-xs font-mono"
              />
            </div>

            {/* Actual Output */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 font-semibold">
                <span>Actual Output:</span>
                {activeCase.actualOutput && (
                  <button
                    type="button"
                    onClick={() => handleCopy(activeCase.actualOutput || '', 'actual')}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy Output"
                  >
                    {copiedId === 'actual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <div
                className={`w-full min-h-[75px] max-h-48 overflow-y-auto bg-[#121212] border rounded-lg p-2.5 text-xs font-mono whitespace-pre-wrap ${
                  activeCase.status === 'passed'
                    ? 'border-emerald-500/50 text-emerald-300'
                    : activeCase.status === 'failed'
                    ? 'border-rose-500/50 text-rose-300'
                    : 'border-[#333] text-slate-400'
                }`}
              >
                {activeCase.actualOutput !== undefined ? (
                  activeCase.actualOutput || <span className="text-slate-600 italic">(Empty output)</span>
                ) : (
                  <span className="text-slate-600 italic">Click 'Run All Tests' to evaluate...</span>
                )}
              </div>
            </div>
          </div>

          {/* Error Message Details if any */}
          {activeCase.error && (
            <div className="p-2.5 bg-rose-950/30 border border-rose-800/50 rounded-lg text-rose-300 text-xs font-mono whitespace-pre-wrap">
              <div className="font-bold mb-1 flex items-center gap-1 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Diagnostics:</span>
              </div>
              {activeCase.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
