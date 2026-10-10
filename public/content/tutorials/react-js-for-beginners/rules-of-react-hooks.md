# Rules of React Hooks

## 1. What Are React Hooks?
Introduced in React 16.8, **Hooks** are functions that let you "hook into" React state and lifecycle features from functional components. Examples include `useState`, `useEffect`, `useContext`, `useRef`, and `useMemo`.

Because React relies on the internal execution order of functions to track hook state behind the scenes, you must adhere strictly to **The Two Rules of Hooks**.

```
React's Internal Fiber Node:
[Hook 1: useState(0)] ──> [Hook 2: useEffect(...)] ──> [Hook 3: useState('')]
(Hooks are stored as a singly linked list; order MUST NEVER CHANGE between renders!)
```

## 2. Rule 1: Only Call Hooks at the Top Level
**Do NOT call Hooks inside loops, conditions, nested functions, or try/catch blocks.**

Always call Hooks at the very top level of your React function, before any early returns:

```jsx
// ❌ FORBIDDEN: Calling hook inside a condition!
function UserProfile({ userId }) {
  if (userId) {
    const [user, setUser] = useState(null); // Violates Rule 1!
  }
  // ...
}

// ❌ FORBIDDEN: Calling hook inside a loop!
function FeatureMatrix({ features }) {
  for (let i = 0; i < features.length; i++) {
    useEffect(() => {}); // Violates Rule 1!
  }
  // ...
}

// ✅ CORRECT: Always call at the top level
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Put conditions INSIDE the hook, not around it!
    if (userId) {
      // Fetch user data...
    }
  }, [userId]);

  if (!userId) return <p>Please select a user.</p>;

  return <div>{user?.name}</div>;
}
```

### Why does this rule exist?
React does not track hooks by name or ID. Instead, React maintains an internal array / linked list of hook cells for each component instance. On every render, React matches each hook call with the next cell in the list. If a hook is skipped inside an `if` block, **every subsequent hook shifts out of position**, permanently corrupting the component's state!

## 3. Rule 2: Only Call Hooks from React Functions
**Do NOT call Hooks from regular JavaScript functions.**

You must only call Hooks from:
1. **React Functional Components:** Functions that return JSX and start with an uppercase letter.
2. **Custom Hooks:** Functions whose names start with `use` (e.g., `useFetch`, `useAuth`, `useLocalStorage`).

```jsx
// ❌ FORBIDDEN: Calling hook from a plain helper function
function calculateDiscount(price) {
  const [discount, setDiscount] = useState(0.1); // Violates Rule 2!
  return price * (1 - discount);
}

// ✅ CORRECT: Calling hook inside a Custom Hook
function useDiscount(price) {
  const [discount, setDiscount] = useState(0.1);
  return price * (1 - discount);
}
```

## 4. The ESLint Plugin for Hooks
React provides an official ESLint plugin: `eslint-plugin-react-hooks`. 

It includes two essential linting rules:
- `react-hooks/rules-of-hooks`: Enforces the two core rules automatically in your IDE and build step.
- `react-hooks/exhaustive-deps`: Verifies that all reactive dependencies are included in `useEffect` and `useCallback` dependency arrays.

---

## Practice Quiz

### Q1: Why must React Hooks only be called at the top level of a component?
- A) Because JavaScript cannot execute functions inside loops
- B) Because React relies on the exact call order of hooks across renders to match state with the correct hook cells
- C) To make components load faster in Google Chrome
- D) To prevent the browser from caching CSS files
**Answer:** B
**Explanation:** React stores hooks in an ordered list per component instance. Skipping a hook inside a conditional branch shifts the order, resulting in mismatched state values across all subsequent hooks.

### Q2: From which locations are you allowed to invoke a React Hook?
- A) Any standard JavaScript class or global utility function
- B) React functional components and custom hooks (functions starting with `use`)
- C) Inside HTML `<script>` tags only
- D) Inside backend Node.js route controllers
**Answer:** B
**Explanation:** Hooks may only be called from within React functional components or inside custom hooks prefixed with `use`.

### Q3: What should you do if you only want an effect to run when a certain condition is met?
- A) Wrap the `useEffect` hook inside an `if` statement
- B) Call `useEffect` at the top level, and place the `if` condition *inside* the effect callback
- C) Delete the effect
- D) Use an ES6 class component
**Answer:** B
**Explanation:** You must never wrap the hook call itself in a condition; instead, invoke the hook at the top level and place the conditional logic inside the callback function.

### Q4: What prefix must all custom React hooks begin with to adhere to the Rules of Hooks?
- A) `get`
- B) `use` (e.g. `useUserData`, `useWindowWidth`)
- C) `hook_`
- D) `react`
**Answer:** B
**Explanation:** Custom hooks must start with `use` by convention. This allows linters (like `eslint-plugin-react-hooks`) to identify the function as a hook and enforce hook rules.

### Q5: What happens if a component places a `useState` hook after an early `if (error) return null;`?
- A) The application works perfectly
- B) When `error` is true, the `useState` hook is skipped, violating Rule 1 and crashing subsequent renders
- C) React converts the hook to a Redux store
- D) The browser displays a 404 Page Not Found error
**Answer:** B
**Explanation:** Placing a hook after an early return means the hook is conditionally skipped whenever that early return executes, violating the top-level rule and corrupting hook order.
