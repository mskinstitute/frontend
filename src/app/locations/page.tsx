import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Sparkles, Building2 } from 'lucide-react';
import { getBranchSummaries } from '@/lib/branches';
import LocationsDirectoryClient from '@/components/branches/LocationsDirectoryClient';

export const metadata: Metadata = {
  title: 'MSK Institute Campuses & Locations | Find Computer & Coding Centers',
  description:
    'Find an official MSK Institute campus near you. Explore our verified software training centers in Shikohabad, Agra, and upcoming learning hubs across Uttar Pradesh with classroom labs and certified courses.',
  keywords: [
    'MSK Institute Locations',
    'MSK Institute Campuses',
    'Computer Institute Near Me',
    'Coding Center Shikohabad',
    'Coding Academy Agra',
    'Software Training Institute UP',
    'MSK Franchise Campuses',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/locations',
  },
  openGraph: {
    title: 'MSK Institute Campuses & Locations | Find Centers',
    description:
      'Locate physical MSK Institute computer training academies. Practical software engineering, Python, and digital literacy with hands-on labs.',
    url: 'https://www.mskinstitute.in/locations',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Locations Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSK Institute Campuses & Locations',
    description: 'Find verified MSK Institute coding centers and classroom computer labs.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default async function LocationsPage() {
  const branches = await getBranchSummaries();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MSK Institute Physical Campuses & Learning Centers',
    description: 'Directory of verified MSK Institute physical campuses and regional learning centers.',
    url: 'https://www.mskinstitute.in/locations',
    itemListElement: branches.map((b, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: b.name,
      url: `https://www.mskinstitute.in/locations/${b.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Locations',
        item: 'https://www.mskinstitute.in/locations',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-primary text-white py-12 md:py-16 border-b border-primary-light relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-4">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-gray-300 mb-2">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-secondary font-semibold">Locations</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/15">
              <Building2 className="w-4 h-4" />
              <span>Multi-City Learning Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              MSK Institute Locations & Campuses
            </h1>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              Explore our verified physical academies. Every MSK campus guarantees high-speed computer labs, mentor-led code reviews, and industry-certified curriculum.
            </p>
          </div>
        </section>

        {/* Directory Workspace */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LocationsDirectoryClient branches={branches} />
        </main>
      </div>
    </>
  );
}
