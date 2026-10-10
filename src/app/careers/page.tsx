import { Metadata } from 'next';
import { fetchCareers } from '@/services/api';
import CareersClient from '@/components/CareersClient';

export const revalidate = 1800; // Revalidate every 30 minutes

export const metadata: Metadata = {
  title: 'Careers, Internships & Jobs | MSK Institute Shikohabad',
  description: 'Explore verified on-site jobs, faculty trainer roles, admission counseling, sales, digital marketing, and live internships at MSK Institute Shikohabad Campus.',
  keywords: [
    'MSK Institute Careers',
    'Computer Teacher Jobs Shikohabad',
    'Programming Trainer Jobs Shikohabad',
    'Admission Counselor Jobs UP',
    'Digital Marketing Jobs Firozabad',
    'Data Analytics Trainer Shikohabad',
    'Computer Internships Shikohabad',
    'Coding Apprenticeship Shikohabad',
    'MSK Institute Jobs',
    'Jobs in Shikohabad'
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/careers',
  },
  openGraph: {
    title: 'Careers, Internships & Jobs | MSK Institute Shikohabad',
    description: 'Explore verified on-site jobs, faculty trainer roles, and live internships at MSK Institute Shikohabad Campus. All genders welcome.',
    url: 'https://www.mskinstitute.in/careers',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Careers and Internships',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers, Internships & Jobs | MSK Institute',
    description: 'Explore verified on-site jobs, trainer positions, and paid internships at MSK Institute Shikohabad.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default async function CareersPage() {
  const careers = await fetchCareers();
  const activeCareers = careers.filter((c) => c.active !== false);

  // Structured Data Schema for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MSK Institute On-Site Careers & Internships (Shikohabad)',
    description: 'Active on-site job and internship openings at MSK Institute Shikohabad campus.',
    itemListElement: activeCareers.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        title: c.title,
        description: c.description,
        datePosted: c.postedAt,
        validThrough: c.deadline || '2026-12-31',
        employmentType: c.type === 'internship' ? 'INTERN' : (c.workType?.includes('Part-time') ? 'PART_TIME' : 'FULL_TIME'),
        hiringOrganization: {
          '@type': 'Organization',
          name: c.company || 'MSK Institute of Technology',
          sameAs: 'https://www.mskinstitute.in',
          logo: 'https://www.mskinstitute.in/logo.jpg',
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School',
            addressLocality: 'Shikohabad',
            addressRegion: 'Uttar Pradesh',
            postalCode: '283135',
            addressCountry: 'IN',
          },
        },
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'INR',
          value: {
            '@type': 'QuantitativeValue',
            value: c.stipendOrSalary,
            unitText: c.type === 'internship' ? 'MONTH' : 'YEAR',
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersClient initialCareers={activeCareers} />
    </>
  );
}
