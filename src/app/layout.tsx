import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import PwaRegister from '@/components/PwaRegister';
import InstallAppModal from '@/components/InstallAppModal';
import PwaUpdateToast from '@/components/PwaUpdateToast';
import { PwaProvider } from '@/context/PwaContext';
import { LiveStatusProvider } from '@/context/LiveStatusContext';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Analytics from '@/components/Analytics';
import { GoogleTagManagerNoScript } from '@/components/GoogleTagManager';
import FloatingWhatsAppCTA from '@/components/FloatingWhatsAppCTA';
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
  title: "MSK Institute | Shikohabad's Leading Coding & Computer Training Academy",
  applicationName: 'MSK Institute',
  description: 'Learn Python programming, Full-Stack Web Development, CCC, and MS Office with practical, offline lab training at MSK Institute in Shikohabad. Verified graduation certificates.',
  keywords: ['MSK Institute', 'Computer Center Shikohabad', 'Coding Classes Shikohabad', 'Python Training', 'Web Development Shikohabad', 'NIELIT CCC Course'],
  metadataBase: new URL('https://www.mskinstitute.in'),
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
    title: 'MSK Institute | Computer Training & Coding Academy',
    description: 'Learn Python, Web Development, CCC, and MS Office with practical labs at MSK Institute, Shikohabad.',
    url: 'https://www.mskinstitute.in',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSK Institute | Computer Training & Coding Academy',
    description: 'Learn Python, Web Development, CCC, and MS Office with practical labs at MSK Institute, Shikohabad.',
  },
  other: {
    'msapplication-TileColor': '#0A2540',
    'msapplication-TileImage': '/brand/ms-icon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
    'mobile-web-app-capable': 'yes',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
              name: 'MSK Institute',
              alternateName: 'MSK Computer Training & Coding Academy',
              url: 'https://www.mskinstitute.in',
              logo: 'https://www.mskinstitute.in/logo.jpg',
              image: 'https://www.mskinstitute.in/logo.jpg',
              description: "Shikohabad's Leading Coding & Computer Training Academy with 100% practical lab training in Python, Web Development, CCC, and MS Office.",
              telephone: '+918393042166',
              email: 'mskshikohabad@gmail.com',
              priceRange: '₹₹',
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
              founder: {
                '@type': 'Person',
                name: 'Er. Sumit Kumar',
                jobTitle: 'Founder & Lead Technical Trainer',
              },
              sameAs: socialRegistry.channels
                .filter((c) => c.enabled !== false && c.id !== 'whatsapp')
                .map((c) => c.url)
                .concat([socialRegistry.googleReviews?.mapsUrl || 'https://maps.google.com/?q=MSK+Institute+Shikohabad']),
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+918393042166',
                contactType: 'admissions',
                areaServed: ['Shikohabad', 'Firozabad', 'Sirsaganj', 'Jasrana', 'Uttar Pradesh'],
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
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                var registerSW = function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .catch(function(err) {
                      console.warn('Early SW registration fail', err);
                    });
                };
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  registerSW();
                } else {
                  window.addEventListener('DOMContentLoaded', registerSW);
                  window.addEventListener('load', registerSW);
                }
              }
            `,
          }}
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-white text-text-main antialiased selection:bg-secondary selection:text-white ${jakarta.className} ${jakarta.variable}`}>
        <GoogleTagManagerNoScript />
        <PwaProvider>
          <LiveStatusProvider>
            <Analytics />
            <PwaRegister />
            <InstallAppModal />
            <PwaUpdateToast />
            <Navbar />
            <main className="flex-grow pb-20 md:pb-0 relative">
              {children}
            </main>
            <Footer />
            <FloatingWhatsAppCTA />
            <MobileBottomNav />
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </LiveStatusProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
