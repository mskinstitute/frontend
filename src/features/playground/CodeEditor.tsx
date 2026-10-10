'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { SupportedLanguage, PlaygroundSettings, CursorPosition } from './types';
import { Loader2 } from 'lucide-react';
import type { editor } from 'monaco-editor';

// Dynamically import Monaco Editor to completely avoid SSR hydration mismatch
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-[#1e1e1e] flex flex-col items-center justify-center text-slate-400 gap-3">
      <Loader2 className="w-7 h-7 animate-spin text-secondary" />
      <span className="text-xs font-mono tracking-wider">Loading VS Code Monaco Engine...</span>
    </div>
  ),
});

let isPythonProviderRegistered = false;

function registerPythonCompletions(monaco: typeof import('monaco-editor')) {
  if (isPythonProviderRegistered) return;
  isPythonProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: import('monaco-editor').languages.CompletionItem[] = [
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print(${1:value})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'print(value, ..., sep=" ", end="\\n")',
          documentation: 'Prints values to sys.stdout in Python.',
          range,
        },
        {
          label: 'input',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'input("${1:prompt}: ")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'input(prompt=None) -> str',
          documentation: 'Reads a string from standard input.',
          range,
        },
        {
          label: 'range',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'range(${1:start}, ${2:stop})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'range(stop) or range(start, stop[, step])',
          documentation: 'Produces a sequence of integers from start to stop.',
          range,
        },
        {
          label: 'len',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'len(${1:obj})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'len(obj) -> int',
          documentation: 'Return the number of items in a sequence or collection.',
          range,
        },
        {
          label: 'enumerate',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'enumerate(${1:iterable}, start=${2:0})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'enumerate(iterable, start=0)',
          documentation: 'Yields (index, value) pairs from an iterable.',
          range,
        },
        {
          label: 'zip',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'zip(${1:iter1}, ${2:iter2})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'zip(*iterables)',
          documentation: 'Iterate over multiple iterables simultaneously.',
          range,
        },
        {
          label: 'sum',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'sum(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'sum(iterable, start=0)',
          documentation: 'Returns the sum of all elements in an iterable.',
          range,
        },
        {
          label: 'sorted',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'sorted(${1:iterable}, reverse=${2:False})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'sorted(iterable, *, key=None, reverse=False)',
          documentation: 'Returns a new sorted list from items in iterable.',
          range,
        },
        {
          label: 'int',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'int(${1:x})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'int(x=0) -> int',
          documentation: 'Convert a number or string to an integer.',
          range,
        },
        {
          label: 'str',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'str(${1:object})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'str(object="") -> str',
          documentation: 'Convert an object to its string representation.',
          range,
        },
        {
          label: 'list',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'list(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'list(iterable) -> new list',
          documentation: 'Constructs a mutable Python list.',
          range,
        },
        {
          label: 'dict',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'dict(${1:kwargs})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'dict(**kwargs) -> new dict',
          documentation: 'Constructs a key-value dictionary.',
          range,
        },
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:function_name}(${2:params}):\n\t"""${3:Docstring}"""\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'def function_name(...):',
          documentation: 'Define a function with arguments and docstring.',
          range,
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:item} in ${2:iterable}:\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'for item in iterable:',
          documentation: 'Standard Python for loop.',
          range,
        },
        {
          label: 'fori',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:i} in range(${2:n}):\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'for i in range(n):',
          documentation: 'Indexed loop over numerical range.',
          range,
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'while ${1:condition}:\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'while condition:',
          documentation: 'Standard Python while loop.',
          range,
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condition}:\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'if condition:',
          documentation: 'Conditional branch statement.',
          range,
        },
        {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'if condition: ... else: ...',
          documentation: 'If-else conditional statement.',
          range,
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\tself.${2:args} = ${2:args}\n\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'class ClassName:',
          documentation: 'Create a class with constructor (__init__).',
          range,
        },
        {
          label: 'try',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\tprint(f"Error: {${3:e}}")\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'try: ... except Exception as e:',
          documentation: 'Exception handling block.',
          range,
        },
        {
          label: 'main',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if __name__ == "__main__":\n\t${0:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'if __name__ == "__main__":',
          documentation: 'Python top-level execution guard.',
          range,
        },
      ];

      return { suggestions };
    },
  });
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
]);

