---
id: project-1-responsive-landing-page-with-flexbox
slug: project-1-responsive-landing-page-with-flexbox
course: css-for-intermediate
chapter: Intermediate Projects
topic: "Project 1: Responsive Landing Page with Flexbox"
difficulty: Intermediate
readingTime: 16
order: 34
keywords: ["css project", "responsive landing page", "flexbox layout", "flexbox project", "css intermediate project"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# Project 1: Responsive Landing Page with Flexbox

Welcome to your first major capstone project in Intermediate CSS! Throughout the earlier chapters, you learned about Flexbox containers, alignment properties, custom CSS variables, and media queries. Now, it is time to assemble these concepts into a production-grade, commercial-quality website.

In this project, we will design and code a complete **Educational Coaching Academy Landing Page** ("Apex Academy"). The entire layout—from the sticky navigation header to the hero banner, features cards, statistics ribbon, and footer—is powered purely by modern Flexbox and CSS variables.

---

## 1. Project Blueprint and Wireframe

Before typing CSS, professional developers examine the visual wireframe to identify how containers split along main axes and cross axes across desktop and mobile screens:

```
+-------------------------------------------------------------------------+
|                  DESKTOP FLEXBOX LAYOUT (min-width: 768px)              |
+-------------------------------------------------------------------------+

  [HEADER] (display: flex; justify-content: space-between; align-items: center)
  +-----------------------------------------------------------------------+
  | [LOGO]                [Home] [Courses] [Faculty] [Results]    [ENROLL]|
  +-----------------------------------------------------------------------+

  [HERO SECTION] (display: flex; align-items: center; gap: 40px)
  +-----------------------------------+-----------------------------------+
  | LEFT COLUMN:                      | RIGHT COLUMN:                     |
  |  - High-impact Headline           |  - Visual Hero Card / Image       |
  |  - Descriptive Paragraph          |  - Floating Experience Badge      |
  |  - Flex CTA Buttons Container     |                                   |
  +-----------------------------------+-----------------------------------+

  [STATS RIBBON] (display: flex; justify-content: space-around; gap: 20px)
  +-----------------+-----------------+-----------------+-----------------+
  | 15,000+ Alumni  | 98.4% Top Ranks | 50+ Top Mentors | 4.9/5 Rating    |
  +-----------------+-----------------+-----------------+-----------------+

  [3-CARD FEATURES] (display: flex; flex-wrap: wrap; gap: 24px)
  +---------------------+ +---------------------+ +---------------------+
  | Card 1 (flex: 1 1)  | | Card 2 (flex: 1 1)  | | Card 3 (flex: 1 1)  |
  +---------------------+ +---------------------+ +---------------------+

+-------------------------------------------------------------------------+
|                  MOBILE RESPONSIVE COLLAPSE (max-width: 767px)          |
+-------------------------------------------------------------------------+

  - Header navigation stacks or wraps cleanly.
  - Hero section flips direction: flex-direction: column-reverse or column.
  - 3-Card features wrap automatically to 100% width via flex-basis: 100%.
  - Stats ribbon wraps into a 2x2 cluster.
```

---

## 2. Core Concepts Reinforced in this Project

1. **Global Design Tokens (`:root`)**: Centralizing theme colors, typography fonts, and border radii so changing a brand color takes 2 seconds.
2. **Sticky Flex Navigation**: Using `position: sticky`, `top: 0`, and `backdrop-filter` for modern frosted glass navigation.
3. **Equal-Height Flex Cards**: Utilizing `align-items: stretch` so all feature cards match height automatically regardless of text length.
4. **Flexible Responsive Wrapping**: Combining `flex-wrap: wrap` with `flex: 1 1 280px` to create fluid columns that adapt to any screen width without hardcoded pixel widths.
5. **Fluid Button Groups**: Laying out primary and secondary action buttons using a nested flex container.

---

## 3. Step-by-Step Architecture Breakdown

### Step 1: Design Tokens & Base Setup
We establish CSS variables for our brand color palette (deep slate blue, vibrant emerald green accents, and neutral background tones):

```css
:root {
  --primary: #1e3a8a;
  --primary-hover: #1d4ed8;
  --accent: #10b981;
  --accent-light: #d1fae5;
  --text-dark: #0f172a;
  --text-muted: #475569;
  --bg-canvas: #f8fafc;
  --bg-card: #ffffff;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 16px 32px -4px rgba(15, 23, 42, 0.1);
  --transition-fast: 0.25s ease;
}
```

### Step 2: The Navigation Bar (Space-Between Flex)
The brand logo sits on the far left, links in the center, and the call-to-action button on the far right using `justify-content: space-between`:

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 5%;
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
}
```

### Step 3: Two-Column Hero Split
On desktop monitors, text and image sit side-by-side. When the screen drops below `768px`, media queries switch the hero container to `flex-direction: column`:

```css
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 60px 5%;
}

