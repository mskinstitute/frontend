# Embedding JavaScript Expressions in JSX

## 1. The Curly Braces `{}` Window
JSX allows you to seamlessly integrate dynamic JavaScript logic directly into your presentation markup. Whenever you open curly braces `{}` within JSX, you are opening a window back into JavaScript. 

Inside these curly braces, you can write any valid **JavaScript expression** that produces a value.

```jsx
export default function Greeting() {
  const studentName = 'Priya Sharma';
  const score = 94;

  return (
    <div className="profile-banner">
      <h1>Hello, {studentName}!</h1>
      <p>Your assessment score is: {score} / 100</p>
      <p>Status: {score >= 80 ? 'Distinction' : 'Standard Pass'}</p>
    </div>
  );
}
```

## 2. Expressions vs Statements in JSX
A critical concept that trips up beginners is the distinction between a **JavaScript expression** and a **JavaScript statement**:

- **Expressions (Allowed in JSX):** An expression evaluates to a single value. Examples include variable names, arithmetic operations, function calls, template literals, and ternary operators.
- **Statements (Forbidden in JSX):** Statements perform actions or declare control flow but do *not* evaluate to a single value. Examples include `if/else` blocks, `for` loops, `while` loops, and variable declarations (`const x = 10;`).

```jsx
// ❌ Syntax Error: 'if' is a statement, not an expression
<p>{if (isLoggedIn) { 'Welcome!' }}</p>

// ✅ Valid: Ternary operator is an expression that evaluates to a value
<p>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</p>

// ✅ Valid: Function invocation is an expression
<p>Today is: {new Date().toLocaleDateString()}</p>

// ✅ Valid: Array mapping produces a new array of elements
<ul>
  {['React', 'Vite', 'TypeScript'].map(item => <li key={item}>{item}</li>)}
</ul>
```

## 3. Passing Dynamic Attributes via `{}`
Curly braces are not only for element text content; they are also used to bind dynamic attributes and properties:

```jsx
const user = {
  name: 'Rahul Verma',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  imageSize: 90
};

export default function Avatar() {
  return (
    <img
      className="avatar-circle"
      src={user.avatarUrl}
      alt={`Profile photo of ${user.name}`}
      width={user.imageSize}
      height={user.imageSize}
    />
  );
}
```
*Note: Do not wrap curly braces in quotes when passing dynamic variables (`src={user.avatarUrl}`, NOT `src="{user.avatarUrl}"`). Quotes treat the value as a literal string.*

## 4. How JSX Renders Different JavaScript Types
When rendering values inside `{}`:
- **Strings and Numbers:** Rendered directly to the screen as text nodes (`{'MSK'}` -> `MSK`, `{42}` -> `42`).
- **Booleans (`true`, `false`), `null`, and `undefined`:** Rendered as **nothing** (empty). They produce no DOM output, making them ideal for conditional rendering.
- **Arrays:** Flattened and each item is rendered sequentially (`{[<span key="1">A</span>, <span key="2">B</span>]}`).
- **Objects:** Cannot be rendered directly as children! Attempting to render an object (`{user}`) throws an error: `"Objects are not valid as a React child"`.

```jsx
// ❌ Throws runtime error: Cannot render object directly
const user = { name: 'Aman' };
return <div>{user}</div>;

// ✅ Valid: Access specific string/primitive properties
return <div>{user.name}</div>;
```

---

## Practice Quiz

### Q1: What syntax is used to embed dynamic JavaScript expressions inside JSX?
- A) Parentheses `()`
- B) Angle brackets `<>`
- C) Curly braces `{}`
- D) Square brackets `[]`
**Answer:** C
**Explanation:** Curly braces `{}` denote a JavaScript expression inside JSX, switching context from markup to dynamic JavaScript evaluation.

### Q2: Why can you NOT use a standard `if/else` block directly inside JSX `{}`?
- A) React does not support conditional logic
- B) An `if/else` block is a statement, not an expression that evaluates to a value
- C) JavaScript removed `if/else` in modern ES6
- D) Browsers block `if` keywords inside HTML
**Answer:** B
**Explanation:** Inside JSX curly braces, only JavaScript expressions (code that resolves to a value) are permitted. Statements like `if/else` or `for` do not resolve to values.

### Q3: What happens when React encounters `null`, `undefined`, or `false` inside `{}` in JSX?
- A) It throws a fatal compile error
- B) It prints the string "null" or "undefined" onto the webpage
- C) It renders nothing (empty), leaving no visible DOM node
- D) It automatically refreshes the browser page
**Answer:** C
**Explanation:** In React JSX, booleans (`true`, `false`), `null`, and `undefined` are safely ignored and produce zero DOM output, making them perfect for conditional toggles.

### Q4: Which of the following is an INCORRECT way to bind a dynamic image source in JSX?
- A) `<img src={profilePic} alt="User" />`
- B) `<img src="{profilePic}" alt="User" />`
- C) `<img src={`/images/${fileName}`} alt="User" />`
- D) `<img src={user.getAvatar()} alt="User" />`
**Answer:** B
**Explanation:** Wrapping curly braces in quotes (`src="{profilePic}"`) treats the expression as a literal string `"{profilePic}"` rather than evaluating the variable.

### Q5: What error occurs if you try to render a plain JavaScript object directly as a child in JSX (e.g. `const item = { id: 1 }; return <div>{item}</div>;`)?
- A) "Invalid Array Prototype"
- B) "Objects are not valid as a React child"
- C) "DOM Node Overflow"
- D) "Uncaught SyntaxError: unexpected token"
**Answer:** B
**Explanation:** React throws `"Objects are not valid as a React child"` because React cannot infer how a plain multi-property object should be rendered to the DOM without explicit property targeting.
