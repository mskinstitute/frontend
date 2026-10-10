# Synchronous Layout Calculations with useLayoutEffect

React's `useEffect` is asynchronous and non-blocking: it executes after the browser paints the updated DOM to the screen. While this preserves 60 FPS UI performance for 95% of side effects, it causes visible visual flicker when measuring DOM nodes (e.g., tooltips, popovers, dropdown positions) and updating state before painting. `useLayoutEffect` runs synchronously before the browser paints.

---

## 1. The Rendering Lifecycle: `useEffect` vs `useLayoutEffect`

```
React Component Updates
      │
      ▼
React reconciles Virtual DOM and mutates physical DOM nodes
      │
      ├───> useLayoutEffect fires SYNCHRONOUSLY
      │     (Can inspect layout, measure dimensions, mutate DOM/state)
      │
      ▼
Browser paints pixels to screen (layout and paint)
      │
      ├───> useEffect fires ASYNCHRONOUSLY
            (Data fetching, subscriptions, analytics)
```

If you position a tooltip dynamically inside `useEffect`:
1. The DOM mounts with tooltip at `(0, 0)`.
2. The browser paints: user briefly sees the tooltip flicker at the top-left corner of the screen for 1 frame.
3. `useEffect` runs, measures the trigger button, and sets coordinates `(250, 180)`.
4. The browser re-paints: tooltip jumps to the correct position.

With `useLayoutEffect`, the coordinate calculation happens **before** step 2, preventing any visual jump.

---

## 2. Dynamic Tooltip Positioning Example

```tsx
import React, { useState, useRef, useLayoutEffect } from "react";

interface Position {
  top: number;
  left: number;
}

export function FloatingTooltipButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState<Position>({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect guarantees coordinates are calculated BEFORE browser paint
  useLayoutEffect(() => {
    if (!showTooltip || !buttonRef.current || !tooltipRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Position tooltip centered directly above the trigger button
    const calculatedTop = buttonRect.top - tooltipRect.height - 8;
    const calculatedLeft = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);

    setCoords({
      top: Math.max(8, calculatedTop),
      left: Math.max(8, calculatedLeft),
    });
  }, [showTooltip]);

  return (
    <div className="p-20 bg-slate-900 min-h-screen text-slate-100 flex items-center justify-center">
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold shadow-lg transition"
      >
        Hover For Tooltip
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          className="z-50 px-3 py-1.5 bg-slate-800 border border-slate-700 text-cyan-300 text-xs rounded shadow-2xl pointer-events-none"
        >
          Dynamic tooltip anchored seamlessly without flicker!
        </div>
      )}
    </div>
  );
}
```

---

## 3. Server-Side Rendering (SSR) Warning

Because `useLayoutEffect` requires direct access to DOM geometric layout engines (`getBoundingClientRect`, `offsetHeight`), calling it during Server-Side Rendering (SSR in Next.js or Node.js) generates a warning:

> *"Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format."*

### Isomorphic Layout Effect Solution
To silence this warning in universal codebases, conditionally alias `useLayoutEffect` to `useEffect` on the server:

```ts
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

---

## Practice Quiz

### Q1: When does useLayoutEffect execute in the React component lifecycle?
- A) Asynchronously 500ms after the browser completes the paint
- B) Synchronously immediately after React mutates the DOM, but before the browser paints to the screen
- C) Only during server-side build steps
- D) Before the component function is invoked
**Answer:** B
**Explanation:** useLayoutEffect runs synchronously immediately following DOM mutations and before the browser paints pixels to the screen, allowing synchronous measurements.

### Q2: Why does dynamic positioning inside standard useEffect cause visual flicker?
- A) useEffect deletes all CSS styles
- B) Because useEffect runs after the browser paints, the user sees the element in its uncalculated default position before it jumps to its measured position
- C) useEffect is deprecated in React 18
- D) Browsers disable hardware acceleration inside useEffect
**Answer:** B
**Explanation:** Because useEffect executes after paint, the initial unpositioned render is visible to the user for one or more frames, producing a noticeable layout jump.

### Q3: What is the risk of performing heavy computational loops inside useLayoutEffect?
- A) It deletes the Redux store
- B) It blocks the main JavaScript thread and delays the browser paint, degrading Time to Interactive and frame rates
- C) It causes React to switch to PHP
- D) It bypasses browser CORS policies
**Answer:** B
**Explanation:** Because useLayoutEffect is synchronous and blocks the browser paint cycle, expensive computations directly freeze visual rendering.

### Q4: Why does useLayoutEffect trigger a console warning during Server-Side Rendering (SSR)?
- A) Node.js does not allow functions starting with the word "use"
- B) The server has no physical DOM, layout engine, or paint pipeline, making synchronous layout measurement impossible
- C) SSR requires React 15
- D) Server components cannot run JavaScript
**Answer:** B
**Explanation:** In SSR environments there is no browser window or layout tree to calculate geometry, so synchronous layout effects cannot execute.

### Q5: What is the purpose of the useIsomorphicLayoutEffect pattern?
- A) To encrypt layout coordinates
- B) To safely use useLayoutEffect in the browser while falling back to useEffect on the server to prevent SSR console warnings
- C) To render components in 3D WebGL
- D) To automate unit testing
**Answer:** B
**Explanation:** The isomorphic layout effect pattern detects if window is defined; it binds useLayoutEffect on the client and useEffect on the server to avoid SSR warnings.
