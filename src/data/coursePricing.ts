import { CoursePricing } from '@/types';

/**
 * Format currency with Indian digit grouping (e.g., ₹1,25,000)
 * Uses Intl.NumberFormat('en-IN') with integer-only currency representation.
 */
export function formatINR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Verified Market Fees and MSK Institute Course Fees
 * Follows the strict rule: market_price > our_price > min_price
 * All prices stored as whole integers in INR.
 */
interface CoursePriceDefinition {
  marketPrice: number;
  ourPrice: number;
  installments?: {
    downPayment?: number;
    monthly?: number;
    tenureMonths?: number;
  };
  badge?: string;
  isPopular?: boolean;
}

export const COURSE_PRICE_CATALOG: Record<string, CoursePriceDefinition> = {
  // 1. Flagship 18-Month Multi-Stack & Security Programs
  'course-cyber-security-ethical-hacking': {
    marketPrice: 48000,
    ourPrice: 24999,
    installments: { downPayment: 4999, monthly: 1500, tenureMonths: 15 },
    badge: 'High Industry Demand',
    isPopular: true,
  },
  'course-full-stack-development': {
    marketPrice: 45000,
    ourPrice: 22999,
    installments: { downPayment: 4999, monthly: 1400, tenureMonths: 15 },
    badge: 'Flagship Architect Track',
    isPopular: true,
  },

  // 2. 12-Month Diplomas & Professional Masteries
  'course-adca': {
    marketPrice: 15000,
    ourPrice: 9999,
    installments: { downPayment: 1999, monthly: 900, tenureMonths: 10 },
    badge: 'Govt Job Eligible',
    isPopular: true,
  },
  'course-o-level': {
    marketPrice: 20000,
    ourPrice: 12999,
    installments: { downPayment: 2999, monthly: 1100, tenureMonths: 10 },
    badge: 'NIELIT National Diploma',
    isPopular: true,
  },
  'course-full-stack-mern-mastery--12-months': {
    marketPrice: 38000,
    ourPrice: 19999,
    installments: { downPayment: 3999, monthly: 1800, tenureMonths: 10 },
    badge: 'Job-Ready Full Stack',
    isPopular: true,
  },
  'course-full-stack-python-mastery--12-months': {
    marketPrice: 36000,
    ourPrice: 18999,
    installments: { downPayment: 3999, monthly: 1700, tenureMonths: 10 },
    badge: 'Python & Django Architecture',
    isPopular: true,
  },
  'course-data-analysis-mastery-combo-course--12-months': {
    marketPrice: 32000,
    ourPrice: 16999,
    installments: { downPayment: 3499, monthly: 1500, tenureMonths: 10 },
    badge: 'Data Analyst Specialization',
    isPopular: true,
  },

  // 3. 8-Month Specialization Combos
  'course-python-backend-development-mastery-combo--8-months': {
    marketPrice: 24000,
    ourPrice: 12999,
    installments: { downPayment: 2999, monthly: 1700, tenureMonths: 6 },
    badge: 'Backend Engineering',
  },
  'course-frontend-development--8-months': {
    marketPrice: 22000,
    ourPrice: 11999,
    installments: { downPayment: 2499, monthly: 1600, tenureMonths: 6 },
    badge: 'Frontend Engineering',
  },

  // 4. 4-6 Month Mid-Length Programs
  'course-excel-mastery': {
    marketPrice: 7000,
    ourPrice: 3999,
    installments: { downPayment: 999, monthly: 750, tenureMonths: 4 },
    badge: 'Bestseller in Office Tech',
    isPopular: true,
  },
  'course-web-designing-complete-pathway--4-months': {
    marketPrice: 12000,
    ourPrice: 6499,
    installments: { downPayment: 1499, monthly: 1700, tenureMonths: 3 },
    badge: 'UI/UX & Modern Web',
  },
  'course-dsa-mastery-course': {
    marketPrice: 14000,
    ourPrice: 6999,
    installments: { downPayment: 1999, monthly: 1750, tenureMonths: 3 },
    badge: 'Coding Interview Prep',
  },
  'course-ms-office--4-months': {
    marketPrice: 5500,
    ourPrice: 2999,
    installments: { downPayment: 899, monthly: 700, tenureMonths: 3 },
    badge: 'Office Productivity',
  },

  // 5. 3-Month Fast-Track & Certification Masteries
  'course-ccc-nielit': {
    marketPrice: 4000,
    ourPrice: 2499,
    installments: { downPayment: 999, monthly: 800, tenureMonths: 2 },
    badge: 'Mandatory UP Govt Exams',
    isPopular: true,
  },
  'course-python-mastery': {
    marketPrice: 9000,
    ourPrice: 4999,
    installments: { downPayment: 1499, monthly: 1750, tenureMonths: 2 },
    badge: 'Top Rated Coding',
    isPopular: true,
  },
  'course-power-bi-mastery-beginner-to-advanced--3-months': {
    marketPrice: 8500,
    ourPrice: 4499,
    installments: { downPayment: 1499, monthly: 1500, tenureMonths: 2 },
    badge: 'BI & Dashboarding',
  },
  'course-sql-mysql-mastery-beginner-to-advanced--3-months': {
    marketPrice: 7500,
    ourPrice: 3999,
    installments: { downPayment: 1199, monthly: 1400, tenureMonths: 2 },
    badge: 'Database Engineering',
  },
  'course-javascript-mastery': {
    marketPrice: 8000,
    ourPrice: 4499,
    installments: { downPayment: 1499, monthly: 1500, tenureMonths: 2 },
    badge: 'Web App Engineering',
  },

  // 6. 2-Month Specialized Modules
  'course-backend-node': {
    marketPrice: 6000,
    ourPrice: 2999,
    installments: { downPayment: 999, monthly: 1000, tenureMonths: 2 },
    badge: 'Node & APIs',
  },
  'course-python-for-advanced': {
    marketPrice: 5000,
    ourPrice: 2499,
    installments: { downPayment: 999, monthly: 750, tenureMonths: 2 },
  },
  'course-ms-excel-for-intermediate': {
    marketPrice: 3500,
    ourPrice: 1799,
  },
  'course-ms-excel-for-advanced': {
    marketPrice: 3500,
    ourPrice: 1799,
  },
  'course-django-for-backend-development': {
    marketPrice: 6000,
    ourPrice: 2999,
    installments: { downPayment: 999, monthly: 1000, tenureMonths: 2 },
    badge: 'Python Web Framework',
  },
  'course-ms-word-complete-pathway-beginner-to-advanced--2-months': {
    marketPrice: 3500,
    ourPrice: 1799,
  },
  'course-nodejs-and-express-backend': {
    marketPrice: 5500,
    ourPrice: 2799,
  },
  'course-nextjs-complete-course': {
    marketPrice: 6000,
    ourPrice: 2999,
    badge: 'Full Stack React 15',
  },
  'course-flask-complete-course': {
    marketPrice: 5000,
    ourPrice: 2499,
  },

  // 7. 1-Month Focused Skills (Standard: Market ₹2,500 | MSK ₹1,299)
  'course-html5-complete-course': { marketPrice: 2500, ourPrice: 1299 },
  'course-css-for-beginners': { marketPrice: 2500, ourPrice: 1299 },
  'course-css-for-intermediate': { marketPrice: 2500, ourPrice: 1299 },
  'course-css-for-advanced': { marketPrice: 2500, ourPrice: 1299 },
  'course-python-for-beginners': { marketPrice: 3000, ourPrice: 1499, badge: 'Coding Starter' },
  'course-python-for-intermediate': { marketPrice: 3000, ourPrice: 1499 },
  'course-numpy-complete-course': { marketPrice: 2500, ourPrice: 1299 },
  'course-javascript-for-beginners': { marketPrice: 3000, ourPrice: 1499 },
  'course-javascript-for-intermediate': { marketPrice: 3000, ourPrice: 1499 },
  'course-javascript-for-advanced': { marketPrice: 3000, ourPrice: 1499 },
  'course-react-js-for-beginners': { marketPrice: 3500, ourPrice: 1699, badge: 'React Fundamentals' },
  'course-react-js-for-intermediate': { marketPrice: 3500, ourPrice: 1699 },
  'course-react-js-for-advanced': { marketPrice: 3500, ourPrice: 1699 },
  'course-bootstrap-for-beginner': { marketPrice: 2200, ourPrice: 1099 },
  'course-bootstrap-for-advanced': { marketPrice: 2200, ourPrice: 1099 },
  'course-sql-for-beginners': { marketPrice: 2500, ourPrice: 1299 },
  'course-sql-for-intermediate': { marketPrice: 2500, ourPrice: 1299 },
  'course-sql-for-advanced': { marketPrice: 2500, ourPrice: 1299 },
  'course-ms-word-for-beginners': { marketPrice: 2000, ourPrice: 999 },
  'course-ms-word-for-advanced': { marketPrice: 2000, ourPrice: 999 },
  'course-git--github-basics': { marketPrice: 2000, ourPrice: 999, badge: 'Essential Dev Tool' },
  'course-ms-powerpoint-for-beginners': { marketPrice: 2000, ourPrice: 999 },
  'course-ms-excel-for-beginners': { marketPrice: 2500, ourPrice: 1299 },
  'course-power-bi-for-beginners': { marketPrice: 3000, ourPrice: 1499 },
  'course-power-bi-for-intermediate': { marketPrice: 3000, ourPrice: 1499 },
  'course-power-bi-for-advanced': { marketPrice: 3000, ourPrice: 1499 },
  'course-data-analysis--basics--pandas': { marketPrice: 3000, ourPrice: 1499 },
  'course-data-analysis--visualization--statistics': { marketPrice: 3000, ourPrice: 1499 },
  'course-data-analysis--advanced-pandas--ml-basics': { marketPrice: 3500, ourPrice: 1699 },
  'course-tableau-for-beginners': { marketPrice: 3000, ourPrice: 1499 },
  'course-orm-concepts-for-backend-development': { marketPrice: 2500, ourPrice: 1299 },
  'course-rest-api-development-with-django': { marketPrice: 3000, ourPrice: 1499 },
  'course-authentication--authorization-for-backend': { marketPrice: 2500, ourPrice: 1299 },
  'course-deployment--hosting-for-backend': { marketPrice: 2500, ourPrice: 1299 },
  'course-advanced-backend-concepts': { marketPrice: 2500, ourPrice: 1299 },
  'course-markdown-mastery': { marketPrice: 1500, ourPrice: 799 },
  'course-pandas-complete-course': { marketPrice: 2500, ourPrice: 1299 },
  'course-mongodb-and-mongoose-database': { marketPrice: 2500, ourPrice: 1299 },
  'course-tailwind-css-mastery': { marketPrice: 2500, ourPrice: 1299 },
};

