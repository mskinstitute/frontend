#!/usr/bin/env node
/**
 * MSK Institute — IndexNow Instant Indexing Submitter
 *
 * Pings Bing, Microsoft Copilot, ChatGPT Search (Bing index), Yandex, Naver, and Seznam
 * with all canonical 200 OK URLs from the site.
 *
 * Usage:
 *   node scripts/submit-indexnow.js             # Submit all canonical URLs live
 *   node scripts/submit-indexnow.js --dry-run   # Print URL count & sample without sending
 */

const fs = require('fs');
const path = require('path');

const HOST = 'www.mskinstitute.in';
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'b8e4f9a2d1c74e6395a0f2c8d3b1e7a4';
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const DRY_RUN = process.argv.includes('--dry-run');

function collectCanonicalUrls() {
  const urls = new Set([
    `${BASE_URL}`,
    `${BASE_URL}/book-demo`,
    `${BASE_URL}/courses`,
    `${BASE_URL}/tutorials`,
    `${BASE_URL}/live-batches`,
    `${BASE_URL}/live`,
    `${BASE_URL}/locations`,
    `${BASE_URL}/learning-paths`,
    `${BASE_URL}/mock-test`,
    `${BASE_URL}/mock-test/ccc`,
    `${BASE_URL}/career-finder`,
    `${BASE_URL}/blogs`,
    `${BASE_URL}/study-material`,
    `${BASE_URL}/tools`,
    `${BASE_URL}/tools/typing`,
    `${BASE_URL}/tools/db-viewer`,
    `${BASE_URL}/tools/sql-studio`,
    `${BASE_URL}/playground`,
    `${BASE_URL}/shortcuts`,
    `${BASE_URL}/projects`,
    `${BASE_URL}/verify-certificate`,
    `${BASE_URL}/careers`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
  ]);

  // Branches
  const branchesPath = path.join(process.cwd(), 'public', 'data', 'branches.json');
  if (fs.existsSync(branchesPath)) {
    const branches = JSON.parse(fs.readFileSync(branchesPath, 'utf8'));
    branches.forEach((b) => urls.add(`${BASE_URL}/locations/${b.slug}`));
  }

  // Courses & mock tests
  const coursesPath = path.join(process.cwd(), 'public', 'data', 'all-courses.json');
  if (fs.existsSync(coursesPath)) {
    const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    courses
      .filter((c) => c.status === 'PUBLISH')
      .forEach((c) => {
        urls.add(`${BASE_URL}/courses/${c.slug}`);
        if (c.slug !== 'ccc') urls.add(`${BASE_URL}/mock-test/${c.slug}`);
      });
  }

  // Blogs
  const blogDir = path.join(process.cwd(), 'content', 'blogs');
  if (fs.existsSync(blogDir)) {
    fs.readdirSync(blogDir)
      .filter((f) => f.endsWith('.md'))
      .forEach((f) => urls.add(`${BASE_URL}/blogs/${f.replace(/\.md$/, '')}`));
  }

  // Tutorials & local topics
  const tutorialsPath = path.join(process.cwd(), 'public', 'data', 'tutorials.json');
  const tutDir = path.join(process.cwd(), 'public', 'content', 'tutorials');
  if (fs.existsSync(tutorialsPath)) {
    const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));
    tutorials.forEach((t) => {
      urls.add(`${BASE_URL}/tutorials/${t.slug}`);
      const subDir = path.join(tutDir, t.slug);
      if (fs.existsSync(subDir)) {
        fs.readdirSync(subDir, { withFileTypes: true }).forEach((ent) => {
          if (ent.isFile() && ent.name.endsWith('.md')) {
            urls.add(`${BASE_URL}/tutorials/${t.slug}/${ent.name.replace(/\.md$/, '').replace(/^\d+-/, '')}`);
          } else if (ent.isDirectory() && ent.name !== 'images') {
            fs.readdirSync(path.join(subDir, ent.name))
              .filter((f) => f.endsWith('.md'))
              .forEach((f) => {
                urls.add(`${BASE_URL}/tutorials/${t.slug}/${f.replace(/\.md$/, '').replace(/^\d+-/, '')}`);
              });
          }
        });
      }
    });
  }

  // Cloud-hosted GitHub tutorial manifest topics
  const manifestPath = path.join(process.cwd(), 'src', 'data', 'githubTutorialManifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    Object.entries(manifest).forEach(([tutSlug, tutData]) => {
      if (tutData && tutData.files) {
        Object.keys(tutData.files).forEach((rawKey) => {
          const cleanSlug = rawKey.replace(/\.md$/, '').replace(/^\d+-/, '').toLowerCase();
          if (cleanSlug) urls.add(`${BASE_URL}/tutorials/${tutSlug}/${cleanSlug}`);
        });
      }
    });
  }

  return Array.from(urls);
}

async function main() {
  const keyFilePath = path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    console.error(`[ERROR] Missing IndexNow verification file: public/${INDEXNOW_KEY}.txt`);
    process.exit(1);
  }

  const urlList = collectCanonicalUrls();
  console.log(`--- MSK INSTITUTE INDEXNOW SUBMISSION ---`);
  console.log(`Host: ${HOST}`);
  console.log(`Key Location: ${KEY_LOCATION}`);
  console.log(`Total Canonical URLs Ready: ${urlList.length}`);

  if (DRY_RUN) {
    console.log('Mode: DRY RUN (no HTTP request sent)');
    console.log('Sample URLs:', urlList.slice(0, 10));
    process.exit(0);
  }

  // IndexNow accepts up to 10,000 URLs per batch
  const BATCH_SIZE = 5000;
  for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
    const batch = urlList.slice(i, i + BATCH_SIZE);
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: HTTP ${res.status} ${res.statusText} (${batch.length} URLs)`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Response body:', body);
      process.exit(1);
    }
  }

  console.log('[SUCCESS] All canonical URLs submitted to IndexNow (Bing, Copilot, ChatGPT Search, Yandex).');
}

main().catch((err) => {
  console.error('[ERROR] IndexNow submission failed:', err.message);
  process.exit(1);
});

