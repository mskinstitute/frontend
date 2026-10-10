import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Database, ShieldCheck } from 'lucide-react';
import DbViewerApp from '@/features/db-viewer';
import DbViewerSeoContent from '@/features/db-viewer/DbViewerSeoContent';

export const metadata: Metadata = {
  title: 'Free Online SQLite & Database Viewer (.db, .sqlite, .sql) | MSK Institute',
  description:
    'Open, inspect, and view SQLite (.db, .sqlite, .sqlite3) and SQL dump files directly in your web browser. 100% private, client-side table browser, schema inspector, and CSV exporter with instant SQL Studio bridge.',
  keywords: [
    'Online SQLite Viewer',
    'Open .db File Online',
    'Open SQLite File Online Free',
    'View SQLite File in Browser',
    'Free Database Viewer Online',
    'SQLite Table Inspector',
    'SQLite to CSV Converter Online',
    'View SQL File Online',
    'In-Browser SQLite Browser',
    'Open SQLite3 Database Online',
    'SQLite GUI Online No Install',
    'SQLite Schema Viewer',
    'MSK Database Tools',
    'Database Viewer Shikohabad',
    'Er Sumit Kumar Database Tools',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/tools/db-viewer',
  },
  openGraph: {
    title: 'Free Online SQLite & Database Viewer (.db, .sqlite, .sql) | MSK Institute',
    description:
      'Inspect SQLite database files (.db, .sqlite, .sql) 100% locally in your browser. View tables, check schemas, export CSVs, and edit in SQL Studio.',
    url: 'https://www.mskinstitute.in/tools/db-viewer',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute In-Browser SQLite Database Viewer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online SQLite & Database Viewer (.db, .sqlite) | MSK Institute',
    description:
      'Open and browse SQLite (.db, .sqlite, .sql) database files instantly in your browser with zero installation. 100% client-side privacy.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default function DbViewerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.mskinstitute.in/tools/db-viewer#webapp',
        name: 'MSK In-Browser Database Viewer',
        url: 'https://www.mskinstitute.in/tools/db-viewer',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Edge, Safari.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description:
          'Free in-browser SQLite database viewer supporting .db, .sqlite, .sqlite3, and .sql files with 100% client-side WebAssembly execution.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute of Computer Technology',
          url: 'https://www.mskinstitute.in',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.mskinstitute.in/tools/db-viewer#breadcrumb',
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
            name: 'Database Viewer',
            item: 'https://www.mskinstitute.in/tools/db-viewer',
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': 'https://www.mskinstitute.in/tools/db-viewer#howto',
        name: 'How to View SQLite Database (.db) Files Online',
        description: 'Step-by-step instructions to open and inspect SQLite database files in your web browser without installing desktop software.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Drag and Drop File',
            text: 'Drop any .db, .sqlite, .sqlite3, or .sql file into the MSK Database Viewer dropzone.',
            position: 1,
          },
          {
            '@type': 'HowToStep',
            name: 'Select Table and Browse',
            text: 'Select any table from the sidebar to view rows, filter records, and check column constraints.',
            position: 2,
          },
          {
            '@type': 'HowToStep',
            name: 'Export or Edit in SQL Studio',
            text: 'Export table data to CSV/JSON, or click Edit in SQL Studio to run complex SQL queries.',
            position: 3,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.mskinstitute.in/tools/db-viewer#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is my database file uploaded to any remote server?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. The MSK Database Viewer executes 100% locally in your web browser using WebAssembly. Your files and data never leave your computer.',
            },
          },
          {
            '@type': 'Question',
            name: 'What file formats are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Standard binary SQLite files (.db, .sqlite, .sqlite3) and plain SQL script files (.sql) containing CREATE TABLE and INSERT statements.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I edit the database or execute custom queries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Click the "Edit in SQL Studio" button to instantly transfer your loaded database into the MSK SQL Studio with a full Monaco query editor.',
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
              <span className="text-secondary font-semibold">Database Viewer</span>
            </li>
          </ol>

          <div className="flex items-center gap-3">
            <Link
              href="/tools/sql-studio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary-light transition-colors"
            >
              <span>Full SQL Studio</span>
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col">
        <div className="w-full h-[80vh] min-h-[700px] flex flex-col mb-12">
          <Suspense
            fallback={
              <div className="w-full h-full min-h-[600px] bg-[#121316] rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                <span className="text-xs font-mono">Initializing WebAssembly SQLite Viewer...</span>
              </div>
            }
          >
            <DbViewerApp />
          </Suspense>
        </div>

        {/* Crawlable SEO & Knowledge Base Content */}
        <DbViewerSeoContent />
      </main>
    </div>
  );
}
