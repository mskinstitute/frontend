# Handling Click, Change, and Submit Events

## 1. The Core Trio of Web Events
In interactive web engineering, the vast majority of user interactions revolve around three fundamental event types:
1. **`onClick`:** Triggered when the user clicks or taps an element (buttons, links, badges, cards).
2. **`onChange`:** Triggered when form input values change (text inputs, checkboxes, radio buttons, dropdown selects).
3. **`onSubmit`:** Triggered when a `<form>` element is submitted (via Enter key or submit button click).

Mastering how React harmonizes these three events unlocks complete control over client-side interactivity.

## 2. Handling Form Inputs with `onChange`
In standard HTML, the `change` event often only fires when an input loses focus (the `blur` event). In React, **`onChange` fires immediately on every single keystroke** or value modification.

This real-time response makes it effortless to implement **Controlled Components**, where input values are strictly bound to React state:

```jsx
import React, { useState } from 'react';

export default function StudentForm() {
  const [fullName, setFullName] = useState('');
  const [track, setTrack] = useState('full-stack');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="form-wrapper">
      {/* Text Input */}
      <div className="form-group">
        <label>Student Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Deepak Kumar"
        />
      </div>

      {/* Select Dropdown */}
      <div className="form-group">
        <label>Course Track:</label>
        <select value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="full-stack">Full-Stack Web Development</option>
          <option value="data-analysis">Data Analysis Mastery</option>
          <option value="python">Python Engineering</option>
        </select>
      </div>

      {/* Checkbox Input */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)} // Note: e.target.checked for checkboxes
          />
          I accept the laboratory code of conduct
        </label>
      </div>
    </div>
  );
}
```
*Key Detail: For checkboxes, read `e.target.checked` (boolean), NOT `e.target.value` (string).*

## 3. Handling Form Submissions with `onSubmit`
Submitting a `<form>` in standard HTML causes the browser to reload the entire web page and submit a `GET` or `POST` request to the action URL. In a React Single-Page Application, you intercept this behavior using `e.preventDefault()` inside your `onSubmit` handler:

```jsx
import React, { useState } from 'react';

export default function RegistrationCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    // 1. Stop full-page browser refresh
    e.preventDefault();

    // 2. Client-side validation
    if (!email.includes('@')) {
      alert('Please provide a valid email address.');
      return;
    }

    // 3. Process data (e.g., transmit to backend API)
    console.log('Registering student:', email);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="card-form">
      <h3>Newsletter & Lab Access</h3>
      
      <input
        type="email"
        placeholder="Enter email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">Subscribe</button>

      {submitted && <p className="success-msg">Thank you for enrolling!</p>}
    </form>
  );
}
```

---

## Practice Quiz

### Q1: In React, when does the `onChange` event fire for a text input?
- A) Only after the user closes the browser tab
- B) Instantly on every keystroke as the value changes
- C) Only when the user hits the Enter key
- D) Exactly 5 seconds after typing ceases
**Answer:** B
**Explanation:** Unlike native HTML where `change` often waits for blur, React's synthetic `onChange` fires on every keystroke, keeping component state in continuous sync with the UI.

### Q2: For a checkbox element (`<input type="checkbox" />`), which property of `e.target` holds its checked status?
- A) `e.target.value`
- B) `e.target.checked`
- C) `e.target.selected`
- D) `e.target.status`
**Answer:** B
**Explanation:** Checkboxes evaluate their toggle state via `e.target.checked` (which returns a boolean `true` or `false`), rather than `e.target.value`.

### Q3: Why is attaching `onSubmit` to the `<form>` element preferred over attaching `onClick` to the submit button?
- A) Buttons cannot have click handlers in HTML5
- B) `onSubmit` fires both when the button is clicked AND when the user presses the 'Enter' key inside an input field
- C) `onSubmit` runs 10x faster in React
- D) `onSubmit` automatically encrypts password fields
**Answer:** B
**Explanation:** Handling `onSubmit` on the `<form>` ensures natural accessibility: form submission triggers seamlessly whether the user clicks the submit button or presses Enter from any form control.

### Q4: What must be invoked inside the `onSubmit` handler to prevent the browser from reloading the page?
- A) `e.stopPropagation()`
- B) `e.preventDefault()`
- C) `e.cancelBubble = true`
- D) `window.stop()`
**Answer:** B
**Explanation:** `e.preventDefault()` suppresses the native HTML form submission behavior, allowing client-side React code to handle the submission without a full browser reload.

### Q5: What is a "Controlled Component" in React form architecture?
- A) A component governed by an AI algorithm
- B) A form element whose displayed value is directly controlled by React state via `value` and `onChange`
- C) An input field that can only accept numbers
- D) A component that cannot be unmounted
**Answer:** B
**Explanation:** A controlled component is a form element whose value is tied directly to React state, making React the single source of truth for the input's current value.
