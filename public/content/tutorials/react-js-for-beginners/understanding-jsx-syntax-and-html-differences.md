# Understanding JSX Syntax and HTML Differences

## 1. What is JSX?
**JSX** stands for **JavaScript XML**. It is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside your JavaScript files. While it visually resembles HTML, JSX possesses the full expressive power of JavaScript.

Browsers cannot natively execute JSX. Before reaching the browser, build tools (such as Vite's Babel or esbuild transforms) compile JSX markup into standard JavaScript function calls (`React.createElement` or the modern JSX runtime `jsx()` / `jsxs()` functions).

### JSX Code:
```jsx
const element = <h1 className="title">Welcome to MSK</h1>;
```

### Transpiled JavaScript Output:
```javascript
import { jsx as _jsx } from 'react/jsx-runtime';

const element = _jsx('h1', {
  className: 'title',
  children: 'Welcome to MSK'
});
```

## 2. Key Differences Between JSX and HTML
Because JSX is transpiled into JavaScript objects and interacts with the DOM's JavaScript properties rather than HTML attributes, several critical syntax differences must be respected:

| HTML Attribute | JSX Equivalent | Reason / Rationale |
| :--- | :--- | :--- |
| `class` | `className` | `class` is a reserved keyword in JavaScript for defining classes. |
| `for` | `htmlFor` | `for` is a reserved keyword in JavaScript for `for` loops. |
| `tabindex` | `tabIndex` | JSX attributes follow standard camelCase naming conventions. |
| `onclick` | `onClick` | React uses camelCase synthetic event handlers. |
| `style="color: red;"` | `style={{ color: 'red' }}` | Styles must be passed as JavaScript objects, not raw strings. |
| `<input>` (unclosed) | `<input />` | All elements must be explicitly closed in JSX. |

## 3. Strict Syntax Rules of JSX

### Rule 1: Return a Single Root Element
A component cannot return multiple top-level sibling elements without wrapping them in a single parent container (such as a `<div>` or a `<React.Fragment>` / `<>`):
```jsx
// ❌ Syntax Error: Adjacent JSX elements must be wrapped in an enclosing tag
export default function Card() {
  return (
    <h2>Title</h2>
    <p>Description</p>
  );
}

// ✅ Valid: Wrapped in a single parent tag
export default function Card() {
  return (
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  );
}
```

### Rule 2: Close All Tags
In HTML, void tags like `<img>`, `<input>`, `<hr>`, and `<br>` can be left unclosed. In JSX, every tag **must** be explicitly closed:
```jsx
// ❌ Syntax Error in JSX
<img src="/avatar.png">
<input type="text">

// ✅ Valid JSX: Self-closing tags
<img src="/avatar.png" alt="User Avatar" />
<input type="text" placeholder="Enter your name" />
```

### Rule 3: CamelCase Most Properties
Almost all attributes and event handlers in JSX are written in camelCase (`aria-*` and `data-*` attributes remain hyphenated as in standard HTML):
```jsx
<button
  type="button"
  tabIndex={0}
  aria-label="Close dialog"
  data-testid="modal-close-btn"
  onClick={() => console.log('Clicked!')}
>
  Close
</button>
```

---

## Practice Quiz

### Q1: What is JSX in the context of React?
- A) A replacement database query language for PostgreSQL
- B) A syntax extension for JavaScript that allows writing HTML-like markup in JS code
- C) A CSS stylesheet preprocessor like Sass or Less
- D) A server-side routing protocol
**Answer:** B
**Explanation:** JSX (JavaScript XML) is a syntax extension that enables developers to write declarative HTML-like element structures directly inside JavaScript files.

### Q2: Why does JSX use `className` instead of the traditional HTML `class` attribute?
- A) HTML deprecated the `class` attribute in 2020
- B) `class` is a reserved keyword in JavaScript used for class declarations
- C) `className` runs 50% faster in web browsers
- D) `className` is required by CSS stylesheets
**Answer:** B
**Explanation:** Because JSX compiles down to standard JavaScript objects, using the reserved keyword `class` would cause JavaScript parsing errors; hence `className` is used.

### Q3: How must self-closing HTML void tags (such as `<img>` and `<input>`) be formatted in JSX?
- A) They must be left without closing tags or slashes
- B) They must always include an explicit closing slash, such as `<img />` or `<input />`
- C) They must be wrapped inside `<script>` tags
- D) They must be written in uppercase: `<IMG>`
**Answer:** B
**Explanation:** JSX enforces strict XML-like rules where all tags must be explicitly closed, either with a matching closing tag (`</tag>`) or self-closing forward slash (`<tag />`).

### Q4: Which attribute replaces the standard HTML `for` attribute on `<label>` elements in JSX?
- A) `labelFor`
- B) `htmlFor`
- C) `forId`
- D) `inputRef`
**Answer:** B
**Explanation:** Since `for` is a reserved JavaScript keyword for loop statements, JSX uses `htmlFor` to bind `<label>` elements to input IDs.

### Q5: How are HTML custom data attributes (`data-*`) written in JSX?
- A) Converted to camelCase: `dataTestId`
- B) Maintained with lowercase and hyphens: `data-testid`
- C) Capitalized: `DATA_TEST_ID`
- D) Wrapped in quotes: `"data-testid"`
**Answer:** B
**Explanation:** While standard DOM properties in JSX are camelCased, `data-*` and `aria-*` attributes preserve their standard hyphenated lowercase format for accessibility and HTML compliance.
