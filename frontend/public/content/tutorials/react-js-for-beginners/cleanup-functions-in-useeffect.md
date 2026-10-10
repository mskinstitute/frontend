# Cleanup Functions in useEffect

## 1. Why Cleanup Is Essential
Not all side effects are "fire-and-forget". Many side effects establish connections, timers, or event listeners that will cause serious **memory leaks**, duplicated callbacks, or state updates on unmounted components if not properly disassembled when the component disappears:

- **Timers:** `setInterval`, `setTimeout`
- **Subscriptions:** WebSockets, Firebase real-time listeners, Chat services
- **DOM Event Listeners:** `window.addEventListener('resize', ...)`
- **Abortable Fetch Requests:** `AbortController`

To clean up after side effects, **return a cleanup function** from your `useEffect` callback.

```
Component Mounts:
[Setup Effect Executes] (e.g. window.addEventListener('resize', handleResize))

Component Updates (or Unmounts):
[Cleanup Function Executes First!] (e.g. window.removeEventListener('resize', handleResize))
[New Setup Effect Executes]
```

## 2. Example: Window Resize Listener
```jsx
import React, { useState, useEffect } from 'react';

export default function WindowDimensions() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // 1. Setup: Attach listener
    window.addEventListener('resize', handleResize);
    console.log('Event listener registered');

    // 2. Cleanup: Return function to remove listener
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('Event listener cleaned up');
    };
  }, []); // Run on mount, clean up on unmount

  return <p>Window width: {width}px</p>;
}
```

## 3. Example: Timer with `setInterval`
```jsx
import React, { useState, useEffect } from 'react';

export default function ExamTimer({ initialMinutes = 30 }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    // 1. Setup interval
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // 2. Cleanup interval
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="timer-badge">
      Time Remaining: {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s
    </div>
  );
}
```
If you omit `clearInterval(timerId)`, the timer will keep running in the background forever—even after the user navigates to a completely different page—leaking memory and triggering phantom state updates.

## 4. Canceling Network Requests with `AbortController`
If a user rapidly toggles between different tabs or pages, an earlier API request might finish *after* the component has already unmounted. Use standard browser `AbortController` to cancel in-flight requests:

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchUserData() {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        signal: controller.signal
      });
      const data = await response.json();
      setUser(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Fetch error:', err);
      }
    }
  }

  fetchUserData();

  // Cleanup: Abort fetch if userId changes or component unmounts
  return () => controller.abort();
}, [userId]);
```

---

## Practice Quiz

### Q1: How do you declare a cleanup function inside `useEffect`?
- A) By calling `useEffect.cleanup()`
- B) By returning a function from the setup callback (e.g. `return () => { ... };`)
- C) By passing a third argument to `useEffect`
- D) By exporting an `onDestroy` function
**Answer:** B
**Explanation:** React designates the function returned from the `useEffect` callback as the cleanup function, executing it before re-running the effect and when the component unmounts.

### Q2: What severe issue occurs if an active `setInterval` timer is created in `useEffect` without a cleanup function?
- A) The computer will turn off
- B) A memory leak occurs; the timer continues executing in the background forever, even after the component unmounts
- C) React automatically deletes the component's CSS
- D) The browser tab reloads every 10 seconds
**Answer:** B
**Explanation:** Uncleaned intervals stay alive in the browser's JavaScript runtime, consuming memory and attempting to update unmounted component state.

### Q3: When does React execute the cleanup function?
- A) Only once when the application first boots
- B) Before the effect re-runs on dependency changes, and when the component unmounts
- C) Every 5 milliseconds continuously
- D) Only on mobile browsers
**Answer:** B
**Explanation:** React runs the cleanup function to tear down the previous effect before applying a new effect update, as well as upon final component unmounting.

### Q4: Which native browser API is used to abort in-flight `fetch` requests inside a `useEffect` cleanup function?
- A) `CancelToken`
- B) `AbortController`
- C) `StopWatch`
- D) `NetworkCleaner`
**Answer:** B
**Explanation:** Standard `AbortController` paired with `signal: controller.signal` allows `controller.abort()` in the cleanup function to cleanly cancel active network requests.

### Q5: Why does `<React.StrictMode>` run effect setup and cleanup twice during development?
- A) Due to a bug in React 18
- B) To intentionally verify that your setup and cleanup logic are resilient and properly clear all subscriptions and timers
- C) To warm up the CPU cache
- D) To test network connection speeds
**Answer:** B
**Explanation:** React StrictMode intentionally performs a mount -> unmount -> mount cycle in development to help developers catch missing cleanup functions and memory leaks early.
