/**
 * MSK Institute — Canonical Single Source of Truth
 *
 * Central configuration for Name, Address, Phone (NAP), Operating Hours,
 * GeoCoordinates, Verified Reviews, Service Areas, Social URLs, and Schema.org metadata.
 */

export const INSTITUTE_CONFIG = {
  name: 'MSK Institute',
  legalName: 'MSK Institute of Technology & Coding',
  alternateNames: [
    'MSK Computer Institute',
    'MSK Institute Shikohabad',
    'MSK Coding Academy',
    'MSK Computer Center Shikohabad',
    'CodeWork Technologies',
  ],
  tagline: 'Practical Skills for Real Careers',
  description: "Shikohabad's Premier Computer Training & Coding Academy with 100% practical lab training in Python, Full-Stack Web Development, NIELIT CCC, ADCA, and Data Analytics.",
  websiteUrl: 'https://www.mskinstitute.in',
  canonicalUrl: 'https://www.mskinstitute.in',
  telephone: '+91 83930 42166',
  formattedTelephoneAlt: '083930 42166',
  email: 'mskshikohabad@gmail.com',
  logoUrl: 'https://www.mskinstitute.in/logo.jpg',
  priceRange: '₹₹',

  // Canonical Contact & NAP Details
  contact: {
    phone: '+91 83930 42166',
    phoneAlt: '083930 42166',
    formattedPhone: '+91 83930 42166',
    rawPhone: '+918393042166',
    cleanWhatsApp: '918393042166',
    email: 'mskshikohabad@gmail.com',
    whatsAppUrl: 'https://wa.me/918393042166',
    mapsUrl: 'https://maps.google.com/maps?cid=12440673232057670688',
    googleCidUrl: 'https://maps.google.com/maps?cid=12440673232057670688',
    googleCid: '12440673232057670688',
  },

  // Canonical Address (HQ - Shikohabad)
  address: {
    streetAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Adarsh Nagar',
    area: 'Adarsh Nagar, Station Road Area',
    fullAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Adarsh Nagar, Shikohabad, Uttar Pradesh 283135',
    displayAddress: 'Gali No. 3, Near Gyan Jyoti Public School, Adarsh Nagar, Shikohabad, Uttar Pradesh 283135',
    addressLocality: 'Shikohabad',
    addressRegion: 'Uttar Pradesh',
    postalCode: '283135',
    addressCountry: 'IN',
  },

  // Canonical Geo Coordinates (Verified Google Business Profile)
  geo: {
    latitude: 27.1157333,
    longitude: 78.582971,
  },

  // Standardized Operating Hours
  hours: {
    display: 'Mon – Sat: 8:00 AM – 7:00 PM | Sun: 10:00 AM – 2:00 PM',
    weekday: 'Mon – Sat: 8:00 AM – 7:00 PM',
    weekend: 'Sun: 10:00 AM – 2:00 PM',
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

  // Official Social & Platform URLs
  urls: {
    website: 'https://www.mskinstitute.in/',
    bookDemo: 'https://www.mskinstitute.in/book-demo',
    whatsapp: 'https://wa.me/918393042166',
    instagram: 'https://www.instagram.com/mskinstitute.in/',
    youtube: 'https://www.youtube.com/@mskinstitute',
    linkedin: 'https://www.linkedin.com/company/mskinstitute/',
    facebook: 'https://www.facebook.com/mskinstitute.in', // TODO: Confirm Facebook URL with institute owner
    maps: 'https://maps.google.com/maps?cid=12440673232057670688',
  },

  // Backwards-compatible socialLinks mapping
  socialLinks: {
    youtube: 'https://www.youtube.com/@mskinstitute',
    instagram: 'https://www.instagram.com/mskinstitute.in/',
    linkedin: 'https://www.linkedin.com/company/mskinstitute/',
    maps: 'https://maps.google.com/maps?cid=12440673232057670688',
    facebook: 'https://www.facebook.com/mskinstitute.in',
    github: 'https://github.com/mskinstitute',
    whatsapp: 'https://wa.me/918393042166',
  },

  // Primary Service Areas for Local SEO (Firozabad District, UP)
  areaServed: [
    'Shikohabad',
    'Firozabad',
    'Sirsaganj',
  ],

  // Extended Regional Service Areas
  regionalServiceAreas: [
    'Shikohabad',
    'Firozabad',
    'Sirsaganj',
    'Jasrana',
    'Tundla',
    'Mainpuri',
    'Uttar Pradesh',
  ],

  // Trust & Evidence Metrics (Strictly 38 Verified Reviews)
  stats: {
    rating: '4.9',
    ratingValue: '4.9',
    ratingDisplay: '4.9/5',
    reviewCount: '38',
    reviewCountNumeric: 38,
    reviewCountDisplay: '38+ Verified Reviews',
    activeCourses: '78+',
    totalCourses: 78,
    practicalLabRatio: '100%',
    verifiedCertificates: '500+',
    nextCohortDate: 'December 1, 2026',
  },

  // Core Flagship Courses & Synced Pricing (INR)
  flagshipCourses: [
    {
      id: 'course-python-mastery',
      slug: 'python-mastery',
      title: 'Python Programming Mastery',
      price: 3999,
      formattedPrice: '₹3,999',
      marketPrice: 9000,
      formattedMarketPrice: '₹9,000',
      duration: '3 Months',
      badge: 'Top Rated Coding',
      description: 'Master Python from fundamentals to OOP, automation scripts, and practical capstone projects with 1-on-1 mentorship.',
    },
    {
      id: 'course-data-analysis-mastery-combo-course--12-months',
      slug: 'data-analysis-mastery-combo-course--12-months',
      title: 'Data Analysis Mastery',
      price: 19999,
      formattedPrice: '₹19,999',
      marketPrice: 32000,
      formattedMarketPrice: '₹32,000',
      duration: '12 Months',
      badge: 'Data Analyst Specialization',
      description: 'Comprehensive 12-month program in Excel, SQL, Power BI, Python Pandas, and statistical dashboards.',
    },
    {
      id: 'course-excel-mastery',
      slug: 'excel-mastery',
      title: 'Excel Mastery',
      price: 4999,
      formattedPrice: '₹4,999',
      marketPrice: 7000,
      formattedMarketPrice: '₹7,000',
      duration: '6 Months',
      badge: 'Bestseller in Office Tech',
      description: 'Enterprise Excel mastery: XLOOKUP, INDEX-MATCH, Dynamic Arrays, Pivot Tables, Power Query ETL, and executive KPI dashboards.',
    },
    {
      id: 'course-full-stack-development',
      slug: 'full-stack-development',
      title: 'Full-Stack Web Development',
      price: 24999,
      formattedPrice: '₹24,999',
      marketPrice: 45000,
      formattedMarketPrice: '₹45,000',
      duration: '18 Months',
      badge: 'Flagship Architect Track',
      description: 'Career-ready web architecture covering HTML5, CSS3, JavaScript, React, Node.js, Express, MongoDB, and production deployment.',
    },
    {
      id: 'course-cyber-security-ethical-hacking',
      slug: 'cyber-security-ethical-hacking-professional-program',
      title: 'Cybersecurity & Ethical Hacking',
      price: 28499,
      formattedPrice: '₹28,499',
      marketPrice: 48000,
      formattedMarketPrice: '₹48,000',
      duration: '18 Months',
      badge: 'High Industry Demand',
      description: 'Hands-on network security, ethical hacking, vulnerability assessments, penetration testing, and SOC fundamentals.',
    },
    {
      id: 'course-ccc-nielit',
      slug: 'ccc',
      title: 'NIELIT CCC Certification',
      price: 3500,
      formattedPrice: '₹3,500',
      marketPrice: 5000,
      formattedMarketPrice: '₹5,000',
      duration: '3 Months',
      badge: 'Mandatory UP Govt Exams',
      description: 'Complete syllabus preparation for NIELIT CCC exam with daily mock test series and practical LibreOffice lab sessions.',
    },
    {
      id: 'course-adca',
      slug: 'adca',
      title: 'ADCA 1-Year Diploma',
      price: 8500,
      formattedPrice: '₹8,500',
      marketPrice: 15000,
      formattedMarketPrice: '₹15,000',
      duration: '12 Months',
      badge: 'Govt Job Eligible',
      description: '1-year Advanced Diploma in Computer Applications covering Office Automation, Advanced Excel, Tally Prime GST, and Graphic Design.',
    },
    {
      id: 'course-web-designing-complete-pathway--4-months',
      slug: 'web-designing-complete-pathway--4-months',
      title: 'Web Designing Complete Pathway',
      price: 6499,
      formattedPrice: '₹6,499',
      marketPrice: 12000,
      formattedMarketPrice: '₹12,000',
      duration: '4 Months',
      badge: 'UI/UX & Modern Web',
      description: 'Modern responsive web design with HTML5, CSS3, Flexbox, CSS Grid, Tailwind CSS, JavaScript UI interactions, and Git/GitHub.',
    },
    {
      id: 'course-frontend-development--8-months',
      slug: 'frontend-development--8-months',
      title: 'Frontend Development (React & JavaScript)',
      price: 11999,
      formattedPrice: '₹11,999',
      marketPrice: 22000,
      formattedMarketPrice: '₹22,000',
      duration: '8 Months',
      badge: 'Frontend Engineering',
      description: 'Professional frontend engineer track: Modern ES6+ JavaScript, React component architecture, Hooks, State Management, and API integration.',
    },
  ],
} as const;

export const BUSINESS_CONFIG = INSTITUTE_CONFIG;
export const BUSINESS_INFO = INSTITUTE_CONFIG;

/**
 * Standardize upcoming cohort date display helper
 */
export function getUpcomingCohortDate(batchDate?: string): string {
  if (!batchDate) return INSTITUTE_CONFIG.stats.nextCohortDate;

  try {
    const target = new Date(batchDate);
    if (!isNaN(target.getTime())) {
      const now = new Date();
      if (target.getTime() < now.getTime()) {
        return 'Rolling Admissions';
      }
      return target.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {}

  return 'Rolling Admissions';
}

/**
 * Generate canonical EducationalOrganization + LocalBusiness Schema.org JSON-LD
 */
export function getCanonicalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${INSTITUTE_CONFIG.websiteUrl}/#organization`,
    name: INSTITUTE_CONFIG.name,
    legalName: INSTITUTE_CONFIG.legalName,
    alternateName: INSTITUTE_CONFIG.alternateNames,
    url: INSTITUTE_CONFIG.websiteUrl,
    logo: INSTITUTE_CONFIG.logoUrl,
    image: `${INSTITUTE_CONFIG.websiteUrl}/brand/og-banner.png`,
    description: INSTITUTE_CONFIG.description,
    telephone: INSTITUTE_CONFIG.contact.rawPhone,
    email: INSTITUTE_CONFIG.contact.email,
    priceRange: INSTITUTE_CONFIG.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: INSTITUTE_CONFIG.address.streetAddress,
      addressLocality: INSTITUTE_CONFIG.address.addressLocality,
      addressRegion: INSTITUTE_CONFIG.address.addressRegion,
      postalCode: INSTITUTE_CONFIG.address.postalCode,
      addressCountry: INSTITUTE_CONFIG.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: INSTITUTE_CONFIG.geo.latitude,
      longitude: INSTITUTE_CONFIG.geo.longitude,
    },
    hasMap: INSTITUTE_CONFIG.contact.mapsUrl,
    openingHoursSpecification: INSTITUTE_CONFIG.hours.schemaSpecifications,
    areaServed: INSTITUTE_CONFIG.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: INSTITUTE_CONFIG.stats.ratingValue,
      reviewCount: INSTITUTE_CONFIG.stats.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    founder: {
      '@type': 'Person',
      name: INSTITUTE_CONFIG.founder.name,
      jobTitle: INSTITUTE_CONFIG.founder.jobTitle,
    },
    sameAs: [
      INSTITUTE_CONFIG.urls.youtube,
      INSTITUTE_CONFIG.urls.instagram,
      INSTITUTE_CONFIG.urls.linkedin,
      INSTITUTE_CONFIG.urls.maps,
      INSTITUTE_CONFIG.urls.facebook,
      'https://github.com/mskinstitute',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: INSTITUTE_CONFIG.contact.rawPhone,
      contactType: 'admissions',
      areaServed: INSTITUTE_CONFIG.areaServed,
      availableLanguage: ['en', 'hi'],
    },
  };
}

