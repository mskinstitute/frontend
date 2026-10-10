#!/usr/bin/env node

/**
 * MSK Institute — Automated Performance & Resource Budget Auditor
 *
 * Enforces strict performance budgets from docs/performance-budget.md:
 * 1. Verifies that Next.js client chunks do not exceed size ceilings.
 * 2. Checks static image weights in public/ to prevent large uncompressed assets.
 * 3. Enforces < 0.1 CLS architectural invariants (no full-page suspense wrappers on query-sync pages).
 * 4. Fails with exit code 1 if any performance budget is breached.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT_DIR, '.next');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let totalErrors = 0;
let totalWarnings = 0;

function report(status, testName, message) {
  const symbol = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${symbol} [${status}] ${testName}: ${message}`);
  if (status === 'FAIL') totalErrors++;
  if (status === 'WARN') totalWarnings++;
}

console.log('--- MSK INSTITUTE PERFORMANCE & CWV AUDITOR ---\n');

// 1. Audit Next.js Build Output
if (!fs.existsSync(NEXT_DIR)) {
  report('FAIL', 'Build Manifest Check', '.next directory not found. Please run `npm run build` first.');
  process.exit(1);
}

const buildManifestPath = path.join(NEXT_DIR, 'build-manifest.json');
const appBuildManifestPath = path.join(NEXT_DIR, 'app-build-manifest.json');

if (!fs.existsSync(buildManifestPath) || !fs.existsSync(appBuildManifestPath)) {
  report('FAIL', 'Build Manifest Check', 'Next.js build manifests missing.');
  process.exit(1);
}

const appManifest = JSON.parse(fs.readFileSync(appBuildManifestPath, 'utf8'));

// Budget limits (in Gzip KB)
const ROUTE_JS_BUDGETS = {
  '/verify-certificate/page': 160,
  '/admin/page': 160,
  '/tools/typing/page': 190,
  '/courses/page': 160,
  '/live-batches/page': 150,
  '/study-material/page': 150,
  '/contact/page': 150,
  '/page': 140, // Homepage
};

console.log('1. Auditing Route JavaScript Chunks Against Budget:');
for (const [routeKey, maxBudget] of Object.entries(ROUTE_JS_BUDGETS)) {
  const chunks = appManifest.pages[routeKey];
  if (!chunks) {
    report('WARN', `Route ${routeKey}`, 'Route not found in app manifest');
    continue;
  }

  let totalRawBytes = 0;
  let totalGzipBytes = 0;

  for (const chunk of chunks) {
    const chunkFile = path.join(NEXT_DIR, chunk);
    if (fs.existsSync(chunkFile)) {
      const buffer = fs.readFileSync(chunkFile);
      totalRawBytes += buffer.length;
      totalGzipBytes += zlib.gzipSync(buffer).length;
    }
  }

  const gzipKb = (totalGzipBytes / 1024).toFixed(1);
  if (totalGzipBytes / 1024 > maxBudget) {
    report('FAIL', `Route ${routeKey} JS Weight`, `${gzipKb} KB exceeds budget limit of ${maxBudget} KB`);
  } else {
    report('PASS', `Route ${routeKey} JS Weight`, `${gzipKb} KB (Budget: <= ${maxBudget} KB)`);
  }
}

// 2. Audit Static Assets in public/
console.log('\n2. Auditing Static Assets in public/:');
const MAX_PNG_SIZE_KB = 150; // Warn on PNGs > 150KB
const auditedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

function scanDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (auditedExtensions.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

const staticImages = scanDir(PUBLIC_DIR);
let largeAssetCount = 0;

for (const imgPath of staticImages) {
  const stat = fs.statSync(imgPath);
  const sizeKb = stat.size / 1024;
  const relPath = path.relative(ROOT_DIR, imgPath);

  if (sizeKb > 300) {
    report('FAIL', 'Image Asset Weight', `${relPath} is ${sizeKb.toFixed(1)} KB (Max: 300 KB)`);
    largeAssetCount++;
  } else if (sizeKb > MAX_PNG_SIZE_KB && imgPath.endsWith('.png')) {
    report('WARN', 'Image Asset Format', `${relPath} is ${sizeKb.toFixed(1)} KB PNG. Recommend converting to WebP.`);
  }
}

if (largeAssetCount === 0) {
  report('PASS', 'Static Image Assets', `All ${staticImages.length} images pass the weight budget (< 300 KB).`);
}

// 3. Audit Architecture Invariants (CLS Protection)
console.log('\n3. Auditing Architecture & Layout Shift Invariants:');

// Verify LiveBatchesClient doesn't wrap entire page in blocking Suspense
const liveBatchesSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/components/LiveBatchesClient.tsx'), 'utf8');
if (liveBatchesSrc.includes('<Suspense fallback={<div className="p-12 text-center text-text-muted">Loading live batches...</div>}>')) {
  report('FAIL', 'CLS Invariant (/live-batches)', 'Detected full-page Suspense fallback in LiveBatchesClient');
} else {
  report('PASS', 'CLS Invariant (/live-batches)', 'LiveBatchesClient renders SSR shell without layout-shifting fallback');
}

// Verify StudyMaterialClient uses isolated query sync
const studyMaterialSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/components/StudyMaterialClient.tsx'), 'utf8');
if (studyMaterialSrc.includes('StudyMaterialQuerySync')) {
  report('PASS', 'CLS Invariant (/study-material)', 'StudyMaterialClient isolates URL query synchronization');
} else {
  report('FAIL', 'CLS Invariant (/study-material)', 'StudyMaterialQuerySync missing');
}

// Verify dynamic jsPDF in tools/typing
const typingModalSrc = fs.readFileSync(path.join(ROOT_DIR, 'src/features/typequest/components/TypingCertificateModal.tsx'), 'utf8');
if (typingModalSrc.includes("import { jsPDF } from 'jspdf'") || typingModalSrc.includes('import jsPDF from "jspdf"')) {
  report('FAIL', 'Bundle Invariant (/tools/typing)', 'Static jsPDF import detected in TypingCertificateModal');
} else {
  report('PASS', 'Bundle Invariant (/tools/typing)', 'jsPDF is dynamically imported on demand');
}

console.log('\n=============================================');
console.log(`AUDIT COMPLETE: ${totalErrors} Errors, ${totalWarnings} Warnings`);
console.log('=============================================\n');

if (totalErrors > 0) {
  console.error('❌ Performance audit FAILED. Address the errors listed above.');
  process.exit(1);
} else {
  console.log('✅ All performance and Core Web Vitals budgets PASSED!');
  process.exit(0);
}
