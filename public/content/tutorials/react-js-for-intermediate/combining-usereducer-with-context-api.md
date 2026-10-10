# Combining useReducer with Context API

## 1. The Ultimate Lightweight Global State Pattern
For small applications, `useState` is sufficient. For massive enterprise applications with dozens of developers, Redux Toolkit or Zustand are common choices.

However, for mid-sized applications, design systems, and modular feature trees, **combining `useReducer` with the Context API** provides a complete, scalable state management architecture with **zero external dependencies**!

```
               [Root Context Provider]
            (Holds useReducer state & dispatch)
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
[useCart() - Reads State]      [useCartDispatch() - Sends Actions]
(Catalog, Cart Drawer, Badges) (Add Button, Remove Button, Checkout)
```

## 2. Implementing the Combined Cart Store
Let's build a production-grade shopping cart store:

```jsx
// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 1. Define Separate State and Dispatch Contexts
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

const STORAGE_KEY = 'msk_cart_state';

// 2. Reducer Function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.find(item => item.id === action.payload.id);
      if (exists) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);

    case 'CLEAR_CART':
      return [];

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// 3. Provider Component
export function CartProvider({ children }) {
  // Initialize state lazily from localStorage
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return (
    <CartStateContext.Provider value={cart}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// 4. Custom Consumer Hooks
export function useCart() {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context) {
    throw new Error('useCartDispatch must be used within a <CartProvider>');
  }
  return context;
}
```

## 3. High-Performance Consumer Usage

### Component 1: Navbar Badge (Reads State Only)
```jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const cart = useCart(); // Subscribed to state updates
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <div className="badge">Cart: {totalQuantity}</div>;
}
```

### Component 2: Add Button (Dispatches Actions Only)
```jsx
import React from 'react';
import { useCartDispatch } from '../context/CartContext';

export default function AddToCartButton({ course }) {
  const dispatch = useCartDispatch(); // Consumes STABLE dispatch reference!

  return (
    <button
      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: course })}
      className="btn-add"
    >
      Enroll Now (${course.price})
    </button>
  );
}
```
Because `AddToCartButton` only consumes `CartDispatchContext`, **it will NEVER re-render when items are added to the cart!**

---

## Practice Quiz

### Q1: What makes combining `useReducer` with Context an attractive state management solution?
- A) It eliminates the need for Node.js
- B) It provides a complete, scalable Redux-like global store architecture using built-in React hooks with zero external dependencies
- C) It converts React JSX into HTML templates
- D) It guarantees 0ms network latency
**Answer:** B
**Explanation:** The `useReducer` + Context pattern delivers predictable, action-driven state management natively without needing third-party libraries like Redux or MobX.

### Q2: Why are two separate contexts (`CartStateContext` and `CartDispatchContext`) created?
- A) React prohibits storing functions in context
- B) To optimize performance: components that only dispatch actions never re-render when state updates occur
- C) To support both light mode and dark mode
- D) To satisfy CSS specifications
**Answer:** B
**Explanation:** Splitting state from dispatch ensures that action-dispatching components (like buttons) subscribe only to the stable dispatch context and avoid re-rendering on state mutations.

### Q3: How is initial state lazily loaded in `useReducer(cartReducer, [], initializerFunction)`?
- A) By downloading a script from Google
- B) By passing an initializer function as the third argument to `useReducer`, which runs only once on initial mount to read `localStorage`
- C) React loads data automatically from SQLite
- D) `useReducer` does not support lazy initialization
**Answer:** B
**Explanation:** Like `useState`, `useReducer` accepts an optional third argument (an init function) to lazily calculate initial state on mount without blocking subsequent renders.

### Q4: What happens if an unknown action type is dispatched to a reducer that ends with `throw new Error(...)`?
- A) The computer crashes
- B) An immediate runtime error surfaces during development, alerting the engineer to an unhandled or misspelled action type
- C) React silently refreshes the page
- D) The action is converted to a string
**Answer:** B
**Explanation:** Throwing an error in the reducer's `default` branch immediately catches typo bugs (e.g. `'ADD_TO_CAR'` instead of `'ADD_TO_CART'`).

### Q5: How do consumer components add items to the cart when using this architecture?
- A) By directly mutating `cart.push(item)`
- B) By calling `dispatch({ type: 'ADD_TO_CART', payload: item })`
- C) By editing `index.html`
- D) By restarting the browser
**Answer:** B
**Explanation:** Consumers invoke the `dispatch` function with a typed action object, keeping state mutations centralized and predictable within the reducer.
