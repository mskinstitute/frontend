import { Metadata } from 'next';
import CertificateVerifier from '@/components/CertificateVerifier';

export const metadata: Metadata = {
  title: 'Student Certificate Verification Registry | MSK Institute',
  description: 'Instantly verify graduation certificates, grades, and course completions issued by MSK Institute, Shikohabad. Ensure authentic qualifications for employers.',
  alternates: {
    canonical: 'https://www.mskinstitute.in/verify-certificate',
  },
};

export default function VerifyCertificatePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'MSK Institute',
    'url': 'https://www.mskinstitute.in',
    'logo': 'https://www.mskinstitute.in/logo.png',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Gali No. 3, Near Gyan Jyoti Public School',
      'addressLocality': 'Shikohabad',
      'addressRegion': 'Firozabad, Uttar Pradesh',
      'postalCode': '283135',
      'addressCountry': 'IN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header (No Print) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 no-print">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">
            Student Certificate Verification
          </h1>
          <p className="text-text-muted text-lg">
            Validate the authenticity of completion certificates issued by MSK Institute. Enter the certificate serial number to fetch verified database details.
          </p>
        </div>

        <CertificateVerifier />
      </div>
    </>
  );
}
