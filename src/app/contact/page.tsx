import { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';
import { BUSINESS_CONFIG, getCanonicalBusinessSchema } from '@/config/business';

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
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${BUSINESS_CONFIG.websiteUrl}/#organization`,
    name: BUSINESS_CONFIG.name,
    alternateName: BUSINESS_CONFIG.alternateNames,
    url: BUSINESS_CONFIG.websiteUrl,
    logo: BUSINESS_CONFIG.logoUrl,
    image: `${BUSINESS_CONFIG.websiteUrl}/brand/og-banner.png`,
    description: BUSINESS_CONFIG.description,
    telephone: BUSINESS_CONFIG.contact.rawPhone,
    email: BUSINESS_CONFIG.contact.email,
    priceRange: BUSINESS_CONFIG.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Adarsh Nagar',
      addressLocality: 'Shikohabad',
      addressRegion: 'Uttar Pradesh',
      postalCode: '283135',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.1157333,
      longitude: 78.582971,
    },
    hasMap: BUSINESS_CONFIG.contact.mapsUrl,
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
      BUSINESS_CONFIG.socialLinks.youtube,
      BUSINESS_CONFIG.socialLinks.instagram,
      BUSINESS_CONFIG.socialLinks.linkedin,
      BUSINESS_CONFIG.socialLinks.maps,
      BUSINESS_CONFIG.socialLinks.facebook,
      BUSINESS_CONFIG.socialLinks.github,
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '38',
      bestRating: '5',
      worstRating: '1',
    },
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
