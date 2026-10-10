import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Compass, ArrowRight, CheckCircle2, Clock, Award, 
  Briefcase, Sparkles, BookOpen, Layers, Target, 
  ShieldCheck, ArrowUpRight, HelpCircle 
} from 'lucide-react';
import { LEARNING_PATHS } from '@/data/learningPaths';

export const metadata: Metadata = {
  title: "Career Learning Paths & Coding Roadmaps | MSK Institute Shikohabad",
  description: "Explore curated step-by-step career roadmaps at MSK Institute: Full-Stack Web Architect, Python Software Developer, Data Analyst & BI Specialist, Computer Applications (CCC & ADCA), and Cyber Security. Designed for beginners in Shikohabad.",
  keywords: [
    "Learning Paths MSK Institute",
    "Full Stack Developer Roadmap Shikohabad",
    "Python Developer Career Path",
    "Data Analyst Roadmap Shikohabad",
    "ADCA 1 Year Diploma Roadmap",
    "Cyber Security Training Shikohabad",
    "Computer Course Curriculum Shikohabad",
    "Coding Roadmap for Beginners"
  ],
  alternates: {
    canonical: "https://www.mskinstitute.in/learning-paths",
  },
  openGraph: {
    title: "Career Learning Paths & Software Roadmaps | MSK Institute",
    description: "Structured, job-ready learning roadmaps with hands-on capstone projects, verified certification, and 1-on-1 mentorship in Shikohabad.",
    url: "https://www.mskinstitute.in/learning-paths",
    siteName: "MSK Institute",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.mskinstitute.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "MSK Institute Career Learning Paths Shikohabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Learning Paths & Software Roadmaps | MSK Institute",
    description: "Step-by-step career pathways from beginner to industry-ready software professional with MSK Institute.",
    images: ["https://www.mskinstitute.in/logo.jpg"],
  },
};

