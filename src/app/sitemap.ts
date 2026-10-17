import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { fetchCourses, fetchBlogs, fetchTutorials, fetchLiveBatches } from '@/services/api';
import { getPublishedBranches } from '@/lib/branches';
import { getAllToolSlugs } from '@/data/shortcutsData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mskinstitute.in';

  // Base static routes - Canonical 200 OK routes only (excluding redirects like /notes)
  const routes = [
    '',
    '/book-demo',
    '/courses',
    '/learning-paths',
    '/projects',
    '/mock-test',
    '/mock-test/ccc',
    '/career-finder',
    '/locations',
    '/verify-certificate',
    '/study-material',
    '/careers',
    '/blogs',
    '/live',
    '/live-batches',
    '/tools',
    '/tools/typing',
    '/tools/db-viewer',
    '/tools/sql-studio',
    '/shortcuts',
    '/playground',
    '/contact',
    '/about',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route === '/book-demo' ? 0.95 : route === '/courses' || route === '/learning-paths' || route === '/mock-test' || route === '/mock-test/ccc' || route === '/career-finder' || route === '/live-batches' || route === '/locations' ? 0.9 : 0.8,
  }));

  try {
    const [courses, blogs, tutorials, batches, branches] = await Promise.all([
      fetchCourses(),
      fetchBlogs().catch(() => []),
      fetchTutorials().catch(() => []),
      fetchLiveBatches().catch(() => []),
      getPublishedBranches().catch(() => []),
    ]);

    const courseRoutes = courses
      .filter((course) => course.status === 'PUBLISH')
      .map((course) => ({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

    const mockTestRoutes = courses
      .filter((course) => course.status === 'PUBLISH' && course.slug !== 'ccc')
      .map((course) => ({
        url: `${baseUrl}/mock-test/${course.slug}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

    const batchRoutes = batches.map((batch) => ({
      url: `${baseUrl}/live-batches/${batch.id}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    const tutorialRoutes = tutorials.map((tut) => ({
      url: `${baseUrl}/tutorials/${tut.slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const tutorialTopicRoutes: MetadataRoute.Sitemap = [];
    const tutorialsDir = path.join(process.cwd(), 'public', 'content', 'tutorials');
    if (fs.existsSync(tutorialsDir)) {
      for (const tut of tutorials) {
        const tutDir = path.join(tutorialsDir, tut.slug);
        if (fs.existsSync(tutDir)) {
          const entries = fs.readdirSync(tutDir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith('.md')) {
              const topicSlug = entry.name.replace(/\.md$/, '');
              tutorialTopicRoutes.push({
                url: `${baseUrl}/tutorials/${tut.slug}/${topicSlug}`,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'monthly' as const,
                priority: 0.7,
              });
            } else if (entry.isDirectory() && entry.name !== 'images') {
              const subFiles = fs.readdirSync(path.join(tutDir, entry.name));
              for (const subFile of subFiles) {
                if (subFile.endsWith('.md')) {
                  const topicSlug = subFile.replace(/\.md$/, '').replace(/^\d+-/, '');
                  tutorialTopicRoutes.push({
                    url: `${baseUrl}/tutorials/${tut.slug}/${topicSlug}`,
                    lastModified: new Date().toISOString().split('T')[0],
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                  });
                }
              }
            }
          }
        }
      }
    }

    const branchRoutes = branches.map((branch) => ({
      url: `${baseUrl}/locations/${branch.slug}`,
      lastModified: branch.updatedAt || new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as const,
      priority: branch.isHeadquarters ? 0.9 : 0.8,
    }));

    const shortcutRoutes = getAllToolSlugs().map((slug) => ({
      url: `${baseUrl}/shortcuts/${slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    return [
      ...routes,
      ...shortcutRoutes,
      ...branchRoutes,
      ...courseRoutes,
      ...mockTestRoutes,
      ...batchRoutes,
      ...blogRoutes,
      ...tutorialRoutes,
      ...tutorialTopicRoutes,
    ];
  } catch (error) {
    console.error('Error generating dynamic routes for sitemap:', error);
    return routes;
  }
}
