import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTutorials } from '@/services/api';
import { fetchTutorialTopic } from '@/lib/server-tutorial';
import TutorialReader from '@/components/TutorialReader';
import { constructMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour (ISR)

interface TutorialTopicPageProps {
  params: Promise<{ slug: string; topicSlug: string }>;
}

import githubManifest from '@/data/githubTutorialManifest.json';

export async function generateStaticParams() {
  const tutorials = await fetchTutorials();
  const paramsList: { slug: string; topicSlug: string }[] = [];

  for (const tut of tutorials) {
    const seen = new Set<string>();

    // 1. Cloud-hosted GitHub repository topics from manifest
    const manifest = githubManifest as Record<string, { files: Record<string, string> }>;
    const ghConfig = manifest[tut.slug];
    if (ghConfig && ghConfig.files) {
      for (const tSlug of Object.keys(ghConfig.files)) {
        // filter out numeric prefix versions like 01- or 05-
        const clean = tSlug.replace(/^\d+-/, '').toLowerCase();
        if (clean && !seen.has(clean)) {
          seen.add(clean);
          paramsList.push({
            slug: tut.slug,
            topicSlug: clean,
          });
        }
      }
    }

    // 2. Also scan local disk (supports both local-only courses and newly added local lessons for GitHub-backed courses)
    try {
      const dirPath = path.join(process.cwd(), 'public', 'content', 'tutorials', tut.slug);
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const cleanSlug = entry.name.replace(/\.md$/, '').replace(/^\d+-/, '').toLowerCase();
          if (cleanSlug && !seen.has(cleanSlug)) {
            seen.add(cleanSlug);
            paramsList.push({
              slug: tut.slug,
              topicSlug: cleanSlug,
            });
          }
        } else if (entry.isDirectory() && entry.name !== 'images') {
          const subFiles = await fs.readdir(path.join(dirPath, entry.name));
          for (const subFile of subFiles) {
            if (subFile.endsWith('.md')) {
              const cleanSlug = subFile.replace(/\.md$/, '').replace(/^\d+-/, '').toLowerCase();
              if (cleanSlug && !seen.has(cleanSlug)) {
                seen.add(cleanSlug);
                paramsList.push({
                  slug: tut.slug,
                  topicSlug: cleanSlug,
                });
              }
            }
          }
        }
      }
    } catch {
      // Local directory does not exist (expected for 100% GitHub-backed tutorials)
      if (seen.size === 0 && tut.slug === 'python-for-beginners') {
        paramsList.push({ slug: tut.slug, topicSlug: 'introduction-to-python' });
        paramsList.push({ slug: tut.slug, topicSlug: 'vscode-setup' });
      }
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: TutorialTopicPageProps): Promise<Metadata> {
  const { slug, topicSlug } = await params;
  const topicData = await fetchTutorialTopic(slug, topicSlug);
  if (!topicData) {
    return constructMetadata({ title: 'Lesson Not Found', noIndex: true });
  }

  const { frontmatter, tutorial } = topicData;
  const baseTitle = `${frontmatter.title} | ${tutorial.title} Tutorial`;
  const seoTitle = baseTitle.length <= 58 ? baseTitle : frontmatter.title;

  return constructMetadata({
    title: seoTitle,
    description: frontmatter.description,
    canonical: `/tutorials/${slug}/${topicSlug}`,
    image: '/brand/og-tutorials.png',
    type: 'article',
    publishedTime: frontmatter.lastUpdated || tutorial.updatedAt || '2026-10-01',
    modifiedTime: frontmatter.lastUpdated || tutorial.updatedAt || '2026-11-18',
    authors: ['Er. Sumit Kumar'],
    keywords: frontmatter.keywords || [
      tutorial.title?.toLowerCase() || 'code',
      'tutorial',
      frontmatter.slug,
      'MSK Institute',
    ],
  });
}

export default async function TutorialTopicPage({ params }: TutorialTopicPageProps) {
  const { slug, topicSlug } = await params;
  const topicData = await fetchTutorialTopic(slug, topicSlug);

  if (!topicData) {
    notFound();
  }

  const isPythonTrack = slug.startsWith('python-for-');
  const isDataAnalysisTrack =
    slug === 'numpy-complete-course' ||
    slug === 'pandas-complete-course' ||
    slug === 'data-analysis--visualization--statistics' ||
    slug === 'tableau-for-beginners' ||
    slug === 'data-analysis--advanced-pandas--ml-basics' ||
    slug.startsWith('power-bi-for-');
  const canonicalUrl = `https://www.mskinstitute.in/tutorials/${slug}/${topicSlug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        headline: `${topicData.frontmatter.title} — ${topicData.tutorial.title}`,
        description: topicData.frontmatter.description,
        image: 'https://www.mskinstitute.in/brand/og-tutorials.png',
        inLanguage: 'en-IN',
        proficiencyLevel: topicData.frontmatter.difficulty || 'Beginner',
        datePublished: topicData.frontmatter.lastUpdated || topicData.tutorial.updatedAt || '2026-10-01',
        dateModified: topicData.frontmatter.lastUpdated || topicData.tutorial.updatedAt || '2026-11-18',
        mainEntityOfPage: canonicalUrl,
        isPartOf: {
          '@type': 'LearningResource',
          '@id': `https://www.mskinstitute.in/tutorials/${slug}#resource`,
          name: topicData.tutorial.title,
          url: `https://www.mskinstitute.in/tutorials/${slug}`,
        },
        ...(isPythonTrack
          ? {
              about: {
                '@type': 'Course',
                '@id': 'https://www.mskinstitute.in/courses/python-mastery#course',
                name: 'Python Mastery (Beginner to Advanced) - 3 Months',
                url: 'https://www.mskinstitute.in/courses/python-mastery',
              },
            }
          : isDataAnalysisTrack
          ? {
              about: {
                '@type': 'Course',
                '@id': 'https://www.mskinstitute.in/courses/data-analysis-mastery-combo-course--12-months#course',
                name: 'Data Analysis Mastery Combo Course - 12 Months',
                url: 'https://www.mskinstitute.in/courses/data-analysis-mastery-combo-course--12-months',
              },
            }
          : {}),
        author: {
          '@type': 'Person',
          name: 'Er. Sumit Kumar',
          jobTitle: 'Founder & Lead Technical Trainer',
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
            name: 'Tutorials',
            item: 'https://www.mskinstitute.in/tutorials',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: topicData.tutorial.title,
            item: `https://www.mskinstitute.in/tutorials/${slug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: topicData.frontmatter.title,
            item: `https://www.mskinstitute.in/tutorials/${slug}/${topicSlug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <TutorialReader
        tutorial={topicData.tutorial}
        course={topicData.course}
        frontmatter={topicData.frontmatter}
        markdownContent={topicData.content}
        prevTopic={topicData.prevTopic}
        nextTopic={topicData.nextTopic}
      />
    </>
  );
}
