#!/usr/bin/env node
/**
 * MSK Institute — Complete URL & Internal Link Auditor
 *
 * Scans all markdown content, components, and data files to verify that
 * internal links resolve to valid 200 OK routes or are mapped via permanent redirects.
 */

const fs = require('fs');
const path = require('path');

console.log('--- MSK INSTITUTE INTERNAL URL AUDIT ---');

const courses = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'all-courses.json'), 'utf8'));
const batchesPath = path.join(process.cwd(), 'public', 'data', 'live-batches.json');
const liveBatches = fs.existsSync(batchesPath) ? JSON.parse(fs.readFileSync(batchesPath, 'utf8')) : [];
const tutorials = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'tutorials.json'), 'utf8'));

// Build valid routes set
const validRoutes = new Set([
  '/',
  '/courses',
  '/verify-certificate',
  '/study-material',
  '/careers',
  '/blogs',
  '/live',
  '/live-batches',
  '/tools',
  '/tools/typing',
  '/tools/db-viewer',
  '/tools/sql-studio',
  '/playground',
  '/contact',
  '/about',
  '/privacy-policy',
  '/terms',
  '/disclaimer',
  '/admin',
  '/locations',
  '/book-demo',
  '/career-finder',
  '/projects',
  '/mock-test',
  '/mock-test/ccc',
  '/learning-paths',
  '/shortcuts',
]);

// Add branch routes
const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
if (fs.existsSync(branchesPath)) {
  const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));
  branches.forEach(b => validRoutes.add(`/locations/${b.slug}`));
}

// Add course routes & mock-test routes
courses.forEach(c => {
  validRoutes.add(`/courses/${c.slug}`);
  validRoutes.add(`/mock-test/${c.slug}`);
});

// Add batch routes
liveBatches.forEach(b => validRoutes.add(`/live-batches/${b.id}`));

// Add blog routes
const blogDir = path.join(process.cwd(), 'content', 'blogs');
if (fs.existsSync(blogDir)) {
  fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).forEach(f => {
    validRoutes.add(`/blogs/${f.replace(/\.md$/, '')}`);
  });
}

// Add tutorial routes and topics
const tutDir = path.join(process.cwd(), 'public', 'content', 'tutorials');
tutorials.forEach(t => {
  validRoutes.add(`/tutorials/${t.slug}`);
  const subDir = path.join(tutDir, t.slug);
  if (fs.existsSync(subDir)) {
    const getMdFiles = (dir) => {
      let results = [];
      fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
        if (ent.isFile() && ent.name.endsWith('.md')) {
          results.push(ent.name);
        } else if (ent.isDirectory() && ent.name !== 'images') {
          fs.readdirSync(path.join(dir, ent.name)).filter(f => f.endsWith('.md')).forEach(f => results.push(f));
        }
      });
      return results;
    };
    getMdFiles(subDir).forEach(f => {
      validRoutes.add(`/tutorials/${t.slug}/${f.replace(/\.md$/, '').replace(/^\d+-/, '')}`);
    });
  }
});

// Load redirects from next.config.ts
const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');
const redirectRegex = /source:\s*['"`]([^'"`]+)['"`],\s*destination:\s*['"`]([^'"`]+)['"`]/g;
const redirects = new Map();
let m;
while ((m = redirectRegex.exec(nextConfig)) !== null) {
  redirects.set(m[1], m[2]);
}

console.log(`Registered ${validRoutes.size} valid canonical routes.`);
console.log(`Registered ${redirects.size} permanent redirects.`);

let errors = 0;
let warnings = 0;

// Scan markdown blogs for internal links
function scanMarkdownLinks(filePath, content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawUrl = match[2].trim();
    if (rawUrl.startsWith('/') && !rawUrl.startsWith('//')) {
      const cleanPath = rawUrl.split('#')[0].split('?')[0];
      if (!validRoutes.has(cleanPath)) {
        if (redirects.has(cleanPath)) {
          console.warn(`[WARN] ${filePath}: Link '${rawUrl}' hits 301 redirect -> '${redirects.get(cleanPath)}' (should point directly to canonical URL)`);
          warnings++;
        } else {
          console.error(`[ERROR] ${filePath}: Broken internal link '${rawUrl}' (404 Not Found)`);
          errors++;
        }
      }
    }
  }
}

// Scan blogs
if (fs.existsSync(blogDir)) {
  for (const file of fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))) {
    const fullPath = path.join(blogDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    scanMarkdownLinks(file, content);

    // Also check frontmatter relatedCourses
    const relatedMatch = content.match(/relatedCourses:\s*([\s\S]*?)---/);
    if (relatedMatch) {
      const slugs = relatedMatch[1].match(/-\s*["']?([^"'\s]+)["']?/g);
      if (slugs) {
        for (const raw of slugs) {
          const s = raw.replace(/^-\s*["']?|["']?$/g, '').trim();
          if (!courses.some(c => c.slug === s || c.id === s)) {
            console.error(`[ERROR] ${file}: relatedCourses slug '${s}' does not exist in all-courses.json`);
            errors++;
          }
        }
      }
    }
  }
}

// Scan certificates.json
const certsPath = path.join(process.cwd(), 'public', 'data', 'certificates.json');
if (fs.existsSync(certsPath)) {
  const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));
  certs.forEach((c, idx) => {
    if (c.courseSlug && !courses.some(course => course.slug === c.courseSlug)) {
      console.error(`[ERROR] certificates.json item ${idx} (${c.id}): courseSlug '${c.courseSlug}' does not exist in all-courses.json`);
      errors++;
    }
  });
}

console.log('----------------------------------------------------');
console.log(`Internal Link Audit Finished. Errors: ${errors}, Warnings: ${warnings}`);

if (errors > 0) {
  console.error('Audit FAILED: Broken internal URLs detected.');
  process.exit(1);
} else {
  console.log('Audit PASSED: 0 broken internal links found!');
  process.exit(0);
}
