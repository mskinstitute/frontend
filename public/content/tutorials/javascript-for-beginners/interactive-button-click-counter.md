# Project: Interactive Button Click Counter

Welcome to your first real-world JavaScript project! In this lesson, we will construct a clean, responsive **Interactive Click Counter Application** featuring state persistence, increment/decrement controls, reset capabilities, and dynamic CSS styling based on state.

---

## 1. Application Specifications

Our Click Counter must provide:
1. **Interactive UI**: Increment (+), Decrement (-), and Reset buttons.
2. **Dynamic Styling**: Display green text for positive numbers, red text for negative numbers, and slate text for zero.
3. **Step Selection**: Allow users to increment by 1, 5, or 10.
4. **State Persistence**: Save the count in the browser's `localStorage` so refreshing the page preserves the count!

---

## 2. The HTML Markup (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter App | MSK Institute</title>
  <link rel="stylesheet" href="style.css">
  <script src="counter.js" defer></script>
</head>
<body>
  <div class="card">
    <h2>Interactive Counter</h2>
    <div id="counter-value" class="counter-display">0</div>

    <div class="controls">
      <button id="btn-decrement" class="btn btn-danger">- Decrease</button>
      <button id="btn-reset" class="btn btn-secondary">Reset</button>
      <button id="btn-increment" class="btn btn-success">+ Increase</button>
    </div>

    <div class="step-selector">
      <label for="step">Step Value:</label>
      <select id="step-select">
        <option value="1" selected>1</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  </div>
</body>
</html>
```

---

## 3. The CSS Stylesheet (`style.css`)

```css
* {
  box-sizing: border-box;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: #f1f5f9;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.counter-display {
  font-size: 5rem;
  font-weight: 800;
  margin: 1.5rem 0;
  transition: color 0.2s ease, transform 0.1s ease;
}

.counter-positive { color: #10b981; }
.counter-negative { color: #ef4444; }
.counter-neutral  { color: #64748b; }

.controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.9; }
.btn-success { background: #10b981; color: white; }
.btn-danger  { background: #ef4444; color: white; }
.btn-secondary { background: #cbd5e1; color: #1e293b; }

.step-selector {
  font-size: 0.875rem;
  color: #475569;
}
```

---

## 4. The JavaScript Logic (`counter.js`)

```javascript
// 1. Select DOM Elements
const counterDisplay = document.querySelector("#counter-value");
const btnIncrement = document.querySelector("#btn-increment");
const btnDecrement = document.querySelector("#btn-decrement");
const btnReset = document.querySelector("#btn-reset");
const stepSelect = document.querySelector("#step-select");

// 2. Initialize State from LocalStorage (or fallback to 0)
let count = Number(localStorage.getItem("savedCount")) || 0;

// 3. Render Function to update UI & Colors
function updateUI() {
  counterDisplay.textContent = count;

  // Reset classes
  counterDisplay.classList.remove("counter-positive", "counter-negative", "counter-neutral");

  // Dynamic conditional coloring:
  if (count > 0) {
    counterDisplay.classList.add("counter-positive");
  } else if (count < 0) {
    counterDisplay.classList.add("counter-negative");
  } else {
    counterDisplay.classList.add("counter-neutral");
  }

  // Save to localStorage
  localStorage.setItem("savedCount", count);
}

// 4. Attach Event Listeners
btnIncrement.addEventListener("click", () => {
  const step = Number(stepSelect.value);
  count += step;
  updateUI();
});

btnDecrement.addEventListener("click", () => {
  const step = Number(stepSelect.value);
  count -= step;
  updateUI();
});

btnReset.addEventListener("click", () => {
  count = 0;
  updateUI();
});

// Initial render on page load
updateUI();
```

---

## Practice Quiz

### Q1: What method is used to persist data in the browser so that it survives page refreshes?
- A) `sessionStorage.clear()`
- B) `localStorage.setItem(key, value)`
- C) `document.cookieDelete()`
- D) `window.save()`
**Answer:** B
**Explanation:** `localStorage.setItem(key, value)` saves data persistently on the client side with no expiration date.

### Q2: Why is `Number(localStorage.getItem("savedCount"))` necessary?
- A) To encrypt the value
- B) Because `localStorage` stores all values as strings; `Number()` casts the retrieved string back into a numeric value
- C) LocalStorage only accepts numbers
- D) To prevent syntax errors in CSS
**Answer:** B
**Explanation:** Everything stored in `localStorage` is serialized to a string, so numeric data must be parsed back to numbers using `Number()` or `parseInt()`.

### Q3: Why is creating a dedicated `updateUI()` function considered clean architecture?
- A) It prevents the need for CSS
- B) It consolidates state rendering into a Single Source of Truth, avoiding duplicate DOM updates in each event listener
- C) It doubles browser framerates
- D) It deletes global variables
**Answer:** B
**Explanation:** Centralizing UI updates into a single render function ensures state and presentation remain synchronized without duplicating logic across button clicks.

### Q4: How do you read the currently selected numeric value of an HTML `<select>` element?
- A) `selectElement.options.all`
- B) `Number(selectElement.value)`
- C) `selectElement.text`
- D) `selectElement.selected()`
**Answer:** B
**Explanation:** The `.value` property returns the value of the currently selected `<option>`, which can then be converted to a number.

### Q5: What CSS transition property was added to `.counter-display` to ensure smooth color shifting?
- A) `transition: color 0.2s ease`
- B) `animation: infinite`
- C) `hover: smooth`
- D) `color-delay: 1s`
**Answer:** A
**Explanation:** CSS `transition` animates property changes smoothly over the specified duration when class names toggle.
