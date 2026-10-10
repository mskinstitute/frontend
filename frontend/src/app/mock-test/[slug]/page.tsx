import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Award, Clock, CheckCircle2, ShieldCheck, 
  HelpCircle, BookOpen, ArrowRight, Laptop, Sparkles, ChevronRight
} from 'lucide-react';
import { fetchCourses } from '@/services/api';
import { getCourseMockTest, COURSE_MOCK_TESTS } from '@/data/courseMockQuestions';
import CourseMockTestClient from '@/components/CourseMockTestClient';
import { constructMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const courses = await fetchCourses();
    // Exclude 'ccc' because it has its own dedicated static route at src/app/mock-test/ccc/page.tsx
    return courses
      .filter((c) => c.slug !== 'ccc')
      .map((course) => ({
        slug: course.slug,
      }));
  } catch (error) {
    console.error('Failed to generate static params for course mock tests:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  
  if (slug === 'ccc') {
    return constructMetadata({
      title: 'Free NIELIT CCC Mock Test 2026 (Bilingual) | MSK Institute',
      canonical: '/mock-test/ccc',
    });
  }

  const courses = await fetchCourses().catch(() => []);
  const course = courses.find((c) => c.slug === slug);
  const isCurated = slug in COURSE_MOCK_TESTS;

  if (!course && !isCurated) {
    return constructMetadata({
      title: 'Mock Test Not Found',
      description: 'The requested course mock test could not be found.',
    });
  }

  const config = getCourseMockTest(slug, course?.title);

  return constructMetadata({
    title: `Free ${config.courseTitle} Online Mock Test 2026 | MSK Institute`,
    description: `${config.description} Practice ${config.questions.length} questions with timer, instant scorecard, and performance review. Free online assessment at MSK Institute Shikohabad.`,
    canonical: `/mock-test/${slug}`,
    keywords: [
      `${config.courseTitle} Mock Test`,
      `${config.courseTitle} Online Test`,
      `${config.courseTitle} Practice Questions`,
      `${config.courseTitle} Quiz`,
      'MSK Institute Mock Test',
      'Computer Exam Shikohabad',
      config.category,
    ],
  });
}

export default async function CourseMockTestPage({ params }: { params: Params }) {
  const { slug } = await params;

  // Let CCC redirect or handled by dedicated route
  if (slug === 'ccc') {
    // Dedicated route src/app/mock-test/ccc/page.tsx handles this
    notFound();
  }

  const courses = await fetchCourses().catch(() => []);
  const course = courses.find((c) => c.slug === slug);
  const isCurated = slug in COURSE_MOCK_TESTS;

  if (!course && !isCurated) {
    notFound();
  }

  const config = getCourseMockTest(slug, course?.title);

  // Extract unique topics from questions for topic summary
  const topicsList = Array.from(new Set(config.questions.map((q) => q.topic))).filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://www.mskinstitute.in/mock-test/${slug}#webpage`,
        'url': `https://www.mskinstitute.in/mock-test/${slug}`,
        'name': `Free ${config.courseTitle} Online Mock Test 2026 | MSK Institute`,
        'description': config.description,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': 'https://www.mskinstitute.in/#website',
          'url': 'https://www.mskinstitute.in',
          'name': 'MSK Institute'
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          '@id': `https://www.mskinstitute.in/mock-test/${slug}#breadcrumb`,
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
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': `${config.courseTitle} Mock Test`,
              'item': `https://www.mskinstitute.in/mock-test/${slug}`
            }
          ]
        }
      },
      {
        '@type': 'Quiz',
        'name': `${config.courseTitle} Skill Assessment Test`,
        'description': config.description,
        'timeRequired': `PT${config.durationMinutes}M`,
        'educationalAlignment': {
          '@type': 'AlignmentObject',
          'alignmentType': 'educationalSubject',
          'targetName': config.courseTitle
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/mock-test" className="hover:text-primary transition-colors">
            Mock Tests
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-bold truncate max-w-xs sm:max-w-md">
            {config.courseTitle}
          </span>
        </nav>

        {/* Hero Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-secondary/10 text-secondary">
            <Sparkles className="w-3.5 h-3.5" />
            Official Skill Assessment • 100% Free
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            {config.courseTitle} <span className="text-secondary">Online Mock Test</span>
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            {config.description}
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-border-subtle">
              <BookOpen className="w-4 h-4 text-secondary" />
              {config.questions.length} Questions
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-border-subtle">
              <Clock className="w-4 h-4 text-emerald-600" />
              {config.durationMinutes} Minutes Timed
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-border-subtle">
              <Award className="w-4 h-4 text-amber-600" />
              Passing: {config.passingPercentage}%
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-border-subtle">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Instant Digital Scorecard
            </span>
          </div>
        </header>

        {/* The Live Interactive Exam Simulator Client */}
        <CourseMockTestClient config={config} />

        {/* Topic Breakdown & Syllabus Guide */}
        {topicsList.length > 0 && (
          <section className="bg-surface/60 rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-primary flex items-center gap-2">
                <Laptop className="w-5 h-5 text-secondary" />
                Topics Evaluated in this {config.courseTitle} Test
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Questions are aligned with practical industry expectations and MSK Institute’s syllabus standards.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {topicsList.map((topic, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border-subtle text-xs font-bold text-primary shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {topic}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Course Enrollment & Practical Labs Callout */}
        <section className="bg-linear-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Master Practical Skills
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Want to Learn {config.courseTitle} with 100% Practical Labs?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Join MSK Institute in Shikohabad. Learn with 1-student-1-PC lab guidance, real-world portfolio projects, certified mentor support from Er. Sumit Kumar, and ISO-recognized graduation certificates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              {course ? (
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-light text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm transition-all text-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Full Course Syllabus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm transition-all text-center"
              >
                <span>Book Free Demo Class</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Back to all mock tests */}
        <div className="text-center pt-2">
          <Link
            href="/mock-test"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-secondary hover:underline"
          >
            <span>← Explore All Free Course Mock Tests & Quizzes</span>
          </Link>
        </div>
      </div>
    </>
  );
}
