# Component Props and Read-Only Data Flow

## 1. What Are Props?
In React, **props** (short for "properties") are the mechanism by which components communicate with each other. Just as HTML elements accept attributes to customize their behavior (`<a href="https://example.com">`), React components accept props passed down from parent components.

Props can be any valid JavaScript value: strings, numbers, booleans, objects, arrays, functions (callbacks), or even other React elements.

```jsx
// Parent component passing props
function Dashboard() {
  return (
    <div className="dashboard-grid">
      <UserCard
        name="Ananya Roy"
        role="Frontend Architect"
        yearsExperience={6}
        isActive={true}
      />
    </div>
  );
}

// Child component receiving props object
function UserCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>Role: {props.role}</p>
      <p>Experience: {props.yearsExperience} years</p>
      <span className={props.isActive ? 'badge-green' : 'badge-gray'}>
        {props.isActive ? 'Active' : 'Offline'}
      </span>
    </div>
  );
}
```

## 2. Unidirectional Top-Down Data Flow
React enforces strict **unidirectional (one-way) data binding**:
- Data flows strictly from parent components down to child components.
- A child component has no built-in way to directly mutate or reassign the props given to it by its parent.
- If a child needs to inform the parent of an event or change, the parent passes a **callback function** down as a prop, which the child invokes.

```
Parent Component (Source of Truth: state = "dark")
         │
         ▼ (passes prop theme="dark")
Child Component (Renders UI based on theme prop)
```

## 3. Props are Read-Only (Immutable)
A cardinal rule in React engineering is: **Components must never mutate their own props.**

In JavaScript terms, props are treated as frozen, read-only values:
```jsx
// ❌ Anti-pattern: Modifying props directly is forbidden!
function Profile(props) {
  props.name = props.name.toUpperCase(); // Mutates prop object!
  props.viewCount += 1;                  // Mutates prop object!

  return <div>{props.name} ({props.viewCount})</div>;
}

// ✅ Correct Pattern: Derive new values or declare local variables
function Profile(props) {
  const formattedName = props.name.toUpperCase();
  const nextCount = props.viewCount + 1;

  return <div>{formattedName} ({nextCount})</div>;
}
```
If React permitted components to modify incoming props, child components could unexpectedly corrupt parent data structures, creating chaotic debugging nightmares across large applications.

## 4. Passing Non-String Props
Remember to enclose non-string values (numbers, booleans, objects, arrays) in curly braces:
```jsx
// Strings can use regular quotes
<Badge text="Pro Member" />

// Numbers, booleans, objects, and arrays MUST use curly braces
<Badge count={42} isVerified={true} settings={{ theme: 'dark' }} tags={['js', 'react']} />
```

---

## Practice Quiz

### Q1: What are props in React?
- A) Private variables that only class components can access
- B) Inputs passed from parent components to child components to customize behavior and rendering
- C) Database credentials stored in `.env` files
- D) Global CSS styles applied to the root window
**Answer:** B
**Explanation:** Props (properties) are read-only inputs passed from a parent component down to a child component, enabling dynamic and customizable component rendering.

### Q2: Why is mutating a prop directly inside a child component forbidden in React?
- A) JavaScript will immediately delete the browser cache
- B) Props are immutable and components must act as pure functions with respect to their props
- C) It converts the component into a class component
- D) Browsers only allow 10 prop updates per second
**Answer:** B
**Explanation:** All React components must protect their props from mutation, ensuring predictable top-down data flow and avoiding unpredictable side effects across the component tree.

### Q3: How should a child component inform its parent that a user clicked a button?
- A) By directly modifying `window.parent.state`
- B) By calling a callback function passed down as a prop by the parent
- C) By triggering a full browser refresh
- D) By rewriting the parent's source code file
**Answer:** B
**Explanation:** In React's unidirectional data flow, child components communicate with parents by invoking callback functions supplied to them via props.

### Q4: Which prop assignment passes the number `25` as an actual JavaScript numeric type?
- A) `age="25"`
- B) `age='25'`
- C) `age={25}`
- D) `age=[25]`
**Answer:** C
**Explanation:** Enclosing `25` in curly braces (`age={25}`) evaluates it as a JavaScript number. Using quotes (`age="25"`) passes it as a string.

### Q5: What data types can be passed as props in React?
- A) Only strings and integers
- B) Only strings, numbers, and booleans
- C) Any valid JavaScript value, including objects, arrays, functions, and JSX elements
- D) Only JSON-serialized objects
**Answer:** C
**Explanation:** Props can accept any JavaScript datatype: primitives (strings, numbers, booleans), complex structures (arrays, objects), functions, and React elements.
