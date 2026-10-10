import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, BookOpen, Briefcase, Award, ExternalLink, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | MSK Institute of Technology & Coding',
  description: 'Official educational, employment, and certification disclaimer for MSK Institute Shikohabad courses, tutorials, and online resources.',
  keywords: [
    'MSK Institute Disclaimer',
    'Educational Disclaimer MSK',
    'Course Certification Validity Shikohabad',
    'Computer Training Disclaimer'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer | MSK Institute',
    description: 'Educational, technical, and certification disclaimer for MSK Institute website, courses, and resources.',
    url: 'https://www.mskinstitute.in/disclaimer',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function DisclaimerPage() {
  const lastUpdated = 'September 25, 2026';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Disclaimer - MSK Institute',
    url: 'https://www.mskinstitute.in/disclaimer',
    description: 'Official legal and educational disclaimer for MSK Institute.',
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
          name: 'Disclaimer',
          item: 'https://www.mskinstitute.in/disclaimer',
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Legal & Educational Notices</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight">
            Disclaimer
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
            Effective Date: <strong>{lastUpdated}</strong> • Clear guidelines on educational goals, job assistance, and external references.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-text leading-relaxed">
        {/* 1. Educational Purpose Disclaimer */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" />
            1. Educational & Informational Purpose
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            The content, tutorials, coding snippets, video modules, and documentation published on <strong>https://www.mskinstitute.in</strong> are compiled and presented exclusively for educational, technical training, and skill development purposes. While our mentor <strong>Er. Sumit Kumar</strong> and teaching staff take every reasonable measure to ensure that explanations, syntax, and coding standards are accurate and aligned with modern industry benchmarks (such as Python 3.12+, React 19, and modern web APIs), the information is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
          </p>
        </section>

        {/* 2. Employment & Placement Assistance */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" />
            2. Employment & Career Outcomes
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            MSK Institute is a dedicated vocational computer training and coding academy. We take pride in equipping our learners with hands-on technical skills, portfolio-grade project development, resume building, and placement guidance. However:
          </p>
          <ul className="list-disc pl-5 text-sm text-text-muted space-y-1.5">
            <li>
              <strong>No Guaranteed Job Guarantee:</strong> Enrollment or completion of our courses does not constitute a legal guarantee of employment, specific corporate job placement, or guaranteed salary packages. Final job offers depend solely on individual student capability, interview performance, and the hiring criteria of respective recruiters.
            </li>
            <li>
              <strong>Government Job Clarification:</strong> While courses like <em>NIELIT CCC</em> or <em>ADCA</em> are frequently utilized by candidates to fulfill qualification criteria for state or central government recruitment exams (e.g., UP Police, VDO, Lekhpal, Railway), MSK Institute is an independent preparatory academy and does not guarantee government recruitment.
            </li>
          </ul>
        </section>

        {/* 3. Certification Authority Disclaimer */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            3. Certification Authority & Scope
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Diplomas and certificates issued directly by MSK Institute certify that the recipient has undergone practical computer instruction, completed lab assignments, and passed internal project evaluations.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            For statutory examinations like the <strong>NIELIT CCC (Course on Computer Concepts)</strong> or <strong>O Level</strong>, official government certificates are awarded strictly by the National Institute of Electronics & Information Technology (NIELIT) upon candidates appearing for and clearing their official nationwide examination. MSK Institute provides authorized coaching, lab practicals, and mock test preparation.
          </p>
        </section>

        {/* 4. External Outbound Links & Third-Party Tools */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-secondary" />
            4. External Links & Third-Party Resources
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Our tutorials and website may contain hyperlinks leading to external websites, documentation, software downloads, or tools (including GitHub, MDN Web Docs, Python.org, Google Maps, and third-party APIs). While we only link to reputable, educational resources, MSK Institute does not control or endorse the content, privacy policies, or practices of external third-party sites and accepts no responsibility for them.
          </p>
        </section>

        {/* 5. Advertising & Affiliate Disclosures */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            5. Advertising & Third-Party Monetization
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            This website may display advertisements served by Google AdSense and other advertising networks. Advertisements displayed do not constitute an explicit endorsement by MSK Institute of the advertised products, services, or companies. Please refer to our <Link href="/privacy-policy" className="text-secondary font-semibold hover:underline">Privacy Policy</Link> for comprehensive information on third-party cookies and ad tracking.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-primary text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-secondary" />
            Questions or Clarifications?
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you need any clarification regarding our educational policies, certification validity, or website contents, feel free to contact us:
          </p>
          <div className="space-y-1.5 text-xs sm:text-sm text-gray-200 pt-1">
            <p className="font-semibold text-white">MSK Institute of Technology & Coding</p>
            <p>Email: <a href="mailto:mskshikohabad@gmail.com" className="text-secondary hover:underline">mskshikohabad@gmail.com</a></p>
            <p>Phone: <a href="tel:+918393042166" className="text-secondary hover:underline">+91 83930 42166</a></p>
            <p>Address: Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, Firozabad, UP - 283135</p>
          </div>
        </section>
      </div>
    </>
  );
}
