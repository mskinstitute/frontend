# Promise Chaining in Modern JavaScript

One of the greatest advantages of Promises over callbacks is **Promise Chaining**. Because `.then()` always returns a brand-new Promise, you can chain sequential asynchronous operations into a clean, flat, readable pipeline with centralized error handling.

---

## 1. How Chaining Works

Whenever you return a value inside a `.then()` handler, the next `.then()` receives that value wrapped in a resolved Promise:

```javascript
Promise.resolve(5)
  .then(num => {
    console.log('Step 1:', num); // 5
    return num * 2;              // Returns 10
  })
  .then(doubled => {
    console.log('Step 2:', doubled); // 10
    return doubled + 20;             // Returns 30
  })
  .then(finalSum => {
    console.log('Step 3:', finalSum); // 30
  });
```

---

## 2. Returning Promises Inside .then()

If you return a **new Promise** from inside a `.then()` callback, the chain will pause until that inner Promise settles:

```javascript
function fetchUser(userId) {
  return Promise.resolve({ id: userId, name: 'Elena' });
}

function fetchUserPermissions(userId) {
  return Promise.resolve(['read', 'write', 'admin']);
}

// Flat, sequential asynchronous chain:
fetchUser(101)
  .then(user => {
    console.log(`Fetched user: ${user.name}`);
    return fetchUserPermissions(user.id); // Returning another Promise!
  })
  .then(permissions => {
    console.log('Fetched permissions:', permissions);
  })
  .catch(err => {
    console.error('Error occurred anywhere in the chain:', err);
  });
```

```
Execution Timeline:
  fetchUser(101) ──────► Fulfilled ({ name: 'Elena' })
                               │
                      fetchUserPermissions(101) ──► Fulfilled (['read', 'write'])
                                                         │
                                                    Final .then()
```

---

## 3. Centralized Error Handling

In a Promise chain, errors trickle down until they find the nearest `.catch()` handler. A single `.catch()` at the end can handle errors originating from **any** preceding step:

```javascript
fetchUserProfile()
  .then(profile => validateProfile(profile))
  .then(validData => saveToDatabase(validData))
  .then(record => sendConfirmationEmail(record.email))
  .catch(error => {
    // Catches validation failures, database errors, OR email errors!
    console.error('Pipeline failed:', error.message);
  });
```

---

## 4. Recovering from Errors in a Chain

If you return a fallback value from inside `.catch()`, subsequent `.then()` handlers can continue execution:

```javascript
function loadCachedConfig() {
  return { theme: 'default', offline: true };
}

fetchRemoteConfig()
  .catch(err => {
    console.warn('Remote config failed, falling back to cache...');
    return loadCachedConfig(); // Recover by returning fallback
  })
  .then(config => {
    console.log('Active configuration:', config); // Executes successfully!
  });
```

---

## 5. Parallel Promise Combinators

When operations are independent and do not rely on each other, run them concurrently:

| Method | Behavior | Resolves When... | Rejects When... |
| :--- | :--- | :--- | :--- |
| `Promise.all()` | Fail-fast parallel batch | All fulfill | Any single promise rejects |
| `Promise.allSettled()` | Complete audit | All settle (fulfilled or rejected) | Never rejects |
| `Promise.race()` | First responder | First promise settles | First promise settles |
| `Promise.any()` | First success | First promise fulfills | All promises reject (`AggregateError`) |

```javascript
// Run 3 independent API requests simultaneously:
const [users, products, settings] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/products').then(r => r.json()),
  fetch('/api/settings').then(r => r.json())
]);
```

---

## Practice Quiz

### Q1: What does a .then() handler return if it does not contain an explicit return statement?
- A) It throws a SyntaxError
- B) A Promise that resolves to undefined
- C) The original input value unmodified
- D) null
**Answer:** B
**Explanation:** In JavaScript functions without an explicit return statement return `undefined`. Therefore, `.then()` wraps `undefined` in a resolved Promise.

### Q2: How does Promise.all() behave if one of the promises in the array rejects?
- A) It waits for all others to finish, then rejects
- B) It ignores the rejected promise and returns the rest
- C) It immediately rejects with that error (fail-fast behavior)
- D) It automatically retries the rejected promise
**Answer:** C
**Explanation:** `Promise.all()` is "fail-fast": if any input promise rejects, the returned promise immediately rejects with that rejection reason.

### Q3: Which Promise method waits for all promises to finish and returns an array of status objects ({ status, value/reason }) without rejecting?
- A) Promise.race()
- B) Promise.allSettled()
- C) Promise.any()
- D) Promise.resolveAll()
**Answer:** B
**Explanation:** `Promise.allSettled()` waits until all promises have either fulfilled or rejected, returning an array of outcome objects describing each result.

### Q4: If an error is thrown inside the first .then() of a 4-step chain, where does control jump?
- A) It re-executes the first step
- B) It skips directly to the nearest .catch() handler down the chain
- C) It crashes the Node.js process immediately
- D) It continues to step 2 with error as an argument
**Answer:** B
**Explanation:** When an exception is thrown in a `.then()` callback, the promise rejects and execution skips all subsequent `.then()` handlers until finding a `.catch()`.

### Q5: What is the primary difference between Promise.any() and Promise.race()?
- A) Promise.any() ignores rejections and resolves with the first successful promise, whereas Promise.race() settles with whichever settles first (fulfilled OR rejected)
- B) Promise.race() only accepts two promises
- C) Promise.any() is synchronous
- D) There is no difference
**Answer:** A
**Explanation:** `Promise.race()` resolves or rejects as soon as the first promise settles. `Promise.any()` waits for the first *fulfilled* promise, only rejecting if *all* input promises reject.
