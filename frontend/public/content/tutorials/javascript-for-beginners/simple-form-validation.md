# Project: Simple Form Validation

Form validation is one of the most critical responsibilities of frontend engineering. Validating data on the client side provides immediate feedback to users, prevents bad submissions, and enhances security before payloads reach backend servers.

---

## 1. Validation Requirements

In this hands-on project, we will validate a Student Registration Form:
1. **Full Name**: Must not be empty, minimum 3 characters.
2. **Email Address**: Must match a valid email format using regular expressions.
3. **Password**: Must be at least 8 characters and contain at least one number.
4. **Confirm Password**: Must match the Password field exactly.
5. **Real-time Feedback**: Show red error borders and messages on invalid inputs; green borders on valid inputs.

---

## 2. The HTML Structure (`index.html`)

```html
<form id="signup-form" novalidate>
  <h2>Student Registration</h2>

  <!-- Full Name -->
  <div class="form-group">
    <label for="username">Full Name</label>
    <input type="text" id="username" placeholder="Sumit Sharma">
    <small class="error-msg"></small>
  </div>

  <!-- Email -->
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" id="email" placeholder="sumit@example.com">
    <small class="error-msg"></small>
  </div>

  <!-- Password -->
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" placeholder="At least 8 characters">
    <small class="error-msg"></small>
  </div>

  <!-- Confirm Password -->
  <div class="form-group">
    <label for="confirm-password">Confirm Password</label>
    <input type="password" id="confirm-password" placeholder="Re-type password">
    <small class="error-msg"></small>
  </div>

  <button type="submit" id="submit-btn">Register Account</button>
  <div id="success-alert" class="success-banner hidden">Registration Successful! 🎉</div>
</form>
```

> [!NOTE]
> The `novalidate` attribute on the `<form>` disables default browser tooltips so our custom JavaScript UI can control all error styling.

---

## 3. The CSS Styling (`style.css`)

```css
.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e1;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s ease;
}

/* Valid and Invalid State Classes */
input.valid {
  border-color: #10b981; /* Green */
}

input.invalid {
  border-color: #ef4444; /* Red */
}

.error-msg {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.hidden { display: none; }
.success-banner {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #dcfce7;
  color: #15803d;
  border-radius: 0.5rem;
  text-align: center;
}
```

---

## 4. The JavaScript Validation Engine (`validator.js`)

```javascript
const form = document.querySelector("#signup-form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const successAlert = document.querySelector("#success-alert");

// Helper: Show Error
function showError(input, message) {
  input.classList.remove("valid");
  input.classList.add("invalid");
  const errorElement = input.parentElement.querySelector(".error-msg");
  errorElement.textContent = message;
}

// Helper: Show Success
function showSuccess(input) {
  input.classList.remove("invalid");
  input.classList.add("valid");
  const errorElement = input.parentElement.querySelector(".error-msg");
  errorElement.textContent = "";
}

// Validator 1: Name Check
function checkUsername() {
  const val = username.value.trim();
  if (val.length < 3) {
    showError(username, "Name must be at least 3 characters long");
    return false;
  }
  showSuccess(username);
  return true;
}

// Validator 2: Email Regex Check
function checkEmail() {
  const val = email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) {
    showError(email, "Please enter a valid email address");
    return false;
  }
  showSuccess(email);
  return true;
}

// Validator 3: Password Strength
function checkPassword() {
  const val = password.value;
  const hasNumber = /\d/.test(val);
  if (val.length < 8 || !hasNumber) {
    showError(password, "Password must be >= 8 chars and include at least 1 number");
    return false;
  }
  showSuccess(password);
  return true;
}

// Validator 4: Password Confirmation
function checkConfirmPassword() {
  if (confirmPassword.value !== password.value || confirmPassword.value === "") {
    showError(confirmPassword, "Passwords do not match");
    return false;
  }
  showSuccess(confirmPassword);
  return true;
}

// Live Validation on Blur / Input
username.addEventListener("blur", checkUsername);
email.addEventListener("blur", checkEmail);
password.addEventListener("input", checkPassword);
confirmPassword.addEventListener("input", checkConfirmPassword);

// Form Submit Handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNameValid = checkUsername();
  const isEmailValid = checkEmail();
  const isPasswordValid = checkPassword();
  const isConfirmValid = checkConfirmPassword();

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
    successAlert.classList.remove("hidden");
    form.reset();
    setTimeout(() => successAlert.classList.add("hidden"), 5000);
  }
});
```

---

## Practice Quiz

### Q1: Why should you add `novalidate` to an HTML `<form>` when building custom JavaScript validation?
- A) It deletes the form
- B) It suppresses the browser's default HTML5 popup validation bubbles so custom CSS and JS error messages take over
- C) It disables JavaScript
- D) It encrypts form inputs
**Answer:** B
**Explanation:** `novalidate` prevents native browser validation popups from interfering with custom JavaScript validation UI.

### Q2: What regular expression tests whether a string contains at least one numeric digit?
- A) `/\d/`
- B) `/[a-z]/`
- C) `/^$/`
- D) `/@/`
**Answer:** A
**Explanation:** In regular expressions, `\d` matches any digit character from 0 to 9.

### Q3: Which event fires when an input element loses focus (e.g. user clicks outside the field)?
- A) `blur`
- B) `focus`
- C) `hover`
- D) `leave`
**Answer:** A
**Explanation:** The `blur` event fires when an element loses focus, making it the ideal moment to validate an input without nagging the user while they are actively typing.

### Q4: Why is `.trim()` applied to text input values during validation?
- A) It converts text to uppercase
- B) It removes accidental leading and trailing whitespace that might trick validation checks
- C) It encrypts the text
- D) It checks for spelling mistakes
**Answer:** B
**Explanation:** Calling `.trim()` ensures that an input containing only spaces (e.g. `"   "`) is recognized as empty.

### Q5: Can client-side JavaScript form validation completely replace backend validation on the server?
- A) Yes, frontend validation is 100% sufficient
- B) No, client-side validation can be bypassed by disabling JavaScript or using tools like Postman; backend validation is always mandatory for security
- C) Only in single-page apps
- D) Only on Apache servers
**Answer:** B
**Explanation:** Client-side validation exists for user experience; backend server validation is mandatory because malicious users can send HTTP requests directly to APIs, bypassing browser checks.
