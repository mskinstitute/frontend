import { Metadata } from 'next';
import Link from 'next/link';
import { 
  GraduationCap, Award, Users, Laptop, CheckCircle2, 
  MapPin, Phone, Mail, Sparkles, BookOpen, Trophy, 
  ChevronRight, HeartHandshake, ShieldCheck, Target, 
  Lightbulb, ExternalLink, Linkedin, Github, Youtube
} from 'lucide-react';
import { SocialCommunitySection } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'About Us | MSK Institute & Er. Sumit Kumar | Shikohabad',
  description: 'Learn about MSK Institute Shikohabad, founded by Er. Sumit Kumar. Our mission is to empower students with practical coding skills, modern computer labs, and verifiable tech certifications.',
  keywords: [
    'About MSK Institute',
    'Er. Sumit Kumar Shikohabad',
    'Best Computer Institute in Shikohabad',
    'MSK Institute History & Mission',
    'Software Training Center Shikohabad',
    'Coding Academy Firozabad'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/about',
  },
  openGraph: {
    title: 'About MSK Institute | Premier Coding & Computer Academy in Shikohabad',
    description: 'Empowering students across Shikohabad and online with practical coding skills in Python, Full-Stack Web Development, and NIELIT computer courses under Er. Sumit Kumar.',
    url: 'https://www.mskinstitute.in/about',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Shikohabad About Us',
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About MSK Institute',
    url: 'https://www.mskinstitute.in/about',
    description: 'Overview of MSK Institute, founding story, mission, and lead mentor Er. Sumit Kumar.',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'MSK Institute of Technology & Coding',
      alternateName: 'MSK Institute',
      url: 'https://www.mskinstitute.in',
      logo: 'https://www.mskinstitute.in/logo.jpg',
      founder: {
        '@type': 'Person',
        name: 'Er. Sumit Kumar',
        jobTitle: 'Lead Mentor & Founder',
        description: 'Software Engineer and Computer Science educator committed to practical, project-based learning.',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School',
        addressLocality: 'Shikohabad',
        addressRegion: 'Uttar Pradesh',
        postalCode: '283135',
        addressCountry: 'IN',
      },
      telephone: '+91-8393042166',
      email: 'mskshikohabad@gmail.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.mskinstitute.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Us',
          item: 'https://www.mskinstitute.in/about',
        },
      ],
    },
  };

  const values = [
    {
      icon: Laptop,
      title: '100% Practical Lab Training',
      description: 'We believe you cannot learn coding by reading a book. Every student sits on an individual high-speed workstation and writes code from day one.',
    },
    {
      icon: HeartHandshake,
      title: 'Direct Personal Mentorship',
      description: 'Small batch sizes ensure Er. Sumit Kumar and senior faculty personally review your code, debug errors with you, and guide your career steps.',
    },
    {
      icon: Target,
      title: 'Career & Industry Relevance',
      description: 'Our curriculum focuses on modern in-demand stacks: Python 3, React, Tailwind CSS, SQL, Git/GitHub, and official NIELIT CCC exam frameworks.',
    },
    {
      icon: ShieldCheck,
      title: 'Verifiable Digital Credentials',
      description: 'Every graduate receives an official verifiable credential on our public portal, ensuring complete credibility for job recruiters and academic institutions.',
    },
  ];

  const milestones = [
    { number: '1,200+', label: 'Students Trained', sub: 'Across Offline & Online Batches' },
    { number: '1,600+', label: 'Free Online Tutorials', sub: 'Published on our Tech Portal' },
    { number: '98%', label: 'Practical Success Rate', sub: 'In Project Submissions & Exams' },
    { number: '500+', label: 'Verified Certificates', sub: 'Issued & Authenticated Online' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-16 pb-20">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-br from-surface to-white border-b border-border-subtle py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              Mastering Software Knowledge
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tight leading-tight">
              Empowering Shikohabad with <span className="text-secondary">Practical Tech</span> Education
            </h1>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              At <strong>MSK Institute</strong>, we bridge the gap between textbook degrees and industry skills. Founded by <strong>Er. Sumit Kumar</strong>, our physical computer lab in Shikohabad and live online classes have helped over 1,200+ students master practical coding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
              >
                <span>Explore Our Courses</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-surface hover:bg-white border border-border-subtle text-primary font-bold rounded-xl shadow-xs transition-colors"
              >
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Visit Campus in Shikohabad</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Stats Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-border-subtle shadow-sm">
            {milestones.map((item, idx) => (
              <div key={idx} className="text-center p-4 border-r last:border-r-0 border-border-subtle flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-black text-primary">{item.number}</div>
                <div className="text-sm font-bold text-secondary mt-1">{item.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Founder Story & Philosophy */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-border-subtle p-8 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-secondary/10 p-2 border-4 border-secondary/20 shadow-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="Er. Sumit Kumar - Founder MSK Institute"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute bottom-2 right-2 px-3 py-1 bg-secondary text-white text-[11px] font-black uppercase rounded-full shadow">
                  Lead Mentor
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary">Er. Sumit Kumar</h2>
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mt-0.5">
                  Founder & Senior Software Educator
                </p>
                <p className="text-xs text-text-muted mt-1">
                  B.Tech (Computer Science & Engineering)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted bg-surface px-4 py-2 rounded-xl border border-border-subtle">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>&quot;Ratta maarne ke bajaye practical code build karo.&quot;</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://linkedin.com/company/msk-institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-surface hover:bg-[#0A66C2] hover:text-white border border-border-subtle rounded-lg text-xs font-bold text-primary flex items-center gap-1.5 transition-colors"
                  title="Connect with Er. Sumit Kumar on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/mskinstitute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-surface hover:bg-slate-900 hover:text-white border border-border-subtle rounded-lg text-xs font-bold text-primary flex items-center gap-1.5 transition-colors"
                  title="View MSK GitHub Repositories"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://youtube.com/@mskinstitute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-surface hover:bg-red-600 hover:text-white border border-border-subtle rounded-lg text-xs font-bold text-primary flex items-center gap-1.5 transition-colors"
                  title="Watch Coding Lectures on YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-text-muted text-sm sm:text-base leading-relaxed">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-secondary">Our Story</span>
                <h3 className="text-2xl sm:text-3xl font-black text-primary">
                  Building Quality Tech Education in Tier-2 & Tier-3 Cities
                </h3>
              </div>
              <p>
                When <strong>Er. Sumit Kumar</strong> observed computer training in Shikohabad and nearby regions, he noticed a critical flaw: students were spending months memorizing notes from blackboards without ever building real software, understanding modern web protocols, or touching an IDE.
              </p>
              <p>
                <strong>MSK Institute</strong> was born to eliminate that barrier. We established a dedicated, air-conditioned computer lab equipped with high-speed fiber internet and modern development workstations where students practice daily programming challenges.
              </p>
              <p>
                Today, our alumni work at software consultancies, run successful freelance agencies, crack government computer exams with top grades, and excel in BCA/B.Tech university curriculums.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Core Pillars / Why Choose MSK */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-secondary">Our Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary">
              Why Students Trust MSK Institute
            </h2>
            <p className="text-text-muted text-sm sm:text-base">
              Whether you are taking your first steps in computer typing or mastering full-stack MERN development, here is what sets our training apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-7 rounded-2xl border border-border-subtle shadow-xs space-y-3 hover:border-secondary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">{v.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Campus Infrastructure & Facilities */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Campus Tour</span>
              <h2 className="text-2xl sm:text-3xl font-black">Modern Offline Lab in Shikohabad</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Step inside our purpose-built tech facility located conveniently near Station Road and Gyan Jyoti Public School.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {[
                { title: 'Smart Computer Workstations', desc: 'Modern hardware optimized for VS Code, Python interpreters, Node.js, and Adobe packages.' },
                { title: 'High-Speed Fiber Internet', desc: 'Uninterrupted gigabit broadband for live cloud deployments, GitHub pushes, and remote research.' },
                { title: 'Air-Conditioned Comfort', desc: 'Silent, comfortable lab environment designed for long coding sessions and focused learning.' },
                { title: 'Interactive Big Screen Demos', desc: 'Projector & large monitors where instructors walk through step-by-step code architecture.' },
                { title: 'Printed Notes & Cheatsheets', desc: 'Comprehensive study materials, question banks for CCC, and quick-reference developer manuals.' },
                { title: 'Continuous Power Backup', desc: 'Heavy-duty inverter setup ensuring your programming flow is never interrupted by power cuts.' },
              ].map((fac, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                    <h3 className="font-bold text-sm text-white">{fac.title}</h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{fac.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Social Media & Community Trust */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialCommunitySection
            title="Follow MSK Institute on Social Media"
            subtitle="Get a glimpse into our daily classroom labs, watch student project presentations, and stay updated with free tech tutorials."
          />
        </section>

        {/* 7. Campus Location & Contact CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Come Visit Us</span>
              <h2 className="text-2xl sm:text-3xl font-black text-primary">
                Join Us for a 2-Day Free Trial Class
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Experience our hands-on teaching style firsthand. Book your free seat online or drop by our campus in Shikohabad today.
              </p>
              <div className="space-y-1 text-xs text-text-muted pt-1">
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, UP - 283135</span>
                </p>
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Helpline: +91 83930 42166 (Mon-Sat 8:00 AM - 7:00 PM)</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-secondary hover:bg-secondary-light text-white font-bold text-center rounded-xl shadow-md transition-colors"
              >
                Contact Admissions
              </Link>
              <a
                href="https://maps.google.com/?q=MSK+Institute+Shikohabad"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-surface hover:bg-white border border-border-subtle text-primary font-bold text-center rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
