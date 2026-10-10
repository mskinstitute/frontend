import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs } from '@/data/shortcutsData';
import ShortcutToolClient from './ShortcutToolClient';

interface PageProps {
  params: Promise<{
    tool: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({
    tool: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.tool);

  if (!tool) {
    return {
      title: 'Shortcuts Not Found | MSK Institute',
    };
  }

  const allShortcutsCount = tool.categories.reduce(
    (acc, cat) => acc + cat.shortcuts.length,
    0
  );

  const title = `${tool.name} Keyboard Shortcuts Cheatsheet (${allShortcutsCount}+ Keys) | MSK Institute`;
  const description = `Complete ${tool.name} keyboard shortcuts guide with fast search and key combinations. Master ${tool.shortName} fast at MSK Institute Shikohabad.`;

  return {
    title,
    description,
    keywords: [
      `${tool.name} keyboard shortcuts`,
      `${tool.shortName} shortcut keys`,
      `${tool.name} shortcuts list`,
      `${tool.shortName} cheatsheet`,
      `Learn ${tool.shortName} keys MSK Institute`,
      'computer shortcuts Shikohabad',
      ...tool.tags,
    ],
    alternates: {
      canonical: `https://www.mskinstitute.in/shortcuts/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.mskinstitute.in/shortcuts/${tool.slug}`,
      siteName: 'MSK Institute',
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: 'https://www.mskinstitute.in/logo.jpg',
          width: 1200,
          height: 630,
          alt: `${tool.name} Keyboard Shortcuts Cheatsheet`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.mskinstitute.in/logo.jpg'],
    },
  };
}

export default async function ToolShortcutsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.tool);

  if (!tool) {
    notFound();
  }

  // Generate FAQ Schema for Search Engines
  const schemaShortcuts = tool.categories.flatMap((cat) => cat.shortcuts).slice(0, 15);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schemaShortcuts.map((sc) => ({
      '@type': 'Question',
      name: `What is the shortcut for ${sc.title} in ${tool.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `In ${tool.name}, the keyboard shortcut for ${sc.title} is ${sc.keys.join(
          ' + '
        )}. ${sc.description}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ShortcutToolClient tool={tool} />
    </>
  );
}
