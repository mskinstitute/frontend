import { parseFrontmatter } from '@/lib/markdown';
import { BlogPost } from '@/types';
import fallbackManifest from '@/data/githubBlogsManifest.json';

// GitHub Repository configuration for MSK Institute blogs
const GITHUB_BLOGS_OWNER = process.env.GITHUB_BLOGS_OWNER || 'mskinstitute';
const GITHUB_BLOGS_REPO = process.env.GITHUB_BLOGS_REPO || 'blogs';
const GITHUB_BLOGS_BRANCH = process.env.GITHUB_BLOGS_BRANCH || 'main';

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_BLOGS_OWNER}/${GITHUB_BLOGS_REPO}/${GITHUB_BLOGS_BRANCH}`;
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_BLOGS_OWNER}/${GITHUB_BLOGS_REPO}`;

// In-memory cache for fast repeated reads during server execution
let memoryCachePosts: BlogPost[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour memory cache
const postsBySlugCache = new Map<string, BlogPost>();

export function parseBlogMarkdown(rawContent: string, fallbackSlug: string): BlogPost {
  const { frontmatter, content } = parseFrontmatter<Record<string, any>>(rawContent);

  const slug = (frontmatter.slug || fallbackSlug).trim();
  const title = (frontmatter.title || 'Tech Article').trim();
  const excerpt = (frontmatter.excerpt || '').trim();
  const coverImage =
    frontmatter.coverImage ||
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
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
  // 1. Serve from in-memory cache if fresh
  if (memoryCachePosts && Date.now() - lastCacheTime < CACHE_TTL_MS) {
    return memoryCachePosts;
  }

  // 2. Fetch manifest from GitHub repository raw CDN
  try {
    const manifestUrl = `${GITHUB_RAW_BASE}/manifest.json`;
    const res = await fetch(manifestUrl, {
      next: { revalidate: 3600 }, // 1-hour Next.js ISR cache
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        const posts: BlogPost[] = data.posts;
        posts.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });

        memoryCachePosts = posts;
        lastCacheTime = Date.now();
        for (const post of posts) {
          postsBySlugCache.set(post.slug.toLowerCase(), post);
          postsBySlugCache.set(post.id.toLowerCase(), post);
        }
        return posts;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch blog manifest from ${GITHUB_RAW_BASE}/manifest.json:`, err);
  }

  // 3. Fallback: Fetch file listing from GitHub REST API
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'MSK-Institute-Website',
      Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API_BASE}/contents`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        const mdFiles = items.filter(
          (item: any) =>
            item.type === 'file' &&
            item.name.endsWith('.md') &&
            item.name.toLowerCase() !== 'readme.md'
        );

        const fetchedPosts: BlogPost[] = [];
        for (const file of mdFiles) {
          try {
            const rawRes = await fetch(`${GITHUB_RAW_BASE}/${encodeURIComponent(file.name)}`, {
              next: { revalidate: 3600 },
            });
            if (rawRes.ok) {
              const raw = await rawRes.text();
              const fallbackSlug = file.name.replace(/\.md$/, '');
              const post = parseBlogMarkdown(raw, fallbackSlug);
              fetchedPosts.push(post);
            }
          } catch {
            // continue next file
          }
        }

        if (fetchedPosts.length > 0) {
          fetchedPosts.sort((a, b) => {
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
          });

          memoryCachePosts = fetchedPosts;
          lastCacheTime = Date.now();
          for (const post of fetchedPosts) {
            postsBySlugCache.set(post.slug.toLowerCase(), post);
            postsBySlugCache.set(post.id.toLowerCase(), post);
          }
          return fetchedPosts;
        }
      }
    }
  } catch (apiErr) {
    console.warn('Failed to fetch blogs from GitHub API contents:', apiErr);
  }

  // 4. Bundled fallback manifest (ensures offline builds and transient network drops never break the site)
  if (fallbackManifest && Array.isArray((fallbackManifest as any).posts)) {
    const fallbackPosts: BlogPost[] = (fallbackManifest as any).posts;
    memoryCachePosts = fallbackPosts;
    lastCacheTime = Date.now();
    for (const post of fallbackPosts) {
      postsBySlugCache.set(post.slug.toLowerCase(), post);
      postsBySlugCache.set(post.id.toLowerCase(), post);
    }
    return fallbackPosts;
  }

  return [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Check slug cache if already loaded with full content
  const cached = postsBySlugCache.get(normalizedSlug);
  if (cached && typeof cached.content === 'string' && cached.content.length > 0) {
    return cached;
  }

  // 2. Fetch markdown directly from GitHub raw URL: <slug>.md
  try {
    const directUrl = `${GITHUB_RAW_BASE}/${encodeURIComponent(normalizedSlug)}.md`;
    const res = await fetch(directUrl, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const rawContent = await res.text();
      const post = parseBlogMarkdown(rawContent, normalizedSlug);
      postsBySlugCache.set(post.slug.toLowerCase(), post);
      postsBySlugCache.set(post.id.toLowerCase(), post);
      return post;
    }
  } catch (fetchErr) {
    console.warn(`Failed to fetch blog markdown from ${GITHUB_RAW_BASE}/${normalizedSlug}.md:`, fetchErr);
  }

  // 3. Search all posts in case slug differs from filename
  const allPosts = await getAllBlogPosts();
  const match = allPosts.find(
    (p) =>
      p.slug.toLowerCase() === normalizedSlug ||
      p.id.toLowerCase() === normalizedSlug
  );

  if (match) {
    postsBySlugCache.set(normalizedSlug, match);
    return match;
  }

  return null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return posts.map((p) => p.slug);
}
