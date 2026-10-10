'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Database,
  UploadCloud,
  FileCode,
  Table as TableIcon,
  Search,
  Download,
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  ChevronLeft,
  ChevronRight,
  Code2,
  Key,
  Shield,
  X,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  FolderOpen,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  Filter,
  ArrowUpRight,
  Link2,
  CheckSquare,
  Square,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getSqlWasmEngine,
  createDatabaseFromBytes,
  inspectDatabaseTables,
  DatabaseTableMeta,
  DatabaseForeignKeyMeta,
} from '@/lib/sqlWasmLoader';
import { saveDatabaseToBridge, clearDatabaseBridge } from '@/lib/dbBridge';
import {
  loadDbViewerDatabases,
  saveDbViewerDatabase,
  deleteDbViewerDatabase,
  loadDbViewerMeta,
  saveDbViewerMeta,
  formatTtlRemaining,
  DB_VIEWER_TTL_MS,
} from '@/lib/studioStorage';

export interface LoadedDatabase {
  id: string;
  name?: string;
  fileName: string;
  fileSizeBytes: number;
  db: any;
  tables: DatabaseTableMeta[];
  updatedAt?: number;
}

export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'is_null'
  | 'is_not_null';

export default function DbViewerApp() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Database State
  const [databases, setDatabases] = useState<LoadedDatabase[]>([]);
  const [activeDbId, setActiveDbId] = useState<string | null>(null);
  const [isEngineLoading, setIsEngineLoading] = useState(false);

  // Active Database Reference
  const activeDb = useMemo(() => {
    return databases.find((d) => d.id === activeDbId) || null;
  }, [databases, activeDbId]);

  // Table & Data State
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [activeTab, setActiveTab] = useState<'data' | 'schema'>('data');
  const [tableSearch, setTableSearch] = useState('');
  const [rowSearch, setRowSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Interactive Superpowers: Column Visibility, Advanced Filter & Row Detail Modal
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, string[]>>({}); // table -> hidden cols
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterOperator, setFilterOperator] = useState<FilterOperator>('contains');
  const [filterValue, setFilterValue] = useState<string>('');
  const [detailRowIndex, setDetailRowIndex] = useState<number | null>(null);

  // UI & Fullscreen / Focus Mode State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [cellModalValue, setCellModalValue] = useState<{ title: string; value: string } | null>(null);
  const [copiedCell, setCopiedCell] = useState(false);
  const [copiedRowJson, setCopiedRowJson] = useState(false);
  const dragCounter = useRef(0);
  const prevFocusModeRef = useRef<boolean | undefined>(undefined);

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

  // Window drag preventer
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

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

  // Helper: Query table rows
  const loadTableData = (database: any, tableName: string) => {
    if (!database || !tableName) return;
    try {
      const escaped = tableName.replace(/"/g, '""');
      const res = database.exec(`SELECT * FROM "${escaped}";`);
      if (res && res.length > 0) {
        setColumns(res[0].columns || []);
        setRows(res[0].values || []);
      } else {
        const pragma = database.exec(`PRAGMA table_info("${escaped}");`);
        if (pragma && pragma.length > 0 && pragma[0].values) {
          setColumns(pragma[0].values.map((c: any) => String(c[1])));
        } else {
          setColumns([]);
        }
        setRows([]);
      }
      setPage(1);
      setRowSearch('');
      setSortColumn(null);
      setFilterColumn('');
      setFilterValue('');
    } catch (err: any) {
      console.error(`Error loading table ${tableName}:`, err);
      toast.error(`Error loading data for ${tableName}`);
    }
  };

  // Restore persisted databases from IndexedDB on initial mount (6-hour retention)
  useEffect(() => {
    let isMounted = true;

    async function initViewerStorage() {
      try {
        setIsEngineLoading(true);
        const persisted = await loadDbViewerDatabases();
        if (!isMounted) return;

        if (persisted.length > 0) {
          const SQL = await getSqlWasmEngine();
          const restoredDbs: LoadedDatabase[] = [];

          for (const item of persisted) {
            try {
              const newDb = new SQL.Database(item.data);
              const tables = inspectDatabaseTables(newDb);
              restoredDbs.push({
                id: item.id,
                name: item.name,
                fileName: item.fileName,
                fileSizeBytes: item.fileSizeBytes,
                db: newDb,
                tables,
                updatedAt: item.updatedAt,
              });
            } catch (loadErr) {
              console.warn(`Failed restoring database ${item.fileName}:`, loadErr);
            }
          }

          if (isMounted && restoredDbs.length > 0) {
            setDatabases(restoredDbs);
            const meta = await loadDbViewerMeta();
            const target = restoredDbs.find((d) => d.id === meta?.activeDbId) || restoredDbs[0];
            setActiveDbId(target.id);
            if (target.tables.length > 0) {
              const tableToSelect =
                meta?.selectedTable && target.tables.some((t) => t.name === meta.selectedTable)
                  ? meta.selectedTable
                  : target.tables[0].name;
              setSelectedTable(tableToSelect);
              loadTableData(target.db, tableToSelect);
            }
          }
        }
      } catch (err) {
        console.warn('Error restoring viewer databases:', err);
      } finally {
        if (isMounted) setIsEngineLoading(false);
      }
    }

    initViewerStorage();

    // Periodic cleanup of expired databases every 5 minutes (auto-removes after 6h)
    const interval = setInterval(() => {
      loadDbViewerDatabases().then((validRecords) => {
        if (!isMounted) return;
        const validIds = new Set(validRecords.map((r) => r.id));
        setDatabases((prev) => {
          const filtered = prev.filter((d) => validIds.has(d.id));
          if (filtered.length !== prev.length) {
            toast('Some inactive databases were automatically purged after 6 hours', {
              icon: '⏱️',
              duration: 3000,
            });
          }
          return filtered;
        });
      });
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Switch Active Table
  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    if (activeDb) {
      loadTableData(activeDb.db, tableName);
      saveDbViewerMeta({ activeDbId: activeDb.id, selectedTable: tableName });
    }
  };

  // Switch Active Database
  const handleSelectDatabase = (dbItem: LoadedDatabase) => {
    setActiveDbId(dbItem.id);
    if (dbItem.tables.length > 0) {
      const firstTable = dbItem.tables[0].name;
      setSelectedTable(firstTable);
      loadTableData(dbItem.db, firstTable);
      saveDbViewerMeta({ activeDbId: dbItem.id, selectedTable: firstTable });
    } else {
      setSelectedTable(null);
      setColumns([]);
      setRows([]);
      saveDbViewerMeta({ activeDbId: dbItem.id, selectedTable: null });
    }
  };

  // Close a specific Database
  const handleCloseSingleDatabase = (e: React.MouseEvent, dbIdToClose: string) => {
    e.stopPropagation();
    const dbToClose = databases.find((d) => d.id === dbIdToClose);
    if (dbToClose) {
      try {
        dbToClose.db.close();
      } catch {}
    }

    // Delete from IndexedDB persistence
    deleteDbViewerDatabase(dbIdToClose);

    const updated = databases.filter((d) => d.id !== dbIdToClose);
    setDatabases(updated);

    if (activeDbId === dbIdToClose) {
      if (updated.length > 0) {
        handleSelectDatabase(updated[0]);
      } else {
        setActiveDbId(null);
        setSelectedTable(null);
        setColumns([]);
        setRows([]);
        saveDbViewerMeta({ activeDbId: null, selectedTable: null });
        clearDatabaseBridge();
      }
    }
    toast.success('Database closed');
  };

  // Handle local file loading (supports multiple files at once!)
  const handleFilesLoad = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;

    try {
      setIsEngineLoading(true);
      const SQL = await getSqlWasmEngine();
      const newlyLoaded: LoadedDatabase[] = [];

      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let newDb: any = null;

        if (ext === 'sql') {
          const text = await file.text();
          newDb = new SQL.Database();
          newDb.run(text);
        } else {
          const arrayBuffer = await file.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);
          newDb = new SQL.Database(uint8);
        }

        const exported = newDb.export();
        const inspected = inspectDatabaseTables(newDb);
        const now = Date.now();
        const baseName = file.name.replace(/\.(db|sqlite|sqlite3|sql)$/i, '');

        const itemRecord: LoadedDatabase = {
          id: Math.random().toString(36).substring(2, 9),
          name: baseName,
          fileName: file.name,
          fileSizeBytes: exported.byteLength || file.size,
          db: newDb,
          tables: inspected,
          updatedAt: now,
        };

        newlyLoaded.push(itemRecord);

        // Persist each loaded database to IndexedDB with 6-hour TTL
        saveDbViewerDatabase({
          id: itemRecord.id,
          name: baseName,
          fileName: file.name,
          fileSizeBytes: itemRecord.fileSizeBytes,
          data: exported,
          updatedAt: now,
        });
      }

      if (newlyLoaded.length > 0) {
        setDatabases((prev) => [...prev, ...newlyLoaded]);
        const target = newlyLoaded[0];
        setActiveDbId(target.id);
        if (target.tables.length > 0) {
          setSelectedTable(target.tables[0].name);
          loadTableData(target.db, target.tables[0].name);
          saveDbViewerMeta({ activeDbId: target.id, selectedTable: target.tables[0].name });
        } else {
          setSelectedTable(null);
          setColumns([]);
          setRows([]);
          saveDbViewerMeta({ activeDbId: target.id, selectedTable: null });
        }
        toast.success(`Loaded ${newlyLoaded.length} database(s)! (Kept for 6 hours)`);
      }
    } catch (err: any) {
      console.error('Failed to parse database file:', err);
      toast.error(`Invalid database file: ${err.message || 'Cannot read SQLite file'}`);
    } finally {
      setIsEngineLoading(false);
    }
  };

  // Drag and Drop handlers
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

    if (files.length > 0) {
      handleFilesLoad(files);
    } else {
      toast.error('No valid file detected. Please drop a SQLite or SQL file.');
    }
  };

  // Open & Edit in SQL Studio Bridge
  const handleOpenInSqlStudio = async () => {
    if (!activeDb) {
      toast.error('No database loaded to open in SQL Studio.');
      return;
    }

    try {
      setIsTransferring(true);
      const exportedBytes = activeDb.db.export();
      const totalRows = activeDb.tables.reduce((acc, t) => acc + t.rowCount, 0);

      await saveDatabaseToBridge(
        activeDb.fileName || 'unnamed_database.db',
        exportedBytes,
        'db-viewer',
        activeDb.tables.length,
        totalRows
      );

      toast.success('Transferring database to SQL Studio...');
      router.push('/tools/sql-studio?from=db-viewer');
    } catch (err: any) {
      console.error('Bridge transfer failed:', err);
      toast.error('Could not transfer database. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  // Superpower: Foreign Key Jump Navigation
  const handleForeignKeyJump = (targetTable: string, targetCol: string, value: any) => {
    if (!activeDb) return;
    const exists = activeDb.tables.some((t) => t.name === targetTable);
    if (!exists) {
      toast.error(`Referenced table "${targetTable}" does not exist in this database.`);
      return;
    }

    setSelectedTable(targetTable);
    loadTableData(activeDb.db, targetTable);
    setRowSearch(String(value ?? ''));
    toast.success(`Jumped to "${targetTable}" where ${targetCol} = "${value}"!`);
  };

  // Superpower: Column Visibility Toggle
  const currentTableHidden = useMemo(() => {
    if (!selectedTable) return [];
    return hiddenColumns[selectedTable] || [];
  }, [hiddenColumns, selectedTable]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !currentTableHidden.includes(col));
  }, [columns, currentTableHidden]);

  const toggleColumnVisibility = (colName: string) => {
    if (!selectedTable) return;
    setHiddenColumns((prev) => {
      const current = prev[selectedTable] || [];
      const isHidden = current.includes(colName);
      const updated = isHidden
        ? current.filter((c) => c !== colName)
        : [...current, colName];
      return { ...prev, [selectedTable]: updated };
    });
  };

  const showAllColumns = () => {
    if (!selectedTable) return;
    setHiddenColumns((prev) => ({ ...prev, [selectedTable]: [] }));
  };

  const hideAllColumnsExceptFirst = () => {
    if (!selectedTable || columns.length <= 1) return;
    setHiddenColumns((prev) => ({ ...prev, [selectedTable]: columns.slice(1) }));
  };

  // Superpower: Advanced Column-Level Filtering
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // 1. Global Search Filter
      if (rowSearch.trim()) {
        const query = rowSearch.toLowerCase();
        const matchesGlobal = row.some((val) =>
          String(val ?? '').toLowerCase().includes(query)
        );
        if (!matchesGlobal) return false;
      }

      // 2. Advanced Column Filter
      if (showAdvancedFilter && filterColumn) {
        const colIdx = columns.indexOf(filterColumn);
        if (colIdx === -1) return true;
        const cellVal = row[colIdx];
        const cellStr = cellVal === null || cellVal === undefined ? '' : String(cellVal).toLowerCase();
        const queryVal = filterValue.trim().toLowerCase();

        switch (filterOperator) {
          case 'contains':
            return cellStr.includes(queryVal);
          case 'equals':
            return cellStr === queryVal;
          case 'starts_with':
            return cellStr.startsWith(queryVal);
          case 'ends_with':
            return cellStr.endsWith(queryVal);
          case 'greater_than': {
            const numA = Number(cellVal);
            const numB = Number(filterValue);
            return !isNaN(numA) && !isNaN(numB) && numA > numB;
          }
          case 'less_than': {
            const numA = Number(cellVal);
            const numB = Number(filterValue);
            return !isNaN(numA) && !isNaN(numB) && numA < numB;
          }
          case 'is_null':
            return cellVal === null || cellVal === undefined;
          case 'is_not_null':
            return cellVal !== null && cellVal !== undefined;
          default:
            return true;
        }
      }

      return true;
    });
  }, [rows, rowSearch, showAdvancedFilter, filterColumn, filterOperator, filterValue, columns]);

  // Sorting
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (!sortColumn) return 0;
      const colIdx = columns.indexOf(sortColumn);
      if (colIdx === -1) return 0;
      const valA = a[colIdx];
      const valB = b[colIdx];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let res = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        res = valA - valB;
      } else {
        res = String(valA).localeCompare(String(valB));
      }
      return sortDirection === 'asc' ? res : -res;
    });
  }, [filteredRows, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  const handleHeaderSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colName);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const selectedTableMeta = activeDb?.tables.find((t) => t.name === selectedTable);
  const totalRowsCount = activeDb?.tables.reduce((acc, t) => acc + t.rowCount, 0) || 0;

  // Export current table as CSV
  const handleExportCsv = () => {
    if (!columns.length || !rows.length || !selectedTable) {
      toast.error('No data available to export.');
      return;
    }
    try {
      const headerLine = visibleColumns.map((col) => `"${col.replace(/"/g, '""')}"`).join(',');
      const rowLines = sortedRows.map((r) =>
        visibleColumns
          .map((col) => {
            const idx = columns.indexOf(col);
            const v = r[idx];
            if (v === null || v === undefined) return '""';
            return `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(',')
      );
      const csvContent = [headerLine, ...rowLines].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTable}-export.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${selectedTable} to CSV`);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  // Export current table as JSON
  const handleExportJson = () => {
    if (!columns.length || !rows.length || !selectedTable) {
      toast.error('No data available to export.');
      return;
    }
    try {
      const jsonData = sortedRows.map((row) => {
        const item: Record<string, any> = {};
        visibleColumns.forEach((col) => {
          const idx = columns.indexOf(col);
          item[col] = row[idx];
        });
        return item;
      });
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: 'application/json;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTable}-export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${selectedTable} to JSON`);
    } catch {
      toast.error('Failed to export JSON');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      {/* Hidden File Input with multiple attribute */}
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

      {/* Top Application Header Bar */}
      <header className="h-14 bg-[#18191e] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 select-none z-20">
        {/* Left: App Brand & Active File Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
            <Database className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-white text-sm tracking-tight truncate">
              MSK Database Viewer
            </span>

            {activeDb ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300 truncate">
                <FileCode className="w-3 h-3 text-secondary shrink-0" />
                <span className="truncate max-w-[180px]">{activeDb.fileName}</span>
                <span className="text-slate-500 font-normal">
                  ({formatBytes(activeDb.fileSizeBytes)})
                </span>
              </span>
            ) : (
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-800/40">
                Ready for file
              </span>
            )}
          </div>
        </div>

        {/* Center: Privacy & Multi-DB Status Badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>100% In-Browser Private</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>{databases.length} active database(s)</span>
          <span className="text-slate-600">•</span>
          <span>SQLite 3 WASM</span>
        </div>

        {/* Right: Actions (Open File, Edit in SQL Studio, Fullscreen) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm cursor-pointer"
            title="Open local SQLite (.db, .sqlite, .sqlite3, .sql) file(s)"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" />
            <span className="hidden sm:inline">Add Database</span>
          </button>

          {activeDb && (
            <button
              onClick={handleOpenInSqlStudio}
              disabled={isTransferring}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-secondary to-orange-500 hover:from-secondary-light hover:to-orange-400 transition-all shadow-md shadow-secondary/20 cursor-pointer"
              title="Transfer active database into SQL Studio for querying"
            >
              {isTransferring ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Code2 className="w-3.5 h-3.5" />
              )}
              <span>Edit in SQL Studio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

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
        {/* Drag Overlay Notice with pointer-events-none */}
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

        {isEngineLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-secondary" />
            <span className="text-sm font-mono">Parsing SQLite database structure...</span>
          </div>
        ) : databases.length === 0 ? (
          /* Empty State: Clean Dropzone */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="max-w-xl w-full p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-800 hover:border-secondary/60 bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer group flex flex-col items-center shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Open Database Files
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                Drag and drop one or more SQLite (<code className="text-secondary font-mono">.db</code>,{' '}
                <code className="text-secondary font-mono">.sqlite</code>,{' '}
                <code className="text-secondary font-mono">.sqlite3</code>) or SQL (
                <code className="text-secondary font-mono">.sql</code>) files here.
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-secondary hover:bg-secondary-light transition-all shadow-md group-hover:shadow-lg"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Browse Files on Computer</span>
              </button>

              <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-6 text-[11px] text-slate-400 font-mono flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% Client-Side Private</span>
                </span>
                <span>•</span>
                <span>Supports Multi-DB Viewing</span>
                <span>•</span>
                <span>Instant WASM</span>
              </div>
            </div>
          </div>
        ) : (
          /* Active Multi-DB Workspace */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* SIDEBAR: DATABASES IN TOP, TABLES IN BOTTOM */}
            <aside className="w-full lg:w-80 bg-[#15161a] border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col shrink-0 overflow-hidden">
              {/* TOP OF SIDEBAR: DATABASES LIST */}
              <div className="flex flex-col border-b border-slate-800/80 max-h-[38%] overflow-hidden">
                <div className="p-3 border-b border-slate-800/80 bg-[#18191e]/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Databases
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {databases.length}
                    </span>
                    <span
                      className="text-[9px] font-mono text-amber-400/90 bg-amber-950/40 px-1 py-0.5 rounded border border-amber-800/40 hidden sm:inline"
                      title="Loaded databases are kept in local browser storage and automatically removed after 6 hours of inactivity"
                    >
                      6h save
                    </span>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Open another database file"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-2 space-y-1">
                  {databases.map((dbItem) => {
                    const isActive = activeDbId === dbItem.id;
                    return (
                      <div
                        key={dbItem.id}
                        onClick={() => handleSelectDatabase(dbItem)}
                        className={`group px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-secondary/15 text-white font-semibold border border-secondary/40 shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div
                          className="flex items-center gap-2 truncate min-w-0"
                          title={
                            dbItem.updatedAt
                              ? `Saved locally • Auto-removed after 6h inactivity (${formatTtlRemaining(
                                  dbItem.updatedAt,
                                  DB_VIEWER_TTL_MS
                                )})`
                              : 'Saved locally (6h auto-remove)'
                          }
                        >
                          <Database
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-secondary' : 'text-slate-500'
                            }`}
                          />
                          <div className="truncate">
                            <span className="truncate block font-mono text-[11px]">
                              {dbItem.fileName}
                            </span>
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
                  })}
                </div>
              </div>

              {/* BOTTOM OF SIDEBAR: TABLES OF ACTIVE DATABASE */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#15161a]">
                <div className="p-3 border-b border-slate-800/80 bg-[#18191e]/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                      Tables in {activeDb?.fileName || 'Database'}
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
                      placeholder="Filter tables..."
                      className="w-full bg-[#121316] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {!activeDb || activeDb.tables.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No tables found in this database.
                    </div>
                  ) : (
                    activeDb.tables
                      .filter((t) => t.name.toLowerCase().includes(tableSearch.toLowerCase()))
                      .map((table) => {
                        const isSelected = selectedTable === table.name;
                        return (
                          <button
                            key={table.name}
                            onClick={() => handleSelectTable(table.name)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-secondary/15 text-white font-semibold border border-secondary/30'
                                : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <TableIcon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? 'text-secondary' : 'text-slate-500'
                                }`}
                              />
                              <span className="truncate">{table.name}</span>
                            </div>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-secondary/20 text-secondary'
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

                <div className="p-2.5 border-t border-slate-800/80 bg-[#121316] text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{activeDb?.tables.length || 0} tables</span>
                  <span>{totalRowsCount} rows</span>
                </div>
              </div>
            </aside>

            {/* MAIN DATA VIEW PANEL */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#121316]">
              {/* Table Controls Ribbon */}
              <div className="p-3 border-b border-slate-800/80 bg-[#18191e]/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Table:</span>
                    <span className="text-xs font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {selectedTable || 'None'}
                    </span>
                  </div>

                  <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                    <button
                      onClick={() => setActiveTab('data')}
                      className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        activeTab === 'data'
                          ? 'bg-secondary text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Table Data ({rows.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('schema')}
                      className={`px-3 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        activeTab === 'schema'
                          ? 'bg-secondary text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Schema & DDL ({columns.length} cols)
                    </button>
                  </div>
                </div>

                {activeTab === 'data' && (
                  <div className="flex items-center gap-2 flex-wrap relative">
                    {/* Superpower: Column Visibility Button */}
                    <div className="relative">
                      <button
                        onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          currentTableHidden.length > 0
                            ? 'bg-secondary/20 text-secondary border-secondary/40'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                        }`}
                        title="Toggle visible columns"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>
                          Cols ({visibleColumns.length}/{columns.length})
                        </span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>

                      {/* Dropdown Popover */}
                      {isColumnDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#18191e] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                            <span className="font-bold text-slate-300">Visible Columns</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={showAllColumns}
                                className="text-secondary hover:underline cursor-pointer"
                              >
                                All
                              </button>
                              <button
                                onClick={hideAllColumnsExceptFirst}
                                className="text-slate-400 hover:underline cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          </div>

                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {columns.map((col) => {
                              const isChecked = !currentTableHidden.includes(col);
                              return (
                                <label
                                  key={col}
                                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800 text-xs text-slate-300 cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleColumnVisibility(col)}
                                    className="rounded border-slate-700 text-secondary focus:ring-0"
                                  />
                                  <span className="truncate font-mono">{col}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Superpower: Advanced Filter Toggle Button */}
                    <button
                      onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        showAdvancedFilter || (filterColumn && filterValue)
                          ? 'bg-secondary/20 text-secondary border-secondary/40 font-bold'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Advanced Filter</span>
                    </button>

                    <button
                      onClick={handleExportCsv}
                      disabled={rows.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={handleExportJson}
                      disabled={rows.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>JSON</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Superpower: Advanced Column-Level Filter Bar */}
              {activeTab === 'data' && showAdvancedFilter && (
                <div className="p-2.5 border-b border-slate-800/80 bg-[#16171c] flex flex-wrap items-center gap-2 text-xs shrink-0 animate-in fade-in duration-150">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                    <Filter className="w-3 h-3 text-secondary" />
                    Column Filter:
                  </span>

                  <select
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                    className="bg-[#121316] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="">-- Choose Column --</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value as FilterOperator)}
                    className="bg-[#121316] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="starts_with">starts with</option>
                    <option value="ends_with">ends with</option>
                    <option value="greater_than">&gt; (numeric)</option>
                    <option value="less_than">&lt; (numeric)</option>
                    <option value="is_null">is NULL</option>
                    <option value="is_not_null">is NOT NULL</option>
                  </select>

                  {!['is_null', 'is_not_null'].includes(filterOperator) && (
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      placeholder="Filter value..."
                      className="bg-[#121316] border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-secondary w-40"
                    />
                  )}

                  {(filterColumn || filterValue) && (
                    <button
                      onClick={() => {
                        setFilterColumn('');
                        setFilterValue('');
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded bg-slate-800 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {/* Quick Search & Summary Row (inside Data tab) */}
              {activeTab === 'data' && (
                <div className="p-2.5 border-b border-slate-800/80 bg-[#15161a] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={rowSearch}
                      onChange={(e) => {
                        setRowSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder={`Search across all fields in ${selectedTable || 'table'}...`}
                      className="w-full bg-[#121316] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <span>
                      <strong className="text-white">{sortedRows.length}</strong> of{' '}
                      <strong className="text-white">{rows.length}</strong> rows
                    </span>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px]">Rows:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                        className="bg-[#121316] border border-slate-800 text-slate-200 rounded px-1.5 py-1 text-xs focus:outline-none"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Table Grid Area */}
              <div className="flex-1 overflow-auto bg-[#121316]">
                {activeTab === 'data' ? (
                  visibleColumns.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-2">
                      <TableIcon className="w-10 h-10 opacity-30 text-secondary" />
                      <span className="text-xs font-semibold text-slate-300">No Columns Visible</span>
                      <p className="text-[11px] text-slate-500">
                        All columns are currently hidden. Click &ldquo;Cols&rdquo; above to show columns.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs select-text">
                      <thead>
                        <tr className="bg-[#18191e] sticky top-0 z-10 border-b border-slate-800">
                          <th className="py-2.5 px-3 text-[11px] font-mono text-slate-500 w-16 text-center border-r border-slate-800/60">
                            View
                          </th>
                          {visibleColumns.map((col) => {
                            const isSorted = sortColumn === col;
                            const colMeta = selectedTableMeta?.columns.find((c) => c.name === col);
                            const fkMeta = selectedTableMeta?.foreignKeys?.find((f) => f.fromColumn === col);

                            return (
                              <th
                                key={col}
                                onClick={() => handleHeaderSort(col)}
                                className="py-2.5 px-3 text-slate-300 font-semibold cursor-pointer hover:bg-slate-800/80 transition-colors border-r border-slate-800/60 whitespace-nowrap"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    {colMeta?.pk && (
                                      <span title="Primary Key">
                                        <Key className="w-3 h-3 text-amber-400 shrink-0" />
                                      </span>
                                    )}
                                    {fkMeta && (
                                      <span title={`Foreign Key references ${fkMeta.targetTable}.${fkMeta.targetColumn}`}>
                                        <Link2 className="w-3 h-3 text-blue-400 shrink-0" />
                                      </span>
                                    )}
                                    <span>{col}</span>
                                  </div>
                                  <span className="text-slate-500 font-mono text-[10px]">
                                    {isSorted ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                                  </span>
                                </div>
                                {colMeta && (
                                  <span className="block text-[10px] font-normal text-slate-500 font-mono mt-0.5">
                                    {colMeta.type}
                                  </span>
                                )}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {paginatedRows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={visibleColumns.length + 1}
                              className="py-12 text-center text-slate-500 text-xs"
                            >
                              No matching records found.
                            </td>
                          </tr>
                        ) : (
                          paginatedRows.map((row, rIdx) => {
                            const globalIdx = (page - 1) * pageSize + rIdx + 1;
                            const absoluteRowIdx = (page - 1) * pageSize + rIdx;

                            return (
                              <tr
                                key={rIdx}
                                className="hover:bg-slate-850/50 transition-colors odd:bg-slate-900/20"
                              >
                                {/* Superpower: Row Detail Card Trigger in # Column */}
                                <td className="py-2 px-2 text-[11px] font-mono text-slate-500 text-center border-r border-slate-800/60">
                                  <button
                                    onClick={() => setDetailRowIndex(absoluteRowIdx)}
                                    className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-secondary hover:text-white text-slate-400 transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                                    title="View full row card details"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>{globalIdx}</span>
                                  </button>
                                </td>

                                {visibleColumns.map((col) => {
                                  const cIdx = columns.indexOf(col);
                                  const cell = row[cIdx];
                                  const cellStr = cell === null || cell === undefined ? 'NULL' : String(cell);
                                  const isNull = cell === null || cell === undefined;
                                  const isLong = cellStr.length > 45;

                                  // Foreign key link check
                                  const fk = selectedTableMeta?.foreignKeys?.find((f) => f.fromColumn === col);

                                  return (
                                    <td
                                      key={col}
                                      className="py-2 px-3 text-slate-300 border-r border-slate-800/60 max-w-[280px] truncate group/cell"
                                    >
                                      {isNull ? (
                                        <span className="text-slate-600 font-mono italic text-[11px]">
                                          NULL
                                        </span>
                                      ) : fk ? (
                                        /* Superpower: Clickable Foreign Key Hyperlink */
                                        <button
                                          onClick={() => handleForeignKeyJump(fk.targetTable, fk.targetColumn, cell)}
                                          className="inline-flex items-center gap-1 text-secondary hover:text-secondary-light font-mono font-semibold underline decoration-secondary/40 hover:decoration-secondary cursor-pointer"
                                          title={`Jump to ${fk.targetTable}.${fk.targetColumn} = ${cellStr}`}
                                        >
                                          <span>{cellStr}</span>
                                          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-70" />
                                        </button>
                                      ) : isLong ? (
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="truncate">{cellStr}</span>
                                          <button
                                            onClick={() =>
                                              setCellModalValue({
                                                title: `${col} (Row #${globalIdx})`,
                                                value: cellStr,
                                              })
                                            }
                                            className="opacity-0 group-hover/cell:opacity-100 text-secondary hover:text-secondary-light px-1 py-0.5 rounded text-[10px] shrink-0 transition-opacity cursor-pointer"
                                            title="Inspect full cell value"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <span>{cellStr}</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )
                ) : (
                  /* Schema & DDL Tab */
                  <div className="p-5 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4 text-secondary" />
                        Column Metadata & Constraints
                      </h3>
                      <div className="bg-[#15161a] border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#18191e] text-slate-400 font-mono text-[11px] border-b border-slate-800">
                            <tr>
                              <th className="py-2.5 px-3">Column Name</th>
                              <th className="py-2.5 px-3">Data Type</th>
                              <th className="py-2.5 px-3">Key / Relation</th>
                              <th className="py-2.5 px-3">Not Null</th>
                              <th className="py-2.5 px-3">Default Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {selectedTableMeta?.columns.map((col) => {
                              const fk = selectedTableMeta.foreignKeys?.find((f) => f.fromColumn === col.name);
                              return (
                                <tr key={col.name} className="hover:bg-slate-900/40">
                                  <td className="py-2 px-3 font-semibold text-white font-mono">
                                    {col.name}
                                  </td>
                                  <td className="py-2 px-3 font-mono text-secondary">
                                    {col.type || 'TEXT'}
                                  </td>
                                  <td className="py-2 px-3">
                                    {col.pk ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                        PRIMARY KEY
                                      </span>
                                    ) : fk ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                                        FK &rarr; {fk.targetTable}.{fk.targetColumn}
                                      </span>
                                    ) : (
                                      <span className="text-slate-600">—</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3">
                                    {col.notnull ? (
                                      <span className="text-emerald-400 font-semibold">YES</span>
                                    ) : (
                                      <span className="text-slate-500">NO</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-slate-400 font-mono">
                                    {col.dflt_value || 'None'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        CREATE TABLE DDL Statement
                      </h3>
                      <div className="bg-[#15161a] p-4 rounded-xl border border-slate-800">
                        <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                          {selectedTableMeta?.sql || '-- DDL unavailable'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Pagination Controls */}
              {activeTab === 'data' && (
                <div className="p-2.5 border-t border-slate-800/80 bg-[#15161a] flex items-center justify-between text-xs shrink-0">
                  <span className="text-slate-400">
                    Page <strong className="text-white">{page}</strong> of{' '}
                    <strong className="text-white">{totalPages}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page >= totalPages}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Superpower: Full Row Detail Card Modal */}
      {detailRowIndex !== null && sortedRows[detailRowIndex] && (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18191e] border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 truncate">
                <span className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold font-mono">
                  #{detailRowIndex + 1}
                </span>
                <h3 className="text-sm font-bold text-white font-mono truncate">
                  Record Details — {selectedTable}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailRowIndex((idx) => (idx !== null ? Math.max(idx - 1, 0) : null))}
                  disabled={detailRowIndex === 0}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Previous Record"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setDetailRowIndex((idx) =>
                      idx !== null ? Math.min(idx + 1, sortedRows.length - 1) : null
                    )
                  }
                  disabled={detailRowIndex === sortedRows.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Next Record"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDetailRowIndex(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field Grid */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {columns.map((col, idx) => {
                const val = sortedRows[detailRowIndex][idx];
                const colMeta = selectedTableMeta?.columns.find((c) => c.name === col);
                const fk = selectedTableMeta?.foreignKeys?.find((f) => f.fromColumn === col);
                const valStr = val === null || val === undefined ? 'NULL' : String(val);

                return (
                  <div
                    key={col}
                    className="p-3 bg-[#121316] border border-slate-800 rounded-xl space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-300">
                        {colMeta?.pk && <Key className="w-3 h-3 text-amber-400" />}
                        {fk && <Link2 className="w-3 h-3 text-blue-400" />}
                        <span>{col}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {colMeta?.type || 'TEXT'}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(valStr);
                            toast.success(`Copied ${col}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-white transition-opacity cursor-pointer"
                          title="Copy field value"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-white break-words select-text">
                      {val === null || val === undefined ? (
                        <span className="text-slate-600 italic">NULL</span>
                      ) : fk ? (
                        <button
                          onClick={() => {
                            setDetailRowIndex(null);
                            handleForeignKeyJump(fk.targetTable, fk.targetColumn, val);
                          }}
                          className="text-secondary hover:text-secondary-light font-semibold underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{valStr}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span>{valStr}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const recordJson: Record<string, any> = {};
                  columns.forEach((c, i) => {
                    recordJson[c] = sortedRows[detailRowIndex][i];
                  });
                  navigator.clipboard.writeText(JSON.stringify(recordJson, null, 2));
                  setCopiedRowJson(true);
                  toast.success('Row copied as JSON');
                  setTimeout(() => setCopiedRowJson(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                {copiedRowJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRowJson ? 'Copied JSON' : 'Copy as JSON'}</span>
              </button>

              <button
                onClick={() => setDetailRowIndex(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-secondary text-white hover:bg-secondary-light cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cell Value Modal / Inspector for long text */}
      {cellModalValue && (
        <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18191e] border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-white font-mono truncate">
                {cellModalValue.title}
              </h3>
              <button
                onClick={() => setCellModalValue(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#121316] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap select-text leading-relaxed">
              {cellModalValue.value}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cellModalValue.value);
                  setCopiedCell(true);
                  toast.success('Copied to clipboard');
                  setTimeout(() => setCopiedCell(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                {copiedCell ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCell ? 'Copied' : 'Copy Value'}</span>
              </button>
              <button
                onClick={() => setCellModalValue(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-white hover:bg-secondary-light cursor-pointer"
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
