'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LiveClass } from '@/types';

/**
 * Parses date string (YYYY-MM-DD or DD-MM-YYYY) and time string ("04:30 PM", "2:00:00 PM", etc.)
 * into UTC milliseconds, treating the given class timetable as Indian Standard Time (IST, UTC+5:30).
 */
export function parseISTTimeToEpoch(dateStr?: string, timeStr?: string): number | null {
  if (!dateStr || !timeStr) return null;
  try {
    let year = 0;
    let month = 0;
    let day = 0;

    const cleanDate = dateStr.trim();
    if (cleanDate.includes('-')) {
      const parts = cleanDate.split('-').map(Number);
      if (parts[0] > 1000) {
        // YYYY-MM-DD
        [year, month, day] = parts;
      } else {
        // DD-MM-YYYY
        [day, month, year] = parts;
      }
    } else if (cleanDate.includes('/')) {
      const parts = cleanDate.split('/').map(Number);
      if (parts[0] > 1000) {
        // YYYY/MM/DD
        [year, month, day] = parts;
      } else if (parts[2] > 1000) {
        // DD/MM/YYYY
        [day, month, year] = parts;
      } else {
        // MM/DD/YYYY
        [month, day, year] = parts;
      }
    }

    if (!year || !month || !day) return null;

    // Parse time components (supports e.g. "4:30 PM", "04:30:00 PM", "16:30", "4:30pm")
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    const modifier = match[4]?.toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    // Indian Standard Time is fixed at UTC+5:30 (330 minutes)
    const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
    return Date.UTC(year, month - 1, day, hours, minutes, seconds) - istOffsetMs;
  } catch {
    return null;
  }
}

/**
 * Checks whether a LiveClass is currently in-session at the given epoch timestamp.
 */
export function isClassCurrentlyLive(c: LiveClass, currentEpoch: number = Date.now()): boolean {
  // If explicitly marked completed or cancelled
  const explicitStatus = (c as unknown as { status?: string }).status?.toString().toUpperCase();
  if (explicitStatus === 'COMPLETED' || explicitStatus === 'CANCELLED') {
    return false;
  }

  // If explicitly flagged as live
  if (explicitStatus === 'LIVE' || (c as unknown as { isLive?: boolean }).isLive === true) {
    return true;
  }

  if (!c.date || !c.startTime) return false;

  const startEpoch = parseISTTimeToEpoch(c.date, c.startTime);
  if (!startEpoch) return false;

  let endEpoch: number | null = null;
  if (c.endTime) {
    endEpoch = parseISTTimeToEpoch(c.date, c.endTime);
  }

  // If no end time, or if end time is invalid/before start time, default to durationMinutes or 60m
  if (!endEpoch || endEpoch <= startEpoch) {
    const durationMin = c.durationMinutes && c.durationMinutes > 0 ? c.durationMinutes : 60;
    endEpoch = startEpoch + durationMin * 60 * 1000;
  }

  return currentEpoch >= startEpoch && currentEpoch <= endEpoch;
}

interface LiveStatusContextType {
  isLiveNow: boolean;
  activeLiveClass: LiveClass | null;
  activeLiveClasses: LiveClass[];
  classes: LiveClass[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const LiveStatusContext = createContext<LiveStatusContextType>({
  isLiveNow: false,
  activeLiveClass: null,
  activeLiveClasses: [],
  classes: [],
  isLoading: false,
  refetch: async () => {},
});

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Date.now());

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch('/api/live-classes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setClasses(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live classes status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch immediately on client mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Background refresh of live classes schedule every 60 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchClasses();
    }, 60000);
    return () => clearInterval(pollInterval);
  }, [fetchClasses]);

  // Regular clock ticker every 5 seconds so live state transitions automatically in real time
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setCurrentEpoch(Date.now());
    }, 5000);
    return () => clearInterval(tickInterval);
  }, []);

  // Refresh immediately when user returns/focuses tab
  useEffect(() => {
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setCurrentEpoch(Date.now());
        fetchClasses();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchClasses]);

  const activeLiveClasses = useMemo(() => {
    return classes.filter((c) => isClassCurrentlyLive(c, currentEpoch));
  }, [classes, currentEpoch]);

  const isLiveNow = activeLiveClasses.length > 0;
  const activeLiveClass = activeLiveClasses[0] || null;

  const value = useMemo(
    () => ({
      isLiveNow,
      activeLiveClass,
      activeLiveClasses,
      classes,
      isLoading,
      refetch: fetchClasses,
    }),
    [isLiveNow, activeLiveClass, activeLiveClasses, classes, isLoading, fetchClasses]
  );

  return <LiveStatusContext.Provider value={value}>{children}</LiveStatusContext.Provider>;
}

export function useLiveStatus(): LiveStatusContextType {
  return useContext(LiveStatusContext);
}
