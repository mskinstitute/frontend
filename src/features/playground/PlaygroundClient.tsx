'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  SupportedLanguage, 
  ConsoleMessage, 
  PlaygroundSettings, 
  DEFAULT_PLAYGROUND_SETTINGS,
  CursorPosition,
  PlaygroundFile,
  PlaygroundFolder,
  SidebarView,
  SqlQueryResult,
  CodeChallenge,
  CodeTemplate
} from './types';
import { STARTER_TEMPLATES } from './templates';
import CodeEditor from './CodeEditor';
import EmptyEditorState from './EmptyEditorState';
import WebPreview from './WebPreview';
import MarkdownPreview from './MarkdownPreview';
import MarkdownToolbar from './MarkdownToolbar';
import ConsoleOutput from './ConsoleOutput';
import SqlTableOutput from './SqlTableOutput';
import MultiTestcaseRunner from './MultiTestcaseRunner';
import DataStructureVisualizer from './DataStructureVisualizer';
import { formatCode } from './codeFormatter';
import PlaygroundSettingsModal from './PlaygroundSettingsModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import CodeScreenshotModal from './CodeScreenshotModal';
import ChallengesSidebar from './ChallengesSidebar';
import ExamplesSidebar from './ExamplesSidebar';
import AiExplainerModal from './AiExplainerModal';
import MobileSymbolsBar from './MobileSymbolsBar';
import ActivityBar from './ActivityBar';
import ActionTooltip from './ActionTooltip';
import FileExplorerSidebar, { getFileIcon, detectLanguageFromExtension } from './FileExplorerSidebar';
import SearchSidebar from './SearchSidebar';
import { 
  Play, RotateCcw, Copy, Download, Maximize2, Minimize2, 
  Code2, Sparkles, Terminal, Eye, Check, Loader2, Settings, 
  Keyboard, SplitSquareHorizontal, SplitSquareVertical, 
  GitBranch, GripVertical, GripHorizontal, EyeOff, Layout,
  X, CheckCircle2, ChevronRight, FilePlus, Share2, Archive, ChevronDown, Save, Camera,
  XCircle, FolderPlus, ChevronsDownUp, FileUp, FolderUp, FolderInput, Upload, BookOpen,
  Printer, ExternalLink, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { editor } from 'monaco-editor';
import JSZip from 'jszip';
import ShareModal from './ShareModal';
import { runRemoteCode } from './compilerApi';
import { mysqlEngine } from './mysqlEngine';
import {
  readUploadedFiles,
  parseDirectoryFiles,
  extractZipArchive,
  extractDroppedItems,
  detectPrimaryLanguage,
} from './fileImportUtils';
import {
  loadPlaygroundWorkspace,
  savePlaygroundWorkspace,
  deletePlaygroundWorkspace,
  purgeAllExpiredPlaygroundWorkspaces,
  PLAYGROUND_TTL_MS,
  formatTtlRemaining,
} from '@/lib/studioStorage';

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage?: (names: string | string[]) => Promise<void>;
  globals?: {
    get: (name: string) => any;
    set: (name: string, value: any) => void;
  };
  setStdout?: (options: { batched: (output: string) => void }) => void;
  setStderr?: (options: { batched: (output: string) => void }) => void;
  FS: {
    writeFile: (path: string, data: string | Uint8Array, options?: { encoding?: string }) => void;
    unlink: (path: string) => void;
    mkdirTree?: (path: string) => void;
    mkdir?: (path: string) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
    __mskPyodideInstance?: PyodideInterface;
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<any>;
    __mskSqlInstance?: any;
    __mskSqlDb?: any;
  }
}

interface PlaygroundClientProps {
  initialLanguage?: SupportedLanguage;
  initialCode?: string;
  initialCss?: string;
  initialHtml?: string;
  initialJs?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const SETTINGS_STORAGE_KEY = 'msk_vs_playground_settings';
const SPLIT_STORAGE_KEY = 'msk_playground_splitsize';
const SAVED_FILES_PREFIX = 'msk_playground_saved_files_';
const SAVED_FOLDERS_PREFIX = 'msk_playground_saved_folders_';

export function getFileRelativePath(file: PlaygroundFile, allFolders: PlaygroundFolder[]): string {
  if (!file.folderId) return file.name;
  const folder = allFolders.find((f) => f.id === file.folderId);
  return folder ? `${folder.name}/${file.name}` : file.name;
}

export const PLAYGROUND_LANGUAGES: {
  lang: SupportedLanguage;
  label: string;
  desc: string;
  icon: string;
}[] = [
  { lang: 'cpp', label: 'C++', desc: 'GCC 14.1 (C++20/23 & STL)', icon: '⚙️' },
  { lang: 'c', label: 'C Programming', desc: 'GCC 14.1 (C17/C23)', icon: '🔧' },
  { lang: 'python', label: 'Python', desc: 'Pyodide WebAssembly 3.12', icon: '🐍' },
  { lang: 'sql', label: 'SQL / MySQL', desc: 'Multi-DB & MySQL Engine', icon: '🗄️' },
  { lang: 'java', label: 'Java', desc: 'JDK 17 Runtime', icon: '☕' },
  { lang: 'html', label: 'Web (HTML/CSS)', desc: 'Live Browser Sandbox', icon: '🌐' },
  { lang: 'javascript', label: 'JavaScript', desc: 'ES6+ Runtime', icon: '⚡' },
  { lang: 'typescript', label: 'TypeScript', desc: 'Typed JavaScript', icon: '🔷' },
  { lang: 'markdown', label: 'Markdown', desc: 'Live Markdown Preview', icon: '📝' },
];

export function getLangDisplayName(lang: SupportedLanguage): string {
  switch (lang) {
    case 'cpp': return 'C++';
    case 'c': return 'C';
    case 'python': return 'Python';
    case 'sql': return 'SQL / MySQL';
    case 'java': return 'Java';
    case 'html': return 'HTML / Web';
    case 'javascript': return 'JavaScript';
    case 'typescript': return 'TypeScript';
    case 'markdown': return 'Markdown';
    case 'css': return 'CSS';
    default: return lang;
  }
}

export function getLangIcon(lang: SupportedLanguage): string {
  switch (lang) {
    case 'cpp': return '⚙️';
    case 'c': return '🔧';
    case 'python': return '🐍';
    case 'sql': return '🗄️';
    case 'java': return '☕';
    case 'html': return '🌐';
    case 'javascript': return '⚡';
    case 'typescript': return '🔷';
    case 'markdown': return '📝';
    case 'css': return '🎨';
    default: return '📄';
  }
}

export { generateHtmlFromCss } from '@/lib/webPreviewUtils';
import { generateHtmlFromCss } from '@/lib/webPreviewUtils';

function buildInitialFiles(
  lang: SupportedLanguage,
  code: string,
  companion?: { css?: string; html?: string; js?: string }
): PlaygroundFile[] {
  switch (lang) {
    case 'html':
      return [
        {
          id: 'file-html-1',
          name: 'index.html',
          language: 'html',
          content: code,
          isRemovable: false,
        },
        {
          id: 'file-css-1',
          name: 'style.css',
          language: 'css',
          content:
            companion?.css?.trim() ||
            `/* Custom CSS for MSK Web Project */\n.card:hover {\n  box-shadow: 0 10px 30px rgba(2, 132, 199, 0.4);\n}\n`,
          isRemovable: true,
        },
        {
          id: 'file-js-1',
          name: 'script.js',
          language: 'javascript',
          content:
            companion?.js || `// Custom JavaScript\nconsole.log("Interactive script initialized!");\n`,
          isRemovable: true,
        },
      ];
    case 'css':
      return [
        {
          id: 'file-css-main',
          name: 'style.css',
          language: 'css',
          content: code,
          isRemovable: false,
        },
        {
          id: 'file-html-main',
          name: 'index.html',
          language: 'html',
          content: companion?.html?.trim() || generateHtmlFromCss(code),
          isRemovable: true,
        },
      ];
    case 'python':
      return [
        {
          id: 'file-py-1',
          name: 'main.py',
          language: 'python',
          content: code,
          isRemovable: false,
        },
        {
          id: 'file-py-2',
          name: 'utils.py',
          language: 'python',
          content: `# MSK Institute - Reusable Helper Module\ndef greet(name="Student"):\n    return f"Welcome to MSK Institute, {name}!"\n\ndef calculate_discount(fee, percent):\n    return fee - (fee * percent / 100)\n`,
          isRemovable: true,
        },
      ];
    case 'javascript':
      return [
        {
          id: 'file-js-main',
          name: 'main.js',
          language: 'javascript',
          content: code,
          isRemovable: false,
        },
        {
          id: 'file-js-helper',
          name: 'helper.js',
          language: 'javascript',
          content: `// Helper module\nexport function formatINR(amount) {\n  return "₹" + Number(amount).toLocaleString("en-IN");\n}\n`,
          isRemovable: true,
        },
      ];
    case 'typescript':
      return [
        {
          id: 'file-ts-main',
          name: 'app.ts',
          language: 'typescript',
          content: code,
          isRemovable: false,
        },
      ];
    case 'cpp':
      return [
        {
          id: 'file-cpp-main',
          name: 'main.cpp',
          language: 'cpp',
          content: code,
          isRemovable: false,
        },
      ];
    case 'c':
      return [
        {
          id: 'file-c-main',
          name: 'main.c',
          language: 'c',
          content: code,
          isRemovable: false,
        },
      ];
    case 'java':
      return [
        {
          id: 'file-java-main',
          name: 'Main.java',
          language: 'java',
          content: code,
          isRemovable: false,
        },
      ];
    case 'sql':
      return [
        {
          id: 'file-sql-main',
          name: 'queries.sql',
          language: 'sql',
          content: code,
          isRemovable: false,
        },
      ];
    default:
      return [
        {
          id: 'file-default',
          name: 'code.txt',
          language: lang,
          content: code,
          isRemovable: false,
        },
      ];
  }
}

export default function PlaygroundClient({
  initialLanguage = 'python',
  initialCode,
  initialCss,
  initialHtml,
  initialJs,
  isModal = false,
  onCloseModal,
}: PlaygroundClientProps) {
  const searchParams = useSearchParams();

  // Read URL query params (?lang=python&code=...)
  const queryLang = searchParams?.get('lang') as SupportedLanguage | null;
  const queryCode = searchParams?.get('code');

  const resolvedInitialLang: SupportedLanguage =
    queryLang && STARTER_TEMPLATES[queryLang]
      ? queryLang
      : initialLanguage || 'python';

  const hasIncomingCode = Boolean(
    (queryCode && queryCode.trim().length > 0) ||
    (initialCode !== undefined && initialCode.trim().length > 0)
  );

  const resolvedInitialCode = queryCode
    ? decodeURIComponent(queryCode)
    : initialCode !== undefined && initialCode.trim().length > 0
    ? initialCode
    : STARTER_TEMPLATES[resolvedInitialLang]?.[0]?.code || '';

  // Multi-file state
  const [language, setLanguage] = useState<SupportedLanguage>(resolvedInitialLang);
  const [files, setFiles] = useState<PlaygroundFile[]>(() =>
    hasIncomingCode
      ? buildInitialFiles(resolvedInitialLang, resolvedInitialCode, {
          css: initialCss,
          html: initialHtml,
          js: initialJs,
        })
      : []
  );
  const [folders, setFolders] = useState<PlaygroundFolder[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>(() => {
    if (hasIncomingCode) {
      const initFiles = buildInitialFiles(resolvedInitialLang, resolvedInitialCode, {
        css: initialCss,
        html: initialHtml,
        js: initialJs,
      });
      return initFiles[0]?.id || '';
    }
    return '';
  });
  const [openTabIds, setOpenTabIds] = useState<string[]>(() => {
    if (hasIncomingCode) {
      const initFiles = buildInitialFiles(resolvedInitialLang, resolvedInitialCode, {
        css: initialCss,
        html: initialHtml,
        js: initialJs,
      });
      if (resolvedInitialLang === 'html' || resolvedInitialLang === 'css') {
        return initFiles.slice(0, 2).map((f) => f.id);
      }
      return initFiles.length > 0 ? [initFiles[0].id] : [];
    }
    return [];
  });

  // Sidebar view ('explorer', 'search', 'challenges', 'examples', or closed/null)
  const [sidebarView, setSidebarView] = useState<SidebarView>(null);
  const lastSidebarViewRef = useRef<SidebarView>('explorer');

  useEffect(() => {
    if (sidebarView !== null) {
      lastSidebarViewRef.current = sidebarView;
    }
  }, [sidebarView]);

  const toggleSidebar = useCallback(() => {
    setSidebarView((prev) => (prev !== null ? null : (lastSidebarViewRef.current || 'explorer')));
  }, []);

  // Ensure window stays at top when opening standalone playground page (prevent unwanted auto-scroll when in modal)
  useEffect(() => {
    if (!isModal && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [isModal]);

  // Active terminal / preview / testcases / visualizer tab
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal' | 'testcases' | 'visualizer'>(
    resolvedInitialLang === 'html' || resolvedInitialLang === 'css' || resolvedInitialLang === 'markdown' ? 'preview' : 'terminal'
  );
  const [logs, setLogs] = useState<ConsoleMessage[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    STARTER_TEMPLATES[resolvedInitialLang]?.[0]?.id || ''
  );

  // Custom Standard Input (stdin) for input(), scanf(), cin
  const [stdin, setStdin] = useState<string>('');

  // Share Modal & Download Menu State
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);

  // Matplotlib Plots State
  const [plots, setPlots] = useState<string[]>([]);

  // SQLite & MySQL WebAssembly State
  const [sqlResults, setSqlResults] = useState<SqlQueryResult[]>([]);
  const [isSqlLoading, setIsSqlLoading] = useState<boolean>(false);
  const [sqlViewMode, setSqlViewMode] = useState<'table' | 'log'>('table');
  const [activeSqlDbName, setActiveSqlDbName] = useState<string>('default');
  const [schemaVersion, setSchemaVersion] = useState<number>(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  // New Modals: Code Screenshot & AI Explainer
  const [isScreenshotOpen, setIsScreenshotOpen] = useState<boolean>(false);
  const [isAiExplainerOpen, setIsAiExplainerOpen] = useState<boolean>(false);
  const [aiExplainerError, setAiExplainerError] = useState<string | null>(null);

  // Auto-Save & Dirty Tracking State
  const [unsavedFileIds, setUnsavedFileIds] = useState<Set<string>>(new Set());
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // VS Code Settings
  const [settings, setSettings] = useState<PlaygroundSettings>(DEFAULT_PLAYGROUND_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Status bar cursor line & column
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ lineNumber: 1, column: 1 });

  // Output panel open/close state (automatically open in modal, or when code is run / web preview)
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
    return isModal || resolvedInitialLang === 'html' || resolvedInitialLang === 'css' || resolvedInitialLang === 'markdown';
  });

