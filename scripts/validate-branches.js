#!/usr/bin/env node
/**
 * MSK Institute — Branch & Franchise Architecture Validator
 *
 * Validates:
 * - public/data/branches.json schema & integrity against Branch type
 * - Unique IDs, codes, and slugs
 * - ONE ACTIVE BRANCH PER CITY exclusivity rule
 * - Exactly one HEADQUARTERS branch (Shikohabad)
 * - Required fields for OPEN branches (NAP, Geo, OpeningHours, Facilities)
 * - Relational integrity with courses.json and live-batches.json
 * - Cross-reference checks between batches and branches
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE BRANCH & FRANCHISE ARCHITECTURE VALIDATION ===\n');

const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
const coursesPath = path.join(process.cwd(), 'public', 'data', 'all-courses.json');
const batchesPath = path.join(process.cwd(), 'public', 'data', 'live-batches.json');

let errors = 0;
let warnings = 0;

if (!fs.existsSync(branchesPath)) {
  console.error(`[FATAL] branches.json not found at ${branchesPath}`);
  process.exit(1);
}

let branches = [];
try {
  branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));
} catch (err) {
  console.error(`[FATAL] branches.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(branches) || branches.length === 0) {
  console.error('[FATAL] branches.json must contain a non-empty array of branches');
  process.exit(1);
}

// Load courses for reference check
let courses = [];
const courseIdSet = new Set();
if (fs.existsSync(coursesPath)) {
  try {
    courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    courses.forEach((c) => courseIdSet.add(c.id));
  } catch (e) {
    console.error(`[WARN] Could not parse all-courses.json: ${e.message}`);
  }
}

// Load batches for reference check
let batches = [];
const batchIdSet = new Set();
if (fs.existsSync(batchesPath)) {
  try {
    batches = JSON.parse(fs.readFileSync(batchesPath, 'utf8'));
    batches.forEach((b) => batchIdSet.add(b.id));
  } catch (e) {
    console.error(`[WARN] Could not parse live-batches.json: ${e.message}`);
  }
}

console.log(`Loaded ${branches.length} branch definitions, ${courseIdSet.size} courses, ${batchIdSet.size} batches.\n`);

// Normalization helper matching src/lib/branches/normalization.ts
function normalizeCity(city) {
  if (!city || typeof city !== 'string') return '';
  return city
    .trim()
    .toLowerCase()
    .replace(/\s+(city|cantt|cantonment|junction|jn|railway\s*station|central|town|hub)$/i, '')
    .replace(/[^a-z0-9]/g, '');
}

const idSet = new Set();
const codeSet = new Set();
const slugSet = new Set();
const activeCityRegistry = new Map(); // normalizedCity -> branch

let headquartersCount = 0;

for (let i = 0; i < branches.length; i++) {
  const b = branches[i];
  const tag = `Branch #${i + 1} (${b.slug || b.id || 'unnamed'})`;

  // 1. Identification uniqueness
  if (!b.id || typeof b.id !== 'string') {
    console.error(`  [FAIL] ${tag}: Missing or invalid id`);
    errors++;
  } else if (idSet.has(b.id)) {
    console.error(`  [FAIL] ${tag}: Duplicate id '${b.id}'`);
    errors++;
  } else {
    idSet.add(b.id);
  }

  if (!b.code || typeof b.code !== 'string') {
    console.error(`  [FAIL] ${tag}: Missing or invalid code`);
    errors++;
  } else if (codeSet.has(b.code)) {
    console.error(`  [FAIL] ${tag}: Duplicate code '${b.code}'`);
    errors++;
  } else {
    codeSet.add(b.code);
  }

  if (!b.slug || typeof b.slug !== 'string' || !/^[a-z0-9-]+$/.test(b.slug)) {
    console.error(`  [FAIL] ${tag}: Invalid slug '${b.slug}' (must be lowercase alphanumeric + hyphens)`);
    errors++;
  } else if (slugSet.has(b.slug)) {
    console.error(`  [FAIL] ${tag}: Duplicate slug '${b.slug}'`);
    errors++;
  } else {
    slugSet.add(b.slug);
  }

  if (!b.name || typeof b.name !== 'string' || b.name.trim().length === 0) {
    console.error(`  [FAIL] ${tag}: Missing or empty name`);
    errors++;
  }

  // 2. Status & Type validation
  const validStatuses = ['PLANNED', 'COMING_SOON', 'OPEN', 'TEMPORARILY_CLOSED', 'CLOSED', 'ARCHIVED'];
  if (!validStatuses.includes(b.status)) {
    console.error(`  [FAIL] ${tag}: Invalid status '${b.status}'. Must be one of: ${validStatuses.join(', ')}`);
    errors++;
  }

  const validTypes = ['CORPORATE', 'FRANCHISE', 'PARTNER'];
  if (!validTypes.includes(b.branchType)) {
    console.error(`  [FAIL] ${tag}: Invalid branchType '${b.branchType}'. Must be one of: ${validTypes.join(', ')}`);
    errors++;
  }

  // 3. Headquarters rule
  if (b.isHeadquarters === true) {
    headquartersCount++;
    const normCity = normalizeCity(b.city);
    if (normCity !== 'shikohabad') {
      console.error(`  [FAIL] ${tag}: Headquarters must be located in Shikohabad, found: '${b.city}'`);
      errors++;
    }
  }

  // 4. One active branch per city exclusivity rule
  const isActive = b.status === 'OPEN' || b.status === 'COMING_SOON';
  if (isActive) {
    const rawCity = b.city || '';
    const normCity = normalizeCity(rawCity);
    if (!normCity) {
      console.error(`  [FAIL] ${tag}: Active branch has empty or invalid city for exclusivity check`);
      errors++;
    } else if (activeCityRegistry.has(normCity)) {
      const existing = activeCityRegistry.get(normCity);
      console.error(
        `  [FAIL] [EXCLUSIVITY VIOLATION] City '${rawCity}' (normalized: '${normCity}') already has an active branch: '${existing.name}' (${existing.id}). Only ONE active branch is permitted per city.`
      );
      errors++;
    } else {
      activeCityRegistry.set(normCity, b);
      console.log(`  [PASS] ${tag}: City exclusivity registered for '${rawCity}' (${normCity})`);
    }
  }

  // 5. OPEN branch strict validation
  if (b.status === 'OPEN') {
    if (!b.address || !b.city || !b.state || !b.postalCode) {
      console.error(`  [FAIL] ${tag}: OPEN branch must have complete address, city, state, and postalCode`);
      errors++;
    }

    if (
      typeof b.latitude !== 'number' ||
      typeof b.longitude !== 'number' ||
      !isFinite(b.latitude) ||
      !isFinite(b.longitude)
    ) {
      console.error(`  [FAIL] ${tag}: OPEN branch must have valid finite geo coordinates`);
      errors++;
    }

    if (!b.phone || !b.phone.startsWith('+91')) {
      console.error(`  [FAIL] ${tag}: OPEN branch must have valid Indian phone (+91...)`);
      errors++;
    }

    if (!b.email || !b.email.includes('@')) {
      console.error(`  [FAIL] ${tag}: OPEN branch must have valid email`);
      errors++;
    }

    if (!Array.isArray(b.openingHours) || b.openingHours.length === 0) {
      console.error(`  [FAIL] ${tag}: OPEN branch must specify complete openingHours array`);
      errors++;
    }

    if (!Array.isArray(b.facilities) || b.facilities.length === 0) {
      console.error(`  [FAIL] ${tag}: OPEN branch must list at least one facility`);
      errors++;
    }
  }

  // 6. Relational checks: availableCourseIds
  if (Array.isArray(b.availableCourseIds) && courseIdSet.size > 0) {
    for (const cid of b.availableCourseIds) {
      if (!courseIdSet.has(cid)) {
        console.error(`  [FAIL] ${tag}: availableCourseId '${cid}' does not exist in all-courses.json`);
        errors++;
      }
    }
  } else if (!Array.isArray(b.availableCourseIds)) {
    console.error(`  [FAIL] ${tag}: availableCourseIds must be an array`);
    errors++;
  }

  // 7. Relational checks: activeBatchIds
  if (Array.isArray(b.activeBatchIds) && batchIdSet.size > 0) {
    for (const bid of b.activeBatchIds) {
      if (!batchIdSet.has(bid)) {
        console.error(`  [FAIL] ${tag}: activeBatchId '${bid}' does not exist in live-batches.json`);
        errors++;
      }
    }
  }
}

// 8. Exactly one headquarters
if (headquartersCount !== 1) {
  console.error(`[FAIL] Expected exactly 1 headquarters branch, found: ${headquartersCount}`);
  errors++;
} else {
  console.log(`[PASS] Exactly 1 headquarters verified (Shikohabad).`);
}

// 9. Batch to branch foreign key check
if (batches.length > 0) {
  for (const b of batches) {
    if (b.branchId) {
      if (!idSet.has(b.branchId)) {
        console.error(`[FAIL] Batch '${b.id}' references unknown branchId '${b.branchId}'`);
        errors++;
      }
      if (b.branchSlug && !slugSet.has(b.branchSlug)) {
        console.error(`[FAIL] Batch '${b.id}' references unknown branchSlug '${b.branchSlug}'`);
        errors++;
      }
    }
  }
  console.log(`[PASS] All ${batches.length} live batches cross-referenced against branches successfully.`);
}

console.log(`[PASS] Verified ${activeCityRegistry.size} active franchise territory registrations without overlap.`);

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Branch architecture validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Branch architecture validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
