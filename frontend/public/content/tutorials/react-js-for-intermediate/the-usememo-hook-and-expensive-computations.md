# The useMemo Hook and Expensive Computations

## 1. What is `useMemo`?
While `useCallback` caches a *function definition*, **`useMemo`** caches the **result of an expensive computation**.

$$\text{CachedResult} = \text{useMemo}(\text{calculateValue}, \text{dependencies})$$

On initial render, `useMemo` calls your calculation function and stores the result. On subsequent renders, React checks if the dependencies have changed:
- If dependencies are unchanged, React returns the cached result without running the calculation again.
- If dependencies have changed, React re-executes the calculation, stores the new result, and returns it.

```
Render 1:
useMemo(() => expensiveCalculation(data), [data]) ──► Runs calculation (takes 80ms) ──► Returns result

Render 2 (unrelated state changed, data is same):
useMemo(...) ──► Returns cached result instantly (takes 0.001ms)!
```

## 2. Practical Example: Filtering 10,000 Complex Records
```jsx
import React, { useState, useMemo } from 'react';

// Simulated heavy calculation
function performComplexAnalytics(transactions, threshold) {
  console.log('Running heavy analytics calculation...');
  // Intensive array filtering, grouping, and statistical variance calculation
  return transactions
    .filter(t => t.amount >= threshold)
    .reduce((acc, t) => acc + t.amount, 0);
}

export default function AnalyticsDashboard({ transactions }) {
  const [threshold, setThreshold] = useState(100);
  const [theme, setTheme] = useState('light');

  // ✅ useMemo caches the computed total:
  // When 'theme' changes, this expensive calculation is COMPLETELY SKIPPED!
  const totalVolume = useMemo(() => {
    return performComplexAnalytics(transactions, threshold);
  }, [transactions, threshold]); // Only recompute when transactions or threshold changes!

  return (
    <div className={`analytics-box theme-${theme}`}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Dashboard Theme
      </button>

      <h3>Analyzed Volume: ${totalVolume.toLocaleString()}</h3>
      
      <input
        type="range"
        min={0}
        max={1000}
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
      />
    </div>
  );
}
```

## 3. Difference Between `useMemo` and `useCallback`
Engineers often confuse the two hooks:
- **`useMemo`:** Invokes the function and caches its **return value** (`useMemo(() => computeVal(), deps)`).
- **`useCallback`:** Caches the **function itself** without executing it (`useCallback(() => doSomething(), deps)`).

In fact, `useCallback(fn, deps)` is simply syntactic sugar for:
```javascript
useMemo(() => fn, deps);
```

## 4. When Is a Calculation Truly "Expensive"?
Most everyday JavaScript operations (mapping 50 array elements, basic math, string concatenations) execute in fractions of a microsecond. Wrapping them in `useMemo` adds more overhead than it saves!

### How to measure:
Use `console.time()` or the React DevTools Profiler:
```javascript
console.time('filter');
const results = filterData(items);
console.timeEnd('filter');
```
If the calculation takes **less than 1ms**, memoization is unnecessary. If it takes **10ms or more**, wrapping it in `useMemo` delivers substantial real-world responsiveness gains.

---

## Practice Quiz

### Q1: What does the `useMemo` hook cache across component renders?
- A) A function reference
- B) The computed return value of a calculation function
- C) An HTML document
- D) An authentication cookie
**Answer:** B
**Explanation:** `useMemo` executes its callback and caches the returned calculation value, recomputing it only when dependencies change.

### Q2: How does `useMemo` differ from `useCallback`?
- A) `useMemo` is for class components; `useCallback` is for functional components
- B) `useMemo` caches the calculated result of executing a function; `useCallback` caches the function definition itself without executing it
- C) `useMemo` is deprecated in React 18
- D) `useCallback` only works with numbers
**Answer:** B
**Explanation:** `useMemo` stores the evaluated result of a function, whereas `useCallback` stores the callable function reference itself.

### Q3: When is wrapping a calculation in `useMemo` genuinely justified?
- A) For every mathematical addition (`1 + 1`) in your component
- B) When benchmarked calculations take noticeable time (e.g. 10ms+) over large datasets, or to stabilize object references passed to memoized children
- C) Only when running on Safari
- D) Whenever declaring a string
**Answer:** B
**Explanation:** `useMemo` should be reserved for verifiably expensive computations or for stabilizing object/array references that would otherwise break `React.memo` or effect dependencies.

### Q4: If `useMemo(() => computeTotal(items), [items])` has an unchanged `items` array, what does React do during render?
- A) It throws a warning
- B) It skips the computation entirely and immediately returns the previously cached value
- C) It reloads the webpage
- D) It calls the backend database
**Answer:** B
**Explanation:** Because the dependency has not changed, `useMemo` bypasses the calculation function and returns the cached result instantaneously.

### Q5: What is the equivalent of `useCallback(fn, deps)` expressed using `useMemo`?
- A) `useMemo(fn, deps)`
- B) `useMemo(() => fn, deps)`
- C) `useMemo(fn(), deps)`
- D) `useMemo([fn], deps)`
**Answer:** B
**Explanation:** `useCallback(fn, deps)` is identical to `useMemo(() => fn, deps)`, returning the function itself as the memoized value.
