# Preventing Default Browser Behaviors

## 1. What Are Default Browser Behaviors?
Web browsers come with extensive pre-programmed, default behaviors for various HTML elements:
- **Clicking an `<a>` link:** Navigates the browser to the URL specified in the `href` attribute.
- **Submitting a `<form>`:** Reloads the page and dispatches a synchronous HTTP request to the server.
- **Right-clicking an element:** Opens the browser's native contextual menu.
- **Pressing the Spacebar or PageDown:** Scrolls the viewport down.
- **Dragging an image:** Displays a ghost silhouette of the dragged image.

In modern Single-Page Applications (SPAs), developers frequently need to suppress these native browser actions to execute custom client-side logic instead.

## 2. Using `e.preventDefault()`
React's `SyntheticEvent` provides the standard **`e.preventDefault()`** method to stop the browser's default action.

```jsx
import React from 'react';

export default function CustomLink({ url, children }) {
  const handleClick = (e) => {
    // Suppress browser from navigating and refreshing the page
    e.preventDefault();

    console.log(`Internal navigation initiated to: ${url}`);
    // Custom client-side router navigation (e.g., React Router navigate(url))
  };

  return (
    <a href={url} onClick={handleClick} className="spa-link">
      {children}
    </a>
  );
}
```

## 3. `preventDefault()` vs `stopPropagation()`
A frequent point of confusion among engineers is the difference between preventing defaults and stopping propagation:

- **`e.preventDefault()`:** Stops the browser's **default native action** associated with the event (e.g., preventing a form from submitting or a link from navigating). It **does NOT** stop the event from bubbling up the React component tree!
- **`e.stopPropagation()`:** Stops the event from **bubbling up** to parent DOM nodes. It **does NOT** prevent the browser's default action on the element!

```jsx
function NestedCard() {
  const handleCardClick = () => {
    console.log('Card container clicked!');
  };

  const handleFavoriteClick = (e) => {
    // 1. Prevent parent card's onClick from triggering
    e.stopPropagation();

    // 2. Prevent link from navigating away
    e.preventDefault();

    console.log('Item saved to favorites!');
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <h3>Full-Stack React Course</h3>
      
      <a href="/course/react" onClick={handleFavoriteClick} className="fav-btn">
        ★ Bookmark
      </a>
    </div>
  );
}
```
If you click the "Bookmark" link:
1. `e.preventDefault()` ensures the browser does not navigate away to `/course/react`.
2. `e.stopPropagation()` ensures `handleCardClick` on the outer `<div>` is not triggered.

## 4. Why Returning `false` Does NOT Work in React
In old legacy HTML inline event handlers (`<form onsubmit="return false;">`) and jQuery, returning `false` from an event handler implicitly prevented default actions and stopped propagation.

**React does not support returning `false`:**
```jsx
// ❌ FAILS in React: Returning false will NOT prevent page reload!
<form onSubmit={() => false}>
  <button type="submit">Submit</button>
</form>

// ✅ CORRECT: Must explicitly invoke e.preventDefault()
<form onSubmit={(e) => { e.preventDefault(); }}>
  <button type="submit">Submit</button>
</form>
```

---

## Practice Quiz

### Q1: What method must be invoked to cancel the browser's default behavior for an event in React?
- A) `e.stopDefault()`
- B) `e.preventDefault()`
- C) `e.cancel()`
- D) `return false`
**Answer:** B
**Explanation:** In React, you must explicitly call `e.preventDefault()` on the event object to cancel the browser's native default behavior.

### Q2: What is the key difference between `e.preventDefault()` and `e.stopPropagation()`?
- A) `preventDefault` only works on forms; `stopPropagation` only works on buttons
- B) `preventDefault` stops the browser's native action; `stopPropagation` prevents the event from bubbling up the DOM tree
- C) They are identical synonyms in React
- D) `stopPropagation` is deprecated in modern browsers
**Answer:** B
**Explanation:** `e.preventDefault()` cancels the element's default browser behavior (e.g. page reloads or link jumps), whereas `e.stopPropagation()` prevents the event from bubbling up to parent ancestor elements.

### Q3: Why does returning `false` from a React event handler fail to stop default behavior?
- A) React ignores return values from event handlers; you must call `e.preventDefault()` explicitly
- B) JavaScript does not have a boolean `false` keyword
- C) React only accepts strings as return values
- D) Returning `false` converts the handler into a class component
**Answer:** A
**Explanation:** Unlike jQuery or legacy HTML inline handlers, React synthetic event handlers do not check for a `false` return value; you must call `e.preventDefault()` directly.

### Q4: If an `<a>` tag has an `onClick` handler with `e.preventDefault()`, what happens when the user clicks the link?
- A) The browser downloads the webpage as a PDF
- B) The browser does NOT navigate to the link's `href` URL, allowing React custom code to run instead
- C) The browser opens the link in a new private window
- D) The link element is deleted from the DOM
**Answer:** B
**Explanation:** Calling `e.preventDefault()` on an anchor element suppresses standard browser navigation to the target URL, allowing client-side routers or custom functions to execute.

### Q5: What happens if you call both `e.preventDefault()` and `e.stopPropagation()` inside a button click handler nested inside a card?
- A) The computer reboots
- B) The button suppresses its default action and prevents the click event from triggering the parent card's click handler
- C) React throws a fatal error because only one can be called per event
- D) The button becomes disabled permanently
**Answer:** B
**Explanation:** Calling both methods cleanly suppresses both the native element default action and stops event bubbling up to parent containers.
