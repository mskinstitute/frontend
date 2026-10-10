# Template Literals (Basics) in JavaScript

Before ES6 (2015), creating dynamic strings or multi-line text in JavaScript required clumsy string concatenation using the plus operator (`+`) and escape characters (`\n`). **Template Literals** (written with backticks ``` `...` ```) revolutionized string formatting in JavaScript.

---

## 1. What are Template Literals?

Template literals are string literals delimited by **backticks** (`` ` ``) instead of quotes (`'` or `"`).

They provide two monumental superpowers:
1. **String Interpolation**: Embedding variables and expressions directly inside strings with `${expression}`.
2. **Native Multi-Line Strings**: Preserving newlines and indentation without `\n`.

---

## 2. String Interpolation (`${...}`)

Instead of messy concatenation:

### The Old Way (ES5):
```javascript
const name = "Sumit";
const role = "Full-Stack Developer";
const years = 5;

const bio = "My name is " + name + ", I am a " + role + " with " + years + " years of experience.";
```

### The Modern Way (Template Literals):
```javascript
const name = "Sumit";
const role = "Full-Stack Developer";
const years = 5;

const bio = `My name is ${name}, I am a ${role} with ${years} years of experience.`;
```

### Any Valid JavaScript Expression Inside `${...}`:
You can perform mathematical calculations, function calls, or ternary logic inside `${}`:
```javascript
const price = 499;
const gst = 0.18;

console.log(`Total Price: ₹${price * (1 + gst)}`);
// Total Price: ₹588.82

const user = { name: "Neha", isPremium: true };
console.log(`Status: ${user.isPremium ? "VIP Member" : "Standard User"}`);
```

---

## 3. Multi-Line Strings Made Simple

Before template literals, multi-line HTML templates required concatenation on every line:

### The Old Way:
```javascript
var html = "<div class='card'>\n" +
           "  <h2>Title</h2>\n" +
           "  <p>Description</p>\n" +
           "</div>";
```

### With Template Literals:
```javascript
const cardHtml = `
  <div class="card">
    <h2>Course Title</h2>
    <p>Learn Full-Stack Development at MSK Institute.</p>
  </div>
`;
```
Every newline, space, and indentation is preserved exactly as written!

---

## 4. Escaping Backticks Inside Template Literals

If you need to include a literal backtick inside a template literal, escape it with `\``:
```javascript
const codeSnippet = `Use \`const\` for immutable variable bindings.`;
```

---

## Practice Quiz

### Q1: What characters are used to enclose a Template Literal in JavaScript?
- A) Double quotes (`"..."`)
- B) Backticks (`` `...` ``)
- C) Single quotes (`'...'`)
- D) Angle brackets (`<...>`)
**Answer:** B
**Explanation:** Template literals are delimited by backtick characters (found above the Tab key on most keyboards).

### Q2: What is the placeholder syntax used to embed variables and expressions inside a template literal?
- A) `{{ variable }}`
- B) `${ variable }`
- C) `%{ variable }`
- D) `$[ variable ]`
**Answer:** B
**Explanation:** The `${...}` syntax interpolates any valid JavaScript expression directly into the template string.

### Q3: What is the output of `const x = 5; const y = 3; console.log(`${x} + ${y} = ${x + y}`);`?
- A) `5 + 3 = 8`
- B) `x + y = 8`
- C) `5 + 3 = 53`
- D) `SyntaxError`
**Answer:** A
**Explanation:** `${x}` evaluates to 5, `${y}` evaluates to 3, and `${x + y}` evaluates the arithmetic sum to 8.

### Q4: Can a template literal span across multiple lines without using `\n` escape characters?
- A) No, newlines cause syntax errors
- B) Yes, template literals natively preserve multi-line formatting and indentation
- C) Only when used in React
- D) Only on Linux
**Answer:** B
**Explanation:** Template literals inherently support multi-line strings, preserving all line breaks and spaces verbatim.

### Q5: Can a ternary operator be embedded inside `${...}` in a template literal?
- A) No, only variable names are allowed
- B) Yes, any valid JavaScript expression (including math, functions, and ternary operators) can be placed inside `${...}`
- C) Only if the ternary returns numbers
- D) Only in Node.js
**Answer:** B
**Explanation:** Any expression that evaluates to a value can be embedded within `${...}`, including ternary conditionals (`${cond ? 'A' : 'B'}`).
