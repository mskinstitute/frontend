'use client';

import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Sparkles,
  Play,
  Quote,
  Flame,
  CheckSquare,
  Square,
  ExternalLink,
  Link2,
  Eye,
  EyeOff,
  Maximize2,
  X,
  Brain,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { slugify } from '@/lib/markdown';
import QuizQuestionCard, { QuizOption } from '@/components/QuizQuestionCard';
import {
  highlightCode,
  getLanguageDisplayName,
  tokenizeCodeToLines,
  getVSCodeTokenColor,
} from '@/lib/prism-highlighter';
import { SupportedLanguage } from '@/features/playground';
import { detectAndRenderVisualDiagram } from '@/components/MarkdownDiagrams';
import InlineCodePreview from '@/components/InlineCodePreview';
import { isWebPreviewSupported } from '@/lib/webPreviewUtils';

const PlaygroundModal = dynamic(() => import('@/features/playground/PlaygroundModal'), {
  ssr: false,
});

interface MarkdownRendererProps {
  content: string;
}

/**
 * Parses inline formatting:
 * - `code` or `<tag>` -> <code>...</code>
 * - **bold** -> <strong>...</strong>
 * - *italic* -> <em>...</em>
 * - ~~strikethrough~~ -> <del>...</del>
 * - [text](url) -> <a>...</a>
 */
