# Managing Pagination, Caching, and Background Refetch

## 1. The Challenges of Server-Side Pagination
When dealing with databases containing thousands of courses, orders, or logs, sending the entire dataset in a single JSON payload degrades network latency and browser memory. 

Backend APIs slice data using **pagination** (e.g. `?page=1&limit=10`). 

In traditional React, handling pagination creates visual flickering: when a user clicks "Next Page", the old data disappears, a loading spinner flashes, and the new page appears.

TanStack Query provides advanced primitives to manage **pagination**, **stale caches**, and **background refetching** smoothly without UI layout thrashing.

```
Traditional Pagination:
[Page 1 Data] ──(Click Next)──► [Blank Spinner Flash!] ──► [Page 2 Data]

TanStack Query (keepPreviousData):
[Page 1 Data] ──(Click Next)──► [Keep Page 1 visible while Page 2 loads in background] ──► [Instant Page 2 Swap!]
```

## 2. Paginated Queries with `placeholderData: keepPreviousData`
In TanStack Query (v5+), passing `placeholderData: keepPreviousData` keeps the previous page's data on screen while the new page is being fetched:

```jsx
import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

async function fetchStudentsPage(page = 1) {
  const res = await fetch(`/api/students?page=${page}&limit=10`);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export default function PaginatedStudentDirectory() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isPlaceholderData // True while previous page data is being shown as a placeholder!
  } = useQuery({
    queryKey: ['students', page], // Key includes 'page' so each page is cached independently!
    queryFn: () => fetchStudentsPage(page),
    placeholderData: keepPreviousData // Smooth pagination transition!
  });

  if (isLoading) return <div className="spinner">Loading initial page...</div>;
  if (isError) return <div>Failed to load student directory.</div>;

  return (
    <div className="directory-box">
      <h2>Registered Students (Page {page})</h2>

      {/* Render current or placeholder data */}
      <ul className={`student-list ${isPlaceholderData ? 'opacity-50' : ''}`}>
        {data.students.map((student) => (
          <li key={student.id}>{student.name} — {student.track}</li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination-bar">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          ← Previous
        </button>

        <span>Page {page} of {data.totalPages}</span>

        <button
          onClick={() => {
            if (!isPlaceholderData && page < data.totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || page >= data.totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
```

## 3. Cache Invalidation with `queryClient.invalidateQueries`
When a user adds, edits, or deletes an item on the server via an HTTP mutation, the cached data in other views becomes stale.

Rather than trying to manually locate and modify complex nested cached data structures, you tell TanStack Query to **invalidate the query key**:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStudent) => {
      return fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
    },
    // On success: invalidate all queries matching the 'students' key!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
}
```
Invoking `invalidateQueries` marks matching cached queries as stale and immediately triggers an automatic background refetch for any active components on screen!

---

## Practice Quiz

### Q1: Why should the `page` state variable be included in the `queryKey: ['students', page]` array?
- A) It is required by CSS
- B) Each page has distinct data; including `page` ensures each page has its own independent cache entry in TanStack Query
- C) To count the number of network requests
- D) To prevent the browser from closing
**Answer:** B
**Explanation:** The `queryKey` is a unique cache identifier. Including `page` in the array guarantees that page 1 and page 2 are cached separately.

### Q2: What visual problem does `placeholderData: keepPreviousData` solve during pagination?
- A) It prevents the entire web page from turning red
- B) It prevents jarring blank loading spinners by keeping the current page visible while the next page loads in the background
- C) It removes the footer
- D) It hides the browser address bar
**Answer:** B
**Explanation:** `keepPreviousData` provides smooth transitions by holding existing data on screen until the next page has fully downloaded.

### Q3: What function is used to instruct TanStack Query to refresh stale data after a successful mutation?
- A) `queryClient.resetWindow()`
- B) `queryClient.invalidateQueries({ queryKey: ['keyName'] })`
- C) `window.location.reload()`
- D) `localStorage.clear()`
**Answer:** B
**Explanation:** `queryClient.invalidateQueries` flags specified query keys as stale and automatically initiates background re-fetches for any active screen components.

### Q4: How can you indicate to users that data currently visible on screen is transitional placeholder data while the next page is loading?
- A) By checking `isPlaceholderData` and applying an opacity or subtle spinner overlay
- B) By turning off the monitor
- C) By logging to console only
- D) By disabling all CSS
**Answer:** A
**Explanation:** The boolean `isPlaceholderData` indicates that the displayed dataset belongs to the previous page, allowing you to dim the list (`opacity-50`) to signify an active background fetch.

### Q5: If a user visits Page 1, navigates to Page 2, and then clicks "Previous" back to Page 1, what does TanStack Query do?
- A) It throws an error
- B) It serves Page 1 instantly from cache with zero loading delay while optionally checking for background updates
- C) It reloads the entire operating system
- D) It deletes Page 2 from cache
**Answer:** B
**Explanation:** Because Page 1 was already cached during the user's initial visit, TanStack Query serves it immediately from memory, providing instantaneous navigation.
