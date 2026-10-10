export type PracticeMode = 'academy' | 'words' | 'sentences' | 'code' | 'timed' | 'custom' | 'race' | 'weak-keys';

export type AcademyStage = string;

export type CodeLanguage = 'javascript' | 'python' | 'cpp' | 'html-css' | 'sql' | 'react';

export type TimedDuration = 15 | 30 | 60 | 120;

export type SoundEffectType = 'mechanical' | 'typewriter' | 'bubble' | 'off';

export type FingerName =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDefinition {
  key: string;
  shiftKey?: string;
  code: string;
  finger: FingerName;
  width?: string;
}

export interface AcademyLesson {
  id: AcademyStage;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  focusKeys: string[];
  targetAccuracy: number;
  targetWpm: number;
  text: string;
}

export interface CodeSnippetItem {
  id: string;
  title: string;
  language: CodeLanguage;
  levelNumber?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  code: string;
}

export interface KeystrokeEvent {
  key: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
}

export interface TimelineDataPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface KeyHealthStat {
  key: string;
  total: number;
  errors: number;
  accuracy: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'coding' | 'milestone';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  unlockedAt?: string;
}

export interface UserGamification {
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  lastPracticeDate: string;
  unlockedBadgeIds: string[];
  studentName: string;
  studentId?: string;
}

export interface RaceCompetitor {
  id: string;
  name: string;
  avatar: string;
  color: string;
  wpm?: number;
  speedWpm?: number;
  targetWpm?: number;
  progressPercent: number;
  isUser?: boolean;
  isAi?: boolean;
  isReady?: boolean;
  rank?: number;
  finishRank?: number;
  finishTimeSeconds?: number;
}

export interface TestResult {
  id: string;
  date: string;
  mode: PracticeMode;
  modeLabel: string;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  timeSpentSeconds: number;
  correctChars: number;
  errorChars: number;
  extraChars: number;
  missedChars: number;
  weakKeys: { key: string; errorCount: number; accuracy: number }[];
  timeline?: TimelineDataPoint[];
  xpEarned?: number;
  rating: {
    title: string;
    tier: 'Beginner' | 'Casual' | 'Fluent' | 'Fast' | 'Pro' | 'Godspeed';
    color: string;
  };
}

export interface UserTypingStats {
  totalTests: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTimeSeconds: number;
  totalCharsTyped: number;
  recentResults: TestResult[];
  unlockedLessons: string[];
  keyStats?: Record<string, { total: number; errors: number }>;
}

export interface TypingEngineConfig {
  mode: PracticeMode;
  stage?: AcademyStage;
  codeLanguage?: CodeLanguage;
  timedDuration?: TimedDuration;
  customText?: string;
  soundType: SoundEffectType;
  soundVolume: number;
  strictMode: boolean; // Must fix error before continuing
  blindMode: boolean; // Hide text / cursor error feedback
  showKeyboard: boolean;
  showHands: boolean;
}
