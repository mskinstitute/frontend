/**
 * MSK Institute — Topical Clusters & Content Relationship Model
 *
 * Implements a unified knowledge graph connecting:
 * - Commercial Courses
 * - Educational Tutorial Series
 * - Editorial Publications & Viva Interview Guides
 * - Downloadable Cheatsheets & Practice Material
 * - Live Cohort Batches
 */

export interface TopicalCluster {
  clusterId: string;
  name: string;
  description: string;
  courseSlugs: string[];
  tutorialSlugs: string[];
  blogSlugs: string[];
  cheatsheetIds: string[];
}

export const TOPICAL_CLUSTERS: Record<string, TopicalCluster> = {
  python: {
    clusterId: 'python',
    name: 'Python Programming & Software Engineering',
    description: 'From fundamental syntax to Object-Oriented Programming, automation scripting, Flask microservices, and Django web architecture.',
    courseSlugs: [
      'python-programming-masterclass',
      'python-for-beginners',
      'python-for-intermediate',
      'python-for-advanced',
      'django-for-backend-development',
      'flask-complete-course',
      'rest-api-development-with-django',
    ],
    tutorialSlugs: [
      'python-for-beginners',
      'python-for-intermediate',
      'python-for-advanced',
      'flask-complete-course',
      'django-for-backend-development',
      'rest-api-development-with-django',
    ],
    blogSlugs: [
      'top-50-python-interview-and-viva-questions-with-answers',
      'python-vs-javascript-which-to-learn-first',
    ],
    cheatsheetIds: [
      'cheat-python-beginners',
      'cheat-django-drf-architecture',
      'cheat-flask-architecture',
    ],
  },

  'web-development': {
    clusterId: 'web-development',
    name: 'Full-Stack Web Development & Modern Frontend',
    description: 'Industrial MERN stack development covering semantic HTML5, modern CSS3, Tailwind CSS, JavaScript ES6+, React 19, Node.js, and MongoDB.',
    courseSlugs: [
      'full-stack-web-development-bootcamp',
      'html5-css3-modern-ui-design',
      'javascript-frontend-engineering',
      'react-modern-web-development',
      'nodejs-and-express-backend',
      'mongodb-and-mongoose-database',
      'tailwind-css-mastery',
      'nextjs-complete-course',
    ],
    tutorialSlugs: [
      'html5-complete-course',
      'css-for-beginners',
      'css-for-intermediate',
      'css-for-advanced',
      'tailwind-css-mastery',
      'javascript-for-beginners',
      'javascript-for-intermediate',
      'javascript-for-advanced',
      'react-js-for-beginners',
      'react-js-for-intermediate',
      'react-js-for-advanced',
      'nextjs-complete-course',
      'nodejs-and-express-backend',
      'mongodb-and-mongoose-database',
      'git--github-basics',
    ],
    blogSlugs: [
      'full-stack-web-development-roadmap-2026',
      'html5-css3-top-50-viva-questions-frontend-lab-guide',
    ],
    cheatsheetIds: [
      'cheat-html5-complete',
      'cheat-css-flex-grid',
      'cheat-tailwind-css-mastery',
      'cheat-react-modern-architecture',
      'cheat-nextjs-fullstack-framework',
      'cheat-nodejs-express-backend',
      'cheat-mongodb-mongoose-database',
      'cheat-git-commands',
    ],
  },

  'data-analytics': {
    clusterId: 'data-analytics',
    name: 'Data Analytics & Business Intelligence',
    description: 'Data transformation, statistical analysis, dashboard engineering with Advanced Excel, SQL, Python (Pandas/NumPy), and Power BI.',
    courseSlugs: [
      'data-analytics-python-excel',
      'advanced-excel-business-analytics',
      'power-bi-business-intelligence',
      'pandas-complete-course',
      'numpy-complete-course',
      'tableau-for-beginners',
      'sql-database-mastery',
    ],
    tutorialSlugs: [
      'ms-excel-for-beginners',
      'ms-excel-for-intermediate',
      'ms-excel-for-advanced',
      'power-bi-for-beginners',
      'power-bi-for-intermediate',
      'power-bi-for-advanced',
      'pandas-complete-course',
      'numpy-complete-course',
      'tableau-for-beginners',
      'data-analysis--visualization--statistics',
      'data-analysis--advanced-pandas--ml-basics',
      'sql-for-beginners',
    ],
    blogSlugs: [
      'how-to-become-a-data-analyst-in-2026-complete-roadmap',
      'top-10-excel-formulas-every-office-professional-must-know',
      'top-30-sql-queries-interview-questions-with-answers',
    ],
    cheatsheetIds: [
      'cheat-excel-top50',
      'cheat-sql-data-analytics',
      'cheat-power-bi-dax-modeling',
      'cheat-pandas-data-science',
    ],
  },

  sql: {
    clusterId: 'sql',
    name: 'SQL & Relational Database Architecture',
    description: 'Database schema design, normalized architecture, complex multi-table JOINs, subqueries, indexing, and query performance tuning.',
    courseSlugs: [
      'sql-database-mastery',
      'sql-for-beginners',
      'sql-for-intermediate',
      'sql-for-advanced',
    ],
    tutorialSlugs: [
      'sql-for-beginners',
      'sql-for-intermediate',
      'sql-for-advanced',
    ],
    blogSlugs: [
      'top-30-sql-queries-interview-questions-with-answers',
    ],
    cheatsheetIds: [
      'cheat-sql-data-analytics',
    ],
  },

  ccc: {
    clusterId: 'ccc',
    name: 'NIELIT CCC & Government Examination Track',
    description: 'Course on Computer Concepts (CCC) official syllabus covering digital literacy, LibreOffice practicals, computerized mock tests, and cyber law.',
    courseSlugs: [
      'nielit-ccc-course-on-computer-concepts',
      'ccc',
    ],
    tutorialSlugs: [
      'ccc',
      'ms-word-for-beginners',
      'ms-excel-for-beginners',
      'ms-powerpoint-for-beginners',
    ],
    blogSlugs: [
      'how-to-prepare-for-nielit-ccc-exam-first-attempt',
      'nielit-o-level-vs-ccc-exam-comparison-guide-2026',
    ],
    cheatsheetIds: [
      'cheat-excel-top50',
    ],
  },

  adca: {
    clusterId: 'adca',
    name: '1-Year Advanced Diploma in Computer Applications (ADCA)',
    description: 'Comprehensive 12-month computer diploma covering office automation, Tally financial accounting, graphic tools, and internet applications.',
    courseSlugs: [
      'advanced-diploma-computer-applications-adca',
      'adca',
    ],
    tutorialSlugs: [
      'ms-word-for-beginners',
      'ms-word-for-advanced',
      'ms-excel-for-beginners',
      'ms-excel-for-advanced',
      'ms-powerpoint-for-beginners',
      'ccc',
    ],
    blogSlugs: [
      'adca-computer-course-syllabus-fees-job-scope-2026',
      'top-10-excel-formulas-every-office-professional-must-know',
    ],
    cheatsheetIds: [
      'cheat-excel-top50',
    ],
  },

  'cyber-security': {
    clusterId: 'cyber-security',
    name: 'Cyber Security & Ethical Defense',
    description: 'Network protocols, vulnerability assessment, ethical penetration testing concepts, authentication, and digital hygiene.',
    courseSlugs: [
      'cyber-security-fundamentals',
      'cyber-security',
    ],
    tutorialSlugs: [
      'git--github-basics',
    ],
    blogSlugs: [
      'demystifying-cyber-security-7-habits-to-protect-digital-footprint',
    ],
    cheatsheetIds: [],
  },
};

