import { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | MSK Institute of Technology Shikohabad',
  description: 'Get in touch with MSK Institute Shikohabad. Contact us for course admissions, offline computer lab visits, demo classes, and student counseling.',
  keywords: [
    'MSK Institute Contact',
    'Contact MSK Institute Shikohabad',
    'MSK Institute Phone Number',
    'Computer Institute Near Me Shikohabad',
    'Coding Classes Shikohabad Contact',
    'MSK Institute Address Shikohabad',
    'Sumit Sir MSK Institute Contact',
    'Computer Center Shikohabad Admissions',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/contact',
  },
  openGraph: {
    title: 'Contact Us | MSK Institute of Technology Shikohabad',
    description: 'Get in touch with MSK Institute Shikohabad. Connect via WhatsApp, phone, email, or visit our physical campus in Shikohabad.',
    url: 'https://www.mskinstitute.in/contact',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Contact Us & Admissions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | MSK Institute Shikohabad',
    description: 'Connect with MSK Institute for coding courses, offline lab sessions, and computer certifications.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'MSK Institute of Technology & Coding',
    alternateName: 'MSK Institute Shikohabad',
    url: 'https://www.mskinstitute.in',
    logo: 'https://www.mskinstitute.in/logo.jpg',
    image: 'https://www.mskinstitute.in/logo.jpg',
    description: 'Leading computer training academy in Shikohabad offering Python, Full Stack Web Development, CCC, and Data Analytics courses.',
    telephone: '+91-8393042166',
    email: 'mskshikohabad@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School',
      addressLocality: 'Shikohabad',
      addressRegion: 'Uttar Pradesh',
      postalCode: '283135',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.1157743,
      longitude: 78.5829716,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://maps.google.com/?q=MSK+Institute+Shikohabad',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
