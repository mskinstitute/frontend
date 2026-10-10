import fs from 'fs/promises';
import path from 'path';
import { parseFrontmatter } from '@/lib/markdown';
import { BlogPost } from '@/types';

// Potential directories where blogs can reside
const BLOG_DIRS = [
  path.join(process.cwd(), 'content', 'blogs'),
  path.join(process.cwd(), 'public', 'content', 'blogs'),
];

export async function getBlogDir(): Promise<string | null> {
  for (const dir of BLOG_DIRS) {
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) return dir;
    } catch {
      // Continue checking next candidate
    }
  }
  return null;
}

export function parseBlogMarkdown(rawContent: string, fallbackSlug: string): BlogPost {
  const { frontmatter, content } = parseFrontmatter<Record<string, any>>(rawContent);

  const slug = (frontmatter.slug || fallbackSlug).trim();
  const title = (frontmatter.title || 'Tech Article').trim();
  const excerpt = (frontmatter.excerpt || '').trim();
  const coverImage = frontmatter.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
  const category = (frontmatter.category || 'Technology').trim();
  const featured = Boolean(frontmatter.featured);

  // Author resolution supporting multiple frontmatter conventions
  const authorName =
    frontmatter.authorName ||
    (typeof frontmatter.author === 'string' ? frontmatter.author : frontmatter.author?.name) ||
    'Er. Sumit Kumar';
  const authorRole =
    frontmatter.authorRole ||
    (typeof frontmatter.author === 'object' ? frontmatter.author?.role : null) ||
    'Founder & Lead Technical Mentor';
  const authorAvatar =
    frontmatter.authorAvatar ||
    (typeof frontmatter.author === 'object' ? frontmatter.author?.avatar : null) ||
    '/assets/img/instructors/sumit-kumar.webp';

  const publishedAt = frontmatter.publishedAt || '2026-08-01';

  // Calculate read time if not provided
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = frontmatter.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Tags resolution
  const tags: string[] = Array.isArray(frontmatter.tags)
    ? frontmatter.tags
    : typeof frontmatter.tags === 'string'
    ? frontmatter.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

  // Related courses resolution
  const relatedCourseSlugs: string[] = Array.isArray(frontmatter.relatedCourses)
    ? frontmatter.relatedCourses
    : Array.isArray(frontmatter.relatedCourseSlugs)
    ? frontmatter.relatedCourseSlugs
    : [];

  return {
    id: frontmatter.id || `blog-${slug}`,
    slug,
    title,
    excerpt,
    coverImage,
    category,
    featured,
    author: {
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
    },
    publishedAt,
    readTime,
    tags,
    content, // Markdown string
    relatedCourseSlugs,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const dir = await getBlogDir();
  if (!dir) return [];

  try {
    const files = await fs.readdir(dir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    const posts: BlogPost[] = [];
    for (const filename of mdFiles) {
      const filePath = path.join(dir, filename);
      const rawContent = await fs.readFile(filePath, 'utf8');
      const fallbackSlug = filename.replace(/\.md$/, '');
      const post = parseBlogMarkdown(rawContent, fallbackSlug);
      posts.push(post);
    }

    // Sort by publishedAt descending (most recent first)
    posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return posts;
  } catch (err) {
    console.error('Failed to read blog markdown files from', dir, err);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const dir = await getBlogDir();
  if (!dir) return null;

  // 1. Try direct file lookup: <slug>.md
  const directPath = path.join(dir, `${normalizedSlug}.md`);
  try {
    const rawContent = await fs.readFile(directPath, 'utf8');
    return parseBlogMarkdown(rawContent, normalizedSlug);
  } catch {
    // Direct file not found, fall back to searching all posts
  }

  // 2. Search all posts in directory (in case slug inside frontmatter differs from filename)
  const allPosts = await getAllBlogPosts();
  return (
    allPosts.find(
      (p) =>
        p.slug.toLowerCase() === normalizedSlug ||
        p.id.toLowerCase() === normalizedSlug
    ) || null
  );
}

export async function getBlogSlugs(): Promise<string[]> {
  const dir = await getBlogDir();
  if (!dir) return [];

  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}
