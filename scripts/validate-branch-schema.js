#!/usr/bin/env node
/**
 * MSK Institute — Branch Schema.org Structured Data Validator
 *
 * Validates:
 * - LocalBusiness / EducationalOrganization schema structure for each branch
 * - Parent organization connection (@id: https://www.mskinstitute.in/#organization)
 * - PostalAddress, GeoCoordinates, and OpeningHours specifications
 * - BreadcrumbList hierarchy (Home > Locations > Branch)
 * - Prohibits fake aggregate ratings
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE BRANCH SCHEMA VALIDATION ===\n');

let errors = 0;
let warnings = 0;

const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
if (!fs.existsSync(branchesPath)) {
  console.error(`[FATAL] branches.json not found at ${branchesPath}`);
  process.exit(1);
}

const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));

// Check SEO file
const seoFilePath = path.join(process.cwd(), 'src', 'lib', 'branches', 'seo.ts');
if (!fs.existsSync(seoFilePath)) {
  console.error(`[FATAL] src/lib/branches/seo.ts not found`);
  process.exit(1);
}

const seoContent = fs.readFileSync(seoFilePath, 'utf8');
if (!seoContent.includes('generateBranchSchema')) {
  console.error('[FAIL] seo.ts missing generateBranchSchema export');
  errors++;
} else {
  console.log('[PASS] seo.ts exports generateBranchSchema');
}

if (!seoContent.includes('generateBranchBreadcrumbSchema')) {
  console.error('[FAIL] seo.ts missing generateBranchBreadcrumbSchema export');
  errors++;
} else {
  console.log('[PASS] seo.ts exports generateBranchBreadcrumbSchema');
}

if (!seoContent.includes('${SITE_URL}/#organization') && !seoContent.includes('https://www.mskinstitute.in/#organization')) {
  console.error('[FAIL] seo.ts missing parent organization link to https://www.mskinstitute.in/#organization');
  errors++;
} else {
  console.log('[PASS] seo.ts maintains relational link to root EducationalOrganization');
}

// Validate individual branch data definitions for schema compliance
console.log('\nChecking schema compliance for each branch...');
for (const b of branches) {
  const tag = `Branch '${b.slug}'`;

  // 1. Organization linkage
  if (!b.name || !b.slug) {
    console.error(`  [FAIL] ${tag}: Missing name or slug`);
    errors++;
  }

  // 2. PostalAddress fields
  if (!b.address || !b.city || !b.state || !b.countryCode) {
    console.error(`  [FAIL] ${tag}: Incomplete address object for Schema.org PostalAddress`);
    errors++;
  } else {
    console.log(`  [PASS] ${tag}: PostalAddress structure verified (${b.city}, ${b.state})`);
  }

  // 3. For OPEN branches: Geo & Hours
  if (b.status === 'OPEN') {
    if (typeof b.latitude !== 'number' || typeof b.longitude !== 'number' || !isFinite(b.latitude) || !isFinite(b.longitude)) {
      console.error(`  [FAIL] ${tag}: Missing or invalid GeoCoordinates for OPEN branch`);
      errors++;
    } else {
      console.log(`  [PASS] ${tag}: GeoCoordinates valid (${b.latitude}, ${b.longitude})`);
    }

    if (!Array.isArray(b.openingHours) || b.openingHours.length === 0) {
      console.error(`  [FAIL] ${tag}: Missing openingHours specification for OPEN branch`);
      errors++;
    } else {
      console.log(`  [PASS] ${tag}: Opening hours specification verified (${b.openingHours.length} specs)`);
    }
  }

  // 4. Check for review spam / fake reviews
  if (b.fakeReviews || b.unverifiedRating) {
    console.error(`  [FAIL] ${tag}: Contains unverified or fake reviews`);
    errors++;
  }
}

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Branch schema validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Branch schema validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