.hero-content {
  flex: 1 1 500px;
}

.hero-visual {
  flex: 1 1 420px;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 5%;
  }
}
```

### Step 4: The 3-Column Feature Cards Deck
Instead of writing complex math, we use `flex: 1 1 280px`. On desktops, three cards sit on a single row. On mid-size tablets, two cards sit on row 1, and the third stretches across row 2. On phones, each card occupies 100% width!

```css
.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.feature-card {
  flex: 1 1 280px;
  background: var(--bg-card);
  padding: 32px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}
```

---

## 4. Complete, Runnable Project Code

Here is the entire standalone HTML and CSS file. You can save this as `index.html` and open it directly in any browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Academy - Premier Coaching Institute</title>
  <style>
    /* ==========================================================================
       1. CSS VARIABLES & SYSTEM RESETS
       ========================================================================== */
    :root {
      --primary: #1e3a8a;
      --primary-dark: #172554;
      --accent: #059669;
      --accent-light: #ecfdf5;
      --text-main: #0f172a;
      --text-muted: #475569;
      --bg-page: #f8fafc;
      --bg-card: #ffffff;
      --border-subtle: #e2e8f0;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 24px;
      --shadow-soft: 0 4px 12px rgba(15, 23, 42, 0.05);
      --shadow-hover: 0 20px 30px -10px rgba(30, 58, 138, 0.15);
      --speed-normal: 0.3s ease;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
    }

    /* ==========================================================================
       2. STICKY FLEXBOX NAVIGATION
       ========================================================================== */
    .header-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 6%;
      background: rgba(255, 255, 255, 0.9);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
    }

    .brand-logo .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 900;
    }

    .nav-menu {
      display: flex;
      gap: 28px;
      list-style: none;
    }

    .nav-menu a {
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.95rem;
      transition: color var(--speed-normal);
    }

    .nav-menu a:hover {
      color: var(--primary);
    }

    .btn-primary {
      padding: 10px 22px;
      background: var(--primary);
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: background var(--speed-normal), transform var(--speed-normal);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }

    /* ==========================================================================
       3. HERO SECTION (2-COLUMN FLEX)
       ========================================================================== */
    .hero-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 50px;
      padding: 70px 6% 50px;
      max-width: 1280px;
      margin: 0 auto;
    }

    .hero-info {
      flex: 1 1 520px;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      background: var(--accent-light);
      color: var(--accent);
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: clamp(2.2rem, 4vw, 3.4rem);
      font-weight: 800;
      line-height: 1.2;
      color: var(--primary-dark);
      margin-bottom: 18px;
    }

    .hero-title span {
      color: var(--accent);
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 32px;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-secondary {
      padding: 10px 22px;
      background: #ffffff;
      color: var(--text-main);
      font-weight: 600;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-decoration: none;
      transition: border-color var(--speed-normal), background var(--speed-normal);
    }

    .btn-secondary:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .hero-graphic {
      flex: 1 1 450px;
      position: relative;
    }

    .hero-graphic img {
      width: 100%;
      height: 380px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-hover);
    }

    .floating-stats-card {
      position: absolute;
      bottom: -20px;
      left: 30px;
      background: #ffffff;
      padding: 16px 24px;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .stats-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent-light);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
    }

    /* ==========================================================================
       4. STATS RIBBON (FLEX HORIZONTAL DISTRIBUTION)
       ========================================================================== */
    .stats-ribbon {
      max-width: 1280px;
      margin: 40px auto 70px;
      padding: 0 6%;
    }

    .stats-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
      background: #ffffff;
      padding: 30px 20px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--border-subtle);
    }

    .stat-item {
      text-align: center;
      flex: 1 1 160px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* ==========================================================================
       5. FEATURES SECTION (3-CARD FLEX DECK)
       ========================================================================== */
    .section-container {
      max-width: 1280px;
      margin: 0 auto 80px;
      padding: 0 6%;
    }

    .section-header {
      text-align: center;
      margin-bottom: 44px;
    }

    .section-header h2 {
      font-size: 2.2rem;
      color: var(--primary-dark);
      margin-bottom: 12px;
    }

    .section-header p {
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }

    .cards-deck {
      display: flex;
      flex-wrap: wrap;
      gap: 28px;
    }

    .card {
      flex: 1 1 300px;
      background: var(--bg-card);
      padding: 36px 28px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform var(--speed-normal), box-shadow var(--speed-normal);
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-hover);
    }

    .card-icon-box {
      width: 50px;
      height: 50px;
      border-radius: var(--radius-sm);
      background: var(--accent-light);
      color: var(--accent);
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .card h3 {
      font-size: 1.3rem;
      color: var(--primary-dark);
      margin-bottom: 12px;
    }

    .card p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 24px;
      flex-grow: 1;
    }

    .card-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .card-link:hover {
      text-decoration: underline;
    }

    /* ==========================================================================
       6. FOOTER
       ========================================================================== */
    .site-footer {
      background: var(--primary-dark);
      color: #cbd5e1;
      padding: 40px 6%;
      text-align: center;
      border-top: 1px solid #1e293b;
    }

    /* ==========================================================================
       7. RESPONSIVE MEDIA QUERIES
       ========================================================================== */
    @media (max-width: 880px) {
      .hero-container {
        flex-direction: column;
        text-align: center;
        padding-top: 40px;
      }

      .hero-subtitle {
        margin: 0 auto 32px;
      }

      .hero-actions {
        justify-content: center;
      }

      .floating-stats-card {
        left: 50%;
        transform: translateX(-50%);
        width: 85%;
        justify-content: center;
      }
    }

    @media (max-width: 640px) {
      .header-nav {
        flex-direction: column;
        gap: 16px;
      }

      .nav-menu {
        gap: 18px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .hero-title {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>

  <!-- 1. STICKY FLEX NAVBAR -->
  <header class="header-nav">
    <a href="#" class="brand-logo">
      <div class="logo-icon">A</div>
      Apex Academy
    </a>

    <ul class="nav-menu">
      <li><a href="#about">About</a></li>
      <li><a href="#courses">Courses</a></li>
      <li><a href="#mentors">Mentors</a></li>
      <li><a href="#results">Results</a></li>
    </ul>

    <a href="#enroll" class="btn-primary">Enroll Now</a>
  </header>

  <!-- 2. HERO SECTION -->
  <main>
    <section class="hero-container">
      <div class="hero-info">
        <div class="pill-badge">
          <span>&#9733;</span> Admissions Open for 2026-27
        </div>
        <h1 class="hero-title">Empowering Future <span>Olympiad & IIT</span> Champions</h1>
        <p class="hero-subtitle">Comprehensive coaching for CBSE, ICSE, JEE, and NEET with personalized mentor sessions and weekly assessment diagnostics.</p>
        <div class="hero-actions">
          <a href="#register" class="btn-primary">Book Free Trial Class</a>
          <a href="#syllabus" class="btn-secondary">Download Syllabus</a>
        </div>
      </div>

      <div class="hero-graphic">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
          alt="Students learning together in modern classroom"
        >
        <div class="floating-stats-card">
          <div class="stats-circle">&#10003;</div>
          <div>
            <strong>100% Concept Mastery</strong>
            <p style="font-size: 0.8rem; color: #64748b;">Adaptive AI Tests Included</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. STATS RIBBON -->
    <section class="stats-ribbon">
      <div class="stats-inner">
        <div class="stat-item">
          <div class="stat-number">15,000+</div>
          <div class="stat-label">Successful Students</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">99.2%</div>
          <div class="stat-label">Board Exam Pass Rate</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">45+</div>
          <div class="stat-label">IIT-JEE Top 500 Ranks</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">4.9 / 5</div>
          <div class="stat-label">Parent Satisfaction Score</div>
        </div>
      </div>
    </section>

    <!-- 4. 3-CARD FEATURES DECK -->
    <section class="section-container" id="courses">
      <div class="section-header">
        <h2>Why Parents & Students Choose Us</h2>
        <p>Proven educational pedagogy paired with interactive problem-solving workshops designed for Indian competitive examinations.</p>
      </div>

      <div class="cards-deck">
        <div class="card">
          <div>
            <div class="card-icon-box">&#9881;</div>
            <h3>Conceptual Foundation</h3>
            <p>We eliminate rote memorization. Every science and math theorem is demystified through hands-on lab experiments and real-life models.</p>
          </div>
          <a href="#" class="card-link">Learn about pedagogy &rarr;</a>
        </div>

        <div class="card">
          <div>
            <div class="card-icon-box">&#9783;</div>
            <h3>1-on-1 Doubt Resolution</h3>
            <p>Never get stuck on difficult questions. Our certified faculty conducts daily post-class doubt-clearing sessions both offline and online.</p>
          </div>
          <a href="#" class="card-link">Meet our mentors &rarr;</a>
        </div>

        <div class="card">
          <div>
            <div class="card-icon-box">&#128200;</div>
            <h3>Diagnostic Analytics</h3>
            <p>Receive detailed weekly performance graphs highlighting strengths, time spent per MCQ, and pinpointed improvement areas.</p>
          </div>
          <a href="#" class="card-link">View sample report &rarr;</a>
        </div>
      </div>
    </section>
  </main>

  <!-- 5. SITE FOOTER -->
  <footer class="site-footer">
    <p>&copy; 2026 Apex Academy Educational Trust. Designed with Modern CSS Flexbox. All rights reserved.</p>
  </footer>

</body>
</html>
```

