'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  Play,
  Eye,
  EyeOff,
  ExternalLink,
  Code2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getLanguageDisplayName,
  tokenizeCodeToLines,
  getVSCodeTokenColor,
} from '@/lib/prism-highlighter';
import { SupportedLanguage } from '@/features/playground';
import { CodeBlockMeta } from '@/components/MarkdownRenderer';
import { isWebPreviewSupported } from '@/lib/webPreviewUtils';
import InlineCodePreview from '@/components/InlineCodePreview';

export interface CodeTab {
  lang: string;
  code: string;
  meta?: CodeBlockMeta;
  label?: string;
}

export interface MultiLanguageCodeBlockProps {
  tabs: CodeTab[];
  activeLanguagePreference?: string;
  onTry?: (lang: SupportedLanguage, code: string, title?: string) => void;
  title?: string;
}

const PLAYGROUND_SUPPORTED_LANGS: Record<string, SupportedLanguage> = {
  python: 'python',
  py: 'python',
  python3: 'python',
  py3: 'python',
  html: 'html',
  htm: 'html',
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'typescript',
  css: 'css',
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  java: 'java',
  sql: 'sql',
};

// Language normalization helper
export function normalizeLanguageKey(lang: string): string {
  const l = (lang || '').toLowerCase().trim();
  if (l === 'py' || l === 'python3') return 'python';
  if (l === 'c++' || l === 'cpp') return 'cpp';
  if (l === 'c') return 'c';
  if (l === 'java') return 'java';
  if (l === 'js' || l === 'javascript' || l === 'ts' || l === 'typescript') return 'javascript';
  return l;
}

export function getTabBadgeStyle(lang: string, isActive: boolean) {
  const norm = normalizeLanguageKey(lang);
  if (!isActive) {
    return 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent';
  }

  switch (norm) {
    case 'python':
      return 'text-amber-300 bg-amber-400/15 border-amber-400/40 shadow-xs font-bold';
    case 'c':
      return 'text-sky-300 bg-sky-400/15 border-sky-400/40 shadow-xs font-bold';
    case 'cpp':
      return 'text-cyan-300 bg-cyan-400/15 border-cyan-400/40 shadow-xs font-bold';
    case 'java':
      return 'text-orange-300 bg-orange-400/15 border-orange-400/40 shadow-xs font-bold';
    case 'javascript':
      return 'text-yellow-300 bg-yellow-400/15 border-yellow-400/40 shadow-xs font-bold';
    default:
      return 'text-emerald-300 bg-emerald-400/15 border-emerald-400/40 shadow-xs font-bold';
  }
}