// Aliases for slug-based lookups
const SLUG_PRICE_MAP: Record<string, string> = {
  'cyber-security-ethical-hacking-professional-program': 'course-cyber-security-ethical-hacking',
  'full-stack-development': 'course-full-stack-development',
  'adca': 'course-adca',
  'o-level': 'course-o-level',
  'data-analysis-mastery-combo-course--12-months': 'course-data-analysis-mastery-combo-course--12-months',
  'full-stack-mern-mastery--12-months': 'course-full-stack-mern-mastery--12-months',
  'full-stack-python-mastery--12-months': 'course-full-stack-python-mastery--12-months',
  'python-backend-development-mastery-combo--8-months': 'course-python-backend-development-mastery-combo--8-months',
  'frontend-development--8-months': 'course-frontend-development--8-months',
  'excel-mastery': 'course-excel-mastery',
  'ms-office--4-months': 'course-ms-office--4-months',
  'web-designing-complete-pathway--4-months': 'course-web-designing-complete-pathway--4-months',
  'dsa-mastery-course': 'course-dsa-mastery-course',
  'ccc': 'course-ccc-nielit',
  'ccc-nielit': 'course-ccc-nielit',
  'python-mastery': 'course-python-mastery',
  'power-bi-mastery': 'course-power-bi-mastery-beginner-to-advanced--3-months',
  'power-bi-mastery-beginner-to-advanced--3-months': 'course-power-bi-mastery-beginner-to-advanced--3-months',
  'sql-mastery': 'course-sql-mysql-mastery-beginner-to-advanced--3-months',
  'sql-mysql-mastery-beginner-to-advanced--3-months': 'course-sql-mysql-mastery-beginner-to-advanced--3-months',
  'javascript-mastery': 'course-javascript-mastery',
  'backend-node': 'course-backend-node',
  'nextjs-complete-course': 'course-nextjs-complete-course',
};

