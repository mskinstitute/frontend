'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  Code2,
  Clock,
  Type,
  FileEdit,
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  Hand,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle,
  Eye,
  BarChart3,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  Sliders,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  WrapText,
  Gauge,
  Target,
  AlertTriangle,
} from 'lucide-react';

import {
  PracticeMode,
  AcademyStage,
  CodeLanguage,
  TimedDuration,
  SoundEffectType,
  TestResult,
} from '../types';

import { ACADEMY_LESSONS } from '../data/lessons';
import { CODE_SNIPPETS } from '../data/codeSnippets';
import { getRandomWords, getRandomQuote } from '../data/wordLists';
import { tokenizeCode } from '../utils/codeHighlighter';
import { useTypingAudio } from '../hooks/useTypingAudio';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useTypingStorage } from '../hooks/useTypingStorage';
import { useGamification } from '../hooks/useGamification';
import { generateWeakKeyDrill } from '../utils/weakKeyDrill';
import { KeyHealthStat } from '../types';

import VirtualKeyboard from './VirtualKeyboard';
import FingerGuide from './FingerGuide';
import LiveStatsBar from './LiveStatsBar';
import ResultsModal from './ResultsModal';
import CustomTextModal from './CustomTextModal';
import TypeQuestSidebar from './TypeQuestSidebar';
import GamificationHUD from './GamificationHUD';
import AchievementsModal from './AchievementsModal';
import TypingCertificateModal from './TypingCertificateModal';
import ClassroomRaceArena, { RACE_CIRCUITS } from './ClassroomRaceArena';

export interface CodeLineStructure {
  lineNum: number;
  tokens: {
    char: string;
    globalIndex: number;
    color: string;
  }[];
}

export interface TextWordUnit {
  id: number;
  chars: Array<{
    char: string;
    globalIndex: number;
  }>;
  isNewline?: boolean;
}

