# Capstone Part 1: Architecture & State Store Design

In enterprise-scale frontend engineering, managing application state across dozens of decoupled components without prop-drilling or state divergence requires a centralized, predictable **State Store Architecture**. In this first capstone lesson, you will build a reactive, production-grade **Store Engine** implementing the Redux/Zustand pattern with immutable state updates, middleware pipelines, and subscriptions.

---

## 1. The Unidirectional Data Flow Architecture

```
                 ┌────────────────────────────────┐
                 │       UI Component (View)      │
                 └───────────────┬────────────────┘
                                 │ dispatch(action)
                                 ▼
                 ┌────────────────────────────────┐
                 │       Middleware Pipeline      │ (Logging, Crash Telemetry, Persistence)
                 └───────────────┬────────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │       Reducer Function         │ (Pure function: (state, action) => newState)
                 └───────────────┬────────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │       Central Store State      │
                 └───────────────┬────────────────┘
                                 │ notify subscribers
                                 ▼
                 ┌────────────────────────────────┐
                 │     Subscribed UI Components   │ (Re-render with fresh selector data!)
                 └────────────────────────────────┘
```

---

## 2. Implementing the Store Core

```javascript
class Store {
  #state;
  #reducer;
  #subscribers = new Set();
  #middlewares = [];

  constructor(reducer, initialState, middlewares = []) {
    this.#reducer = reducer;
    this.#state = Object.freeze({ ...initialState });
    this.#middlewares = middlewares;
  }

  // Read current state immutably
  getState() {
    return this.#state;
  }

  // Subscribe to state changes (returns unsubscribe function)
  subscribe(listener) {
    this.#subscribers.add(listener);
    return () => this.#subscribers.delete(listener);
  }

  // Dispatch an action through middleware to the reducer
  dispatch(action) {
    if (!action || typeof action.type !== 'string') {
      throw new TypeError('Actions must be objects with a string "type" property.');
    }

    // Execute middleware chain
    const runMiddleware = (index) => {
      if (index < this.#middlewares.length) {
        const middleware = this.#middlewares[index];
        middleware(this, action, () => runMiddleware(index + 1));
      } else {
        // Reducer execution after all middleware complete
        const nextState = this.#reducer(this.#state, action);
        this.#state = Object.freeze({ ...nextState });

        // Notify all subscribers
        this.#subscribers.forEach(listener => listener(this.#state));
      }
    };

    runMiddleware(0);
  }
}
```

---

## 3. Implementing Logging & LocalStorage Middleware

```javascript
// Middleware 1: Action Logger
const loggerMiddleware = (store, action, next) => {
  console.group(`[Action]: ${action.type}`);
  console.log('Previous State:', store.getState());
  console.log('Payload:', action.payload);
  next(); // Pass to next middleware
  console.log('Next State:', store.getState());
  console.groupEnd();
};

// Middleware 2: Persistent Storage Sync
const storageSyncMiddleware = (store, action, next) => {
  next(); // Run reducer first
  localStorage.setItem('app_state_backup', JSON.stringify(store.getState()));
};
```

---

## 4. Reducer & Selectors

```javascript
// Initial State
const initialAppState = {
  user: { name: 'Elena', role: 'admin' },
  notifications: [],
  theme: 'dark'
};

// Pure Reducer Function
function appReducer(state, action) {
  switch (action.type) {
    case 'THEME_TOGGLE':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'NOTIFICATION_ADD':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case 'NOTIFICATION_CLEAR':
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

// Selectors for targeted state queries
const selectTheme = state => state.theme;
const selectNotificationCount = state => state.notifications.length;
```

---

## 5. Usage & Verification

```javascript
const store = new Store(appReducer, initialAppState, [loggerMiddleware, storageSyncMiddleware]);

// Subscribe component listener
const unsubscribe = store.subscribe((newState) => {
  console.log('UI Render triggered! Current Theme:', selectTheme(newState));
});

// Dispatch actions
store.dispatch({ type: 'THEME_TOGGLE' });
store.dispatch({
  type: 'NOTIFICATION_ADD',
  payload: { id: 1, text: 'Backup completed successfully.' }
});

// Unsubscribe when component unmounts
unsubscribe();
```

---

## Practice Quiz

### Q1: What is the role of a Reducer in a unidirectional state store architecture?
- A) To make HTTP requests to the backend
- B) A pure function that takes current state and an action, returning the next immutable state
- C) To render CSS styles
- D) To compress images
**Answer:** B
**Explanation:** In unidirectional architectures (Redux pattern), reducers are pure functions `(state, action) => newState` with zero side effects.

### Q2: Why is the state object frozen with Object.freeze() inside the Store?
- A) To encrypt it
- B) To enforce immutability, preventing components from mutating state directly instead of dispatching actions
- C) To make it asynchronous
- D) To save battery
**Answer:** B
**Explanation:** Freezing state ensures immutability, throwing errors if a developer attempts `store.getState().theme = 'light'` directly.

### Q3: What is the responsibility of Middleware in a state store?
- A) To parse HTML templates
- B) To intercept dispatched actions before they reach the reducer to perform side effects like logging, analytics, or asynchronous API calls
- C) To render the UI
- D) To create database tables
**Answer:** B
**Explanation:** Middleware sits between action dispatch and the reducer, allowing side-effects (logging, async calls, persistence) to execute cleanly.

### Q4: Why do store.subscribe() methods return an unsubscribe function?
- A) To allow easy cleanup of event listeners when UI components are destroyed or unmounted
- B) To delete the state
- C) To restart the browser
- D) It is required by strict mode
**Answer:** A
**Explanation:** Returning `() => this.#subscribers.delete(listener)` allows components to unregister their subscription cleanly to prevent memory leaks.

### Q5: What is a "Selector" in modern state management?
- A) A CSS query selector
- B) A pure function that extracts and computes specific derived slices of data from the store state
- C) A SQL database query
- D) A Web Worker thread
**Answer:** B
**Explanation:** Selectors are pure functions (e.g. `state => state.user.name`) that encapsulate state access and compute derived properties.