export default function LearningPathsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/learning-paths#webpage",
        "url": "https://www.mskinstitute.in/learning-paths",
        "name": "Career Learning Paths & Software Roadmaps | MSK Institute",
        "description": "Structured curriculum roadmaps for software engineering, data analytics, and computer applications.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://www.mskinstitute.in/learning-paths#breadcrumb",
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
              "name": "Learning Paths",
              "item": "https://www.mskinstitute.in/learning-paths"
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "name": "MSK Institute Career Learning Roadmaps",
        "description": "Structured pathways covering Full-Stack, Python, Data Analytics, Office Diploma, and Cyber Security",
        "itemListElement": LEARNING_PATHS.map((path, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": path.title,
          "description": path.subtitle,
          "url": `https://www.mskinstitute.in/learning-paths#${path.slug}`
        }))
      }
    ]
  };

  const faqs = [
    {
      q: "What is a Learning Path at MSK Institute?",
      a: "A Learning Path is a carefully sequenced sequence of courses and practical milestones designed to take you from your current skill level directly to employment readiness. Rather than wondering which course to study first, our roadmaps lay out exact prerequisite orders, real-world portfolio deliverables, and certification checkpoints."
    },
    {
      q: "Can complete beginners join these learning pathways?",
      a: "Yes! Every pathway starts at foundational fundamentals. For example, the Full-Stack Web Architect pathway begins with basic HTML5 and CSS styling, while the Python Software Engineer pathway starts with basic syntax and logic before moving to advanced algorithms and backend frameworks."
    },
    {
      q: "Can I take individual courses instead of the entire pathway?",
      a: "Absolutely. While the pathways represent the recommended curriculum for complete mastery, you can enroll in individual modules or standalone courses (e.g., just Power BI, just Python, or just CCC) depending on your immediate career or academic needs."
    },
    {
      q: "Do I receive a certificate upon completing a pathway?",
      a: "Yes. Students completing all milestones in a pathway receive an official MSK Institute Diploma / Certificate of Completion equipped with a verifiable QR code and unique Credential ID, verifiable 24/7 on our online portal."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14 sm:space-y-16">
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
            <Compass className="w-3.5 h-3.5" />
            Curated Career Roadmaps
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Step-by-Step <span className="text-secondary">Learning Paths</span> for Real Tech Careers
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Stop guessing what to learn next. Follow our battle-tested curriculum roadmaps engineered by <strong>Er. Sumit Kumar</strong>, with step-by-step milestones, verified capstone projects, and clear career outcomes.
          </p>
          
          {/* Quick jump pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {LEARNING_PATHS.map((path) => (
              <a
                key={path.id}
                href={`#${path.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle hover:border-secondary hover:text-secondary text-xs font-semibold text-primary transition-colors"
              >
                <span>{path.title.replace(' Pathway', '')}</span>
              </a>
            ))}
          </div>
        </header>

        {/* Learning Paths List */}
        <div className="space-y-16">
          {LEARNING_PATHS.map((path) => (
            <article
              id={path.slug}
              key={path.id}
              className="scroll-mt-24 bg-white rounded-3xl border border-border-subtle shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Header Banner */}
              <div className="bg-gradient-to-r from-surface via-surface to-white p-6 sm:p-8 border-b border-border-subtle">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {path.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
                          {path.badge}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-text-muted">
                        {path.level}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                        <Clock className="w-3.5 h-3.5" />
                        {path.duration}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
                      {path.title}
                    </h2>
                    <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                      {path.subtitle}
                    </p>
                  </div>

                  {/* Career Quick Stats */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-border-subtle shadow-2xs space-y-3 min-w-[260px] flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span>Target Roles:</span>
                    </div>
                    <p className="text-xs font-semibold text-primary line-clamp-2">
                      {path.targetRole}
                    </p>
                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">Salary Range:</span>
                      <span className="font-extrabold text-emerald-700">{path.salaryRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathway Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Prerequisites & Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface/50 rounded-2xl p-5 border border-border-subtle text-xs">
                  <div className="space-y-1.5">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-secondary" />
                      Prerequisites:
                    </div>
                    <p className="text-text-muted leading-relaxed">{path.prerequisites}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Certification Awarded:
                    </div>
                    <p className="text-text-muted leading-relaxed">{path.certification}</p>
                  </div>
                </div>

                {/* Step by Step Milestones Roadmap */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <Layers className="w-5 h-5 text-secondary" />
                      Curriculum Roadmap ({path.steps.length} Milestones)
                    </h3>
                    <span className="text-xs text-text-muted">Sequenced Prerequisite Order</span>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-4 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-subtle">
                    {path.steps.map((step) => (
                      <div 
                        key={step.stepNumber} 
                        className="relative pl-10 sm:pl-12 space-y-3"
                      >
                        {/* Step Marker Circle */}
                        <div className="absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-xs ring-4 ring-white">
                          0{step.stepNumber}
                        </div>

                        <div className="bg-surface/30 rounded-2xl border border-border-subtle p-4 sm:p-5 space-y-3 hover:bg-surface/60 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-[#B83A00] bg-[#B83A00]/10 px-2 py-0.5 rounded uppercase">
                                  Step {step.stepNumber} • {step.duration}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-primary">{step.title}</h4>
                            </div>

                            <Link
                              href={`/courses/${step.courseSlug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-light group flex-shrink-0"
                            >
                              <span>Explore Course</span>
                              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>

                          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                            {step.description}
                          </p>

                          {/* Skills tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {step.skills.map((skill) => (
                              <span 
                                key={skill}
                                className="text-[11px] font-medium bg-white border border-border-subtle text-primary px-2.5 py-1 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Capstone Deliverable */}
                          <div className="pt-2 border-t border-border-subtle/80 flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-text-muted">
                              <strong>Capstone Project:</strong> {step.deliverable}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Outcomes Checklist */}
                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                    Key Competencies & Job Readiness Outcomes:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {path.careerOutcomes.map((outcome, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2 text-xs text-text-muted">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pathway Action Bar */}
                <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Includes 1-on-1 practical lab slots & verified online certificate</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <span>Counseling & Demo Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pathway FAQ Section */}
        <section className="bg-surface/50 rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-secondary font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Questions About Learning Pathways?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {faqs.map((faq, fIdx) => (
              <div key={fIdx} className="bg-white p-5 rounded-2xl border border-border-subtle space-y-2">
                <h3 className="font-bold text-primary text-sm sm:text-base">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Bottom CTA */}
        <section className="rounded-3xl bg-primary text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black">
              Unsure Which Pathway Matches Your Background?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Book a free 1-on-1 counseling session with Er. Sumit Kumar at our Shikohabad campus. We will assess your interests, educational background, and career goals to customize your personalized learning roadmap.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              Book Free Counseling Session
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Browse All Courses
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
