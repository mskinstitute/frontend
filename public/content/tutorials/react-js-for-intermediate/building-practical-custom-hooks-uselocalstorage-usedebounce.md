# Building Practical Custom Hooks (useLocalStorage, useDebounce)

## 1. The Power of Utility Custom Hooks
In real-world web engineering, certain stateful patterns recur across virtually every application:
- Persisting state changes to browser storage automatically.
- Debouncing rapid input typing before dispatching expensive search queries.

Let's build two of the most widely used enterprise utility hooks from scratch.

## 2. Hook 1: `useLocalStorage`
A hook that behaves exactly like `useState`, but automatically synchronizes its value with browser `localStorage`:

```javascript
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // 1. Lazy initialization from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Synchronize to localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

### Consumer Usage:
```jsx
// Behaves just like useState, but survives page reloads!
const [theme, setTheme] = useLocalStorage('msk_theme', 'dark');
const [enrolledIds, setEnrolledIds] = useLocalStorage('msk_enrolled', []);
```

## 3. Hook 2: `useDebounce`
When a user types in a live search box, firing an API request on every keystroke floods your backend server with unnecessary network traffic. 

**Debouncing** waits until the user has stopped typing for a specified delay (e.g. 500ms) before evaluating the value:

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if 'value' or 'delay' changes (user kept typing!)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Consumer Usage in a Live Search Box:
```jsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function CourseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // debouncedTerm updates ONLY after user stops typing for 500ms!
  const debouncedTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedTerm) {
      console.log(`Executing API search query for: ${debouncedTerm}`);
      // fetchSearchResults(debouncedTerm);
    }
  }, [debouncedTerm]); // Only fires API query on debounced change!

  return (
    <div>
      <input
        type="text"
        placeholder="Type to search curriculum..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Instant Input: {searchTerm}</p>
      <p>Debounced API Query: {debouncedTerm}</p>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: In the `useDebounce` hook, how is the pending timer cancelled if the user presses another key before the delay expires?
- A) By throwing an unhandled exception
- B) Through the `useEffect` cleanup function calling `clearTimeout(timer)`
- C) By turning off the browser
- D) React automatically pauses timers
**Answer:** B
**Explanation:** When dependencies change, React runs the cleanup function first, executing `clearTimeout` to cancel the previous timer before setting a new one.

### Q2: What is the primary benefit of debouncing a search input before calling an API?
- A) It prevents the computer from overheating
- B) It prevents sending redundant network requests on every intermediate keystroke, reducing server load and avoiding race conditions
- C) It formats JSON to XML
- D) It bypasses authentication requirements
**Answer:** B
**Explanation:** Debouncing waits until user typing pauses before making a request, eliminating dozens of unnecessary intermediary API calls while typing.

### Q3: Why does `useLocalStorage` use `JSON.stringify` and `JSON.parse`?
- A) To compress images
- B) Browser `localStorage` can only store strings; complex JavaScript values (objects, arrays, numbers, booleans) must be serialized and deserialized
- C) To encrypt passwords
- D) It is required by TypeScript
**Answer:** B
**Explanation:** The Web Storage API only supports string values, requiring JSON serialization for objects and arrays.

### Q4: Why is `useLocalStorage`'s initial read wrapped in a `try...catch` block?
- A) Because JavaScript cannot read strings
- B) `localStorage` access can throw security exceptions in restricted environments (e.g. private browsing, disabled cookies, or invalid stored JSON)
- C) To make it run 10x faster
- D) To turn off StrictMode
**Answer:** B
**Explanation:** Accessing `localStorage` can fail if storage is full, cookies are blocked, or stored data is corrupted JSON, requiring defensive error handling.

### Q5: What is returned by `const [val, setVal] = useLocalStorage('key', 'default')`?
- A) A Promise
- B) A two-element array matching the standard `useState` contract: the current value and an updater function
- C) An HTML input element
- D) An SQLite table
**Answer:** B
**Explanation:** Modeling `useLocalStorage` to return `[storedValue, setStoredValue]` preserves the familiar, intuitive API of React's standard `useState` hook.
