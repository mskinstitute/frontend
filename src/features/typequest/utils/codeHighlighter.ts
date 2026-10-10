import { CodeLanguage } from '../types';

export type TokenType =
  | 'keyword'
  | 'string'
  | 'function'
  | 'number'
  | 'operator'
  | 'punctuation'
  | 'comment'
  | 'type'
  | 'text';

export interface CodeCharToken {
  char: string;
  type: TokenType;
  color: string;
  line: number;
  col: number;
}

const KEYWORDS_BY_LANG: Record<string, string[]> = {
  javascript: [
    'async', 'await', 'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'try', 'catch', 'throw', 'new', 'class', 'import', 'export', 'default', 'from', 'true', 'false',
    'null', 'undefined', 'typeof', 'instanceof', 'switch', 'case', 'break', 'continue'
  ],
  python: [
    'def', 'return', 'class', 'if', 'elif', 'else', 'for', 'while', 'in', 'is', 'not', 'and', 'or',
    'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'True', 'False', 'None', 'lambda',
    'with', 'yield', 'async', 'await', 'pass'
  ],
  cpp: [
    'int', 'float', 'double', 'char', 'bool', 'void', 'auto', 'const', 'return', 'if', 'else',
    'for', 'while', 'class', 'struct', 'public', 'private', 'protected', 'template', 'typename',
    'namespace', 'using', 'std', 'vector', 'include', 'main', 'true', 'false', 'nullptr'
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'INNER', 'LEFT', 'RIGHT', 'JOIN', 'ON', 'GROUP', 'BY', 'HAVING',
    'ORDER', 'ASC', 'DESC', 'COUNT', 'AVG', 'SUM', 'MIN', 'MAX', 'AS', 'AND', 'OR', 'NOT',
    'LIMIT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'select', 'from', 'where'
  ],
  react: [
    'import', 'export', 'default', 'from', 'const', 'let', 'function', 'return', 'useState',
    'useEffect', 'useCallback', 'useMemo', 'useRef', 'React', 'true', 'false', 'null', 'as'
  ],
  'html-css': [
    'article', 'header', 'footer', 'div', 'span', 'class', 'id', 'h1', 'h2', 'h3', 'p', 'button',
    'type', 'data', 'section', 'nav', 'main', 'style', 'flex', 'grid'
  ],
};

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#569cd6',     // VS Code Blue
  string: '#ce9178',      // VS Code Orange/Brown
  function: '#dcdcaa',    // VS Code Yellow
  number: '#b5cea8',      // VS Code Light Green
  operator: '#d4d4d4',    // Neutral
  punctuation: '#808080', // Grey
  comment: '#6a9955',     // Green comment
  type: '#4ec9b0',        // Teal
  text: '#d4d4d4',        // Default
};

export function tokenizeCode(code: string, language: CodeLanguage): CodeCharToken[] {
  const result: CodeCharToken[] = [];
  const lines = code.split('\n');
  const keywords = KEYWORDS_BY_LANG[language] || KEYWORDS_BY_LANG['javascript'];

  let lineNum = 1;

  for (let l = 0; l < lines.length; l++) {
    const lineStr = lines[l];
    let i = 0;

    while (i < lineStr.length) {
      const char = lineStr[i];

      // 1. Comments
      if (
        (char === '#' && language === 'python') ||
        (char === '/' && lineStr[i + 1] === '/') ||
        (char === '-' && lineStr[i + 1] === '-')
      ) {
        // Rest of line is comment
        while (i < lineStr.length) {
          result.push({
            char: lineStr[i],
            type: 'comment',
            color: TOKEN_COLORS.comment,
            line: lineNum,
            col: i,
          });
          i++;
        }
        break;
      }

      // 2. String literal (single or double quote or backtick)
      if (char === '"' || char === "'" || char === '`') {
        const quote = char;
        result.push({
          char: quote,
          type: 'string',
          color: TOKEN_COLORS.string,
          line: lineNum,
          col: i,
        });
        i++;

        while (i < lineStr.length) {
          const sChar = lineStr[i];
          result.push({
            char: sChar,
            type: 'string',
            color: TOKEN_COLORS.string,
            line: lineNum,
            col: i,
          });
          if (sChar === quote && lineStr[i - 1] !== '\\') {
            i++;
            break;
          }
          i++;
        }
        continue;
      }

      // 3. Numbers
      if (/[0-9]/.test(char) && (i === 0 || /[\s\(\[\{,\:\=\+\-\*\/]/.test(lineStr[i - 1]))) {
        let numStr = '';
        const startIdx = i;
        while (i < lineStr.length && /[0-9\.]/.test(lineStr[i])) {
          numStr += lineStr[i];
          i++;
        }
        for (let k = 0; k < numStr.length; k++) {
          result.push({
            char: numStr[k],
            type: 'number',
            color: TOKEN_COLORS.number,
            line: lineNum,
            col: startIdx + k,
          });
        }
        continue;
      }

      // 4. Identifiers & Keywords
      if (/[a-zA-Z_\$]/.test(char)) {
        let ident = '';
        const startIdx = i;
        while (i < lineStr.length && /[a-zA-Z0-9_\$]/.test(lineStr[i])) {
          ident += lineStr[i];
          i++;
        }

        let type: TokenType = 'text';
        if (keywords.includes(ident)) {
          type = 'keyword';
        } else if (i < lineStr.length && lineStr[i] === '(') {
          type = 'function';
        } else if (/^[A-Z][a-zA-Z0-9]*$/.test(ident)) {
          type = 'type';
        }

        const color = TOKEN_COLORS[type];
        for (let k = 0; k < ident.length; k++) {
          result.push({
            char: ident[k],
            type,
            color,
            line: lineNum,
            col: startIdx + k,
          });
        }
        continue;
      }

      // 5. Punctuation and Operators
      let type: TokenType = 'text';
      let color = TOKEN_COLORS.text;

      if (['(', ')', '[', ']', '{', '}', ';', ',', ':'].includes(char)) {
        type = 'punctuation';
        color = TOKEN_COLORS.punctuation;
      } else if (['=', '+', '-', '*', '/', '<', '>', '!', '&', '|', '^', '%', '?'].includes(char)) {
        type = 'operator';
        color = TOKEN_COLORS.operator;
      }

      result.push({
        char,
        type,
        color,
        line: lineNum,
        col: i,
      });
      i++;
    }

    // Add newline character if not last line
    if (l < lines.length - 1) {
      result.push({
        char: '\n',
        type: 'text',
        color: '#475569',
        line: lineNum,
        col: lineStr.length,
      });
    }

    lineNum++;
  }

  return result;
}
