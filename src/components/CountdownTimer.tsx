'use client';

import { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  targetDate: string | number;
  onComplete?: () => void;
}

/**
 * Robustly parses various date formats:
 * - ISO string: "2026-12-01T10:00:00+05:30"
 * - Date string: "2026-12-01" or "1 December 2026" or "December 1, 2026"
 * - Millisecond timestamp: 1796099400000
 */
function parseTargetTimestamp(target: string | number): number {
  if (typeof target === 'number') {
    return isNaN(target) ? 0 : target;
  }
  if (!target || typeof target !== 'string') return 0;

  const trimmed = target.trim();

  // Try direct Date parse
  const direct = new Date(trimmed).getTime();
  if (!isNaN(direct)) return direct;

  // Handle strings like "1 December 2026T09:00:00" -> split T
  if (trimmed.includes('T')) {
    const [datePart, timePart] = trimmed.split('T');
    const combined = `${datePart} ${timePart}`;
    const parsedCombined = new Date(combined).getTime();
    if (!isNaN(parsedCombined)) return parsedCombined;

    const parsedDateOnly = new Date(datePart).getTime();
    if (!isNaN(parsedDateOnly)) return parsedDateOnly;
  }

  // Handle standard YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch.map(Number);
    // Treat as IST (UTC+5:30)
    const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
    return Date.UTC(y, m - 1, d, 10, 0, 0) - istOffsetMs;
  }

  // Fallback to December 1, 2026 10:00 AM IST
  return new Date('2026-12-01T10:00:00+05:30').getTime();
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isElapsed: boolean;
}

function calculateDifference(targetTs: number): TimeLeft {
  if (!targetTs || isNaN(targetTs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: true };
  }

  const now = Date.now();
  const diff = targetTs - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isElapsed: false,
  };
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const targetTs = parseTargetTimestamp(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateDifference(targetTs));

  const updateTimer = useCallback(() => {
    const next = calculateDifference(targetTs);
    setTimeLeft(next);
    if (next.isElapsed && onComplete) {
      onComplete();
    }
  }, [targetTs, onComplete]);

  useEffect(() => {
    setMounted(true);
    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  // Handle post-start dates gracefully
  if (timeLeft.isElapsed) {
    return (
      <div
        className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs"
        role="status"
        aria-live="polite"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Batch In Progress — Next Intake Open</span>
      </div>
    );
  }

  const digits = [
    { label: 'Days', value: mounted ? timeLeft.days.toString().padStart(2, '0') : timeLeft.days > 0 ? timeLeft.days.toString().padStart(2, '0') : '--' },
    { label: 'Hrs', value: mounted ? timeLeft.hours.toString().padStart(2, '0') : timeLeft.hours > 0 ? timeLeft.hours.toString().padStart(2, '0') : '--' },
    { label: 'Mins', value: mounted ? timeLeft.minutes.toString().padStart(2, '0') : timeLeft.minutes > 0 ? timeLeft.minutes.toString().padStart(2, '0') : '--' },
    { label: 'Secs', value: mounted ? timeLeft.seconds.toString().padStart(2, '0') : timeLeft.seconds > 0 ? timeLeft.seconds.toString().padStart(2, '0') : '--' },
  ];

  return (
    <div className="flex items-center justify-center gap-2" aria-live="polite">
      {digits.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div
            className="bg-primary text-white font-mono font-bold text-base sm:text-lg px-2.5 py-1 rounded shadow-sm border border-primary-light min-w-[40px] text-center"
            suppressHydrationWarning
          >
            {item.value}
          </div>
          <span className="text-[9px] sm:text-[10px] text-text-muted font-bold uppercase mt-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
