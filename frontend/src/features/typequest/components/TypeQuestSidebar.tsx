'use client';

import React from 'react';
import {
  Code2,
  GraduationCap,
  Type,
  BookOpen,
  Clock,
  FileEdit,
  CheckCircle2,
  History,
  Sliders,
  X,
  ChevronRight,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';

import {
  PracticeMode,
  AcademyStage,
  CodeLanguage,
  TimedDuration,
  UserTypingStats,
  SoundEffectType,
} from '../types';

import { ACADEMY_LESSONS } from '../data/lessons';
import { CODE_SNIPPETS } from '../data/codeSnippets';

interface TypeQuestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
  stage: AcademyStage;
  onSelectStage: (stage: AcademyStage) => void;
  codeLang: CodeLanguage;
  onSelectCodeLang: (lang: CodeLanguage) => void;
  codeLevel: number;
  onSelectCodeLevel: (lvl: number) => void;
  timedDuration: TimedDuration;
  onSelectTimedDuration: (dur: TimedDuration) => void;
  onOpenCustomModal: () => void;
  stats: UserTypingStats;
  soundType: SoundEffectType;
  onUpdateSoundType: (sound: SoundEffectType) => void;
  soundVolume: number;
  onUpdateSoundVolume: (vol: number) => void;
  strictMode: boolean;
  onToggleStrictMode: () => void;
  onOpenAchievements?: () => void;
  onOpenCertificate?: () => void;
}

