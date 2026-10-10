---
id: improving-lighthouse-performance-and-core-web-vitals
slug: improving-lighthouse-performance-and-core-web-vitals
course: css-for-advanced
chapter: Optimization and Performance
topic: "Improving Google Lighthouse Scores: Core Web Vitals (LCP, CLS, INP)"
difficulty: Advanced
readingTime: 15
order: 33
keywords: ["core web vitals css", "lighthouse performance 100", "largest contentful paint lcp", "cumulative layout shift cls", "interaction to next paint inp", "font-display swap size-adjust"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# Improving Google Lighthouse Scores: Core Web Vitals (LCP, CLS, INP)

Imagine entering a bank to deposit cash. If the main entrance glass door is stuck and takes 10 seconds to open (**LCP**), you get frustrated. Once inside, if the deposit slip countertop suddenly jumps two feet to the left right as your pen touches the paper (**CLS**), you scribble an accidental error on your cheque. And when you finally click the service bell and wait 5 seconds before anyone even looks up (**INP**), you leave with a terrible impression.

In 2020, Google officially made **Core Web Vitals** an organic search engine ranking signal. If your website scores poorly on Google Lighthouse, your search rankings plunge and bounce rates skyrocket. While many developers assume performance is purely a backend or JavaScript issue, **over 60% of Core Web Vitals penalties are directly caused by unoptimized CSS and font-loading patterns**!

---

## 1. The Big 3 Core Web Vitals Explained

```
+-------------------------------------------------------------------------+
|                  THE 3 GOOGLE CORE WEB VITALS BENCHMARKS                |
+-------------------------------------------------------------------------+

  1. LCP (Largest Contentful Paint)   Target: <= 2.5 seconds
     Measures PERCEIVED LOADING SPEED.
     When does the largest headline or hero banner image finish painting?

  2. CLS (Cumulative Layout Shift)    Target: <= 0.1
     Measures VISUAL STABILITY.
     Do buttons, banners, or paragraphs jump around as fonts and images load?

  3. INP (Interaction to Next Paint)  Target: <= 200 milliseconds
     Measures USER INTERACTION RESPONSIVENESS.
     When the user clicks a tab or menu, does the UI respond immediately?
```

---

## 2. Eliminating Font Layout Shift with `font-display` & `size-adjust`

When a custom Google Font (like Inter or Poppins) is loading, two disasters commonly occur:
- **FOIT (Flash of Invisible Text):** The browser hides text completely for up to 3 seconds until the font file arrives.
- **FOUT (Flash of Unstyled Text):** The browser shows Arial first, and when Poppins arrives, the text size differences cause the entire article to jump, racking up heavy CLS penalties!

### The Modern Font Solution:
```css
/* 1. Ensure text is visible immediately using swap */
@font-face {
  font-family: 'CustomPoppins';
  src: url('/fonts/poppins.woff2') format('woff2');
  font-weight: 700;
  font-display: swap; /* Never hide text! Show fallback immediately */
}

/* 2. Micro-tune the fallback font so it takes the EXACT same space! */
@font-face {
  font-family: 'FallbackArial';
  src: local('Arial');
  /* Harmonizes Arial's dimensions to match Poppins perfectly! */
  size-adjust: 104.2%;
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}

body {
  font-family: 'CustomPoppins', 'FallbackArial', sans-serif;
}
```

When the custom font finishes downloading, **zero pixels shift on screen** because the fallback font was mathematically calibrated to match its exact footprint!

---

## 3. Fixing Largest Contentful Paint (LCP) via CSS

The LCP element on most websites is either a large hero headline or a background hero image.

### CSS Techniques to Accelerate LCP:
1. **Preload the Hero Font:**
   ```html
   <link rel="preload" href="/fonts/poppins.woff2" as="font" type="font/woff2" crossorigin>
   ```
2. **Never Lazy-Load the LCP Image:**
   ```html
   <!-- FORBIDDEN on the hero banner: loading="lazy" delays LCP by seconds! -->
   <img src="hero.webp" fetchpriority="high" alt="Hero">
   ```
3. **Avoid Background Images for LCP Elements:** The browser discovers `<img>` tags in HTML immediately via the Preload Scanner. However, an image declared via CSS `background-image: url('hero.jpg')` cannot be discovered until the CSS file is completely downloaded and parsed!

---

## 4. Conquering CLS: Aspect Ratio Reservation

Cumulative Layout Shift happens when elements render with zero initial height and suddenly pop open.

```css
/* 1. Images & Videos: Always enforce aspect ratio */
img, video {
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Reserves space BEFORE image bytes download! */
}

/* 2. Dynamic Banner Ads & Widgets */
.ad-slot-container {
  min-height: 250px; /* Locks vertical space so content below never jumps */
  background: #f1f5f9;
}
```

---

## 5. Do's and Don'ts of Core Web Vitals Optimization

| Category | Do | Don't |
| :--- | :--- | :--- |
| **Font Display** | Always set `font-display: swap` on `@font-face` declarations. | Allow text to remain completely invisible for seconds (FOIT). |
| **Image Reservation** | Use `aspect-ratio: 16 / 9` or explicit `width` and `height` attributes on images. | Insert naked `<img>` tags with zero dimensional constraints, destroying CLS. |
| **Hero Graphics** | Use standard `<img>` with `fetchpriority="high"` for hero banners. | Use CSS `background-image` for LCP heroes, hiding the asset from the HTML preload scanner. |
| **Animations** | Animate exclusively using `transform` and `opacity`. | Animate `top`, `left`, `width`, or `height`, which triggers continuous layout recalculations and hurts INP. |

---

## 6. Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                  CORE WEB VITALS OPTIMIZATION CHEAT SHEET               |
+-------------------------------------------------------------------------+

  1. LCP <= 2.5s:
     - Inline Critical CSS (<14KB).
     - Preload .woff2 fonts with crossorigin.
     - Use <img> with fetchpriority="high" for hero artwork.

  2. CLS <= 0.1:
     - img { aspect-ratio: 16/9; }
     - Reserve ad & widget container min-heights.
     - Calibrate fallback fonts with size-adjust.

  3. INP <= 200ms:
     - Animate with transform & opacity only.
     - Keep CSS selector specificity flat (BEM / @layer).
```

---

# Multiple Choice Questions

### 1. Which Google Core Web Vital metric measures the visual stability of a webpage to prevent unexpected layout jumping?
A. First Input Delay (FID)
B. Cumulative Layout Shift (CLS)
C. Time to First Byte (TTFB)
D. Total Blocking Time (TBT)

**Answer:** B
**Explanation:** CLS (Cumulative Layout Shift) quantifies how often and how severely elements unexpectedly move on screen as fonts, images, and embeds load.

---

### 2. What does declaring `font-display: swap;` inside an `@font-face` block achieve?
A. It disables italic font variants
B. It instructs the browser to render text immediately using a fallback system font, then swap in the web font once it finishes loading, eliminating invisible text (FOIT)
C. It converts web fonts into SVG outlines
D. It rotates fonts upside down

**Answer:** B
**Explanation:** `font-display: swap` instructs the browser to immediately display fallback system text rather than waiting in the dark with blank invisible text (FOIT), ensuring immediate readability.

---

### 3. Why does declaring a hero banner image as an HTML `<img>` with `fetchpriority="high"` outperform a CSS `background-image` for LCP?
A. HTML tags are scanned and preloaded by the browser's fast C++ Preload Scanner before CSS files finish parsing
B. CSS images cannot display high-resolution colors
C. Background images are disabled on 4G networks
D. `fetchpriority` only works inside JavaScript

**Answer:** A
**Explanation:** The browser Preload Scanner discovers HTML `<img>` tags while downloading the HTML stream. CSS `background-image` references remain completely invisible to the browser until the entire stylesheet has downloaded and parsed.

---

### 4. How does `size-adjust` inside `@font-face` help eliminate Cumulative Layout Shift (CLS)?
A. It compresses the font file size
B. It scales the glyph dimensions of the fallback system font so its physical footprint matches the incoming web font, preventing text reflow during font swap
C. It automatically translates text into different languages
D. It forces text to fit inside a single line

**Answer:** B
**Explanation:** `size-adjust` scales fallback system fonts (like Arial) to match the exact physical proportions of custom web fonts (like Poppins), eliminating the layout jump when fonts swap.

---

### 5. To maintain responsive Interaction to Next Paint (INP <= 200ms), which CSS properties should be used for UI transitions and hover animations?
A. `width` and `height`
B. `transform` and `opacity`
C. `margin-top` and `padding-left`
D. `top` and `left`

**Answer:** B
**Explanation:** `transform` and `opacity` are executed on the GPU compositor thread without triggering layout reflows or repaints on the main thread, keeping the main thread free to respond to user interactions instantly.

---

# Hands-On Practice Challenge: Google Lighthouse Core Web Vitals Studio

Experiment with this interactive performance telemetry station. Toggle image aspect ratio reservation and font display swap to watch the simulated Lighthouse Performance Score leap to 100!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Core Web Vitals & Lighthouse Optimization Studio</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1.5rem;
    }

    .container {
      width: 100%;
      max-width: 900px;
    }

    header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #38bdf8;
    }

    header p {
      color: #94a3b8;
      font-size: 0.95rem;
    }

    /* Telemetry HUD */
    .hud-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      text-align: center;
    }

    .hud-metric-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }

    .hud-metric-val {
      font-size: 1.85rem;
      font-weight: 800;
    }

    .score-good { color: #34d399; }
    .score-poor { color: #f87171; }

    /* Interactive Optimization Toggles */
    .toggles-panel {
      background: #020617;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 2rem;
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #10b981;
      cursor: pointer;
    }

    /* Simulation Preview Card */
    .preview-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .aspect-box {
      width: 100%;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    /* CLS Optimization Class */
    .has-aspect-ratio {
      aspect-ratio: 16 / 9;
      height: auto;
    }

    .no-aspect-ratio {
      height: 40px; /* Unreserved: will jump when loaded! */
    }

    .preview-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .preview-text {
      color: #94a3b8;
      line-height: 1.6;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>Core Web Vitals Telemetry Studio</h1>
      <p>Configure CSS optimizations below to see real-time impact on Google Lighthouse scores.</p>
    </header>

    <!-- Real-time HUD -->
    <div class="hud-card">
      <div>
        <div class="hud-metric-label">LCP (Loading)</div>
        <div class="hud-metric-val score-good" id="metricLcp">1.2s</div>
      </div>
      <div>
        <div class="hud-metric-label">CLS (Visual Stability)</div>
        <div class="hud-metric-val score-good" id="metricCls">0.01</div>
      </div>
      <div>
        <div class="hud-metric-label">INP (Responsiveness)</div>
        <div class="hud-metric-val score-good" id="metricInp">48ms</div>
      </div>
      <div>
        <div class="hud-metric-label">Lighthouse Score</div>
        <div class="hud-metric-val score-good" id="metricScore">100 / 100</div>
      </div>
    </div>

    <!-- Optimization Toggles -->
    <div class="toggles-panel">
      <label class="toggle-label">
        <input type="checkbox" id="checkAspectRatio" checked>
        <span>Enable <code>aspect-ratio: 16/9</code> (Zero CLS)</span>
      </label>
      <label class="toggle-label">
        <input type="checkbox" id="checkFontSwap" checked>
        <span>Enable <code>font-display: swap</code> (Zero FOIT)</span>
      </label>
      <label class="toggle-label">
        <input type="checkbox" id="checkGpuTransforms" checked>
        <span>Use GPU Transforms only (Fast INP)</span>
      </label>
    </div>

    <!-- Simulated Card -->
    <div class="preview-card">
      <div class="aspect-box has-aspect-ratio" id="imageBox">
        🖼️
      </div>
      <h2 class="preview-title">Automated Performance Architecture</h2>
      <p class="preview-text">
        Notice how reserving image aspect ratios upfront completely prevents Cumulative Layout Shift. When the image streams across the network, the headline and text remain perfectly anchored in place.
      </p>
    </div>
  </div>

  <script>
    const checkAspectRatio = document.getElementById('checkAspectRatio');
    const checkFontSwap = document.getElementById('checkFontSwap');
    const checkGpu = document.getElementById('checkGpuTransforms');

    const imageBox = document.getElementById('imageBox');
    const metricLcp = document.getElementById('metricLcp');
    const metricCls = document.getElementById('metricCls');
    const metricInp = document.getElementById('metricInp');
    const metricScore = document.getElementById('metricScore');

    function updateScore() {
      let lcp = 1.2;
      let cls = 0.01;
      let inp = 48;
      let score = 100;

      if (!checkAspectRatio.checked) {
        imageBox.className = 'aspect-box no-aspect-ratio';
        cls += 0.38;
        score -= 28;
      } else {
        imageBox.className = 'aspect-box has-aspect-ratio';
      }

      if (!checkFontSwap.checked) {
        lcp += 1.8;
        score -= 20;
      }

      if (!checkGpu.checked) {
        inp += 220;
        score -= 18;
      }

      // Update HUD
      metricLcp.textContent = `${lcp.toFixed(1)}s`;
      metricLcp.className = `hud-metric-val ${lcp <= 2.5 ? 'score-good' : 'score-poor'}`;

      metricCls.textContent = cls.toFixed(2);
      metricCls.className = `hud-metric-val ${cls <= 0.1 ? 'score-good' : 'score-poor'}`;

      metricInp.textContent = `${inp}ms`;
      metricInp.className = `hud-metric-val ${inp <= 200 ? 'score-good' : 'score-poor'}`;

      metricScore.textContent = `${score} / 100`;
      metricScore.className = `hud-metric-val ${score >= 90 ? 'score-good' : 'score-poor'}`;
    }

    checkAspectRatio.addEventListener('change', updateScore);
    checkFontSwap.addEventListener('change', updateScore);
    checkGpu.addEventListener('change', updateScore);
  </script>
</body>
</html>
```
