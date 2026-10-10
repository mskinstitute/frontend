# Selecting Elements: `getElementById` and `querySelector`

The **DOM** (Document Object Model) is a tree-like representation of an HTML document created by the browser. To make web pages interactive with JavaScript, the very first step is selecting the HTML elements you want to inspect, manipulate, or listen to.

---

## 1. The DOM Tree Mental Model

```
document (Root)
└── <html>
    ├── <head>
    │   └── <title>
    └── <body>
        ├── <header>
        │   └── <h1 id="main-title">
        └── <main>
            ├── <button class="btn btn-primary">
            └── <p class="description">
```

---

## 2. Classic Selection Methods

### A. `document.getElementById('id')`
Selects a single unique element by its `id` attribute. Returns the element or `null`:
```javascript
// HTML: <h1 id="main-title">Welcome</h1>
const heading = document.getElementById("main-title");
console.log(heading); // <h1>Welcome</h1>
```
> [!NOTE]
> Do **not** include `#` when using `getElementById()`! Just pass the plain ID string: `"main-title"`.

### B. `document.getElementsByClassName('class')`
Returns an **HTMLCollection** (array-like, live list) of all matching elements:
```javascript
// HTML: <p class="text">One</p> <p class="text">Two</p>
const paragraphs = document.getElementsByClassName("text");
```

---

## 3. Modern Selection Methods: `querySelector` & `querySelectorAll`

Modern web development uses CSS selectors with two standardized methods:

```
+-----------------------------------------------------------------------------+
|                      MODERN DOM SELECTOR METHODS                            |
+-----------------------------------------------------------------------------+
| document.querySelector("selector")                                          |
| -> Returns the FIRST matching element found in document (or null)           |
|                                                                             |
| document.querySelectorAll("selector")                                       |
| -> Returns a static NodeList of ALL matching elements                       |
+-----------------------------------------------------------------------------+
```

### Supported CSS Selectors:
- **By Tag Name**: `document.querySelector("h1")`
- **By ID (`#`)**: `document.querySelector("#main-title")`
- **By Class (`.`)**: `document.querySelector(".btn-primary")`
- **By Attribute (`[...]`)**: `document.querySelector("input[type='email']")`
- **Complex Hierarchical**: `document.querySelector("nav ul > li.active a")`

### Example: Selecting Multiple Elements with `querySelectorAll`:
`querySelectorAll` returns a `NodeList` which supports modern array methods like `.forEach()`:

```javascript
const cards = document.querySelectorAll(".course-card");

cards.forEach((card, index) => {
  console.log(`Card ${index}:`, card);
});
```

---

## 4. Selection Best Practices Comparison

| Method | Syntax | Return Type | Supports Complex Selectors? |
|---|---|---|:---:|
| **`getElementById`** | `getElementById('nav')` | Single Element | No (ID only, fastest) |
| **`querySelector`** | `querySelector('#nav')` | Single Element (First) | **Yes** (Any CSS selector) |
| **`querySelectorAll`**| `querySelectorAll('.card')` | Static `NodeList` | **Yes** (Any CSS selector) |

---

## Practice Quiz

### Q1: What does `document.getElementById("submit-btn")` return if no element has that ID?
- A) `undefined`
- B) `null`
- C) An empty array `[]`
- D) Throws a DOMException
**Answer:** B
**Explanation:** If no element matching the specified ID exists in the DOM tree, `getElementById()` returns `null`.

### Q2: How does `document.querySelector(".active")` differ from `document.querySelectorAll(".active")`?
- A) `querySelector` selects only the first matching element; `querySelectorAll` selects all matching elements as a NodeList
- B) `querySelector` only works in Firefox
- C) `querySelectorAll` deletes elements
- D) There is no difference
**Answer:** A
**Explanation:** `querySelector` returns the first match found, while `querySelectorAll` returns all matching elements in the document.

### Q3: Which symbol must prefix a class name when selecting with `document.querySelector`?
- A) `#` (Hash)
- B) `.` (Dot)
- C) `@` (At)
- D) `$` (Dollar)
**Answer:** B
**Explanation:** `querySelector` uses standard CSS selector syntax, where class names are prefixed with a dot (e.g. `document.querySelector(".btn")`).

### Q4: Which symbol prefixes an ID selector in `document.querySelector`?
- A) `#` (e.g. `document.querySelector("#header")`)
- B) `.`
- C) `!`
- D) `~`
**Answer:** A
**Explanation:** In CSS selector syntax, IDs are identified by a leading hash `#`.

### Q5: Can you directly call `.forEach()` on the result of `document.querySelectorAll()`?
- A) No, it must be converted to an array first
- B) Yes, modern browser NodeLists natively support the `.forEach()` method
- C) Only in Internet Explorer
- D) Only with numbers
**Answer:** B
**Explanation:** Modern browser implementations of `NodeList` implement a native `.forEach()` method for convenient iteration.
