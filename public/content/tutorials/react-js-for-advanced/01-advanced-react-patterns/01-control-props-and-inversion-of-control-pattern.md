# Control Props and Inversion of Control Pattern

## 1. The Component Autonomy Dilemma
When engineering reusable UI primitives (e.g. toggles, dropdowns, pagination controls, or date pickers), component authors face a fundamental dilemma:
- Should the component be **uncontrolled** (managing its own internal state automatically for developer convenience)?
- Or should it be **controlled** (allowing the parent to dictate state and receive change notifications)?

If you only support uncontrolled behavior, consumers cannot synchronize the component with external state or URL parameters. If you only support controlled behavior, consumers must write tedious `value` and `onChange` boilerplate for even trivial use cases.

The **Control Props Pattern** (popularized by Kent C. Dodds and used in libraries like Downshift and Material UI) solves this dilemma through **Inversion of Control (IoC)**:
> **The component maintains internal state by default, but if the consumer provides a controlled prop (like `value` or `on`), the component cedes control to the consumer!**

```
Controlled Check:
Is `value !== undefined` passed by consumer?
 ├─ YES ──► Controlled Mode: Display `props.value`, call `props.onChange(next)`
 └─ NO  ──► Uncontrolled Mode: Display internal `state`, update internal `setState`
```

## 2. Implementing a Robust Toggle with Control Props
Let's build an enterprise Toggle component:

```jsx
import React, { useState } from 'react';

export default function Toggle({
  on: controlledOn,      // Controlled prop (optional)
  onChange,              // Callback when state wants to change
  defaultOn = false,     // Initial state for uncontrolled mode
  children
}) {
  // 1. Internal state used in uncontrolled mode
  const [internalOn, setInternalOn] = useState(defaultOn);

  // 2. Determine whether the component is currently controlled
  const isControlled = controlledOn !== undefined;

  // 3. Resolve the active state value
  const on = isControlled ? controlledOn : internalOn;

  // 4. Unified toggle handler
  const handleToggle = () => {
    const nextOn = !on;

    // If uncontrolled, update internal state
    if (!isControlled) {
      setInternalOn(nextOn);
    }

    // Always notify caller if callback is supplied
    if (onChange) {
      onChange(nextOn);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`toggle-switch ${on ? 'toggle-on' : 'toggle-off'}`}
      onClick={handleToggle}
    >
      <span className="toggle-handle" />
      {children}
    </button>
  );
}
```

## 3. Comparing Consumer Modes

### Mode 1: Fully Uncontrolled (Zero Boilerplate)
```jsx
// Manages its own state automatically!
<Toggle defaultOn={false} onChange={(val) => console.log('Toggled:', val)}>
  Enable Push Notifications
</Toggle>
```

### Mode 2: Fully Controlled (Parent in Command)
```jsx
function SettingsScreen() {
  const [autoSync, setAutoSync] = useState(true);

  return (
    // Parent dictates the state via 'on' prop!
    <Toggle on={autoSync} onChange={setAutoSync}>
      Automatic Cloud Sync
    </Toggle>
  );
}
```

## 4. Warning Against Switching Modes in Runtime
A component should never transition between uncontrolled and controlled modes during its lifecycle. React will log a warning:
> **"A component is changing an uncontrolled input to be controlled."**

To prevent this:
- Always ensure `controlledOn` defaults to `undefined`, or explicitly check `isControlledRef.current = controlledOn !== undefined` on initial mount to warn developers if they accidentally change modes at runtime.

---

## Practice Quiz

### Q1: What is the primary purpose of the Control Props pattern in React?
- A) To encrypt component props
- B) To allow a component to operate seamlessly in either uncontrolled mode (self-managing) or controlled mode (consumer-dictated) through Inversion of Control
- C) To disable all user clicks
- D) To eliminate CSS stylesheets
**Answer:** B
**Explanation:** The Control Props pattern allows components to manage their own state by default while empowering callers to take complete control by providing explicit value and change props.

### Q2: How does a component detect whether it is currently operating in controlled mode?
- A) By checking `typeof window !== 'undefined'`
- B) By verifying whether the controlled prop is not undefined (e.g. `controlledValue !== undefined`)
- C) By counting the number of renders
- D) By checking if TypeScript is enabled
**Answer:** B
**Explanation:** If the caller passes a defined value to the designated prop (e.g. `on` or `value`), the component identifies that it is being controlled from the outside.

### Q3: What happens in uncontrolled mode when a user clicks the component?
- A) The component updates its internal `useState` container and notifies the optional `onChange` listener
- B) The component crashes
- C) A full browser refresh occurs
- D) The component deletes its props
**Answer:** A
**Explanation:** In uncontrolled mode, the component mutates its own internal state to update the UI while dispatching notification callbacks to the parent.

### Q4: Why does React warn against "changing an uncontrolled input to be controlled"?
- A) It causes a computer hardware failure
- B) Switching from uncontrolled (undefined) to controlled (defined value) midway through a component's lifecycle indicates accidental state initialization bugs
- C) React requires inputs to be deleted
- D) It violates CSS specifications
**Answer:** B
**Explanation:** Switching between uncontrolled and controlled states typically signifies that an initial state was mistakenly initialized to `undefined` before resolving to a string or boolean, violating component contracts.

### Q5: Which popular open-source design libraries make extensive use of the Control Props pattern?
- A) Downshift, Radix UI, and Headless UI
- B) jQuery UI
- C) Express.js
- D) Docker CLI
**Answer:** A
**Explanation:** Production headless and accessibility libraries rely heavily on Control Props to provide maximum flexibility for design systems and custom form controls.
