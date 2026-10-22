#!/usr/bin/env node
/**
 * MSK Institute — SEO Growth & Content Architecture Validator
 *
 * Validates:
 * - Content inventory integrity (public/data/seo-content-inventory.json)
 * - Canonical URL consistency (all canonicals start with https://www.mskinstitute.in)
 * - Zero empty titles or meta descriptions on public pages
 * - Topical cluster engine integrity (src/lib/topical-clusters.ts)
 * - Related content component presence (src/components/CourseRelatedContent.tsx)
 * - SEO metadata utility (src/lib/seo.ts)
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE SEO GROWTH & TOPICAL ARCHITECTURE VALIDATION ===\n');

let errors = 0;
let warnings = 0;

// 1. Content Inventory Check
console.log('1. Checking Content Inventory File...');
const inventoryPath = path.join(process.cwd(), 'public', 'data', 'seo-content-inventory.json');
if (!fs.existsSync(inventoryPath)) {
  console.error('  [FAIL] Missing public/data/seo-content-inventory.json');
  errors++;
} else {
  try {
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    console.log(`  [PASS] Inventory loaded: ${inventory.length} total canonical endpoints`);

    const canonicalsSeen = new Set();
    let missingTitle = 0;
    let missingDesc = 0;
    let nonCanonicalDomain = 0;

    for (const item of inventory) {
      if (!item.canonical || !item.canonical.startsWith('https://www.mskinstitute.in')) {
        nonCanonicalDomain++;
      }
      if (!item.title || item.title.trim() === '') {
        missingTitle++;
      }
      if (!item.meta_description || item.meta_description.trim() === '') {
        missingDesc++;
      }
      if (item.canonical) {
        if (canonicalsSeen.has(item.canonical)) {
          console.warn(`  [WARN] Duplicate canonical found: ${item.canonical}`);
          warnings++;
        }
        canonicalsSeen.add(item.canonical);
      }
    }

    if (nonCanonicalDomain > 0) {
      console.error(`  [FAIL] Found ${nonCanonicalDomain} entries with non-canonical domains`);
      errors++;
    } else {
      console.log('  [PASS] All inventory URLs conform to https://www.mskinstitute.in');
    }

    if (missingTitle > 0) {
      console.error(`  [FAIL] Found ${missingTitle} entries with missing titles`);
      errors++;
    } else {
      console.log('  [PASS] Zero empty titles in inventory');
    }

    if (missingDesc > 0) {
      console.warn(`  [WARN] Found ${missingDesc} entries with missing meta descriptions`);
      warnings++;
    } else {
      console.log('  [PASS] Zero missing meta descriptions');
    }
  } catch (err) {
    console.error(`  [FAIL] Could not parse inventory JSON: ${err.message}`);
    errors++;
  }
}

// 2. Topical Clusters Engine Check
console.log('\n2. Checking Topical Clusters Engine (src/lib/topical-clusters.ts)...');
const clustersPath = path.join(process.cwd(), 'src', 'lib', 'topical-clusters.ts');
if (fs.existsSync(clustersPath)) {
  const content = fs.readFileSync(clustersPath, 'utf8');
  const requiredClusters = ['python', 'web-development', 'data-analytics', 'sql', 'ccc', 'adca', 'cyber-security'];
  for (const c of requiredClusters) {
    if (content.includes(`clusterId: '${c}'`) || content.includes(`'${c}':`)) {
      console.log(`  [PASS] Cluster '${c}' defined`);
    } else {
      console.error(`  [FAIL] Missing cluster: ${c}`);
      errors++;
    }
  }
} else {
  console.error('  [FAIL] Missing src/lib/topical-clusters.ts');
  errors++;
}

// 3. Related Content Component Check
console.log('\n3. Checking CourseRelatedContent Component...');
const compPath = path.join(process.cwd(), 'src', 'components', 'CourseRelatedContent.tsx');
if (fs.existsSync(compPath)) {
  const content = fs.readFileSync(compPath, 'utf8');
  if (content.includes('getClusterForCourse') && content.includes('matchingBatches')) {
    console.log('  [PASS] CourseRelatedContent component verified');
  } else {
    console.error('  [FAIL] Incomplete logic in CourseRelatedContent.tsx');
    errors++;
  }
} else {
  console.error('  [FAIL] Missing src/components/CourseRelatedContent.tsx');
  errors++;
}

// 4. SEO Metadata Generator Check
console.log('\n4. Checking SEO Metadata Generator (src/lib/seo.ts)...');
const seoPath = path.join(process.cwd(), 'src', 'lib', 'seo.ts');
if (fs.existsSync(seoPath)) {
  const content = fs.readFileSync(seoPath, 'utf8');
  if (content.includes('constructMetadata') && content.includes('metadataBase')) {
    console.log('  [PASS] constructMetadata utility verified');
  } else {
    console.error('  [FAIL] constructMetadata utility incomplete');
    errors++;
  }
} else {
  console.error('  [FAIL] Missing src/lib/seo.ts');
  errors++;
}

// Final Summary
console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] SEO Growth validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] SEO Growth validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
