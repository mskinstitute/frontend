const WORDS_BY_LETTER: Record<string, string[]> = {
  p: ['power', 'point', 'paper', 'pixel', 'party', 'print', 'puppy', 'speed', 'pause', 'pure', 'prompt'],
  q: ['quick', 'quiet', 'query', 'quote', 'equal', 'queue', 'equip', 'quite', 'quest'],
  z: ['zero', 'zeal', 'zinc', 'zone', 'prize', 'puzzle', 'pizza', 'blaze', 'gaze', 'buzz', 'fuzzy'],
  x: ['extra', 'exact', 'index', 'pixel', 'relax', 'fixed', 'toxic', 'mixed', 'matrix', 'complex'],
  b: ['batch', 'build', 'branch', 'bloom', 'brain', 'bring', 'block', 'blade', 'bright', 'bubble'],
  v: ['valve', 'view', 'vapor', 'video', 'valid', 'vivid', 'vocal', 'value', 'novel', 'every'],
  c: ['click', 'clean', 'card', 'scale', 'clock', 'cycle', 'class', 'climb', 'codec', 'codec'],
  m: ['music', 'match', 'moral', 'metal', 'magic', 'model', 'merge', 'macro', 'month'],
  y: ['yield', 'youth', 'yours', 'young', 'daily', 'style', 'layer', 'entry', 'heavy'],
  k: ['knife', 'karma', 'koala', 'knock', 'track', 'brick', 'clock', 'smoke', 'spark'],
  ';': ['code;', 'data;', 'val;', 'num;', 'obj;', 'item;', 'res;', 'user;'],
  ',': ['apple,', 'banana,', 'grape,', 'orange,', 'mango,', 'fruit,'],
  '.': ['start.', 'ready.', 'done.', 'finish.', 'build.', 'deploy.'],
};

export function generateWeakKeyDrill(
  weakKeys: (string | { key: string })[]
): { title: string; text: string; focusKeys: string[] } {
  const extractedKeys = weakKeys.map((item) => (typeof item === 'string' ? item : item.key));
  // If fewer than 2 weak keys, supply tricky finger reaches
  const keysToTarget =
    extractedKeys.length >= 2
      ? extractedKeys.slice(0, 4)
      : ['p', 'z', 'b', 'q'];

  const cleanedKeys = keysToTarget.map((k) => k.toLowerCase());

  // 1. Generate target bigram patterns
  const bigrams: string[] = [];
  for (let i = 0; i < cleanedKeys.length; i++) {
    const k1 = cleanedKeys[i];
    const k2 = cleanedKeys[(i + 1) % cleanedKeys.length];
    bigrams.push(`${k1}${k2}${k1}`, `${k2}${k1}${k2}`, `${k1}${k1}${k2}${k2}`);
  }

  // 2. Collect words that target these exact keys
  const targetWords: string[] = [];
  cleanedKeys.forEach((k) => {
    const pool = WORDS_BY_LETTER[k] || [`${k}a${k}`, `${k}e${k}`, `${k}o${k}`];
    // Pick 3 random words from pool
    for (let count = 0; count < 3; count++) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (!targetWords.includes(w)) targetWords.push(w);
    }
  });

  // 3. Assemble smooth progressive drill text
  const parts = [
    bigrams.join(' '),
    targetWords.slice(0, 5).join(' '),
    bigrams.reverse().join(' '),
    targetWords.slice(5).join(' '),
    `master your finger dexterity on ${cleanedKeys.map((k) => `'${k}'`).join(' and ')} keys with steady rhythm and zero rush.`
  ];

  return {
    title: `Custom Weak-Key Drill (${cleanedKeys.map((k) => k.toUpperCase()).join(', ')})`,
    text: parts.filter(Boolean).join(' '),
    focusKeys: cleanedKeys,
  };
}
