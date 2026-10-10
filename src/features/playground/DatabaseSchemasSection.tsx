'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Database,
  Table2,
  Key,
  RefreshCw,
  Plus,
  Trash2,
  Play,
  ChevronRight,
  ChevronDown,
  Check,
  Sparkles,
  Layers,
  Code2,
  FileCode,
  Upload,
  Download,
  FileDown,
} from 'lucide-react';
import { mysqlEngine, SqlDatabaseInfo, SqlTableInfo, SqlColumnInfo } from './mysqlEngine';
import ActionTooltip from './ActionTooltip';
import toast from 'react-hot-toast';

interface DatabaseSchemasSectionProps {
  activeDatabaseName?: string;
  onSwitchDatabase?: (dbName: string) => void;
  onInsertSqlSnippet?: (snippet: string) => void;
  schemaVersion?: number;
}

export default function DatabaseSchemasSection({
  activeDatabaseName = 'default',
  onSwitchDatabase,
  onInsertSqlSnippet,
  schemaVersion = 0,
}: DatabaseSchemasSectionProps) {
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(true);
  const [databases, setDatabases] = useState<SqlDatabaseInfo[]>([]);
  const [expandedDbs, setExpandedDbs] = useState<Set<string>>(new Set(['default']));
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [isCreatingDb, setIsCreatingDb] = useState<boolean>(false);
  const [newDbName, setNewDbName] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleImportDbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const buffer = ev.target?.result as ArrayBuffer;
        if (!buffer) throw new Error('Could not read binary file data');
        const uint8 = new Uint8Array(buffer);
        const res = mysqlEngine.importDatabaseFile(file.name, uint8);
        onSwitchDatabase?.(res.name);
        refreshSchemas();
        setExpandedDbs((prev) => new Set([...prev, res.name]));
        toast.success(res.message, { icon: '🗄️', duration: 3500 });
      } catch (err: any) {
        toast.error(`Database import failed: ${err.message || String(err)}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleDownloadDbBinary = (dbName: string) => {
    try {
      const { name, data } = mysqlEngine.exportDatabaseBinary(dbName);
      const blob = new Blob([data as any], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded SQLite database '${name}'`, { icon: '💾' });
    } catch (err: any) {
      toast.error(`Export failed: ${err.message || String(err)}`);
    }
  };

  const handleExportSqlDump = (dbName: string) => {
    try {
      const { name, sql } = mysqlEngine.exportDatabaseSqlDump(dbName);
      const blob = new Blob([sql], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported SQL dump '${name}'`, { icon: '📜' });
    } catch (err: any) {
      toast.error(`SQL dump export failed: ${err.message || String(err)}`);
    }
  };

  // Load latest schema from mysqlEngine
  const refreshSchemas = useCallback(() => {
    try {
      const overview = mysqlEngine.getSchemaOverview();
      setDatabases(overview);

      // Automatically expand active database
      const currentActive = mysqlEngine.getActiveDbName();
      setExpandedDbs((prev) => {
        const next = new Set(prev);
        next.add(currentActive);
        return next;
      });
    } catch (err) {
      console.warn('Failed to load database schemas:', err);
    }
  }, []);

  // Refresh when schemaVersion changes or when active db changes
  useEffect(() => {
    refreshSchemas();
  }, [schemaVersion, activeDatabaseName, refreshSchemas]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshSchemas();
    toast.success('Database schemas refreshed');
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleDbExpanded = (dbName: string) => {
    setExpandedDbs((prev) => {
      const next = new Set(prev);
      if (next.has(dbName)) {
        next.delete(dbName);
      } else {
        next.add(dbName);
      }
      return next;
    });
  };

  const toggleTableExpanded = (dbName: string, tableName: string) => {
    const key = `${dbName}.${tableName}`;
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleConfirmCreateDb = () => {
    const trimmed = newDbName.trim().toLowerCase();
    if (!trimmed) {
      setIsCreatingDb(false);
      setNewDbName('');
      return;
    }

    try {
      mysqlEngine.createDatabase(trimmed, true);
      mysqlEngine.useDatabase(trimmed);
      onSwitchDatabase?.(trimmed);
      refreshSchemas();
      setExpandedDbs((prev) => new Set([...prev, trimmed]));
      setIsCreatingDb(false);
      setNewDbName('');
      toast.success(`Database '${trimmed}' created & active`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create database');
    }
  };

  const handleDropDatabase = (dbName: string) => {
    if (dbName === 'default') {
      toast.error("Cannot drop the 'default' database");
      return;
    }
    if (!confirm(`Are you sure you want to drop database '${dbName}' and all its tables?`)) {
      return;
    }

    try {
      mysqlEngine.dropDatabase(dbName, true);
      const nextActive = mysqlEngine.getActiveDbName();
      onSwitchDatabase?.(nextActive);
      refreshSchemas();
      toast.success(`Database '${dbName}' dropped`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to drop database');
    }
  };

  const handleQuickCreateTable = (dbName: string) => {
    const snippet = `-- Create table in ${dbName}\nUSE ${dbName};\n\nCREATE TABLE students (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(50) NOT NULL,\n    course VARCHAR(50) NOT NULL,\n    score INT NOT NULL,\n    city VARCHAR(50) DEFAULT 'Shikohabad'\n);\n`;
    onInsertSqlSnippet?.(snippet);
  };

  const handleSelectTableRows = (tableName: string, dbName: string) => {
    const snippet = `-- Query table ${tableName} in ${dbName}\nUSE ${dbName};\nSELECT * FROM ${tableName} LIMIT 50;\n`;
    onInsertSqlSnippet?.(snippet);
  };

  const handleDescribeTable = (tableName: string, dbName: string) => {
    const snippet = `-- Inspect schema for ${tableName}\nUSE ${dbName};\nDESCRIBE ${tableName};\n`;
    onInsertSqlSnippet?.(snippet);
  };

  const totalTables = databases.reduce((acc, db) => acc + db.tables.length, 0);

  return (
    <div className="border-t border-[#1e1e1e] flex flex-col select-none">
      {/* 1. Schemas Accordion Header */}
      <div
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className="px-3 py-1.5 bg-[#202021] hover:bg-[#252526] text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-slate-400">
            {isSectionOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
          <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            SCHEMAS
          </span>
          <span className="text-[9px] font-mono text-slate-500">
            ({databases.length} db{databases.length === 1 ? '' : 's'}
            {totalTables > 0 ? `, ${totalTables} tbl` : ''})
          </span>
        </div>

        {/* Section Action Icons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 opacity-80 group-hover:opacity-100"
        >
          {/* Hidden file input for uploading .db / .sqlite */}
          <input
            ref={uploadInputRef}
            type="file"
            accept=".db,.sqlite,.sqlite3"
            className="hidden"
            onChange={handleImportDbFile}
          />

          <ActionTooltip label="Import .db / .sqlite File" placement="top">
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              aria-label="Import SQLite Database"
              className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-[#2d2d2d] rounded transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3" />
            </button>
          </ActionTooltip>

          <ActionTooltip label="Refresh Schemas" placement="top">
            <button
              type="button"
              onClick={handleManualRefresh}
              aria-label="Refresh Schemas"
              className="p-1 text-slate-400 hover:text-white hover:bg-[#2d2d2d] rounded transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </ActionTooltip>

          <ActionTooltip label="Create New Database" placement="top">
            <button
              type="button"
              onClick={() => setIsCreatingDb(true)}
              aria-label="New Database"
              className="p-1 text-slate-400 hover:text-sky-300 hover:bg-[#2d2d2d] rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* 2. Schemas Content */}
      {isSectionOpen && (
        <div className="py-1 flex flex-col space-y-0.5 bg-[#181818]/60 max-h-64 overflow-y-auto">
          {/* Inline Create Database Input */}
          {isCreatingDb && (
            <div className="px-3 py-1 flex items-center gap-1.5 bg-[#1e1e1e] border-l-2 border-sky-400">
              <Database className="w-3 h-3 text-sky-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={newDbName}
                placeholder="database_name"
                onChange={(e) => setNewDbName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmCreateDb();
                  if (e.key === 'Escape') {
                    setIsCreatingDb(false);
                    setNewDbName('');
                  }
                }}
                onBlur={handleConfirmCreateDb}
                className="flex-1 bg-[#141414] border border-sky-500 text-white text-[11px] font-mono px-1.5 py-0.5 rounded focus:outline-none"
              />
            </div>
          )}

          {/* Database Tree */}
          {databases.map((db) => {
            const isExpanded = expandedDbs.has(db.name);
            const isActive = db.name === activeDatabaseName || db.isActive;

            return (
              <div key={db.name} className="flex flex-col">
                {/* Database Row */}
                <div
                  onClick={() => toggleDbExpanded(db.name)}
                  className={`group flex items-center justify-between px-2.5 py-1 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#2a2d2e] text-white font-semibold'
                      : 'text-slate-300 hover:bg-[#222425] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate flex-1 mr-1">
                    <span className="text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </span>

                    <Database
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    <span className="truncate font-mono text-[11px]">{db.name}</span>

                    {isActive && (
                      <span className="px-1 py-0.2 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded text-[9px] font-semibold tracking-wider uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Database Actions */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity"
                  >
                    {!isActive && onSwitchDatabase && (
                      <ActionTooltip label={`Switch to '${db.name}' (USE)`} placement="right">
                        <button
                          type="button"
                          onClick={() => onSwitchDatabase(db.name)}
                          aria-label={`Use ${db.name}`}
                          className="p-0.5 hover:text-emerald-400 hover:bg-[#333] rounded cursor-pointer text-[10px] flex items-center gap-0.5 px-1 bg-slate-800"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>USE</span>
                        </button>
                      </ActionTooltip>
                    )}

                    <ActionTooltip label={`Create Table in '${db.name}'`} placement="right">
                      <button
                        type="button"
                        onClick={() => handleQuickCreateTable(db.name)}
                        aria-label="Add table"
                        className="p-0.5 hover:text-sky-400 hover:bg-[#333] rounded cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </ActionTooltip>

                    <ActionTooltip label={`Download '${db.name}' as .db (SQLite Binary)`} placement="right">
                      <button
                        type="button"
                        onClick={() => handleDownloadDbBinary(db.name)}
                        aria-label="Download SQLite database"
                        className="p-0.5 hover:text-emerald-400 hover:bg-[#333] rounded cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </ActionTooltip>

                    <ActionTooltip label={`Export '${db.name}' as .sql Dump`} placement="right">
                      <button
                        type="button"
                        onClick={() => handleExportSqlDump(db.name)}
                        aria-label="Export SQL dump"
                        className="p-0.5 hover:text-amber-400 hover:bg-[#333] rounded cursor-pointer"
                      >
                        <FileDown className="w-3 h-3" />
                      </button>
                    </ActionTooltip>

                    {db.name !== 'default' && (
                      <ActionTooltip label={`Drop database '${db.name}'`} placement="right">
                        <button
                          type="button"
                          onClick={() => handleDropDatabase(db.name)}
                          aria-label="Drop database"
                          className="p-0.5 hover:text-rose-400 hover:bg-[#333] rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </ActionTooltip>
                    )}
                  </div>
                </div>

                {/* Expanded Database Tables */}
                {isExpanded && (
                  <div className="pl-5 ml-2.5 border-l border-slate-700/50 flex flex-col space-y-0.5 my-0.5">
                    {db.tables.length === 0 ? (
                      <div className="py-1 px-1 text-[10px] text-slate-500 italic flex items-center justify-between">
                        <span>No tables in &apos;{db.name}&apos;</span>
                        <button
                          type="button"
                          onClick={() => handleQuickCreateTable(db.name)}
                          className="text-sky-400 hover:underline text-[9px] cursor-pointer"
                        >
                          + Create Table
                        </button>
                      </div>
                    ) : (
                      db.tables.map((table) => {
                        const isTableExpanded = expandedTables.has(`${db.name}.${table.name}`);

                        return (
                          <div key={table.name} className="flex flex-col">
                            {/* Table Row */}
                            <div
                              onClick={() => toggleTableExpanded(db.name, table.name)}
                              className="group flex items-center justify-between py-1 px-1 rounded cursor-pointer text-slate-300 hover:bg-[#252526] hover:text-white transition-colors"
                            >
                              <div className="flex items-center gap-1.5 truncate flex-1 mr-1">
                                <span className="text-slate-500">
                                  {isTableExpanded ? (
                                    <ChevronDown className="w-2.5 h-2.5" />
                                  ) : (
                                    <ChevronRight className="w-2.5 h-2.5" />
                                  )}
                                </span>

                                <Table2 className="w-3 h-3 text-amber-400 shrink-0" />

                                <span className="truncate font-mono text-[11px] font-medium">
                                  {table.name}
                                </span>

                                <span className="text-[9px] text-slate-500 font-mono">
                                  ({table.columns.length})
                                </span>
                              </div>

                              {/* Table Actions */}
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity"
                              >
                                <ActionTooltip
                                  label={`Query SELECT * FROM ${table.name}`}
                                  placement="right"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleSelectTableRows(table.name, db.name)}
                                    aria-label="Query table"
                                    className="px-1 py-0.2 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded text-[9px] font-mono cursor-pointer"
                                  >
                                    SELECT
                                  </button>
                                </ActionTooltip>

                                <ActionTooltip
                                  label={`Describe schema for ${table.name}`}
                                  placement="right"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleDescribeTable(table.name, db.name)}
                                    aria-label="Describe table"
                                    className="px-1 py-0.2 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white rounded text-[9px] font-mono cursor-pointer"
                                  >
                                    DESC
                                  </button>
                                </ActionTooltip>
                              </div>
                            </div>

                            {/* Expanded Table Columns */}
                            {isTableExpanded && (
                              <div className="pl-4 ml-2 border-l border-slate-700/40 flex flex-col space-y-0.5 my-0.5">
                                {table.columns.map((col) => (
                                  <div
                                    key={col.name}
                                    className="flex items-center justify-between py-0.5 px-1 rounded text-[10px] text-slate-300 hover:bg-[#202021]"
                                    title={`${col.name} (${col.type})${
                                      col.isPk ? ' [PRIMARY KEY]' : ''
                                    }${col.notnull ? ' [NOT NULL]' : ''}`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      {col.isPk ? (
                                        <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 ml-0.5" />
                                      )}
                                      <span
                                        className={`font-mono truncate ${
                                          col.isPk ? 'text-amber-200 font-semibold' : 'text-slate-200'
                                        }`}
                                      >
                                        {col.name}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 shrink-0">
                                      <span className="text-sky-300">{col.type}</span>
                                      {col.notnull && (
                                        <span className="text-[8px] text-slate-500">NN</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
