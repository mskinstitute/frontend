# Diagnosing Memory Leaks and Detached DOM Nodes

## 1. What Are Memory Leaks in React SPAs?
In traditional multi-page websites, navigating to a new page completely purges the browser's memory heap, wiping out any memory leaks.

In a **Single-Page Application (SPA)**, users may keep a single tab open for hours or days. If components leak memory when mounting and unmounting:
- JavaScript heap memory expands continuously over time.
- The browser tab slows down, stutters during scrolling, and eventually crashes with an **Out of Memory (OOM)** error.
- Unmounted components continue executing background code, creating phantom network calls and state warnings.

```
Healthy SPA Lifecycle:
Mount ──► Heap: 20MB ──► Unmount (Garbage Collector reclaims) ──► Heap: 20MB

Leaking SPA Lifecycle:
Mount ──► Heap: 20MB ──► Unmount (Leaked Listener) ──► Heap: 25MB ──► Mount ──► Heap: 32MB ──► Crash!
```

## 2. The Top 3 Sources of React Memory Leaks

### Leak 1: Uncleaned Event Listeners
Attaching listeners to global objects (`window`, `document`) inside `useEffect` without removing them in the cleanup function:
```jsx
// ❌ Memory Leak: Adds a new listener on EVERY mount that is NEVER removed!
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []); // Missing return () => window.removeEventListener(...)
```

### Leak 2: Dangling Timers and Intervals
```jsx
// ❌ Memory Leak: Interval keeps firing forever in the background!
useEffect(() => {
  const id = setInterval(pollServer, 3000);
}, []); // Missing return () => clearInterval(id);
```

### Leak 3: Detached DOM Nodes Held by Closures
A **Detached DOM Node** occurs when a DOM element has been removed from the page's visible DOM tree, but a lingering JavaScript variable, closure, or event callback still holds a reference to it in memory, preventing the browser's Garbage Collector from freeing its memory.

## 3. Detecting Leaks with Chrome DevTools Memory Profiler
To diagnose real memory leaks:
1. Open Chrome DevTools -> **Memory** tab.
2. Select **Allocation instrumentation on timeline** or **Heap snapshot**.
3. Perform the user action (e.g. open a modal, then close it).
4. Click the garbage can icon to **Collect Garbage (GC)** manually.
5. Take a Heap Snapshot.
6. In the Class Filter, search for **`Detached`**.

If you see `Detached HTMLDivElement` or `Detached FiberNode`, inspect the **Retainers Tree** at the bottom of the panel to see the exact closure or reference preventing garbage collection!

---

## Practice Quiz

### Q1: Why are memory leaks significantly more dangerous in Single-Page Applications (SPAs) than in traditional multi-page websites?
- A) SPAs run on older computers
- B) Because SPAs do not reload the page during navigation; leaked memory accumulates continuously over time, eventually freezing or crashing the user's browser tab
- C) SPAs disable JavaScript garbage collection
- D) HTML5 requires 16GB of RAM
**Answer:** B
**Explanation:** Because SPAs operate within a single persistent browser session, uncleaned event listeners, timers, and detached DOM nodes never get cleared by page reloads, causing progressive memory bloat.

### Q2: What is a "Detached DOM Node"?
- A) An element rendered in dark mode
- B) A DOM node that has been removed from the document tree but cannot be garbage-collected because a JavaScript closure or variable still references it
- C) An HTML comment
- D) A broken image tag
**Answer:** B
**Explanation:** When a DOM node is removed from the screen but retained in JavaScript memory (via an uncleaned listener or variable), it becomes a detached DOM node memory leak.

### Q3: How do you prevent timer memory leaks in `useEffect`?
- A) Never use timers in React
- B) Store the timer ID and return a cleanup function that executes `clearTimeout(id)` or `clearInterval(id)`
- C) Set timer delay to 0
- D) Turn off strict mode
**Answer:** B
**Explanation:** Returning `() => clearInterval(timerId)` ensures that the timer is cancelled and released when the component unmounts.

### Q4: Which panel in Chrome DevTools allows engineers to take Heap Snapshots and inspect detached DOM elements?
- A) Elements
- B) Memory
- C) Sources
- D) Network
**Answer:** B
**Explanation:** The Memory panel in browser developer tools provides Heap Snapshots and Allocation Timelines to track memory allocation and locate memory leaks.

### Q5: What does clicking the "Collect Garbage" (trash can) icon in DevTools Memory panel do?
- A) Deletes the project from disk
- B) Forces the browser's V8 engine to immediately run a garbage collection sweep, allowing you to confirm if remaining objects are genuine leaks
- C) Clears browser history
- D) Resets all React state
**Answer:** B
**Explanation:** Manually triggering Garbage Collection clears all unreferenced memory, ensuring any objects remaining in the heap snapshot are actively leaked references.
