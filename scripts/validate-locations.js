#!/usr/bin/env node
/**
 * MSK Institute — Location Routing & Discoverability Validator
 *
 * Validates:
 * - Next.js App Router structure for /locations and /locations/[city]
 * - Static params alignment with published branches
 * - Custom 404 (not-found.tsx) presence for unrecognized cities
 * - Navigation links in Navbar and Footer
 * - Sitemap.ts includes /locations and branch URLs
 * - Course pages integrate branch location availability
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE LOCATION ROUTING & DISCOVERABILITY VALIDATION ===\n');

let errors = 0;
let warnings = 0;

const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
if (!fs.existsSync(branchesPath)) {
  console.error(`[FATAL] branches.json not found at ${branchesPath}`);
  process.exit(1);
}

const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));
const publishedBranches = branches.filter((b) => b.isPublished !== false);

// 1. App Router Structure Check
console.log('1. Checking App Router location route files...');
const locationsDir = path.join(process.cwd(), 'src', 'app', 'locations');
const locationsPage = path.join(locationsDir, 'page.tsx');
const cityPage = path.join(locationsDir, '[city]', 'page.tsx');
const cityNotFound = path.join(locationsDir, '[city]', 'not-found.tsx');

if (!fs.existsSync(locationsPage)) {
  console.error('  [FAIL] Missing src/app/locations/page.tsx');
  errors++;
} else {
  console.log('  [PASS] Found src/app/locations/page.tsx');
}

if (!fs.existsSync(cityPage)) {
  console.error('  [FAIL] Missing src/app/locations/[city]/page.tsx');
  errors++;
} else {
  console.log('  [PASS] Found src/app/locations/[city]/page.tsx');
}

if (!fs.existsSync(cityNotFound)) {
  console.error('  [FAIL] Missing src/app/locations/[city]/not-found.tsx');
  errors++;
} else {
  console.log('  [PASS] Found src/app/locations/[city]/not-found.tsx');
}

// 2. Static Generation Params Check
console.log('\n2. Checking Static Generation Params in [city]/page.tsx...');
if (fs.existsSync(cityPage)) {
  const cityContent = fs.readFileSync(cityPage, 'utf8');
  if (!cityContent.includes('generateStaticParams')) {
    console.error('  [FAIL] [city]/page.tsx missing generateStaticParams() export for SSG');
    errors++;
  } else {
    console.log('  [PASS] generateStaticParams() is exported for SSG pre-rendering');
  }

  for (const b of publishedBranches) {
    if (!cityContent.includes('getPublishedBranches') && !cityContent.includes(b.slug)) {
      console.warn(`  [WARN] Branch '${b.slug}' may not be pre-rendered in generateStaticParams`);
      warnings++;
    }
  }
}

// 3. Sitemap Coverage Check
console.log('\n3. Checking Sitemap.ts location coverage...');
const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemapContent.includes('/locations')) {
    console.error('  [FAIL] sitemap.ts does not include /locations directory route');
    errors++;
  } else {
    console.log('  [PASS] /locations found in sitemap.ts');
  }

  if (!sitemapContent.includes('getPublishedBranches') && !sitemapContent.includes('/locations/')) {
    console.error('  [FAIL] sitemap.ts does not dynamically map branch location URLs');
    errors++;
  } else {
    console.log('  [PASS] Dynamic branch routes mapped in sitemap.ts');
  }
} else {
  console.error('  [FAIL] sitemap.ts not found');
  errors++;
}

// 4. Navigation Links Check (Navbar & Footer)
console.log('\n4. Checking Navigation Discoverability (Navbar & Footer)...');
const navbarPath = path.join(process.cwd(), 'src', 'components', 'Navbar.tsx');
if (fs.existsSync(navbarPath)) {
  const navContent = fs.readFileSync(navbarPath, 'utf8');
  if (!navContent.includes('/locations')) {
    console.error('  [FAIL] Navbar.tsx does not link to /locations');
    errors++;
  } else {
    console.log('  [PASS] Navbar.tsx includes /locations link');
  }
}

const footerPath = path.join(process.cwd(), 'src', 'components', 'Footer.tsx');
if (fs.existsSync(footerPath)) {
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  if (!footerContent.includes('/locations')) {
    console.error('  [FAIL] Footer.tsx does not link to /locations');
    errors++;
  } else {
    console.log('  [PASS] Footer.tsx includes /locations link');
  }
}

// 5. Course Page Availability Badge Check
console.log('\n5. Checking Course Page Location Linkage...');
const coursePagePath = path.join(process.cwd(), 'src', 'app', 'courses', '[slug]', 'page.tsx');
if (fs.existsSync(coursePagePath)) {
  const coursePageContent = fs.readFileSync(coursePagePath, 'utf8');
  if (!coursePageContent.includes('/locations/') && !coursePageContent.includes('getBranchesForCourse')) {
    console.error('  [FAIL] courses/[slug]/page.tsx does not link to branch location pages');
    errors++;
  } else {
    console.log('  [PASS] courses/[slug]/page.tsx links to campus availability pages');
  }
}

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Location routing validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Location routing validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
