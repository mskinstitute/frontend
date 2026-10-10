# Mini Project: Interactive Counter with Step Controls

## 1. Project Overview & Requirements
In this hands-on mini-project, we will synthesize the foundational concepts of React—including `useState`, event handling, controlled inputs, and conditional rendering—into a full-featured, accessible **Interactive Counter with Step Controls**.

### Requirements:
1. **Value Management:** Maintain a current integer counter value.
2. **Step Increment / Decrement:** Allow users to choose their step magnitude (e.g. step by 1, 5, 10, or custom).
3. **Boundaries & Limits:** Enforce minimum (e.g. -50) and maximum (e.g. 100) boundaries with disabled button states.
4. **History Log:** Keep a chronological log of previous actions (timestamp, action type, resulting value).
5. **Reset Capability:** Reset the counter to 0 and clear history.

```
┌────────────────────────────────────────────────────────┐
│             Interactive Counter Utility                │
│                                                        │
│                    [  45  ]                            │
│                                                        │
│   Step Size: [ 5 ]                                     │
│   [ - Decrement ]     [ + Increment ]     [ Reset ]    │
│                                                        │
│   Audit History:                                       │
│   • 14:02:10 - Incremented by 5 (New Value: 45)        │
│   • 14:02:08 - Incremented by 5 (New Value: 40)        │
└────────────────────────────────────────────────────────┘
```

## 2. Component Implementation
```jsx
import React, { useState } from 'react';

const MIN_VALUE = -50;
const MAX_VALUE = 100;

export default function StepCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);

  // Helper to log actions
  const logAction = (action, prevVal, nextVal) => {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      description: `${action} (from ${prevVal} to ${nextVal})`
    };
    setHistory((prev) => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  // Handlers
  const handleIncrement = () => {
    setCount((prev) => {
      const next = Math.min(prev + step, MAX_VALUE);
      logAction(`Incremented by ${step}`, prev, next);
      return next;
    });
  };

  const handleDecrement = () => {
    setCount((prev) => {
      const next = Math.max(prev - step, MIN_VALUE);
      logAction(`Decremented by ${step}`, prev, next);
      return next;
    });
  };

  const handleReset = () => {
    logAction('Reset to zero', count, 0);
    setCount(0);
  };

  const handleStepChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    setStep(isNaN(parsed) || parsed < 1 ? 1 : parsed);
  };

  const isAtMin = count <= MIN_VALUE;
  const isAtMax = count >= MAX_VALUE;

  return (
    <div className="counter-container">
      <h2>Interactive Step Counter</h2>

      {/* Main Display */}
      <div className={`count-badge ${count > 0 ? 'positive' : count < 0 ? 'negative' : 'neutral'}`}>
        <span className="count-number">{count}</span>
      </div>

      {/* Limit Warnings */}
      {isAtMax && <p className="warning-text">Reached maximum limit of {MAX_VALUE}!</p>}
      {isAtMin && <p className="warning-text">Reached minimum limit of {MIN_VALUE}!</p>}

      {/* Controls */}
      <div className="controls-box">
        <label>
          Step Size:
          <input
            type="number"
            min="1"
            max="25"
            value={step}
            onChange={handleStepChange}
            className="step-input"
          />
        </label>

        <div className="button-row">
          <button onClick={handleDecrement} disabled={isAtMin} className="btn btn-secondary">
            - {step}
          </button>
          <button onClick={handleReset} className="btn btn-outline">
            Reset
          </button>
          <button onClick={handleIncrement} disabled={isAtMax} className="btn btn-primary">
            + {step}
          </button>
        </div>
      </div>

      {/* Audit History Log */}
      {history.length > 0 && (
        <div className="history-section">
          <h4>Recent Activity</h4>
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.id}>
                <span className="timestamp">[{item.time}]</span> {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 3. Key Architecture Concepts Illustrated
1. **Functional State Updates:** `setCount(prev => ...)` ensures accurate arithmetic even during rapid user clicks.
2. **Immutable Array History:** `setHistory(prev => [entry, ...prev])` prepends new log entries immutably without mutating previous history.
3. **Derived Boundary Disabling:** `isAtMin` and `isAtMax` are computed values during render, cleanly disabling buttons when limits are reached.

---

## Practice Quiz

### Q1: Why is `Math.min(prev + step, MAX_VALUE)` used when incrementing the counter?
- A) To convert strings to integers
- B) To enforce an upper boundary constraint so the count never exceeds `MAX_VALUE`
- C) To format the number as currency
- D) To prevent the browser from caching the value
**Answer:** B
**Explanation:** `Math.min` ensures that even if adding `step` would push the value over the maximum allowed boundary, the returned value clamps exactly at `MAX_VALUE`.

### Q2: How does the component limit the history log to the most recent 10 events?
- A) By calling a backend database trigger
- B) Using array slicing: `[entry, ...prev.slice(0, 9)]`
- C) By setting a CSS max-height
- D) By clearing localStorage
**Answer:** B
**Explanation:** Prepending the new entry and slicing the previous array from 0 to 9 keeps a maximum of 10 items in the state array.

### Q3: What is the benefit of computing `isAtMin = count <= MIN_VALUE` during render instead of storing `isAtMin` in a separate `useState`?
- A) It saves internet bandwidth
- B) It prevents state synchronization bugs; `isAtMin` is derived directly from `count` and is always 100% accurate
- C) `useState` does not support booleans
- D) It bypasses React StrictMode
**Answer:** B
**Explanation:** Calculating boolean status flags directly from existing state during render avoids redundant state variables that could get out of sync.

### Q4: Why is `parseInt(e.target.value, 10)` paired with `isNaN` checking in `handleStepChange`?
- A) HTML inputs only accept Roman numerals
- B) Input values are strings and can be empty or non-numeric; parsing ensures a valid positive integer fallback
- C) To encrypt the step input
- D) To prevent screen readers from reading the step
**Answer:** B
**Explanation:** Form inputs always return strings. Using `parseInt` with `isNaN` guarantees a valid numeric fallback if the user clears the input box.

### Q5: What HTML attribute is used to disable the increment button when the maximum threshold is reached?
- A) `hidden={isAtMax}`
- B) `disabled={isAtMax}`
- C) `readonly={isAtMax}`
- D) `block={isAtMax}`
**Answer:** B
**Explanation:** The `disabled` attribute prevents user clicks and instructs assistive technologies that the button is currently inactive.
