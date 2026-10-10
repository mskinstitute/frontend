'use client';

import React from 'react';
import { findFingerForChar, FINGER_INFO } from '../data/keyboardLayout';
import { FingerName } from '../types';

interface FingerGuideProps {
  nextChar: string | null;
}

export default function FingerGuide({ nextChar }: FingerGuideProps) {
  const currentFinger = nextChar ? findFingerForChar(nextChar) : null;
  const fingerData = currentFinger ? FINGER_INFO[currentFinger] : null;

  const leftFingers: { id: FingerName; name: string }[] = [
    { id: 'left-pinky', name: 'Pinky' },
    { id: 'left-ring', name: 'Ring' },
    { id: 'left-middle', name: 'Middle' },
    { id: 'left-index', name: 'Index' },
    { id: 'thumb', name: 'Thumb' },
  ];

  const rightFingers: { id: FingerName; name: string }[] = [
    { id: 'thumb', name: 'Thumb' },
    { id: 'right-index', name: 'Index' },
    { id: 'right-middle', name: 'Middle' },
    { id: 'right-ring', name: 'Ring' },
    { id: 'right-pinky', name: 'Pinky' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Active Finger Callout */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full ring-4 transition-all duration-200"
            style={{
              backgroundColor: fingerData?.color || '#94a3b8',
              boxShadow: fingerData ? `0 0 12px ${fingerData.color}` : 'none',
            }}
          />
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Finger Guidance
            </div>
            <div className="text-sm font-semibold text-white">
              {fingerData ? (
                <span>
                  Use <span style={{ color: fingerData.color }}>{fingerData.label}</span> for{' '}
                  <span className="font-mono px-1.5 py-0.5 bg-slate-800 text-secondary rounded">
                    {nextChar === ' ' ? 'Space' : nextChar === '\n' ? 'Enter' : nextChar}
                  </span>
                </span>
              ) : (
                <span className="text-slate-400">Ready to strike next key...</span>
              )}
            </div>
          </div>
        </div>

        {/* Dual Hands Mini Representation */}
        <div className="flex items-center gap-4 text-xs font-mono select-none">
          {/* Left Hand */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans mr-1">Left:</span>
            {leftFingers.map((f) => {
              const isMatch = currentFinger === f.id;
              const info = FINGER_INFO[f.id];
              return (
                <span
                  key={f.id}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                    isMatch
                      ? 'scale-125 ring-2 ring-white text-slate-950 font-black animate-bounce'
                      : 'opacity-40 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: info.color }}
                  title={`${info.label}`}
                >
                  {f.name[0]}
                </span>
              );
            })}
          </div>

          {/* Right Hand */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans mr-1">Right:</span>
            {rightFingers.map((f) => {
              const isMatch = currentFinger === f.id;
              const info = FINGER_INFO[f.id];
              return (
                <span
                  key={`${f.id}-right`}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                    isMatch
                      ? 'scale-125 ring-2 ring-white text-slate-950 font-black animate-bounce'
                      : 'opacity-40 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: info.color }}
                  title={`${info.label}`}
                >
                  {f.name[0]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
