import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import PwaRegister from '@/components/PwaRegister';
import { PwaProvider } from '@/context/PwaContext';
import { LiveStatusProvider } from '@/context/LiveStatusContext';
import { AuthProvider } from '@/context/AuthContext';
import { ServerStatusProvider } from '@/context/ServerStatusContext';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Analytics from '@/components/Analytics';
import { GoogleTagManagerNoScript } from '@/components/GoogleTagManager';
import GlobalNavigationLoader from '@/components/GlobalNavigationLoader';
import ClientOverlays from '@/components/ClientOverlays';
import socialRegistry from '../../public/data/social-links.json';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#0A2540',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'MSK Institute | Coding & Computer Academy (Shikohabad)',
  applicationName: 'MSK Institute',
  description: 'Learn Python, MERN Web Dev, Data Analytics, CCC & ADCA via practical offline labs in Shikohabad or live online classes worldwide in Hindi & English.',
  keywords: [
    'MSK Institute',
    'Computer Center Shikohabad',
    'Coding Classes Shikohabad',
    'Live Online Coding Classes Hindi English',
    'Python Training Online India',
    'Web Development Course Shikohabad',
    'NIELIT CCC Course',
    'ADCA Diploma Course',
  ],
  metadataBase: new URL('https://www.mskinstitute.in'),
  alternates: {
    types: {
      'application/rss+xml': 'https://www.mskinstitute.in/feed.xml',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MSK Institute',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/brand/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/brand/android-icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/brand/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon', sizes: '180x180', url: '/brand/apple-icon-180x180.png' },
      { rel: 'mask-icon', url: '/brand/maskable-icon-512x512.png', color: '#0A2540' },
    ],
  },
  openGraph: {
    title: 'MSK Institute | Coding & Computer Training (Offline Labs & Global Live Online)',
    description: 'Learn Python, Full-Stack Web Development, Data Analytics, CCC & ADCA with practical labs in Shikohabad and live online classes worldwide in Hindi & English.',
    url: 'https://www.mskinstitute.in',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/brand/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'MSK Institute — Coding & Computer Training Academy (Shikohabad & Global Live Online)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSK Institute | Coding & Computer Training Academy',
    description: 'Learn Python, Full-Stack Web Development, CCC & ADCA via offline labs in Shikohabad or live online classes worldwide in Hindi & English.',
    images: ['https://www.mskinstitute.in/brand/og-banner.png'],
  },
  other: {
    'msapplication-TileColor': '#0A2540',
    'msapplication-TileImage': '/brand/ms-icon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
    'mobile-web-app-capable': 'yes',
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {}),
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['EducationalOrganization', 'LocalBusiness'],
              '@id': 'https://www.mskinstitute.in/#organization',
              name: 'MSK Institute',
              alternateName: ['MSK Computer Training & Coding Academy', 'MSK Computer Institute', 'MSK Institute Shikohabad'],
              url: 'https://www.mskinstitute.in',
              logo: 'https://www.mskinstitute.in/logo.jpg',
              image: 'https://www.mskinstitute.in/brand/og-banner.png',
              description: "Shikohabad's Leading Coding & Computer Training Academy offering 100% practical offline lab training in Shikohabad & Agra plus live interactive online classes worldwide in Hindi & English.",
              telephone: '+918393042166',
              email: 'mskshikohabad@gmail.com',
              priceRange: '₹₹',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '38',
                bestRating: '5',
                worstRating: '1',
              },
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
              founder: {
                '@type': 'Person',
                name: 'Er. Sumit Kumar',
                jobTitle: 'Founder & Lead Technical Trainer',
              },
              hasMap: 'https://maps.google.com/?cid=12440673232057670688',
              sameAs: socialRegistry.channels
                .filter((c) => c.enabled !== false && c.id !== 'whatsapp')
                .map((c) => c.url)
                .concat([
                  socialRegistry.googleReviews?.mapsUrl || 'https://maps.app.goo.gl/MyER29LFmibVkPe47',
                  'https://maps.google.com/?cid=12440673232057670688',
                ]),
              areaServed: [
                'Shikohabad',
                'Firozabad',
                'Sirsaganj',
                'Jasrana',
                'Tundla',
                'Agra',
                'Uttar Pradesh',
                'India',
                'Worldwide',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+918393042166',
                contactType: 'admissions',
                areaServed: ['Shikohabad', 'Firozabad', 'Sirsaganj', 'Jasrana', 'Agra', 'Uttar Pradesh', 'India', 'Worldwide'],
                availableLanguage: ['en', 'hi'],
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new CustomEvent('pwa-prompt-ready'));
              });
            `,
          }}
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-white text-text-main antialiased selection:bg-secondary selection:text-white ${jakarta.className} ${jakarta.variable}`}>
        <GoogleTagManagerNoScript />
        <GlobalNavigationLoader />
        <PwaProvider>
          <ServerStatusProvider>
            <AuthProvider>
              <LiveStatusProvider>
                <Analytics />
                <PwaRegister />
                <Navbar />
                <main className="flex-grow pb-20 md:pb-0 relative">
                  {children}
                </main>
                <Footer />
                <ClientOverlays />
                <MobileBottomNav />
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
              </LiveStatusProvider>
            </AuthProvider>
          </ServerStatusProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
