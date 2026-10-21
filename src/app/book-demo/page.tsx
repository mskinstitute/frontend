import { Metadata } from 'next';
import BookDemoClient from '@/components/BookDemoClient';
import { fetchCourses, fetchLiveBatches } from '@/services/api';

export const metadata: Metadata = {
  title: 'Book Free Demo Class (Online Live & Lab) | MSK Institute Shikohabad',
  description:
    'Book a 100% Free 2-Day Trial Demo Class for Python, Full-Stack Web Development, NIELIT CCC, or Data Analytics at MSK Institute. Attend Online Live or in Shikohabad offline lab. No login required.',
  keywords: [
    'Book Free Demo Class',
    'Free Coding Demo Class Shikohabad',
    'Online Live Demo Class MSK Institute',
    'Python Free Demo Class',
    'Full Stack Web Development Demo',
    'NIELIT CCC Demo Class',
    'Er Sumit Kumar Demo Class',
    'Free Computer Class Trial Shikohabad',
    'Computer Institute Near Me Demo',
    'Live Coding Trial Class',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/book-demo',
  },
  openGraph: {
    title: 'Book Free Demo Class (Online Live & Lab) | MSK Institute',
    description:
      'Experience practical coding with Er. Sumit Kumar. Book your free 2-day demo class for Python, MERN Web Dev, CCC, or Data Analytics. No login required.',
    url: 'https://www.mskinstitute.in/book-demo',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Free Demo Class Booking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Free Demo Class (Online Live & Lab) | MSK Institute',
    description:
      'Book a 100% Free 2-Day Trial Demo Class for Python, Full-Stack Web Dev, or CCC at MSK Institute. Zero login required.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default async function BookDemoPage() {
  const [courses, batches] = await Promise.all([
    fetchCourses().catch(() => []),
    fetchLiveBatches().catch(() => []),
  ]);

  // Structured Data (JSON-LD) for Search Engines & AI Crawlers (Perplexity, ChatGPT, Gemini, Google)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationEvent',
        '@id': 'https://www.mskinstitute.in/book-demo#event',
        name: 'MSK Institute Free 2-Day Trial Coding & Computer Demo Class',
        description:
          'Attend 2 days of free live interactive computer and programming classes led by Er. Sumit Kumar. Available Online Live and in Shikohabad Offline Computer Lab.',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://www.mskinstitute.in/book-demo',
          validFrom: '2025-01-01',
        },
        organizer: {
          '@type': 'EducationalOrganization',
          name: 'MSK Institute of Technology & Coding',
          url: 'https://www.mskinstitute.in',
          logo: 'https://www.mskinstitute.in/logo.jpg',
          telephone: '+91-8393042166',
        },
        performer: {
          '@type': 'Person',
          name: 'Er. Sumit Kumar',
          jobTitle: 'Senior Software Engineer & Lead Instructor',
        },
        location: [
          {
            '@type': 'Place',
            name: 'MSK Institute Shikohabad Campus',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Station Road',
              addressLocality: 'Shikohabad',
              addressRegion: 'Uttar Pradesh',
              postalCode: '283135',
              addressCountry: 'IN',
            },
          },
          {
            '@type': 'VirtualLocation',
            name: 'MSK Online Live Interactive Classroom',
            url: 'https://www.mskinstitute.in/live',
          },
        ],
      },
      {
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
            name: 'Book Free Demo Class',
            item: 'https://www.mskinstitute.in/book-demo',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is the 2-day demo class truly 100% free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, absolutely. There is zero fee, no registration charge, and no credit card required. You attend 2 full days of live classes completely free to evaluate our learning environment.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need an account or login to book a demo class?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No login or account creation is required! Any prospective student or parent can book a demo class directly without needing to sign up or log in.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do Online Live demo classes work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Online live classes are conducted via Google Meet / Live Classroom with real-time screen sharing, interactive live coding, and two-way voice audio for doubt clearing. You receive your joining link directly on WhatsApp.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where are the Offline Lab sessions held?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Offline lab sessions are held at MSK Institute of Technology & Coding, Gali No. 3, Near Gyan Jyoti Public School, Station Road, Shikohabad (Firozabad, UP). Dedicated computers are provided for every student.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookDemoClient courses={courses} batches={batches} />
        </div>
      </main>
    </>
  );
}
