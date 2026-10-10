---
id: project-2-portfolio-website-with-dark-light-theme
slug: project-2-portfolio-website-with-dark-light-theme
course: css-for-advanced
chapter: Final Projects
topic: "Project 2: Dark/Light Animated Portfolio with CSS 3D Card Interactions"
difficulty: Advanced
readingTime: 16
order: 35
keywords: ["css 3d flip card", "portfolio website css", "dark light mode portfolio", "backface-visibility hidden", "css capstone project", "advanced portfolio css"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# Project 2: Dark/Light Animated Portfolio with CSS 3D Card Interactions

Welcome to Capstone Project 2! In the hyper-competitive tech landscape, a developer's portfolio website is their primary calling card. A generic, static template signals beginner status. But an engineer whose portfolio features **seamless zero-flicker dark/light mode switching**, **fluid mathematical typography**, and **hardware-accelerated 3D flipping project cards** commands immediate attention and respect.

In this project, you will build a developer portfolio that showcases true advanced CSS mastery: **3D perspective transforms**, **`backface-visibility: hidden`**, **semantic token architecture**, and **WCAG contrast compliance**.

---

## 1. The 3D Flip Card Architecture

The highlight of this portfolio is the interactive 3D Project Card. When a visitor hovers over or clicks a project, the card smoothly pirouettes around its Y-axis in true 3D space, revealing the architectural stack and GitHub links on the back:

```
+-------------------------------------------------------------------------+
|                  THE 3D FLIP CARD STAGING ENVIRONMENT                   |
+-------------------------------------------------------------------------+

  1. Perspective Chamber:
     .card-scene { perspective: 1000px; }

  2. 3D Rotating Pivot:
     .card-inner {
       transform-style: preserve-3d;
       transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
     }
     .card-scene:hover .card-inner {
       transform: rotateY(180deg);
     }

  3. Dual Opposing Faces (backface-visibility: hidden):
     [ FRONT FACE: translateZ(0) ]
     [ BACK FACE:  rotateY(180deg) ]
```

---

## 2. Technical Milestones in this Project

1. **Persistent Dark/Light Mode:** Full semantic token system storing preferences in `localStorage` with OS sync.
2. **True 3D Card Flipping:** Leverages `perspective: 1000px`, `transform-style: preserve-3d`, and `backface-visibility: hidden`.
3. **Fluid Typography:** Scales seamlessly from 360px mobile screens to wide desktop monitors using `clamp()`.
4. **Accessible Keyboard Navigation:** Ensure cards flip on keyboard focus as well as mouse hover!

---

## 3. Do's and Don'ts for Modern Portfolios

| Practice | Do | Don't |
| :--- | :--- | :--- |
| **Card Flipping** | Declare `backface-visibility: hidden` on both front and back faces. | Forget `backface-visibility`, causing mirrored backward text to bleed through. |
| **Perspective Placement** | Place `perspective: 1000px` on the outer card wrapper. | Place perspective on the flipping element itself, distorting rotation physics. |
| **Keyboard Accessibility** | Include `:focus-within` so keyboard-only users pressing Tab can flip cards. | Depend exclusively on `:hover`, locking out keyboard and mobile users. |
| **Color Contrast** | Verify 4.5:1 text contrast on both dark and light theme surfaces. | Use light gray text on white cards or dark gray text on black cards. |

---

## 4. Quick Revision Summary

```
+-------------------------------------------------------------------------+
|                  PROJECT 2 ARCHITECTURE CHEAT SHEET                     |
+-------------------------------------------------------------------------+

  1. Card Flip Recipe:
     .scene { perspective: 1000px; }
     .inner { transform-style: preserve-3d; transition: transform 0.7s; }
     .scene:hover .inner, .scene:focus-within .inner { transform: rotateY(180deg); }
     .face { backface-visibility: hidden; position: absolute; inset: 0; }
     .face--back { transform: rotateY(180deg); }

  2. Theme System:
     :root[data-theme="dark"] { --bg-canvas: #0f172a; --text-main: #f8fafc; }
```

---

# Multiple Choice Questions

### 1. What happens if you omit `backface-visibility: hidden` from a 3D rotating card?
A. The card cannot rotate more than 45 degrees
B. When the card rotates to 180 degrees, the front face remains visible as a mirrored, backward reflection rather than showing the back face
C. The browser crashes with a WebGL memory leak
D. The element is automatically deleted from the DOM

**Answer:** B
**Explanation:** By default, browsers render the back side of elements in reverse. Setting `backface-visibility: hidden` ensures that when a face turns away from the viewer, it becomes completely transparent.

---

### 2. On which element must `perspective: 1000px` be declared to create a realistic 3D flipping card?
A. On the root `<html>` tag only
B. On the static parent wrapper container (the scene), looking at the rotating child element
C. On the text inside the button
D. Directly on the image file

**Answer:** B
**Explanation:** `perspective` belongs on the parent scene wrapper. It sets the virtual camera distance from which the child element's 3D rotation is viewed.

---

### 3. Why should `:focus-within` be combined with `:hover` when triggering 3D card flips?
A. It speeds up CSS rendering on the GPU
B. It allows keyboard users navigating with the Tab key to flip and inspect the project cards without needing a mouse
C. It enables automatic text translation
D. It prevents the page from caching

**Answer:** B
**Explanation:** `:focus-within` triggers whenever any element inside the card (such as a link or button) receives keyboard focus, making interactive 3D components 100% accessible to keyboard-only and assistive technology users.

---

### 4. What is the role of `transform-style: preserve-3d;` on the card's inner pivot container?
A. It compresses the images inside the card
B. It instructs the browser to place child elements in true shared 3D coordinates rather than flattening them into a 2D surface
C. It allows CSS to connect to a 3D printer
D. It enables audio playback

**Answer:** B
**Explanation:** Without `transform-style: preserve-3d;`, child layers are flattened into a 2D plane before rotation, destroying the spatial relationship between the front and back card faces.

---

### 5. Why should theme toggle preferences be saved in `localStorage`?
A. Because CSS files cannot be downloaded without `localStorage`
B. To preserve the user's selected dark or light mode preference across page reloads and future visits
C. To prevent search engines from crawling the site
D. To encrypt the user's browser history

**Answer:** B
**Explanation:** `localStorage` provides persistent client-side key-value storage so the user's chosen theme remains active whenever they navigate between pages or return to the site.

---

# Hands-On Practice Challenge: The Complete 3D Flip Portfolio

Explore this complete, standalone production portfolio. Test the theme toggle switch in the header, hover or click the 3D project cards, and inspect the fluid typography and responsive grid!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rohan Verma • Senior Frontend Architect</title>

  <!-- Prevent FOUT -->
  <script>
    (function() {
      const saved = localStorage.getItem('portfolio-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', saved);
    })();
  </script>

  <style>
    /* =========================================
       DESIGN TOKENS (LIGHT & DARK THEMES)
       ========================================= */
    :root, [data-theme="light"] {
      color-scheme: light;
      --bg-canvas: #f8fafc;
      --bg-surface: #ffffff;
      --bg-card-back: #f1f5f9;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-subtle: #e2e8f0;
      --accent: #4f46e5;
      --accent-glow: rgba(79, 70, 229, 0.2);
      --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    }

    [data-theme="dark"] {
      color-scheme: dark;
      --bg-canvas: #0f172a;
      --bg-surface: #1e293b;
      --bg-card-back: #020617;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border-subtle: #334155;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.25);
      --card-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
      transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-wrapper {
      width: 100%;
      max-width: 1050px;
      padding: 0 1.5rem;
    }

    /* =========================================
       STICKY BLURRED NAVIGATION
       ========================================= */
    .site-nav {
      position: sticky;
      top: 0;
      width: 100%;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(15, 23, 42, 0.1);
      border-bottom: 1px solid var(--border-subtle);
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
    }

    .brand-title {
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }

    .theme-toggle-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: var(--card-shadow);
    }

    /* =========================================
       HERO SECTION WITH FLUID TYPOGRAPHY
       ========================================= */
    .hero-section {
      padding: 4.5rem 0 3rem;
      text-align: center;
    }

    .hero-badge {
      display: inline-block;
      background: var(--accent-glow);
      color: var(--accent);
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-size: clamp(2rem, 1.2rem + 3.5vw, 3.8rem);
      line-height: 1.15;
      font-weight: 900;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      color: var(--text-muted);
      font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* =========================================
       3D CARD GRID ARCHITECTURE
       ========================================= */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }

    /* 1. Perspective Chamber */
    .card-scene {
      perspective: 1000px;
      height: 380px;
    }

    /* 2. 3D Rotating Pivot Container */
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }

    /* Flip trigger on hover and keyboard focus */
    .card-scene:hover .card-inner,
    .card-scene:focus-within .card-inner,
    .card-inner.is-flipped {
      transform: rotateY(180deg);
    }

    /* 3. Front and Back Faces */
    .card-face {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 1.25rem;
      padding: 2rem;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* FRONT FACE */
    .card-face--front {
      background: var(--bg-surface);
    }

    .card-icon-box {
      width: 54px;
      height: 54px;
      border-radius: 1rem;
      background: var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }

    .card-heading {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .card-summary {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .flip-hint {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* BACK FACE (Rotated 180deg initially) */
    .card-face--back {
      background: var(--bg-card-back);
      transform: rotateY(180deg);
      border-color: var(--accent);
    }

    .back-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--accent);
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tech-tag {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .back-btn {
      background: var(--accent);
      color: #ffffff;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      text-align: center;
      font-weight: 600;
      font-size: 0.9rem;
      margin-top: auto;
    }
  </style>
</head>
<body>

  <!-- Sticky Navbar -->
  <nav class="site-nav">
    <div class="brand-title">ROHAN.DEV</div>
    <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle Theme">
      <span id="themeEmoji">🌙</span>
      <span id="themeStatus">Dark</span>
    </button>
  </nav>

  <div class="page-wrapper">
    <!-- Hero Banner -->
    <header class="hero-section">
      <div class="hero-badge">Principal Frontend Architect</div>
      <h1 class="hero-title">Crafting Resilient, Fluid Digital Interfaces</h1>
      <p class="hero-subtitle">
        Specializing in CSS Cascade Layers, Container Queries, GPU-accelerated 3D motion, and enterprise token design systems.
      </p>
    </header>

    <!-- 3D Interactive Projects Grid -->
    <section class="projects-grid">
      <!-- Project 1 -->
      <div class="card-scene" tabindex="0">
        <div class="card-inner">
          <!-- Front -->
          <div class="card-face card-face--front">
            <div>
              <div class="card-icon-box">📊</div>
              <h2 class="card-heading">Enterprise Analytics UI</h2>
              <p class="card-summary">
                Micro-frontend dashboard powered by CSS Grid and Container Queries for self-responsive widget orchestration.
              </p>
            </div>
            <div class="flip-hint">Hover or Focus to Flip ↺</div>
          </div>

          <!-- Back -->
          <div class="card-face card-face--back">
            <div>
              <h3 class="back-title">Architecture Specs</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                Engineered with strict BEM naming, subgrid track alignment, and 100% WCAG AAA contrast ratio tokens.
              </p>
              <div class="tech-tags">
                <span class="tech-tag">CSS Grid</span>
                <span class="tech-tag">@container</span>
                <span class="tech-tag">Design Tokens</span>
                <span class="tech-tag">PostCSS</span>
              </div>
            </div>
            <a href="#github" class="back-btn">View GitHub Repository</a>
          </div>
        </div>
      </div>

      <!-- Project 2 -->
      <div class="card-scene" tabindex="0">
        <div class="card-inner">
          <!-- Front -->
          <div class="card-face card-face--front">
            <div>
              <div class="card-icon-box">⚡</div>
              <h2 class="card-heading">CSS 3D Parallax Engine</h2>
              <p class="card-summary">
                Hardware-accelerated optical depth engine built with pure CSS 3D perspective and zero JavaScript scroll listeners.
              </p>
            </div>
            <div class="flip-hint">Hover or Focus to Flip ↺</div>
          </div>

          <!-- Back -->
          <div class="card-face card-face--back">
            <div>
              <h3 class="back-title">Architecture Specs</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                Maintains a rock-solid 120 FPS frame rate on mobile Safari with full prefers-reduced-motion accessibility fallbacks.
              </p>
              <div class="tech-tags">
                <span class="tech-tag">3D Transforms</span>
                <span class="tech-tag">translateZ</span>
                <span class="tech-tag">WCAG 2.3.3</span>
                <span class="tech-tag">GPU Compositor</span>
              </div>
            </div>
            <a href="#github" class="back-btn">View Case Study</a>
          </div>
        </div>
      </div>

      <!-- Project 3 -->
      <div class="card-scene" tabindex="0">
        <div class="card-inner">
          <!-- Front -->
          <div class="card-face card-face--front">
            <div>
              <div class="card-icon-box">🎨</div>
              <h2 class="card-heading">Design Token Compiler</h2>
              <p class="card-summary">
                Automated SCSS 7-1 token generator that compiles HSL channels into cross-platform web and mobile themes.
              </p>
            </div>
            <div class="flip-hint">Hover or Focus to Flip ↺</div>
          </div>

          <!-- Back -->
          <div class="card-face card-face--back">
            <div>
              <h3 class="back-title">Architecture Specs</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                Includes Stylelint rulesets, automated dead code pruning, and Brotli-compressed production bundles.
              </p>
              <div class="tech-tags">
                <span class="tech-tag">SCSS 7-1</span>
                <span class="tech-tag">PurgeCSS</span>
                <span class="tech-tag">cssnano</span>
                <span class="tech-tag">Stylelint</span>
              </div>
            </div>
            <a href="#github" class="back-btn">Inspect Token Library</a>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeEmoji = document.getElementById('themeEmoji');
    const themeStatus = document.getElementById('themeStatus');

    function syncTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      if (theme === 'dark') {
        themeEmoji.textContent = '🌙';
        themeStatus.textContent = 'Dark';
      } else {
        themeEmoji.textContent = '☀️';
        themeStatus.textContent = 'Light';
      }
    }

    // Initialize state
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    syncTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      syncTheme(next);
    });

    // Mobile tap support for 3D flip cards
    const cardInners = document.querySelectorAll('.card-inner');
    cardInners.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
    });
  </script>
</body>
</html>
```
