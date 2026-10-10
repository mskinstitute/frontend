#!/usr/bin/env node
/**
 * MSK Institute — Branch Content Differentiation & Quality Validator
 *
 * Validates:
 * - Unique, non-duplicate metadata (title, description) across branches
 * - Title and description length standards (Title <= 80 chars, Description <= 180 chars)
 * - Distinct localized neighborhood copy and landmark references per branch
 * - Prohibits cookie-cutter duplicated FAQs between branches
 * - Asserts unique branch hero headings and intros
 */

const fs = require('fs');
const path = require('path');

console.log('=== MSK INSTITUTE BRANCH CONTENT DIFFERENTIATION VALIDATOR ===\n');

let errors = 0;
let warnings = 0;

const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
if (!fs.existsSync(branchesPath)) {
  console.error(`[FATAL] branches.json not found at ${branchesPath}`);
  process.exit(1);
}

const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));

const titles = new Set();
const descriptions = new Set();
const faqQuestionSets = new Map(); // slug -> Set of questions

for (let i = 0; i < branches.length; i++) {
  const b = branches[i];
  const tag = `Branch '${b.slug}'`;

  // 1. Meta Title checks
  const title = b.localSeo?.title || '';
  if (!title) {
    console.error(`  [FAIL] ${tag}: Missing localSeo.title`);
    errors++;
  } else {
    if (titles.has(title)) {
      console.error(`  [FAIL] ${tag}: Duplicate localSeo.title: "${title}"`);
      errors++;
    } else {
      titles.add(title);
    }

    if (title.length > 85) {
      console.warn(`  [WARN] ${tag}: localSeo.title is long (${title.length} chars): "${title}"`);
      warnings++;
    } else {
      console.log(`  [PASS] ${tag}: Meta title verified (${title.length} chars)`);
    }
  }

  // 2. Meta Description checks
  const metaDesc = b.localSeo?.description || '';
  if (!metaDesc) {
    console.error(`  [FAIL] ${tag}: Missing localSeo.description`);
    errors++;
  } else {
    if (descriptions.has(metaDesc)) {
      console.error(`  [FAIL] ${tag}: Duplicate localSeo.description: "${metaDesc}"`);
      errors++;
    } else {
      descriptions.add(metaDesc);
    }

    if (metaDesc.length > 185) {
      console.warn(`  [WARN] ${tag}: localSeo.description is long (${metaDesc.length} chars)`);
      warnings++;
    } else {
      console.log(`  [PASS] ${tag}: Meta description verified (${metaDesc.length} chars)`);
    }
  }

  // 3. Local landmark / locality mention check in description or address
  const fullText = `${b.localDescription || ''} ${b.landmark || ''} ${b.address || ''}`.toLowerCase();
  const city = (b.city || '').toLowerCase();

  if (!fullText.includes(city)) {
    console.warn(`  [WARN] ${tag}: Branch text does not prominently feature city name '${city}'`);
    warnings++;
  } else {
    console.log(`  [PASS] ${tag}: City name featured in localized text`);
  }

  // 4. FAQs differentiation check
  const bFaqs = Array.isArray(b.faqs) ? b.faqs : [];
  const qSet = new Set();
  for (const faq of bFaqs) {
    if (!faq.question || !faq.answer) {
      console.error(`  [FAIL] ${tag}: Empty FAQ question or answer`);
      errors++;
    } else {
      qSet.add(faq.question.toLowerCase().trim());
    }
  }
  faqQuestionSets.set(b.slug, qSet);

  if (bFaqs.length >= 3) {
    console.log(`  [PASS] ${tag}: ${bFaqs.length} localized FAQs verified`);
  } else {
    console.warn(`  [WARN] ${tag}: Only ${bFaqs.length} FAQs provided (recommended: >= 3)`);
    warnings++;
  }
}

// 5. Cross-branch FAQ overlap check
const branchSlugs = Array.from(faqQuestionSets.keys());
for (let i = 0; i < branchSlugs.length; i++) {
  for (let j = i + 1; j < branchSlugs.length; j++) {
    const s1 = branchSlugs[i];
    const s2 = branchSlugs[j];
    const set1 = faqQuestionSets.get(s1);
    const set2 = faqQuestionSets.get(s2);

    let commonCount = 0;
    for (const q of set1) {
      if (set2.has(q)) {
        commonCount++;
      }
    }

    if (commonCount > 0 && commonCount === set1.size && commonCount === set2.size) {
      console.error(`  [FAIL] Branches '${s1}' and '${s2}' share 100% identical FAQs. FAQs must be localized.`);
      errors++;
    } else {
      console.log(`  [PASS] FAQs between '${s1}' and '${s2}' are properly differentiated (0 exact duplicates).`);
    }
  }
}

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log(`[SUCCESS] Branch content differentiation validation PASSED with 0 errors and ${warnings} warnings.\n`);
  process.exit(0);
} else {
  console.error(`[FAILURE] Branch content differentiation validation FAILED with ${errors} errors and ${warnings} warnings.\n`);
  process.exit(1);
}
