# Promises Basics in Modern JavaScript

A `Promise` is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. Introduced in ES6, Promises provide a structured, standardized abstraction over asynchronous programming, replacing error-prone nested callbacks.

---

## 1. The Three States of a Promise

A Promise exists in one of three mutually exclusive states:

```
                  ┌───────────────┐
                  │    PENDING    │ (Initial state, operation in progress)
                  └───────┬───────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
  ┌───────────────┐               ┌───────────────┐
  │   FULFILLED   │               │   REJECTED    │
  │   (Success)   │               │   (Failure)   │
  └───────────────┘               └───────────────┘
```

1. **Pending:** Initial state; the asynchronous operation is still running.
2. **Fulfilled (Resolved):** The operation completed successfully with a resulting value.
3. **Rejected:** The operation failed with a reason or error object.

> **Immutability Guarantee:** Once a Promise transitions to Fulfilled or Rejected (termed *settled*), its state and value can never change again.

---

## 2. Creating a Promise: The Promise Constructor

The `Promise` constructor accepts an executor function with two arguments: `resolve` and `reject`.

```javascript
function fetchServerStatus(isHealthy) {
  return new Promise((resolve, reject) => {
    console.log('Initiating server health check...');

    setTimeout(() => {
      if (isHealthy) {
        resolve({ status: 200, uptime: '99.99%', message: 'System Operational' });
      } else {
        reject(new Error('503 Service Unavailable: Database unreachable'));
      }
    }, 1500);
  });
}
```

---

## 3. Consuming Promises: .then(), .catch(), and .finally()

To handle the outcome of a Promise, use handler methods:

```javascript
fetchServerStatus(true)
  .then((data) => {
    // Executes ONLY if fulfilled
    console.log('Health Check Passed:', data.message);
    return data.status;
  })
  .catch((error) => {
    // Executes if rejected OR if an error was thrown in .then()
    console.error('Health Check Failed:', error.message);
  })
  .finally(() => {
    // Executes in ALL cases (settled)
    console.log('Health check cycle completed.');
  });
```

```
Promise Lifecycle:
  fetchServerStatus()
         │
    [Pending]
         │
    Settled? ────── Fulfilled ──► .then(data => ...)
         │
         └───────── Rejected  ──► .catch(err => ...)
         │
         ▼
    .finally(() => cleanup())
```

---

## 4. Static Helper Methods: Promise.resolve() & Promise.reject()

Quickly instantiate already-settled promises:

```javascript
// Returns a Promise fulfilled immediately with 42
const instantSuccess = Promise.resolve(42);

// Returns a Promise rejected immediately with an Error
const instantFailure = Promise.reject(new Error('Unauthorized access'));
```

---

## Practice Quiz

### Q1: Which of the following is NOT a valid state of a JavaScript Promise?
- A) Pending
- B) Fulfilled
- C) Rejected
- D) Paused
**Answer:** D
**Explanation:** A Promise only has three states: `pending`, `fulfilled`, and `rejected`.

### Q2: What happens once a Promise reaches either the Fulfilled or Rejected state?
- A) It can be reset to pending by calling promise.reset()
- B) Its state is immutable and can never change again
- C) It triggers a browser garbage collection cycle immediately
- D) It automatically restarts after 5000ms
**Answer:** B
**Explanation:** Once a Promise is settled (either fulfilled or rejected), it becomes immutable; subsequent calls to `resolve()` or `reject()` are ignored.

### Q3: What method is guaranteed to run when a Promise finishes, regardless of whether it was fulfilled or rejected?
- A) .then()
- B) .catch()
- C) .finally()
- D) .always()
**Answer:** C
**Explanation:** `.finally()` runs whenever a Promise settles, making it ideal for cleanup operations like hiding loading spinners.

### Q4: How does a Promise handle uncaught exceptions thrown inside its executor function?
- A) It crashes the browser tab
- B) It automatically rejects the Promise with the thrown error
- C) It ignores the error and returns undefined
- D) It retries 3 times
**Answer:** B
**Explanation:** The Promise executor wraps code in an implicit try-catch; if an error is thrown, the Promise is automatically rejected with that error.

### Q5: What does Promise.resolve('Hello') return?
- A) A plain string 'Hello'
- B) A Promise fulfilled with the value 'Hello'
- C) A Promise in pending state indefinitely
- D) An array ['Hello']
**Answer:** B
**Explanation:** `Promise.resolve(val)` returns a Promise that is immediately resolved with the provided value.
