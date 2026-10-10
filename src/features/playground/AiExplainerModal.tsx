'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, HelpCircle, Copy, Check, BookOpen, Lightbulb } from 'lucide-react';
import { SupportedLanguage } from './types';
import toast from 'react-hot-toast';

interface AiExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: SupportedLanguage;
  errorContext?: string | null;
}

interface ExplanationRule {
  summary: string;
  why: string;
  fix: string;
  example?: string;
}

function analyzeError(err: string, lang: SupportedLanguage): ExplanationRule {
  const lower = err.toLowerCase();

  // Python Errors
  if (lower.includes('indentationerror')) {
    return {
      summary: 'Indentation Error (Whitespace Mismatch)',
      why: 'Python relies on strict indentation (usually 4 spaces) rather than curly braces to define blocks of code (such as inside if, for, while, or def).',
      fix: 'Make sure all code lines inside a function or loop share the exact same number of leading spaces (do not mix tabs and spaces).',
      example: `def my_function():\n    # 4 spaces indentation\n    print("Indented properly")`,
    };
  }
  if (lower.includes('nameerror')) {
    return {
      summary: 'Name Error (Undefined Variable or Function)',
      why: 'Python encountered a variable or function name that has not been defined or assigned before being used, or is misspelled.',
      fix: 'Check the spelling of the variable. Ensure you assigned a value to it BEFORE calling or printing it.',
      example: `# Define before use:\nname = "Aman"\nprint(name)`,
    };
  }
  if (lower.includes('typeerror')) {
    return {
      summary: 'Type Error (Incompatible Data Types)',
      why: 'An operation was attempted on an unsupported data type (for example, concatenating a string with an integer like "Age: " + 20).',
      fix: 'Convert values to compatible types using str(), int(), or use f-strings in Python: f"Age: {age}".',
      example: `age = 20\n# Use f-string:\nprint(f"Age: {age}")\n# Or convert:\nprint("Age: " + str(age))`,
    };
  }
  if (lower.includes('indexerror')) {
    return {
      summary: 'Index Error (List Index Out of Range)',
      why: 'You tried to access an item at an index that does not exist in the list or array (remember that indices start at 0, so a list of 3 items only has indices 0, 1, 2).',
      fix: 'Verify the length of your list with len(my_list) before indexing, or check loop range bounds.',
      example: `items = ["A", "B", "C"]\n# Valid: items[0], items[1], items[2]\n# items[3] raises IndexError!`,
    };
  }
  if (lower.includes('zerodivisionerror')) {
    return {
      summary: 'Zero Division Error (Division by Zero)',
      why: 'Mathematically, division or modulo by 0 is undefined in programming.',
      fix: 'Add a condition checking that the denominator is not zero before dividing.',
      example: `if denominator != 0:\n    result = numerator / denominator\nelse:\n    print("Cannot divide by zero")`,
    };
  }

  // C / C++ Errors
  if (lower.includes('segmentation fault') || lower.includes('segfault')) {
    return {
      summary: 'Segmentation Fault (Memory Access Violation)',
      why: 'Your C/C++ program attempted to access memory that does not belong to it, such as dereferencing a NULL pointer or going out of array bounds.',
      fix: 'Check array boundary indices and ensure all pointers are initialized before accessing them.',
      example: `int arr[5];\n// Valid indices are 0 to 4\narr[4] = 10; // OK\n// arr[10] = 5; // BAD! Causes segfault`,
    };
  }
  if (lower.includes('expected') && lower.includes(';')) {
    return {
      summary: 'Missing Semicolon (;)',
      why: 'In C, C++, and Java, statements must end with a semicolon.',
      fix: 'Review the line number reported in the compiler error and verify whether the previous statement has a trailing semicolon (;).',
    };
  }

  // Generic Error Fallback
  return {
    summary: 'Runtime or Syntax Exception',
    why: 'The program encountered an unexpected condition during compilation or execution.',
    fix: 'Inspect the line number in the terminal traceback. Verify that variable names match, brackets/quotes are paired, and input formats match expected types.',
  };
}