  // Mobile mode tab switch (editor vs output on screens < 768px)
  const [mobileActiveView, setMobileActiveView] = useState<'editor' | 'output'>('editor');

  // Draggable resizer state (percentage of container for editor)
  const [splitPercent, setSplitPercent] = useState<number>(55);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Fullscreen & Focus Mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Track if user has highlighted text in the editor (for selective SQL execution)
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Active file derivation (null when all tabs are closed)
  const activeFile =
    openTabIds.length > 0
      ? files.find((f) => f.id === activeFileId) ||
        files.find((f) => f.id === openTabIds[0]) ||
        null
      : null;
  const activeCode = activeFile?.content || '';

  // Synchronized refs to guarantee zero stale closures in save & run operations
  const activeFileIdRef = useRef<string>(activeFileId);
  const filesRef = useRef<PlaygroundFile[]>(files);
  const isHydratedRef = useRef<boolean>(hasIncomingCode);

  // Device File & Folder Input Refs & State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);
  const targetUploadFolderIdRef = useRef<string | null>(null);
  const [isOpenMenuOpen, setIsOpenMenuOpen] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  useEffect(() => {
    activeFileIdRef.current = activeFileId;
  }, [activeFileId]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Load saved settings, split percentage, and restore non-expired workspace (12h TTL) on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
      const savedSplit = localStorage.getItem(SPLIT_STORAGE_KEY);
      if (savedSplit) {
        const parsed = parseFloat(savedSplit);
        if (!isNaN(parsed) && parsed >= 20 && parsed <= 80) {
          setSplitPercent(parsed);
        }
      }
    } catch (err) {
      console.warn('Could not read saved playground settings:', err);
    }

