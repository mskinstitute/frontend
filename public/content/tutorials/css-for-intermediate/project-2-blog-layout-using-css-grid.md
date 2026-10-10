---
id: project-2-blog-layout-using-css-grid
slug: project-2-blog-layout-using-css-grid
course: css-for-intermediate
chapter: Intermediate Projects
topic: "Project 2: Blog Layout using CSS Grid"
difficulty: Intermediate
readingTime: 16
order: 35
keywords: ["css grid project", "blog layout grid", "css grid template areas", "responsive magazine grid", "intermediate css project"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# Project 2: Blog Layout using CSS Grid

Think of your school's printed annual magazine or a national Indian science journal (*Vigyan Patrika*). On page 1, there isn't just a boring single list of paragraphs. Instead, you see a masterfully composed two-dimensional editorial spread: a large, striking **Featured Article** commanding the top-left, a pair of secondary stories stacked on the right, and an editorial sidebar with author notes running down the side.

While Flexbox is the undisputed champion of one-dimensional distribution (laying out items along a single row or column), **CSS Grid** is the ultimate power tool for two-dimensional magazine layouts. In this project, we will build a responsive, modern **Educational Science Journal Blog Layout** purely using CSS Grid.

---

## 1. Editorial Magazine Wireframe and Grid Architecture

Here is the architectural blueprint for our science journal magazine page:

```
+-------------------------------------------------------------------------+
|                  DESKTOP EDITORIAL GRID (min-width: 992px)              |
+-------------------------------------------------------------------------+

  [HEADER] The Indian Science & Tech Chronicle (School Edition)
  +-----------------------------------------------------------------------+

  [MAIN GRID CONTAINER: 3 Columns (2fr 1fr 1fr) or Template Areas]
  +-----------------------------------+-----------------+-----------------+
  | FEATURED HERO ARTICLE             | SECONDARY #1    | SIDEBAR         |
  | (grid-column: span 2;             |                 | (grid-row: 1/4; |
  |  grid-row: span 2;)               +-----------------+  sticky top)    |
  |                                   | SECONDARY #2    |                 |
  |  - Full bleed thumbnail           |                 |  - Editor Note  |
  |  - Category Tag (ISRO Mission)    +-----------------+  - Trending Tags|
  |  - Lead Title & Summary           | SECONDARY #3    |  - Newsletter   |
  |                                   |                 |                 |
  +-----------------------------------+-----------------+-----------------+

  [RECENT DISPATCHES: repeat(auto-fill, minmax(280px, 1fr))]
  +---------------------+ +---------------------+ +---------------------+
  | Article Card 1      | | Article Card 2      | | Article Card 3      |
  +---------------------+ +---------------------+ +---------------------+

+-------------------------------------------------------------------------+
|                  MOBILE RESPONSIVE COLLAPSE (max-width: 767px)          |
+-------------------------------------------------------------------------+

  - Every article reverts to a natural single-column stream (1fr).
  - Featured article spans 1 column.
  - Sidebar moves below the primary articles feed.
```

---

## 2. Key CSS Grid Techniques Showcased

1. **Cell Spanning with `grid-column` and `grid-row`**: Making the lead article twice as wide and twice as tall as ordinary story cards.
2. **Fractional Units & Gaps**: Combining `grid-template-columns: 2fr 1fr 1fr` with `gap: 24px` for mathematical layout precision without margin hacks.
3. **Sticky Editorial Sidebar**: Using `position: sticky; top: 24px` inside a grid column so the editor's widget remains visible as readers scroll.
4. **Auto-Responsive Recent Posts Grid**: Using `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` to render subsequent cards without needing individual media queries.
5. **Overlay Card Art**: Using CSS Grid inside the featured card itself to overlay high-contrast title typography directly onto dark gradient image covers.

---

## 3. Step-by-Step Layout Construction

### Step 1: The Multi-Column Editorial Showcase
On desktop screens, our magazine hero section is divided into 3 distinct column tracks:
- Track 1 & 2 (`span 2`): The grand featured story.
- Track 3: Secondary quick-read stories.
- Track 4 / Beside: The sticky author and category sidebar.

```css
.magazine-grid {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr;
  gap: 24px;
  align-items: start;
}
```

### Step 2: Spanning the Featured Lead Card
We instruct the `.featured-post` element to span 2 rows vertically so it balances nicely against multiple secondary cards stacked beside it:

```css
.featured-post {
  grid-column: 1 / 2;
  grid-row: 1 / 3; /* Spans 2 rows downwards */
  position: relative;
  min-height: 440px;
  border-radius: 16px;
  overflow: hidden;
}
```

### Step 3: Sticky Editorial Aside
Inside a CSS Grid container, grid items do not collapse when scrolled if their track height accommodates them. By setting `align-self: start` and `position: sticky`, our sidebar glides alongside long article content:

```css
.editorial-sidebar {
  grid-column: 3 / 4;
  position: sticky;
  top: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
```

### Step 4: Responsive Breakpoint Strategy
At tablet widths (`max-width: 991px`), the sidebar drops below the stories. At mobile widths (`max-width: 640px`), all spanning rules reset to single-column streams:

```css
@media (max-width: 991px) {
  .magazine-grid {
    grid-template-columns: 1fr 1fr;
  }
  .featured-post {
    grid-column: 1 / -1; /* Spans full width of the 2 columns */
    grid-row: auto;
  }
  .editorial-sidebar {
    grid-column: 1 / -1;
    position: static;
  }
}

@media (max-width: 640px) {
  .magazine-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. Complete, Runnable Project Code

Here is the complete, self-contained HTML and CSS code. Save it as `blog.html` and preview it in your browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vigyan Chronicle - Student Science & Tech Journal</title>
  <style>
    /* ==========================================================================
       1. VARIABLES & RESET
       ========================================================================== */
    :root {
      --primary: #0f172a;
      --accent: #2563eb;
      --accent-warm: #f97316;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --bg-canvas: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 12px 24px -6px rgba(15, 23, 42, 0.08);
      --transition: 0.3s ease;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-dark);
      line-height: 1.6;
      padding: 0 0 60px 0;
    }

    /* ==========================================================================
       2. EDITORIAL MASTHEAD HEADER
       ========================================================================== */
    .masthead {
      border-bottom: 2px solid var(--primary);
      padding: 24px 6%;
      background: #ffffff;
      margin-bottom: 36px;
    }

    .masthead-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
    }

    .publication-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: var(--primary);
      text-transform: uppercase;
    }

    .publication-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .date-tag {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ==========================================================================
       3. MAIN MAGAZINE EDITORIAL GRID
       ========================================================================== */
    .journal-wrapper {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 6%;
    }

    .magazine-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1fr;
      gap: 28px;
      align-items: start;
      margin-bottom: 50px;
    }

    /* --- Featured Hero Post (Spanning 2 rows) --- */
    .featured-post {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      min-height: 480px;
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background: #000;
    }

    .featured-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.75;
      transition: transform 0.5s ease, opacity 0.5s ease;
    }

    .featured-post:hover .featured-img {
      transform: scale(1.03);
      opacity: 0.65;
    }

    .featured-content {
      position: relative;
      z-index: 10;
      padding: 36px 30px;
      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
      color: #ffffff;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: var(--accent);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .category-badge.warm {
      background: var(--accent-warm);
    }

    .featured-title {
      font-size: 1.8rem;
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 12px;
    }

    .featured-snippet {
      font-size: 0.95rem;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 16px;
      max-width: 90%;
    }

    .meta-byline {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
    }

    /* --- Secondary Stacked Stories Column --- */
    .secondary-column {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .story-card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition), box-shadow var(--transition);
      display: flex;
      flex-direction: column;
    }

    .story-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .story-thumb {
      width: 100%;
      height: 140px;
      object-fit: cover;
    }

    .story-body {
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .story-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary);
      margin: 8px 0;
      line-height: 1.35;
    }

    .story-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 14px;
      flex-grow: 1;
    }

    /* --- Sticky Editorial Sidebar --- */
    .editorial-sidebar {
      grid-column: 3 / 4;
      grid-row: 1 / 3;
      position: sticky;
      top: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .sidebar-widget {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .widget-title {
      font-size: 1rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 8px;
    }

    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .topic-tag {
      padding: 6px 12px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #334155;
      text-decoration: none;
      transition: background var(--transition), color var(--transition);
    }

    .topic-tag:hover {
      background: var(--accent);
      color: #ffffff;
    }

    .newsletter-box p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .newsletter-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      margin-bottom: 10px;
      font-size: 0.9rem;
    }

    .newsletter-btn {
      width: 100%;
      padding: 10px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background var(--transition);
    }

    .newsletter-btn:hover {
      background: var(--accent);
    }

    /* ==========================================================================
       4. RECENT ARTICLES (AUTO-FIT GRID)
       ========================================================================== */
    .section-divider {
      margin: 40px 0 24px;
      border-top: 2px solid var(--border-color);
      padding-top: 20px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 20px;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    /* ==========================================================================
       5. RESPONSIVE MEDIA QUERIES
       ========================================================================== */
    @media (max-width: 1024px) {
      .magazine-grid {
        grid-template-columns: 1.6fr 1fr;
      }
      .featured-post {
        grid-column: 1 / 3;
        grid-row: auto;
      }
      .secondary-column {
        grid-column: 1 / 2;
        grid-row: auto;
      }
      .editorial-sidebar {
        grid-column: 2 / 3;
        grid-row: auto;
        position: static;
      }
    }

    @media (max-width: 720px) {
      .magazine-grid {
        grid-template-columns: 1fr;
      }
      .featured-post,
      .secondary-column,
      .editorial-sidebar {
        grid-column: 1 / -1;
      }
      .featured-title {
        font-size: 1.4rem;
      }
      .masthead-inner {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>

  <!-- 1. MASTHEAD HEADER -->
  <header class="masthead">
    <div class="masthead-inner">
      <div>
        <h1 class="publication-title">Vigyan Chronicle</h1>
        <p class="publication-subtitle">Journal of High School Scientific Research & Innovation</p>
      </div>
      <div class="date-tag">Issue No. 42 &bull; New Delhi Edition</div>
    </div>
  </header>

  <main class="journal-wrapper">
    <!-- 2. EDITORIAL 3-COLUMN GRID -->
    <section class="magazine-grid">

      <!-- FEATURED LEAD ARTICLE (Spans 2 rows on desktop) -->
      <article class="featured-post">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80" 
          alt="Satellite in Earth Orbit" 
          class="featured-img"
        >
        <div class="featured-content">
          <span class="category-badge">Space Exploration</span>
          <h2 class="featured-title">ISRO Next-Gen Satellite Propulsion: How High School Labs Are Contributing</h2>
          <p class="featured-snippet">New lightweight ion thrusters developed with carbon composite materials promise to extend orbital lifetime for indigenous communication satellites by 15 years.</p>
          <div class="meta-byline">By Dr. Sunita Krishnan &bull; 6 min read</div>
        </div>
      </article>

      <!-- SECONDARY STORIES (Stacked in column 2) -->
      <div class="secondary-column">
        <article class="story-card">
          <img 
            src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=80" 
            alt="Robotics Arm" 
            class="story-thumb"
          >
          <div class="story-body">
            <span class="category-badge warm">Robotics</span>
            <h3 class="story-title">Affordable Robotic Prosthetics Built via 3D Printing</h3>
            <p class="story-desc">Class 11 inventors in Bengaluru unveil an EMG sensor-driven prosthetic arm costing under Rs 3,500.</p>
            <div class="meta-byline">By Raghavendra Rao &bull; 4 min read</div>
          </div>
        </article>

        <article class="story-card">
          <img 
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=80" 
            alt="Chemistry Laboratory" 
            class="story-thumb"
          >
          <div class="story-body">
            <span class="category-badge">Bio-Science</span>
            <h3 class="story-title">Enzymatic Breakdown of Microplastics in River Basins</h3>
            <p class="story-desc">Testing cold-water bacterial cultures to safely decontaminate freshwater drinking reservoirs.</p>
            <div class="meta-byline">By Ananya Sen &bull; 5 min read</div>
          </div>
        </article>
      </div>

      <!-- EDITORIAL SIDEBAR (Column 3, Sticky) -->
      <aside class="editorial-sidebar">
        <div class="sidebar-widget">
          <h3 class="widget-title">Editor's Desk</h3>
          <p style="font-size: 0.88rem; color: #475569; margin-bottom: 12px;">"Curiosity is the engine of national progress. We invite original experimental write-ups from school science club captains."</p>
          <div class="meta-byline">&mdash; Prof. M. S. K. Ramanujan</div>
        </div>

        <div class="sidebar-widget">
          <h3 class="widget-title">Trending Topics</h3>
          <div class="tag-cloud">
            <a href="#" class="topic-tag">#Chandrayaan</a>
            <a href="#" class="topic-tag">#ArtificialIntelligence</a>
            <a href="#" class="topic-tag">#SolarEnergy</a>
            <a href="#" class="topic-tag">#QuantumPhysics</a>
            <a href="#" class="topic-tag">#CBSEExams</a>
          </div>
        </div>

        <div class="sidebar-widget newsletter-box">
          <h3 class="widget-title">Weekly Digest</h3>
          <p>Get curated Olympiad math problems and science updates delivered to your inbox every Friday.</p>
          <input type="email" placeholder="Enter student email..." class="newsletter-input">
          <button class="newsletter-btn">Subscribe Free</button>
        </div>
      </aside>

    </section>

    <!-- 3. RECENT DISPATCHES (AUTO-FIT GRID) -->
    <div class="section-divider">
      <h2 class="section-title">Latest Campus Dispatches</h2>
      <div class="recent-grid">
        <article class="story-card">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80" alt="Microchip" class="story-thumb">
          <div class="story-body">
            <span class="category-badge">Semiconductors</span>
            <h3 class="story-title">India's First Indigenous RISC-V Microcontroller</h3>
            <p class="story-desc">Understanding the architecture powering the new wave of domestic electronics.</p>
          </div>
        </article>

        <article class="story-card">
          <img src="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=80" alt="Solar Farm" class="story-thumb">
          <div class="story-body">
            <span class="category-badge warm">Clean Tech</span>
            <h3 class="story-title">Perovskite Solar Cells: Crossing the 30% Efficiency Barrier</h3>
            <p class="story-desc">Why thin-film tandem solar modules will revolutionize rooftop rural electricity.</p>
          </div>
        </article>

        <article class="story-card">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80" alt="Coding Monitor" class="story-thumb">
          <div class="story-body">
            <span class="category-badge">Computer Science</span>
            <h3 class="story-title">Graph Theory Applications in Traffic Management</h3>
            <p class="story-desc">How Dijkstra's algorithm helps reduce peak-hour congestion in metro cities.</p>
          </div>
        </article>
      </div>
    </div>

  </main>

</body>
</html>
```

---

## 5. Do's and Don'ts

| Practice | Bad Approach | Good Approach | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Grid Cell Spanning** | Forcing fixed heights like `height: 500px;` across all cards | Using `grid-row: 1 / 3` so row tracks size proportionally | Fixed pixel heights cause card text to clip or overflow on zoom. |
| **Sidebar Sticking** | Forgetting `position: sticky; top: 20px;` | Using `position: sticky` with `align-self: start` | Prevents the sidebar track from stretching awkwardly to match the full page height. |
| **Responsive Fallback** | Hardcoding 3 columns down to mobile phone viewports | Resetting to `grid-template-columns: 1fr` inside `@media (max-width: 720px)` | Prevents tiny, cramped illegible columns on smartphone screens. |
| **Recent Posts Deck** | Writing manual media queries for 4, 3, 2, and 1 columns | Using `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` | The browser calculates column counts automatically at zero maintenance cost. |

---

## 6. Quick Revision Summary Cheat Sheet

- **Two-Dimensional Power**: CSS Grid controls both rows and columns simultaneously, making complex magazine layouts simple.
- **`grid-column: span X` / `grid-row: span Y`**: Expands an editorial card across multiple tracks.
- **Sticky Column**: Set `position: sticky; top: ...;` and `align-self: start;` on the sidebar card to make it glide smoothly as the user reads.
- **Auto-Fill Responsive Grid**: `repeat(auto-fill, minmax(280px, 1fr))` creates a self-adapting responsive grid without writing separate media queries.

---

# Multiple Choice Questions

### 1. In CSS Grid, how do you configure a featured card to span across 2 rows vertically?
A. row-span: 2;
B. grid-row: span 2;
C. flex-direction: vertical;
D. grid-template-rows: double;
**Answer:** B
**Explanation:** `grid-row: span 2;` (or `grid-row: 1 / 3;`) instructs the browser to stretch the element across two row tracks in the grid container.

---

### 2. Why is `align-self: start` beneficial when applying `position: sticky` to a grid sidebar?
A. It changes the sidebar font color to black
B. It prevents the sidebar from stretching to the full height of the row, enabling it to float and stick cleanly within the remaining space
C. It moves the sidebar to the top of the HTML DOM
D. It hides the sidebar on mobile browsers
**Answer:** B
**Explanation:** By default, grid items stretch to fill the entire row track (`align-self: stretch`). Setting `align-self: start` keeps the element at its natural content height so `position: sticky` has room to scroll.

---

### 3. What does `grid-template-columns: 2fr 1.2fr 1fr;` accomplish in our magazine layout?
A. It creates 3 equal columns of 100px each
B. It creates 3 columns where column 1 receives twice the available remaining space of column 3, and column 2 receives 1.2 times
C. It divides the screen into 3 rows
D. It rotates the layout by 90 degrees
**Answer:** B
**Explanation:** The `fr` (fractional) unit allocates portions of available free space. The total shares are 2 + 1.2 + 1 = 4.2fr, distributing space proportionally.

---

### 4. Which CSS Grid rule automatically creates as many 280px columns as will fit on any screen without media queries?
A. `grid-template-columns: 280px 280px 280px;`
B. `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));`
C. `display: flex; flex-direction: row;`
D. `grid-columns: automatic-fit;`
**Answer:** B
**Explanation:** `repeat(auto-fill, minmax(280px, 1fr))` dynamically fits as many 280px tracks as the viewport permits, expanding them proportionally to fill remaining space.

---

### 5. On mobile screens (max-width: 720px), what is the best way to collapse a 3-column grid into a single readable column?
A. Set `display: none` on columns 2 and 3
B. Set `grid-template-columns: 1fr;` on the container and reset item spans to `grid-column: 1 / -1;`
C. Float all elements to the left
D. Decrease the font size to 6px
**Answer:** B
**Explanation:** Defining `grid-template-columns: 1fr` transforms the grid into a single full-width column, allowing all stories to stack cleanly down the screen.

---

# Hands-on Practice Challenge

Add an interactive "Trending Authors" gallery beneath the sidebar that uses an internal 2-column micro-grid.

### Requirements:
1. Inside the sidebar, create an author widget titled "Contributing Mentors".
2. Use an internal CSS Grid with `grid-template-columns: 48px 1fr;` and `gap: 12px;` for each mentor row.
3. Place a circular avatar photo on the left track and author name with article count on the right track.
4. Add a subtle hover background highlight when hovering over an author.

### Complete Solution:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Author Micro-Grid Challenge</title>
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

    .widget-container {
      max-width: 340px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .widget-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
    }

    .author-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* 2-Column Micro-Grid */
    .author-item {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: 12px;
      align-items: center;
      padding: 8px 10px;
      border-radius: 10px;
      transition: background 0.2s ease;
      cursor: pointer;
    }

    .author-item:hover {
      background: #f8fafc;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2563eb;
    }

    .author-info h4 {
      font-size: 0.95rem;
      color: #0f172a;
      font-weight: 700;
      line-height: 1.2;
    }

    .author-info p {
      font-size: 0.8rem;
      color: #64748b;
    }
  </style>
</head>
<body>

  <div class="widget-container">
    <h3 class="widget-title">Contributing Mentors</h3>

    <div class="author-list">
      <div class="author-item">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Mentor 1" class="author-avatar">
        <div class="author-info">
          <h4>Dr. Sunita Krishnan</h4>
          <p>18 Published Articles &bull; Astrophysics</p>
        </div>
      </div>

      <div class="author-item">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" alt="Mentor 2" class="author-avatar">
        <div class="author-info">
          <h4>Prof. Rajesh Kulkarni</h4>
          <p>24 Published Articles &bull; AI Robotics</p>
        </div>
      </div>

      <div class="author-item">
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80" alt="Mentor 3" class="author-avatar">
        <div class="author-info">
          <h4>Dr. Meenakshi Sundaram</h4>
          <p>12 Published Articles &bull; Nanotech</p>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
```
