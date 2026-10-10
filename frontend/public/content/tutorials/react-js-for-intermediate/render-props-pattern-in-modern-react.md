# Render Props Pattern in Modern React

## 1. What is the Render Props Pattern?
Prior to the introduction of React Hooks in 16.8, sharing stateful logic between components was challenging. The two primary techniques were **Higher-Order Components (HOCs)** and the **Render Props Pattern**.

The term **"render prop"** refers to a technique for sharing code between React components using a prop whose value is a **function** that returns a React element.

Instead of a component rendering a hardcoded piece of UI, it delegates rendering to the consumer by calling the function and passing its internal state as arguments:

```
[Parent Provider Component]
  ├─ Computes internal state (e.g. mouse coordinates, scroll, fetch status)
  └─ Calls: props.render(internalState)  ──> Consumer decides what to render!
```

## 2. Classic Example: Mouse Position Tracker
Consider a component that tracks cursor coordinates:

```jsx
import React, { useState } from 'react';

// Provider Component encapsulating stateful tracking logic
export function MouseTracker({ render }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setCoords({
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div
      style={{ height: '300px', border: '2px dashed #94a3b8', position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      {/* Delegate rendering to consumer by passing coords object */}
      {render(coords)}
    </div>
  );
}
```

### Consuming the Render Prop:
```jsx
export default function App() {
  return (
    <div>
      <h2>Render Props Mouse Coordinate Explorer</h2>
      
      {/* Consumer 1: Renders coordinates as text */}
      <MouseTracker
        render={({ x, y }) => (
          <p className="coord-text">Cursor is at: X={x}, Y={y}</p>
        )}
      />

      {/* Consumer 2: Renders a circle following the cursor */}
      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              pointerEvents: 'none'
            }}
          />
        )}
      />
    </div>
  );
}
```

## 3. Using `children` as a Render Prop Function
While the prop is often called `render`, it is equally common and idiomatic to use **`children` as a function**:

```jsx
export function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);

  // Invoke children as a function
  return children({ on, toggle });
}

// Consuming children as a function:
<Toggle>
  {({ on, toggle }) => (
    <div>
      <button onClick={toggle}>{on ? 'Collapse' : 'Expand'}</button>
      {on && <div className="panel">Secret Admin Content</div>}
    </div>
  )}
</Toggle>
```

## 4. Render Props in the Age of Custom Hooks
Today, **Custom Hooks** (like `useMousePosition()` or `useToggle()`) have superseded render props for general logic sharing because hooks avoid "wrapper hell" and deep JSX nesting.

However, render props remain essential in modern React for:
- **Headless UI Libraries:** (e.g. Downshift, React Virtualized, TanStack Table) where a component controls keyboard navigation and virtualization but leaves markup rendering entirely to the user.
- **Dynamic Slot Injection:** Passing rendering callbacks for items inside complex virtualized lists or table cells.

---

## Practice Quiz

### Q1: What defines the "render props" pattern in React?
- A) A prop containing pre-rendered HTML strings from the server
- B) Passing a function as a prop to a component, which the component invokes to determine what to render
- C) A CSS styling technique
- D) An alternative to Vite
**Answer:** B
**Explanation:** A render prop is a prop whose value is a function that a component uses to know what to render, allowing dynamic injection of UI while encapsulating state.

### Q2: What major architectural advantage did render props provide before the introduction of React Hooks?
- A) They enabled components to share stateful logic without inheritance or hardcoding the UI structure
- B) They increased network download speeds
- C) They eliminated the need for JavaScript functions
- D) They prevented the browser from re-rendering
**Answer:** A
**Explanation:** Render props separated stateful behavior (like tracking scroll, hover, or toggles) from presentation, allowing callers to render any markup using the supplied state.

### Q3: How can `props.children` be used in a render prop pattern?
- A) By passing children as an array of strings
- B) By passing a function as the component's children (Function as Child Component) and executing `children(state)`
- C) By converting children into an SQLite query
- D) `children` cannot be used as a function in React
**Answer:** B
**Explanation:** Passing a function between component tags (`<Component>{(state) => <UI />}</Component>`) is the "Function as Child" variation of the render prop pattern.

### Q4: Why have Custom Hooks largely replaced render props for general state sharing?
- A) Render props are no longer supported in React 18
- B) Custom Hooks share logic cleanly without introducing extra wrapper component nodes or deep JSX nesting
- C) Custom Hooks convert code into WebAssembly
- D) Render props only work in Internet Explorer
**Answer:** B
**Explanation:** Custom Hooks extract state and effects into pure functions, avoiding the nested JSX indentation ("wrapper hell") inherent to nested render prop components.

### Q5: In which modern libraries is the render prop pattern still heavily utilized?
- A) Headless UI libraries (such as TanStack Table, Downshift, and virtualization grids)
- B) The Node.js file system module
- C) MySQL database connectors
- D) Standard HTML email templates
**Answer:** A
**Explanation:** Headless and virtualization libraries use render props to manage complex accessibility, focus trapping, and row virtualization while giving consumers complete freedom over visual markup.
