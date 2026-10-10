# import & export in Modern JavaScript

The ECMAScript Module (ESM) syntax revolves around two fundamental keywords: **`export`** (exposing variables, functions, and classes to external files) and **`import`** (consuming those exposed bindings in other files).

---

## 1. Named Exports and Imports

Named exports allow you to share multiple identifiers from a single module by name.

### Exporting:
```javascript
// mathUtils.js

// Option A: Inline export
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Option B: Grouped export declaration at bottom
// export { PI, add, subtract };
```

### Importing:
```javascript
// app.js
import { PI, add } from './mathUtils.js';

console.log(add(10, 5)); // 15
console.log(PI);          // 3.14159
```

---

## 2. Default Exports

Each module can have at most **one** `default` export. Default exports are useful when a module's primary purpose is to deliver a single class, component, or configuration:

```javascript
// User.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

### Importing Default Exports:
When importing a default export, you do **not** use curly braces `{}` and can choose any name:

```javascript
// consumer.js
import UserAccount from './User.js'; // Any alias name works!

const admin = new UserAccount('Sarah');
```

---

## 3. Renaming with the `as` Keyword

To avoid naming collisions between imported modules, use `as` to alias identifiers:

```javascript
// Renaming during import:
import { render as renderCanvas } from './canvas.js';
import { render as renderDOM } from './domRenderer.js';

renderCanvas();
renderDOM();

// Renaming during export:
const secretKey = 'XYZ_123';
export { secretKey as apiKey };
```

---

## 4. Namespace Import: import * as

To import all named exports from a module under a single namespace object:

```javascript
import * as MathService from './mathUtils.js';

console.log(MathService.PI);
console.log(MathService.add(20, 30));
console.log(MathService.subtract(50, 10));
```

```
       mathUtils.js exports:
       ├── PI: 3.14159
       ├── add()
       └── subtract()
              │
              ▼
   import * as MathService
              │
              ▼
   MathService.add(20, 30)
```

---

## 5. Dynamic Imports: import()

While standard `import` statements must be static and at the top of the file, the dynamic `import('path')` function loads modules asynchronously on demand (code-splitting):

```javascript
const btn = document.querySelector('#load-editor');

btn.addEventListener('click', async () => {
  // Module is fetched over network ONLY when button is clicked!
  const { RichTextEditor } = await import('./richEditor.js');
  const editor = new RichTextEditor();
  editor.mount('#editor-container');
});
```

---

## Practice Quiz

### Q1: How many default exports can a single JavaScript module contain?
- A) Unlimited
- B) Exactly one
- C) Up to 5
- D) Zero
**Answer:** B
**Explanation:** A module can have multiple named exports, but can have only one `default` export.

### Q2: How do you import a default export from a file named logger.js?
- A) import { logger } from './logger.js';
- B) import logger from './logger.js';
- C) import default as logger from './logger.js';
- D) require('./logger.js');
**Answer:** B
**Explanation:** Default exports are imported without curly braces `{}`.

### Q3: What keyword is used to rename an import to avoid name collisions?
- A) with
- B) alias
- C) as
- D) rename
**Answer:** C
**Explanation:** The `as` keyword allows renaming identifiers during both import and export (e.g. `import { render as draw } from './canvas.js'`).

### Q4: What does import * as Analytics from './analytics.js' do?
- A) It imports all exported bindings and groups them as properties on the object Analytics
- B) It deletes the file after importing
- C) It imports only default exports
- D) It compiles analytics.js to WebAssembly
**Answer:** A
**Explanation:** A namespace import `import * as Name` gathers all named exports from the target module into a single object namespace.

### Q5: What is the primary benefit of dynamic import('./module.js')?
- A) It runs synchronously to prevent thread blocking
- B) It enables lazy loading / code-splitting, downloading modules only when needed
- C) It ignores CORS security policies
- D) It bypasses strict mode
**Answer:** B
**Explanation:** Dynamic `import()` returns a Promise and loads the module on-demand at runtime, reducing the initial bundle size and initial page load time.
