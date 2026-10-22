'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({
  targetDate,
  onComplete,
}: {
  targetDate: string;
  onComplete?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        if (onComplete) {
          onComplete();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex items-center justify-center gap-2" aria-live="polite">
      {[
        { label: 'Days', value: isMounted && timeLeft ? timeLeft.days.toString().padStart(2, '0') : '--' },
        { label: 'Hrs', value: isMounted && timeLeft ? timeLeft.hours.toString().padStart(2, '0') : '--' },
        { label: 'Mins', value: isMounted && timeLeft ? timeLeft.minutes.toString().padStart(2, '0') : '--' },
        { label: 'Secs', value: isMounted && timeLeft ? timeLeft.seconds.toString().padStart(2, '0') : '--' },
      ].map((item, idx) => (
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
