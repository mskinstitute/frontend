# The Dependency Array and Execution Lifecycle

## 1. Controlling Effect Execution
The second argument passed to `useEffect` is the **Dependency Array**. This array tells React exactly which state variables or props the effect relies on.

React evaluates the dependency array using **shallow equality (`Object.is`)** before every re-render to determine whether the effect callback should run again.

```
Does dependencyArray exist?
 ├─ NO  ──> Runs on INITIAL MOUNT and AFTER EVERY RE-RENDER
 │
 ├─ YES: [] (Empty) ──> Runs ONLY ONCE on INITIAL MOUNT
 │
 └─ YES: [a, b] ──> Runs on INITIAL MOUNT and ONLY WHEN 'a' OR 'b' CHANGES
```

## 2. The 3 Dependency Array Modes

### Mode 1: No Dependency Array (Run on Every Render)
```jsx
useEffect(() => {
  console.log('Component rendered or re-rendered!');
});
// ⚠️ WARNING: If you update state inside an effect with no dependencies,
// you will create an INFINITE RENDER LOOP!
```

### Mode 2: Empty Dependency Array `[]` (Run on Mount Only)
```jsx
useEffect(() => {
  console.log('Component mounted to screen!');
  fetchInitialAnalytics();
}, []);
// Runs once when the component first appears on the screen.
```

### Mode 3: Specific Dependencies `[dep1, dep2]` (Run on Change)
```jsx
useEffect(() => {
  console.log(`User ID changed to: ${userId}. Fetching user profile...`);
  fetchUserProfile(userId);
}, [userId]);
// Runs on mount AND whenever the value of userId changes.
```

## 3. The Golden Rule of Dependencies
**Every reactive value referenced inside your effect callback MUST be included in the dependency array.**

A "reactive value" includes:
- Props
- State variables
- Variables or functions declared inside the component body

```jsx
function SearchResults({ query }) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // 'query' comes from props; 'filter' comes from state.
    // Both MUST be in the dependency array!
    fetchResults(query, filter);
  }, [query, filter]); // ✅ All reactive values included!
}
```

## 4. The Pitfall of Objects and Functions in Dependencies
Because React checks dependencies using reference equality (`Object.is`), defining objects or functions inside your component body can trigger unwanted effect runs:

```jsx
function Dashboard() {
  // ❌ Problem: options is a brand new object reference on EVERY render!
  const options = { theme: 'dark' };

  useEffect(() => {
    applyTheme(options);
  }, [options]); // Effect runs on EVERY render because options reference changes!

  // ✅ Solution: Move static objects outside the component, or use useMemo
}
```

---

## Practice Quiz

### Q1: What happens if you omit the dependency array entirely in `useEffect(() => { ... })`?
- A) The effect never executes
- B) The effect executes after the initial render AND after every subsequent re-render
- C) React throws a syntax compilation error
- D) The effect runs only when the user clicks a button
**Answer:** B
**Explanation:** Without a dependency array, React runs the effect after every single render of the component.

### Q2: What happens if you update a state variable inside an effect that has NO dependency array?
- A) The state update is safely ignored
- B) You trigger an infinite loop: render -> effect -> setState -> render -> effect -> setState...
- C) React pauses the application for 10 seconds
- D) The browser reloads the page
**Answer:** B
**Explanation:** Updating state triggers a re-render. Since the effect has no dependencies, it runs again after that re-render and updates state again, resulting in an infinite loop that can freeze the browser.

### Q3: What comparison mechanism does React use to check if dependencies have changed?
- A) Deep JSON string comparison (`JSON.stringify`)
- B) Shallow reference equality comparison using `Object.is`
- C) HTML DOM inspection
- D) Timestamp comparison
**Answer:** B
**Explanation:** React compares previous and current dependency values using `Object.is` (shallow equality).

### Q4: Which variables MUST be included in the `useEffect` dependency array?
- A) Only variables declared with the `var` keyword
- B) All reactive values (props, state, and variables derived from them) referenced inside the effect function
- C) Only CSS class names
- D) Global window variables
**Answer:** B
**Explanation:** To prevent stale closures, all reactive values from props, state, or component-scope functions referenced inside the effect must be declared in the dependency array.

### Q5: Why can declaring an object literal inside a component body and passing it to a dependency array cause an effect to run repeatedly?
- A) Objects cannot be stored in RAM
- B) JavaScript creates a brand new object reference in memory on every render, failing shallow equality checks (`Object.is`)
- C) Objects are converted to numbers by React
- D) Objects automatically trigger browser refreshes
**Answer:** B
**Explanation:** In JavaScript, `{}` !== `{}`. Every time the component renders, a new object reference is created in memory, causing React to treat the dependency as changed every time.
