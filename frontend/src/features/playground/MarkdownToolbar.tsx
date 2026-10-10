'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table,
  Link2,
  Minus,
} from 'lucide-react';
import ActionTooltip from './ActionTooltip';

export interface MarkdownToolbarProps {
  onInsertMarkdown: (prefix: string, suffix?: string, placeholder?: string) => void;
  onOpenPreview?: () => void;
  isPreviewOpen?: boolean;
}

export default function MarkdownToolbar({
  onInsertMarkdown,
  onOpenPreview,
  isPreviewOpen = false,
}: MarkdownToolbarProps) {
  const tools = [
    {
      label: 'Bold (**text**)',
      icon: <Bold className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('**', '**', 'bold text'),
    },
    {
      label: 'Italic (*text*)',
      icon: <Italic className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('*', '*', 'italic text'),
    },
    {
      label: 'Strikethrough (~~text~~)',
      icon: <Strikethrough className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('~~', '~~', 'strikethrough text'),
    },
    { type: 'separator' },
    {
      label: 'Heading 1 (#)',
      icon: <Heading1 className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('# ', '', 'Heading 1'),
    },
    {
      label: 'Heading 2 (##)',
      icon: <Heading2 className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('## ', '', 'Heading 2'),
    },
    {
      label: 'Heading 3 (###)',
      icon: <Heading3 className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('### ', '', 'Heading 3'),
    },
    { type: 'separator' },
    {
      label: 'Bullet List (- )',
      icon: <List className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('- ', '', 'List item'),
    },
    {
      label: 'Numbered List (1. )',
      icon: <ListOrdered className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('1. ', '', 'First item'),
    },
    {
      label: 'Task Checkbox (- [ ] )',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('- [ ] ', '', 'New task'),
    },
    { type: 'separator' },
    {
      label: 'Blockquote (> )',
      icon: <Quote className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('> ', '', 'Quote or callout'),
    },
    {
      label: 'Inline Code (`code`)',
      icon: <Code className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('`', '`', 'code'),
    },
    {
      label: 'Code Block (```lang)',
      icon: (
        <span className="font-mono text-[10px] font-bold px-1 py-0.5 bg-[#333] rounded">
          {'{}'}
        </span>
      ),
      action: () => onInsertMarkdown('```python\n', '\n```', '# code here'),
    },
    {
      label: 'Insert Table (3x3)',
      icon: <Table className="w-3.5 h-3.5" />,
      action: () =>
        onInsertMarkdown(
          '\n| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :---: |\n| Item 1 | Details A | Active |\n| Item 2 | Details B | Done |\n\n',
          '',
          ''
        ),
    },
    {
      label: 'Hyperlink ([text](url))',
      icon: <Link2 className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('[', '](https://)', 'link title'),
    },
    {
      label: 'Horizontal Rule (---)',
      icon: <Minus className="w-3.5 h-3.5" />,
      action: () => onInsertMarkdown('\n---\n\n', '', ''),
    },
  ];

  return (
    <div className="flex items-center gap-0.5 px-2.5 py-1 bg-[#252526] border-b border-[#2d2d2d] text-xs select-none overflow-x-auto no-scrollbar shadow-inner">
      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 mr-1 hidden sm:inline">
        Format:
      </span>

      {tools.map((tool, idx) => {
        if ('type' in tool && tool.type === 'separator') {
          return <div key={`sep-${idx}`} className="w-[1px] h-3.5 bg-[#3c3c3c] mx-1 shrink-0" />;
        }

        const item = tool as { label: string; icon: React.ReactNode; action: () => void };
        return (
          <ActionTooltip key={idx} label={item.label} placement="bottom">
            <button
              type="button"
              onClick={item.action}
              aria-label={item.label}
              className="p-1 text-slate-300 hover:text-white hover:bg-[#37373d] rounded transition-colors cursor-pointer shrink-0"
            >
              {item.icon}
            </button>
          </ActionTooltip>
        );
      })}

      {onOpenPreview && (
        <div className="ml-auto pl-2 shrink-0">
          <button
            type="button"
            onClick={onOpenPreview}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
              isPreviewOpen
                ? 'bg-secondary text-white border-secondary'
                : 'bg-[#2a2d2e] text-slate-300 hover:text-white hover:bg-[#333] border-[#3c3c3c]'
            }`}
          >
            <span>{isPreviewOpen ? 'Preview Active' : 'Live Preview'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
