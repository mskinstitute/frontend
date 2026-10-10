# Destructuring Props and Default Prop Values

## 1. The Power of Prop Destructuring
In standard JavaScript functions, accessing properties repeatedly through an object parameter (`props.title`, `props.subtitle`, `props.onClick`) creates verbose, repetitive code. 

Modern React applications universally leverage **ES6 Object Destructuring** directly within the component function parameter signature:

### Without Destructuring:
```jsx
function CourseHeader(props) {
  return (
    <header className="course-header">
      <h1>{props.title}</h1>
      <p>{props.author}</p>
      <span>{props.rating} ★</span>
    </header>
  );
}
```

### With Parameter Destructuring:
```jsx
function CourseHeader({ title, author, rating }) {
  return (
    <header className="course-header">
      <h1>{title}</h1>
      <p>{author}</p>
      <span>{rating} ★</span>
    </header>
  );
}
```
Destructuring makes the component's contract immediately obvious at a glance: any developer inspecting the function header can immediately see all the props the component expects.

## 2. Providing Default Prop Values
When building reusable design system components, certain props should have sensible defaults if the consumer fails to provide them. 

You can assign **ES6 default parameter values** directly inside the destructuring pattern:

```jsx
export default function Button({
  children,
  variant = 'primary',  // Defaults to 'primary' if omitted
  size = 'md',          // Defaults to 'md' if omitted
  disabled = false,     // Defaults to false if omitted
  onClick
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Usage:
```jsx
// Uses defaults: variant='primary', size='md', disabled=false
<Button onClick={handleSave}>Save</Button>

// Overrides specific defaults
<Button variant="danger" size="lg" disabled={isSubmitting}>
  Delete Account
</Button>
```
*Note: A default value is applied if the incoming prop is `undefined` or omitted entirely. If the parent explicitly passes `null`, the default value is **not** applied, because `null` is an intentional value in JavaScript.*

## 3. Rest Props and Prop Spreading
When creating wrapper components (such as a custom `<TextInput>` or `<Card>`), you frequently want to extract a few specific props and forward all remaining standard HTML attributes (`id`, `placeholder`, `aria-*`, `onFocus`) to the underlying element.

You can combine destructuring with the **ES6 Rest syntax (`...rest`)** and **JSX Spread (`{...rest}`)**:

```jsx
export default function TextInput({ label, error, ...restProps }) {
  return (
    <div className="input-group">
      {label && <label className="form-label">{label}</label>}
      
      <input
        className={`form-input ${error ? 'input-error' : ''}`}
        {...restProps} // Spreads placeholder, value, onChange, type, disabled, etc.
      />
      
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
```

### Usage:
```jsx
<TextInput
  label="Corporate Email"
  type="email"
  placeholder="sumit@mskinstitute.com"
  autoComplete="email"
  required
  error={emailError}
  value={email}
  onChange={handleEmailChange}
/>
```

---

## Practice Quiz

### Q1: What JavaScript ES6 feature allows extracting specific prop keys directly inside a component's function parameters?
- A) Optional Chaining
- B) Object Destructuring
- C) Template Literals
- D) Arrow Function Currying
**Answer:** B
**Explanation:** ES6 Object Destructuring allows unpacking properties directly from the props object in the function signature (e.g., `function Card({ title, desc })`).

### Q2: In the component `function Avatar({ size = 50 })`, what value will `size` receive if the parent calls `<Avatar size={undefined} />`?
- A) `null`
- B) `undefined`
- C) `50`
- D) `0`
**Answer:** C
**Explanation:** ES6 default parameter values trigger whenever the argument is omitted or strictly equal to `undefined`. Therefore, `size` defaults to `50`.

### Q3: What value will `size` receive if the parent calls `<Avatar size={null} />` in the previous question?
- A) `50`
- B) `null`
- C) `0`
- D) `undefined`
**Answer:** B
**Explanation:** Default values in JavaScript only activate for `undefined`. Passing `null` is considered an explicit assignment, so `size` remains `null`.

### Q4: What does the JSX spread syntax `<input {...restProps} />` accomplish?
- A) It deletes all props from memory
- B) It automatically forwards all key-value pairs in `restProps` as attributes onto the `<input>` element
- C) It converts inputs into radio buttons
- D) It prevents form submissions
**Answer:** B
**Explanation:** The JSX spread attribute syntax (`{...rest}`) copies all remaining properties in the object directly onto the rendered JSX tag.

### Q5: Why is prop destructuring widely considered a best practice in modern React?
- A) It speeds up network downloads over HTTP/2
- B) It makes component interfaces explicit, clean, and avoids repetitive `props.` prefixes
- C) It is required for React StrictMode to work
- D) It automatically adds TypeScript type checking at runtime
**Answer:** B
**Explanation:** Destructuring provides self-documenting component signatures, improves readability, and streamlines variable references throughout the component body.
