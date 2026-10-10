'use client';

import React from 'react';

interface MobileSymbolsBarProps {
  onInsertSymbol: (symbol: string) => void;
  onInsertTab: () => void;
}

const SYMBOLS = [
  ':',
  ';',
  '(',
  ')',
  '{',
  '}',
  '[',
  ']',
  '=',
  '==',
  '!=',
  '<',
  '>',
  '<<',
  '>>',
  '->',
  '::',
  '&',
  '*',
  '/',
  '+',
  '-',
  '#',
  '"',
  "'",
  ',',
  '.',
  '_',
  '!',
];

export default function MobileSymbolsBar({ onInsertSymbol, onInsertTab }: MobileSymbolsBarProps) {
  return (
    <div className="md:hidden flex items-center gap-1.5 px-2 py-1.5 bg-[#161b22] border-t border-slate-800 overflow-x-auto no-scrollbar select-none z-10">
      {/* Quick Tab Button */}
      <button
        type="button"
        onClick={onInsertTab}
        className="flex-shrink-0 px-2.5 py-1 bg-slate-800 active:bg-secondary active:text-white text-slate-300 rounded text-xs font-mono font-bold border border-slate-700 shadow-2xs transition-all active:scale-90"
        title="Insert Indent (4 Spaces)"
      >
        Tab ⇥
      </button>

      {/* Quick Programming Symbols */}
      {SYMBOLS.map((sym) => (
        <button
          key={sym}
          type="button"
          onClick={() => onInsertSymbol(sym)}
          className="flex-shrink-0 min-w-[32px] h-7 flex items-center justify-center px-2 bg-slate-800/80 active:bg-secondary active:text-white text-slate-200 rounded text-xs font-mono font-bold border border-slate-700/80 transition-all active:scale-90"
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
