# RTK Query for Enterprise Data Fetching

## 1. What is RTK Query?
In enterprise applications utilizing Redux, managing asynchronous data fetching with manual `createAsyncThunk` routines requires substantial code: defining loading states, catching errors, managing cache invalidation, and deduplicating network calls.

**RTK Query** is an advanced data fetching and caching package built directly into **Redux Toolkit**. Similar to TanStack Query, RTK Query eliminates the need to manually write thunks and reducers for server interactions.

Key Features:
- **Centralized API Definitions:** All endpoints for a service are defined in a single `createApi` service.
- **Auto-Generated React Hooks:** RTK Query automatically creates custom React hooks for every query and mutation (e.g. `useGetCoursesQuery`, `useAddCourseMutation`).
- **Tag-Based Cache Invalidation:** Seamlessly invalidates and refetches queries using semantic cache tags.

```
createApi({ endpoints: ... })
 ├─ endpoint: 'getCourses'    ──► Auto-generates: useGetCoursesQuery()
 └─ endpoint: 'enrollCourse' ──► Auto-generates: useEnrollCourseMutation()
```

## 2. Defining an API Service with `createApi`
```javascript
// src/store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Course', 'Student'], // Semantic cache tags
  endpoints: (builder) => ({
    // 1. Query endpoint
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Course'] // Caches results under 'Course' tag
    }),

    // 2. Query endpoint with dynamic parameter
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }]
    }),

    // 3. Mutation endpoint
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: '/courses',
        method: 'POST',
        body: newCourse
      }),
      // Automatically refetches all queries marked with 'Course'!
      invalidatesTags: ['Course']
    })
  })
});

// Auto-generated hooks exported cleanly!
export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation
} = apiSlice;
```

## 3. Connecting RTK Query to `configureStore`
```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    // Add generated reducer
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  // Adding api middleware enables caching, invalidation, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});
```

## 4. Consuming Auto-Generated Hooks in Components
```jsx
import React from 'react';
import { useGetCoursesQuery, useCreateCourseMutation } from '../store/apiSlice';

export default function CoursesManager() {
  // Query hook manages loading, errors, caching, and data automatically!
  const { data: courses, isLoading, isError } = useGetCoursesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();

  const handleAdd = async () => {
    // Executes POST mutation; RTK Query auto-refetches getCourses in background!
    await createCourse({ title: 'Next.js App Router Mastery', price: 89 });
  };

  if (isLoading) return <div>Loading courses...</div>;
  if (isError) return <div>Failed to load courses.</div>;

  return (
    <div>
      <h2>Curriculum Catalog</h2>
      <button onClick={handleAdd} disabled={isCreating}>
        {isCreating ? 'Saving...' : '+ Add Next.js Track'}
      </button>

      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: What is the primary purpose of RTK Query?
- A) To replace CSS stylesheets
- B) To eliminate boilerplate for fetching, caching, and synchronizing server data within Redux Toolkit applications
- C) To compile TypeScript into assembly
- D) To manage local form input keystrokes
**Answer:** B
**Explanation:** RTK Query provides an automated data fetching and caching layer integrated directly into Redux Toolkit, eliminating manual thunks and reducers.

### Q2: How are React hooks created when using RTK Query?
- A) Developers must write them by hand using `useEffect`
- B) RTK Query automatically generates custom React hooks based on the endpoint names declared in `createApi` (e.g. `useGetCoursesQuery`)
- C) Hooks are imported from `react-router-dom`
- D) Hooks are downloaded from GitHub at runtime
**Answer:** B
**Explanation:** RTK Query dynamically generates specialized query and mutation hooks matching the names of endpoints defined in `createApi`.

### Q3: How does RTK Query handle cache invalidation after a successful mutation?
- A) By reloading the operating system
- B) Using semantic cache tags (`providesTags` on queries and `invalidatesTags` on mutations) to automatically trigger background refetches
- C) By clearing browser history
- D) By disabling the network connection
**Answer:** B
**Explanation:** Tag-based invalidation connects queries to mutations: mutating an entity invalidates matching tags, prompting RTK Query to refetch active queries.

### Q4: What helper function does RTK Query provide to configure base URLs and request headers easily?
- A) `fetchBaseQuery`
- B) `axiosWrapper`
- C) `makeFetch`
- D) `httpQuery`
**Answer:** A
**Explanation:** `fetchBaseQuery` is RTK Query's lightweight wrapper around standard `fetch`, providing simple configuration for base URLs, headers, and token injection.

### Q5: Why must `apiSlice.middleware` be added to `configureStore`?
- A) To make tests run faster
- B) To enable RTK Query features like automatic cache lifetime management, polling, and invalidation subscriptions
- C) It is optional and can be omitted
- D) To turn on dark mode
**Answer:** B
**Explanation:** RTK Query's middleware manages cache timers, background refetches, and lifecycle subscriptions within the Redux store.
