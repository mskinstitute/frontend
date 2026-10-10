/**
 * MSK Institute — Branch SEO & LocalBusiness Structured Data Generator
 *
 * Implements truthful, Google-compliant schema for physical branches,
 * referencing the parent educational organization without fabricated reviews.
 */

import { Metadata } from 'next';
import { Branch } from '@/types';

const SITE_URL = 'https://www.mskinstitute.in';

/**
 * Generates SEO metadata for a branch landing page.
 */
export function generateBranchMetadata(branch: Branch): Metadata {
  const canonicalUrl = `${SITE_URL}/locations/${branch.slug}`;
  const defaultTitle = `${branch.name} | Coding & Computer Training Campus in ${branch.city}`;
  const title = branch.localSeo?.title || defaultTitle;
  const description =
    branch.localSeo?.description ||
    `Visit ${branch.name} in ${branch.city}, ${branch.state}. Learn Python, Full Stack Web Development, CCC, and Data Analytics with hands-on lab training.`;

  const ogImage = branch.localSeo?.ogImage || `${SITE_URL}/logo.jpg`;

  return {
    title,
    description,
    keywords: branch.localSeo?.keywords || [
      branch.name,
      `MSK Institute ${branch.city}`,
      `Computer Institute in ${branch.city}`,
      `Coding Classes in ${branch.city}`,
      `Best Software Training ${branch.city}`,
      `Python Course ${branch.city}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'MSK Institute',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${branch.name} Campus`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: branch.localSeo?.indexable !== false,
      follow: true,
      nocache: false,
    },
  };
}

/**
 * Generates Google-compliant LocalBusiness schema for a branch.
 */
export function generateBranchSchema(branch: Branch) {
  const branchUrl = `${SITE_URL}/locations/${branch.slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${branchUrl}#branch`,
    name: branch.name,
    description: branch.localDescription,
    url: branchUrl,
    logo: `${SITE_URL}/logo.jpg`,
    image: branch.gallery && branch.gallery.length > 0 ? `${SITE_URL}${branch.gallery[0].url}` : `${SITE_URL}/logo.jpg`,
    telephone: branch.phone,
    email: branch.email,
    priceRange: '₹₹',
    parentOrganization: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'MSK Institute',
      alternateName: 'Mastering Software Knowledge',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.jpg`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressRegion: branch.state,
      postalCode: branch.postalCode,
      addressCountry: branch.countryCode || 'IN',
    },
  };

  if (typeof branch.latitude === 'number' && typeof branch.longitude === 'number') {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: branch.latitude,
      longitude: branch.longitude,
    };
  }

  if (branch.openingHours && branch.openingHours.length > 0) {
    schema.openingHoursSpecification = branch.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    }));
  }

  if (branch.googleBusiness?.profileUrl) {
    schema.hasMap = branch.googleBusiness.profileUrl;
  }

  return schema;
}

/**
 * Generates BreadcrumbList schema for branch pages.
 */
export function generateBranchBreadcrumbSchema(branch: Branch) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: `${SITE_URL}/locations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: branch.city,
        item: `${SITE_URL}/locations/${branch.slug}`,
      },
    ],
  };
}
