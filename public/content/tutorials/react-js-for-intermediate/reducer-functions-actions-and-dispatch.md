# Reducer Functions, Actions, and Dispatch

## 1. The Anatomy of Reducer Architecture
The reducer pattern rests on three interconnected pillars:
1. **The State:** The current data snapshot of your component or feature.
2. **The Action:** A plain JavaScript object describing an event that occurred.
3. **The Dispatch Function:** The communication channel used to send actions to the reducer.
4. **The Reducer:** The pure decision-maker function that calculates the next state.

```
[User clicks "Enroll"]
         │
         ▼
dispatch({ type: 'ENROLL_STUDENT', payload: { id: 42, name: 'Ananya' } })
         │
         ▼
[Pure Reducer Function: (state, action) => newState]
         │
         ▼
[React updates state and triggers re-render]
```

## 2. Anatomy of an Action Object
By convention across the JavaScript and React ecosystem (Flux Standard Action pattern), an action object contains:
- **`type` (Required):** A descriptive string in `UPPER_SNAKE_CASE` or `domain/event` format stating what happened.
- **`payload` (Optional):** Any data required to execute the transition (e.g. an ID, an input string, an object).

```javascript
// Examples of descriptive, semantic actions:
{ type: 'TODO_ADDED', payload: 'Master React Reducers' }
{ type: 'FILTER_CHANGED', payload: 'completed' }
{ type: 'ITEM_DELETED', payload: 104 }
{ type: 'FORM_RESET' }
```

## 3. Writing Pure Reducer Functions
A reducer must adhere strictly to the rules of **pure functions**:
- **Zero Side Effects:** Never initiate API calls, start timers, modify localStorage, or trigger random numbers inside a reducer.
- **Strict Immutability:** Never mutate `state` in place. Always use object spread (`...state`) and non-mutating array methods (`map`, `filter`).
- **Deterministic:** Given the same state and action, it must always return the exact same output.

```jsx
export const initialCartState = {
  items: [],
  discountCode: null,
  totalPrice: 0
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => i.id === action.payload.id);
      let updatedItems;

      if (existingIndex > -1) {
        // Increment quantity immutably
        updatedItems = state.items.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item immutably
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: updatedItems,
        totalPrice: updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
      };
    }

    case 'REMOVE_ITEM': {
      const filtered = state.items.filter(i => i.id !== action.payload);
      return {
        ...state,
        items: filtered,
        totalPrice: filtered.reduce((acc, i) => acc + i.price * i.quantity, 0)
      };
    }

    case 'APPLY_DISCOUNT': {
      return {
        ...state,
        discountCode: action.payload,
        totalPrice: state.totalPrice * 0.9 // 10% off
      };
    }

    case 'CLEAR_CART':
      return initialCartState;

    default:
      // Return unchanged state or throw error for unrecognized actions
      return state;
  }
}
```

## 4. The Stability of `dispatch`
In React, **the `dispatch` function returned by `useReducer` is guaranteed to have a stable identity across all renders.**

React guarantees that `dispatch` will never change its reference between re-renders. This means:
- You do **not** need to include `dispatch` in `useEffect` or `useCallback` dependency arrays.
- Passing `dispatch` down through props or Context will **never** trigger unnecessary child re-renders!

---

## Practice Quiz

### Q1: What two properties are standard on a Flux Standard Action object?
- A) `name` and `data`
- B) `type` (descriptive string) and optional `payload` (action data)
- C) `query` and `mutation`
- D) `event` and `target`
**Answer:** B
**Explanation:** Standard action objects define a `type` indicating the event category and an optional `payload` carrying relevant parameters.

### Q2: What should happen if a reducer receives an unknown action type that it does not handle?
- A) It should crash the browser
- B) It should return the current `state` unchanged (or throw an explicit developer error in strict architectures)
- C) It should delete the database
- D) It should clear all localStorage
**Answer:** B
**Explanation:** The `default` branch in a reducer switch statement should return the existing `state` to preserve data integrity when unhandled actions pass through.

### Q3: Why is performing an asynchronous `fetch()` inside a reducer function strictly forbidden?
- A) JavaScript does not allow `fetch` in switch statements
- B) Reducers must be pure, synchronous functions that calculate state without side effects
- C) `fetch` is only supported in class components
- D) It causes an immediate syntax error in Vite
**Answer:** B
**Explanation:** Reducers must remain pure mathematical transformations $(\text{state}, \text{action}) \rightarrow \text{nextState}$. Asynchronous side effects belong in event handlers or `useEffect`.

### Q4: Does the `dispatch` function returned by `useReducer` change reference between component re-renders?
- A) Yes, on every single render
- B) No, React guarantees that `dispatch` is stable and preserves the exact same reference for the lifetime of the component
- C) Only when running in development mode
- D) Only when using TypeScript
**Answer:** B
**Explanation:** React guarantees that `dispatch` never changes identity across renders, making it safe to omit from hook dependency arrays.

### Q5: What makes reducers exceptionally easy to unit test compared to components?
- A) They are written in binary
- B) They are pure functions with no DOM or React rendering dependencies; you simply pass inputs `(state, action)` and assert on the returned object
- C) They can only be tested on Linux
- D) They automatically write their own tests
**Answer:** B
**Explanation:** Because reducers are plain JavaScript functions without DOM or React runtime dependencies, unit testing them requires no complex mocking or DOM rendering wrappers.
