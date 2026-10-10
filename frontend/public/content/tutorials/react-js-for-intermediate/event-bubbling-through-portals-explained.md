# Event Bubbling Through Portals Explained

## 1. The Surprising Portal Event Behavior
One of the most fascinating aspects of React Portals is how events behave:

> **Even though a portal is mounted into a completely different DOM node in the physical HTML, events fired inside the portal bubble UP through the REACT COMPONENT TREE, NOT through the physical HTML DOM tree!**

Consider this scenario:
```
React Component Tree:
<ParentDiv onClick={handleParentClick}>
  <ChildWithPortal>
     └─ createPortal(<button>Click</button>, document.body)
```

In the physical HTML DOM:
- The `<button>` is a direct child of `<body>`.
- The `<ParentDiv>` is located deep inside `<div id="root">`.
- Physically, `<button>` is **NOT** inside `<ParentDiv>`.

Yet, if you click the `<button>`:
**`handleParentClick` on `<ParentDiv>` WILL FIRE!**

```
Physical HTML DOM:
<body>
  <div id="root"> ──> <ParentDiv> (Not an ancestor of button!) </div>
  <button id="portal-btn">Click Me</button>
</body>

React Virtual DOM Event Flow:
[button clicked] ════(Bubbles through React Tree!)════► [ParentDiv handleParentClick fires!]
```

## 2. Why Does This Happen?
React does not rely on native DOM event listeners attached to individual elements. 

As explored in our SyntheticEvent architecture lessons:
- React attaches unified listeners at the root of the React tree (`<div id="root">`).
- React's synthetic event dispatcher traverses the **Virtual DOM component hierarchy**, not the browser's physical DOM tree.
- Because `<ChildWithPortal>` is a logical child of `<ParentDiv>` in the React tree, React bubbles the `SyntheticEvent` up through the component hierarchy as expected!

## 3. Practical Demonstration
```jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function PortalModal({ onClose }) {
  return createPortal(
    <div className="portal-dialog">
      <p>Inside Portal (Physical child of document.body)</p>
      <button className="btn-action">Action Button</button>
    </div>,
    document.body
  );
}

export default function Container() {
  const [clickCount, setClickCount] = useState(0);

  // This handler will catch clicks from inside the portal!
  const handleContainerClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="parent-box" onClick={handleContainerClick}>
      <h3>Parent Container (Clicks captured: {clickCount})</h3>
      <p>Clicking the button inside the portal WILL increment this count!</p>
      
      <PortalModal />
    </div>
  );
}
```

## 4. How to Prevent Unintended Bubbling
If your portal represents a modal or tooltip and you do **not** want its internal click events to trigger parent container handlers:
- Call **`e.stopPropagation()`** inside your portal event handler!

```jsx
// Stop event from bubbling up the React component tree:
<div onClick={(e) => e.stopPropagation()}>
  {/* Children inside this container will NOT trigger parent handlers */}
</div>
```

---

## Practice Quiz

### Q1: How do SyntheticEvents bubble when an element is rendered through `createPortal`?
- A) They bubble through the physical HTML DOM tree
- B) They bubble through the React Virtual DOM component hierarchy, regardless of where the portal is physically rendered in the real DOM
- C) Events do not bubble at all inside portals
- D) Events only bubble on mobile devices
**Answer:** B
**Explanation:** React's synthetic event delegation system traces events upward through the logical React component tree, enabling events from portals to reach their React parent components.

### Q2: If `<Parent onClick={handleClick}>` renders a portal that attaches a `<button>` to `document.body`, what happens when that button is clicked?
- A) The click is lost
- B) `handleClick` on `<Parent>` will be invoked because the button is a child of `<Parent>` in the React component tree
- C) React crashes with a Portal Exception
- D) The button is deleted
**Answer:** B
**Explanation:** React's event propagation follows the React component tree rather than physical DOM nesting, so the parent's click handler receives the event.

### Q3: Why does React implement event bubbling based on the React tree rather than the DOM tree?
- A) Due to an unresolved bug in React 16
- B) To preserve the illusion of component encapsulation, allowing parent components to capture events from their logical children naturally
- C) To make CSS grid layouts work
- D) To bypass browser security settings
**Answer:** B
**Explanation:** Consistent bubbling preserves component abstractions: from the parent's perspective, the portal is its child, so event handling behaves intuitively.

### Q4: How can an engineer stop a portal's click events from reaching ancestor React components?
- A) By calling `e.stopPropagation()` on the portal container
- B) By using CSS `pointer-events: none`
- C) By uninstalling `react-dom`
- D) By making the portal a class component
**Answer:** A
**Explanation:** Invoking `e.stopPropagation()` halts SyntheticEvent bubbling up the React component tree.

### Q5: If a native browser DOM event listener is attached via `document.addEventListener('click')`, will it receive portal clicks?
- A) No, native listeners ignore portals
- B) Yes, native DOM events still follow standard browser DOM bubbling rules independently of React's synthetic bubbling
- C) Only in production builds
- D) Only on Chrome
**Answer:** B
**Explanation:** The browser's native DOM engine still processes native events through physical DOM ancestors to `document` and `window`, concurrently with React's synthetic event propagation.
