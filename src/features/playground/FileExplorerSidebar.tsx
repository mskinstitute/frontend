'use client';

import React, { useState } from 'react';
import {
  FilePlus,
  FolderPlus,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Pencil,
  Check,
  ChevronsDownUp,
  FileUp,
  FolderUp,
  Archive,
} from 'lucide-react';
import { PlaygroundFile, PlaygroundFolder, SupportedLanguage } from './types';
import toast from 'react-hot-toast';
import ActionTooltip from './ActionTooltip';
import DatabaseSchemasSection from './DatabaseSchemasSection';

interface FileExplorerSidebarProps {
  files: PlaygroundFile[];
  folders: PlaygroundFolder[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string, language: SupportedLanguage, folderId?: string | null) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onCreateFolder: (folderName: string, parentId?: string | null) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onToggleFolder: (folderId: string) => void;
  onCollapseAllFolders: () => void;
  onOpenLocalFile?: (targetFolderId?: string | null) => void;
  onOpenLocalFolder?: () => void;
  onOpenLocalZip?: () => void;
  onClose: () => void;
  currentLanguage?: SupportedLanguage;
  activeSqlDbName?: string;
  onSwitchDatabase?: (dbName: string) => void;
  onInsertSqlSnippet?: (snippet: string) => void;
  schemaVersion?: number;
}

export function detectLanguageFromExtension(fileName: string): SupportedLanguage {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return 'python';
    case 'html':
    case 'htm':
      return 'html';
    case 'js':
    case 'jsx':
    case 'mjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'css':
      return 'css';
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp';
    case 'c':
    case 'h':
      return 'c';
    case 'java':
      return 'java';
    case 'sql':
      return 'sql';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return 'python';
  }
}

export function getFileIcon(lang: SupportedLanguage): string {
  switch (lang) {
    case 'python':
      return '🐍';
    case 'html':
      return '🌐';
    case 'javascript':
      return '⚡';
    case 'typescript':
      return '🔷';
    case 'css':
      return '🎨';
    case 'cpp':
      return '⚙️';
    case 'c':
      return '🔧';
    case 'java':
      return '☕';
    case 'sql':
      return '🗄️';
    case 'markdown':
      return '📝';
    default:
      return '📄';
  }
}

