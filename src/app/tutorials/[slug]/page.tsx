import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTutorials, fetchTutorialBySlug } from '@/services/api';
import TutorialOverviewClient from '@/components/TutorialOverviewClient';
import { constructMetadata } from '@/lib/seo';

export const revalidate = 3600; // Cache for 1 hour (ISR)

interface TutorialOverviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tutorials = await fetchTutorials();
  return tutorials.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TutorialOverviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchTutorialBySlug(slug);
  if (!data) {
    return constructMetadata({
      title: 'Tutorial Not Found',
      noIndex: true,
    });
  }

  const { tutorial } = data;
  return constructMetadata({
    title: tutorial.seo?.title || `${tutorial.title} Tutorial & Free Notes`,
    description: tutorial.seo?.description || tutorial.shortDescription,
    canonical: `/tutorials/${tutorial.slug}`,
    image: '/brand/og-tutorials.png',
    keywords: tutorial.seo?.keywords || [
      tutorial.title?.toLowerCase() || 'coding',
      `${tutorial.title} tutorial`,
      `${tutorial.title} notes`,
      'MSK Institute tutorials',
    ],
  });
}

export default async function TutorialOverviewPage({ params }: TutorialOverviewPageProps) {
  const { slug } = await params;
  const data = await fetchTutorialBySlug(slug);

  if (!data) {
    notFound();
  }

  const { tutorial, course } = data;
  const canonicalUrl = `https://www.mskinstitute.in/tutorials/${tutorial.slug}`;
  const isPythonTrack = tutorial.slug.startsWith('python-for-');
  const isDataAnalysisTrack =
    tutorial.slug === 'numpy-complete-course' ||
    tutorial.slug === 'pandas-complete-course' ||
    tutorial.slug === 'data-analysis--visualization--statistics' ||
    tutorial.slug === 'tableau-for-beginners' ||
    tutorial.slug === 'data-analysis--advanced-pandas--ml-basics' ||
    tutorial.slug.startsWith('power-bi-for-');
  const sortedChapters = [...(course.chapters || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonicalUrl}#resource`,
        name: `${tutorial.title} — Complete Free Tutorial`,
        description: tutorial.seo?.description || tutorial.shortDescription,
        url: canonicalUrl,
        image: 'https://www.mskinstitute.in/brand/og-tutorials.png',
        inLanguage: 'en-IN',
        educationalLevel: course.level || tutorial.badge || 'Beginner',
        isAccessibleForFree: true,
        learningResourceType: 'Tutorial',
        dateModified: tutorial.updatedAt || '2026-11-18',
        ...(course.learningOutcomes && course.learningOutcomes.length > 0
          ? { teaches: course.learningOutcomes.slice(0, 8) }
          : {}),
        ...(isPythonTrack
          ? {
              isPartOf: {
                '@type': 'Course',
                '@id': 'https://www.mskinstitute.in/courses/python-mastery#course',
                name: 'Python Mastery (Beginner to Advanced) - 3 Months',
                url: 'https://www.mskinstitute.in/courses/python-mastery',
              },
            }
          : isDataAnalysisTrack
          ? {
              isPartOf: {
                '@type': 'Course',
                '@id': 'https://www.mskinstitute.in/courses/data-analysis-mastery-combo-course--12-months#course',
                name: 'Data Analysis Mastery Combo Course - 12 Months',
                url: 'https://www.mskinstitute.in/courses/data-analysis-mastery-combo-course--12-months',
              },
            }
          : {}),
        ...(sortedChapters.length > 0
          ? {
              hasPart: sortedChapters.map((ch, idx) => ({
                '@type': 'LearningResource',
                position: idx + 1,
                name: ch.title,
                learningResourceType: 'Chapter',
              })),
            }
          : {}),
        author: {
          '@type': 'Person',
          name: 'Er. Sumit Kumar',
          jobTitle: 'Founder & Lead Technical Trainer',
          url: 'https://www.mskinstitute.in/about',
        },
        provider: {
          '@type': 'EducationalOrganization',
          '@id': 'https://www.mskinstitute.in/#organization',
          name: 'MSK Institute',
          url: 'https://www.mskinstitute.in',
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
            name: tutorial.title,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TutorialOverviewClient tutorial={tutorial} course={course} />
    </>
  );
}
