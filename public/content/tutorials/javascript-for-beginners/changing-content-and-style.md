# Changing Content and Style with JavaScript

Once an element is selected from the DOM, JavaScript can dynamically alter its text content, inject HTML markup, manipulate CSS styles, and add/remove CSS classes to create engaging user experiences.

---

## 1. Changing Text & HTML Content

JavaScript provides three distinct properties for updating content:

| Property | Behavior | Security Risk |
|---|---|:---:|
| **`textContent`** | Sets or returns the plain text; ignores HTML tags | **100% Safe (No XSS)** |
| **`innerText`** | Similar to textContent, but respects CSS visibility | Safe |
| **`innerHTML`** | Parses string as HTML, inserting tags into the DOM | **XSS Risk!** (Caution) |

```javascript
const heading = document.querySelector("#title");
const container = document.querySelector(".card");

// 1. Updating text safely (Recommended for text):
heading.textContent = "Welcome to MSK Coding Bootcamp!";

// 2. Injecting HTML structure:
container.innerHTML = `
  <div class="badge">New</div>
  <p>Course enrollment is now open!</p>
`;
```

> [!CAUTION]
> **Cross-Site Scripting (XSS) Warning**: Never assign unsanitized user input directly to `innerHTML`! Malicious users can inject `<script>` tags or inline SVG exploit handlers. Always use `textContent` when displaying user input.

---

## 2. Manipulating Inline CSS Styles (`element.style`)

You can modify CSS styles directly using the `.style` property.
CSS properties with hyphens (`background-color`, `font-size`) are written in **`camelCase`** in JavaScript:

```javascript
const banner = document.querySelector("#banner");

banner.style.backgroundColor = "#1e293b";
banner.style.color = "#ffffff";
banner.style.fontSize = "24px";
banner.style.padding = "16px 24px";
banner.style.borderRadius = "12px";
```

---

## 3. The Superior Approach: Manipulating CSS Classes with `classList`

Changing individual inline styles with `.style` leads to messy JavaScript. The professional approach is to define styled classes in CSS and toggle them using **`classList`**:

```javascript
const alertBox = document.querySelector(".alert");

// 1. Add one or more classes:
alertBox.classList.add("alert-success", "fade-in");

// 2. Remove a class:
alertBox.classList.remove("alert-warning");

// 3. Toggle a class (Adds if absent, removes if present!):
// Perfect for Dark Mode toggles and Hamburger menus!
alertBox.classList.toggle("dark-mode");

// 4. Check if element contains a class (Returns true/false):
if (alertBox.classList.contains("dark-mode")) {
  console.log("Dark theme is active!");
}
```

---

## 4. Manipulating Attributes: `setAttribute` and `getAttribute`

```javascript
const userAvatar = document.querySelector("#avatar");

// Get an attribute value:
console.log(userAvatar.getAttribute("src")); // "images/default.png"

// Set or change an attribute value:
userAvatar.setAttribute("src", "images/sumit_profile.jpg");
userAvatar.setAttribute("alt", "Profile photo of Sumit");

// Or use direct property shortcuts:
userAvatar.src = "images/sumit_profile.jpg";
```

---

## Practice Quiz

### Q1: Which property should you use to update plain text content safely without risking Cross-Site Scripting (XSS) vulnerabilities?
- A) `innerHTML`
- B) `textContent`
- C) `outerHTML`
- D) `document.write()`
**Answer:** B
**Explanation:** `textContent` sets raw text without parsing HTML tags, completely mitigating XSS script injection risks.

### Q2: How is the CSS property `background-color` written when setting styles via JavaScript (e.g. `el.style....`)?
- A) `el.style.background-color`
- B) `el.style.backgroundColor` (camelCase)
- C) `el.style["background-color-css"]`
- D) `el.style.bg`
**Answer:** B
**Explanation:** CSS property names containing hyphens are converted to `camelCase` when accessed via JavaScript's `element.style` object.

### Q3: What does `element.classList.toggle("active")` do?
- A) Deletes the element from the DOM
- B) Adds the class `"active"` if it is missing, or removes it if it is already present
- C) Replaces all other classes with `"active"`
- D) Disables the element
**Answer:** B
**Explanation:** `.toggle()` checks for the class: if present, it removes it; if absent, it adds it, returning a boolean indicating the new state.

### Q4: Why is adding/removing CSS classes via `classList` preferred over writing individual styles with `element.style`?
- A) It separates presentation (CSS) from logic (JS), keeping code modular, maintainable, and responsive
- B) `element.style` is not supported on mobile
- C) `classList` makes images load faster
- D) It reduces RAM by 90%
**Answer:** A
**Explanation:** Maintaining styles inside CSS classes keeps design concerns in stylesheets while JavaScript merely switches states cleanly via class names.

### Q5: What method checks whether an element currently has a specific CSS class applied?
- A) `element.classList.has("class")`
- B) `element.classList.contains("class")`
- C) `element.classList.find("class")`
- D) `element.classList.includes("class")`
**Answer:** B
**Explanation:** `.classList.contains(className)` returns `true` if the class is present on the element and `false` otherwise.
