# Concurrent Rendering with useTransition

Prior to React 18, state updates in React were synchronous and un-interruptible. If a state change triggered a computationally intensive re-render of thousands of DOM elements or complex charts, the main JavaScript thread froze, dropping frames and causing button clicks, text input typing, and scroll events to lag. `useTransition` unlocks Concurrent React, enabling you to mark state updates as non-blocking transitions.

---

## 1. Urgent Updates vs Non-Urgent Transitions

React divides user interactions into two core categories:

1. **Urgent Updates:** Direct physical interactions requiring immediate feedback (typing in an input field, clicking a toggle button, hovering a dropdown). Users feel lag if these take longer than ~16ms.
2. **Transition Updates:** Secondary UI views transitioning between states (filtering a table of 10,000 items, switching a search results tab, rendering complex data graphs). Users tolerate a brief delay as long as the page remains interactive.

---

## 2. Anatomy of `useTransition`

The `useTransition` hook returns a boolean flag `isPending` and a `startTransition` dispatcher function:

```tsx
const [isPending, startTransition] = useTransition();
```

- **`startTransition(callback)`:** Wraps state setter calls. React marks the resulting re-render as low priority and interruptible. If an urgent update occurs while the transition is calculating, React pauses the transition, renders the urgent update, and resumes or restarts the transition.
- **`isPending`:** Boolean indicating whether a low-priority transition is currently running in the background.

---

## 3. High-Performance Filtering Example

Here is how `useTransition` keeps an input responsive while filtering 20,000 records:

```tsx
import React, { useState, useTransition, useMemo } from "react";

// Generate massive synthetic dataset
const RAW_DATABASE = Array.from({ length: 15000 }, (_, i) => ({
  id: i,
  name: `Enterprise Record #${i + 1}`,
  department: i % 3 === 0 ? "Finance" : i % 2 === 0 ? "Engineering" : "Marketing",
}));

export function ConcurrentFilterList() {
  const [inputValue, setInputValue] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;

    // 1. URGENT: Update the input text immediately so typing feels instant
    setInputValue(nextValue);

    // 2. NON-URGENT: Defer heavy list filtering to concurrent background thread
    startTransition(() => {
      setFilterTerm(nextValue);
    });
  };

  const filteredItems = useMemo(() => {
    if (!filterTerm) return RAW_DATABASE;
    return RAW_DATABASE.filter((item) =>
      item.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [filterTerm]);

  return (
    <div className="p-8 bg-slate-900 text-slate-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Concurrent Filtering Demo</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type rapidly to filter 15,000 items..."
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg w-96 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {isPending && (
          <span className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            Recalculating list in background...
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 mb-2">Displaying {filteredItems.length} records</p>
      <div className="h-96 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-950 p-2">
        {filteredItems.slice(0, 100).map((item) => (
          <div key={item.id} className="py-1.5 px-3 text-sm text-slate-300 flex justify-between">
            <span>{item.name}</span>
            <span className="text-xs text-slate-500">{item.department}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Key Rules and Caveats

1. **Synchronous Setters Only:** The callback passed to `startTransition` must be synchronous. You cannot pass an `async` function or wrap `setTimeout`:
   ```tsx
   // ❌ Incorrect: async callback
   startTransition(async () => {
     const res = await fetchData();
     setData(res);
   });

   // ✅ Correct: perform async work first, transition the state setter
   const res = await fetchData();
   startTransition(() => {
     setData(res);
   });
   ```
2. **Cannot Control Text Input State Directly:** Do not wrap controlled text inputs' immediate state in `startTransition`; controlled inputs require urgent synchronous feedback to prevent cursor position jumping.

---

## Practice Quiz

### Q1: What problem does useTransition solve in React 18?
- A) It eliminates the need for CSS media queries
- B) It prevents computationally expensive re-renders from blocking the main JavaScript thread, keeping urgent user interactions like typing responsive
- C) It connects React directly to a MongoDB database
- D) It replaces Redux for server-side state caching
**Answer:** B
**Explanation:** useTransition marks state updates as non-blocking transitions, enabling React to interrupt heavy rendering work to process urgent events like keystrokes or clicks.

### Q2: What are the two return values of the useTransition() hook?
- A) [state, dispatch]
- B) [isPending, startTransition]
- C) [data, refetch]
- D) [promise, resolve]
**Answer:** B
**Explanation:** useTransition returns a tuple containing isPending (a boolean indicating active background rendering) and startTransition (the function dispatching transition state changes).

### Q3: Why should the state controlling an <input value={text} /> element remain an urgent update?
- A) React will throw a compile-time error otherwise
- B) Controlled input elements require immediate synchronous state synchronization to prevent typing lag, character stutter, and cursor jumps
- C) Browsers automatically crash if input values are deferred
- D) Inputs cannot read React state
**Answer:** B
**Explanation:** Controlled inputs must update synchronously on every keypress; wrapping the input's own state in a transition can cause the input value and cursor position to fall out of sync with the user's keystrokes.

### Q4: Can you pass an async function directly into startTransition()?
- A) Yes, startTransition was built exclusively for async functions
- B) No, the function passed to startTransition must be synchronous; asynchronous fetching must occur outside before dispatching the state change
- C) Yes, but only in Next.js
- D) Yes, provided it returns a boolean
**Answer:** B
**Explanation:** React expects the transition function to synchronously execute state setter calls so it can tag the resulting fiber reconciliations as low-priority transitions.

### Q5: What happens if a user types a new character while React is halfway through rendering a transition?
- A) React freezes the tab until the transition finishes
- B) React interrupts and abandons the stale in-progress transition render, processes the urgent keystroke immediately, and restarts rendering with the latest state
- C) React displays an unhandled Promise rejection modal
- D) React renders both updates simultaneously in two parallel DOM trees
**Answer:** B
**Explanation:** Concurrent React interrupts low-priority work when higher-priority events arrive, discarding stale work and restarting with the fresher state.
