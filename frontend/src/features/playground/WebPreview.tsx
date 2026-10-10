'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  RefreshCw,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Library,
  Check,
  Zap,
} from 'lucide-react';
import { ConsoleMessage } from './types';
import ActionTooltip from './ActionTooltip';

interface WebPreviewProps {
  htmlCode: string;
  onConsoleLog?: (msg: Omit<ConsoleMessage, 'id'>) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface CdnPackage {
  id: string;
  name: string;
  type: 'css' | 'js';
  tag: string;
}

const AVAILABLE_CDNS: CdnPackage[] = [
  {
    id: 'tailwind',
    name: 'Tailwind CSS (Play CDN)',
    type: 'js',
    tag: '<script src="https://cdn.tailwindcss.com"></script>',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap 5.3 CSS',
    type: 'css',
    tag: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">',
  },
  {
    id: 'fontawesome',
    name: 'FontAwesome 6.5 Icons',
    type: 'css',
    tag: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">',
  },
  {
    id: 'jquery',
    name: 'jQuery 3.7.1',
    type: 'js',
    tag: '<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>',
  },
  {
    id: 'google-fonts',
    name: 'Google Font (Poppins)',
    type: 'css',
    tag: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"><style>body { font-family: "Poppins", sans-serif; }</style>',
  },
];

export default function WebPreview({ htmlCode, onConsoleLog }: WebPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isAutoReload, setIsAutoReload] = useState<boolean>(true);
  const [activeCdns, setActiveCdns] = useState<string[]>([]);
  const [isCdnMenuOpen, setIsCdnMenuOpen] = useState<boolean>(false);
  const [debouncedHtml, setDebouncedHtml] = useState<string>(htmlCode);

  // Debounced update for auto-reload
  useEffect(() => {
    if (!isAutoReload) return;
    const timer = setTimeout(() => {
      setDebouncedHtml(htmlCode);
      setReloadKey((prev) => prev + 1);
    }, 450);

    return () => clearTimeout(timer);
  }, [htmlCode, isAutoReload]);

  // If auto reload is disabled, only update when reload button is pressed
  const handleManualReload = () => {
    setDebouncedHtml(htmlCode);
    setReloadKey((k) => k + 1);
  };

  const toggleCdn = (cdnId: string) => {
    setActiveCdns((prev) => {
      const next = prev.includes(cdnId) ? prev.filter((id) => id !== cdnId) : [...prev, cdnId];
      setReloadKey((k) => k + 1);
      return next;
    });
  };

