# Dynamic Imports and Prefetching Strategies

Code splitting saves bandwidth on initial load, but naive splitting introduces navigation latency: when a user clicks a route or modal button, they must pause while the browser makes a round-trip network request to fetch the JavaScript chunk. Prefetching strategies bridge this gap by intelligently downloading code chunks ahead of user interaction.

---

## 1. The Latency Gap of Lazy Loading

Consider this user timeline without prefetching:
1. User hovers over "Analytics" link (0ms).
2. User clicks "Analytics" link (300ms).
3. Browser initiates network request for `analytics.chunk.js` (305ms).
4. Network roundtrip and bundle execution takes 400ms.
5. User stares at a loading spinner until 705ms.

With **Hover/Intent Prefetching**, the chunk starts downloading at 0ms. By 300ms, the chunk is already cached in browser memory, rendering the view immediately on click.

---

## 2. Programmatic Dynamic Prefetching

Because dynamic `import()` returns a standard JavaScript Promise, you can trigger chunk evaluation on standard DOM events:

```tsx
import React, { Suspense, lazy } from "react";

// Factory function returning dynamic import Promise
const loadAnalyticsModule = () => import("./pages/AnalyticsPage");

// React.lazy references the same module factory
const AnalyticsPage = lazy(loadAnalyticsModule);

export function NavigationLink() {
  const [showAnalytics, setShowAnalytics] = React.useState(false);

  // Prefetch immediately when user hovers or focuses the trigger
  const prefetchAnalytics = () => {
    // Calling the factory triggers network fetch and caches module in browser cache
    loadAnalyticsModule();
  };

  return (
    <div>
      <button
        onMouseEnter={prefetchAnalytics}
        onFocus={prefetchAnalytics}
        onClick={() => setShowAnalytics(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 font-medium"
      >
        View Analytics (Hover to Prefetch)
      </button>

      {showAnalytics && (
        <Suspense fallback={<div>Loading Analytics...</div>}>
          <AnalyticsPage />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 3. Webpack & Rollup Magic Comments

Modern bundlers support declarative prefetching annotations embedded inside dynamic `import()` statements:

### Webpack Magic Comments
```tsx
const AdminReport = lazy(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "admin-report" */
    "./AdminReport"
  )
);
```
- `webpackPrefetch: true`: Injects `<link rel="prefetch" href="admin-report.chunk.js">` into the document `<head>`, downloading the chunk during browser idle time after the parent page finishes loading.
- `webpackPreload: true`: Injects `<link rel="preload">`, instructing the browser to download the chunk with high priority alongside the parent page.

---

## 4. Viewport Intersection Prefetching

For bottom-of-page sections or long infinite feeds, prefetch chunks when a scroll anchor enters the viewport using `IntersectionObserver`:

```tsx
import React, { useEffect, useRef, lazy, Suspense, useState } from "react";

const loadFooterChart = () => import("./components/ComplexFooterChart");
const ComplexFooterChart = lazy(loadFooterChart);

export function InfinitePage() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [renderChart, setRenderChart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Target is close to viewport: prefetch bundle!
            loadFooterChart();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" } // Trigger 200px before scrolling into view
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-12">
      <div className="h-[1200px] bg-slate-900 p-8 text-white">
        Scroll down to trigger background chunk prefetch...
      </div>

      <div ref={sentinelRef} />

      <button
        onClick={() => setRenderChart(true)}
        className="px-4 py-2 bg-cyan-600 text-white rounded"
      >
        Display Chart
      </button>

      {renderChart && (
        <Suspense fallback={<div>Mounting chart...</div>}>
          <ComplexFooterChart />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 5. Network-Aware Prefetching

Never waste cellular mobile data. Use `navigator.connection` to disable aggressive prefetching on slow connections or when Data Saver mode is enabled:

```ts
export function shouldPrefetch(): boolean {
  if (typeof window === "undefined") return false;

  const conn = (navigator as any).connection;
  if (!conn) return true;

  // Don't prefetch if user has Save-Data header or slow 2G/3G network
  if (conn.saveData) return false;
  if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") return false;

  return true;
}
```

---

## Practice Quiz

### Q1: How does hover-based prefetching reduce perceived navigation latency?
- A) It removes all CSS from the downloaded bundle
- B) It initiates the network chunk fetch when the cursor hovers over the trigger, utilizing human click reaction time (150-300ms) to load the module
- C) It compiles JavaScript into machine bytecode on the server
- D) It bypasses browser security sandboxes
**Answer:** B
**Explanation:** The physical delay between a mouse hovering over a link and the user clicking is typically 150-300ms, which is sufficient time to fetch a pre-warmed chunk over modern connections.

### Q2: What is the difference between webpackPrefetch and webpackPreload?
- A) webpackPrefetch downloads during browser idle time for future navigations; webpackPreload fetches in parallel with high priority for the current navigation
- B) webpackPrefetch only works on Safari, while webpackPreload only works on Chrome
- C) webpackPrefetch deletes unused CSS, while webpackPreload compresses images
- D) They are identical synonyms with no behavioral differences
**Answer:** A
**Explanation:** Prefetch loads chunks during browser idle time when bandwidth is free, whereas preload downloads the asset alongside the parent chunk with high priority.

### Q3: Why is it recommended to inspect navigator.connection before running programmatic prefetch scripts?
- A) To detect if the user has an active Bluetooth connection
- B) To respect users with metered data plans (saveData) or slow 2G/3G connections and avoid wasting mobile bandwidth
- C) To encrypt the chunk with AES-256
- D) Because dynamic imports are banned on 4G networks
**Answer:** B
**Explanation:** Unrestricted prefetching on mobile metered connections consumes precious data caps; checking saveData and effectiveType protects users from unexpected mobile bill charges.

### Q4: How does executing loadComponent() before React mounts <LazyComponent /> avoid the Suspense fallback?
- A) React disables Suspense fallbacks if the page has been open for > 5 seconds
- B) The browser caches the resolved module Promise, so when React evaluates lazy(), the module is already cached in memory and renders synchronously without suspending
- C) The browser deletes the chunk file from disk
- D) React bypasses the render cycle completely
**Answer:** B
**Explanation:** Because ES module imports are cached by the browser and JavaScript module loader, calling the import factory earlier populates the module registry so React.lazy resolves immediately.

### Q5: In IntersectionObserver prefetching, what does the rootMargin: "200px" property accomplish?
- A) It forces the element to have a CSS margin of 200px
- B) It triggers the intersection callback 200px before the sentinel actually scrolls into the visible viewport
- C) It compresses the downloaded chunk by 200 kilobytes
- D) It delays script execution by 200 milliseconds
**Answer:** B
**Explanation:** rootMargin expands the bounding box used for intersection tests, allowing prefetching to begin 200px before the target enters view so assets are ready before the user reaches them.
