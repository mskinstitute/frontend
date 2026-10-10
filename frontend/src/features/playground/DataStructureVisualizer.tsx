'use client';

import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Play, RotateCcw, Plus, Trash2, Sparkles, Binary, Search, Link2 } from 'lucide-react';

interface VisualizerProps {
  currentCode?: string;
  language?: string;
}

type VisualizerMode = 'array' | 'linked_list' | 'pointers' | 'stack_queue';

export default function DataStructureVisualizer({ currentCode = '', language = 'c' }: VisualizerProps) {
  const [mode, setMode] = useState<VisualizerMode>('array');

  // Array State
  const [arrayElements, setArrayElements] = useState<number[]>([25, 50, 75, 100, 125]);
  const [newArrayInput, setNewArrayInput] = useState<string>('25, 50, 75, 100, 125');
  const [pointerI, setPointerI] = useState<number>(0);
  const [pointerJ, setPointerJ] = useState<number>(-1);
  const [searchTarget, setSearchTarget] = useState<number>(75);
  const [searchStatus, setSearchStatus] = useState<string>('Ready');

  // Linked List State
  const [listNodes, setListNodes] = useState<number[]>([10, 20, 30, 40]);
  const [newNodeVal, setNewNodeVal] = useState<number>(50);

  // Pointer & Memory State
  const [varName, setVarName] = useState<string>('myNumber');
  const [varValue, setVarValue] = useState<number>(42);
  const [varAddress] = useState<string>('0x7ffee218');
  const [ptrName, setPtrName] = useState<string>('ptr');
  const [ptrAddress] = useState<string>('0x7ffee220');

  // Stack/Queue State
  const [stackElements, setStackElements] = useState<number[]>([10, 20, 30]);

  // Try to parse array from current code on mount or when code changes
  useEffect(() => {
    if (!currentCode) return;

    // Detect C/C++ array: int myNumbers[] = {25, 50, 75, 100};
    const cArrayMatch = currentCode.match(/\{([\s\d,-]+)\}/);
    if (cArrayMatch && cArrayMatch[1]) {
      const parsed = cArrayMatch[1]
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (parsed.length > 0 && parsed.length <= 12) {
        setArrayElements(parsed);
        setNewArrayInput(parsed.join(', '));
      }
      return;
    }

    // Detect Python array: my_list = [25, 50, 75, 100]
    const pyArrayMatch = currentCode.match(/\[([\s\d,-]+)\]/);
    if (pyArrayMatch && pyArrayMatch[1]) {
      const parsed = pyArrayMatch[1]
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (parsed.length > 0 && parsed.length <= 12) {
        setArrayElements(parsed);
        setNewArrayInput(parsed.join(', '));
      }
    }
  }, [currentCode]);

  const handleUpdateArray = () => {
    const parsed = newArrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) {
      setArrayElements(parsed.slice(0, 10)); // Max 10 for clean visual rendering
      setPointerI(0);
      setPointerJ(-1);
      setSearchStatus('Array updated');
    }
  };

  const handleStepLinearSearch = () => {
    if (pointerI >= arrayElements.length) {
      setSearchStatus(`Target ${searchTarget} not found in array.`);
      return;
    }

    const currentVal = arrayElements[pointerI];
    if (currentVal === searchTarget) {
      setSearchStatus(`✅ Found target ${searchTarget} at index [${pointerI}]!`);
    } else {
      setSearchStatus(`Examining index [${pointerI}] (${currentVal} ≠ ${searchTarget})...`);
      setPointerI((prev) => Math.min(arrayElements.length, prev + 1));
    }
  };

  const handleResetSearch = () => {
    setPointerI(0);
    setPointerJ(-1);
    setSearchStatus('Search reset');
  };

  const handleAddListNode = () => {
    if (listNodes.length >= 8) return;
    setListNodes([...listNodes, newNodeVal]);
    setNewNodeVal((v) => v + 10);
  };

  const handleDeleteListNode = (idx: number) => {
    if (listNodes.length <= 1) return;
    setListNodes(listNodes.filter((_, i) => i !== idx));
  };

  const handlePushStack = () => {
    if (stackElements.length >= 7) return;
    const nextVal = (stackElements[stackElements.length - 1] || 0) + 10;
    setStackElements([...stackElements, nextVal]);
  };

  const handlePopStack = () => {
    if (stackElements.length <= 0) return;
    setStackElements(stackElements.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] text-slate-200 select-none">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#202020] border-b border-[#2d2d2d] gap-2">
        <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setMode('array')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'array' ? 'bg-secondary text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Array & Indices</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('pointers')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'pointers' ? 'bg-secondary text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>C/C++ Pointers</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('linked_list')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'linked_list' ? 'bg-secondary text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Linked List</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('stack_queue')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'stack_queue' ? 'bg-secondary text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🥞 Stack / LIFO</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-secondary" />
          <span>Interactive Memory Visualizer</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-center items-center">
        {/* MODE 1: ARRAY & POINTERS */}
        {mode === 'array' && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-6">
            {/* Array Controls */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#141414] rounded-xl border border-slate-800 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Array Data:</span>
                <input
                  type="text"
                  value={newArrayInput}
                  onChange={(e) => setNewArrayInput(e.target.value)}
                  placeholder="e.g. 25, 50, 75, 100"
                  className="bg-[#202020] border border-slate-700 px-2 py-1 rounded text-white font-mono text-xs w-48 sm:w-60 focus:border-secondary outline-none"
                />
                <button
                  type="button"
                  onClick={handleUpdateArray}
                  className="px-2.5 py-1 bg-[#282828] hover:bg-[#333] text-slate-200 border border-slate-700 rounded cursor-pointer transition-colors"
                >
                  Set
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Search:</span>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(parseInt(e.target.value, 10) || 0)}
                  className="bg-[#202020] border border-slate-700 px-2 py-1 rounded text-white font-mono text-xs w-16 focus:border-secondary outline-none"
                />
                <button
                  type="button"
                  onClick={handleStepLinearSearch}
                  className="px-2.5 py-1 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/40 font-semibold rounded cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>Step Search</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
                  title="Reset Search Pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300">
              {searchStatus}
            </div>

            {/* Visual Array Blocks */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap py-4">
              {arrayElements.map((val, idx) => {
                const isPointerI = pointerI === idx;
                const isMatch = val === searchTarget && isPointerI;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 animate-in zoom-in duration-200">
                    {/* Top Pointer Indicator */}
                    <div className="h-6 flex items-center justify-center">
                      {isPointerI && (
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/15 px-1.5 py-0.5 rounded border border-secondary/30">
                            i = {idx}
                          </span>
                          <span className="text-secondary text-xs">▼</span>
                        </div>
                      )}
                    </div>

                    {/* Array Cell Box */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border-2 transition-all shadow-md ${
                        isMatch
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-emerald-900/40 scale-105'
                          : isPointerI
                          ? 'bg-secondary/20 border-secondary text-white shadow-secondary/20 scale-105'
                          : 'bg-[#252526] border-[#3c3c3c] text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {val}
                    </div>

                    {/* Bottom Index Badge */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        [{idx}]
                      </span>
                      <span className="text-[9px] font-mono text-slate-600">
                        0x{((idx * 4) + 1000).toString(16)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: C / C++ POINTERS & MEMORY ADDRESSES */}
        {mode === 'pointers' && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-6">
            <div className="text-xs text-slate-400 text-center max-w-md">
              A pointer is a variable that stores the <strong className="text-white">memory address</strong> of another variable in RAM.
            </div>

            {/* Visual Pointer Node Diagram */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap py-6">
              {/* Pointer Variable Card */}
              <div className="p-4 bg-[#1e222a] border-2 border-secondary/70 rounded-2xl shadow-xl flex flex-col items-center gap-2 min-w-[160px] animate-in slide-in-from-left duration-200">
                <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                  Pointer (*{ptrName})
                </span>
                <div className="w-20 h-16 rounded-xl bg-[#282d38] border border-secondary/50 flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] text-slate-400">Stores Address</span>
                  <span className="font-bold text-sky-300 text-xs">{varAddress}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Address: {ptrAddress}
                </div>
              </div>

              {/* Animated Pointer Arrow */}
              <div className="flex flex-col items-center gap-1 text-secondary">
                <span className="text-[11px] font-mono font-bold bg-secondary/15 px-2 py-0.5 rounded border border-secondary/30">
                  Points to (&{varName})
                </span>
                <ArrowRight className="w-8 h-8 animate-pulse" />
              </div>

              {/* Target Variable Card */}
              <div className="p-4 bg-[#1a251f] border-2 border-emerald-500/70 rounded-2xl shadow-xl flex flex-col items-center gap-2 min-w-[160px] animate-in slide-in-from-right duration-200">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Variable ({varName})
                </span>
                <div className="w-20 h-16 rounded-xl bg-[#203328] border border-emerald-500/50 flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] text-slate-400">Direct Value</span>
                  <span className="font-bold text-emerald-300 text-lg">{varValue}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Address: {varAddress}
                </div>
              </div>
            </div>

            {/* Live Interactive Code Preview */}
            <div className="w-full bg-[#141414] border border-[#2b2b2b] rounded-xl p-3 font-mono text-xs space-y-1">
              <div className="text-slate-400">// Equivalent C/C++ Code:</div>
              <div className="text-white">
                <span className="text-purple-400">int</span> {varName} = <span className="text-amber-300">{varValue}</span>; <span className="text-slate-500">// Variable stored at {varAddress}</span>
              </div>
              <div className="text-white">
                <span className="text-purple-400">int*</span> {ptrName} = &amp;{varName}; <span className="text-slate-500">// Stores memory address {varAddress}</span>
              </div>
              <div className="text-emerald-300">
                printf(<span className="text-green-300">"Value via dereference *ptr: %d\n"</span>, *{ptrName}); <span className="text-slate-500">// Output: {varValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: LINKED LIST */}
        {mode === 'linked_list' && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddListNode}
                className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Node ({newNodeVal})</span>
              </button>
            </div>

            {/* Visual Node Chain */}
            <div className="flex items-center justify-center gap-2 flex-wrap py-4 overflow-x-auto max-w-full">
              {listNodes.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  {/* Node Box */}
                  <div className="flex rounded-xl overflow-hidden border-2 border-slate-700 bg-[#222] shadow-md font-mono text-xs">
                    {/* Data Section */}
                    <div className="px-3 py-2.5 bg-[#2a2a2a] border-r border-slate-700 flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 uppercase">Data</span>
                      <span className="font-bold text-white text-sm">{val}</span>
                    </div>
                    {/* Next Pointer Section */}
                    <div className="px-2.5 py-2.5 flex flex-col items-center justify-center bg-[#1e1e1e]">
                      <span className="text-[9px] text-slate-500">Next</span>
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                  </div>

                  {/* Arrow to Next Node or NULL */}
                  {idx < listNodes.length - 1 ? (
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500 font-mono text-xs shrink-0">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-300 text-[10px]">
                        NULL
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 4: STACK / QUEUE */}
        {mode === 'stack_queue' && (
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePushStack}
                className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Push()</span>
              </button>

              <button
                type="button"
                onClick={handlePopStack}
                className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Pop()</span>
              </button>
            </div>

            {/* Stack Container */}
            <div className="w-44 min-h-[220px] max-h-[300px] border-b-4 border-l-4 border-r-4 border-slate-600 rounded-b-2xl p-2 flex flex-col-reverse gap-2 bg-[#121212]/80 shadow-2xl">
              {stackElements.map((el, i) => (
                <div
                  key={i}
                  className={`w-full py-2 rounded-lg font-mono font-bold text-center text-xs shadow-md border animate-in zoom-in duration-200 ${
                    i === stackElements.length - 1
                      ? 'bg-secondary text-white border-secondary/80'
                      : 'bg-[#2a2a2a] text-slate-200 border-slate-700'
                  }`}
                >
                  {el} {i === stackElements.length - 1 && <span className="text-[10px] opacity-80">(TOP)</span>}
                </div>
              ))}
              {stackElements.length === 0 && (
                <div className="text-center text-slate-600 text-xs py-8 italic">
                  Stack is empty
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
