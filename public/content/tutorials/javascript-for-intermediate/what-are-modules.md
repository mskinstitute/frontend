# What are Modules? Modern JavaScript Architecture

As JavaScript applications expanded from simple interactive button scripts into massive, full-scale enterprise software systems, managing code across thousands of lines became impossible without modularization. **JavaScript Modules** provide encapsulation, scope isolation, and explicit dependency management.

---

## 1. The Historical Context: The Global Scope Crisis

In the early days of the web, every JavaScript file shared a single, global execution context:

```html
<!-- LEGACY: Everything polluted window! -->
<script src="utils.js"></script>
<script src="auth.js"></script>
<script src="app.js"></script>
```

### Critical Flaws of Global Scripts:
1. **Name Collisions:** If `utils.js` defined `const count = 0` and `app.js` declared `const count = 5`, the application would crash with collision errors.
2. **Order Dependency:** If `app.js` loaded before `utils.js`, execution failed because dependencies were missing.
3. **Lack of Encapsulation:** All internal variables and helper functions were exposed on `window`.

---

## 2. Evolution of Module Systems

```
  1995: Global Scripts (window.myVar)
          │
  2009: CommonJS (Node.js: require / module.exports)
  2010: AMD / RequireJS (Asynchronous Browser Loading)
          │
  2015: ECMAScript Modules (ESM) — The Universal Official Standard!
        (import / export)
```

| Module System | Syntax | Primary Environment | Loading Mechanism |
| :--- | :--- | :--- | :--- |
| **ES Modules (ESM)** | `import` / `export` | Modern Browsers, Modern Node.js | Static Analysis, Asynchronous |
| **CommonJS (CJS)** | `require()` / `module.exports` | Legacy Node.js | Dynamic, Synchronous |

---

## 3. Core Characteristics of ES Modules

1. **Strict Mode by Default:** Every ES module automatically executes in `'use strict'` mode.
2. **Module-Level Scope:** Variables declared at top-level in a module are private to that module and **never** pollute the global `window` object.
3. **Single Execution (Singleton):** A module is executed only **once** when first imported; subsequent imports receive the cached exports.
4. **Deferred Execution in HTML:** `<script type="module">` scripts are automatically deferred until the HTML document is fully parsed.
5. **CORS Protected:** Modules loaded in browsers must comply with Cross-Origin Resource Sharing (CORS) rules.

---

## 4. Enabling Modules in the Browser

To load an ES module in HTML, set `type="module"`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Browsers parse this as an ES Module -->
  <script type="module" src="main.js"></script>
</head>
<body>
  <h1>Modular Application</h1>
</body>
</html>
```

```javascript
// main.js
import { calculateTax } from './taxCalculator.js';

const tax = calculateTax(100);
console.log('Tax:', tax);
```

---

## Practice Quiz

### Q1: What happens to top-level variables declared inside an ES Module?
- A) They are attached to window
- B) They remain scoped strictly to the module and do not pollute global scope
- C) They become read-only constants across the entire operating system
- D) They throw a ReferenceError
**Answer:** B
**Explanation:** ES modules feature module-level scope; top-level variables are scoped to the module itself and never pollute the global `window` namespace.

### Q2: What HTML attribute is required to tell the browser to treat a JavaScript file as an ES Module?
- A) <script esm="true">
- B) <script type="module">
- C) <script mode="es6">
- D) <script async="module">
**Answer:** B
**Explanation:** The attribute `type="module"` instructs the browser to parse and execute the script as an ECMAScript Module.

### Q3: Are ES modules executed in strict mode?
- A) Only if 'use strict' is written at the top
- B) Yes, always automatically by specification
- C) No, modules run in non-strict mode
- D) Only in production builds
**Answer:** B
**Explanation:** According to the ECMAScript specification, all module code runs in strict mode automatically; manual `'use strict'` directives are redundant.

### Q4: How many times is a module executed if it is imported by 5 different files in the same app?
- A) 5 times
- B) Once (its exports are evaluated once and cached)
- C) 0 times until called
- D) Twice
**Answer:** B
**Explanation:** ES Modules follow a singleton pattern: the module file is executed exactly once upon first import, and its exported bindings are cached for subsequent imports.

### Q5: What legacy module format was popularized by Node.js using require() and module.exports?
- A) AMD
- B) CommonJS (CJS)
- C) UMD
- D) SystemJS
**Answer:** B
**Explanation:** CommonJS was designed for server-side JavaScript in Node.js, relying on `require()` for synchronous loading and `module.exports` for exporting.
