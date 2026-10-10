# Client-Side Form Validation and Error Handling

## 1. Why Client-Side Validation Matters
While server-side validation is non-negotiable for security and data integrity, **client-side validation** is essential for user experience:
- **Instantaneous Feedback:** Users are notified of errors immediately without waiting for network round-trips.
- **Reduced Server Load:** Malformed or incomplete requests are stopped before they ever reach backend APIs.
- **Guided Correction:** Clear, accessible error messages direct users to specific invalid fields.

```
[User Submits Form]
         │
         ▼
[Run Client-Side Validation Rules]
 ├─ Has Errors? ──> [Set errors object state] ──> [Display inline field warnings]
 └─ Valid?      ──> [Clear errors]            ──> [Dispatch HTTP API payload]
```

## 2. Implementing a Pure Validation Engine
A clean pattern separates **validation logic** from UI rendering:

```jsx
import React, { useState } from 'react';

// Pure validation function: inputs -> errors object
function validateForm(values) {
  const errors = {};

  // Full Name validation
  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }

  // Email validation with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Please provide a valid email format';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
}
```

## 3. Connecting Validation to Component State
```jsx
export default function RegistrationForm() {
  const [values, setValues] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Real-time cleanup: clear error as user types once touched
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Validate single field on blur
    const fieldErrors = validateForm(values);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    // If errors object contains any keys, halt submission
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Valid Payload Sent:', values);
      // Simulate API network call
      await new Promise((r) => setTimeout(r, 1000));
      alert('Registration successful!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h2>Create Student Account</h2>

      {/* Full Name */}
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.fullName && touched.fullName ? 'input-error' : ''}
          aria-invalid={Boolean(errors.fullName)}
        />
        {errors.fullName && touched.fullName && (
          <span className="error-msg">{errors.fullName}</span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email && touched.email ? 'input-error' : ''}
        />
        {errors.email && touched.email && (
          <span className="error-msg">{errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.password && touched.password ? 'input-error' : ''}
        />
        {errors.password && touched.password && (
          <span className="error-msg">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

## 4. The "Touched" State Pattern
A critical UX nuance: **never show validation errors on pristine fields before the user has interacted with them!**

Tracking `touched[fieldName]` on the `onBlur` event ensures errors only appear after the user has visited a field and left it invalid, preventing aggressive and annoying error flashes when a form first opens.

---

## Practice Quiz

### Q1: Why should forms include `noValidate` on the `<form>` element when implementing custom React validation?
- A) It deletes the form from the webpage
- B) It suppresses the browser's native HTML5 validation tooltips so custom React validation UI can take over
- C) It bypasses CORS security policies
- D) It turns off JavaScript
**Answer:** B
**Explanation:** Adding `noValidate` disables the browser's default native popup bubbles, allowing your custom React error messages and styles to display consistently across all browsers.

### Q2: What is the purpose of the "touched" state in form architecture?
- A) To count how many times a touch-screen device tapped the button
- B) To ensure error messages only display after the user has interacted with/blurred that specific field, avoiding premature errors on pristine fields
- C) To prevent users from pasting text
- D) To encrypt passwords
**Answer:** B
**Explanation:** The "touched" pattern prevents frustrating user experiences by withholding error displays until the user has actually focused and exited (blurred) the field.

### Q3: Which event is typically used to mark a form field as "touched"?
- A) `onFocus`
- B) `onBlur`
- C) `onKeyDown`
- D) `onWheel`
**Answer:** B
**Explanation:** The `onBlur` event fires when an input loses focus, indicating that the user has finished interacting with that field for the moment.

### Q4: How do you verify if the `validationErrors` object has any active errors before dispatching an API call?
- A) `validationErrors == true`
- B) `Object.keys(validationErrors).length > 0`
- C) `validationErrors.includes('error')`
- D) `typeof validationErrors === 'error'`
**Answer:** B
**Explanation:** If an errors object `{}` has zero keys (`length === 0`), the form is completely valid; if it contains any keys, errors exist.

### Q5: Can client-side validation replace server-side validation?
- A) Yes, client-side validation is completely secure
- B) No, client-side validation is strictly for user experience; malicious actors can bypass client code easily, so server-side validation remains mandatory
- C) Only when using HTTPS
- D) Yes, if written in TypeScript
**Answer:** B
**Explanation:** Client-side validation can be easily bypassed using curl, Postman, or disabled JavaScript. Server-side validation is mandatory for application security and data integrity.
