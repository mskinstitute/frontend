import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogs, fetchBlogBySlug, fetchCourses } from '@/services/api';
import BlogArticleClient from '@/components/BlogArticleClient';
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
    return {
      title: 'Article Not Found | MSK Institute',
    };
  }

  return {
    title: `${blog.title} | MSK Institute Publications`,
    description: blog.excerpt,
    alternates: {
      canonical: `https://www.mskinstitute.in/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `https://www.mskinstitute.in/blogs/${blog.slug}`,
      type: 'article',
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
  };
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

  return <BlogArticleClient blog={blog} relatedCourses={relatedCourses} />;
}
