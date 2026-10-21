import { Metadata } from 'next';
import Link from 'next/link';
import { Video, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchLiveBatches } from '@/services/api';
import LiveBatchesClient from '@/components/LiveBatchesClient';
import { BUSINESS_INFO } from '@/config/business';

export const metadata: Metadata = {
  title: "Upcoming Live Coding Batches & Cohorts Admissions | MSK Institute Shikohabad",
  description: "Join upcoming live computer cohorts in Shikohabad & online with Er. Sumit Kumar. Check Python, Full-Stack Web Development, Data Analytics & CCC batch schedules, fees, and verified seats.",
  keywords: [
    "Live Coding Batches Shikohabad",
    "Upcoming Computer Batches Shikohabad",
    "MSK Institute Live Batches",
    "Python Live Training Shikohabad",
    "Full Stack MERN Cohort Shikohabad",
    "Data Analytics Course Shikohabad",
    "NIELIT CCC Live Batch",
    "Computer Institute Near Me",
    "Er. Sumit Kumar Live Batches",
    "Offline Lab Coding Classes Shikohabad",
    "Live Interactive Software Training",
    "Best Computer Center Station Road Shikohabad"
  ],
  alternates: {
    canonical: "https://www.mskinstitute.in/live-batches",
  },
  openGraph: {
    title: "Upcoming Live Coding Batches & Admissions | MSK Institute",
    description: "Join interactive live coding cohorts with 100% practical lab training in Shikohabad and online. Check batch schedules, fees, and limited seats.",
    url: "https://www.mskinstitute.in/live-batches",
    siteName: "MSK Institute",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.mskinstitute.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MSK Institute Upcoming Live Coding Batches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Live Coding Batches & Admissions | MSK Institute",
    description: "Enroll in live coding cohorts with Er. Sumit Kumar in Shikohabad. 100% practical lab training with verified certification.",
    images: ["https://www.mskinstitute.in/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const revalidate = 60;

export default async function LiveBatchesPage() {
  const batches = await fetchLiveBatches();
  const activeBatches = batches.filter(
    (b) => b.status !== 'COMPLETED' && b.status !== 'ARCHIVED'
  );

  const batchFaqs = [
    {
      q: "How can I book a free demo session for an upcoming live batch?",
      a: "You can book a 100% free 2-day trial demo class directly through our /book-demo page or by clicking 'View Details' on any batch card. You can also chat directly with coordinator Er. Sumit Kumar on WhatsApp (+91 8393042166)."
    },
    {
      q: "Are MSK live batches conducted online, offline, or hybrid?",
      a: "All batches operate in a dual hybrid model: students in Shikohabad attend in-person at our air-conditioned computer lab (Gali No. 3, Near Gyan Jyoti Public School), while students outside Shikohabad attend online live via interactive Google Meet sessions."
    },
    {
      q: "What is included with each live batch enrollment?",
      a: "Every batch includes dedicated individual lab workstations, 100% practical coding assignments, lifetime access to class HD recordings, revision study notes, portfolio capstone projects, and an official ISO 9001:2015 verifiable certificate."
    },
    {
      q: "What should I do if I miss a live class session?",
      a: "All classes are recorded in HD and archived with companion source code and lecture notes. Students can review missed sessions at any time and clarify questions in dedicated weekend doubt labs."
    }
  ];

  // Comprehensive JSON-LD Graph for Search Engines, Knowledge Graph & AI Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. EducationalOrganization
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": "https://www.mskinstitute.in/#organization",
        "name": BUSINESS_INFO.name,
        "alternateName": ["MSK Computer Institute", "MSK Institute Shikohabad", "CodeWork Technologies"],
        "url": BUSINESS_INFO.canonicalUrl,
        "logo": `${BUSINESS_INFO.canonicalUrl}/logo.jpg`,
        "image": `${BUSINESS_INFO.canonicalUrl}/logo.jpg`,
        "telephone": BUSINESS_INFO.telephone,
        "email": BUSINESS_INFO.email,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": BUSINESS_INFO.address.streetAddress,
          "addressLocality": BUSINESS_INFO.address.addressLocality,
          "addressRegion": BUSINESS_INFO.address.addressRegion,
          "postalCode": BUSINESS_INFO.address.postalCode,
          "addressCountry": BUSINESS_INFO.address.addressCountry
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": BUSINESS_INFO.geo.latitude,
          "longitude": BUSINESS_INFO.geo.longitude
        }
      },
      // 2. WebPage Entity
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/live-batches#webpage",
        "url": "https://www.mskinstitute.in/live-batches",
        "name": "Upcoming Live Coding Batches & Admissions | MSK Institute",
        "description": "Inventory of active and upcoming coding cohorts, duration, timings, mentors, and seat availability.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://www.mskinstitute.in/live-batches#breadcrumb",
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
              "name": "Live Batches",
              "item": "https://www.mskinstitute.in/live-batches"
            }
          ]
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".live-batch-hero-desc"]
        }
      },
      // 3. ItemList of Active Batches
      {
        "@type": "ItemList",
        "name": "Upcoming Live Cohorts Inventory",
        "description": "List of active computer coding cohorts open for admission",
        "itemListElement": activeBatches.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.title,
          "url": `https://www.mskinstitute.in/live-batches/${b.id}`
        }))
      },
      // 4. CourseInstance for each batch
      ...batches.map((b) => ({
        "@type": "CourseInstance",
        "name": b.title,
        "description": b.description || b.title,
        "startDate": b.startDate,
        ...(b.endDate ? { "endDate": b.endDate } : {}),
        "courseMode": ["Online", "Offline Classroom"],
        "instructor": {
          "@type": "Person",
          "name": b.instructor,
          "image": b.instructorPicture || "https://www.mskinstitute.in/logo.jpg"
        },
        "provider": {
          "@id": "https://www.mskinstitute.in/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": b.price.replace(/[^\d]/g, '') || "0",
          "priceCurrency": "INR",
          "availability": b.status === 'COMPLETED' || b.status === 'ARCHIVED'
            ? "https://schema.org/Discontinued"
            : b.leftSeats <= 0
            ? "https://schema.org/SoldOut"
            : "https://schema.org/LimitedAvailability",
          "url": `https://www.mskinstitute.in/live-batches/${b.id}`
        }
      })),
      // 5. FAQPage Schema
      {
        "@type": "FAQPage",
        "@id": "https://www.mskinstitute.in/live-batches#faq",
        "mainEntity": batchFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
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
        {/* Header Block with Semantic Hierarchy */}
        <header className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
            <Sparkles className="w-3.5 h-3.5 text-[#B83A00]" />
            Admissions Open • Live Batches
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary leading-tight">
            Upcoming Coding & Programming Batches
          </h1>
          <p className="live-batch-hero-desc text-text-muted text-sm sm:text-base md:text-lg leading-relaxed">
            Choose from our structured training tracks. Attend in our modern Shikohabad computer laboratory or join online live. Register today to lock in your live seat with mentor <strong>Er. Sumit Kumar</strong>.
          </p>
        </header>

        {/* Cross-Linking SEO Bridge to Daily Live Classes Schedule */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">
                Looking for Today&apos;s Daily Live Lecture Timetable?
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Check active Google Meet joining links, topic agendas, and 7-day lecture timetables.
              </p>
            </div>
          </div>
          <Link
            href="/live"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span>View Live Classes & Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Batches Table (Large Screens) & Cards (Mobile/Tablet) */}
        <LiveBatchesClient batches={batches} />
      </div>
    </>
  );
}
