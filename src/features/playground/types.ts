export type SupportedLanguage =
  | 'python'
  | 'html'
  | 'javascript'
  | 'typescript'
  | 'css'
  | 'cpp'
  | 'c'
  | 'java'
  | 'sql'
  | 'markdown';

export interface CodeTemplate {
  id: string;
  title: string;
  language: SupportedLanguage;
  description: string;
  code: string;
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'success';
  content: string;
  timestamp: string;
}

export type EditorTheme = 'vs-dark' | 'light' | 'hc-black';
export type PanelPosition = 'right' | 'bottom';

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface PlaygroundSettings {
  theme: EditorTheme;
  fontSize: number;
  fontFamily: string;
  tabSize: 2 | 4;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  cursorStyle: 'line' | 'block' | 'underline';
  cursorBlinking: 'smooth' | 'blink' | 'expand' | 'solid';
  bracketPairColorization: boolean;
  autoClosingBrackets: boolean;
  autoClosingQuotes: boolean;
  panelPosition: PanelPosition;
  focusMode: boolean;
}

export const DEFAULT_PLAYGROUND_SETTINGS: PlaygroundSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, Menlo, Monaco, monospace",
  tabSize: 4,
  wordWrap: true,
  minimap: false,
  lineNumbers: 'on',
  cursorStyle: 'line',
  cursorBlinking: 'smooth',
  bracketPairColorization: true,
  autoClosingBrackets: true,
  autoClosingQuotes: true,
  panelPosition: 'right',
  focusMode: false,
};

export type SidebarView = 'explorer' | 'search' | 'challenges' | 'examples' | null;

export interface PlaygroundFolder {
  id: string;
  name: string;
  parentId?: string | null;
  isOpen?: boolean;
}

export interface PlaygroundFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  content: string;
  isRemovable: boolean;
  folderId?: string | null;
  updatedAt?: number;
}

export interface SearchMatch {
  fileId: string;
  fileName: string;
  lineNumber: number;
  lineContent: string;
  matchIndex: number;
}

export interface SqlQueryResult {
  columns: string[];
  values: (string | number | boolean | null)[][];
  affectedRows?: number;
  executionTimeMs?: number;
  error?: string;
  query?: string;
  isSelected?: boolean;
  message?: string;
  database?: string;
}

export interface ChallengeTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodeChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: SupportedLanguage;
  category: string;
  description: string;
  starterCode: string;
  testCases: ChallengeTestCase[];
  hints: string[];
}

