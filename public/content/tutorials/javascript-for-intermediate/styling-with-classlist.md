# Styling with classList in Modern JavaScript

Manipulating CSS classes via JavaScript is the industry-standard method for altering visual states (e.g., dropdown toggles, modal dialogs, validation borders, theme switches). The `classList` API provides a clean, safe, and intuitive interface for managing an element's class attributes without string manipulation errors.

---

## 1. Why classList Replaced className

Historically, developers manipulated `element.className` as a raw string:

```javascript
// LEGACY (Error-Prone):
element.className += ' active'; // Could result in 'buttonactive' if space is omitted!
element.className = element.className.replace('active', '').trim();
```

Modern browsers provide `element.classList`, which returns a `DOMTokenList` offering dedicated utility methods.

---

## 2. Core classList Methods

### add(), remove(), and replace()

```javascript
const alertBox = document.querySelector('.alert');

// Adding classes (supports multiple arguments)
alertBox.classList.add('alert-warning', 'shadow-lg');

// Removing classes
alertBox.classList.remove('alert-info');

// Replacing one class with another
alertBox.classList.replace('alert-warning', 'alert-danger');
```

### contains()

Checks whether an element currently has a specific class. Returns a boolean:

```javascript
const themeToggleBtn = document.querySelector('#btn-theme');

if (document.body.classList.contains('dark-mode')) {
  console.log('Current theme is Dark');
} else {
  console.log('Current theme is Light');
}
```

---

## 3. toggle() with Optional Boolean Force

The `toggle()` method adds the class if it is missing, and removes it if it is present:

```javascript
const drawer = document.querySelector('#sidebar-drawer');

// Simple toggle
drawer.classList.toggle('open');
```

### The Force Parameter

`classList.toggle(className, force)` accepts a second boolean argument:
- `force === true`: Class is always added.
- `force === false`: Class is always removed.

```javascript
function handleScroll() {
  const isScrolledPastHeader = window.scrollY > 150;
  const navbar = document.querySelector('.main-nav');

  // If scrolled past 150px, force add 'sticky'; otherwise force remove it
  navbar.classList.toggle('sticky', isScrolledPastHeader);
}

window.addEventListener('scroll', handleScroll);
```

---

## 4. Comparing classList vs. Inline Styles (style attribute)

| Feature | `classList.add('my-class')` | `element.style.color = 'red'` |
| :--- | :--- | :--- |
| **Separation of Concerns** | High (Styles stay in CSS files) | Low (Styles hardcoded in JS) |
| **CSS Specificity** | Normal class specificity | Inlines have higher specificity (hard to override) |
| **Media Queries / Pseudo-classes**| Supported via CSS rules (`:hover`, `@media`) | Not supported directly in inline styles |
| **Maintainability** | Centralized in CSS stylesheets | Scattered across JS code files |

> **Rule of Thumb:** Use `classList` for all visual states. Only use `element.style` for truly dynamic, runtime-calculated values like mouse coordinates (`style.transform = ...`) or canvas dimensions.

---

## 5. Practical Example: Accordion Component

```javascript
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.closest('.accordion-item');
      const isOpen = accordionItem.classList.contains('active');

      // Close all sibling items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // If it was not open, open it
      if (!isOpen) {
        accordionItem.classList.add('active');
      }
    });
  });
}
```

---

## Practice Quiz

### Q1: What type of object is element.classList?
- A) A standard JavaScript Array
- B) A DOMTokenList
- C) A CSSStyleDeclaration
- D) A JSON String
**Answer:** B
**Explanation:** `element.classList` is an instance of `DOMTokenList`, providing methods like `add()`, `remove()`, `toggle()`, and `contains()`.

### Q2: What does element.classList.toggle('highlight', true) do?
- A) It removes the class 'highlight'
- B) It always adds 'highlight' regardless of whether it already existed
- C) It throws a TypeError
- D) It toggles the class only if the user confirms with an alert
**Answer:** B
**Explanation:** The second boolean argument `force` when set to `true` guarantees the class is added (functioning like `.add()`).

### Q3: Which classList method replaces one CSS class with another in a single call?
- A) classList.switch('old', 'new')
- B) classList.swap('old', 'new')
- C) classList.replace('old', 'new')
- D) classList.exchange('old', 'new')
**Answer:** C
**Explanation:** `element.classList.replace('oldClass', 'newClass')` replaces the existing class with the new class and returns a boolean indicating success.

### Q4: Why is using classList preferred over assigning element.style properties for visual states?
- A) element.style is deprecated in modern HTML5
- B) classList maintains separation of concerns and lets CSS control responsive layouts and pseudo-classes
- C) classList executes asynchronously in Web Workers
- D) element.style cannot modify colors
**Answer:** B
**Explanation:** Using `classList` preserves separation of concerns, keeping presentation rules in CSS where media queries, animations, and pseudo-states are easily managed.

### Q5: What does element.classList.contains('active') return if the element has classes 'nav-link active show'?
- A) 1
- B) 'active'
- C) true
- D) 'show'
**Answer:** C
**Explanation:** `classList.contains()` tests for the existence of a given class and returns a boolean (`true` or `false`).
