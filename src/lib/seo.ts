import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mskinstitute.in';
const DEFAULT_TITLE = "MSK Institute | Coding & Computer Training Academy (Shikohabad & Live Online)";
const DEFAULT_DESCRIPTION = 'Learn Python, Full-Stack Web Development (MERN/Next.js), Data Analytics, SQL, NIELIT CCC, and ADCA via offline computer labs in Shikohabad or live online classes worldwide in Hindi & English.';
const DEFAULT_IMAGE = `${BASE_URL}/brand/og-banner.png`;

export interface SeoMetadataOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Intelligent SEO Metadata Generator for MSK Institute
 *
 * Enforces:
 * - Canonical domain consistency (https://www.mskinstitute.in)
 * - Complete OpenGraph and Twitter card attributes
 * - Dynamic fallback handling with manual override support
 * - Search engine robots directives
 */
export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [
    'MSK Institute',
    'Computer Center Shikohabad',
    'Coding Classes Shikohabad',
    'Live Online Coding Classes Hindi English',
    'Python Training Online and Offline',
    'Full Stack Web Development Course',
    'NIELIT CCC Coaching',
    'Er Sumit Kumar',
  ],
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: SeoMetadataOptions = {}): Metadata {
  const fullTitle = title 
    ? (title.includes('MSK Institute') ? title : `${title} | MSK Institute`)
    : DEFAULT_TITLE;

  const resolvedCanonical = canonical
    ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`)
    : BASE_URL;

  const resolvedImage = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: resolvedCanonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: resolvedCanonical,
      siteName: 'MSK Institute',
      locale: 'en_IN',
      type,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [resolvedImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}
