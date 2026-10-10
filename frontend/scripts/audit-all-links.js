const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const courses = JSON.parse(fs.readFileSync(path.join(rootDir, 'public/data/all-courses.json'), 'utf8'));
const validCourseSlugs = new Set(courses.map(c => c.slug));
const tutorials = JSON.parse(fs.readFileSync(path.join(rootDir, 'public/data/tutorials.json'), 'utf8'));
const validTutSlugs = new Set(tutorials.map(t => t.slug));
const studyMaterials = JSON.parse(fs.readFileSync(path.join(rootDir, 'public/data/study-materials.json'), 'utf8'));
const validSmSlugs = new Set(studyMaterials.map(s => s.slug || s.id));

const brokenLinks = [];

// 1. Audit Blogs
const blogsDir = path.join(rootDir, 'content/blogs');
const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

blogFiles.forEach(file => {
  const filePath = path.join(blogsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check relatedCourseSlugs
  const m = content.match(/relatedCourseSlugs:\s*\[(.*?)\]/);
  if (m) {
    const rawSlugs = m[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    rawSlugs.forEach(slug => {
      if (!validCourseSlugs.has(slug)) {
        brokenLinks.push({
          sourcePage: `content/blogs/${file}`,
          brokenURL: `/courses/${slug}`,
          type: 'relatedCourseSlugs frontmatter',
          intendedDestination: getSuggestedCourseSlug(slug),
          recommendedFix: `Update frontmatter relatedCourseSlugs to '${getSuggestedCourseSlug(slug)}' and add 301 redirect in next.config.ts`
        });
      }
    });
  }

  // Check markdown links
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    const href = match[2];
    if (href.startsWith('/courses/')) {
      const slug = href.replace('/courses/', '').split('#')[0].split('?')[0];
      if (!validCourseSlugs.has(slug)) {
        brokenLinks.push({
          sourcePage: `content/blogs/${file}`,
          brokenURL: href,
          type: 'Markdown anchor link',
          intendedDestination: `/courses/${getSuggestedCourseSlug(slug)}`,
          recommendedFix: `Update link to '/courses/${getSuggestedCourseSlug(slug)}'`
        });
      }
    }
  }
});

// 2. Audit Certificates
const certPath = path.join(rootDir, 'public/data/certificates.json');
const certs = JSON.parse(fs.readFileSync(certPath, 'utf8'));
certs.forEach((c, idx) => {
  if (c.courseSlug && !validCourseSlugs.has(c.courseSlug)) {
    brokenLinks.push({
      sourcePage: `public/data/certificates.json [item ${idx}: ${c.id}]`,
      brokenURL: `/courses/${c.courseSlug}`,
      type: 'certificate courseSlug',
      intendedDestination: `/courses/${getSuggestedCourseSlug(c.courseSlug)}`,
      recommendedFix: `Update certificate courseSlug to '${getSuggestedCourseSlug(c.courseSlug)}'`
    });
  }
});

// 3. Audit Tutorials
tutorials.forEach(t => {
  if (t.courseSlug && !validCourseSlugs.has(t.courseSlug)) {
    brokenLinks.push({
      sourcePage: `public/data/tutorials.json [tutorial: ${t.slug}]`,
      brokenURL: `/courses/${t.courseSlug}`,
      type: 'tutorial courseSlug',
      intendedDestination: `/courses/${getSuggestedCourseSlug(t.courseSlug)}`,
      recommendedFix: `Update tutorial courseSlug to '${getSuggestedCourseSlug(t.courseSlug)}'`
    });
  }
});

// 4. Audit Components & Pages
function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(item)) scanDir(p);
    } else if (/\.(tsx|ts)$/.test(item)) {
      const content = fs.readFileSync(p, 'utf8');
      const relPath = path.relative(rootDir, p);

      // Search for /courses/... hrefs
      const regex = /['"`]\/courses\/([a-zA-Z0-9_\-]+)['"`]/g;
      let m;
      while ((m = regex.exec(content)) !== null) {
        const slug = m[1];
        if (!validCourseSlugs.has(slug) && slug !== '[slug]') {
          brokenLinks.push({
            sourcePage: relPath,
            brokenURL: `/courses/${slug}`,
            type: 'TSX/TS Link or string',
            intendedDestination: `/courses/${getSuggestedCourseSlug(slug)}`,
            recommendedFix: `Replace with '/courses/${getSuggestedCourseSlug(slug)}'`
          });
        }
      }

      // Search for comparisonData or hardcoded slugs
      const compRegex = /slug:\s*['"]([a-zA-Z0-9_\-]+)['"]/g;
      let cm;
      while ((cm = compRegex.exec(content)) !== null) {
        const slug = cm[1];
        if (!validCourseSlugs.has(slug) && !validTutSlugs.has(slug) && !validSmSlugs.has(slug)) {
          // If in CourseCatalogClient or similar
          if (relPath.includes('Course') || relPath.includes('catalog')) {
            brokenLinks.push({
              sourcePage: relPath,
              brokenURL: `/courses/${slug}`,
              type: 'Catalog object slug',
              intendedDestination: `/courses/${getSuggestedCourseSlug(slug)}`,
              recommendedFix: `Update object slug to '${getSuggestedCourseSlug(slug)}'`
            });
          }
        }
      }
    }
  }
}

