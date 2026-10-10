export const COMMON_WORDS_100: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
];

export const TECH_WORDS: string[] = [
  'function', 'variable', 'constant', 'component', 'interface', 'compiler', 'algorithm',
  'database', 'terminal', 'promise', 'callback', 'framework', 'prototype', 'recursion',
  'asynchronous', 'iteration', 'package', 'repository', 'middleware', 'endpoint',
  'deployment', 'container', 'responsive', 'parameter', 'argument', 'structure',
  'boolean', 'string', 'integer', 'pointer', 'reference', 'exception', 'inheritance',
  'polymorphism', 'encryption', 'token', 'session', 'cookie', 'payload', 'schema'
];

export const INSPIRING_QUOTES: { text: string; author: string }[] = [
  {
    text: "Simplicity is prerequisite for reliability. Make it work, make it right, make it fast.",
    author: "Edsger W. Dijkstra",
  },
  {
    text: "Talk is cheap. Show me the code. First solve the problem, then write the clean code.",
    author: "Linus Torvalds",
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
  },
  {
    text: "The function of good software is to make the complex appear to be simple, predictable, and robust.",
    author: "Grady Booch",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world. Practice every day.",
    author: "Nelson Mandela",
  },
  {
    text: "Programming isn't about what you know; it's about what you can figure out through persistence and curiosity.",
    author: "Chris Pine",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out without losing enthusiasm.",
    author: "Robert Collier",
  },
];

export function getRandomWords(count: number = 30): string {
  const pool = [...COMMON_WORDS_100, ...TECH_WORDS];
  const shuffled: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    shuffled.push(pool[randomIndex]);
  }
  return shuffled.join(' ');
}

export function getRandomQuote(): string {
  const item = INSPIRING_QUOTES[Math.floor(Math.random() * INSPIRING_QUOTES.length)];
  return item.text;
}
