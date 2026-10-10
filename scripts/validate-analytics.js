#!/usr/bin/env node
/**
 * MSK Institute — Analytics & Telemetry Architecture Validator
 *
 * Validates:
 * - Presence and structural integrity of unified analytics modules (@/lib/analytics)
 * - Measurement ID configurations (GTM-WTZ5VP6M, G-6CQ1F72VS0)
 * - Zero-PII sanitization enforcement in dataLayer pipeline
 * - Complete GA4 standard event taxonomy coverage
 * - Deduplication and SPA pageview isolation
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE ANALYTICS ARCHITECTURE VALIDATION ===\n');

let errors = 0;
let warnings = 0;

// 1. Required Analytics Core Files
const requiredFiles = [
  'src/lib/analytics/types.ts',
  'src/lib/analytics/attribution.ts',
  'src/lib/analytics/dataLayer.ts',
  'src/lib/analytics/page-context.ts',
  'src/lib/analytics/events.ts',
  'src/lib/analytics/index.ts',
  'src/components/GoogleTagManager.tsx',
  'src/components/Analytics.tsx',
  'src/components/AnalyticsTracker.tsx',
];

console.log('1. Checking Core Analytics Files...');
for (const relPath of requiredFiles) {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`  [FAIL] Missing file: ${relPath}`);
    errors++;
  } else {
    const stat = fs.statSync(fullPath);
    if (stat.size === 0) {
      console.error(`  [FAIL] Empty file: ${relPath}`);
      errors++;
    } else {
      console.log(`  [PASS] ${relPath} (${stat.size} bytes)`);
    }
  }
}

// 2. Validate Measurement IDs and Configuration
console.log('\n2. Verifying Measurement IDs & Environment Config...');
const gtmPath = path.join(process.cwd(), 'src', 'components', 'GoogleTagManager.tsx');
if (fs.existsSync(gtmPath)) {
  const gtmContent = fs.readFileSync(gtmPath, 'utf8');
  if (gtmContent.includes('GTM-WTZ5VP6M')) {
    console.log('  [PASS] Google Tag Manager Container ID GTM-WTZ5VP6M verified');
  } else {
    console.error('  [FAIL] GTM-WTZ5VP6M container ID missing in GoogleTagManager.tsx');
    errors++;
  }
}

const analyticsPath = path.join(process.cwd(), 'src', 'components', 'Analytics.tsx');
if (fs.existsSync(analyticsPath)) {
  const anContent = fs.readFileSync(analyticsPath, 'utf8');
  if (anContent.includes('G-6CQ1F72VS0')) {
    console.log('  [PASS] GA4 Measurement ID G-6CQ1F72VS0 verified in Analytics.tsx');
  } else {
    console.error('  [FAIL] G-6CQ1F72VS0 measurement ID missing in Analytics.tsx');
    errors++;
  }

  // Check SPA double pageview prevention
  if (anContent.includes('send_page_view: false')) {
    console.log('  [PASS] Duplicate pageview prevention configured (send_page_view: false)');
  } else {
    console.error('  [FAIL] gtag config must set send_page_view: false to prevent duplicate SPA pageviews');
    errors++;
  }
}

// 3. Zero-PII Sanitization Verification
console.log('\n3. Verifying Zero-PII Sanitization & Privacy Controls...');
const dlPath = path.join(process.cwd(), 'src', 'lib', 'analytics', 'dataLayer.ts');
if (fs.existsSync(dlPath)) {
  const dlContent = fs.readFileSync(dlPath, 'utf8');
  const requiredBlacklist = ['name', 'full_name', 'phone', 'mobile', 'email', 'password', 'query', 'message'];
  const hasSanitizer = dlContent.includes('sanitizeAnalyticsParams') || dlContent.includes('PII_KEYS');
  
  if (hasSanitizer) {
    console.log('  [PASS] PII Sanitizer pipeline active in dataLayer.ts');
  } else {
    console.error('  [FAIL] PII Sanitizer missing from dataLayer.ts');
    errors++;
  }

  for (const key of requiredBlacklist) {
    if (dlContent.includes(`'${key}'`) || dlContent.includes(`"${key}"`)) {
      // Verified blacklisted key
    } else {
      console.warn(`  [WARN] Blacklist key '${key}' not explicitly found in dataLayer.ts`);
      warnings++;
    }
  }
}

// 4. Validate Standard GA4 & Custom Funnel Events
console.log('\n4. Verifying Event Taxonomy Implementations...');
const eventsPath = path.join(process.cwd(), 'src', 'lib', 'analytics', 'events.ts');
if (fs.existsSync(eventsPath)) {
  const eventsContent = fs.readFileSync(eventsPath, 'utf8');
  const requiredEvents = [
    'trackPageView',
    'trackCourseListImpression', // view_item_list
    'trackCourseSelection',      // select_item
    'trackCourseView',           // view_item
    'trackBatchView',            // batch_view
    'trackBatchCtaClick',        // batch_cta_click
    'trackWhatsAppClick',        // whatsapp_click
    'trackPhoneClick',           // phone_click
    'trackEmailClick',           // email_click
    'trackFormView',             // form_view
    'trackFormStart',            // form_start
    'trackGenerateLead',         // generate_lead
    'trackDemoRequest',          // demo_request
    'trackEnrollmentStart',      // enrollment_start
    'trackEnrollmentSubmit',     // enrollment_submit
    'trackSearch',               // search
    'trackResourceDownload',     // resource_download
    'trackCertificateVerify',    // certificate_verify
  ];

  for (const fn of requiredEvents) {
    if (eventsContent.includes(`export function ${fn}`)) {
      console.log(`  [PASS] Event function: ${fn}`);
    } else {
      console.error(`  [FAIL] Missing event function: ${fn}`);
      errors++;
    }
  }
}

// 5. Attribution & Session Storage Isolation
console.log('\n5. Verifying First-Party Attribution Storage...');
const attrPath = path.join(process.cwd(), 'src', 'lib', 'analytics', 'attribution.ts');
if (fs.existsSync(attrPath)) {
  const attrContent = fs.readFileSync(attrPath, 'utf8');
  if (attrContent.includes('sessionStorage') && attrContent.includes('utm_source')) {
    console.log('  [PASS] First-party session attribution storage implemented');
  } else {
    console.error('  [FAIL] First-party session attribution missing in attribution.ts');
    errors++;
  }
}

// Final Summary
console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Analytics validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Analytics validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
