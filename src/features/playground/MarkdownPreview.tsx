'use client';

import React, { useState, useMemo, useRef } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { highlightCode } from '@/lib/prism-highlighter';

interface MarkdownPreviewProps {
  content: string;
  fileName?: string;
  theme?: string;
}

/**
 * Standard inline formatting:
 * - `code` -> inline code
 * - **bold** -> strong
 * - *italic* -> em
 * - ~~strikethrough~~ -> del
 * - ![alt](url) -> img
 * - [text](url) -> link
 */
function renderStandardInlineText(text: string): React.ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  const regex =
    /(!\[[^\]\n]*\]\([^)\n]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\[[^\]\n]+\]\([^)\n]+\)|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    // Image: ![alt](url)
    if (token.startsWith('![') && token.includes('](')) {
      const imgMatch = token.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        parts.push(
          <img
            key={match.index}
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="max-w-full h-auto rounded border border-[#d0d7de] my-2 inline-block"
            loading="lazy"
          />
        );
      } else {
        parts.push(token);
      }
    }
    // Inline code: `code`
    else if (token.startsWith('`') && token.endsWith('`')) {
      const code = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-[#eff1f3] text-[#1f2328] border border-[#d0d7de] font-mono text-[85%] font-medium mx-0.5"
        >
          {code}
        </code>
      );
    }
    // Bold: **text**
    else if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-semibold text-[#1f2328]">
          {renderStandardInlineText(inner)}
        </strong>
      );
    }
    // Strikethrough: ~~text~~
    else if (token.startsWith('~~') && token.endsWith('~~')) {
      const inner = token.slice(2, -2);
      parts.push(
        <del key={match.index} className="line-through text-[#656d76]">
          {renderStandardInlineText(inner)}
        </del>
      );
    }
    // Italic: *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic text-[#1f2328]">
          {renderStandardInlineText(inner)}
        </em>
      );
    }
    // Link: [text](url)
    else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#0969da] hover:underline font-medium"
          >
            {renderStandardInlineText(linkMatch[1])}
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

type StandardBlock =
  | { type: 'hr' }
  | { type: 'heading'; level: number; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'paragraph'; lines: string[] };

/**
 * Standard Markdown Parser: converts Markdown text directly into standard blocks
 */