/**
 * Resolve the most relevant topical cluster for a given course or topic slug.
 */
export function getClusterForCourse(courseSlug: string, categories: string[] = []): TopicalCluster | null {
  const cleanSlug = courseSlug.toLowerCase();

  // 1. Direct match in cluster courseSlugs
  for (const cluster of Object.values(TOPICAL_CLUSTERS)) {
    if (cluster.courseSlugs.some(s => s.toLowerCase() === cleanSlug || cleanSlug.includes(s.toLowerCase()))) {
      return cluster;
    }
  }

  // 2. Keyword fallback match
  if (cleanSlug.includes('python') || cleanSlug.includes('django') || cleanSlug.includes('flask')) {
    return TOPICAL_CLUSTERS.python;
  }
  if (cleanSlug.includes('web') || cleanSlug.includes('html') || cleanSlug.includes('react') || cleanSlug.includes('javascript') || cleanSlug.includes('node') || cleanSlug.includes('mern')) {
    return TOPICAL_CLUSTERS['web-development'];
  }
  if (cleanSlug.includes('analytics') || cleanSlug.includes('data') || cleanSlug.includes('pandas') || cleanSlug.includes('power-bi') || cleanSlug.includes('excel')) {
    return TOPICAL_CLUSTERS['data-analytics'];
  }
  if (cleanSlug.includes('sql') || cleanSlug.includes('database') || cleanSlug.includes('mysql')) {
    return TOPICAL_CLUSTERS.sql;
  }
  if (cleanSlug.includes('ccc') || cleanSlug.includes('nielit')) {
    return TOPICAL_CLUSTERS.ccc;
  }
  if (cleanSlug.includes('adca')) {
    return TOPICAL_CLUSTERS.adca;
  }
  if (cleanSlug.includes('security') || cleanSlug.includes('cyber')) {
    return TOPICAL_CLUSTERS['cyber-security'];
  }

  // 3. Category array match
  const catText = categories.join(' ').toLowerCase();
  if (catText.includes('python')) return TOPICAL_CLUSTERS.python;
  if (catText.includes('web') || catText.includes('frontend') || catText.includes('backend')) return TOPICAL_CLUSTERS['web-development'];
  if (catText.includes('analytics') || catText.includes('excel') || catText.includes('bi')) return TOPICAL_CLUSTERS['data-analytics'];
  if (catText.includes('sql') || catText.includes('database')) return TOPICAL_CLUSTERS.sql;
  if (catText.includes('adca')) return TOPICAL_CLUSTERS.adca;
  if (catText.includes('security')) return TOPICAL_CLUSTERS['cyber-security'];

  return null;
}
