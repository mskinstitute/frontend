import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | MSK Institute of Technology & Coding',
  description: 'Read the official Privacy Policy of MSK Institute. Learn how we collect, protect, and use student data, cookie policies, Google AdSense disclosures, and analytics tracking.',
  keywords: [
    'MSK Institute Privacy Policy',
    'MSK Institute Data Protection',
    'Computer Institute Shikohabad Privacy',
    'MSK Institute AdSense Policy',
    'Student Data Security MSK'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | MSK Institute of Technology & Coding',
    description: 'Learn how MSK Institute protects user privacy, student records, and complies with international data privacy standards and Google AdSense guidelines.',
    url: 'https://www.mskinstitute.in/privacy-policy',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 25, 2026';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - MSK Institute',
    url: 'https://www.mskinstitute.in/privacy-policy',
    description: 'Official Privacy Policy and data protection terms for MSK Institute.',
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
          name: 'Privacy Policy',
          item: 'https://www.mskinstitute.in/privacy-policy',
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
            <ShieldCheck className="w-4 h-4" />
            <span>Transparency & Trust</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
            Effective Date: <strong>{lastUpdated}</strong> • Applies to <strong>MSK Institute</strong> (https://www.mskinstitute.in) & Offline Campus.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-text leading-relaxed">
        {/* Intro */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            1. Introduction & Scope
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            At <strong>MSK Institute</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), led by <strong>Er. Sumit Kumar</strong>, respecting your privacy and protecting your personal information is paramount. This Privacy Policy details the types of information we collect when you visit our website (<strong>https://www.mskinstitute.in</strong>), attend our online live batches, access free coding tutorials, practice in our code playground, or visit our physical campus in Shikohabad, Uttar Pradesh.
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            By accessing or using our services, you acknowledge that you have read, understood, and agreed to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            2. Information We Collect
          </h2>
          <div className="space-y-3 text-sm text-text-muted">
            <p>We collect information in two main ways:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Information You Provide Voluntarily:</strong> When you register for live batches, book a free demo session, submit an inquiry, download study notes, or contact us via WhatsApp, you may provide details such as your full name, mobile/WhatsApp number, email address, city, educational background, and course interests.
              </li>
              <li>
                <strong>Log Files & Technical Usage Data:</strong> Like most modern web applications, our servers automatically log certain non-personally identifiable information whenever you visit our website. This includes your Internet Protocol (IP) address, browser type, Operating System, referring/exit URLs, date/time stamps, and pages viewed.
              </li>
              <li>
                <strong>Certificate Verification Queries:</strong> When using our public verification portal (<Link href="/verify-certificate" className="text-secondary font-semibold hover:underline">/verify-certificate</Link>), the system logs certificate roll numbers to ensure academic authenticity and prevent fraud.
              </li>
            </ul>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            3. How We Use Your Information
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            We use the collected information strictly for legitimate educational, operational, and student service purposes, including:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              'Processing live batch enrollments & offline lab admissions',
              'Scheduling free trial classes & academic counseling',
              'Delivering study materials, cheatsheets & assignment feedback',
              'Sending crucial batch timing updates via WhatsApp/SMS',
              'Verifying graduation certificates for employers & institutions',
              'Maintaining website speed, security & server reliability',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm bg-surface p-3 rounded-xl border border-border-subtle text-text">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Google AdSense, DoubleClick Cookie & Advertising Partners (CRITICAL FOR ADSENSE) */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-secondary/20 shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none" />
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            4. Google AdSense & Third-Party Advertising Policy
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              To keep our 1,600+ coding tutorials, practice tools, and learning materials completely free for students, MSK Institute partners with third-party advertising networks, including <strong>Google AdSense</strong>.
            </p>
            <div className="bg-surface p-4 rounded-xl border border-border-subtle space-y-2">
              <p className="font-bold text-primary text-xs uppercase tracking-wider">
                Google DoubleClick DART Cookie Disclosure:
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                Google, as a third-party vendor, uses cookies to serve advertisements on <strong>https://www.mskinstitute.in</strong>. Google&apos;s use of the <strong>DART cookie</strong> enables it to serve ads to our users based on their visits to our website and other websites across the Internet.
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                Users may opt out of the use of the DART cookie and personalized advertising by visiting the official Google Ad and Content Network Privacy Policy at:
                <br />
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-secondary font-bold hover:underline mt-1"
                >
                  <span>https://policies.google.com/technologies/ads</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on our website, which are sent directly to your browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of advertising campaigns and/or to personalize advertising content that you see.
            </p>
            <p className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl font-medium">
              <strong>Please Note:</strong> MSK Institute has no access to or control over these cookies that are used by third-party advertisers. You can choose to disable cookies through your individual browser options.
            </p>
          </div>
        </section>

        {/* Web Analytics & Tracking */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            5. Analytics & Performance Tracking
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            We use <strong>Google Analytics 4 (GA4)</strong> and <strong>Google Tag Manager (GTM)</strong> to understand user engagement, reading habits across tutorials, and improve site performance. Our tracking implementation adheres to strict privacy-first guidelines:
          </p>
          <ul className="list-disc pl-5 text-sm text-text-muted space-y-1.5">
            <li>We do <strong>NOT</strong> transmit Personally Identifiable Information (PII) like student names, passwords, phone numbers, or private emails to analytics servers.</li>
            <li>IP addresses are automatically anonymized by GA4.</li>
            <li>Data is aggregated to analyze aggregate trends such as top-performing coding languages and tutorial read duration.</li>
          </ul>
        </section>

        {/* User Rights (GDPR, CCPA & Indian DPDP Act 2023) */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            6. Your Data Rights (DPDP Act, GDPR & CCPA)
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Under applicable data protection laws, including the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> of India, the GDPR, and the CCPA, you have specific rights concerning your data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-surface rounded-xl border border-border-subtle">
              <strong className="text-primary block mb-1">Right to Access:</strong>
              <p className="text-text-muted">You can request copies of the personal data we hold about your enrollment.</p>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border-subtle">
              <strong className="text-primary block mb-1">Right to Rectification:</strong>
              <p className="text-text-muted">You have the right to correct any inaccurate or incomplete student contact details.</p>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border-subtle">
              <strong className="text-primary block mb-1">Right to Erasure:</strong>
              <p className="text-text-muted">You may request the deletion of your inquiry data when it is no longer required.</p>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border-subtle">
              <strong className="text-primary block mb-1">Right to Withdraw Consent:</strong>
              <p className="text-text-muted">You can opt out of promotional WhatsApp or email communications at any time.</p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-primary">7. Children&apos;s Privacy (COPPA Compliance)</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Our platform provides coding and computer literacy tutorials suitable for learners of all ages. However, we do not knowingly solicit or collect personally identifiable information from children under the age of 13 without verifiable parental or guardian consent. If a parent discovers their child has submitted personal details without consent, please contact us immediately, and we will promptly delete the data from our records.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-primary text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-secondary" />
            8. Contact Our Privacy Grievance Officer
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact us directly:
          </p>
          <div className="space-y-2 text-sm text-gray-200 pt-1">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Institute:</span> MSK Institute of Technology & Coding
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Lead Director:</span> Er. Sumit Kumar
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
              <a href="mailto:mskshikohabad@gmail.com" className="hover:underline text-secondary">
                mskshikohabad@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
              <a href="tel:+918393042166" className="hover:underline text-secondary">
                +91 83930 42166
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, Firozabad, UP - 283135</span>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
