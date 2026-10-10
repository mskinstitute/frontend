'use client';

import React from 'react';
import { TimelineDataPoint } from '../types';

interface WpmChartProps {
  timeline: TimelineDataPoint[];
  avgWpm?: number;
}

export default function WpmChart({ timeline, avgWpm }: WpmChartProps) {
  const calculatedAvg =
    avgWpm ??
    (timeline && timeline.length > 0
      ? Math.round(timeline.reduce((acc, d) => acc + d.wpm, 0) / timeline.length)
      : 0);
  if (!timeline || timeline.length < 2) {
    return (
      <div className="w-full h-36 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-mono">
        Speed velocity graph generated for tests lasting 3+ seconds
      </div>
    );
  }

  // Calculate scales
  const maxWpm = Math.max(...timeline.map((d) => Math.max(d.wpm, d.rawWpm)), calculatedAvg, 40) + 10;
  const minWpm = 0;
  const totalSeconds = Math.max(timeline[timeline.length - 1].second, 1);

  const width = 600;
  const height = 140;
  const paddingX = 35;
  const paddingY = 20;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Coordinate mappers
  const getX = (sec: number) => paddingX + (sec / totalSeconds) * chartW;
  const getY = (val: number) => paddingY + chartH - ((val - minWpm) / (maxWpm - minWpm)) * chartH;

  // Build SVG path strings
  const wpmPoints = timeline.map((d) => `${getX(d.second)},${getY(d.wpm)}`).join(' ');
  const rawWpmPoints = timeline.map((d) => `${getX(d.second)},${getY(d.rawWpm)}`).join(' ');

  // Gradient area path
  const areaPath = `M ${getX(timeline[0].second)},${getY(0)} L ${timeline
    .map((d) => `${getX(d.second)},${getY(d.wpm)}`)
    .join(' L ')} L ${getX(timeline[timeline.length - 1].second)},${getY(0)} Z`;

  // Mistakes points (where errors > 0 and increased)
  const errorPoints: { x: number; y: number; count: number }[] = [];
  let prevErrors = 0;
  timeline.forEach((d) => {
    if (d.errors > prevErrors) {
      errorPoints.push({
        x: getX(d.second),
        y: getY(d.wpm),
        count: d.errors - prevErrors,
      });
    }
    prevErrors = d.errors;
  });

  return (
    <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 sm:p-4 select-none">
      {/* Chart Legend */}
      <div className="flex items-center justify-between text-[11px] font-mono mb-2 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-secondary font-semibold">
            <span className="w-2.5 h-1 bg-secondary rounded-full" /> Net WPM
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-1 bg-blue-400/60 rounded-full" /> Raw Speed
          </span>
          {errorPoints.length > 0 && (
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Mistakes ({errorPoints.length})
            </span>
          )}
        </div>
        <span className="text-slate-400 font-medium">Avg: <strong className="text-white">{avgWpm} WPM</strong></span>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-28 sm:h-36 overflow-visible"
        >
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis */}
          {[0, Math.round(maxWpm / 2), Math.round(maxWpm)].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.75"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Average Line */}
          {calculatedAvg > 0 && (
            <line
              x1={paddingX}
              y1={getY(calculatedAvg)}
              x2={width - paddingX}
              y2={getY(calculatedAvg)}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.6"
            />
          )}

          {/* Gradient Area Fill */}
          <path d={areaPath} fill="url(#wpmGradient)" />

          {/* Raw WPM Line */}
          <polyline
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
            points={rawWpmPoints}
          />

          {/* Net WPM Velocity Line */}
          <polyline
            fill="none"
            stroke="#ff6b00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={wpmPoints}
          />

          {/* Error Cross Markers */}
          {errorPoints.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            </g>
          ))}

          {/* X Axis Second Ticks */}
          <text
            x={paddingX}
            y={height - 2}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            0s
          </text>
          <text
            x={width - paddingX}
            y={height - 2}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            {totalSeconds}s
          </text>
        </svg>
      </div>
    </div>
  );
}