function parseStandardMarkdown(content: string): StandardBlock[] {
  const blocks: StandardBlock[] = [];
  const lines = content.split(/\r?\n/);
  let currentBlock: string[] = [];
  let currentType: 'paragraph' | 'blockquote' | 'table' | 'ordered-list' | 'unordered-list' | null =
    null;
  let inCode = false;
  let codeLang = 'text';
  let codeLines: string[] = [];

  const flush = () => {
    if (currentBlock.length === 0) return;

    if (currentType === 'table') {
      const tableLines = currentBlock.filter(
        (l) => l.trim().startsWith('|') && l.trim().endsWith('|')
      );
      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
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
      blocks.push({ type: 'paragraph', lines: currentBlock });
    }

    currentBlock = [];
    currentType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (!inCode) {
        flush();
        inCode = true;
        const match = trimmed.match(/^```(\w+)?/);
        codeLang = (match?.[1] || 'text').toLowerCase();
        codeLines = [];
      } else {
        inCode = false;
        blocks.push({ type: 'code', lang: codeLang, code: codeLines.join('\n') });
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // Blank line -> break block
    if (!trimmed) {
      flush();
      continue;
    }

    // Horizontal Rule (---, ***, ___)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flush();
      blocks.push({ type: 'hr' });
      continue;
    }

    // Headings (#)
    if (trimmed.startsWith('#')) {
      flush();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({ type: 'heading', level: match[1].length, text: match[2] });
        continue;
      }
    }

    // Table row (| ... |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (currentType !== 'table') {
        flush();
        currentType = 'table';
      }
      currentBlock.push(line);
      continue;
    }

    // Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      if (currentType !== 'blockquote') {
        flush();
        currentType = 'blockquote';
      }
      currentBlock.push(line);
      continue;
    }

    // Ordered list (1. ...)
    if (/^\d+\.\s/.test(trimmed)) {
      if (currentType !== 'ordered-list') {
        flush();
        currentType = 'ordered-list';
      }
      currentBlock.push(line);
      continue;
    }

    // Unordered list (- ... or * ...)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (currentType !== 'unordered-list') {
        flush();
        currentType = 'unordered-list';
      }
      currentBlock.push(line);
      continue;
    }

    // Regular paragraph continuation
    if (currentType && currentType !== 'paragraph') {
      flush();
    }
    currentType = 'paragraph';
    currentBlock.push(line);
  }

  flush();
  return blocks;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const blocks = useMemo(() => parseStandardMarkdown(content), [content]);

  const handleCopyCode = (idx: number, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(idx);
    toast.success('Code copied!');
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto bg-white text-[#1f2328] px-4 py-4 sm:px-6 sm:py-6 font-sans leading-relaxed text-sm sm:text-base select-text"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      }}
    >
      {content.trim().length === 0 ? (
        <div className="py-16 text-center text-[#656d76] space-y-2">
          <FileText className="w-10 h-10 mx-auto opacity-30 text-[#656d76]" />
          <p className="font-semibold text-sm text-[#1f2328]">Markdown document is empty.</p>
          <p className="text-xs text-[#656d76]">
            Type markdown on the left to see how standard Markdown renders.
          </p>
        </div>
      ) : (
        <div className="standard-markdown-content space-y-3">
          {blocks.map((block, idx) => {
            // 1. Horizontal Rule
            if (block.type === 'hr') {
              return <hr key={idx} className="my-5 border-t-2 border-[#d0d7de]" />;
            }

            // 2. Headings
            if (block.type === 'heading') {
              switch (block.level) {
                case 1:
                  return (
                    <h1
                      key={idx}
                      className="text-2xl sm:text-3xl font-bold text-[#1f2328] tracking-tight pb-2 border-b border-[#d0d7de] mt-4 mb-3"
                    >
                      {renderStandardInlineText(block.text)}
                    </h1>
                  );
                case 2:
                  return (
                    <h2
                      key={idx}
                      className="text-xl sm:text-2xl font-semibold text-[#1f2328] tracking-tight pb-1.5 border-b border-[#d0d7de] mt-4 mb-2.5"
                    >
                      {renderStandardInlineText(block.text)}
                    </h2>
                  );
                case 3:
                  return (
                    <h3
                      key={idx}
                      className="text-lg sm:text-xl font-semibold text-[#1f2328] mt-3.5 mb-2"
                    >
                      {renderStandardInlineText(block.text)}
                    </h3>
                  );
                case 4:
                  return (
                    <h4
                      key={idx}
                      className="text-base sm:text-lg font-semibold text-[#1f2328] mt-3 mb-1.5"
                    >
                      {renderStandardInlineText(block.text)}
                    </h4>
                  );
                case 5:
                  return (
                    <h5
                      key={idx}
                      className="text-sm sm:text-base font-semibold text-[#1f2328] mt-2 mb-1"
                    >
                      {renderStandardInlineText(block.text)}
                    </h5>
                  );
                default:
                  return (
                    <h6
                      key={idx}
                      className="text-xs sm:text-sm font-semibold text-[#656d76] uppercase tracking-wider mt-2 mb-1"
                    >
                      {renderStandardInlineText(block.text)}
                    </h6>
                  );
              }
            }

            // 3. Fenced Code Block
            if (block.type === 'code') {
              const highlightedHtml = highlightCode(block.code, block.lang);
              return (
                <div
                  key={idx}
                  className="group relative my-3.5 rounded-md border border-[#d0d7de] bg-[#f6f8fa] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-1 bg-[#eaeef2] border-b border-[#d0d7de] text-[11px] font-mono text-[#656d76]">
                    <span className="uppercase font-semibold">{block.lang || 'code'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(idx, block.code)}
                      className="flex items-center gap-1 text-[#656d76] hover:text-[#1f2328] px-1.5 py-0.5 rounded hover:bg-white transition-colors cursor-pointer text-[10px]"
                    >
                      {copiedCodeIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-[#1a7f37]" />
                          <span className="text-[#1a7f37] font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed text-[#1f2328]">
                    <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                  </pre>
                </div>
              );
            }

            // 4. Standard Blockquote (pure markdown quote: > text)
            if (block.type === 'blockquote') {
              const quoteText = block.lines.map((l) => l.replace(/^>\s*/, '')).join('\n');
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-[#d0d7de] pl-4 py-1 text-[#656d76] my-2.5 italic leading-relaxed"
                >
                  {renderStandardInlineText(quoteText)}
                </blockquote>
              );
            }

            // 5. Tables
            if (block.type === 'table') {
              return (
                <div key={idx} className="my-3.5 overflow-x-auto rounded-md border border-[#d0d7de]">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#f6f8fa] border-b border-[#d0d7de]">
                      <tr>
                        {block.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="px-4 py-2 font-semibold text-[#1f2328] border-r border-[#d0d7de] last:border-r-0"
                          >
                            {renderStandardInlineText(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="even:bg-[#fbfbfc] hover:bg-[#f6f8fa] transition-colors"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="px-4 py-2 border-t border-r border-[#d0d7de] last:border-r-0 text-[#1f2328]"
                            >
                              {renderStandardInlineText(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            // 6. Ordered List
            if (block.type === 'ordered-list') {
              return (
                <ol
                  key={idx}
                  className="list-decimal pl-6 my-2.5 text-[#1f2328] text-sm sm:text-base space-y-1"
                >
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="my-0.5 leading-relaxed">
                      {renderStandardInlineText(item)}
                    </li>
                  ))}
                </ol>
              );
            }

            // 7. Unordered List & Task List
            if (block.type === 'unordered-list') {
              return (
                <ul
                  key={idx}
                  className="pl-5 my-2.5 text-[#1f2328] text-sm sm:text-base space-y-1"
                >
                  {block.items.map((item, itemIdx) => {
                    const isTaskDone = item.startsWith('[x] ') || item.startsWith('[X] ');
                    const isTaskPending = item.startsWith('[ ] ');

                    if (isTaskDone) {
                      return (
                        <li
                          key={itemIdx}
                          className="list-none flex items-start gap-2 text-[#656d76] line-through my-1"
                        >
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="mt-1 accent-[#0969da] cursor-default"
                          />
                          <span className="leading-relaxed">
                            {renderStandardInlineText(item.replace(/^\[[xX]\]\s*/, ''))}
                          </span>
                        </li>
                      );
                    }

                    if (isTaskPending) {
                      return (
                        <li
                          key={itemIdx}
                          className="list-none flex items-start gap-2 text-[#1f2328] my-1"
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="mt-1 cursor-default"
                          />
                          <span className="leading-relaxed">
                            {renderStandardInlineText(item.replace(/^\[ \]\s*/, ''))}
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={itemIdx} className="list-disc my-0.5 leading-relaxed">
                        {renderStandardInlineText(item)}
                      </li>
                    );
                  })}
                </ul>
              );
            }

            // 8. Paragraph
            return (
              <p
                key={idx}
                className="my-2.5 text-[#1f2328] leading-7 text-sm sm:text-base font-normal"
              >
                {renderStandardInlineText(block.lines.join(' '))}
              </p>
            );
          })}
        </div>
      )}

      {/* Embedded Clean Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              .standard-markdown-content,
              .standard-markdown-content * {
                visibility: visible !important;
              }
              .standard-markdown-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: #ffffff !important;
                color: #000000 !important;
                padding: 20px !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
