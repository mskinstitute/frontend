# Controlled vs Uncontrolled Components with useRef

## 1. Two Philosophical Approaches to Form Inputs
In web development, form elements like `<input>`, `<textarea>`, and `<select>` maintain their own internal state inside the browser's Document Object Model as users type.

React offers two primary architectural patterns to handle form inputs:
1. **Controlled Components:** React state (`useState`) is the single source of truth. Every input value is pushed into state via `onChange`, and read from state via `value`.
2. **Uncontrolled Components:** The browser DOM itself holds the source of truth. React reads values only when needed (such as upon form submission) using a **`useRef`** reference.

```
Controlled Component (React is Single Source of Truth):
[Keystroke] ──> [onChange fires] ──> [setVal(e.target.value)] ──> [Re-render] ──> [value={val}]

Uncontrolled Component (DOM is Source of Truth):
[Keystroke] ──> [DOM updates internally (Zero re-renders!)]
[Submit Click] ──> [inputRef.current.value read once]
```

## 2. Implementing Controlled Components
```jsx
import React, { useState } from 'react';

export default function ControlledSearch() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Instant Character Count: {query.length}</p>
    </div>
  );
}
```
### Why use Controlled Components?
- **Instant Validation:** Validate input on every keystroke (e.g. enforcing password rules or phone formatting).
- **Dynamic UI Responses:** Enable or disable submit buttons based on current field values.
- **Enforcing Input Formats:** Convert text to uppercase automatically as the user types.

## 3. Implementing Uncontrolled Components with `useRef`
When you don't need real-time keystroke tracking and want to maximize performance in massive forms, **`useRef`** provides direct access to the underlying DOM node:

```jsx
import React, { useRef } from 'react';

export default function UncontrolledRegistration() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const fileRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Read values directly from DOM nodes upon submission
    const studentName = nameRef.current.value;
    const studentEmail = emailRef.current.value;
    const attachedFile = fileRef.current.files[0];

    console.log('Submitting:', { studentName, studentEmail, attachedFile });
  };

  return (
    <form onSubmit={handleSubmit} className="uncontrolled-form">
      <div>
        <label>Name:</label>
        {/* defaultValue sets initial value without controlling updates */}
        <input type="text" ref={nameRef} defaultValue="Deepak" />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" ref={emailRef} placeholder="email@example.com" />
      </div>

      <div>
        <label>Certificate Upload:</label>
        {/* File inputs in HTML are ALWAYS uncontrolled! */}
        <input type="file" ref={fileRef} />
      </div>

      <button type="submit">Submit Record</button>
    </form>
  );
}
```

## 4. Special Case: HTML File Inputs `<input type="file" />`
In HTML, file inputs are strictly read-only for JavaScript security reasons (scripts cannot programmatically set a user's file path). 

Because their value cannot be set via `value={...}`, **file inputs in React must always be uncontrolled components accessed via `useRef`!**

---

## Practice Quiz

### Q1: What is the defining characteristic of a Controlled Component in React?
- A) It can only be operated using a hardware keyboard
- B) Form input values are driven directly by React state via `value` and synchronized via `onChange`
- C) It is wrapped in a Redux store
- D) It does not support form submissions
**Answer:** B
**Explanation:** A controlled component binds its value directly to React state, making React the single source of truth for the displayed content.

### Q2: How does an Uncontrolled Component store and track its form data?
- A) Inside a backend SQLite database
- B) The DOM node itself manages its own internal state, and React reads it on demand using `useRef`
- C) Inside CSS custom properties
- D) Inside `sessionStorage`
**Answer:** B
**Explanation:** In uncontrolled components, the browser's native DOM element retains the input value, which React accesses when needed via `ref.current.value`.

### Q3: Why MUST `<input type="file" />` elements always be treated as uncontrolled in React?
- A) Browsers do not support file inputs in React
- B) For security reasons, browser file input values are read-only and cannot be programmatically controlled via React state
- C) File inputs only work in Python
- D) React 18 deprecated files
**Answer:** B
**Explanation:** Web browser security models prohibit JavaScript from setting the value of a file input; therefore, file inputs cannot be controlled via `value={...}` and must be accessed via refs.

### Q4: What prop is used to set the initial starting text of an uncontrolled input without controlling subsequent typing?
- A) `initialValue`
- B) `defaultValue`
- C) `startText`
- D) `placeholder`
**Answer:** B
**Explanation:** `defaultValue` sets the initial DOM node value upon mounting while leaving subsequent user edits uncontrolled.

### Q5: When should an engineer prefer controlled components over uncontrolled components?
- A) When instant keystroke validation, dynamic conditional button enabling, or input masking is required
- B) When typing performance must be completely uncoupled from JavaScript
- C) Only when writing unit tests
- D) When deploying without Node.js
**Answer:** A
**Explanation:** Controlled components excel when you need immediate feedback per keystroke, such as instant password validation or field-dependent UI toggles.
