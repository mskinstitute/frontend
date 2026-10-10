# Dynamic URL Parameters with useParams

## 1. The Need for Dynamic Route Segments
In modern web applications, you cannot hardcode a separate route for every piece of content in your database:
- `/courses/react-for-beginners`
- `/courses/django-backend-architecture`
- `/courses/data-analysis-mastery`

Creating hundreds of static route tags (`<Route path="/courses/course-1" />`, `<Route path="/courses/course-2" />`) is impossible.

Instead, routers use **Dynamic URL Parameters** (denoted with a leading colon `:`):
```
/courses/:courseSlug
```
The `:courseSlug` segment acts as a wildcard variable that captures whatever string occupies that position in the active URL.

## 2. Defining Dynamic Routes
In your router definition, place a colon `:` before the parameter name:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/courses" element={<CourseCatalog />} />
  
  {/* Dynamic parameter route */}
  <Route path="/courses/:courseSlug" element={<CourseDetail />} />

  {/* Multiple dynamic parameters */}
  <Route path="/courses/:courseSlug/lessons/:lessonId" element={<LessonViewer />} />
</Routes>
```

## 3. Reading Parameters with the `useParams` Hook
React Router provides the **`useParams()`** hook to extract active URL parameters from inside the rendered component.

`useParams()` returns an object where keys match the param names defined in your route (`:courseSlug` -> `params.courseSlug`):

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseDetail() {
  // Extract dynamic segment from URL
  const { courseSlug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseDetails() {
      setLoading(true);
      try {
        const response = await fetch(`/api/courses/${courseSlug}`);
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseSlug]); // Re-fetch whenever the URL parameter changes!

  if (loading) return <div className="spinner">Loading syllabus...</div>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="course-detail-view">
      <Link to="/courses" className="back-link">← Back to Catalog</Link>
      
      <h2>{course.title}</h2>
      <p className="description">{course.description}</p>
      
      <h3>Curriculum Modules</h3>
      <ul>
        {course.modules.map((m) => (
          <li key={m.id}>
            <Link to={`/courses/${courseSlug}/lessons/${m.slug}`}>
              {m.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 4. Crucial Hook Rule: Dependency on `useParams`
Notice line 29: `[courseSlug]` is included in the `useEffect` dependency array.

If a user navigates directly from `/courses/react-for-beginners` to `/courses/django-backend`, the `CourseDetail` component does **not unmount and remount**; only its URL parameter changes! Listing `courseSlug` in the dependency array guarantees that your data-fetching effect fires again to load the new course data.

---

## Practice Quiz

### Q1: How do you declare a dynamic URL parameter in a React Router `<Route>` path?
- A) With curly braces: `path="/courses/{courseId}"`
- B) With a leading colon: `path="/courses/:courseId"`
- C) With square brackets: `path="/courses/[courseId]"`
- D) With dollar signs: `path="/courses/$courseId"`
**Answer:** B
**Explanation:** In React Router, dynamic parameter segments are preceded by a colon, such as `:courseId` or `:slug`.

### Q2: What does the `useParams()` hook return?
- A) An array of numbers
- B) An object containing key/value pairs of dynamic params from the current URL matched by the `<Route path>`
- C) The current browser window height
- D) An SQL query string
**Answer:** B
**Explanation:** `useParams()` returns an object where each key corresponds to a dynamic route token (e.g. `{ courseSlug: 'react-for-beginners' }`).

### Q3: If the route is `/users/:userId/posts/:postId` and the active URL is `/users/42/posts/108`, what will `useParams()` return?
- A) `['42', '108']`
- B) `{ userId: '42', postId: '108' }`
- C) `{ params: 150 }`
- D) `undefined`
**Answer:** B
**Explanation:** React Router extracts each named segment and returns them as properties on the params object: `{ userId: '42', postId: '108' }`.

### Q4: Why must the extracted parameter (e.g. `courseSlug`) be included in the `useEffect` dependency array?
- A) To satisfy TypeScript requirements only
- B) Because if the user navigates between different courses, the component remains mounted and only re-fetches if the param is listed in the dependencies
- C) React crashes if dependency arrays are empty
- D) To prevent CSS styles from resetting
**Answer:** B
**Explanation:** React reuses existing mounted components across parameter changes. Listing the param in the dependency array ensures the data fetch triggers when the user navigates between sibling items.

### Q5: What data type are the values returned in the `useParams` object?
- A) Integers
- B) Always Strings (e.g. `'42'`, not `42`)
- C) Booleans
- D) Symbols
**Answer:** B
**Explanation:** URL parameters are parsed directly from the browser's address string, so all parameter values in `useParams()` are strings.