  // Generate safe HTML with console interceptor bridge and CDN packages
  const generateSrcDoc = (src: string) => {
    const bridgeScript = `
      <script>
        (function() {
          const originConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error
          };

          function sendLog(type, args) {
            try {
              const content = Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
                }
                return String(arg);
              }).join(' ');

              window.parent.postMessage({
                source: 'MSK_PLAYGROUND_IFRAME',
                type: type,
                content: content,
                timestamp: new Date().toLocaleTimeString()
              }, '*');
            } catch(e) {}
          }

          console.log = function() { sendLog('log', arguments); originConsole.log.apply(console, arguments); };
          console.info = function() { sendLog('info', arguments); originConsole.info.apply(console, arguments); };
          console.warn = function() { sendLog('warn', arguments); originConsole.warn.apply(console, arguments); };
          console.error = function() { sendLog('error', arguments); originConsole.error.apply(console, arguments); };

          window.onerror = function(msg, url, lineNo, columnNo, error) {
            sendLog('error', [msg + (lineNo ? ' (line ' + lineNo + ')' : '')]);
            return false;
          };
        })();
      </script>
    `;

    // Gather active CDN tags
    const cdnTags = activeCdns
      .map((id) => AVAILABLE_CDNS.find((c) => c.id === id)?.tag || '')
      .join('\n');

    const injection = `${cdnTags}\n${bridgeScript}`;

    // Inject before </head> or at the beginning
    if (src.includes('</head>')) {
      return src.replace('</head>', `${injection}\n</head>`);
    } else if (src.includes('<head>')) {
      return src.replace('<head>', `<head>\n${injection}`);
    } else {
      return `${injection}\n${src}`;
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'MSK_PLAYGROUND_IFRAME' && onConsoleLog) {
        onConsoleLog({
          type: event.data.type || 'log',
          content: event.data.content || '',
          timestamp: event.data.timestamp || new Date().toLocaleTimeString(),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  const handleOpenNewWindow = () => {
    const fullHtml = generateSrcDoc(htmlCode);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 overflow-hidden select-none">
      {/* Mini Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 px-3 py-1.5 bg-[#181818] border-b border-slate-800 text-xs text-slate-300">
        {/* Left: Viewport Size Switcher */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-[#252526] p-0.5 rounded-md border border-slate-700">
            <ActionTooltip label="Desktop Viewport (100%)" shortcut="Desktop" placement="bottom-start">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                aria-label="Desktop Viewport (100%)"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  viewport === 'desktop'
                    ? 'bg-secondary text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </ActionTooltip>

            <ActionTooltip label="Tablet Viewport (768px)" shortcut="Tablet" placement="bottom">
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                aria-label="Tablet Viewport (768px)"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  viewport === 'tablet'
                    ? 'bg-secondary text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
            </ActionTooltip>

            <ActionTooltip label="Mobile Viewport (375px)" shortcut="Mobile" placement="bottom">
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                aria-label="Mobile Viewport (375px)"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  viewport === 'mobile'
                    ? 'bg-secondary text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </ActionTooltip>
          </div>

          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline ml-1">
            {viewport === 'desktop' && 'Full Width (100%)'}
            {viewport === 'tablet' && '768 × 1024 px'}
            {viewport === 'mobile' && '375 × 667 px'}
          </span>
        </div>

        {/* Right: CDN injector, Auto-reload, Refresh, Popout */}
        <div className="flex items-center gap-1 relative">
          {/* Auto Reload Toggle */}
          <ActionTooltip
            label={isAutoReload ? 'Live Auto-reload (Active)' : 'Enable Live Auto-reload'}
            shortcut="Auto"
            placement="bottom"
          >
            <button
              type="button"
              onClick={() => setIsAutoReload(!isAutoReload)}
              aria-label="Toggle Live Auto-reload"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                isAutoReload
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'bg-[#252526] text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Zap className={`w-3 h-3 ${isAutoReload ? 'text-emerald-400 fill-emerald-400' : ''}`} />
              <span className="hidden md:inline">Auto-reload</span>
            </button>
          </ActionTooltip>

          {/* CDN Libraries Dropdown Trigger */}
          <div className="relative">
            <ActionTooltip
              label="Quick CDN Libraries (Tailwind, Bootstrap, FontAwesome...)"
              shortcut="CDN"
              placement="bottom"
            >
              <button
                type="button"
                onClick={() => setIsCdnMenuOpen(!isCdnMenuOpen)}
                aria-label="Inject CDN Libraries"
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                  activeCdns.length > 0
                    ? 'bg-secondary/20 text-secondary border border-secondary/40 font-semibold'
                    : 'bg-[#252526] text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                <Library className="w-3 h-3" />
                <span>Libraries</span>
                {activeCdns.length > 0 && (
                  <span className="px-1 py-0.2 bg-secondary text-white rounded text-[9px] font-bold">
                    {activeCdns.length}
                  </span>
                )}
              </button>
            </ActionTooltip>

            {/* CDN Selection Popover */}
            {isCdnMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#1e1e1e] border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-semibold text-white">
                  <span>Quick CDN Libraries</span>
                  <button
                    onClick={() => setIsCdnMenuOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5">
                  {AVAILABLE_CDNS.map((cdn) => {
                    const isSelected = activeCdns.includes(cdn.id);
                    return (
                      <div
                        key={cdn.id}
                        onClick={() => toggleCdn(cdn.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-secondary/20 border border-secondary/40 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium">{cdn.name}</span>
                          <span className="text-[9px] text-slate-500 uppercase">{cdn.type}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-secondary" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Manual Refresh */}
          <ActionTooltip label="Refresh Web Preview" shortcut="Reload" placement="bottom-end">
            <button
              type="button"
              onClick={handleManualReload}
              aria-label="Refresh Preview"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>

          {/* Popout New Window */}
          <ActionTooltip label="Open Preview in New Tab" shortcut="Popout" placement="bottom-end">
            <button
              type="button"
              onClick={handleOpenNewWindow}
              aria-label="Open in new browser tab"
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* Sandboxed iframe Container */}
      <div className="flex-1 w-full h-full relative bg-[#121214] overflow-auto flex items-center justify-center p-2 sm:p-3">
        <div
          className={`h-full transition-all duration-300 ease-in-out flex flex-col bg-white overflow-hidden shadow-2xl ${
            viewport === 'desktop'
              ? 'w-full rounded-none'
              : viewport === 'tablet'
              ? 'w-[768px] max-w-full rounded-xl border-4 border-slate-700'
              : 'w-[375px] max-w-full rounded-2xl border-4 border-slate-700'
          }`}
        >
          {/* Mock Mobile/Tablet Status Notch */}
          {viewport !== 'desktop' && (
            <div className="bg-slate-800 text-slate-400 text-[10px] font-mono px-3 py-1 flex items-center justify-between border-b border-slate-700 select-none">
              <span>{viewport === 'mobile' ? 'Mobile Frame (375px)' : 'Tablet Frame (768px)'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          )}

          <iframe
            key={reloadKey}
            ref={iframeRef}
            srcDoc={generateSrcDoc(debouncedHtml)}
            title="MSK Playground Live Preview"
            sandbox="allow-scripts allow-modals allow-forms"
            className="w-full flex-1 border-none bg-white"
          />
        </div>
      </div>
    </div>
  );
}
