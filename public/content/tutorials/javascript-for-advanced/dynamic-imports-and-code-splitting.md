# Dynamic Imports & Code Splitting in Modern JavaScript

As web applications grow, loading an entire monolithic bundle upon the user's initial page visit degrades **First Contentful Paint (FCP)** and **Time to Interactive (TTI)**. **Dynamic Imports** using the function-like `import()` syntax enable **Code Splitting**—downloading chunks of JavaScript on-demand only when actually needed.

---

## 1. Static vs. Dynamic Imports

```javascript
// STATIC IMPORT: Must be at top of file, blocks initial bundle load
import { HeavyChart } from './components/HeavyChart.js';

// DYNAMIC IMPORT: Can be invoked inside any function, event handler, or condition
const loadChartBtn = document.querySelector('#btn-show-chart');

loadChartBtn.addEventListener('click', async () => {
  // Downloads 'HeavyChart.js' chunk over network ONLY when button is clicked!
  const { HeavyChart } = await import('./components/HeavyChart.js');
  const chart = new HeavyChart();
  chart.render('#chart-target');
});
```

---

## 2. Architectural Mechanics of Code Splitting

When modern bundlers (Webpack, Vite, Rollup, Next.js) encounter `import('./path')`:
1. They automatically split that module and its private dependencies into an **isolated chunk file** (e.g. `HeavyChart.chunk-a98f12.js`).
2. The main bundle size is significantly reduced.
3. At runtime, the browser initiates a network fetch for the chunk only when the `import()` expression is reached.

```
                    ┌──► app.js (Main Initial Bundle: 45KB)
                    │
Application Build ──┼──► analytics.chunk.js (Downloaded on Idle: 20KB)
                    │
                    └──► checkout.chunk.js (Downloaded on Route Change: 120KB)
```

---

## 3. Route-Based Code Splitting

In Single Page Applications (SPAs), loading views for pages the user may never visit is wasteful. Route-based splitting dynamically loads view controllers:

```javascript
const routes = {
  '/': () => import('./views/HomeView.js'),
  '/dashboard': () => import('./views/DashboardView.js'),
  '/settings': () => import('./views/SettingsView.js')
};

async function navigateTo(path) {
  const loadRoute = routes[path] || routes['/'];
  
  showLoadingSpinner();
  try {
    const { default: ViewComponent } = await loadRoute();
    const view = new ViewComponent();
    view.mount('#app-root');
  } catch (err) {
    showErrorPage('Failed to load page chunk.');
  } finally {
    hideLoadingSpinner();
  }
}
```

---

## 4. Chunk Prefetching & Preloading

To eliminate user wait times after code splitting, modern applications instruct the browser to prefetch chunks during idle network bandwidth:

```html
<!-- Download during browser idle time for upcoming navigation -->
<link rel="prefetch" href="/chunks/DashboardView.js" as="script" />

<!-- High priority download needed in the current page -->
<link rel="preload" href="/chunks/CriticalWidget.js" as="script" />
```

### Magic Comments in Webpack / Vite
```javascript
// Webpack Magic Comments:
const module = await import(
  /* webpackChunkName: "admin-panel" */
  /* webpackPrefetch: true */
  './admin/AdminPanel.js'
);
```

---

## Practice Quiz

### Q1: What does the dynamic import('path') expression return?
- A) A synchronous module object
- B) A Promise that resolves to the module namespace object
- C) A DOM Script element
- D) A binary ArrayBuffer
**Answer:** B
**Explanation:** `import('path')` is asynchronous and returns a Promise resolving to the module's exported namespace (including named exports and `.default`).

### Q2: How do you access the default export from a dynamically imported module?
- A) const { default: MyComponent } = await import('./module.js');
- B) const MyComponent = import('./module.js').default;
- C) const MyComponent = require('./module.js');
- D) const { defaultExport } = await import('./module.js');
**Answer:** A
**Explanation:** Because default exports are mapped to the property key `default` on the module namespace object, aliasing `{ default: MyComponent }` extracts it cleanly.

### Q3: What is the primary performance benefit of Code Splitting?
- A) It prevents runtime type errors
- B) It shrinks the initial JavaScript payload, improving First Contentful Paint (FCP) and page load speed
- C) It eliminates the need for CSS
- D) It encrypts source code
**Answer:** B
**Explanation:** Code splitting divides large scripts into targeted bundles loaded on-demand, minimizing initial download and parse times for users.

### Q4: Which link rel attribute hints to the browser to download a script in the background during idle network time?
- A) <link rel="preload">
- B) <link rel="prefetch">
- C) <link rel="prerender">
- D) <link rel="stylesheet">
**Answer:** B
**Explanation:** `rel="prefetch"` informs the browser that the resource might be needed for future navigations, fetching it during browser idle periods.

### Q5: Can dynamic import() be used conditionally inside an if block or try...catch?
- A) No, imports must only exist at the root of a file
- B) Yes, dynamic import() is a runtime expression that can appear anywhere inside statements and blocks
- C) Only in Firefox
- D) Only when running on localhost
**Answer:** B
**Explanation:** Unlike static `import` declarations, the dynamic `import()` operator is an expression and can be called conditionally inside functions, `if` statements, and loops.
