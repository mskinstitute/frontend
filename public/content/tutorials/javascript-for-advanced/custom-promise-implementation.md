# Custom Promise Implementation (Promises/A+ Compliant)

There is no better way to deeply understand asynchronous JavaScript than to build a **Promises/A+ compliant Promise class** from scratch. This exercise demystifies state transitions, handler queues, and microtask scheduling.

---

## 1. The Core Specifications (Promises/A+)

1. **Three Mutually Exclusive States:** `PENDING`, `FULFILLED`, `REJECTED`.
2. **State Transition Guarantee:** `PENDING` can transition to `FULFILLED` (with a `value`) or `REJECTED` (with a `reason`). Once settled, state and value are immutable.
3. **The `.then()` Method:** Returns a **new Promise**, enabling chaining. Handlers must execute asynchronously via microtasks.

---

## 2. Step-by-Step Architecture

```
                 ┌────────────────────────────────┐
                 │          MyPromise             │
                 ├────────────────────────────────┤
                 │ state: PENDING                 │
                 │ value: undefined               │
                 │ fulfilledCallbacks: []         │
                 │ rejectedCallbacks: []          │
                 └───────────────┬────────────────┘
                                 │
                 ┌───────────────┴────────────────┐
                 │ resolve(val) / reject(err)     │
                 └───────────────┬────────────────┘
                                 │
                         queueMicrotask()
                                 │
                                 ▼
                     Drain registered callbacks
```

---

## 3. The Implementation

```javascript
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (val) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = val;
        // Drain callbacks asynchronously in microtask
        queueMicrotask(() => {
          this.onFulfilledCallbacks.forEach(cb => cb(this.value));
        });
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.value = reason;
        queueMicrotask(() => {
          this.onRejectedCallbacks.forEach(cb => cb(this.value));
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // Ensure handlers are functions; fallback to passthrough
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

    // .then() MUST return a brand new Promise!
    return new MyPromise((resolveNext, rejectNext) => {
      const handleCallback = (callback) => {
        try {
          const result = callback(this.value);
          // If returned value is itself a thenable/promise, resolve it
          if (result instanceof MyPromise) {
            result.then(resolveNext, rejectNext);
          } else {
            resolveNext(result);
          }
        } catch (error) {
          rejectNext(error);
        }
      };

      if (this.state === FULFILLED) {
        queueMicrotask(() => handleCallback(realOnFulfilled));
      } else if (this.state === REJECTED) {
        queueMicrotask(() => handleCallback(realOnRejected));
      } else {
        // Still PENDING: enqueue handlers
        this.onFulfilledCallbacks.push(() => handleCallback(realOnFulfilled));
        this.onRejectedCallbacks.push(() => handleCallback(realOnRejected));
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(val) {
    return new MyPromise((res) => res(val));
  }

  static reject(err) {
    return new MyPromise((_, rej) => rej(err));
  }
}
```

---

## 4. Testing the Implementation

```javascript
console.log('1. Start Test');

const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('Data Loaded!'), 500);
});

p.then((data) => {
  console.log('2. Step 1 Received:', data);
  return 'Next Pipeline Step';
})
.then((next) => {
  console.log('3. Step 2 Received:', next);
});

console.log('4. End Test');

// Logs:
// 1. Start Test
// 4. End Test
// (after 500ms):
// 2. Step 1 Received: Data Loaded!
// 3. Step 2 Received: Next Pipeline Step
```

---

## Practice Quiz

### Q1: Why must the .then() method return a brand-new Promise instance rather than returning this?
- A) To prevent memory leaks
- B) To allow promise chaining, where each step can resolve to a distinct new value independently
- C) Because JavaScript classes cannot return this
- D) To convert the promise to a Web Worker
**Answer:** B
**Explanation:** Promises/A+ requires that `.then()` returns a fresh Promise so subsequent callbacks receive the transformed return value of the previous handler.

### Q2: Why are registered callbacks executed inside queueMicrotask()?
- A) To ensure handlers execute asynchronously after the current execution context completes, as mandated by the Promises/A+ spec
- B) To run them on the GPU
- C) To make them cancellable
- D) To bypass strict mode
**Answer:** A
**Explanation:** Promises/A+ section 2.2.4 mandates that callbacks must not be called synchronously in the same turn of the event loop as `.then()`. `queueMicrotask()` satisfies this requirement.

### Q3: What happens if an executor function throws an uncaught synchronous exception?
- A) The program crashes immediately
- B) The promise is automatically rejected with the thrown error inside the try...catch block
- C) The error is converted to null
- D) The executor is retried
**Answer:** B
**Explanation:** Wrapping `executor(resolve, reject)` in a `try...catch` catches thrown exceptions and routes them directly to `reject(err)`.

### Q4: If onFulfilled is not a function in .then(null, onRejected), what default behavior must be implemented?
- A) Throw a TypeError
- B) Value passthrough: val => val
- C) Return undefined
- D) Reject the promise
**Answer:** B
**Explanation:** Promises/A+ specifies value passthrough: if `onFulfilled` is not a function, the promise passes the fulfilled value down the chain unchanged.

### Q5: What should happen if a .then() callback returns another Promise instance?
- A) It throws a circular dependency error
- B) The returning promise adopts the state and value of that inner promise once it settles
- C) It converts the promise into a string
- D) It executes synchronously
**Answer:** B
**Explanation:** When a handler returns a Promise, the chained Promise waits for that returned Promise to resolve or reject, adopting its resulting state and value.