/**
 * Resolve course pricing by course ID or slug
 * Falls back safely to duration-based tiering if an unlisted course is queried.
 */
export function getCoursePricing(
  idOrSlug: string,
  fallbackDetails?: { title?: string; durationValue?: number; durationUnit?: 'HOURS' | 'DAYS' | 'MONTHS'; mode?: 'ONLINE' | 'OFFLINE' | 'BOTH' }
): CoursePricing {
  const normalizedKey = (idOrSlug || '').trim().toLowerCase();
  const matchedId =
    COURSE_PRICE_CATALOG[idOrSlug]
      ? idOrSlug
      : SLUG_PRICE_MAP[normalizedKey] ||
        Object.keys(COURSE_PRICE_CATALOG).find(
          (k) => k.toLowerCase() === normalizedKey || k.toLowerCase().replace(/^course-/, '') === normalizedKey
        );

  const matched = matchedId ? COURSE_PRICE_CATALOG[matchedId] : null;

  let marketPrice = matched?.marketPrice;
  let ourPrice = matched?.ourPrice;
  let installments = matched?.installments;
  const badge = matched?.badge;
  const isPopular = matched?.isPopular;

  // Duration-based adaptive fallback if not explicitly in table
  if (!marketPrice || !ourPrice) {
    const months =
      fallbackDetails?.durationUnit === 'MONTHS'
        ? fallbackDetails.durationValue || 1
        : fallbackDetails?.durationUnit === 'DAYS'
        ? Math.round((fallbackDetails.durationValue || 30) / 30)
        : 1;

    if (months >= 12) {
      marketPrice = 18000;
      ourPrice = 9999;
      installments = { downPayment: 1999, monthly: 900, tenureMonths: 10 };
    } else if (months >= 6) {
      marketPrice = 10000;
      ourPrice = 4999;
      installments = { downPayment: 1499, monthly: 900, tenureMonths: 4 };
    } else if (months >= 3) {
      marketPrice = 6000;
      ourPrice = 3499;
      installments = { downPayment: 999, monthly: 1300, tenureMonths: 2 };
    } else {
      marketPrice = 2500;
      ourPrice = 1299;
    }
  }

  const savingsAmount = Math.max(0, marketPrice - ourPrice);
  const savingsPercent = Math.round((savingsAmount / marketPrice) * 100);

  const durationStr = fallbackDetails?.durationValue
    ? `${fallbackDetails.durationValue} ${fallbackDetails.durationUnit || 'MONTHS'}`
    : 'Comprehensive';

  return {
    courseId: matchedId || idOrSlug,
    slug: normalizedKey,
    title: fallbackDetails?.title || idOrSlug,
    duration: durationStr,
    marketPrice,
    ourPrice,
    savingsAmount,
    savingsPercent,
    installments,
    mode: fallbackDetails?.mode || 'BOTH',
    badge,
    isPopular,
  };
}