export default function TypeQuestApp() {
  // Persistence and settings
  const {
    stats,
    preferences,
    isLoaded,
    updatePreferences,
    recordTestResult,
  } = useTypingStorage();

  // Gamification & Badges
  const {
    gamification,
    newlyUnlockedBadges,
    clearUnlockedNotice,
    processTestCompletion,
    setStudentName,
    setStudentProfile,
  } = useGamification();

  // Read URL query parameters (e.g. ?mode=race&room=MSK-600)
  const searchParams = useSearchParams();

  // Primary mode states - auto-initialized from URL params if provided
  const [mode, setMode] = useState<PracticeMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode') as PracticeMode | null;
      if (urlMode && ['academy', 'code', 'words', 'sentences', 'timed', 'custom', 'race'].includes(urlMode)) {
        return urlMode;
      }
      if (params.get('room')) {
        return 'race';
      }
    }
    return 'code';
  });
  const [stage, setStage] = useState<AcademyStage>('stage-1-anchors-fj');
  const [codeLang, setCodeLang] = useState<CodeLanguage>('python');
  const [codeLevel, setCodeLevel] = useState<number>(1);
  const [timedDuration, setTimedDuration] = useState<TimedDuration>(60);
  const [customText, setCustomText] = useState<string>('');
  const [weakDrillText, setWeakDrillText] = useState<string>('');
  const [raceCircuit, setRaceCircuit] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('circuit');
      if (c) return c;
    }
    return 'monza';
  });
  const [showRaceResultsModal, setShowRaceResultsModal] = useState<boolean>(false);
  const [isRaceTypingLocked, setIsRaceTypingLocked] = useState<boolean>(false);
  const [raceCountdown, setRaceCountdown] = useState<number | null>(null);

  // Synchronize mode and circuit when URL search parameters change
  useEffect(() => {
    const urlMode = searchParams.get('mode') as PracticeMode | null;
    const urlRoom = searchParams.get('room');
    const urlCircuit = searchParams.get('circuit');

    if (urlMode && ['academy', 'code', 'words', 'sentences', 'timed', 'custom', 'race'].includes(urlMode)) {
      setMode(urlMode);
    } else if (urlRoom) {
      setMode('race');
    }

    if (urlCircuit) {
      setRaceCircuit(urlCircuit);
    }
  }, [searchParams]);

  // Layout states: Sidebar & Focus Mode
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');

  // UI Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingBoxRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // 5-Second Countdown State before typing begins
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  const [hasCountedDown, setHasCountedDown] = useState<boolean>(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Engine
  const { playClick, playError, playCompleteChime, playCountdownBeep } = useTypingAudio(
    preferences.soundType,
    preferences.soundVolume
  );

  // Automatically close left sidebar on small screens on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Filter snippets for current language
  const currentLangSnippets = useMemo(() => {
    return CODE_SNIPPETS.filter((s) => s.language === codeLang);
  }, [codeLang]);

  // Current active snippet based on selected level
  const activeSnippet = useMemo(() => {
    const found = currentLangSnippets.find((s) => s.levelNumber === codeLevel);
    return found || currentLangSnippets[0] || CODE_SNIPPETS[0];
  }, [currentLangSnippets, codeLevel]);

  // Compute active target text based on mode and selections
  const { targetText, modeLabel } = useMemo(() => {
    if (mode === 'academy') {
      const lesson = ACADEMY_LESSONS.find((l) => l.id === stage) || ACADEMY_LESSONS[0];
      return { targetText: lesson.text, modeLabel: `Academy: ${lesson.title}` };
    }
    if (mode === 'code') {
      return {
        targetText: activeSnippet.code,
        modeLabel: `${codeLang.toUpperCase()} L${codeLevel}: ${activeSnippet.title.replace(/^Level \d+:\s*/, '')}`,
      };
    }
    if (mode === 'race') {
      const activeCirc = RACE_CIRCUITS.find((c) => c.id === raceCircuit) || RACE_CIRCUITS[0];
      return {
        targetText: activeCirc.text,
        modeLabel: `Grand Prix: ${activeCirc.name}`,
      };
    }
    if (mode === 'weak-keys') {
      return {
        targetText:
          weakDrillText || 'practice target keys with focused repetitive drills and bigram patterns',
        modeLabel: 'Weak-Key Targeted Drill',
      };
    }
    if (mode === 'words') {
      return { targetText: getRandomWords(35), modeLabel: 'Top Common Words' };
    }
    if (mode === 'sentences') {
      return { targetText: getRandomQuote(), modeLabel: 'Inspirational Passage' };
    }
    if (mode === 'timed') {
      return { targetText: getRandomWords(90), modeLabel: `${timedDuration}s Speed Challenge` };
    }
    if (mode === 'custom') {
      return {
        targetText: customText || 'Type your custom practice text here by opening the Custom Editor modal.',
        modeLabel: 'Custom Text Practice',
      };
    }
    return { targetText: ACADEMY_LESSONS[0].text, modeLabel: 'Touch Typing Practice' };
  }, [mode, stage, activeSnippet, codeLang, codeLevel, timedDuration, customText, weakDrillText, raceCircuit]);

  // Structured row-by-row lines for Code Mode
  const structuredCodeLines = useMemo<CodeLineStructure[]>(() => {
    if (mode !== 'code') return [];

    const tokens = tokenizeCode(targetText, codeLang);
    const lines: CodeLineStructure[] = [];
    let currentLineTokens: CodeLineStructure['tokens'] = [];
    let lineNum = 1;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.char === '\n') {
        currentLineTokens.push({
          char: '\n',
          globalIndex: i,
          color: '#475569',
        });
        lines.push({
          lineNum,
          tokens: currentLineTokens,
        });
        currentLineTokens = [];
        lineNum++;
      } else {
        currentLineTokens.push({
          char: token.char,
          globalIndex: i,
          color: token.color,
        });
      }
    }

    if (currentLineTokens.length > 0) {
      lines.push({
        lineNum,
        tokens: currentLineTokens,
      });
    }

    return lines;
  }, [mode, targetText, codeLang]);

  // Structured word-level units for Text Modes (ensures character wrap is OFF and word wrap is ON)
  const structuredWords = useMemo<TextWordUnit[]>(() => {
    if (mode === 'code') return [];

    const units: TextWordUnit[] = [];
    let currentChars: Array<{ char: string; globalIndex: number }> = [];
    let id = 0;

    for (let i = 0; i < targetText.length; i++) {
      const char = targetText[i];

      if (char === '\n') {
        if (currentChars.length > 0) {
          units.push({ id: id++, chars: currentChars });
          currentChars = [];
        }
        units.push({
          id: id++,
          chars: [{ char: '\n', globalIndex: i }],
          isNewline: true,
        });
      } else if (char === ' ') {
        // Space is attached to current word so the word and space move as one atomic unit without splitting
        currentChars.push({ char, globalIndex: i });
        units.push({ id: id++, chars: currentChars });
        currentChars = [];
      } else {
        currentChars.push({ char, globalIndex: i });
      }
    }

    if (currentChars.length > 0) {
      units.push({ id: id++, chars: currentChars });
    }

    return units;
  }, [mode, targetText]);

  // Word wrap resolution: Code mode defaults to false (enabling horizontal auto-scroll), other modes default to true
  const isWordWrap =
    mode === 'code'
      ? (preferences.codeWordWrap ?? false)
      : (preferences.wordWrap ?? true);

  // Reset countdown state
  const resetCountdownState = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdownTimer(null);
    setHasCountedDown(false);
  }, []);

  // Test complete callback
  const handleTestComplete = useCallback(
    (result: TestResult) => {
      playCompleteChime();
      setLastResult(result);

      let nextLessonId: string | undefined = undefined;
      if (mode === 'academy') {
        const currentIndex = ACADEMY_LESSONS.findIndex((l) => l.id === stage);
        if (currentIndex !== -1 && currentIndex < ACADEMY_LESSONS.length - 1) {
          nextLessonId = ACADEMY_LESSONS[currentIndex + 1].id;
        }
      }

      recordTestResult(result, nextLessonId);
      processTestCompletion(result, stats);
      resetCountdownState();
    },
    [playCompleteChime, mode, stage, recordTestResult, processTestCompletion, stats, resetCountdownState]
  );

  // Practice Weak Keys callback
  const handlePracticeWeakKeys = useCallback(
    (weakKeys: { key: string }[]) => {
      const generatedDrill = generateWeakKeyDrill(weakKeys);
      setWeakDrillText(generatedDrill.text);
      setMode('weak-keys');
      setLastResult(null);
    },
    []
  );

  // Initialize Typing Engine
  const {
    userInput,
    isActive,
    isCompleted,
    activeKey,
    nextChar,
    currentIndex,
    elapsedSeconds,
    timeLeft,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    liveWpm,
    liveAccuracy,
    keyStats,
    handleKeyInput,
    resetEngine,
  } = useTypingEngine({
    targetText,
    mode,
    modeLabel,
    timedDuration,
    strictMode: preferences.strictMode,
    onPlayClick: (isSpecial) => playClick(isSpecial),
    onPlayError: () => playError(),
    onComplete: handleTestComplete,
  });

  // Check if any modal is currently active
  const isAnyModalOpen =
    isCertificateOpen ||
    isCustomModalOpen ||
    isAchievementsOpen ||
    (!!lastResult && (mode !== 'race' || showRaceResultsModal));

  // Re-focus hidden input on container click (only when no modal is open)
  const focusInput = useCallback((e?: React.MouseEvent) => {
    if (isAnyModalOpen) {
      return;
    }
    if (e && e.target instanceof HTMLElement) {
      if (e.target.closest('input, textarea, button, select, [role="dialog"], a, .modal-interactive')) {
        return;
      }
    }
    inputRef.current?.focus();
    setIsFocused(true);
  }, [isAnyModalOpen]);

  // Blur and disable hidden input whenever any modal opens
  useEffect(() => {
    if (isAnyModalOpen) {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  }, [isAnyModalOpen]);

  // Cleanup countdown interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Request fullscreen if not already fullscreen
  const enterFullscreenIfNeeded = useCallback((e?: React.MouseEvent | MouseEvent) => {
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) return;

    if (e && e.target instanceof HTMLElement) {
      if (e.target.closest('a[href], [data-no-fullscreen]')) {
        return;
      }
    }

    const el = containerRef.current;
    if (!el) return;

    try {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).mozRequestFullScreen) {
        (el as any).mozRequestFullScreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    } catch {
      // Ignore fullscreen permission errors
    }
  }, []);

  // Start 5-second countdown timer before unlocking typing input
  const startFiveSecondCountdown = useCallback(() => {
    if (hasCountedDown || countdownTimer !== null) return;

    // Auto-turn on Focus Mode
    setIsFocusMode(true);

    // Initial tick at 5
    setCountdownTimer(5);
    playCountdownBeep(false);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    let remaining = 5;
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdownTimer(remaining);
        playCountdownBeep(false);
      } else if (remaining === 0) {
        setCountdownTimer(0);
        playCountdownBeep(true); // Fanfare GO! sound
      } else {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCountdownTimer(null);
        setHasCountedDown(true);
        inputRef.current?.focus();
        setIsFocused(true);
      }
    }, 1000);
  }, [hasCountedDown, countdownTimer, playCountdownBeep]);

  // Handle click on typing display box / input area
  const handleTypingBoxClick = useCallback(
    (e?: React.MouseEvent) => {
      // 1. Enter fullscreen if needed
      enterFullscreenIfNeeded(e);

      // 2. Activate Focus Mode
      setIsFocusMode(true);

      // 3. Handle Race Mode vs Standard Modes
      if (mode === 'race') {
        if (!isAnyModalOpen && !isRaceTypingLocked) {
          inputRef.current?.focus();
          setIsFocused(true);
        }
        return;
      }

      // 4. Standard Modes: trigger 5-second countdown if not already completed
      if (!hasCountedDown) {
        if (countdownTimer === null) {
          startFiveSecondCountdown();
        }
      } else {
        if (!isAnyModalOpen) {
          inputRef.current?.focus();
          setIsFocused(true);
        }
      }
    },
    [
      enterFullscreenIfNeeded,
      mode,
      isAnyModalOpen,
      isRaceTypingLocked,
      hasCountedDown,
      countdownTimer,
      startFiveSecondCountdown,
    ]
  );

  // Reset when text changes
  useEffect(() => {
    resetEngine();
    resetCountdownState();
    if (!isAnyModalOpen) {
      focusInput();
    }
    if (typingBoxRef.current) {
      typingBoxRef.current.scrollTop = 0;
      typingBoxRef.current.scrollLeft = 0;
    }
  }, [targetText, resetEngine, resetCountdownState, isAnyModalOpen, focusInput]);

  // Auto-scroll: Keeps active character vertically centered AND auto-scrolls horizontally (left/right) in coding or when word wrap is off
  useEffect(() => {
    if (!activeCharRef.current || !typingBoxRef.current) return;

    const container = typingBoxRef.current;
    const activeEl = activeCharRef.current;

    // Use getBoundingClientRect for accurate relative positioning across sticky gutters and word units
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    // 1. Vertical Auto-Scroll (Centers active character vertically)
    const relativeTop = activeRect.top - containerRect.top;
    const currentScrollTop = container.scrollTop;
    const activeAbsoluteTop = currentScrollTop + relativeTop;
    const targetScrollTop = activeAbsoluteTop - container.clientHeight / 2 + activeRect.height / 2;

    // 2. Horizontal Auto-Scroll (Smoothly follows typing left/right in code or when word wrap is off)
    let targetScrollLeft = container.scrollLeft;

    if (!isWordWrap) {
      const currentScrollLeft = container.scrollLeft;
      const relativeLeft = activeRect.left - containerRect.left;
      const relativeRight = activeRect.right - containerRect.left;
      const activeAbsoluteLeft = currentScrollLeft + relativeLeft;

      // Gutter offset in code mode (line number column is sticky on the left, ~56px)
      const gutterOffset = mode === 'code' ? 56 : 24;
      // Lookahead buffer to make upcoming characters clearly visible
      const rightLookahead = 140;

      // Check if cursor is at the start of a line (e.g. after pressing Enter or moving to a new line)
      if (activeAbsoluteLeft < gutterOffset + 80) {
        targetScrollLeft = 0;
      } else if (relativeRight > container.clientWidth - rightLookahead) {
        // Active char is nearing the right edge -> scroll right smoothly
        const excess = relativeRight - (container.clientWidth - rightLookahead);
        targetScrollLeft = currentScrollLeft + excess;
      } else if (relativeLeft < gutterOffset + 32) {
        // Active char is near or behind the sticky gutter -> scroll left smoothly
        const shortfall = (gutterOffset + 32) - relativeLeft;
        targetScrollLeft = Math.max(0, currentScrollLeft - shortfall);
      }
    } else {
      // In word wrap mode, keep horizontal scroll at 0
      targetScrollLeft = 0;
    }

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });
  }, [currentIndex, isWordWrap, mode]);

  // Global keyboard shortcuts
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isAnyModalOpen) {
      return;
    }

    // In Classroom Race mode, strictly lock keystrokes before countdown reaches GO!
    if (mode === 'race' && isRaceTypingLocked) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape') {
      if (isFocusMode) {
        setIsFocusMode(false);
        return;
      }
      resetEngine();
      resetCountdownState();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (mode === 'code') {
        if (!hasCountedDown || countdownTimer !== null) return;
        handleKeyInput('Tab', e.ctrlKey, e.altKey);
      } else {
        resetEngine();
        resetCountdownState();
      }
      return;
    }

    // Standard Modes: 5-second countdown check before typing is allowed
    if (mode !== 'race') {
      // If countdown hasn't run yet, first keystroke triggers countdown & focus mode
      if (!hasCountedDown && countdownTimer === null) {
        e.preventDefault();
        enterFullscreenIfNeeded();
        setIsFocusMode(true);
        startFiveSecondCountdown();
        return;
      }

      // If currently counting down, block all keystrokes
      if (countdownTimer !== null) {
        e.preventDefault();
        return;
      }
    }

    // Ensure Focus Mode is on when typing
    if (!isFocusMode) {
      setIsFocusMode(true);
    }

    handleKeyInput(e.key, e.ctrlKey, e.altKey);
  };

  // Synchronize fullscreen state with browser events and lock Escape key in fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);

      if (isFs) {
        if (typeof navigator !== 'undefined' && 'keyboard' in navigator && (navigator as any).keyboard?.lock) {
          (navigator as any).keyboard.lock(['Escape']).catch(() => {});
        }
      } else {
        if (typeof navigator !== 'undefined' && 'keyboard' in navigator && (navigator as any).keyboard?.unlock) {
          (navigator as any).keyboard.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      if (typeof navigator !== 'undefined' && 'keyboard' in navigator && (navigator as any).keyboard?.unlock) {
        (navigator as any).keyboard.unlock();
      }
    };
  }, []);

  // Global priority ESC key handler: First closes open modals, then exits focus mode, then exits full screen
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Priority 1: Results Modal
        if (lastResult) {
          e.preventDefault();
          e.stopPropagation();
          setLastResult(null);
          return;
        }

        // Priority 2: Certificate Modal
        if (isCertificateOpen) {
          e.preventDefault();
          e.stopPropagation();
          setIsCertificateOpen(false);
          return;
        }

        // Priority 3: Achievements Modal
        if (isAchievementsOpen) {
          e.preventDefault();
          e.stopPropagation();
          setIsAchievementsOpen(false);
          return;
        }

        // Priority 4: Custom Text Modal
        if (isCustomModalOpen) {
          e.preventDefault();
          e.stopPropagation();
          setIsCustomModalOpen(false);
          return;
        }

        // Priority 5: Focus Mode
        if (isFocusMode) {
          e.preventDefault();
          e.stopPropagation();
          setIsFocusMode(false);
          return;
        }

        // Priority 6: If in Fullscreen and NO modal is open, exit fullscreen
        if (document.fullscreenElement) {
          e.preventDefault();
          e.stopPropagation();
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [lastResult, isCertificateOpen, isAchievementsOpen, isCustomModalOpen, isFocusMode]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Advance to next lesson/level
  const handleNextItem = () => {
    resetCountdownState();
    if (mode === 'academy') {
      const idx = ACADEMY_LESSONS.findIndex((l) => l.id === stage);
      if (idx < ACADEMY_LESSONS.length - 1) {
        setStage(ACADEMY_LESSONS[idx + 1].id);
        setLastResult(null);
        resetEngine();
      }
    } else if (mode === 'code') {
      if (codeLevel < 6) {
        setCodeLevel(codeLevel + 1);
        setLastResult(null);
        resetEngine();
      }
    }
  };

  const progressPercent = Math.round((currentIndex / Math.max(targetText.length, 1)) * 100);

  // Dynamic font sizing classes
  const fontClass =
    fontSize === 'xl'
      ? 'text-xl sm:text-2xl md:text-3xl leading-loose'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl md:text-2xl leading-relaxed'
      : 'text-base sm:text-lg md:text-xl leading-normal';

  // Character renderer for standard text mode with full state styling
  const renderChar = (char: string, index: number) => {
    const isTyped = index < userInput.length;
    const isCurrent = index === userInput.length;
    const userChar = userInput[index];
    const isCorrect = isTyped && userChar === char;
    const isIncorrect = isTyped && userChar !== char;

    let charColor = 'text-slate-500';
    let bgColor = 'transparent';

    if (isCorrect) {
      charColor = 'text-emerald-400 font-semibold';
    } else if (isIncorrect) {
      charColor = 'text-rose-400 underline decoration-rose-500 decoration-2 font-bold';
      bgColor = 'bg-rose-500/20';
    } else if (isCurrent) {
      charColor = 'text-white font-extrabold';
    }

    return (
      <span
        key={index}
        ref={isCurrent ? activeCharRef : undefined}
        className={`relative inline-block rounded transition-colors ${charColor}`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Visual Blinking Cursor Caret */}
        {isCurrent && (
          <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 sm:w-1 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#ff6b00]" />
        )}
        {char === ' ' ? (
          <span className={isIncorrect ? 'underline decoration-rose-500' : ''}>&nbsp;</span>
        ) : char === '\n' ? (
          '↵\n'
        ) : (
          char
        )}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      id="typequest-fullscreen-container"
      onClickCapture={(e) => {
        enterFullscreenIfNeeded(e);
      }}
      onClick={(e) => {
        if (!isAnyModalOpen) {
          focusInput(e);
        }
      }}
      className={`relative w-full bg-slate-950 text-slate-100 flex flex-col rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden select-none transition-all duration-300 typequest-container no-scrollbar ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'min-h-[720px]'
      }`}
    >
      {/* Gamification Top Banner HUD */}
      {!isFocusMode && (
        <GamificationHUD
          gamification={gamification}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />
      )}

      {/* Main Workspace Row */}
      <div className="flex-1 flex overflow-hidden">
        {/* Hidden input to capture physical keyboard & mobile inputs */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none -top-96"
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (!isAnyModalOpen) {
              setIsFocused(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          disabled={isAnyModalOpen}
          autoFocus={!isAnyModalOpen}
        />

        {/* Collapsible Left Sidebar (Preserved in Focus Mode) */}
        <TypeQuestSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          mode={mode}
          onSelectMode={(m) => {
            setMode(m);
            resetEngine();
            resetCountdownState();
          }}
          stage={stage}
          onSelectStage={(s) => {
            setStage(s);
            resetEngine();
            resetCountdownState();
          }}
          codeLang={codeLang}
          onSelectCodeLang={(l) => {
            setCodeLang(l);
            setCodeLevel(1);
            resetEngine();
            resetCountdownState();
          }}
          codeLevel={codeLevel}
          onSelectCodeLevel={(lvl) => {
            setCodeLevel(lvl);
            resetEngine();
            resetCountdownState();
          }}
          timedDuration={timedDuration}
          onSelectTimedDuration={(dur) => {
            setTimedDuration(dur);
            resetEngine();
            resetCountdownState();
          }}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          stats={stats}
          soundType={preferences.soundType}
          onUpdateSoundType={(type) => updatePreferences({ soundType: type })}
          soundVolume={preferences.soundVolume}
          onUpdateSoundVolume={(vol) => updatePreferences({ soundVolume: vol })}
          strictMode={preferences.strictMode}
          onToggleStrictMode={() => updatePreferences({ strictMode: !preferences.strictMode })}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />

        {/* Main Center Typing Workspace */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 md:p-6 min-w-0 transition-all duration-300 overflow-y-auto no-scrollbar">
        {/* Workspace Top Navigation Bar */}
        {!isFocusMode ? (
          <div className="flex flex-col gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between gap-2">
              {/* Left Group: Sidebar Toggle & Active Level Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Sidebar Open/Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSidebarOpen(!isSidebarOpen);
                  }}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                    isSidebarOpen
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-secondary/15 border-secondary/40 text-secondary font-bold hover:bg-secondary/25 shadow-sm'
                  }`}
                  title={isSidebarOpen ? 'Hide Sidebar (Focus View)' : 'Open Curriculum & Menu'}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <>
                      <PanelLeftOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Menu</span>
                    </>
                  )}
                </button>

                {/* Active Mode / Level Badge */}
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {modeLabel}
                  </span>
                  {mode === 'code' && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase hidden sm:inline-block ${
                        activeSnippet.difficulty === 'Beginner'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : activeSnippet.difficulty === 'Intermediate'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {activeSnippet.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Group: Action Controls (Responsive Icons for Mobile) */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                {/* Font Size Selector */}
                <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                  {(['normal', 'large', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFontSize(sz);
                      }}
                      className={`px-2 py-1 rounded-md transition-colors cursor-pointer capitalize ${
                        fontSize === sz ? 'bg-secondary text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>

                {/* Focus Mode (Zen Mode) Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFocusMode(true);
                    focusInput();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-secondary/15 border border-secondary/30 hover:bg-secondary/25 text-xs font-mono text-secondary flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  title="Activate Full Focus Mode"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-bold hidden md:inline">Focus Mode</span>
                </button>

                {/* Sound Style Selector */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const types: SoundEffectType[] = ['mechanical', 'typewriter', 'bubble', 'off'];
                    const next = types[(types.indexOf(preferences.soundType) + 1) % types.length];
                    updatePreferences({ soundType: next });
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title={`Audio Theme: ${preferences.soundType}`}
                >
                  {preferences.soundType === 'off' ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>

                {/* Word Wrap Toggle (Toggle wrapping vs continuous horizontal auto-scroll) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode === 'code') {
                      updatePreferences({ codeWordWrap: !isWordWrap });
                    } else {
                      updatePreferences({ wordWrap: !isWordWrap });
                    }
                  }}
                  className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                    isWordWrap
                      ? 'bg-secondary/15 border-secondary/30 text-secondary'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={
                    isWordWrap
                      ? 'Word Wrap: ON (Click to disable & enable horizontal auto-scroll)'
                      : 'Word Wrap: OFF (Click to enable word wrap)'
                  }
                  aria-label="Toggle Word Wrap"
                >
                  <WrapText className="w-4 h-4" />
                </button>

                {/* Keyboard & Finger Guide Toggles - Only in Academy Mode */}
                {mode === 'academy' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePreferences({ showKeyboard: !preferences.showKeyboard });
                      }}
                      className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                        preferences.showKeyboard
                          ? 'bg-secondary/15 border-secondary/30 text-secondary'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle On-Screen Keyboard"
                    >
                      <KeyboardIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePreferences({ showHands: !preferences.showHands });
                      }}
                      className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                        preferences.showHands
                          ? 'bg-secondary/15 border-secondary/30 text-secondary'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle Finger Hands Guide"
                    >
                      <Hand className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Reset Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetEngine();
                    resetCountdownState();
                    focusInput();
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset Lesson (Esc)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  data-no-fullscreen="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Language & Level Quick Switcher */}
            {mode === 'code' && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                  {(['python', 'javascript', 'html', 'css', 'cpp', 'sql'] as CodeLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCodeLang(lang);
                        setCodeLevel(1);
                        resetEngine();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                        codeLang === lang
                          ? 'bg-secondary text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                  <div className="w-px h-5 bg-slate-800 mx-1" />
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCodeLevel(lvl);
                        resetEngine();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        codeLevel === lvl
                          ? 'bg-secondary text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      L{lvl}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 font-mono truncate hidden md:inline">
                  {codeLang.toUpperCase()}: {activeSnippet.description}
                </div>
              </div>
            )}

            {/* Center Sleek Live Telemetry Line (Full Stats Cards positioned in Right Sidebar) */}
            <div className="w-full bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">
                  {mode === 'timed' && timeLeft !== undefined
                    ? `${timeLeft}s`
                    : `${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-secondary font-bold">{liveWpm} WPM</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-bold">{liveAccuracy}%</span>
                {errorKeystrokes > 0 && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-rose-400 font-bold">{errorKeystrokes} errors</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-amber-400 transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono w-9 text-right font-bold">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Focus Mode Top Minimalist Bar with Live Statistics */
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-900 animate-in fade-in duration-200 gap-3 flex-wrap sm:flex-nowrap">
            {/* Left: Sidebar Toggle, Focus Badge & Mode Label */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                  isSidebarOpen
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    : 'bg-secondary/15 border-secondary/40 text-secondary font-bold hover:bg-secondary/25 shadow-sm'
                }`}
                title={isSidebarOpen ? 'Hide Curriculum Sidebar' : 'Open Curriculum & Menu'}
              >
                {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              </button>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest truncate">
                Focus Mode
              </span>
              <span className="text-xs text-slate-400 font-mono hidden md:inline truncate">
                • {modeLabel}
              </span>
            </div>

            {/* Center: Live Real-Time Telemetry Badges */}
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs order-3 sm:order-2 w-full sm:w-auto justify-center sm:justify-start">
              {/* Timer */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-blue-400 font-bold shadow-sm"
                title={mode === 'timed' ? 'Time Left' : 'Time Elapsed'}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {mode === 'timed' && timeLeft !== undefined
                    ? `${timeLeft}s`
                    : `${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`}
                </span>
              </div>

              {/* Speed / WPM */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-secondary font-bold shadow-sm"
                title="Typing Speed (WPM)"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{liveWpm}</span>
                <span className="text-[10px] text-slate-400 font-normal">WPM</span>
              </div>

              {/* Accuracy */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-emerald-400 font-bold shadow-sm"
                title="Keystroke Accuracy"
              >
                <Target className="w-3.5 h-3.5" />
                <span>{liveAccuracy}%</span>
              </div>

              {/* Mistakes / Errors */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold shadow-sm transition-colors ${
                  errorKeystrokes > 0
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400'
                }`}
                title="Mistakes Count"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorKeystrokes}</span>
                <span className="text-[10px] hidden lg:inline font-normal">err</span>
              </div>
            </div>

            {/* Right: Progress & Exit Focus */}
            <div className="flex items-center gap-3 shrink-0 order-2 sm:order-3 ml-auto sm:ml-0">
              <div className="hidden lg:flex items-center gap-2 w-28">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-amber-400 transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono w-8 text-right font-bold">
                  {progressPercent}%
                </span>
              </div>

              {/* Fullscreen Toggle in Focus Mode */}
              <button
                data-no-fullscreen="true"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shadow-sm"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusMode(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm active:scale-95"
                title="Exit Focus Mode (Esc)"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Focus</span>
                <span className="sm:hidden">Exit</span>
                <kbd className="hidden md:inline px-1 py-0.2 bg-slate-800 rounded text-[10px] text-slate-400">Esc</kbd>
              </button>
            </div>
          </div>
        )}

        {/* Main Typing Arena Container */}
        <div className="my-auto py-4 flex flex-col justify-center">
          {/* Classroom Battle Track Arena if in Race Mode */}
          {mode === 'race' && (
            <ClassroomRaceArena
              userProgress={progressPercent}
              userWpm={liveWpm}
              userAccuracy={liveAccuracy}
              errorCount={errorKeystrokes}
              correctKeystrokes={correctKeystrokes}
              studentName={gamification.studentName || 'Student'}
              onUpdateStudentName={setStudentName}
              onLockTypingChange={(locked, countdown) => {
                setIsRaceTypingLocked(locked);
                setRaceCountdown(countdown);
              }}
              isActive={isActive}
              isCompleted={isCompleted}
              currentCircuitId={raceCircuit}
              isFullscreen={isFullscreen}
              initialRoomCode={searchParams.get('room') || undefined}
              onSelectCircuit={(circuitId) => {
                setRaceCircuit(circuitId);
                resetEngine();
                focusInput();
              }}
              onRematch={() => {
                resetEngine();
                focusInput();
              }}
              onOpenDetailedStats={() => {
                setShowRaceResultsModal(true);
              }}
              onRefocus={focusInput}
            />
          )}

          {/* Typing Display Box Container - Overlay is strictly scoped to this input box */}
          <div
            onClick={(e) => {
              handleTypingBoxClick(e);
            }}
            className="relative rounded-2xl cursor-pointer"
          >
            {/* Locked overlay when in race mode before race starts */}
            {mode === 'race' && isRaceTypingLocked && (
              <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none border border-amber-500/40 shadow-2xl animate-in fade-in duration-200">
                {raceCountdown !== null && raceCountdown > 0 ? (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-4xl font-black text-slate-950 shadow-2xl animate-bounce">
                      {raceCountdown}
                    </div>
                    <div className="text-base font-bold text-white tracking-wide mt-1">
                      Get Ready to Race! 🏎️
                    </div>
                    <div className="text-xs font-mono text-amber-300">
                      Typing will unlock automatically when countdown hits GO!
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 max-w-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      Waiting for all racers to click Start / Ready
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      Click the <strong className="text-emerald-400">&quot;START / I&apos;M READY&quot;</strong> button on the track above. Once all racers in the room are ready, the 5-second countdown will begin!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Standard Mode 5-Second Animated Countdown Overlay */}
            {countdownTimer !== null && mode !== 'race' && (
              <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-[4px] rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none border border-secondary/50 shadow-2xl animate-in fade-in duration-200">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      countdownTimer === 0
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 scale-110 shadow-[0_0_40px_rgba(16,185,129,0.8)]'
                        : 'bg-gradient-to-br from-secondary to-amber-500 text-slate-950 border-amber-300 animate-pulse shadow-[0_0_35px_rgba(255,107,0,0.6)]'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl font-black font-mono">
                      {countdownTimer === 0 ? 'GO!' : countdownTimer}
                    </span>
                  </div>

                  <div className="text-lg sm:text-xl font-black text-white tracking-wide mt-1 flex items-center gap-2">
                    {countdownTimer === 0 ? (
                      <>
                        <span className="text-emerald-400">Start Typing Now!</span> 🚀
                      </>
                    ) : (
                      <>
                        <span>Get Ready on Home Row</span> ⌨️
                      </>
                    )}
                  </div>

                  <div className="text-xs font-mono text-slate-300 max-w-xs leading-relaxed">
                    {countdownTimer === 0 ? (
                      <span className="text-emerald-300 font-bold">Input unlocked! Show your best speed!</span>
                    ) : (
                      <span>Focus mode activated • Typing unlocks in <strong className="text-secondary font-bold">{countdownTimer}s</strong></span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pre-Start / Focus Overlay (Before Countdown Runs) */}
            {!hasCountedDown && countdownTimer === null && mode !== 'race' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypingBoxClick(e);
                }}
                className="absolute inset-0 z-20 bg-slate-950/75 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-secondary/40 hover:border-secondary transition-all group"
              >
                <div className="bg-slate-900/95 px-6 py-3.5 rounded-2xl border border-secondary/50 shadow-2xl flex items-center gap-3 text-sm text-secondary font-semibold group-hover:scale-105 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <KeyboardIcon className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-bold text-sm">Click here to start typing</span>
                    <span className="text-xs text-secondary/90 font-mono">Auto Fullscreen • Focus Mode • 5s Countdown</span>
                  </div>
                </div>
              </div>
            )}

            {/* Click to Refocus Overlay (Only after countdown has completed, if user clicks outside) */}
            {hasCountedDown && !isFocused && !isRaceTypingLocked && mode !== 'race' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput(e);
                }}
                className="absolute inset-0 z-20 bg-slate-950/75 backdrop-blur-[2px] rounded-2xl flex items-center justify-center cursor-pointer border border-secondary/40 transition-opacity"
              >
                <div className="bg-slate-900/95 px-5 py-2.5 rounded-xl border border-secondary/40 shadow-2xl flex items-center gap-2 text-sm text-secondary font-semibold animate-pulse">
                  <KeyboardIcon className="w-4 h-4" /> Click anywhere to focus and type
                </div>
              </div>
            )}

            {/* Typing Display Box with hidden scrollbars and smooth auto-scrolling */}
            <div
              ref={typingBoxRef}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className={`relative bg-slate-900/95 rounded-2xl border ${
              isFocused ? 'border-slate-700 shadow-2xl' : 'border-slate-800'
            } font-mono overflow-x-auto overflow-y-auto select-none transition-all duration-200 no-scrollbar [&::-webkit-scrollbar]:hidden ${
              isFocusMode
                ? 'p-6 sm:p-10 min-h-[480px] sm:min-h-[560px] max-h-[600px]'
                : mode === 'academy'
                ? 'p-4 sm:p-6 max-h-[380px] min-h-[260px]'
                : 'p-5 sm:p-7 max-h-[520px] min-h-[360px]'
            }`}
          >
            {/* CODE MODE: Row-by-Row Line Formatting with Line Numbers */}
            {mode === 'code' ? (
              <div className={`flex flex-col gap-1 font-mono ${isWordWrap ? 'w-full' : 'min-w-fit'}`}>
                {structuredCodeLines.map((line) => {
                  const isLineActive = line.tokens.some((t) => t.globalIndex === currentIndex);

                  return (
                    <div
                      key={line.lineNum}
                      className={`flex items-start rounded-lg transition-colors duration-100 ${
                        isWordWrap ? 'w-full' : 'min-w-fit'
                      } ${isLineActive ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'}`}
                    >
                      {/* Sticky Line Number Gutter */}
                      <div className="sticky left-0 z-10 bg-slate-900/95 w-8 sm:w-10 flex-shrink-0 text-right pr-3 sm:pr-4 select-none text-slate-600 font-mono text-xs sm:text-sm pt-0.5 border-r border-slate-800/70 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.5)]">
                        {line.lineNum}
                      </div>

                      {/* Formatted Code Tokens */}
                      <div
                        className={`flex-1 pl-3 sm:pl-4 font-mono tracking-wider ${fontClass} ${
                          isWordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                        }`}
                      >
                        {line.tokens.map((token) => {
                          const isTyped = token.globalIndex < userInput.length;
                          const isCurrent = token.globalIndex === currentIndex;
                          const userChar = userInput[token.globalIndex];
                          const isCorrect = isTyped && userChar === token.char;
                          const isIncorrect = isTyped && userChar !== token.char;

                          let textColor = token.color;
                          let bgColor = 'transparent';
                          let opacity = 'opacity-75';

                          if (isCorrect) {
                            textColor = '#4ade80'; // Bright Emerald Green
                            opacity = 'opacity-100 font-bold';
                          } else if (isIncorrect) {
                            textColor = '#f87171'; // Rose Red
                            bgColor = 'rgba(239, 68, 68, 0.3)';
                            opacity = 'opacity-100 underline decoration-rose-500 font-bold';
                          } else if (isCurrent) {
                            textColor = '#ffffff';
                            opacity = 'opacity-100 font-extrabold';
                          }

                          return (
                            <span
                              key={token.globalIndex}
                              ref={isCurrent ? activeCharRef : undefined}
                              className={`relative inline-block transition-colors ${opacity}`}
                              style={{ color: textColor, backgroundColor: bgColor }}
                            >
                              {/* Visual Blinking Cursor Caret */}
                              {isCurrent && (
                                <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 sm:w-1 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#ff6b00]" />
                              )}

                              {token.char === ' ' ? (
                                <span className="text-slate-700">&nbsp;</span>
                              ) : token.char === '\n' ? (
                                <span className="text-slate-600 text-xs inline-block font-sans select-none opacity-50">
                                  ↵
                                </span>
                              ) : (
                                token.char
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* STANDARD TEXT / WORDS / PASSAGES STREAM - Character Wrap OFF, Word Wrap ON */
              <div
                className={`tracking-wider ${fontClass} ${
                  isWordWrap ? 'break-normal' : 'whitespace-pre min-w-fit'
                }`}
              >
                {structuredWords.map((unit) => {
                  if (unit.isNewline) {
                    return (
                      <span key={unit.id} className="block w-full h-0 basis-full">
                        {renderChar('\n', unit.chars[0].globalIndex)}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={unit.id}
                      className={`inline-block ${isWordWrap ? 'whitespace-nowrap' : 'whitespace-pre'}`}
                    >
                      {unit.chars.map(({ char, globalIndex }) => renderChar(char, globalIndex))}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Bottom Auxiliary Guides (Keyboard & Hands) - Shown ONLY in Academy Mode */}
        {!isFocusMode && mode === 'academy' && (
          <div className="flex flex-col gap-2.5 pt-2 animate-in fade-in duration-200">
            {preferences.showHands && <FingerGuide nextChar={nextChar} />}

            {preferences.showKeyboard && (
              <VirtualKeyboard activeKey={activeKey} nextChar={nextChar} keyStats={keyStats} />
            )}
          </div>
        )}

        {/* Bottom Status Row */}
        {!isFocusMode && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900 mt-auto">
            <div className="flex items-center gap-3">
              <span>
                Best: <strong className="text-secondary font-mono">{stats.bestWpm} WPM</strong>
              </span>
              <span>
                Avg Acc: <strong className="text-emerald-400 font-mono">{stats.averageAccuracy}%</strong>
              </span>
              <span>
                Tests: <strong className="text-slate-300 font-mono">{stats.totalTests}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <span><kbd className="px-1 py-0.2 bg-slate-900 border border-slate-800 rounded">Tab</kbd> indent/restart</span>
              <span>•</span>
              <span><kbd className="px-1 py-0.2 bg-slate-900 border border-slate-800 rounded">Esc</kbd> reset</span>
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Results Modal */}
      {lastResult && (mode !== 'race' || showRaceResultsModal) && (
        <ResultsModal
          result={lastResult}
          hasNextLesson={
            mode === 'academy'
              ? ACADEMY_LESSONS.findIndex((l) => l.id === stage) < ACADEMY_LESSONS.length - 1
              : mode === 'code'
              ? codeLevel < 6
              : false
          }
          onRetry={() => {
            setLastResult(null);
            setShowRaceResultsModal(false);
            resetEngine();
            resetCountdownState();
            focusInput();
          }}
          onNextLesson={() => {
            setShowRaceResultsModal(false);
            resetCountdownState();
            handleNextItem();
          }}
          onClose={() => {
            setLastResult(null);
            setShowRaceResultsModal(false);
            resetCountdownState();
          }}
          onPracticeWeakKeys={handlePracticeWeakKeys}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />
      )}

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedBadgeIds={gamification.unlockedBadgeIds}
      />

      {/* Official Printable Certificate Modal */}
      <TypingCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        result={lastResult}
        gamification={gamification}
        bestWpm={stats.bestWpm}
        averageAccuracy={stats.averageAccuracy}
        onUpdateStudentProfile={setStudentProfile}
        onUpdateStudentName={setStudentName}
      />

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={(newText) => {
          setCustomText(newText);
          setMode('custom');
          resetEngine();
          resetCountdownState();
          focusInput();
        }}
      />

      {/* New Badge Unlock Notification Toast */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-secondary text-slate-950 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-amber-300">
          <span className="text-2xl">{newlyUnlockedBadges[0].icon}</span>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider">Achievement Unlocked!</div>
            <div className="text-sm font-bold text-slate-950">{newlyUnlockedBadges[0].title}</div>
            <div className="text-[11px] text-slate-900">{newlyUnlockedBadges[0].description}</div>
          </div>
          <button
            type="button"
            onClick={clearUnlockedNotice}
            className="ml-2 p-1 bg-black/20 hover:bg-black/30 rounded-lg text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
