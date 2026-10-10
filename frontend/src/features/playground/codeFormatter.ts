'use client';

import { SupportedLanguage } from './types';

/**
 * Common SQL keywords to uppercase during formatting
 */
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'DATABASE', 'SCHEMA', 'DROP', 'ALTER', 'ADD', 'COLUMN',
  'USE', 'SHOW', 'DATABASES', 'TABLES', 'COLUMNS', 'DESCRIBE', 'DESC',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS', 'ON',
  'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT', 'OFFSET',
  'UNION', 'ALL', 'DISTINCT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'AUTO_INCREMENT', 'AUTOINCREMENT',
  'DEFAULT', 'UNIQUE', 'CHECK', 'CONSTRAINT', 'INDEX',
  'INT', 'INTEGER', 'VARCHAR', 'CHAR', 'TEXT', 'FLOAT', 'DOUBLE', 'DECIMAL',
  'BOOLEAN', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'BLOB'
];

const SQL_KEYWORDS_REGEX = new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi');

/**
 * Formats SQL code with consistent uppercase keywords and indentation
 */
export function formatSqlCode(code: string, tabSize: number = 2): string {
  const indent = ' '.repeat(tabSize);
  const lines = code.split('\n');
  const formattedLines: string[] = [];
  let indentLevel = 0;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    // Preserve comments
    if (trimmed.startsWith('--') || trimmed.startsWith('#') || trimmed.startsWith('/*')) {
      formattedLines.push(' '.repeat(Math.max(0, indentLevel * tabSize)) + trimmed);
      continue;
    }

    // Uppercase standard keywords outside quoted strings
    const upperLine = trimmed.replace(/'[^']*'|"[^"]*"|`[^`]*`|\b[A-Za-z_]+\b/g, (match) => {
      if (match.startsWith("'") || match.startsWith('"') || match.startsWith('`')) {
        return match;
      }
      return SQL_KEYWORDS_REGEX.test(match) ? match.toUpperCase() : match;
    });

    if (upperLine.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formattedLines.push(' '.repeat(Math.max(0, indentLevel * tabSize)) + upperLine);

    if (upperLine.endsWith('(') || upperLine.includes('CREATE TABLE') && upperLine.endsWith('(')) {
      indentLevel++;
    }
  }

  return formattedLines.join('\n');
}

/**
 * Formats C, C++, and Java code with clean brace placement and indentation
 */
export function formatCStyleCode(code: string, tabSize: number = 4): string {
  const indentStr = ' '.repeat(tabSize);
  const lines = code.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) {
      formatted.push('');
      continue;
    }

    // Directives stay at column 0
    if (line.startsWith('#')) {
      formatted.push(line);
      continue;
    }

    // Access specifiers (public:, private:, protected:) in C++
    if (/^(public|private|protected)\s*:/.test(line)) {
      formatted.push(' '.repeat(Math.max(0, (indentLevel - 1) * tabSize)) + line);
      continue;
    }

    // Decrease indent if line begins with closing brace
    const leadingCloseBraces = (line.match(/^\}+/)?.[0] || '').length;
    if (leadingCloseBraces > 0) {
      indentLevel = Math.max(0, indentLevel - leadingCloseBraces);
    }

    // Normalizing spaces around operators and control structures
    line = line
      .replace(/\b(for|if|while|switch|catch)\s*\(/g, '$1 (')
      .replace(/\)\s*\{/g, ') {')
      .replace(/\s*;\s*$/g, ';');

    formatted.push(' '.repeat(Math.max(0, indentLevel * tabSize)) + line);

    // Calculate net brace change after leading closes were accounted for
    const remainingLine = line.slice(leadingCloseBraces);
    const opens = (remainingLine.match(/\{/g) || []).length;
    const closes = (remainingLine.match(/\}/g) || []).length;
    indentLevel = Math.max(0, indentLevel + (opens - closes));
  }

  return formatted.join('\n');
}

/**
 * Formats Python code ensuring clean 4-space block indentation
 */
export function formatPythonCode(code: string): string {
  const lines = code.split('\n');
  const formatted: string[] = [];
  let currentIndent = 0;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Dedent for return, pass, break, continue, elif, else, except, finally
    if (/^(return|pass|break|continue|elif|else|except|finally)\b/.test(trimmed) && currentIndent > 0) {
      // Check if previous line didn't end with colon
      const prevLine = formatted[formatted.length - 1]?.trim() || '';
      if (!prevLine.endsWith(':')) {
        currentIndent = Math.max(0, currentIndent - 4);
      }
    }

    formatted.push(' '.repeat(currentIndent) + trimmed);

    // If line ends with a colon, indent the next block
    if (trimmed.endsWith(':')) {
      currentIndent += 4;
    }
  }

  return formatted.join('\n');
}

/**
 * Formats HTML / XML with clean tag indentation
 */
export function formatHtmlCode(code: string, tabSize: number = 2): string {
  const indentStr = ' '.repeat(tabSize);
  const tokens = code.replace(/>\s*</g, '><').replace(/</g, '~::~<').split('~::~');
  let indent = 0;
  const formatted: string[] = [];
  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;

    // Closing tag: </tag>
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted.push(indentStr.repeat(indent) + token);
      continue;
    }

    // Comment <!-- ... --> or DOCTYPE <!DOCTYPE ...>
    if (token.startsWith('<!')) {
      formatted.push(indentStr.repeat(indent) + token);
      continue;
    }

    // Single tag with close: <tag>...</tag>
    if (/^<([a-zA-Z0-9\-]+)[^>]*>.*<\/\1>$/.test(token)) {
      formatted.push(indentStr.repeat(indent) + token);
      continue;
    }

    // Opening tag: <tag> or self-closing <tag />
    const tagMatch = token.match(/^<([a-zA-Z0-9\-]+)/);
    if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);
      formatted.push(indentStr.repeat(indent) + token);
      if (!isSelfClosing) {
        indent++;
      }
      continue;
    }

    // Plain text content
    formatted.push(indentStr.repeat(indent) + token);
  }

  return formatted.join('\n');
}

/**
 * Master Code Formatter dispatcher
 */
export function formatCode(
  code: string,
  language: SupportedLanguage,
  tabSize: number = 4
): string {
  if (!code || !code.trim()) return code;

  try {
    switch (language) {
      case 'sql':
        return formatSqlCode(code, tabSize);
      case 'c':
      case 'cpp':
      case 'java':
      case 'javascript':
      case 'typescript':
      case 'css':
        return formatCStyleCode(code, tabSize);
      case 'python':
        return formatPythonCode(code);
      case 'html':
        return formatHtmlCode(code, tabSize);
      default:
        // Try JSON if applicable
        try {
          return JSON.stringify(JSON.parse(code), null, tabSize);
        } catch {
          return code.trimEnd();
        }
    }
  } catch (err) {
    console.warn('Formatting fallback:', err);
    return code;
  }
}
