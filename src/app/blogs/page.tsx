import { Metadata } from 'next';
import { fetchBlogs } from '@/services/api';
import BlogsClient from '@/components/BlogsClient';
import { constructMetadata } from '@/lib/seo';
import { BlogPost } from '@/types';

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = constructMetadata({
  title: 'Tech Blogs, Career Roadmaps & Student Guides',
  description:
    'Read technical articles, Python & Full-Stack developer roadmaps, ADCA vs DCA guides, NIELIT CCC exam tips, SQL interview questions, and career strategies from MSK Institute mentors.',
  canonical: '/blogs',
  image: '/brand/og-banner.png',
  keywords: [
    'MSK Institute Blog',
    'Python Career Roadmap India',
    'NIELIT CCC Preparation Guide',
    'ADCA vs DCA Comparison',
    'Full Stack Web Development Roadmap 2026',
    'Computer Institute Shikohabad Guides',
    'Online Coding Classes Hindi English',
  ],
});

export default async function BlogsPage() {
  let blogs: BlogPost[] = [];
  let errorMsg = '';

  try {
    blogs = (await fetchBlogs()) || [];
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    errorMsg = 'Unable to load blog articles at this moment. Please try again shortly.';
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.mskinstitute.in/blogs#webpage',
        url: 'https://www.mskinstitute.in/blogs',
        name: 'MSK Institute Publications & Tech Blog',
        description:
          'Technical guides, course comparison articles, interview prep, and career roadmaps authored by Er. Sumit Kumar and MSK Institute faculty.',
        isPartOf: { '@id': 'https://www.mskinstitute.in/#website' },
      },
      {
        '@type': 'ItemList',
        name: 'MSK Institute Articles',
        numberOfItems: blogs.length,
        itemListElement: blogs.slice(0, 30).map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.title,
          url: `https://www.mskinstitute.in/blogs/${b.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.mskinstitute.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blogs',
            item: 'https://www.mskinstitute.in/blogs',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
            Articles &amp; Insights
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
            MSK Institute Publications &amp; Blog
          </h1>
          <p className="text-text-muted text-sm sm:text-lg leading-relaxed">
            In-depth technical guides, career roadmaps, and practical software engineering tutorials authored by our faculty and mentors.
          </p>
        </div>

        {errorMsg && blogs.length === 0 ? (
          <div className="text-center py-12 bg-red-50 text-red-700 border border-red-200 rounded-xl">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        ) : (
          <BlogsClient initialBlogs={blogs} />
        )}
      </div>
    </>
  );
}
