# Prop Getters and Flexible Design Systems

## 1. The Challenge of Custom Prop Overrides
In headless UI libraries and flexible design systems, a component or custom hook often needs to supply a collection of accessibility attributes, event listeners, and ARIA tags to an element.

Consider the **Prop Collections Pattern**:
```javascript
// Prop Collections approach:
const { toggleProps, menuProps } = useToggle();

return <button {...toggleProps}>Toggle</button>;
```
Here, `toggleProps` contains `{ onClick, 'aria-expanded': true, id: 'toggle-btn' }`.

### The Critical Flaw: Prop Overriding
What happens if the consumer also wants to attach their **own custom `onClick`** handler?
```jsx
// ❌ BUG: The consumer's onClick OVERWRITES useToggle's internal onClick!
<button {...toggleProps} onClick={handleCustomAnalytics}>
  Toggle
</button>
```
Because of JavaScript object spreading order, whichever property is spread last overwrites the earlier one. The toggle's internal state machine breaks completely!

## 2. The Solution: The Prop Getters Pattern
Instead of returning static objects, the hook returns **Prop Getter Functions** (conventionally named `getTogglerProps()`, `getItemProps()`, `getInputProps()`):

$$\text{getTogglerProps}(\text{customProps}) \implies \text{Composed merged props}$$

A prop getter:
1. Accepts the consumer's custom props as an argument.
2. Composes the consumer's custom event handlers with the component's internal handlers.
3. Merges class names and ARIA attributes cleanly.
4. Returns the final, collision-free prop object!

## 3. Implementing Prop Getters
Let's build a helper function to compose multiple event handlers:

```javascript
// Utility: Composes multiple event handlers without overwriting
export const callAll = (...fns) => (...args) => {
  fns.forEach(fn => {
    if (typeof fn === 'function') {
      fn(...args);
    }
  });
};
```

Now, implement the custom hook with prop getters:

```jsx
import { useState } from 'react';
import { callAll } from './utils';

export function useToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => setOn(prev => !prev);

  // Prop Getter Function!
  const getTogglerProps = ({ onClick, ...restProps } = {}) => {
    return {
      'aria-expanded': on,
      'aria-pressed': on,
      type: 'button',
      // Safely compose internal toggle with consumer's custom onClick!
      onClick: callAll(onClick, toggle),
      ...restProps
    };
  };

  return {
    on,
    toggle,
    getTogglerProps
  };
}
```

## 4. Seamless Consumer Experience
Now, consumers can pass arbitrary custom props, event handlers, and styles without fear of breaking internal behavior:

```jsx
export default function AccordionItem() {
  const { on, getTogglerProps } = useToggle();

  const handleAnalytics = (e) => {
    console.log('Telemetry: User toggled accordion section');
  };

  return (
    <div>
      {/* Consumer passes custom onClick and className INTO the getter! */}
      <button
        {...getTogglerProps({
          onClick: handleAnalytics,
          className: 'custom-btn-style',
          'data-testid': 'custom-toggler'
        })}
      >
        {on ? 'Close Section' : 'Open Section'}
      </button>

      {on && <div className="panel">Curriculum Syllabus Details...</div>}
    </div>
  );
}
```
Both `handleAnalytics` AND internal `toggle` execute smoothly!

---

## Practice Quiz

### Q1: What problem do Prop Getters solve that static Prop Collections fail to address?
- A) They prevent the browser from running out of RAM
- B) They safely compose and merge consumer event handlers with internal component handlers without accidental property overwrites
- C) They eliminate the need for HTML buttons
- D) They compile JSX into CSS
**Answer:** B
**Explanation:** Prop getters accept consumer props and compose event handlers (calling both internal and caller callbacks), avoiding the overwrite bugs inherent to raw prop spreading.

### Q2: How are prop getter functions conventionally named in modern React libraries (like Downshift or TanStack Table)?
- A) `set[Element]Props`
- B) `get[Element]Props` (e.g. `getTogglerProps()`, `getInputProps()`, `getItemProps()`)
- C) `make[Element]`
- D) `fetch[Element]`
**Answer:** B
**Explanation:** Libraries universally adhere to the `get...Props()` naming convention to signal a function that accepts custom overrides and returns composed props.

### Q3: What does the `callAll(...fns)` helper function accomplish in a prop getter?
- A) It calls every API endpoint in the project
- B) It creates a single composite event handler that invokes all provided functions sequentially with the received event arguments
- C) It triggers an alert popup
- D) It restarts the computer
**Answer:** B
**Explanation:** `callAll` chains multiple function references into a single callback, executing both the consumer's custom event listener and the library's internal handler.

### Q4: If a consumer calls `getTogglerProps({ onClick: customFn })`, in what order are the click events executed?
- A) Only `customFn` executes; internal logic is dropped
- B) Both `customFn` and internal `toggle` execute
- C) Neither executes
- D) The browser throws an exception
**Answer:** B
**Explanation:** Prop getters compose handlers so that both the user-supplied callback and internal state update functions run reliably.

### Q5: What is returned by invoking a prop getter function?
- A) A React element or JSX tag
- B) A plain JavaScript object containing merged attributes, event handlers, and ARIA roles ready to be spread onto a JSX element
- C) A Promise
- D) A string of CSS classes
**Answer:** B
**Explanation:** Prop getters return an object of finalized props and attributes designed to be spread onto the target JSX element via `{...getProps()}`.
