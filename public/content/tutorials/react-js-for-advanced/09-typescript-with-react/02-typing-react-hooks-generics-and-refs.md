# Typing React Hooks, Generics, and Refs

While TypeScript's type inference handles simple hooks like `useState(0)` automatically, enterprise applications frequently require explicit generic typing for union states, null initializations, DOM references, and generic reusable custom hooks.

---

## 1. Typing `useState`

### Inferred Primitives
```ts
const [count, setCount] = useState(0); // Inferred as number
const [text, setText] = useState("");  // Inferred as string
```

### Explicit Generics for Complex Types and Nullable State
When a state object starts as `null` before network data loads, type inference as `null` will error when assigning an object later. Provide an explicit generic union:

```tsx
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// State can be UserProfile or null
const [user, setUser] = useState<UserProfile | null>(null);

// Type unions for status flags
type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";
const [status, setStatus] = useState<AuthStatus>("idle");
```

---

## 2. Typing `useRef`

`useRef` has two distinct use cases in TypeScript with very different type signatures:

### Case A: DOM Element Reference (Read-Only Ref)
When referencing a physical DOM element, pass the HTML element type and initialize with `null`:

```tsx
import React, { useRef, useEffect } from "react";

export function AutoFocusSearchInput() {
  // Read-only ref bound to an HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Optional chaining required because inputRef.current might be null before mount
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Type here..."
      className="px-4 py-2 bg-slate-800 text-white rounded border border-slate-700"
    />
  );
}
```

### Case B: Mutable Mutable Variable (Value Container)
When using `useRef` as an instance variable that persists across renders without triggering re-renders (like a timer ID or WebSocket handle), provide the type without `null` initialization if not needed:

```tsx
// Mutable ref container holding a timer ID
const timerRef = useRef<number | undefined>(undefined);

const startTimer = () => {
  timerRef.current = window.setInterval(() => {
    console.log("Tick");
  }, 1000);
};

const stopTimer = () => {
  if (timerRef.current !== undefined) {
    clearInterval(timerRef.current);
  }
};
```

---

## 3. Typing `useReducer`

Discriminated unions provide complete type safety for reducer actions:

```tsx
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "RESET" }
  | { type: "SET_ERROR"; payload: string };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + action.payload, error: null };
    case "DECREMENT":
      return { ...state, count: state.count - action.payload, error: null };
    case "RESET":
      return { count: 0, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
```

---

## 4. Generic Custom Hooks

Generic custom hooks allow components to consume typed utilities dynamically:

```tsx
import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetchData<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(url)
      .then((res) => res.json())
      .then((data: T) => {
        if (isMounted) setState({ data, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (isMounted) setState({ data: null, isLoading: false, error });
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}

// Consumption with full type inference:
interface Order {
  id: string;
  total: number;
}

// data is strictly typed as Order[] | null
// const { data, isLoading } = useFetchData<Order[]>("/api/orders");
```

---

## Practice Quiz

### Q1: What happens if you initialize useState with null without a generic type parameter: const [user, setUser] = useState(null)?
- A) TypeScript infers user as any
- B) TypeScript infers user as null, causing errors later when attempting to setUser({ name: "Alice" })
- C) The code compiles to WebAssembly
- D) React crashes on mount
**Answer:** B
**Explanation:** Without a generic type parameter, TypeScript narrows null to type null. Attempting to assign any object to a variable of type null causes a TypeScript compile error.

### Q2: How should you type a ref intended to attach to an HTML <canvas> element?
- A) useRef<HTMLElement>(null)
- B) useRef<HTMLCanvasElement>(null)
- C) useRef<CanvasRenderingContext2D>(null)
- D) useRef<string>("")
**Answer:** B
**Explanation:** DOM refs should be typed with their exact HTML element interface, in this case HTMLCanvasElement, initialized with null.

### Q3: In a typed reducer, what is the benefit of the const _exhaustive: never = action statement in the default case?
- A) It deletes memory leaks
- B) It enforces exhaustive compile-time checking: if a new action type is added to the Action union without a corresponding case statement, TypeScript throws an error
- C) It runs the action synchronously
- D) It imports never from React
**Answer:** B
**Explanation:** Assigning an unhandled action to the never type triggers a compile error if any union member was missed, guaranteeing 100% exhaustive switch coverage.

### Q4: Why must inputRef.current be checked with optional chaining (inputRef.current?.focus()) before calling methods?
- A) Because focus is an optional method in modern browsers
- B) Because on initial render before the DOM mounts, ref.current is null
- C) Because TypeScript forbids method calls on HTML elements
- D) Because refs only work in production
**Answer:** B
**Explanation:** Before React mounts the component and binds the physical DOM node to the ref, ref.current is initialized to null; optional chaining prevents runtime null-pointer exceptions.

### Q5: How do generics benefit custom hooks like useFetchData<T>(url)?
- A) They convert JSON data into XML
- B) They allow the caller to define the exact response data type, providing type safety and IntelliSense across varied API endpoints
- C) They automatically authenticate HTTP headers
- D) They bypass CORS restrictions
**Answer:** B
**Explanation:** Generic parameters allow reusable hooks to return caller-specified types, ensuring downstream components have autocomplete and type validation without using any.
