import { Metadata } from 'next';
import { fetchStudyMaterials, fetchTutorials } from '@/services/api';
import StudyMaterialClient from '@/components/StudyMaterialClient';
import { constructMetadata } from '@/lib/seo';
import { StudyMaterial, TutorialItem } from '@/types';

export const revalidate = 3600; // Cache for 1 hour (ISR)

export const metadata: Metadata = constructMetadata({
  title: 'Study Material Hub: Free Tutorials, Cheatsheets & PDF Guides',
  description:
    'Access free interactive coding tutorials, quick cheatsheets, downloadable PDF revision guides, and developer handbooks for Python, Web Development, SQL, NIELIT CCC, and MS Office at MSK Institute.',
  canonical: '/study-material',
  image: '/brand/og-tutorials.png',
  keywords: [
    'Free Coding Study Material',
    'Python PDF Notes Free Download',
    'NIELIT CCC Revision Notes PDF',
    'HTML CSS JavaScript Cheatsheets',
    'MS Excel Formulas PDF Guide',
    'MSK Institute Study Material',
  ],
});

export default async function StudyMaterialPage() {
  let materials: StudyMaterial[] = [];
  let tutorials: TutorialItem[] = [];
  let errorMsg = '';

  try {
    const [matRes, tutRes] = await Promise.all([
      fetchStudyMaterials(),
      fetchTutorials(),
    ]);
    materials = matRes || [];
    tutorials = tutRes || [];
  } catch (error) {
    console.error('Failed to load study materials:', error);
    errorMsg = 'Unable to load study materials repository. Please try again later.';
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.mskinstitute.in/study-material#webpage',
        url: 'https://www.mskinstitute.in/study-material',
        name: 'Study Material Hub: Tutorials, Cheatsheets & PDF Guides | MSK Institute',
        description:
          'Curated coding tutorials, PDF revision notes, cheatsheets, and computer exam handbooks authored by MSK Institute.',
        isPartOf: { '@id': 'https://www.mskinstitute.in/#website' },
      },
      {
        '@type': 'ItemList',
        name: 'MSK Institute Free Study Guides & Tutorials',
        numberOfItems: tutorials.length,
        itemListElement: tutorials.slice(0, 30).map((tut, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: tut.title,
          url: `https://www.mskinstitute.in/tutorials/${tut.slug}`,
        })),
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
            name: 'Study Material',
            item: 'https://www.mskinstitute.in/study-material',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
            Student Resources Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
            Study Material Hub
          </h1>
          <p className="text-text-muted text-sm sm:text-lg leading-relaxed">
            Enhance your offline lab lectures and live online classes with our curated tutorials, cheatsheets, PDF revision notes, and comprehensive handbooks.
          </p>
        </div>

        {errorMsg && materials.length === 0 && tutorials.length === 0 ? (
          <div className="text-center py-12 bg-red-50 text-red-700 border border-red-200 rounded-xl">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        ) : (
          <StudyMaterialClient initialMaterials={materials} tutorials={tutorials} />
        )}
      </div>
    </>
  );
}
