# React Server Components (RSC) Architecture

## 1. The Paradigm Shift: React on the Server
For over a decade, every React component was a **Client Component**: it executed in the browser, was bundled into client JavaScript, and could hold local state and event handlers.

**React Server Components (RSC)** represent the most significant architectural evolution in React history. 

In RSC architecture:
> **Components execute EXCLUSIVELY ON THE SERVER during the build or request time. Their code NEVER downloads to the user's browser, resulting in ZERO client bundle size!**

```
Client Component (.jsx / 'use client'):
- Downloaded to browser in JS bundle
- Executed on client
- Can use useState, useEffect, onClick
- Bundle Size: Adds to client JS download!

React Server Component (.jsx - Default in Next.js App Router):
- Executed ONLY on server
- NEVER downloaded to browser
- Can access database, files, and secrets directly!
- Bundle Size: 0 KB added to client JS!
```

## 2. Direct Database & Backend Access
Because Server Components run strictly on the backend, they can query databases, read file systems, and use private API keys directly inside the component function without creating an intermediary REST API endpoint:

```jsx
// A React Server Component (Runs ONLY on server!)
import db from '@/lib/database';

export default async function StudentRoster() {
  // Query database directly! No fetch(), no useEffect(), no loading spinner!
  const students = await db.query('SELECT * FROM students ORDER BY enrolled_at DESC');

  return (
    <div className="roster-view">
      <h2>Enrolled Students ({students.length})</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id}>{s.name} — {s.course}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 3. The `'use client'` Directive
In RSC architecture (as implemented in Next.js App Router), **all components are Server Components by default.**

If a component needs interactivity:
- React state (`useState`, `useReducer`)
- Lifecycle effects (`useEffect`)
- Browser APIs (`window`, `localStorage`, `geolocation`)
- Event listeners (`onClick`, `onChange`)

You declare the **`'use client'`** directive at the very top of the file:

```jsx
'use client'; // Marks this file and its imports as a Client Component boundary!

import React, { useState } from 'react';

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      ★ {likes} Likes
    </button>
  );
}
```

## 4. Composing Server and Client Components
The golden rule of RSC composition:
- **Server Components can import and render Client Components.**
- **Client Components CANNOT import Server Components directly!** 
- However, a Client Component can accept a Server Component as a **`children` prop** passed down from a parent Server Component!

```jsx
// Server Component (Parent):
export default async function Page() {
  const data = await db.getData();

  return (
    // ClientComponent receives ServerComponent as children!
    <ClientModalWrapper>
      <ServerRenderedContent data={data} />
    </ClientModalWrapper>
  );
}
```

---

## Practice Quiz

### Q1: What is the primary characteristic of a React Server Component (RSC)?
- A) It can only be written in Python
- B) It executes exclusively on the server, can access databases directly, and its source code is never shipped to the client's JavaScript bundle (0 KB bundle cost)
- C) It cannot render HTML
- D) It requires jQuery
**Answer:** B
**Explanation:** Server Components execute solely on the server, enabling direct database/file access without adding any JavaScript overhead to client bundles.

### Q2: What directive marks a component file as an interactive Client Component in the React Server Component architecture?
- A) `'use browser'`
- B) `'use client'`
- C) `'use dynamic'`
- D) `'use interactive'`
**Answer:** B
**Explanation:** Placing `'use client'` at the top of a module defines the boundary between server execution and client-side JavaScript bundling.

### Q3: Can a React Server Component use the `useState` or `useEffect` hooks?
- A) Yes, all components support hooks
- B) No, Server Components run only once on the server to produce output; interactive state and browser effects are strictly reserved for Client Components
- C) Only in development mode
- D) Only with TypeScript
**Answer:** B
**Explanation:** Server Components do not run in the browser and do not maintain persistent client state; therefore, hooks like `useState` and `useEffect` are invalid.

### Q4: How does a Server Component fetch data from a database?
- A) By making a REST API call to itself via `useEffect`
- B) By declaring the component as `async function` and executing database queries directly with `await`
- C) By writing raw SQL inside JSX attributes
- D) By storing credentials in cookies
**Answer:** B
**Explanation:** Server Components can be `async` functions, allowing developers to `await db.query()` directly within the component body.

### Q5: How can an interactive Client Component (like a modal wrapper) contain a Server Component that queries the database?
- A) It is impossible in React
- B) By passing the Server Component into the Client Component via the `children` or named slots prop
- C) By converting the Server Component into an image
- D) By restarting the server
**Answer:** B
**Explanation:** Client Components can accept pre-rendered server nodes via `props.children`, allowing server-rendered content to sit inside interactive client shells.
