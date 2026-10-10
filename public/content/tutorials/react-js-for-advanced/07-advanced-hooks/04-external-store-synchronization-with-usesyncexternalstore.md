# External Store Synchronization with useSyncExternalStore

Prior to React 18, state management libraries (Redux, Zustand, MobX) relied on `useEffect` and `useState` to subscribe to external mutable stores. With the arrival of Concurrent React and interruptible rendering, this naive approach suffered from **tearing**: a visual bug where different components in the same tree render conflicting data from the same store because the store mutated midway through an interrupted render. `useSyncExternalStore` solves tearing with guaranteed synchronous consistency.

---

## 1. What is "Tearing"?

In graphics and UI development, tearing occurs when a frame displays data from two different points in time:

```
Concurrent Render Timeline:
1. Component A renders with Store State: { count: 1 }
2. React pauses render to handle high-priority user click
3. External store mutates to: { count: 2 }
4. React resumes render: Component B renders with Store State: { count: 2 }
RESULT: Component A displays "1", Component B displays "2" in the exact same view!
```

`useSyncExternalStore` guarantees that any external store subscription is read synchronously without tearing across the entire concurrent render.

---

## 2. API Signature

```tsx
const state = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot // Optional: for SSR hydration
);
```

- **`subscribe(callback)`:** Registers a listener that is invoked whenever the store mutates. Must return a cleanup unsubscribe function.
- **`getSnapshot()`:** Returns an immutable snapshot of current store data. If the store hasn't changed, it must return the exact same referential value.
- **`getServerSnapshot()`:** Returns the snapshot during SSR HTML rendering.

---

## 3. Subscribing to Browser APIs: `window.navigator.onLine`

A common use case is subscribing to native browser events without third-party libraries:

```tsx
import React, { useSyncExternalStore } from "react";

// 1. Subscribe function: attaches browser event listeners
function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// 2. Client snapshot getter
function getOnlineSnapshot() {
  return navigator.onLine;
}

// 3. Server snapshot getter (default to true during SSR)
function getServerSnapshot() {
  return true;
}

// Custom hook
export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getServerSnapshot
  );
}

export function NetworkStatusBadge() {
  const isOnline = useOnlineStatus();

  return (
    <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-emerald-500" : "bg-rose-500 animate-ping"}`} />
      <span className="text-sm font-semibold">
        {isOnline ? "Connected to Cloud Services" : "Offline: Check Network Connection"}
      </span>
    </div>
  );
}
```

---

## 4. Subscribing to Media Queries (`window.matchMedia`)

```tsx
import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = (callback: () => void) => {
    const matchMediaList = window.matchMedia(query);
    matchMediaList.addEventListener("change", callback);
    return () => matchMediaList.removeEventListener("change", callback);
  };

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Usage:
// const isMobile = useMediaQuery("(max-width: 768px)");
```

---

## 5. Critical Rule: Stable `getSnapshot` References

The function returned by `getSnapshot` must return a cached or primitive value. If `getSnapshot` returns a new object literal `({ count: store.count })` on every invocation, React detects an infinite change loop and crashes with:

> *"Maximum update depth exceeded."*

Always return primitive types or referentially stable memoized slices from `getSnapshot`.

---

## Practice Quiz

### Q1: What is "tearing" in Concurrent React?
- A) A CSS styling bug where fonts tear across line breaks
- B) A visual glitch where different components in the same render tree display inconsistent values from the same store because the store mutated mid-render
- C) A syntax error when splitting code into multiple chunks
- D) A network socket disconnect error
**Answer:** B
**Explanation:** Tearing describes inconsistent UI states where components display data from different points in time due to concurrent interruption and external store mutations.

### Q2: Which hook was introduced in React 18 specifically to eliminate tearing in external state libraries?
- A) useTransition
- B) useLayoutEffect
- C) useSyncExternalStore
- D) useImperativeHandle
**Answer:** C
**Explanation:** useSyncExternalStore was engineered in React 18 as the recommended primitive for state libraries (Redux, Zustand) to subscribe to external stores without tearing.

### Q3: What must the subscribe parameter passed to useSyncExternalStore return?
- A) A Promise resolving to true
- B) A cleanup function that unsubscribes the listener
- C) An array of state keys
- D) A JSX element
**Answer:** B
**Explanation:** Just like useEffect, subscribe must return a cleanup/unsubscribe function to detach event listeners and prevent memory leaks.

### Q4: Why must getSnapshot() return referentially identical values if the store has not changed?
- A) Because React checks snapshots using Object.is(); returning new object literals every call causes an infinite re-render loop
- B) Because browsers require immutable strings
- C) Because TypeScript forbids functions in snapshots
- D) Because Vite only supports primitive data types
**Answer:** A
**Explanation:** React compares successive getSnapshot returns using Object.is(). If it returns a newly created object reference on every call, React assumes the store changed and enters an infinite loop.

### Q5: What is the purpose of the third argument (getServerSnapshot) in useSyncExternalStore?
- A) It runs a Node.js shell script
- B) It provides the store snapshot during Server-Side Rendering (SSR) before browser hydration
- C) It compresses HTML files on the server
- D) It connects to an external Redis cluster
**Answer:** B
**Explanation:** getServerSnapshot supplies the initial value when rendering on the server, ensuring hydration consistency between SSR markup and initial client state.
