import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TypeQuestApp from '@/features/typequest';
import LocalToolCtaBanner from '@/components/LocalToolCtaBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'TypeQuest by MSK - Free Online Touch Typing & Code Typing Master',
  description:
    'Master touch typing from beginner to expert with TypeQuest by MSK. Free online typing speed test, home-row academy, Python & JavaScript code typing drills, live WPM tracking, and downloadable speed certificates.',
  canonical: '/tools/typing',
  image: '/brand/og-banner.png',
  keywords: [
    'Typing Master Online Free',
    'Touch Typing Practice Online',
    'Code Typing Test Python JavaScript',
    'Developer Typing Speed Test',
    'MSK Institute Typing Tool',
    'TypeQuest by MSK',
    'Free Typing Test India WPM',
    'SSC CPCT UPSSSC Typing Practice',
  ],
});

export default function TypingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'TypeQuest by MSK Institute',
        url: 'https://www.mskinstitute.in/tools/typing',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description:
          'Interactive touch typing tutor and programming code speed test featuring WPM accuracy tracking, virtual keyboard finger guides, and Python/JavaScript syntax drills.',
        creator: {
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
            name: 'Tools',
            item: 'https://www.mskinstitute.in/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'TypeQuest Typing Master',
            item: 'https://www.mskinstitute.in/tools/typing',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumbs & Back Navigation */}
      <div className="border-b border-slate-900 bg-slate-950/90 px-4 py-3 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-secondary font-semibold">TypeQuest</span>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>

      {/* Main Typing Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="w-full min-h-[600px] bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <span className="text-xs font-mono">Initializing TypeQuest Engine...</span>
            </div>
          }
        >
          <TypeQuestApp />
        </Suspense>

        {/* Local Offline & Hybrid Demo Admissions Banner */}
        <LocalToolCtaBanner toolName="TypeQuest Typing Lab" variant="dark" className="mt-8" />

        {/* Indexable SEO Guide Section for Organic Search & AI Answer Engines */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-4 text-slate-300">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            TypeQuest by MSK: Free Online Touch Typing &amp; Code Speed Trainer
          </h1>
          <p className="text-sm leading-relaxed">
            TypeQuest is a free browser-based typing master built by MSK Institute for government exam aspirants (UPSSSC, SSC, High Court Clerk, CPCT), office learners, and software developers. Practice home-row finger placement, measure real-time Words Per Minute (WPM) and accuracy, and train on real Python and JavaScript code syntax without installing any software.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-1">
              <h2 className="font-bold text-white text-sm">Government Exam Typing</h2>
              <p className="text-slate-400">Build consistent 35–45+ WPM speed with 95%+ accuracy for clerk, typist, and computer operator skill tests.</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-1">
              <h2 className="font-bold text-white text-sm">Developer Code Typing</h2>
              <p className="text-slate-400">Master brackets, semicolons, indentation, and symbols across Python, HTML, CSS, and JavaScript snippets.</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-1">
              <h2 className="font-bold text-white text-sm">Pair With Live Courses</h2>
              <p className="text-slate-400">
                Explore our{' '}
                <Link href="/courses/ccc" className="text-secondary hover:underline">
                  NIELIT CCC
                </Link>
                ,{' '}
                <Link href="/courses/adca" className="text-secondary hover:underline">
                  ADCA Diploma
                </Link>
                , and{' '}
                <Link href="/live-batches" className="text-secondary hover:underline">
                  Live Online Batches
                </Link>{' '}
                in Hindi &amp; English.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
