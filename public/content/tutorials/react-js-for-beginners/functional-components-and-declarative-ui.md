# Functional Components and Declarative UI

## 1. What is a React Component?
In modern React, a **component** is a JavaScript function that accepts arbitrary inputs (called **props**) and returns a React element (written in JSX) describing how a section of the user interface should appear.

Components allow you to split the UI into independent, reusable pieces, and think about each piece in isolation.

```jsx
// A clean, modern functional component
export default function CourseBadge({ title, duration }) {
  return (
    <div className="course-badge">
      <span className="badge-title">{title}</span>
      <span className="badge-time">{duration}</span>
    </div>
  );
}
```

## 2. Capitalization Convention
In React, component names **must always start with an uppercase letter** (e.g., `CourseCard`, `Header`, `UserProfile`).

- If an element starts with a lowercase letter (e.g., `<div>`, `<span>`, `<button>`), React treats it as a built-in standard HTML tag.
- If an element starts with an uppercase letter (e.g., `<CourseCard />`), React recognizes it as a custom component and executes the corresponding JavaScript function.

```jsx
// ❌ Treated as an unknown HTML tag; will not invoke the function
function button() {
  return <button className="custom-btn">Click me</button>;
}
// Using <button /> invokes the standard HTML button, not your function

// ✅ Treated as a custom React component
function CustomButton() {
  return <button className="custom-btn">Click me</button>;
}
// Using <CustomButton /> invokes your custom function
```

## 3. Pure Functions and the Declarative Contract
React components are modeled after **pure functions** in computer science:
- **Same Inputs -> Same Output:** Given the same props and state, a component should always return the exact same JSX.
- **No Side Effects During Render:** A component function should simply describe what the UI should look like. It must *not* mutate external variables, modify the DOM directly, or start network requests inside the component body during rendering.

```jsx
// ❌ Impure Component: Mutates an external variable during rendering!
let guestCount = 0;

export function Cup() {
  guestCount = guestCount + 1; // Side effect during render!
  return <h2>Tea cup for guest #{guestCount}</h2>;
}

// ✅ Pure Component: Operates strictly on inputs (props)
export function Cup({ guestNumber }) {
  return <h2>Tea cup for guest #{guestNumber}</h2>;
}
```

## 4. Class Components vs Modern Functional Components
Prior to React 16.8, complex components with state and lifecycle methods had to be written as ES6 Classes inheriting from `React.Component`:

```jsx
// Legacy Class Component (Older Codebases)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Today, the entire React ecosystem has standardized on **Functional Components with React Hooks**:
- **Simpler Code:** No `this` binding headaches, constructor methods, or class boilerplate.
- **Smaller Bundle Sizes:** Functions minify and compress far better than JavaScript ES6 classes.
- **Code Sharing via Custom Hooks:** Business and state logic can be extracted into reusable custom hooks without convoluted Higher-Order Component (HOC) or Render Prop patterns.

---

## Practice Quiz

### Q1: What rule must the naming of a React functional component strictly follow?
- A) It must start with an underscore `_`
- B) It must always start with an uppercase letter (PascalCase)
- C) It must end with the suffix `Component`
- D) It must be written entirely in lowercase
**Answer:** B
**Explanation:** React distinguishes custom user-defined components from native HTML tags by checking if the identifier begins with an uppercase letter (e.g., `<UserProfile />` vs `<div />`).

### Q2: What is the primary characteristic of a pure React component?
- A) It modifies global window variables on every render
- B) Given the same inputs (props and state), it always returns the exact same JSX without side effects during render
- C) It cannot use any CSS styling
- D) It only runs on Linux servers
**Answer:** B
**Explanation:** In React, a pure component produces the exact same JSX output for any given inputs and does not cause observable side effects during its render execution.

### Q3: What version of React introduced Hooks, transitioning the ecosystem from Class components to Functional components?
- A) React 15.0
- B) React 16.8
- C) React 18.0
- D) React 14.2
**Answer:** B
**Explanation:** React 16.8 introduced React Hooks (such as `useState` and `useEffect`), enabling functional components to manage local state and side effects without ES6 classes.

### Q4: Why are modern functional components preferred over legacy class components?
- A) Functional components avoid `this` keyword complexities and minify more efficiently
- B) Class components are no longer supported in any browser
- C) Functional components can only render text and cannot render images
- D) Functional components do not allow passing props
**Answer:** A
**Explanation:** Functional components eliminate the confusing nuances of JavaScript's `this` binding, result in smaller minified production bundles, and enable seamless logic composition with hooks.

### Q5: What does a functional component return?
- A) A SQL database connection pool
- B) A React element or tree of elements (typically described using JSX)
- C) A JSON string serialized with `JSON.stringify`
- D) An HTTP 200 OK header
**Answer:** B
**Explanation:** A React functional component returns a React element or tree of elements (usually written in JSX) that describes what should appear on the screen.
