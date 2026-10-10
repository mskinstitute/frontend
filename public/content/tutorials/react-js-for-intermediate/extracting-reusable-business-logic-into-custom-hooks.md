# Extracting Reusable Business Logic into Custom Hooks

## 1. What Are Custom Hooks?
In early React, sharing stateful logic between components required complex patterns like Higher-Order Components (HOCs) or Render Props. 

A **Custom Hook** is simply a JavaScript function whose name starts with **`use`** and that can call other React hooks (`useState`, `useEffect`, `useRef`, etc.).

Custom hooks allow you to extract component logic into reusable functions:
- Components focus purely on **presentation and user interface**.
- Custom hooks encapsulate **state, network requests, and business rules**.

```
Component:
[Focus on JSX, Layout, CSS, and UI Controls]
         │
         ▼ calls custom hook: const { isOnline } = useOnlineStatus();
Custom Hook (useOnlineStatus):
[Encapsulates useState, useEffect, window event listeners]
```

## 2. The Naming Convention Rule
A custom hook **must start with the lowercase word `use`** (e.g., `useAuth`, `useWindowSize`, `useFetch`):
- React's ESLint plugin uses this naming prefix to automatically enforce the **Rules of Hooks** inside your custom function (ensuring hooks aren't called conditionally or in loops).
- If you omit the `use` prefix, React will treat it as a standard function and will not warn you when hook violations occur.

## 3. Extracting a Window Dimensions Hook
Consider how multiple components (carousels, responsive charts, navigation drawers) need to know the browser's viewport width:

### Without Custom Hook:
Every component duplicates 15 lines of `useState`, `useEffect`, and `resize` event listeners.

### With Custom Hook (`useWindowSize`):
```javascript
// src/hooks/useWindowSize.js
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
```

### Clean Consumer Component:
```jsx
// src/components/ResponsiveDashboard.jsx
import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export default function ResponsiveDashboard() {
  const { width } = useWindowSize(); // 1 clean line of code!

  const isMobile = width < 768;

  return (
    <div>
      {isMobile ? <MobileNavigation /> : <DesktopSidebar />}
    </div>
  );
}
```

## 4. Do Components Using the Same Custom Hook Share State?
**No! Custom Hooks share stateful *logic*, NOT state itself!**

Each call to a custom hook creates a completely independent container of state. If Component A and Component B both call `useWindowSize()`, each component has its own private `windowSize` state in React's Fiber tree. (If you want components to share the exact same state instance, combine the custom hook with React Context).

---

## Practice Quiz

### Q1: What prefix must all custom React hooks begin with?
- A) `get`
- B) `use` (e.g. `useFetch`, `useAuth`)
- C) `hook_`
- D) `react`
**Answer:** B
**Explanation:** All custom hooks must start with `use`. This naming convention signals to linters that the function contains React hooks, enabling automatic enforcement of the Rules of Hooks.

### Q2: Do two components that call the same custom hook share the exact same state values?
- A) Yes, all custom hooks act as global singletons
- B) No, each component call receives its own completely isolated, private instance of state
- C) Only when running in production
- D) Only if the hook is exported as a default export
**Answer:** B
**Explanation:** Custom hooks share reusable logic and lifecycles, not state data. Every invocation creates an independent set of state variables for that component instance.

### Q3: What can a custom hook return?
- A) Only strings and numbers
- B) Only JSX elements
- C) Any valid JavaScript value, including primitives, arrays, objects, or functions
- D) Only Promises
**Answer:** C
**Explanation:** Custom hooks are regular JavaScript functions and can return whatever data structures are most convenient for consumers (such as `[value, setValue]` tuples or `{ data, error, isLoading }` objects).

### Q4: Which of the following is a primary architectural benefit of extracting custom hooks?
- A) It speeds up the computer's graphics card
- B) It decouples business and stateful logic from UI rendering, making components cleaner and state logic testable in isolation
- C) It eliminates the need for CSS classes
- D) It bypasses CORS errors
**Answer:** B
**Explanation:** Custom hooks separate concerns: components handle layout and markup, while hooks encapsulate API requests, subscriptions, and state transformations.

### Q5: Can a custom hook invoke other built-in React hooks like `useState` and `useEffect`?
- A) No, only top-level components can invoke hooks
- B) Yes, calling built-in hooks is the fundamental purpose of custom hooks
- C) Only in class components
- D) Only on mobile browsers
**Answer:** B
**Explanation:** Custom hooks exist specifically to compose and package built-in React hooks into reusable units.
