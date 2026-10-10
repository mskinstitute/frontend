import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Terminal, Code2, Database } from 'lucide-react';
import PlaygroundApp from '@/features/playground';
import PlaygroundSeoContent from '@/features/playground/PlaygroundSeoContent';

export const metadata: Metadata = {
  title: 'Online Code Playground & Multi-Language Compiler | Python, Web, C++, SQL | MSK Institute',
  description:
    'Free online code playground and multi-language compiler. Write and run Python (Pyodide), HTML/CSS/JS live preview, C, C++, and MySQL in your browser with Monaco Editor (VS Code), zero installation, focus mode, and 12-hour persistence.',
  keywords: [
    'Online Code Playground',
    'Online Python Compiler',
    'Interactive Code Playground',
    'Monaco Editor Online',
    'Web Development Sandbox',
    'Run Python In Browser Free',
    'Pyodide Python Runner',
    'HTML CSS JS Live Preview',
    'C C++ Online Compiler',
    'In-Browser MySQL Editor',
    'Free Coding Lab Online',
    'MSK Code Playground',
    'Shikohabad Coding Academy',
    'Er Sumit Kumar Coding',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/playground',
  },
  openGraph: {
    title: 'Online Code Playground & Multi-Language Compiler | MSK Institute',
    description:
      'Run Python, Web, C++, and MySQL code directly in your browser with Monaco Editor and WebAssembly. Fast, interactive, zero installation, and 100% free.',
    url: 'https://www.mskinstitute.in/playground',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Interactive Online Code Playground & Multi-Language Compiler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Code Playground & Multi-Language Compiler | MSK Institute',
    description:
      'Execute Python, Web, C++, and SQL queries in your browser with Monaco Editor and WebAssembly. Zero setup, real-time output.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default function PlaygroundPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.mskinstitute.in/playground#webapp',
        name: 'MSK Online Code Playground & Multi-Language Compiler',
        url: 'https://www.mskinstitute.in/playground',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Edge, Safari.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description:
          'Free in-browser multi-language IDE and compiler supporting Python 3 (Pyodide), HTML/CSS/JavaScript live preview, C, C++, and MySQL with Monaco Editor and local persistence.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute of Computer Technology',
          url: 'https://www.mskinstitute.in',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.mskinstitute.in/playground#breadcrumb',
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
            name: 'Playground',
            item: 'https://www.mskinstitute.in/playground',
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': 'https://www.mskinstitute.in/playground#howto',
        name: 'How to Write and Run Code in the Online Playground',
        description: 'Step-by-step instructions to compile and test code in Python, Web languages, C++, or SQL using MSK Code Playground.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Select Language or File',
            text: 'Choose your desired programming language from the sidebar or tab bar (Python, Web, C++, SQL).',
            position: 1,
          },
          {
            '@type': 'HowToStep',
            name: 'Write Your Code',
            text: 'Write clean code in the Monaco Editor using VS Code keyboard shortcuts, autocompletion, and multi-file support.',
            position: 2,
          },
          {
            '@type': 'HowToStep',
            name: 'Run and Analyze',
            text: 'Press Shift + Enter or click Run Code to execute in browser WebAssembly and see instant console output or live web preview.',
            position: 3,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.mskinstitute.in/playground#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I run Python without installing Python on my PC?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! The playground runs Pyodide, a WebAssembly compilation of Python 3. It executes natively in Chrome, Edge, Firefox, and Safari without installing any software or Python interpreters.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will my code be saved if I refresh or close the tab?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. MSK Code Playground includes a 12-hour persistence engine that stores your active files and editor state in your browser local IndexedDB and localStorage cache.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I preview HTML, CSS, and JavaScript websites?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Selecting web mode renders an interactive sandboxed browser preview window with live CSS rendering and JavaScript DOM execution.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I practice relational SQL queries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can run SQL queries directly inside Playground, or for advanced database schema exploration, ER diagrams, and SQLite binary downloads, switch to our dedicated MSK SQL Studio.',
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
              <span className="text-secondary font-semibold">Playground</span>
            </li>
          </ol>

          <div className="flex items-center gap-3">
            <Link
              href="/tools/sql-studio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary-light transition-colors"
            >
              <span>SQL Studio</span>
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
        <div className="flex-1 w-full h-[75vh] min-h-[600px] flex flex-col mb-12">
          <Suspense
            fallback={
              <div className="w-full h-full min-h-[600px] bg-[#1e1e1e] rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-slate-400">Initializing MSK Code Playground...</span>
              </div>
            }
          >
            <PlaygroundApp />
          </Suspense>
        </div>

        {/* Crawlable SEO & Knowledge Base Content */}
        <PlaygroundSeoContent />
      </main>
    </div>
  );
}