export function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  // Regex matches: ![image](url), `inline code`, **bold**, ~~strikethrough~~, [link](url), *italic*
  const regex = /(!\[[^\]\n]*\]\([^)\n]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\[[^\]\n]+\]\([^)\n]+\)|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith('![') && token.includes('](')) {
      const imgMatch = token.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        parts.push(
          <span key={match.index} className="inline-block my-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1] || 'Illustration'}
              className="max-h-72 object-contain rounded-lg"
              loading="lazy"
            />
            {imgMatch[1] && <span className="block text-center text-xs text-slate-500 mt-1 font-medium">{imgMatch[1]}</span>}
          </span>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-mono font-semibold mx-0.5 inline-block shadow-2xs"
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-bold text-primary">
          {renderFormattedText(inner)}
        </strong>
      );
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      const inner = token.slice(2, -2);
      parts.push(
        <del key={match.index} className="line-through opacity-70">
          {renderFormattedText(inner)}
        </del>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic text-primary/90">
          {renderFormattedText(inner)}
        </em>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-secondary underline hover:text-secondary-light font-semibold transition-colors"
          >
            {renderFormattedText(linkMatch[1])}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
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

export interface CodeBlockMeta {
  enableTry?: boolean;
  enableCopy?: boolean;
  enablePreview?: boolean;
  autoPreview?: boolean;
  mdnUrl?: string;
  exampleUrl?: string;
  title?: string;
  companionCode?: string;
  companionLang?: string;
}

type Block =
  | { type: 'hr' }
  | { type: 'heading'; level: number; text: string; cleanId: string }
  | { type: 'code'; lang: string; code: string; meta: CodeBlockMeta }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'mcq-answer'; answer: string }
  | { type: 'mcq-explanation'; explanation: string }
  | {
      type: 'quiz-question';
      questionNumber?: string | number;
      question: string;
      codeSnippet?: {
        code: string;
        lang: string;
      };
      options: QuizOption[];
      correctAnswer: string;
      explanation?: string;
    }
  | { type: 'image'; alt: string; src: string }
  | { type: 'paragraph'; lines: string[] };

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const [playgroundModal, setPlaygroundModal] = useState<{
    isOpen: boolean;
    language: SupportedLanguage;
    code: string;
    companionCss?: string;
    companionHtml?: string;
    title: string;
  }>({
    isOpen: false,
    language: 'python',
    code: '',
    title: 'Code Playground',
  });
  const [openPreviewMap, setOpenPreviewMap] = useState<Record<number, boolean>>({});

  const isPreviewActive = (blockIndex: number, meta: CodeBlockMeta) => {
    if (openPreviewMap[blockIndex] !== undefined) {
      return openPreviewMap[blockIndex];
    }
    return Boolean(meta.autoPreview);
  };

  const togglePreviewActive = (blockIndex: number, meta: CodeBlockMeta) => {
    setOpenPreviewMap((prev) => {
      const current = prev[blockIndex] !== undefined ? prev[blockIndex] : Boolean(meta.autoPreview);
      return {
        ...prev,
        [blockIndex]: !current,
      };
    });
  };

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Structured Block Tokenizer: Separates headers, code blocks, tables, blockquotes, lists, and paragraphs cleanly
  const parsedBlocks = useMemo<Block[]>(() => {
    const blocks: Block[] = [];
    const lines = content.split(/\r?\n/);
    let currentBlock: string[] = [];
    let currentType: 'paragraph' | 'blockquote' | 'table' | 'ordered-list' | 'unordered-list' | null = null;
    let inCode = false;
    let codeLang = 'text';
    let currentCodeMeta: CodeBlockMeta = {};
    let codeLines: string[] = [];

    const flushCurrent = () => {
      if (currentBlock.length === 0) return;

      if (currentType === 'table') {
        const tableLines = currentBlock.filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|'));
        if (tableLines.length >= 2) {
          const headers = tableLines[0]
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());
          // tableLines[1] is delimiter (|---|---|)
          const rows = tableLines.slice(2).map((r) =>
            r
              .slice(1, -1)
              .split('|')
              .map((c) => c.trim())
          );
          blocks.push({ type: 'table', headers, rows });
        } else {
          blocks.push({ type: 'paragraph', lines: currentBlock });
        }
      } else if (currentType === 'blockquote') {
        blocks.push({ type: 'blockquote', lines: currentBlock });
      } else if (currentType === 'ordered-list') {
        // Parse list items
        const items: string[] = [];
        let curItem: string[] = [];
        for (const l of currentBlock) {
          if (/^\d+\.\s/.test(l.trim())) {
            if (curItem.length > 0) items.push(curItem.join(' '));
            curItem = [l.trim().replace(/^\d+\.\s*/, '')];
          } else if (curItem.length > 0) {
            curItem.push(l.trim());
          }
        }
        if (curItem.length > 0) items.push(curItem.join(' '));
        blocks.push({ type: 'ordered-list', items });
      } else if (currentType === 'unordered-list') {
        const items: string[] = [];
        let curItem: string[] = [];
        for (const l of currentBlock) {
          if (/^[-*]\s+/.test(l.trim())) {
            if (curItem.length > 0) items.push(curItem.join(' '));
            curItem = [l.trim().replace(/^[-*]\s+/, '')];
          } else if (curItem.length > 0) {
            curItem.push(l.trim());
          }
        }
        if (curItem.length > 0) items.push(curItem.join(' '));
        blocks.push({ type: 'unordered-list', items });
      } else {
        // Paragraph / MCQ check
        const text = currentBlock.join('\n').trim();
        if (text.startsWith('**Answer:**') || text.startsWith('Answer:')) {
          blocks.push({ type: 'mcq-answer', answer: text });
        } else if (text.startsWith('**Explanation:**') || text.startsWith('Explanation:')) {
          blocks.push({
            type: 'mcq-explanation',
            explanation: text.replace(/^\*\*Explanation:\*\*\s*|^Explanation:\s*/, ''),
          });
        } else {
          blocks.push({ type: 'paragraph', lines: currentBlock });
        }
      }

      currentBlock = [];
      currentType = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Fenced Code Blocks (```)
      if (trimmed.startsWith('```')) {
        if (!inCode) {
          flushCurrent();
          inCode = true;
          const fenceHeader = trimmed.slice(3).trim();
          const tokens = fenceHeader.split(/\s+/);
          codeLang = (tokens[0] || 'text').toLowerCase();

          const restStr = fenceHeader.slice(tokens[0]?.length || 0).trim();
          const meta: CodeBlockMeta = {};

          // 1. Try in playground disable/enable
          if (/\b(no-try|no-playground|try=false|playground=false|try:false)\b/i.test(restStr)) {
            meta.enableTry = false;
          } else if (/\b(try=true|playground=true|try:true|try)\b/i.test(restStr)) {
            meta.enableTry = true;
          }

          // 2. Copy button: hidden by default, only enabled if explicitly requested in markdown via "copy"
          if (/\b(no-copy|copy=false|copy:false|copy-false)\b/i.test(restStr)) {
            meta.enableCopy = false;
          } else if (/\b(copy=true|copy:true|copy-true|copy)\b/i.test(restStr)) {
            meta.enableCopy = true;
          } else {
            meta.enableCopy = false;
          }

          // 3. Inline Live Preview disable/enable / auto-open
          const isWebLang = isWebPreviewSupported(codeLang);
          if (
            /\b(preview-true|preview|live-preview)\b/i.test(
              restStr
            )
          ) {
            meta.enablePreview = true;
            meta.autoPreview = true;
          } else if (
            /\b(no-run|run-false)\b/i.test(restStr)
          ) {
            meta.enablePreview = false;
            meta.autoPreview = false;
          } else if (/\bpreview\b/i.test(restStr)) {
            meta.enablePreview = true;
            meta.autoPreview = true;
          } else if (isWebLang) {
            meta.enablePreview = true;
            meta.autoPreview = false;
          }

          // 4. MDN or Doc URL
          const mdnMatch = restStr.match(/\b(?:mdn|doc|docs)=["']?([^"'\s>]+)["']?/i);
          if (mdnMatch) {
            meta.mdnUrl = mdnMatch[1];
          }

          // 5. Example or external demo URL
          const exampleMatch = restStr.match(/\b(?:example|link|demo)=["']?([^"'\s>]+)["']?/i);
          if (exampleMatch) {
            meta.exampleUrl = exampleMatch[1];
          }

          // 5. Custom Title
          const titleMatch = restStr.match(/\btitle=["']([^"']+)["']/i);
          if (titleMatch) {
            meta.title = titleMatch[1];
          }

          currentCodeMeta = meta;
          codeLines = [];
        } else {
          inCode = false;
          blocks.push({
            type: 'code',
            lang: codeLang,
            code: codeLines.join('\n'),
            meta: currentCodeMeta || {},
          });
          codeLines = [];
          currentCodeMeta = {};
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      // Blank line -> boundary
      if (!trimmed) {
        flushCurrent();
        continue;
      }

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushCurrent();
        blocks.push({ type: 'hr' });
        continue;
      }

      // Headings (#, ##, ###, ####)
      if (trimmed.startsWith('#')) {
        flushCurrent();
        const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const rawText = headerMatch[2];
          const cleanId = slugify(rawText.replace(/`([^`]+)`/g, '$1').replace(/\*\*/g, ''));
          blocks.push({ type: 'heading', level, text: rawText, cleanId });
          continue;
        }
      }

      // Table Row (| ... |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (currentType !== 'table') {
          flushCurrent();
          currentType = 'table';
        }
        currentBlock.push(line);
        continue;
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        if (currentType !== 'blockquote') {
          flushCurrent();
          currentType = 'blockquote';
        }
        currentBlock.push(line);
        continue;
      }

      // Ordered List (1. , 2. )
      if (/^\d+\.\s/.test(trimmed)) {
        if (currentType !== 'ordered-list') {
          flushCurrent();
          currentType = 'ordered-list';
        }
        currentBlock.push(line);
        continue;
      }

      // Unordered List (- , * )
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // If it's an MCQ option like '- A) ' or '- A. ', keep with paragraph/options block so it groups with answer
        if (/^(?:-\s*)?\(?[A-D]\)?[\.\)]/i.test(trimmed)) {
          if (currentType && currentType !== 'paragraph') {
            flushCurrent();
          }
          currentType = 'paragraph';
          currentBlock.push(line);
          continue;
        }
        if (currentType !== 'unordered-list') {
          flushCurrent();
          currentType = 'unordered-list';
        }
        currentBlock.push(line);
        continue;
      }

      // Markdown Image Block (![alt](src))
      const blockImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (blockImgMatch) {
        flushCurrent();
        blocks.push({
          type: 'image',
          alt: blockImgMatch[1],
          src: blockImgMatch[2],
        });
        continue;
      }

      // Regular Paragraph Continuation or Switch
      if (currentType && currentType !== 'paragraph') {
        flushCurrent();
      }
      currentType = 'paragraph';
      currentBlock.push(line);
    }

    flushCurrent();

    // Consolidation pass for Practice Quiz Questions:
    // Merges question headings / prompts, optional code snippets, options, answers, and explanations into unified quiz-question blocks
    const consolidatedBlocks: Block[] = [];
    let bIdx = 0;

    const optRegex = /^(?:-\s*)?\(?([A-D])\)?[\.\)]\s+(.*)$/i;
    const ansRegex = /^(?:\*\*)?(?:Correct\s+)?Answer:\s*(?:\*\*)?\s*(?:Option\s+)?\(?([A-D])\)?/i;
    const expRegex = /^(?:\*\*)?Explanation:\s*(?:\*\*)?\s*(.*)$/i;

    while (bIdx < blocks.length) {
      const block = blocks[bIdx];

      let options: QuizOption[] = [];
      let answer = '';
      let explanation = '';
      let questionText = '';
      let questionNum = '';

      const lines: string[] =
        block.type === 'paragraph'
          ? block.lines
          : block.type === 'unordered-list'
          ? block.items
          : [];

      const foundOpts: QuizOption[] = [];
      lines.forEach((l) => {
        const optM = l.trim().match(optRegex);
        if (optM) {
          foundOpts.push({ label: optM[1].toUpperCase(), text: optM[2].trim() });
        }
      });

      if (foundOpts.length >= 2) {
        options = foundOpts;

        lines.forEach((l) => {
          const ansM = l.trim().match(ansRegex);
          if (ansM) answer = ansM[1].toUpperCase();
          const expM = l.trim().match(expRegex);
          if (expM) explanation = expM[1].trim();
        });

        let nextIdx = bIdx + 1;
        while (nextIdx < blocks.length && (!answer || !explanation)) {
          const nextB = blocks[nextIdx];
          if (nextB.type === 'paragraph') {
            let matched = false;
            nextB.lines.forEach((nl) => {
              const ansM = nl.trim().match(ansRegex);
              if (ansM) {
                answer = ansM[1].toUpperCase();
                matched = true;
              }
              const expM = nl.trim().match(expRegex);
              if (expM) {
                explanation = expM[1].trim();
                matched = true;
              }
            });
            if (matched) {
              nextIdx++;
              continue;
            }
          }
          break;
        }

        if (answer) {
          let codeSnippet: { code: string; lang: string } | undefined = undefined;
          let prevBlock = consolidatedBlocks[consolidatedBlocks.length - 1];

          if (prevBlock && prevBlock.type === 'code') {
            codeSnippet = { code: prevBlock.code, lang: prevBlock.lang };
            consolidatedBlocks.pop();
            prevBlock = consolidatedBlocks[consolidatedBlocks.length - 1];
          }

          if (prevBlock && prevBlock.type === 'heading') {
            const hText = prevBlock.text;
            const qMatch = hText.match(
              /^(?:Q(\d+)[:.]?|(\d+)[\.:\)]|Question\s+(\d+)[:.]?)\s*(.*)$/i
            );
            if (qMatch) {
              questionNum = qMatch[1] || qMatch[2] || qMatch[3] || '';
              questionText = qMatch[4] ? qMatch[4].trim() : '';
              consolidatedBlocks.pop();
            } else {
              questionText = hText;
              consolidatedBlocks.pop();
            }
          } else if (
            prevBlock &&
            prevBlock.type === 'paragraph' &&
            prevBlock.lines.length === 1
          ) {
            questionText = prevBlock.lines[0];
            consolidatedBlocks.pop();
          }

          if (!questionText && lines.length > 0 && !optRegex.test(lines[0].trim())) {
            questionText = lines[0].trim();
          }

          consolidatedBlocks.push({
            type: 'quiz-question',
            questionNumber: questionNum,
            question: questionText || 'Practice Question',
            codeSnippet,
            options,
            correctAnswer: answer,
            explanation,
          });

          bIdx = nextIdx;
          // Skip redundant divider right after a quiz question
          if (bIdx < blocks.length && blocks[bIdx].type === 'hr') {
            const afterHr = blocks[bIdx + 1];
            if (
              afterHr &&
              (afterHr.type === 'heading' || afterHr.type === 'paragraph')
            ) {
              bIdx++;
            }
          }
          continue;
        }
      }

      consolidatedBlocks.push(block);
      bIdx++;
    }

    // Automatic Companion Pairing for HTML & CSS:
    // If an HTML block is followed by or near a CSS block (or vice versa),
    // pair them up so running either in Playground passes both HTML and CSS!
    for (let i = 0; i < consolidatedBlocks.length; i++) {
      const cur = consolidatedBlocks[i];
      if (cur.type !== 'code') continue;

      if ((cur.lang === 'html' || cur.lang === 'htm') && !cur.meta.companionCode) {
        for (let j = i + 1; j <= Math.min(i + 3, consolidatedBlocks.length - 1); j++) {
          const target = consolidatedBlocks[j];
          if (target.type === 'heading') break; // do not cross section boundaries
          if (target.type === 'code' && (target.lang === 'css' || target.lang === 'style')) {
            cur.meta.companionCode = target.code;
            cur.meta.companionLang = 'css';
            if (!target.meta.companionCode) {
              target.meta.companionCode = cur.code;
              target.meta.companionLang = 'html';
            }
            break;
          }
        }
      } else if (cur.lang === 'css' && !cur.meta.companionCode) {
        // Look backwards for previous HTML
        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
          const target = consolidatedBlocks[j];
          if (target.type === 'heading') break;
          if (target.type === 'code' && (target.lang === 'html' || target.lang === 'htm')) {
            cur.meta.companionCode = target.code;
            cur.meta.companionLang = 'html';
            if (!target.meta.companionCode) {
              target.meta.companionCode = cur.code;
              target.meta.companionLang = 'css';
            }
            break;
          }
        }
      }
    }

    return consolidatedBlocks;
  }, [content]);

  let codeBlockCounter = 0;

  return (
    <div className="prose-custom space-y-6 text-text-main leading-relaxed text-base sm:text-lg">
      {parsedBlocks.map((block, idx) => {
        // 1. Horizontal Rule
        if (block.type === 'hr') {
          return <hr key={idx} className="my-8 border-t border-border-subtle" />;
        }

        // 2. Headings
        if (block.type === 'heading') {
          const isQuizSectionHeader = /^(?:Practice\s+Quiz|Multiple\s+Choice\s+Questions|MCQs|Knowledge\s+Check|Self\s+Assessment|Review\s+Quiz)$/i.test(
            block.text.trim().replace(/^#+\s*/, '')
          );

          if (isQuizSectionHeader) {
            return (
              <div
                key={idx}
                className="mt-12 mb-6 pt-6 border-t-2 border-dashed border-border-subtle"
              >
                <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-surface rounded-2xl border border-orange-200/90 p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-md">
                          Interactive Quiz
                        </span>
                        <span className="text-xs text-text-muted hidden sm:inline">
                          • Knowledge Check
                        </span>
                      </div>
                      <h2
                        id={block.cleanId}
                        className="text-2xl sm:text-3xl font-black text-primary tracking-tight mt-0.5"
                      >
                        {renderFormattedText(block.text)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          switch (block.level) {
            case 1:
              return (
                <h1
                  key={idx}
                  id={block.cleanId}
                  className="text-3xl sm:text-4xl font-black text-primary tracking-tight mt-10 mb-4 scroll-mt-24 border-b border-border-subtle/70 pb-3"
                >
                  {renderFormattedText(block.text)}
                </h1>
              );
            case 2:
              return (
                <h2
                  key={idx}
                  id={block.cleanId}
                  className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-8 mb-3 scroll-mt-24 flex items-center gap-2"
                >
                  <span>{renderFormattedText(block.text)}</span>
                </h2>
              );
            case 3:
              return (
                <h3
                  key={idx}
                  id={block.cleanId}
                  className="text-xl sm:text-2xl font-bold text-primary tracking-tight mt-6 mb-2 scroll-mt-24"
                >
                  {renderFormattedText(block.text)}
                </h3>
              );
            default:
              return (
                <h4
                  key={idx}
                  id={block.cleanId}
                  className="text-lg sm:text-xl font-bold text-primary tracking-tight mt-5 mb-2 scroll-mt-24"
                >
                  {renderFormattedText(block.text)}
                </h4>
              );
          }
        }

        // 3. Fenced Code Block
        if (block.type === 'code') {
          // Check if block represents an architectural process flow, anatomy diagram, or interactive CSS demo
          const visualDiagram = detectAndRenderVisualDiagram(block.code, block.lang);
          if (visualDiagram) {
            return <React.Fragment key={idx}>{visualDiagram}</React.Fragment>;
          }

          codeBlockCounter++;
          const codeIdx = codeBlockCounter;
          const lang = block.lang;
          const code = block.code;
          const displayName = getLanguageDisplayName(lang);
          const tokenizedLines = tokenizeCodeToLines(code, lang);

          const getLangBadgeStyle = (l: string) => {
            switch (l) {
              case 'python':
              case 'py':
                return 'text-amber-300 bg-amber-400/10 border-amber-400/30';
              case 'html':
              case 'markup':
                return 'text-orange-300 bg-orange-400/10 border-orange-400/30';
              case 'css':
                return 'text-cyan-300 bg-cyan-400/10 border-cyan-400/30';
              case 'javascript':
              case 'js':
                return 'text-yellow-300 bg-yellow-400/10 border-yellow-400/30';
              case 'typescript':
              case 'ts':
                return 'text-blue-300 bg-blue-400/10 border-blue-400/30';
              case 'c':
              case 'cpp':
                return 'text-sky-300 bg-sky-400/10 border-sky-400/30';
              case 'java':
                return 'text-orange-300 bg-orange-400/10 border-orange-400/30';
              default:
                return 'text-slate-300 bg-white/5 border-white/10';
            }
          };

          const enableTry = block.meta.enableTry !== false && Boolean(PLAYGROUND_SUPPORTED_LANGS[lang]);
          const enableCopy = block.meta.enableCopy !== false;
          const canPreview = block.meta.enablePreview !== false && isWebPreviewSupported(lang);
          const hasCompanion = Boolean(block.meta.companionCode);
          const companionLang = block.meta.companionLang;

          return (
            <div
              key={idx}
              className="relative my-6 rounded-2xl overflow-hidden border border-[#2d2d2d] bg-[#1e1e1e] shadow-xl"
            >
              {/* Code Editor Header - Compact VS Code Titlebar */}
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#252526] border-b border-[#2d2d2d] text-xs font-mono select-none">
                {/* Left: macOS dots + Language Badge + Linked Companion Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded border text-[10.5px] font-bold uppercase tracking-wider font-mono ${getLangBadgeStyle(
                      lang
                    )}`}
                  >
                    {displayName}
                  </span>

                  {hasCompanion && (
                    <span
                      className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-sans text-slate-300 shadow-2xs"
                      title={`This example has companion ${companionLang?.toUpperCase()} that will be automatically loaded in the playground!`}
                    >
                      <Link2 className="w-2.5 h-2.5 text-secondary" />
                      <span>Linked with {companionLang?.toUpperCase()}</span>
                    </span>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5">
                  {/* MDN Docs Reference Link */}
                  {block.meta.mdnUrl && (
                    <a
                      href={block.meta.mdnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sky-400 hover:text-white bg-sky-400/10 hover:bg-sky-500 transition-all py-0.5 px-2 sm:px-2.5 rounded-md active:scale-95 text-[11px] font-sans font-semibold border border-sky-400/30 shadow-xs"
                      title="Read official documentation on MDN Web Docs"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">MDN Docs</span>
                      <span className="sm:hidden">MDN</span>
                    </a>
                  )}

                  {/* External Live Example / Demo Link */}
                  {block.meta.exampleUrl && (
                    <a
                      href={block.meta.exampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-white bg-emerald-400/10 hover:bg-emerald-500 transition-all py-0.5 px-2 sm:px-2.5 rounded-md active:scale-95 text-[11px] font-sans font-semibold border border-emerald-400/30 shadow-xs"
                      title="Open external live demo / example"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Live Example</span>
                      <span className="sm:hidden">Demo</span>
                    </a>
                  )}

                  {/* Inline Live Preview / Run Button (respects canPreview) */}
                  {canPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePreviewActive(idx, block.meta);
                      }}
                      className={`flex items-center gap-1.5 transition-all cursor-pointer py-0.5 px-2.5 rounded-md active:scale-95 text-[11.5px] font-sans font-semibold border shadow-xs ${
                        isPreviewActive(idx, block.meta)
                          ? 'text-white bg-emerald-600 border-emerald-500 hover:bg-emerald-700'
                          : 'text-emerald-400 hover:text-white bg-emerald-500/15 hover:bg-emerald-600 border-emerald-500/40'
                      }`}
                      title={
                        isPreviewActive(idx, block.meta)
                          ? 'Hide inline live preview output'
                          : 'Run code and show live preview output right here'
                      }
                    >
                      {isPreviewActive(idx, block.meta) ? (
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

                  {/* Try in Playground Button (respects enableTry) */}
                  {enableTry && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isHtml = lang === 'html' || lang === 'markup';
                        const isCss = lang === 'css';
                        setPlaygroundModal({
                          isOpen: true,
                          language: PLAYGROUND_SUPPORTED_LANGS[lang],
                          code,
                          companionCss:
                            isHtml && block.meta.companionLang === 'css' ? block.meta.companionCode : undefined,
                          companionHtml:
                            isCss && block.meta.companionLang === 'html' ? block.meta.companionCode : undefined,
                          title: block.meta.title || `Interactive Playground (${displayName})`,
                        });
                      }}
                      className="flex items-center gap-1.5 text-secondary hover:text-white bg-secondary/15 hover:bg-secondary transition-all cursor-pointer py-0.5 px-2.5 rounded-md active:scale-95 text-[11.5px] font-sans font-semibold border border-secondary/40 shadow-xs"
                      title={
                        hasCompanion
                          ? `Open in Playground with linked ${companionLang?.toUpperCase()}`
                          : 'Open and run in Playground'
                      }
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Try</span>
                    </button>
                  )}

                  {/* Copy Code Button (respects enableCopy - hidden by default, shown when 'copy' is set in markdown) */}
                  {enableCopy && (
                    <button
                      onClick={() => handleCopy(codeIdx, code)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer py-0.5 px-2.5 rounded-md hover:bg-white/10 active:scale-95 text-[11.5px] font-sans font-medium"
                      aria-label="Copy code"
                    >
                      {copiedIndex === codeIdx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Code Editor Body - VS Code Dark+ with Sticky Line Numbers */}
              <div className="overflow-x-auto py-3">
                <div
                  tabIndex={0}
                  className="min-w-full inline-block font-mono text-[14px] sm:text-[15px] leading-6 select-text"
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  }}
                >
                  {tokenizedLines.map((lineTokens, lineIdx) => (
                    <div
                      key={lineIdx}
                      className="flex items-center hover:bg-[#282828] group min-w-full transition-colors"
                    >
                      {/* Sticky Line Number Gutter */}
                      <span
                        className="sticky left-0 bg-[#1e1e1e] group-hover:bg-[#282828] select-none text-right text-[#858585] group-hover:text-[#c6c6c6] text-[13px] sm:text-[14px] font-mono pr-3.5 pl-3 border-r border-[#333333] w-11 sm:w-13 shrink-0 transition-colors"
                        aria-hidden="true"
                      >
                        {lineIdx + 1}
                      </span>
                      {/* Code Line */}
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

              {/* Inline Live Preview / Output Window */}
              {canPreview && isPreviewActive(idx, block.meta) && (
                <InlineCodePreview
                  lang={lang}
                  code={code}
                  companionLang={block.meta.companionLang}
                  companionCode={block.meta.companionCode}
                  title={block.meta.title}
                />
              )}
            </div>
          );
        }

        // 4. Tables with Formatted Markdown Cells
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-6 overflow-hidden rounded-2xl border border-border-subtle shadow-xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-border-subtle">
                      {block.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-primary font-mono border-r border-border-subtle/50 last:border-r-0"
                        >
                          {renderFormattedText(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/60">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-amber-50/20 even:bg-slate-50/30 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-5 py-3.5 text-xs sm:text-sm border-r border-border-subtle/40 last:border-r-0 leading-relaxed ${
                              cIdx === 0 ? 'font-semibold text-primary bg-slate-50/30' : 'text-text-muted'
                            }`}
                          >
                            {renderFormattedText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // 5. Callouts & Blockquotes
        if (block.type === 'blockquote') {
          const rawLines = block.lines.map((l) => l.replace(/^>\s*/, ''));
          const fullText = rawLines.join('\n').trim();
          const firstLineLower = rawLines[0]?.toLowerCase() || '';

          // Note Callout
          if (firstLineLower.includes('📌') || firstLineLower.includes('note')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:[A-Za-z0-9\s]+)?Note:?\*\*|(?:[A-Za-z0-9\s]+)?Note:?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-5 p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-l-4 border-l-blue-500 border border-blue-200/70 shadow-2xs flex items-start gap-3.5"
              >
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono block">
                    Note
                  </span>
                  <div className="text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                    {renderFormattedText(body || fullText)}
                  </div>
                </div>
              </div>
            );
          }

          // Tip Callout
          if (firstLineLower.includes('💡') || firstLineLower.includes('tip')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:[A-Za-z0-9\s]+)?Tip(?:\s*\d+)?:?\*\*|(?:[A-Za-z0-9\s]+)?Tip(?:\s*\d+)?:?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200/70 shadow-2xs flex items-start gap-3.5"
              >
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono block">
                    Pro Tip
                  </span>
                  <div className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    {renderFormattedText(body || fullText)}
                  </div>
                </div>
              </div>
            );
          }

          // Warning Callout
          if (firstLineLower.includes('⚠️') || firstLineLower.includes('warning') || firstLineLower.includes('caution')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:[A-Za-z0-9\s]+)?(?:Warning|Caution):?\*\*|(?:[A-Za-z0-9\s]+)?(?:Warning|Caution):?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-5 p-4 sm:p-5 rounded-2xl bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200/70 shadow-2xs flex items-start gap-3.5"
              >
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-900 font-mono block">
                    Important Warning
                  </span>
                  <div className="text-xs sm:text-sm text-rose-950 leading-relaxed font-medium">
                    {renderFormattedText(body || fullText)}
                  </div>
                </div>
              </div>
            );
          }

          // Best Practices
          if (firstLineLower.includes('✅') || firstLineLower.includes('best practice')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:[A-Za-z0-9\s]+)?Best Practice:?\*\*|(?:[A-Za-z0-9\s]+)?Best Practice:?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium flex-1">
                  {renderFormattedText(body || fullText)}
                </div>
              </div>
            );
          }

          // Common Mistakes
          if (firstLineLower.includes('❌') || firstLineLower.includes('mistake')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:Common )?Mistake:?\*\*|(?:Common )?Mistake:?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-4 p-4 rounded-xl bg-red-50/70 border border-red-200/80 shadow-2xs flex items-start gap-3"
              >
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-red-950 leading-relaxed font-medium flex-1">
                  {renderFormattedText(body || fullText)}
                </div>
              </div>
            );
          }

          // Fun Fact
          if (firstLineLower.includes('🎉') || firstLineLower.includes('fun fact')) {
            const body = fullText
              .replace(
                /^(?:[📌💡ℹ️⚠️✅❌🎉:]|\s)*(\*\*(?:[A-Za-z0-9\s]+)?Fun Fact:?\*\*|(?:[A-Za-z0-9\s]+)?Fun Fact:?)?\s*/iu,
                ''
              )
              .trim();
            return (
              <div
                key={idx}
                className="my-5 p-5 rounded-2xl bg-gradient-to-r from-purple-50/90 to-indigo-50/90 border border-purple-200 shadow-2xs flex items-start gap-3.5"
              >
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono block">
                    Fun Fact
                  </span>
                  <div className="text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                    {renderFormattedText(body || fullText)}
                  </div>
                </div>
              </div>
            );
          }

          // Standard Blockquote (e.g. author quotation)
          return (
            <div
              key={idx}
              className="my-5 p-5 rounded-2xl bg-surface border-l-4 border-l-secondary border border-border-subtle shadow-2xs flex items-start gap-3"
            >
              <Quote className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5 opacity-70" />
              <div className="text-sm sm:text-base font-medium text-primary leading-relaxed italic flex-1">
                {renderFormattedText(fullText)}
              </div>
            </div>
          );
        }

        // 6. Numbered Lists (Step-by-step ordered items)
        if (block.type === 'ordered-list') {
          return (
            <ol key={idx} className="my-5 space-y-3 list-none pl-0">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-surface/70 border border-border-subtle/80 hover:border-border-subtle transition-colors text-text-main text-sm sm:text-base leading-relaxed"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold text-xs mt-0.5">
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1 leading-relaxed">
                    {renderFormattedText(item)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        // 7. Bullet Lists
        if (block.type === 'unordered-list') {
          return (
            <ul key={idx} className="my-4 space-y-2.5 text-text-muted text-sm sm:text-base">
              {block.items.map((item, itemIdx) => {
                const isTaskDone = item.startsWith('[x] ') || item.startsWith('[X] ');
                const isTaskPending = item.startsWith('[ ] ');
                const isCheck = !isTaskDone && !isTaskPending && (item.startsWith('✅') || item.startsWith('✔'));
                const isCross = item.startsWith('❌');
                const clean = isTaskDone
                  ? item.replace(/^\[[xX]\]\s*/, '')
                  : isTaskPending
                  ? item.replace(/^\[ \]\s*/, '')
                  : item.replace(/^[✅✔❌]\s*/u, '');

                return (
                  <li key={itemIdx} className={`flex items-start gap-2.5 ${isTaskDone ? 'line-through opacity-75' : ''}`}>
                    {isTaskDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    ) : isTaskPending ? (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : isCheck ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                    ) : isCross ? (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-2.5" />
                    )}
                    <span className="leading-relaxed flex-1">{renderFormattedText(clean)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 8. MCQ Answer Box
        if (block.type === 'mcq-answer') {
          return (
            <div
              key={idx}
              className="my-3 p-3.5 bg-emerald-50/80 border border-emerald-300/80 rounded-xl text-xs sm:text-sm text-emerald-950 font-medium flex items-center gap-2.5 shadow-2xs"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>{renderFormattedText(block.answer)}</div>
            </div>
          );
        }

        // 9. MCQ Explanation Box
        if (block.type === 'mcq-explanation') {
          return (
            <div
              key={idx}
              className="my-2 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-text-muted leading-relaxed"
            >
              <span className="font-bold text-primary mr-1">Explanation:</span>
              {renderFormattedText(block.explanation)}
            </div>
          );
        }

        // 9.5. Practice Quiz Question Card
        if (block.type === 'quiz-question') {
          return (
            <QuizQuestionCard
              key={idx}
              questionNumber={block.questionNumber}
              question={block.question}
              codeSnippet={block.codeSnippet}
              options={block.options}
              correctAnswer={block.correctAnswer}
              explanation={block.explanation}
              index={idx}
            />
          );
        }

        // 10. Image Block
        if (block.type === 'image') {
          return (
            <figure
              key={idx}
              className="my-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-slate-100/40 p-2 sm:p-3 shadow-xs group"
            >
              <div
                className="relative overflow-hidden rounded-xl bg-white flex items-center justify-center border border-slate-200/60 cursor-zoom-in"
                onClick={() => setZoomedImage({ src: block.src, alt: block.alt })}
              >
                <img
                  src={block.src}
                  alt={block.alt || 'Microsoft Word UI diagram'}
                  className="w-full max-h-[520px] object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1.5 shadow-sm pointer-events-none">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Click to Zoom
                </span>
              </div>
              {block.alt && (
                <figcaption className="mt-3 text-center text-xs sm:text-sm font-semibold text-slate-700 px-3 py-1 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{renderFormattedText(block.alt)}</span>
                </figcaption>
              )}
            </figure>
          );
        }

        // 11. Normal Paragraph
        const paraText = block.lines.join(' ').trim();
        return (
          <p key={idx} className="text-text-muted text-base sm:text-lg leading-relaxed">
            {renderFormattedText(paraText)}
          </p>
        );
      })}

      {/* Interactive Code Playground Modal */}
      {playgroundModal.isOpen && (
        <PlaygroundModal
          isOpen={playgroundModal.isOpen}
          onClose={() => setPlaygroundModal((prev) => ({ ...prev, isOpen: false }))}
          initialLanguage={playgroundModal.language}
          initialCode={playgroundModal.code}
          initialCss={playgroundModal.companionCss}
          initialHtml={playgroundModal.companionHtml}
          title={playgroundModal.title}
        />
      )}

      {/* Image Zoom / Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl p-3 sm:p-4 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-sm sm:text-base font-bold text-slate-800 truncate">
                {zoomedImage.alt || 'Image Preview'}
              </span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex items-center justify-center p-2 max-h-[calc(90vh-80px)] bg-slate-50 rounded-xl">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
