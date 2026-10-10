# Introduction to TanStack Query for Server State

## 1. The Server State vs Client State Paradigm
In React development, engineers historically treated all data the same—dumping both UI state and fetched API data into `useState`, `useReducer`, or Redux.

However, modern engineering distinguishes between two fundamentally different types of state:
1. **Client State (UI State):** Data wholly owned by the browser that is synchronous and always up-to-date (e.g. modal open/closed, active tab, form inputs).
2. **Server State (Remote Cache):** Data owned by a remote server that is asynchronous, shared across multiple users, requires serialization, and **can become stale at any moment without your knowledge** (e.g. user profile, course list, stock prices).

Using raw `useEffect` and `useState` for server state forces you to manually write hundreds of lines for caching, deduplication, retry logic, background refetching, and pagination.

**TanStack Query** (formerly React Query) is the industry standard for managing server state in modern web applications.

```
Traditional useEffect Data Fetching:
[Manual loading state] + [Manual error state] + [No caching] + [No auto-retry] + [Race conditions]

TanStack Query:
const { data, isLoading, error } = useQuery(...)
(Automatic caching, window-focus refetching, background updates, auto-retries!)
```

## 2. Installing TanStack Query
```bash
npm install @tanstack/react-query
```

## 3. Setting Up `QueryClientProvider`
Wrap your application root with `QueryClientProvider`:

```jsx
// src/main.jsx or src/App.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains "fresh" for 5 minutes
      retry: 2                   // Automatically retry failed requests twice
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## 4. Fetching Data with `useQuery`
To fetch and cache data, call the **`useQuery`** hook:

```jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchCourses() {
  const res = await fetch('/api/courses');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export default function CourseDirectory() {
  // queryKey uniquely identifies this cache entry
  // queryFn is the promise-returning function
  const { data: courses, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  if (isLoading) return <div className="spinner">Fetching courses...</div>;
  if (isError) return <div className="error-alert">Error: {error.message}</div>;

  return (
    <div className="course-list">
      <h2>Active Courses ({courses.length})</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 5. Superpowers Out of the Box
By adopting TanStack Query:
- **Automatic Caching:** If two components request `['courses']`, only **one** network request is sent!
- **Window Focus Refetching:** When a user tabs back to your application after reading an email, TanStack Query automatically refreshes stale data in the background.
- **Deduplication:** Multiple rapid calls are merged into a single network flight.

---

## Practice Quiz

### Q1: What is the primary difference between Client State and Server State?
- A) Client state is written in TypeScript; server state is written in HTML
- B) Client state is synchronous and owned by the browser UI; server state is asynchronous, remote, and can become stale over time
- C) Client state only works on mobile devices
- D) Server state is stored in browser cookies
**Answer:** B
**Explanation:** Server state represents remote data owned by the backend that requires caching and periodic synchronization, whereas client state is strictly local UI state.

### Q2: What are the two mandatory properties required when configuring `useQuery`?
- A) `url` and `method`
- B) `queryKey` (array identifying cache entry) and `queryFn` (function returning a promise)
- C) `headers` and `body`
- D) `schema` and `database`
**Answer:** B
**Explanation:** `queryKey` provides a unique cache identifier and `queryFn` provides the asynchronous function that fetches the data.

### Q3: What happens by default when two separate components on the same screen both invoke `useQuery({ queryKey: ['userData'], ... })`?
- A) The browser crashes
- B) TanStack Query deduplicates the request, firing only a single HTTP call and sharing the cached result between both components
- C) The server charges double API fees
- D) Both components render errors
**Answer:** B
**Explanation:** TanStack Query merges identical concurrent queries with the same `queryKey`, eliminating duplicate network calls across components.

### Q4: What does `staleTime` configure in TanStack Query?
- A) The time after which the browser deletes cookies
- B) The duration of time data is considered "fresh"; during this window, cached data is returned instantly without background refetching
- C) The expiration of the user's password
- D) The CSS transition delay
**Answer:** B
**Explanation:** As long as data is within its `staleTime`, TanStack Query serves it immediately from cache without triggering background network refetches.

### Q5: What component must wrap your application tree to enable TanStack Query hooks?
- A) `<QueryContainer>`
- B) `<QueryClientProvider client={queryClient}>`
- C) `<QueryContext.Provider>`
- D) `<ServerProvider>`
**Answer:** B
**Explanation:** `<QueryClientProvider>` provides the central query client and cache manager to all nested components.
