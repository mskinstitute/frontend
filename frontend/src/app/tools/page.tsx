import { Metadata } from 'next';
import Link from 'next/link';
import {
  Keyboard,
  Code2,
  Database,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
  Terminal,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  FileCode
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer & Student Tools Hub | SQL Studio, DB Viewer, Code Playground | MSK Institute',
  description:
    'Explore free, high-performance in-browser tools built by MSK Institute Shikohabad. Including In-Browser SQL Studio, Web SQLite Database Viewer, Monaco Code Playground, and TypeQuest Typing Master.',
  keywords: [
    'MSK Tools',
    'Developer Tools Hub',
    'Online Code Playground',
    'In-Browser SQL Studio',
    'Database Viewer Online',
    'SQLite Web Viewer',
    'TypeQuest by MSK',
    'Online Code Editor Shikohabad',
    'Student Tools MSK Institute',
    'Er Sumit Kumar Tools',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/tools',
  },
  openGraph: {
    title: 'Developer & Student Tools Hub | MSK Institute',
    description:
      'Free in-browser developer and student learning tools: Web SQL Studio, SQLite Database Viewer, Monaco Multi-Language Code Playground, and TypeQuest Typing Master.',
    url: 'https://www.mskinstitute.in/tools',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Developer & Student Tools Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer & Student Tools Hub | MSK Institute',
    description:
      'Access free in-browser developer tools: SQL Studio, SQLite Database Viewer, Code Playground, and Typing Master.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: typeof Keyboard;
  badge: string;
  badgeColor: string;
  tags: string[];
  cta: string;
  featured?: boolean;
}

const TOOLS: ToolItem[] = [
  {
    id: 'db-viewer',
    title: 'MSK Database Viewer',
    subtitle: 'Instant In-Browser SQLite (.db, .sqlite, .sql) Inspector',
    description:
      'Open and inspect SQLite database files (.db, .sqlite, .sqlite3, .sql) 100% locally in your browser. Browse tables, filter rows, inspect schemas and primary keys, export to CSV/JSON, and bridge seamlessly to SQL Studio.',
    href: '/tools/db-viewer',
    icon: Database,
    badge: '100% Private WASM',
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    tags: ['SQLite 3 WASM', 'Zero Upload', '.db & .sql', 'Table Browser', 'CSV Export'],
    cta: 'Open DB Viewer',
    featured: true,
  },
  {
    id: 'sql-studio',
    title: 'MSK SQL Studio',
    subtitle: 'In-Browser SQL IDE & Web Database Workbench',
    description:
      'Full-featured online SQL workbench powered by Monaco Editor (VS Code). Write queries with autocomplete, view ER diagram cards, inspect query history, and download updated SQLite .db files with your changes.',
    href: '/tools/sql-studio',
    icon: Code2,
    badge: 'Monaco SQL IDE',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    tags: ['Monaco Editor', 'Ctrl + Enter', 'ER Cards', 'Query History', 'Save .db'],
    cta: 'Launch SQL Studio',
    featured: true,
  },
  {
    id: 'typequest',
    title: 'TypeQuest by MSK',
    subtitle: 'Touch Typing Academy & Developer Speed Lab',
    description:
      'Train your fingers from total beginner to expert speed. Features interactive home-row lessons, real Python, JavaScript, and C++ code syntax typing drills, an interactive virtual keyboard with finger guidance, and live WPM/accuracy tracking.',
    href: '/tools/typing',
    icon: Keyboard,
    badge: 'New & Advanced',
    badgeColor: 'bg-secondary/15 text-secondary border-secondary/30',
    tags: ['Touch Typing', 'Code Drills', 'Virtual Hands Guide', 'Live WPM', 'Audio Feedback'],
    cta: 'Launch TypeQuest',
    featured: true,
  },
  {
    id: 'playground',
    title: 'MSK Code Playground',
    subtitle: 'In-Browser Multi-Language IDE & Compiler',
    description:
      'Write, run, and test Python, HTML, CSS, JavaScript, and C++ directly in your browser. Powered by the industry-standard Monaco Editor (VS Code engine) and Pyodide WebAssembly for real-time local execution without server latency.',
    href: '/playground',
    icon: Terminal,
    badge: 'Interactive IDE',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    tags: ['Monaco Editor', 'Python Pyodide', 'Live HTML Preview', 'Instant Output'],
    cta: 'Open Playground',
    featured: true,
  },
  {
    id: 'shortcuts-hub',
    title: 'Software Shortcuts Hub',
    subtitle: 'Comprehensive Keyboard Cheatsheets & Reference Guides',
    description:
      'Master essential keyboard shortcuts for MS Excel, Word, PowerPoint, VS Code, Photoshop, Tally Prime, Windows 11, Chrome, Git, and Linux. Features fast search and instant key combinations.',
    href: '/shortcuts',
    icon: Keyboard,
    badge: '10+ Software Guides',
    badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    tags: ['Excel', 'VS Code', 'Photoshop', 'Tally', 'Windows 11', 'Office'],
    cta: 'Explore Shortcuts Hub',
    featured: true,
  }
];

export default function ToolsHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.mskinstitute.in/tools#collection',
        name: 'MSK Developer & Student Tools Hub',
        url: 'https://www.mskinstitute.in/tools',
        description:
          'Directory of free in-browser learning utilities and developer tools built by MSK Institute of Computer Technology.',
        publisher: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute of Computer Technology',
          url: 'https://www.mskinstitute.in',
        },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.mskinstitute.in/tools#itemlist',
        name: 'Free Online Developer and Student Tools',
        itemListElement: TOOLS.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.title,
          description: tool.description,
          url: `https://www.mskinstitute.in${tool.href}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.mskinstitute.in/tools#breadcrumb',
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
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-primary via-primary/95 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-secondary-light mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Next-Gen Developers
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            MSK Developer & Student <span className="text-secondary">Tools</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Free, professional in-browser learning utilities engineered by MSK Institute to sharpen your coding skills, typing dexterity, and technical productivity.
          </p>
        </div>
      </section>

      {/* Main Grid Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 p-6 sm:p-8 hover:shadow-xl group ${
                  tool.featured
                    ? 'border-secondary/30 dark:border-secondary/30 shadow-lg shadow-secondary/5'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-xs font-semibold text-secondary mt-0.5 mb-3 font-mono">
                    {tool.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Link Button */}
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-between w-full px-5 py-3 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-light dark:bg-secondary dark:hover:bg-secondary-light transition-all shadow-md group-hover:shadow-lg"
                  >
                    <span>{tool.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature Spotlight Bar */}
        <div className="mt-16 bg-gradient-to-r from-primary to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
              100% Free & Open For Everyone
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Want to request a new tool or student utility?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We continually develop tailored tools for our students in Shikohabad. If you need a specific compiler, converter, or practice suite, let our team know!
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-colors shadow-md whitespace-nowrap"
          >
            <span>Explore MSK Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
