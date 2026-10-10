# Breaking Out of DOM Hierarchies with createPortal

## 1. The CSS Clipping and Z-Index Dilemma
In traditional React, a component's JSX markup is rendered directly inside its parent DOM element in the tree. 

Normally, this is desirable. However, when building **Modals, Tooltips, Dropdowns, and Toast Notifications**, standard DOM hierarchy creates severe layout bugs:
1. **`overflow: hidden` Clipping:** If any ancestor container in the tree has `overflow: hidden` or `overflow: scroll`, any modal or tooltip extending beyond the parent container's boundaries will be **harshly clipped and cut off!**
2. **`z-index` Stacking Context Collisions:** Even if you set `z-index: 999999` on a modal, if its parent container is trapped in a lower stacking context (`z-index: 1`), the modal will stay buried beneath other elements on the page!

```
Problem:
<div style="overflow: hidden">  <-- Clips everything outside its box!
  <DashboardCard>
    <Modal>  <-- CUT OFF & INVISIBLE!
```

## 2. What is `createPortal`?
**React Portals** provide a first-class way to render children into a **different DOM node that exists entirely outside the DOM hierarchy of the parent component**.

With a portal, your component can live logically in the React component tree (sharing props, state, and context), while its physical HTML DOM nodes are injected directly into `document.body` or a dedicated `<div id="modal-root">`.

$$\text{ReactDOM.createPortal}(\text{children}, \text{domNode})$$

```
React Component Tree (Logical Hierarchy):
<App> ──> <Dashboard> ──> <UserProfile> ──> <ModalDialog> (Receives props & state!)
                                                   │
                                     createPortal  ▼
Physical Browser DOM (Rendered Output):
<body>
  <div id="root"> (Standard App Mount) </div>
  <div id="modal-root">
    <div className="modal-backdrop">...</div> (Rendered here at the very top of the DOM!)
  </div>
</body>
```

## 3. Implementing a React Portal Primitive
In your `index.html`, declare a designated portal target right after the root:
```html
<body>
  <div id="root"></div>
  <div id="portal-root"></div> <!-- Dedicated portal mount target -->
</body>
```

In your React component, use `createPortal` from `react-dom`:

```jsx
import React from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  const mountTarget = document.getElementById('portal-root') || document.body;

  // Teleports children to mountTarget in the real DOM!
  return createPortal(children, mountTarget);
}
```

## 4. Benefits of React Portals
- **Immune to `overflow: hidden`:** Because the DOM node is attached directly to `#portal-root` at the document root, no ancestor containers can clip its boundaries.
- **Predictable Z-Index Stacking:** Modals and tooltips live at the very top level of the body, guaranteeing correct overlay ordering.
- **Accessibility & Focus Trapping:** Screen readers and keyboard navigation utilities can manage focus cleanly on top-level overlays.

---

## Practice Quiz

### Q1: What problem do React Portals solve?
- A) Slow network speeds
- B) Rendering elements (like modals or tooltips) outside of their parent DOM hierarchy to avoid `overflow: hidden` clipping and `z-index` stacking context bugs
- C) Converting CSS to SCSS
- D) Compiling code to WebAssembly
**Answer:** B
**Explanation:** Portals allow components to mount elsewhere in the physical DOM (such as `document.body`) while maintaining their logical position in the React tree, avoiding clipping and stacking context traps.

### Q2: What package must `createPortal` be imported from?
- A) `'react'`
- B) `'react-dom'`
- C) `'vite'`
- D) `'react-router-dom'`
**Answer:** B
**Explanation:** `createPortal` interacts directly with the DOM and is exported from the `'react-dom'` package.

### Q3: What are the two mandatory arguments passed to `createPortal(children, domNode)`?
- A) The JSX children to render, and the physical target DOM element where they should be mounted
- B) A URL and a callback function
- C) Two CSS class names
- D) A boolean and a number
**Answer:** A
**Explanation:** `createPortal` accepts the React element/children to render as its first argument and the target physical DOM node (e.g. `document.body` or `document.getElementById('modal-root')`) as its second.

### Q4: Does a component rendered through a portal lose access to React Context provided by its logical parents?
- A) Yes, portals sever all connections to Context
- B) No, portals retain full access to React Context and props from their logical position in the React tree
- C) Only in class components
- D) Only in Firefox
**Answer:** B
**Explanation:** Portals only change the physical DOM mounting location; in React's internal Virtual DOM tree, the component remains a direct descendant and retains full access to props and Context.

### Q5: What CSS property on a parent container frequently cuts off child dropdowns or tooltips, requiring a portal?
- A) `font-family`
- B) `overflow: hidden` or `overflow: auto`
- C) `color: blue`
- D) `display: flex`
**Answer:** B
**Explanation:** Containers with `overflow: hidden` or `overflow: scroll` clip any child elements that extend past their dimensional boundaries.
