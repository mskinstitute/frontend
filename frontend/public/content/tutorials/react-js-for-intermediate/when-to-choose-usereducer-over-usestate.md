# When to Choose useReducer Over useState

## 1. The Limitations of `useState` in Complex Scenarios
For simple, isolated pieces of state (like toggling a boolean, incrementing a counter, or holding text in an input), **`useState`** is clean and sufficient.

However, as applications grow, you frequently encounter state logic where:
- Multiple pieces of state always change together in response to a single event.
- The next state depends on complex calculations involving multiple existing state properties.
- State transitions follow a strict business workflow or finite state machine (e.g. `idle` -> `fetching` -> `success` or `error`).
- Business rules and state mutations become scattered across multiple event handler functions throughout your component.

In these scenarios, managing state through disjointed `useState` setters causes synchronization bugs, race conditions, and messy code.

The solution is the **`useReducer`** hook.

```
useState:
Direct, imperative state mutations scattered across component handlers:
handleClick: setUser(u), setStatus('ok'), setError(null), setCart([])

useReducer:
Declarative actions dispatched to a centralized, pure reducer function:
handleClick: dispatch({ type: 'LOGIN_SUCCESS', payload: u })
```

## 2. What is `useReducer`?
`useReducer` is an alternative to `useState` modeled after Redux and functional programming state machines.

Instead of calling setter functions directly, components **dispatch actions** (plain JavaScript objects describing *what happened*). A centralized, pure function called the **reducer** receives the current state and the action, and computes the next state:

$$\text{NextState} = \text{reducer}(\text{CurrentState}, \text{Action})$$

## 3. Comparing `useState` vs `useReducer` in Code

### With `useState` (Scattered, Fragile):
```jsx
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    // 3 separate state setters! Easy to forget one or get out of sync
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/courses');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
}
```

### With `useReducer` (Centralized, Predictable):
```jsx
import React, { useReducer } from 'react';

// Pure reducer function defined OUTSIDE component
function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function DataFetcher() {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: null
  });

  const handleFetch = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch('/api/courses');
      const json = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: json });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };

  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p className="text-red">Error: {state.error}</p>}
      <button onClick={handleFetch}>Fetch Catalog</button>
    </div>
  );
}
```

## 4. Decision Matrix: `useState` vs `useReducer`

| Criterion | `useState` | `useReducer` |
| :--- | :--- | :--- |
| **Data Structure** | Primitives, independent values | Complex objects, nested arrays |
| **Transition Complexity** | Simple (direct assignment) | Complex business logic, state machines |
| **State Dependencies** | Next state is independent | Next state depends on multiple fields |
| **Testability** | Harder to test isolated logic | Trivial: Reducer is a pure JS function! |
| **Code Organization** | Setters scattered in handlers | Logic centralized in one place |

---

## Practice Quiz

### Q1: What is the primary role of the `useReducer` hook in React?
- A) To compress image files before uploading
- B) To manage complex state transitions using actions and a centralized, pure reducer function
- C) To reduce network bandwidth consumption
- D) To delete unused CSS classes
**Answer:** B
**Explanation:** `useReducer` provides a structured, predictable way to manage state transitions by decoupling what happened (an action) from how state updates (the reducer).

### Q2: What are the two arguments passed to a standard reducer function?
- A) `(state, action)`
- B) `(props, callback)`
- C) `(event, DOMNode)`
- D) `(url, payload)`
**Answer:** A
**Explanation:** A reducer accepts the current state and the incoming action object, returning the newly calculated next state.

### Q3: Why is a reducer function defined OUTSIDE the component body?
- A) JavaScript requires reducers to be global
- B) It is a pure function that does not depend on component-scoped props or closure variables, preventing unnecessary function recreations on renders
- C) To make it accessible to external websites
- D) To bypass React StrictMode
**Answer:** B
**Explanation:** Defining reducers outside the component emphasizes their purity (no side effects) and avoids reallocating the reducer function on every render.

### Q4: When should you prefer `useReducer` over `useState`?
- A) When state consists of simple, independent booleans
- B) When multiple state variables change together, state transitions are complex, or you want to unit-test state logic independently
- C) Only when writing TypeScript code
- D) When rendering static HTML
**Answer:** B
**Explanation:** `useReducer` is the preferred tool when state transitions involve multiple interdependent properties, follow strict business rules, or require isolated unit testing.

### Q5: What does the `useReducer` hook return when invoked?
- A) A single Promise
- B) A two-element array: `[currentState, dispatchFunction]`
- C) An HTML `<button>` element
- D) A string containing JSON
**Answer:** B
**Explanation:** Like `useState`, `useReducer` returns a two-element array: the current state value and the `dispatch` function used to send actions.