const HTML_TAGS_DATA = [
  { tag: 'h1', desc: 'Heading 1 (Top-level heading)', snippet: '<h1>${1:Heading 1}</h1>' },
  { tag: 'h2', desc: 'Heading 2 (Section heading)', snippet: '<h2>${1:Heading 2}</h2>' },
  { tag: 'h3', desc: 'Heading 3 (Subheading)', snippet: '<h3>${1:Heading 3}</h3>' },
  { tag: 'h4', desc: 'Heading 4', snippet: '<h4>${1:Heading 4}</h4>' },
  { tag: 'h5', desc: 'Heading 5', snippet: '<h5>${1:Heading 5}</h5>' },
  { tag: 'h6', desc: 'Heading 6', snippet: '<h6>${1:Heading 6}</h6>' },
  { tag: 'p', desc: 'Paragraph text element', snippet: '<p>${1:Paragraph text...}</p>' },
  { tag: 'div', desc: 'Generic content division / container', snippet: '<div class="${1:container}">\n\t$0\n</div>' },
  { tag: 'span', desc: 'Generic inline text container', snippet: '<span>${1:text}</span>' },
  { tag: 'a', desc: 'Hyperlink anchor element', snippet: '<a href="${1:#}">${2:Link text}</a>' },
  { tag: 'button', desc: 'Clickable button element', snippet: '<button type="${1:button}" class="${2:btn}">$0</button>' },
  { tag: 'ul', desc: 'Unordered bullet list', snippet: '<ul>\n\t<li>${1:Item 1}</li>\n\t<li>${2:Item 2}</li>\n</ul>' },
  { tag: 'ol', desc: 'Ordered numbered list', snippet: '<ol>\n\t<li>${1:Item 1}</li>\n\t<li>${2:Item 2}</li>\n</ol>' },
  { tag: 'li', desc: 'List item element', snippet: '<li>$0</li>' },
  { tag: 'img', desc: 'Embedded image element', snippet: '<img src="${1:image.jpg}" alt="${2:Description}" />' },
  { tag: 'input', desc: 'Interactive form input field', snippet: '<input type="${1:text}" placeholder="${2:Enter value...}" />' },
  { tag: 'form', desc: 'Interactive form container', snippet: '<form action="${1:#}" method="${2:POST}">\n\t$0\n</form>' },
  { tag: 'label', desc: 'Caption for a form control', snippet: '<label for="${1:inputId}">$0</label>' },
  { tag: 'textarea', desc: 'Multi-line plain-text editing control', snippet: '<textarea rows="${1:4}" placeholder="${2:Message...}">$0</textarea>' },
  { tag: 'select', desc: 'Dropdown select control', snippet: '<select name="${1:name}" id="${2:id}">\n\t<option value="${3:val}">${4:Option 1}</option>\n</select>' },
  { tag: 'option', desc: 'Dropdown select option', snippet: '<option value="${1:val}">${2:Option text}</option>' },
  { tag: 'table', desc: 'Tabular data container', snippet: '<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>${1:Header}</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>${2:Data}</td>\n\t\t</tr>\n\t</tbody>\n</table>' },
  { tag: 'tr', desc: 'Table row', snippet: '<tr>\n\t<td>$0</td>\n</tr>' },
  { tag: 'th', desc: 'Table header cell', snippet: '<th>$0</th>' },
  { tag: 'td', desc: 'Table standard data cell', snippet: '<td>$0</td>' },
  { tag: 'header', desc: 'Introductory or navigational header', snippet: '<header>\n\t$0\n</header>' },
  { tag: 'footer', desc: 'Footer for nearest sectioning content', snippet: '<footer>\n\t$0\n</footer>' },
  { tag: 'nav', desc: 'Navigation link container', snippet: '<nav>\n\t$0\n</nav>' },
  { tag: 'main', desc: 'Dominant content of document body', snippet: '<main>\n\t$0\n</main>' },
  { tag: 'section', desc: 'Generic standalone section of a document', snippet: '<section class="${1:section}">\n\t$0\n</section>' },
  { tag: 'article', desc: 'Self-contained document composition', snippet: '<article>\n\t$0\n</article>' },
  { tag: 'aside', desc: 'Indirectly related content sidebar', snippet: '<aside>\n\t$0\n</aside>' },
  { tag: 'style', desc: 'Embedded CSS stylesheet', snippet: '<style>\n\t$0\n</style>' },
  { tag: 'script', desc: 'Embedded or external JavaScript', snippet: '<script>\n\t$0\n</script>' },
  { tag: 'link', desc: 'External resource link (e.g. stylesheet)', snippet: '<link rel="stylesheet" href="${1:style.css}">' },
  { tag: 'meta', desc: 'Document metadata (e.g. viewport)', snippet: '<meta name="${1:viewport}" content="${2:width=device-width, initial-scale=1.0}">' },
  { tag: 'strong', desc: 'Strong importance / bold text', snippet: '<strong>$0</strong>' },
  { tag: 'b', desc: 'Bold text styling', snippet: '<b>$0</b>' },
  { tag: 'em', desc: 'Emphasized / italic text', snippet: '<em>$0</em>' },
  { tag: 'i', desc: 'Italic text styling', snippet: '<i>$0</i>' },
  { tag: 'small', desc: 'Side comments / small print', snippet: '<small>$0</small>' },
  { tag: 'code', desc: 'Inline fragment of computer code', snippet: '<code>$0</code>' },
  { tag: 'pre', desc: 'Preformatted text block', snippet: '<pre>$0</pre>' },
  { tag: 'blockquote', desc: 'Extended section quoted from another source', snippet: '<blockquote>$0</blockquote>' },
  { tag: 'hr', desc: 'Thematic break / horizontal rule', snippet: '<hr />' },
  { tag: 'br', desc: 'Line break', snippet: '<br />' },
  { tag: 'video', desc: 'Embedded media video player', snippet: '<video controls width="${1:600}">\n\t<source src="${2:video.mp4}" type="video/mp4">\n</video>' },
  { tag: 'audio', desc: 'Embedded audio player', snippet: '<audio controls>\n\t<source src="${1:audio.mp3}" type="audio/mpeg">\n</audio>' },
  { tag: 'iframe', desc: 'Nested browsing context / iframe', snippet: '<iframe src="${1:https://...}" title="${2:Iframe}"></iframe>' },
  { tag: 'canvas', desc: 'Scriptable 2D/3D bitmap canvas', snippet: '<canvas id="${1:canvas}" width="${2:400}" height="${3:300}"></canvas>' },
];

