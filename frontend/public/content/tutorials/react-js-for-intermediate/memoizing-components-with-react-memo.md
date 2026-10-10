# Memoizing Components with React memo

## 1. What is `React.memo`?
By default, when a parent component re-renders, all of its children re-render. If a child component is computationally heavy or renders a large list, re-rendering it unnecessarily when its props have not changed wastes CPU cycles.

**`React.memo`** is a Higher-Order Component that memoizes a functional component. 

When a component is wrapped in `React.memo`, React skips rendering the component if its **props have not changed** since the last render.

$$\text{Next Props} \stackrel{\text{shallow equal}}{===} \text{Prev Props} \implies \text{Skip Render (Reuse Cached VDOM)}$$

## 2. Basic Usage of `React.memo`
```jsx
import React, { memo } from 'react';

// Wrap functional component in memo()
const CourseSummaryCard = memo(function CourseSummaryCard({ title, duration, rating }) {
  console.log(`Rendering CourseSummaryCard: ${title}`);

  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <p>Duration: {duration} | Rating: ★ {rating}</p>
    </div>
  );
});

export default CourseSummaryCard;
```

If the parent component re-renders (due to an unrelated state change like a clock ticker), `CourseSummaryCard` will **skip rendering entirely**, reusing its previous Virtual DOM result.

## 3. The Shallow Comparison Trap
By default, `React.memo` compares props using **shallow equality (`Object.is`)**:
- Primitives (strings, numbers, booleans) are compared by value (`'React' === 'React' -> true`).
- Complex types (objects, arrays, functions) are compared by **memory reference** (`{} === {} -> false`)!

If a parent passes an unmemoized inline object or function to a memoized child, **`React.memo` will completely fail to stop re-renders!**

```jsx
// ❌ FAILS: Passes new object and new function references on EVERY render!
<CourseSummaryCard
  title="React Mastery"
  settings={{ theme: 'dark' }}       // New object reference every render!
  onSelect={() => handleSelect(id)} // New function reference every render!
/>
// Result: React.memo sees different prop references and re-renders anyway!
```

To fix this, objects must be memoized with **`useMemo`**, and functions must be memoized with **`useCallback`**.

## 4. Providing a Custom Comparison Function
If you need deep or selective comparison, `React.memo` accepts a custom comparison function as its second argument:

```jsx
function arePropsEqual(prevProps, nextProps) {
  // Return true if passing nextProps produces same result as prevProps
  return prevProps.course.id === nextProps.course.id &&
         prevProps.course.updatedAt === nextProps.course.updatedAt;
}

export default memo(CourseSummaryCard, arePropsEqual);
```
*(Notice: Return `true` to SKIP render; return `false` to RE-RENDER. This is the opposite of `shouldComponentUpdate`!)*

## 5. When NOT to Use `React.memo`
Do not wrap every component in `React.memo`! 
- Memoization has a cost: React must run equality checks on every prop before every render.
- For lightweight components (a simple button or icon), the prop comparison check is often more expensive than just letting the component re-render!
- Use `React.memo` only on **heavy components, large list items, or components with expensive rendering trees.**

---

## Practice Quiz

### Q1: What does `React.memo` do when applied to a functional component?
- A) It saves component state in `localStorage`
- B) It skips rendering the component if its incoming props are shallowly equal to its previous props
- C) It converts the component into a class component
- D) It prevents all CSS styles from loading
**Answer:** B
**Explanation:** `React.memo` memoizes the rendered output, skipping render calculations if none of the incoming props have changed by shallow comparison.

### Q2: Why does passing an unmemoized inline arrow function (`onClick={() => doSomething()}`) break `React.memo` on a child component?
- A) Inline functions are forbidden in JSX
- B) JavaScript generates a brand new function memory reference on every render, failing `Object.is` shallow equality checks
- C) Arrow functions cannot be parsed by React
- D) It causes an infinite render loop
**Answer:** B
**Explanation:** Inline functions create fresh references on every render. Because `React.memo` compares props by reference equality, it concludes that props have changed and re-renders.

### Q3: What should a custom comparison function passed to `React.memo(Component, arePropsEqual)` return if props are identical and rendering should be skipped?
- A) `false`
- B) `true`
- C) `null`
- D) `0`
**Answer:** B
**Explanation:** In `React.memo`, returning `true` signals that previous and next props are equal and the render should be skipped.

### Q4: When is using `React.memo` genuinely beneficial?
- A) On every single HTML tag in your project
- B) On computationally heavy components or list items that re-render frequently with identical props
- C) Only on root layout components
- D) Only in development mode
**Answer:** B
**Explanation:** `React.memo` should be applied strategically to components with non-trivial render costs or large subtrees where props remain stable across parent updates.

### Q5: Does wrapping a component in `React.memo` prevent it from re-rendering if its OWN internal `useState` updates?
- A) Yes, `React.memo` stops all renders unconditionally
- B) No, `React.memo` only checks incoming props; if the component's own internal state or consumed Context changes, it will still re-render
- C) It throws a compile-time error
- D) Only on mobile browsers
**Answer:** B
**Explanation:** `React.memo` guards against prop-driven re-renders from parent updates. Internal state (`useState`) or Context changes continue to trigger necessary re-renders.
