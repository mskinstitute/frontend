# Performance API (performance.mark & measure)

While `console.time()` and `Date.now()` are useful for rudimentary logging, real enterprise performance instrumentation requires sub-millisecond precision and integration with browser performance profiling tools. The **User Timing API** (`performance.mark()` and `performance.measure()`) is the W3C standard for benchmarking code execution.

---

## 1. High-Resolution Time: `performance.now()`

`Date.now()` returns time in whole milliseconds and is subject to system clock adjustments (NTP syncs).

In contrast, **`performance.now()`** returns a floating-point number representing milliseconds with microsecond resolution (accurate to thousandths of a millisecond), measured monotonically from page creation:

```javascript
const t0 = performance.now();
executeComputation();
const t1 = performance.now();

console.log(`Execution took ${(t1 - t0).toFixed(3)} ms`);
// "Execution took 14.821 ms"
```

---

## 2. Using `performance.mark()` and `performance.measure()`

The User Timing API stores timestamped markers in the browser's high-speed Performance Timeline buffer:

```javascript
async function loadUserData(userId) {
  // Step 1: Create starting timestamp marker
  performance.mark('fetchUser:start');

  const res = await fetch(`/api/users/${userId}`);
  const data = await res.json();

  // Step 2: Create ending timestamp marker
  performance.mark('fetchUser:end');

  // Step 3: Measure the duration between the two marks
  const measure = performance.measure(
    'UserFetchDuration',  // Measure Name
    'fetchUser:start',    // Start Mark
    'fetchUser:end'       // End Mark
  );

  console.log(`User ${userId} fetched in ${measure.duration.toFixed(2)}ms`);
}
```

```
Performance Timeline:
  [fetchUser:start] ════════════════════════► [fetchUser:end]
                    ▲
                    │ performance.measure('UserFetchDuration')
                    ▼
          DevTools "Timings" Track displays visual measurement bar!
```

---

## 3. Visualizing in DevTools Performance Panel

When you run a profile in the DevTools **Performance** panel, any `performance.mark()` and `performance.measure()` entries appear automatically in the **Timings** flame-chart lane, providing visual context alongside network requests and layout frames!

---

## 4. Collecting Measures with PerformanceObserver

Rather than polling, use a `PerformanceObserver` to stream performance measurements asynchronously to analytics servers:

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`[Telemetry Metric] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
    // Send to DataDog / New Relic / Google Analytics:
    sendAnalyticsMetric({
      metricName: entry.name,
      durationMs: entry.duration,
      startTime: entry.startTime
    });
  }
});

// Register observer for custom user timing measures
observer.observe({ entryTypes: ['measure'] });
```

---

## 5. Cleaning Up Performance Markers

Clear the internal browser buffer to prevent memory buildup:

```javascript
// Clear specific marks and measures
performance.clearMarks('fetchUser:start');
performance.clearMeasures('UserFetchDuration');

// Or wipe all custom user timings:
// performance.clearMarks();
// performance.clearMeasures();
```

---

## Practice Quiz

### Q1: How does performance.now() differ from Date.now()?
- A) performance.now() returns seconds instead of milliseconds
- B) performance.now() provides monotonic, sub-millisecond microsecond precision unaffected by system clock adjustments
- C) Date.now() is asynchronous
- D) performance.now() only works in Node.js
**Answer:** B
**Explanation:** `performance.now()` measures monotonic time with fractional microsecond accuracy relative to the document origin, unaffected by manual OS clock changes.

### Q2: What method creates a named timestamp checkpoint in the browser's performance timeline?
- A) performance.checkpoint(name)
- B) performance.mark(name)
- C) performance.timestamp(name)
- D) console.timestamp(name)
**Answer:** B
**Explanation:** `performance.mark(markName)` inserts a named marker with high-resolution timestamp into the Performance Timeline.

### Q3: How do you calculate and record the duration between two performance marks?
- A) performance.measure(measureName, startMark, endMark)
- B) performance.diff(startMark, endMark)
- C) performance.calculate(startMark, endMark)
- D) performance.now() - performance.mark()
**Answer:** A
**Explanation:** `performance.measure(measureName, startMarkName, endMarkName)` computes the elapsed duration between two marks and stores it as a measure entry.

### Q4: Where do custom User Timing marks and measures appear in Chrome DevTools?
- A) In the Application Tab
- B) In the "Timings" lane of the Performance flame-chart
- C) In the CSS Styles tab
- D) In the Security panel
**Answer:** B
**Explanation:** DevTools automatically visualizes User Timing markers and measures inside the Timings track of the Performance profiler.

### Q5: What API allows real-time asynchronous streaming of performance metric entries to telemetry collectors?
- A) MutationObserver
- B) PerformanceObserver
- C) ResizeObserver
- D) TelemetryObserver
**Answer:** B
**Explanation:** `PerformanceObserver` asynchronously streams new performance records (navigation timings, resource timings, measures) as they occur.