const HTML_ATTRIBUTES = [
  { attr: 'class', snippet: 'class="${1:}"', desc: 'CSS class names' },
  { attr: 'id', snippet: 'id="${1:}"', desc: 'Unique element identifier' },
  { attr: 'style', snippet: 'style="${1:}"', desc: 'Inline CSS styling' },
  { attr: 'src', snippet: 'src="${1:}"', desc: 'Source URL of resource' },
  { attr: 'href', snippet: 'href="${1:}"', desc: 'Hyperlink target URL' },
  { attr: 'alt', snippet: 'alt="${1:}"', desc: 'Alternative text for accessibility' },
  { attr: 'type', snippet: 'type="${1:text}"', desc: 'Input or button type' },
  { attr: 'placeholder', snippet: 'placeholder="${1:}"', desc: 'Short hint for input field' },
  { attr: 'value', snippet: 'value="${1:}"', desc: 'Current value of element' },
  { attr: 'name', snippet: 'name="${1:}"', desc: 'Name of form control' },
  { attr: 'target', snippet: 'target="_blank"', desc: 'Browsing context for link' },
  { attr: 'rel', snippet: 'rel="noopener noreferrer"', desc: 'Relationship to target URL' },
  { attr: 'disabled', snippet: 'disabled', desc: 'Disables user interaction' },
  { attr: 'required', snippet: 'required', desc: 'Requires input before submitting' },
  { attr: 'onclick', snippet: 'onclick="${1:}"', desc: 'JavaScript click handler' },
];

let isHtmlProviderRegistered = false;

