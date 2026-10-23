import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTutorials } from '@/services/api';
import { fetchTutorialTopic } from '@/lib/server-tutorial';
import TutorialReader from '@/components/TutorialReader';

export const revalidate = 3600; // Cache for 1 hour (ISR)

interface TutorialTopicPageProps {
  params: Promise<{ slug: string; topicSlug: string }>;
}

import githubManifest from '@/data/githubTutorialManifest.json';

export async function generateStaticParams() {
  const tutorials = await fetchTutorials();
  const paramsList: { slug: string; topicSlug: string }[] = [];

  for (const tut of tutorials) {
    // 1. If tutorial is backed by GitHub repository in manifest, use mapped slugs
    const manifest = githubManifest as Record<string, { files: Record<string, string> }>;
    const ghConfig = manifest[tut.slug];
    if (ghConfig && ghConfig.files) {
      const seen = new Set<string>();
      for (const tSlug of Object.keys(ghConfig.files)) {
        // filter out numeric prefix versions like 01- or 05-
        const clean = tSlug.replace(/^\d+-/, '').toLowerCase();
        if (!seen.has(clean)) {
          seen.add(clean);
          paramsList.push({
            slug: tut.slug,
            topicSlug: clean,
          });
        }
      }
      continue;
    }

    // 2. Otherwise scan local disk
    try {
      const dirPath = path.join(process.cwd(), 'public', 'content', 'tutorials', tut.slug);
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          paramsList.push({
            slug: tut.slug,
            topicSlug: entry.name.replace(/\.md$/, ''),
          });
        } else if (entry.isDirectory() && entry.name !== 'images') {
          const subFiles = await fs.readdir(path.join(dirPath, entry.name));
          for (const subFile of subFiles) {
            if (subFile.endsWith('.md')) {
              const cleanSlug = subFile.replace(/\.md$/, '').replace(/^\d+-/, '');
              paramsList.push({
                slug: tut.slug,
                topicSlug: cleanSlug,
              });
            }
          }
        }
      }
    } catch {
      // Fallback defaults if directory doesn't exist
      if (tut.slug === 'python-for-beginners') {
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
  if (!topicData) return { title: 'Lesson Not Found | MSK Institute' };

  const { frontmatter, tutorial } = topicData;
  return {
    title: `${frontmatter.title} - ${tutorial.title} Tutorial | MSK Notes`,
    description: frontmatter.description || `Read ${frontmatter.title} lesson with code examples, explanations, and practice quiz at MSK Institute.`,
    keywords: frontmatter.keywords || [tutorial.title?.toLowerCase() || 'code', 'tutorial', frontmatter.slug],
    alternates: {
      canonical: `https://www.mskinstitute.in/tutorials/${slug}/${topicSlug}`,
    },
    openGraph: {
      title: `${frontmatter.title} | ${tutorial.title} Tutorial`,
      description: frontmatter.description,
      url: `https://www.mskinstitute.in/tutorials/${slug}/${topicSlug}`,
    },
  };
}

export default async function TutorialTopicPage({ params }: TutorialTopicPageProps) {
  const { slug, topicSlug } = await params;
  const topicData = await fetchTutorialTopic(slug, topicSlug);

  if (!topicData) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: `${topicData.frontmatter.title} - ${topicData.tutorial.title}`,
        description: topicData.frontmatter.description || `Learn ${topicData.frontmatter.title} with practical examples and code tutorials at MSK Institute.`,
        inLanguage: 'en-IN',
        mainEntityOfPage: `https://www.mskinstitute.in/tutorials/${slug}/${topicSlug}`,
        author: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute',
          url: 'https://www.mskinstitute.in',
        },
        publisher: {
          '@type': 'EducationalOrganization',
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
