'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TestResult, PracticeMode } from '../types';

export interface UseTypingEngineProps {
  targetText: string;
  mode: PracticeMode;
  modeLabel: string;
  timedDuration?: number; // in seconds, if mode === 'timed'
  strictMode?: boolean; // must fix error before advancing
  onPlayClick?: (isSpecial: boolean) => void;
  onPlayError?: () => void;
  onComplete?: (result: TestResult) => void;
}

export interface CharState {
  char: string;
  status: 'correct' | 'incorrect' | 'pending';
}

function calculateRating(wpm: number, accuracy: number): TestResult['rating'] {
  if (wpm >= 100 && accuracy >= 95) {
    return { title: 'Godspeed Typist', tier: 'Godspeed', color: 'text-purple-600 dark:text-purple-400' };
  }
  if (wpm >= 80 && accuracy >= 92) {
    return { title: 'Professional Master', tier: 'Pro', color: 'text-emerald-600 dark:text-emerald-400' };
  }
  if (wpm >= 60 && accuracy >= 90) {
    return { title: 'Fast & Fluent Typist', tier: 'Fast', color: 'text-blue-600 dark:text-blue-400' };
  }
  if (wpm >= 40 && accuracy >= 85) {
    return { title: 'Fluent Typist', tier: 'Fluent', color: 'text-cyan-600 dark:text-cyan-400' };
  }
  if (wpm >= 25) {
    return { title: 'Casual Typist', tier: 'Casual', color: 'text-amber-600 dark:text-amber-400' };
  }
  return { title: 'Beginner Trainee', tier: 'Beginner', color: 'text-slate-600 dark:text-slate-400' };
}