    // Check URL hash for shared code: #lang=python&code=...
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashStr = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashStr);
        const sharedLang = hashParams.get('lang') as SupportedLanguage | null;
        const rawCode = hashParams.get('code');

        if (sharedLang && rawCode) {
          let decoded = rawCode;
          try {
            decoded = decodeURIComponent(escape(atob(rawCode)));
          } catch {
            decoded = decodeURIComponent(rawCode);
          }

          setLanguage(sharedLang);
          const newFiles = buildInitialFiles(sharedLang, decoded);
          setFiles(newFiles);
          filesRef.current = newFiles;
          setActiveFileId(newFiles[0].id);
          activeFileIdRef.current = newFiles[0].id;
          setOpenTabIds(newFiles.map((f) => f.id));
          toast.success(`Loaded shared ${sharedLang} workspace!`, { icon: '🔗' });
          isHydratedRef.current = true;
          return;
        }
      }
    } catch (hashErr) {
      console.warn('Could not parse shared URL hash:', hashErr);
    }

    // Purge expired workspaces across all languages on launch
    purgeAllExpiredPlaygroundWorkspaces();

    // If no incoming code/URL query, restore active workspace if saved within 12 hours
    if (!hasIncomingCode) {
      loadPlaygroundWorkspace(resolvedInitialLang)
        .then((saved) => {
          if (saved && Array.isArray(saved.files) && saved.files.length > 0) {
            const loadedFiles = saved.files as PlaygroundFile[];
            const loadedFolders = (saved.folders as PlaygroundFolder[]) || [];
            setFiles(loadedFiles);
            filesRef.current = loadedFiles;
            setFolders(loadedFolders);

            const activeId =
              saved.activeFileId && loadedFiles.some((f) => f.id === saved.activeFileId)
                ? saved.activeFileId
                : loadedFiles[0].id;
            setActiveFileId(activeId);
            activeFileIdRef.current = activeId;

            const openTabs =
              Array.isArray(saved.openTabIds) && saved.openTabIds.length > 0
                ? saved.openTabIds.filter((id) => loadedFiles.some((f) => f.id === id))
                : [activeId];
            setOpenTabIds(openTabs.length > 0 ? openTabs : [activeId]);

            const savedDate = new Date(saved.updatedAt || Date.now());
            setLastSavedTime(
              savedDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            );

            const remainingMinutes = Math.max(
              1,
              Math.round(
                (PLAYGROUND_TTL_MS - (Date.now() - (saved.updatedAt || Date.now()))) /
                  (60 * 1000)
              )
            );
            const hours = Math.floor(remainingMinutes / 60);
            const mins = remainingMinutes % 60;
            const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            toast.success(`Restored workspace (${timeStr} auto-save countdown)`, {
              id: 'restore-playground-workspace',
              icon: '📂',
              duration: 3500,
            });
          }
          isHydratedRef.current = true;
        })
        .catch(() => {
          isHydratedRef.current = true;
        });
    }

    // Periodic cleanup interval (purges workspaces older than 12 hours)
    const purgeInterval = setInterval(async () => {
      await purgeAllExpiredPlaygroundWorkspaces();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(purgeInterval);
    };
  }, [resolvedInitialLang, queryCode, initialCode, hasIncomingCode]);

  // Synchronize incoming initialCode or initialLanguage prop changes (e.g. clicking different examples in tutorial)
  useEffect(() => {
    if (initialCode !== undefined && initialCode.trim().length > 0) {
      const targetLang = initialLanguage || language;
      setLanguage(targetLang);
      const newFiles = buildInitialFiles(targetLang, initialCode, {
        css: initialCss,
        html: initialHtml,
        js: initialJs,
      });
      setFiles(newFiles);
      if (newFiles.length > 0) {
        setActiveFileId(newFiles[0].id);
        activeFileIdRef.current = newFiles[0].id;
        if (targetLang === 'html' || targetLang === 'css') {
          setOpenTabIds(newFiles.slice(0, 2).map((f) => f.id));
        } else {
          setOpenTabIds([newFiles[0].id]);
        }
      }
      setActiveTab(
        targetLang === 'html' || targetLang === 'css' || targetLang === 'markdown'
          ? 'preview'
          : 'terminal'
      );
      if (isModal || targetLang === 'html' || targetLang === 'css' || targetLang === 'markdown') {
        setIsPanelOpen(true);
      }
    }
  }, [initialCode, initialLanguage, initialCss, initialHtml, initialJs, isModal]);

  // Persist settings changes
  const updateSettings = useCallback((newSettings: Partial<PlaygroundSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save settings:', err);
      }
      return updated;
    });
  }, []);

  // Debounced auto-save for workspace files & folders (IndexedDB + localStorage, 12h TTL)
  const saveWorkspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isHydratedRef.current) return;
    if (files.length === 0) return;

    if (saveWorkspaceTimerRef.current) clearTimeout(saveWorkspaceTimerRef.current);
    saveWorkspaceTimerRef.current = setTimeout(() => {
      const now = Date.now();
      savePlaygroundWorkspace({
        language,
        files,
        folders,
        activeFileId,
        openTabIds,
        updatedAt: now,
      });
    }, 600);

    return () => {
      if (saveWorkspaceTimerRef.current) clearTimeout(saveWorkspaceTimerRef.current);
    };
  }, [files, folders, activeFileId, openTabIds, language]);

  const prevFocusModeRef = useRef<boolean | undefined>(undefined);

  // Handle True 100vh Zen Mode (Esc key, body scroll lock, and safe post-render toast)
  useEffect(() => {
    // Show toast only on explicit user toggle, not on initial mount
    if (prevFocusModeRef.current !== undefined && prevFocusModeRef.current !== settings.focusMode) {
      if (settings.focusMode) {
        toast('Zen Mode Active (Press Esc to exit)', {
          duration: 2000,
          icon: '🧘',
          id: 'zen-mode-toast',
        });
      } else {
        toast('Exited Zen Mode', {
          duration: 2000,
          icon: '⚡',
          id: 'zen-mode-toast',
        });
      }
    }
    prevFocusModeRef.current = settings.focusMode;

    if (settings.focusMode) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          updateSettings({ focusMode: false });
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [settings.focusMode, updateSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_PLAYGROUND_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_PLAYGROUND_SETTINGS));
      toast.success('Settings reset to defaults');
    } catch {
      // ignore
    }
  }, []);

  // Add log to console
  const addLog = useCallback((type: ConsoleMessage['type'], content: string) => {
    const newLog: ConsoleMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  // Handle active file code edit
  const handleCodeChange = (newVal: string) => {
    const currentActiveId = activeFileIdRef.current || activeFileId;
    setFiles((prev) =>
      prev.map((f) => (f.id === currentActiveId ? { ...f, content: newVal } : f))
    );
    setUnsavedFileIds((prev) => {
      if (prev.has(currentActiveId)) return prev;
      const next = new Set(prev);
      next.add(currentActiveId);
      return next;
    });
  };

  // 1-Click Code Formatter / Beautifier (Shift + Alt + F)
  const handleFormatCode = useCallback(() => {
    if (!editorInstanceRef.current) return;
    const ed = editorInstanceRef.current;
    const currentCode = ed.getValue();
    if (!currentCode.trim()) return;

    try {
      const formatted = formatCode(currentCode, language, settings.tabSize);
      if (formatted !== currentCode) {
        ed.setValue(formatted);
        handleCodeChange(formatted);
        toast.success('Code formatted ✨', { icon: '✨', duration: 1500 });
      } else {
        toast('Code is already clean & formatted', { icon: '👌', duration: 1200 });
      }
    } catch (err: any) {
      toast.error('Could not format code: ' + (err?.message || 'Error'));
    }
  }, [language, settings.tabSize]);

  // Insert symbol or text at current cursor (for mobile toolbar)
  const insertTextAtCursor = useCallback((text: string) => {
    if (!editorInstanceRef.current) return;
    const ed = editorInstanceRef.current;
    const selection = ed.getSelection();
    if (selection) {
      ed.executeEdits('mobile-symbols', [
        {
          range: selection,
          text,
          forceMoveMarkers: true,
        },
      ]);
      ed.focus();
    }
  }, []);

  const insertTab = useCallback(() => {
    const spaces = ' '.repeat(settings.tabSize);
    insertTextAtCursor(spaces);
  }, [insertTextAtCursor, settings.tabSize]);

  // Switch active SQL database (from Schemas explorer or script)
  const handleSwitchDatabase = useCallback((dbName: string) => {
    try {
      mysqlEngine.useDatabase(dbName);
      setActiveSqlDbName(dbName);
      setSchemaVersion((v) => v + 1);
      toast.success(`Active database: '${dbName}'`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to switch database');
    }
  }, []);

  // Insert SQL snippet into Monaco editor
  const handleInsertSqlSnippet = useCallback((snippet: string) => {
    if (editorInstanceRef.current) {
      const ed = editorInstanceRef.current;
      const model = ed.getModel();
      if (model) {
        const selection = ed.getSelection();
        const currentVal = ed.getValue();
        const separator = currentVal.trim().length > 0 ? '\n\n' : '';
        if (selection && !selection.isEmpty()) {
          ed.executeEdits('insert-sql-snippet', [
            { range: selection, text: snippet, forceMoveMarkers: true },
          ]);
        } else {
          const lineCount = model.getLineCount();
          const lastLineLength = model.getLineMaxColumn(lineCount);
          const range = {
            startLineNumber: lineCount,
            startColumn: lastLineLength,
            endLineNumber: lineCount,
            endColumn: lastLineLength,
          };
          ed.executeEdits('insert-sql-snippet', [
            { range, text: separator + snippet, forceMoveMarkers: true },
          ]);
          ed.revealLine(model.getLineCount());
        }
        ed.focus();
        toast.success('Inserted SQL query snippet into editor');
      }
    }
  }, []);

  // File management
  const handleSelectFile = (fileId: string) => {
    const prevActiveId = activeFileIdRef.current || activeFileId;
    if (editorInstanceRef.current && prevActiveId) {
      const currentCode = editorInstanceRef.current.getValue();
      setFiles((prev) =>
        prev.map((f) => (f.id === prevActiveId ? { ...f, content: currentCode } : f))
      );
    }
    setActiveFileId(fileId);
    activeFileIdRef.current = fileId;
    setHasSelection(false);
    if (!openTabIds.includes(fileId)) {
      setOpenTabIds((prev) => [...prev, fileId]);
    }

    // Auto-switch playground language based on selected/open file
    const targetFile = files.find((f) => f.id === fileId);
    if (targetFile) {
      const fileLang = targetFile.language || detectLanguageFromExtension(targetFile.name);
      if (fileLang && fileLang !== language) {
        setLanguage(fileLang);
        if (fileLang === 'html') {
          setActiveTab('preview');
        }
      }
    }
  };

  const handleCloseTab = (fileId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (editorInstanceRef.current && fileId === (activeFileIdRef.current || activeFileId)) {
      const currentCode = editorInstanceRef.current.getValue();
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, content: currentCode } : f))
      );
    }

    const newTabs = openTabIds.filter((id) => id !== fileId);
    setOpenTabIds(newTabs);

    if (activeFileId === fileId) {
      if (newTabs.length > 0) {
        const closedIdx = openTabIds.indexOf(fileId);
        const nextIdx = Math.max(0, closedIdx - 1);
        const nextTabId = newTabs[nextIdx] || newTabs[0];
        setActiveFileId(nextTabId);
        activeFileIdRef.current = nextTabId;

        const nextFile = files.find((f) => f.id === nextTabId);
        if (nextFile) {
          const nextLang = nextFile.language || detectLanguageFromExtension(nextFile.name);
          if (nextLang && nextLang !== language) {
            setLanguage(nextLang);
          }
        }
      } else {
        setActiveFileId('');
        activeFileIdRef.current = '';
      }
    }
  };

  const handleCloseAllTabs = () => {
    const currentActiveId = activeFileIdRef.current || activeFileId;
    if (editorInstanceRef.current && currentActiveId) {
      const currentCode = editorInstanceRef.current.getValue();
      setFiles((prev) =>
        prev.map((f) => (f.id === currentActiveId ? { ...f, content: currentCode } : f))
      );
    }
    setOpenTabIds([]);
    setActiveFileId('');
    activeFileIdRef.current = '';
    toast.success('Closed all files in editor');
  };

  const handleCloseOtherTabs = (keepFileId: string) => {
    setOpenTabIds([keepFileId]);
    setActiveFileId(keepFileId);
    activeFileIdRef.current = keepFileId;

    const keepFile = files.find((f) => f.id === keepFileId);
    if (keepFile) {
      const keepLang = keepFile.language || detectLanguageFromExtension(keepFile.name);
      if (keepLang && keepLang !== language) {
        setLanguage(keepLang);
      }
    }
  };

  // Folder Operations
  const handleCreateFolder = (folderName: string, parentId?: string | null) => {
    const newFolder: PlaygroundFolder = {
      id: 'folder-' + Math.random().toString(36).substring(2, 9),
      name: folderName,
      parentId: parentId || null,
      isOpen: true,
    };
    setFolders((prev) => {
      const next = [...prev, newFolder];
      try {
        localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    const deletedFileIds = files.filter((f) => f.folderId === folderId).map((f) => f.id);

    setFolders((prev) => {
      const next = prev.filter((f) => f.id !== folderId);
      try {
        localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    setFiles((prev) => prev.filter((f) => f.folderId !== folderId));
    setOpenTabIds((prev) => prev.filter((id) => !deletedFileIds.includes(id)));

    if (deletedFileIds.includes(activeFileId)) {
      const remainingTabs = openTabIds.filter((id) => !deletedFileIds.includes(id));
      if (remainingTabs.length > 0) {
        setActiveFileId(remainingTabs[0]);
        activeFileIdRef.current = remainingTabs[0];
      } else {
        setActiveFileId('');
        activeFileIdRef.current = '';
      }
    }

    toast.success(`Deleted folder ${folder?.name || ''}`);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders((prev) => {
      const next = prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f));
      try {
        localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
      } catch {}
      return next;
    });
    toast.success(`Renamed folder to ${newName}`);
  };

  const handleToggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, isOpen: f.isOpen === false ? true : false } : f
      )
    );
  };

  const handleCollapseAllFolders = () => {
    setFolders((prev) => prev.map((f) => ({ ...f, isOpen: false })));
    toast('Collapsed all folders', { icon: '📁', duration: 1500 });
  };

  const handleCreateFile = (name: string, lang: SupportedLanguage, folderId?: string | null) => {
    setLanguage(lang);
    const newFile: PlaygroundFile = {
      id: 'file-' + Math.random().toString(36).substring(2, 9),
      name,
      language: lang,
      content: '', // Completely blank file with zero boilerplate
      isRemovable: true,
      folderId: folderId || null,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    activeFileIdRef.current = newFile.id;
    setOpenTabIds((prev) => [...prev, newFile.id]);
  };

  // Load a Starter Example into the workspace
  const handleSelectExample = (template: CodeTemplate) => {
    setLanguage(template.language);

    const newFiles = buildInitialFiles(template.language, template.code);
    setFiles(newFiles);
    filesRef.current = newFiles;
    setFolders([]);
    setActiveFileId(newFiles[0].id);
    activeFileIdRef.current = newFiles[0].id;
    setOpenTabIds([newFiles[0].id]);
    setUnsavedFileIds(new Set());
    setLogs([]);

    if (template.language === 'html') {
      setActiveTab('preview');
    } else {
      setActiveTab('terminal');
    }

    savePlaygroundWorkspace({
      language: template.language,
      files: newFiles,
      folders: [],
      activeFileId: newFiles[0].id,
      openTabIds: [newFiles[0].id],
      updatedAt: Date.now(),
    });

    toast.success(`Loaded example: ${template.title}`, {
      icon: '💡',
    });
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    const newLang = detectLanguageFromExtension(newName);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, name: newName, language: newLang } : f
      )
    );
    toast.success(`Renamed to ${newName}`);
  };

  const handleDeleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file || !file.isRemovable) return;

    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setOpenTabIds((prev) => prev.filter((id) => id !== fileId));
    if (activeFileId === fileId) {
      const remaining = openTabIds.filter((id) => id !== fileId);
      if (remaining.length > 0) {
        setActiveFileId(remaining[0]);
        activeFileIdRef.current = remaining[0];
      } else {
        setActiveFileId('');
        activeFileIdRef.current = '';
      }
    }
    toast.success(`Deleted ${file.name}`);
  };

  // --- Local Device File & Folder Import Handlers ---
  const triggerOpenFilePicker = useCallback((targetFolderId?: string | null) => {
    targetUploadFolderIdRef.current = targetFolderId || null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  const triggerOpenFolderPicker = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
      folderInputRef.current.click();
    }
  }, []);

  const triggerOpenZipPicker = useCallback(() => {
    if (zipInputRef.current) {
      zipInputRef.current.value = '';
      zipInputRef.current.click();
    }
  }, []);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    const targetFolderId = targetUploadFolderIdRef.current;
    const uploaded = await readUploadedFiles(rawFiles, targetFolderId);

    if (uploaded.length === 0) {
      toast.error('No readable text or code files found in selection');
      return;
    }

    setFiles((prev) => {
      const next = [...prev];
      for (const newF of uploaded) {
        const existingIdx = next.findIndex(
          (f) =>
            f.name.toLowerCase() === newF.name.toLowerCase() &&
            (f.folderId || null) === (newF.folderId || null)
        );
        if (existingIdx !== -1) {
          next[existingIdx] = { ...next[existingIdx], content: newF.content };
        } else {
          next.push(newF);
        }
      }
      try {
        localStorage.setItem(`${SAVED_FILES_PREFIX}${language}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    const newTabIds = uploaded.map((f) => f.id);
    setOpenTabIds((prev) => Array.from(new Set([...prev, ...newTabIds])));

    const lastFile = uploaded[uploaded.length - 1];
    setActiveFileId(lastFile.id);
    activeFileIdRef.current = lastFile.id;

    // Detect language if it differs from current
    const detectedLang = detectPrimaryLanguage(uploaded);
    if (detectedLang && detectedLang !== language) {
      setLanguage(detectedLang);
    }

    toast.success(`Opened ${uploaded.length} file${uploaded.length === 1 ? '' : 's'} from device`, {
      icon: '📄',
    });
  };

  const handleFolderInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    toast.loading('Reading project folder from device...', { id: 'folder-import-toast' });
    try {
      const { files: parsedFiles, folders: parsedFolders, rootName } = await parseDirectoryFiles(rawFiles);

      if (parsedFiles.length === 0) {
        toast.error('No readable code files found in selected folder', { id: 'folder-import-toast' });
        return;
      }

      setFolders((prev) => {
        const next = [...prev, ...parsedFolders];
        try {
          localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      setFiles((prev) => {
        const next = [...prev, ...parsedFiles];
        try {
          localStorage.setItem(`${SAVED_FILES_PREFIX}${language}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      const entryFile =
        parsedFiles.find((f) => f.name.startsWith('main.') || f.name.startsWith('index.') || f.name.startsWith('app.')) ||
        parsedFiles[0];

      if (entryFile) {
        setActiveFileId(entryFile.id);
        activeFileIdRef.current = entryFile.id;
        setOpenTabIds((prev) => Array.from(new Set([...prev, entryFile.id])));
      }

      const detectedLang = detectPrimaryLanguage(parsedFiles);
      if (detectedLang && detectedLang !== language) {
        setLanguage(detectedLang);
      }

      toast.success(
        `Opened folder "${rootName}" (${parsedFiles.length} files, ${parsedFolders.length} folders)`,
        { id: 'folder-import-toast', icon: '📁', duration: 3000 }
      );
    } catch (err: any) {
      toast.error('Could not import folder: ' + (err?.message || 'Error'), { id: 'folder-import-toast' });
    }
  };

  const handleExtractAndOpenZipFile = async (zipFile: File) => {
    toast.loading(`Extracting ${zipFile.name}...`, { id: 'zip-import-toast' });

    try {
      const { files: parsedFiles, folders: parsedFolders, rootName } = await extractZipArchive(zipFile);

      if (parsedFiles.length === 0) {
        toast.error('No code files found in the ZIP archive', { id: 'zip-import-toast' });
        return;
      }

      setFolders((prev) => {
        const next = [...prev, ...parsedFolders];
        try {
          localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      setFiles((prev) => {
        const next = [...prev, ...parsedFiles];
        try {
          localStorage.setItem(`${SAVED_FILES_PREFIX}${language}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      const entryFile =
        parsedFiles.find((f) => f.name.startsWith('main.') || f.name.startsWith('index.') || f.name.startsWith('app.')) ||
        parsedFiles[0];

      if (entryFile) {
        setActiveFileId(entryFile.id);
        activeFileIdRef.current = entryFile.id;
        setOpenTabIds((prev) => Array.from(new Set([...prev, entryFile.id])));
      }

      const detectedLang = detectPrimaryLanguage(parsedFiles);
      if (detectedLang && detectedLang !== language) {
        setLanguage(detectedLang);
      }

      toast.success(
        `Extracted & opened ZIP project "${rootName}" (${parsedFiles.length} files)`,
        { id: 'zip-import-toast', icon: '📦', duration: 3000 }
      );
    } catch (err: any) {
      toast.error('Could not extract ZIP: ' + (err?.message || 'Invalid ZIP archive'), { id: 'zip-import-toast' });
    }
  };

  const handleZipInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;
    await handleExtractAndOpenZipFile(rawFiles[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    // 1. Intercept dropped SQLite binary database files (.db, .sqlite, .sqlite3)
    const droppedFilesList = Array.from(e.dataTransfer.files || []);
    const dbFile = droppedFilesList.find((f) => /\.(db|sqlite|sqlite3)$/i.test(f.name));

    if (dbFile) {
      toast.loading(`Importing SQLite database "${dbFile.name}"...`, { id: 'db-drop-toast' });
      try {
        const arrayBuffer = await dbFile.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const res = mysqlEngine.importDatabaseFile(dbFile.name, uint8);
        setLanguage('sql');
        setActiveSqlDbName(res.name);
        setSchemaVersion((v) => v + 1);
        toast.success(`Imported "${dbFile.name}" (${res.tableCount} table${res.tableCount === 1 ? '' : 's'})`, {
          id: 'db-drop-toast',
          icon: '🗄️',
          duration: 4000,
        });
        return;
      } catch (err: any) {
        toast.error('Database import error: ' + (err?.message || 'Invalid SQLite file'), { id: 'db-drop-toast' });
        return;
      }
    }

    // 2. Intercept dropped ZIP project archive
    const zipFile = droppedFilesList.find((f) => f.name.toLowerCase().endsWith('.zip'));
    if (zipFile) {
      await handleExtractAndOpenZipFile(zipFile);
      return;
    }

    toast.loading('Processing dropped items...', { id: 'drop-toast' });
    try {
      const { files: parsedFiles, folders: parsedFolders, rootName } = await extractDroppedItems(e.dataTransfer);

      if (parsedFiles.length === 0) {
        toast.error('No readable code files in dropped items', { id: 'drop-toast' });
        return;
      }

      if (parsedFolders.length > 0) {
        setFolders((prev) => {
          const next = [...prev, ...parsedFolders];
          try {
            localStorage.setItem(`${SAVED_FOLDERS_PREFIX}${language}`, JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      setFiles((prev) => {
        const next = [...prev, ...parsedFiles];
        try {
          localStorage.setItem(`${SAVED_FILES_PREFIX}${language}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      const entryFile =
        parsedFiles.find((f) => f.name.startsWith('main.') || f.name.startsWith('index.') || f.name.startsWith('app.')) ||
        parsedFiles[0];

      if (entryFile) {
        setActiveFileId(entryFile.id);
        activeFileIdRef.current = entryFile.id;
        setOpenTabIds((prev) => Array.from(new Set([...prev, entryFile.id])));
      }

      const detectedLang = detectPrimaryLanguage(parsedFiles);
      if (detectedLang && detectedLang !== language) {
        setLanguage(detectedLang);
      }

      toast.success(
        `Loaded ${parsedFolders.length > 0 ? `folder "${rootName}"` : `${parsedFiles.length} file(s)`}`,
        { id: 'drop-toast', icon: '📂', duration: 3000 }
      );
    } catch (err: any) {
      toast.error('Could not process dropped items: ' + (err?.message || 'Error'), { id: 'drop-toast' });
    }
  };

  // Global keyboard shortcuts (Ctrl+B, Ctrl+`, Ctrl+Shift+E, Ctrl+Shift+F, Ctrl+O, Alt+O, Shift+Alt+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl + B / Cmd + B -> toggle primary side bar (Explorer, Search, Challenges, Examples) just like VS Code
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key.toLowerCase() === 'b' || e.code === 'KeyB')) {
        e.preventDefault();
        toggleSidebar();
      }
      // 2. Ctrl + ` (backtick) -> toggle terminal / output panel just like VS Code
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        setIsPanelOpen((prev) => !prev);
      }
      // 3. Ctrl + Shift + E -> toggle explorer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setSidebarView((prev) => (prev === 'explorer' ? null : 'explorer'));
      }
      // 4. Ctrl + Shift + F -> toggle search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSidebarView((prev) => (prev === 'search' ? null : 'search'));
      }
      // 5. Ctrl + O / Cmd + O -> Open local file from device
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        triggerOpenFilePicker();
      }
      // 6. Alt + O -> Open local folder from device
      if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        triggerOpenFolderPicker();
      }
      // 7. Shift + Alt + F -> Format document / beautify code
      if (e.shiftKey && e.altKey && (e.key.toLowerCase() === 'f' || e.code === 'KeyF')) {
        e.preventDefault();
        handleFormatCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerOpenFilePicker, triggerOpenFolderPicker, toggleSidebar, handleFormatCode]);

  // Jump to line from Search result
  const handleSelectSearchResult = (fileId: string, lineNumber: number, column: number) => {
    handleSelectFile(fileId);
    setTimeout(() => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.revealLineInCenter(lineNumber);
        editorInstanceRef.current.setPosition({ lineNumber, column });
        editorInstanceRef.current.focus();
      }
    }, 50);
  };

  // When language changes from dropdown, check saved files or load starter
  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    // Save current language workspace first if it has files
    if (files.length > 0) {
      await savePlaygroundWorkspace({
        language,
        files: getLatestFiles(),
        folders,
        activeFileId,
        openTabIds,
        updatedAt: Date.now(),
      });
    }

    setLanguage(newLang);
    const templates = STARTER_TEMPLATES[newLang] || [];
    const initialTplCode = templates.length > 0 ? templates[0].code : '';
    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }

    // Load saved workspace for newLang if available and within 12h TTL
    const saved = await loadPlaygroundWorkspace(newLang);
    let newFiles: PlaygroundFile[] = [];
    let newFolders: PlaygroundFolder[] = [];
    let newActiveId = '';
    let newOpenTabs: string[] = [];

    if (saved && Array.isArray(saved.files) && saved.files.length > 0) {
      newFiles = saved.files as PlaygroundFile[];
      newFolders = (saved.folders as PlaygroundFolder[]) || [];
      newActiveId =
        saved.activeFileId && newFiles.some((f) => f.id === saved.activeFileId)
          ? saved.activeFileId
          : newFiles[0].id;
      newOpenTabs =
        Array.isArray(saved.openTabIds) && saved.openTabIds.length > 0
          ? saved.openTabIds.filter((id) => newFiles.some((f) => f.id === id))
          : [newActiveId];
    } else {
      newFiles = buildInitialFiles(newLang, initialTplCode);
      newFolders = [];
      newActiveId = newFiles[0].id;
      newOpenTabs = newFiles.map((f) => f.id);
    }

    setFiles(newFiles);
    filesRef.current = newFiles;
    setFolders(newFolders);
    setActiveFileId(newActiveId);
    activeFileIdRef.current = newActiveId;
    setOpenTabIds(newOpenTabs);
    setUnsavedFileIds(new Set());

    if (newLang === 'html') {
      setActiveTab('preview');
    } else {
      setActiveTab('terminal');
    }
    setLogs([]);
    setHasSelection(false);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const templates = STARTER_TEMPLATES[language] || [];
    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) {
      const newFiles = buildInitialFiles(language, tpl.code);
      setFiles(newFiles);
      filesRef.current = newFiles;
      setFolders([]);
      setActiveFileId(newFiles[0].id);
      activeFileIdRef.current = newFiles[0].id;
      setOpenTabIds(newFiles.map((f) => f.id));
      setUnsavedFileIds(new Set());
      setLogs([]);
      savePlaygroundWorkspace({
        language,
        files: newFiles,
        folders: [],
        activeFileId: newFiles[0].id,
        openTabIds: newFiles.map((f) => f.id),
        updatedAt: Date.now(),
      });
      toast.success(`Loaded template: ${tpl.title}`);
    }
  };

  // Pyodide loader
  const initPyodide = useCallback(async (): Promise<PyodideInterface | null> => {
    if (typeof window === 'undefined') return null;
    if (window.__mskPyodideInstance) {
      return window.__mskPyodideInstance;
    }

    setIsPyodideLoading(true);
    addLog('info', '⚡ Initializing Python WebAssembly runtime (Pyodide v0.26)...');

    try {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
          document.head.appendChild(script);
        });
      }

      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });
        window.__mskPyodideInstance = pyodide;
        addLog('success', '✅ Python runtime ready! Ready to execute Python code.');
        setIsPyodideLoading(false);
        return pyodide;
      }
      return null;
    } catch (err) {
      console.error('Pyodide initialization error:', err);
      addLog('error', `Failed to initialize Python runtime: ${err instanceof Error ? err.message : String(err)}`);
      setIsPyodideLoading(false);
      return null;
    }
  }, [addLog]);

  // SQLite WebAssembly (sql.js) Loader
  const initSql = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    if (window.__mskSqlDb) return window.__mskSqlDb;

    setIsSqlLoading(true);
    addLog('info', '⚡ Initializing SQLite WebAssembly database engine (sql.js)...');

    try {
      if (!window.initSqlJs) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load sql.js from CDN'));
          document.head.appendChild(script);
        });
      }

      if (window.initSqlJs) {
        const SQL = await window.initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
        });
        window.__mskSqlInstance = SQL;
        mysqlEngine.init(SQL);
        const db = mysqlEngine.getActiveDb();
        window.__mskSqlDb = db;
        setActiveSqlDbName(mysqlEngine.getActiveDbName());
        setSchemaVersion((v) => v + 1);
        addLog('success', '✅ In-memory MySQL & SQLite Database Environment ready.');
        setIsSqlLoading(false);
        return db;
      }
      return null;
    } catch (err) {
      console.error('SQLite initialization error:', err);
      addLog('error', `Failed to initialize SQLite: ${err instanceof Error ? err.message : String(err)}`);
      setIsSqlLoading(false);
      return null;
    }
  }, [addLog]);

  // Handle Loading a Challenge from ChallengesSidebar
  const handleSelectChallenge = (challenge: CodeChallenge) => {
    if (challenge.language !== language) {
      handleLanguageChange(challenge.language);
    }
    const ext =
      challenge.language === 'python'
        ? 'py'
        : challenge.language === 'cpp'
        ? 'cpp'
        : challenge.language === 'c'
        ? 'c'
        : challenge.language === 'java'
        ? 'java'
        : challenge.language === 'sql'
        ? 'sql'
        : 'js';
    const challengeFileName =
      challenge.language === 'java' ? 'Main.java' : `${challenge.id}.${ext}`;
    const newFile: PlaygroundFile = {
      id: 'file-challenge-' + challenge.id,
      name: challengeFileName,
      language: challenge.language,
      content: challenge.starterCode,
      isRemovable: false,
    };
    setFiles([newFile]);
    setActiveFileId(newFile.id);
    setOpenTabIds([newFile.id]);
    setUnsavedFileIds(new Set());
    setLogs([]);
  };

  // Automated Test Cases Runner for Coding Challenges
  const handleRunChallengeTests = async (challenge: CodeChallenge) => {
    const currentFiles = getLatestFiles();
    const activeFile = currentFiles.find((f) => f.id === activeFileId) || currentFiles[0];
    const results = [];

    for (const testCase of challenge.testCases) {
      let actualOutput = '';
      let passed = false;

      if (challenge.language === 'python') {
        try {
          const pyodide = await initPyodide();
          if (!pyodide) throw new Error('Pyodide runtime could not be loaded');
          const testHarness = `
import sys
from io import StringIO

_stdin_buffer = StringIO("""${testCase.input.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""")
_stdout_buffer = StringIO()
_stderr_buffer = StringIO()
_original_stdin = sys.stdin
_original_stdout = sys.stdout
_original_stderr = sys.stderr

sys.stdin = _stdin_buffer
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

try:
${activeFile.content.split('\n').map((line) => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
finally:
    sys.stdin = _original_stdin
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr

(_stdout_buffer.getvalue(), _stderr_buffer.getvalue())
`;
          const runRes: any = await pyodide.runPythonAsync(testHarness);
          const [outStr, errStr] = runRes?.toJs ? runRes.toJs() : ['', ''];
          actualOutput = (outStr || errStr || '').trim();
          passed = actualOutput === testCase.expectedOutput.trim();
        } catch (err) {
          actualOutput = String(err);
          passed = false;
        }
      } else if (challenge.language === 'cpp' || challenge.language === 'c' || challenge.language === 'java') {
        try {
          const remoteRes = await runRemoteCode(challenge.language, activeFile.content, testCase.input);
          actualOutput = (remoteRes.stdout || remoteRes.stderr || remoteRes.compilerError || '').trim();
          passed = actualOutput === testCase.expectedOutput.trim();
        } catch (err) {
          actualOutput = String(err);
          passed = false;
        }
      } else if (challenge.language === 'javascript') {
        try {
          const capturedLogs: string[] = [];
          const originalLog = console.log;
          console.log = (...args: unknown[]) => capturedLogs.push(args.join(' '));
          // eslint-disable-next-line no-new-func
          const fn = new Function(activeFile.content);
          fn();
          console.log = originalLog;
          actualOutput = capturedLogs.join('\n').trim();
          passed = actualOutput === testCase.expectedOutput.trim();
        } catch (err) {
          actualOutput = String(err);
          passed = false;
        }
      } else if (challenge.language === 'sql') {
        try {
          const db = await initSql();
          if (!db) throw new Error('SQL engine not available');
          const results = await mysqlEngine.executeScript(activeFile.content, false);
          if (results && results.length > 0) {
            const last = results[results.length - 1];
            actualOutput = last.values.map((r: any[]) => r.join(', ')).join('\n').trim();
            passed = actualOutput === testCase.expectedOutput.trim();
          } else {
            actualOutput = '(No rows returned)';
            passed = false;
          }
        } catch (err) {
          actualOutput = String(err);
          passed = false;
        }
      }

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput.trim(),
        actualOutput,
        passed,
      });
    }

    return results;
  };

  // Helper to extract workspace files with the latest editor content
  const getLatestFiles = useCallback((): PlaygroundFile[] => {
    const currentActiveId = activeFileIdRef.current || activeFileId;
    const currentFiles = filesRef.current || files;
    if (!editorInstanceRef.current) return currentFiles;
    const currentCode = editorInstanceRef.current.getValue();
    return currentFiles.map((f) =>
      f.id === currentActiveId ? { ...f, content: currentCode } : f
    );
  }, [files, activeFileId]);

  // Run active code with custom stdin input (for MultiTestcaseRunner)
  const handleRunSingleCustomInput = useCallback(
    async (customInput: string): Promise<string> => {
      const currentFiles = getLatestFiles();
      const currentActive = currentFiles.find((f) => f.id === activeFileId) || currentFiles[0];
      const activeCode = currentActive ? currentActive.content : '';

      if (language === 'python') {
        const pyodide = await initPyodide();
        if (!pyodide) throw new Error('Pyodide runtime could not be loaded');
        const testHarness = `
import sys
from io import StringIO

_stdin_buffer = StringIO("""${customInput.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""")
_stdout_buffer = StringIO()
_stderr_buffer = StringIO()
_original_stdin = sys.stdin
_original_stdout = sys.stdout
_original_stderr = sys.stderr

sys.stdin = _stdin_buffer
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

try:
${activeCode.split('\n').map((line) => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
finally:
    sys.stdin = _original_stdin
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr

(_stdout_buffer.getvalue(), _stderr_buffer.getvalue())
`;
        const runRes: any = await pyodide.runPythonAsync(testHarness);
        const [outStr, errStr] = runRes?.toJs ? runRes.toJs() : ['', ''];
        return (outStr || errStr || '').trim();
      }

      if (language === 'cpp' || language === 'c' || language === 'java') {
        const remoteRes = await runRemoteCode(language, activeCode, customInput);
        if (remoteRes.compilerError) {
          throw new Error(remoteRes.compilerError);
        }
        return (remoteRes.stdout || remoteRes.stderr || '').trim();
      }

      if (language === 'javascript') {
        const capturedLogs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: unknown[]) => capturedLogs.push(args.join(' '));
        try {
          const fn = new Function(activeCode);
          fn();
        } finally {
          console.log = originalLog;
        }
        return capturedLogs.join('\n').trim();
      }

      return 'Test execution not available for this language.';
    },
    [activeFileId, getLatestFiles, initPyodide, language]
  );

  // Quick Save & Auto-Save Workspace
  const handleSaveDocument = useCallback(
    (isAutoSave = false, shouldFormat = true): PlaygroundFile[] => {
      const currentActiveId = activeFileIdRef.current || activeFileId;

      // 1. Auto-format document if supported and formatting is enabled
      if (shouldFormat) {
        try {
          editorInstanceRef.current?.getAction('editor.action.formatDocument')?.run();
        } catch {}
      }

      // 2. Capture current editor text for the active file
      const updatedFiles = getLatestFiles();
      setFiles(updatedFiles);
      filesRef.current = updatedFiles;

      // 3. Persist to storage (IndexedDB + localStorage, 12h TTL)
      const nowTs = Date.now();
      savePlaygroundWorkspace({
        language,
        files: updatedFiles,
        folders,
        activeFileId: currentActiveId,
        openTabIds,
        updatedAt: nowTs,
      });

      // 4. Update saved state
      const now = new Date(nowTs).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSavedTime(now);

      // Remove the saved active file from unsaved tracking
      setUnsavedFileIds((prev) => {
        const next = new Set(prev);
        next.delete(currentActiveId);
        return next;
      });

      // 5. Toast feedback with EXACT active file name where user was working
      const savedFile = updatedFiles.find((f) => f.id === currentActiveId) || activeFile;
      const fileName = savedFile?.name || 'file';

      if (isAutoSave) {
        toast.success(`Auto-saved ${fileName} before running`, {
          id: 'auto-save-toast',
          icon: '💾',
          duration: 1500,
        });
      } else {
        toast.success(`Saved & formatted ${fileName}`, {
          id: 'save-toast',
          icon: '💾',
          duration: 2000,
        });
      }

      return updatedFiles;
    },
    [getLatestFiles, language, activeFile, activeFileId, folders, openTabIds]
  );

  // Insert Markdown formatting snippet or wrap selected text in Monaco editor
  const handleInsertMarkdownSnippet = useCallback(
    (prefix: string, suffix: string = '', placeholder: string = '') => {
      const editor = editorInstanceRef.current;
      if (!editor) return;
      const selection = editor.getSelection();
      if (!selection) return;

      const model = editor.getModel();
      if (!model) return;

      const selectedText = model.getValueInRange(selection);
      const textToInsert = selectedText || placeholder;
      const newText = `${prefix}${textToInsert}${suffix}`;

      editor.executeEdits('markdown-toolbar', [
        {
          range: selection,
          text: newText,
          forceMoveMarkers: true,
        },
      ]);
      editor.focus();
    },
    []
  );

  // Execute Code Logic
  const handleRunCode = async () => {
    // If no tab is open, automatically open the first file or prompt
    if (openTabIds.length === 0 || !activeFile) {
      if (files.length > 0) {
        handleSelectFile(files[0].id);
        toast('Opened ' + files[0].name, { icon: '📄' });
      } else {
        toast.error('No file to run. Please create a file in the explorer.');
        return;
      }
    }

    // Check if user has highlighted/selected text in Monaco editor
    let activeSelectedText = '';
    const editor = editorInstanceRef.current;
    if (editor) {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        const text = editor.getModel()?.getValueInRange(selection)?.trim() || '';
        if (text.length > 0) {
          activeSelectedText = text;
        }
      }
    }

    // 1. Auto-save workspace files before executing code
    // (Suppress formatting if user has selected a query to keep the selection intact)
    const currentFiles = handleSaveDocument(true, !activeSelectedText);

    setIsRunning(true);
    setIsPanelOpen(true);
    setMobileActiveView('output');
    const startTime = performance.now();

    if (language === 'html' || language === 'css' || language === 'markdown') {
      const currentActiveId = activeFileIdRef.current || activeFileId;
      const activeFileObj = currentFiles.find((f) => f.id === currentActiveId) || currentFiles[0];
      setActiveTab('preview');
      if (language === 'markdown') {
        addLog('success', `📝 Rendered Live Markdown Preview (${activeFileObj?.name || 'document.md'}).`);
      } else {
        addLog('success', `🚀 Rendered Web Preview (${activeFileObj?.name || (language === 'css' ? 'style.css' : 'index.html')}).`);
      }
      setIsRunning(false);
      return;
    }

    setActiveTab('terminal');

    if (language === 'python') {
      try {
        const pyodide = await initPyodide();
        if (!pyodide) {
          throw new Error('Python runtime could not be loaded.');
        }

        // 1. Sync ALL folders and workspace files to Pyodide's virtual in-memory filesystem!
        for (const folder of folders) {
          try {
            if (pyodide.FS.mkdirTree) {
              pyodide.FS.mkdirTree(folder.name);
            } else if (pyodide.FS.mkdir) {
              pyodide.FS.mkdir(folder.name);
            }
          } catch {}
        }
        for (const file of currentFiles) {
          try {
            const relPath = getFileRelativePath(file, folders);
            pyodide.FS.writeFile(relPath, file.content);
          } catch (fsErr) {
            console.warn(`Could not sync ${file.name} to Pyodide FS:`, fsErr);
          }
        }

        // 2. Identify active file to run (prioritize the active file where cursor/user is)
        const currentActiveId = activeFileIdRef.current || activeFileId;
        const fileToRun =
          currentFiles.find((f) => f.id === currentActiveId) ||
          currentFiles.find((f) => f.name === 'main.py') ||
          currentFiles[0];

        addLog('info', `⚡ Running ${fileToRun.name}...`);

        // Pre-load matplotlib if imported
        if (fileToRun.content.includes('matplotlib') || fileToRun.content.includes('plt.')) {
          addLog('info', '📦 Loading matplotlib & numpy WebAssembly packages...');
          if (pyodide.loadPackage) {
            await pyodide.loadPackage(['matplotlib', 'numpy']);
          }
        }

        const harness = `
import sys
from io import StringIO

# Clear cached workspace modules so re-imports reflect updated file contents
for _mod in [${currentFiles
  .filter((f) => f.name.endsWith('.py'))
  .map((f) => JSON.stringify(f.name.replace(/\.py$/, '')))
  .join(', ')}]:
    if _mod in sys.modules:
        del sys.modules[_mod]

_stdin_buffer = StringIO("""${stdin.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""")
_stdout_buffer = StringIO()
_stderr_buffer = StringIO()
_original_stdin = sys.stdin
_original_stdout = sys.stdout
_original_stderr = sys.stderr

sys.stdin = _stdin_buffer
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

_msk_captured_plots = []
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as _msk_plt
    import io, base64
    def _msk_show(*args, **kwargs):
        _buf = io.BytesIO()
        _msk_plt.savefig(_buf, format='png', bbox_inches='tight', dpi=130)
        _buf.seek(0)
        _msk_captured_plots.append('data:image/png;base64,' + base64.b64encode(_buf.read()).decode('utf-8'))
        _msk_plt.close()
    _msk_plt.show = _msk_show
except Exception:
    pass

try:
${fileToRun.content.split('\n').map((line) => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
finally:
    sys.stdin = _original_stdin
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr

_out_result = _stdout_buffer.getvalue()
_err_result = _stderr_buffer.getvalue()
(_out_result, _err_result, _msk_captured_plots)
`;

        const runResult: any = await pyodide.runPythonAsync(harness);
        const [stdoutResult, stderrResult, capturedPlots] = runResult?.toJs
          ? runResult.toJs()
          : [runResult?.[0] || '', runResult?.[1] || '', runResult?.[2] || []];

        if (Array.isArray(capturedPlots) && capturedPlots.length > 0) {
          setPlots(capturedPlots);
          addLog('success', `📊 Generated ${capturedPlots.length} plot(s). Check 'Plots / Visuals' tab.`);
        }

        const elapsed = (performance.now() - startTime).toFixed(1);

        if (stdoutResult) {
          addLog('log', stdoutResult.trimEnd());
        }
        if (stderrResult) {
          addLog('error', stderrResult.trimEnd());
        }
        if (!stdoutResult && !stderrResult && (!capturedPlots || capturedPlots.length === 0)) {
          addLog('info', '(Program executed successfully with no printed output)');
        }

        addLog('success', `Done in ${elapsed}ms`);
      } catch (err) {
        addLog('error', String(err));
      } finally {
        setIsRunning(false);
      }
      return;
    }

    if (language === 'sql') {
      setIsSqlLoading(true);
      setActiveTab('terminal');

      const currentActiveId = activeFileIdRef.current || activeFileId;
      const fileToRun =
        currentFiles.find((f) => f.id === currentActiveId) ||
        currentFiles.find((f) => f.language === 'sql') ||
        currentFiles[0];

      // Determine query: execute selected query if highlighted, otherwise execute all queries
      let queryToRun = fileToRun?.content || '';
      let isSelectedQuery = false;

      if (activeSelectedText && activeSelectedText.length > 0) {
        queryToRun = activeSelectedText;
        isSelectedQuery = true;
      }

      if (isSelectedQuery) {
        const lineCount = queryToRun.split('\n').length;
        addLog(
          'info',
          `⚡ Executing selected SQL statement(s) from ${fileToRun.name} (${lineCount} line${lineCount === 1 ? '' : 's'})...`
        );
      } else {
        addLog('info', `⚡ Executing SQL script from ${fileToRun.name}...`);
      }

      try {
        const db = await initSql();
        if (!db) throw new Error('SQL database engine could not be initialized.');

        const queryStartTime = performance.now();
        const formattedResults = await mysqlEngine.executeScript(queryToRun, isSelectedQuery);
        const queryDuration = performance.now() - queryStartTime;

        setSqlResults(formattedResults);
        setSqlViewMode('table');

        const activeDb = mysqlEngine.getActiveDbName();
        setActiveSqlDbName(activeDb);
        setSchemaVersion((v) => v + 1);
        const hasErrors = formattedResults.some((r) => r.error);

        if (hasErrors) {
          const firstErr = formattedResults.find((r) => r.error);
          addLog('error', `❌ SQL Error [${activeDb}]: ${firstErr?.error}`);
        } else {
          addLog(
            'success',
            `✅ ${isSelectedQuery ? 'Selected SQL' : 'SQL script'} executed successfully in [${activeDb}] (${formattedResults.length} statement(s), ${queryDuration.toFixed(1)}ms).`
          );
        }
      } catch (sqlErr: any) {
        const errorMsg = sqlErr?.message || String(sqlErr);
        setSqlResults([
          {
            columns: [],
            values: [],
            error: errorMsg,
            query: isSelectedQuery ? queryToRun : undefined,
            isSelected: isSelectedQuery,
            database: mysqlEngine.getActiveDbName(),
          },
        ]);
        setSqlViewMode('table');
        addLog('error', `❌ SQL execution failed: ${errorMsg}`);
      } finally {
        setIsSqlLoading(false);
        setIsRunning(false);
      }
      return;
    }

    if (language === 'javascript' || language === 'typescript') {
      try {
        const capturedLogs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args: unknown[]) => {
          capturedLogs.push(
            args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
          );
        };
        console.error = (...args: unknown[]) => {
          capturedLogs.push(
            '[ERROR] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
          );
        };
        console.warn = (...args: unknown[]) => {
          capturedLogs.push(
            '[WARN] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
          );
        };

        const currentActiveId = activeFileIdRef.current || activeFileId;
        const fileToRun =
          currentFiles.find((f) => f.id === currentActiveId) ||
          currentFiles.find((f) => f.name === 'main.js') ||
          currentFiles[0];

        addLog('info', `⚡ Running ${fileToRun.name}...`);

        // eslint-disable-next-line no-new-func
        const fn = new Function(fileToRun.content);
        const result = fn();

        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        const elapsed = (performance.now() - startTime).toFixed(1);

        if (capturedLogs.length > 0) {
          capturedLogs.forEach((line) => {
            if (line.startsWith('[ERROR]')) addLog('error', line.replace('[ERROR] ', ''));
            else if (line.startsWith('[WARN]')) addLog('warn', line.replace('[WARN] ', ''));
            else addLog('log', line);
          });
        }

        if (result !== undefined) {
          addLog('info', `Returned: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
        }

        if (capturedLogs.length === 0 && result === undefined) {
          addLog('info', '(Executed with no output. Use console.log() to view values)');
        }

        addLog('success', `Done in ${elapsed}ms`);
      } catch (err) {
        addLog('error', String(err));
      } finally {
        setIsRunning(false);
      }
      return;
    }

    if (language === 'c' || language === 'cpp' || language === 'java') {
      const currentActiveId = activeFileIdRef.current || activeFileId;
      const fileToRun =
        currentFiles.find((f) => f.id === currentActiveId) ||
        currentFiles.find((f) => f.language === language) ||
        currentFiles[0];

      if (!stdin.trim() && (fileToRun.content.includes('cin') || fileToRun.content.includes('scanf'))) {
        addLog(
          'info',
          "💡 Tip: If your program asks for user input (cin / scanf), enter input values in the 'Input (stdin)' tab before clicking Run."
        );
      }

      addLog('info', `⚡ Compiling and executing ${fileToRun.name} (${fileToRun.language.toUpperCase()})...`);

      try {
        const result = await runRemoteCode(fileToRun.language, fileToRun.content, stdin);
        const elapsed = result.elapsedMs;

        if (result.compilerError) {
          addLog('error', result.compilerError);
        }
        if (result.stderr) {
          addLog('error', result.stderr);
        }
        if (result.stdout) {
          addLog('log', result.stdout);
        }

        if (result.wasAutoWrapped) {
          addLog(
            'info',
            "💡 Tip: Code snippet was automatically executed inside 'int main()'. In standard C/C++, loops, variables, and statements should be enclosed inside 'int main() { ... }'."
          );
        }

        if (result.success) {
          if (!result.stdout && !result.stderr) {
            addLog('info', '(Program completed successfully with no printed output)');
          }
          addLog('success', `Process exited with code ${result.exitCode} (${elapsed}ms)`);
        } else {
          if (!result.compilerError && !result.stderr) {
            addLog('error', `Process terminated with exit code ${result.exitCode} (${elapsed}ms)`);
          }
        }
      } catch (remoteErr) {
        addLog('error', `Execution failed: ${remoteErr instanceof Error ? remoteErr.message : String(remoteErr)}`);
      } finally {
        setIsRunning(false);
      }
      return;
    }

    const elapsed = (performance.now() - startTime).toFixed(1);
    addLog('success', `Parsed in ${elapsed}ms`);
    setIsRunning(false);
  };

  // Copy Code
  const handleCopyCode = () => {
    if (!activeFile) {
      toast.error('No active file to copy');
      return;
    }
    navigator.clipboard.writeText(activeCode);
    setCopiedCode(true);
    toast.success(`Copied ${activeFile.name} code!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download File
  const handleDownloadFile = () => {
    if (!activeFile) {
      toast.error('No active file to download');
      return;
    }
    const filename = activeFile.name;
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
    setIsDownloadMenuOpen(false);
  };

  // Download Entire Project as ZIP (With Folder Hierarchy)
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      for (const folder of folders) {
        zip.folder(folder.name);
      }
      for (const file of files) {
        const relPath = getFileRelativePath(file, folders);
        zip.file(relPath, file.content);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${language}-project-msk.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${files.length} files as ZIP!`);
      setIsDownloadMenuOpen(false);
    } catch (err) {
      console.error('Error generating zip:', err);
      toast.error('Failed to export ZIP file');
    }
  };

  // Reset Code
  const handleResetCode = () => {
    const templates = STARTER_TEMPLATES[language] || [];
    const tpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];
    if (tpl) {
      const newFiles = buildInitialFiles(language, tpl.code);
      setFiles(newFiles);
      filesRef.current = newFiles;
      setFolders([]);
      setActiveFileId(newFiles[0].id);
      activeFileIdRef.current = newFiles[0].id;
      setOpenTabIds(newFiles.map((f) => f.id));
      setUnsavedFileIds(new Set());
      setLogs([]);
      setHasSelection(false);

      deletePlaygroundWorkspace(language);

      if (language === 'sql') {
        mysqlEngine.reset();
        window.__mskSqlDb = mysqlEngine.getActiveDb();
        setActiveSqlDbName(mysqlEngine.getActiveDbName());
        setSchemaVersion((v) => v + 1);
        setSqlResults([]);
      }
      toast.success('Workspace reset to template');
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Draggable Resizer Handler
  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let newPercent = splitPercent;
      if (settings.panelPosition === 'right') {
        const offset = clientX - rect.left;
        newPercent = (offset / rect.width) * 100;
      } else {
        const offset = clientY - rect.top;
        newPercent = (offset / rect.height) * 100;
      }

      // Clamp between 20% and 80%
      const clamped = Math.max(20, Math.min(80, newPercent));
      setSplitPercent(clamped);
      try {
        localStorage.setItem(SPLIT_STORAGE_KEY, clamped.toString());
      } catch {
        // ignore
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, settings.panelPosition, splitPercent]);

  // Combine HTML, CSS, and JS for Web Preview
  const getCompositeHtml = () => {
    const currentFiles = getLatestFiles();
    const currentActiveId = activeFileIdRef.current || activeFileId;
    const currentActiveFile = currentFiles.find((f) => f.id === currentActiveId);

    // If the active file is an HTML document, prioritize it for preview
    const htmlFile =
      (currentActiveFile && currentActiveFile.name.endsWith('.html') ? currentActiveFile : null) ||
      currentFiles.find((f) => f.name.endsWith('.html')) ||
      currentActiveFile ||
      currentFiles[0];

    const cssFile = currentFiles.find((f) => f.name.endsWith('.css'));
    const jsFile = currentFiles.find((f) => f.name.endsWith('.js'));

    let content = htmlFile?.content || '';

    // Inject CSS if external CSS file exists and is not already inline
    if (cssFile && cssFile.content && !content.includes(cssFile.content)) {
      if (content.includes('</head>')) {
        content = content.replace('</head>', `<style>\n${cssFile.content}\n</style>\n</head>`);
      } else {
        content = `<style>\n${cssFile.content}\n</style>\n` + content;
      }
    }

    // Inject JS if external JS file exists and is not already inline
    if (jsFile && jsFile.content && !content.includes(jsFile.content)) {
      if (content.includes('</body>')) {
        content = content.replace('</body>', `<script>\n${jsFile.content}\n</script>\n</body>`);
      } else {
        content = content + `\n<script>\n${jsFile.content}\n</script>`;
      }
    }

    return content;
  };

  const templatesForLang = STARTER_TEMPLATES[language] || [];

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-[#1e1e1e] text-slate-200 overflow-hidden select-none ${
        settings.focusMode
          ? '!fixed !inset-0 !z-[9999] !w-screen !h-screen !max-w-none !m-0 !rounded-none shadow-none'
          : isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none'
          : 'w-full h-full rounded-xl border border-slate-800 shadow-2xl'
      } ${settings.theme === 'light' ? 'theme-light' : ''}`}
      style={{ minHeight: isModal ? '550px' : '650px' }}
    >
      {/* 1. TOP VS CODE TITLE & ACTION TOOLBAR */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-[#181818] border-b border-[#2b2b2b] text-xs z-10">
        {/* Left: Brand + Language Picker + Templates */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-center gap-2 pr-2 border-r border-[#333]">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-secondary to-orange-400 flex items-center justify-center text-white shadow-xs">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-tight hidden sm:inline">
              <span className="text-secondary font-extrabold">MSK</span> Code Playground
            </span>
          </div>

          {/* Quick Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252526] hover:bg-[#2d2d2e] border border-[#3c3c3c] text-slate-200 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              title="Select Programming Language / Compiler"
            >
              <span className="text-sm">{getLangIcon(language)}</span>
              <span>{getLangDisplayName(language)}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#1e1e1e] border border-slate-700/90 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                    Select Language / Compiler
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-0.5">
                    {PLAYGROUND_LANGUAGES.map((item) => {
                      const isSelected = item.lang === language;
                      return (
                        <button
                          key={item.lang}
                          type="button"
                          onClick={() => {
                            setIsLangMenuOpen(false);
                            handleLanguageChange(item.lang);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-secondary/20 text-secondary font-semibold border border-secondary/30'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base shrink-0">{item.icon}</span>
                            <div className="flex flex-col truncate">
                              <span className="text-xs font-medium">{item.label}</span>
                              <span className="text-[10px] text-slate-400 truncate">{item.desc}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-secondary shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Primary Run Button & Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* PRIMARY RUN CODE BUTTON */}
          <ActionTooltip
            label={
              language === 'markdown'
                ? `Preview Markdown (${activeFile?.name || 'document.md'})`
                : language === 'sql' && hasSelection
                ? 'Run Selected SQL Query'
                : `Run Active File (${activeFile?.name || 'Code'})`
            }
            shortcut="Ctrl + Enter"
            placement="bottom"
          >
            <button
              onClick={handleRunCode}
              disabled={isRunning || isPyodideLoading || isSqlLoading}
              className={`w-8 h-8 flex items-center justify-center ${
                language === 'markdown' || (language === 'sql' && hasSelection)
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-950/40 text-white'
                  : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'
              } active:scale-95 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50`}
              aria-label={
                language === 'markdown'
                  ? `Preview Markdown (${activeFile?.name || 'document.md'}) (Ctrl + Enter)`
                  : `Run ${activeFile?.name || 'Code'} (Ctrl + Enter)`
              }
            >
              {isRunning || isPyodideLoading || isSqlLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : language === 'markdown' ? (
                <Eye className="w-4 h-4" />
              ) : language === 'sql' && hasSelection ? (
                <Sparkles className="w-4 h-4 text-emerald-200" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </ActionTooltip>

          {/* AI Code Tutor & Explainer */}
          <ActionTooltip
            label="MSK AI Code Tutor (Explain & Fix)"
            shortcut="AI Tutor"
            placement="bottom"
          >
            <button
              onClick={() => {
                setAiExplainerError(null);
                setIsAiExplainerOpen(true);
              }}
              aria-label="MSK AI Code Tutor"
              className="w-8 h-8 flex items-center justify-center bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </ActionTooltip>

          {/* 1-Click Code Formatter / Beautifier */}
          <ActionTooltip
            label="Format Code / Beautify Document"
            shortcut="Shift + Alt + F"
            placement="bottom"
          >
            <button
              onClick={handleFormatCode}
              aria-label="Format Code"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
            </button>
          </ActionTooltip>

          {/* Export Beautiful Code Screenshot (Carbon/Ray.so) */}
          <ActionTooltip
            label="Export Code Screenshot (Carbon / Ray.so)"
            shortcut="Snap"
            placement="bottom"
          >
            <button
              onClick={() => setIsScreenshotOpen(true)}
              aria-label="Export Code Screenshot"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-sky-400" />
            </button>
          </ActionTooltip>

          {/* Panel Position Toggle: Right vs Bottom */}
          <ActionTooltip
            label={
              settings.panelPosition === 'right'
                ? 'Move Output Panel to Bottom'
                : 'Move Output Panel to Right'
            }
            shortcut="Layout"
            placement="bottom"
          >
            <button
              onClick={() =>
                updateSettings({
                  panelPosition: settings.panelPosition === 'right' ? 'bottom' : 'right',
                })
              }
              aria-label="Toggle Panel Layout"
              className="w-8 h-8 text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer hidden sm:flex items-center justify-center"
            >
              {settings.panelPosition === 'right' ? (
                <SplitSquareVertical className="w-4 h-4" />
              ) : (
                <SplitSquareHorizontal className="w-4 h-4" />
              )}
            </button>
          </ActionTooltip>
          {/* Share Code & QR Code */}
          <ActionTooltip
            label="Share Code via Link & QR Code"
            shortcut="Share"
            placement="bottom"
          >
            <button
              onClick={() => setIsShareOpen(true)}
              aria-label="Share Code via Link & QR Code"
              className="w-8 h-8 flex items-center justify-center bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/30 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </ActionTooltip>

          {/* Download Menu (File vs ZIP) */}
          <div className="relative hidden sm:block">
            <ActionTooltip
              label="Download Code File or Project ZIP"
              shortcut="Export"
              placement="bottom-end"
            >
              <button
                onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                aria-label="Download Code File or ZIP"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </ActionTooltip>

            {isDownloadMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#1e1e1e] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 text-slate-200 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-[11px] truncate">Download {activeFile?.name || 'File'}</span>
                    <span className="text-[10px] text-slate-400">Current active file</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800 text-slate-200 rounded-lg transition-colors text-left border-t border-slate-800/80 mt-1 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-[11px] truncate">Download Project (.ZIP)</span>
                    <span className="text-[10px] text-slate-400">All {files.length} workspace files</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Focus Mode (Zen Mode) */}
          <ActionTooltip
            label={settings.focusMode ? 'Exit Zen Focus Mode' : 'Zen Distraction-Free Focus Mode'}
            shortcut="Esc"
            placement="bottom-end"
          >
            <button
              onClick={() => updateSettings({ focusMode: !settings.focusMode })}
              aria-label="Toggle Zen Focus Mode"
              className={`w-8 h-8 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                settings.focusMode
                  ? 'bg-secondary text-white'
                  : 'text-slate-400 hover:text-white hover:bg-[#2a2d2e]'
              }`}
            >
              {settings.focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </ActionTooltip>

          {/* Open in Full Page (when opened inside modal from tutorial page) */}
          {isModal && (
            <ActionTooltip label="Open Full Page in New Tab" placement="bottom-end">
              <a
                href={`/playground?lang=${encodeURIComponent(
                  activeFile?.language || resolvedInitialLang
                )}&code=${encodeURIComponent(
                  editorInstanceRef.current?.getValue() || activeFile?.content || initialCode || ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Full Page in New Tab"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-secondary hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </ActionTooltip>
          )}

          {/* Fullscreen toggle */}
          <ActionTooltip
            label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            shortcut="F11"
            placement="bottom-end"
          >
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded-lg transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </ActionTooltip>

          {/* Close Modal if inside dialog */}
          {isModal && onCloseModal && (
            <ActionTooltip label="Close Playground" shortcut="Esc" placement="bottom-end">
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close Playground"
                className="ml-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-[#2a2d2e] hover:bg-rose-600/90 border border-slate-700/80 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </ActionTooltip>
          )}
        </div>
      </div>

      {/* 2. MOBILE VIEW SWITCHER TABS (on screens < 768px) */}
      <div className="md:hidden flex items-center bg-[#252526] border-b border-[#333] text-xs">
        <button
          type="button"
          onClick={() => setMobileActiveView('editor')}
          className={`flex-1 py-2 text-center font-semibold transition-colors ${
            mobileActiveView === 'editor'
              ? 'bg-[#1e1e1e] text-secondary border-b-2 border-secondary'
              : 'text-slate-400'
          }`}
        >
          💻 Code ({activeFile?.name || 'No file'})
        </button>
        <button
          type="button"
          onClick={() => setMobileActiveView('output')}
          className={`flex-1 py-2 text-center font-semibold transition-colors ${
            mobileActiveView === 'output'
              ? 'bg-[#1e1e1e] text-secondary border-b-2 border-secondary'
              : 'text-slate-400'
          }`}
        >
          ⚡ Output / Preview {logs.length > 0 && `(${logs.length})`}
        </button>
      </div>

      {/* 3. MAIN WORKSPACE WITH ACTIVITY BAR, SIDEBAR, EDITOR & OUTPUT */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Activity Bar (VS Code Left Strip) */}
        <ActivityBar
          activeView={sidebarView}
          onToggleView={(view) => setSidebarView(view)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Collapsible Sidebar: Explorer or Search */}
        {sidebarView === 'explorer' && (
          <FileExplorerSidebar
            files={files}
            folders={folders}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onRenameFolder={handleRenameFolder}
            onToggleFolder={handleToggleFolder}
            onCollapseAllFolders={handleCollapseAllFolders}
            onOpenLocalFile={triggerOpenFilePicker}
            onOpenLocalFolder={triggerOpenFolderPicker}
            onOpenLocalZip={triggerOpenZipPicker}
            onClose={() => setSidebarView(null)}
            currentLanguage={language}
            activeSqlDbName={activeSqlDbName}
            onSwitchDatabase={handleSwitchDatabase}
            onInsertSqlSnippet={handleInsertSqlSnippet}
            schemaVersion={schemaVersion}
          />
        )}

        {sidebarView === 'search' && (
          <SearchSidebar
            files={files}
            folders={folders}
            onSelectResult={handleSelectSearchResult}
            onClose={() => setSidebarView(null)}
          />
        )}

        {sidebarView === 'challenges' && (
          <ChallengesSidebar
            currentLanguage={language}
            onSelectChallenge={handleSelectChallenge}
            onRunTestCases={handleRunChallengeTests}
            onClose={() => setSidebarView(null)}
          />
        )}

        {sidebarView === 'examples' && (
          <ExamplesSidebar
            currentLanguage={language}
            onSelectExample={handleSelectExample}
            onClose={() => setSidebarView(null)}
          />
        )}

        {/* Workspace Split (Editor on Left/Top, Output on Right/Bottom) */}
        <div
          className={`flex-1 flex min-h-0 overflow-hidden relative ${
            settings.panelPosition === 'bottom' ? 'flex-col' : 'flex-col md:flex-row'
          }`}
        >
          {/* Editor & Multi-Tab Container */}
          <div
            className={`flex flex-col overflow-hidden ${
              mobileActiveView === 'output' ? 'hidden md:flex' : 'flex'
            }`}
            style={{
              flex: isPanelOpen
                ? typeof window !== 'undefined' && window.innerWidth < 768
                  ? '1 1 100%'
                  : `${splitPercent} 1 0%`
                : '1 1 100%',
            }}
          >
            {/* Multi-File Tab Bar */}
            <div className="flex items-center justify-between bg-[#252526] border-b border-[#1e1e1e] px-1 text-xs overflow-x-auto no-scrollbar">
              <div className="flex items-center">
                {openTabIds.map((tabId) => {
                  const file = files.find((f) => f.id === tabId);
                  if (!file) return null;
                  const isActive = file.id === activeFileId;
                  const isUnsaved = unsavedFileIds.has(file.id);
                  return (
                    <div
                      key={file.id}
                      onClick={() => handleSelectFile(file.id)}
                      className={`group flex items-center gap-2 px-3 py-1.5 cursor-pointer border-r border-[#2d2d2d] font-mono text-[11px] select-none transition-colors ${
                        isActive
                          ? 'bg-[#1e1e1e] border-t-2 border-t-secondary text-white font-semibold'
                          : 'bg-[#2d2d2d]/60 text-slate-400 hover:bg-[#2d2d2d] hover:text-slate-200'
                      }`}
                    >
                      <span>{getFileIcon(file.language)}</span>
                      <span>{file.name}</span>
                      {isUnsaved && (
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-xs ml-0.5"
                          title="Unsaved changes (Auto-saves before running)"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleCloseTab(file.id, e)}
                        aria-label={`Close ${file.name}`}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white hover:bg-[#333] rounded ml-0.5 transition-opacity cursor-pointer"
                        title="Close Tab"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Right Tab Bar Controls: Close All Editors + Toggle Output Panel */}
              <div className="flex items-center gap-1">
                {/* Open Preview to the Side (when Markdown or HTML is active) */}
                {(language === 'markdown' || language === 'html') && openTabIds.length > 0 && (
                  <ActionTooltip
                    label={
                      isPanelOpen && activeTab === 'preview'
                        ? 'Close Live Preview'
                        : 'Open Preview to the Side'
                    }
                    shortcut="Ctrl + Enter"
                    placement="bottom-end"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isPanelOpen && activeTab === 'preview') {
                          setIsPanelOpen(false);
                        } else {
                          setIsPanelOpen(true);
                          setActiveTab('preview');
                        }
                      }}
                      aria-label="Open Preview to the Side"
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isPanelOpen && activeTab === 'preview'
                          ? 'text-secondary bg-secondary/20'
                          : 'text-slate-400 hover:text-white hover:bg-[#333]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </ActionTooltip>
                )}

                {openTabIds.length > 0 && (
                  <ActionTooltip
                    label="Close All Editors"
                    shortcut="Close All"
                    placement="bottom-end"
                  >
                    <button
                      type="button"
                      onClick={handleCloseAllTabs}
                      aria-label="Close All Editors"
                      className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-[#333] transition-colors cursor-pointer hidden sm:block"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </ActionTooltip>
                )}

                {/* Quick action: toggle output panel */}
                <ActionTooltip
                  label={isPanelOpen ? 'Hide Terminal / Preview Panel' : 'Show Terminal / Preview Panel'}
                  shortcut="Ctrl + `"
                  placement="bottom-end"
                >
                  <button
                    onClick={() => setIsPanelOpen((prev) => !prev)}
                    aria-label="Toggle Output Panel (Ctrl + `)"
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#333] transition-colors hidden md:block"
                  >
                    {settings.panelPosition === 'right' ? (
                      <SplitSquareHorizontal className="w-3.5 h-3.5" />
                    ) : (
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                    )}
                  </button>
                </ActionTooltip>
              </div>
            </div>

            {/* Editor Component or Empty Editors State */}
            <div className="flex-1 w-full h-full relative overflow-hidden bg-[#1e1e1e]">
              {openTabIds.length === 0 || !activeFile ? (
                <EmptyEditorState
                  onCreateFile={() => {
                    setSidebarView('explorer');
                  }}
                  onCreateFolder={() => {
                    setSidebarView('explorer');
                  }}
                  onOpenFirstFile={() => {
                    if (files.length > 0) {
                      handleSelectFile(files[0].id);
                    }
                  }}
                  onOpenLocalFile={() => triggerOpenFilePicker()}
                  onOpenLocalFolder={triggerOpenFolderPicker}
                  onOpenLocalZip={triggerOpenZipPicker}
                  onOpenExamples={() => setSidebarView('examples')}
                  hasFiles={files.length > 0}
                />
              ) : (
                <div className="w-full h-full flex flex-col overflow-hidden">
                  {language === 'markdown' && (
                    <MarkdownToolbar
                      onInsertMarkdown={handleInsertMarkdownSnippet}
                      onOpenPreview={() => {
                        setIsPanelOpen(true);
                        setActiveTab('preview');
                      }}
                      isPreviewOpen={isPanelOpen && activeTab === 'preview'}
                    />
                  )}
                  <div className="flex-1 w-full h-full relative overflow-hidden">
                    <CodeEditor
                      value={activeCode}
                      onChange={handleCodeChange}
                      language={activeFile?.language || language}
                      settings={settings}
                      onRun={handleRunCode}
                      onSave={handleSaveDocument}
                      onFormat={handleFormatCode}
                      onOpenFile={() => triggerOpenFilePicker()}
                      onTogglePanel={() => setIsPanelOpen((prev) => !prev)}
                      onToggleSidebar={toggleSidebar}
                      onToggleTerminal={() => {
                        setIsPanelOpen(true);
                        setActiveTab('terminal');
                      }}
                      onToggleExplorer={() =>
                        setSidebarView((prev) => (prev === 'explorer' ? null : 'explorer'))
                      }
                      onToggleSearch={() =>
                        setSidebarView((prev) => (prev === 'search' ? null : 'search'))
                      }
                      onCursorChange={(pos) => setCursorPos(pos)}
                      onMountEditor={(ed) => {
                        editorInstanceRef.current = ed;
                        ed.onDidChangeCursorSelection((e) => {
                          const model = ed.getModel();
                          if (model && !e.selection.isEmpty()) {
                            const text = model.getValueInRange(e.selection).trim();
                            setHasSelection(text.length > 0);
                          } else {
                            setHasSelection(false);
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Quick Symbols Bar */}
            <MobileSymbolsBar
              onInsertSymbol={insertTextAtCursor}
              onInsertTab={insertTab}
            />
          </div>

          {/* DRAGGABLE RESIZER DIVIDER (Visible on Desktop when panel is open) */}
          {isPanelOpen && (
            <div
              onMouseDown={startDragging}
              onTouchStart={startDragging}
              title="Drag to resize panels"
              className={`hidden md:flex items-center justify-center bg-[#2b2b2b] hover:bg-secondary transition-colors z-20 select-none ${
                settings.panelPosition === 'right'
                  ? 'w-1.5 cursor-col-resize hover:w-2'
                  : 'h-1.5 cursor-row-resize hover:h-2'
              } ${isDragging ? 'bg-secondary w-2' : ''}`}
            >
              {settings.panelPosition === 'right' ? (
                <GripVertical className="w-3 h-3 text-slate-500 pointer-events-none opacity-40" />
              ) : (
                <GripHorizontal className="w-3 h-3 text-slate-500 pointer-events-none opacity-40" />
              )}
            </div>
          )}

          {/* RIGHT / BOTTOM: Terminal & Live Preview Output */}
          {isPanelOpen && (
            <div
              className={`flex flex-col bg-[#1e1e1e] overflow-hidden ${
                mobileActiveView === 'editor' ? 'hidden md:flex' : 'flex'
              }`}
              style={{
                flex:
                  typeof window !== 'undefined' && window.innerWidth < 768
                    ? '1 1 100%'
                    : `${100 - splitPercent} 1 0%`,
              }}
            >
              {/* Panel Tabs Bar (VS Code Integrated Terminal / Output Tab) */}
              <div className="flex items-center justify-between px-3 bg-[#252526] border-b border-[#1e1e1e] text-xs">
                <div className="flex items-center gap-1">
                  {(language === 'html' || language === 'css' || language === 'markdown') && (
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors cursor-pointer text-xs ${
                        activeTab === 'preview'
                          ? 'text-white border-b-2 border-secondary font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-secondary" />
                      <span>{language === 'markdown' ? 'Markdown Preview' : 'Live Preview'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors cursor-pointer text-xs ${
                      activeTab === 'terminal'
                        ? 'text-white border-b-2 border-secondary font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal Console</span>
                    {logs.length > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#333] text-slate-300 rounded text-[10px]">
                        {logs.length}
                      </span>
                    )}
                  </button>

                  {language !== 'html' && language !== 'css' && language !== 'markdown' && language !== 'sql' && (
                    <button
                      onClick={() => setActiveTab('testcases')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors cursor-pointer text-xs ${
                        activeTab === 'testcases'
                          ? 'text-white border-b-2 border-secondary font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>⚡ Test Cases</span>
                    </button>
                  )}

                  {(language === 'c' || language === 'cpp' || language === 'python' || language === 'java') && (
                    <button
                      onClick={() => setActiveTab('visualizer')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors cursor-pointer text-xs ${
                        activeTab === 'visualizer'
                          ? 'text-white border-b-2 border-secondary font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🔬 DS & Pointers</span>
                    </button>
                  )}
                </div>

                {/* Panel Actions: Move Right/Bottom + Close */}
                <div className="flex items-center gap-1">
                  {language === 'markdown' && activeTab === 'preview' && (
                    <ActionTooltip label="Print / Save as PDF (Ctrl + P)" placement="bottom-end">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        aria-label="Print Document as PDF"
                        className="flex items-center gap-1 px-2 py-0.5 text-slate-300 hover:text-white bg-[#2d2d2e] hover:bg-[#383838] border border-[#444] rounded transition-colors cursor-pointer text-[11px] mr-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Print / PDF</span>
                      </button>
                    </ActionTooltip>
                  )}

                  <ActionTooltip
                    label={settings.panelPosition === 'right' ? 'Move Panel to Bottom' : 'Move Panel to Right'}
                    shortcut="Layout"
                    placement="bottom-end"
                  >
                    <button
                      onClick={() =>
                        updateSettings({
                          panelPosition: settings.panelPosition === 'right' ? 'bottom' : 'right',
                        })
                      }
                      aria-label="Toggle Panel Layout"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      {settings.panelPosition === 'right' ? (
                        <SplitSquareVertical className="w-3.5 h-3.5" />
                      ) : (
                        <SplitSquareHorizontal className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </ActionTooltip>

                  <ActionTooltip
                    label="Close Terminal / Preview Panel"
                    shortcut="Ctrl + `"
                    placement="bottom-end"
                  >
                    <button
                      onClick={() => setIsPanelOpen(false)}
                      aria-label="Close Output Panel"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </ActionTooltip>
                </div>
              </div>

              {/* Panel Tab Content */}
              <div className="flex-1 overflow-hidden relative">
                {language === 'sql' ? (
                  <div className="w-full h-full flex flex-col overflow-hidden">
                    <div className="flex items-center px-3 py-1 bg-[#1a1a1a] border-b border-[#2d2d2d] text-xs gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => setSqlViewMode('table')}
                        className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer text-xs ${
                          sqlViewMode === 'table' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📊 Result Tables {sqlResults.length > 0 && `(${sqlResults.length})`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSqlViewMode('log')}
                        className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer text-xs ${
                          sqlViewMode === 'log' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Terminal Console {logs.length > 0 && `(${logs.length})`}
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {sqlViewMode === 'table' ? (
                        <SqlTableOutput results={sqlResults} isLoading={isSqlLoading} />
                      ) : (
                        <ConsoleOutput
                          logs={logs}
                          onClear={() => setLogs([])}
                          isRunning={isRunning || isSqlLoading}
                          onJumpToLine={(lineNum) => handleSelectSearchResult(activeFileId, lineNum, 1)}
                          onExplainError={(errMsg) => {
                            setAiExplainerError(errMsg);
                            setIsAiExplainerOpen(true);
                          }}
                          activeFileName={activeFile?.name}
                        />
                      )}
                    </div>
                  </div>
                ) : activeTab === 'testcases' ? (
                  <div className="w-full h-full overflow-hidden bg-[#1e1e1e]">
                    <MultiTestcaseRunner
                      language={language}
                      code={activeFile?.content || activeCode || ''}
                      onRunSingleCustomInput={handleRunSingleCustomInput}
                    />
                  </div>
                ) : activeTab === 'visualizer' ? (
                  <div className="w-full h-full overflow-hidden bg-[#1e1e1e]">
                    <DataStructureVisualizer
                      currentCode={activeFile?.content || activeCode || ''}
                      language={language}
                    />
                  </div>
                ) : activeTab === 'preview' && language === 'markdown' ? (
                  <MarkdownPreview
                    content={activeFile?.content || activeCode || ''}
                    fileName={activeFile?.name || 'document.md'}
                    theme={settings.theme}
                  />
                ) : activeTab === 'preview' && (language === 'html' || language === 'css') ? (
                  <WebPreview
                    htmlCode={getCompositeHtml()}
                    onConsoleLog={(msg) => addLog(msg.type, msg.content)}
                  />
                ) : (
                  <ConsoleOutput
                    logs={logs}
                    onClear={() => setLogs([])}
                    isRunning={isRunning || isPyodideLoading}
                    stdin={stdin}
                    onStdinChange={setStdin}
                    plots={plots}
                    onJumpToLine={(lineNum) => handleSelectSearchResult(activeFileId, lineNum, 1)}
                    onExplainError={(errMsg) => {
                      setAiExplainerError(errMsg);
                      setIsAiExplainerOpen(true);
                    }}
                    activeFileName={activeFile?.name}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. VS CODE STATUS BAR (Bottom) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-[11px] font-sans font-medium select-none overflow-x-auto no-scrollbar">
        {/* Left Side: Git Branch, Diagnostics, Line & Column */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>

          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer">
            <CheckCircle2 className="w-3 h-3" />
            <span>0</span>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <span>
              Ln {cursorPos.lineNumber}, Col {cursorPos.column}
            </span>
          </div>

          {language === 'sql' && (
            <span
              title={`Active MySQL Database: ${activeSqlDbName}`}
              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-500/20 text-sky-200 border border-sky-400/30 rounded text-[10px] font-mono"
            >
              <span>🗄️</span>
              <span className="font-semibold text-white/90">{activeSqlDbName}</span>
            </span>
          )}

          {language === 'sql' && hasSelection && (
            <span
              title="Selected SQL query will be executed"
              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded text-[10px] font-mono"
            >
              <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
              <span>Query Selected</span>
            </span>
          )}

          {language === 'markdown' && (
            <span
              title="Markdown Live Preview Ready (Ctrl + Enter)"
              className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/15 text-white border border-white/20 rounded text-[10px] font-mono"
            >
              <Eye className="w-2.5 h-2.5 text-emerald-300" />
              <span>Markdown</span>
            </span>
          )}

          {/* Auto-Save & Unsaved Status Indicator */}
          <ActionTooltip
            label={
              unsavedFileIds.size > 0
                ? `Save ${activeFile?.name || 'File'} (${unsavedFileIds.size} unsaved file${unsavedFileIds.size > 1 ? 's' : ''})`
                : lastSavedTime
                ? `All files saved (${lastSavedTime})`
                : 'All changes saved'
            }
            shortcut="Ctrl + S"
            placement="top"
          >
            <button
              type="button"
              onClick={() => handleSaveDocument(false)}
              aria-label="Save Document"
              className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
            >
              {unsavedFileIds.size > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                  <span className="text-amber-100 font-semibold">Unsaved ({unsavedFileIds.size})</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 text-emerald-200" />
                  <span className="text-white/90">
                    {lastSavedTime ? `Saved ${lastSavedTime}` : 'Saved'}
                  </span>
                </>
              )}
            </button>
          </ActionTooltip>

          {/* 12-Hour Modification Retention Indicator */}
          <ActionTooltip
            label="Playground workspace is automatically preserved for 12 hours after your last edit. Edits and runs renew the 12-hour timer."
            shortcut="12h Retention"
            placement="top"
          >
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded-full cursor-help transition-colors font-medium border border-white/10">
              <span className="text-[10px]">⏱️</span>
              <span>12h auto-save</span>
            </span>
          </ActionTooltip>
        </div>

        {/* Right Side: Indent, Encoding, End-of-line, Language, Shortcuts, Settings */}
        <div className="flex items-center gap-2.5">
          <ActionTooltip label="Toggle Tab Indent Size" shortcut="Tab Size" placement="top">
            <button
              onClick={() => updateSettings({ tabSize: settings.tabSize === 4 ? 2 : 4 })}
              className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer"
            >
              Spaces: {settings.tabSize}
            </button>
          </ActionTooltip>

          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline">LF</span>

          <ActionTooltip label="Change Language Mode" shortcut="Select Language" placement="top">
            <button
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              className="capitalize font-semibold hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
            >
              <span>{getLangIcon(activeFile?.language || language)}</span>
              <span>{getLangDisplayName(activeFile?.language || language)}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label="Keyboard Shortcuts Cheat Sheet" shortcut="Shortcuts" placement="top-end">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="Keyboard Shortcuts Cheat Sheet"
              className="hover:bg-white/20 p-1 rounded cursor-pointer flex items-center justify-center"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>

          <ActionTooltip label="VS Code Preferences" shortcut="Preferences" placement="top-end">
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="VS Code Settings"
              className="hover:bg-white/20 p-1 rounded cursor-pointer flex items-center justify-center"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* 5. VS CODE SETTINGS MODAL */}
      <PlaygroundSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetDefaults={resetSettings}
      />

      {/* 6. KEYBOARD SHORTCUTS CHEAT SHEET MODAL */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 7. SHARE CODE VIA URL & QR MODAL */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        language={language}
        code={activeCode}
        filename={activeFile?.name}
      />

      {/* 8. CODE SCREENSHOT MODAL (Carbon / Ray.so style) */}
      <CodeScreenshotModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        code={activeCode}
        language={activeFile?.language || language}
        filename={activeFile?.name}
      />

      {/* 9. MSK AI CODE TUTOR & EXPLAINER MODAL */}
      <AiExplainerModal
        isOpen={isAiExplainerOpen}
        onClose={() => {
          setIsAiExplainerOpen(false);
          setAiExplainerError(null);
        }}
        code={activeCode}
        language={activeFile?.language || language}
        errorContext={aiExplainerError}
      />

      {/* Drag & Drop Visual Indicator Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 bg-[#18181b]/85 backdrop-blur-xs border-2 border-dashed border-secondary flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-200">
          <div className="p-6 bg-[#252526] border border-secondary/60 rounded-2xl shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm mx-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/40 flex items-center justify-center">
              <FolderUp className="w-8 h-8 text-secondary animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Drop Files or Folders Here</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically unpacks and imports files, folders, or .zip archives into your MSK workspace.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Local Files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Hidden Folder Input for Local Folders */}
      <input
        ref={folderInputRef}
        type="file"
        multiple
        // @ts-expect-error webkitdirectory is standard in HTML5 browsers but missing from React standard typings
        webkitdirectory=""
        directory=""
        onChange={handleFolderInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Hidden ZIP Input */}
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip"
        onChange={handleZipInputChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
