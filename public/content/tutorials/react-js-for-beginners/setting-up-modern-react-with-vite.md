# Setting Up Modern React with Vite

## 1. Why Vite Replaced Create React App
For many years, `create-react-app` (CRA) was the standard boilerplate tool for bootstrapping React projects. CRA relied internally on Webpack, which bundled every JavaScript file, CSS file, and third-party dependency into a single massive memory bundle before starting the local development server. As applications expanded, cold-start build times stretched into minutes, and Hot Module Replacement (HMR) experienced noticeable lag.

**Vite** (pronounced *veet*, French for "quick") fundamentally redefined front-end build tooling by capitalizing on modern browser capabilities and native **ES Modules (ESM)**:
- **Instant Cold Server Start:** Vite does not bundle source code upfront during development. Instead, it serves source code over native ESM, allowing the browser to load individual modules on demand as requested.
- **Lightning-Fast HMR:** Utilizing esbuild (written in Go), Vite pre-bundles external dependencies 10 to 100 times faster than JavaScript-based bundlers. Changes to components update almost instantaneously in the browser without losing component state.
- **Optimized Production Bundles:** When deploying to production, Vite employs Rollup under the hood to output highly optimized, tree-shaken, and chunk-split static assets.

```
Webpack / CRA Dev Server:
[Entry] ──> [Bundle 500+ modules into memory] ──> [Server Ready (Slow)]

Vite Dev Server:
[Start Server Instantly] ──> [Browser requests App.jsx via ESM] ──> [Transform App.jsx on demand]
```

## 2. Prerequisites and Environment Verification
Before bootstrapping a modern React application, ensure you have the active Long-Term Support (LTS) release of **Node.js** installed on your workstation.

```bash
# Verify Node.js version (Node 18.x or 20.x+ recommended)
node -v
# Example output: v20.14.0

# Verify npm (Node Package Manager)
npm -v
# Example output: 10.7.0
```

## 3. Scaffolding a New React Project
Execute the `npm create vite@latest` CLI command in your terminal. You can configure project parameters interactively or pass flags directly:

```bash
# Initialize project using the React template
npm create vite@latest msk-react-starter -- --template react

# Navigate into the project root directory
cd msk-react-starter

# Install project dependencies listed in package.json
npm install

# Launch the local development server
npm run dev
```

The terminal will output the local network URL (typically `http://localhost:5173`). Opening this link in any modern browser displays your active Vite + React environment with live Hot Module Replacement enabled.

## 4. Understanding the Core Configuration Files

### `package.json`
Specifies your application scripts, development tools, and production dependencies:
```json
{
  "name": "msk-react-starter",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.3.0"
  }
}
```

### `vite.config.js`
The central build configuration file where official plugins such as `@vitejs/plugin-react` are registered:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
```

---

## Practice Quiz

### Q1: What major development feature allows Vite to start local development servers almost instantaneously?
- A) It compiles all code directly to x86 assembly language
- B) It serves source code over native browser ES Modules (ESM) without bundling upfront
- C) It disables all JavaScript syntax validation
- D) It requires users to manually refresh their browser on every keystroke
**Answer:** B
**Explanation:** Vite leverages native browser ES Modules (ESM) during development, transforming source files on demand rather than bundling the entire dependency graph before launching the dev server.

### Q2: Which underlying tool does Vite use for high-speed dependency pre-bundling during development?
- A) Webpack
- B) Gulp
- C) esbuild
- D) Babel
**Answer:** C
**Explanation:** Vite uses esbuild (written in Go) to pre-bundle dependencies, which performs 10-100x faster than traditional JavaScript-based bundlers.

### Q3: What terminal command is used to launch the Vite local development server?
- A) `npm run start-server`
- B) `npm run dev`
- C) `npm run serve-react`
- D) `node index.html`
**Answer:** B
**Explanation:** The default script in a Vite-scaffolded `package.json` to start the local development server is `npm run dev`.

### Q4: By default, what port does the Vite development server bind to?
- A) 8080
- B) 3000
- C) 5173
- D) 8000
**Answer:** C
**Explanation:** Vite binds to port `5173` by default (e.g., `http://localhost:5173`), unlike Create React App which defaulted to 3000.

### Q5: Which file contains the list of installed packages, scripts, and project metadata in a React application?
- A) `index.html`
- B) `package.json`
- C) `vite.config.js`
- D) `App.jsx`
**Answer:** B
**Explanation:** `package.json` is the manifest file that defines dependencies, development scripts, version metadata, and module types for a Node-based project.
