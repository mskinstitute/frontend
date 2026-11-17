import { fetchBlogs } from '@/services/api';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mskinstitute.in';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const blogs = await fetchBlogs().catch(() => []);

  const sortedBlogs = [...blogs].sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });

  const itemsXml = sortedBlogs
    .slice(0, 50)
    .map((blog) => {
      const link = `${BASE_URL}/blogs/${blog.slug}`;
      const pubDate = blog.publishedAt
        ? new Date(blog.publishedAt).toUTCString()
        : new Date('2026-11-18T00:00:00Z').toUTCString();
      const imageUrl = blog.coverImage
        ? blog.coverImage.startsWith('http')
          ? blog.coverImage
          : `${BASE_URL}${blog.coverImage.startsWith('/') ? blog.coverImage : `/${blog.coverImage}`}`
        : `${BASE_URL}/brand/og-banner.png`;
      const category = blog.category || 'Tech & Career Guides';
      const authorName =
        typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Er. Sumit Kumar';

      return `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(blog.excerpt || blog.title)}</description>
      <category>${escapeXml(category)}</category>
      <author>mskshikohabad@gmail.com (${escapeXml(authorName)})</author>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escapeXml(imageUrl)}" type="image/png" length="0" />
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MSK Institute — Coding Tutorials, Career Roadmaps &amp; Tech Publications</title>
    <link>${BASE_URL}</link>
    <description>Practical programming guides, Python &amp; Full-Stack roadmaps, NIELIT CCC &amp; ADCA career comparisons, and live online coding updates in Hindi &amp; English by Er. Sumit Kumar.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/brand/og-banner.png</url>
      <title>MSK Institute</title>
      <link>${BASE_URL}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
