# JSX Attributes, ClassName, and Self-Closing Tags

## 1. Attributes in JSX
Attributes in JSX allow you to configure elements and components with data, behavior, and styling. While many attributes resemble their HTML counterparts, JSX attributes follow standard JavaScript DOM properties and strict naming conventions.

### Passing String Literals vs Expressions
- For static strings, pass the value enclosed in quotes:
  ```jsx
  <input type="email" placeholder="student@mskinstitute.com" />
  ```
- For numbers, booleans, arrays, functions, or variables, wrap them in curly braces:
  ```jsx
  <input
    type="number"
    min={1}
    max={100}
    disabled={false}
    defaultValue={defaultCount}
  />
  ```

## 2. The `className` Attribute
In standard HTML, styles are applied using the `class` attribute (`<div class="card">`). In JSX, you must write `className`:

```jsx
// Static classes
<div className="card shadow-md p-4 rounded-xl">
  <h2 className="text-xl font-bold">Course Overview</h2>
</div>

// Dynamic classes with template literals
function StatusBadge({ isEnrolled }) {
  return (
    <span className={`badge ${isEnrolled ? 'badge-success' : 'badge-warning'}`}>
      {isEnrolled ? 'Active' : 'Pending'}
    </span>
  );
}
```

## 3. Passing Inline Styles: The Double Curly Braces `{{}}`
A common stumbling block is inline styling in JSX. In HTML, styles are passed as semicolon-separated strings (`style="color: red; font-size: 16px;"`). In JSX, the `style` attribute expects a **JavaScript object**.

This creates the syntax pattern `style={{ ... }}`:
- The **outer braces** `{ }` indicate a dynamic JavaScript expression.
- The **inner braces** `{ }` represent a JavaScript object literal.

```jsx
export default function AlertBox() {
  const alertStyles = {
    backgroundColor: '#fee2e2', // camelCase instead of background-color
    color: '#991b1b',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px'            // camelCase instead of font-size
  };

  return (
    <div style={alertStyles}>
      <strong>Attention:</strong> Your lab environment resets in 10 minutes.
    </div>
  );
}

// Or passed directly inline:
<div style={{ color: 'blue', marginTop: '20px' }}>
  Direct Inline Styling
</div>
```
*Note: CSS property names that feature hyphens (like `font-size`, `background-color`, `margin-top`) are converted to **camelCase** in JSX (`fontSize`, `backgroundColor`, `marginTop`).*

## 4. Self-Closing Tags
In standard HTML5, several elements are categorized as "void elements" (elements that cannot contain child nodes or closing tags), such as:
- `<img>`
- `<input>`
- `<br>`
- `<hr>`
- `<meta>`

In HTML, writing `<img>` without a slash is valid. **In JSX, this is a syntax error.** Any element that has no children must be explicitly self-closed using a trailing forward slash:

```jsx
// ❌ Syntax Error in JSX: Unterminated JSX contents
<input type="text">
<img src="logo.png">
<hr>

// ✅ Valid JSX: Properly self-closing
<input type="text" />
<img src="logo.png" alt="Company Logo" />
<hr />

// ✅ Custom React components with no children should also self-close
<Sidebar navigation={navLinks} />
```

---

## Practice Quiz

### Q1: Why does inline styling in JSX often look like `style={{ color: 'red' }}`?
- A) The first brace is an array; the second brace is an object
- B) The outer braces open a JavaScript expression in JSX; the inner braces define a JavaScript object literal
- C) It is a special proprietary syntax only understood by Vite
- D) The double braces are required for CSS animations
**Answer:** B
**Explanation:** The outer pair of braces `{ }` signals that JavaScript is being evaluated in JSX, and the inner pair `{ }` represents the JavaScript object literal holding CSS properties.

### Q2: How must the CSS property `background-color` be written when passing inline styles to a React element?
- A) `background-color` (in quotes as `'background-color'`) or `backgroundColor`
- B) `Background_Color`
- C) `bg-color`
- D) `style.bg`
**Answer:** A
**Explanation:** In React inline style objects, CSS property names are written in camelCase (`backgroundColor`) or as quoted strings (`'background-color'`).

### Q3: Which of the following elements is syntactically INVALID in JSX?
- A) `<input type="checkbox" />`
- B) `<hr />`
- C) `<img src="banner.jpg" alt="Banner">`
- D) `<div className="container"></div>`
**Answer:** C
**Explanation:** In JSX, all elements without children must be self-closed with a forward slash (`<img ... />`). Leaving an `<img>` tag unclosed causes a JSX parse error.

### Q4: How do you pass a boolean `true` value to an attribute named `isActive` in JSX?
- A) `isActive="true"`
- B) `isActive={true}` or simply `<Component isActive />`
- C) `isActive=(true)`
- D) `isActive=[true]`
**Answer:** B
**Explanation:** In JSX, passing `{true}` or providing the prop name without a value (like `<Component isActive />`) evaluates to a boolean `true`. Passing `"true"` passes a string instead.

### Q5: What is the correct way to specify multiple dynamic classes conditionally using standard JavaScript template literals?
- A) `className={`card ${isPrimary ? 'card-primary' : 'card-secondary'}`}`
- B) `class="card {isPrimary ? 'card-primary' : 'card-secondary'}"`
- C) `className="card" + {isPrimary}`
- D) `class:dynamic={isPrimary}`
**Answer:** A
**Explanation:** Combining template literals with JSX curly braces (`className={`base-class ${condition ? 'a' : 'b'}`}`) is the standard declarative pattern for dynamic classes.
