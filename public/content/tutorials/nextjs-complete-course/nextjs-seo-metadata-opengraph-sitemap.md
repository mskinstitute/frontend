# Metadata API: Dynamic SEO, OpenGraph Tags & Sitemap Generation

Search Engine Optimization (SEO) and social media link previews are vital for digital reach. Next.js 15 features the built-in **Metadata API**, allowing developers to define static or dynamic SEO tags, OpenGraph images, Twitter cards, and programmatic sitemaps directly through type-safe TypeScript interfaces.

---

## 1. Static Metadata

Define static metadata by exporting a `metadata` object from any `layout.tsx` or `page.tsx`:

```typescript
// app/courses/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full-Stack & Data Analytics Courses | MSK Institute',
  description: 'Explore comprehensive certification programs in web development, Python, and AI.',
  keywords: ['full-stack web development', 'react', 'next.js', 'mongodb', 'python'],
  openGraph: {
    title: 'Master Modern Tech with MSK Institute',
    description: 'Job-ready curriculum taught by industry leaders.',
    url: 'https://mskinstitute.com/courses',
    siteName: 'MSK Institute',
    images: [
      {
        url: 'https://mskinstitute.com/images/og/courses-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Courses'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mskinstitute'
  }
};
```

---

## 2. Dynamic Metadata with `generateMetadata()`

For dynamic pages (e.g., `/courses/[slug]`), metadata depends on database content. Export an async **`generateMetadata()`** function:

```typescript
// app/courses/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { getCourseBySlug } from '@/lib/courses';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return { title: 'Course Not Found | MSK Institute' };
  }

  return {
    title: `${course.title} | MSK Institute`,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [course.featuredImageUrl || '/images/default-course-og.jpg']
    }
  };
}
```

---

## 3. Programmatic Sitemaps: `sitemap.ts`

Search engines discover your entire content catalog through a `sitemap.xml`. Create `app/sitemap.ts` to generate dynamic sitemaps automatically:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllCourses } from '@/lib/courses';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mskinstitute.com';
  const courses = await getAllCourses();

  const courseEntries: MetadataRoute.Sitemap = courses.map(course => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(course.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    ...courseEntries
  ];
}
```

Next.js automatically serves this at `/sitemap.xml`!

---

# Multiple Choice Questions

### 1. Which function is used to generate dynamic SEO metadata based on database content for dynamic route segments?
A. `getStaticProps()`
B. `generateMetadata()`
C. `setPageSEO()`
D. `useMetadata()`
**Answer:** B
**Explanation:** `generateMetadata()` is the official async function in Next.js App Router for producing dynamic SEO titles, descriptions, and OpenGraph images.
---

### 2. What is the standard recommended aspect ratio and resolution for OpenGraph preview images?
A. 100x100 pixels
B. 1200x630 pixels (approx. 1.91:1 aspect ratio)
C. 1920x1080 pixels (16:9)
D. 500x1000 pixels
**Answer:** B
**Explanation:** Major platforms like Facebook, Twitter, and LinkedIn recommend 1200x630 pixels for high-resolution OpenGraph link cards.
---

### 3. What file convention in the `app/` directory automatically generates a standardized `sitemap.xml` for search engines?
A. `app/sitemap.ts` (or `sitemap.xml`)
B. `app/google.ts`
C. `app/seo.ts`
D. `app/links.ts`
**Answer:** A
**Explanation:** `app/sitemap.ts` allows building programmatic sitemaps, automatically compiled and served as `/sitemap.xml`.
---

### 4. How does Next.js handle metadata declared in a parent `layout.tsx` versus a child `page.tsx`?
A. It throws an error if both define titles.
B. The child page metadata merges with and overrides the parent layout metadata for conflicting fields.
C. The parent layout always deletes the child metadata.
D. It concatenates the two titles with a comma.
**Answer:** B
**Explanation:** Metadata cascades down the route tree; child pages override matching keys while inheriting unspecified properties from parent layouts.
---

### 5. Why should you avoid fetching the same database record twice if both `generateMetadata()` and the page component need it?
A. Because Next.js and React automatically deduplicate and memoize identical `fetch()` calls, meaning the second call incurs 0 network cost.
B. MongoDB will lock the collection.
C. It doubles the size of the JavaScript bundle.
D. The page will render twice.
**Answer:** A
**Explanation:** Request memoization automatically shares the cached response between `generateMetadata()` and the component render pass.
---
