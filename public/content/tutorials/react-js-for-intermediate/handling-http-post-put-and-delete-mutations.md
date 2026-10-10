# Handling HTTP POST, PUT, and DELETE Mutations

## 1. Mutations in Modern Web Apps
While fetching data (`GET`) is read-only, modifying server data is called a **mutation**:
- **`POST`:** Creates a new resource (e.g. enrolling in a course, submitting a review).
- **`PUT` / `PATCH`:** Updates an existing resource (`PUT` replaces; `PATCH` modifies specific fields).
- **`DELETE`:** Removes an existing resource from the server.

Mutations are triggered by **explicit user interactions** (button clicks, form submissions). Unlike `GET` requests, **mutations belong in event handlers, NOT in `useEffect`!**

```
User Clicks "Create Student"
         │
         ▼
[Event Handler: handleSubmit]
 ├─ Disable submit button (prevent double submissions)
 ├─ Send fetch(url, { method: 'POST', body: JSON.stringify(data) })
 ├─ Update local React state immutably upon success
 └─ Show confirmation notification
```

## 2. Executing a POST Request
When sending data to a backend REST API:
1. Set `method: 'POST'`.
2. Specify `'Content-Type': 'application/json'` in the `headers` object.
3. Serialize the JavaScript payload using `JSON.stringify(payload)`.

```jsx
import React, { useState } from 'react';

export default function CreateCourseForm({ onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(49);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = { title, price: Number(price) };

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create course');
      }

      const createdCourse = await response.json();
      
      // Update parent state immutably with newly created resource
      onCourseCreated(createdCourse);

      // Reset form
      setTitle('');
      setPrice(49);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mutation-form">
      <h3>Create New Course Track</h3>
      {error && <p className="text-danger">{error}</p>}

      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Price ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      {/* Disable button while network request is in-flight! */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving Course...' : 'Create Course'}
      </button>
    </form>
  );
}
```

## 3. Handling DELETE with Optimistic UI vs Pessimistic UI
When deleting a resource:
- **Pessimistic UI:** Wait for the server to confirm deletion (HTTP 200/204), *then* remove it from the screen.
- **Optimistic UI:** Immediately remove the item from the screen, then send the network request in the background. If the request fails, roll back the UI and display an error alert!

```jsx
// Optimistic Delete Example:
const handleDelete = async (courseId) => {
  // 1. Snapshot previous state for rollback
  const previousCourses = courses;

  // 2. Optimistically remove from UI immediately (instant perceived performance!)
  setCourses(prev => prev.filter(c => c.id !== courseId));

  try {
    const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed on server');
  } catch (err) {
    // 3. Rollback on failure!
    setCourses(previousCourses);
    alert('Could not delete course. Restoring item.');
  }
};
```

---

## Practice Quiz

### Q1: Where should HTTP mutation requests (POST, PUT, DELETE) be executed in a React component?
- A) Inside `useEffect` on every render
- B) Inside event handlers triggered by explicit user actions (e.g. form `onSubmit` or button `onClick`)
- C) In `src/main.jsx`
- D) Inside CSS files
**Answer:** B
**Explanation:** Mutations alter server data and are triggered by user actions, meaning they belong directly inside event handlers.

### Q2: What header must be included when transmitting JSON payloads via POST or PUT requests?
- A) `'Content-Type': 'application/json'`
- B) `'Accept-Encoding': 'gzip'`
- C) `'X-Powered-By': 'React'`
- D) `'Cache-Control': 'no-cache'`
**Answer:** A
**Explanation:** The `'Content-Type': 'application/json'` header informs backend servers (like Django or Express) to parse the incoming request body as JSON.

### Q3: Why is disabling submit buttons (`disabled={isSubmitting}`) critical during network mutations?
- A) To prevent impatient users from rapidly clicking multiple times, which could create duplicate database records or multiple financial charges
- B) To allow CSS transitions to finish
- C) It is required by modern web browsers
- D) To turn off JavaScript
**Answer:** A
**Explanation:** Disabling submit buttons prevents accidental duplicate submissions (e.g. double-charging a credit card or creating redundant records) while network requests are in flight.

### Q4: What is an "Optimistic UI update"?
- A) An update that only runs when the weather is sunny
- B) Updating the local React UI immediately before receiving server confirmation, and rolling back if the request fails
- C) A component with cheerful colors
- D) An update that always assumes the user is logged in
**Answer:** B
**Explanation:** Optimistic UI updates provide zero-latency experiences by immediately applying the anticipated result to the screen, rolling back only if the server rejects the request.

### Q5: What is the difference between HTTP `PUT` and `PATCH`?
- A) `PUT` is for images; `PATCH` is for text
- B) `PUT` typically replaces the entire resource document; `PATCH` applies partial modifications to specific fields
- C) `PATCH` is deprecated in REST APIs
- D) `PUT` only works on mobile devices
**Answer:** B
**Explanation:** According to HTTP/REST specifications, `PUT` completely replaces the target resource, while `PATCH` applies partial updates to specified attributes.
