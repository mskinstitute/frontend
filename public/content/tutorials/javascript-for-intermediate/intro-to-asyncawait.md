# Intro to Async/Await in Modern JavaScript

Introduced in ECMAScript 2017 (ES8), `async` and `await` are syntactic sugar built on top of JavaScript Promises. They allow you to write asynchronous code that reads and behaves like synchronous code, eliminating nested `.then()` callbacks and enabling standard `try...catch` blocks.

---

## 1. The async Keyword

Placing `async` before a function declaration or arrow function does two things:
1. It permits the use of `await` inside that function.
2. It **always returns a Promise**, automatically wrapping non-promise return values.

```javascript
async function getGreeting() {
  return 'Hello, World!'; // Automatically wrapped in Promise.resolve()
}

// Consuming the async function
getGreeting().then(msg => console.log(msg)); // 'Hello, World!'
```

---

## 2. The await Keyword

`await` can only be used inside `async` functions (or at the top level of modern ES modules). It pauses execution of the `async` function until the Promise settles:

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  console.log('Step 1: Beginning operation...');
  
  await delay(1000); // Pauses runDemo execution for 1000ms
  
  console.log('Step 2: Resumed after 1 second!');
}

runDemo();
```

> **Crucial Concept:** `await` does **not** block the entire browser or main JavaScript thread! It only pauses the execution frame of that specific `async` function, allowing other events and UI updates to proceed.

---

## 3. Comparing Promise Chaining vs. Async/Await

### With Promise Chaining (.then/.catch):
```javascript
function loadDashboard(userId) {
  return fetchUserData(userId)
    .then(user => fetchUserFeed(user.feedId))
    .then(feed => renderFeed(feed))
    .catch(err => showError(err));
}
```

### With Modern Async/Await:
```javascript
async function loadDashboard(userId) {
  try {
    const user = await fetchUserData(userId);
    const feed = await fetchUserFeed(user.feedId);
    renderFeed(feed);
  } catch (err) {
    showError(err);
  }
}
```

---

## 4. Sequential vs. Parallel Execution Pitfall

A common beginner mistake is awaiting independent asynchronous tasks sequentially, leading to unnecessary delays:

```javascript
// SLOW (Sequential): Takes 1000ms + 1000ms = 2000ms
async function loadSlow() {
  const profile = await fetchProfile(); // Takes 1s
  const analytics = await fetchAnalytics(); // Takes 1s
  return { profile, analytics };
}

// FAST (Concurrent): Takes max(1000ms, 1000ms) = 1000ms!
async function loadFast() {
  // Fire both promises simultaneously
  const profilePromise = fetchProfile();
  const analyticsPromise = fetchAnalytics();

  // Await both together
  const [profile, analytics] = await Promise.all([profilePromise, analyticsPromise]);
  return { profile, analytics };
}
```

```
Sequential Execution:
  [ Fetch Profile (1s) ] ──► [ Fetch Analytics (1s) ]  ===> Total: 2s

Concurrent Execution:
  [ Fetch Profile (1s)   ]
  [ Fetch Analytics (1s) ]                             ===> Total: 1s
```

---

## Practice Quiz

### Q1: What does an async function always return?
- A) A Generator object
- B) A Promise
- C) undefined
- D) A standard callback function
**Answer:** B
**Explanation:** Any function marked with `async` always returns a Promise. If the function returns a primitive or object, JavaScript wraps it in `Promise.resolve()`.

### Q2: What happens if you use the await keyword inside a standard synchronous function?
- A) It runs normally
- B) It causes a SyntaxError
- C) It blocks the operating system thread
- D) It converts the function to async automatically
**Answer:** B
**Explanation:** `await` is only valid inside an `async` function or at the top level of an ES module; using it in a non-async function throws a `SyntaxError`.

### Q3: Does await freeze the entire browser window while waiting for a network request?
- A) Yes, JavaScript is single-threaded so everything stops
- B) No, it pauses only the execution of the async function; the Event Loop continues running other tasks
- C) Only in mobile browsers
- D) Yes, unless a Web Worker is used
**Answer:** B
**Explanation:** `await` suspends only the calling async function's execution context, leaving the main thread and Event Loop free to process clicks, animations, and other events.

### Q4: How is error handling typically implemented in async/await functions?
- A) With window.onerror
- B) Using standard try...catch blocks
- C) Using error callbacks
- D) By checking if return value is null
**Answer:** B
**Explanation:** In async/await, rejected promises throw exceptions that can be caught cleanly with standard `try...catch` statements.

### Q5: How should two independent network requests be awaited to minimize latency?
- A) Await them one after another
- B) Dispatch both promises concurrently and await them using Promise.all()
- C) Use setTimeout between requests
- D) Call JSON.parse() on both URLs
**Answer:** B
**Explanation:** Initiating promises concurrently and passing them to `Promise.all()` allows requests to run in parallel, reducing overall wait time.
