# API Route Handlers (route.ts): Building RESTful Microservices

While Server Components and Server Actions handle most internal data fetching and mutations, modern full-stack web applications frequently need to expose public RESTful endpoints for third-party integrations, mobile applications, webhooks (e.g., Stripe, Razorpay), or external microservices. Next.js provides **Route Handlers** via **`route.ts`** files.

---

## 1. Route Handler Conventions

- Created inside the `app/` directory as `route.ts` (or `route.js`).
- **Conflict Rule:** A `route.ts` and a `page.tsx` CANNOT exist at the same URL segment level!
- Handlers export named functions corresponding to standard HTTP verbs: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.

```text
app/
 └── api/
      ├── courses/
      │    └── route.ts       # GET /api/courses, POST /api/courses
      └── webhooks/
           └── stripe/
                └── route.ts  # POST /api/webhooks/stripe
```

---

## 2. Implementing RESTful Handlers: GET & POST

```typescript
// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';

// GET: /api/courses?category=web
export async function GET(request: NextRequest) {
  await dbConnect();

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  const filter = category ? { category, isPublished: true } : { isPublished: true };
  const courses = await Course.find(filter).lean();

  return NextResponse.json({
    status: 'success',
    results: courses.length,
    data: courses
  });
}

// POST: /api/courses
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price' },
        { status: 400 }
      );
    }

    const newCourse = await Course.create(body);

    return NextResponse.json(
      { message: 'Course created successfully', data: newCourse },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 3. Dynamic Route Handlers with Parameters

```typescript
// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const deleted = await Course.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 }); // 204 No Content
}
```

---

# Multiple Choice Questions

### 1. What special file name is used in the Next.js App Router to create API endpoints?
A. `api.ts`
B. `route.ts` (or `route.js`)
C. `endpoint.ts`
D. `handler.ts`
**Answer:** B
**Explanation:** Route Handlers are defined in files named `route.ts` or `route.js` within the `app` directory.
---

### 2. Can a `page.tsx` and a `route.ts` exist within the exact same directory (e.g. `app/api/users/`)?
A. Yes, they work together.
B. No; Next.js will throw a build error because a single URL path cannot serve both an HTML page and a raw API route.
C. Only if the page is private.
D. Only on weekends.
**Answer:** B
**Explanation:** `page.tsx` and `route.ts` are mutually exclusive for any single route segment, as one returns an HTML document and the other handles raw HTTP requests.
---

### 3. How do you extract query string parameters from an incoming `NextRequest` in a Route Handler?
A. `request.query.get('param')`
B. `request.nextUrl.searchParams.get('param')`
C. `window.location.search`
D. `request.headers.get('query')`
**Answer:** B
**Explanation:** `request.nextUrl.searchParams` provides a standard Web API `URLSearchParams` object to inspect query parameters.
---

### 4. Which utility is standard in Next.js for sending JSON responses with the correct headers and status codes?
A. `res.status(200).send()`
B. `NextResponse.json(data, { status })`
C. `JSON.stringifyResponse()`
D. `process.stdout.write()`
**Answer:** B
**Explanation:** `NextResponse.json()` extends the standard Web Response object, serializing JSON payloads and setting appropriate HTTP headers.
---

### 5. Why are Route Handlers ideal for implementing payment provider webhooks (e.g. Stripe, Razorpay)?
A. Webhooks cannot execute JavaScript.
B. External payment gateways send raw HTTP POST notifications that require raw header verification and body signature checks, which Route Handlers handle natively.
C. Stripe requires HTML pages.
D. Route Handlers eliminate transaction fees.
**Answer:** B
**Explanation:** Webhooks from third-party services require dedicated HTTP POST endpoints with signature verification headers, perfectly handled by `route.ts`.
---
