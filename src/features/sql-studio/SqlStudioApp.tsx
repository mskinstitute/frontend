'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Database,
  Play,
  FileCode,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  Table as TableIcon,
  Search,
  Code2,
  Clock,
  History,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  FolderOpen,
  Plus,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Shield,
  UploadCloud,
  X,
  Edit2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Keyboard,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getSqlWasmEngine,
  inspectDatabaseTables,
  DatabaseTableMeta,
} from '@/lib/sqlWasmLoader';
import { getDatabaseFromBridge, clearDatabaseBridge } from '@/lib/dbBridge';
import {
  loadSqlStudioFiles,
  saveSqlStudioFile,
  deleteSqlStudioFile,
  loadSqlStudioDatabases,
  saveSqlStudioDatabase,
  deleteSqlStudioDatabase,
  loadSqlStudioMeta,
  saveSqlStudioMeta,
  formatTtlRemaining,
  SQL_STUDIO_TTL_MS,
} from '@/lib/studioStorage';
import { splitSqlStatements, normalizeMysqlToSqlite } from '@/features/playground/mysqlEngine';

// Dynamically import Monaco Editor to avoid SSR hydration issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-[#1e1e1e] flex flex-col items-center justify-center text-slate-400 gap-3">
      <RefreshCw className="w-7 h-7 animate-spin text-secondary" />
      <span className="text-xs font-mono">Initializing Monaco SQL Editor...</span>
    </div>
  ),
});

export interface LoadedDatabase {
  id: string;
  name: string;
  fileName: string;
  fileSizeBytes: number;
  db: any;
  tables: DatabaseTableMeta[];
  isBridgeImported?: boolean;
  updatedAt?: number;
}

export interface QueryTab {
  id: string;
  title: string;
  sql: string;
  isModified?: boolean;
  updatedAt?: number;
}

export interface QueryHistoryItem {
  id: string;
  sql: string;
  timestamp: string;
  status: 'success' | 'error';
  executionTimeMs: number;
  rowCount?: number;
  error?: string;
}

export interface ExecutedResult {
  statement: string;
  columns: string[];
  values: any[][];
  executionTimeMs: number;
  affectedRows?: number;
  message?: string;
  error?: string;
}

// Register MySQL helper functions into SQLite engine
function registerMysqlHelperFunctions(db: any, getActiveDbName: () => string) {
  try {
    db.create_function('NOW', () => new Date().toISOString().slice(0, 19).replace('T', ' '));
    db.create_function('CURDATE', () => new Date().toISOString().slice(0, 10));
    db.create_function('CURTIME', () => new Date().toTimeString().slice(0, 8));
    db.create_function('DATABASE', () => getActiveDbName());
    db.create_function('SCHEMA', () => getActiveDbName());
    db.create_function('VERSION', () => '8.0.36-msk (MySQL Workbench Compatible WASM)');
    db.create_function('CONCAT', (...args: any[]) => args.join(''));
    db.create_function('CONCAT_WS', (sep: string, ...args: any[]) => args.join(sep));
    db.create_function('IF', (condition: any, trueVal: any, falseVal: any) => (condition ? trueVal : falseVal));
    db.create_function('MD5', (val: any) => String(val));
    db.create_function('YEAR', (val: any) => (val ? new Date(String(val)).getFullYear() : null));
    db.create_function('MONTH', (val: any) => (val ? new Date(String(val)).getMonth() + 1 : null));
    db.create_function('DAY', (val: any) => (val ? new Date(String(val)).getDate() : null));
  } catch (err) {
    console.warn('Could not register MySQL helper functions on SQLite instance:', err);
  }
}

// Format DESCRIBE / EXPLAIN output matching MySQL Workbench
function describeTable(db: any, rawTableName: string): { columns: string[]; values: any[][] } {
  const tableName = rawTableName.replace(/[`'"]/g, '').trim();
  const pragmaRes = db.exec(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`);
  if (!pragmaRes || pragmaRes.length === 0 || pragmaRes[0].values.length === 0) {
    throw new Error(`Table '${tableName}' doesn't exist`);
  }

  const rows = pragmaRes[0].values.map((r: any[]) => {
    const name = String(r[1] || '');
    const rawType = (r[2] || 'TEXT').toString();
    const notnull = r[3];
    const dflt = r[4];
    const pk = r[5];

    return [
      name,
      rawType,
      notnull === 1 ? 'NO' : 'YES',
      pk === 1 ? 'PRI' : '',
      dflt !== null && dflt !== undefined ? String(dflt) : 'NULL',
      pk === 1 ? 'auto_increment' : '',
    ];
  });

  return {
    columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
    values: rows,
  };
}

// Format SHOW CREATE TABLE output matching MySQL Workbench
function showCreateTable(db: any, rawTableName: string): { columns: string[]; values: any[][] } {
  const tableName = rawTableName.replace(/[`'"]/g, '').trim();
  const res = db.exec(
    `SELECT name AS 'Table', sql AS 'Create Table' FROM sqlite_master WHERE type='table' AND name='${tableName.replace(/'/g, "''")}'`
  );
  if (!res || res.length === 0 || res[0].values.length === 0) {
    throw new Error(`Table '${tableName}' doesn't exist`);
  }
  return {
    columns: ['Table', 'Create Table'],
    values: res[0].values,
  };
}

const DEFAULT_STARTER_SQL = `-- MSK SQL Studio (MySQL Workbench & SQLite Compatible)
-- You can create databases using CREATE DATABASE, switch using USE, or inspect with SHOW DATABASES / SHOW TABLES.

CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

CREATE TABLE IF NOT EXISTS students (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  course VARCHAR(50) DEFAULT 'Python',
  PRIMARY KEY (id)
);

INSERT INTO students (name, email, course) VALUES 
('Rahul Verma', 'rahul@example.com', 'Python Masterclass'),
('Pooja Sharma', 'pooja@example.com', 'Full Stack Web Dev');

SELECT * FROM students;
`;

