import { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Sparkles, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import CareerFinderWizard from '@/components/CareerFinderWizard';

export const metadata: Metadata = {
  title: "Course & Career Finder Quiz | Find Your Ideal Course in 60s | MSK Institute",
  description: "Unsure which computer or coding course is right for your career? Take our free 60-second interactive Career Finder Quiz to get a personalized recommendation, syllabus breakdown, and salary outlook.",
  keywords: [
    "Course Finder Quiz Shikohabad",
    "Which computer course is best for me",
    "Best computer course after 12th in UP",
    "ADCA vs CCC course guidance",
    "MSK Institute Course Advisor",
    "Computer career counseling Shikohabad"
  ],
  alternates: {
    canonical: "https://www.mskinstitute.in/career-finder",
  },
  openGraph: {
    title: "Course & Career Finder Quiz | MSK Institute Shikohabad",
    description: "Discover the best computer or coding course matching your education, goals, and available time in 60 seconds.",
    url: "https://www.mskinstitute.in/career-finder",
    siteName: "MSK Institute",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.mskinstitute.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MSK Institute Course Finder Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Course & Career Finder Quiz | MSK Institute",
    description: "Take the 60-second career quiz and unlock your ideal tech learning roadmap.",
    images: ["https://www.mskinstitute.in/logo.jpg"],
  },
};

export default function CareerFinderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/career-finder#webpage",
        "url": "https://www.mskinstitute.in/career-finder",
        "name": "Course & Career Finder Quiz | MSK Institute",
        "description": "Interactive course and career advisor quiz matching students to curriculum tracks.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://www.mskinstitute.in/career-finder#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.mskinstitute.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Course Finder",
              "item": "https://www.mskinstitute.in/career-finder"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
            <Compass className="w-3.5 h-3.5" />
            60-Second Career Advisor
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Find the <span className="text-secondary">Perfect Course</span> for Your Career
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Answer 4 simple questions about your educational background, career goals, and time commitment. We&apos;ll match you with the exact industry-relevant course track.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              100% Free Consultation
            </span>
            <span className="flex items-center gap-1.5 text-secondary">
              <Sparkles className="w-4 h-4" />
              Personalized Syllabus Match
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Mentorship Advice
            </span>
          </div>
        </header>

        {/* The Interactive Wizard */}
        <CareerFinderWizard />

        {/* Offline Campus Assistance Callout */}
        <section className="bg-surface/50 rounded-3xl border border-border-subtle p-6 sm:p-10 max-w-3xl mx-auto text-center space-y-4">
          <h3 className="font-extrabold text-xl text-primary">
            Prefer Speaking with Our Academic Counselor In-Person?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            Visit our Shikohabad campus near Station Road. Er. Sumit Kumar and our counseling team will provide personalized guidance, demo lab tours, and fee payment plan options.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Book In-Person Counseling Slot
            </Link>
            <a
              href="tel:+918393042166"
              className="px-5 py-2.5 bg-white border border-border-subtle text-primary hover:text-secondary text-xs font-bold rounded-xl transition-colors"
            >
              Call Helpline: +91 83930 42166
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
