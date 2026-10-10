# Server Actions ("use server"): Type-Safe Mutations Without API Endpoints

In traditional web development, submitting a form required creating an API endpoint (`/api/feedback`), setting up body parsers, managing HTTP methods, writing client-side `fetch` logic, and synchronizing state. **Server Actions** revolutionize data mutations by allowing client components and forms to invoke asynchronous server-side functions directly using the **`"use server"`** directive.

---

## 1. What are Server Actions?

A **Server Action** is an asynchronous function that executes exclusively on the server. They can be invoked:
- Directly inside HTML `<form action={myAction}>` elements (works even if JavaScript is disabled!).
- Programmatically from client components via event handlers or React hooks.
- Provide end-to-end TypeScript type safety between the UI form and the database mutation.

---

## 2. Defining Server Actions in a Dedicated File

Placing server actions in a dedicated file marked with `'use server'` allows them to be shared across Server and Client Components:

```typescript
// app/actions/course-actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCourseAction(formData: FormData) {
  await dbConnect();

  const title = formData.get('title') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;

  // Validation
  if (!title || title.length < 3) {
    throw new Error('Course title must be at least 3 characters long');
  }

  // Database persistence
  await Course.create({
    title,
    price,
    category,
    slug: title.toLowerCase().replace(/\s+/g, '-')
  });

  // Revalidate cache so the courses catalog immediately shows the new course!
  revalidatePath('/courses');

  // Redirect user to the courses list
  redirect('/courses');
}
```

---

## 3. Consuming Server Actions in Components

```tsx
// app/admin/courses/new/page.tsx
import { createCourseAction } from '@/app/actions/course-actions';

export default function NewCoursePage() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Course</h2>
      <form action={createCourseAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Course Title</label>
          <input name="title" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (INR)</label>
          <input name="price" type="number" required className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Publish Course
        </button>
      </form>
    </div>
  );
}
```

---

# Multiple Choice Questions

### 1. What directive is required at the top of an action function or file to designate it as a Server Action?
A. `'use client'`
B. `'use server'`
C. `'use action'`
D. `'use backend'`
**Answer:** B
**Explanation:** The `'use server'` directive marks a function or file as a Server Action that runs exclusively on the server.
---

### 2. What is a key advantage of invoking Server Actions inside `<form action={action}>` compared to traditional `onSubmit` with `fetch`?
A. Forms can submit and function natively via progressive enhancement, even before client-side JavaScript has finished loading.
B. It disables database indexes.
C. It encrypts the user's monitor screen.
D. It prevents users from typing numbers.
**Answer:** A
**Explanation:** Progressive enhancement allows standard HTML forms wired to Server Actions to submit successfully even if client JavaScript is disabled or still downloading.
---

### 3. What argument does a Server Action receive when invoked as the `action` attribute of an HTML `<form>`?
A. The browser `window` object
B. A `FormData` object containing the form's submitted input values
C. An Express `res` object
D. A SQL query string
**Answer:** B
**Explanation:** When triggered by form submission, Next.js automatically passes a native Web `FormData` instance to the Server Action.
---

### 4. Can a Server Action be called from an interactive Client Component with `'use client'`?
A. No, Server Actions can only be used in static HTML files.
B. Yes, Client Components can import Server Actions from external files and call them via `onClick` handlers or transitions.
C. Only if the Server Action is converted into a REST route.
D. Only on Mac computers.
**Answer:** B
**Explanation:** Client Components can seamlessly import and invoke Server Actions defined in `'use server'` files.
---

### 5. Why should you call `revalidatePath('/courses')` inside a Server Action that adds a new course?
A. To clear the browser history.
B. To purge the server-side cached HTML for `/courses` so visitors immediately see the newly created course.
C. To reboot the Next.js server.
D. To reset the user's authentication token.
**Answer:** B
**Explanation:** `revalidatePath()` invalidates the cache for the specified route path, prompting Next.js to fetch fresh data on subsequent requests.
---
