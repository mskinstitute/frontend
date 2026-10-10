'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Trophy,
  Users,
  Bot,
  Zap,
  Flag,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
  Volume2,
  VolumeX,
  Palette,
  X,
  Gauge,
  Compass,
  ArrowUpRight,
  Smile,
  Link2,
  QrCode,
  BookOpen,
  ExternalLink,
  HelpCircle,
  PlusCircle,
  LogOut,
  UserCheck,
  Crown,
  Clock,
  Play,
  Bell,
} from 'lucide-react';
import { RaceCompetitor } from '../types';
import RacerVehicle from './RacerVehicle';

export interface RaceCircuit {
  id: string;
  name: string;
  icon: string;
  distance: string;
  description: string;
  text: string;
}

export const RACE_CIRCUITS: RaceCircuit[] = [
  {
    id: 'monza',
    name: 'Monza Speed Grand Prix',
    icon: '🏎️',
    distance: 'Sprint (40 words)',
    description: 'High-speed speedway sprint demanding smooth typing rhythm and rapid keystrokes.',
    text: 'Accelerate your fingers across the keyboard with velocity and precision. In the digital grand prix of typing, every clean keystroke boosts your engine and propels you toward victory. Stay calm, maintain rhythm, and dominate the classroom track!',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Highway 2099',
    icon: '🌌',
    distance: 'Night Drive (44 words)',
    description: 'Neon-drenched cyber highway with high-frequency electronic flow.',
    text: 'Neon lights blur past as high-frequency electrical pulses surge through the typing grid. Sync your keystrokes to the synthwave rhythm of the cyber metropolis, engage your nitro thrusters, and leave your classroom rivals in digital stardust!',
  },
  {
    id: 'himalaya',
    name: 'Himalayan Ridge Climb',
    icon: '🏔️',
    distance: 'Endurance (43 words)',
    description: 'Winding mountain passes where zero mistakes yield supreme momentum.',
    text: 'Carve through the high mountain passes with sharp focus and rock-solid finger placement. The treacherous altitude demands unwavering discipline where zero mistakes yield supreme momentum and guide you safely to the mountain summit!',
  },
  {
    id: 'quantum',
    name: 'Quantum Particle Loop',
    icon: '⚡',
    distance: 'Hyper-Sprint (41 words)',
    description: 'Subatomic acceleration chamber for blazing hyper-speed typing.',
    text: 'Subatomic particles collide at extraordinary velocities inside the particle accelerator ring. Harness the pure kinetic energy of every word to achieve maximum touch-typing acceleration and shatter all lap records today!',
  },
];

export interface VehicleSkin {
  id: string;
  name: string;
  avatar: string;
  tag: string;
}

export const VEHICLE_SKINS: VehicleSkin[] = [
  { id: 'f1', name: 'Formula Turbo', avatar: '🏎️', tag: 'Aero Speed' },
  { id: 'rocket', name: 'Cosmic Rocket', avatar: '🚀', tag: 'Hyper Thrust' },
  { id: 'lightning', name: 'Thunder Bolt', avatar: '⚡', tag: 'Electric Flow' },
  { id: 'bike', name: 'Hyper Superbike', avatar: '🏍️', tag: 'Agile Drift' },
  { id: 'ufo', name: 'Cyber UFO', avatar: '🛸', tag: 'Anti-Gravity' },
  { id: 'dragon', name: 'Apex Dragon', avatar: '🐲', tag: 'Beast Power' },
];

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  glowClass: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'orange', name: 'MSK Flame', hex: '#ff6b00', borderHex: '#ea580c', glowClass: 'shadow-orange-500/50' },
  { id: 'cyan', name: 'Neon Cyan', hex: '#06b6d4', borderHex: '#0891b2', glowClass: 'shadow-cyan-500/50' },
  { id: 'purple', name: 'Electric Violet', hex: '#a855f7', borderHex: '#9333ea', glowClass: 'shadow-purple-500/50' },
  { id: 'emerald', name: 'Emerald Nitro', hex: '#10b981', borderHex: '#059669', glowClass: 'shadow-emerald-500/50' },
  { id: 'lime', name: 'Acid Lime', hex: '#84cc16', borderHex: '#65a30d', glowClass: 'shadow-lime-500/50' },
  { id: 'crimson', name: 'Crimson Fury', hex: '#ef4444', borderHex: '#dc2626', glowClass: 'shadow-red-500/50' },
];

export type OpponentMode = 'ai' | 'peers' | 'ghost';
export type BotDifficulty = 'rookie' | 'pro' | 'elite';

interface FloatingEmote {
  id: number;
  emoji: string;
  xPercent: number;
}

export interface ClassroomMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  speedWpm: number;
  progressPercent: number;
  isHost: boolean;
  isReady?: boolean;
  isCompleted?: boolean;
}

interface ClassroomRaceArenaProps {
  userProgress: number; // 0 to 100
  userWpm: number;
  userAccuracy?: number;
  errorCount?: number;
  correctKeystrokes?: number;
  studentName?: string;
  onUpdateStudentName?: (name: string) => void;
  onLockTypingChange?: (isLocked: boolean, countdown: number | null) => void;
  isActive: boolean;
  isCompleted: boolean;
  currentCircuitId?: string;
  isFullscreen?: boolean;
  initialRoomCode?: string;
  onRaceFinished?: (rank: number) => void;
  onRematch?: () => void;
  onSelectCircuit?: (circuitId: string) => void;
  onOpenDetailedStats?: () => void;
  onRefocus?: () => void;
}

