# Lifecycle Equivalents: Mount, Update, and Unmount

## 1. The Paradigm Shift: From Class Lifecycles to Synchronization
In legacy React class components, developers organized code around explicit **lifecycle methods**:
- `componentDidMount()`: Executed once after the component mounted to the real DOM.
- `componentDidUpdate(prevProps, prevState)`: Executed after every re-render caused by props or state changes.
- `componentWillUnmount()`: Executed immediately before the component was destroyed from the DOM.

While intuitive at first, class lifecycles forced unrelated logic to be scattered across multiple methods. For example, setting up a timer in `componentDidMount` and tearing it down in `componentWillUnmount` forced related code into separate places.

In modern functional React, **Hooks think in terms of synchronization, not lifecycles**. However, understanding how `useEffect` maps to these classic milestones is crucial for mastering React architecture.

```
Class Component Lifecycles:
[componentDidMount] ──> [componentDidUpdate] ──> [componentWillUnmount]
(Scattered across three separate methods)

Functional Component with useEffect:
useEffect(() => {
  // 1. Mount & Update Logic
  return () => {
    // 2. Cleanup & Unmount Logic
  };
}, [dependencies]);
(All related setup and teardown encapsulated together!)
```

## 2. Mapping Lifecycles to `useEffect`

### 1. Equivalent to `componentDidMount`: Empty Dependency Array `[]`
```jsx
useEffect(() => {
  console.log('Mounted: Component is now visible on screen');
  fetchInitialCatalog();
}, []); // Empty array guarantees execution only on initial mount
```

### 2. Equivalent to `componentDidUpdate`: Specific Dependencies `[prop, state]`
```jsx
useEffect(() => {
  console.log(`Updated: activeTrack changed to ${activeTrack}`);
  fetchTrackModules(activeTrack);
}, [activeTrack]); // Runs on mount AND whenever activeTrack changes
```

### 3. Equivalent to `componentWillUnmount`: The Return Cleanup Function
```jsx
useEffect(() => {
  return () => {
    console.log('Unmounted: Component is being removed from the DOM');
  };
}, []); // Cleanup function with empty deps runs strictly on unmount
```

## 3. Simulating "DidUpdate Only" (Skipping Initial Mount)
In class components, `componentDidUpdate` did *not* run on initial mount. In contrast, `useEffect` **always runs on initial mount**.

If you specifically require an effect to execute **only on subsequent updates (skipping the first render)**, you can use a **`useRef`** flag to track whether the component has mounted:

```jsx
import React, { useState, useEffect, useRef } from 'react';

export default function UpdateOnlyLogger({ data }) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 1. Check if this is the initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip execution on initial mount!
    }

    // 2. This code runs strictly on updates!
    console.log('Data updated to:', data);
  }, [data]);

  return <div>Data display: {data}</div>;
}
```

## 4. Lifecycle Comparison Matrix

| Milestone | Class Component Method | Functional Component Equivalent |
| :--- | :--- | :--- |
| **Initial Mount** | `componentDidMount()` | `useEffect(fn, [])` |
| **Every Render** | `componentDidUpdate()` | `useEffect(fn)` (no deps array) |
| **Specific Change** | `componentDidUpdate(prevProps)` + `if` | `useEffect(fn, [value])` |
| **Teardown / Unmount** | `componentWillUnmount()` | `useEffect(() => () => cleanup(), [])` |

---

## Practice Quiz

### Q1: What hook configuration in functional React serves as the direct equivalent of `componentDidMount()`?
- A) `useMount()`
- B) `useEffect(fn, [])` (with an empty dependency array)
- C) `useState(fn)`
- D) `useLayoutEffect(fn)` with no function
**Answer:** B
**Explanation:** An empty dependency array `[]` ensures the effect runs only once after the initial render, mirroring the behavior of `componentDidMount()`.

### Q2: In legacy class components, why was splitting logic across `componentDidMount` and `componentWillUnmount` problematic?
- A) It was forbidden by JavaScript
- B) Cohesive logic (such as setting up a subscription and cleaning it up) was split across separate functions, making code harder to read and maintain
- C) Browsers would only run one of them
- D) It increased bundle size by 500 KB
**Answer:** B
**Explanation:** Class lifecycles forced developers to fragment related setup and teardown logic into disparate methods, whereas `useEffect` co-locates setup and cleanup in one concise function.

### Q3: How can you create an effect that runs strictly on subsequent updates, skipping the initial mount?
- A) By passing `[-1]` as the dependency array
- B) By using a `useRef(true)` flag to detect and return early on the first render
- C) React does not permit skipping the initial mount
- D) By calling `useEffect.skipFirst()`
**Answer:** B
**Explanation:** Tracking the initial render with a mutable `useRef(true)` allows the effect to set the flag to `false` on mount and execute custom logic strictly on subsequent renders.

### Q4: When does the cleanup function of an effect with dependency array `[id]` execute?
- A) Only after 10 minutes have elapsed
- B) Before the effect re-runs when `id` changes, and when the component unmounts
- C) Only when the browser tab is closed
- D) On every single keystroke in the app
**Answer:** B
**Explanation:** The cleanup function tears down the effect for the previous `id` before the effect executes for the new `id`, as well as when the component unmounts from the DOM.

### Q5: Does `useEffect(fn)` (without any dependency array) run on the initial mount?
- A) No, it only runs on updates
- B) Yes, it runs on initial mount AND after every subsequent re-render
- C) Only in production builds
- D) Only when triggered by an onClick event
**Answer:** B
**Explanation:** Omitting the dependency array causes the effect to run on the initial mount as well as after every single update/re-render of the component.
