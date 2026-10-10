import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, Award, GraduationCap, CheckCircle2, ChevronRight, 
  MapPin, Users, Calendar, Trophy, Sparkles, ShieldCheck, 
  HelpCircle, PhoneCall, Laptop, Clock, ArrowRight, Video, Code2,
  Star, Quote, Building2, XCircle, MessageSquare, Flame, Compass, Languages 
} from 'lucide-react';
import { fetchCourses, fetchLiveBatches } from '@/services/api';
import { getBranchSummaries } from '@/lib/branches';
import HomeHeroBatchCard from '@/components/HomeHeroBatchCard';
import HomeDemoBookingSection from '@/components/HomeDemoBookingSection';
import HomeFeaturedCourses from '@/components/HomeFeaturedCourses';
import { parseBatchStartTimestamp } from '@/lib/batchUtils';
import CountdownTimer from '@/components/CountdownTimer';
import HomeFaqAccordion from '@/components/HomeFaqAccordion';
import { SocialCommunitySection } from '@/components/SocialLinks';
import { Course, LiveBatch } from '@/types';

export const revalidate = 60; // Refresh live batch schedules every 60s

export const metadata: Metadata = {
  title: 'MSK Institute | Premier Computer Training & Coding Academy in Shikohabad',
  description: 'Learn Python programming, Full-Stack MERN Web Development, NIELIT CCC, and ADCA with hands-on lab training at MSK Institute Shikohabad. Live mentorship by Er. Sumit Kumar and verifiable graduation certificates.',
  keywords: [
    'MSK Institute',
    'Computer Institute Shikohabad',
    'Best Coding Classes in Shikohabad',
    'Computer Training Centre Shikohabad',
    'Python Coaching Shikohabad',
    'MERN Stack Development Shikohabad',
    'NIELIT CCC Course Shikohabad',
    'ADCA Diploma Shikohabad',
    'Er. Sumit Kumar Shikohabad',
    'Computer Center Near Station Road Shikohabad',
    'Web Development Institute UP',
    'Online Computer Classes UP'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in',
  },
  openGraph: {
    title: 'MSK Institute | Computer Training & Coding Academy in Shikohabad',
    description: 'Learn Python, Full-Stack Web Development, CCC, and MS Office with practical labs and mentorship at MSK Institute Shikohabad.',
    url: 'https://www.mskinstitute.in',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Shikohabad Computer & Coding Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSK Institute | Computer Training & Coding Academy',
    description: 'Learn Python, Web Development, CCC, and ADCA with practical offline lab sessions at MSK Institute, Shikohabad.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function HomePage() {
  let allPublishedCourses: Course[] = [];
  let featuredCourses: Course[] = [];
  let allBatches: LiveBatch[] = [];
  let branchCount = 2;

  let publishedCoursesCount = 66;

  try {
    const [courses, batches, branches] = await Promise.all([
      fetchCourses(),
      fetchLiveBatches(),
      getBranchSummaries(),
    ]);
    const publishedCourses = courses.filter(c => c.status === 'PUBLISH');
    allPublishedCourses = publishedCourses;
    publishedCoursesCount = publishedCourses.length;
    featuredCourses = publishedCourses.slice(0, 3);
    allBatches = batches || [];
    branchCount = branches.length;
  } catch (error) {
    console.error('Failed to load courses or live batches for homepage', error);
  }

  const now = Date.now();
  const upcomingBatches = [...allBatches]
    .filter((b) => parseBatchStartTimestamp(b) > now)
    .sort((a, b) => parseBatchStartTimestamp(a) - parseBatchStartTimestamp(b));

  const hasLiveBatches = allBatches.length > 0;
  const upcomingBatch = upcomingBatches[0] || (hasLiveBatches ? allBatches[0] : null);
  const countdownDateString = upcomingBatch
    ? upcomingBatch.startDateTime || (parseBatchStartTimestamp(upcomingBatch) ? new Date(parseBatchStartTimestamp(upcomingBatch)).toISOString() : `${upcomingBatch.startDate}T09:00:00`)
    : '';

  const stats = [
    { id: 1, name: 'Students Trained', value: '1,200+', icon: Users },
    { id: 2, name: 'Practical Lab Focus', value: '100%', icon: Laptop },
    { id: 3, name: 'Active Courses', value: `${publishedCoursesCount || 66}+`, icon: BookOpen },
    { id: 4, name: 'Verified Graduates', value: '500+', icon: Award },
  ];

  const features = [
    {
      title: 'Practical Labs & Offline Classes',
      description: 'Hands-on learning directly in our smart computer labs with individual focus on each student in Shikohabad.',
      icon: GraduationCap,
    },
    {
      title: 'Industry-Standard Certification',
      description: 'Official MSK Institute Verifiable Certificates with 24/7 digital QR verification and NIELIT CCC/O-Level exam preparation.',
      icon: Award,
    },
    {
      title: 'Flexible Morning & Evening Batches',
      description: 'Convenient weekday and weekend schedules for school students, college undergraduates, and working professionals.',
      icon: Calendar,
    },
    {
      title: 'Lifetime Study Material Access',
      description: 'Get free, persistent access to digital revision sheets, PDF notes archives, and GitHub coding repositories.',
      icon: CheckCircle2,
      href: '/study-material',
    },
  ];

  const homeFaqs = [
    {
      q: "What is MSK Institute and where is it located in Shikohabad?",
      a: "MSK Institute is Shikohabad's premier computer training and software coding academy. It is located at Gali No. 3, Near Gyan Jyoti Public School, Station Road Area, Shikohabad (Firozabad District, Uttar Pradesh 283135). We offer modern air-conditioned computer labs with high-speed internet and power backup."
    },
    {
      q: "What computer and coding courses are offered at MSK Institute?",
      a: "We offer career-oriented software tracks including Python Programming Masterclass, Full-Stack Web Development Bootcamp (MERN Stack: React, Node.js, Express, MongoDB), Responsive Frontend Design (HTML5, Tailwind CSS), NIELIT CCC (Course on Computer Concepts), and 1-Year ADCA (Advanced Diploma in Computer Applications)."
    },
    {
      q: "Who teaches the classes and conducts mentorship at MSK Institute?",
      a: "All software engineering courses and live bootcamps are mentored by Er. Sumit Kumar, Senior Software Engineer and Lead Instructor with over 8 years of industry experience in programming and full-stack web architecture."
    },
    {
      q: "How does online certificate verification work for MSK graduates?",
      a: "Every graduate receives a unique Certificate Verification ID printed on their official award. Anyone (employers, universities, students) can authenticate the certificate 24/7 on our online portal at https://www.mskinstitute.in/verify-certificate."
    },
    {
      q: "Can prospective students attend a free demo class before enrollment?",
      a: "Yes! MSK Institute offers free trial demo classes for both online live batches and offline classroom labs in Shikohabad. You can book a free demo session online or visit our centre."
    },
    {
      q: "Are live online classes available for remote students?",
      a: "Yes! Remote students can join real-time interactive lectures via Google Meet, YouTube Live, and Zoom with screen sharing, live audio doubt clearance, and countdown schedules on our Live portal (https://www.mskinstitute.in/live)."
    }
  ];

  const studentReviews = [
    {
      name: "Aman Sharma",
      course: "Python Programming Masterclass",
      badge: "Project Developer",
      rating: 5,
      date: "August 2026",
      feedback: "Learned Python programming from basics to building real automation projects in the offline lab. The 1-on-1 mentor guidance by Sumit Sir helped me build true confidence in coding.",
      initials: "AS"
    },
    {
      name: "Priya Yadav",
      course: "NIELIT CCC Certification",
      badge: "Grade A Certified",
      rating: 5,
      date: "August 2026",
      feedback: "Cleared NIELIT CCC with Grade A in my first attempt! The mock test series and practical LibreOffice sessions in the Shikohabad lab were exact to the real exam pattern.",
      initials: "PY"
    },
    {
      name: "Rohan Verma",
      course: "Full-Stack Web Development",
      badge: "Web Dev Intern",
      rating: 5,
      date: "July 2026",
      feedback: "The Full-Stack Web Development roadmap is modern and industry-level. Building React and Node.js projects helped me land my first tech internship. Best coding institute in Shikohabad!",
      initials: "RV"
    },
    {
      name: "Neha Gupta",
      course: "ADCA Diploma (1-Year)",
      badge: "1st Rank Diploma",
      rating: 5,
      date: "July 2026",
      feedback: "Best computer lab in Shikohabad. High-speed optical fiber internet, dedicated PCs, and zero power cuts. Highly recommended for students who want practical skills instead of just theory.",
      initials: "NG"
    }
  ];

  // Comprehensive JSON-LD Schema Graph for AI Agents, Perplexity, Google, ChatGPT & Search Crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Root Organization Entity
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": "https://www.mskinstitute.in/#organization",
        "name": "MSK Institute",
        "alternateName": ["MSK Computer Institute", "MSK Institute Shikohabad", "MSK Coding Academy"],
        "url": "https://www.mskinstitute.in",
        "logo": "https://www.mskinstitute.in/logo.jpg",
        "image": "https://www.mskinstitute.in/logo.jpg",
        "description": "Premier Computer & Coding Training Institute in Shikohabad providing practical software engineering bootcamps, Python programming, MERN full-stack development, and government certified computer courses.",
        "telephone": "+91-8393042166",
        "email": "mskshikohabad@gmail.com",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gali No. 3, Near Gyan Jyoti Public School",
          "addressLocality": "Shikohabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "283135",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 27.1157743,
          "longitude": 78.5829716
        },
        "hasMap": "https://maps.google.com/?q=MSK+Institute+Shikohabad",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "14:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Aman Sharma" },
            "datePublished": "2026-08-15",
            "reviewBody": "Learned Python programming from basics to building real automation projects in the offline lab. The 1-on-1 mentor guidance by Sumit Sir helped me build true confidence in coding.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Priya Yadav" },
            "datePublished": "2026-08-28",
            "reviewBody": "Cleared NIELIT CCC with Grade A in my first attempt! The mock test series and practical LibreOffice sessions were exact to exam pattern.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          }
        ],
        "founder": {
          "@type": "Person",
          "name": "Er. Sumit Kumar",
          "jobTitle": "Lead Instructor & Software Engineer"
        }
      },
      // 2. WebSite Entity with SearchAction
      {
        "@type": "WebSite",
        "@id": "https://www.mskinstitute.in/#website",
        "url": "https://www.mskinstitute.in",
        "name": "MSK Institute",
        "publisher": {
          "@id": "https://www.mskinstitute.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.mskinstitute.in/courses?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      // 3. WebPage Entity
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/#webpage",
        "url": "https://www.mskinstitute.in",
        "name": "MSK Institute | Premier Computer Training & Coding Academy in Shikohabad",
        "description": "Learn Python programming, Full-Stack MERN Web Development, NIELIT CCC, and ADCA with hands-on lab training at MSK Institute Shikohabad.",
        "isPartOf": {
          "@id": "https://www.mskinstitute.in/#website"
        },
        "about": [
          { "@type": "Thing", "name": "Computer Programming" },
          { "@type": "Thing", "name": "Software Engineering" },
          { "@type": "Thing", "name": "Full-Stack Web Development" },
          { "@type": "Thing", "name": "Python" },
          { "@type": "Thing", "name": "NIELIT CCC" }
        ],
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".home-hero-desc", ".home-faq-answer", ".home-about-summary"]
        }
      },
      // 4. Featured Course List
      {
        "@type": "ItemList",
        "name": "Popular Courses at MSK Institute",
        "itemListElement": featuredCourses.map((c, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Course",
            "@id": `https://www.mskinstitute.in/courses/${c.slug}`,
            "name": c.title,
            "description": c.shortDescription,
            "provider": {
              "@id": "https://www.mskinstitute.in/#organization"
            }
          }
        }))
      },
      // 5. FAQPage Schema for AI Engines
      {
        "@type": "FAQPage",
        "@id": "https://www.mskinstitute.in/#faq",
        "mainEntity": homeFaqs.map((faq) => ({
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

      <div className="space-y-16 pb-16">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-br from-surface to-white border-b border-border-subtle overflow-hidden">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-8 lg:pb-16 ${hasLiveBatches ? 'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center' : 'max-w-4xl mx-auto flex flex-col items-center text-center space-y-6'}`}>
            <header className={`space-y-6 ${hasLiveBatches ? '' : 'flex flex-col items-center text-center'}`}>
              <div className={`flex flex-wrap items-center gap-2 ${hasLiveBatches ? '' : 'justify-center'}`}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Shikohabad&apos;s Premier Coding Academy • Rated 4.9/5
                </span>
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Now Hiring: Internships & Jobs
                </Link>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary leading-tight">
                Empower Your Career with <span className="text-secondary">Practical Coding</span> Skills
              </h1>
              <p className={`home-hero-desc text-base sm:text-lg text-text-muted ${hasLiveBatches ? 'max-w-xl' : 'max-w-2xl'} leading-relaxed`}>
                Join <strong>MSK Institute</strong> in Shikohabad to learn Python, Full-Stack Web Development, and essential computer concepts with hands-on lab projects and direct mentorship by <strong>Er. Sumit Kumar</strong>.
              </p>
              <div className={`flex flex-wrap gap-3 pt-2 ${hasLiveBatches ? '' : 'justify-center'}`}>
                <a
                  href="#book-demo"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Free Demo Class</span>
                  <span className="text-xs">➔</span>
                </a>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-5 py-3.5 bg-white border border-border-subtle hover:bg-surface text-primary font-bold text-sm rounded-xl shadow-2xs transition-all duration-200"
                >
                  Explore Courses
                  <ChevronRight className="w-4 h-4 ml-1 text-text-muted" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center justify-center px-4 py-3.5 border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 text-secondary font-bold rounded-xl transition-all duration-200 gap-1.5 text-sm"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Try Playground</span>
                </Link>
              </div>

              {/* High-Trust Social Proof Strip */}
              <div className={`pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-text-muted ${hasLiveBatches ? '' : 'justify-center'}`}>
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-primary ml-1">4.9/5</span>
                  <span className="text-text-muted font-normal">(128+ Reviews)</span>
                </div>
                <span className="hidden sm:inline text-gray-300">•</span>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  <span>1,200+ Students Mentored</span>
                </div>
                <span className="hidden sm:inline text-gray-300">•</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Practical Labs</span>
                </div>
              </div>
            </header>

            {hasLiveBatches && <HomeHeroBatchCard initialBatches={allBatches} />}
          </div>
        </section>

        {/* 2. Stats Dashboard */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-2xl border border-border-subtle shadow-sm">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="text-center p-4 border-r last:border-r-0 border-border-subtle flex flex-col items-center justify-center">
                  <div className="p-3 bg-secondary/10 rounded-full text-secondary mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <div className="text-sm font-medium text-text-muted mt-1">{stat.name}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2.5 Viral Interactive Tools: CCC Mock Test & Career Finder */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: CCC Online Mock Test */}
            <div className="relative bg-gradient-to-br from-white via-surface/40 to-white p-6 sm:p-8 rounded-3xl border-2 border-secondary/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#B83A00]/10 text-[#B83A00] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Free Practice Simulator
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5" />
                    हिंदी & English
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-primary group-hover:text-secondary transition-colors">
                    NIELIT CCC Online Mock Test 2026
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    Practice authentic exam pattern questions for UP Police, Lekhpal, and Govt recruitments. Real timer, instant digital scorecard, and 1-click WhatsApp status sharing.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-text-muted">
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">⏱️ 25 Mins Timer</span>
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">📊 Instant Grade S/A</span>
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">📲 WhatsApp Scorecard</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted">Zero Registration Required</span>
                <Link
                  href="/mock-test/ccc"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <span>Start Free Test</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: AI Career & Course Finder */}
            <div className="relative bg-gradient-to-br from-white via-surface/40 to-white p-6 sm:p-8 rounded-3xl border-2 border-secondary/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-secondary/10 text-secondary flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    60-Second Quiz
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    100% Free Guidance
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-primary group-hover:text-secondary transition-colors">
                    Find Your Ideal Course in 60s
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    Confused between CCC, ADCA, Python, or Full-Stack? Answer 4 quick questions about your education and goals to unlock your tailored roadmap and expected starting salary.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-text-muted">
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">🎯 Tailored Track</span>
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">💼 Salary Outlook</span>
                  <span className="bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">📚 Custom Syllabus</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted">Personalized Recommendation</span>
                <Link
                  href="/career-finder"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <span>Take Career Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Free Demo Booking Section */}
        <HomeDemoBookingSection />

        {/* 4. Course Highlights & Interactive Category Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Career-Ready Tracks
            </span>
            <h2 className="text-3xl font-extrabold text-primary">Our Popular Programs</h2>
            <p className="text-text-muted leading-relaxed">
              Explore our curated curricula built according to modern industry expectations. Build real-world portfolio projects and get certified upon completion.
            </p>
          </div>

          <HomeFeaturedCourses courses={allPublishedCourses} />
        </section>

        {/* 5. Features Grid */}
        <section className="bg-surface border-y border-border-subtle py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                The MSK Advantage
              </span>
              <h2 className="text-3xl font-extrabold text-primary">Why Study at MSK Institute?</h2>
              <p className="text-text-muted leading-relaxed">
                We focus on building practical coding competencies, real projects, and logical reasoning rather than just rote memorization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-border-subtle shadow-xs">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary flex-shrink-0 h-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-lg text-primary">{feature.title}</h3>
                      <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
                      {feature.href && (
                        <Link
                          href={feature.href}
                          className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-light transition-colors pt-1"
                        >
                          Browse Study Material Hub
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Distinction Card */}
            <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-xs">
              <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  The MSK Standard
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-primary">
                  How We Compare with Traditional Centers
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Traditional Centers */}
                <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-3">
                  <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Typical Local Computer Centers</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Shared PCs (2 to 3 students forced to share one screen).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Outdated theory books & notes with minimal project work.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Frequent power cuts disrupting daily lab sessions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>Paper certificates that cannot be verified online.</span>
                    </li>
                  </ul>
                </div>

                {/* MSK Institute */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    <span>MSK Institute Advantage</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-text-main font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>1 Student : 1 PC Policy:</strong> Dedicated computer workstation for every single learner.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Industry-Grade Practical Labs:</strong> Build real-world portfolio code & GitHub repositories.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Zero Power Cut Disruption:</strong> Heavy-duty generator & inverter power backup.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Instant QR Verification:</strong> 24/7 digital certificate validation portal.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Student Reviews & Google Trust Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0 Rating on Google Reviews</span>
            </div>
            <h2 className="text-3xl font-extrabold text-primary">
              Student Reviews & Success Stories
            </h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Read how students from Shikohabad and Firozabad district transformed their computer skills, cleared government exams, and started coding at MSK Institute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentReviews.map((rev, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border-subtle p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Feedback Quote */}
                  <p className="text-text-main text-sm leading-relaxed italic">
                    "{rev.feedback}"
                  </p>
                </div>

                {/* Author Card with Achievement Badge */}
                <div className="pt-4 mt-4 border-t border-border-subtle space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {rev.initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-primary truncate">{rev.name}</div>
                      <div className="text-xs text-text-muted truncate">{rev.course}</div>
                    </div>
                  </div>
                  {rev.badge && (
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ {rev.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <a
              href="https://maps.google.com/?q=MSK+Institute+Shikohabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-secondary hover:text-secondary-light transition-colors"
            >
              <span>Read 120+ Verified Reviews on Google Maps</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 7. Active Student & Developer Community (Social Proof) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialCommunitySection 
            title="Join 1,200+ Students in the MSK Developer Community"
            subtitle="Subscribe for free tutorials on YouTube, see daily lab sessions on Instagram, connect with alumni on LinkedIn, and ask questions on WhatsApp."
          />
        </section>

        {/* 8. Frequently Asked Questions & Academic Counseling */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-primary">Frequently Asked Questions</h2>
            <p className="text-text-muted text-sm max-w-xl mx-auto leading-relaxed">
              Everything you need to know about MSK Institute, computer courses, certificates, and demo admissions in Shikohabad.
            </p>
          </div>

          <HomeFaqAccordion faqs={homeFaqs} />

          {/* Academic Counseling Banner */}
          <div className="bg-surface rounded-2xl border border-border-subtle p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left mt-8">
            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Still Have Questions?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                Not sure which course or roadmap is right for you?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Talk directly to Er. Sumit Kumar or our academic counseling team for free 1-on-1 guidance.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
              <a
                href="https://wa.me/918393042166?text=Hello%20MSK%20Institute%2C%20I%20need%20academic%20counseling%20regarding%20courses."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+918393042166"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Counselor</span>
              </a>
            </div>
          </div>
        </section>

        {/* 8. Local Trust, Campus & Google Maps Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-secondary font-bold text-sm">
                <MapPin className="w-4.5 h-4.5" />
                Physical Campus Location
              </div>
              <h2 className="text-3xl font-extrabold text-primary">
                Visit our Offline Training Lab
              </h2>
              <p className="home-about-summary text-text-muted leading-relaxed">
                We are located in Shikohabad at <strong>Gali No. 3, Near Gyan Jyoti Public School, Station Road Area</strong>. Our campus is open Monday through Saturday from 8:00 AM to 7:00 PM (Sunday 10:00 AM to 2:00 PM for counseling & demos) for practical lab training, mentorship, and admissions.
              </p>
              
              {/* Campus Infrastructure Highlights */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-surface border border-border-subtle text-xs font-bold text-primary flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>1 Student : 1 PC Policy</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border-subtle text-xs font-bold text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Generator Backup</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border-subtle text-xs font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>AC Classrooms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border-subtle text-xs font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Optical Fiber Wi-Fi</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="font-medium">Air-conditioned modern classrooms & smart lab setups</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="font-medium">High-speed optical fiber Wi-Fi & continuous generator backup</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="font-medium">Dedicated individual PC coding stations for offline practicals</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="tel:+918393042166"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Us: +91 83930 42166</span>
                </a>
                <a
                  href="https://maps.google.com/?q=MSK+Institute+Shikohabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-border-subtle hover:bg-surface text-primary font-bold text-xs rounded-xl transition-colors"
                >
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Open in Google Maps</span>
                </a>
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-surface hover:bg-border-subtle text-primary font-bold text-xs rounded-xl border border-border-subtle transition-colors"
                >
                  <Building2 className="w-4 h-4 text-secondary" />
                  <span>View All Campuses ({branchCount})</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-96 w-full rounded-2xl overflow-hidden border border-border-subtle shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3551.2868286012636!2d78.5829716!3d27.1157743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39744bce0745fc55%3A0xaca626641b821c20!2sMSK%20Institute!5e0!3m2!1sen!2sin!4v1787736706091!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MSK Institute Location Map Shikohabad"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

