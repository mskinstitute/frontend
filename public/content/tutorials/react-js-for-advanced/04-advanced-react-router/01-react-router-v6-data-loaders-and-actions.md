# React Router v6 Data Loaders and Actions

## 1. The Shift to Data-Driven Routing
Historically in React SPAs, data fetching followed the **"Fetch-on-Render"** pattern:
1. The user navigates to `/courses/react`.
2. React Router mounts `<CourseDetail />`.
3. The component renders empty markup with a loading spinner.
4. An inner `useEffect` fires across the network to fetch the course.
5. 300ms later, data arrives and the component re-renders with actual content.

This sequential waterfall (Route changes -> Component renders -> Effect fires -> Data arrives) introduces noticeable UI delay and layout shifts.

In modern **React Router (v6.4+)**, routing shifted to **Data Routers**:
> **Data fetching and route matching happen in PARALLEL before the component is ever rendered!**

```
Old Fetch-on-Render:
[Route Changes] ──► [Component Mounts (Blank)] ──► [useEffect Fires] ──► [Data Arrives] (Slow Waterfall)

Modern Data Loaders:
[Route Changes] ──► [Loader Fetches Data & Components Load in Parallel] ──► [Render Complete UI Instantly!]
```

## 2. Setting Up a Data Router with `createBrowserRouter`
To use Data Loaders, you must configure your router using `createBrowserRouter` and `RouterProvider`:

```jsx
// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import CourseCatalog, { courseLoader } from './pages/CourseCatalog';
import CourseDetail, { courseDetailLoader } from './pages/CourseDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'courses',
        element: <CourseCatalog />,
        loader: courseLoader // Data loader function!
      },
      {
        path: 'courses/:slug',
        element: <CourseDetail />,
        loader: courseDetailLoader // Receives params automatically!
      }
    ]
  }
]);
```

## 3. Implementing a Route Loader
A loader is a standard JavaScript function that returns data or a Promise:

```jsx
// src/pages/CourseDetail.jsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';

// 1. The Loader Function (Runs BEFORE component renders!)
export async function courseDetailLoader({ params }) {
  const response = await fetch(`/api/courses/${params.slug}`);

  if (!response.ok) {
    // Throwing a Response triggers the route's errorElement!
    throw new Response('Course Not Found', { status: 404 });
  }

  return response.json(); // Returning data directly
}

// 2. The Component consuming the data
export default function CourseDetail() {
  // Extracts data returned by loader synchronously!
  const course = useLoaderData();

  return (
    <div className="course-view">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <span className="badge">${course.price}</span>
    </div>
  );
}
```

## 4. Route Actions for Form Mutations
React Router also introduces **Actions** for data mutations (POST, PUT, DELETE), modeling HTML form behavior:

```jsx
import { Form, redirect } from 'react-router-dom';

// Action handles form submission
export async function courseAction({ request }) {
  const formData = await request.formData();
  const title = formData.get('title');

  await fetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify({ title })
  });

  // Redirect to catalog after mutation
  return redirect('/courses');
}

export function CreateCourse() {
  return (
    // React Router's <Form> component posts directly to the action!
    <Form method="post">
      <input type="text" name="title" required />
      <button type="submit">Create Course</button>
    </Form>
  );
}
```

---

## Practice Quiz

### Q1: How do Data Loaders in React Router v6.4+ eliminate data-fetching waterfalls?
- A) They run data fetching on the client's GPU
- B) They initiate data fetching in parallel with route matching before the component renders, ensuring data is available immediately when the component mounts
- C) They convert React into a static site
- D) They turn off all CSS
**Answer:** B
**Explanation:** Data loaders fetch data concurrently during route transition resolution, eliminating the delay of mounting a component before triggering an inner `useEffect`.

### Q2: What hook is used inside a route component to access the data returned by its `loader`?
- A) `useRouteData()`
- B) `useLoaderData()`
- C) `useAsyncData()`
- D) `useData()`
**Answer:** B
**Explanation:** `useLoaderData()` extracts the resolved data returned by the route's associated loader function.

### Q3: What router configuration function is mandatory to enable Data Loaders and Actions in React Router?
- A) `createBrowserRouter` (paired with `<RouterProvider>`)
- B) `<BrowserRouter>`
- C) `<StaticRouter>`
- D) `<MemoryRouter>`
**Answer:** A
**Explanation:** Data loaders, actions, and defer APIs require Data Routers initialized via `createBrowserRouter` or `createHashRouter`.

### Q4: What happens if a loader function throws a `new Response('Not Found', { status: 404 })`?
- A) The browser displays a raw white crash screen
- B) React Router intercepts the error and renders the route's designated `errorElement` component
- C) The computer restarts
- D) The operating system reloads
**Answer:** B
**Explanation:** Thrown errors or responses in loaders are caught by React Router and displayed inside the nearest matching `errorElement`.

### Q5: How do React Router **Actions** handle form submissions?
- A) They send data over FTP
- B) Using `<Form method="post">`, React Router intercepts standard form submission and forwards the `Request` object containing `formData` to the route's `action` function
- C) By converting form data into cookies
- D) They trigger a full page refresh
**Answer:** B
**Explanation:** React Router actions model the web standard form submission lifecycle: intercepting submissions and parsing `request.formData()` without page reloads.
