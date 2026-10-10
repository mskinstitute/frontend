# Form Events & Validation in Modern JavaScript

Forms are the primary mechanism through which web applications collect user data. Robust client-side validation, smooth input feedback, and secure form submission handling are critical for delivering seamless user experiences and clean data payloads.

---

## 1. Essential Form Events

| Event | Fires When... | Typical Use Case |
| :--- | :--- | :--- |
| `submit` | The form is submitted (Enter pressed or submit button clicked) | Intercepting page reload, full validation, API dispatch |
| `input` | The value of an `<input>`, `<textarea>`, or `<select>` changes immediately | Real-time validation, character counters, live preview |
| `change` | The element loses focus after value has changed (or checkbox toggled) | Committing selections, debounced validations |
| `focus` | An element gains focus (Does not bubble) | Highlighting input active states, showing helper tooltips |
| `blur` | An element loses focus (Does not bubble) | Field-level validation once user leaves input |

```javascript
const emailInput = document.querySelector('#email-field');

// Immediate feedback as user types
emailInput.addEventListener('input', (e) => {
  console.log('Current value:', e.target.value);
});

// Validation on leaving field
emailInput.addEventListener('blur', (e) => {
  validateEmail(e.target.value);
});
```

---

## 2. Preventing Form Submission with preventDefault()

By default, an HTML `<form>` triggers an HTTP POST/GET request that refreshes the page. In modern SPA architectures, intercept this with `e.preventDefault()`:

```javascript
const registrationForm = document.querySelector('#form-register');

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Stop default browser page reload!

  // Perform form validation
  if (!validateForm()) {
    return;
  }

  // Extract form data and send via fetch
  const formData = new FormData(registrationForm);
  const payload = Object.fromEntries(formData.entries());

  console.log('Sending payload to server:', payload);
});
```

---

## 3. Extracting Form Data: The FormData API

The modern `FormData` API extracts all named form fields automatically:

```html
<form id="profile-form">
  <input type="text" name="username" value="alex_dev" />
  <input type="email" name="email" value="alex@example.com" />
  <select name="role">
    <option value="developer" selected>Developer</option>
    <option value="manager">Manager</option>
  </select>
</form>
```

```javascript
const form = document.querySelector('#profile-form');
const formData = new FormData(form);

// Access individual field values
console.log(formData.get('username')); // "alex_dev"

// Convert entire form directly to a JavaScript object
const formObject = Object.fromEntries(formData.entries());
console.log(formObject);
// { username: 'alex_dev', email: 'alex@example.com', role: 'developer' }
```

---

## 4. Constraint Validation API

Modern browsers include built-in validation attributes: `required`, `type="email"`, `minlength="8"`, `pattern="[A-Za-z]+"`. JavaScript can interact directly with this engine via the **Constraint Validation API**:

```javascript
const passwordInput = document.querySelector('#password');

// Checking validity
if (!passwordInput.checkValidity()) {
  console.log('Error reason:', passwordInput.validationMessage);
  console.log('Validity State:', {
    valueMissing: passwordInput.validity.valueMissing,
    tooShort: passwordInput.validity.tooShort,
    patternMismatch: passwordInput.validity.patternMismatch
  });
}

// Custom error message
if (passwordInput.value.length < 8) {
  passwordInput.setCustomValidity('Password must contain at least 8 characters!');
} else {
  passwordInput.setCustomValidity(''); // Empty string resets validity to valid!
}
```

---

## 5. Complete Field Validation Pattern

```javascript
function setupRealtimeValidation() {
  const form = document.querySelector('#signup-form');
  const email = form.querySelector('#email');
  const errorContainer = form.querySelector('#email-error');

  function validateEmailField() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = email.value.trim();

    if (!value) {
      errorContainer.textContent = 'Email address is required.';
      email.classList.add('invalid');
      return false;
    } else if (!emailRegex.test(value)) {
      errorContainer.textContent = 'Please enter a valid email address.';
      email.classList.add('invalid');
      return false;
    } else {
      errorContainer.textContent = '';
      email.classList.remove('invalid');
      email.classList.add('valid');
      return true;
    }
  }

  email.addEventListener('input', validateEmailField);
  email.addEventListener('blur', validateEmailField);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateEmailField()) {
      console.log('Form validated successfully. Submitting...');
    }
  });
}
```

---

## Practice Quiz

### Q1: Which event fires immediately every time the text value of an <input> is altered by a keystroke?
- A) change
- B) input
- C) select
- D) submit
**Answer:** B
**Explanation:** The `input` event triggers synchronously every time the control's value changes, making it ideal for live validation and character counting.

### Q2: Why is event.preventDefault() called in a form submit event handler?
- A) To reset the form inputs
- B) To prevent the browser from reloading the page or performing a synchronous HTTP POST request
- C) To disable the submit button permanently
- D) To bypass server-side validation
**Answer:** B
**Explanation:** By default, HTML forms submit data synchronously and trigger a page refresh. `event.preventDefault()` halts this behavior to allow handling submissions asynchronously via JavaScript.

### Q3: What is the most convenient way to convert an entire HTML form's named inputs into a standard JavaScript object?
- A) JSON.parse(form)
- B) Object.fromEntries(new FormData(form).entries())
- C) form.toObject()
- D) Array.from(form.inputs)
**Answer:** B
**Explanation:** `new FormData(form).entries()` returns an iterator of key-value pairs, which `Object.fromEntries()` converts into a clean JavaScript object.

### Q4: In the Constraint Validation API, how do you clear a custom validation error previously set via setCustomValidity()?
- A) input.setCustomValidity(null)
- B) input.clearCustomValidity()
- C) input.setCustomValidity('') (an empty string)
- D) input.valid = true
**Answer:** C
**Explanation:** Passing an empty string `""` to `setCustomValidity()` clears the custom error message and marks the element as valid.

### Q5: Which event fires when an input loses focus after its value has been modified?
- A) blur
- B) change
- C) focusout
- D) Both blur and change fire, with change signaling that the value was altered
**Answer:** D
**Explanation:** When an input loses focus after its value has been modified, `change` fires to report the committed change, followed by `blur` signaling loss of focus.
