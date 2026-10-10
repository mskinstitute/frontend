# Memoization & Pure Functions in Modern JavaScript

Performance optimization in data-heavy and graphics-intensive web applications requires minimizing redundant calculations. By combining **Pure Functions** with **Memoization**, algorithms can trade memory for processing speed—caching previously computed results and retrieving them in $O(1)$ constant time.

---

## 1. The Foundation: Pure Functions

A function is considered **pure** if and only if it satisfies two conditions:
1. **Deterministic:** Given the same arguments, it **always** returns the exact same result.
2. **No Side Effects:** It does not mutate external state, perform I/O, modify global variables, or manipulate the DOM.

```javascript
// PURE FUNCTION: Deterministic, zero side effects
function calculateTax(amount, taxRate) {
  return amount * (1 + taxRate);
}

// IMPURE FUNCTION: Depends on external mutable state and time
let exchangeRate = 1.25;
function convertCurrency(amount) {
  return amount * exchangeRate; // Impure: Result changes if exchangeRate changes!
}
```

> **Golden Rule:** **Only pure functions can be safely memoized!** Memoizing an impure function will return stale cached values even when underlying conditions change.

---

## 2. What is Memoization?

**Memoization** is an optimization technique where a function caches its return values corresponding to specific input arguments. When invoked with arguments seen previously, it returns the cached result instead of re-evaluating the computation.

```
Function Invocation: fib(40)
  ├── 1st Call ──► Compute via CPU (takes 850ms) ──► Store in Cache ──► Return 102334155
  └── 2nd Call ──► Found in Cache!               ──► Immediate Return (takes 0.02ms)
```

---

## 3. Implementing a Generic Memoizer

```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    // Generate cache key by serializing arguments
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[Cache Hit] for arguments: ${key}`);
      return cache.get(key);
    }

    console.log(`[Cache Miss] Computing result for: ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Benchmarking Expensive Recursive Fibonacci

```javascript
// Unmemoized: O(2^n) exponential disaster
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version
const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fastFib(n - 1) + fastFib(n - 2);
});

console.time('FastFib');
console.log(fastFib(40)); // 102334155 (Runs in ~1 millisecond!)
console.timeEnd('FastFib');
```

---

## 4. Memory Management: LRU (Least Recently Used) Caching

An unbounded cache Map can cause memory leaks if called with millions of unique arguments. In production, use an **LRU Cache** that discards the least recently used keys when exceeding a capacity threshold:

```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    // Re-insert to mark as most recently used
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict oldest entry (first key in map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
```

---

## Practice Quiz

### Q1: What makes a function "pure" in functional programming?
- A) It is written in TypeScript
- B) It produces the same output for identical inputs and causes zero side effects
- C) It contains no comments
- D) It executes in less than 1 millisecond
**Answer:** B
**Explanation:** A pure function is deterministic (same input always produces same output) and produces no side effects (mutations, I/O, network calls).

### Q2: Why is it dangerous to memoize an impure function (e.g. one reading current time or external database state)?
- A) It crashes the JavaScript runtime
- B) It will return stale cached values instead of evaluating fresh external conditions
- C) It clears browser cookies
- D) It automatically converts the function to async
**Answer:** B
**Explanation:** Memoization relies on the assumption that identical arguments produce identical results. If a function depends on external mutable state, caching will deliver incorrect, stale results.

### Q3: What computational complexity does retrieving a memoized result from a hash map achieve?
- A) O(N) linear time
- B) O(log N) logarithmic time
- C) O(1) constant time
- D) O(N^2) quadratic time
**Answer:** C
**Explanation:** Hash maps (and JavaScript `Map` objects) provide $O(1)$ constant time lookup for cached keys.

### Q4: What common bug can occur if a generic memoize cache stores unlimited results without an eviction policy?
- A) Uncaught ReferenceError
- B) Memory leak due to unbounded cache growth in heap memory
- C) SyntaxError
- D) Stack overflow
**Answer:** B
**Explanation:** If arguments have high cardinality, an unbounded cache retains references to every computation indefinitely, consuming available RAM and causing memory leaks.

### Q5: What cache eviction strategy discards the least recently accessed items when reaching maximum capacity?
- A) FIFO (First In First Out)
- B) LRU (Least Recently Used)
- C) LIFO (Last In First Out)
- D) Random Drop
**Answer:** B
**Explanation:** An LRU (Least Recently Used) cache evicts the items that have not been read or updated for the longest period when full.
