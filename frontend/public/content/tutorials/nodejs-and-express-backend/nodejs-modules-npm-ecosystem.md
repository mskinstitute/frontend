# CommonJS vs ES Modules & Package.json Dependency Management

Node.js has two module systems: the legacy **CommonJS (CJS)** standard and the official ECMAScript **ES Modules (ESM)** standard. Understanding the differences, interoperability, and modern **NPM dependency management** is essential for all professional backend developers.

---

## 1. CommonJS (CJS) vs ES Modules (ESM)

| Feature | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Syntax** | `const x = require('./x')` / `module.exports = ...` | `import x from './x.js'` / `export default ...` |
| **Loading Mechanism** | Synchronous, runtime evaluation | Asynchronous, static parsing phase |
| **Top-Level Await** | Supported only in limited wrapper contexts | Supported natively at top-level |
| **File Extension** | `.cjs` or default `.js` | `.mjs` or `.js` with `"type": "module"` in `package.json` |
| **Dynamic Imports** | Dynamic `require()` allowed anywhere | `import()` returns a Promise |
| **Special Variables** | `__dirname`, `__filename` available | Use `import.meta.url` and `fileURLToPath` |

### Enabling ES Modules in Node.js
To use modern ESM across your Node.js project, add `"type": "module"` to your `package.json`:

```json
{
  "name": "backend-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### Resolving `__dirname` in ES Modules
```javascript
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current directory:', __dirname);
```

---

## 2. Package.json: Dependencies vs DevDependencies

Managing dependencies correctly is crucial for keeping production Docker images slim and secure:

```json
{
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.4",
    "eslint": "^9.10.0",
    "jest": "^29.7.0"
  }
}
```

- **`dependencies`:** Essential runtime libraries required to serve production traffic (Express, database drivers, JWT).
- **`devDependencies`:** Tools needed strictly for local development and CI/CD pipelines (test runners, linters, TypeScript compiler, Nodemon).
- In production deployment, install only runtime libraries: `npm ci --omit=dev`.

---

# Multiple Choice Questions

### 1. How do you configure a Node.js project so that all `.js` files are treated as ES Modules (ESM) by default?
A. Set `"type": "module"` in `package.json`.
B. Set `"esm": true` in `tsconfig.json`.
C. Start Node.js with `node --always-esm`.
D. Create an empty file named `.esmrc`.
**Answer:** A
**Explanation:** Adding `"type": "module"` to `package.json` configures Node.js to interpret all `.js` files within that package boundary as ES Modules.
---

### 2. Which global variables are available natively in CommonJS (CJS) but undefined in ES Modules (ESM)?
A. `console` and `Math`
B. `__dirname` and `__filename`
C. `setTimeout` and `setInterval`
D. `Array` and `Object`
**Answer:** B
**Explanation:** `__dirname` and `__filename` are CommonJS-specific globals. In ESM, developers derive directory paths using `import.meta.url`.
---

### 3. What is the semantic meaning of the caret symbol (`^`) in a dependency version declaration like `"express": "^4.18.2"`?
A. Install only the exact version 4.18.2 with zero updates.
B. Automatically update to the latest major version, including version 5.0.0.
C. Allow backwards-compatible minor and patch updates (e.g., 4.19.0 or 4.18.3), but prevent breaking major version changes (5.0.0).
D. The package will be compiled using C++ boost libraries.
**Answer:** C
**Explanation:** The caret `^` allows npm to update to newer minor and patch releases without upgrading to a new major breaking version.
---

### 4. What command installs strictly the exact dependencies recorded in `package-lock.json` without modifying the lockfile, ideal for production CI/CD?
A. `npm install --force`
B. `npm ci`
C. `npm update --all`
D. `npm audit fix`
**Answer:** B
**Explanation:** `npm ci` (Clean Install) installs exact dependencies directly from `package-lock.json` and deletes any existing `node_modules`, ensuring 100% reproducible production builds.
---

### 5. Why should development utilities like `nodemon` and `jest` be installed under `devDependencies` rather than `dependencies`?
A. `devDependencies` are downloaded faster by npm.
B. It prevents development, testing, and debugging overhead from being installed in lean production server environments and Docker containers.
C. Node.js refuses to start if `nodemon` is in `dependencies`.
D. `devDependencies` encrypt source code.
**Answer:** B
**Explanation:** Placing build tools and test frameworks in `devDependencies` allows production servers to run `npm ci --omit=dev`, saving disk space, memory, and eliminating unnecessary security vulnerabilities.
---
