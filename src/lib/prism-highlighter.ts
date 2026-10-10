import Prism from 'prismjs';

// Import essential languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup'; // html, xml
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';

// Normalize language names to Prism grammar keys
export function normalizeLanguage(lang: string): string {
  const l = (lang || '').toLowerCase().trim();
  switch (l) {
    case 'py':
    case 'python':
      return 'python';
    case 'c':
      return 'c';
    case 'cpp':
    case 'c++':
      return 'cpp';
    case 'java':
      return 'java';
    case 'js':
    case 'javascript':
      return 'javascript';
    case 'ts':
    case 'typescript':
      return 'typescript';
    case 'jsx':
      return 'jsx';
    case 'tsx':
      return 'tsx';
    case 'html':
    case 'xml':
      return 'markup';
    case 'css':
      return 'css';
    case 'sh':
    case 'bash':
    case 'shell':
    case 'zsh':
      return 'bash';
    case 'sql':
      return 'sql';
    case 'json':
      return 'json';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return l;
  }
}

export function highlightCode(code: string, language: string): string {
  const normLang = normalizeLanguage(language);
  const grammar = Prism.languages[normLang];

  if (!grammar) {
    // Fallback: safe HTML escaping for plain text/output
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  try {
    return Prism.highlight(code, grammar, normLang);
  } catch {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export function getLanguageDisplayName(lang: string): string {
  const l = (lang || '').toLowerCase().trim();
  switch (l) {
    case 'c':
      return 'C';
    case 'cpp':
    case 'c++':
      return 'C++';
    case 'java':
      return 'Java';
    case 'python':
    case 'py':
      return 'Python';
    case 'javascript':
    case 'js':
      return 'JavaScript';
    case 'typescript':
    case 'ts':
      return 'TypeScript';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'bash':
    case 'sh':
    case 'shell':
      return 'Bash / Terminal';
    case 'sql':
      return 'SQL';
    case 'json':
      return 'JSON';
    case 'text':
      return 'Output';
    case 'md':
    case 'markdown':
      return 'Markdown';
    default:
      return lang ? lang.toUpperCase() : 'Code';
  }
}

export interface CodeToken {
  text: string;
  type?: string;
}

export type TokenizedLine = CodeToken[];

function flattenTokens(
  tokens: (string | Prism.Token)[],
  parentType?: string
): { text: string; type?: string }[] {
  const result: { text: string; type?: string }[] = [];
  for (const token of tokens) {
    if (typeof token === 'string') {
      result.push({ text: token, type: parentType });
    } else if (typeof token.content === 'string') {
      const isAttrEquals =
        token.type === 'punctuation' &&
        (token.content === '=' || (token as { alias?: string }).alias === 'attr-equals');
      const isStringQuote =
        token.type === 'punctuation' &&
        (token.content === '"' || token.content === "'" || token.content === '`') &&
        (parentType === 'attr-value' || parentType === 'string');

      let resolvedType = token.type || parentType;
      if (isAttrEquals) {
        resolvedType = 'punctuation';
      } else if (isStringQuote) {
        resolvedType = parentType;
      }

      result.push({ text: token.content, type: resolvedType });
    } else if (Array.isArray(token.content)) {
      result.push(...flattenTokens(token.content, token.type || parentType));
    } else if (typeof token.content === 'object' && token.content !== null) {
      result.push(...flattenTokens([token.content as Prism.Token], token.type || parentType));
    }
  }
  return result;
}

function splitTokensIntoLines(tokens: { text: string; type?: string }[]): TokenizedLine[] {
  const lines: TokenizedLine[] = [[]];
  for (const tok of tokens) {
    const parts = tok.text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        lines.push([]);
      }
      if (parts[i].length > 0) {
        lines[lines.length - 1].push({
          text: parts[i],
          type: tok.type,
        });
      }
    }
  }
  return lines;
}

/**
 * Tokenizes arbitrary code into per-line token arrays for exact syntax-highlighted rendering
 */
export function tokenizeCodeToLines(code: string, language: string): TokenizedLine[] {
  const normLang = normalizeLanguage(language);
  if (!code) return [[]];

  // Plain text / output should not be treated as code
  if (normLang === 'text' || normLang === 'output' || normLang === 'plain') {
    return code.split(/\r?\n/).map((line) => (line.length > 0 ? [{ text: line }] : []));
  }

  const grammar = Prism.languages[normLang] || Prism.languages.markup || Prism.languages.javascript || Prism.languages.clike;

  if (!grammar) {
    return code.split(/\r?\n/).map((line) => (line.length > 0 ? [{ text: line }] : []));
  }

  try {
    const rawTokens = Prism.tokenize(code, grammar);
    const flatTokens = flattenTokens(rawTokens);
    return splitTokensIntoLines(flatTokens);
  } catch (err) {
    console.warn('Prism tokenize error:', err);
    return code.split(/\r?\n/).map((line) => (line.length > 0 ? [{ text: line }] : []));
  }
}

/**
 * Authentic VS Code Dark+ / Dark Modern syntax color token mapper
 */
export function getVSCodeTokenColor(type?: string, text?: string, lang?: string): string {
  const trimmed = (text || '').trim();
  const normalizedLang = (lang || '').toLowerCase().trim();

  // 1. Comments & documentation
  if (type === 'comment' || type === 'prolog' || type === 'doctype' || type === 'cdata') {
    return '#6a9955'; // VS Code Green (italic)
  }

  // 2. Strings, Character literals & Attribute values
  if (type === 'string' || type === 'char' || type === 'attr-value' || type === 'template-string') {
    return '#ce9178'; // VS Code Warm Salmon / Orange
  }

  // 3. Numbers & Units
  if (type === 'number' || type === 'unit') {
    return '#b5cea8'; // VS Code Sage Green
  }

  // 4. HTML / Markup tags, angle brackets & attribute names
  if (normalizedLang === 'html' || normalizedLang === 'markup' || normalizedLang === 'xml') {
    if (type === 'tag') {
      return '#569cd6'; // VS Code Blue for tag names (h1, p, div, button)
    }
    if (type === 'attr-name') {
      return '#9cdcfe'; // VS Code Light Blue for attributes (class, id, src, href)
    }
    if (type === 'punctuation') {
      if (/^[<>\/]+$/.test(trimmed)) {
        return '#808080'; // VS Code Grey for < > </ />
      }
      return '#d4d4d4';
    }
  }

  // 5. CSS Selectors & Properties
  if (normalizedLang === 'css') {
    if (type === 'selector') return '#d7ba7d'; // VS Code Gold
    if (type === 'property') return '#9cdcfe'; // VS Code Light Blue
    if (type === 'function') return '#dcdcaa'; // VS Code Yellow
  }

  // 6. Keywords (Control flow purple vs Declaration/Type blue)
  if (type === 'keyword' || type === 'atrule' || type === 'important') {
    if (
      /^(if|else|elif|for|while|return|switch|case|break|continue|try|catch|finally|throw|import|export|from|in|is|not|and|or|as|with|yield|default)$/.test(
        trimmed
      )
    ) {
      return '#c586c0'; // VS Code Control Flow Purple
    }
    return '#569cd6'; // VS Code Declaration / Type Blue (const, let, var, function, def, class)
  }

  if (type === 'boolean') {
    return '#569cd6'; // VS Code Blue for true/false/None
  }

  // 7. Functions & Methods
  if (type === 'function' || type === 'function-variable' || type === 'builtin') {
    return '#dcdcaa'; // VS Code Function Yellow
  }

  // 8. Class names, Interfaces, Types
  if (type === 'class-name') {
    return '#4ec9b0'; // VS Code Teal
  }

  // 9. Variables & Properties
  if (type === 'variable' || type === 'property' || type === 'interpolation') {
    return '#9cdcfe'; // VS Code Light Blue
  }

  // 10. Operators & Punctuation
  if (type === 'operator') {
    return '#d4d4d4';
  }
  if (type === 'punctuation') {
    return '#d4d4d4';
  }

  // Default VS Code editor text foreground
  return '#d4d4d4';
}

/**
 * Provides One Dark / legacy syntax colors for backwards compatibility
 */
export function getTokenColor(type?: string, text?: string): string {
  const trimmed = (text || '').trim();

  // Known built-in functions & standard objects
  if (
    /^(print|len|range|enumerate|input|str|int|float|bool|list|dict|set|tuple|type|open|sum|min|max|abs|round|zip|map|filter|super|isinstance|issubclass)$/.test(
      trimmed
    )
  ) {
    return '#e5c07b';
  }
  if (
    /^(console|log|warn|error|Math|JSON|Promise|Array|Object|String|Number|Boolean|window|document)$/.test(
      trimmed
    )
  ) {
    return '#e5c07b';
  }

  if (!type) return '#e6edf3';

  switch (type) {
    case 'comment':
    case 'prolog':
    case 'doctype':
    case 'cdata':
      return '#768390';

    case 'string':
    case 'char':
    case 'attr-value':
      return '#98c379';

    case 'keyword':
    case 'boolean':
    case 'important':
      return '#c678dd';

    case 'function':
    case 'function-variable':
    case 'builtin':
      return '#e5c07b';

    case 'number':
    case 'constant':
      return '#d19a66';

    case 'operator':
      return '#56b6c2';

    case 'punctuation':
      return '#abb2bf';

    case 'class-name':
      return '#e5c07b';

    case 'tag':
      return '#569cd6';

    case 'attr-name':
    case 'property':
      return '#9cdcfe';

    case 'variable':
    case 'interpolation':
      return '#e06c75';

    case 'regex':
      return '#98c379';

    case 'url':
    case 'link':
      return '#61afef';

    default:
      return '#e6edf3';
  }
}

