# Asynchronous Iterators & Reactive Streams in Modern JavaScript

Handling continuous, real-time event streams (stock tickers, user keystrokes, sensor telemetry, WebSocket messages) requires combining asynchronous programming with functional operators. **Reactive Streams** and the **Observable Pattern** (popularized by RxJS) treat streams of events as collections over time that can be mapped, filtered, debounced, and combined.

---

## 1. Interactive Streams vs. Reactive Streams (Push vs. Pull)

```
Pull System (Async Iterators / for-await-of):
  Consumer pulls data: "Give me the next chunk when ready."
  [ Consumer ] ──► .next() ──► [ Producer ]

Push System (Observables / Reactive Streams):
  Producer pushes data: "Here is a new event immediately as it occurs!"
  [ Producer ] ──► .next(val) ──► [ Consumer ]
```

---

## 2. Implementing a Minimal Observable Pattern

An **Observable** is a lazily evaluated push-based collection:

```javascript
class Observable {
  constructor(subscribeFn) {
    this._subscribe = subscribeFn;
  }

  // Subscribe an observer
  subscribe(observer) {
    // Normalise observer object or callback
    const realObserver = typeof observer === 'function' ? { next: observer } : observer;
    return this._subscribe(realObserver);
  }

  // Functor Operator: map
  map(transformFn) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (val) => observer.next(transformFn(val)),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete()
      });
    });
  }

  // Operator: filter
  filter(predicateFn) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (val) => {
          if (predicateFn(val)) observer.next(val);
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete()
      });
    });
  }
}
```

---

## 3. Creating Observables from DOM Events

```javascript
function fromEvent(element, eventType) {
  return new Observable((observer) => {
    const handler = (e) => observer.next(e);
    element.addEventListener(eventType, handler);

    // Return teardown / unsubscribe function
    return () => {
      element.removeEventListener(eventType, handler);
      console.log(`Unregistered ${eventType} listener.`);
    };
  });
}

// Reactive Stream Pipeline:
const keyStream = fromEvent(document, 'keydown')
  .map(e => e.key)
  .filter(key => key !== ' '); // Ignore spaces

const subscription = keyStream.subscribe({
  next: key => console.log(`Key pressed: ${key}`)
});

// Later: Tear down stream
// subscription();
```

---

## 4. Converting Push Observables to Pull Async Iterators

You can bridge push-based Event Emitters or Observables to pull-based `for await...of` loops using an asynchronous buffer queue:

```javascript
function createAsyncQueue() {
  const values = [];
  const resolvers = [];

  return {
    push(val) {
      if (resolvers.length > 0) {
        const resolve = resolvers.shift();
        resolve({ value: val, done: false });
      } else {
        values.push(val);
      }
    },

    [Symbol.asyncIterator]() {
      return {
        next() {
          if (values.length > 0) {
            return Promise.resolve({ value: values.shift(), done: false });
          }
          return new Promise(resolve => resolvers.push(resolve));
        }
      };
    }
  };
}
```

---

## Practice Quiz

### Q1: What is the primary difference between an Async Iterator and an Observable?
- A) Async Iterators only work in Node.js
- B) Async Iterators use a pull model (consumer requests next value), whereas Observables use a push model (producer emits values as they arrive)
- C) Observables are synchronous
- D) Async Iterators cannot be looped
**Answer:** B
**Explanation:** Async iterators pull values on demand (`await iterator.next()`), while Observables push data proactively to subscribers whenever events occur.

### Q2: What three callbacks does an Observable Observer typically implement?
- A) start, stop, pause
- B) next(val), error(err), and complete()
- C) get, set, delete
- D) request, response, next
**Answer:** B
**Explanation:** The Observable contract specifies `next(val)` for streaming values, `error(err)` for exceptions, and `complete()` for stream termination.

### Q3: How do operators like map() and filter() work on Observables?
- A) They mutate the original array
- B) They return a new Observable that intercepts emissions from the source, transforms them, and passes them to the downstream observer
- C) They execute in WebAssembly
- D) They block the thread
**Answer:** B
**Explanation:** Observable operators return fresh Observable wrappers that intercept and transform emissions along a declarative processing pipeline.

### Q4: What does subscribing to an Observable return?
- A) A standard number
- B) A Subscription object or teardown function that cancels the stream and unregisters underlying listeners
- C) An ArrayBuffer
- D) A Promise
**Answer:** B
**Explanation:** Subscribing returns an unsubscribe handle or teardown function to detach event listeners and release resources.

### Q5: What popular enterprise library popularized reactive streams and operators in modern JavaScript?
- A) jQuery
- B) RxJS (Reactive Extensions for JavaScript)
- C) Lodash
- D) Axios
**Answer:** B
**Explanation:** RxJS is the industry-standard reactive programming library for composing asynchronous and event-based programs using observable sequences.
