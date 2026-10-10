import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTutorials, fetchTutorialBySlug } from '@/services/api';
import TutorialOverviewClient from '@/components/TutorialOverviewClient';

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
  if (!data) return { title: 'Tutorial Not Found | MSK Institute' };

  const { tutorial } = data;
  return {
    title: tutorial.seo?.title || `${tutorial.title} Tutorial & Notes | MSK Institute`,
    description: tutorial.seo?.description || tutorial.shortDescription,
    keywords: tutorial.seo?.keywords || [tutorial.title?.toLowerCase() || 'computer', 'ccc', 'tutorial', 'nielit'],
    alternates: {
      canonical: `https://www.mskinstitute.in/tutorials/${tutorial.slug}`,
    },
    openGraph: {
      title: tutorial.seo?.title || tutorial.title,
      description: tutorial.seo?.description || tutorial.shortDescription,
      url: `https://www.mskinstitute.in/tutorials/${tutorial.slug}`,
    },
  };
}

export default async function TutorialOverviewPage({ params }: TutorialOverviewPageProps) {
  const { slug } = await params;
  const data = await fetchTutorialBySlug(slug);

  if (!data) {
    notFound();
  }

  return <TutorialOverviewClient tutorial={data.tutorial} course={data.course} />;
}
