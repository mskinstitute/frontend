# Advanced Pattern Matching & Replacement in Modern JavaScript

Beyond basic string search, modern JavaScript provides powerful pattern transformation tools. Mastering **Replacer Functions**, the modern **`replaceAll()`** API, and sticky matching enables complex text parsing, syntax highlighters, templating engines, and tokenizers.

---

## 1. String.prototype.replaceAll() (ES2021)

Historically, replacing all occurrences of a substring required global regular expressions:

```javascript
// LEGACY WORKAROUND:
const str = "apple.orange.banana";
str.replace(/\./g, '/'); // Requires regex with /g!

// MODERN ES2021 STANDARD:
const clean = str.replaceAll('.', '/');
console.log(clean); // "apple/orange/banana"
```

> **Important Rule:** If you pass a regular expression to `replaceAll()`, it **must include the global `g` flag**, otherwise it throws a `TypeError: String.prototype.replaceAll called with a non-global RegExp`.

---

## 2. Advanced Replacer Callbacks in replace()

Instead of passing a static string replacement, pass a **callback function** that computes dynamic replacements per match:

```javascript
// Syntax: (match, p1, p2, ..., offset, string, groups) => replacementString
```

### Example: Dynamic Template Engine
```javascript
const template = "Hello {{user.name}}, your account balance is {{account.balance}}.";
const context = {
  user: { name: "Elena" },
  account: { balance: "$450.00" }
};

function renderTemplate(tpl, data) {
  return tpl.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, (fullMatch, keyPath) => {
    // Resolve nested object path (e.g. "user.name")
    return keyPath.split('.').reduce((acc, part) => acc?.[part], data) ?? '';
  });
}

console.log(renderTemplate(template, context));
// "Hello Elena, your account balance is $450.00."
```

---

## 3. Syntax Highlighting with Replacer Offsets

Replacer functions receive the `offset` (the index where the match was found in the source string):

```javascript
function highlightKeywords(code) {
  const keywords = /\b(const|let|var|function|return|class)\b/g;

  return code.replace(keywords, (match, keyword, offset) => {
    return `<span class="token-keyword" data-offset="${offset}">${keyword}</span>`;
  });
}

const html = highlightKeywords('const x = 10; return x;');
console.log(html);
// <span class="token-keyword" data-offset="0">const</span> x = 10; <span class="token-keyword" data-offset="14">return</span> x;
```

---

## 4. The Sticky Flag (`y`) for High-Speed Tokenizers

The `y` (sticky) flag matches **strictly starting at `regex.lastIndex`**, without scanning forward in the string. This makes it ideal for building lexical tokenizers (compilers, Markdown parsers):

```javascript
const tokenizerRegex = /\s*(\d+|\+|\*)\s*/y;
const codeInput = "42 + 10 * 5";

tokenizerRegex.lastIndex = 0;
const tokens = [];

while (tokenizerRegex.lastIndex < codeInput.length) {
  const match = tokenizerRegex.exec(codeInput);
  if (!match) throw new SyntaxError(`Unexpected token at ${tokenizerRegex.lastIndex}`);
  tokens.push(match[1]);
}

console.log('Parsed Tokens:', tokens); // ['42', '+', '10', '*', '5']
```

---

## Practice Quiz

### Q1: What error occurs if you pass a non-global RegExp (without the g flag) to String.prototype.replaceAll()?
- A) It fails silently
- B) A TypeError is thrown
- C) It converts the regex into a string
- D) It replaces only the first occurrence
**Answer:** B
**Explanation:** The specification strictly requires that any `RegExp` passed to `replaceAll()` must possess the global `/g` flag; otherwise, it raises a `TypeError`.

### Q2: What parameters does a replacer callback in String.prototype.replace() receive?
- A) Only the matched string
- B) fullMatch, captureGroup1, captureGroup2, ..., offset, sourceString, groups
- C) An array of numbers
- D) A DOM Element
**Answer:** B
**Explanation:** The replacer receives the full matched substring, each captured group, the character offset of the match, the full source string, and any named groups object.

### Q3: How does the sticky flag (/y) differ from the global flag (/g)?
- A) The y flag matches only at regex.lastIndex without searching ahead in the string, whereas g scans forward to find subsequent matches
- B) The y flag runs in WebAssembly
- C) The y flag is deprecated
- D) There is no difference
**Answer:** A
**Explanation:** The `y` flag matches strictly at the exact index specified by `lastIndex`, failing immediately if a match does not start at that location.

### Q4: Why are sticky regular expressions (/y) preferred when building parsers and compilers?
- A) They format JSON automatically
- B) They process text sequentially token-by-token from current offsets without wasting CPU scanning the entire remainder of the file
- C) They disable garbage collection
- D) They run on the GPU
**Answer:** B
**Explanation:** In lexers and compilers, tokens must match sequentially at the current parser position; the sticky flag enforces this behavior with high efficiency.

### Q5: In tpl.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] ?? ''), what does the key argument contain?
- A) The entire {{name}} string
- B) The captured identifier inside the curly braces (e.g. 'name')
- C) The character index
- D) The whole template
**Answer:** B
**Explanation:** The second parameter of the callback corresponds to the first capture group `(\w+)`, extracting the variable name without the surrounding braces.
