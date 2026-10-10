import { Metadata } from 'next';
import { fetchCourses } from '@/services/api';
import MockTestHubClient from '@/components/MockTestHubClient';
import { constructMetadata } from '@/lib/seo';
import { Award, BookOpen, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // ISR cache for 1 hour

export const metadata: Metadata = constructMetadata({
  title: 'Free Online Mock Tests & Skill Assessments 2026 | MSK Institute',
  description: 'Attempt free online practice mock tests for CCC, Python, Full-Stack Web Development, ADCA, and SQL. Real-time timer, instant digital scorecard, and WhatsApp sharing.',
  canonical: '/mock-test',
  keywords: [
    'Online Mock Tests Shikohabad',
    'Free CCC Mock Test 2026',
    'Python Practice Questions',
    'ADCA Exam Test Online',
    'Web Development Quiz',
    'Computer Center Mock Test',
    'MSK Institute Exam Simulator',
  ],
});

export default async function MockTestHubPage() {
  const courses = await fetchCourses().catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.mskinstitute.in/mock-test#webpage',
        'url': 'https://www.mskinstitute.in/mock-test',
        'name': 'Free Online Mock Tests & Skill Assessments 2026 | MSK Institute',
        'description': 'Attempt free online practice mock tests for CCC, Python, Full-Stack Web Development, ADCA, and SQL. Instant scorecard and grading.',
        'isPartOf': {
          '@type': 'WebSite',
          '@id': 'https://www.mskinstitute.in/#website',
          'url': 'https://www.mskinstitute.in',
          'name': 'MSK Institute'
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          '@id': 'https://www.mskinstitute.in/mock-test#breadcrumb',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://www.mskinstitute.in'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Mock Tests',
              'item': 'https://www.mskinstitute.in/mock-test'
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Hub Hero Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-secondary/10 text-secondary">
            <Award className="w-3.5 h-3.5" />
            100% Free Online Assessments
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Free Online <span className="text-secondary">Mock Tests</span> & Skill Quizzes
          </h1>
          <p className="text-text-muted text-sm sm:text-base lg:text-lg leading-relaxed">
            Practice real exam questions with countdown timers, instant digital scorecards, and verifiable grades. Built for CCC candidates, programming students, and job seekers.
          </p>

          {/* Quick Hub Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5 text-secondary">
              <Clock className="w-4 h-4" />
              Real Timed Simulation
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              Official NIELIT & IT Pattern
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <Sparkles className="w-4 h-4 text-amber-600" />
              WhatsApp Shareable Scorecards
            </span>
          </div>
        </header>

        {/* The Client Filter & Catalog Showcase */}
        <MockTestHubClient courses={courses} />

        {/* Offline Center Bottom Callout */}
        <section className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary uppercase tracking-wider">
              Offline Campus Training
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-primary">
              Prefer In-Person Classroom Guidance in Shikohabad?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Join MSK Institute at Station Road Area, Shikohabad. Learn with 1-student-1-PC policy, certified teacher mentoring by Er. Sumit Kumar, and unlimited offline lab hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/career-finder"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-surface hover:bg-surface-elevated text-primary font-bold text-xs rounded-xl border border-border-subtle transition-colors text-center"
            >
              <span>AI Career Finder</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap text-center"
            >
              <span>Book Free Demo Class</span>
              <span>➔</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
