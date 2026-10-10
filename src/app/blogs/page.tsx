import { Metadata } from 'next';
import { fetchBlogs } from '@/services/api';
import BlogsClient from '@/components/BlogsClient';
import { BlogPost } from '@/types';

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = {
  title: 'Tech Blogs, Career Roadmaps & Student Guides | MSK Institute',
  description: 'Read the latest technical articles, full-stack developer roadmaps, Excel productivity hacks, CCC exam preparation guides, and cyber security tips from MSK Institute mentors.',
  alternates: {
    canonical: 'https://www.mskinstitute.in/blogs',
  },
  openGraph: {
    title: 'MSK Institute Blog | Tech Guides & Roadmaps',
    description: 'Learn modern software development, computer fundamentals, and industry tips from leading mentors in Shikohabad.',
    url: 'https://www.mskinstitute.in/blogs',
  },
};

export default async function BlogsPage() {
  let blogs: BlogPost[] = [];
  let errorMsg = '';

  try {
    blogs = (await fetchBlogs()) || [];
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    errorMsg = 'Unable to load blog articles at this moment. Please try again shortly.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
          Articles & Insights
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
          MSK Institute Publications & Blog
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
  );
}
