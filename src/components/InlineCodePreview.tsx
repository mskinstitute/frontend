'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { buildCompositeWebSrcDoc } from '@/lib/webPreviewUtils';

interface ConsoleLogItem {
  id: string;
  level: 'log' | 'warn' | 'error' | 'info';
  text: string;
  timestamp: string;
}

interface InlineCodePreviewProps {
  lang: string;
  code: string;
  companionLang?: string;
  companionCode?: string;
  title?: string;
}

export default function InlineCodePreview({
  lang,
  code,
  companionLang,
  companionCode,
  title,
}: InlineCodePreviewProps) {
  const [contentHeight, setContentHeight] = useState<number>(56);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate composite HTML for iframe
  const srcDoc = useMemo(() => {
    return buildCompositeWebSrcDoc(lang, code, companionLang, companionCode);
  }, [lang, code, companionLang, companionCode]);

  // Adjust height from measured document dimensions
  const updateHeight = useCallback((rawHeight: number) => {
    if (typeof rawHeight === 'number' && rawHeight > 0) {
      const target = Math.max(36, Math.min(Math.ceil(rawHeight), 800));
      setContentHeight((prev) => {
        // Prevent unnecessary re-renders if height is within 2px
        if (Math.abs(prev - target) < 2) {
          return prev;
        }
        return target;
      });
    }
  }, []);

  // Listen for resize and console messages from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // Handle iframe content height notification
      if (event.data.type === 'MSK_PREVIEW_RESIZE') {
        updateHeight(Number(event.data.height));
      }

      // Handle console outputs
      if (event.data.type === 'MSK_INLINE_CONSOLE') {
        const item: ConsoleLogItem = {
          id: Math.random().toString(36).slice(2, 9),
          level: event.data.level || 'log',
          text: event.data.text || '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setConsoleLogs((prev) => [...prev.slice(-49), item]);
        if (event.data.level === 'error') {
          setIsConsoleOpen(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateHeight]);

  // Direct measurement on iframe load fallback
  const handleIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const root = doc.getElementById('msk-preview-root') || doc.body;
        if (root) {
          const h = Math.ceil(root.getBoundingClientRect().height);
          if (h > 0) {
            updateHeight(h);
          }
        }
      }
    } catch {
      // Fallback handled by postMessage
    }
  };

  return (
    <div className="border-t border-slate-800/90 bg-white flex flex-col transition-all duration-150 animate-in fade-in-50">
      {/* Auto-height Live Preview Frame */}
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        onLoad={handleIframeLoad}
        title={title || 'Live Code Preview'}
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
        style={{ height: `${contentHeight}px` }}
        className="w-full border-0 bg-white block transition-[height] duration-150 ease-out"
      />

      {/* Console Drawer (collapsible only if JS emitted logs) */}
      {consoleLogs.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-950 text-xs">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer font-mono"
            >
              <Terminal className="w-3.5 h-3.5 text-secondary" />
              <span>Console ({consoleLogs.length})</span>
              <span className="text-[10px] text-slate-500">
                {isConsoleOpen ? '▲ Hide' : '▼ View'}
              </span>
            </button>

            {isConsoleOpen && (
              <button
                type="button"
                onClick={() => setConsoleLogs([])}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Clear console output"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {isConsoleOpen && (
            <div className="max-h-36 overflow-y-auto p-2.5 font-mono space-y-1 bg-slate-950">
              {consoleLogs.map((log) => {
                let badgeClass = 'text-slate-300';
                if (log.level === 'error') badgeClass = 'text-rose-400 bg-rose-500/10 px-1 rounded';
                else if (log.level === 'warn') badgeClass = 'text-amber-400 bg-amber-500/10 px-1 rounded';
                else if (log.level === 'info') badgeClass = 'text-sky-400';

                return (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[10px] text-slate-600 shrink-0">{log.timestamp}</span>
                    <span className={`break-all ${badgeClass}`}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
