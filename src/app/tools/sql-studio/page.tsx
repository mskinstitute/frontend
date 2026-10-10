import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Code2 } from 'lucide-react';
import SqlStudioApp from '@/features/sql-studio';
import SqlStudioSeoContent from '@/features/sql-studio/SqlStudioSeoContent';

export const metadata: Metadata = {
  title: 'Web SQL Studio & In-Browser Database IDE | Monaco Editor & SQLite | MSK Institute',
  description:
    'Full-featured online SQL workbench and database IDE. Write and run SQL queries in your browser with Monaco Editor (VS Code), schema explorer, ER cards, query history, and instant SQLite file export.',
  keywords: [
    'Online SQL Editor',
    'Online SQL Runner',
    'Web SQL Studio',
    'In-Browser Database IDE',
    'Monaco SQL Editor',
    'Run SQL Online Free',
    'SQLite Query Runner Online',
    'Free SQL Workbench Online',
    'Execute SQL Queries Online',
    'Learn SQL In Browser',
    'SQLite ER Diagram Generator',
    'Download SQLite DB File',
    'MySQL Online Runner',
    'MSK SQL Studio',
    'Database Tools Shikohabad',
    'Er Sumit Kumar SQL',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/tools/sql-studio',
  },
  openGraph: {
    title: 'Web SQL Studio & In-Browser Database IDE | Monaco Editor & SQLite | MSK Institute',
    description:
      'Write, test, and run SQL queries in-browser with Monaco Editor, live result grids, ER schema visualization, and downloadable SQLite files. 100% free and private.',
    url: 'https://www.mskinstitute.in/tools/sql-studio',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Online SQL Studio & Database IDE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web SQL Studio & Database Workbench | MSK Institute',
    description:
      'Execute SQL queries in your browser with Monaco Editor and WebAssembly SQLite. Export results, inspect schemas, and download updated .db files.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default function SqlStudioPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.mskinstitute.in/tools/sql-studio#webapp',
        name: 'MSK Web SQL Studio & Database Workbench',
        url: 'https://www.mskinstitute.in/tools/sql-studio',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Edge, Safari.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description:
          'Free in-browser SQL IDE powered by Monaco Editor and SQLite 3 WebAssembly. Features schema explorer, ER diagram cards, query history, and SQLite binary export.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute of Computer Technology',
          url: 'https://www.mskinstitute.in',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.mskinstitute.in/tools/sql-studio#breadcrumb',
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
            name: 'Tools',
            item: 'https://www.mskinstitute.in/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'SQL Studio',
            item: 'https://www.mskinstitute.in/tools/sql-studio',
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': 'https://www.mskinstitute.in/tools/sql-studio#howto',
        name: 'How to Run SQL Queries in Your Browser',
        description: 'Instructions on writing and executing SQL queries in the MSK In-Browser SQL Studio.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Load a Database',
            text: 'Choose a sample database or open any .db, .sqlite, or .sql file, or start with a blank database.',
            position: 1,
          },
          {
            '@type': 'HowToStep',
            name: 'Write Your SQL Query',
            text: 'Write SQL statements in the Monaco Editor. Use intelligent autocomplete and pre-built snippets.',
            position: 2,
          },
          {
            '@type': 'HowToStep',
            name: 'Execute and Analyze',
            text: 'Press Ctrl + Enter or click Run Query to see formatted results, schema ER cards, and execution metrics.',
            position: 3,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.mskinstitute.in/tools/sql-studio#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I export the updated SQLite database file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! After creating tables or inserting data, click Save .db to download the updated SQLite binary file directly to your disk.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is MSK SQL Studio compatible with MySQL syntax?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. MSK SQL Studio includes a smart SQL parser that normalizes MySQL constructs (AUTO_INCREMENT, # comments, table options) into SQLite WebAssembly.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I open a database from the MSK Database Viewer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Clicking "Edit in SQL Studio" in the MSK Database Viewer transfers your active database seamlessly via browser IndexedDB.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-900 bg-slate-950/90 px-4 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ol className="flex items-center gap-2 text-xs text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/tools" className="hover:text-white transition-colors">
                Tools
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-secondary font-semibold">SQL Studio</span>
            </li>
          </ol>

          <div className="flex items-center gap-3">
            <Link
              href="/tools/db-viewer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary-light transition-colors"
            >
              <span>Quick DB Viewer</span>
              <span>&rarr;</span>
            </Link>
            <span className="text-slate-800">|</span>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Tools</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col">
        <div className="w-full h-[80vh] min-h-[700px] flex flex-col mb-12">
          <Suspense
            fallback={
              <div className="w-full h-full min-h-[600px] bg-[#121316] rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                <span className="text-xs font-mono">Initializing Monaco SQL Studio...</span>
              </div>
            }
          >
            <SqlStudioApp />
          </Suspense>
        </div>

        {/* Crawlable SEO & Educational Content */}
        <SqlStudioSeoContent />
      </main>
    </div>
  );
}