export default function FileExplorerSidebar({
  files,
  folders,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onToggleFolder,
  onCollapseAllFolders,
  onOpenLocalFile,
  onOpenLocalFolder,
  onOpenLocalZip,
  onClose,
  currentLanguage,
  activeSqlDbName,
  onSwitchDatabase,
  onInsertSqlSnippet,
  schemaVersion,
}: FileExplorerSidebarProps) {
  // State for collapsible workspace files section
  const [isWorkspaceFilesOpen, setIsWorkspaceFilesOpen] = useState(true);

  // State for creating files & folders
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [creatingFileFolderId, setCreatingFileFolderId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // State for inline renaming
  const [renamingItem, setRenamingItem] = useState<{
    id: string;
    type: 'file' | 'folder';
    name: string;
  } | null>(null);

  // File Creation Confirmation
  const handleConfirmCreateFile = () => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      setIsCreatingFile(false);
      setCreatingFileFolderId(null);
      setNewFileName('');
      return;
    }

    // Smart slash path detection (e.g. "utils/math.py")
    if (trimmed.includes('/') || trimmed.includes('\\')) {
      const parts = trimmed.split(/[/\\]+/).filter(Boolean);
      if (parts.length > 1) {
        const folderName = parts[0];
        const actualFileName = parts.slice(1).join('_');

        let targetFolder = folders.find(
          (f) => f.name.toLowerCase() === folderName.toLowerCase()
        );
        let targetFolderId = targetFolder?.id;

        if (!targetFolder) {
          targetFolderId = 'folder-' + Math.random().toString(36).substring(2, 9);
          onCreateFolder(folderName);
        }

        const lang = detectLanguageFromExtension(actualFileName);
        onCreateFile(actualFileName, lang, targetFolderId);
        setNewFileName('');
        setIsCreatingFile(false);
        setCreatingFileFolderId(null);
        toast.success(`Created ${folderName}/${actualFileName}`);
        return;
      }
    }

    // Check duplicate in same folder
    const duplicate = files.some(
      (f) =>
        f.name.toLowerCase() === trimmed.toLowerCase() &&
        (f.folderId || null) === (creatingFileFolderId || null)
    );
    if (duplicate) {
      toast.error('A file with that name already exists in this folder');
      return;
    }

    const lang = detectLanguageFromExtension(trimmed);
    onCreateFile(trimmed, lang, creatingFileFolderId);
    setNewFileName('');
    setIsCreatingFile(false);
    setCreatingFileFolderId(null);
    toast.success(`Created ${trimmed}`);
  };

  // Folder Creation Confirmation
  const handleConfirmCreateFolder = () => {
    const trimmed = newFolderName.trim().replace(/[/\\]+/g, '-');
    if (!trimmed) {
      setIsCreatingFolder(false);
      setNewFolderName('');
      return;
    }

    if (folders.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('A folder with that name already exists');
      return;
    }

    onCreateFolder(trimmed);
    setNewFolderName('');
    setIsCreatingFolder(false);
    toast.success(`Created folder 📁 ${trimmed}`);
  };

  // Rename Confirmation
  const handleConfirmRename = () => {
    if (!renamingItem) return;
    const trimmed = renamingItem.name.trim();
    if (!trimmed) {
      setRenamingItem(null);
      return;
    }

    if (renamingItem.type === 'file') {
      onRenameFile(renamingItem.id, trimmed);
    } else {
      onRenameFolder(renamingItem.id, trimmed);
    }
    setRenamingItem(null);
  };

  // Start creating file inside a folder
  const handleStartCreateFileInFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const folder = folders.find((f) => f.id === folderId);
    if (folder && folder.isOpen === false) {
      onToggleFolder(folderId);
    }
    setCreatingFileFolderId(folderId);
    setIsCreatingFile(true);
    setNewFileName('');
  };

  // Root files (files not in any folder)
  const rootFiles = files.filter((f) => !f.folderId);

  // Check if SQL context is active (language is SQL or any .sql file in workspace)
  const isSqlContext =
    currentLanguage === 'sql' ||
    files.some((f) => f.language === 'sql' || f.name.toLowerCase().endsWith('.sql'));

  return (
    <div className="w-56 sm:w-60 bg-[#252526] border-r border-[#1e1e1e] flex flex-col select-none text-xs text-slate-300 z-10">
      {/* Explorer Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1e1e] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1">
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Explorer</span>
          </span>
          <span
            className="text-[9px] font-mono text-emerald-400/90 bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-800/40 normal-case font-normal hidden sm:inline"
            title="Files persist in local browser storage and auto-clean after 12 hours of inactivity"
          >
            12h save
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* New File Button */}
          <ActionTooltip label="New File" shortcut="New" placement="bottom">
            <button
              type="button"
              onClick={() => {
                setCreatingFileFolderId(null);
                setIsCreatingFile(true);
                setIsCreatingFolder(false);
              }}
              aria-label="New File"
              className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>

          {/* New Folder Button */}
          <ActionTooltip label="New Folder" shortcut="Folder" placement="bottom">
            <button
              type="button"
              onClick={() => {
                setIsCreatingFolder(true);
                setIsCreatingFile(false);
              }}
              aria-label="New Folder"
              className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </ActionTooltip>

          {/* Open Local File(s) from Phone/PC */}
          <ActionTooltip label="Open File from Device" shortcut="Ctrl + O" placement="bottom">
            <button
              type="button"
              onClick={() => onOpenLocalFile?.(null)}
              aria-label="Open File from Device"
              className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer text-sky-400"
            >
              <FileUp className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>

          {/* Open Local Folder from Phone/PC */}
          <ActionTooltip label="Open Folder from Device" shortcut="Alt + O" placement="bottom">
            <button
              type="button"
              onClick={() => onOpenLocalFolder?.()}
              aria-label="Open Folder from Device"
              className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer text-amber-400"
            >
              <FolderUp className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>

          {/* Collapse All Folders */}
          {folders.length > 0 && (
            <ActionTooltip label="Collapse All Folders" shortcut="Collapse" placement="bottom">
              <button
                type="button"
                onClick={onCollapseAllFolders}
                aria-label="Collapse All Folders"
                className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer"
              >
                <ChevronsDownUp className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </ActionTooltip>
          )}

          {/* Close Explorer on mobile */}
          <ActionTooltip label="Close Explorer" shortcut="Esc" placement="bottom">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Explorer"
              className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors sm:hidden cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* Files & Folders Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        <div
          onClick={() => setIsWorkspaceFilesOpen(!isWorkspaceFilesOpen)}
          className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 group-hover:text-slate-200">
              {isWorkspaceFilesOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </span>
            <span>WORKSPACE FILES</span>
          </div>
          <span className="font-mono text-[9px] text-slate-600">
            {files.length} {files.length === 1 ? 'file' : 'files'}
            {folders.length > 0 && `, ${folders.length} dir`}
          </span>
        </div>

        {isWorkspaceFilesOpen && (
          <>

        {/* Inline Create Folder Input (Root) */}
        {isCreatingFolder && (
          <div className="px-3 py-1 flex items-center gap-1.5 bg-[#1e1e1e]/60 border-l-2 border-amber-400">
            <FolderPlus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={newFolderName}
              placeholder="folder-name"
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreateFolder();
                if (e.key === 'Escape') {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }
              }}
              onBlur={handleConfirmCreateFolder}
              className="flex-1 bg-[#1e1e1e] border border-amber-400 text-white text-[11px] font-mono px-1.5 py-0.5 rounded focus:outline-none"
            />
          </div>
        )}

        {/* Inline Create File Input (Root) */}
        {isCreatingFile && creatingFileFolderId === null && (
          <div className="px-3 py-1 flex items-center gap-1.5 bg-[#1e1e1e]/60 border-l-2 border-secondary">
            <span className="text-xs">📄</span>
            <input
              type="text"
              autoFocus
              value={newFileName}
              placeholder="script.py or utils/helper.py"
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreateFile();
                if (e.key === 'Escape') {
                  setIsCreatingFile(false);
                  setNewFileName('');
                }
              }}
              onBlur={handleConfirmCreateFile}
              className="flex-1 bg-[#1e1e1e] border border-secondary text-white text-[11px] font-mono px-1.5 py-0.5 rounded focus:outline-none"
            />
          </div>
        )}

        {/* 1. Folders List */}
        {folders.map((folder) => {
          const folderFiles = files.filter((f) => f.folderId === folder.id);
          const isFolderOpen = folder.isOpen !== false;
          const isRenamingThisFolder =
            renamingItem?.id === folder.id && renamingItem?.type === 'folder';

          return (
            <div key={folder.id} className="flex flex-col">
              {/* Folder Row */}
              <div
                onClick={() => onToggleFolder(folder.id)}
                className="group flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-[#2a2d2e] text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate flex-1 mr-1">
                  {/* Expand / Collapse Chevron */}
                  <span className="text-slate-400">
                    {isFolderOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>

                  {/* Folder Icon */}
                  {isFolderOpen ? (
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}

                  {/* Folder Name or Inline Rename */}
                  {isRenamingThisFolder ? (
                    <input
                      type="text"
                      autoFocus
                      value={renamingItem.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setRenamingItem({ ...renamingItem, name: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmRename();
                        if (e.key === 'Escape') setRenamingItem(null);
                      }}
                      onBlur={handleConfirmRename}
                      className="flex-1 bg-[#1e1e1e] border border-amber-400 text-white text-[11px] font-mono px-1 py-0.2 rounded focus:outline-none"
                    />
                  ) : (
                    <span className="truncate font-mono font-medium text-[11px]">
                      {folder.name}
                    </span>
                  )}

                  {/* Child Count Badge */}
                  <span className="text-[9px] px-1 py-0.2 bg-[#1e1e1e] text-slate-500 rounded font-mono">
                    {folderFiles.length}
                  </span>
                </div>

                {/* Folder Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                  {/* New file inside this folder */}
                  <ActionTooltip label={`New file in ${folder.name}`} placement="right">
                    <button
                      type="button"
                      onClick={(e) => handleStartCreateFileInFolder(folder.id, e)}
                      aria-label="Add file in folder"
                      className="p-0.5 hover:text-white hover:bg-[#333] rounded cursor-pointer"
                    >
                      <FilePlus className="w-3 h-3 text-sky-400" />
                    </button>
                  </ActionTooltip>

                  {/* Upload file inside this folder */}
                  <ActionTooltip label={`Upload file to ${folder.name}`} placement="right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLocalFile?.(folder.id);
                      }}
                      aria-label="Upload file to folder"
                      className="p-0.5 hover:text-emerald-300 hover:bg-[#333] rounded cursor-pointer"
                    >
                      <FileUp className="w-3 h-3 text-emerald-400" />
                    </button>
                  </ActionTooltip>

                  {/* Rename Folder */}
                  <ActionTooltip label="Rename Folder" placement="right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingItem({ id: folder.id, type: 'folder', name: folder.name });
                      }}
                      aria-label="Rename folder"
                      className="p-0.5 hover:text-amber-300 hover:bg-[#333] rounded cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </ActionTooltip>

                  {/* Delete Folder */}
                  <ActionTooltip label={`Delete folder ${folder.name}`} placement="right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          folderFiles.length === 0 ||
                          confirm(`Delete folder "${folder.name}" and its ${folderFiles.length} file(s)?`)
                        ) {
                          onDeleteFolder(folder.id);
                        }
                      }}
                      aria-label="Delete folder"
                      className="p-0.5 hover:text-rose-400 hover:bg-[#333] rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </ActionTooltip>
                </div>
              </div>

              {/* Nested Folder Contents */}
              {isFolderOpen && (
                <div className="pl-4 ml-3.5 border-l border-slate-700/50 flex flex-col space-y-0.5 my-0.5">
                  {/* Inline Create File Inside This Folder */}
                  {isCreatingFile && creatingFileFolderId === folder.id && (
                    <div className="py-0.5 pr-2 flex items-center gap-1.5">
                      <span className="text-xs">📄</span>
                      <input
                        type="text"
                        autoFocus
                        value={newFileName}
                        placeholder="filename.py"
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmCreateFile();
                          if (e.key === 'Escape') {
                            setIsCreatingFile(false);
                            setCreatingFileFolderId(null);
                            setNewFileName('');
                          }
                        }}
                        onBlur={handleConfirmCreateFile}
                        className="flex-1 bg-[#1e1e1e] border border-secondary text-white text-[11px] font-mono px-1.5 py-0.5 rounded focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Files inside this folder */}
                  {folderFiles.length === 0 && !isCreatingFile && (
                    <div className="py-1 text-[10px] text-slate-500 italic pl-1">
                      Empty folder
                    </div>
                  )}

                  {folderFiles.map((file) => {
                    const isActive = file.id === activeFileId;
                    const isRenamingThisFile =
                      renamingItem?.id === file.id && renamingItem?.type === 'file';

                    return (
                      <div
                        key={file.id}
                        onClick={() => onSelectFile(file.id)}
                        className={`group flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#37373d] text-white font-semibold'
                            : 'text-slate-300 hover:bg-[#2a2d2e] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate flex-1 mr-1">
                          <span className="text-xs select-none">{getFileIcon(file.language)}</span>
                          {isRenamingThisFile ? (
                            <input
                              type="text"
                              autoFocus
                              value={renamingItem.name}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setRenamingItem({ ...renamingItem, name: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleConfirmRename();
                                if (e.key === 'Escape') setRenamingItem(null);
                              }}
                              onBlur={handleConfirmRename}
                              className="flex-1 bg-[#1e1e1e] border border-secondary text-white text-[11px] font-mono px-1 py-0.2 rounded focus:outline-none"
                            />
                          ) : (
                            <span className="truncate font-mono text-[11px]">{file.name}</span>
                          )}
                        </div>

                        {/* File actions on hover */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                          <ActionTooltip label="Rename File" placement="right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenamingItem({ id: file.id, type: 'file', name: file.name });
                              }}
                              aria-label="Rename file"
                              className="p-0.5 hover:text-amber-300 rounded cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </ActionTooltip>

                          {file.isRemovable && (
                            <ActionTooltip label={`Delete ${file.name}`} shortcut="Delete" placement="right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteFile(file.id);
                                }}
                                aria-label={`Delete ${file.name}`}
                                className="p-0.5 hover:text-rose-400 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </ActionTooltip>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* 2. Root Files List */}
        {rootFiles.map((file) => {
          const isActive = file.id === activeFileId;
          const isRenamingThisFile =
            renamingItem?.id === file.id && renamingItem?.type === 'file';

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#37373d] text-white font-semibold'
                  : 'text-slate-300 hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 mr-1">
                <span className="text-xs select-none">{getFileIcon(file.language)}</span>
                {isRenamingThisFile ? (
                  <input
                    type="text"
                    autoFocus
                    value={renamingItem.name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setRenamingItem({ ...renamingItem, name: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmRename();
                      if (e.key === 'Escape') setRenamingItem(null);
                    }}
                    onBlur={handleConfirmRename}
                    className="flex-1 bg-[#1e1e1e] border border-secondary text-white text-[11px] font-mono px-1 py-0.2 rounded focus:outline-none"
                  />
                ) : (
                  <span className="truncate font-mono text-[11px]">{file.name}</span>
                )}
              </div>

              {/* Actions on hover */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                <ActionTooltip label="Rename File" placement="right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingItem({ id: file.id, type: 'file', name: file.name });
                    }}
                    aria-label="Rename file"
                    className="p-0.5 hover:text-amber-300 rounded cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </ActionTooltip>

                {file.isRemovable && (
                  <ActionTooltip label={`Delete ${file.name}`} shortcut="Delete" placement="right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      aria-label={`Delete ${file.name}`}
                      className="p-0.5 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </ActionTooltip>
                )}
              </div>
            </div>
          );
        })}
          </>
        )}

        {/* Schemas Section (When SQL context is active) */}
        {isSqlContext && (
          <DatabaseSchemasSection
            activeDatabaseName={activeSqlDbName}
            onSwitchDatabase={onSwitchDatabase}
            onInsertSqlSnippet={onInsertSqlSnippet}
            schemaVersion={schemaVersion}
          />
        )}
      </div>

      {/* Quick Open from Device */}
      <div className="p-2 border-t border-[#1e1e1e] bg-[#202021] flex flex-col gap-1.5">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
          <span>Open from Device</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenLocalFile?.(null)}
            className="flex items-center justify-center gap-1 py-1 px-1.5 bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 hover:text-white rounded text-[10px] font-medium border border-slate-700/60 transition cursor-pointer"
            title="Open local file(s) from phone/PC (Ctrl + O)"
          >
            <FileUp className="w-3 h-3 text-sky-400" />
            <span>Open File</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenLocalFolder?.()}
            className="flex items-center justify-center gap-1 py-1 px-1.5 bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 hover:text-white rounded text-[10px] font-medium border border-slate-700/60 transition cursor-pointer"
            title="Open local folder from phone/PC (Alt + O)"
          >
            <FolderUp className="w-3 h-3 text-amber-400" />
            <span>Open Folder</span>
          </button>
        </div>
        {onOpenLocalZip && (
          <button
            type="button"
            onClick={() => onOpenLocalZip()}
            className="w-full flex items-center justify-center gap-1 py-1 px-1.5 bg-[#2d2d2d] hover:bg-[#383838] text-slate-300 hover:text-white rounded text-[10px] font-medium border border-slate-700/60 transition cursor-pointer"
            title="Extract and open .zip project from phone/PC"
          >
            <Archive className="w-3 h-3 text-purple-400" />
            <span>Open ZIP Project</span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 border-t border-[#1e1e1e] text-[10px] text-slate-500 flex items-center justify-between">
        <span>
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
        {folders.length > 0 && (
          <span>
            {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
          </span>
        )}
      </div>
    </div>
  );
}
