# Non-Blocking Asynchronous Code with Promises and Async/Await

Asynchronous programming is the foundation of Node.js backend engineering. Over the years, JavaScript evolved from deeply nested "Callback Hell" to robust **Promises** and modern **`async / await`** syntax with structured error handling.

---

## 1. Evolution of Asynchronous Patterns

### The Old Way: Callback Hell (Pyramid of Doom)
```javascript
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      console.log('Order Details:', details);
    });
  });
});
```

### The Modern Way: Async / Await with Clean Try / Catch
```javascript
async function fetchUserDashboard(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    return { user, recentOrder: details };
  } catch (error) {
    console.error('Failed to load dashboard:', error.message);
    throw error;
  }
}
```

---

## 2. Advanced Promise Combinators for Backend Performance

When building microservices and REST APIs, sequential `await` statements can cause unnecessary performance bottlenecks (waterfall requests). Node.js provides powerful Promise combinators:

### 1. `Promise.all()` (Fail-Fast Parallel Execution)
Executes promises in parallel. If **all** succeed, returns an array of results. If **any** reject, it rejects immediately.

```javascript
const [userProfile, userCart, systemNotifications] = await Promise.all([
  fetchUserProfile(userId),
  fetchUserCart(userId),
  fetchNotifications(userId)
]);
```

### 2. `Promise.allSettled()` (Resilient Aggregation)
Waits for all promises to finish, regardless of whether they resolve or reject. Ideal for batch jobs where one failure should not cancel others.

```javascript
const results = await Promise.allSettled([
  sendEmailNotification(user),
  sendSmsAlert(user),
  logAnalyticsEvent('LOGIN', user.id)
]);

results.forEach((res, index) => {
  if (res.status === 'fulfilled') {
    console.log(`Task ${index} succeeded:`, res.value);
  } else {
    console.error(`Task ${index} failed:`, res.reason);
  }
});
```

### 3. `Promise.race()` vs `Promise.any()`
- `Promise.race([p1, p2])`: Resolves or rejects as soon as the first promise settles. Perfect for request timeouts.
- `Promise.any([p1, p2])`: Resolves as soon as the **first promise succeeds**. Only rejects if all promises reject.

---

# Multiple Choice Questions

### 1. What problem does `async/await` primarily solve compared to deeply nested callback functions?
A. It compiles JavaScript into binary C code.
B. It eliminates "Callback Hell" and allows asynchronous code to be written and read like clean synchronous code with standard try/catch blocks.
C. It eliminates the need for Node.js event loop.
D. It enforces strict type checking at runtime.
**Answer:** B
**Explanation:** `async/await` provides clean, linear syntax on top of Promises, eliminating nesting pyramids and streamlining error handling with standard `try/catch` blocks.
---

### 2. When fetching three independent database queries simultaneously, why is `await Promise.all([q1, q2, q3])` preferred over sequential `await q1; await q2; await q3;`?
A. `Promise.all` prevents database crashes.
B. It runs the queries concurrently in parallel, reducing total latency to that of the slowest query rather than their sum.
C. Sequential await statements throw syntax errors in Node.js.
D. `Promise.all` disables SQL injection attacks.
**Answer:** B
**Explanation:** Sequential awaits create an unnecessary waterfall where each query waits for the preceding one to finish; `Promise.all` triggers all queries concurrently.
---

### 3. What is the key difference between `Promise.all()` and `Promise.allSettled()`?
A. `Promise.all` only works with file systems; `Promise.allSettled` works with databases.
B. `Promise.all` rejects immediately if any promise fails (fail-fast), whereas `Promise.allSettled` waits for all promises to complete regardless of success or failure.
C. `Promise.allSettled` never returns an array.
D. There is no difference; they are identical aliases.
**Answer:** B
**Explanation:** `Promise.all` is fail-fast and halts on the first rejection, whereas `Promise.allSettled` always resolves after all promises have finished, returning an array of status objects.
---

### 4. What will happen if an `async` function throws an unhandled error inside its body?
A. The application immediately deletes the source code file.
B. It returns a rejected Promise carrying the thrown error object.
C. The function halts and returns `null`.
D. It causes an operating system kernel panic.
**Answer:** B
**Explanation:** An `async` function always returns a Promise; throwing an uncaught error causes that returned Promise to be rejected.
---

### 5. How can a developer enforce a strict 3-second timeout on a slow external HTTP request using Promises?
A. By wrapping the code in `setInterval()`.
B. By using `Promise.race()` comparing the HTTP request promise against a 3-second timeout rejection promise.
C. By reducing the CPU clock speed in Node.js.
D. By setting `process.env.TIMEOUT = 3`.
**Answer:** B
**Explanation:** `Promise.race()` settles with the first promise to finish, making it the standard pattern to race an asynchronous call against a delayed rejection timer.
---
