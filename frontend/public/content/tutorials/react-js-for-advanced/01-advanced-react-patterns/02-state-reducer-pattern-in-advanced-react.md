# State Reducer Pattern in Advanced React

## 1. The Limits of Control Props
While Control Props give the consumer ultimate control over state, it is an "all-or-nothing" proposition:
- In uncontrolled mode, the component does everything.
- In controlled mode, the consumer must manage *every single state transition* manually.

What if a consumer likes 95% of a component's internal logic, but wants to **intercept, modify, or block a specific state change**?

For example:
- A dropdown menu should close on select, *except* when holding the Shift key (multi-select).
- A counter should increment freely, *except* it must never exceed 4 clicks without confirming a modal.

The **State Reducer Pattern** solves this problem by allowing the consumer to pass a custom **reducer function** into the component to intercept internal state transitions!

```
Normal Transition:
[Action Dispatched] ──► [Internal Reducer] ──► [New State]

State Reducer Pattern:
[Action Dispatched] ──► [Internal Reducer calculates nextState]
                                     │
                                     ▼
                      [Consumer's custom stateReducer]
                      (Can modify, override, or block the update!)
                                     │
                                     ▼
                               [Final State Applied]
```

## 2. Implementing the State Reducer Pattern
Let's build an advanced Counter component that accepts a `stateReducer`:

```jsx
import React, { useReducer } from 'react';

// 1. Export Action Types so consumers can reference them
export const actionTypes = {
  increment: 'INCREMENT',
  decrement: 'DECREMENT',
  reset: 'RESET'
};

// 2. Default internal reducer
function defaultReducer(state, action) {
  switch (action.type) {
    case actionTypes.increment:
      return { count: state.count + 1 };
    case actionTypes.decrement:
      return { count: state.count - 1 };
    case actionTypes.reset:
      return { count: 0 };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

// 3. Component accepting a stateReducer prop
export default function AdvancedCounter({
  initialCount = 0,
  stateReducer = (state, action) => action.changes // Default: accept all changes
}) {
  // Enhanced reducer passes proposed changes to consumer's stateReducer!
  const enhancedReducer = (state, action) => {
    // A. Compute what the internal component wants to do
    const changes = defaultReducer(state, action);

    // B. Let the consumer intercept, inspect, and modify those changes!
    return stateReducer(state, { ...action, changes });
  };

  const [state, dispatch] = useReducer(enhancedReducer, { count: initialCount });

  return (
    <div className="counter-box">
      <h3>Count: {state.count}</h3>
      <button onClick={() => dispatch({ type: actionTypes.decrement })}>-</button>
      <button onClick={() => dispatch({ type: actionTypes.increment })}>+</button>
      <button onClick={() => dispatch({ type: actionTypes.reset })}>Reset</button>
    </div>
  );
}
```

## 3. Consumer Example: Enforcing Business Rules
Now, a consumer can intercept transitions cleanly without taking over the entire state:

```jsx
export default function RestrictedApp() {
  // Custom reducer intercepts state transitions
  const customReducer = (state, action) => {
    // Rule: Prevent incrementing beyond 5!
    if (action.type === actionTypes.increment && state.count >= 5) {
      alert('Maximum threshold reached!');
      return state; // Return existing state = BLOCK THE UPDATE!
    }

    // Otherwise, accept the component's calculated changes
    return action.changes;
  };

  return <AdvancedCounter initialCount={0} stateReducer={customReducer} />;
}
```

## 4. Architectural Superpowers of State Reducers
- **Inversion of Control:** The consumer injects decision-making logic directly into the heart of the component's state machine.
- **Zero Duplicate State:** The consumer doesn't need to maintain their own `useState` or copy state out of the component.
- **Composable Customizations:** Different consumers can apply totally different business policies to the exact same UI component.

---

## Practice Quiz

### Q1: What problem does the State Reducer Pattern solve in advanced React architecture?
- A) It speeds up database indexing
- B) It allows consumers to intercept, modify, or veto internal component state transitions without having to take over full state management
- C) It converts React into Redux
- D) It prevents CSS from loading
**Answer:** B
**Explanation:** The State Reducer pattern allows callers to pass a custom reducer function to selectively modify or block internal state updates while retaining default component logic.

### Q2: What is passed to the consumer's `stateReducer(state, action)` function?
- A) The current state and an action object augmented with the component's proposed `changes`
- B) Raw HTML DOM nodes
- C) Browser cookies
- D) An SQL statement
**Answer:** A
**Explanation:** The component passes the current state and the action (enriched with the proposed `changes` computed by the internal reducer) to the consumer's custom reducer.

### Q3: How can a consumer veto or cancel a state transition inside their `stateReducer`?
- A) By throwing a syntax error
- B) By returning the unmodified `state` directly, ignoring `action.changes`
- C) By calling `e.preventDefault()`
- D) By reloading the window
**Answer:** B
**Explanation:** Returning the existing, unchanged `state` effectively discards the proposed changes, blocking the transition completely.

### Q4: Why are `actionTypes` exported as a constant object in components implementing state reducers?
- A) To make the file size larger
- B) So consumers can reference exact action type strings safely in switch/if statements without typos
- C) To hide them from the user
- D) To satisfy CSS specifications
**Answer:** B
**Explanation:** Exporting an `actionTypes` object provides an authoritative dictionary of events that consumers can check against when intercepting updates.

### Q5: How does the State Reducer Pattern compare to the Control Props pattern?
- A) Control Props is an all-or-nothing takeover of state; State Reducer allows fine-grained interception of specific transitions while leaving default behaviors intact
- B) State Reducer is only supported in class components
- C) They are identical patterns
- D) Control Props is deprecated in React 18
**Answer:** A
**Explanation:** While Control Props requires the parent to manage all state updates, State Reducers permit targeted overrides of individual transition rules.
