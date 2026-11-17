import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Code2, ArrowRight, Sparkles, Terminal, Layers, Globe } from 'lucide-react';
import { fetchTutorials } from '@/services/api';
import { constructMetadata } from '@/lib/seo';
import { TutorialItem } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = constructMetadata({
  title: 'Free Coding Tutorials & Notes: Python, Web Dev, SQL, Excel & CCC',
  description:
    'Explore 1,600+ free interactive coding tutorials and structured notes for Python, HTML5, CSS3, JavaScript, React, Next.js, Node.js, SQL, Data Analytics, MS Excel, C/C++, and NIELIT CCC by Er. Sumit Kumar.',
  canonical: '/tutorials',
  image: '/brand/og-tutorials.png',
  keywords: [
    'Free Coding Tutorials',
    'Python Tutorial for Beginners',
    'HTML5 CSS JavaScript Tutorial',
    'SQL MySQL Tutorial',
    'MS Excel Tutorial Hindi English',
    'NIELIT CCC Notes Free',
    'React Nextjs Tutorial India',
    'Data Analytics Pandas NumPy Tutorial',
    'MSK Institute Tutorials',
  ],
});

interface CategoryBucket {
  id: string;
  title: string;
  description: string;
  match: (t: TutorialItem) => boolean;
}

const CATEGORIES: CategoryBucket[] = [
  {
    id: 'python-programming',
    title: 'Python, C, C++ & Core Programming',
    description: 'Step-by-step programming fundamentals, OOP, DSA, and backend frameworks.',
    match: (t) =>
      /python|c-programming|cpp|dsa|flask|django/i.test(`${t.slug} ${t.title}`),
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    description: 'Modern frontend & backend guides covering HTML5, CSS, Tailwind, JS, React, Node.js, and Next.js.',
    match: (t) =>
      /html|css|tailwind|javascript|react|node|next|bootstrap|git|markdown/i.test(
        `${t.slug} ${t.title}`
      ),
  },
  {
    id: 'data-databases',
    title: 'SQL, Databases & Data Analytics',
    description: 'Practical guides for SQL, MongoDB, NumPy, Pandas, Power BI, and Tableau.',
    match: (t) =>
      /sql|mongo|data-analysis|numpy|pandas|power-bi|tableau/i.test(
        `${t.slug} ${t.title}`
      ),
  },
  {
    id: 'office-govt',
    title: 'MS Office, Excel & NIELIT CCC',
    description: 'Career & government exam computer notes for MS Excel, Word, PowerPoint, and CCC.',
    match: (t) => /excel|word|powerpoint|ccc|office/i.test(`${t.slug} ${t.title}`),
  },
];

export default async function TutorialsHubPage() {
  const tutorials = await fetchTutorials().catch(() => [] as TutorialItem[]);
  const totalLessons = tutorials.reduce((sum, t) => sum + (t.lessonsCount || 0), 0);

  const assigned = new Set<string>();
  const grouped = CATEGORIES.map((cat) => {
    const items = tutorials.filter((t) => {
      if (assigned.has(t.slug)) return false;
      if (cat.match(t)) {
        assigned.add(t.slug);
        return true;
      }
      return false;
    });
    return { ...cat, items };
  });

  const otherItems = tutorials.filter((t) => !assigned.has(t.slug));
  if (otherItems.length > 0) {
    grouped.push({
      id: 'more-tutorials',
      title: 'More Technical Guides',
      description: 'Additional structured documentation and practice notes.',
      match: () => true,
      items: otherItems,
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.mskinstitute.in/tutorials#webpage',
        url: 'https://www.mskinstitute.in/tutorials',
        name: 'Free Coding Tutorials & Technical Notes | MSK Institute',
        description:
          'Comprehensive library of free programming tutorials in Python, Web Development, SQL, Data Analytics, MS Office, and NIELIT CCC authored by MSK Institute.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': 'https://www.mskinstitute.in/#website' },
        publisher: {
          '@type': 'EducationalOrganization',
          '@id': 'https://www.mskinstitute.in/#organization',
          name: 'MSK Institute',
          url: 'https://www.mskinstitute.in',
        },
      },
      {
        '@type': 'ItemList',
        name: 'MSK Institute Free Tutorials Directory',
        numberOfItems: tutorials.length,
        itemListElement: tutorials.map((tut, index) => ({
          '@type': 'ListItem',
          position: index + 1,
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
            name: 'Tutorials',
            item: 'https://www.mskinstitute.in/tutorials',
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

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-light text-white py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <nav aria-label="Breadcrumb" className="text-xs text-slate-300 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-secondary-light font-semibold">Tutorials</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-secondary-light text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Free Coding Documentation Hub
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Free Interactive Coding &amp; Computer Tutorials
              </h1>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Master Python, Full-Stack Web Development, SQL, Data Analytics, MS Excel, C/C++, and NIELIT CCC through{' '}
                <strong className="text-white">{tutorials.length} complete tracks</strong> and{' '}
                <strong className="text-white">{totalLessons > 0 ? `${totalLessons}+` : '1,600+'} structured lessons</strong>{' '}
                designed by Er. Sumit Kumar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                Join Live Classes (Hindi &amp; English)
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Practice in Code Playground
              </Link>
              <Link
                href="/mock-test"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors"
              >
                <Layers className="w-4 h-4" />
                Take Free Mock Tests
              </Link>
            </div>
          </div>
        </section>

        {/* Categorized Tutorial Directory */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
          {grouped
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <section key={group.id} id={group.id} className="space-y-6">
                <div className="border-b border-border-subtle pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {group.title}
                  </h2>
                  <p className="text-text-muted text-sm sm:text-base mt-1">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((tut) => (
                    <Link
                      key={tut.slug}
                      href={`/tutorials/${tut.slug}`}
                      className="group bg-surface hover:bg-white border border-border-subtle hover:border-secondary/60 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold">
                            <BookOpen className="w-3.5 h-3.5 text-secondary" />
                            {tut.lessonsCount ? `${tut.lessonsCount} Lessons` : 'Complete Guide'}
                          </span>
                          {tut.badge && (
                            <span className="text-[11px] font-bold uppercase tracking-wide text-secondary">
                              {tut.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                          {tut.title}
                        </h3>

                        <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                          {tut.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-xs font-bold text-primary group-hover:text-secondary">
                        <span className="inline-flex items-center gap-1.5">
                          <Code2 className="w-4 h-4" />
                          Start Reading Free
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

          {/* Live Mentorship CTA */}
          <section className="rounded-3xl bg-primary text-white p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Need Live Mentor Support in Hindi or English?
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Join MSK Institute&apos;s practical offline computer labs in Shikohabad or attend interactive live online classes from anywhere in India or worldwide (UAE, UK, USA, Canada) with Er. Sumit Kumar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/book-demo"
                className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-light text-white font-bold text-sm transition-colors"
              >
                Book Free 3-Day Demo
              </Link>
              <Link
                href="/live-batches"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                View Live Batches
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

