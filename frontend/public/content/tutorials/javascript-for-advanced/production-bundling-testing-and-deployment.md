# Capstone Part 4: Production Bundling, Testing & Deployment

Building a world-class JavaScript application culminates in deploying it reliably to global production infrastructure. In this final capstone tutorial, you will master the end-to-end production workflow: automated unit testing (Vitest), bundle optimization (Vite/Rollup), CI/CD pipelines, and zero-downtime deployment.

---

## 1. Automated Testing Pyramid

```
                ┌───────────────┐
                │   E2E Tests   │  (Playwright / Cypress: User flows across real browser)
                └───────┬───────┘
                        │
                ┌───────▼───────┐
                │  Integration  │  (Component mounting, API mock integration)
                └───────┬───────┘
                        │
                ┌───────▼───────┐
                │  Unit Tests   │  (Vitest / Jest: Fast, pure function verification)
                └───────────────┘
```

---

## 2. Writing Production Unit Tests with Vitest

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from './Store.js';
import { appReducer } from './appReducer.js';

describe('Central Store Architecture', () => {
  let store;

  beforeEach(() => {
    store = new Store(appReducer, { count: 0, theme: 'light' });
  });

  it('should initialize with provided initial state', () => {
    expect(store.getState()).toEqual({ count: 0, theme: 'light' });
  });

  it('should update state immutably when an action is dispatched', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().count).toBe(1);
  });

  it('should notify subscribers when state updates', () => {
    const subscriberMock = vi.fn();
    store.subscribe(subscriberMock);

    store.dispatch({ type: 'INCREMENT' });

    expect(subscriberMock).toHaveBeenCalledTimes(1);
    expect(subscriberMock).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
  });

  it('should throw an error when mutating state directly', () => {
    expect(() => {
      store.getState().count = 99;
    }).toThrow();
  });
});
```

---

## 3. Production Bundler Configuration (`vite.config.js`)

A production bundler configuration enforces code splitting, minification, and asset compression:

```javascript
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    target: 'es2022',      // Emit modern, compact ES2022 output
    minify: 'terser',      // High-performance minification
    sourcemap: 'hidden',   // Generates sourcemaps without public comments for Sentry
    rollupOptions: {
      output: {
        // Manual Chunk Splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js']
        }
      },
      plugins: [
        visualizer({ open: false, filename: 'bundle-analysis.html' })
      ]
    }
  }
});
```

---

## 4. GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)

Automate testing, linting, building, and deployment on every git push:

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  verify-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Run Unit Tests
        run: npm run test:run

      - name: Build Production Assets
        run: npm run build

      - name: Deploy to Cloudflare Pages / Vercel
        run: npx wrangler pages deploy dist --project-name=enterprise-app
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

---

## 5. Production Release Checklist

Before promoting code to live production traffic:
1. **Zero TypeScript Errors:** `npx tsc --noEmit` exits cleanly.
2. **100% Test Suite Passing:** All unit and integration test assertions pass.
3. **Bundle Size Budgets Enforced:** No initial chunk exceeds 150KB gzip.
4. **Security Headers Configured:** Content Security Policy (CSP), HSTS, and X-Frame-Options enabled.
5. **Monitoring & Sentry Configured:** Production release tagged with git commit hash.

---

## Practice Quiz

### Q1: What command ensures a clean, deterministic install of dependencies based strictly on package-lock.json in CI/CD pipelines?
- A) npm install
- B) npm ci
- C) npm update
- D) npm clean
**Answer:** B
**Explanation:** `npm ci` (Clean Install) deletes `node_modules` and installs exact versions from `package-lock.json`, ensuring deterministic builds in automated CI pipelines.

### Q2: What is the primary role of manual chunk splitting in a Rollup or Vite configuration?
- A) To encrypt source code
- B) To separate large third-party vendor libraries from application code, maximizing long-term browser cache hit rates
- C) To delete unused CSS
- D) It is required by HTML5
**Answer:** B
**Explanation:** Splitting vendor libraries into isolated chunks ensures that when application code changes, users do not need to re-download unchanged vendor code.

### Q3: What is the difference between Unit Tests and End-to-End (E2E) Tests?
- A) Unit tests verify isolated individual functions and classes in memory; E2E tests test full user workflows across real browser engines
- B) Unit tests are slower than E2E tests
- C) Unit tests run on production servers
- D) There is no difference
**Answer:** A
**Explanation:** Unit tests isolate specific functions or methods; E2E tests validate complete multi-step user scenarios (login, add to cart, checkout) in automated browsers.

### Q4: Why is sourcemap: 'hidden' configured in production bundlers?
- A) It deletes the source maps
- B) It generates source map files for upload to monitoring platforms (like Sentry) without appending the sourceMappingURL comment to public JavaScript files
- C) It converts sourcemaps into images
- D) It bypasses strict mode
**Answer:** B
**Explanation:** `hidden` generates `.map` files for private error telemetry tools while preventing public browsers from automatically linking to internal source code.

### Q5: What is the purpose of npm run test:run in CI/CD pipelines compared to standard test mode?
- A) It runs tests in an infinite loop
- B) It executes the test suite once to completion and exits with status 0 (success) or 1 (failure) instead of entering watch mode
- C) It deletes failing tests
- D) It only runs tests on Sundays
**Answer:** B
**Explanation:** In CI/CD pipelines, test runners must execute in single-run mode (`--run`), exiting cleanly with a process status code so the pipeline knows whether to proceed with deployment.
