# Component-Level Lazy Loading with Suspense

While route-based code splitting optimizes initial page navigation, enterprise single-page applications often contain heavy, rarely triggered UI components within a single page—such as rich-text editors, export modals, 3D Canvas visualizers, or interactive charting widgets. Component-level lazy loading defers loading these resource-heavy assets until the exact moment they are needed.

---

## 1. When to Split at the Component Level

Splitting every tiny button or input creates HTTP chunk request waterfall overhead. Reserve component-level splitting for components that meet at least one of these criteria:

- **Heavy Dependencies:** Modules importing libraries > 50 KB gzip (e.g., Monaco Editor, Quill, Chart.js, Three.js, PDF.js).
- **Conditional Visibility:** Modals, drawer overlays, tabs, and collapsibles that a majority of users might never open during a session.
- **Below-the-Fold Content:** Complex data tables or footer report generators positioned far below the initial viewport.

---

## 2. On-Demand Modal Lazy Loading Pattern

A canonical pattern is loading an interactive modal only after the user clicks an "Open Modal" trigger:

```tsx
import React, { useState, Suspense, lazy } from "react";

// The heavy modal is not imported at module top-level!
const HeavyReportModal = lazy(() => import("./components/HeavyReportModal"));

export function DashboardView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Enterprise Dashboard</h1>
      <p className="text-slate-400 mb-6">Standard widgets render instantly without payload bloat.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-semibold transition"
      >
        Generate Deep PDF Report
      </button>

      {isModalOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent mx-auto mb-3 rounded-full" />
                <p className="text-sm font-medium text-slate-300">Loading Report Engine (PDF.js)...</p>
              </div>
            </div>
          }
        >
          <HeavyReportModal onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

---

## 3. Tabbed Interface Lazy Loading

When users navigate complex dashboards with multiple tabs, loading inactive tabs synchronously wastes memory and bandwidth.

```tsx
import React, { useState, Suspense, lazy } from "react";

const OverviewTab = lazy(() => import("./tabs/OverviewTab"));
const SecurityAuditTab = lazy(() => import("./tabs/SecurityAuditTab"));
const BillingInvoicesTab = lazy(() => import("./tabs/BillingInvoicesTab"));

type TabKey = "overview" | "security" | "billing";

export function TabContainer() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-100">
      <div className="flex gap-2 border-b border-slate-800 pb-3 mb-6">
        {(["overview", "security", "billing"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
            Streaming tab chunk...
          </div>
        }
      >
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "security" && <SecurityAuditTab />}
        {activeTab === "billing" && <BillingInvoicesTab />}
      </Suspense>
    </div>
  );
}
```

---

## 4. Fallback Layout Stability and Cumulative Layout Shift (CLS)

A critical hazard in component lazy-loading is Cumulative Layout Shift (CLS). If a component replaces a 0-pixel fallback with a 600-pixel card, the surrounding UI jumps abruptly, damaging user experience and Core Web Vitals.

```tsx
// Good: Skeleton fallback mirrors exact expected dimensions
<Suspense
  fallback={
    <div className="w-full h-[450px] bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-xs text-slate-600 uppercase tracking-widest font-mono">Chart Loading Skeleton</span>
    </div>
  }
>
  <Lazy3DChart data={telemetryData} />
</Suspense>
```

---

## Practice Quiz

### Q1: What is the primary indicator that a component should be split using component-level lazy loading?
- A) The component contains more than 10 lines of standard HTML markup
- B) The component is rarely viewed and pulls in massive third-party dependencies like charting or rich-text editors
- C) The component uses standard useState hooks
- D) The component uses CSS Flexbox instead of Grid
**Answer:** B
**Explanation:** Splitting is most effective for components that carry heavy external bundle sizes (>50KB) and are rendered conditionally or below the fold.

### Q2: Why is wrapping micro-components (like standard buttons or icons) in React.lazy considered an anti-pattern?
- A) React will crash with a stack overflow
- B) Network overhead from dozens of tiny HTTP chunk requests creates request waterfall bottlenecks and layout jank
- C) Webpack does not allow more than 3 lazy components per file
- D) Browsers automatically disable JavaScript execution for files under 2KB
**Answer:** B
**Explanation:** Over-splitting creates excessive network overhead; establishing separate HTTP handshakes for microscopic chunks slows rendering compared to bundling them together.

### Q3: How does providing dimensioned skeleton loaders in Suspense fallbacks protect Core Web Vitals?
- A) It prevents Cumulative Layout Shift (CLS) by reserving the exact spatial layout before the chunk mounts
- B) It increases Largest Contentful Paint (LCP) by blocking DOM parsing
- C) It turns the client application into a static HTML document
- D) It deletes client-side cookies
**Answer:** A
**Explanation:** Reserving the dimensional footprint via a skeleton or fixed-height container prevents the surrounding document from jumping when the lazy chunk finishes loading, keeping CLS near 0.

### Q4: In a conditional modal component ({isOpen && <Suspense><LazyModal /></Suspense>}), when does the browser download the modal chunk?
- A) When the user first visits the application homepage
- B) Only when isOpen evaluates to true and the LazyModal element is first evaluated for rendering
- C) When the user moves their mouse over the browser title bar
- D) During the server build step only
**Answer:** B
**Explanation:** Dynamic import() is only executed when the React.lazy component is evaluated for rendering, which occurs when isOpen becomes true.

### Q5: What happens if a network failure prevents a lazy component chunk from downloading?
- A) The browser restarts the computer
- B) The Suspense boundary catches the error and displays the fallback forever
- C) The Promise rejects, triggering an error that can be caught by an ancestor Error Boundary
- D) React automatically reloads the page 10 times in a synchronous loop
**Answer:** C
**Explanation:** A chunk download failure rejects the import() Promise, bubbling an error up to the nearest React Error Boundary where you can present a retry interface.
