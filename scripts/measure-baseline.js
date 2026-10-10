const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3005';

const TARGET_ROUTES = [
  { name: 'Homepage', path: '/' },
  { name: 'Courses Listing', path: '/courses' },
  { name: 'Python Course', path: '/courses/python-mastery-beginner-to-advanced--3-months' },
  { name: 'Data Analytics Course', path: '/courses/data-analysis-mastery-combo-course--12-months' },
  { name: 'Full Stack Course', path: '/courses/full-stack-web-dev-bootcamp' },
  { name: 'Live Batches', path: '/live-batches' },
  { name: 'Study Material', path: '/study-material' },
  { name: 'Blog Listing', path: '/blogs' },
  { name: 'Representative Blog Article', path: '/blogs/how-to-prepare-for-nielit-ccc-exam-first-attempt' },
  { name: 'Tutorial Page', path: '/tutorials/html5-complete-course' },
  { name: 'Contact', path: '/contact' },
];

function fetchWithMetrics(urlPath, userAgent = 'Desktop') {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    let ttfb = 0;

    const headers = {
      'User-Agent': userAgent === 'Mobile'
        ? 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    const req = http.get(BASE_URL + urlPath, { headers }, (res) => {
      const firstByte = process.hrtime.bigint();
      ttfb = Number(firstByte - start) / 1e6; // ms

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const totalTime = Number(process.hrtime.bigint() - start) / 1e6;
        const rawBuffer = Buffer.concat(chunks);
        let decompressed = rawBuffer;
        const encoding = res.headers['content-encoding'];
        if (encoding === 'gzip') {
          try {
            decompressed = zlib.gunzipSync(rawBuffer);
          } catch {}
        } else if (encoding === 'br') {
          try {
            decompressed = zlib.brotliDecompressSync(rawBuffer);
          } catch {}
        }

        resolve({
          statusCode: res.statusCode,
          ttfbMs: Number(ttfb.toFixed(1)),
          totalMs: Number(totalTime.toFixed(1)),
          transferredBytes: rawBuffer.length,
          uncompressedBytes: decompressed.length,
          html: decompressed.toString('utf8'),
        });
      });
    });

    req.on('error', reject);
  });
}

function analyzeHtml(html) {
  // Extract scripts
  const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scripts = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }

  // Extract CSS
  const cssRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const stylesheets = [];
  while ((m = cssRegex.exec(html)) !== null) {
    stylesheets.push(m[1]);
  }

  // Extract images
  const imgRegex = /<img\b([^>]+)>/gi;
  const images = [];
  while ((m = imgRegex.exec(html)) !== null) {
    const attrs = m[1];
    const srcMatch = /src=["']([^"']+)["']/i.exec(attrs);
    const altMatch = /alt=["']([^"']+)["']/i.exec(attrs);
    const loadingMatch = /loading=["']([^"']+)["']/i.exec(attrs);
    const fetchPriorityMatch = /fetchpriority=["']([^"']+)["']/i.exec(attrs);
    const widthMatch = /width=["']?(\d+)["']?/i.exec(attrs);
    const heightMatch = /height=["']?(\d+)["']?/i.exec(attrs);
    images.push({
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      loading: loadingMatch ? loadingMatch[1] : 'eager',
      fetchPriority: fetchPriorityMatch ? fetchPriorityMatch[1] : 'auto',
      hasDimensions: Boolean(widthMatch && heightMatch),
      width: widthMatch ? widthMatch[1] : null,
      height: heightMatch ? heightMatch[1] : null,
    });
  }

  // Identify H1
  const h1Match = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A';

  // LCP candidate
  let lcpCandidate = 'h1: ' + h1Text.substring(0, 50);
  const heroImg = images.find(img => img.fetchPriority === 'high' || (!img.loading || img.loading === 'eager'));
  if (heroImg && heroImg.src) {
    lcpCandidate = `img: ${heroImg.src.substring(0, 50)}`;
  }

  return {
    scripts,
    stylesheets,
    images,
    h1Text,
    lcpCandidate,
  };
}

function getLocalAssetSize(assetPath) {
  if (assetPath.startsWith('/_next/')) {
    const localRel = assetPath.replace('/_next/', '.next/');
    if (fs.existsSync(localRel)) {
      const buf = fs.readFileSync(localRel);
      return { raw: buf.length, gzip: zlib.gzipSync(buf).length };
    }
  }
  if (assetPath.startsWith('/')) {
    const localRel = path.join('public', assetPath);
    if (fs.existsSync(localRel)) {
      const buf = fs.readFileSync(localRel);
      return { raw: buf.length, gzip: zlib.gzipSync(buf).length };
    }
  }
  return { raw: 0, gzip: 0 };
}

async function runAudit() {
  console.log('Starting MSK Institute Performance Audit (Step 0 Baseline)...\n');
  const results = [];

  for (const route of TARGET_ROUTES) {
    console.log(`Auditing: ${route.name} (${route.path})`);
    
    // Desktop measurement
    const desktopRes = await fetchWithMetrics(route.path, 'Desktop');
    const parsed = analyzeHtml(desktopRes.html);

    // Sum JS sizes
    let jsRaw = 0;
    let jsGzip = 0;
    parsed.scripts.forEach(s => {
      const sz = getLocalAssetSize(s);
      jsRaw += sz.raw;
      jsGzip += sz.gzip;
    });

    // Sum CSS sizes
    let cssRaw = 0;
    let cssGzip = 0;
    parsed.stylesheets.forEach(c => {
      const sz = getLocalAssetSize(c);
      cssRaw += sz.raw;
      cssGzip += sz.gzip;
    });

    // Mobile measurement (constrained simulation)
    const mobileRes = await fetchWithMetrics(route.path, 'Mobile');

    results.push({
      route: route.path,
      name: route.name,
      desktop: {
        ttfbMs: desktopRes.ttfbMs,
        totalMs: desktopRes.totalMs,
        htmlKb: (desktopRes.transferredBytes / 1024).toFixed(1),
        htmlUncompressedKb: (desktopRes.uncompressedBytes / 1024).toFixed(1),
        jsCount: parsed.scripts.length,
        jsGzipKb: (jsGzip / 1024).toFixed(1),
        cssCount: parsed.stylesheets.length,
        cssGzipKb: (cssGzip / 1024).toFixed(1),
        imgCount: parsed.images.length,
        missingDimsCount: parsed.images.filter(i => !i.hasDimensions).length,
        lcpCandidate: parsed.lcpCandidate,
      },
      mobile: {
        ttfbMs: mobileRes.ttfbMs,
        totalMs: mobileRes.totalMs,
        htmlKb: (mobileRes.transferredBytes / 1024).toFixed(1),
      },
    });
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===\n');
  console.table(results.map(r => ({
    Route: r.route,
    'TTFB (ms)': r.desktop.ttfbMs,
    'HTML Transferred (KB)': r.desktop.htmlKb,
    'HTML Raw (KB)': r.desktop.htmlUncompressedKb,
    'JS Gzip (KB)': r.desktop.jsGzipKb,
    'CSS Gzip (KB)': r.desktop.cssGzipKb,
    'Images': r.desktop.imgCount,
    'Img Missing Dims': r.desktop.missingDimsCount,
    'LCP Element': r.desktop.lcpCandidate.substring(0, 30),
  })));

  fs.writeFileSync('docs/performance-audit-data-before.json', JSON.stringify(results, null, 2));
  console.log('\nSaved baseline metrics to docs/performance-audit-data-before.json');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