scanDir(path.join(rootDir, 'src'));

function getSuggestedCourseSlug(slug) {
  const mapping = {
    'html5-complete-masterclass': 'html5-complete-course',
    'javascript-react-frontend-engineering': 'frontend-development--8-months',
    'ccc-computer-concepts': 'ccc',
    'ccc-course-on-computer-concepts': 'ccc',
    'master-computer-coding-diploma': 'full-stack-development',
    'html-complete-course': 'html5-complete-course',
    'python-programming-masterclass': 'python-mastery-beginner-to-advanced--3-months',
    'full-stack-web-development-bootcamp': 'full-stack-web-dev-bootcamp',
    'full-stack-web-development': 'full-stack-development',
    'html5-css3-modern-ui-design': 'web-designing-complete-pathway--4-months',
    'adca-advanced-diploma-computer-applications': 'adca',
  };
  return mapping[slug] || slug;
}

console.log('--- BROKEN INTERNAL LINKS AUDIT RESULT ---');
console.log(`Total broken references detected: ${brokenLinks.length}`);
brokenLinks.forEach((b, i) => {
  console.log(`\n#${i + 1} [${b.type}]`);
  console.log(`  Source: ${b.sourcePage}`);
  console.log(`  Broken URL: ${b.brokenURL}`);
  console.log(`  Intended: ${b.intendedDestination}`);
  console.log(`  Fix: ${b.recommendedFix}`);
});

// Output markdown report
const reportPath = path.join(rootDir, 'docs/broken-links-report.md');
let mdReport = `# MSK Institute Website — Broken Links Audit Report

**Date:** September 2026  
**Auditor:** Automated Repository Link & Route Verifier  
**Total Broken References Found:** ${brokenLinks.length}  

## Executive Summary
This report identifies every broken internal course URL, stale reference in blogs, certificates, catalog comparison tables, and components. Every identified broken URL is mapped to its canonical destination and permanent 301 redirect.

| # | Source Page / File | Broken URL | Status | Intended Canonical Destination | Recommended Fix |
|---|---|---|---|---|---|
`;

brokenLinks.forEach((b, i) => {
  mdReport += `| ${i + 1} | \`${b.sourcePage}\` | \`${b.brokenURL}\` | 404 Not Found | \`${b.intendedDestination}\` | ${b.recommendedFix} |\n`;
});

mdReport += `\n## Redirect Map Required for next.config.ts\n\`\`\`ts
const courseRedirects = [
  { source: '/courses/html5-complete-masterclass', destination: '/courses/html5-complete-course', permanent: true },
  { source: '/courses/html-complete-course', destination: '/courses/html5-complete-course', permanent: true },
  { source: '/courses/javascript-react-frontend-engineering', destination: '/courses/frontend-development--8-months', permanent: true },
  { source: '/courses/ccc-computer-concepts', destination: '/courses/ccc', permanent: true },
  { source: '/courses/ccc-course-on-computer-concepts', destination: '/courses/ccc', permanent: true },
  { source: '/courses/master-computer-coding-diploma', destination: '/courses/full-stack-development', permanent: true },
  { source: '/courses/python-programming-masterclass', destination: '/courses/python-mastery-beginner-to-advanced--3-months', permanent: true },
  { source: '/courses/full-stack-web-development-bootcamp', destination: '/courses/full-stack-web-dev-bootcamp', permanent: true },
  { source: '/courses/full-stack-web-development', destination: '/courses/full-stack-development', permanent: true },
  { source: '/courses/html5-css3-modern-ui-design', destination: '/courses/web-designing-complete-pathway--4-months', permanent: true },
  { source: '/courses/adca-advanced-diploma-computer-applications', destination: '/courses/adca', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },
  { source: '/career', destination: '/careers', permanent: true },
  { source: '/notes', destination: '/study-material', permanent: true },
];
\`\`\`\n`;

fs.writeFileSync(reportPath, mdReport, 'utf8');
console.log(`\nWritten report to ${reportPath}`);
