# Memory Profiling and Heap Snapshots in Production

Frontend memory leaks quietly degrade web application performance over prolonged sessions. In single-page applications (SPAs) where users keep tabs open for days (e.g. enterprise CRM, Slack, Trading desks), memory leaks cause tabs to consume gigabytes of RAM, resulting in sluggish scrolling, browser stutter, and eventually `Out of Memory (OOM)` tab crashes.

---

## 1. Common Culprits of Memory Leaks in React

1. **Forgotten Event Listeners:** Attaching `window.addEventListener` without cleaning up in `useEffect`.
2. **Uncleared Timers:** `setInterval` or `setTimeout` references holding closures of component scopes.
3. **Detached DOM Nodes:** JavaScript objects (caches, arrays, maps) holding references to DOM elements that have been removed from the visible document.
4. **Uncleared Observables / WebSockets:** Unclosed RxJS subscriptions or WebSocket listener callbacks.
5. **Global Event Emitters:** Registering handlers on singleton event buses without unregistering on unmount.

---

## 2. Taking Heap Snapshots in Chrome DevTools

To track memory leaks systematically:

1. Open Chrome DevTools > **Memory** tab.
2. Select **Heap snapshot** > click **Take snapshot** (Snapshot 1: Baseline).
3. Perform the suspected action repeatedly (e.g., open and close an Analytics Modal 10 times).
4. Click the trash can icon in the top left to force Garbage Collection (GC).
5. Take Snapshot 2.
6. Switch dropdown view from *Summary* to **Comparison** against Snapshot 1.
7. Sort by **Size Delta** or filter by constructor:
   - Search `Detached` to see **Detached HTMLDivElement** or unmounted components.

---

## 3. Code Example: Fixing a Detached DOM & Closure Leak

### Leaky Implementation
```tsx
// ❌ Memory Leak: Uncleaned timer and DOM reference
import React, { useEffect, useState } from "react";

export function LeakyTicker() {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    // Leaky: Interval continues running forever after component unmounts!
    setInterval(() => {
      setData((prev) => [...prev, Math.random()]);
    }, 1000);

    // Leaky: Attaches window listener without cleanup function
    window.addEventListener("resize", () => {
      console.log("Window resized", data);
    });
  }, []); // Notice data closure holds stale data array indefinitely

  return <div>Ticker items: {data.length}</div>;
}
```

### Clean Enterprise Implementation
```tsx
// ✅ Memory Safe: Clean teardown of all resources
import React, { useEffect, useState } from "react";

export function CleanTicker() {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    // 1. Store timer ID
    const timerId = window.setInterval(() => {
      setData((prev) => (prev.length > 50 ? [...prev.slice(1), Math.random()] : [...prev, Math.random()]));
    }, 1000);

    // 2. Stable listener reference
    const handleResize = () => {
      console.log("Window resized cleanly");
    };
    window.addEventListener("resize", handleResize);

    // 3. MANDATORY: Cleanup function executed on unmount
    return () => {
      window.clearInterval(timerId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div className="font-mono text-cyan-400">Active telemetry buffers: {data.length}</div>;
}
```

---

## 4. Retainer Trees in DevTools

When inspecting detached nodes in a heap snapshot, DevTools displays the **Retainer Tree** at the bottom:

```
Detached HTMLDivElement
  └── context in system / Context
      └── closure in handleDataStream()
          └── globalListener in EventTarget
```
Follow the retainer chain from top to bottom to locate the exact variable, closure, or event handler preventing the garbage collector from reclaiming the memory.

---

## Practice Quiz

### Q1: What is a "Detached DOM Node" in the context of browser memory profiling?
- A) A DOM node that has no CSS styles attached
- B) A DOM node that has been removed from the visual document tree but cannot be garbage collected because a JavaScript reference still points to it
- C) A node created on an external server
- D) A node rendered inside an SVG element
**Answer:** B
**Explanation:** Detached DOM nodes occur when elements are removed from the page DOM, but JavaScript variables (arrays, closures, or maps) retain references to them, preventing garbage collection.

### Q2: Why should you force Garbage Collection (trash can icon) before taking a heap comparison snapshot?
- A) To delete browser history
- B) To ensure that any temporary uncollected objects are discarded, revealing only true uncollectible memory leaks
- C) To speed up internet download speed
- D) To refresh the page DOM
**Answer:** B
**Explanation:** Forcing Garbage Collection sweeps away short-lived temporary objects that are eligible for cleanup, ensuring the snapshot highlights genuine leaks retained by active references.

### Q3: What happens if an unmounted component leaves an active setInterval running?
- A) The browser automatically cancels the interval after 10 seconds
- B) The timer callback continues executing indefinitely in the background, keeping references to variables in its closure and leaking memory
- C) The application switches to offline mode
- D) The computer shuts down
**Answer:** B
**Explanation:** Uncleaned setInterval timers continue running indefinitely on the JavaScript event loop, retaining all closure scope variables and causing continuous memory leaks.

### Q4: In Chrome DevTools Heap Snapshots, what does the "Retainer Tree" tell you?
- A) How many HTML files were downloaded
- B) The reference path explaining why an object cannot be garbage collected and what variable or closure holds it in memory
- C) The SSL certificate details
- D) The CSS grid layout hierarchy
**Answer:** B
**Explanation:** The Retainer view reveals the chain of active references pointing to the selected object, pointing directly to the closure, window listener, or store preventing garbage collection.

### Q5: How can holding a reference to a parent DOM node in an unmounted component cause a massive leak?
- A) It prevents the entire subtree of child nodes from being garbage collected because the root node remains referenced
- B) It causes the server to run out of disk space
- C) It crashes the CSS stylesheet compiler
- D) It deletes browser cookies
**Answer:** A
**Explanation:** In the browser DOM, retaining a reference to even a single parent DOM element keeps its entire tree of child elements, event listeners, and attributes alive in memory.
