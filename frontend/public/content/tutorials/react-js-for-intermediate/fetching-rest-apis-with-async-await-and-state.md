# Fetching REST APIs with Async Await and State

## 1. REST API Integration Architecture in React
In Single-Page Applications, data does not live inside the HTML bundle. Instead, client-side React communicates asynchronously with backend REST APIs over HTTP using JSON serialization.

A production-grade data fetching workflow must manage:
1. **The Data Container:** Storing the parsed JSON payload.
2. **The Loading State:** Displaying skeletons or spinners while the network request is pending.
3. **The Error State:** Catching network dropouts, non-200 HTTP responses, or JSON parse failures gracefully.
4. **The Cleanup Guard:** Preventing state updates if the component unmounts before the HTTP request resolves.

```
[Component Mounts]
         │
         ▼
[Dispatch fetch()] ──> [status = 'loading'] ──> [Render Loading Spinner]
         │
         ├─ Success (HTTP 200) ──> [data = payload, status = 'idle'] ──> [Render Data List]
         └─ Failure (HTTP 500) ──> [error = err, status = 'error']  ──> [Render Error Alert]
```

## 2. Implementing Clean Async Data Fetching
In React, `useEffect` cannot accept an `async` function directly. The standard pattern defines an `async` function **inside** the effect and executes it:

```jsx
import React, { useState, useEffect } from 'react';

export default function CourseDirectory() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Cleanup flag against race conditions

    async function loadCourses() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/courses');

        // CRITICAL: fetch() does NOT reject on HTTP 404 or 500!
        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false; // Teardown
    };
  }, []); // Run on initial mount

  if (loading) return <div className="spinner">Loading engineering courses...</div>;
  if (error) return <div className="error-box">Error loading data: {error}</div>;

  return (
    <div className="course-grid">
      {courses.map(c => (
        <div key={c.id} className="course-card">
          <h4>{c.title}</h4>
          <p>{c.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 3. The `fetch()` `response.ok` Trap
A critical misunderstanding among JavaScript engineers:
**The native `window.fetch()` Promise only rejects on complete network failures (e.g. offline, DNS failure).** 

If a backend server returns **HTTP 404 Not Found** or **HTTP 500 Internal Server Error**, `fetch()` **still resolves successfully!** 

You **must** explicitly check `if (!response.ok)` to verify that the HTTP status code is in the 200–299 range before attempting to parse `response.json()`.

---

## Practice Quiz

### Q1: Why doesn't a standard `try...catch` block around `fetch()` catch an HTTP 404 or 500 response automatically?
- A) Modern browsers disable `try...catch` in React
- B) `fetch()` only rejects on physical network failures; HTTP error status codes (404, 500) resolve normally, requiring explicit `if (!response.ok)` checks
- C) 404 responses are automatically converted to empty arrays
- D) `fetch()` only works on HTTP 200
**Answer:** B
**Explanation:** `fetch()` treats any HTTP response received from the server (even 404 or 500) as a resolved promise. You must check `response.ok` (status 200-299) manually.

### Q2: Why is the `async` keyword placed on an internal helper function rather than directly on `useEffect` (e.g. `useEffect(async () => ...)` is invalid)?
- A) React 18 deprecated asynchronous functions
- B) React expects `useEffect` to return either nothing or a synchronous cleanup function; an async function implicitly returns a Promise
- C) It causes an infinite loop in the browser
- D) Async functions cannot be parsed in JSX
**Answer:** B
**Explanation:** Async functions always return a Promise. React's effect architecture requires the return value to be a cleanup function, so async callbacks must be defined and called within the effect body.

### Q3: What is the purpose of the `let isMounted = true` boolean flag in the effect?
- A) To turn off the computer monitor
- B) To guard against updating component state if the component has unmounted while the network fetch was still in-flight
- C) To count how many components mounted
- D) To speed up the internet connection
**Answer:** B
**Explanation:** If a user navigates away before a fetch completes, checking `if (isMounted)` prevents `setCourses()` from running on an unmounted component.

### Q4: Which HTTP header informs the client that the server is transmitting JSON data?
- A) `Accept: text/plain`
- B) `Content-Type: application/json`
- C) `User-Agent: React`
- D) `Connection: keep-alive`
**Answer:** B
**Explanation:** `Content-Type: application/json` specifies that the HTTP response body contains a serialized JSON payload.

### Q5: What is the benefit of placing `setLoading(false)` inside a `finally` block?
- A) It prevents errors from being logged
- B) It guarantees that the loading spinner will be dismissed whether the network request succeeds or throws an error
- C) It deletes the cache
- D) It runs only in production mode
**Answer:** B
**Explanation:** Code in a `finally` block executes unconditionally after `try` or `catch`, ensuring the UI never gets permanently stuck on a loading spinner.
