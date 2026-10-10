// Utility to parse frontmatter and extract headings for tutorial notes

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseFrontmatter<T = Record<string, any>>(rawContent: string): {
  frontmatter: T;
  content: string;
} {
  const match = rawContent.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {} as T, content: rawContent };
  }

  const yamlStr = match[1];
  const content = match[2];
  const frontmatter: Record<string, any> = {};

  let currentKey = '';
  let inList = false;

  yamlStr.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && inList && currentKey) {
      const val = trimmed.replace(/^- \s*/, '').replace(/^['"]|['"]$/g, '');
      frontmatter[currentKey].push(val);
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let val = line.slice(colonIndex + 1).trim();

      if (!val) {
        // Start of a list or nested object
        currentKey = key;
        frontmatter[key] = [];
        inList = true;
      } else {
        inList = false;
        currentKey = key;
        val = val.replace(/^['"]|['"]$/g, '');
        if (val === 'true') frontmatter[key] = true;
        else if (val === 'false') frontmatter[key] = false;
        else if (!isNaN(Number(val)) && val !== '') frontmatter[key] = Number(val);
        else frontmatter[key] = val;
      }
    }
  });

  return { frontmatter: frontmatter as T, content };
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText.replace(/\*\*/g, '').replace(/`/g, '');
    const id = slugify(cleanText) || `heading-${headings.length}`;

    // Filter out top-level lesson title if duplicate or metadata
    if (cleanText.toLowerCase() === 'related lessons' || cleanText.toLowerCase() === 'next lesson') {
      continue;
    }

    headings.push({
      id,
      text: cleanText,
      level,
    });
  }

  return headings;
}

export function extractQuizQuestions(markdown: string): {
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
}[] {
  // Support #, ##, or ### headers for quiz section (with optional emojis or prefixes like Knowledge Check)
  const mcqSectionMatch = markdown.match(/#{1,3}\s+(?:[^\w\r\n]*)(?:Multiple Choice Questions|MCQs|Practice Quiz|Quiz|Knowledge Check)[\s\S]*?(?=(?:\r?\n#{1,2}\s+[A-Za-z])|$)/i);
  if (!mcqSectionMatch) return [];

  const sectionText = mcqSectionMatch[0];
  // Split on question headers: ### Q1: or ### 1. or ### Q1. or ### Question 1: (also supporting ##)
  const questionBlocks = sectionText.split(/#{2,3}\s+(?:Q\d+[:.]?|\d+\.|Question\s+\d+[:.]?)\s*/i);
  const quizList: {
    question: string;
    options: { label: string; text: string }[];
    correctAnswer: string;
    explanation?: string;
  }[] = [];

  // First block is the section preamble before the first question
  for (let i = 1; i < questionBlocks.length; i++) {
    const block = questionBlocks[i];
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 3) continue;

    const questionText = lines[0].replace(/\*\*/g, '');
    const options: { label: string; text: string }[] = [];
    let correctAnswer = 'A';
    let explanation = '';

    lines.forEach((l) => {
      // Matches '- A) ...', 'A. ...', 'A) ...', '- A. ...'
      const optMatch = l.match(/^(?:-\s+)?([A-D])[\.\)]\s+(.*)$/i);
      if (optMatch) {
        options.push({ label: optMatch[1].toUpperCase(), text: optMatch[2] });
      }

      const ansMatch = l.match(/\*\*Answer:\*\*\s*([A-D])/i);
      if (ansMatch) {
        correctAnswer = ansMatch[1].toUpperCase();
      }

      const expMatch = l.match(/\*\*Explanation:\*\*\s*(.*)$/i);
      if (expMatch) {
        explanation = expMatch[1];
      }
    });

    if (options.length >= 2) {
      quizList.push({
        question: questionText,
        options,
        correctAnswer,
        explanation,
      });
    }
  }

  return quizList;
}