/**
 * Generate flagship Course Schema.org JSON-LD items for homepage and catalog pages
 */
export function getFlagshipCoursesSchema() {
  return INSTITUTE_CONFIG.flagshipCourses.map((fc) => ({
    '@type': 'Course' as const,
    '@id': `${INSTITUTE_CONFIG.websiteUrl}/courses/${fc.slug}#course`,
    name: fc.title,
    description: fc.description,
    url: `${INSTITUTE_CONFIG.websiteUrl}/courses/${fc.slug}`,
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${INSTITUTE_CONFIG.websiteUrl}/#organization`,
      name: INSTITUTE_CONFIG.name,
      url: INSTITUTE_CONFIG.websiteUrl,
    },
    offers: [
      {
        '@type': 'Offer',
        price: fc.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${INSTITUTE_CONFIG.websiteUrl}/courses/${fc.slug}`,
        validFrom: '2026-01-01',
      },
    ],
  }));
}

/**
 * Generate Course Schema.org JSON-LD for single course page
 */
export function getCanonicalCourseSchema(course: {
  title: string;
  slug: string;
  shortDescription?: string;
  featuredImageUrl?: string;
  duration?: { value: number; unit: string };
  level?: string;
  language?: string;
  categories?: string[];
}, ourPrice: number, marketPrice?: number) {
  const canonicalUrl = `${INSTITUTE_CONFIG.websiteUrl}/courses/${course.slug}`;
  const durationStr = course.duration
    ? course.duration.unit === 'MONTHS'
      ? `P${course.duration.value}M`
      : `P${course.duration.value}D`
    : 'P3M';

  return {
    '@type': 'Course',
    '@id': `${canonicalUrl}#course`,
    name: course.title,
    description: course.shortDescription || `${course.title} at MSK Institute Shikohabad`,
    image: course.featuredImageUrl || INSTITUTE_CONFIG.logoUrl,
    url: canonicalUrl,
    timeRequired: durationStr,
    educationalLevel: course.level || 'Beginner to Advanced',
    inLanguage: course.language || 'en-IN',
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${INSTITUTE_CONFIG.websiteUrl}/#organization`,
      name: INSTITUTE_CONFIG.name,
      url: INSTITUTE_CONFIG.websiteUrl,
      sameAs: INSTITUTE_CONFIG.urls.maps,
      telephone: INSTITUTE_CONFIG.contact.rawPhone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: INSTITUTE_CONFIG.address.streetAddress,
        addressLocality: INSTITUTE_CONFIG.address.addressLocality,
        addressRegion: INSTITUTE_CONFIG.address.addressRegion,
        postalCode: INSTITUTE_CONFIG.address.postalCode,
        addressCountry: INSTITUTE_CONFIG.address.addressCountry,
      },
    },
    offers: [
      {
        '@type': 'Offer',
        name: `${course.title} Complete Tuition`,
        category: 'Tuition',
        price: ourPrice,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url: canonicalUrl,
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: ourPrice,
          priceCurrency: 'INR',
          description: `Course tuition fee for ${course.title} at MSK Institute Shikohabad${marketPrice ? ` (comparable market fee: ₹${marketPrice.toLocaleString('en-IN')})` : ''}.`,
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: INSTITUTE_CONFIG.stats.ratingValue,
      reviewCount: INSTITUTE_CONFIG.stats.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['onsite', 'online'],
      location: {
        '@type': 'Place',
        name: 'MSK Institute Shikohabad Campus',
        address: {
          '@type': 'PostalAddress',
          streetAddress: INSTITUTE_CONFIG.address.streetAddress,
          addressLocality: INSTITUTE_CONFIG.address.addressLocality,
          addressRegion: INSTITUTE_CONFIG.address.addressRegion,
          postalCode: INSTITUTE_CONFIG.address.postalCode,
          addressCountry: INSTITUTE_CONFIG.address.addressCountry,
        },
      },
    },
  };
}

/**
 * Generate standard Course FAQPage Schema.org JSON-LD
 */
export function getCourseFaqSchema(courseTitle: string, customFaqs?: Array<{ question: string; answer: string }>) {
  const baseFaqs = [
    {
      question: `What is the course duration and fee for ${courseTitle} at MSK Institute?`,
      answer: `${courseTitle} is offered at MSK Institute Shikohabad with transparent INR pricing, flexible installment options, and comprehensive lab curriculum. Check the course page for current fee and enrollment details.`,
    },
    {
      question: `Can I attend a free demo class for ${courseTitle}?`,
      answer: `Yes, MSK Institute provides a 100% free 2-day trial demo class and hands-on lab session at our Shikohabad campus (${INSTITUTE_CONFIG.address.displayAddress}) and live online. Book online or message us on WhatsApp (${INSTITUTE_CONFIG.telephone}).`,
    },
    {
      question: `Are offline lab workstations and computers provided in Shikohabad?`,
      answer: `Yes, our Shikohabad center follows a strict 1-student-1-PC policy with dedicated high-speed systems, high-speed optical internet, uninterrupted power backup, and 1-on-1 mentor guidance by Er. Sumit Kumar.`,
    },
    {
      question: `Will I receive a verified certificate upon completing ${courseTitle}?`,
      answer: `Yes. Upon course completion and project submission, every student receives an official ISO 9001:2015 verified certificate with a tamper-proof QR code and online verification page at https://www.mskinstitute.in/verify-certificate.`,
    },
    {
      question: `Is this course available for students outside Shikohabad (Firozabad, Sirsaganj, or across India)?`,
      answer: `Yes. All core programs operate in hybrid mode: students in Shikohabad, Firozabad, and Sirsaganj can attend in-person classroom labs, while students across India can join live interactive Google Meet sessions with full mentor support.`,
    },
  ];

  const merged = customFaqs && customFaqs.length > 0 ? customFaqs : baseFaqs;

  return {
    '@type': 'FAQPage',
    mainEntity: merged.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