export function useTypingEngine({
  targetText,
  mode,
  modeLabel,
  timedDuration,
  strictMode = false,
  onPlayClick,
  onPlayError,
  onComplete,
}: UseTypingEngineProps) {
  const [userInput, setUserInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Time tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(timedDuration || 60);

  // Keystrokes stats
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const errorMapRef = useRef<Record<string, { total: number; errors: number }>>({});
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineRef = useRef<import('../types').TimelineDataPoint[]>([]);

  // Reset function
  const resetEngine = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setUserInput('');
    setIsActive(false);
    setIsCompleted(false);
    setActiveKey(null);
    setStartTime(null);
    setElapsedSeconds(0);
    setTimeLeft(timedDuration || 60);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setErrorKeystrokes(0);
    errorMapRef.current = {};
    timelineRef.current = [];
  }, [timedDuration]);

  // Handle test completion
  const finishTest = useCallback(
    (finalElapsed: number) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsActive(false);
      setIsCompleted(true);

      const effectiveSeconds = Math.max(finalElapsed, 1);
      const minutes = effectiveSeconds / 60;
      const wpm = Math.round(correctKeystrokes / 5 / minutes);
      const rawWpm = Math.round(totalKeystrokes / 5 / minutes);
      const cpm = Math.round(correctKeystrokes / minutes);
      const accuracy =
        totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

      // Extract weak keys
      const weakKeys = Object.entries(errorMapRef.current)
        .filter(([_, stats]) => stats.errors > 0)
        .map(([key, stats]) => ({
          key,
          errorCount: stats.errors,
          accuracy: Math.round(((stats.total - stats.errors) / stats.total) * 100),
        }))
        .sort((a, b) => b.errorCount - a.errorCount)
        .slice(0, 5);

      const timeline =
        timelineRef.current.length > 0
          ? timelineRef.current
          : [{ second: effectiveSeconds, wpm, rawWpm, errors: errorKeystrokes }];

      const result: TestResult = {
        id: `test_${Date.now()}`,
        date: new Date().toISOString(),
        mode,
        modeLabel,
        wpm: isNaN(wpm) ? 0 : wpm,
        rawWpm: isNaN(rawWpm) ? 0 : rawWpm,
        cpm: isNaN(cpm) ? 0 : cpm,
        accuracy: isNaN(accuracy) ? 100 : accuracy,
        consistency: 92,
        timeSpentSeconds: effectiveSeconds,
        correctChars: correctKeystrokes,
        errorChars: errorKeystrokes,
        extraChars: Math.max(0, userInput.length - targetText.length),
        missedChars: Math.max(0, targetText.length - userInput.length),
        weakKeys,
        timeline,
        rating: calculateRating(wpm, accuracy),
      };

      if (onComplete) {
        onComplete(result);
      }
    },
    [
      correctKeystrokes,
      totalKeystrokes,
      errorKeystrokes,
      userInput.length,
      targetText.length,
      mode,
      modeLabel,
      onComplete,
    ]
  );

  // Timer runner
  useEffect(() => {
    if (!isActive || isCompleted) return;

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        // Sample timeline for WPM chart
        const mins = next / 60;
        const curWpm = mins > 0 ? Math.round(correctKeystrokes / 5 / mins) : 0;
        const curRaw = mins > 0 ? Math.round(totalKeystrokes / 5 / mins) : 0;
        timelineRef.current.push({
          second: next,
          wpm: curWpm,
          rawWpm: curRaw,
          errors: errorKeystrokes,
        });

        if (mode === 'timed' && timedDuration) {
          const remaining = timedDuration - next;
          setTimeLeft(Math.max(0, remaining));
          if (remaining <= 0) {
            finishTest(timedDuration);
            return timedDuration;
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, isCompleted, mode, timedDuration, correctKeystrokes, totalKeystrokes, errorKeystrokes, finishTest]);

  // Main KeyPress Handler
  const handleKeyInput = useCallback(
    (key: string, ctrlKey: boolean = false, altKey: boolean = false) => {
      if (isCompleted) return;

      // Start timer on first keystroke
      if (!isActive) {
        setIsActive(true);
        setStartTime(Date.now());
      }

      // Visual key feedback
      setActiveKey(key);
      setTimeout(() => setActiveKey(null), 150);

      // Handle Backspace
      if (key === 'Backspace') {
        if (userInput.length > 0) {
          if (ctrlKey || altKey) {
            // Delete word
            const lastSpaceIdx = userInput.trimEnd().lastIndexOf(' ');
            const newLength = lastSpaceIdx === -1 ? 0 : lastSpaceIdx + 1;
            setUserInput(userInput.slice(0, newLength));
          } else {
            setUserInput((prev) => prev.slice(0, -1));
          }
          if (onPlayClick) onPlayClick(true);
        }
        return;
      }

      // Handle Tab key in code mode (converts to indentation spaces)
      if (key === 'Tab') {
        let spacesToAdd = 0;
        if (targetText.slice(userInput.length, userInput.length + 4) === '    ') {
          spacesToAdd = 4;
        } else if (targetText.slice(userInput.length, userInput.length + 2) === '  ') {
          spacesToAdd = 2;
        } else if (targetText[userInput.length] === ' ') {
          spacesToAdd = 1;
        }
        if (spacesToAdd > 0) {
          const added = ' '.repeat(spacesToAdd);
          setCorrectKeystrokes((prev) => prev + spacesToAdd);
          setTotalKeystrokes((prev) => prev + spacesToAdd);
          if (onPlayClick) onPlayClick(true);
          const nextInput = userInput + added;
          setUserInput(nextInput);
          if (mode !== 'timed' && nextInput.length >= targetText.length) {
            const totalElapsed = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
            finishTest(totalElapsed);
          }
          return;
        }
      }

      // Filter out non-character keys (Enter is allowed if expected)
      if (key.length > 1 && key !== 'Enter') return;

      const currentExpectedChar = targetText[userInput.length];
      const typedChar = key === 'Enter' ? '\n' : key;

      // Check correctness
      const isCorrect = typedChar === currentExpectedChar;

      // Track key metrics
      const keyMetricKey = currentExpectedChar || typedChar;
      if (!errorMapRef.current[keyMetricKey]) {
        errorMapRef.current[keyMetricKey] = { total: 0, errors: 0 };
      }
      errorMapRef.current[keyMetricKey].total += 1;

      if (isCorrect) {
        setCorrectKeystrokes((prev) => prev + 1);
        setTotalKeystrokes((prev) => prev + 1);
        if (onPlayClick) onPlayClick(key === ' ' || key === 'Enter');
      } else {
        setErrorKeystrokes((prev) => prev + 1);
        setTotalKeystrokes((prev) => prev + 1);
        errorMapRef.current[keyMetricKey].errors += 1;
        if (onPlayError) onPlayError();

        // If strict mode is enabled, do not advance if incorrect
        if (strictMode) {
          return;
        }
      }

      const nextInput = userInput + typedChar;
      setUserInput(nextInput);

      // Check if finished (passage / code / academy mode)
      if (mode !== 'timed' && nextInput.length >= targetText.length) {
        const totalElapsed = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
        finishTest(totalElapsed);
      }
    },
    [
      isCompleted,
      isActive,
      userInput,
      targetText,
      strictMode,
      startTime,
      mode,
      onPlayClick,
      onPlayError,
      finishTest,
    ]
  );

  // Live real-time stats calculation
  const currentMinutes = Math.max(elapsedSeconds, 1) / 60;
  const liveWpm =
    isActive && elapsedSeconds > 0 ? Math.round(correctKeystrokes / 5 / currentMinutes) : 0;
  const liveCpm =
    isActive && elapsedSeconds > 0 ? Math.round(correctKeystrokes / currentMinutes) : 0;
  const liveAccuracy =
    totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  // Next expected character & finger
  const nextChar = isCompleted ? null : targetText[userInput.length] || null;

  return {
    userInput,
    isActive,
    isCompleted,
    activeKey,
    nextChar,
    currentIndex: userInput.length,
    elapsedSeconds,
    timeLeft,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    liveWpm,
    liveCpm,
    liveAccuracy,
    keyStats: errorMapRef.current,
    handleKeyInput,
    resetEngine,
  };
}
