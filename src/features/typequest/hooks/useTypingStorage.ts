'use client';

import { useState, useEffect, useCallback } from 'react';
import { TestResult, UserTypingStats, SoundEffectType } from '../types';

const STORAGE_KEY_STATS = 'msk_typequest_stats_v1';
const STORAGE_KEY_PREFS = 'msk_typequest_prefs_v1';

export interface UserPreferences {
  soundType: SoundEffectType;
  soundVolume: number;
  showKeyboard: boolean;
  showHands: boolean;
  strictMode: boolean;
  blindMode: boolean;
  wordWrap?: boolean;
  codeWordWrap?: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  soundType: 'mechanical',
  soundVolume: 0.6,
  showKeyboard: true,
  showHands: true,
  strictMode: false,
  blindMode: false,
  wordWrap: true,
  codeWordWrap: false,
};

const DEFAULT_STATS: UserTypingStats = {
  totalTests: 0,
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 100,
  totalTimeSeconds: 0,
  totalCharsTyped: 0,
  recentResults: [],
  unlockedLessons: ['home-row-1'],
};

export function useTypingStorage() {
  const [stats, setStats] = useState<UserTypingStats>(DEFAULT_STATS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
      if (savedPrefs) {
        setPreferences({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) });
      }
    } catch (e) {
      console.error('Failed to load typing storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      try {
        localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save typing preferences:', e);
      }
      return updated;
    });
  }, []);

  // Save test result
  const recordTestResult = useCallback((result: TestResult, nextLessonId?: string) => {
    setStats((prev) => {
      const totalTests = prev.totalTests + 1;
      const bestWpm = Math.max(prev.bestWpm, result.wpm);
      const totalTimeSeconds = prev.totalTimeSeconds + result.timeSpentSeconds;
      const totalCharsTyped = prev.totalCharsTyped + result.correctChars + result.errorChars;

      // Weighted moving average
      const averageWpm = Math.round(
        (prev.averageWpm * prev.totalTests + result.wpm) / totalTests
      );
      const averageAccuracy = Math.round(
        (prev.averageAccuracy * prev.totalTests + result.accuracy) / totalTests
      );

      const recentResults = [result, ...prev.recentResults.slice(0, 19)];
      const unlockedLessons = [...prev.unlockedLessons];
      if (nextLessonId && !unlockedLessons.includes(nextLessonId)) {
        unlockedLessons.push(nextLessonId);
      }

      const updatedStats: UserTypingStats = {
        totalTests,
        bestWpm,
        averageWpm,
        averageAccuracy,
        totalTimeSeconds,
        totalCharsTyped,
        recentResults,
        unlockedLessons,
      };

      try {
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(updatedStats));
      } catch (e) {
        console.error('Failed to save typing stats:', e);
      }

      return updatedStats;
    });
  }, []);

  const resetAllStats = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_STATS);
      setStats(DEFAULT_STATS);
    } catch (e) {
      console.error('Failed to reset stats:', e);
    }
  }, []);

  return {
    stats,
    preferences,
    isLoaded,
    updatePreferences,
    recordTestResult,
    resetAllStats,
  };
}
