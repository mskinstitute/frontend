/**
 * MSK Institute — Canonical Business & Local SEO Configuration
 *
 * Single Source of Truth for all NAP (Name, Address, Phone),
 * GeoCoordinates, Operating Hours, and Schema.org metadata.
 */

import socialRegistry from '../../public/data/social-links.json';

export const BUSINESS_CONFIG = {
  name: 'MSK Institute',
  legalName: 'MSK Institute of Technology & Coding',
  alternateNames: [
    'MSK Computer Institute',
    'MSK Institute Shikohabad',
    'MSK Coding Academy',
    'MSK Computer Center Shikohabad',
  ],
  tagline: 'Practical Skills for Real Careers',
  description: "Shikohabad's Premier Computer Training & Coding Academy with 100% practical lab training in Python, Full-Stack Web Development, NIELIT CCC, ADCA, and Data Analytics.",
  websiteUrl: 'https://www.mskinstitute.in',
  canonicalUrl: 'https://www.mskinstitute.in',
  telephone: '+91 83930 42166',
  email: 'mskshikohabad@gmail.com',
  logoUrl: 'https://www.mskinstitute.in/logo.jpg',
  priceRange: '₹₹',

  // Canonical Contact & NAP Details
  contact: {
    phone: '+91 83930 42166',
    formattedPhone: '+91 83930 42166',
    rawPhone: '+918393042166',
    cleanWhatsApp: '918393042166',
    email: 'mskshikohabad@gmail.com',
    mapsUrl: 'https://maps.google.com/?q=MSK+Institute+Shikohabad',
  },

  // Canonical Address (HQ - Shikohabad)
  address: {
    streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School',
    area: 'Station Road Area',
    fullAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Station Road Area, Shikohabad, Firozabad District, UP - 283135',
    addressLocality: 'Shikohabad',
    addressRegion: 'Uttar Pradesh',
    postalCode: '283135',
    addressCountry: 'IN',
  },

  // Canonical Geo Coordinates
  geo: {
    latitude: 27.1157743,
    longitude: 78.5829716,
  },

  // Standardized Operating Hours
  hours: {
    display: 'Monday – Saturday: 8:00 AM – 7:00 PM | Sunday: 10:00 AM – 2:00 PM (Counseling)',
    weekday: 'Mon – Sat: 8:00 AM – 7:00 PM',
    weekend: 'Sunday: 10:00 AM – 2:00 PM (Admissions & Counseling Desk)',
    schemaSpecifications: [
      {
        '@type': 'OpeningHoursSpecification' as const,
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification' as const,
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
  },

  // Leadership & Mentorship
  founder: {
    name: 'Er. Sumit Kumar',
    jobTitle: 'Founder & Lead Technical Trainer',
    credentials: 'B.Tech in Computer Science & Engineering, 8+ Years Production Software Development Experience',
    picture: '/logo.jpg',
  },

  // Social & Community Presence (Managed in public/data/social-links.json)
  socialLinks: {
    youtube: socialRegistry.channels.find((c) => c.id === 'youtube')?.url || 'https://youtube.com/@mskinstitute',
    instagram: socialRegistry.channels.find((c) => c.id === 'instagram')?.url || 'https://www.instagram.com/mskinstitute',
    linkedin: socialRegistry.channels.find((c) => c.id === 'linkedin')?.url || 'https://linkedin.com/company/msk-institute',
    facebook: socialRegistry.channels.find((c) => c.id === 'facebook')?.url || 'https://www.facebook.com/mskinstitute',
    github: socialRegistry.channels.find((c) => c.id === 'github')?.url || 'https://github.com/mskinstitute',
    whatsapp: socialRegistry.whatsAppSupport?.cleanNumber ? `https://wa.me/${socialRegistry.whatsAppSupport.cleanNumber}` : 'https://wa.me/918393042166',
    maps: socialRegistry.googleReviews?.mapsUrl || 'https://maps.google.com/?q=MSK+Institute+Shikohabad',
  },

  // Service Areas for Local SEO
  areaServed: [
    'Shikohabad',
    'Firozabad',
    'Sirsaganj',
    'Jasrana',
    'Tundla',
    'Mainpuri',
    'Uttar Pradesh',
  ],

  // Trust & Evidence Metrics (Substantiated)
  stats: {
    studentsMentored: socialRegistry.communityStats?.studentsMentored || '1,200+',
    rating: `${socialRegistry.googleReviews?.rating || '4.9'}/5`,
    reviewCount: socialRegistry.googleReviews?.reviewCount || '128+',
    verifiedCertificates: socialRegistry.communityStats?.verifiedCertificates || '500+',
    activeCourses: '66+',
    practicalLabRatio: socialRegistry.communityStats?.practicalRatio || '100%',
  },
} as const;

/**
 * Generate canonical EducationalOrganization + LocalBusiness Schema.org JSON-LD
 */
export function getCanonicalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${BUSINESS_CONFIG.websiteUrl}/#organization`,
    name: BUSINESS_CONFIG.name,
    alternateName: BUSINESS_CONFIG.alternateNames,
    url: BUSINESS_CONFIG.websiteUrl,
    logo: BUSINESS_CONFIG.logoUrl,
    image: BUSINESS_CONFIG.logoUrl,
    description: BUSINESS_CONFIG.description,
    telephone: BUSINESS_CONFIG.contact.rawPhone,
    email: BUSINESS_CONFIG.contact.email,
    priceRange: BUSINESS_CONFIG.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.address.streetAddress,
      addressLocality: BUSINESS_CONFIG.address.addressLocality,
      addressRegion: BUSINESS_CONFIG.address.addressRegion,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      addressCountry: BUSINESS_CONFIG.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_CONFIG.geo.latitude,
      longitude: BUSINESS_CONFIG.geo.longitude,
    },
    hasMap: BUSINESS_CONFIG.contact.mapsUrl,
    openingHoursSpecification: BUSINESS_CONFIG.hours.schemaSpecifications,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
    founder: {
      '@type': 'Person',
      name: BUSINESS_CONFIG.founder.name,
      jobTitle: BUSINESS_CONFIG.founder.jobTitle,
    },
    sameAs: [
      BUSINESS_CONFIG.socialLinks.youtube,
      BUSINESS_CONFIG.socialLinks.instagram,
      BUSINESS_CONFIG.socialLinks.linkedin,
      BUSINESS_CONFIG.socialLinks.facebook,
      BUSINESS_CONFIG.socialLinks.github,
      BUSINESS_CONFIG.socialLinks.maps,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_CONFIG.contact.rawPhone,
      contactType: 'admissions',
      areaServed: BUSINESS_CONFIG.areaServed,
      availableLanguage: ['en', 'hi'],
    },
  };
}

export const BUSINESS_INFO = BUSINESS_CONFIG;
