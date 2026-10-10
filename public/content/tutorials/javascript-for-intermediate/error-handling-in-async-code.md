# Error Handling in Async Code in Modern JavaScript

Asynchronous operations represent the most common source of runtime failures in web applications—from intermittent network drops to API rate limits and aborted timeouts. Understanding how errors propagate across Promises, async/await, and event loops is essential for production stability.

---

## 1. Async/Await with try...catch

The cleanest and most readable pattern for handling asynchronous errors is wrapping `await` calls in standard `try...catch` blocks:

```javascript
async function fetchUserDashboard(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`API returned HTTP status ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(`Dashboard fetch failed for user ${userId}:`, error.message);
    // Return fallback state or rethrow
    return { error: true, message: 'Unable to load dashboard data' };
  }
}
```

---

## 2. The Unhandled Promise Rejection Hazard

If a Promise is rejected and has **no `.catch()` handler** and is **not caught inside a `try...catch`**, JavaScript triggers an **UnhandledPromiseRejection**:

```
        Rejected Promise
               │
      Is there a handler?
      ┌────────┴────────┐
     YES               NO
      │                 │
      ▼                 ▼
 .catch() /        UnhandledPromiseRejection
 try...catch       (Node.js process terminates /
                    Browser logs red console error)
```

### Global Safety Nets

Always register global handlers to capture any stray unhandled rejections:

```javascript
// In Modern Browsers:
window.addEventListener('unhandledrejection', (event) => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
  // Log to error tracking service (e.g. Sentry)
  event.preventDefault(); // Suppress default browser error log
});

// In Node.js:
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

---

## 3. Go-Style Tuple Pattern for Clean Async Handling

Some developers prefer avoiding nested `try...catch` blocks by wrapping async operations in a helper that returns a `[data, error]` tuple (inspired by Go):

```javascript
async function to(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

// Usage:
async function loadFeed() {
  const [data, err] = await to(fetchFeedFromNetwork());
  if (err) {
    console.error('Failed to load feed:', err);
    return;
  }
  console.log('Feed loaded:', data);
}
```

---

## 4. Error Handling with Promise.allSettled()

When running multiple independent operations in parallel, `Promise.all()` fails fast if any single promise rejects. To inspect every outcome and handle errors individually, use `Promise.allSettled()`:

```javascript
const userIds = [1, 2, 9999, 4]; // 9999 is an invalid ID

const results = await Promise.allSettled(
  userIds.map(id => fetchUserById(id))
);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`User ${userIds[index]} loaded:`, result.value.name);
  } else {
    console.warn(`User ${userIds[index]} failed:`, result.reason.message);
  }
});
```

---

## Practice Quiz

### Q1: What happens in modern Node.js environments when a Promise rejection is left unhandled?
- A) It is quietly ignored
- B) The Node.js process terminates with a non-zero exit code
- C) It retries automatically
- D) It enters an infinite loop
**Answer:** B
**Explanation:** Modern versions of Node.js terminate the active process on unhandled promise rejections to prevent state corruption.

### Q2: What browser event fires whenever a Promise rejects without a local catch handler?
- A) window.onerror
- B) window.addEventListener('unhandledrejection')
- C) document.onpromisefail
- D) window.addEventListener('rejected')
**Answer:** B
**Explanation:** The `unhandledrejection` window event is dispatched whenever an unhandled promise rejection occurs in the browser.

### Q3: Why is Promise.allSettled() preferred over Promise.all() when fetching data for independent dashboard widgets?
- A) It uses fewer CPU threads
- B) A failure in one widget does not cancel or reject the data fetching for the remaining widgets
- C) It runs synchronously
- D) It only works with GET requests
**Answer:** B
**Explanation:** `Promise.all()` fails fast on the first rejection, whereas `Promise.allSettled()` allows each individual widget promise to complete regardless of errors.

### Q4: In an async function, how does a rejected Promise inside an await expression manifest?
- A) It returns undefined
- B) It throws an exception that can be caught in a try...catch block
- C) It triggers a browser alert
- D) It logs directly to console.warn
**Answer:** B
**Explanation:** Awaiting a rejected promise causes the `await` expression to throw the rejection reason as an exception, interceptable via standard `try...catch`.

### Q5: What property on each result object of Promise.allSettled() indicates whether the operation succeeded?
- A) result.ok (boolean)
- B) result.status ('fulfilled' or 'rejected')
- C) result.success (boolean)
- D) result.state
**Answer:** B
**Explanation:** `Promise.allSettled()` returns objects with a `status` property whose value is either `'fulfilled'` (with `.value`) or `'rejected'` (with `.reason`).
