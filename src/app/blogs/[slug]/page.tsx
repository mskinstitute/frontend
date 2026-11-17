import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogs, fetchBlogBySlug, fetchCourses } from '@/services/api';
import BlogArticleClient from '@/components/BlogArticleClient';
import { constructMetadata } from '@/lib/seo';
import { Course } from '@/types';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const blogs = await fetchBlogs();
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return constructMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found at MSK Institute.',
      noIndex: true,
    });
  }

  const authorName =
    typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Er. Sumit Kumar';

  return constructMetadata({
    title: `${blog.title} | MSK Institute`,
    description: blog.excerpt,
    canonical: `/blogs/${blog.slug}`,
    image: blog.coverImage || '/brand/og-banner.png',
    type: 'article',
    publishedTime: blog.publishedAt,
    modifiedTime: blog.publishedAt,
    authors: [authorName],
    keywords: [
      ...(blog.tags || []),
      blog.category || 'Tech Guide',
      'MSK Institute',
      'Er. Sumit Kumar',
    ],
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [blog, allCourses] = await Promise.all([
    fetchBlogBySlug(slug),
    fetchCourses().catch(() => [] as Course[]),
  ]);

  if (!blog) {
    notFound();
  }

  const relatedCourses: Course[] = blog.relatedCourseSlugs
    ? blog.relatedCourseSlugs
        .map((cSlug) => allCourses.find((c) => c.slug === cSlug))
        .filter((c): c is Course => Boolean(c))
    : [];

  const canonicalUrl = `https://www.mskinstitute.in/blogs/${blog.slug}`;
  const resolvedImage = blog.coverImage
    ? blog.coverImage.startsWith('http')
      ? blog.coverImage
      : `https://www.mskinstitute.in${blog.coverImage.startsWith('/') ? blog.coverImage : `/${blog.coverImage}`}`
    : 'https://www.mskinstitute.in/brand/og-banner.png';
  const authorName =
    typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Er. Sumit Kumar';
  const authorRole =
    typeof blog.author === 'object' && blog.author?.role
      ? blog.author.role
      : 'Founder & Lead Technical Trainer';
  const rawText =
    typeof blog.content === 'string'
      ? blog.content
      : blog.content
        ? [
            blog.content.introduction || '',
            ...(blog.content.sections || []).map((s) => `${s.heading} ${s.body}`),
            blog.content.conclusion || '',
          ].join(' ')
        : '';
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : undefined;

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        headline: blog.title,
        description: blog.excerpt,
        image: [resolvedImage],
        url: canonicalUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        datePublished: blog.publishedAt || '2026-09-01',
        dateModified: blog.publishedAt || '2026-11-18',
        inLanguage: 'en-IN',
        articleSection: blog.category || 'Technology & Education',
        keywords: blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : undefined,
        ...(wordCount ? { wordCount } : {}),
        author: {
          '@type': 'Person',
          name: authorName,
          jobTitle: authorRole,
          url: 'https://www.mskinstitute.in/about',
          worksFor: {
            '@type': 'EducationalOrganization',
            '@id': 'https://www.mskinstitute.in/#organization',
            name: 'MSK Institute',
            url: 'https://www.mskinstitute.in',
          },
        },
        publisher: {
          '@type': 'EducationalOrganization',
          '@id': 'https://www.mskinstitute.in/#organization',
          name: 'MSK Institute',
          url: 'https://www.mskinstitute.in',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.mskinstitute.in/logo.jpg',
          },
        },
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
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogArticleClient blog={blog} relatedCourses={relatedCourses} />
    </>
  );
}
