# Race Conditions and Stale Closures in useEffect

## 1. What is an Asynchronous Race Condition?
In interactive applications, user actions trigger network requests. If a user quickly switches between different tabs, types in a search input, or clicks different items in a list, multiple asynchronous requests are launched in rapid succession.

Because network latency varies unpredictably:
- Request 1 (initiated for User ID 1) may take 600ms.
- Request 2 (initiated for User ID 2) may take only 150ms.

```
Time ──>
0ms:   User clicks ID 1  ──> [Request 1 Dispatched (Slow: 600ms)]
100ms: User clicks ID 2  ──> [Request 2 Dispatched (Fast: 150ms)]
250ms: Request 2 Resolves ──> Updates UI with Data for ID 2!
600ms: Request 1 Resolves ──> Overwrites UI with Data for ID 1!! (BUG: Race Condition!)
```
The user is viewing ID 2 on screen, but the delayed response from ID 1 arrives last and overwrites the screen with stale, wrong data! This is a **Race Condition**.

## 2. Solution 1: The Boolean Flag (Ignore Outdated Responses)
The simplest and most resilient way to prevent race conditions in `useEffect` is using a local **boolean cancellation flag**:

```jsx
import React, { useState, useEffect } from 'react';

export default function UserProfileCard({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Declare active flag in effect scope
    let isCurrent = true;
    setLoading(true);

    async function loadUser() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        // 2. Only update state if this effect execution is STILL active!
        if (isCurrent) {
          setUserData(data);
          setLoading(false);
        }
      } catch (err) {
        if (isCurrent) setLoading(false);
      }
    }

    loadUser();

    // 3. Cleanup function: invalidate flag when userId changes or component unmounts
    return () => {
      isCurrent = false;
    };
  }, [userId]);

  if (loading) return <p>Loading user profile...</p>;
  return <div><h3>{userData?.name}</h3></div>;
}
```
When `userId` changes from 1 to 2:
- React runs the cleanup function for Request 1, setting its `isCurrent = false`.
- Even when Request 1 eventually resolves at 600ms, `if (isCurrent)` evaluates to `false`, and the outdated response is safely ignored!

## 3. Solution 2: Native `AbortController`
To actually cancel the in-flight HTTP request across the network (saving client bandwidth and server resources), pair `fetch` with an **`AbortController`**:

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchResults() {
    try {
      const response = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal // Bind network signal to controller
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Real fetch error:', err);
      }
    }
  }

  fetchResults();

  // Cancel in-flight request when query changes
  return () => controller.abort();
}, [query]);
```

## 4. What is a Stale Closure?
In JavaScript, functions "close over" the variables in their surrounding scope at the time they are created. 

If a `useEffect` callback references a state variable but fails to list it in the dependency array, **the effect permanently retains the initial value of that variable forever**:

```jsx
// ❌ Stale Closure Bug: count is ALWAYS 0 inside the interval callback!
useEffect(() => {
  const id = setInterval(() => {
    console.log('Current count:', count); // Stale: Always prints 0!
    setCount(count + 1); // 0 + 1 = 1, every second!
  }, 1000);

  return () => clearInterval(id);
}, []); // Missing 'count' in dependency array!

// ✅ Solution: Use functional state update to eliminate dependency on count
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // Always reads latest pending state!
  }, 1000);

  return () => clearInterval(id);
}, []);
```

---

## Practice Quiz

### Q1: What causes an asynchronous race condition in a React data-fetching effect?
- A) Having two computers connected to the same WiFi router
- B) Multiple asynchronous requests resolving out of order, causing an older request to overwrite the state of a newer request
- C) Using the `async` keyword in JavaScript
- D) Exceeding the maximum limit of CSS classes
**Answer:** B
**Explanation:** Because network response times fluctuate, an earlier request may resolve after a later request, causing outdated data to overwrite fresh UI state unless properly guarded.

### Q2: How does a boolean cancellation flag (`let isCurrent = true; ... return () => { isCurrent = false; };`) prevent race conditions?
- A) It blocks the computer's CPU
- B) The cleanup function sets the flag to false when dependencies change, ensuring earlier pending responses never call `setState`
- C) It turns the browser off
- D) It deletes the fetch function from window
**Answer:** B
**Explanation:** When dependencies update, React invokes the cleanup function first, setting the local flag to `false`. When the outdated promise finally resolves, the flag check blocks state updates.

### Q3: What is the primary benefit of using `AbortController` over a simple boolean flag?
- A) It actually aborts the HTTP network connection over the wire, saving bandwidth and server compute
- B) It converts JSON to CSV automatically
- C) It works without JavaScript
- D) It bypasses CORS errors
**Answer:** A
**Explanation:** `controller.abort()` signals the browser's networking layer to physically terminate the in-flight HTTP request immediately.

### Q4: What is a "stale closure" in React?
- A) A component that refuses to close
- B) When a callback captures variables from an earlier render and continues referencing those outdated values because dependencies were omitted
- C) A locked CSS property
- D) An expired authentication cookie
**Answer:** B
**Explanation:** A stale closure occurs when a function retains variables from the render cycle in which it was declared, reading outdated values if the dependency array fails to refresh the closure.

### Q5: How does the functional updater `setCount(prev => prev + 1)` resolve the stale closure problem inside `setInterval`?
- A) It deletes the timer
- B) It reads the fresh, latest pending state value provided by React's internal queue instead of relying on the closed-over scope variable
- C) It forces a page refresh
- D) It converts numbers to strings
**Answer:** B
**Explanation:** Functional updates receive the most recent state directly from React's internal state queue as an argument (`prev`), removing the need to reference the outer state variable.
