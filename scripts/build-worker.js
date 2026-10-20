// scripts/build-worker.js
// Automatically prepares OpenNext Cloudflare Worker bundle after Next.js build
const { execSync } = require('child_process');
const fs = require('fs');

if (process.env.VERCEL === '1') {
  console.log('[build-worker] Vercel environment detected; skipping Cloudflare OpenNext packaging.');
  process.exit(0);
}

const isCloudflare =
  process.env.CF_PAGES === '1' ||
  process.env.CLOUDFLARE_BUILD === '1' ||
  (process.env.PWD && process.env.PWD.includes('/opt/buildhome')) ||
  process.cwd().includes('/opt/buildhome') ||
  process.env.BUILD_WORKER === '1';

if (isCloudflare) {
  console.log('⚡ [build-worker] Cloudflare environment detected: compiling OpenNext worker bundle...');
  try {
    execSync('npx @opennextjs/cloudflare build --skipNextBuild', { stdio: 'inherit' });
    console.log('✅ [build-worker] OpenNext worker bundle compiled successfully.');
  } catch (err) {
    console.error('❌ [build-worker] OpenNext packaging failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('[build-worker] Local or non-Cloudflare build finished.');
}
