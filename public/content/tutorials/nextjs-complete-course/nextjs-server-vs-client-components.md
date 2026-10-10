# Server Components vs Client Components ("use client" boundary)

Understanding when to use **React Server Components (RSC)** and when to introduce the **`"use client"` boundary** is the single most important conceptual skill in modern Next.js engineering.

---

## 1. Comparing Server vs Client Components

| Feature | Server Components (Default) | Client Components (`"use client"`) |
| :--- | :--- | :--- |
| **Execution Environment** | Runs **only on the server** | Pre-rendered on server, hydrated in browser |
| **Browser Bundle Impact** | **0 KB** (Dependencies stay on server) | Added to browser JavaScript bundle |
| **Direct Backend Access** | Full access to databases, filesystems, env secrets | No direct access to databases/secrets |
| **React Hooks** | ❌ No `useState`, `useEffect`, `useReducer` | ✅ Full access to state, lifecycle, and custom hooks |
| **Browser APIs & Events** | ❌ No `onClick`, `onChange`, `window`, `localStorage` | ✅ Full access to DOM events and browser APIs |

---

## 2. The `"use client"` Boundary

Adding `"use client"` at the very top of a file declares a boundary between server-only code and code that needs client interactivity. **It does NOT mean the component runs only on the client!** It will still be pre-rendered to HTML on the server during initial load, then hydrated in the browser with event listeners.

```tsx
// components/CounterButton.tsx
'use client'; // This directive defines the client boundary!

import { useState } from 'react';

export default function CounterButton({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Enrolled Students: {count}
    </button>
  );
}
```

---

## 3. Composing Server and Client Components (The Golden Rule)

**"Push client components down to the leaves of your component tree."**

Instead of marking your entire page with `'use client'`, keep your layout and pages as Server Components (fetching data and securing secrets), and only import small client components where interactivity is strictly required:

```tsx
// app/courses/[slug]/page.tsx (Server Component - fetches data securely)
import { getCourseFromDb } from '@/lib/db';
import CounterButton from '@/components/CounterButton'; // Client Component imported as leaf!

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseFromDb(slug); // Direct database query!

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p>{course.description}</p>

      {/* Interactive client component receives server data as props */}
      <CounterButton initialCount={course.enrolledCount} />
    </div>
  );
}
```

---

# Multiple Choice Questions

### 1. What does adding the `'use client'` directive at the top of a file do?
A. It compiles the component to WebAssembly.
B. It designates the module as a Client Component, allowing it to use state, effects, and browser event listeners.
C. It disables HTML rendering on the server completely.
D. It prevents other components from importing this file.
**Answer:** B
**Explanation:** `'use client'` establishes a boundary that permits React client features like `useState`, `useEffect`, and DOM event handlers (`onClick`).
---

### 2. Why should developers "push client components down to the leaves of the component tree"?
A. Leaves are rendered faster by CSS engines.
B. It maximizes the amount of code executed as Server Components (0 KB JS bundle) and minimizes the client JavaScript bundle size sent to the browser.
C. Client components cannot be rendered at the root level.
D. It prevents TypeScript compilation errors.
**Answer:** B
**Explanation:** Isolating client interactivity to small leaf components keeps the bulk of your application as Server Components, keeping the client bundle lean.
---

### 3. Which of the following is strictly prohibited inside a React Server Component?
A. Reading environment variables with `process.env.SECRET_KEY`.
B. Querying a database directly using Mongoose or Prisma.
C. Using React hooks like `useState()` or `useEffect()`.
D. Rendering HTML `<div>` and `<h1>` tags.
**Answer:** C
**Explanation:** Server Components execute only on the server without a client lifecycle, meaning hooks like `useState` and `useEffect` cannot be used.
---

### 4. Can a Server Component be passed as a `children` prop into a Client Component?
A. No, React throws an error.
B. Yes, by passing the Server Component as a child slot (`<ClientComponent><ServerComponent /></ClientComponent>`), allowing RSCs to render inside client layouts.
C. Only if the Server Component is converted to JSON.
D. Only in development mode.
**Answer:** B
**Explanation:** Server Components can be passed as `children` or props to Client Components, allowing server-rendered content to nest inside client wrappers.
---

### 5. Why are secret API keys and database credentials safe inside a Server Component?
A. Server Components are encrypted by Vercel.
B. Server Components execute exclusively on the backend server; their source code and imported secrets are never sent to the client browser.
C. Next.js deletes API keys after reading them.
D. Server Components run in an isolated Docker container on the user's phone.
**Answer:** B
**Explanation:** Because Server Components never ship their implementation code or dependencies to the client, database secrets remain strictly server-side.
---