function generateCodeOverview(code: string, lang: SupportedLanguage): string[] {
  const points: string[] = [];
  const lines = code.split('\n');

  points.push(`Language: ${lang.toUpperCase()} program with ${lines.length} lines of code.`);

  if (code.includes('def ') || code.includes('function ') || code.includes('void ') || code.includes('int ')) {
    points.push('Defines custom modular functions to organize logic into reusable blocks.');
  }
  if (code.includes('for ') || code.includes('while ')) {
    points.push('Utilizes iteration loops to process sequences or repeated computations.');
  }
  if (code.includes('if ') || code.includes('else')) {
    points.push('Includes conditional decision branching (if/else) to handle multiple cases.');
  }
  if (code.includes('print(') || code.includes('cout <<') || code.includes('printf(') || code.includes('System.out')) {
    points.push('Produces formatted console output for user feedback and results verification.');
  }
  if (code.includes('CREATE TABLE') || code.includes('SELECT')) {
    points.push('Executes relational database operations to manage tables and query structured data.');
  }

  return points;
}

export default function AiExplainerModal({
  isOpen,
  onClose,
  code,
  language,
  errorContext,
}: AiExplainerModalProps) {
  const [activeTab, setActiveTab] = useState<'error' | 'overview'>('error');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (errorContext) {
      setActiveTab('error');
    } else {
      setActiveTab('overview');
    }
  }, [errorContext]);

  if (!isOpen) return null;

  const analysis = errorContext ? analyzeError(errorContext, language) : null;
  const overviewPoints = generateCodeOverview(code, language);

  const handleCopy = () => {
    const textToCopy = analysis
      ? `MSK AI Analysis:\nIssue: ${analysis.summary}\nWhy: ${analysis.why}\nFix: ${analysis.fix}`
      : `MSK AI Code Overview:\n${overviewPoints.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Explanation copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1e1e1e] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#252526] border-b border-[#333]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-secondary to-amber-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>MSK AI Code Tutor</span>
                <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.2 rounded font-bold uppercase">
                  Assistant
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Beginner-friendly explanations, debugging tips, and code walkthroughs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#202021] border-b border-[#333] text-xs">
          {errorContext && (
            <button
              onClick={() => setActiveTab('error')}
              className={`flex-1 py-2 font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'error'
                  ? 'bg-[#1e1e1e] text-red-400 border-b-2 border-red-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Diagnose Error</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1e1e1e] text-secondary border-b-2 border-secondary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Code Walkthrough</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs select-text">
          {activeTab === 'error' && analysis && (
            <div className="space-y-4">
              {/* Error Callout */}
              <div className="p-3.5 bg-red-950/40 border border-red-800/80 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{analysis.summary}</span>
                </div>
                {errorContext && (
                  <pre className="p-2 bg-black/40 rounded font-mono text-[10px] text-red-200/90 whitespace-pre-wrap overflow-x-auto">
                    {errorContext}
                  </pre>
                )}
              </div>

              {/* Step 1: Why it happened */}
              <div className="p-3.5 bg-[#252526] rounded-xl border border-[#333] space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Why this happened:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed pl-5">
                  {analysis.why}
                </p>
              </div>

              {/* Step 2: How to fix it */}
              <div className="p-3.5 bg-[#252526] rounded-xl border border-[#333] space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  How to fix it:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed pl-5">
                  {analysis.fix}
                </p>
              </div>

              {/* Step 3: Example if available */}
              {analysis.example && (
                <div className="p-3.5 bg-[#252526] rounded-xl border border-[#333] space-y-1.5">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Correct Pattern Example:
                  </span>
                  <pre className="p-2.5 bg-[#141414] rounded-lg font-mono text-[11px] text-emerald-300 border border-[#333]">
                    {analysis.example}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#252526] rounded-xl border border-[#333] space-y-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  Program Logic Breakdown
                </span>
                <ul className="space-y-2 pl-2 text-slate-300 text-[11px]">
                  {overviewPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-secondary font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-sky-950/30 border border-sky-800/60 rounded-xl space-y-1">
                <span className="font-bold text-sky-300">Student Learning Tip:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Use meaningful variable names and break complex algorithms into smaller functions. You can test small changes anytime by pressing <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-white text-[10px]">Ctrl + Enter</kbd>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#252526] border-t border-[#333]">
          <span className="text-[11px] text-slate-400">
            Powered by MSK Coding Academy Curriculum Rules
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-secondary hover:bg-secondary-light text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
