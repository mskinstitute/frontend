'use client';

import React, { useState } from 'react';
import { SqlQueryResult } from './types';
import { Database, Download, Check, AlertCircle, Clock, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

interface SqlTableOutputProps {
  results: SqlQueryResult[];
  isLoading?: boolean;
}

export default function SqlTableOutput({ results, isLoading = false }: SqlTableOutputProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleExportCsv = (result: SqlQueryResult, index: number) => {
    try {
      if (!result.columns || result.columns.length === 0) return;
      const headerLine = result.columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(',');
      const rowLines = result.values.map((row) =>
        row
          .map((val) => {
            if (val === null || val === undefined) return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      );
      const csvContent = [headerLine, ...rowLines].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `query-result-${index + 1}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setCopiedIndex(index);
      toast.success('Exported query result to CSV');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Executing SQL / MySQL Query...</span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 gap-2 text-center select-none">
        <Database className="w-8 h-8 opacity-40 text-secondary" />
        <span className="text-xs font-semibold text-slate-300">No Query Results Yet</span>
        <span className="text-[11px] text-slate-400 max-w-xs">
          Press &apos;Run&apos; (Ctrl + Enter) to execute SQL / MySQL queries and view formatted result tables here.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-3 space-y-4 font-sans text-xs select-text">
      {results.map((res, idx) => {
        if (res.error) {
          return (
            <div
              key={idx}
              className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-red-200 flex flex-col gap-2"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-300">SQL / MySQL Error</span>
                    {res.isSelected && (
                      <span className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-700/60 rounded text-emerald-300 font-mono text-[10px]">
                        ⚡ Selected Query
                      </span>
                    )}
                  </div>
                  {res.query && (
                    <pre className="text-[11px] mt-1 bg-black/40 p-2 rounded font-mono text-slate-300 overflow-x-auto border border-red-900/40">
                      {res.query}
                    </pre>
                  )}
                  <pre className="text-[11px] mt-1 whitespace-pre-wrap font-mono text-red-200">
                    {res.error}
                  </pre>
                </div>
              </div>
            </div>
          );
        }

        const isDmlOrDdl = (!res.columns || res.columns.length === 0) && res.values?.length === 0;

        return (
          <div
            key={idx}
            className="border border-[#2d2d2d] rounded-xl bg-[#1e1e1e] overflow-hidden shadow-md"
          >
            {/* Header / Stats Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#2d2d2d] text-[11px] flex-wrap gap-2">
              <div className="flex items-center gap-2 text-slate-300 flex-wrap">
                <span className="font-bold text-secondary flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  Result #{idx + 1}
                </span>

                {res.database && (
                  <span className="px-1.5 py-0.5 bg-sky-950/70 border border-sky-700/50 rounded text-sky-300 font-mono text-[10px] flex items-center gap-1">
                    🗄️ {res.database}
                  </span>
                )}

                {res.isSelected && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 font-mono text-[10px] flex items-center gap-1">
                    ⚡ Selected Query
                  </span>
                )}

                {res.values && res.values.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">
                    <Hash className="w-3 h-3 text-emerald-400" />
                    {res.values.length} row{res.values.length === 1 ? '' : 's'}
                  </span>
                )}

                {res.executionTimeMs !== undefined && (
                  <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-sky-400" />
                    {res.executionTimeMs.toFixed(1)}ms
                  </span>
                )}
              </div>

              {!isDmlOrDdl && (
                <button
                  type="button"
                  onClick={() => handleExportCsv(res, idx)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                  title="Export this result table as CSV"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Download className="w-3 h-3 text-secondary" />
                  )}
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Render Query Snippet if provided */}
            {res.query && (
              <div className="px-3 py-1.5 bg-[#171717] border-b border-[#2d2d2d] font-mono text-[11px] text-slate-300 flex items-center gap-2 overflow-x-auto select-all">
                <span className="text-secondary font-bold select-none">&gt;</span>
                <span className="truncate max-w-full" title={res.query}>
                  {res.query}
                </span>
              </div>
            )}

            {/* DDL/DML Notice */}
            {isDmlOrDdl ? (
              <div className="p-3 text-slate-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-emerald-300">
                  {res.message ||
                    (res.affectedRows !== undefined && res.affectedRows > 0
                      ? `Query OK, ${res.affectedRows} row(s) affected.`
                      : 'Query OK, schema/state updated.')}
                </span>
              </div>
            ) : (
              /* Data Table */
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#2a2d2e] text-slate-200 font-semibold border-b border-[#3c3c3c]">
                      <th className="py-1.5 px-3 w-10 text-center text-slate-500 font-mono border-r border-[#333]">
                        #
                      </th>
                      {res.columns.map((col, colIdx) => (
                        <th
                          key={colIdx}
                          className="py-1.5 px-3 font-mono text-slate-200 tracking-wide border-r border-[#333] last:border-r-0 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a] font-mono">
                    {res.values.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-slate-800/40 transition-colors odd:bg-[#1f1f1f] even:bg-[#1b1b1b]"
                      >
                        <td className="py-1.5 px-3 text-center text-slate-500 text-[10px] select-none border-r border-[#2a2a2a]">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => {
                          const isNull = cell === null || cell === undefined;
                          const isNumber = typeof cell === 'number';
                          return (
                            <td
                              key={cellIdx}
                              className={`py-1.5 px-3 border-r border-[#2a2a2a] last:border-r-0 truncate max-w-xs ${
                                isNumber ? 'text-right text-sky-300' : 'text-slate-200'
                              }`}
                            >
                              {isNull ? (
                                <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-500 rounded font-semibold italic">
                                  NULL
                                </span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
