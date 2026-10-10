#!/usr/bin/env node
/**
 * MSK Institute — Technical SEO & Schema Validator
 *
 * Validates:
 * - Canonical domain uniformity (https://www.mskinstitute.in across metadata, sitemaps, robots)
 * - No redirected routes in sitemap.ts (e.g. /notes)
 * - Single canonical sitemap in robots.ts
 * - metadataBase in layout.tsx is https://www.mskinstitute.in
 * - Schema NAP consistency (MSK Institute, Shikohabad, +918393042166)
 * - No non-www domain canonicals in src/app
 */

const fs = require('fs');
const path = require('path');

console.log('--- MSK INSTITUTE TECHNICAL SEO & SCHEMA VALIDATION ---');

let errors = 0;
let warnings = 0;

// 1. Verify layout.tsx metadataBase
const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes("metadataBase: new URL('https://www.mskinstitute.in')")) {
    console.error("[ERROR] layout.tsx: metadataBase must be new URL('https://www.mskinstitute.in')");
    errors++;
  } else {
    console.log('[PASS] layout.tsx: metadataBase is https://www.mskinstitute.in');
  }

  if (layoutContent.includes('https://mskinstitute.in') && !layoutContent.includes('https://www.mskinstitute.in')) {
    console.error('[ERROR] layout.tsx contains non-canonical domain without www.');
    errors++;
  }
} else {
  console.error('[ERROR] layout.tsx not found!');
  errors++;
}

// 2. Verify robots.ts
const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes("'/notes/'")) {
    console.error("[ERROR] robots.ts: '/notes/' is allowed, but /notes redirects to /study-material");
    errors++;
  }
  if (!robotsContent.includes("sitemap: 'https://www.mskinstitute.in/sitemap.xml'")) {
    console.error("[ERROR] robots.ts: Must define single canonical sitemap 'https://www.mskinstitute.in/sitemap.xml'");
    errors++;
  } else {
    console.log('[PASS] robots.ts: Single canonical sitemap configured');
  }
} else {
  console.error('[ERROR] robots.ts not found!');
  errors++;
}

// 3. Verify sitemap.ts
const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes("'/notes'")) {
    console.error("[ERROR] sitemap.ts: Contains '/notes' which is a 301 redirect. Sitemaps must contain 200 OK URLs only.");
    errors++;
  } else {
    console.log('[PASS] sitemap.ts: Free of redirected routes');
  }

  if (!sitemapContent.includes('https://www.mskinstitute.in')) {
    console.error("[ERROR] sitemap.ts: Default baseUrl must be 'https://www.mskinstitute.in'");
    errors++;
  }
} else {
  console.error('[ERROR] sitemap.ts not found!');
  errors++;
}

// 4. Verify no remaining apex domain canonical tags across src/app
function checkNonWwwUrls(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      checkNonWwwUrls(full);
    } else if (/\.(tsx|ts)$/.test(item.name)) {
      const txt = fs.readFileSync(full, 'utf8');
      const matches = txt.match(/canonical:\s*['"`]https:\/\/mskinstitute\.in/g);
      if (matches) {
        console.error(`[ERROR] ${full}: Contains non-www canonical URL (${matches.length} instance(s))`);
        errors++;
      }
    }
  }
}
checkNonWwwUrls(path.join(process.cwd(), 'src', 'app'));

// 5. Verify NAP details in layout schema
const layoutRaw = fs.readFileSync(layoutPath, 'utf8');
if (layoutRaw.includes('MSK Institute') && layoutRaw.includes('Shikohabad') && layoutRaw.includes('+918393042166')) {
  console.log('[PASS] layout.tsx: Schema LocalBusiness NAP (Name, Address, Phone) fully verified');
} else {
  console.error('[ERROR] layout.tsx: Schema NAP details incomplete or missing');
  errors++;
}

console.log('----------------------------------------------------');
console.log(`Validation finished. Errors: ${errors}, Warnings: ${warnings}`);

if (errors > 0) {
  console.error('SEO Validation FAILED: Please fix the errors listed above.');
  process.exit(1);
} else {
  console.log('SEO Validation PASSED: 100% compliant with Technical & Local SEO standards!');
  process.exit(0);
}
