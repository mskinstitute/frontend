const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
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

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        } else if (msg.method) {
          const listeners = this.eventListeners.get(msg.method) || [];
          listeners.forEach(fn => fn(msg.params));
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function createTarget(browserWsUrl) {
  // Create a new tab target
  const res = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
  const target = await res.json();
  return target;
}

async function closeTarget(targetId) {
  try {
    await fetch(`http://127.0.0.1:9222/json/close/${targetId}`);
  } catch {}
}

async function measurePage(client, url, isMobile) {
  await client.send('Page.enable');
  await client.send('Network.enable');
  await client.send('Runtime.enable');
  await client.send('Performance.enable');

  // Network condition & device simulation
  if (isMobile) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' }
    });
    await client.send('Network.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    });
  } else {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  // Network tracking
  const requests = new Map();
  let jsBytes = 0;
  let cssBytes = 0;
  let imgBytes = 0;
  let fontBytes = 0;
  let totalBytes = 0;
  let ttfb = 0;

  client.on('Network.responseReceived', (params) => {
    const { response, type } = params;
    requests.set(params.requestId, { type, url: response.url, status: response.status });
    if (response.timing && ttfb === 0 && (type === 'Document' || response.url.includes(url))) {
      ttfb = response.timing.receiveHeadersStart || response.timing.responseStart || 0;
    }
  });

  client.on('Network.loadingFinished', (params) => {
    const encodedDataLength = params.encodedDataLength || 0;
    totalBytes += encodedDataLength;
    const req = requests.get(params.requestId);
    if (req) {
      if (req.type === 'Script') jsBytes += encodedDataLength;
      else if (req.type === 'Stylesheet') cssBytes += encodedDataLength;
      else if (req.type === 'Image') imgBytes += encodedDataLength;
      else if (req.type === 'Font') fontBytes += encodedDataLength;
    }
  });

  // Inject performance observer before navigation
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__cwv = { lcp: 0, lcpElement: '', cls: 0, fcp: 0 };
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              window.__cwv.fcp = entry.startTime;
            }
          }
        }).observe({ type: 'paint', buffered: true });

        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            window.__cwv.lcp = lastEntry.startTime;
            window.__cwv.lcpElement = lastEntry.element ? (lastEntry.element.tagName + (lastEntry.element.id ? '#' + lastEntry.element.id : '') + (lastEntry.element.className ? '.' + String(lastEntry.element.className).split(' ')[0] : '')) : 'unknown';
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__cwv.cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}
    `
  });

  // Navigate
  await client.send('Page.navigate', { url });

  // Wait for load event
  await new Promise((resolve) => {
    const handler = () => resolve();
    client.on('Page.loadEventFired', handler);
    // Timeout safeguard: 4 seconds
    setTimeout(resolve, 4000);
  });

  // Allow extra settling time for layout shift and LCP finalization
  await new Promise(r => setTimeout(r, 1200));

  // Extract CWV metrics from window.__cwv and performance.timing
  const evalRes = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const cwv = window.__cwv || {};
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paint = performance.getEntriesByType('paint');
        let fcp = cwv.fcp || 0;
        if (!fcp) {
          const p = paint.find(e => e.name === 'first-contentful-paint');
          if (p) fcp = p.startTime;
        }
        return {
          fcp: Math.round(fcp),
          lcp: Math.round(cwv.lcp || fcp || 0),
          lcpElement: cwv.lcpElement || 'H1/Hero',
          cls: Number((cwv.cls || 0).toFixed(3)),
          ttfb: Math.round(nav.responseStart ? (nav.responseStart - nav.requestStart) : 0),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
          loadTime: Math.round(nav.loadEventEnd || 0),
        };
      })()
    `,
    returnByValue: true
  });

  const metrics = evalRes.result?.value || {};

  return {
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    lcpElement: metrics.lcpElement,
    cls: metrics.cls,
    ttfb: metrics.ttfb || Math.round(ttfb),
    domContentLoaded: metrics.domContentLoaded,
    loadTime: metrics.loadTime,
    requestCount: requests.size,
    totalBytesKb: (totalBytes / 1024).toFixed(1),
    jsBytesKb: (jsBytes / 1024).toFixed(1),
    cssBytesKb: (cssBytes / 1024).toFixed(1),
    imgBytesKb: (imgBytes / 1024).toFixed(1),
    fontBytesKb: (fontBytes / 1024).toFixed(1),
  };
}

async function main() {
  console.log('--- MSK INSTITUTE REAL CHROMIUM CORE WEB VITALS AUDIT (BEFORE) ---');
  
  // 1. Launch Headless Edge
  const browserProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  console.log(`Connected to: ${versionInfo.Browser}`);

  const auditData = [];

  for (const item of TARGET_ROUTES) {
    const fullUrl = BASE_URL + item.path;
    console.log(`\nAuditing: ${item.name} (${item.path})`);

    // Desktop
    const desktopTarget = await createTarget(versionInfo.webSocketDebuggerUrl);
    const desktopClient = new CDPClient(desktopTarget.webSocketDebuggerUrl);
    await desktopClient.connect();
    const desktopMetrics = await measurePage(desktopClient, fullUrl, false);
    desktopClient.close();
    await closeTarget(desktopTarget.id);

    // Mobile
    const mobileTarget = await createTarget(versionInfo.webSocketDebuggerUrl);
    const mobileClient = new CDPClient(mobileTarget.webSocketDebuggerUrl);
    await mobileClient.connect();
    const mobileMetrics = await measurePage(mobileClient, fullUrl, true);
    mobileClient.close();
    await closeTarget(mobileTarget.id);

    console.log(`  Desktop -> LCP: ${desktopMetrics.lcp}ms, FCP: ${desktopMetrics.fcp}ms, CLS: ${desktopMetrics.cls}, Total: ${desktopMetrics.totalBytesKb}KB (JS: ${desktopMetrics.jsBytesKb}KB)`);
    console.log(`  Mobile  -> LCP: ${mobileMetrics.lcp}ms, FCP: ${mobileMetrics.fcp}ms, CLS: ${mobileMetrics.cls}, Total: ${mobileMetrics.totalBytesKb}KB (JS: ${mobileMetrics.jsBytesKb}KB)`);

    auditData.push({
      route: item.path,
      name: item.name,
      desktop: desktopMetrics,
      mobile: mobileMetrics,
    });
  }

  browserProc.kill();

  fs.writeFileSync('docs/performance-audit-before-raw.json', JSON.stringify(auditData, null, 2));
  console.log('\nAudit complete! Saved raw telemetry to docs/performance-audit-before-raw.json');
}

main().catch(err => {
  console.error('Audit run failed:', err);
  process.exit(1);
});
