# Composing Multiple Hooks and Custom Hook Testing

## 1. Composing Hooks Like Lego Bricks
One of the greatest architectural triumphs of React Hooks is **composability**. Just as small components can be assembled into complex layouts, small custom hooks can be combined to build powerful, specialized hooks:

```
[useLocalStorage] + [useDebounce] ──► [useDebouncedPersistentSearch]
```

Consider building an auto-saving note editor:
```javascript
// src/hooks/useAutoSaveNote.js
import { useLocalStorage } from './useLocalStorage';
import { useDebounce } from './useDebounce';
import { useEffect } from 'react';

export function useAutoSaveNote(noteId, initialContent = '') {
  // Hook 1: Persist in localStorage
  const [content, setContent] = useLocalStorage(`note_${noteId}`, initialContent);

  // Hook 2: Debounce content for cloud sync
  const debouncedContent = useDebounce(content, 1000);

  // Effect: Sync debounced content to remote backend API
  useEffect(() => {
    if (debouncedContent) {
      console.log(`Cloud sync note ${noteId}:`, debouncedContent);
      // api.saveNote(noteId, debouncedContent);
    }
  }, [noteId, debouncedContent]);

  return [content, setContent];
}
```

## 2. The Challenge of Testing Custom Hooks
You cannot test a custom hook like a standard utility function because hooks **can only be executed inside a running React component lifecycle**:

```javascript
// ❌ FAILS: Cannot call hook outside a React component!
test('useLocalStorage works', () => {
  const [val, setVal] = useLocalStorage('key', 'initial'); // Invalid hook call!
});
```

## 3. Testing Hooks with React Testing Library (`renderHook`)
**`@testing-library/react`** provides the specialized **`renderHook`** and **`act`** utilities to test custom hooks in a simulated component environment without writing manual boilerplate:

```javascript
// src/hooks/__tests__/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useState, useCallback } from 'react';

// Sample custom hook to test
function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);
  const increment = useCallback(() => setCount(c => c + 1), []);
  const reset = useCallback(() => setCount(initialCount), [initialCount]);
  return { count, increment, reset };
}

describe('useCounter Custom Hook', () => {
  test('should initialize with provided initial count', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('should increment count correctly', () => {
    const { result } = renderHook(() => useCounter(0));

    // Wrap state-modifying actions inside act()
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  test('should reset count to initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

## 4. Understanding `act()`
The **`act()`** wrapper ensures that all state updates, effects, and resulting Virtual DOM recalculations are fully flushed and processed synchronously before your test makes assertions.

---

## Practice Quiz

### Q1: Why can't a custom hook be tested by invoking it directly as a regular JavaScript function in a test file (e.g. `const data = useFetch()`)?
- A) Test runners do not support modern ES6 syntax
- B) React Hooks violate the Rules of Hooks if called outside the execution context of a React component
- C) Hooks can only run on Linux
- D) It deletes the test file
**Answer:** B
**Explanation:** React requires hooks to execute within a component render cycle to maintain its internal Fiber state list; calling a hook outside a component throws an invalid hook call error.

### Q2: What utility provided by `@testing-library/react` allows testing custom hooks cleanly?
- A) `renderHook`
- B) `runHookInCloud`
- C) `compileHook`
- D) `mockHook`
**Answer:** A
**Explanation:** `renderHook` wraps the custom hook in a lightweight harness component, giving tests access to `result.current` across state updates.

### Q3: What is the purpose of wrapping state-modifying hook actions inside `act(() => { ... })` during unit testing?
- A) To encrypt the test result
- B) To ensure that all pending state updates, effect flushes, and re-renders are completely processed before running assertions
- C) To make tests run 10x slower
- D) To turn off strict mode
**Answer:** B
**Explanation:** `act()` synchronizes React's internal update cycle, ensuring the test does not evaluate assertions against stale intermediate state.

### Q4: In `const { result } = renderHook(() => useMyHook())`, how do you access the hook's current return values?
- A) `result.data`
- B) `result.current`
- C) `result.val`
- D) `result.output`
**Answer:** B
**Explanation:** Testing Library stores the most recent return value of the hook in the `result.current` property.

### Q5: What is "Hook Composition"?
- A) Combining multiple hooks together inside a custom hook to build higher-level, specialized business abstractions
- B) Converting hooks into musical audio
- C) Writing hooks without JavaScript
- D) Using CSS with hooks
**Answer:** A
**Explanation:** Hook composition is the architectural practice of combining simpler hooks (like `useLocalStorage` and `useDebounce`) to create sophisticated, reusable feature hooks.