export default function SqlStudioApp() {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sqlScriptInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // Multi-Database State (starts EMPTY by default)
  const [databases, setDatabases] = useState<LoadedDatabase[]>([]);
  const [activeDbId, setActiveDbId] = useState<string | null>(null);
  const [isEngineLoading, setIsEngineLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // VS Code Primary Activity Bar & Sidebar State
  // Query Files is at TOP/default; Databases is moved DOWN
  const [activeActivity, setActiveActivity] = useState<'files' | 'explorer' | 'snippets' | 'history'>('files');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // WORKSPACE QUERY FILES vs. OPEN EDITOR TABS (VS Code Pattern)
  // queryFiles = all files stored in session (Query Files sidebar)
  // openTabIds = files currently open as tabs in the editor
  const [queryFiles, setQueryFiles] = useState<QueryTab[]>([]);
  const [openTabIds, setOpenTabIds] = useState<string[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabTitle, setEditingTabTitle] = useState<string>('');

  // Execution & Bottom Panel State (terminal-like collapsible output)
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<ExecutedResult[]>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<'results' | 'er' | 'logs'>('results');
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [isBottomPanelExpanded, setIsBottomPanelExpanded] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // UI & Fullscreen / Focus Mode State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const prevFocusModeRef = useRef<boolean | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<{ type: 'info' | 'success' | 'error'; text: string; time: string }[]>([]);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const dragCounter = useRef(0);
  const isProgrammaticChangeRef = useRef(false);

  // Clear query output and logs from terminal
  const handleClearOutput = useCallback(() => {
    setResults([]);
    setLogs([]);
    toast.success('Query output and terminal cleared', {
      icon: '🗑️',
      duration: 1800,
    });
  }, []);

  // Native Monaco Zoom Actions (no persistent storage memory, starts clean at 100%)
  const handleZoomIn = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.fontZoomIn', null);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.fontZoomOut', null);
    }
  }, []);

  const handleResetZoom = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.fontZoomReset', null);
    }
    toast.success('Editor zoom reset to 100%');
  }, []);

  // Open Tabs currently visible in the editor tab bar
  const openTabs = useMemo(() => {
    return openTabIds
      .map((id) => queryFiles.find((f) => f.id === id))
      .filter(Boolean) as QueryTab[];
  }, [openTabIds, queryFiles]);

  // Active Tab Reference
  const activeTab = useMemo(() => {
    return queryFiles.find((f) => f.id === activeTabId) || null;
  }, [queryFiles, activeTabId]);

  // Active Database Reference
  const activeDb = useMemo(() => {
    return databases.find((d) => d.id === activeDbId) || null;
  }, [databases, activeDbId]);

  // Synchronized Refs to eliminate stale closures in Monaco commands and global shortcuts
  const databasesRef = useRef<LoadedDatabase[]>(databases);
  useEffect(() => {
    databasesRef.current = databases;
  }, [databases]);

  const activeDbIdRef = useRef<string | null>(activeDbId);
  useEffect(() => {
    activeDbIdRef.current = activeDbId;
  }, [activeDbId]);

  const activeTabRef = useRef<QueryTab | null>(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const activeTabIdRef = useRef<string | null>(activeTabId);
  useEffect(() => {
    activeTabIdRef.current = activeTabId;
  }, [activeTabId]);

  const handleExecuteSqlRef = useRef<(code?: string) => Promise<void>>(() => Promise.resolve());
  const handleDownloadActiveTabSqlRef = useRef<() => void>(() => {});
  const handleCloseEditorTabRef = useRef<(e: React.MouseEvent | null, tabId: string) => void>(() => {});
  const handleAddTabRef = useRef<(title?: string, sqlContent?: string) => void>(() => {});
  const handleZoomInRef = useRef<() => void>(() => {});
  const handleZoomOutRef = useRef<() => void>(() => {});
  const handleResetZoomRef = useRef<() => void>(() => {});

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const addLog = useCallback((type: 'info' | 'success' | 'error', text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ type, text, time }, ...prev.slice(0, 99)]);
  }, []);

  // Prevent browser default file drop
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);
    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Zen Focus Mode: Body scroll lock, Escape key listener, and toast notification
  useEffect(() => {
    if (prevFocusModeRef.current !== undefined && prevFocusModeRef.current !== isFocusMode) {
      if (isFocusMode) {
        toast('Focus Mode Active (Press Esc to exit)', {
          duration: 2000,
          icon: '🧘',
          id: 'focus-mode-toast',
        });
      } else {
        toast('Exited Focus Mode', {
          duration: 2000,
          icon: '⚡',
          id: 'focus-mode-toast',
        });
      }
    }
    prevFocusModeRef.current = isFocusMode;

    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFocusMode(false);
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
  }, [isFocusMode]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Helper to create an in-memory database instance with MySQL functions
  // Helper to create an in-memory database instance with MySQL functions
  const createFreshDbInstance = useCallback(
    async (name: string, binaryData?: Uint8Array, byteSize = 0, updatedAt?: number) => {
      const SQL = await getSqlWasmEngine();
      const dbInstance = binaryData ? new SQL.Database(binaryData) : new SQL.Database();
      registerMysqlHelperFunctions(dbInstance, () => name);
      const inspected = inspectDatabaseTables(dbInstance);

      const cleanBaseName = name.replace(/\.(db|sqlite|sqlite3)$/i, '').toLowerCase();
      const newRecord: LoadedDatabase = {
        id: Math.random().toString(36).substring(2, 9),
        name: cleanBaseName,
        fileName: `${cleanBaseName}.db`,
        fileSizeBytes: byteSize,
        db: dbInstance,
        tables: inspected,
        updatedAt: updatedAt || Date.now(),
      };
      return newRecord;
    },
    []
  );

  // Initialize DB & Workspace on mount (Persists for 12 hours after modification)
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const fromParam = searchParams.get('from');

        if (fromParam === 'db-viewer') {
          setIsEngineLoading(true);
          const bridgedRecord = await getDatabaseFromBridge();
          if (bridgedRecord && bridgedRecord.data && bridgedRecord.data.length > 0) {
            const now = Date.now();
            const loaded = await createFreshDbInstance(
              bridgedRecord.name || 'imported_database.db',
              bridgedRecord.data,
              bridgedRecord.data.byteLength,
              now
            );
            loaded.isBridgeImported = true;

            if (!isMounted) return;
            databasesRef.current = [loaded];
            setDatabases([loaded]);
            activeDbIdRef.current = loaded.id;
            setActiveDbId(loaded.id);

            // Persist bridged DB in SQL studio store (12h TTL)
            await saveSqlStudioDatabase({
              id: loaded.id,
              name: loaded.name,
              fileName: loaded.fileName,
              fileSizeBytes: loaded.fileSizeBytes,
              data: bridgedRecord.data,
              updatedAt: now,
            });

            addLog('success', `⚡ Imported "${loaded.fileName}" from Database Viewer.`);
            toast.success(`Loaded "${loaded.fileName}" from DB Viewer! (Kept for 12 hours)`);

            if (loaded.tables.length > 0) {
              setSelectedTable(loaded.tables[0].name);
              const defaultQ = `SELECT * FROM "${loaded.tables[0].name.replace(/"/g, '""')}" LIMIT 50;`;
              const initialTab: QueryTab = {
                id: 'tab-1',
                title: `${loaded.name}_query.sql`,
                sql: defaultQ,
                updatedAt: now,
              };
              setQueryFiles([initialTab]);
              setOpenTabIds(['tab-1']);
              activeTabIdRef.current = 'tab-1';
              setActiveTabId('tab-1');

              await saveSqlStudioFile(initialTab);
              await saveSqlStudioMeta({
                openTabIds: ['tab-1'],
                activeTabId: 'tab-1',
                activeDbId: loaded.id,
              });
            }
            await clearDatabaseBridge();
            return;
          }
          await clearDatabaseBridge();
        }

        // Standard load: Restore persisted files and databases from IndexedDB (12h TTL)
        setIsEngineLoading(true);
        const [savedFiles, savedDbs, savedMeta] = await Promise.all([
          loadSqlStudioFiles(),
          loadSqlStudioDatabases(),
          loadSqlStudioMeta(),
        ]);

        if (!isMounted) return;

        // Restore query files
        if (savedFiles && savedFiles.length > 0) {
          setQueryFiles(savedFiles);
        }

        // Restore databases
        let restoredDbs: LoadedDatabase[] = [];
        if (savedDbs && savedDbs.length > 0) {
          for (const item of savedDbs) {
            try {
              const loaded = await createFreshDbInstance(
                item.name,
                item.data,
                item.fileSizeBytes,
                item.updatedAt
              );
              loaded.id = item.id; // preserve persistent ID
              restoredDbs.push(loaded);
            } catch (errDb) {
              console.warn(`Could not restore database ${item.name}:`, errDb);
            }
          }
          databasesRef.current = restoredDbs;
          setDatabases(restoredDbs);
        }

        // Restore active meta (open tabs & active DB)
        if (savedMeta) {
          const validOpenIds = (savedMeta.openTabIds || []).filter((id) =>
            savedFiles.some((f) => f.id === id)
          );
          setOpenTabIds(validOpenIds);

          const activeFile = savedFiles.find((f) => f.id === savedMeta.activeTabId);
          if (activeFile && validOpenIds.includes(activeFile.id)) {
            activeTabIdRef.current = activeFile.id;
            setActiveTabId(activeFile.id);
            if (editorRef.current) {
              editorRef.current.setValue(activeFile.sql);
            }
          } else if (validOpenIds.length > 0) {
            const firstOpen = savedFiles.find((f) => f.id === validOpenIds[0]);
            if (firstOpen) {
              activeTabIdRef.current = firstOpen.id;
              setActiveTabId(firstOpen.id);
              if (editorRef.current) {
                editorRef.current.setValue(firstOpen.sql);
              }
            }
          }

          if (savedMeta.activeDbId && restoredDbs.some((d) => d.id === savedMeta.activeDbId)) {
            activeDbIdRef.current = savedMeta.activeDbId;
            setActiveDbId(savedMeta.activeDbId);
            const activeDbObj = restoredDbs.find((d) => d.id === savedMeta.activeDbId);
            if (activeDbObj && activeDbObj.tables.length > 0) {
              setSelectedTable(activeDbObj.tables[0].name);
            }
          }
        }

        // History
        try {
          const savedHistory = localStorage.getItem('msk_sql_studio_history');
          if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
          }
          localStorage.removeItem('msk_sql_studio_font_size');
        } catch {}
      } catch (err: any) {
        console.warn('Initialization error:', err);
      } finally {
        if (isMounted) setIsEngineLoading(false);
      }
    }

    initSession();

    // Periodic cleanup interval (purges files and databases older than 12 hours)
    const interval = setInterval(async () => {
      if (!isMounted) return;
      const validFiles = await loadSqlStudioFiles();
      const validDbs = await loadSqlStudioDatabases();
      if (!isMounted) return;

      const fileIds = new Set(validFiles.map((f) => f.id));
      const dbIds = new Set(validDbs.map((d) => d.id));

      setQueryFiles((prev) => {
        const filtered = prev.filter((f) => fileIds.has(f.id));
        if (filtered.length !== prev.length) {
          toast('Some inactive query files were automatically purged after 12 hours', {
            icon: '⏱️',
            duration: 3000,
          });
        }
        return filtered;
      });

      setDatabases((prev) => {
        const filtered = prev.filter((d) => dbIds.has(d.id));
        databasesRef.current = filtered;
        return filtered;
      });
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [searchParams, createFreshDbInstance, addLog]);

  // Switch Active Database (like MySQL Workbench double-click or USE)
  const handleSelectDatabase = (dbItem: LoadedDatabase) => {
    activeDbIdRef.current = dbItem.id;
    setActiveDbId(dbItem.id);
    if (dbItem.tables.length > 0) {
      setSelectedTable(dbItem.tables[0].name);
    } else {
      setSelectedTable(null);
    }
  };

  // Close a specific Database
  const handleCloseSingleDatabase = (e: React.MouseEvent, dbIdToClose: string) => {
    e.stopPropagation();
    const dbToClose = databasesRef.current.find((d) => d.id === dbIdToClose);
    if (dbToClose) {
      try {
        dbToClose.db.close();
      } catch {}
    }

    // Delete from IndexedDB persistence
    deleteSqlStudioDatabase(dbIdToClose);

    const updated = databasesRef.current.filter((d) => d.id !== dbIdToClose);
    databasesRef.current = updated;
    setDatabases(updated);

    if (activeDbIdRef.current === dbIdToClose) {
      activeDbIdRef.current = null;
      setActiveDbId(null);
      setSelectedTable(null);
    }
    toast.success('Database closed');
  };

  // 1. ADD / CREATE A NEW QUERY FILE (in workspace & opens in editor)
  const handleAddTab = useCallback(
    (title?: string, sqlContent?: string) => {
      const newId = `tab-${Date.now()}`;
      const newNum = queryFiles.length + 1;
      const newTitle = title || `Query ${newNum}.sql`;
      const now = Date.now();
      const newTab: QueryTab = {
        id: newId,
        title: newTitle,
        sql: sqlContent !== undefined ? sqlContent : `-- ${newTitle}\n-- Write your SQL / MySQL query here:\n`,
        updatedAt: now,
      };

      setQueryFiles((prev) => [...prev, newTab]);
      setOpenTabIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
      activeTabIdRef.current = newId;
      setActiveTabId(newId);
      saveSqlStudioFile(newTab);

      if (editorRef.current) {
        isProgrammaticChangeRef.current = true;
        editorRef.current.setValue(newTab.sql);
        editorRef.current.focus();
        setTimeout(() => {
          isProgrammaticChangeRef.current = false;
        }, 50);
      }
    },
    [queryFiles.length]
  );

  // 2. OPEN A FILE FROM QUERY FILES SIDEBAR INTO THE EDITOR
  const handleOpenFileInEditor = useCallback((file: QueryTab) => {
    setOpenTabIds((prev) => (prev.includes(file.id) ? prev : [...prev, file.id]));
    activeTabIdRef.current = file.id;
    setActiveTabId(file.id);
    if (editorRef.current) {
      isProgrammaticChangeRef.current = true;
      editorRef.current.setValue(file.sql);
      editorRef.current.focus();
      setTimeout(() => {
        isProgrammaticChangeRef.current = false;
      }, 50);
    }
  }, []);

  // 3. CLOSE FILE FROM EDITOR ONLY (does NOT delete from sidebar!)
  const handleCloseEditorTab = useCallback(
    (e: React.MouseEvent | null, tabIdToClose: string) => {
      if (e) e.stopPropagation();

      const tabIndex = openTabIds.indexOf(tabIdToClose);
      const updatedOpen = openTabIds.filter((id) => id !== tabIdToClose);
      setOpenTabIds(updatedOpen);

      if (activeTabId === tabIdToClose) {
        if (updatedOpen.length > 0) {
          const nextId = updatedOpen[Math.max(0, tabIndex - 1)];
          activeTabIdRef.current = nextId;
          setActiveTabId(nextId);
          const nextFile = queryFiles.find((f) => f.id === nextId);
          if (editorRef.current && nextFile) {
            isProgrammaticChangeRef.current = true;
            editorRef.current.setValue(nextFile.sql);
            setTimeout(() => {
              isProgrammaticChangeRef.current = false;
            }, 50);
          }
        } else {
          activeTabIdRef.current = null;
          setActiveTabId(null);
        }
      }
      toast.success('Closed tab from editor (kept in Query Files sidebar)', { duration: 1800 });
    },
    [openTabIds, activeTabId, queryFiles]
  );

  // 4. PERMANENTLY DELETE FILE FROM QUERY FILES SIDEBAR
  const handleDeleteQueryFile = useCallback(
    (e: React.MouseEvent, fileIdToDelete: string) => {
      e.stopPropagation();
      const fileToDelete = queryFiles.find((f) => f.id === fileIdToDelete);
      const title = fileToDelete?.title || 'file';

      // Permanently remove from IndexedDB
      deleteSqlStudioFile(fileIdToDelete);

      // Remove from open tabs if currently open
      const updatedOpen = openTabIds.filter((id) => id !== fileIdToDelete);
      setOpenTabIds(updatedOpen);

      // Permanently remove from queryFiles
      setQueryFiles((prev) => prev.filter((f) => f.id !== fileIdToDelete));

      if (activeTabId === fileIdToDelete) {
        if (updatedOpen.length > 0) {
          const nextId = updatedOpen[0];
          activeTabIdRef.current = nextId;
          setActiveTabId(nextId);
          const nextFile = queryFiles.find((f) => f.id === nextId);
          if (editorRef.current && nextFile) {
            isProgrammaticChangeRef.current = true;
            editorRef.current.setValue(nextFile.sql);
            setTimeout(() => {
              isProgrammaticChangeRef.current = false;
            }, 50);
          }
        } else {
          activeTabIdRef.current = null;
          setActiveTabId(null);
        }
      }
      toast.success(`Deleted "${title}"`);
    },
    [queryFiles, openTabIds, activeTabId]
  );

  const handleSwitchTab = (tab: QueryTab) => {
    isProgrammaticChangeRef.current = true;
    activeTabIdRef.current = tab.id;
    setActiveTabId(tab.id);
    if (editorRef.current) {
      editorRef.current.setValue(tab.sql);
    }
    setTimeout(() => {
      isProgrammaticChangeRef.current = false;
    }, 50);
  };

  const handleStartRenameTab = (e: React.MouseEvent, tab: QueryTab) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTabTitle(tab.title);
  };

  const handleSaveRenameTab = (tabId: string) => {
    const trimmed = editingTabTitle.trim();
    if (trimmed) {
      const finalTitle = trimmed.endsWith('.sql') ? trimmed : `${trimmed}.sql`;
      const now = Date.now();
      setQueryFiles((prev) =>
        prev.map((t) => (t.id === tabId ? { ...t, title: finalTitle, updatedAt: now } : t))
      );
      const file = queryFiles.find((f) => f.id === tabId);
      if (file) {
        saveSqlStudioFile({
          ...file,
          title: finalTitle,
          updatedAt: now,
        });
      }
    }
    setEditingTabId(null);
  };

  const handleUpdateTabContent = (value: string | undefined) => {
    const text = value || '';
    const now = Date.now();
    setQueryFiles((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, sql: text, isModified: true, updatedAt: now } : t))
    );

    // Auto-hide result / terminal panel when start typing in query editor (not on click)
    if (!isProgrammaticChangeRef.current) {
      setIsBottomPanelOpen((prev) => (prev ? false : prev));
    }
  };

  // Auto-save modified active query file to IndexedDB (debounced 600ms, 12h retention)
  const saveFileTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saveFileTimerRef.current) clearTimeout(saveFileTimerRef.current);
    saveFileTimerRef.current = setTimeout(() => {
      if (activeTabId) {
        const file = queryFiles.find((f) => f.id === activeTabId);
        if (file) {
          saveSqlStudioFile({
            id: file.id,
            title: file.title,
            sql: file.sql,
            updatedAt: file.updatedAt || Date.now(),
            isModified: file.isModified,
          });
        }
      }
    }, 600);
    return () => {
      if (saveFileTimerRef.current) clearTimeout(saveFileTimerRef.current);
    };
  }, [queryFiles, activeTabId]);

  // Synchronize workspace metadata to IndexedDB
  useEffect(() => {
    saveSqlStudioMeta({
      openTabIds,
      activeTabId,
      activeDbId,
    });
  }, [openTabIds, activeTabId, activeDbId]);

  // Open .sql file from computer into a new Query Tab
  const handleOpenSqlScriptFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const text = await file.text();
      handleAddTab(file.name, text);
      toast.success(`Opened "${file.name}" in a new query tab`);
    } catch {
      toast.error('Could not read SQL script file.');
    }
    if (e.target) e.target.value = '';
  };

  // Download active Query Tab as .sql file
  const handleDownloadActiveTabSql = useCallback(() => {
    if (!activeTab || !activeTab.sql) {
      toast.error('No active query tab to save.');
      return;
    }
    try {
      const blob = new Blob([activeTab.sql], { type: 'text/sql;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = activeTab.title.endsWith('.sql') ? activeTab.title : `${activeTab.title}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Saved ${link.download}`);
    } catch {
      toast.error('Failed to save SQL file.');
    }
  }, [activeTab]);

  // Comprehensive Execution Supporting ALL MySQL Workbench & Standard SQL Statements
  const handleExecuteSql = useCallback(
    async (codeToRun?: string) => {
      let code =
        codeToRun !== undefined
          ? codeToRun
          : editorRef.current?.getValue() ?? activeTabRef.current?.sql ?? '';

      // If no query tab is currently open, create one and load default template
      if (!code.trim()) {
        if (!activeTabRef.current) {
          handleAddTab('Query 1.sql', 'SELECT 1 + 1 AS test_calc;');
          code = 'SELECT 1 + 1 AS test_calc;';
        } else {
          toast.error('Query is empty. Please write a SQL statement.');
          return;
        }
      }

      setIsExecuting(true);
      const overallStartTime = performance.now();
      const executedResults: ExecutedResult[] = [];

      // Current running database state reference (always access latest from databasesRef!)
      let currentDatabases = [...databasesRef.current];
      let currentActiveId = activeDbIdRef.current;

      try {
        const rawStatements = splitSqlStatements(code);
        let hasError = false;
        let lastErrorMsg = '';

        for (const rawStmt of rawStatements) {
          const stmtTrimmed = rawStmt.trim();
          if (!stmtTrimmed) continue;

          // Skip pure comment blocks
          const withoutComments = stmtTrimmed
            .replace(/^\s*--.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .trim();
          if (!withoutComments) continue;

          const stmtStartTime = performance.now();
          const targetDb = currentDatabases.find((d) => d.id === currentActiveId) || null;

          try {
            // 1. CREATE DATABASE / SCHEMA [IF NOT EXISTS] db_name
            const createDbMatch = stmtTrimmed.match(
              /^\s*CREATE\s+(?:DATABASE|SCHEMA)(?:\s+IF\s+NOT\s+EXISTS)?\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i
            );
            if (createDbMatch) {
              const ifNotExists = /IF\s+NOT\s+EXISTS/i.test(stmtTrimmed);
              const dbName = createDbMatch[1].toLowerCase();
              const existing = currentDatabases.find((d) => d.name === dbName);

              if (existing) {
                if (!ifNotExists) {
                  throw new Error(`Can't create database '${dbName}'; database exists`);
                }
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: [],
                  values: [],
                  affectedRows: 0,
                  message: `Query OK, 0 rows affected (Database '${dbName}' already exists)`,
                  executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
                });
              } else {
                const fresh = await createFreshDbInstance(dbName);
                currentDatabases.push(fresh);
                saveSqlStudioDatabase({
                  id: fresh.id,
                  name: fresh.name,
                  fileName: fresh.fileName,
                  fileSizeBytes: 0,
                  data: fresh.db.export(),
                  updatedAt: Date.now(),
                });
                // In MySQL Workbench, CREATE DATABASE does NOT automatically select the database!
                // The active database remains unchanged until an explicit "USE db_name;" is executed.
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: [],
                  values: [],
                  affectedRows: 1,
                  message: `Query OK, 1 row affected (Database '${dbName}' created)`,
                  executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
                });
              }
              continue;
            }

            // 2. USE db_name
            const useMatch = stmtTrimmed.match(/^\s*USE\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i);
            if (useMatch) {
              const targetName = useMatch[1].toLowerCase();
              const found = currentDatabases.find(
                (d) => d.name === targetName || d.fileName.toLowerCase() === `${targetName}.db`
              );
              if (!found) {
                throw new Error(`Unknown database '${targetName}'`);
              }
              currentActiveId = found.id;
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: `Database changed to '${found.name}'`,
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 3. SHOW DATABASES / SCHEMAS
            if (/^\s*SHOW\s+(?:DATABASES|SCHEMAS)\s*;?$/i.test(stmtTrimmed)) {
              executedResults.push({
                statement: stmtTrimmed,
                columns: ['Database'],
                values: currentDatabases.map((d) => [d.name]),
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 4. SHOW TABLES [FROM / IN db_name]
            const showTablesMatch = stmtTrimmed.match(
              /^\s*SHOW\s+(?:FULL\s+)?TABLES(?:\s+(?:FROM|IN)\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?)?\s*;?$/i
            );
            if (showTablesMatch) {
              const fromDbName = showTablesMatch[1]?.toLowerCase();
              let dbToInspect = targetDb;
              if (fromDbName) {
                const foundFrom = currentDatabases.find((d) => d.name === fromDbName);
                if (!foundFrom) {
                  throw new Error(`Unknown database '${fromDbName}'`);
                }
                dbToInspect = foundFrom;
              }

              if (!dbToInspect) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }

              const inspected = inspectDatabaseTables(dbToInspect.db);
              executedResults.push({
                statement: stmtTrimmed,
                columns: [`Tables_in_${dbToInspect.name}`],
                values: inspected.map((t) => [t.name]),
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 5. DESCRIBE / DESC / EXPLAIN / SHOW COLUMNS FROM table_name
            const descMatch =
              stmtTrimmed.match(/^\s*(?:DESCRIBE|DESC|EXPLAIN)\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i) ||
              stmtTrimmed.match(/^\s*SHOW\s+COLUMNS\s+(?:FROM|IN)\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i);
            if (descMatch) {
              if (!targetDb) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }
              const res = describeTable(targetDb.db, descMatch[1]);
              executedResults.push({
                statement: stmtTrimmed,
                columns: res.columns,
                values: res.values,
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 6. SHOW CREATE TABLE table_name
            const showCreateMatch = stmtTrimmed.match(
              /^\s*SHOW\s+CREATE\s+TABLE\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i
            );
            if (showCreateMatch) {
              if (!targetDb) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }
              const res = showCreateTable(targetDb.db, showCreateMatch[1]);
              executedResults.push({
                statement: stmtTrimmed,
                columns: res.columns,
                values: res.values,
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 7. DROP DATABASE / SCHEMA [IF EXISTS] db_name
            const dropDbMatch = stmtTrimmed.match(
              /^\s*DROP\s+(?:DATABASE|SCHEMA)(?:\s+IF\s+EXISTS)?\s+[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i
            );
            if (dropDbMatch) {
              const ifExists = /IF\s+EXISTS/i.test(stmtTrimmed);
              const dropName = dropDbMatch[1].toLowerCase();
              const toDrop = currentDatabases.find((d) => d.name === dropName);

              if (!toDrop) {
                if (!ifExists) {
                  throw new Error(`Can't drop database '${dropName}'; database doesn't exist`);
                }
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: [],
                  values: [],
                  affectedRows: 0,
                  message: `Query OK, 0 rows affected (Database '${dropName}' doesn't exist)`,
                  executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
                });
              } else {
                try {
                  toDrop.db.close();
                } catch {}
                deleteSqlStudioDatabase(toDrop.id);
                currentDatabases = currentDatabases.filter((d) => d.id !== toDrop.id);
                if (currentActiveId === toDrop.id) {
                  currentActiveId = null;
                }
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: [],
                  values: [],
                  affectedRows: 0,
                  message: `Query OK, 0 rows affected (Database '${dropName}' dropped)`,
                  executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
                });
              }
              continue;
            }

            // 8. TRUNCATE TABLE table_name
            const truncateMatch = stmtTrimmed.match(/^\s*TRUNCATE\s+(?:TABLE\s+)?[`'"]?([a-zA-Z0-9_]+)[`'"]?\s*;?$/i);
            if (truncateMatch) {
              if (!targetDb) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }
              const tbl = truncateMatch[1];
              targetDb.db.exec(`DELETE FROM "${tbl.replace(/"/g, '""')}";`);
              try {
                targetDb.db.exec(`DELETE FROM sqlite_sequence WHERE name="${tbl.replace(/"/g, '""')}";`);
              } catch {}
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: `Query OK, 0 rows affected (Table '${tbl}' truncated)`,
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 9. MySQL Environment & Session statements (SET, LOCK, UNLOCK)
            if (/^\s*SET\s+FOREIGN_KEY_CHECKS\s*=\s*0/i.test(stmtTrimmed)) {
              if (targetDb) targetDb.db.exec('PRAGMA foreign_keys = OFF;');
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: 'Query OK, foreign keys disabled',
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }
            if (/^\s*SET\s+FOREIGN_KEY_CHECKS\s*=\s*1/i.test(stmtTrimmed)) {
              if (targetDb) targetDb.db.exec('PRAGMA foreign_keys = ON;');
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: 'Query OK, foreign keys enabled',
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }
            if (/^\s*(?:SET\s+(?:NAMES|CHARACTER|SQL_MODE|AUTOCOMMIT|TIME_ZONE|@|@@)|LOCK\s+TABLES|UNLOCK\s+TABLES)/i.test(stmtTrimmed)) {
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: 'Query OK, 0 rows affected',
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 10. Transactions: START TRANSACTION, COMMIT, ROLLBACK
            if (/^\s*START\s+TRANSACTION\s*;?$/i.test(stmtTrimmed)) {
              if (!targetDb) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }
              targetDb.db.exec('BEGIN;');
              executedResults.push({
                statement: stmtTrimmed,
                columns: [],
                values: [],
                affectedRows: 0,
                message: 'Query OK, transaction started',
                executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              });
              continue;
            }

            // 11. General SQL Execution (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, etc.)
            const normalized = normalizeMysqlToSqlite(stmtTrimmed);

            if (targetDb) {
              let isTabular = false;
              let columnNames: string[] = [];
              const rows: any[][] = [];

              try {
                const stmt = targetDb.db.prepare(normalized);
                try {
                  columnNames = stmt.getColumnNames() || [];
                  if (columnNames.length > 0) {
                    isTabular = true;
                    while (stmt.step()) {
                      rows.push(stmt.get());
                    }
                  } else {
                    stmt.step();
                  }
                } finally {
                  stmt.free();
                }
              } catch (prepareErr) {
                // Fallback to db.exec if prepare encounters an unsupported construct
                const execRes = targetDb.db.exec(normalized);
                if (execRes && execRes.length > 0) {
                  isTabular = true;
                  columnNames = execRes[0].columns || [];
                  rows.push(...(execRes[0].values || []));
                }
              }

              const duration = Math.round((performance.now() - stmtStartTime) * 10) / 10;

              if (isTabular) {
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: columnNames,
                  values: rows,
                  executionTimeMs: duration,
                });
              } else {
                let affected = 0;
                try {
                  const changesRes = targetDb.db.exec('SELECT changes();');
                  if (changesRes && changesRes[0]?.values?.[0]?.[0] !== undefined) {
                    affected = Number(changesRes[0].values[0][0]);
                  }
                } catch {}

                executedResults.push({
                  statement: stmtTrimmed,
                  columns: [],
                  values: [],
                  executionTimeMs: duration,
                  affectedRows: affected,
                  message: affected > 0 ? `Query OK, ${affected} row(s) affected` : 'Query OK, statement executed',
                });
              }
            } else {
              // NO DATABASE SELECTED:
              // Test if this is a scalar/expression query (like SELECT 1 + 1, SELECT NOW(), SELECT VERSION())
              const SQL = await getSqlWasmEngine();
              const scratchDb = new SQL.Database();
              registerMysqlHelperFunctions(scratchDb, () => '');
              let isTabular = false;
              let columnNames: string[] = [];
              const rows: any[][] = [];

              try {
                const stmt = scratchDb.prepare(normalized);
                try {
                  columnNames = stmt.getColumnNames() || [];
                  if (columnNames.length > 0) {
                    isTabular = true;
                    while (stmt.step()) {
                      rows.push(stmt.get());
                    }
                  } else {
                    stmt.step();
                  }
                } finally {
                  stmt.free();
                }
              } catch (scratchErr: any) {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              } finally {
                try {
                  scratchDb.close();
                } catch {}
              }

              const duration = Math.round((performance.now() - stmtStartTime) * 10) / 10;
              if (isTabular) {
                executedResults.push({
                  statement: stmtTrimmed,
                  columns: columnNames,
                  values: rows,
                  executionTimeMs: duration,
                });
              } else {
                throw new Error(
                  `Error Code: 1046 (3D000): No database selected. Select one with 'USE <database_name>;' or by clicking a database in the explorer.`
                );
              }
            }
          } catch (stmtErr: any) {
            hasError = true;
            lastErrorMsg = stmtErr.message || 'SQL execution failed';
            executedResults.push({
              statement: stmtTrimmed,
              columns: [],
              values: [],
              executionTimeMs: Math.round((performance.now() - stmtStartTime) * 10) / 10,
              error: lastErrorMsg,
            });
            break;
          }
        }

        // Refresh table metadata across all databases
        const updatedDbs = currentDatabases.map((d) => {
          try {
            const inspected = inspectDatabaseTables(d.db);
            return { ...d, tables: inspected };
          } catch {
            return d;
          }
        });

        // Synchronously update both refs and React state
        databasesRef.current = updatedDbs;
        setDatabases(updatedDbs);

        activeDbIdRef.current = currentActiveId;
        setActiveDbId(currentActiveId);

        // Auto-persist active database changes to IndexedDB with refreshed 12h TTL
        const activeModifiedDb = updatedDbs.find((d) => d.id === currentActiveId);
        if (activeModifiedDb) {
          try {
            const exportedBytes = activeModifiedDb.db.export();
            saveSqlStudioDatabase({
              id: activeModifiedDb.id,
              name: activeModifiedDb.name,
              fileName: activeModifiedDb.fileName,
              fileSizeBytes: exportedBytes.byteLength,
              data: exportedBytes,
              updatedAt: Date.now(),
            });
          } catch (exportErr) {
            console.warn('Could not persist updated database:', exportErr);
          }
        }

        const totalDuration = Math.round((performance.now() - overallStartTime) * 10) / 10;
        setResults(executedResults);
        setActiveBottomTab('results');
        setIsBottomPanelOpen(true); // Automatically open results panel when query runs

        const firstErrorResult = executedResults.find((r) => r.error);
        const historyItem: QueryHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          sql: code,
          timestamp: new Date().toLocaleTimeString(),
          status: firstErrorResult ? 'error' : 'success',
          executionTimeMs: totalDuration,
          rowCount: executedResults.reduce((acc, r) => acc + (r.values?.length || 0), 0),
          error: firstErrorResult?.error,
        };

        setHistory((prev) => {
          const next = [historyItem, ...prev.slice(0, 49)];
          try {
            localStorage.setItem('msk_sql_studio_history', JSON.stringify(next));
          } catch {}
          return next;
        });

        if (hasError) {
          addLog('error', `Execution failed: ${lastErrorMsg}`);
          toast.error(`SQL Error: ${lastErrorMsg}`);
        } else {
          addLog('success', `Query OK. Executed ${executedResults.length} statement(s) in ${totalDuration}ms`);
          toast.success(`Executed successfully (${totalDuration}ms)`);
        }
      } catch (overallErr: any) {
        console.error('Execution error:', overallErr);
        addLog('error', `Fatal error: ${overallErr.message}`);
        toast.error(`Error: ${overallErr.message}`);
      } finally {
        setIsExecuting(false);
      }
    },
    [createFreshDbInstance, handleAddTab, addLog]
  );

  // Keep helper refs synchronized on every render
  handleExecuteSqlRef.current = handleExecuteSql;
  handleDownloadActiveTabSqlRef.current = handleDownloadActiveTabSql;
  handleCloseEditorTabRef.current = handleCloseEditorTab;
  handleAddTabRef.current = handleAddTab;
  handleZoomInRef.current = handleZoomIn;
  handleZoomOutRef.current = handleZoomOut;
  handleResetZoomRef.current = handleResetZoom;

  // Global Keyboard Shortcuts (VS Code & MySQL Workbench standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // 0. Ctrl + Enter / F5 -> Run Query
      if ((isCtrl && !e.shiftKey && !e.altKey && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        handleExecuteSqlRef.current();
        return;
      }

      // 1. Ctrl + B -> Toggle Primary Sidebar
      if (isCtrl && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
        return;
      }

      // 2. Ctrl + ` -> Toggle Output / Terminal Panel
      if (isCtrl && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        setIsBottomPanelOpen((prev) => !prev);
        return;
      }

      // 3. Ctrl + N or Alt + N -> New Query File
      if ((isCtrl && !e.shiftKey && e.key.toLowerCase() === 'n') || (e.altKey && e.key.toLowerCase() === 'n')) {
        e.preventDefault();
        handleAddTabRef.current();
        return;
      }

      // 4. Ctrl + O -> Open Database File
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }

      // 5. Ctrl + Shift + O -> Open SQL Script File into new tab
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        sqlScriptInputRef.current?.click();
        return;
      }

      // 6. Ctrl + S -> Save active query tab
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleDownloadActiveTabSqlRef.current();
        return;
      }

      // 7. Alt + W -> Close active query tab FROM EDITOR ONLY
      if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (activeTabIdRef.current) {
          handleCloseEditorTabRef.current(null, activeTabIdRef.current);
        }
        return;
      }

      // 8. Ctrl + Shift + F -> Switch to Query Files in sidebar
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setActiveActivity('files');
        setIsSidebarOpen(true);
        return;
      }

      // 9. Ctrl + Shift + D -> Switch to Databases in sidebar
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setActiveActivity('explorer');
        setIsSidebarOpen(true);
        return;
      }

      // 10. Ctrl + = or Ctrl + + -> Zoom in editor font
      if (isCtrl && !e.shiftKey && (e.key === '=' || e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd')) {
        e.preventDefault();
        handleZoomInRef.current();
        return;
      }

      // 11. Ctrl + - -> Zoom out editor font
      if (isCtrl && !e.shiftKey && (e.key === '-' || e.key === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract')) {
        e.preventDefault();
        handleZoomOutRef.current();
        return;
      }

      // 12. Ctrl + 0 -> Reset zoom to default 100% (13px)
      if (isCtrl && !e.shiftKey && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')) {
        e.preventDefault();
        handleResetZoomRef.current();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Monaco Editor Mount & Editor Keyboard Shortcuts (always calling latest refs)
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Ctrl + Enter: Run Query / Selection
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const selected = editor.getModel()?.getValueInRange(editor.getSelection());
      if (selected && selected.trim()) {
        handleExecuteSqlRef.current(selected);
      } else {
        handleExecuteSqlRef.current();
      }
    });

    // F5: Run Query
    editor.addCommand(monaco.KeyCode.F5, () => {
      handleExecuteSqlRef.current();
    });

    // Ctrl + B: Toggle Sidebar
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      setIsSidebarOpen((prev) => !prev);
    });

    // Ctrl + `: Toggle Terminal Panel
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK, () => {
      setIsBottomPanelOpen((prev) => !prev);
    });

    // Ctrl + S: Save SQL Script
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleDownloadActiveTabSqlRef.current();
    });

    // Alt + N: New Query Tab
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyN, () => {
      handleAddTabRef.current();
    });

    // Alt + W: Close Active Tab from Editor
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyW, () => {
      if (activeTabIdRef.current) {
        handleCloseEditorTabRef.current(null, activeTabIdRef.current);
      }
    });

    // Zoom In: Ctrl + = / Ctrl + NumpadAdd
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
      handleZoomInRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.NumpadAdd, () => {
      handleZoomInRef.current();
    });

    // Zoom Out: Ctrl + - / Ctrl + NumpadSubtract
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
      handleZoomOutRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.NumpadSubtract, () => {
      handleZoomOutRef.current();
    });

    // Reset Zoom: Ctrl + 0
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
      handleResetZoomRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Numpad0, () => {
      handleResetZoomRef.current();
    });

    // Escape: Exit Focus Mode if active
    editor.addCommand(monaco.KeyCode.Escape, () => {
      setIsFocusMode(false);
    });
  };

  // Load local database file(s) (.db, .sqlite, .sqlite3, .sql)
  const handleFilesLoad = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;

    try {
      setIsEngineLoading(true);
      const newlyLoaded: LoadedDatabase[] = [];

      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let loadedDbRecord: LoadedDatabase | null = null;

        if (ext === 'sql') {
          // If a .sql file is opened, also add it as a new Query Tab!
          const text = await file.text();
          handleAddTab(file.name, text);

          // And create a database from executing the dump
          const cleanName = file.name.replace(/\.sql$/i, '').toLowerCase();
          const SQL = await getSqlWasmEngine();
          const newDb = new SQL.Database();
          registerMysqlHelperFunctions(newDb, () => cleanName);

          try {
            const statements = splitSqlStatements(text);
            for (const st of statements) {
              const norm = normalizeMysqlToSqlite(st);
              newDb.run(norm);
            }
          } catch {}

          const inspected = inspectDatabaseTables(newDb);
          loadedDbRecord = {
            id: Math.random().toString(36).substring(2, 9),
            name: cleanName,
            fileName: `${cleanName}.db`,
            fileSizeBytes: file.size,
            db: newDb,
            tables: inspected,
          };
        } else {
          const arrayBuffer = await file.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);
          loadedDbRecord = await createFreshDbInstance(file.name, uint8, file.size);
        }

        if (loadedDbRecord) {
          newlyLoaded.push(loadedDbRecord);
          try {
            const exportedBytes = loadedDbRecord.db.export();
            saveSqlStudioDatabase({
              id: loadedDbRecord.id,
              name: loadedDbRecord.name,
              fileName: loadedDbRecord.fileName,
              fileSizeBytes: exportedBytes.byteLength || loadedDbRecord.fileSizeBytes,
              data: exportedBytes,
              updatedAt: loadedDbRecord.updatedAt || Date.now(),
            });
          } catch {}
          addLog('success', `Loaded "${loadedDbRecord.fileName}" with ${loadedDbRecord.tables.length} tables.`);
        }
      }

      const updated = [...databasesRef.current, ...newlyLoaded];
      databasesRef.current = updated;
      setDatabases(updated);

      if (newlyLoaded.length > 0) {
        const firstNew = newlyLoaded[0];
        activeDbIdRef.current = firstNew.id;
        setActiveDbId(firstNew.id);
        if (firstNew.tables.length > 0) {
          setSelectedTable(firstNew.tables[0].name);
        }
        toast.success(
          newlyLoaded.length === 1
            ? `Loaded "${newlyLoaded[0].fileName}"!`
            : `Loaded ${newlyLoaded.length} databases!`
        );
      }
    } catch (err: any) {
      console.error('Failed to open database file:', err);
      toast.error(`Invalid database: ${err.message}`);
    } finally {
      setIsEngineLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const files: File[] = [];
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    } else if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
    }

    const validFiles = files.filter((f) => /\.(db|sqlite|sqlite3|sql)$/i.test(f.name));
    if (validFiles.length > 0) {
      handleFilesLoad(validFiles);
    } else if (files.length > 0) {
      handleFilesLoad(files);
    } else {
      toast.error('No valid file detected. Please drop a SQLite or SQL file.');
    }
  };

  // Download modified SQLite database file
  const handleDownloadDatabase = () => {
    if (!activeDb) return;
    try {
      const exportedBytes = activeDb.db.export();
      const blob = new Blob([exportedBytes], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = activeDb.fileName.endsWith('.db') ? activeDb.fileName : `${activeDb.fileName}.db`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${link.download}`);
    } catch {
      toast.error('Failed to export SQLite database file.');
    }
  };

  // Export query result to CSV
  const handleExportResultCsv = (result: ExecutedResult) => {
    if (!result.columns || result.columns.length === 0) return;
    try {
      const headerLine = result.columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
      const rowLines = result.values.map((row) =>
        row
          .map((val) => {
            if (val === null || val === undefined) return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      );
      const csv = [headerLine, ...rowLines].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `query-result.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Exported query result to CSV');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  // Query snippet insertion
  const handleInsertSnippet = (snippetSql: string) => {
    if (!activeTab) {
      handleAddTab('Query 1.sql', snippetSql);
    } else {
      handleUpdateTabContent(snippetSql);
      if (editorRef.current) {
        editorRef.current.setValue(snippetSql);
        editorRef.current.focus();
      }
    }
    toast.success('Loaded snippet into editor');
  };

  // Clear query history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('msk_sql_studio_history');
    } catch {}
    toast.success('Query history cleared');
  };

  return (
    <div
      ref={containerRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full flex flex-col bg-[#121316] text-slate-100 overflow-hidden transition-all ${
        isFocusMode
          ? '!fixed !inset-0 !z-[9999] !w-screen !h-screen !max-w-none !m-0 !rounded-none shadow-none'
          : isFullscreen
          ? '!fixed !inset-0 !z-[9999] !w-screen !h-screen !max-w-none !m-0 !rounded-none shadow-none'
          : 'w-full h-full min-h-[720px] rounded-2xl border border-slate-800/80 shadow-2xl'
      }`}
    >
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".db,.sqlite,.sqlite3,.sql,application/x-sqlite3"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesLoad(e.target.files);
          }
        }}
        className="hidden"
      />

      <input
        ref={sqlScriptInputRef}
        type="file"
        accept=".sql,.txt"
        onChange={handleOpenSqlScriptFile}
        className="hidden"
      />

      {/* Top Application Header Bar */}
      <header className="h-14 bg-[#18191e] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 select-none z-20">
        {/* Left: Brand Icon & App Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-white text-sm tracking-tight truncate">
              MSK SQL Studio
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/60 text-[10px] font-mono text-emerald-400">
              <Shield className="w-2.5 h-2.5" />
              <span>WASM MySQL Workbench</span>
            </span>
            {activeDb ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>Active DB: <strong className="text-white">{activeDb.name}</strong></span>
              </span>
            ) : (
              <span
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/40 text-[10px] font-mono text-slate-400"
                title="No database active. Execute 'USE <db_name>;' or click a database to select."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>No DB Selected</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Keyboard Shortcuts Dialog Trigger */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Keyboard Shortcuts Cheat Sheet"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm cursor-pointer"
            title="Open local SQLite or SQL dump file (Ctrl + O)"
          >
            <FolderOpen className="w-3.5 h-3.5 text-secondary" />
            <span className="hidden sm:inline">Open DB</span>
          </button>

          {activeDb && (
            <button
              onClick={handleDownloadDatabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm cursor-pointer"
              title="Download active database as .db"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Save .db</span>
            </button>
          )}

          <Link
            href="/tools/db-viewer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-colors cursor-pointer"
            title="Switch to Spreadsheet Database Viewer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Viewer</span>
          </Link>

          {/* Primary Run Query Button */}
          <button
            onClick={() => {
              if (editorRef.current) {
                const selection = editorRef.current.getSelection();
                const selectedText = editorRef.current.getModel()?.getValueInRange(selection);
                if (selectedText && selectedText.trim()) {
                  handleExecuteSqlRef.current(selectedText);
                  return;
                }
              }
              handleExecuteSqlRef.current();
            }}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
            title="Execute selected SQL query or entire script (Ctrl + Enter)"
          >
            {isExecuting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            <span>Run</span>
          </button>

          {/* Focus Mode (Zen Mode) */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            aria-label="Toggle Zen Focus Mode"
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isFocusMode
                ? 'bg-secondary text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isFocusMode ? 'Exit Zen Focus Mode (Esc)' : 'Zen Distraction-Free Focus Mode (Esc)'}
          >
            {isFocusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Drag Overlay Notice */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-[#121316]/90 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-secondary text-secondary p-6 pointer-events-none animate-in fade-in duration-150">
            <div className="p-8 bg-[#18191e] border border-secondary/60 rounded-3xl shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                <UploadCloud className="w-8 h-8 animate-bounce" />
              </div>
              <span className="text-base font-bold text-white">Drop your SQLite or SQL file here</span>
              <span className="text-xs text-slate-400">
                Parsed 100% locally in your browser memory.
              </span>
            </div>
          </div>
        )}

        {/* VS CODE STYLE PRIMARY ACTIVITY BAR (Far Left Slim Bar) */}
        {/* 1. Query Files is at the TOP, 2. Database Explorer is DOWN */}
        <nav className="w-12 bg-[#141518] border-r border-slate-800/80 flex flex-col items-center py-2 shrink-0 z-10 select-none">
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* 1. QUERY FILES AT THE TOP */}
            <button
              onClick={() => {
                if (activeActivity === 'files' && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setActiveActivity('files');
                  setIsSidebarOpen(true);
                }
              }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                activeActivity === 'files' && isSidebarOpen
                  ? 'text-secondary bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title="Query Files (Ctrl+Shift+F)"
            >
              {activeActivity === 'files' && isSidebarOpen && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-secondary rounded-r" />
              )}
              <FileCode className="w-4 h-4" />
              {queryFiles.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-secondary" />
              )}
            </button>

            {/* 2. DATABASES EXPLORER MOVED DOWN */}
            <button
              onClick={() => {
                if (activeActivity === 'explorer' && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setActiveActivity('explorer');
                  setIsSidebarOpen(true);
                }
              }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                activeActivity === 'explorer' && isSidebarOpen
                  ? 'text-blue-400 bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title="Databases & Tables (Ctrl+Shift+D)"
            >
              {activeActivity === 'explorer' && isSidebarOpen && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r" />
              )}
              <Database className="w-4 h-4" />
            </button>

            {/* 3. SQL SNIPPETS */}
            <button
              onClick={() => {
                if (activeActivity === 'snippets' && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setActiveActivity('snippets');
                  setIsSidebarOpen(true);
                }
              }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                activeActivity === 'snippets' && isSidebarOpen
                  ? 'text-amber-400 bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title="SQL Snippets & Templates"
            >
              {activeActivity === 'snippets' && isSidebarOpen && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-amber-400 rounded-r" />
              )}
              <Sparkles className="w-4 h-4" />
            </button>

            {/* 4. EXECUTION HISTORY */}
            <button
              onClick={() => {
                if (activeActivity === 'history' && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setActiveActivity('history');
                  setIsSidebarOpen(true);
                }
              }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                activeActivity === 'history' && isSidebarOpen
                  ? 'text-emerald-400 bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title="Query Execution History"
            >
              {activeActivity === 'history' && isSidebarOpen && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-400 rounded-r" />
              )}
              <History className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Collapse Primary Sidebar (Ctrl+B)' : 'Expand Primary Sidebar (Ctrl+B)'}
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* PRIMARY SIDEBAR PANEL (Collapsible with Ctrl+B) */}
        {isSidebarOpen && (
          <aside className="w-72 bg-[#15161a] border-r border-slate-800/80 flex flex-col shrink-0 overflow-hidden select-none">
            {activeActivity === 'files' ? (
              /* QUERY SCRIPTS MANAGEMENT VIEW (Default Top Activity) */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2.5 border-b border-slate-800/80 bg-[#18191e]/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Query Files
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {queryFiles.length}
                    </span>
                    <span
                      className="text-[9px] font-mono text-emerald-400/90 bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-800/40 hidden sm:inline"
                      title="Query files persist locally and auto-clean after 12 hours of inactivity"
                    >
                      12h save
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAddTab()}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="New Query Tab (Ctrl + N)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => sqlScriptInputRef.current?.click()}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Open .sql script from computer (Ctrl + Shift + O)"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                  {queryFiles.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 space-y-3">
                      <FileCode className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                      <p>No query files created yet.</p>
                      <button
                        onClick={() => handleAddTab()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-secondary hover:bg-secondary-light transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Query (Ctrl+N)</span>
                      </button>
                    </div>
                  ) : (
                    queryFiles.map((file) => {
                      const isOpenInEditor = openTabIds.includes(file.id);
                      const isActive = activeTabId === file.id;
                      const isEditing = editingTabId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={() => handleOpenFileInEditor(file)}
                          className={`group px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-secondary/15 text-white font-semibold border border-secondary/40 shadow-xs'
                              : isOpenInEditor
                              ? 'text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                          }`}
                        >
                          <div
                            className="flex items-center gap-2 truncate min-w-0 flex-1 mr-1"
                            title={
                              file.updatedAt
                                ? `Last modified: ${new Date(
                                    file.updatedAt
                                  ).toLocaleTimeString()} • Auto-removes after 12h inactivity (${formatTtlRemaining(
                                    file.updatedAt,
                                    SQL_STUDIO_TTL_MS
                                  )})`
                                : 'Saved locally (12h auto-remove)'
                            }
                          >
                            <FileText
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive
                                  ? 'text-secondary'
                                  : isOpenInEditor
                                  ? 'text-slate-300'
                                  : 'text-slate-500'
                              }`}
                            />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingTabTitle}
                                autoFocus
                                onChange={(e) => setEditingTabTitle(e.target.value)}
                                onBlur={() => handleSaveRenameTab(file.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRenameTab(file.id);
                                  if (e.key === 'Escape') setEditingTabId(null);
                                }}
                                className="w-full bg-[#121316] border border-secondary text-white text-[11px] font-mono px-1 py-0.5 rounded outline-none"
                              />
                            ) : (
                              <div className="truncate">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="truncate block font-mono text-[11px]">
                                    {file.title}
                                  </span>
                                  {isOpenInEditor && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" title="Open in editor tab" />
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {file.sql.split('\n').length} lines {!isOpenInEditor && '• (closed)'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleStartRenameTab(e, file)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-850 cursor-pointer"
                              title="Rename Query File"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {/* DELETE BUTTON: Permanently removes file from workspace */}
                            <button
                              onClick={(e) => handleDeleteQueryFile(e, file.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-850 cursor-pointer"
                              title="Delete query file from workspace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : activeActivity === 'explorer' ? (
              /* EXPLORER VIEW: DATABASES IN TOP, TABLES IN BOTTOM */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* TOP SECTION: DATABASES */}
                <div className="flex flex-col border-b border-slate-800/80 max-h-[40%] overflow-hidden shrink-0">
                  <div className="p-2.5 border-b border-slate-800/80 bg-[#18191e]/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Databases
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                        {databases.length}
                      </span>
                      <span
                        className="text-[9px] font-mono text-blue-400/90 bg-blue-950/40 px-1 py-0.5 rounded border border-blue-800/40 hidden sm:inline"
                        title="Databases persist locally and auto-clean after 12 hours of inactivity"
                      >
                        12h save
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Open database file (Ctrl + O)"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto p-1.5 space-y-1">
                    {databases.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500 space-y-1">
                        <p>No database loaded.</p>
                        <p className="text-[10px] text-slate-600">
                          Run <code className="text-secondary font-mono">CREATE DATABASE db_name;</code> or press <kbd className="text-secondary font-mono">Ctrl+O</kbd> to open.
                        </p>
                      </div>
                    ) : (
                      databases.map((dbItem) => {
                        const isActive = activeDbId === dbItem.id;
                        return (
                          <div
                            key={dbItem.id}
                            onClick={() => handleSelectDatabase(dbItem)}
                            className={`group px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? 'bg-blue-500/15 text-white font-semibold border border-blue-500/40 shadow-xs'
                                : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                            }`}
                            title={
                              dbItem.updatedAt
                                ? `Active Database (${dbItem.name}) • Auto-removes after 12h inactivity (${formatTtlRemaining(
                                    dbItem.updatedAt,
                                    SQL_STUDIO_TTL_MS
                                  )})`
                                : `Click to set as active database (USE ${dbItem.name};)`
                            }
                          >
                            <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                              <Database
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isActive ? 'text-blue-400' : 'text-slate-500'
                                }`}
                              />
                              <div className="truncate flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate block font-mono text-[11px]">
                                    {dbItem.name}
                                  </span>
                                  {isActive && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 uppercase shrink-0">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {formatBytes(dbItem.fileSizeBytes)} • {dbItem.tables.length} tables
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleCloseSingleDatabase(e, dbItem.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-850 opacity-60 group-hover:opacity-100 transition-all ml-1 shrink-0 cursor-pointer"
                              title="Close this database"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* BOTTOM SECTION: TABLES OF ACTIVE DATABASE */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#15161a]">
                  <div className="p-2.5 border-b border-slate-800/80 bg-[#18191e]/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono truncate">
                        Tables in {activeDb ? activeDb.name : 'None Selected'}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                        {activeDb?.tables.length || 0}
                      </span>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="Search tables..."
                        disabled={!activeDb}
                        className="w-full bg-[#121316] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-secondary disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {!activeDb ? (
                      <div className="p-4 text-center text-xs text-slate-500 space-y-1.5">
                        <Database className="w-6 h-6 text-slate-600 mx-auto opacity-40" />
                        <p className="font-semibold text-slate-400">No database selected</p>
                        <p className="text-[11px] text-slate-500">
                          Execute <code className="text-secondary font-mono">USE db_name;</code> or click a database above to select.
                        </p>
                      </div>
                    ) : activeDb.tables.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                        <p>No tables in {activeDb.name} yet.</p>
                        <p className="text-[11px] text-slate-600">
                          Execute a <code className="text-secondary font-mono">CREATE TABLE</code> statement.
                        </p>
                      </div>
                    ) : (
                      activeDb.tables
                        .filter((t) => t.name.toLowerCase().includes(tableSearch.toLowerCase()))
                        .map((table) => {
                          const isSelected = selectedTable === table.name;
                          return (
                            <button
                              key={table.name}
                              onClick={() => {
                                setSelectedTable(table.name);
                                const q = `SELECT * FROM "${table.name.replace(/"/g, '""')}" LIMIT 50;`;
                                handleInsertSnippet(q);
                                handleExecuteSql(q);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer group ${
                                isSelected
                                  ? 'bg-blue-500/15 text-white font-semibold border border-blue-500/30'
                                  : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <TableIcon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                                  }`}
                                />
                                <span className="truncate font-mono text-[11px]">{table.name}</span>
                              </div>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {table.rowCount}
                              </span>
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            ) : activeActivity === 'snippets' ? (
              /* QUICK SQL SNIPPETS VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2.5 border-b border-slate-800/80 bg-[#18191e]/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      SQL Templates
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `CREATE DATABASE IF NOT EXISTS school_db;\nUSE school_db;\n\nCREATE TABLE students (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) UNIQUE,\n  course VARCHAR(50) DEFAULT 'Python'\n);\n\nINSERT INTO students (name, email, course) VALUES \n('Rahul Verma', 'rahul@example.com', 'Python Masterclass'),\n('Pooja Sharma', 'pooja@example.com', 'Full Stack Web Dev');\n\nSELECT * FROM students;\n`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl bg-[#121316] border border-slate-800/80 hover:border-secondary/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Create Database & Table</span>
                    <span className="text-[11px] text-slate-400">MySQL Workbench starter snippet</span>
                  </button>

                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `SELECT \n  category, \n  COUNT(*) AS total_items,\n  AVG(price) AS average_price\nFROM products\nGROUP BY category\nORDER BY total_items DESC;`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl bg-[#121316] border border-slate-800/80 hover:border-secondary/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Group By & Aggregations</span>
                    <span className="text-[11px] text-slate-400">COUNT and AVG summary</span>
                  </button>

                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `SELECT \n  u.id, \n  u.name, \n  o.order_number, \n  o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nLIMIT 50;`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl bg-[#121316] border border-slate-800/80 hover:border-secondary/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Inner Join</span>
                    <span className="text-[11px] text-slate-400">Join two relational tables</span>
                  </button>

                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        `SHOW DATABASES;\nSHOW TABLES;\n`
                      )
                    }
                    className="w-full text-left p-2.5 rounded-xl bg-[#121316] border border-slate-800/80 hover:border-secondary/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Inspect Schemas</span>
                    <span className="text-[11px] text-slate-400">SHOW DATABASES & SHOW TABLES</span>
                  </button>
                </div>
              </div>
            ) : (
              /* QUERY EXECUTION HISTORY VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2.5 border-b border-slate-800/80 bg-[#18191e]/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Query History
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {history.length}
                    </span>
                  </div>

                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
                  {history.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No executed queries yet.
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleInsertSnippet(item.sql)}
                        className="p-2.5 rounded-xl bg-[#121316] border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              item.status === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                        </div>
                        <pre className="text-[11px] text-slate-300 font-mono truncate">{item.sql}</pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* CENTER AREA: MONACO EDITOR (Top) + TERMINAL/RESULTS (Bottom) */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#121316]">
          {/* If no tabs are currently open in the editor, show VS CODE WELCOME SCREEN */}
          {openTabs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 select-none overflow-y-auto bg-[#18191e]/40">
              <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in duration-200">
                {/* Brand & Intro */}
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-500/10">
                    <Code2 className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Welcome to MSK SQL Studio
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                    Full-featured SQLite & MySQL Workbench environment running 100% in your browser.
                  </p>
                </div>

                {/* If files exist in session but were closed from editor, show quick re-open grid */}
                {queryFiles.length > 0 && (
                  <div className="w-full text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-secondary" />
                        <span>Files in Session ({queryFiles.length})</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Click to reopen in editor tab
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {queryFiles.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => handleOpenFileInEditor(file)}
                          className="p-3 rounded-xl bg-[#15161a] border border-slate-800 hover:border-secondary/60 text-left transition-all cursor-pointer group flex items-center justify-between shadow-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className="w-4 h-4 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="truncate">
                              <span className="truncate block font-mono text-xs font-semibold text-white group-hover:text-secondary">
                                {file.title}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {file.sql.split('\n').length} lines
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-secondary group-hover:text-white transition-colors">
                            Reopen
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Two-Column Start & Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  {/* Start Section */}
                  <div className="bg-[#15161a] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-secondary" />
                      <span>Start Working</span>
                    </span>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => handleAddTab('Query 1.sql', DEFAULT_STARTER_SQL)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                          <span>New Query Script</span>
                        </div>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                          Ctrl + N
                        </kbd>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderOpen className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                          <span>Open Database (.db, .sqlite)</span>
                        </div>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                          Ctrl + O
                        </kbd>
                      </button>

                      <button
                        onClick={() => sqlScriptInputRef.current?.click()}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <UploadCloud className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>Open .sql Script File</span>
                        </div>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                          Ctrl + Shift + O
                        </kbd>
                      </button>
                    </div>
                  </div>

                  {/* Cheat Sheet Section */}
                  <div className="bg-[#15161a] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                      <span>Keyboard Shortcuts</span>
                    </span>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Execute SQL Query</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-emerald-400 font-bold">
                          Ctrl + Enter
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Toggle Primary Sidebar</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          Ctrl + B
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Toggle Output Terminal</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          Ctrl + `
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Save Active SQL File</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          Ctrl + S
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Close Active Tab (Editor Only)</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          Alt + W
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-400">Exit Focus Mode</span>
                        <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                          Esc
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Templates Row */}
                <div className="w-full space-y-2.5 text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Quick SQL Templates
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        handleAddTab(
                          'school_schema.sql',
                          `CREATE DATABASE IF NOT EXISTS school_db;\nUSE school_db;\n\nCREATE TABLE students (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) UNIQUE,\n  course VARCHAR(50) DEFAULT 'Python'\n);\n\nINSERT INTO students (name, email, course) VALUES \n('Rahul Verma', 'rahul@example.com', 'Python Masterclass'),\n('Pooja Sharma', 'pooja@example.com', 'Full Stack Web Dev');\n\nSELECT * FROM students;\n`
                        )
                      }
                      className="p-3.5 rounded-xl bg-[#15161a] border border-slate-800 hover:border-secondary/60 text-left transition-colors cursor-pointer group"
                    >
                      <span className="font-bold text-white text-xs block group-hover:text-secondary">
                        Create Database & Table
                      </span>
                      <span className="text-[11px] text-slate-400">MySQL Workbench starter snippet</span>
                    </button>

                    <button
                      onClick={() =>
                        handleAddTab(
                          'aggregations.sql',
                          `SELECT \n  category, \n  COUNT(*) AS total_items,\n  AVG(price) AS average_price\nFROM products\nGROUP BY category\nORDER BY total_items DESC;`
                        )
                      }
                      className="p-3.5 rounded-xl bg-[#15161a] border border-slate-800 hover:border-secondary/60 text-left transition-colors cursor-pointer group"
                    >
                      <span className="font-bold text-white text-xs block group-hover:text-secondary">
                        Group By & Aggregates
                      </span>
                      <span className="text-[11px] text-slate-400">COUNT, AVG & GROUP BY</span>
                    </button>

                    <button
                      onClick={() =>
                        handleAddTab(
                          'inspect.sql',
                          `SHOW DATABASES;\nSHOW TABLES;\n`
                        )
                      }
                      className="p-3.5 rounded-xl bg-[#15161a] border border-slate-800 hover:border-secondary/60 text-left transition-colors cursor-pointer group"
                    >
                      <span className="font-bold text-white text-xs block group-hover:text-secondary">
                        Inspect Schemas
                      </span>
                      <span className="text-[11px] text-slate-400">SHOW DATABASES & TABLES</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TOP PANE: MYSQL WORKBENCH / VS CODE TAB BAR + MONACO EDITOR */
            <div
              className={`flex flex-col border-b border-slate-800/80 overflow-hidden bg-[#1e1e1e] transition-all ${
                isBottomPanelOpen ? 'h-[50%]' : 'h-full'
              }`}
            >
              {/* TABS STRIP (VS Code / MySQL Workbench styled) */}
              <div className="h-10 bg-[#141518] border-b border-slate-800/80 flex items-center justify-between px-2 shrink-0 select-none overflow-x-auto">
                {/* Left: Open Query Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {openTabs.map((tab) => {
                    const isActive = activeTabId === tab.id;
                    const isEditing = editingTabId === tab.id;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => handleSwitchTab(tab)}
                        onDoubleClick={(e) => handleStartRenameTab(e, tab)}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all cursor-pointer border-t-2 ${
                          isActive
                            ? 'bg-[#1e1e1e] text-white border-secondary font-semibold shadow-xs'
                            : 'bg-[#18191e]/60 text-slate-400 hover:text-slate-200 hover:bg-[#18191e] border-transparent'
                        }`}
                        title="Double-click to rename"
                      >
                        <FileCode
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-secondary' : 'text-slate-500'
                          }`}
                        />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTabTitle}
                            autoFocus
                            onChange={(e) => setEditingTabTitle(e.target.value)}
                            onBlur={() => handleSaveRenameTab(tab.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRenameTab(tab.id);
                              if (e.key === 'Escape') setEditingTabId(null);
                            }}
                            className="bg-[#121316] border border-secondary text-white text-[11px] font-mono px-1 py-0.2 rounded outline-none"
                          />
                        ) : (
                          <span className="truncate max-w-[140px] text-[11px]">{tab.title}</span>
                        )}

                        {/* CLOSE FROM EDITOR BUTTON: Closes only from editor, keeps in sidebar! */}
                        <button
                          onClick={(e) => handleCloseEditorTab(e, tab.id)}
                          className="p-0.5 rounded text-slate-500 hover:text-white hover:bg-slate-700/60 opacity-60 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                          title="Close tab from editor (file remains in Query Files sidebar)"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {/* + New Query Tab Button */}
                  <button
                    onClick={() => handleAddTab()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                    title="New Query Tab (Ctrl+N)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* MONACO CODE EDITOR */}
              <div className="flex-1 w-full h-full relative">
                <MonacoEditor
                  height="100%"
                  language="sql"
                  theme="vs-dark"
                  value={activeTab?.sql || ''}
                  onChange={handleUpdateTabContent}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 13,
                    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    lineNumbers: 'on',
                    tabSize: 2,
                    mouseWheelZoom: true,
                    smoothScrolling: true,
                    mouseWheelScrollSensitivity: 1,
                    fastScrollSensitivity: 3,
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'auto',
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                      useShadows: false,
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* BOTTOM PANE: TABS FOR RESULTS / SCHEMA CARDS / LOGS (Terminal-like collapsible with Ctrl+`) */}
          {isBottomPanelOpen ? (
            <div className={`${isBottomPanelExpanded ? 'h-[85%]' : 'h-[50%]'} flex flex-col overflow-hidden bg-[#121316] border-t border-slate-800/80 transition-all duration-150`}>
              <div className="h-9 px-3 bg-[#18191e] border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveBottomTab('results')}
                    className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeBottomTab === 'results'
                        ? 'bg-secondary text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Results ({results.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveBottomTab('er')}
                    className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeBottomTab === 'er'
                        ? 'bg-secondary text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Schema Cards</span>
                  </button>

                  <button
                    onClick={() => setActiveBottomTab('logs')}
                    className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeBottomTab === 'logs'
                        ? 'bg-secondary text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Console Logs ({logs.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {activeBottomTab === 'results' && results.length > 0 && results[0].columns.length > 0 && (
                    <button
                      onClick={() => handleExportResultCsv(results[0])}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export CSV</span>
                    </button>
                  )}

                  {/* Clear Query Output Button (Delete Icon) */}
                  <button
                    onClick={handleClearOutput}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Clear query output from terminal (Delete)"
                    aria-label="Clear Query Output"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Expand / Maximize Terminal Button */}
                  <button
                    onClick={() => setIsBottomPanelExpanded((prev) => !prev)}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isBottomPanelExpanded ? "Restore Terminal Size" : "Expand / Maximize Terminal"}
                    aria-label="Expand Terminal"
                  >
                    {isBottomPanelExpanded ? (
                      <Minimize2 className="w-3.5 h-3.5 text-secondary" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Collapse Output Panel Button */}
                  <button
                    onClick={() => setIsBottomPanelOpen(false)}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Minimize Output Panel (Ctrl + `)"
                  >
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                {activeBottomTab === 'results' ? (
                  results.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 gap-2">
                      <Database className="w-8 h-8 opacity-40 text-secondary" />
                      <span className="text-xs font-semibold text-slate-300">No Query Results Yet</span>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        Press <kbd className="text-secondary font-mono">Ctrl + Enter</kbd> to execute your SQL statements.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((res, idx) => {
                        if (res.error) {
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-red-200 text-xs space-y-1.5"
                            >
                              <div className="flex items-center gap-2 font-semibold text-red-300">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span>SQL Execution Error</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  ({res.executionTimeMs}ms)
                                </span>
                              </div>
                              <pre className="text-red-200 font-mono text-xs whitespace-pre-wrap">
                                {res.error}
                              </pre>
                            </div>
                          );
                        }

                        if (res.columns.length === 0) {
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-[#15161a] border border-slate-800 rounded-xl text-xs flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="font-semibold text-white">
                                  {res.message || 'Statement executed successfully'}
                                </span>
                                {res.affectedRows !== undefined && res.affectedRows > 0 && (
                                  <span className="text-slate-400">
                                    ({res.affectedRows} row(s) affected)
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">
                                {res.executionTimeMs}ms
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span>
                                {res.values.length} row(s) returned • Executed in {res.executionTimeMs}ms
                              </span>
                              {res.statement && (
                                <span className="text-[10px] text-slate-500 font-mono truncate max-w-sm hidden sm:inline">
                                  {res.statement.split('\n')[0]}
                                </span>
                              )}
                            </div>

                            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-[#15161a]">
                              <table className="w-full text-left text-xs select-text">
                                <thead className="bg-[#18191e] text-slate-400 border-b border-slate-800">
                                  <tr>
                                    <th className="py-2 px-2.5 text-[10px] font-mono text-slate-500 w-10 text-center border-r border-slate-800/60">
                                      #
                                    </th>
                                    {res.columns.map((c) => (
                                      <th
                                        key={c}
                                        className="py-2 px-3 text-slate-300 font-semibold border-r border-slate-800/60 whitespace-nowrap font-mono text-[11px]"
                                      >
                                        {c}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                  {res.values.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={res.columns.length + 1}
                                        className="py-8 px-4 text-center text-slate-500 text-xs"
                                      >
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                          <span className="font-mono text-slate-300 text-xs font-semibold">Empty set (0.00 sec)</span>
                                          <span className="text-[11px] text-slate-500">Query returned 0 rows</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    res.values.map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-850/50">
                                        <td className="py-1.5 px-2 text-[10px] font-mono text-slate-500 text-center border-r border-slate-800/60">
                                          {rIdx + 1}
                                        </td>
                                        {row.map((val, cIdx) => (
                                          <td
                                            key={cIdx}
                                            className="py-1.5 px-3 text-slate-300 border-r border-slate-800/60 whitespace-nowrap font-mono text-[11px]"
                                          >
                                            {val === null || val === undefined ? (
                                              <span className="text-slate-600 font-mono italic text-[11px]">
                                                NULL
                                              </span>
                                            ) : (
                                              String(val)
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : activeBottomTab === 'er' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Visual Schema for <strong className="text-white font-mono">{activeDb?.name || 'Database'}</strong>
                      </span>
                      <span className="text-[11px] font-mono">
                        {activeDb?.tables.length || 0} tables in memory
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {(activeDb?.tables || []).map((table) => (
                        <div
                          key={table.name}
                          className="bg-[#15161a] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <TableIcon className="w-4 h-4 text-blue-400" />
                              <h4 className="font-bold text-white text-xs font-mono">{table.name}</h4>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              {table.rowCount} rows
                            </span>
                          </div>

                          <div className="space-y-1 text-xs">
                            {table.columns.map((c) => (
                              <div
                                key={c.name}
                                className="flex items-center justify-between py-0.5 text-[11px] border-b border-slate-900"
                              >
                                <div className="flex items-center gap-1.5">
                                  {c.pk ? (
                                    <span className="px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] border border-amber-500/20 font-bold">
                                      PK
                                    </span>
                                  ) : (
                                    <span className="w-4 text-center text-slate-600 text-[10px]">•</span>
                                  )}
                                  <span className={c.pk ? 'font-bold text-slate-200' : 'text-slate-300'}>
                                    {c.name}
                                  </span>
                                </div>
                                <span className="text-secondary font-mono text-[10px]">{c.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 font-mono text-xs">
                    {logs.length === 0 ? (
                      <div className="p-4 text-slate-500 text-center">No logs generated yet.</div>
                    ) : (
                      logs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded flex items-start gap-2 ${
                            log.type === 'error'
                              ? 'bg-red-950/30 text-red-300'
                              : log.type === 'success'
                              ? 'bg-emerald-950/30 text-emerald-300'
                              : 'bg-[#15161a] text-slate-300'
                          }`}
                        >
                          <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
                          <span className="flex-1 whitespace-pre-wrap">{log.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Bottom Status Bar when Output panel is collapsed */
            <div className="h-7 bg-[#141518] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBottomPanelOpen(true)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer bg-slate-800/80 hover:bg-slate-750 px-2 py-0.5 rounded border border-slate-700/60 text-slate-200"
                  title="Open / Expand Terminal & Results (Ctrl + `)"
                >
                  <Terminal className="w-3.5 h-3.5 text-secondary" />
                  <span className="font-semibold text-slate-200">Terminal / Results ({results.length})</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-secondary font-sans font-medium bg-secondary/10 px-1 rounded">
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span>Open / Expand</span>
                  </span>
                  <kbd className="px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400">
                    Ctrl + `
                  </kbd>
                </button>

                {results.length > 0 && (
                  <button
                    onClick={handleClearOutput}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Clear Query Output (Delete)"
                    aria-label="Clear Query Output"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeDb && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Database className="w-3 h-3 text-blue-400" />
                    <span>{activeDb.name}</span>
                  </span>
                )}
                {activeTab && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <FileCode className="w-3 h-3 text-secondary" />
                    <span>{activeTab.title}</span>
                  </span>
                )}

                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>SQLite WASM Ready</span>
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* KEYBOARD SHORTCUTS MODAL CHEAT SHEET */}
      {showShortcutsModal && (
        <div
          onClick={() => setShowShortcutsModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-[#18191e] border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Run SQL Query / Selection</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold">
                  Ctrl + Enter
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Zoom In / Out Editor</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + MouseWheel / Ctrl + +/-
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Reset Editor Zoom (100%)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + 0
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Toggle Primary Sidebar</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + B
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Toggle Output / Terminal Panel</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + `
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">New Query File</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + N (or Alt + N)
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Open Database File</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + O
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Open .sql Script File</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + Shift + O
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Save Active SQL Script</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + S
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Close Tab (from editor only)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Alt + W
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Switch to Query Files in Sidebar</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + Shift + F
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-medium">Switch to Databases in Sidebar</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Ctrl + Shift + D
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 font-medium">Exit Focus Mode</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold">
                  Esc
                </kbd>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