---

## 5. Do's and Don'ts

| Practice | Bad Approach | Good Approach | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Card Column Sizing** | Hardcoding fixed widths like `width: 350px;` | Using `flex: 1 1 280px;` | Fixed widths overflow on small mobile screens; flexible bases adapt fluidly. |
| **Navbar Alignment** | Using `float: left` and manual margins for menu links | Using `display: flex; justify-content: space-between;` | Flexbox distributes spacing automatically without fragile clearfixes. |
| **Card Content Stretch** | Letting cards become different heights when description text varies | Using default `align-items: stretch` on the flex deck and `display: flex; flex-direction: column` inside the card | Produces a clean, cohesive visual baseline across all cards. |
| **Theme Consistency** | Hardcoding `#1e3a8a` across 40 separate lines of CSS | Storing the primary color in `--primary` under `:root` | Enables global theme adjustments in one centralized place. |

---

## 6. Quick Revision Summary Cheat Sheet

- **Sticky Navigation**: `position: sticky; top: 0;` paired with `backdrop-filter: blur(10px);` produces modern frosted headers.
- **Hero Stacking**: Change `flex-direction: row` to `flex-direction: column` inside media queries for effortless mobile adaptations.
- **Multi-Card Wrap**: Set `display: flex; flex-wrap: wrap; gap: 24px;` on the parent and `flex: 1 1 280px;` on each card for automatic multi-device grids.
- **Nested Flex Containers**: Use inner flex columns (`flex-direction: column; justify-content: space-between;`) to push card action buttons neatly to the bottom edge.