function registerHtmlCompletions(monaco: typeof import('monaco-editor')) {
  if (isHtmlProviderRegistered) return;
  isHtmlProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['<', '/', '!', 'h', 'p', 'd', 's', 'b', 'a', 'i', 'u', 'f', 't', 'l', 'm', 'c'],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const line = model.getLineContent(position.lineNumber);
      const charBeforeWord = word.startColumn > 1 ? line.charAt(word.startColumn - 2) : '';
      const hasOpeningBracket = charBeforeWord === '<';

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: hasOpeningBracket ? word.startColumn - 1 : word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: import('monaco-editor').languages.CompletionItem[] = [];

      // 1. HTML5 Boilerplate (!)
      if (word.word === '!' || word.word === 'html' || line.trim() === '!') {
        suggestions.push({
          label: '!',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>\${1:MSK Web Project}</title>\n</head>\n<body>\n\t$0\n</body>\n</html>`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'HTML5 Starter Boilerplate Document',
          documentation: 'Complete HTML5 standard document template with head and body.',
          range,
        });
      }

      // 2. All HTML Tag completions (e.g. typing "h1", "p", "div", etc.)
      HTML_TAGS_DATA.forEach((item) => {
        suggestions.push({
          label: item.tag,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: item.snippet,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: `<${item.tag}> element`,
          documentation: item.desc,
          range,
        });
      });

      // 3. HTML Attributes (e.g. class, id, style, src, href, onClick)
      const textBeforeCursor = line.substring(0, position.column - 1);
      const lastOpenBracket = textBeforeCursor.lastIndexOf('<');
      const lastCloseBracket = textBeforeCursor.lastIndexOf('>');
      const isInsideTag = lastOpenBracket > lastCloseBracket;

      if (isInsideTag) {
        HTML_ATTRIBUTES.forEach((attr) => {
          suggestions.push({
            label: attr.attr,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: attr.snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: `${attr.attr} attribute`,
            documentation: attr.desc,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          });
        });
      }

      // 4. Auto-closing tag suggestion when typing "</"
      if (textBeforeCursor.endsWith('</')) {
        const textUpToCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const openTags: string[] = [];
        const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?\/?>/g;
        let m;
        while ((m = tagRegex.exec(textUpToCursor)) !== null) {
          const isClosing = m[0].startsWith('</');
          const isSelfClosing = m[0].endsWith('/>') || VOID_TAGS.has(m[1].toLowerCase());
          if (isClosing) {
            if (openTags.length > 0 && openTags[openTags.length - 1].toLowerCase() === m[1].toLowerCase()) {
              openTags.pop();
            }
          } else if (!isSelfClosing) {
            openTags.push(m[1]);
          }
        }
        const lastUnclosed = openTags.pop();
        if (lastUnclosed) {
          suggestions.unshift({
            label: `/${lastUnclosed}>`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `${lastUnclosed}>`,
            detail: `Close </${lastUnclosed}>`,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          });
        }
      }

      return { suggestions };
    },
  });
}

const CSS_PROPERTIES = [
  { prop: 'display: flex', snippet: 'display: flex;', desc: 'Flexbox layout' },
  { prop: 'display: grid', snippet: 'display: grid;', desc: 'Grid layout' },
  { prop: 'justify-content', snippet: 'justify-content: ${1|center,space-between,space-around,flex-start,flex-end|};', desc: 'Main axis alignment' },
  { prop: 'align-items', snippet: 'align-items: ${1|center,flex-start,flex-end,stretch|};', desc: 'Cross axis alignment' },
  { prop: 'flex-direction', snippet: 'flex-direction: ${1|column,row,column-reverse,row-reverse|};', desc: 'Flex container direction' },
  { prop: 'background-color', snippet: 'background-color: ${1:#ffffff};', desc: 'Background color' },
  { prop: 'color', snippet: 'color: ${1:#000000};', desc: 'Text foreground color' },
  { prop: 'font-size', snippet: 'font-size: ${1:16px};', desc: 'Size of font' },
  { prop: 'font-weight', snippet: 'font-weight: ${1|bold,600,500,normal|};', desc: 'Font weight' },
  { prop: 'padding', snippet: 'padding: ${1:1rem};', desc: 'Inner padding space' },
  { prop: 'margin', snippet: 'margin: ${1:0 auto};', desc: 'Outer margin space' },
  { prop: 'border-radius', snippet: 'border-radius: ${1:8px};', desc: 'Corner curvature' },
  { prop: 'border', snippet: 'border: ${1:1px solid #e2e8f0};', desc: 'Border style' },
  { prop: 'box-shadow', snippet: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);', desc: 'Box shadow' },
  { prop: 'width', snippet: 'width: ${1:100%};', desc: 'Element width' },
  { prop: 'height', snippet: 'height: ${1:100%};', desc: 'Element height' },
  { prop: 'gap', snippet: 'gap: ${1:1rem};', desc: 'Gap between items' },
  { prop: 'transition', snippet: 'transition: all ${1:0.3s} ease;', desc: 'CSS transition timing' },
  { prop: 'cursor: pointer', snippet: 'cursor: pointer;', desc: 'Pointer on hover' },
];

let isCssProviderRegistered = false;

function registerCssCompletions(monaco: typeof import('monaco-editor')) {
  if (isCssProviderRegistered) return;
  isCssProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: import('monaco-editor').languages.CompletionItem[] = CSS_PROPERTIES.map((item) => ({
        label: item.prop,
        kind: monaco.languages.CompletionItemKind.Property,
        insertText: item.snippet,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: item.prop,
        documentation: item.desc,
        range,
      }));

      return { suggestions };
    },
  });
}

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: SupportedLanguage;
  settings: PlaygroundSettings;
  onRun?: () => void;
  onSave?: () => void;
  onTogglePanel?: () => void;
  onToggleTerminal?: () => void;
  onToggleExplorer?: () => void;
  onToggleSidebar?: () => void;
  onToggleSearch?: () => void;
  onOpenFile?: () => void;
  onCursorChange?: (pos: CursorPosition) => void;
  onFormat?: () => void;
  readOnly?: boolean;
  onMountEditor?: (editor: editor.IStandaloneCodeEditor) => void;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  settings,
  onRun,
  onSave,
  onTogglePanel,
  onToggleTerminal,
  onToggleExplorer,
  onToggleSidebar,
  onToggleSearch,
  onOpenFile,
  onCursorChange,
  onFormat,
  readOnly = false,
  onMountEditor,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  // Keep callback refs synchronized to prevent stale closures in Monaco commands
  const onRunRef = useRef(onRun);
  const onSaveRef = useRef(onSave);
  const onTogglePanelRef = useRef(onTogglePanel);
  const onToggleTerminalRef = useRef(onToggleTerminal);
  const onToggleExplorerRef = useRef(onToggleExplorer);
  const onToggleSidebarRef = useRef(onToggleSidebar);
  const onToggleSearchRef = useRef(onToggleSearch);
  const onOpenFileRef = useRef(onOpenFile);
  const onFormatRef = useRef(onFormat);

  React.useEffect(() => {
    onRunRef.current = onRun;
    onSaveRef.current = onSave;
    onTogglePanelRef.current = onTogglePanel;
    onToggleTerminalRef.current = onToggleTerminal;
    onToggleExplorerRef.current = onToggleExplorer;
    onToggleSidebarRef.current = onToggleSidebar;
    onToggleSearchRef.current = onToggleSearch;
    onOpenFileRef.current = onOpenFile;
    onFormatRef.current = onFormat;
  });

  // Dynamically apply settings whenever changed in settings modal
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        lineNumbers: settings.lineNumbers,
        tabSize: settings.tabSize,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        minimap: {
          enabled: settings.minimap,
        },
        bracketPairColorization: {
          enabled: settings.bracketPairColorization,
        },
        cursorStyle: settings.cursorStyle,
        cursorBlinking: settings.cursorBlinking,
        autoClosingBrackets: settings.autoClosingBrackets ? 'always' : 'never',
        autoClosingQuotes: settings.autoClosingQuotes ? 'always' : 'never',
        mouseWheelZoom: true,
      });
    }
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(settings.theme);
    }
  }, [settings]);

  const getMonacoLanguage = (lang: SupportedLanguage): string => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'html':
        return 'html';
      case 'javascript':
        return 'javascript';
      case 'typescript':
        return 'typescript';
      case 'css':
        return 'css';
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
      case 'java':
        return 'java';
      case 'sql':
        return 'sql';
      case 'markdown':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor')
  ) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    if (onMountEditor) {
      onMountEditor(editorInstance);
    }

    // Set theme immediately
    monaco.editor.setTheme(settings.theme);

    // Register rich language autocomplete & snippets
    registerPythonCompletions(monaco);
    registerHtmlCompletions(monaco);
    registerCssCompletions(monaco);

    // Auto-Close HTML Tag when '>' is typed (e.g. typing <h1> -> <h1></h1> with cursor inside)
    editorInstance.onDidChangeModelContent((e) => {
      if (e.changes.length === 1 && e.changes[0].text === '>') {
        const change = e.changes[0];
        const model = editorInstance.getModel();
        if (!model) return;

        const langId = model.getLanguageId();
        if (langId !== 'html' && langId !== 'javascript' && langId !== 'typescript') return;

        const line = model.getLineContent(change.range.startLineNumber);
        // Text on the line before '>' was inserted
        const textBefore = line.substring(0, change.range.startColumn - 1);

        // Match opening tag: <tag or <tag attr="val"
        const tagMatch = textBefore.match(/<([a-zA-Z0-9\-]+)(?:\s+[^>]*)?$/);
        if (tagMatch) {
          const rawTag = tagMatch[1];
          const lowerTag = rawTag.toLowerCase();

          // Do not close void tags, closing tags (</tag>), comments (<!--), or self-closing tags (/>)
          if (
            VOID_TAGS.has(lowerTag) ||
            tagMatch[0].startsWith('</') ||
            tagMatch[0].startsWith('<!') ||
            textBefore.trim().endsWith('/')
          ) {
            return;
          }

          // Check if closing tag already exists immediately following cursor
          const textAfter = line.substring(change.range.startColumn);
          if (textAfter.startsWith(`</${rawTag}>`) || textAfter.startsWith(`</${lowerTag}>`)) {
            return;
          }

          const cursorLine = change.range.startLineNumber;
          const cursorCol = change.range.startColumn + 1;

          editorInstance.executeEdits('auto-close-tag', [
            {
              range: new monaco.Range(cursorLine, cursorCol, cursorLine, cursorCol),
              text: `</${rawTag}>`,
              forceMoveMarkers: false,
            },
          ]);

          // Position cursor between opening and closing tags
          editorInstance.setPosition({ lineNumber: cursorLine, column: cursorCol });
        }
      }
    });

    // Track Cursor Line & Column for VS Code status bar
    editorInstance.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });

    // 1. Ctrl+Enter / Cmd+Enter: Auto-save & Run Code (Preserves active selection)
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const selection = editorInstance.getSelection();
      const hasSelection = selection && !selection.isEmpty();
      if (!hasSelection) {
        try {
          editorInstance.getAction('editor.action.formatDocument')?.run();
        } catch {}
      }
      onRunRef.current?.();
    });

    // 2. Ctrl+S / Cmd+S: Format & Save Active File
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const selection = editorInstance.getSelection();
      const hasSelection = selection && !selection.isEmpty();
      if (!hasSelection) {
        try {
          editorInstance.getAction('editor.action.formatDocument')?.run();
        } catch {}
      }
      onSaveRef.current?.();
    });

    // 3. Ctrl+B / Cmd+B: Toggle Primary Side Bar (just like VS Code)
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      onToggleSidebarRef.current?.();
    });

    // 4. Ctrl+` (backtick): Toggle Terminal / Output Panel (just like VS Code)
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote, () => {
      onTogglePanelRef.current?.();
    });

    // 5. Ctrl+Shift+E: Toggle File Explorer
    editorInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyE,
      () => {
        onToggleExplorerRef.current?.();
      }
    );

    // 6. Ctrl+Shift+F: Toggle Search in Files
    editorInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        onToggleSearchRef.current?.();
      }
    );

    // 7. Ctrl+O / Cmd+O: Open Local File from Device
    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, () => {
      onOpenFileRef.current?.();
    });

    // 8. Shift + Alt + F: Format Document / Beautify Code
    editorInstance.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      () => {
        if (onFormatRef.current) {
          onFormatRef.current();
        } else {
          try {
            editorInstance.getAction('editor.action.formatDocument')?.run();
          } catch {}
        }
      }
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <MonacoEditor
        height="100%"
        width="100%"
        language={getMonacoLanguage(language)}
        value={value}
        theme={settings.theme}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          lineNumbers: settings.lineNumbers,
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
          tabSize: settings.tabSize,
          wordWrap: settings.wordWrap ? 'on' : 'off',
          minimap: {
            enabled: settings.minimap,
          },
          bracketPairColorization: {
            enabled: settings.bracketPairColorization,
          },
          cursorStyle: settings.cursorStyle,
          cursorBlinking: settings.cursorBlinking,
          cursorSmoothCaretAnimation: 'on',
          autoClosingBrackets: settings.autoClosingBrackets ? 'always' : 'never',
          autoClosingQuotes: settings.autoClosingQuotes ? 'always' : 'never',
          folding: true,
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          formatOnPaste: true,
          formatOnType: true,
          mouseWheelZoom: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          snippetSuggestions: 'inline',
          wordBasedSuggestions: 'allDocuments',
          suggest: {
            showWords: true,
            showSnippets: true,
            showProperties: true,
            showClasses: true,
            showFunctions: true,
            preview: true,
          },
          autoClosingDelete: 'always',
          autoClosingOvertype: 'always',
          parameterHints: {
            enabled: true,
          },
          padding: { top: 10, bottom: 10 },
          fontLigatures: true,
        }}
      />
    </div>
  );
}

