# Immediately Invoked Function Expressions (IIFE)

An **IIFE** (pronounced *"iffy"*, Immediately Invoked Function Expression) is a JavaScript design pattern where a function runs immediately as soon as it is defined.

---

## 1. Syntax of an IIFE

An IIFE is composed of two primary parts:
1. The **Grouping Operator `(...)`**: Wraps the function declaration, instructing the JavaScript parser to treat it as an **expression** rather than a statement.
2. The **Invocation Operator `()`**: Immediately calls the function expression.

```javascript
(function() {
  console.log("I run immediately upon declaration!");
})();
```

### Modern Arrow Function IIFE Syntax:
```javascript
(() => {
  console.log("Arrow function IIFE executed!");
})();
```

---

## 2. Why Did Developers Use IIFEs? (Legacy Context)

Before ES6 introduced `let`, `const`, and ES Modules, **all variables declared with `var` were globally scoped** unless inside a function.
If you included multiple script files on a web page:
```javascript
// file1.js
var count = 0;

// file2.js
var count = 100; // 💥 OOPS! file2 silently overwritten file1's global variable!
```

### The Solution: The IIFE Sandbox Pattern
By wrapping each file inside an IIFE, developers created a private function scope, completely protecting the global `window` namespace from variable collisions:

```javascript
// file1.js
(function() {
  var count = 0; // Private! Cannot collide with file2!
})();

// file2.js
(function() {
  var count = 100; // Private!
})();
```

---

## 3. Modern Use Cases for IIFEs

While ES Modules (`import`/`export`) have largely superseded IIFEs for namespace isolation, IIFEs are still widely used in modern JavaScript for:

### A. Top-Level `async` Execution in Older Environments:
```javascript
(async () => {
  try {
    const res = await fetch("https://api.github.com/users/sumit-msk");
    const data = await res.json();
    console.log("User:", data.name);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
})();
```

### B. Creating Module Singletons:
```javascript
const DatabaseConnection = (() => {
  let instance = null;

  function createInstance() {
    return { connectionId: Math.random() };
  }

  return {
    getInstance() {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();

console.log(DatabaseConnection.getInstance().connectionId);
```

---

## Practice Quiz

### Q1: What does IIFE stand for?
- A) Initial Interface Function Entry
- B) Immediately Invoked Function Expression
- C) Internal Iterative Function Engine
- D) Indexed Inline File Extension
**Answer:** B
**Explanation:** IIFE stands for Immediately Invoked Function Expression, a function that executes immediately upon creation.

### Q2: What is the purpose of wrapping the function in parentheses `(function() { ... })`?
- A) To encrypt the function
- B) To force the JavaScript parser to treat the function as an expression rather than a function declaration
- C) To make it run in a Web Worker
- D) It is optional and has no effect
**Answer:** B
**Explanation:** In JavaScript, a statement cannot begin with `function` without a name; the parentheses tell the parser to evaluate it as an expression.

### Q3: Historically, what was the primary motivation for using the IIFE pattern?
- A) To avoid polluting the global namespace and prevent variable name collisions when using `var`
- B) To run code on multicore CPUs
- C) To make CSS animations smoother
- D) To bypass browser security
**Answer:** A
**Explanation:** Before ES6 block scoping and modules, IIFEs provided function-level sandboxes to keep variables private and prevent global namespace pollution.

### Q4: How is an arrow function written as an IIFE?
- A) `() => {}()`
- B) `(() => { /* code */ })();`
- C) `call () => {}`
- D) `new () => {}`
**Answer:** B
**Explanation:** Wrapping the arrow function in parentheses and appending invocation parentheses `(() => { ... })()` forms an arrow IIFE.

### Q5: Can arguments be passed into an IIFE?
- A) No, IIFEs take zero arguments
- B) Yes, arguments can be passed inside the trailing invocation parentheses: `(function(name) { ... })("Sumit");`
- C) Only numbers
- D) Only in Node.js
**Answer:** B
**Explanation:** IIFEs can accept arguments just like any standard function invocation by passing values into the final parentheses.
