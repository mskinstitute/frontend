# Passing Arguments to Event Handlers

## 1. The Challenge of Custom Arguments
When attaching an event listener in React, passing just the function name works when no extra arguments are needed:
```jsx
// React automatically passes the SyntheticEvent 'e'
<button onClick={handleClick}>Click</button>
```
However, in real-world applications, you frequently need to pass custom arguments to your handler—such as an item ID, a user object, or an array index:
```jsx
// ❌ WRONG: Executes deleteItem(course.id) immediately on render!
<button onClick={deleteItem(course.id)}>Delete</button>
```
Writing `deleteItem(course.id)` invokes the function during render, triggering premature deletions and potentially infinite re-render loops!

## 2. Solution 1: Inline Arrow Functions (Standard Modern Pattern)
The most widespread, readable, and idiomatic approach in modern React is wrapping the function call in an **inline arrow function**:

```jsx
// ✅ Correct: The arrow function is executed ONLY when the user clicks
<button onClick={() => deleteItem(course.id)}>
  Delete Course
</button>
```

### Accessing Both Custom Arguments and the Event Object (`e`):
If your handler also needs access to the event object (e.g. to inspect coordinates or prevent default behavior), declare `e` in the arrow function parameter list:

```jsx
<button onClick={(e) => handleEdit(course.id, e)}>
  Edit
</button>
```

In the handler definition:
```jsx
const handleEdit = (id, e) => {
  e.stopPropagation(); // Stop event bubbling
  console.log('Editing course ID:', id);
};
```

## 3. Solution 2: Higher-Order Functions (Currying)
In advanced component architectures, you can write a handler that returns another function. This is known as function currying:

```jsx
export default function CourseList({ courses }) {
  // Higher-order function returns an event handler pre-bound with courseId
  const createDeleteHandler = (courseId) => (e) => {
    console.log(`Deleting course: ${courseId}`, e.target);
  };

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          {course.title}
          {/* createDeleteHandler returns the actual event handler function */}
          <button onClick={createDeleteHandler(course.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## 4. Performance Considerations with Inline Functions
In older React documentation, developers were warned against creating inline arrow functions (`() => doSomething()`) due to memory allocation concerns.

In modern JavaScript engines (V8, JavaScriptCore) and modern React:
- Creating small inline functions on render has negligible performance overhead in 99% of applications.
- You should only optimize inline arrow functions (using `useCallback`) if passing handlers down to heavily memoized child components (`React.memo`) that render massive lists.
- For standard components, prioritize clarity, readability, and maintainability.

---

## Practice Quiz

### Q1: What happens if you write `<button onClick={handleRemove(item.id)}>Remove</button>`?
- A) The button will never respond to clicks
- B) `handleRemove` will be invoked immediately when the component renders, not when the user clicks
- C) React displays an invalid syntax modal
- D) The item is removed only after a 5-second delay
**Answer:** B
**Explanation:** Placing parentheses `()` after the function name immediately executes that function during the component's render phase.

### Q2: What is the most common and idiomatic way to pass custom arguments to an event handler in React?
- A) Using an inline arrow function: `onClick={() => handleRemove(item.id)}`
- B) Writing inline SQL statements
- C) Adding global window variables
- D) Creating a separate CSS file for each button
**Answer:** A
**Explanation:** Wrapping the function call in an inline arrow function (`() => handleRemove(item.id)`) creates a function reference that executes only when the event actually fires.

### Q3: How can you pass both a custom item ID and the React SyntheticEvent `e` to a handler?
- A) `onClick={handleAction(e, item.id)}`
- B) `onClick={(e) => handleAction(item.id, e)}`
- C) `onClick={e => item.id}`
- D) `onClick={() => handleAction(event)}`
**Answer:** B
**Explanation:** Capturing `e` in the inline arrow function parameter list `(e) => handleAction(item.id, e)` cleanly passes both the event object and the custom parameter.

### Q4: What is a higher-order event handler?
- A) An event handler that runs on a remote cloud server
- B) A function that takes custom arguments and returns an event handler function
- C) An event handler that can only be written in TypeScript
- D) An event listener attached to the HTML `<head>` tag
**Answer:** B
**Explanation:** A higher-order function (or curried function) accepts custom parameters (like an ID) and returns the actual event handler function `(e) => { ... }`.

### Q5: Is creating an inline arrow function inside an `onClick` prop acceptable in modern React?
- A) No, it is deprecated in React 18
- B) Yes, modern JS engines allocate functions with negligible overhead; optimization is only needed for specialized performance hotspots
- C) No, it causes a memory crash in modern browsers
- D) Yes, but only if the component has fewer than 2 props
**Answer:** B
**Explanation:** Inline arrow functions are completely idiomatic and performant for virtually all standard React use cases, with memoization (`useCallback`) reserved for targeted profiling hotspots.