---

# Multiple Choice Questions

### 1. In the 3-card features deck, what is the effect of setting `flex: 1 1 280px` on each card inside a container with `flex-wrap: wrap`?
A. The cards will be strictly locked to 280px width regardless of screen size
B. The cards start with a base width of 280px, can grow equally to fill extra space, and can wrap onto new rows when space shrinks
C. Only the first card will grow while the other two will hide
D. The browser ignores the width and centers the cards vertically
**Answer:** B
**Explanation:** `flex: 1 1 280px` sets `flex-grow: 1`, `flex-shrink: 1`, and `flex-basis: 280px`. Combined with `flex-wrap: wrap`, cards automatically adapt to the screen width and wrap onto new lines when necessary.

---

### 2. Which Flexbox property on the navigation bar keeps the brand logo on the left and the CTA button on the right?
A. align-items: stretch
B. justify-content: space-between
C. flex-direction: column
D. justify-content: center
**Answer:** B
**Explanation:** `justify-content: space-between` distributes remaining space between child items along the main axis, placing the first item at the start edge and the last item at the end edge.

---

### 3. How does the hero section transition from a side-by-side desktop layout to a stacked mobile layout?
A. By applying `display: none` to the image
B. By switching `flex-direction: row` to `flex-direction: column` inside a media query
C. By changing `position: absolute` to `position: static`
D. By setting `z-index: -1`
**Answer:** B
**Explanation:** Switching `flex-direction` to `column` changes the main axis from horizontal to vertical, naturally stacking the text content and hero graphic.

