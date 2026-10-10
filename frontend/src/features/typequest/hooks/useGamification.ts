'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserGamification, TestResult, AchievementBadge, UserTypingStats } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/badges';

const GAMIFICATION_STORAGE_KEY = 'msk_typequest_gamification_v2';

function getLevelTitle(level: number): string {
  if (level >= 40) return 'Godspeed Grandmaster';
  if (level >= 30) return 'Code Ninja';
  if (level >= 20) return 'Speed Demon';
  if (level >= 15) return 'Fast Finger';
  if (level >= 10) return 'Syntax Explorer';
  if (level >= 5) return 'Keyboard Apprentice';
  return 'Novice Typist';
}

function calculateLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 80)) + 1;
}

export function getXpForNextLevel(currentLevel: number): { currentLevelBaseXp: number; nextLevelXp: number } {
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 80;
  const nextLevelXp = Math.pow(currentLevel, 2) * 80;
  return { currentLevelBaseXp, nextLevelXp };
}

const DEFAULT_GAMIFICATION: UserGamification = {
  xp: 0,
  level: 1,
  levelTitle: 'Novice Typist',
  streakDays: 1,
  lastPracticeDate: '',
  unlockedBadgeIds: [],
  studentName: 'MSK Student',
  studentId: '',
};

export function useGamification() {
  const [gamification, setGamification] = useState<UserGamification>(DEFAULT_GAMIFICATION);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<AchievementBadge[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed: UserGamification = JSON.parse(saved);
        setGamification({
          ...DEFAULT_GAMIFICATION,
          ...parsed,
          level: calculateLevelFromXp(parsed.xp || 0),
          levelTitle: getLevelTitle(calculateLevelFromXp(parsed.xp || 0)),
        });
      }
    } catch (e) {
      console.error('Failed to load gamification data:', e);
    }
  }, []);

  // Save helper
  const saveGamification = useCallback((data: UserGamification) => {
    setGamification(data);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save gamification data:', e);
      }
    }
  }, []);

  // Update Student Name for Certificate
  const setStudentName = useCallback(
    (name: string) => {
      saveGamification({
        ...gamification,
        studentName: name.trim() || 'MSK Student',
      });
    },
    [gamification, saveGamification]
  );

  // Update Student Profile (ID & Name)
  const setStudentProfile = useCallback(
    (id: string, name: string) => {
      saveGamification({
        ...gamification,
        studentId: id.trim(),
        studentName: name.trim() || 'MSK Student',
      });
    },
    [gamification, saveGamification]
  );

  // Process Completed Test
  const processTestCompletion = useCallback(
    (
      result: TestResult,
      statsOrTimeMinutes: UserTypingStats | number = 0,
      codeLevelsDone: number = 0,
      isRaceWon: boolean = false
    ) => {
      let totalTimeMinutes = 0;
      let actualCodeLevelsDone = codeLevelsDone;
      if (typeof statsOrTimeMinutes === 'object' && statsOrTimeMinutes !== null) {
        totalTimeMinutes = Math.round((statsOrTimeMinutes.totalTimeSeconds || 0) / 60);
        actualCodeLevelsDone = statsOrTimeMinutes.unlockedLessons?.length || 0;
      } else if (typeof statsOrTimeMinutes === 'number') {
        totalTimeMinutes = statsOrTimeMinutes;
      }
      // 1. Calculate XP earned
      const baseCharsXp = Math.round(result.correctChars * 1.5);
      const accuracyBonus =
        result.accuracy === 100
          ? 120
          : result.accuracy >= 95
          ? 60
          : result.accuracy >= 90
          ? 30
          : 10;
      const speedBonus =
        result.wpm >= 100
          ? 200
          : result.wpm >= 80
          ? 120
          : result.wpm >= 60
          ? 80
          : result.wpm >= 40
          ? 40
          : 15;
      const raceBonus = isRaceWon ? 150 : 0;

      const xpEarned = baseCharsXp + accuracyBonus + speedBonus + raceBonus;
      const newTotalXp = gamification.xp + xpEarned;
      const prevLevel = gamification.level;
      const newLevel = calculateLevelFromXp(newTotalXp);
      const didLevelUp = newLevel > prevLevel;

      // 2. Calculate Daily Streak
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = gamification.streakDays || 1;

      if (gamification.lastPracticeDate) {
        const lastDate = new Date(gamification.lastPracticeDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          // Practiced yesterday -> increment streak
          newStreak += 1;
        } else if (diffDays > 1) {
          // Missed a day -> reset to 1
          newStreak = 1;
        }
      }

      // 3. Evaluate Badge Unlock Conditions
      const newlyUnlocked: AchievementBadge[] = [];
      const currentUnlocked = new Set(gamification.unlockedBadgeIds || []);

      ACHIEVEMENT_BADGES.forEach((badge) => {
        if (currentUnlocked.has(badge.id)) return;

        let unlock = false;
        switch (badge.id) {
          case 'first-flight':
            unlock = true;
            break;
          case 'sharpshooter':
            unlock = result.accuracy === 100 && result.correctChars >= 60;
            break;
          case 'speed-demon-40':
            unlock = result.wpm >= 40;
            break;
          case 'speed-demon-60':
            unlock = result.wpm >= 60 && result.accuracy >= 90;
            break;
          case 'speed-demon-80':
            unlock = result.wpm >= 80 && result.accuracy >= 90;
            break;
          case 'century-club':
            unlock = result.wpm >= 100 && result.accuracy >= 92;
            break;
          case 'daily-grinder':
            unlock = newStreak >= 3;
            break;
          case 'streak-7':
            unlock = newStreak >= 7;
            break;
          case 'syntax-master':
            unlock = actualCodeLevelsDone >= 6 || (result.mode === 'code' && result.accuracy >= 92);
            break;
          case 'polyglot':
            unlock = result.mode === 'code';
            break;
          case 'weak-key-conqueror':
            unlock = result.modeLabel.includes('Weak-Key') && result.accuracy >= 92;
            break;
          case 'classroom-champion':
            unlock = isRaceWon;
            break;
          case 'marathoner':
            unlock = totalTimeMinutes >= 30;
            break;
        }

        if (unlock) {
          currentUnlocked.add(badge.id);
          newlyUnlocked.push({
            ...badge,
            unlockedAt: new Date().toISOString(),
          });
        }
      });

      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadges(newlyUnlocked);
      }

      const updatedProfile: UserGamification = {
        ...gamification,
        xp: newTotalXp,
        level: newLevel,
        levelTitle: getLevelTitle(newLevel),
        streakDays: newStreak,
        lastPracticeDate: todayStr,
        unlockedBadgeIds: Array.from(currentUnlocked),
      };

      saveGamification(updatedProfile);

      return {
        xpEarned,
        didLevelUp,
        newLevel,
        newBadges: newlyUnlocked,
      };
    },
    [gamification, saveGamification]
  );

  return {
    gamification,
    newlyUnlockedBadges,
    clearUnlockedNotice: () => setNewlyUnlockedBadges([]),
    processTestCompletion,
    setStudentName,
    setStudentProfile,
  };
}