export default function MultiLanguageCodeBlock({
  tabs,
  activeLanguagePreference,
  onTry,
  title,
}: MultiLanguageCodeBlockProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Sync active tab with user preference (e.g. from local storage or course selector)
  useEffect(() => {
    if (!activeLanguagePreference || tabs.length <= 1) return;
    const prefNorm = normalizeLanguageKey(activeLanguagePreference);
    const foundIdx = tabs.findIndex(
      (t) => normalizeLanguageKey(t.lang) === prefNorm
    );
    if (foundIdx !== -1) {
      setActiveIdx(foundIdx);
    }
  }, [activeLanguagePreference, tabs]);

  if (!tabs || tabs.length === 0) return null;

  const currentTab = tabs[activeIdx] || tabs[0];
  const lang = currentTab.lang;
  const code = currentTab.code;
  const meta = currentTab.meta || {};
  const displayName = currentTab.label || getLanguageDisplayName(lang);
  const tokenizedLines = tokenizeCodeToLines(code, lang);

  const enableTry = meta.enableTry !== false && Boolean(PLAYGROUND_SUPPORTED_LANGS[lang]);
  const enableCopy = meta.enableCopy !== false;
  const canPreview = meta.enablePreview !== false && isWebPreviewSupported(lang);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Copied ${displayName} snippet to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTry && PLAYGROUND_SUPPORTED_LANGS[lang]) {
      onTry(
        PLAYGROUND_SUPPORTED_LANGS[lang],
        code,
        meta.title || title || `${displayName} DSA Playground`
      );
    }
  };

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-[#2d2d2d] bg-[#1e1e1e] shadow-xl group/editor">
      {/* Code Editor Header - Authentic VS Code Dark+ Titlebar with Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-1.5 bg-[#252526] border-b border-[#2d2d2d] text-xs font-mono select-none gap-2">
        {/* Left Section: macOS Traffic Lights + Language Selector Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* macOS window control dots */}
          <div className="flex items-center gap-1.5 shrink-0 pr-1" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
          </div>

          {/* Interactive Language Tabs (Single or Multi-Language) */}
          <div
            role="tablist"
            aria-label="Code language tracks"
            className="flex items-center gap-1.5 flex-wrap"
          >
            {tabs.map((tab, idx) => {
              const isActive = idx === activeIdx;
              const tabLabel = tab.label || getLanguageDisplayName(tab.lang);
              return (
                <button
                  key={`${tab.lang}-${idx}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`code-panel-${idx}`}
                  id={`code-tab-${idx}`}
                  tabIndex={0}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-bold uppercase tracking-wider font-mono transition-all cursor-pointer ${getTabBadgeStyle(
                    tab.lang,
                    isActive
                  )}`}
                  title={`Switch to ${tabLabel} implementation`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {/* MDN / Official Documentation Link */}
          {meta.mdnUrl && (
            <a
              href={meta.mdnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:text-white bg-sky-400/10 hover:bg-sky-500 transition-all py-0.5 px-2 sm:px-2.5 rounded-md active:scale-95 text-[11px] font-sans font-semibold border border-sky-400/30 shadow-xs"
              title="Read official documentation"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Docs</span>
            </a>
          )}

          {/* Inline Live Preview / Run Toggle (Web languages) */}
          {canPreview && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 transition-all cursor-pointer py-0.5 px-2.5 rounded-md active:scale-95 text-[11.5px] font-sans font-semibold border shadow-xs ${
                isPreviewOpen
                  ? 'text-white bg-emerald-600 border-emerald-500 hover:bg-emerald-700'
                  : 'text-emerald-400 hover:text-white bg-emerald-500/15 hover:bg-emerald-600 border-emerald-500/40'
              }`}
              title={isPreviewOpen ? 'Hide live output' : 'Show live preview'}
            >
              {isPreviewOpen ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </>
              )}
            </button>
          )}

          {/* Try in Playground Button (Highlighted with Orange Theme) */}
          {enableTry && onTry && (
            <button
              type="button"
              onClick={handleTryClick}
              className="flex items-center gap-1.5 text-secondary hover:text-white bg-secondary/15 hover:bg-secondary transition-all cursor-pointer py-1 px-3 rounded-lg active:scale-95 text-[11.5px] font-sans font-bold border border-secondary/40 shadow-xs"
              title={`Open and run ${displayName} code in interactive playground`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Try</span>
            </button>
          )}

          {/* Copy Snippet Button */}
          {enableCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer py-1 px-2.5 rounded-md hover:bg-white/10 active:scale-95 text-[11.5px] font-sans font-medium"
              aria-label={`Copy ${displayName} code`}
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body - VS Code Dark+ with Sticky Line Numbers */}
      <div
        id={`code-panel-${activeIdx}`}
        role="tabpanel"
        aria-labelledby={`code-tab-${activeIdx}`}
        className="overflow-x-auto py-3 animate-in fade-in duration-150"
      >
        <div
          tabIndex={0}
          className="min-w-full inline-block font-mono text-[14px] sm:text-[15px] leading-6 select-text focus:outline-none"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          }}
        >
          {tokenizedLines.map((lineTokens, lineIdx) => (
            <div
              key={lineIdx}
              className="flex items-center hover:bg-[#282828] group/line min-w-full transition-colors"
            >
              {/* Sticky Line Number Gutter */}
              <span
                className="sticky left-0 bg-[#1e1e1e] group-hover/line:bg-[#282828] select-none text-right text-[#858585] group-hover/line:text-[#c6c6c6] text-[13px] sm:text-[14px] font-mono pr-3.5 pl-3 border-r border-[#333333] w-11 sm:w-13 shrink-0 transition-colors"
                aria-hidden="true"
              >
                {lineIdx + 1}
              </span>
              {/* Tokenized Syntax Highlighted Code Line */}
              <span className="pl-3.5 pr-4 whitespace-pre font-mono text-[#d4d4d4] flex-1">
                {lineTokens.length === 0 ? (
                  '\u00A0'
                ) : (
                  lineTokens.map((tok, tokIdx) => (
                    <span
                      key={tokIdx}
                      style={{ color: getVSCodeTokenColor(tok.type, tok.text, lang) }}
                    >
                      {tok.text}
                    </span>
                  ))
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Inline Live Preview Output */}
      {canPreview && isPreviewOpen && (
        <InlineCodePreview
          lang={lang}
          code={code}
          companionLang={meta.companionLang}
          companionCode={meta.companionCode}
          title={meta.title || title}
        />
      )}
    </div>
  );
}
