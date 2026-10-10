# Strict Mode and Detecting Unintentional Side Effects

## 1. What is React StrictMode?
**`<React.StrictMode>`** is a built-in development tool provided by React to highlight potential problems in an application. Like JavaScript's `"use strict"`, it activates additional runtime checks and warnings for its child components.

StrictMode is enabled by wrapping your root component tree inside `<React.StrictMode>` in `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 2. The Development-Only Guarantee
A critical point of reassurance for every React engineer is:
**StrictMode checks run ONLY in development mode.**
StrictMode has **zero impact on production builds**. It does not add overhead, double-invoke functions, or increase bundle size in production.

## 3. Why Does StrictMode Double-Invoke Functions?
If you add `console.log('Rendering component')` inside a component or `console.log('Running effect')` inside `useEffect`, you will notice that in development, **it logs twice!**

```
Console Output:
Rendering component
Rendering component
Running effect setup
Running effect cleanup
Running effect setup
```

### Why does React do this on purpose?
React's future roadmap and concurrent rendering capabilities rely on components being **pure functions**. An impure function produces subtle bugs, race conditions, and memory leaks that can be difficult to spot in simple development tests.

To expose accidental side effects, StrictMode deliberately:
1. **Re-renders component bodies twice:** Ensures that component rendering logic is pure and produces the same output without mutating external variables.
2. **Re-runs effects twice (Mount -> Cleanup -> Mount):** Verifies that your `useEffect` has a valid cleanup function that correctly tears down subscriptions, event listeners, and timers.

## 4. Catching an Impure Bug with StrictMode
Consider this accidental mutation:

```jsx
// ❌ Impure Component
let guestList = [];

export default function GuestBadge({ name }) {
  guestList.push(name); // Mutates an external variable during render!
  return <div>Guests: {guestList.length}</div>;
}
```
In standard production, rendering this with name `"Aman"` might display `Guests: 1`. 

Under StrictMode in development, React re-renders twice, so `guestList.push` runs twice! The screen displays `Guests: 2`! 

The developer immediately notices that the count is wrong, uncovering the accidental external mutation that would have caused severe bugs in production.

---

## Practice Quiz

### Q1: What is the primary purpose of `<React.StrictMode>`?
- A) To prevent users from inspecting the webpage source code
- B) To highlight potential problems, memory leaks, and accidental side effects during development
- C) To enforce password strength on login forms
- D) To block advertisement scripts
**Answer:** B
**Explanation:** StrictMode is a development tool that performs checks and double-invokes render/effect cycles to help developers detect impure code, missing cleanups, and deprecated APIs.

### Q2: Does React StrictMode run in production builds?
- A) Yes, it runs in all environments
- B) No, StrictMode checks and double-invocations are completely disabled in production builds
- C) Only on Linux production servers
- D) Yes, but only for admin users
**Answer:** B
**Explanation:** StrictMode checks run exclusively in development mode and are completely stripped of runtime effects in production builds.

### Q3: Why does React StrictMode intentionally run component functions and effects twice in development?
- A) Due to an unresolved bug in React's source code
- B) To verify that components are pure functions and that effects properly clean up their resources
- C) To double the speed of local network requests
- D) To test screen brightness
**Answer:** B
**Explanation:** Double-invoking functions surfaces hidden side effects and verifies that `useEffect` cleanup handlers work reliably when components unmount and remount.

### Q4: If a `console.log` inside a component body prints twice in your Vite dev server, what is the cause?
- A) Your computer mouse is clicking twice
- B) The component is wrapped in `<React.StrictMode>` in `src/main.jsx`
- C) The browser has two tabs open
- D) Vite is running out of memory
**Answer:** B
**Explanation:** Double console logs during development are the intentional behavior of `<React.StrictMode>` verifying function purity.

### Q5: Can `<React.StrictMode>` be applied to only a specific section of an application?
- A) No, it must wrap the entire HTML document
- B) Yes, StrictMode can wrap any part of the component tree without affecting unwrapped sibling components
- C) Only in class components
- D) Only when using Redux
**Answer:** B
**Explanation:** StrictMode behaves like a regular component; you can wrap specific subtrees (e.g. `<React.StrictMode><FeatureComponent /></React.StrictMode>`) to test individual modules.
