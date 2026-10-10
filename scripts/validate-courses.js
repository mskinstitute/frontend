#!/usr/bin/env node
/**
 * MSK Institute — Course Data Integrity Validator
 *
 * Validates public/data/all-courses.json:
 * - JSON syntax & schema
 * - Unique IDs and Slugs
 * - Required fields: title, shortDescription, categories, level, duration, status
 * - Status is 'PUBLISH'
 * - learningOutcomes present with >= 3 items
 * - Combo includedCourseIds point to valid courses
 */

const fs = require('fs');
const path = require('path');

const coursesPath = path.join(process.cwd(), 'public', 'data', 'all-courses.json');

console.log('--- MSK INSTITUTE COURSE DATA VALIDATION ---');
console.log(`Checking: ${coursesPath}`);

if (!fs.existsSync(coursesPath)) {
  console.error('FATAL: all-courses.json does not exist!');
  process.exit(1);
}

let courses;
try {
  courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
} catch (err) {
  console.error(`FATAL: all-courses.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(courses)) {
  console.error('FATAL: all-courses.json must contain an array of courses');
  process.exit(1);
}

console.log(`Total courses found: ${courses.length}`);

const idSet = new Set();
const slugSet = new Set();
let errors = 0;
let warnings = 0;

for (let i = 0; i < courses.length; i++) {
  const c = courses[i];
  const idx = `Course #${i + 1} (${c.slug || c.id || 'unnamed'})`;

  // ID check
  if (!c.id || typeof c.id !== 'string') {
    console.error(`[ERROR] ${idx}: Missing or invalid 'id'`);
    errors++;
  } else if (idSet.has(c.id)) {
    console.error(`[ERROR] ${idx}: Duplicate id '${c.id}'`);
    errors++;
  } else {
    idSet.add(c.id);
  }

  // Slug check
  if (!c.slug || typeof c.slug !== 'string') {
    console.error(`[ERROR] ${idx}: Missing or invalid 'slug'`);
    errors++;
  } else if (slugSet.has(c.slug)) {
    console.error(`[ERROR] ${idx}: Duplicate slug '${c.slug}'`);
    errors++;
  } else if (!/^[a-z0-9-]+$/.test(c.slug)) {
    console.error(`[ERROR] ${idx}: Slug '${c.slug}' contains invalid characters (must be lowercase alphanumeric + hyphens)`);
    errors++;
  } else {
    slugSet.add(c.slug);
  }

  // Required fields
  if (!c.title || typeof c.title !== 'string') {
    console.error(`[ERROR] ${idx}: Missing or empty 'title'`);
    errors++;
  }
  if (!c.shortDescription || typeof c.shortDescription !== 'string') {
    console.error(`[ERROR] ${idx}: Missing or empty 'shortDescription'`);
    errors++;
  }
  if (!Array.isArray(c.categories) || c.categories.length === 0) {
    console.error(`[ERROR] ${idx}: 'categories' must be a non-empty array`);
    errors++;
  }
  if (!c.level) {
    console.error(`[ERROR] ${idx}: Missing 'level'`);
    errors++;
  }
  if (!c.duration) {
    console.error(`[ERROR] ${idx}: Missing 'duration'`);
    errors++;
  }

  // Status check
  if (c.status !== 'PUBLISH') {
    console.error(`[ERROR] ${idx}: Status is '${c.status}', expected 'PUBLISH'`);
    errors++;
  }

  // Learning outcomes
  if (!Array.isArray(c.learningOutcomes) || c.learningOutcomes.length < 3) {
    console.error(`[ERROR] ${idx}: 'learningOutcomes' must be an array with >= 3 items (found ${c.learningOutcomes?.length || 0})`);
    errors++;
  }

  // Combo course validation
  if (c.isCombo) {
    if (!Array.isArray(c.includedCourseIds) || c.includedCourseIds.length === 0) {
      console.error(`[ERROR] ${idx}: Combo course must define non-empty 'includedCourseIds'`);
      errors++;
    }
  }
}

// Second pass: validate combo includedCourseIds reference existing courses
for (const c of courses) {
  if (c.isCombo && Array.isArray(c.includedCourseIds)) {
    for (const subId of c.includedCourseIds) {
      if (!idSet.has(subId)) {
        console.error(`[ERROR] Combo '${c.slug}' references non-existent course id '${subId}'`);
        errors++;
      }
    }
  }
}

console.log('----------------------------------------------------');
console.log(`Validation finished: ${courses.length} courses checked.`);
console.log(`Errors: ${errors}, Warnings: ${warnings}`);

if (errors > 0) {
  console.error('Validation FAILED: Please fix the errors listed above.');
  process.exit(1);
} else {
  console.log('Validation PASSED: All course data is 100% integral and complete!');
  process.exit(0);
}
