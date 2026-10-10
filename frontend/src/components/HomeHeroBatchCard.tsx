'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { LiveBatch } from '@/types';
import CountdownTimer from '@/components/CountdownTimer';
import { parseBatchStartTimestamp } from '@/lib/batchUtils';

interface HomeHeroBatchCardProps {
  initialBatches: LiveBatch[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Deterministic date formatter to guarantee 100% SSR-Client HTML parity
 * (prevents React Hydration Error #418 caused by locale differences)
 */
function formatBatchStartDate(dateStr: string | undefined, startTs: number): string {
  if (!dateStr && !startTs) return 'Upcoming Cohort';
  try {
    if (dateStr && dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].slice(0, 2), 10);
        if (!isNaN(year) && !isNaN(monthIndex) && !isNaN(day) && monthIndex >= 0 && monthIndex < 12) {
          return `${day} ${MONTH_NAMES[monthIndex]} ${year}`;
        }
      }
    }
    if (startTs > 0) {
      const d = new Date(startTs);
      return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    }
  } catch {}
  return dateStr || 'Upcoming Cohort';
}

export default function HomeHeroBatchCard({ initialBatches }: HomeHeroBatchCardProps) {
  const [mounted, setMounted] = useState(false);
  const [nowTs, setNowTs] = useState<number>(0);

  // Mount synchronization ensures initial client render exactly matches SSR
  useEffect(() => {
    setMounted(true);
    setNowTs(Date.now());
    const timer = setInterval(() => {
      setNowTs(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter out completed, closed, or zero-seat batches to enforce strict lifecycle hygiene
  const activeBatches = useMemo(() => {
    return initialBatches.filter(
      (b) =>
        b.status !== 'COMPLETED' &&
        b.status !== 'ARCHIVED' &&
        b.status !== 'CLOSED' &&
        (b.leftSeats === undefined || b.leftSeats > 0)
    );
  }, [initialBatches]);

  // Sort batches chronologically by starting timestamp
  const sortedBatches = useMemo(() => {
    const list = activeBatches.length > 0 ? activeBatches : initialBatches;
    return [...list].sort((a, b) => {
      return parseBatchStartTimestamp(a) - parseBatchStartTimestamp(b);
    });
  }, [activeBatches, initialBatches]);

  // Prioritize upcoming batches; fall back cleanly to sorted list
  const scheduledBatches = useMemo(() => {
    if (sortedBatches.length === 0) return [];
    if (!mounted || nowTs === 0) return sortedBatches;
    const upcoming = sortedBatches.filter((b) => parseBatchStartTimestamp(b) > nowTs);
    if (upcoming.length > 0) return upcoming;
    return sortedBatches;
  }, [sortedBatches, mounted, nowTs]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= scheduledBatches.length && scheduledBatches.length > 0) {
      setCurrentIndex(0);
    }
  }, [scheduledBatches.length, currentIndex]);

  // Auto-slide carousel
  useEffect(() => {
    if (scheduledBatches.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === 'forward') {
          if (prevIndex >= scheduledBatches.length - 1) {
            setDirection('backward');
            return Math.max(0, prevIndex - 1);
          }
          return prevIndex + 1;
        } else {
          if (prevIndex <= 0) {
            setDirection('forward');
            return Math.min(scheduledBatches.length - 1, prevIndex + 1);
          }
          return prevIndex - 1;
        }
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [scheduledBatches.length, isPaused, direction]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev < scheduledBatches.length - 1 ? prev + 1 : 0));
      } else {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : scheduledBatches.length - 1));
      }
    }
    setTouchStart(null);
  };

  const handleBatchExpire = useCallback(() => {
    setNowTs(Date.now());
  }, []);

  if (scheduledBatches.length === 0) return null;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-secondary/5 rounded-3xl blur-3xl -z-10" />

      {/* Main Card Shell */}
      <div
        className="border border-border-subtle bg-white rounded-3xl shadow-xl overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Carousel Track */}
        <div
          className="flex flex-row transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {scheduledBatches.map((batch) => {
            const startTs = parseBatchStartTimestamp(batch);
            const isStarted = mounted && nowTs > 0 ? startTs > 0 && startTs <= nowTs : batch.status === 'RUNNING';
            const countdownDateString =
              batch.startDateTime ||
              (startTs ? new Date(startTs).toISOString() : `${batch.startDate}T09:00:00`);

            const formattedStartDate = formatBatchStartDate(batch.startDate, startTs);

            return (
              <div
                key={batch.id}
                className="w-full flex-shrink-0 p-6 sm:p-7 flex flex-col justify-between gap-5"
              >
                {/* Top Header: Highlighted Starting Date & Price */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative inline-flex items-center" suppressHydrationWarning>
                    <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-70 blur-xs animate-pulse" />

                    <div className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7A00] to-[#E64A19] text-white shadow-md shadow-orange-500/25 border border-white/30 select-none">
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>

                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white drop-shadow-xs" suppressHydrationWarning>
                        {isStarted ? 'In Session' : `Starting ${formattedStartDate}`}
                      </span>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="flex items-center gap-1.5">
                    {batch.originalPrice && (
                      <span className="text-xs text-text-muted line-through font-semibold hidden sm:inline">
                        {batch.originalPrice}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-black text-secondary bg-secondary/10 px-3 py-1 rounded-xl border border-secondary/20 shadow-2xs">
                      {batch.price || '₹2,999'}
                    </span>
                  </div>
                </div>

                {/* Batch Titles */}
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight line-clamp-1 sm:line-clamp-2">
                    {batch.title || 'Live Interactive Batch'}
                  </h2>
                  <p className="text-xs font-semibold text-text-muted truncate">
                    {batch.courseTitle || 'Live Computer & Coding Course'}
                  </p>
                </div>

                {/* Short Description */}
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {batch.description ||
                    'Start your coding journey with our intensive live training batch. Hands-on projects, doubt solving, and personalized mentorship.'}
                </p>

                {/* Live Countdown Timer */}
                <div className="bg-surface/80 border border-border-subtle p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-muted px-1" suppressHydrationWarning>
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isStarted ? 'bg-emerald-500' : 'bg-secondary animate-ping'
                        }`}
                      />
                      {isStarted ? 'Batch In Progress:' : 'Batch Starts In:'}
                    </span>
                    <span className="text-[11px] font-semibold text-secondary">
                      {isStarted ? 'Limited Late Seats' : 'Admissions Open'}
                    </span>
                  </div>
                  <CountdownTimer
                    targetDate={countdownDateString}
                    onComplete={handleBatchExpire}
                  />
                </div>

                {/* Instructor & Schedule Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                  {batch.instructorPicture ? (
                    <div className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={batch.instructorPicture}
                        alt={batch.instructor || 'Instructor'}
                        width={44}
                        height={44}
                        loading="lazy"
                        className="w-11 h-11 rounded-full object-cover border-2 border-secondary shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border border-white" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm flex-shrink-0">
                      {batch.instructor?.[0] || 'S'}
                    </div>
                  )}
                  <div className="text-xs space-y-0.5 min-w-0">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <span className="truncate">{batch.instructor || 'Er. Sumit Kumar'}</span>
                      <span className="text-[10px] font-medium text-text-muted bg-surface px-1.5 py-0.2 rounded border border-border-subtle flex-shrink-0">
                        Lead Mentor
                      </span>
                    </div>
                    <div className="text-text-muted text-[11px] truncate">
                      <strong>Schedule:</strong> {batch.schedule || 'Mon - Sat (05:00 PM - 06:30 PM)'}
                    </div>
                  </div>
                </div>

                {/* Urgency & Primary CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-border-subtle gap-3">
                  <span className="text-xs text-red-500 font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Only {batch.leftSeats || 4} of {batch.totalSeats || 20} Seats Left
                  </span>

                  <Link
                    href={`/live-batches/${batch.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex-shrink-0"
                  >
                    <span>View Live Batch Details</span>
                    <span className="text-sm">➔</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Passive subtle slide indicators */}
        {scheduledBatches.length > 1 && (
          <div
            className="flex justify-center items-center gap-1.5 pb-4 -mt-2 select-none"
            aria-hidden="true"
          >
            {scheduledBatches.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? 'w-6 bg-secondary shadow-xs'
                    : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
