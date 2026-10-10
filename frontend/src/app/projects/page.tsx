import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Code2, Laptop, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { STUDENT_PROJECTS } from '@/data/studentProjects';
import StudentProjectsClient from '@/components/StudentProjectsClient';

export const metadata: Metadata = {
  title: "Student Capstone Projects & Software Showcase | MSK Institute Shikohabad",
  description: "Browse live applications, REST APIs, e-commerce marketplaces, and Power BI dashboards built by students at MSK Institute Shikohabad under the guidance of Er. Sumit Kumar.",
  keywords: [
    "MSK Institute Student Projects",
    "Computer Student Projects Shikohabad",
    "MERN Stack Student Portfolio",
    "Python Projects MSK Institute",
    "Power BI Dashboards Shikohabad",
    "Coding Projects by Students UP"
  ],
  alternates: {
    canonical: "https://www.mskinstitute.in/projects",
  },
  openGraph: {
    title: "Student Projects & Software Showcase | MSK Institute",
    description: "Explore real-world full-stack web applications, Python automation scripts, and BI dashboards developed by MSK Institute trainees.",
    url: "https://www.mskinstitute.in/projects",
    siteName: "MSK Institute",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.mskinstitute.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MSK Institute Student Capstone Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Projects & Software Showcase | MSK Institute",
    description: "Real software projects built by MSK Institute students during hands-on lab training in Shikohabad.",
    images: ["https://www.mskinstitute.in/logo.jpg"],
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/projects#webpage",
        "url": "https://www.mskinstitute.in/projects",
        "name": "Student Projects & Software Showcase | MSK Institute",
        "description": "Showcase of capstone web applications, algorithms, and analytics dashboards built by MSK Institute trainees in Shikohabad.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://www.mskinstitute.in/projects#breadcrumb",
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
              "name": "Student Projects",
              "item": "https://www.mskinstitute.in/projects"
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "name": "MSK Institute Student Capstone Projects",
        "description": "Portfolio of real-world applications created by students",
        "itemListElement": STUDENT_PROJECTS.map((proj, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": proj.title,
          "description": proj.description
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
            <Code2 className="w-3.5 h-3.5" />
            Student Capstone Showcase
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Real Software Built by <span className="text-secondary">MSK Students</span>
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            We believe in learning by building. Our trainees don&apos;t just memorize theory—they construct full-stack web applications, business dashboards, and database systems that solve real problems.
          </p>

          {/* Value Props Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-bold text-primary">
            <div className="p-3 bg-surface rounded-2xl border border-border-subtle flex flex-col items-center text-center gap-1.5">
              <Laptop className="w-4 h-4 text-secondary" />
              <span>100% Practical Labs</span>
            </div>
            <div className="p-3 bg-surface rounded-2xl border border-border-subtle flex flex-col items-center text-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Live Code Reviews</span>
            </div>
            <div className="p-3 bg-surface rounded-2xl border border-border-subtle flex flex-col items-center text-center gap-1.5">
              <Code2 className="w-4 h-4 text-secondary" />
              <span>Production Tech Stacks</span>
            </div>
            <div className="p-3 bg-surface rounded-2xl border border-border-subtle flex flex-col items-center text-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Interview-Ready Portfolios</span>
            </div>
          </div>
        </header>

        {/* Client Interactive Projects Directory */}
        <StudentProjectsClient initialProjects={STUDENT_PROJECTS} />

        {/* Bottom Call to Action */}
        <section className="rounded-3xl bg-primary text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to Build Your Own Software Portfolio?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Join our upcoming live batches in Shikohabad. Learn directly from Er. Sumit Kumar, code real projects from scratch, and graduate with a GitHub portfolio that employers value.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/live-batches"
              className="px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              Explore Upcoming Batches
            </Link>
            <Link
              href="/learning-paths"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-colors"
            >
              View Learning Paths
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