export default function TypeQuestSidebar({
  isOpen,
  onClose,
  mode,
  onSelectMode,
  stage,
  onSelectStage,
  codeLang,
  onSelectCodeLang,
  codeLevel,
  onSelectCodeLevel,
  timedDuration,
  onSelectTimedDuration,
  onOpenCustomModal,
  stats,
  soundType,
  onUpdateSoundType,
  soundVolume,
  onUpdateSoundVolume,
  strictMode,
  onToggleStrictMode,
  onOpenAchievements,
  onOpenCertificate,
}: TypeQuestSidebarProps) {
  const [sidebarTab, setSidebarTab] = React.useState<'curriculum' | 'history' | 'settings'>('curriculum');

  const currentLangSnippets = React.useMemo(() => {
    return CODE_SNIPPETS.filter((s) => s.language === codeLang);
  }, [codeLang]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-auto w-80 sm:w-88 bg-slate-900 border-r border-slate-800/90 flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-2xl lg:shadow-none ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              TQ
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight">TypeQuest Academy</h2>
              <p className="text-[11px] text-slate-400">Mastery Training Path</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1 text-xs font-medium">
          <button
            onClick={() => setSidebarTab('curriculum')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              sidebarTab === 'curriculum'
                ? 'bg-slate-800 text-secondary font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lessons</span>
          </button>
          <button
            onClick={() => setSidebarTab('history')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              sidebarTab === 'history'
                ? 'bg-slate-800 text-secondary font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Scores</span>
          </button>
          <button
            onClick={() => setSidebarTab('settings')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              sidebarTab === 'settings'
                ? 'bg-slate-800 text-secondary font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 no-scrollbar">
          {/* TAB 1: CURRICULUM / MODES */}
          {sidebarTab === 'curriculum' && (
            <div className="space-y-4">
              {/* Primary Modes Selector */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 block">
                  Select Training Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onSelectMode('code')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'code'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <Code2 className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Code Syntax</div>
                      <div className="text-[9px] opacity-80 font-normal">36 Levels</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onSelectMode('academy')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'academy'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Academy</div>
                      <div className="text-[9px] opacity-80 font-normal">24 Stages</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onSelectMode('race')}
                    className={`col-span-2 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'race'
                        ? 'bg-gradient-to-r from-secondary to-orange-500 text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-orange-400 hover:bg-slate-800 border border-orange-500/30'
                    }`}
                  >
                    <span className="text-base">🏎️</span>
                    <div className="text-left truncate flex-1">
                      <div className="flex items-center justify-between">
                        <span>Classroom Battle</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-secondary text-white font-mono rounded">Race Track</span>
                      </div>
                      <div className="text-[9px] opacity-80 font-normal">Multiplayer &amp; AI Bot Race</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onSelectMode('words')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'words'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <Type className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Common Words</div>
                      <div className="text-[9px] opacity-80 font-normal">High Frequency</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onSelectMode('sentences')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'sentences'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Passages</div>
                      <div className="text-[9px] opacity-80 font-normal">Wisdom Quotes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onSelectMode('timed')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'timed'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Timed Challenge</div>
                      <div className="text-[9px] opacity-80 font-normal">{timedDuration}s Test</div>
                    </div>
                  </button>

                  <button
                    onClick={onOpenCustomModal}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      mode === 'custom'
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <FileEdit className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left truncate">
                      <div>Custom Text</div>
                      <div className="text-[9px] opacity-80 font-normal">Paste Notes</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sub-Section A: CODE MODE EXPLORER */}
              {mode === 'code' && (
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Programming Languages
                    </span>
                    <span className="text-[10px] font-mono text-secondary">6 Levels Each</span>
                  </div>

                  {/* Language Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['javascript', 'python', 'cpp', 'html-css', 'sql', 'react'] as CodeLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          onSelectCodeLang(lang);
                          onSelectCodeLevel(1);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase truncate cursor-pointer ${
                          codeLang === lang
                            ? 'bg-secondary text-white shadow-xs'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang.replace('-', ' & ')}
                      </button>
                    ))}
                  </div>

                  {/* Progressive Levels List for Selected Language */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold block">
                      {codeLang.toUpperCase()} Curriculum (Levels 1 - 6):
                    </span>
                    {currentLangSnippets.map((snip) => {
                      const lvlNum = snip.levelNumber || 1;
                      const isSelected = codeLevel === lvlNum;
                      return (
                        <button
                          key={snip.id}
                          onClick={() => onSelectCodeLevel(lvlNum)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 text-white border-secondary/40 shadow-sm'
                              : 'bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800/50 border-slate-850'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                              <span className="text-secondary font-mono font-bold">L{lvlNum}</span>
                              <span className="truncate">{snip.title.replace(/^Level \d+:\s*/, '')}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">{snip.description}</div>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0 ${
                              snip.difficulty === 'Beginner'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : snip.difficulty === 'Intermediate'
                                ? 'bg-blue-500/15 text-blue-400'
                                : 'bg-purple-500/15 text-purple-400'
                            }`}
                          >
                            {snip.difficulty}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Section B: ACADEMY 24 STAGES LIST */}
              {mode === 'academy' && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Touch Typing Academy (24 Stages)
                    </span>
                    <span className="text-[10px] text-secondary font-mono">Basic → Pro</span>
                  </div>

                  <div className="space-y-1 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                    {ACADEMY_LESSONS.map((lesson, idx) => {
                      const isSelected = stage === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectStage(lesson.id)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 text-white border-secondary/40 font-bold shadow-sm'
                              : 'bg-slate-950/60 text-slate-400 hover:text-white border-slate-850'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="text-secondary font-mono font-bold mr-1.5">S{idx + 1}</span>
                            <span className="truncate">{lesson.title.split(':')[1]?.trim() || lesson.title}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 flex-shrink-0">
                            {lesson.targetWpm} WPM
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Section C: TIMED DURATION SELECTION */}
              {mode === 'timed' && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Speed Test Duration
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([15, 30, 60, 120] as TimedDuration[]).map((dur) => (
                      <button
                        key={dur}
                        onClick={() => onSelectTimedDuration(dur)}
                        className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          timedDuration === dur
                            ? 'bg-secondary text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORY & USER SCORES */}
          {sidebarTab === 'history' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Your Practice Performance
              </span>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Best Speed</div>
                  <div className="text-xl font-bold font-mono text-secondary">{stats.bestWpm} WPM</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Acc</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">{stats.averageAccuracy}%</div>
                </div>
              </div>

              {/* Recent Tests List */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                  Recent Test Sessions:
                </span>
                {stats.recentResults && stats.recentResults.length > 0 ? (
                  stats.recentResults.slice(0, 8).map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-950/80 p-2 rounded-xl border border-slate-850 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-white truncate">{res.modeLabel}</div>
                        <div className="text-[10px] text-slate-500">{new Date(res.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-secondary font-mono font-bold">{res.wpm} WPM</span>
                        <div className="text-[10px] text-emerald-400">{res.accuracy}% acc</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No tests recorded yet. Complete your first session to see your progress here!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO & APP SETTINGS */}
          {sidebarTab === 'settings' && (
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Preferences & Audio
              </span>

              {/* Sound Theme */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-secondary" /> Audio Switch Theme:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['mechanical', 'typewriter', 'bubble', 'off'] as SoundEffectType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => onUpdateSoundType(type)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                        soundType === type
                          ? 'bg-secondary text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {type === 'off' ? 'Mute' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              {soundType !== 'off' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Sound Volume:</span>
                    <span className="font-mono text-secondary font-bold">{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => onUpdateSoundVolume(parseFloat(e.target.value))}
                    className="w-full accent-secondary h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Strict Mode Toggle */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Strict Accuracy Mode</div>
                    <div className="text-[10px] text-slate-400">Must correct mistakes before moving forward</div>
                  </div>
                  <button
                    onClick={onToggleStrictMode}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      strictMode ? 'bg-secondary' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        strictMode ? 'left-5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Gamification Shortcuts */}
        {(onOpenAchievements || onOpenCertificate) && (
          <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2">
            {onOpenAchievements && (
              <button
                type="button"
                onClick={onOpenAchievements}
                className="flex-1 py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Badges</span>
              </button>
            )}
            {onOpenCertificate && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="flex-1 py-1.5 px-2 bg-gradient-to-r from-secondary/80 to-amber-500/80 hover:brightness-110 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Certificate</span>
              </button>
            )}
          </div>
        )}

        {/* Sidebar Bottom Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-secondary" />
            <span>Tests: {stats.totalTests}</span>
          </div>
          <span className="font-mono text-slate-400">MSK Institute</span>
        </div>
      </aside>
    </>
  );
}
