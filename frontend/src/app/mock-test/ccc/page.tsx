import { Metadata } from 'next';
import Link from 'next/link';
import { Award, BookOpen, Clock, ShieldCheck, CheckCircle2, Languages, HelpCircle } from 'lucide-react';
import CccExamSimulator from '@/components/CccExamSimulator';

export const metadata: Metadata = {
  title: "Free NIELIT CCC Mock Test 2026 (Bilingual Hindi/English) | MSK Institute",
  description: "Attempt free online NIELIT CCC practice mock test with real timer, bilingual Hindi/English questions, instant digital scorecard, and WhatsApp sharing. Prepared by MSK Institute Shikohabad.",
  keywords: [
    "NIELIT CCC Mock Test 2026",
    "Free CCC Online Test in Hindi",
    "CCC Practice Questions Shikohabad",
    "CCC Exam Paper with Answers",
    "UP Police CCC Certificate Test",
    "LibreOffice CCC MCQ",
    "MSK Institute CCC Mock Test"
  ],
  alternates: {
    canonical: "https://www.mskinstitute.in/mock-test/ccc",
  },
  openGraph: {
    title: "Free NIELIT CCC Mock Test 2026 (Hindi & English) | MSK Institute",
    description: "Real exam simulation with instant digital scorecard, timer, and detailed explanations for UP Govt job aspirants.",
    url: "https://www.mskinstitute.in/mock-test/ccc",
    siteName: "MSK Institute",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.mskinstitute.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Free NIELIT CCC Online Mock Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free NIELIT CCC Mock Test 2026 | MSK Institute",
    description: "Practice official pattern CCC questions in Hindi/English with instant grade calculation and score sharing.",
    images: ["https://www.mskinstitute.in/logo.jpg"],
  },
};

export default function CccMockTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/mock-test/ccc#webpage",
        "url": "https://www.mskinstitute.in/mock-test/ccc",
        "name": "Free NIELIT CCC Mock Test 2026 (Bilingual Hindi/English) | MSK Institute",
        "description": "Attempt official-pattern NIELIT CCC practice exam questions online with timer and instant scorecard.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://www.mskinstitute.in/mock-test/ccc#breadcrumb",
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
              "name": "CCC Mock Test",
              "item": "https://www.mskinstitute.in/mock-test/ccc"
            }
          ]
        }
      },
      {
        "@type": "Quiz",
        "name": "NIELIT CCC Exam Practice Test",
        "description": "20 bilingual practice questions covering Computer Fundamentals, LibreOffice (Writer, Calc, Impress), Networking, and Cyber Security.",
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "alignmentType": "educationalSubject",
          "targetName": "Computer Concepts & Digital Literacy"
        }
      }
    ]
  };

  const examFaqs = [
    {
      q: "What is the passing criteria for the NIELIT CCC examination?",
      a: "To qualify the NIELIT CCC exam, a candidate must score a minimum of 50% marks. Grades awarded are: Grade S (85% and above), Grade A (75% to 84%), Grade B (65% to 74%), Grade C (55% to 64%), and Grade D (50% to 54%)."
    },
    {
      q: "Is there any negative marking in the official CCC exam?",
      a: "No! There is zero negative marking in the NIELIT CCC exam. Candidates should attempt all 100 questions."
    },
    {
      q: "Does this mock test cover the latest LibreOffice syllabus?",
      a: "Yes. In the official NIELIT exam pattern, questions on LibreOffice (Writer, Calc, and Impress) are asked instead of Microsoft Office. Our mock test is 100% updated with LibreOffice shortcuts and features."
    },
    {
      q: "Where can I attend CCC classroom coaching in Shikohabad?",
      a: "MSK Institute conducts daily offline practical computer batches at Gali No. 3, Near Gyan Jyoti Public School, Station Road Area, Shikohabad. We offer 1-student-1-PC policy and 100% pass guarantee guidance by Er. Sumit Kumar."
    }
  ];

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
            <Award className="w-3.5 h-3.5" />
            100% Free Practice Exam
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            NIELIT CCC <span className="text-secondary">Online Mock Test</span> Simulator
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Practice latest 2026 exam pattern questions in <strong>Hindi & English</strong>. Real countdown timer, instant digital scorecard, and verified grading to ensure Grade S / A in your official exam.
          </p>

          {/* Quick Perks */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Bilingual (हिंदी / English)
            </span>
            <span className="flex items-center gap-1.5 text-secondary">
              <Clock className="w-4 h-4" />
              Real Exam Timer
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Instant Scorecard & Share
            </span>
          </div>
        </header>

        {/* The Live Interactive Exam Simulator */}
        <CccExamSimulator />

        {/* Informational Guidance Section */}
        <section className="bg-surface/50 rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
              About NIELIT CCC Examination
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Course on Computer Concepts (CCC) is essential for Uttar Pradesh State Government jobs including UP Police, VDO, Lekhpal, and Junior Assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {examFaqs.map((faq, fIdx) => (
              <div key={fIdx} className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
                <h3 className="font-bold text-primary text-sm sm:text-base flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Offline Center Callout */}
          <div className="bg-white rounded-2xl border border-border-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-base text-primary">
                Need In-Person Computer Training in Shikohabad?
              </h4>
              <p className="text-xs text-text-muted">
                Visit MSK Institute at Gali No. 3, Near Gyan Jyoti Public School, Station Road. Free demo classes available daily.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
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
