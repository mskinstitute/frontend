import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { fetchCourses, fetchBlogs, fetchTutorials, fetchLiveBatches } from '@/services/api';
import { getPublishedBranches } from '@/lib/branches';
import { getAllToolSlugs } from '@/data/shortcutsData';
import githubManifest from '@/data/githubTutorialManifest.json';

const DEFAULT_LASTMOD = '2026-11-18';

function safeIsoDate(input?: string | null): string {
  if (!input) return DEFAULT_LASTMOD;
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return DEFAULT_LASTMOD;
  return parsed.toISOString().split('T')[0];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mskinstitute.in';
  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const pushEntry = (
    url: string,
    lastModified: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number
  ) => {
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    entries.push({ url, lastModified, changeFrequency, priority });
  };

  // 1. Base static routes - Canonical 200 OK routes only (excluding redirects like /notes and private auth/dashboard routes)
  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/book-demo', changeFrequency: 'weekly', priority: 0.95 },
    { path: '/courses', changeFrequency: 'daily', priority: 0.95 },
    { path: '/tutorials', changeFrequency: 'daily', priority: 0.95 },
    { path: '/live-batches', changeFrequency: 'daily', priority: 0.95 },
    { path: '/live', changeFrequency: 'daily', priority: 0.9 },
    { path: '/locations', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/learning-paths', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/mock-test', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/mock-test/ccc', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/career-finder', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/blogs', changeFrequency: 'daily', priority: 0.9 },
    { path: '/study-material', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/tools', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/tools/typing', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/tools/db-viewer', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/tools/sql-studio', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/playground', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/shortcuts', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/projects', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/verify-certificate', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/careers', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/disclaimer', changeFrequency: 'yearly', priority: 0.4 },
  ];

  for (const r of staticRoutes) {
    pushEntry(`${baseUrl}${r.path}`, DEFAULT_LASTMOD, r.changeFrequency, r.priority);
  }

  try {
    const [courses, blogs, tutorials, batches, branches] = await Promise.all([
      fetchCourses(),
      fetchBlogs().catch(() => []),
      fetchTutorials().catch(() => []),
      fetchLiveBatches().catch(() => []),
      getPublishedBranches().catch(() => []),
    ]);

    // 2. Keyboard Shortcut Reference Pages
    for (const slug of getAllToolSlugs()) {
      pushEntry(`${baseUrl}/shortcuts/${slug}`, DEFAULT_LASTMOD, 'monthly', 0.85);
    }

    // 3. Branch / Campus Location Pages
    for (const branch of branches) {
      pushEntry(
        `${baseUrl}/locations/${branch.slug}`,
        safeIsoDate(branch.updatedAt),
        'weekly',
        branch.isHeadquarters ? 0.95 : 0.85
      );
    }

    // 4. Published Course Pages
    const publishedCourses = courses.filter((course) => course.status === 'PUBLISH');
    for (const course of publishedCourses) {
      const isMastery =
        course.courseType === 'COMBO' || course.title.toLowerCase().includes('mastery');
      pushEntry(
        `${baseUrl}/courses/${course.slug}`,
        DEFAULT_LASTMOD,
        'weekly',
        isMastery ? 0.92 : 0.85
      );
    }

    // 5. Course Mock Test Pages
    for (const course of publishedCourses) {
      if (course.slug === 'ccc') continue;
      pushEntry(`${baseUrl}/mock-test/${course.slug}`, DEFAULT_LASTMOD, 'weekly', 0.82);
    }

    // 6. Live Batch Pages
    for (const batch of batches) {
      pushEntry(`${baseUrl}/live-batches/${batch.id}`, DEFAULT_LASTMOD, 'daily', 0.85);
    }

    // 7. Blog Articles (real published dates for Google Discover & Search trust)
    for (const blog of blogs) {
      pushEntry(
        `${baseUrl}/blogs/${blog.slug}`,
        safeIsoDate(blog.publishedAt),
        'weekly',
        blog.featured ? 0.88 : 0.8
      );
    }

    // 8. Tutorial Overview Pages & All Topic Lessons (Cloud GitHub Manifest + Local Disk)
    const manifestMap = githubManifest as Record<
      string,
      { files?: Record<string, string> }
    >;
    const tutorialsDir = path.join(process.cwd(), 'public', 'content', 'tutorials');

    for (const tut of tutorials) {
      const tutLastMod = safeIsoDate(tut.updatedAt);
      pushEntry(`${baseUrl}/tutorials/${tut.slug}`, tutLastMod, 'weekly', 0.85);

      // 8a. Cloud-hosted GitHub manifest topics (Python, HTML5, CSS, JS, React, Excel, Word, etc.)
      const ghEntry = manifestMap[tut.slug];
      if (ghEntry && ghEntry.files) {
        const seenTopics = new Set<string>();
        for (const rawKey of Object.keys(ghEntry.files)) {
          const cleanSlug = rawKey.replace(/\.md$/, '').replace(/^\d+-/, '').toLowerCase();
          if (!cleanSlug || seenTopics.has(cleanSlug)) continue;
          seenTopics.add(cleanSlug);
          pushEntry(
            `${baseUrl}/tutorials/${tut.slug}/${cleanSlug}`,
            tutLastMod,
            'monthly',
            0.72
          );
        }
      }

      // 8b. Local disk tutorial topics (C, C++, SQL, Next.js, Node, Pandas, NumPy, Tableau, CCC, etc.)
      const tutDir = path.join(tutorialsDir, tut.slug);
      if (fs.existsSync(tutDir)) {
        const dirEntries = fs.readdirSync(tutDir, { withFileTypes: true });
        for (const entry of dirEntries) {
          if (entry.isFile() && entry.name.endsWith('.md')) {
            const topicSlug = entry.name.replace(/\.md$/, '').replace(/^\d+-/, '');
            pushEntry(
              `${baseUrl}/tutorials/${tut.slug}/${topicSlug}`,
              tutLastMod,
              'monthly',
              0.72
            );
          } else if (entry.isDirectory() && entry.name !== 'images') {
            const subFiles = fs.readdirSync(path.join(tutDir, entry.name));
            for (const subFile of subFiles) {
              if (subFile.endsWith('.md')) {
                const topicSlug = subFile.replace(/\.md$/, '').replace(/^\d+-/, '');
                pushEntry(
                  `${baseUrl}/tutorials/${tut.slug}/${topicSlug}`,
                  tutLastMod,
                  'monthly',
                  0.72
                );
              }
            }
          }
        }
      }
    }

    return entries;
  } catch (error) {
    console.error('Error generating dynamic routes for sitemap:', error);
    return entries;
  }
}
