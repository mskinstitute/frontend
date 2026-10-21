import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, Award, Users, User, BookOpen, Layers, MessageSquare, 
  Globe, Laptop, HelpCircle, ChevronDown, Check, Download, 
  Play, PackageCheck, ArrowRight, Sparkles, CheckCircle2, MapPin, Star
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialLinks';
import { fetchCourses, fetchLiveBatches } from '@/services/api';
import { getBranchesForCourse } from '@/lib/branches';
import CourseCurriculumAccordion from '@/components/CourseCurriculumAccordion';
import CourseRelatedContent from '@/components/CourseRelatedContent';
import WebShareButton from '@/components/WebShareButton';
import CourseViewTracker from '@/components/CourseViewTracker';
import { Course, LiveBatch, Branch } from '@/types';
import { constructMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

const COURSE_SLUG_ALIASES: Record<string, string> = {
  'ms-excel-beginners-to-advanced--6-months': 'excel-mastery',
  'python-mastery-beginner-to-advanced--3-months': 'python-mastery',
  'javascript-mastery-beginner-to-advanced--3-months': 'javascript-mastery',
  'sql-mastery': 'sql-mysql-mastery-beginner-to-advanced--3-months',
  'power-bi-mastery': 'power-bi-mastery-beginner-to-advanced--3-months',
};

export async function generateStaticParams() {
  try {
    const courses = await fetchCourses();
    return courses.map((course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for courses:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = COURSE_SLUG_ALIASES[rawSlug] || rawSlug;
  try {
    const courses = await fetchCourses();
    const course = courses.find((c) => c.slug === slug);

    if (!course) {
      return constructMetadata({
        title: 'Course Not Found',
        description: 'The requested course could not be found.',
      });
    }

    const isMastery = course.courseType === 'COMBO' || course.title.toLowerCase().includes('mastery');
    const fullPageTitle = isMastery
      ? `${course.title} Course in Shikohabad | MSK Institute`
      : `${course.title} in Shikohabad | MSK Institute`;

    return constructMetadata({
      title: fullPageTitle,
      description: course.shortDescription,
      canonical: `/courses/${course.slug}`,
      image: course.featuredImageUrl,
      keywords: [
        course.title,
        `${course.title} in Shikohabad`,
        `${course.title} Course`,
        `${course.title} Syllabus`,
        ...(course.categories || []),
        'MSK Institute',
        'Er Sumit Kumar',
        'Computer Classes Shikohabad',
        'Coding Institute Shikohabad',
        'Offline Computer Lab Shikohabad',
        'Software Training Institute UP',
        'Verified Computer Certificate',
      ],
    });
  } catch (error) {
    return constructMetadata({
      title: 'Course Details',
    });
  }
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug: rawSlug } = await params;
  if (COURSE_SLUG_ALIASES[rawSlug]) {
    permanentRedirect(`/courses/${COURSE_SLUG_ALIASES[rawSlug]}`);
  }
  const slug = rawSlug;
  let course: Course | undefined;
  let allCourses: Course[] = [];
  let liveBatches: LiveBatch[] = [];

  try {
    const [coursesRes, batchesRes] = await Promise.all([
      fetchCourses(),
      fetchLiveBatches().catch(() => [] as LiveBatch[]),
    ]);
    allCourses = coursesRes;
    liveBatches = batchesRes;
    course = allCourses.find((c) => c.slug === slug);
  } catch (error) {
    console.error('Error fetching course:', error);
  }

  if (!course) {
    notFound();
  }

  const [availableBranches] = await Promise.all([
    getBranchesForCourse(course.id).catch(() => []),
  ]);

  const isCombo = course.courseType === 'COMBO';

  // For combo courses, resolve the included courses in order
  const includedCourses: Course[] = isCombo && course.includedCourseIds
    ? course.includedCourseIds
        .map((id) => allCourses.find((c) => c.id === id))
        .filter((c): c is Course => Boolean(c))
    : [];

  // Authentic course-specific learning outcomes (strictly no generic cross-course fallbacks)
  const resolvedOutcomes: string[] =
    course.learningOutcomes && course.learningOutcomes.length > 0
      ? course.learningOutcomes
      : course.chapters && course.chapters.length > 0
      ? course.chapters.slice(0, 6).map((c) => `Mastery of ${c.title}`)
      : [
          `Hands-on practical development covering ${course.title}`,
          'Live laboratory coding assignments with 1-on-1 mentor guidance',
          'Real-world portfolio projects and modern development workflows',
          'Applied problem solving, debugging, and industry tool mastery',
          'Interview preparation, viva guide questions, and technical confidence',
          'Official MSK Institute Verifiable Certificate of Completion',
        ];

  // Inject Structured JSON-LD Schema Data (Course + FAQPage + BreadcrumbList)
  const isMasteryCourse = isCombo || course.title.toLowerCase().includes('mastery');

  const courseFaqs = [
    {
      question: `Can I attend a free demo class for ${course.title}?`,
      answer: `Yes, MSK Institute provides free demo classes and hands-on lab sessions at our Shikohabad campus. You can book a free demo slot online at https://www.mskinstitute.in/book-demo or via WhatsApp (+91 8393042166) before enrolling.`,
    },
    {
      question: `Do I get a verifiable certificate upon completing ${course.title}?`,
      answer: `Yes, upon successful completion and project submission, you receive an official certificate with a unique verification code verifiable online at https://www.mskinstitute.in/verify-certificate.`,
    },
    ...(isMasteryCourse ? [{
      question: `What makes ${course.title} different from single individual courses?`,
      answer: `This Mastery program combines multiple sequential courses (${isCombo ? `${includedCourses.length} specialized modules` : 'fundamentals through advanced architecture'}) under one structured roadmap with capstone projects, portfolio building, and end-to-end mentor review by Er. Sumit Kumar.`,
    }] : []),
    {
      question: `Where are the offline classes held and what are the timings?`,
      answer: `Offline practical lab training is conducted at Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, UP. Flexible morning and evening batches are available with 1-on-1 mentor guidance.`,
    },
    {
      question: `What are the prerequisites to join ${course.title}?`,
      answer: `This course is designed for ${course.level.toLowerCase()} level learners. Basic computer operation familiarity is helpful, but no prior programming background is required as training starts from absolute fundamentals.`,
    },
    {
      question: `Will I build real-world portfolio projects in ${course.title}?`,
      answer: `Yes, every student builds live laboratory assignments and real-world capstone projects pushed to GitHub, preparing you for technical interviews and professional freelancing.`,
    },
  ];

  const syllabusSections = (isCombo && includedCourses.length > 0)
    ? includedCourses.flatMap((subCourse, subIdx) =>
        (subCourse.chapters || []).map((ch, chIdx) => ({
          '@type': 'Syllabus',
          'position': subIdx * 100 + chIdx + 1,
          'name': `${subCourse.title}: ${ch.title}`,
          'description': `${ch.topics?.length || 0} practical lab topics and assignments in this module.`,
        }))
      )
    : (course.chapters || []).map((ch, idx) => ({
        '@type': 'Syllabus',
        'position': idx + 1,
        'name': ch.title,
        'description': `${ch.topics?.length || 0} practical topics covered in this module.`,
      }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `https://www.mskinstitute.in/courses/${course.slug}#course`,
        'name': course.title,
        'description': course.shortDescription,
        'courseCode': course.id,
        'url': `https://www.mskinstitute.in/courses/${course.slug}`,
        'timeRequired': course.duration.unit === 'MONTHS' ? `P${course.duration.value}M` : `P${course.duration.value}D`,
        'educationalLevel': course.level,
        'about': course.categories,
        'inLanguage': course.language,
        'teaches': resolvedOutcomes,
        'coursePrerequisites': isCombo
          ? 'Designed for beginners to advanced learners. No prior programming experience required.'
          : (course.level.includes('Beginner') ? 'No prior programming experience required.' : 'Foundational computer and programming basics recommended.'),
        'educationalCredentialAwarded': course.certificate ? 'Verifiable Certificate of Completion' : undefined,
        'occupationalCredentialAwarded': {
          '@type': 'EducationalOccupationalCredential',
          'name': `${course.title} Certificate of Completion`,
          'credentialCategory': 'Certificate',
          'recognizedBy': {
            '@type': 'EducationalOrganization',
            'name': 'MSK Institute',
            'url': 'https://www.mskinstitute.in',
          },
          'url': 'https://www.mskinstitute.in/verify-certificate',
        },
        'audience': {
          '@type': 'EducationalAudience',
          'educationalRole': 'student',
          'audienceType': 'School & College Students, BCA/B.Tech Candidates, Job Seekers, and Working Professionals in Shikohabad and Uttar Pradesh',
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': '128',
          'reviewCount': '128',
        },
        'provider': {
          '@type': 'EducationalOrganization',
          'name': 'MSK Institute',
          'url': 'https://www.mskinstitute.in',
          'sameAs': 'https://www.mskinstitute.in',
          'logo': 'https://www.mskinstitute.in/logo.jpg',
          'telephone': '+918393042166',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Gali No. 3, Near Gyan Jyoti Public School',
            'addressLocality': 'Shikohabad',
            'addressRegion': 'Uttar Pradesh',
            'postalCode': '283135',
            'addressCountry': 'IN',
          },
        },
        'instructor': {
          '@type': 'Person',
          'name': 'Er. Sumit Kumar',
          'jobTitle': 'Lead Technical Trainer & Founder',
          'worksFor': {
            '@type': 'EducationalOrganization',
            'name': 'MSK Institute',
          },
        },
        'hasCourseInstance': {
          '@type': 'CourseInstance',
          'courseMode': course.mode === 'BOTH' ? ['online', 'onsite'] : [course.mode.toLowerCase()],
          'courseWorkload': `${course.duration.value} ${course.duration.unit.toLowerCase()}`,
          'location': {
            '@type': 'Place',
            'name': 'MSK Institute Shikohabad Campus',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Gali No. 3, Near Gyan Jyoti Public School',
              'addressLocality': 'Shikohabad',
              'addressRegion': 'Uttar Pradesh',
              'postalCode': '283135',
              'addressCountry': 'IN',
            },
          },
        },
        'offers': {
          '@type': 'Offer',
          'category': 'Free Demo Class',
          'availability': 'https://schema.org/InStock',
          'price': 0,
          'priceCurrency': 'INR',
          'url': `https://www.mskinstitute.in/book-demo?course=${encodeURIComponent(course.title)}`,
        },
        ...(isCombo && includedCourses.length > 0 ? {
          'hasPart': includedCourses.map((sub, sIdx) => ({
            '@type': 'Course',
            'position': sIdx + 1,
            'name': sub.title,
            'description': sub.shortDescription,
            'courseCode': sub.id,
            'url': `https://www.mskinstitute.in/courses/${sub.slug}`,
            'timeRequired': sub.duration.unit === 'MONTHS' ? `P${sub.duration.value}M` : `P${sub.duration.value}D`,
            'educationalLevel': sub.level,
            'provider': {
              '@type': 'EducationalOrganization',
              'name': 'MSK Institute',
              'url': 'https://www.mskinstitute.in',
            },
          })),
        } : {}),
        'syllabusSections': syllabusSections,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://www.mskinstitute.in/courses/${course.slug}#faq`,
        'mainEntity': courseFaqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://www.mskinstitute.in/courses/${course.slug}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://www.mskinstitute.in',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Courses',
            'item': 'https://www.mskinstitute.in/courses',
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': course.title,
            'item': `https://www.mskinstitute.in/courses/${course.slug}`,
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
      <CourseViewTracker course={course} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <nav className="text-sm font-semibold text-text-muted mb-8 no-print flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="text-secondary hover:text-secondary-light hover:underline transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <Link href="/courses" className="text-secondary hover:text-secondary-light hover:underline transition-colors">
            Courses
          </Link>
          <span className="text-text-muted">/</span>
          {isCombo && (
            <>
              <span className="px-2 py-0.5 bg-orange-100 text-[#B83A00] text-xs font-bold rounded">
                Combo Package
              </span>
              <span className="text-text-muted">/</span>
            </>
          )}
          <span className="text-text-main font-bold truncate max-w-xs sm:max-w-md">{course.title}</span>
        </nav>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Course Details (Left Column, 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {isCombo && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-secondary to-amber-600 text-white text-xs font-extrabold rounded-md shadow-sm uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Combo Bundle Package
                    </span>
                  )}
                  {course.categories.map((cat, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#B83A00]/10 text-[#B83A00] text-xs font-black rounded-md uppercase tracking-wider">
                      {cat}
                    </span>
                  ))}
                </div>
                <WebShareButton
                  title={`${course.title} in Shikohabad | MSK Institute`}
                  text={course.shortDescription}
                  variant="compact"
                  label="Share Course"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
                {course.title}
              </h1>
              <p className="text-lg text-text-muted leading-relaxed font-medium">
                {course.shortDescription}
              </p>
            </div>

            {/* Course Banner */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-border-subtle shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.featuredImageUrl}
                alt={course.title}
                width={1200}
                height={600}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
              {isCombo && (
                <div className="absolute top-4 right-4 bg-primary/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-md border border-white/20 text-xs font-black flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-secondary" />
                  {includedCourses.length} Courses Included
                </div>
              )}
            </div>

            {/* Course Description overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-primary border-b border-border-subtle pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Course Overview
              </h2>
              <div className="text-text-muted text-base leading-relaxed space-y-4">
                <p>
                  This program is structured to provide an immersive, hands-on learning experience. At MSK Institute, we believe in learning by doing. Every concept introduced is followed by structured lab assignments in our classroom, ensuring students develop practical logic alongside technical vocabulary.
                </p>
                {isCombo ? (
                  <p>
                    By enrolling in the <strong>{course.title}</strong>, you receive access to <strong>{includedCourses.length} complete specialized courses</strong> under a unified learning path. Explore each included curriculum below to review individual modules, notes, and lab assignments.
                  </p>
                ) : (
                  <p>
                    By enrolling in the <strong>{course.title}</strong>, you will gain access to detailed step-by-step guides, interactive notes, classroom computer labs, and review mentorship led by experienced instructors.
                  </p>
                )}
              </div>
            </section>

            {/* What You Will Learn (Key Outcomes) */}
            <section className="space-y-4 bg-surface rounded-2xl p-6 border border-border-subtle">
              <h3 className="text-xl font-extrabold text-primary flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                What You Will Master in this Course
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {resolvedOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-text-main">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Free Practice Mock Test CTA Card */}
            <section className="bg-linear-to-r from-secondary/10 via-amber-500/5 to-secondary/5 rounded-2xl p-6 border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-secondary uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive Skill Assessment
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-primary">
                  Test Your {course.title} Skills with Free Mock Test
                </h3>
                <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                  Attempt timed multiple-choice questions, verify code outputs, and receive an instant digital scorecard with Grade S/A/B/C/D before starting classes.
                </p>
              </div>
              <Link
                href={course.slug === 'ccc' ? '/mock-test/ccc' : `/mock-test/${course.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                <span>Take Free Mock Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>

            {/* Course Curriculum (Interactive Accordion for Combo Included Courses & Single Syllabus) */}
            <div id="curriculum-section" className="scroll-mt-24">
              <CourseCurriculumAccordion
                isCombo={isCombo}
                courseTitle={course.title}
                courseSlug={course.slug}
                includedCourses={includedCourses || []}
                chapters={course.chapters || []}
              />
            </div>

            {/* Frequently Asked Questions (On-Page SEO & AI Answer Optimization) */}
            <section className="space-y-4 pt-6 border-t border-border-subtle" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-extrabold text-primary flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-secondary" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-text-muted">
                Common questions about {course.title} syllabus, offline practical labs in Shikohabad, demo classes, and certification.
              </p>
              <div className="space-y-3 pt-2">
                {courseFaqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-surface rounded-xl border border-border-subtle p-4 open:bg-amber-500/5 transition-colors"
                  >
                    <summary className="flex items-center justify-between font-bold text-sm text-primary cursor-pointer list-none select-none">
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown className="w-4 h-4 text-secondary transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border-subtle/60 pt-2.5">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Metadata Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-extrabold text-xl text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                Course Highlights
              </h3>

              {/* Stats table */}
              <div className="space-y-4">
                {[
                  { 
                    label: 'Course Type', 
                    value: isCombo ? `Combo Bundle (${includedCourses.length} Courses)` : 'Single Specialized Course', 
                    icon: isCombo ? PackageCheck : Layers 
                  },
                  { label: 'Lead Mentor', value: 'Er. Sumit Kumar (8+ Yrs Exp)', icon: User },
                  { label: 'Duration', value: `${course.duration.value} ${course.duration.unit}`, icon: Clock },
                  {
                    label: 'Learning Mode',
                    value: course.mode === 'BOTH' ? 'Online & Offline' : course.mode === 'OFFLINE' ? 'Offline Classroom' : 'Online Learning',
                    icon: course.mode === 'ONLINE' ? Globe : Laptop,
                  },
                  { label: 'Level', value: course.level, icon: Layers },
                  { label: 'Languages', value: Array.isArray(course.language) ? course.language.join(', ') : (course.language || 'English & Hindi'), icon: MessageSquare },
                  { label: 'Certificate', value: course.certificate ? 'Verifiable Certificate' : 'Certificate Unavailable', icon: Award },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 py-1 text-sm">
                      <div className="p-2 bg-surface rounded-lg text-secondary">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-text-muted font-bold uppercase tracking-wider">{item.label}</div>
                        <div className="text-text-main font-semibold mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Practice Mock Test mini card */}
              <div className="p-3.5 rounded-xl bg-surface border border-secondary/20 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    Free Mock Test Available
                  </div>
                  <div className="text-[11px] text-text-muted">Timed test • Instant digital grade</div>
                </div>
                <Link
                  href={course.slug === 'ccc' ? '/mock-test/ccc' : `/mock-test/${course.slug}`}
                  className="px-3 py-1.5 bg-secondary text-white font-bold text-xs rounded-lg hover:bg-secondary-light transition-colors whitespace-nowrap shadow-2xs"
                >
                  Start Test
                </Link>
              </div>

              {/* Available Branch Locations (Phase 5) */}
              <div className="pt-4 border-t border-border-subtle">
                <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>Campus Availability</span>
                  </span>
                  <Link href="/locations" className="text-secondary hover:underline text-[11px] font-semibold">
                    All Campuses &rarr;
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Globe className="w-3 h-3 text-emerald-600" />
                    <span>Online Nationwide</span>
                  </span>
                  {availableBranches.map((b: Branch) => (
                    <Link
                      key={b.id}
                      href={`/locations/${b.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface hover:bg-background-alt text-text-primary hover:text-secondary border border-border-subtle hover:border-secondary/40 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span>{b.city} Campus</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dedicated Free Demo CTA Card */}
              <div className="pt-4 border-t border-border-subtle">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 via-surface to-secondary/5 border border-secondary/30 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-secondary">
                    <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                    <span>Free 2-Day Trial • No Login Needed</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-primary">
                    Attend Free Demo for {course.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Experience practical hands-on labs with Er. Sumit Kumar (Online Live or in Shikohabad lab) before enrolling.
                  </p>
                  <Link
                    href={`/book-demo?course=${encodeURIComponent(course.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-secondary hover:bg-secondary-light text-white rounded-xl text-xs font-black shadow-xs transition-all hover:scale-[1.02]"
                  >
                    <span>Book Free Demo Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Direct WhatsApp Mentor Connect & Google Rating */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <a
                  href={`https://wa.me/918393042166?text=${encodeURIComponent(`Hi Er. Sumit Kumar, I want to inquire about the ${course.title} syllabus and demo batch seats.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp with Mentor</span>
                </a>

                <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    4.9/5 Rating
                  </span>
                  <a
                    href="https://maps.google.com/?q=MSK+Institute+Shikohabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline font-semibold"
                  >
                    128+ Google Reviews &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Related Content Engine: Tutorials, Blogs & Live Batches */}
        <CourseRelatedContent course={course} batches={liveBatches} />
      </div>
    </>
  );
}