export default function ClassroomRaceArena({
  userProgress,
  userWpm,
  userAccuracy = 100,
  errorCount = 0,
  correctKeystrokes = 0,
  studentName = 'Student',
  onUpdateStudentName,
  onLockTypingChange,
  isActive,
  isCompleted,
  currentCircuitId = 'monza',
  isFullscreen = false,
  initialRoomCode,
  onRaceFinished,
  onRematch,
  onSelectCircuit,
  onOpenDetailedStats,
  onRefocus,
}: ClassroomRaceArenaProps) {
  // Unique persistent member ID for this browser tab/session
  const myMemberId = useMemo(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('msk_typequest_member_id');
      if (!id) {
        id = 'm_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('msk_typequest_member_id', id);
      }
      return id;
    }
    return 'm_player';
  }, []);

  const [isHost, setIsHost] = useState(false);

  // Ready state & synchronized 5-second countdown
  const [isReady, setIsReady] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [joinNotification, setJoinNotification] = useState<{
    id: number;
    message: string;
    type: 'join' | 'leave' | 'ready';
  } | null>(null);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevMemberIdsRef = useRef<Set<string>>(new Set());
  const hasTriggeredCountdownRef = useRef(false);

  // Host name input in Create Room form
  const [createHostName, setCreateHostName] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msk_student_name');
      if (saved && saved !== 'MSK Student' && saved !== 'Student') return saved;
    }
    return studentName && studentName !== 'MSK Student' && studentName !== 'Student' ? studentName : '';
  });

  // Student name input in Join Room form
  const [joinStudentName, setJoinStudentName] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msk_student_name');
      if (saved && saved !== 'MSK Student' && saved !== 'Student') return saved;
    }
    return studentName && studentName !== 'MSK Student' && studentName !== 'Student' ? studentName : '';
  });

  // Remote real members currently connected to the room
  const [remoteMembers, setRemoteMembers] = useState<ClassroomMember[]>([]);

  // Room code: null by default so no unwanted shared room exists until created or joined!
  const [roomCode, setRoomCode] = useState<string | null>(() => {
    if (initialRoomCode) {
      return initialRoomCode.toUpperCase();
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoom = urlParams.get('room');
      if (urlRoom) {
        return urlRoom.toUpperCase();
      }
    }
    return null; // NO room by default!
  });

  const [modalTab, setModalTab] = useState<'create' | 'join' | 'share'>(() => (roomCode ? 'share' : 'create'));
  const [createCustomName, setCreateCustomName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customJoinInput, setCustomJoinInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  // Synchronize when initialRoomCode prop changes
  useEffect(() => {
    if (initialRoomCode) {
      const formatted = initialRoomCode.toUpperCase();
      setRoomCode(formatted);
      setOpponentMode('peers');

      // If student hasn't customized their name, open the Join modal with room code prefilled
      const saved = typeof window !== 'undefined' ? localStorage.getItem('msk_student_name') : null;
      if (!saved || saved === 'MSK Student' || saved === 'Student') {
        setCustomJoinInput(formatted);
        setModalTab('join');
        setIsShareModalOpen(true);
      }
    }
  }, [initialRoomCode]);

  // Synchronize URL with room code
  const updateUrlRoom = useCallback((code: string | null) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'race');
      if (code) {
        url.searchParams.set('room', code);
      } else {
        url.searchParams.delete('room');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Dynamic portal mount target:
  // In Fullscreen mode (or when document.fullscreenElement is active), the portal MUST mount
  // inside the fullscreen container (document.fullscreenElement / #typequest-fullscreen-container).
  // Otherwise, the browser's Fullscreen top layer hides any portal mounted on document.body.
  // In normal mode, it mounts to document.body so it floats over the entire website without any clipping.
  const getActivePortalTarget = useCallback((): Element | null => {
    if (typeof document === 'undefined') return null;
    const fsEl =
      document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement;

    if (fsEl) return fsEl;
    if (isFullscreen) {
      const typequestContainer = document.getElementById('typequest-fullscreen-container');
      if (typequestContainer) return typequestContainer;
    }
    return document.body;
  }, [isFullscreen]);

  useEffect(() => {
    setIsMounted(true);
    setPortalTarget(getActivePortalTarget());

    const handleFsChange = () => {
      setPortalTarget(getActivePortalTarget());
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, [getActivePortalTarget]);

  // Opponent Mode: AI vs Classroom Peers vs Solo Ghost
  const [opponentMode, setOpponentMode] = useState<OpponentMode>('ai');
  const [difficulty, setDifficulty] = useState<BotDifficulty>('pro');
  const [ghostTargetWpm, setGhostTargetWpm] = useState<number>(55);

  // Vehicle & Color Customization (Persisted)
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🏎️');
  const [selectedColor, setSelectedColor] = useState<string>('#ff6b00');

  // Priority Escape key handler: closes Garage and Share modal without exiting fullscreen
  useEffect(() => {
    if (!isShareModalOpen && !isGarageOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (isShareModalOpen) setIsShareModalOpen(false);
        if (isGarageOpen) setIsGarageOpen(false);
        onRefocus?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isShareModalOpen, isGarageOpen, onRefocus]);

  // Web Audio SFX Mute state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Nitro Boost Mechanic
  const [nitroPercent, setNitroPercent] = useState<number>(0);
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const cleanStreakRef = useRef<number>(0);
  const prevErrorsRef = useRef<number>(0);

  // Emotes & Floating Reactions
  const [floatingEmotes, setFloatingEmotes] = useState<FloatingEmote[]>([]);
  const [overtakeNotice, setOvertakeNotice] = useState<string | null>(null);
  const prevRankRef = useRef<number>(1);

  // Load user saved vehicle customization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('msk_race_avatar');
      const savedColor = localStorage.getItem('msk_race_color');
      const savedMute = localStorage.getItem('msk_race_muted');
      if (savedAvatar) setSelectedAvatar(savedAvatar);
      if (savedColor) setSelectedColor(savedColor);
      if (savedMute !== null) setIsMuted(savedMute === 'true');
    }
  }, []);

  const saveCustomization = (avatar: string, color: string) => {
    setSelectedAvatar(avatar);
    setSelectedColor(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('msk_race_avatar', avatar);
      localStorage.setItem('msk_race_color', color);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('msk_race_muted', String(next));
      }
      return next;
    });
  };

  // Synthesized Web Audio sound effects
  const playSound = useCallback(
    (type: 'beep' | 'nitro' | 'victory' | 'pop') => {
      if (isMuted) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === 'beep') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(620, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } else if (type === 'pop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'nitro') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(260, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.32);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.32);
        } else if (type === 'victory') {
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
            gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.11 + 0.28);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.11);
            osc.stop(ctx.currentTime + idx * 0.11 + 0.28);
          });
        }
      } catch {
        // Ignore audio errors if blocked by browser policy
      }
    },
    [isMuted]
  );

  // Play victory sound on race completion
  useEffect(() => {
    if (isCompleted) {
      playSound('victory');
    }
  }, [isCompleted, playSound]);

  // Handle Nitro Gauge based on clean typing streaks
  useEffect(() => {
    if (!isActive) {
      setNitroPercent(0);
      setIsNitroActive(false);
      cleanStreakRef.current = 0;
      prevErrorsRef.current = errorCount;
      return;
    }

    if (errorCount > prevErrorsRef.current) {
      // Mistake made: reset nitro streak
      prevErrorsRef.current = errorCount;
      cleanStreakRef.current = 0;
      setNitroPercent(0);
      setIsNitroActive(false);
      return;
    }

    // Clean keystroke progress
    cleanStreakRef.current += 1;
    const progress = Math.min(100, Math.round((cleanStreakRef.current / 22) * 100));
    setNitroPercent(progress);

    if (progress >= 100 && !isNitroActive) {
      setIsNitroActive(true);
      playSound('nitro');
    }
  }, [correctKeystrokes, errorCount, isActive, isNitroActive, playSound]);

  // Toast notification helper
  const showNotification = useCallback(
    (message: string, type: 'join' | 'leave' | 'ready') => {
      setJoinNotification({ id: Date.now(), message, type });
      if (type === 'join') {
        playSound('pop');
      } else if (type === 'ready') {
        playSound('beep');
      }
      setTimeout(() => {
        setJoinNotification((prev) => (prev && prev.message === message ? null : prev));
      }, 3500);
    },
    [playSound]
  );

  // Synchronized 5-second countdown before race starts
  const startFiveSecondCountdown = useCallback(() => {
    if (countdownIntervalRef.current) return;
    hasTriggeredCountdownRef.current = true;
    setIsRaceStarted(false);
    setCountdownSeconds(5);
    playSound('beep');

    let current = 5;
    countdownIntervalRef.current = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdownSeconds(current);
        playSound('beep');
      } else if (current === 0) {
        setCountdownSeconds(0);
        playSound('nitro');
      } else {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCountdownSeconds(null);
        setIsRaceStarted(true);
      }
    }, 1000);
  }, [playSound]);

  // Clean up countdown interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, []);

  // Synchronize typing lock with parent TypeQuestApp: strictly locked during waiting and countdown
  useEffect(() => {
    if (!roomCode) {
      onLockTypingChange?.(false, null);
    } else {
      onLockTypingChange?.(!isRaceStarted, countdownSeconds);
    }
  }, [roomCode, isRaceStarted, countdownSeconds, onLockTypingChange]);

  // Real-time synchronization with classroom members (BroadcastChannel for multi-tab + API polling)
  useEffect(() => {
    if (!roomCode || typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('msk_race_room_' + roomCode);
    } catch {
      // BroadcastChannel fallback
    }

    const currentName =
      studentName && studentName !== 'MSK Student' && studentName !== 'Student'
        ? studentName
        : joinStudentName.trim() || createHostName.trim() || 'Student';

    const myPresence: ClassroomMember = {
      id: myMemberId,
      name: currentName,
      avatar: selectedAvatar,
      color: selectedColor,
      speedWpm: userWpm,
      progressPercent: userProgress,
      isHost,
      isReady,
      isCompleted,
    };

    if (channel) {
      // Announce arrival to other tabs
      channel.postMessage({
        type: 'JOIN',
        member: myPresence,
      });

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || !data.type) return;

        if (data.type === 'JOIN') {
          const incoming = data.member as ClassroomMember;
          if (incoming && incoming.id !== myMemberId) {
            setRemoteMembers((prev) => {
              const exists = prev.some((m) => m.id === incoming.id);
              if (!exists) {
                showNotification(`👋 ${incoming.name} joined the race heat! (${Math.min(5, prev.length + 2)}/5)`, 'join');
              }
              const filtered = prev.filter((m) => m.id !== incoming.id);
              return [...filtered, incoming].slice(0, 4);
            });
            channel?.postMessage({
              type: 'WELCOME',
              member: {
                id: myMemberId,
                name: currentName,
                avatar: selectedAvatar,
                color: selectedColor,
                speedWpm: userWpm,
                progressPercent: userProgress,
                isHost,
                isReady,
                isCompleted,
              },
            });
          }
        } else if (data.type === 'WELCOME') {
          const incoming = data.member as ClassroomMember;
          if (incoming && incoming.id !== myMemberId) {
            setRemoteMembers((prev) => {
              const filtered = prev.filter((m) => m.id !== incoming.id);
              return [...filtered, incoming].slice(0, 4);
            });
          }
        } else if (data.type === 'READY') {
          if (data.memberId !== myMemberId) {
            setRemoteMembers((prev) =>
              prev.map((m) => (m.id === data.memberId ? { ...m, isReady: data.isReady } : m))
            );
            if (data.isReady) {
              const target = remoteMembers.find((m) => m.id === data.memberId);
              showNotification(`✅ ${target ? target.name : 'A racer'} clicked Start and is Ready!`, 'ready');
            }
          }
        } else if (data.type === 'START_COUNTDOWN') {
          if (!hasTriggeredCountdownRef.current && !isRaceStarted) {
            startFiveSecondCountdown();
          }
        } else if (data.type === 'REMATCH') {
          setIsReady(false);
          setIsRaceStarted(false);
          setCountdownSeconds(null);
          hasTriggeredCountdownRef.current = false;
          setRemoteMembers((prev) =>
            prev.map((m) => ({
              ...m,
              progressPercent: 0,
              speedWpm: 0,
              isReady: false,
              isCompleted: false,
            }))
          );
          onRematch?.();
        } else if (data.type === 'PROGRESS') {
          if (data.memberId !== myMemberId) {
            setRemoteMembers((prev) =>
              prev.map((m) =>
                m.id === data.memberId
                  ? {
                      ...m,
                      speedWpm: data.speedWpm ?? m.speedWpm,
                      progressPercent: data.progressPercent ?? m.progressPercent,
                      isCompleted: data.isCompleted ?? m.isCompleted,
                    }
                  : m
              )
            );
          }
        } else if (data.type === 'EMOTE') {
          if (data.memberId !== myMemberId && data.emoji) {
            const newEmote: FloatingEmote = {
              id: Date.now() + Math.random(),
              emoji: data.emoji,
              xPercent: data.progressPercent || 50,
            };
            setFloatingEmotes((prev) => [...prev.slice(-8), newEmote]);
            playSound('pop');
            setTimeout(() => {
              setFloatingEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
            }, 1400);
          }
        } else if (data.type === 'LEAVE') {
          if (data.memberId) {
            const leftMember = remoteMembers.find((m) => m.id === data.memberId);
            if (leftMember) {
              showNotification(`🚪 ${leftMember.name} left the room heat`, 'leave');
            }
            setRemoteMembers((prev) => prev.filter((m) => m.id !== data.memberId));
          }
        }
      };
    }

    // Register with server API route
    fetch('/api/typequest/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: isHost ? 'create' : 'join',
        roomCode,
        circuitId: currentCircuitId,
        member: myPresence,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.members && Array.isArray(data.members)) {
          const others = data.members.filter((m: ClassroomMember) => m.id !== myMemberId).slice(0, 4);
          setRemoteMembers((prev) => {
            const map = new Map<string, ClassroomMember>();
            prev.forEach((m) => map.set(m.id, m));
            others.forEach((m: ClassroomMember) => map.set(m.id, m));
            return Array.from(map.values()).slice(0, 4);
          });
        }
      })
      .catch(() => {});

    // Periodic polling heartbeat with server every 2 seconds for cross-device support
    const pollInterval = setInterval(() => {
      fetch(`/api/typequest/room?room=${roomCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.members && Array.isArray(data.members)) {
            const others = data.members.filter((m: ClassroomMember) => m.id !== myMemberId).slice(0, 4);

            others.forEach((m: ClassroomMember) => {
              if (!prevMemberIdsRef.current.has(m.id)) {
                prevMemberIdsRef.current.add(m.id);
                showNotification(`👋 ${m.name} joined the race heat!`, 'join');
              }
            });

            setRemoteMembers((prev) => {
              const map = new Map<string, ClassroomMember>();
              others.forEach((m: ClassroomMember) => map.set(m.id, m));
              prev.forEach((m) => {
                if (map.has(m.id)) {
                  const srv = map.get(m.id)!;
                  map.set(m.id, {
                    ...srv,
                    isReady: typeof srv.isReady === 'boolean' ? srv.isReady : m.isReady,
                    speedWpm: Math.max(srv.speedWpm, m.speedWpm),
                    progressPercent: Math.max(srv.progressPercent, m.progressPercent),
                  });
                } else {
                  map.set(m.id, m);
                }
              });
              return Array.from(map.values()).slice(0, 4);
            });

            // If server triggered countdown
            if (data.room?.countdownStart && !hasTriggeredCountdownRef.current && !isRaceStarted) {
              startFiveSecondCountdown();
            }
          }
        })
        .catch(() => {});
    }, 2000);

    const handleBeforeUnload = () => {
      channel?.postMessage({ type: 'LEAVE', memberId: myMemberId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/typequest/room',
          JSON.stringify({ action: 'leave', roomCode, memberId: myMemberId })
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (channel) {
        channel.postMessage({ type: 'LEAVE', memberId: myMemberId });
        channel.close();
      }
      fetch('/api/typequest/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', roomCode, memberId: myMemberId }),
      }).catch(() => {});
    };
  }, [roomCode, myMemberId, isHost, isReady, currentCircuitId, studentName, joinStudentName, createHostName, selectedAvatar, selectedColor, playSound, showNotification, startFiveSecondCountdown, isRaceStarted]);

  // Broadcast typing progress to room whenever progress or WPM changes
  useEffect(() => {
    if (!roomCode || typeof window === 'undefined') return;

    try {
      const channel = new BroadcastChannel('msk_race_room_' + roomCode);
      channel.postMessage({
        type: 'PROGRESS',
        memberId: myMemberId,
        speedWpm: userWpm,
        progressPercent: userProgress,
        isCompleted,
      });
      channel.close();
    } catch {}

    const timer = setTimeout(() => {
      fetch('/api/typequest/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          roomCode,
          memberId: myMemberId,
          speedWpm: userWpm,
          progressPercent: userProgress,
          isReady,
          isCompleted,
          avatar: selectedAvatar,
          color: selectedColor,
        }),
      }).catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [roomCode, myMemberId, userWpm, userProgress, isCompleted, isReady, selectedAvatar, selectedColor]);

  // All active members in the current classroom room (self + peers)
  const allActiveMembers = useMemo(() => {
    const currentName =
      studentName && studentName !== 'MSK Student' && studentName !== 'Student'
        ? studentName
        : joinStudentName.trim() || createHostName.trim() || 'Student';

    const selfMember: ClassroomMember & { isSelf: boolean } = {
      id: myMemberId,
      name: currentName,
      avatar: selectedAvatar,
      color: selectedColor,
      speedWpm: userWpm,
      progressPercent: userProgress,
      isHost,
      isReady,
      isCompleted,
      isSelf: true,
    };

    const others = remoteMembers
      .filter((m) => m.id !== myMemberId)
      .slice(0, 4)
      .map((m) => ({ ...m, isSelf: false }));

    return [selfMember, ...others];
  }, [
    myMemberId,
    studentName,
    joinStudentName,
    createHostName,
    selectedAvatar,
    selectedColor,
    userWpm,
    userProgress,
    isHost,
    isReady,
    isCompleted,
    remoteMembers,
  ]);

  // Count ready members
  const readyMembersCount = useMemo(() => {
    return allActiveMembers.filter((m) => m.isReady).length;
  }, [allActiveMembers]);

  // Check if all members in the room have clicked Start
  const areAllMembersReady = useMemo(() => {
    if (!roomCode || allActiveMembers.length === 0) return false;
    return allActiveMembers.every((m) => m.isReady);
  }, [roomCode, allActiveMembers]);

  // Automatically start 5-second countdown when all room members are ready
  useEffect(() => {
    if (roomCode && areAllMembersReady && !isRaceStarted && !hasTriggeredCountdownRef.current) {
      startFiveSecondCountdown();
      try {
        const ch = new BroadcastChannel('msk_race_room_' + roomCode);
        ch.postMessage({ type: 'START_COUNTDOWN' });
        ch.close();
      } catch {}
    }
  }, [roomCode, areAllMembersReady, isRaceStarted, startFiveSecondCountdown]);

  // Base Competitors based on chosen Opponent Mode
  const competitorsList = useMemo<RaceCompetitor[]>(() => {
    const currentName =
      studentName && studentName !== 'MSK Student' && studentName !== 'Student'
        ? studentName
        : joinStudentName.trim() || createHostName.trim() || 'Student';

    const playerComp: RaceCompetitor = {
      id: 'player',
      name: `${currentName} (You)`,
      isAi: false,
      speedWpm: userWpm,
      progressPercent: userProgress,
      isReady,
      rank: 1,
      color: selectedColor,
      avatar: selectedAvatar,
    };

    if (roomCode) {
      // IN ROOM MODE: SHOW ONLY REAL JOINED MEMBERS (NO DUMMY BOTS!)
      const remoteComps: RaceCompetitor[] = remoteMembers
        .filter((m) => m.id !== myMemberId)
        .slice(0, 4)
        .map((m, idx) => ({
          id: m.id,
          name: `${m.name}${m.isHost ? ' (Host 👑)' : ''}`,
          isAi: false,
          speedWpm: m.speedWpm || 0,
          progressPercent: m.progressPercent || 0,
          isReady: !!m.isReady,
          rank: idx + 2,
          color: m.color || '#06b6d4',
          avatar: m.avatar || '🏎️',
        }));

      return [playerComp, ...remoteComps];
    }

    if (opponentMode === 'peers') {
      // Classroom Peers Mode (Authentic Indian Classroom simulation) - Only in solo demo without room
      return [
        playerComp,
        {
          id: 'peer-1',
          name: 'Priya Verma',
          isAi: true,
          speedWpm: 52,
          progressPercent: 0,
          rank: 2,
          color: '#10b981',
          avatar: '🏎️',
        },
        {
          id: 'peer-2',
          name: 'Aarav Sharma',
          isAi: true,
          speedWpm: 64,
          progressPercent: 0,
          rank: 3,
          color: '#06b6d4',
          avatar: '⚡',
        },
        {
          id: 'peer-3',
          name: 'Rohan Patel',
          isAi: true,
          speedWpm: 46,
          progressPercent: 0,
          rank: 4,
          color: '#a855f7',
          avatar: '🚀',
        },
      ];
    }

    if (opponentMode === 'ghost') {
      // Ghost / Solo Target Mode
      return [
        playerComp,
        {
          id: 'ghost-target',
          name: `Target Ghost (${ghostTargetWpm} WPM)`,
          isAi: true,
          speedWpm: ghostTargetWpm,
          progressPercent: 0,
          rank: 2,
          color: '#64748b',
          avatar: '👻',
        },
      ];
    }

    // AI Pacesetters Mode
    const aiRoster = {
      rookie: [
        { id: 'bot-1', name: 'PixelBot (AI)', speedWpm: 32, color: '#38bdf8', avatar: '🤖' },
        { id: 'bot-2', name: 'ByteRacer (AI)', speedWpm: 40, color: '#a855f7', avatar: '🏎️' },
        { id: 'bot-3', name: 'NovaCadet (AI)', speedWpm: 46, color: '#10b981', avatar: '🚀' },
      ],
      pro: [
        { id: 'bot-1', name: 'NovaRacer (AI)', speedWpm: 48, color: '#38bdf8', avatar: '🚀' },
        { id: 'bot-2', name: 'TurboPixel (AI)', speedWpm: 58, color: '#a855f7', avatar: '⚡' },
        { id: 'bot-3', name: 'VeloGhost (AI)', speedWpm: 68, color: '#10b981', avatar: '🏎️' },
      ],
      elite: [
        { id: 'bot-1', name: 'ApexVolt (AI)', speedWpm: 74, color: '#f59e0b', avatar: '⚡' },
        { id: 'bot-2', name: 'HyperPhantom (AI)', speedWpm: 86, color: '#ec4899', avatar: '🛸' },
        { id: 'bot-3', name: 'NeuralTyper (AI)', speedWpm: 96, color: '#ef4444', avatar: '🐲' },
      ],
    };

    const chosenBots = aiRoster[difficulty];
    return [
      playerComp,
      ...chosenBots.map((b, idx) => ({
        ...b,
        isAi: true,
        progressPercent: 0,
        rank: idx + 2,
      })),
    ];
  }, [
    studentName,
    joinStudentName,
    createHostName,
    selectedColor,
    selectedAvatar,
    userWpm,
    userProgress,
    roomCode,
    remoteMembers,
    myMemberId,
    opponentMode,
    difficulty,
    ghostTargetWpm,
  ]);

  const [competitors, setCompetitors] = useState<RaceCompetitor[]>(competitorsList);

  // Sync competitor roster on mode / difficulty / skin changes
  useEffect(() => {
    setCompetitors(competitorsList);
  }, [competitorsList]);

  const raceStartTimeRef = useRef<number | null>(null);
  const finishReportedRef = useRef(false);

  // Reset bots when typing test resets
  useEffect(() => {
    if (!isActive && !isCompleted) {
      raceStartTimeRef.current = null;
      finishReportedRef.current = false;
      setCompetitors((prev) =>
        prev.map((c) => ({
          ...c,
          progressPercent: c.id === 'player' ? userProgress : 0,
          rank: 1,
        }))
      );
    }
  }, [isActive, isCompleted, userProgress]);

  // Active race simulation tick for competitors
  useEffect(() => {
    if (!isActive || isCompleted) return;

    if (!raceStartTimeRef.current) {
      raceStartTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      if (!raceStartTimeRef.current) return;
      const elapsedMinutes = (Date.now() - raceStartTimeRef.current) / 1000 / 60;

      setCompetitors((prev) => {
        const updated = prev.map((comp, idx) => {
          if (comp.id === 'player') {
            return {
              ...comp,
              progressPercent: Math.min(100, Math.max(0, userProgress)),
              speedWpm: userWpm,
            };
          }

          if (roomCode) {
            // Live room mode: take progress directly from real reported remote member progress!
            const liveRemote = remoteMembers.find((m) => m.id === comp.id);
            return {
              ...comp,
              speedWpm: liveRemote ? liveRemote.speedWpm : comp.speedWpm,
              progressPercent: liveRemote ? liveRemote.progressPercent : comp.progressPercent,
            };
          }

          // Target WPM based on mode
          const baseWpm = comp.speedWpm || 50;

          // For human peers mode: add realistic human cadence variance
          let simulatedProgress = 0;
          if (opponentMode === 'peers') {
            const humanJitter = Math.sin(elapsedMinutes * 40 + idx * 1.5) * 4;
            const effectiveWpm = Math.max(25, baseWpm + humanJitter);
            simulatedProgress = Math.min(100, Math.round((effectiveWpm * elapsedMinutes * 100) / 40));
          } else {
            // AI bots steady velocity
            simulatedProgress = Math.min(100, Math.round((baseWpm * elapsedMinutes * 100) / 40));
          }

          return {
            ...comp,
            progressPercent: comp.progressPercent >= 100 ? 100 : Math.min(100, simulatedProgress),
          };
        });

        // Compute live rankings based on progress
        const sorted = [...updated].sort((a, b) => b.progressPercent - a.progressPercent);
        const ranked = updated.map((comp) => {
          const rank = sorted.findIndex((s) => s.id === comp.id) + 1;
          return { ...comp, rank };
        });

        // Check for overtaking alert
        const currentPlayer = ranked.find((c) => c.id === 'player');
        if (currentPlayer) {
          if (currentPlayer.rank < prevRankRef.current) {
            const passedComp = sorted[currentPlayer.rank]; // Competitor that was overtaken
            if (passedComp && passedComp.id !== 'player') {
              setOvertakeNotice(`Overtook ${passedComp.name}! 🚀`);
              playSound('pop');
              setTimeout(() => setOvertakeNotice(null), 2400);
            }
          }
          prevRankRef.current = currentPlayer.rank;
        }

        return ranked;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, isCompleted, userProgress, userWpm, opponentMode, playSound]);

  // Report final ranking to parent
  useEffect(() => {
    if (isCompleted && !finishReportedRef.current) {
      finishReportedRef.current = true;
      const playerComp = competitors.find((c) => c.id === 'player');
      if (playerComp && onRaceFinished) {
        onRaceFinished(playerComp.rank ?? 1);
      }
    }
  }, [isCompleted, competitors, onRaceFinished]);

  // Floating Emote trigger
  const handleTriggerEmote = (emoji: string) => {
    const playerComp = competitors.find((c) => c.id === 'player');
    const xPos = playerComp ? Math.min(90, Math.max(10, playerComp.progressPercent)) : 50;

    const newEmote: FloatingEmote = {
      id: Date.now() + Math.random(),
      emoji,
      xPercent: xPos,
    };

    setFloatingEmotes((prev) => [...prev.slice(-8), newEmote]);
    playSound('pop');

    if (roomCode && typeof window !== 'undefined') {
      try {
        const channel = new BroadcastChannel('msk_race_room_' + roomCode);
        channel.postMessage({
          type: 'EMOTE',
          emoji,
          memberId: myMemberId,
          progressPercent: xPos,
        });
        channel.close();
      } catch {}
    }

    setTimeout(() => {
      setFloatingEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
    }, 1400);
  };

  // Generate direct shareable invite link
  const inviteLink = useMemo(() => {
    if (!roomCode) return '';
    if (typeof window !== 'undefined') {
      const base = window.location.origin + window.location.pathname;
      return `${base}?mode=race&room=${roomCode}`;
    }
    return `https://www.mskinstitute.in/tools/typing?mode=race&room=${roomCode}`;
  }, [roomCode]);

  const handleCreateRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalHostName = createHostName.trim() || studentName || 'Teacher / Host';
    if (typeof window !== 'undefined') {
      localStorage.setItem('msk_student_name', finalHostName);
    }
    onUpdateStudentName?.(finalHostName);

    let code = '';
    const clean = createCustomName.trim().toUpperCase();
    if (clean) {
      code = clean.startsWith('MSK-') ? clean : `MSK-${clean}`;
    } else {
      code = `MSK-${Math.floor(100 + Math.random() * 900)}`;
    }
    setIsHost(true);
    setIsReady(false);
    setIsRaceStarted(false);
    setCountdownSeconds(null);
    hasTriggeredCountdownRef.current = false;
    setRoomCode(code);
    updateUrlRoom(code);
    setOpponentMode('peers');
    setModalTab('share');
    setCreateCustomName('');
    playSound('pop');
  };

  const handleJoinCustomRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = joinStudentName.trim();
    if (!cleanName) {
      setJoinError('Please enter your name');
      return;
    }
    const cleanCode = customJoinInput.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError('Please enter a room code');
      return;
    }
    const formattedCode = cleanCode.startsWith('MSK-') ? cleanCode : `MSK-${cleanCode}`;

    // Validate room capacity first (Max 5 members)
    try {
      const checkRes = await fetch(`/api/typequest/room?room=${formattedCode}`);
      const checkData = await checkRes.json();
      if (checkData.exists && checkData.members && checkData.members.length >= 5) {
        const isAlreadyIn = checkData.members.some((m: { id: string }) => m.id === myMemberId);
        if (!isAlreadyIn) {
          setJoinError('Room is full! Maximum 5 racers allowed per classroom heat.');
          return;
        }
      }
    } catch {}

    if (typeof window !== 'undefined') {
      localStorage.setItem('msk_student_name', cleanName);
    }
    onUpdateStudentName?.(cleanName);

    setIsHost(false);
    setIsReady(false);
    setIsRaceStarted(false);
    setCountdownSeconds(null);
    hasTriggeredCountdownRef.current = false;
    setRoomCode(formattedCode);
    updateUrlRoom(formattedCode);
    setOpponentMode('peers');
    setJoinSuccess(true);
    setJoinError(null);
    setCustomJoinInput('');
    setModalTab('share');
    playSound('pop');
    setTimeout(() => {
      setJoinSuccess(false);
    }, 2500);
  };

  const handleToggleReady = () => {
    const nextReady = !isReady;
    setIsReady(nextReady);

    if (nextReady) {
      showNotification('You clicked Start! You are Ready ✅', 'ready');
    }

    if (roomCode && typeof window !== 'undefined') {
      try {
        const channel = new BroadcastChannel('msk_race_room_' + roomCode);
        channel.postMessage({
          type: 'READY',
          memberId: myMemberId,
          isReady: nextReady,
        });
        channel.close();
      } catch {}

      fetch('/api/typequest/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ready',
          roomCode,
          memberId: myMemberId,
          isReady: nextReady,
        }),
      }).catch(() => {});
    }
  };

  const handleLeaveRoom = () => {
    if (roomCode) {
      try {
        const ch = new BroadcastChannel('msk_race_room_' + roomCode);
        ch.postMessage({ type: 'LEAVE', memberId: myMemberId });
        ch.close();
      } catch {}
      fetch('/api/typequest/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', roomCode, memberId: myMemberId }),
      }).catch(() => {});
    }
    setRoomCode(null);
    updateUrlRoom(null);
    setRemoteMembers([]);
    setIsHost(false);
    setIsReady(false);
    setIsRaceStarted(false);
    setCountdownSeconds(null);
    hasTriggeredCountdownRef.current = false;
    prevMemberIdsRef.current.clear();
    setOpponentMode('ai');
    setIsShareModalOpen(false);
    onRefocus?.();
  };

  const handleCopyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const playerComp = competitors.find((c) => c.id === 'player') || competitors[0];
  const sortedCompetitors = useMemo(() => {
    return [...competitors].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  }, [competitors]);

  // Live F1 Telemetry Split Distance
  const telemetryDelta = useMemo(() => {
    if (playerComp.rank === 1) {
      // Leading: distance ahead of P2
      const p2 = sortedCompetitors.find((c) => c.rank === 2);
      if (!p2) return { text: 'P1 LEADER 👑', isLead: true };
      const diffPercent = Math.max(0, playerComp.progressPercent - p2.progressPercent);
      const meters = Math.round(diffPercent * 4.2);
      return { text: `👑 P1 (+${meters}m Ahead)`, isLead: true };
    } else {
      // Chasing: distance behind P1
      const leader = sortedCompetitors[0];
      if (!leader) return { text: `P${playerComp.rank}`, isLead: false };
      const diffPercent = Math.max(0, leader.progressPercent - playerComp.progressPercent);
      const meters = Math.round(diffPercent * 4.2);
      return { text: `P${playerComp.rank} (-${meters}m Behind)`, isLead: false };
    }
  }, [playerComp, sortedCompetitors]);

  const activeCircuit = useMemo(() => {
    return RACE_CIRCUITS.find((c) => c.id === currentCircuitId) || RACE_CIRCUITS[0];
  }, [currentCircuitId]);

  const targetElement = portalTarget || getActivePortalTarget();

  return (
    <div className="w-full bg-slate-900/95 rounded-2xl border border-slate-800 p-3.5 sm:p-5 shadow-2xl mb-4 select-none transition-all">
      {/* Live Toast Notification (Join / Leave / Ready) */}
      {joinNotification && (
        <div
          className={`mb-3 p-2.5 rounded-xl border text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            joinNotification.type === 'ready'
              ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300'
              : joinNotification.type === 'join'
              ? 'bg-amber-950/85 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/85 border-rose-500/40 text-rose-300'
          }`}
        >
          <Bell className="w-4 h-4 animate-bounce shrink-0" />
          <span>{joinNotification.message}</span>
        </div>
      )}

      {/* 1. Header Bar: Circuit Info, Modes, Garage, Audio & Room Code */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/90">
        {/* Left: Circuit & Live Indicator */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/10"
            title={`Active Circuit: ${activeCircuit.name}`}
          >
            <span>{activeCircuit.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                {activeCircuit.name}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Heat
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>{activeCircuit.distance}</span>
              <span>•</span>
              <span className="text-slate-500">{activeCircuit.description}</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Opponents, Garage, Audio, Room */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Opponent Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpponentMode('ai')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                opponentMode === 'ai'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Race against smart AI pacesetter bots"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Bots</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpponentMode('peers')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                opponentMode === 'peers'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Race against simulated classroom peers roster"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Classroom Peers</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpponentMode('ghost')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                opponentMode === 'ghost'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Solo practice against a custom target ghost WPM"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Solo Ghost</span>
            </button>
          </div>

          {/* Difficulty (If in AI mode) */}
          {opponentMode === 'ai' && (
            <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['rookie', 'pro', 'elite'] as BotDifficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-0.5 rounded-lg font-medium capitalize text-[11px] transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Garage / Skins Button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsGarageOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            title="Customize your vehicle and paint skin"
          >
            <span>{selectedAvatar}</span>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="hidden sm:inline">Garage</span>
          </button>

          {/* Web Audio Toggle */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleMute}
            className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-slate-800 border-slate-700 text-secondary'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={!isMuted ? 'Mute Race Sound Effects' : 'Unmute Race Sound Effects'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Room Setup Button (No Room active by default) */}
          {!roomCode ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setModalTab('create');
                setIsShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-300 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              title="Create a private room for your class or enter a room code"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Create / Join Room</span>
            </button>
          ) : (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setModalTab('share');
                  setIsShareModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-mono font-bold transition-all cursor-pointer border border-amber-500/30 shadow-sm"
                title="Classroom Room Code & Share Link"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Room: {roomCode}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-sans font-medium flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-secondary" />
                  {allActiveMembers.length}/5 Racers
                </span>
                <Share2 className="w-3 h-3 text-slate-400" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleLeaveRoom}
                className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors ml-1 cursor-pointer"
                title="Leave Room"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Classroom Battle Start / Ready Action Bar */}
      {roomCode && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-emerald-500/30 shadow-xl mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                isReady
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {isReady ? <Check className="w-6 h-6 stroke-[3]" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {isRaceStarted
                    ? '🏁 Race In Progress'
                    : isReady
                    ? '✅ You Are Ready!'
                    : '⚡ Ready for the Heat?'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {readyMembersCount}/{allActiveMembers.length} Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700">
                  Max 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isRaceStarted
                  ? 'Heat underway! Type as fast and accurately as you can!'
                  : isReady
                  ? areAllMembersReady
                    ? 'All members ready! 5-second countdown starting...'
                    : 'Waiting for remaining racers to click Start...'
                  : 'Click START to ready up. 5-second countdown begins once all racers click Start.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isRaceStarted ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleToggleReady}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  isReady
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-green-600 text-slate-950 shadow-emerald-500/30 animate-pulse'
                }`}
              >
                {isReady ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>I&apos;M READY (Click to Cancel)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>START / I&apos;M READY ▶</span>
                  </>
                )}
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>RACE LIVE</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Telemetry HUD: F1 Distance Split, Streak Nitro Gauge, and Quick Emotes */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950/90 rounded-xl px-3.5 py-2.5 border border-slate-800/80 mb-3">
        {/* Left: F1 Split Delta Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${
              telemetryDelta.isLead
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{telemetryDelta.text}</span>
          </div>

          {/* Transient Overtake Notice */}
          {overtakeNotice && (
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{overtakeNotice}</span>
            </div>
          )}
        </div>

        {/* Center: Nitro Boost Meter */}
        <div className="flex items-center gap-2 flex-1 max-w-xs px-2">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold">
            <Zap
              className={`w-3.5 h-3.5 transition-colors ${
                isNitroActive ? 'text-amber-400 fill-amber-400 animate-spin' : 'text-slate-400'
              }`}
            />
            <span className={isNitroActive ? 'text-amber-400' : 'text-slate-400'}>
              {isNitroActive ? 'NITRO READY!' : `Nitro ${nitroPercent}%`}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isNitroActive
                  ? 'bg-gradient-to-r from-amber-400 via-secondary to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
              style={{ width: `${nitroPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Classroom Emote Bar */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline mr-1">
            React:
          </span>
          {['🔥', '💨', '🚀', '🎯', '👏', '🏆'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleTriggerEmote(emoji)}
              className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-sm transition-transform active:scale-125 cursor-pointer"
              title={`Send emote: ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Speedway Track */}
      <div className="relative flex flex-col gap-2.5 bg-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800/90 overflow-hidden">
        {/* 5-Second Dramatic Synchronized Countdown Overlay */}
        {countdownSeconds !== null && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-in fade-in">
            <div className="text-6xl sm:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 animate-bounce">
              {countdownSeconds === 0 ? 'GO! 🚀' : countdownSeconds}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-200 tracking-wider uppercase mt-2">
              {countdownSeconds === 0 ? 'Green Light! Type Now!' : 'Starting in...'}
            </div>
          </div>
        )}

        {/* Finish Line Ribbon & Flag Marker */}
        <div className="absolute right-8 top-0 bottom-0 w-3 flex flex-col items-center justify-between border-l-2 border-dashed border-amber-400/70 pointer-events-none z-10 opacity-70">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000,#000_6px,#fff_6px,#fff_12px)] opacity-50" />
        </div>

        {/* Floating Animated Emote Bubbles */}
        {floatingEmotes.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-none z-30 text-2xl animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{
              left: `${item.xPercent}%`,
              bottom: '40%',
              transform: 'translateX(-50%)',
            }}
          >
            <span className="inline-block animate-bounce">{item.emoji}</span>
          </div>
        ))}

        {competitors.map((comp) => {
          const isPlayer = comp.id === 'player';
          const isLead = comp.rank === 1;

          return (
            <div
              key={comp.id}
              className={`relative h-14 sm:h-16 rounded-xl p-2 flex items-center border transition-all ${
                isPlayer
                  ? 'bg-secondary/15 border-secondary/50 ring-1 ring-secondary/30'
                  : 'bg-slate-900/60 border-slate-800/90'
              }`}
            >
              {/* Lane Info Column */}
              <div className="flex items-center gap-2 w-36 sm:w-48 shrink-0 z-20">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    comp.rank === 1
                      ? 'bg-amber-400 text-slate-950 font-black shadow'
                      : comp.rank === 2
                      ? 'bg-slate-300 text-slate-950 font-black'
                      : comp.rank === 3
                      ? 'bg-amber-700 text-amber-100 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{comp.rank}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`text-xs font-bold truncate ${
                        isPlayer ? 'text-secondary font-mono' : 'text-slate-200'
                      }`}
                    >
                      {comp.name}
                    </span>

                    {/* Right Sign (Checkmark) if ready in Room mode */}
                    {roomCode && (
                      <span className="shrink-0">
                        {comp.isReady ? (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold"
                            title="Ready to race!"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span className="hidden sm:inline">Ready</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-mono"
                            title="Waiting for Start"
                          >
                            <Clock className="w-2.5 h-2.5" />
                            <span className="hidden sm:inline">Waiting</span>
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span>{comp.speedWpm} WPM</span>
                    <span>•</span>
                    <span>{Math.round(comp.progressPercent)}%</span>
                  </div>
                </div>
              </div>

              {/* Race Track Speedway */}
              <div className="relative flex-1 h-full flex items-center px-4 overflow-hidden">
                {/* Lane Dashed Center Guidance Line */}
                <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-slate-800" />

                {/* Animated Vehicle / Car (NO BOX! Shows ONLY the car!) */}
                <div
                  className="absolute transition-all duration-300 ease-out flex items-center z-20 pointer-events-none"
                  style={{
                    left: `${Math.min(92, Math.max(2, comp.progressPercent))}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Nitro Flame or Plasma Boost Trail Behind Car Exhaust */}
                  {isActive && comp.progressPercent > 1 && (
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                      {isPlayer && isNitroActive ? (
                        <div className="flex items-center -space-x-1.5 animate-pulse">
                          <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300 animate-ping" />
                          <Flame className="w-6 h-6 text-cyan-400 fill-cyan-400 -rotate-90 filter drop-shadow-[0_0_8px_#00f0ff]" />
                          <Flame className="w-4 h-4 text-amber-300 fill-amber-300 -rotate-90" />
                        </div>
                      ) : (comp.speedWpm ?? 0) > 0 ? (
                        <div className="flex items-center -space-x-1 animate-pulse">
                          <Flame className="w-5 h-5 text-orange-500 fill-orange-500 -rotate-90" />
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 -rotate-90" />
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Sleek Racing Car Vector (Zero background box, clean aerodynamic vehicle) */}
                  <RacerVehicle
                    avatar={comp.avatar}
                    color={comp.color}
                    isNitro={isPlayer && isNitroActive}
                    isLeader={isLead}
                    size="md"
                  />
                </div>
              </div>

              {/* Finish Checkpoint Marker */}
              <div className="shrink-0 pl-2 z-20">
                {comp.progressPercent >= 100 ? (
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-md uppercase shadow">
                    Finished!
                  </span>
                ) : (
                  <Flag className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}

        {/* Waiting notification if only 1 member in the room */}
        {roomCode && remoteMembers.filter((m) => m.id !== myMemberId).length === 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-dashed border-amber-500/30 text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner mt-1">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Users className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Waiting for students to join room</span>
                  <span className="px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {roomCode}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Only live joined members race in this classroom heat. No dummy bots are shown.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalTab('share');
                setIsShareModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Code & Link</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Grand Prix Victory Podium (When race is complete) */}
      {isCompleted && (
        <div className="mt-4 p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Trophy Standing & Performance Badges */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Trophy className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  {playerComp.rank === 1
                    ? '🏆 1st Place Grand Prix Champion!'
                    : `🏁 Heat Complete! Placed #${playerComp.rank} on the Podium`}
                </h4>
                <div className="flex items-center flex-wrap gap-2 text-xs text-slate-300 mt-1 font-mono">
                  <span className="text-secondary font-bold">{userWpm} WPM</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{userAccuracy}% Accuracy</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                    +{playerComp.rank === 1 ? 150 : playerComp.rank === 2 ? 100 : 75} XP Earned
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons: Rematch, Next Circuit, Detailed Analysis */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Rematch Button */}
              {onRematch && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setIsReady(false);
                    setIsRaceStarted(false);
                    setCountdownSeconds(null);
                    hasTriggeredCountdownRef.current = false;
                    if (roomCode) {
                      try {
                        const ch = new BroadcastChannel('msk_race_room_' + roomCode);
                        ch.postMessage({ type: 'REMATCH' });
                        ch.close();
                      } catch {}
                    }
                    onRematch();
                  }}
                  className="px-4 py-2 bg-secondary hover:bg-orange-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-secondary/30 transition-transform active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Race Again (Rematch)</span>
                </button>
              )}

              {/* Detailed Breakdown Button */}
              {onOpenDetailedStats && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onOpenDetailedStats}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>Detailed Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* 3-Step 3D-styled Champions Podium */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-end justify-center gap-2 sm:gap-4 max-w-md mx-auto">
            {/* 2nd Place */}
            {sortedCompetitors[1] && (
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 flex items-center justify-center">
                  <RacerVehicle
                    avatar={sortedCompetitors[1].avatar}
                    color={sortedCompetitors[1].color}
                    size="sm"
                  />
                </div>
                <div className="text-[11px] font-bold text-slate-300 truncate max-w-[90px]">
                  {sortedCompetitors[1].name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {sortedCompetitors[1].speedWpm} WPM
                </div>
                <div className="w-full h-16 bg-slate-800 border-t-2 border-slate-300 rounded-t-lg flex items-center justify-center font-black text-slate-300 text-sm shadow">
                  🥈 2nd
                </div>
              </div>
            )}

            {/* 1st Place Champion */}
            {sortedCompetitors[0] && (
              <div className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center mb-2 animate-bounce">
                  <span className="text-sm">👑</span>
                  <RacerVehicle
                    avatar={sortedCompetitors[0].avatar}
                    color={sortedCompetitors[0].color}
                    size="md"
                    isLeader={true}
                  />
                </div>
                <div className="text-xs font-black text-amber-300 truncate max-w-[100px]">
                  {sortedCompetitors[0].name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold">
                  {sortedCompetitors[0].speedWpm} WPM
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-amber-500/30 to-amber-500/50 border-t-4 border-amber-400 rounded-t-lg flex items-center justify-center font-black text-amber-300 text-base shadow-lg">
                  🥇 1st
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedCompetitors[2] && (
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 flex items-center justify-center">
                  <RacerVehicle
                    avatar={sortedCompetitors[2].avatar}
                    color={sortedCompetitors[2].color}
                    size="sm"
                  />
                </div>
                <div className="text-[11px] font-bold text-slate-400 truncate max-w-[90px]">
                  {sortedCompetitors[2].name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {sortedCompetitors[2].speedWpm} WPM
                </div>
                <div className="w-full h-12 bg-slate-900 border-t-2 border-amber-700 rounded-t-lg flex items-center justify-center font-black text-amber-600 text-xs shadow">
                  🥉 3rd
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Racer Garage Modal: Select Vehicle & Paint Color */}
      {isMounted && isGarageOpen && targetElement && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsGarageOpen(false);
              onRefocus?.();
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white">Racer Garage & Skins</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGarageOpen(false);
                  onRefocus?.();
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Selection */}
            <div className="mt-4">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                Choose Your Vehicle
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VEHICLE_SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    type="button"
                    onClick={() => saveCustomization(skin.avatar, selectedColor)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedAvatar === skin.avatar
                        ? 'bg-secondary/20 border-secondary ring-1 ring-secondary'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-7 flex items-center">
                      <RacerVehicle avatar={skin.avatar} color={selectedColor} size="sm" />
                    </div>
                    <span className="text-xs font-bold text-white">{skin.name}</span>
                    <span className="text-[10px] text-slate-400">{skin.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-4">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Paint & Glow
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => saveCustomization(selectedAvatar, col.hex)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform cursor-pointer ${
                      selectedColor === col.hex ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor === col.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Vehicle Track Preview */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Live Track Vehicle Preview</span>
                <span className="text-emerald-400">• Ready</span>
              </div>
              <div className="py-2.5 flex items-center justify-center">
                <RacerVehicle avatar={selectedAvatar} color={selectedColor} size="lg" isNitro={true} />
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <span>{studentName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-secondary">Custom Livery</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsGarageOpen(false);
                onRefocus?.();
              }}
              className="mt-5 w-full py-2.5 bg-secondary hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Equip & Return to Race
            </button>
          </div>
        </div>,
        targetElement
      )}

      {/* 6. Room Share, Create & Join Modal with Usage Guide */}
      {isMounted && isShareModalOpen && targetElement && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsShareModalOpen(false);
              onRefocus?.();
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="bg-slate-900 border border-slate-750/80 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    {roomCode ? 'Classroom Room Code & Link' : 'Classroom Multiplayer Setup'}
                    {roomCode ? (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Room: {roomCode}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Create or Join
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {roomCode
                      ? 'Share credentials with students to race together in real time'
                      : 'Host a private race heat for your class or enter a code to join'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsShareModalOpen(false);
                  onRefocus?.();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {!roomCode ? (
              /* NO ACTIVE ROOM: SHOW CREATE ROOM & JOIN ROOM OPTIONS */
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-1">
                {/* OPTION 1: CREATE A ROOM (TEACHER / HOST) */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-colors shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Host / Teacher
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Create</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1.5">Create New Room</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Generate a unique private classroom room code and direct invite link. Share it on your smartboard or WhatsApp group to race together.
                    </p>
                  </div>

                  <form onSubmit={handleCreateRoom} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">
                        Enter Your Name (Teacher / Host): <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={createHostName}
                        onChange={(e) => setCreateHostName(e.target.value)}
                        placeholder="e.g. Teacher Sumit"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">
                        Custom Code (Optional):
                      </label>
                      <input
                        type="text"
                        value={createCustomName}
                        onChange={(e) => setCreateCustomName(e.target.value.toUpperCase())}
                        placeholder="e.g. 501 (Leave blank for auto-generate)"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Generate & Create Room</span>
                    </button>
                  </form>
                </div>

                {/* OPTION 2: JOIN A ROOM (STUDENT / PARTICIPANT) */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-secondary/30 flex flex-col justify-between space-y-4 hover:border-secondary/50 transition-colors shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Student / Participant
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Join</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1.5">Join Existing Room</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter the room code shared by your teacher or classmate (e.g. <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">MSK-600</code>) to enter the heat.
                    </p>
                  </div>

                  <form onSubmit={handleJoinCustomRoom} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">
                        Enter Your Name: <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        value={joinStudentName}
                        onChange={(e) => {
                          setJoinStudentName(e.target.value);
                          if (joinError) setJoinError(null);
                        }}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-secondary/60 rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 transition-colors"
                        required
                        autoFocus={!roomCode}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1">
                        Enter Room Code: <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        value={customJoinInput}
                        onChange={(e) => {
                          setCustomJoinInput(e.target.value.toUpperCase());
                          if (joinError) setJoinError(null);
                        }}
                        placeholder="e.g. MSK-600"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-secondary/60 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none placeholder:text-slate-600 transition-colors"
                        required
                      />
                      {joinError && (
                        <div className="text-[10px] text-rose-400 mt-1">{joinError}</div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-secondary hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>{joinSuccess ? 'Joined!' : 'Join Room Heat'}</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* ACTIVE ROOM CREDENTIALS (HORIZONTAL 2 COLUMNS) */
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-1">
                {/* LEFT COLUMN: Room Code, Direct Link, QR Scan & Switch Room */}
                <div className="space-y-4 flex flex-col justify-between">
                  {/* 1. Monospace Room Code with Copy Button */}
                  <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-inner">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Classroom Room Code</span>
                      <span className="text-[10px] text-amber-400/90 font-sans font-semibold">Share with class</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
                        {roomCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRoomCode}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 border border-slate-700 shadow-sm"
                        title="Copy room code"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Direct Invite Link with Copy Link Icon & Button */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-300 mb-1.5 font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-secondary" />
                        <span>Direct Join Link</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">1-Click Join</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                      <input
                        type="text"
                        readOnly
                        value={inviteLink}
                        className="bg-transparent text-xs text-slate-300 font-mono flex-1 outline-none px-2 truncate selection:bg-secondary/30"
                      />
                      <button
                        type="button"
                        onClick={handleCopyInviteLink}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-orange-600 text-white font-bold rounded-md text-xs shadow transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Copy direct invite link"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. QR Code Quick Scan Row */}
                  <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="p-1.5 bg-white rounded-lg shadow-md w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                        <rect x="10" y="10" width="24" height="24" rx="4" />
                        <rect x="14" y="14" width="16" height="16" fill="white" />
                        <rect x="18" y="18" width="8" height="8" rx="2" />

                        <rect x="66" y="10" width="24" height="24" rx="4" />
                        <rect x="70" y="14" width="16" height="16" fill="white" />
                        <rect x="74" y="18" width="8" height="8" rx="2" />

                        <rect x="10" y="66" width="24" height="24" rx="4" />
                        <rect x="14" y="70" width="16" height="16" fill="white" />
                        <rect x="18" y="74" width="8" height="8" rx="2" />

                        {/* QR Matrix Elements */}
                        <rect x="42" y="14" width="6" height="6" />
                        <rect x="52" y="14" width="6" height="6" />
                        <rect x="42" y="24" width="6" height="6" />
                        <rect x="52" y="32" width="6" height="6" />
                        <rect x="14" y="44" width="6" height="6" />
                        <rect x="24" y="44" width="6" height="6" />
                        <rect x="34" y="44" width="6" height="6" />
                        <rect x="44" y="44" width="12" height="12" rx="2" fill="#ff6b00" />
                        <rect x="64" y="44" width="6" height="6" />
                        <rect x="74" y="44" width="6" height="6" />
                        <rect x="42" y="66" width="6" height="6" />
                        <rect x="52" y="66" width="6" height="6" />
                        <rect x="66" y="66" width="6" height="6" />
                        <rect x="76" y="66" width="6" height="6" />
                        <rect x="42" y="76" width="6" height="6" />
                        <rect x="66" y="76" width="6" height="6" />
                        <rect x="56" y="84" width="6" height="6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span>Scan to Join Instantly</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        Students can scan this QR code with any smartphone or tablet camera to open the track directly.
                      </div>
                    </div>
                  </div>

                  {/* 4. Switch to another room heat */}
                  <form onSubmit={handleJoinCustomRoom} className="flex items-center gap-2 bg-slate-950/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-mono pl-2 shrink-0">Switch:</span>
                    <input
                      type="text"
                      value={customJoinInput}
                      onChange={(e) => setCustomJoinInput(e.target.value.toUpperCase())}
                      placeholder="e.g. MSK-830"
                      className="bg-transparent text-xs text-white font-mono flex-1 outline-none px-2 py-1 placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 border border-slate-700"
                    >
                      {joinSuccess ? 'Joined!' : 'Switch Room'}
                    </button>
                  </form>
                </div>

                {/* RIGHT COLUMN: Live Classroom Members Roster & Usage Guide */}
                <div className="space-y-4 flex flex-col justify-between">
                  {/* 1. Live Classroom Members Roster */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex-1 flex flex-col">
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80 shrink-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Users className="w-4 h-4" />
                        <span>Live Classroom Members ({allActiveMembers.length}/5)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Heat
                      </span>
                    </div>

                    {/* Member Cards List */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {allActiveMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`p-2.5 rounded-xl flex items-center justify-between text-xs border transition-colors ${
                            member.isSelf
                              ? 'bg-secondary/15 border-secondary/40 shadow-sm'
                              : 'bg-slate-900/90 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow shrink-0"
                              style={{ backgroundColor: member.color || '#ff6b00' }}
                            >
                              <span>{member.avatar || '🏎️'}</span>
                            </div>
                            <div className="truncate">
                              <div className="font-bold text-white flex items-center gap-1.5 truncate">
                                <span>{member.name}</span>
                                {member.isSelf && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary/30 text-secondary border border-secondary/40">
                                    You
                                  </span>
                                )}
                                {member.isHost && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5" />
                                    Host
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                <span className="text-secondary font-bold">{member.speedWpm || 0} WPM</span>
                                <span>•</span>
                                <span>{Math.round(member.progressPercent || 0)}% Done</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right flex items-center gap-2">
                            {/* Member Ready Sign (Right Sign) */}
                            {member.isReady ? (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-md text-[10px] font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Ready</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[10px] font-mono flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Waiting</span>
                              </span>
                            )}

                            {member.isCompleted || member.progressPercent >= 100 ? (
                              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md text-[10px] font-bold uppercase">
                                Finished 🏁
                              </span>
                            ) : member.speedWpm > 0 || member.progressPercent > 0 ? (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-bold uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Racing
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {allActiveMembers.length === 1 && (
                      <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                        <Users className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                          Only you are in this room right now. Share the code or invite link on smartboard/chat so students can join. No dummy bots will be added!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2. Step-by-Step Usage Guide (Compact) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-200 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>How It Works</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <strong className="text-slate-200 block mb-0.5">1. Share Code:</strong>
                        Copy direct link or room code and send to students.
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <strong className="text-slate-200 block mb-0.5">2. Real-Time Race:</strong>
                        Live progress & speed sync immediately for all peers.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              {roomCode ? (
                <button
                  type="button"
                  onClick={handleLeaveRoom}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  title="Disconnect and leave this classroom room"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Room</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono">
                  Solo / AI Mode (No active room)
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsShareModalOpen(false);
                  onRefocus?.();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>,
        targetElement
      )}
    </div>
  );
}
