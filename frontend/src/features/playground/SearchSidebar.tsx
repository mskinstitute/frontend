'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, ChevronDown, FileText } from 'lucide-react';
import { PlaygroundFile, PlaygroundFolder, SearchMatch } from './types';
import { getFileIcon } from './FileExplorerSidebar';
import ActionTooltip from './ActionTooltip';

interface SearchSidebarProps {
  files: PlaygroundFile[];
  folders?: PlaygroundFolder[];
  onSelectResult: (fileId: string, lineNumber: number, column: number) => void;
  onClose: () => void;
}

export default function SearchSidebar({ files, folders = [], onSelectResult, onClose }: SearchSidebarProps) {
  const [query, setQuery] = useState('');

  // Find all matches across all files
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const matches: SearchMatch[] = [];
    for (const file of files) {
      const lines = file.content.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        let startIndex = 0;
        let foundIndex = lowerLine.indexOf(trimmed, startIndex);

        while (foundIndex !== -1) {
          matches.push({
            fileId: file.id,
            fileName: file.name,
            lineNumber: i + 1,
            lineContent: line.trim(),
            matchIndex: foundIndex,
          });
          startIndex = foundIndex + trimmed.length;
          foundIndex = lowerLine.indexOf(trimmed, startIndex);
        }
      }
    }
    return matches;
  }, [files, query]);

  // Group matches by fileId
  const groupedMatches = useMemo(() => {
    const map = new Map<string, { file: PlaygroundFile; matches: SearchMatch[] }>();
    for (const m of searchResults) {
      if (!map.has(m.fileId)) {
        const file = files.find((f) => f.id === m.fileId);
        if (file) {
          map.set(m.fileId, { file, matches: [] });
        }
      }
      map.get(m.fileId)?.matches.push(m);
    }
    return Array.from(map.values());
  }, [files, searchResults]);

  return (
    <div className="w-56 sm:w-64 bg-[#252526] border-r border-[#1e1e1e] flex flex-col select-none text-xs text-slate-300 z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1e1e] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        <span className="flex items-center gap-1">
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Search in Files</span>
        </span>
        <ActionTooltip label="Close Search" shortcut="Esc" placement="bottom">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Search"
            className="p-1 hover:text-white hover:bg-[#333] rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </ActionTooltip>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-[#1e1e1e]">
        <div className="relative flex items-center">
          <input
            type="text"
            autoFocus
            value={query}
            placeholder="Search across files..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-secondary rounded text-xs text-white px-2.5 py-1.5 pr-7 focus:outline-none placeholder:text-slate-500 font-mono"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 absolute right-2 text-slate-500 pointer-events-none" />
          )}
        </div>
        {query && (
          <div className="text-[10px] text-slate-400 mt-1.5 px-0.5">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} in{' '}
            {groupedMatches.length} {groupedMatches.length === 1 ? 'file' : 'files'}
          </div>
        )}
      </div>

      {/* Search Results List */}
      <div className="flex-1 overflow-y-auto py-1">
        {!query && (
          <div className="p-4 text-center text-slate-500 text-[11px]">
            Type a term above or press <kbd className="px-1 py-0.5 bg-[#1e1e1e] rounded border border-[#333]">Ctrl+Shift+F</kbd> to search across all workspace files.
          </div>
        )}

        {query && searchResults.length === 0 && (
          <div className="p-4 text-center text-slate-500 text-[11px]">
            No results found for &quot;{query}&quot;
          </div>
        )}

        {groupedMatches.map(({ file, matches }) => (
          <div key={file.id} className="mb-2">
            {/* File Group Header */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2a2d2e]/60 text-slate-200 font-semibold font-mono text-[11px]">
              <span>{getFileIcon(file.language)}</span>
              {file.folderId && (
                <span className="text-amber-300/80 font-normal">
                  {folders.find((f) => f.id === file.folderId)?.name}/
                </span>
              )}
              <span className="truncate flex-1">{file.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#1e1e1e] text-slate-400">
                {matches.length}
              </span>
            </div>

            {/* Match Lines */}
            <div className="py-0.5">
              {matches.map((match, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectResult(match.fileId, match.lineNumber, match.matchIndex + 1)}
                  className="px-3 py-1 hover:bg-[#37373d] cursor-pointer flex items-baseline gap-2 text-[11px] font-mono group transition-colors"
                >
                  <span className="text-slate-500 text-[10px] select-none w-5 text-right">
                    {match.lineNumber}
                  </span>
                  <span className="truncate text-slate-300 group-hover:text-white">
                    {match.lineContent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
