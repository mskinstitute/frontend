import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldAlert, Award, BookOpen, AlertCircle, Scale, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Academic Policies | MSK Institute',
  description: 'Review the official terms of service, enrollment rules, intellectual property rights, and code of conduct for MSK Institute students and online visitors.',
  keywords: [
    'MSK Institute Terms',
    'MSK Terms and Conditions',
    'Student Enrollment Rules Shikohabad',
    'MSK Institute Policies',
    'Coding Bootcamp Terms UP'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/terms',
  },
  openGraph: {
    title: 'Terms of Service | MSK Institute',
    description: 'Official Terms of Service and student guidelines for MSK Institute physical labs and online learning portal.',
    url: 'https://www.mskinstitute.in/terms',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TermsPage() {
  const lastUpdated = 'September 25, 2026';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service - MSK Institute',
    url: 'https://www.mskinstitute.in/terms',
    description: 'Official Terms of Service and student agreement for MSK Institute.',
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'MSK Institute',
      url: 'https://www.mskinstitute.in',
      logo: 'https://www.mskinstitute.in/logo.jpg',
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
          name: 'Terms of Service',
          item: 'https://www.mskinstitute.in/terms',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-surface/50 border-b border-border-subtle py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20 mb-4">
            <Scale className="w-4 h-4" />
            <span>Academic & Student Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
            Effective Date: <strong>{lastUpdated}</strong> • Governing use of <strong>MSK Institute</strong> website, live cohorts, and offline labs.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-text leading-relaxed">
        {/* 1. Acceptance */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Welcome to <strong>MSK Institute of Technology & Coding</strong> (&quot;MSK Institute,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), founded and mentored by <strong>Er. Sumit Kumar</strong> in Shikohabad, Uttar Pradesh. By accessing our website (<strong>https://www.mskinstitute.in</strong>), participating in our live online batches, enrolling in physical offline lab courses, or utilizing our interactive developer tools, you agree to comply with and be bound by these Terms of Service.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            If you do not agree with any part of these terms, please discontinue the use of our website and educational services immediately.
          </p>
        </section>

        {/* 2. Intellectual Property Rights */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" />
            2. Intellectual Property Rights & Content License
          </h2>
          <div className="space-y-3 text-sm text-text-muted">
            <p>
              All educational materials, tutorials, curriculum design, video lectures, code examples, cheatsheets, graphics, trademarks, and logos displayed on this platform are the intellectual property of MSK Institute and its licensors.
            </p>
            <div className="bg-surface p-4 rounded-xl border border-border-subtle space-y-2">
              <strong className="text-primary text-xs uppercase tracking-wider block">Permitted Personal Use:</strong>
              <p className="text-xs text-text-muted">
                You are granted a limited, non-exclusive, non-transferable license to access, read, practice code, and download course notes strictly for your personal, non-commercial educational advancement.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2 text-red-900">
              <strong className="text-xs uppercase tracking-wider block font-bold">Prohibited Commercial Redistribution:</strong>
              <p className="text-xs leading-relaxed">
                You may not scrape, redistribute, sell, re-upload, broadcast, or republish our course syllabus, tutorial series, or lab assignments on external commercial portals without express written consent from MSK Institute.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Course Enrollment, Fees & Demo Policy */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            3. Admissions, Free Demo Sessions & Fee Policy
          </h2>
          <div className="space-y-3 text-sm text-text-muted">
            <p>
              <strong>Free Trial Classes:</strong> To ensure complete transparency and student confidence, MSK Institute provides up to <strong>2 consecutive days of Free Demo Classes</strong> for all new prospective students (both for online cohorts and Shikohabad offline classroom labs).
            </p>
            <p>
              <strong>Enrollment & Seat Confirmation:</strong> Due to limited batch sizes (to ensure individual mentorship and 1-on-1 PC access), seats are locked upon submission of registration and confirmation by our academic counselor.
            </p>
            <p>
              <strong>Fee Payments & Installments:</strong> Course fees are transparently communicated prior to admission. Depending on the track (e.g. 1-year ADCA vs. 3-month Python Bootcamp), students may opt for monthly installments or full advance payment as mutually agreed upon registration.
            </p>
            <p>
              <strong>Refund Policy:</strong> Once formal admission is finalized after the 2-day free demo period, fees paid are generally non-refundable as batch allocations, mentor hours, and dedicated computer resources are committed. Any exceptional requests are evaluated at the sole discretion of the institute director.
            </p>
          </div>
        </section>

        {/* 4. Student Conduct & Lab Rules */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-secondary" />
            4. Student Conduct, Offline Lab Ethics & Live Etiquette
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Students are expected to maintain the highest standards of academic integrity, discipline, and respect:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              'Handle computer lab hardware & networking equipment with care',
              'Maintain mutual respect in live class chats and doubt sessions',
              'No unauthorized software installation on offline lab systems',
              'Punctual attendance in scheduled live batch sessions',
              'Honest submission of project assignments and lab assessments',
              'Strict adherence to campus safety and decorum in Shikohabad',
            ].map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm bg-surface p-3 rounded-xl border border-border-subtle text-text">
                <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Certificate Verification & Academic Integrity */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            5. Certificates & Online Verification Authenticity
          </h2>
          <div className="space-y-3 text-sm text-text-muted">
            <p>
              MSK Institute awards digital and physical Completion Diplomas & Certificates exclusively to candidates who successfully complete the required lecture hours, lab practicals, and capstone project evaluations.
            </p>
            <p>
              All authentic credentials can be validated publicly by employers, colleges, and verification agencies via our official portal at: <Link href="/verify-certificate" className="text-secondary font-bold hover:underline">https://www.mskinstitute.in/verify-certificate</Link>.
            </p>
            <p className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl">
              <strong>Strict Warning:</strong> Any attempt to tamper with, forge, or duplicate an MSK Institute certificate or roll number will result in immediate cancellation of credentials and possible reporting under applicable IT laws.
            </p>
          </div>
        </section>

        {/* 6. Code Playground & Developer Tools */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary">6. Interactive Developer Tools & Code Playground Usage</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Our online tools (such as the <Link href="/playground" className="text-secondary hover:underline font-semibold">Code Playground</Link> and <Link href="/tools/typing" className="text-secondary hover:underline font-semibold">TypeQuest Speed Lab</Link>) are provided free of charge for learning and skill evaluation. Users agree not to execute automated scripts, launch denial-of-service attempts, or run malicious code intended to compromise client browsers or server infrastructure.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            7. Limitation of Liability
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            While MSK Institute strives to deliver industry-leading practical computer education, software engineering tools, and career guidance, we make no representations or warranties of any kind regarding specific external exam outcomes (e.g. government recruitment tests) or third-party salary packages without individual merit. Under no circumstances shall MSK Institute or Er. Sumit Kumar be liable for indirect, incidental, or consequential damages arising from website downtime or career choices.
          </p>
        </section>

        {/* 8. Governing Law & Jurisdiction */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary">8. Governing Law & Dispute Resolution</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            These Terms of Service shall be governed by, construed, and enforced in accordance with the laws of the Republic of India. In the event of any legal dispute arising from these terms or institute services, the competent courts located in <strong>Shikohabad / Firozabad District, Uttar Pradesh</strong>, shall have exclusive territorial jurisdiction.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-primary text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-secondary" />
            9. Contact & Inquiries
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you have questions regarding our Terms of Service, course guidelines, or institutional policies, please reach out to our administration desk:
          </p>
          <div className="space-y-2 text-sm text-gray-200 pt-1">
            <p><strong className="text-white">MSK Institute of Technology & Coding</strong></p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary" />
              <a href="mailto:mskshikohabad@gmail.com" className="text-secondary hover:underline">
                mskshikohabad@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary" />
              <a href="tel:+918393042166" className="text-secondary hover:underline">
                +91 83930 42166
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, UP - 283135</span>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
