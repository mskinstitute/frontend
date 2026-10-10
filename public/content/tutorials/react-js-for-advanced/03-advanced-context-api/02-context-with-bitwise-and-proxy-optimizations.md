# Context with Bitwise and Proxy Optimizations

## 1. The Granular Subscription Problem in React Context
In standard React Context, components subscribe to the **entire value object**. 

If a context provides `{ user, theme, settings }`, a component that only displays `user.name` will still re-render when `theme` changes.

Unlike Redux or Zustand, standard React `useContext` **lacks selector functions** (`useContext(MyContext, state => state.user)` is not natively supported).

To overcome this limitation in high-performance enterprise systems, advanced React architectures employ two specialized optimization techniques:
1. **Bitwise Observed Bits (Historical / Advanced Core Optimization)**
2. **JavaScript Proxy-Based Tracked Contexts (Modern Pattern)**

```
Standard Context:
Context Object: { user, theme } ──(Theme updates!)──► ALL consumers re-render!

Proxy-Tracked Context:
Context Object wrapped in Proxy ──► Tracks which specific property each component read!
Component reads only `user` ──► Theme update detected ──► SKIPS re-render!
```

## 2. Proxy-Based Tracked Contexts (The `use-context-selector` Pattern)
Libraries like `use-context-selector` (created by Daishi Kato, the creator of Zustand and Jotai) leverage JavaScript **`Proxy`** objects to track property accesses at runtime.

A Proxy wraps the context value:
- When a component renders and accesses `state.user`, the Proxy's `get` trap records that this component depends on `user`.
- When the Provider updates, it compares the previous and next values of each property.
- If only `theme` changed, the component that only read `user` **skips re-rendering entirely!**

```jsx
// Example using use-context-selector pattern
import { createContext, useContextSelector } from 'use-context-selector';

const AdvancedContext = createContext(null);

export function UserBadge() {
  // Subscribes STRICTLY to state.user.name; immune to theme or settings updates!
  const userName = useContextSelector(AdvancedContext, (state) => state.user.name);

  return <span>Welcome, {userName}</span>;
}
```

## 3. Bitwise Flags for High-Speed Enum Slicing
In ultra-low-latency financial or gaming applications, components can use **bitwise bitmasks** to represent change masks:

```javascript
// Bitwise flags representing state slices
const SLICE_USER = 0b0001;     // 1
const SLICE_THEME = 0b0010;    // 2
const SLICE_SETTINGS = 0b0100; // 4

// Calculate change bitmask
const changedBits = SLICE_THEME; // Only theme changed!

// Consumer checks if its bitmask matches:
const observedBits = SLICE_USER;
const shouldUpdate = (changedBits & observedBits) !== 0; // false! Skip update!
```

## 4. Modern Perspective: When to Use External Stores
While building custom Proxy contexts is academically brilliant, in production engineering:
- If your application requires fine-grained selectors and frequent updates, **adopt Zustand or Redux Toolkit directly**.
- These libraries have solved selective subscriptions at the micro-level with years of production battle-testing.

---

## Practice Quiz

### Q1: What fundamental limitation of standard React `useContext` do Proxy-based context selectors solve?
- A) `useContext` cannot store strings
- B) Standard `useContext` re-renders components whenever any property of the context value changes; Proxy selectors track accessed properties and skip renders if unaccessed fields change
- C) `useContext` is deprecated in React 18
- D) It compiles code into binary
**Answer:** B
**Explanation:** Standard Context triggers re-renders on any value reference change. Proxy-based selectors track exactly which properties each component reads, isolating updates to relevant subscribers.

### Q2: How does a JavaScript `Proxy` identify which properties a component depends on?
- A) By inspecting the component's CSS classes
- B) Through the Proxy's `get` trap, which intercepts property reads during the component's render phase
- C) By reading browser cookies
- D) By querying the backend database
**Answer:** B
**Explanation:** A Proxy's `get` handler executes whenever an object property is accessed, allowing the library to record active field dependencies dynamically.

### Q3: What mathematical technique uses binary operators (`&`, `|`) to evaluate whether a specific slice of state updated at high speed?
- A) Quadratic equation solving
- B) Bitwise bitmask operations
- C) Linear regression
- D) Trigonometric sine waves
**Answer:** B
**Explanation:** Bitwise masks allow rapid binary comparison (`(changedBits & observedBits) !== 0`) to determine if subscribed data slices were modified.

### Q4: If an application requires fine-grained selectors across hundreds of components, what is the recommended modern industry practice?
- A) Hand-code a custom Proxy context engine from scratch
- B) Use established selector-based state management libraries like Zustand or Redux Toolkit
- C) Convert the codebase to jQuery
- D) Store all state in the URL query string
**Answer:** B
**Explanation:** Production libraries like Zustand and Redux Toolkit natively provide optimized, battle-tested selector subscription mechanisms.

### Q5: Can bitwise flags represent more than 32 distinct state slices in standard JavaScript 32-bit bitwise operations?
- A) Yes, up to infinity
- B) No, JavaScript bitwise operators operate on 32-bit signed integers, limiting single bitmasks to 31/32 unique binary flags without BigInt
- C) Bitwise operations only support 2 flags
- D) Bitwise operations are prohibited in web browsers
**Answer:** B
**Explanation:** Standard JavaScript bitwise operators treat operands as 32-bit signed integers, capping discrete binary flag masks at 31 usable positive bits without using `BigInt`.
