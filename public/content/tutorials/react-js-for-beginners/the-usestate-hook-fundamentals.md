# The useState Hook Fundamentals

## 1. Introducing `useState`
The **`useState`** hook is the fundamental tool for introducing local state into a React functional component. It is imported directly from the `'react'` package.

```jsx
import { useState } from 'react';
```

## 2. Anatomy of `useState`
When you call `useState`, you pass the **initial state value** as an argument. It returns an array containing exactly two items:

```jsx
const [state, setState] = useState(initialValue);
```
1. **The State Variable (`state`):** The current value of the state on this render.
2. **The Updater Function (`setState`):** A function that updates the state variable and triggers React to re-render the component.

### ES6 Array Destructuring
Because `useState` returns a 2-element array `[currentValue, updaterFunction]`, React developers use ES6 array destructuring to assign custom names:
```jsx
// Destructuring the 2-element array
const [count, setCount] = useState(0);
const [name, setName] = useState('Rahul');
const [isOpen, setIsOpen] = useState(false);
const [items, setItems] = useState([]);
```
*Convention: If the state variable is named `foo`, the updater function is conventionally named `setFoo`.*

## 3. A Complete Working Example: Interactive Counter
```jsx
import React, { useState } from 'react';

export default function Counter() {
  // Declare state variable 'count' initialized to 0
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <h2>Interactive Counter</h2>
      <p className="count-display">Current value: {count}</p>
      
      <div className="btn-group">
        <button onClick={() => setCount(count + 1)}>
          Increment (+)
        </button>
        <button onClick={() => setCount(count - 1)}>
          Decrement (-)
        </button>
        <button onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
```

## 4. How `useState` Works Across Renders
Let's trace what happens when the user clicks "Increment (+)":
1. **Initial Mount:**
   - React executes `Counter()`.
   - `useState(0)` returns `[0, setCount]`.
   - React renders `<p>Current value: 0</p>`.
2. **User Clicks Increment:**
   - `setCount(0 + 1)` is called with value `1`.
   - React records the new state for this component instance as `1` and queues a re-render.
3. **Re-render:**
   - React executes `Counter()` a second time.
   - `useState(0)` is invoked again, but React remembers that state is now `1`! It returns `[1, setCount]`.
   - React renders `<p>Current value: 1</p>`.
   - React diffs the Virtual DOM and updates the text node in the real DOM from `0` to `1`.

## 5. Lazy Initial State
If your initial state requires an expensive computation (e.g., parsing a large JSON file or reading from `localStorage`), do not execute the function directly in `useState(...)` because it will run on **every single render**:

```jsx
// ❌ Inefficient: Reads localStorage on EVERY render
const [token, setToken] = useState(localStorage.getItem('auth_token'));

// ✅ Efficient: Lazy initial state function runs ONLY on initial mount
const [token, setToken] = useState(() => {
  return localStorage.getItem('auth_token') || '';
});
```

---

## Practice Quiz

### Q1: What does the `useState` hook return?
- A) A promise that resolves when the DOM finishes painting
- B) An array containing exactly two items: the current state value and an updater function
- C) A single string containing the component's HTML markup
- D) An object with `get` and `set` prototype methods
**Answer:** B
**Explanation:** `useState` returns a two-element tuple/array: `[currentValue, updaterFunction]`, which is conventionally unpacked using ES6 array destructuring.

### Q2: What naming convention is universally followed for state updater functions?
- A) `update[State]`
- B) `set[State]` (e.g. `count` -> `setCount`)
- C) `change[State]`
- D) `mutate[State]`
**Answer:** B
**Explanation:** The React community adheres to the `[value, setValue]` naming pattern (e.g., `const [isVisible, setIsVisible] = useState(false);`).

### Q3: When does React apply the initial value passed into `useState(initialValue)`?
- A) On every single re-render of the component
- B) Only during the component's initial mount/first render
- C) Only when the browser tab loses focus
- D) Only after the user refreshes the page
**Answer:** B
**Explanation:** The argument passed to `useState` is used strictly as the initial state during the initial mount. On subsequent re-renders, React returns the updated state value.

### Q4: Why would a developer pass a callback function to `useState(() => getInitialData())`?
- A) To create an infinite loop
- B) To implement lazy initialization so expensive computations only run once during initial mount
- C) To make the state accessible to other web browsers
- D) To bypass React StrictMode
**Answer:** B
**Explanation:** Passing a function (initializer function) to `useState` enables lazy initialization, ensuring expensive setup logic executes only on the initial mount rather than on every re-render.

### Q5: What happens if you call `setCount(5)` when the current count is already `5`?
- A) React crashes with an Uncaught Exception
- B) React bails out of re-rendering because it uses `Object.is` to detect that state hasn't changed
- C) React renders the entire application twice
- D) React resets the value to `0`
**Answer:** B
**Explanation:** React uses `Object.is` equality comparison; if you update state to the exact same value it already holds, React bails out without re-rendering children or firing effects.
