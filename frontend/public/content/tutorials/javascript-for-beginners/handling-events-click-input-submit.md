# Handling Events: `click`, `input`, `submit`

Websites become truly alive when they respond to human actions: clicking a button, typing in a text field, moving the mouse, or submitting a form. In JavaScript, these user actions are called **Events**, and we handle them using **Event Listeners**.

---

## 1. The Standard: `addEventListener()`

The modern, universally adopted method to listen for events is `addEventListener`:

```
element.addEventListener(eventType, callbackFunction);
```

```javascript
const btn = document.querySelector("#enroll-btn");

btn.addEventListener("click", () => {
  console.log("Enrollment button was clicked!");
});
```

### Why NOT use `onclick = ...`?
Using `.addEventListener()` allows you to attach **multiple independent listeners** to the same element without overwriting each other, and lets you remove listeners when no longer needed.

---

## 2. Common Event Types

### A. Mouse Events: `click`, `dblclick`, `mouseenter`, `mouseleave`
```javascript
const card = document.querySelector(".card");

card.addEventListener("mouseenter", () => {
  card.classList.add("shadow-lg");
});

card.addEventListener("mouseleave", () => {
  card.classList.remove("shadow-lg");
});
```

### B. Keyboard & Input Events: `input`, `change`, `keydown`
- **`input`**: Fires **immediately on every keystroke** as the user types (ideal for live search and instant character counters).
- **`change`**: Fires only when the user finishes and leaves the input field (loses focus).

```javascript
const searchInput = document.querySelector("#search");
const liveCount = document.querySelector("#char-count");

searchInput.addEventListener("input", (event) => {
  // Access the current value typed by the user:
  const currentText = event.target.value;
  liveCount.textContent = `Characters: ${currentText.length}`;
});
```

---

## 3. Form Submission: `submit` and `e.preventDefault()`

When a user submits an HTML `<form>`, the browser's default behavior is to reload the entire web page and send a GET/POST HTTP request. In modern Single Page Applications (SPAs), we intercept this using **`e.preventDefault()`**:

```javascript
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
  // 1. STOP the browser from reloading the page!
  e.preventDefault();

  // 2. Read input values:
  const emailInput = document.querySelector("#email").value;
  const passwordInput = document.querySelector("#password").value;

  console.log("Submitting login asynchronously for:", emailInput);
  // Perform API fetch call without any page reload!
});
```

---

## 4. The Event Object (`e` or `event`)

When an event triggers, JavaScript automatically passes an **Event Object** to the callback function. It contains vital context:
- **`e.target`**: The actual DOM element that triggered the event.
- **`e.target.value`**: The current value of an input element.
- **`e.key`**: The specific key pressed during a keyboard event (e.g., `"Enter"`, `"Escape"`).
- **`e.preventDefault()`**: Prevents default browser action (reloads, navigation).

---

## Practice Quiz

### Q1: What is the recommended modern method to attach an event handler to an HTML element?
- A) `element.attach()`
- B) `element.addEventListener(eventType, callback)`
- C) `element.listen()`
- D) `element.on()`
**Answer:** B
**Explanation:** `addEventListener()` is the standardized DOM Level 2 event registration method that supports multiple listeners and clean removal.

### Q2: What is the critical purpose of calling `e.preventDefault()` inside a form's `submit` event listener?
- A) It deletes the form
- B) It prevents the browser from reloading the entire page, allowing JavaScript to handle data asynchronously
- C) It submits the form twice
- D) It encrypts the user password
**Answer:** B
**Explanation:** By default, HTML forms submit and reload the page. Calling `e.preventDefault()` stops this default reload behavior.

### Q3: Which event fires continuously and immediately on every single keystroke as the user types into an `<input>` field?
- A) `change`
- B) `input`
- C) `submit`
- D) `blur`
**Answer:** B
**Explanation:** The `input` event fires synchronously on each character addition, deletion, or modification, making it ideal for live searches.

### Q4: Inside an event callback `(e) => { ... }`, how do you access the current value of the text input that triggered the event?
- A) `e.target.value`
- B) `e.text`
- C) `document.value`
- D) `e.data`
**Answer:** A
**Explanation:** `e.target` points to the DOM element that fired the event, and `.value` retrieves its current textual contents.

### Q5: How can you detect if the user pressed the "Enter" key inside a `keydown` event listener?
- A) `if (e.key === "Enter")`
- B) `if (e.press === "return")`
- C) `if (e.isEnter)`
- D) `if (e.button === 1)`
**Answer:** A
**Explanation:** The `e.key` property returns the normalized string representation of the pressed key (`"Enter"`, `"Escape"`, `"ArrowUp"`, etc.).
