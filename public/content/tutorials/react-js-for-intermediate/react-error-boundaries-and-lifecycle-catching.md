# React Error Boundaries and Lifecycle Catching

## 1. The Vulnerability of Uncaught UI Errors
In client-side React applications, a JavaScript runtime error inside any component's render function (such as attempting to read a property of `undefined`: `student.profile.avatar`) corrupts React's internal Virtual DOM tree.

In standard React:
> **An uncaught JavaScript error inside a component unmounts the ENTIRE React component tree, leaving the user with a completely blank white screen!**

```
Uncaught Error in <StudentCard>:
[StudentCard crashes] ──► [Parent crashes] ──► [Root crashes] ──► [BLANK WHITE SCREEN OF DEATH]
```
For users, a blank white screen looks like a complete system crash with zero explanation or recovery path.

## 2. What is an Error Boundary?
An **Error Boundary** is a React component that catches JavaScript errors anywhere in its child component tree, logs the errors, and displays a friendly **fallback UI** instead of crashing the entire application.

Error Boundaries catch errors during:
- Rendering
- Lifecycle methods
- Constructors of class components beneath them in the tree

```
With Error Boundary:
[App Shell (Navbar, Sidebar)] ──> Renders Normally!
   └─ [Error Boundary]
         └─ [StudentCard crashes!] ──► Error Caught! ──► [Renders: "Failed to load card. [Retry]"]
```

## 3. Why Error Boundaries Must Be Class Components
As of React 18, **Error Boundaries must be implemented as Class Components**. There is currently no functional hook equivalent for `componentDidCatch` or `getDerivedStateFromError`.

An Error Boundary class defines one or both of these lifecycle methods:
1. **`static getDerivedStateFromError(error)`:** Renders a fallback UI upon an error.
2. **`componentDidCatch(error, errorInfo)`:** Logs error information to an external telemetry service (e.g. Sentry, Datadog).

```jsx
// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // 1. Update state so next render shows fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // 2. Log error details to telemetry service
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // sendToErrorReportingService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default alert
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-card">
          <h3>Something went wrong.</h3>
          <p className="error-details">{this.state.error?.message}</p>
          <button onClick={this.handleReset} className="btn-retry">
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 4. What Error Boundaries Do NOT Catch
Error Boundaries do **NOT** catch errors in:
- **Event Handlers:** (e.g. errors inside `onClick`). Use standard `try...catch` blocks for event handlers.
- **Asynchronous Code:** (`setTimeout`, `requestAnimationFrame`, raw unhandled Promise rejections).
- **Server-Side Rendering (SSR):** Errors occurring during server HTML streaming.
- **Errors thrown inside the Error Boundary component itself** (rather than in its children).

---

## Practice Quiz

### Q1: What happens to a React application if a runtime JavaScript error is thrown during rendering and no Error Boundary is present?
- A) The error is silently ignored
- B) The entire React component tree unmounts, leaving the user with an empty blank screen
- C) React automatically rolls back to the previous version of the app
- D) The browser downloads a backup file
**Answer:** B
**Explanation:** React unmounts the entire application tree upon uncaught render errors to prevent displaying corrupted or dangerous UI states.

### Q2: Which static lifecycle method is used by an Error Boundary to update its state and trigger fallback rendering?
- A) `componentDidMount()`
- B) `static getDerivedStateFromError(error)`
- C) `shouldComponentUpdate()`
- D) `getSnapshotBeforeUpdate()`
**Answer:** B
**Explanation:** `static getDerivedStateFromError(error)` is invoked after an error is thrown in a child component, returning the updated state that renders the fallback UI.

### Q3: Why must Error Boundaries still be written as Class Components in React 18?
- A) Functional components are deprecated
- B) React has not yet introduced functional hook equivalents for `componentDidCatch` or `getDerivedStateFromError`
- C) Class components run 10x faster
- D) Only class components support CSS
**Answer:** B
**Explanation:** Error boundary lifecycle methods (`componentDidCatch`, `getDerivedStateFromError`) do not currently have direct functional hook equivalents in React core.

### Q4: Which of the following errors is CANNOT be caught by an Error Boundary?
- A) An error inside a child component's JSX render return
- B) An error thrown inside an asynchronous `onClick` event handler
- C) An error thrown inside a child constructor
- D) An error inside a child component's `componentDidMount`
**Answer:** B
**Explanation:** Error boundaries only catch errors during rendering and React lifecycle execution; errors inside event handlers do not happen during rendering and must be caught via `try...catch`.

### Q5: How should Error Boundaries be strategically placed across an enterprise application?
- A) Wrap every single HTML `<button>` in its own Error Boundary
- B) Place them at key structural thresholds (e.g. around major widget cards, routes, and navigation shells) so a localized failure doesn't crash surrounding functional UI
- C) Only one Error Boundary at the root of `main.jsx`
- D) Error boundaries should never be used
**Answer:** B
**Explanation:** Granular boundaries isolate crashes to specific failing widgets (like a broken chart or comment list) while keeping navigation and the rest of the application fully operational.