---

### 4. Why is `backdrop-filter: blur(10px)` paired with a translucent background like `rgba(255, 255, 255, 0.9)` on the sticky header?
A. To prevent links from being clickable
B. To create a modern frosted glass effect where page content blurs softly as it scrolls behind the header
C. To force the browser to enable 3D hardware acceleration
D. To disable text selection on mobile devices
**Answer:** B
**Explanation:** When the page scrolls underneath a sticky header, the translucent background combined with `backdrop-filter` creates a frosted glass effect that keeps the navigation readable.

---

### 5. Why should design variables like `--primary` and `--radius-md` be declared inside the `:root` selector?
A. Because `:root` applies styles only to mobile screens
B. Because `:root` corresponds to the top-level HTML document, allowing all child elements to inherit the variables
C. Because variables declared in `:root` do not consume memory
D. Because `:root` disables user agent stylesheet overrides
**Answer:** B
**Explanation:** `:root` represents the root `<html>` element, providing global scope so any CSS selector throughout the entire stylesheet can access those custom properties.

---

# Hands-on Practice Challenge

Enhance the Apex Academy landing page by adding a responsive FAQ accordion preview section using pure CSS Flexbox.

### Requirements:
1. Create a section titled "Frequently Asked Questions" with a container max-width of `900px`.
2. Build 3 FAQ question-and-answer rows using `display: flex; flex-direction: column; gap: 16px;`.
3. Each FAQ card must have an inner header flexbox row (`display: flex; justify-content: space-between; align-items: center;`) with the question on the left and a circular plus icon on the right.
4. Add smooth hover elevation with a subtle border highlight.

### Complete Solution:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Academy FAQ Challenge</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: #f1f5f9;
      padding: 40px 20px;
    }

    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-title {
      text-align: center;
      color: #1e3a8a;
      font-size: 2rem;
      margin-bottom: 30px;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .faq-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .faq-item:hover {
      transform: translateY(-2px);
      border-color: #3b82f6;
      box-shadow: 0 8px 18px rgba(59, 130, 246, 0.1);
    }

    .faq-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .faq-question {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
    }

    .faq-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
    }

    .faq-answer {
      margin-top: 12px;
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.5;
    }
  </style>
</head>
<body>

  <div class="faq-container">
    <h2 class="faq-title">Frequently Asked Questions</h2>

    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-header">
          <div class="faq-question">What is the student-to-mentor ratio at Apex Academy?</div>
          <div class="faq-icon">+</div>
        </div>
        <p class="faq-answer">We strictly cap batches at 25 students per class to ensure personalized doubt resolution and targeted homework feedback for every student.</p>
      </div>

      <div class="faq-item">
        <div class="faq-header">
          <div class="faq-question">Are trial classes free of cost?</div>
          <div class="faq-icon">+</div>
        </div>
        <p class="faq-answer">Yes! Every newly registered student receives 2 full days of complimentary trial classes across Mathematics, Physics, and Chemistry.</p>
      </div>

      <div class="faq-item">
        <div class="faq-header">
          <div class="faq-question">Do you offer weekend scholarship entrance tests?</div>
          <div class="faq-icon">+</div>
        </div>
        <p class="faq-answer">Yes, our Apex Talent Search Exam (ATSE) is conducted every alternate Sunday, offering up to 100% tuition scholarship fee waivers.</p>
      </div>
    </div>
  </div>

</body>
</html>
```
