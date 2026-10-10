# Building Fallback UI with react-error-boundary

## 1. Modernizing Error Boundaries with `react-error-boundary`
While writing custom class-based Error Boundaries is educational, maintaining class components in an otherwise 100% functional modern React codebase creates friction.

The open-source community created **`react-error-boundary`**, the industry-standard package maintained by Brian Vaughn (former React core team member).

`react-error-boundary` provides:
- A declarative `<ErrorBoundary>` component with rich functional fallback support.
- The `useErrorBoundary()` hook for triggering and resetting boundaries from functional components.
- Direct support for resetting state when dependencies or route parameters change.

## 2. Installation
```bash
npm install react-error-boundary
```

## 3. Creating a Reusable Fallback Component
A fallback component receives `error` and `resetErrorBoundary` as props:

```jsx
// src/components/ErrorFallback.jsx
import React from 'react';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback-panel" role="alert">
      <div className="error-icon">⚠️</div>
      <h3>Component Display Error</h3>
      <pre className="error-message">{error.message}</pre>
      
      <div className="button-group">
        <button onClick={resetErrorBoundary} className="btn-primary">
          Try Again
        </button>
        <button onClick={() => window.location.reload()} className="btn-outline">
          Reload Application
        </button>
      </div>
    </div>
  );
}
```

## 4. Wrapping Components with Reset Keys
A powerful feature of `react-error-boundary` is **`resetKeys`**. 

If an error occurred because a specific course or ID was invalid, when the user navigates to a *different* course, the boundary **automatically resets itself without requiring a page refresh!**

```jsx
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import CoursePlayer from './components/CoursePlayer';

export default function CourseScreen({ currentCourseId }) {
  return (
    <div className="course-screen">
      <h2>Interactive Learning Studio</h2>

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        // Auto-reset boundary whenever currentCourseId changes!
        resetKeys={[currentCourseId]}
        onError={(error, info) => {
          console.error('Logged to monitoring service:', error, info);
        }}
      >
        <CoursePlayer courseId={currentCourseId} />
      </ErrorBoundary>
    </div>
  );
}
```

## 5. Triggering Boundaries from Async Code with `showBoundary()`
Normally, Error Boundaries cannot catch errors inside async functions or event handlers. 

`react-error-boundary` provides the **`useErrorBoundary()`** hook, whose **`showBoundary(err)`** method allows you to explicitly forward asynchronous errors into the nearest Error Boundary:

```jsx
import { useErrorBoundary } from 'react-error-boundary';

export default function AsyncWidget() {
  const { showBoundary } = useErrorBoundary();

  const handleFetch = async () => {
    try {
      await brokenNetworkCall();
    } catch (err) {
      // Forwards async error directly to the nearest ErrorBoundary!
      showBoundary(err);
    }
  };

  return <button onClick={handleFetch}>Trigger Async Action</button>;
}
```

---

## Practice Quiz

### Q1: What popular library is widely used to provide functional error boundary support in modern React applications?
- A) `react-error-boundary`
- B) `react-crash-kit`
- C) `redux-catcher`
- D) `vite-boundary`
**Answer:** A
**Explanation:** `react-error-boundary` is the standard npm library providing clean functional fallbacks, hooks, and automated resets for React error boundaries.

### Q2: What two essential props are provided to a custom fallback component by `<ErrorBoundary FallbackComponent={...}>`?
- A) `error` and `resetErrorBoundary`
- B) `url` and `history`
- C) `state` and `dispatch`
- D) `cookies` and `headers`
**Answer:** A
**Explanation:** Fallback components receive the caught `error` object and a `resetErrorBoundary` callback function to clear the error and attempt re-rendering.

### Q3: What is the purpose of the `resetKeys` prop in `react-error-boundary`?
- A) To reset the computer's keyboard layout
- B) To automatically reset the error boundary whenever any variable in the `resetKeys` array changes (such as route or ID changes)
- C) To delete SSH credentials
- D) To refresh all CSS
**Answer:** B
**Explanation:** Supplying `resetKeys={[id]}` informs the boundary to automatically clear its error state and re-render its children whenever the specified identifiers change.

### Q4: How can an asynchronous error caught inside a `try...catch` block in an event handler be sent to an Error Boundary?
- A) By calling `useErrorBoundary().showBoundary(error)`
- B) By throwing an alert
- C) It is impossible in React
- D) By restarting the browser
**Answer:** A
**Explanation:** `react-error-boundary`'s `showBoundary(error)` method imperatively triggers the enclosing Error Boundary from asynchronous code or event handlers.

### Q5: What ARIA role should be added to an error fallback container to inform assistive technologies of an alert?
- A) `role="dialog"`
- B) `role="alert"`
- C) `role="presentation"`
- D) `role="navigation"`
**Answer:** B
**Explanation:** `role="alert"` informs screen readers that important, time-sensitive error feedback has appeared on screen.
