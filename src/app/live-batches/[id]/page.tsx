import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, User, Award, CheckCircle2, 
  MapPin, ShieldCheck, Sparkles, BookOpen, Star, 
  Layers, Phone, MessageSquare, AlertCircle, ChevronRight, 
  Check, ArrowRight, Video, Flame, HelpCircle 
} from 'lucide-react';
import { fetchLiveBatches, fetchLiveBatchById } from '@/services/api';
import CourseCurriculumAccordion from '@/components/CourseCurriculumAccordion';
import BatchEnrollmentForm from '@/components/BatchEnrollmentForm';
import BatchViewTracker from '@/components/BatchViewTracker';

type Params = Promise<{ id: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const batches = await fetchLiveBatches();
    return batches.map((batch) => ({
      id: batch.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params for live batches:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await fetchLiveBatchById(id);
    if (!data || !data.batch) {
      return {
        title: 'Batch Not Found | MSK Institute',
        description: 'The requested live training batch could not be found.',
      };
    }

    const { batch, course } = data;
    const isCompleted = batch.status === 'COMPLETED' || batch.status === 'ARCHIVED';
    return {
      title: isCompleted
        ? `${batch.title} (Concluded) | MSK Institute Live Training`
        : `${batch.title} (${batch.price}) | MSK Institute Live Admissions`,
      description: isCompleted
        ? `Completed live training cohort: ${batch.title}. Review curriculum and reserve seats in upcoming batches with ${batch.instructor} in Shikohabad.`
        : `Enroll in ${batch.title}. Starting ${batch.startDate} with ${batch.instructor}. 100% practical lab training in Shikohabad and online. Only ${batch.leftSeats} seats left!`,
      alternates: {
        canonical: `https://www.mskinstitute.in/live-batches/${batch.id}`,
      },
      openGraph: {
        title: `${batch.title} | MSK Institute`,
        description: `Join ${batch.instructor} for hands-on coding training in Shikohabad and online.`,
        url: `https://www.mskinstitute.in/live-batches/${batch.id}`,
        images: [{ url: course?.featuredImageUrl || batch.instructorPicture }],
      },
    };
  } catch {
    return {
      title: 'Live Batch Admissions | MSK Institute',
    };
  }
}

export default async function LiveBatchDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  let batchData = null;

  try {
    batchData = await fetchLiveBatchById(id);
  } catch (err) {
    console.error('Error fetching live batch:', err);
  }

  if (!batchData || !batchData.batch) {
    notFound();
  }

  const { batch, course, includedCourses = [], instructor } = batchData;
  const isCombo = course?.courseType === 'COMBO';

  // Format start date nicely
  const formattedStartDate = (() => {
    try {
      const d = new Date(batch.startDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch {}
    return batch.startDate;
  })();

  const percentageLeft = Math.round((batch.leftSeats / batch.totalSeats) * 100);

  const isCompleted = batch.status === 'COMPLETED' || batch.status === 'ARCHIVED';
  const isFull = batch.status === 'FULL' || (!isCompleted && batch.leftSeats <= 0);

  // Schema LD (CourseInstance + BreadcrumbList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CourseInstance',
        'name': batch.title,
        'description': course?.shortDescription || batch.title,
        'startDate': batch.startDate,
        ...(batch.endDate ? { 'endDate': batch.endDate } : {}),
        'courseMode': 'Online & Offline Classroom',
        'instructor': {
          '@type': 'Person',
          'name': batch.instructor,
          'image': batch.instructorPicture,
        },
        'offers': {
          '@type': 'Offer',
          'price': batch.price.replace(/[^\d]/g, '') || '0',
          'priceCurrency': 'INR',
          'availability': isCompleted
            ? 'https://schema.org/Discontinued'
            : isFull
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
        },
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
        'organizer': {
          '@type': 'EducationalOrganization',
          'name': 'MSK Institute',
          'sameAs': 'https://www.mskinstitute.in',
          'telephone': '+918393042166',
        },
      },
      {
        '@type': 'BreadcrumbList',
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
            'name': 'Live Batches',
            'item': 'https://www.mskinstitute.in/live-batches',
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': batch.title,
            'item': `https://www.mskinstitute.in/live-batches/${batch.id}`,
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
      <BatchViewTracker
        batch={batch}
        courseTitle={course?.title}
        courseMode={course?.mode}
      />

      {/* Top Banner Bar */}
      {isCompleted ? (
        <div className="bg-slate-800 text-slate-200 py-2.5 px-4 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-bold rounded uppercase">Batch Concluded</span>
          <span>This cohort has completed. Admissions are now open for upcoming cohorts!</span>
          <Link href="/live-batches" className="underline font-bold text-amber-300 hover:text-white ml-1">
            View Upcoming Batches ➔
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#B83A00] to-secondary text-white py-2.5 px-4 text-center text-xs font-bold shadow-sm flex items-center justify-center gap-2 flex-wrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>Admissions Closing Soon: Only <strong>{batch.leftSeats} of {batch.totalSeats} seats</strong> left for the <strong>{formattedStartDate}</strong> batch!</span>
          <a href="#enroll-form" className="underline font-black hover:text-amber-200 ml-1">
            Lock Discounted Seat & Free Demo ➔
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="text-sm font-semibold text-text-muted no-print flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="text-secondary hover:underline transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/live-batches" className="text-secondary hover:underline transition-colors">
            Live Batches
          </Link>
          <span>/</span>
          <span className="text-text-main font-bold truncate max-w-xs sm:max-w-md">{batch.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-surface to-white border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-800 text-xs font-black rounded-full uppercase tracking-wider">
                    Batch Completed
                  </span>
                ) : isFull ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-black rounded-full uppercase tracking-wider">
                    Batch Full
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-black rounded-full uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 fill-secondary" />
                    Fast Filling Batch
                  </span>
                )}
                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-md">
                  {isCompleted ? `Concluded on ${batch.endDate || formattedStartDate}` : `Starts ${formattedStartDate}`}
                </span>
                {!isCompleted && batch.originalPrice && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-md animate-pulse">
                    Save 40% Today
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight leading-tight">
                {batch.title}
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed font-medium">
                {course?.shortDescription || 'Transform your skills with hands-on coding training, industry projects, and dedicated mentorship in our modern facility.'}
              </p>

              {/* Key Quick Stats Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-xs">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Start Date</span>
                  <span className="text-xs font-bold text-primary">{formattedStartDate}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-xs">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Schedule</span>
                  <span className="text-xs font-bold text-primary truncate block">{batch.schedule}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-xs">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Duration</span>
                  <span className="text-xs font-bold text-primary">{batch.duration || (course ? `${course.duration.value} ${course.duration.unit}` : '3 Months')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-xs">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Batch Fee</span>
                  <span className="text-sm font-black text-secondary">{batch.price}</span>
                </div>
              </div>

              {/* Instructor Mini Badge */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={batch.instructorPicture}
                    alt={batch.instructor}
                    className="w-12 h-12 rounded-full object-cover border-2 border-secondary shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-primary flex items-center gap-1.5">
                    <span>Mentored by {batch.instructor}</span>
                    <span className="px-1.5 py-0.2 bg-secondary/10 text-secondary text-[10px] font-bold rounded">Verified Lead</span>
                  </div>
                  <div className="text-[11px] text-text-muted">
                    MSK Institute • Practical Lab Mentor
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Scarcity & CTA Box */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border-2 border-secondary/40 shadow-lg space-y-4 text-center">
              {isCompleted ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Cohort Completed</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      All classes for this batch have concluded. Check out our active and upcoming batches.
                    </p>
                  </div>
                  <Link
                    href="/live-batches"
                    className="w-full py-3 px-4 bg-secondary hover:bg-secondary-light text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 block"
                  >
                    <span>Browse Next Live Batches</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {course && (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full py-2.5 px-4 bg-surface hover:bg-gray-100 text-primary font-bold text-xs rounded-xl border border-border-subtle transition-all flex items-center justify-center gap-1.5 block"
                    >
                      <span>View Full Course Syllabus</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Seats Filling Rapidly</span>
                    <div className="flex items-center justify-between text-xs font-extrabold text-primary pt-1">
                      <span className="text-red-600">Only {batch.leftSeats} Seats Left</span>
                      <span className="text-text-muted">{batch.totalSeats} Total Seats</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary to-red-500 rounded-full transition-all duration-500" 
                        style={{ width: `${100 - percentageLeft}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-surface rounded-xl border border-border-subtle space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">Special Offer Fee:</span>
                      <span className="text-xl font-black text-secondary">{batch.price}</span>
                    </div>
                    {batch.originalPrice && (
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Regular Fee:</span>
                        <span className="line-through text-gray-400">{batch.originalPrice}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href="#enroll-form"
                    className="w-full py-3.5 px-4 bg-secondary hover:bg-secondary-light text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 block"
                  >
                    <span>Reserve Seat & Free Demo Class</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <p className="text-[10px] text-text-muted">
                    ✓ Free Demo Session • ✓ 100% Practical Labs • ✓ Money-back Guarantee
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout Grid (Left: Syllabus & Perks, Right: Sticky Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Sales & Curriculum Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* 1. Key Batch Highlights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-secondary" />
                Why Join This Live Training Batch?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Individual Coding System',
                    desc: 'Every student gets their own computer station in our air-conditioned Shikohabad coding lab with high-speed internet.',
                  },
                  {
                    title: '100% Practical Labs',
                    desc: 'No theoretical boredom. Every concept is accompanied by real-time coding exercises and weekly lab challenges.',
                  },
                  {
                    title: 'Verifiable ISO Certificate',
                    desc: 'Earn a government & industry recognized MSK Institute certificate with unique QR code verification.',
                  },
                  {
                    title: 'Full Class Recordings & Notes',
                    desc: 'Never miss a session. Get lifetime free access to HD class video archives, revision sheets, and cheat-sheets.',
                  },
                  {
                    title: 'Production Portfolio Projects',
                    desc: 'Build 3+ live industry standard projects to showcase on your GitHub and resume during job interviews.',
                  },
                  {
                    title: 'Interview & Career Prep',
                    desc: 'Weekly doubt sessions, resume building workshops, and mock technical interview drills.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-border-subtle shadow-xs space-y-1.5 flex gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg h-fit flex-shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                      <p className="text-xs text-text-muted leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Comprehensive Curriculum from all-courses.json */}
            {course && (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-secondary" />
                    Curriculum & Topics Covered
                  </h2>
                  <p className="text-xs text-text-muted">
                    This batch follows the industry-standard curriculum of <strong>{course.title}</strong>.
                  </p>
                </div>

                <CourseCurriculumAccordion
                  isCombo={isCombo}
                  courseTitle={course.title}
                  includedCourses={includedCourses}
                  chapters={course.chapters || []}
                />
              </section>
            )}

            {/* 3. Instructor Authority Card */}
            <section className="bg-gradient-to-br from-primary to-[#162D4A] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={instructor?.picture || batch.instructorPicture}
                  alt={instructor?.name || batch.instructor}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-secondary shadow-lg flex-shrink-0"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 bg-secondary text-white text-[10px] font-black uppercase rounded tracking-wider">
                      {instructor?.designation || 'Lead Mentor'}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      ★ {instructor?.rating || 4.9}/5 Rating ({instructor?.studentsCount || '1,200'}+ Students)
                    </span>
                    {instructor?.experience && (
                      <span className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                        {instructor.experience} Exp
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black">{instructor?.name || batch.instructor}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                    {instructor?.bio || 'Founder of MSK Institute with over 8+ years of expertise in software development, Python architectures, Full-Stack engineering, and coaching over 1,200+ students to successful technical careers.'}
                  </p>
                  {instructor?.specialties && instructor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                      {instructor.specialties.map((spec, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-gray-200">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. Student Reviews / Social Proof */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  What Our Students Say
                </h2>
                <span className="text-xs font-bold text-text-muted">4.9/5 (120+ Reviews)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Aman Yadav',
                    role: 'Python Batch Graduate',
                    review: 'The offline lab environment in Shikohabad made a huge difference. Er. Sumit sir explains every coding concept with live debugging. Highly recommended!',
                  },
                  {
                    name: 'Pooja Sharma',
                    role: 'Web Development Student',
                    review: 'I started with zero coding background. Within 3 months I built 2 responsive React apps. The batch size is kept small so everyone gets personal guidance.',
                  },
                ].map((t, idx) => (
                  <div key={idx} className="p-5 bg-white rounded-xl border border-border-subtle shadow-xs space-y-3">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed italic">
                      "{t.review}"
                    </p>
                    <div className="text-xs font-bold text-primary">
                      {t.name} <span className="text-text-muted font-normal">• {t.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. FAQs */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-secondary" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {[
                  {
                    q: 'Can I attend a free demo session before paying?',
                    a: 'Yes! We provide a free trial demo session so you can experience our lab teaching methodology and interact with the instructor before enrolling.',
                  },
                  {
                    q: 'What if I miss a live class session?',
                    a: 'Every class has recorded backup access and written study notes. You can also get your doubts resolved in weekend revision labs.',
                  },
                  {
                    q: 'Where is the offline training center located?',
                    a: 'Our physical center is at Gali No. 3, Near Gyan Jyoti Public School, Shikohabad (Firozabad, UP). Students can also join online from home.',
                  },
                  {
                    q: 'Will I get an official verifiable certificate?',
                    a: 'Yes, every student who completes the coursework and evaluations receives an official MSK Institute certificate verifiable on our portal.',
                  },
                ].map((faq, i) => (
                  <details key={i} className="group p-4 bg-white rounded-xl border border-border-subtle shadow-xs">
                    <summary className="font-bold text-sm text-primary cursor-pointer select-none flex justify-between items-center">
                      <span>{faq.q}</span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border-subtle leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Lead Capture Form */}
          <div className="lg:col-span-1 space-y-6" id="enroll-form">
            <BatchEnrollmentForm
              batch={batch}
              courseTitle={course?.title || batch.title}
              isSticky={true}
            />

            {/* Direct WhatsApp Callout Card */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-primary">Prefer Calling or WhatsApp?</h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Speak directly with admissions coordinator Er. Sumit Kumar
                </p>
              </div>
              <a
                href="https://wa.me/918393042166?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20live%20batches"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp (+91 83930 42166)</span>
              </a>
            </div>

            {/* Location & Facility Trust */}
            <div className="p-5 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Offline Training Center:</span>
              </div>
              <p className="leading-relaxed">
                MSK Institute, Gali No. 3, Near Gyan Jyoti Public School, Shikohabad (Firozabad, UP) - 283135.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
