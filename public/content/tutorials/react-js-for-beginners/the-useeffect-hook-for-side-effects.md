# The useEffect Hook for Side Effects

## 1. What Are Side Effects?
A React component's primary job during rendering is pure: calculating the Virtual DOM representation for a given set of props and state.

However, modern applications frequently need to perform operations that reach **outside** the component's render scope:
- Fetching data from an external REST API
- Setting up a WebSocket connection or event subscription
- Manually interacting with browser APIs (e.g., modifying `document.title` or reading geolocation)
- Setting timers (`setTimeout`, `setInterval`)
- Recording analytics page views

These operations are known as **Side Effects** (or simply "effects"). In React functional components, side effects are managed using the **`useEffect`** hook.

```
Render Phase:
[Props & State] ──> [Pure JSX Calculation] ──> [DOM Painted to Screen]
                                                         │
                                                         ▼
                                             Commit / Paint Complete!
                                                         │
                                                         ▼
                                             [useEffect Fires Here]
```

## 2. Anatomy of `useEffect`
The `useEffect` hook accepts two arguments:
```jsx
useEffect(setupFunction, dependencyArray);
```
1. **The Setup Function:** The callback containing the side effect code. React executes this function *after* the browser has painted the DOM.
2. **The Dependency Array (Optional):** An array of variables that dictates *when* the effect should re-run.

## 3. Basic Example: Synchronizing Document Title
```jsx
import React, { useState, useEffect } from 'react';

export default function CoursePage({ courseTitle }) {
  const [enrolledCount, setEnrolledCount] = useState(120);

  // Synchronize browser tab title whenever courseTitle or enrolledCount changes
  useEffect(() => {
    document.title = `${courseTitle} (${enrolledCount} Students) | MSK Institute`;
  }, [courseTitle, enrolledCount]); // Dependencies

  return (
    <div className="course-view">
      <h1>{courseTitle}</h1>
      <p>Active Students: {enrolledCount}</p>
      <button onClick={() => setEnrolledCount(prev => prev + 1)}>
        Enroll Student
      </button>
    </div>
  );
}
```

## 4. Fetching Data with `useEffect`
When fetching data on initial component mount:

```jsx
import React, { useState, useEffect } from 'react';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Declare async function INSIDE effect callback
    async function loadData() {
      try {
        const res = await fetch('https://api.example.com/students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []); // Empty array = Run ONLY ONCE when component mounts

  if (loading) return <p>Loading directory...</p>;

  return (
    <ul>
      {students.map(s => <li key={s.id}>{s.name}</li>)}
    </ul>
  );
}
```
*Note: The callback function passed to `useEffect` cannot be marked `async` directly (e.g. `useEffect(async () => ...)` is forbidden) because an async function returns a Promise, whereas React expects `useEffect` to return either a cleanup function or nothing!*

---

## Practice Quiz

### Q1: What is a "side effect" in the context of React development?
- A) A bug that causes CSS styles to invert colors
- B) Any operation that interacts with the world outside the component's render scope, such as API calls, timers, or direct DOM manipulation
- C) An error that occurs during npm build
- D) An invalid JSX attribute
**Answer:** B
**Explanation:** Side effects are operations that reach outside the pure rendering cycle to interact with external systems—such as network requests, DOM APIs, subscriptions, or storage.

### Q2: When does the `useEffect` callback function execute relative to the browser painting the screen?
- A) Before React calculates the Virtual DOM
- B) After the component renders and the browser updates/paints the screen
- C) Only during server compilation
- D) Immediately when the user scrolls the page
**Answer:** B
**Explanation:** `useEffect` runs asynchronously after the render cycle completes and the browser has painted the screen, ensuring that side effects do not block the user interface.

### Q3: Why is it invalid to write `useEffect(async () => { ... }, [])`?
- A) Modern browsers do not support async/await
- B) An `async` function returns a Promise, but React expects an effect to return either nothing or a synchronous cleanup function
- C) React strictly requires callbacks to be written as ES5 function declarations
- D) Async effects can only run on mobile devices
**Answer:** B
**Explanation:** React expects the return value of an effect to be a cleanup function. Async functions implicitly return a Promise, which confuses React's cleanup mechanism. Define your async function inside the effect instead.

### Q4: What does an empty dependency array `[]` signify to `useEffect`?
- A) The effect will never execute
- B) The effect executes exactly once after the initial mount, and never runs on subsequent re-renders
- C) The effect runs in an infinite loop
- D) The component cannot be unmounted
**Answer:** B
**Explanation:** An empty dependency array `[]` tells React that the effect relies on no reactive values from props or state, so it only runs once after the initial mount.

### Q5: Where should side effects like network requests or subscriptions NOT be performed in a React component?
- A) Inside `useEffect`
- B) Directly in the body of the component function during the render phase
- C) Inside event handlers
- D) Inside custom hooks
**Answer:** B
**Explanation:** Performing side effects directly in the component body during render causes duplicate requests, memory leaks, and unpredictable re-render loops because rendering must remain a pure calculation.
