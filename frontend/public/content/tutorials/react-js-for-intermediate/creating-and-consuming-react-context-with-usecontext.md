# Creating and Consuming React Context with useContext

## 1. The 3 Steps of Context
Working with React Context involves three distinct, sequential steps:
1. **Create the Context:** Call `createContext()` to define the data conduit and optional default fallback.
2. **Provide the Context:** Wrap the component subtree with `<Context.Provider value={...}>`.
3. **Consume the Context:** Read the provided value inside any descendant component using `useContext(Context)`.

```
[1. createContext()] ──> [2. <Context.Provider value={val}>] ──> [3. useContext(Context)]
```

## 2. Step 1: Creating the Context
In a dedicated module file (e.g., `src/context/ThemeContext.js`), create and export your context:

```javascript
// src/context/ThemeContext.js
import { createContext } from 'react';

// Create context with an optional default value
export const ThemeContext = createContext('light');
```

## 3. Step 2: Providing the Context
In a parent or top-level component, import the context and wrap your tree with `ThemeContext.Provider`:

```jsx
// src/App.jsx
import React, { useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import Header from './components/Header';
import CourseDashboard from './components/CourseDashboard';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    // Pass both current theme and updater function in context value
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-root theme-${theme}`}>
        <Header />
        <CourseDashboard />
      </div>
    </ThemeContext.Provider>
  );
}
```

## 4. Step 3: Consuming the Context with `useContext`
In any deeply nested child component, import the context object and invoke the **`useContext`** hook:

```jsx
// src/components/ThemeToggleButton.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggleButton() {
  // Directly consume context without prop drilling!
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme === 'dark' ? 'btn-dark' : 'btn-light'}`}
    >
      Current Theme: {theme.toUpperCase()} (Click to toggle)
    </button>
  );
}
```

## 5. How `useContext` Triggers Re-Renders
Whenever the `value` passed into `<ThemeContext.Provider value={...}>` changes:
- React automatically re-renders **every component that calls `useContext(ThemeContext)`**.
- This update bypasses intermediate components, even if those intermediate components are wrapped in `React.memo`!

---

## Practice Quiz

### Q1: What hook is used to consume a React Context in a functional component?
- A) `useStore()`
- B) `useContext()`
- C) `useProvider()`
- D) `useGlobal()`
**Answer:** B
**Explanation:** `useContext(MyContext)` accepts a Context object created by `createContext` and returns the current context value supplied by the nearest Provider.

### Q2: What must be passed as an argument to `useContext()`?
- A) A string containing the context's name (e.g. `'ThemeContext'`)
- B) The actual context object created by `createContext()` (e.g. `ThemeContext`)
- C) An array of components
- D) A DOM element ID
**Answer:** B
**Explanation:** `useContext` expects the Context object itself as its sole argument (e.g. `useContext(ThemeContext)`).

### Q3: What component must wrap the hierarchy for descendants to receive custom context values?
- A) `<Context.Wrapper>`
- B) `<Context.Provider value={...}>`
- C) `<Context.Consumer>`
- D) `<Context.Container>`
**Answer:** B
**Explanation:** `<Context.Provider value={...}>` is the component that broadcasts the context value down to all nested child consumers.

### Q4: If the context value updates, which components will React re-render?
- A) Only the root `<App>` component
- B) All descendant components that explicitly subscribe to that context via `useContext`
- C) Every component in the entire project, even if outside the Provider
- D) Only class components
**Answer:** B
**Explanation:** React identifies all components consuming that specific context and triggers targeted re-renders for them when the provider's `value` prop changes.

### Q5: What does `createContext(defaultValue)` return?
- A) A standard JavaScript Promise
- B) A Context object containing a `.Provider` component and a `.Consumer` component
- C) An HTML `<form>`
- D) A Redux reducer
**Answer:** B
**Explanation:** `createContext` returns a Context object with `.Provider` and `.Consumer` components that manage communication between distant nodes in the tree.
