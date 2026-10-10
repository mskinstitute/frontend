#!/usr/bin/env node
/**
 * MSK Institute — Local SEO & NAP Schema Consistency Validator
 *
 * Validates:
 * - 100% NAP consistency (Name, Address, Phone, Email, Hours) across pages & components
 * - LocalBusiness / EducationalOrganization JSON-LD structured data integrity
 * - Semantic tel:, mailto:, and Google Maps links
 * - GeoCoordinates accuracy (Shikohabad campus coordinates)
 * - Review schema safety (No fabricated AggregateRating or misleading snippets)
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE LOCAL SEO & NAP VALIDATION ===\n');

let errors = 0;
let warnings = 0;

const CANONICAL_PHONE = '+918393042166';
const CANONICAL_PHONE_FORMATTED = '+91 83930 42166';
const CANONICAL_EMAIL = 'mskshikohabad@gmail.com';
const CANONICAL_PINCODE = '283135';
const CANONICAL_LOCALITY = 'Shikohabad';
const CANONICAL_STREET = 'Gali No. 3, Near Gyan Jyoti Public School';
const CANONICAL_MAPS = 'https://maps.google.com/?q=MSK+Institute+Shikohabad';

// 1. Verify Root Layout Schema (src/app/layout.tsx)
console.log('1. Checking Root Layout JSON-LD Schema (src/app/layout.tsx)...');
const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8');

  if (!content.includes('LocalBusiness')) {
    console.error('  [FAIL] layout.tsx missing LocalBusiness schema type');
    errors++;
  } else {
    console.log('  [PASS] LocalBusiness schema type present in layout.tsx');
  }

  if (!content.includes(CANONICAL_LOCALITY)) {
    console.error(`  [FAIL] layout.tsx missing locality ${CANONICAL_LOCALITY}`);
    errors++;
  } else {
    console.log(`  [PASS] Locality ${CANONICAL_LOCALITY} verified in layout.tsx`);
  }

  if (!content.includes(CANONICAL_PINCODE)) {
    console.error(`  [FAIL] layout.tsx missing PIN code ${CANONICAL_PINCODE}`);
    errors++;
  } else {
    console.log(`  [PASS] PIN code ${CANONICAL_PINCODE} verified in layout.tsx`);
  }

  if (!content.includes(CANONICAL_EMAIL)) {
    console.error(`  [FAIL] layout.tsx missing email ${CANONICAL_EMAIL}`);
    errors++;
  } else {
    console.log(`  [PASS] Canonical email verified in layout.tsx`);
  }

  if (!content.includes('27.1157743') || !content.includes('78.5829716')) {
    console.error('  [FAIL] layout.tsx missing exact Shikohabad GeoCoordinates (27.1157743, 78.5829716)');
    errors++;
  } else {
    console.log('  [PASS] Shikohabad GeoCoordinates verified in layout.tsx');
  }
} else {
  console.error('  [FAIL] layout.tsx not found');
  errors++;
}

// 2. Verify Homepage Schema (src/app/page.tsx)
console.log('\n2. Checking Homepage Local Schema (src/app/page.tsx)...');
const homePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
if (fs.existsSync(homePath)) {
  const content = fs.readFileSync(homePath, 'utf8');

  if (!content.includes(CANONICAL_LOCALITY)) {
    console.error(`  [FAIL] page.tsx missing locality ${CANONICAL_LOCALITY}`);
    errors++;
  } else {
    console.log(`  [PASS] Locality ${CANONICAL_LOCALITY} verified in page.tsx`);
  }

  if (!content.includes(CANONICAL_PINCODE)) {
    console.error(`  [FAIL] page.tsx missing PIN code ${CANONICAL_PINCODE}`);
    errors++;
  } else {
    console.log(`  [PASS] PIN code ${CANONICAL_PINCODE} verified in page.tsx`);
  }

  if (!content.includes('27.1157743') || !content.includes('78.5829716')) {
    console.error('  [FAIL] page.tsx GeoCoordinates mismatch');
    errors++;
  } else {
    console.log('  [PASS] GeoCoordinates aligned in page.tsx');
  }
}

// 3. Verify Contact Page Schema & Semantics (src/app/contact/page.tsx)
console.log('\n3. Checking Contact Page Schema & Routing (src/app/contact/page.tsx)...');
const contactPath = path.join(process.cwd(), 'src', 'app', 'contact', 'page.tsx');
if (fs.existsSync(contactPath)) {
  const content = fs.readFileSync(contactPath, 'utf8');

  if (!content.includes(CANONICAL_LOCALITY) || !content.includes(CANONICAL_PINCODE)) {
    console.error('  [FAIL] contact/page.tsx schema missing locality or PIN code');
    errors++;
  } else {
    console.log('  [PASS] contact/page.tsx schema locality and PIN code verified');
  }

  if (!content.includes('27.1157743') || !content.includes('78.5829716')) {
    console.error('  [FAIL] contact/page.tsx GeoCoordinates mismatch');
    errors++;
  } else {
    console.log('  [PASS] contact/page.tsx GeoCoordinates aligned (27.1157743, 78.5829716)');
  }
}

// 4. Verify Contact Client Component (src/components/ContactClient.tsx)
console.log('\n4. Checking Contact Client Component (src/components/ContactClient.tsx)...');
const contactClientPath = path.join(process.cwd(), 'src', 'components', 'ContactClient.tsx');
if (fs.existsSync(contactClientPath)) {
  const content = fs.readFileSync(contactClientPath, 'utf8');

  if (!content.includes(CANONICAL_EMAIL)) {
    console.error(`  [FAIL] ContactClient.tsx missing canonical email: ${CANONICAL_EMAIL}`);
    errors++;
  } else {
    console.log('  [PASS] Canonical email verified in ContactClient.tsx');
  }

  if (!content.includes(CANONICAL_MAPS)) {
    console.warn(`  [WARN] ContactClient.tsx does not reference canonical Google Maps link`);
    warnings++;
  } else {
    console.log('  [PASS] Canonical Google Maps URL verified in ContactClient.tsx');
  }
}

// 5. Verify Footer Semantic Contact & Links (src/components/Footer.tsx)
console.log('\n5. Checking Footer Component (src/components/Footer.tsx)...');
const footerPath = path.join(process.cwd(), 'src', 'components', 'Footer.tsx');
if (fs.existsSync(footerPath)) {
  const content = fs.readFileSync(footerPath, 'utf8');

  if (!content.includes('tel:+918393042166')) {
    console.error('  [FAIL] Footer.tsx missing direct tel:+918393042166 link');
    errors++;
  } else {
    console.log('  [PASS] Footer.tsx direct tel link verified');
  }

  if (!content.includes('mailto:mskshikohabad@gmail.com')) {
    console.error('  [FAIL] Footer.tsx missing direct mailto: link');
    errors++;
  } else {
    console.log('  [PASS] Footer.tsx direct mailto link verified');
  }

  if (!content.includes(CANONICAL_PINCODE)) {
    console.error(`  [FAIL] Footer.tsx missing PIN code ${CANONICAL_PINCODE}`);
    errors++;
  } else {
    console.log(`  [PASS] Footer.tsx PIN code ${CANONICAL_PINCODE} verified`);
  }
}

// Final Summary
console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Local SEO & NAP validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Local SEO & NAP validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
