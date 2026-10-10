# Context Performance and Preventing Render Cascades

## 1. The Context Re-render Cascade
While React Context is indispensable for ambient global data, it is notorious for causing **performance bottlenecks** when improperly implemented.

Here is the cardinal rule of React Context:
> **When a Context Provider's `value` reference changes, EVERY component that calls `useContext` for that Context WILL re-render, even if the specific data it uses didn't change!**

```
Problem: Unmemoized Object in Provider:
<SettingsContext.Provider value={{ theme, notifications, setNotifications }}>
```
Because `{ theme, notifications, setNotifications }` is a new object literal instantiated on *every* render of the Provider:
1. JavaScript creates a brand new memory reference `{}` on every render.
2. React checks `Object.is(oldValue, newValue)`. The memory address changed!
3. **Every consumer across the application re-renders unnecessarily!**

## 2. Solution 1: Memoizing Provider Values with `useMemo`
To prevent creating a new object reference on every render, wrap the context value in **`useMemo`**:

```jsx
import React, { useState, useMemo } from 'react';

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  // ✅ Memoize value: reference changes ONLY when dependencies change!
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    language,
    setLanguage
  }), [theme, language]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
```

## 3. Solution 2: Splitting Contexts (State vs Dispatch)
Consider an application with user data and shopping cart items. 
- Component A only needs to *display* the user's name.
- Component B only needs to *dispatch* an action to add an item to the cart.

If both values live in a single unified Context, Component A will re-render whenever the shopping cart updates!

**Best Practice:** Split unrelated state into separate contexts, or split **State** from **Dispatch/Updaters**:

```jsx
// Split into two specialized contexts
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartStateContext.Provider value={cart}>
      {/* dispatch function reference is stable and NEVER changes! */}
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Consumers only subscribe to what they need!
export const useCart = () => useContext(CartStateContext);
export const useCartDispatch = () => useContext(CartDispatchContext);
```
Now, a `<AddToCartButton>` component that only uses `useCartDispatch()` will **NEVER re-render** when items are added to the cart, because the `dispatch` function reference remains 100% stable!

## 4. Context vs State Management Libraries (Zustand, Redux)
If state updates happen frequently (e.g. 60 times a second on mouse movements, stock charts, or video timelines):
- **React Context is NOT designed for high-frequency updates.**
- Use specialized state management stores like **Zustand** or **Redux Toolkit**, which support fine-grained **selectors** that only re-render components when a specific targeted slice of state changes.

---

## Practice Quiz

### Q1: Why does `<MyContext.Provider value={{ count, setCount }}>` trigger re-renders in all consumers even when `count` has not changed?
- A) React cannot store objects in context
- B) A new object literal `{ ... }` is created with a new memory reference on every render, failing React's shallow equality comparison
- C) `setCount` is a mutable function
- D) Browsers force re-renders every second
**Answer:** B
**Explanation:** Object literals create new references in memory on every render. Because React uses reference equality (`Object.is`), it treats the context value as changed and re-renders all consumers.

### Q2: Which React hook is used to stabilize the Provider's `value` object reference across renders?
- A) `useCallback`
- B) `useMemo`
- C) `useRef`
- D) `useEffect`
**Answer:** B
**Explanation:** `useMemo(() => ({ a, b }), [a, b])` memoizes the object reference, recreating it only when its specific dependencies change.

### Q3: What is the architectural benefit of splitting Context into a State Context and a Dispatch Context?
- A) It removes the need for Redux
- B) Components that only dispatch actions (like buttons) can consume the stable Dispatch Context and never re-render when state changes
- C) It doubles the speed of CSS transitions
- D) It automatically validates TypeScript types
**Answer:** B
**Explanation:** Dispatch functions (like `dispatch` from `useReducer`) have permanent stable references. Separating state from dispatch prevents action-only components from re-rendering on data updates.

### Q4: Why is React Context NOT recommended for high-frequency streaming data (e.g. real-time cursor tracking at 60 FPS)?
- A) Context cannot store numbers
- B) Context lacks built-in selector subscriptions, meaning frequent updates trigger full-tree re-render cascades across all consumers
- C) Context only works in production builds
- D) WebSockets cannot be used with Context
**Answer:** B
**Explanation:** Context re-renders all subscribers whenever any part of its value changes. High-frequency state causes widespread re-render overhead without fine-grained selector libraries like Zustand.

### Q5: Can `React.memo` on an intermediate component prevent a child calling `useContext` from re-rendering when the context changes?
- A) Yes, `React.memo` stops all renders
- B) No, context updates bypass `React.memo` and propagate directly to any component that invokes `useContext`
- C) Only in class components
- D) Only on desktop browsers
**Answer:** B
**Explanation:** `useContext` establishes a direct subscription to the Provider. When the context value changes, React guarantees that the consuming component re-renders regardless of `React.memo` on ancestor components.
