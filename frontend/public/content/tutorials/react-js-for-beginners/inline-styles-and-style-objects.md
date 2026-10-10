# Inline Styles and Style Objects

## 1. Inline Styles in React
In traditional HTML, inline styles are declared as semicolon-delimited text strings:
```html
<div style="background-color: navy; color: white; padding: 12px;">
  Standard HTML
</div>
```
In React JSX, inline styles are passed as **JavaScript objects**. 

This gives styles the full power of JavaScript: dynamic variables, ternary operators, and computed calculations can be seamlessly blended into your component presentation.

```jsx
import React from 'react';

export default function ProgressBar({ percentage }) {
  // Style object defined as a JavaScript variable
  const containerStyle = {
    height: '16px',
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const fillStyle = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: percentage >= 100 ? '#10b981' : '#3b82f6',
    transition: 'width 0.3s ease-in-out'
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle} />
    </div>
  );
}
```

## 2. Converting CSS Properties to camelCase
Because property keys in JavaScript objects cannot contain hyphens without being wrapped in quotes, React converts CSS property names to **camelCase**:

| Standard CSS | React JSX Style Key |
| :--- | :--- |
| `background-color` | `backgroundColor` |
| `font-size` | `fontSize` |
| `margin-top` | `marginTop` |
| `border-radius` | `borderRadius` |
| `z-index` | `zIndex` |
| `box-shadow` | `boxShadow` |

## 3. Automatic Pixel Units for Numbers
When passing numeric values to dimension properties (such as `width`, `height`, `margin`, `padding`, `fontSize`), React automatically appends the `'px'` suffix for you:

```jsx
// React automatically appends 'px' to numbers for dimension properties:
<div style={{ width: 300, height: 150, padding: 20 }}>
  Box with automatic px units (width: 300px, height: 150px, padding: 20px)
</div>

// For unitless properties like zIndex, opacity, or flex, React leaves them as unitless numbers:
<div style={{ opacity: 0.8, zIndex: 10, flex: 1 }}>
  Unitless properties remain unchanged
</div>

// For other units (% , rem, em, vh), you must pass a string:
<div style={{ width: '50%', fontSize: '1.25rem', height: '100vh' }}>
  Explicit string units
</div>
```

## 4. Pros and Cons of Inline Styles

### Pros:
- **Scoped to the element:** Zero risk of style name collisions with other components.
- **Dynamic Values:** Ideal for styles driven by runtime data (e.g. progress bars, dynamic coordinates, drag-and-drop offsets).

### Cons:
- **No Pseudo-classes or Pseudo-elements:** Inline styles cannot define `:hover`, `:focus`, `:active`, `::before`, or `::after`.
- **No Media Queries:** Responsive breakpoints (`@media (max-width: 768px)`) cannot be written in inline style objects.
- **Performance:** Creating new style objects on every render creates minor garbage collection overhead compared to static CSS class names.

---

## Practice Quiz

### Q1: How are CSS property names written inside React style objects?
- A) kebab-case (e.g. `font-size`)
- B) camelCase (e.g. `fontSize`)
- C) Snake case (e.g. `font_size`)
- D) ALL CAPS (e.g. `FONT_SIZE`)
**Answer:** B
**Explanation:** React uses camelCase for CSS properties in style objects (e.g. `backgroundColor`, `fontSize`, `borderRadius`).

### Q2: What unit does React automatically append when a number is passed to a dimension property like `width: 250`?
- A) `%`
- B) `rem`
- C) `px`
- D) `em`
**Answer:** C
**Explanation:** For dimension properties, React automatically converts pure numbers into pixel strings (e.g., `250` becomes `'250px'`).

### Q3: Which CSS features CANNOT be implemented using standard React inline styles?
- A) Width and height
- B) Pseudo-classes (`:hover`, `:focus`) and media queries (`@media`)
- C) Background colors
- D) Border radius
**Answer:** B
**Explanation:** Inline styles are tied directly to the DOM element and cannot support CSS pseudo-classes, pseudo-elements, or responsive media queries.

### Q4: Why are inline styles ideal for a dynamic progress bar or drag-and-drop position?
- A) They are faster than WebGL
- B) The dimensions are calculated dynamically at runtime from JavaScript state and change continuously
- C) They bypass the browser DOM
- D) They work without JavaScript enabled
**Answer:** B
**Explanation:** Inline styles excel at runtime dynamic values (such as `width: ${progress}%`) that change too frequently to generate discrete CSS class names.

### Q5: How do you specify percentages or `rem` units in an inline style object?
- A) By passing them as strings: `{ width: '75%', fontSize: '1.5rem' }`
- B) Using CSS symbols: `{ width: 75%, fontSize: 1.5rem }`
- C) By adding a `unit` property
- D) Inline styles only accept pixels
**Answer:** A
**Explanation:** Non-pixel values must be passed as quoted strings (e.g., `'75%'`, `'2rem'`, `'100vh'`).
