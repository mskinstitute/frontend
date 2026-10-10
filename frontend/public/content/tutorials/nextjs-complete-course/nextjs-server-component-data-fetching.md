# Data Fetching in Server Components & Async Server Logic

In traditional React SPAs, data fetching required the infamous `useEffect` + `useState` pattern: loading spinners flashing, waterfall cascading requests, and state synchronization bugs. Next.js 15 eliminates this ceremony by enabling **direct asynchronous data fetching inside React Server Components**.

---

## 1. Async Server Components: The Modern Standard

In Next.js, any Server Component can be declared with `async` and use `await` directly in its body:

```tsx
// app/courses/page.tsx
import CourseCard from '@/components/CourseCard';

interface Course {
  id: string;
  title: string;
  price: number;
}

async function getCourses(): Promise<Course[]> {
  const res = await fetch('https://api.mskinstitute.com/v1/courses', {
    // Next.js caching configuration
    next: { revalidate: 3600 } // Cache data for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch courses from upstream API');
  }

  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses(); // Clean synchronous-style await!

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-8">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
```

---

## 2. Direct Database Access Without API Endpoints

Because Server Components run strictly on the backend, you do not need to create intermediate REST API endpoints (`/api/courses`) just to read data for your own UI! You can query your database or ORM directly:

```tsx
// app/instructors/page.tsx
import dbConnect from '@/lib/dbConnect';
import Instructor from '@/models/Instructor';

export default async function InstructorsPage() {
  await dbConnect(); // Connect to MongoDB
  const instructors = await Instructor.find({ isActive: true }).lean(); // Direct Mongoose query!

  return (
    <section>
      <h2>Meet Our Faculty</h2>
      <ul>
        {instructors.map(inst => (
          <li key={inst._id.toString()}>{inst.name} - {inst.specialty}</li>
        ))}
      </ul>
    </section>
  );
}
```

---

## 3. Parallel Data Fetching to Eliminate Waterfalls

If a page requires data from two independent sources, avoid sequential awaits:

```tsx
// BAD: Sequential Waterfall (Takes 1s + 1s = 2s)
// const user = await getUser(userId);
// const courses = await getCourses();

// GOOD: Parallel Execution with Promise.all (Takes max(1s, 1s) = 1s!)
const [user, courses] = await Promise.all([
  getUser(userId),
  getCourses()
]);
```

---

# Multiple Choice Questions

### 1. What enables an async React component like `export default async function Page() { ... }` in Next.js?
A. Vanilla React 16.
B. React Server Components (RSC) architecture in React 19 / Next.js 15.
C. A Babel plugin from 2015.
D. Next.js converts it to a regular `useEffect`.
**Answer:** B
**Explanation:** React Server Components natively support async functions, allowing promises to be awaited directly within the component render function.
---

### 2. Can you query your MongoDB database directly with Mongoose inside an async Server Component?
A. No, you must always create an Express backend first.
B. Yes; because Server Components execute purely on the backend, you can connect and query databases directly without intermediate API route handlers.
C. Only if MongoDB runs in the browser.
D. Only for read operations under 10 bytes.
**Answer:** B
**Explanation:** Server Components execute in Node.js server environments, allowing direct database access using Mongoose, Prisma, or native drivers.
---

### 3. How do you prevent sequential request waterfalls when fetching multiple independent datasets in a Server Component?
A. Fetch the data inside `useLayoutEffect`.
B. Trigger both fetch promises simultaneously and await them using `Promise.all()`.
C. Turn off TypeScript.
D. Increase the server CPU frequency.
**Answer:** B
**Explanation:** `Promise.all([fetchA(), fetchB()])` executes both asynchronous tasks concurrently in parallel, reducing total latency.
---

### 4. What happens if an async Server Component throws an uncaught error during data fetching?
A. The entire server crashes and shuts down.
B. Next.js catches the error and renders the nearest `error.tsx` error boundary component.
C. The client sees a blank page forever.
D. The page redirects to Google.
**Answer:** B
**Explanation:** Next.js wraps routes in React Error Boundaries; throwing an error in an async component automatically activates the nearest `error.tsx` component.
---

### 5. Why is fetching data inside Server Components faster than client-side fetching via `useEffect`?
A. Server Components run on quantum computers.
B. Data fetching occurs on the server network in close physical proximity to databases/microservices, eliminating high-latency mobile browser round-trips.
C. It disables HTTP headers.
D. Server components compress all JSON data to 1 bit.
**Answer:** B
**Explanation:** Server-to-database connections usually have sub-millisecond local network latency, avoiding slow mobile round-trips.
---
