# Template Literals & Tagged Templates

Beyond basic `${...}` string interpolation, ES6 Template Literals provide an advanced metaprogramming feature called **Tagged Templates**. Tagged templates allow developers to parse template literals with custom functions, powering libraries like `styled-components`, GraphQL (`gql`), and SQL query sanitizers.

---

## 1. Advanced String Interpolation & Nesting

Template literals can be nested inside other template literals, enabling declarative, dynamic HTML generation:

```javascript
const user = {
  name: "Sumit",
  courses: ["Full-Stack Dev", "Data Analysis", "Power BI"]
};

const profileHTML = `
  <div class="user-card">
    <h2>${user.name}</h2>
    <ul class="course-list">
      ${user.courses.map(c => `<li>${c}</li>`).join("")}
    </ul>
  </div>
`;
```

---

## 2. Tagged Template Functions Explained

A **Tagged Template** is an advanced function call where the function precedes the template literal without parentheses:

```javascript
tagFunction`Hello ${name}, you have ${count} messages.`;
```

### How JavaScript Dissects the Arguments:
When you tag a template literal, JavaScript breaks it into:
1. An array of static strings (`strings`).
2. The evaluated expression values as subsequent arguments (`...values`).

```javascript
function debugTag(strings, ...values) {
  console.log("Static strings:", strings);
  console.log("Dynamic values:", values);
}

const item = "Laptop";
const price = 45000;

debugTag`Product: ${item} costs ₹${price}.`;
// Static strings: ["Product: ", " costs ₹", "."]
// Dynamic values: ["Laptop", 45000]
```

---

## 3. Real-World Use Case: Automatic XSS Sanitizer

Tagged templates allow you to build custom security layers that automatically sanitize user-generated inputs to prevent Cross-Site Scripting (XSS):

```javascript
function safeHTML(strings, ...values) {
  return strings.reduce((accumulator, str, i) => {
    let value = values[i - 1];

    if (typeof value === "string") {
      // Escape harmful HTML characters
      value = value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    return accumulator + (value ?? "") + str;
  });
}

const userComment = `<script>stealCookies();</script>Amazing tutorial!`;
const cleanMarkup = safeHTML`<div class="comment">${userComment}</div>`;

console.log(cleanMarkup);
// <div class="comment">&lt;script&gt;stealCookies();&lt;/script&gt;Amazing tutorial!</div>
```

---

## 4. Raw Strings: `String.raw`

The `String.raw` tag accesses the raw, unescaped string text without processing escape characters like `\n` or `\t`:

```javascript
// Without String.raw, \n is treated as a newline:
const formatted = `Line 1\nLine 2`;

// With String.raw, \n is treated as raw characters \ and n:
const rawFilePath = String.raw`C:\Development\new_project\test.js`;
console.log(rawFilePath); // "C:\Development\new_project\test.js"
```

---

## Practice Quiz

### Q1: What is a "Tagged Template" in JavaScript?
- A) A template literal saved in local storage
- B) A function placed immediately before a template literal that intercepts and parses the static strings and dynamic expressions
- C) An HTML tag with a class
- D) A CSS pseudo-selector
**Answer:** B
**Explanation:** Tagged templates allow you to call a function using a template literal, receiving the raw string fragments and evaluated expressions as parameters.

### Q2: In a tagged template `fn` `Hello ${name}!` ``, what does the first parameter to `fn` contain?
- A) An array of strings representing the literal text chunks surrounding the expressions
- B) The evaluated value of `name`
- C) An HTML element
- D) The length of the string
**Answer:** A
**Explanation:** The first argument is an array of strings (e.g. `["Hello ", "!"]`), followed by the evaluated interpolation expressions.

### Q3: What is the primary purpose of the built-in `String.raw` tag?
- A) To convert strings into binary raw bytes
- B) To access raw strings as written, ignoring escape sequences like `\n` or `\t`
- C) To strip spaces from strings
- D) To translate text to lowercase
**Answer:** B
**Explanation:** `String.raw` produces raw string output where escape sequences (such as Windows file paths with `\`) are not processed as special characters.

### Q4: Which popular modern frontend libraries rely extensively on tagged template literals?
- A) `styled-components` (`styled.div` `...` ``) and Apollo GraphQL (`gql` `...` ``)
- B) jQuery
- C) Flash
- D) Bootstrap 3
**Answer:** A
**Explanation:** Modern styling and query tools like `styled-components` and GraphQL parse tagged templates to construct CSS components and AST query definitions.

### Q5: In `safeHTML` `<p>${input}</p>` ``, how many string fragments are in the `strings` array?
- A) 1
- B) 2 (`["<p>", "</p>"]`)
- C) 0
- D) 3
**Answer:** B
**Explanation:** Because there is one interpolation `${input}`, the static string is split into 2 chunks: the part before (`"<p>"`) and the part after (`"</p>"`).
