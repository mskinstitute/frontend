---
id: project-3-animated-pricing-table
slug: project-3-animated-pricing-table
course: css-for-intermediate
chapter: Intermediate Projects
topic: "Project 3: Animated Pricing Table"
difficulty: Intermediate
readingTime: 16
order: 36
keywords: ["css project", "animated pricing table", "css pricing card", "css transitions project", "intermediate css project"]
lastUpdated: 2026-09-10
author: Antigravity Team
version: 1.0.0
---

# Project 3: Animated Pricing Table

Whether you are signing up for an online video streaming service or choosing a classroom tuition package at a premier coaching institute, you have seen a **Pricing Table**. A great pricing table is not just a lifeless list of numbers—it is an interactive, psychology-driven interface that clearly highlights the most popular tier, rewards user hover with satisfying micro-interactions, and adapts smoothly to any screen size.

In this capstone project for Intermediate CSS, we will combine **Flexbox, CSS Variables, Transitions, Transforms, Pseudo-elements, and Box-Shadows** to build an animated, commercial-quality **Course Tuition Pricing Table**.

---

## 1. Project Blueprint and Visual Hierarchy

A successful pricing table directs the student's eyes immediately to the best value option. Here is the architectural layout:

```
+-------------------------------------------------------------------------+
|                  PRICING TABLE ARCHITECTURE & INTERACTION               |
+-------------------------------------------------------------------------+

              [SECTION HEADER: Choose Your Learning Track]
              
                 [TOGGLE PILL: (o) Monthly  |  ( ) Annual (Save 20%)]
                                     |
                                     v
   +--------------------+  +--------------------+  +--------------------+
   | TIER 1: FOUNDATION |  | TIER 2: PRO (HERO) |  | TIER 3: MASTER     |
   |                    |  |                    |  |                    |
   |                    |  | [POPULAR BADGE]    |  |                    |
   | Rs 1,499 / mo      |  | Rs 2,999 / mo      |  | Rs 4,999 / mo      |
   |                    |  |                    |  |                    |
   | - Recorded Lectures|  | - Recorded + LIVE  |  | - Everything in Pro|
   | - Weekly Quizzes   |  | - 1-on-1 Mentorship|  | - Personal Coach   |
   | - Standard Notes   |  | - All Test Series  |  | - Physical Books   |
   |                    |  |                    |  |                    |
   | [Select Plan]      |  | [JOIN PRO TRACK]   |  | [Select Plan]      |
   +--------------------+  +--------------------+  +--------------------+
     (Base Elevation)       (Pre-scaled 1.05x,      (Base Elevation)
                             Emerald Border,
                             Multi-layered Glow)
                                     |
               [HOVER EFFECT: Cards lift translateY(-8px)]
```

---

## 2. Key CSS Techniques Showcased

1. **Visual Hierarchy & Middle Card Elevation**: Scaling the popular tier (`transform: scale(1.05)`) so it physically stands out even before the user hovers.
2. **"Most Popular" Ribbon with Absolute Positioning**: Crafting a badge that overlaps the top border using `position: absolute; top: -14px; left: 50%; transform: translateX(-50%);`.
3. **Smooth Micro-Interactions**: Combining `transition: transform 0.3s ease, box-shadow 0.3s ease;` with subtle lift (`translateY(-8px)`).
4. **CSS Feature Checkmarks**: Styling custom green checkmarks and disabled strikethroughs using CSS pseudo-elements (`::before`).
5. **Interactive Toggle Switch**: Building a pure CSS monthly/annual pill toggle using an invisible `<input type="checkbox">` and the adjacent sibling selector (`+ .toggle-slider`).

---

## 3. Step-by-Step Construction

### Step 1: The Design Tokens & Base Theme
We define our primary indigo brand color, vibrant emerald for the recommended package, neutral card backgrounds, and easing speeds:

```css
:root {
  --brand-primary: #4338ca;
  --brand-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  --badge-emerald: #059669;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --bg-stage: #f8fafc;
  --bg-card: #ffffff;
  --border-card: #e2e8f0;
  --radius-card: 20px;
  --shadow-default: 0 4px 14px rgba(15, 23, 42, 0.06);
  --shadow-lift: 0 20px 35px -8px rgba(79, 70, 229, 0.2);
  --trans-smooth: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Step 2: Flexbox Card Container
The container uses `display: flex` with `align-items: center` so the non-featured cards sit comfortably while the featured card can naturally expand taller:

```css
.pricing-deck {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  padding: 20px 0;
}
```

### Step 3: Elevating the "Most Popular" Card
The middle card is given a prominent gradient border, subtle default scaling, and high-contrast button:

```css
.card-popular {
  border: 2px solid #6366f1;
  transform: scale(1.04);
  box-shadow: 0 12px 30px -4px rgba(99, 102, 241, 0.2);
  position: relative;
  z-index: 10;
}

.popular-ribbon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand-gradient);
  color: #ffffff;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}
```

### Step 4: Fluid Hover Micro-Interactions
When a student hovers over any card, it floats upward with an expanded ambient glow:

```css
.pricing-card {
  transition: var(--trans-smooth);
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lift);
}

.card-popular:hover {
  transform: scale(1.04) translateY(-8px);
}
```

---

## 4. Complete, Runnable Project Code

Save this complete HTML and CSS file as `pricing.html` and view it in your browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Coaching - Course Tuition Pricing Table</title>
  <style>
    /* ==========================================================================
       1. VARIABLES & RESETS
       ========================================================================== */
    :root {
      --primary: #4f46e5;
      --primary-dark: #3730a3;
      --accent: #10b981;
      --accent-soft: #d1fae5;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --bg-page: #f1f5f9;
      --bg-card: #ffffff;
      --border-card: #e2e8f0;
      --radius-sm: 8px;
      --radius-card: 22px;
      --shadow-flat: 0 4px 16px rgba(15, 23, 42, 0.05);
      --shadow-hover: 0 24px 40px -10px rgba(79, 70, 229, 0.22);
      --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: var(--bg-page);
      color: var(--text-dark);
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* ==========================================================================
       2. HEADER & INTRO
       ========================================================================== */
    .pricing-header {
      text-align: center;
      max-width: 650px;
      margin-bottom: 40px;
    }

    .badge-pill {
      display: inline-block;
      padding: 6px 14px;
      background: #e0e7ff;
      color: var(--primary);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .pricing-header h1 {
      font-size: clamp(2rem, 3.5vw, 2.6rem);
      color: var(--text-dark);
      margin-bottom: 12px;
    }

    .pricing-header p {
      color: var(--text-muted);
      font-size: 1.05rem;
    }

    /* ==========================================================================
       3. PRICING DECK (FLEXBOX LAYOUT)
       ========================================================================== */
    .pricing-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 28px;
      flex-wrap: wrap;
      max-width: 1200px;
      width: 100%;
    }

    .pricing-card {
      background: var(--bg-card);
      border-radius: var(--radius-card);
      border: 1px solid var(--border-card);
      padding: 36px 30px;
      width: 330px;
      box-shadow: var(--shadow-flat);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.35s var(--ease-snappy), box-shadow 0.35s var(--ease-snappy), border-color 0.35s ease;
    }

    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-hover);
      border-color: #cbd5e1;
    }

    /* --- Featured Popular Card --- */
    .pricing-card.featured {
      border: 2px solid var(--primary);
      transform: scale(1.04);
      box-shadow: 0 16px 36px -6px rgba(79, 70, 229, 0.18);
      z-index: 10;
    }

    .pricing-card.featured:hover {
      transform: scale(1.04) translateY(-8px);
      box-shadow: var(--shadow-hover);
    }

    .popular-tag {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      padding: 4px 18px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    /* --- Card Header & Pricing --- */
    .tier-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
    }

    .tier-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 24px;
      min-height: 42px;
    }

    .price-box {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-card);
      padding-bottom: 20px;
    }

    .currency {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .amount {
      font-size: 2.8rem;
      font-weight: 800;
      color: var(--text-dark);
      line-height: 1;
    }

    .period {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* --- Features Checklist --- */
    .features-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 32px;
      flex-grow: 1;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.92rem;
      color: #334155;
    }

    .check-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      flex-shrink: 0;
    }

    .feature-item.disabled {
      color: #94a3b8;
      text-decoration: line-through;
    }

    .feature-item.disabled .check-icon {
      background: #f1f5f9;
      color: #94a3b8;
    }

    /* --- CTA Buttons --- */
    .btn-plan {
      width: 100%;
      padding: 14px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.95rem;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
      display: inline-block;
      border: 1px solid var(--border-card);
      background: #f8fafc;
      color: var(--text-dark);
    }

    .btn-plan:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    .featured .btn-plan {
      background: var(--primary);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    }

    .featured .btn-plan:hover {
      background: var(--primary-dark);
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35);
    }

    /* ==========================================================================
       4. RESPONSIVE MEDIA QUERIES
       ========================================================================== */
    @media (max-width: 1080px) {
      .pricing-card.featured {
        transform: scale(1);
      }
      .pricing-card.featured:hover {
        transform: translateY(-8px);
      }
    }

    @media (max-width: 740px) {
      .pricing-container {
        flex-direction: column;
        align-items: center;
      }
      .pricing-card {
        width: 100%;
        max-width: 360px;
      }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="pricing-header">
    <div class="badge-pill">Academic Year 2026-27</div>
    <h1>Simple, Transparent Tuition Plans</h1>
    <p>Invest in your academic future with our structured classroom batches, live doubt labs, and personalized mentoring.</p>
  </header>

  <!-- 3-CARD PRICING TABLE -->
  <section class="pricing-container">

    <!-- 1. BASIC / FOUNDATION -->
    <div class="pricing-card">
      <h3 class="tier-name">Foundation</h3>
      <p class="tier-desc">Ideal for Class 8-10 students strengthening basic math & science concepts.</p>
      
      <div class="price-box">
        <span class="currency">&#8377;</span>
        <span class="amount">1,499</span>
        <span class="period">/ month</span>
      </div>

      <ul class="features-list">
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Recorded Video Lectures
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Chapter-wise PDF Notes
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Weekly Practice Quizzes
        </li>
        <li class="feature-item disabled">
          <span class="check-icon">&#10005;</span>
          Live 1-on-1 Doubt Sessions
        </li>
        <li class="feature-item disabled">
          <span class="check-icon">&#10005;</span>
          Olympiad Test Mock Series
        </li>
      </ul>

      <a href="#enroll-foundation" class="btn-plan">Get Started</a>
    </div>

    <!-- 2. PRO / OLYMPIAD (FEATURED) -->
    <div class="pricing-card featured">
      <div class="popular-tag">Most Recommended</div>
      <h3 class="tier-name">Olympiad Pro</h3>
      <p class="tier-desc">Complete syllabus coaching with daily live problem workshops and doubt support.</p>
      
      <div class="price-box">
        <span class="currency">&#8377;</span>
        <span class="amount">2,999</span>
        <span class="period">/ month</span>
      </div>

      <ul class="features-list">
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Everything in Foundation
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Daily Live Interactive Classes
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          1-on-1 Doubt Clearing Labs
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          All-India Rank Test Series
        </li>
        <li class="feature-item disabled">
          <span class="check-icon">&#10005;</span>
          Dedicated Personal IITian Mentor
        </li>
      </ul>

      <a href="#enroll-pro" class="btn-plan">Join Pro Batch</a>
    </div>

    <!-- 3. MASTER / IIT-JEE ELITE -->
    <div class="pricing-card">
      <h3 class="tier-name">JEE & NEET Elite</h3>
      <p class="tier-desc">Intensive rank-acceleration program with dedicated personal mentor and physical kits.</p>
      
      <div class="price-box">
        <span class="currency">&#8377;</span>
        <span class="amount">4,999</span>
        <span class="period">/ month</span>
      </div>

      <ul class="features-list">
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Everything in Olympiad Pro
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Dedicated Personal Mentor
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Printed Study Modules Shipped
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Weekly Parent Diagnostic Calls
        </li>
        <li class="feature-item">
          <span class="check-icon">&#10003;</span>
          Guaranteed Batch Capping (15 max)
        </li>
      </ul>

      <a href="#enroll-elite" class="btn-plan">Join Elite Batch</a>
    </div>

  </section>

</body>
</html>
```

---

## 5. Do's and Don'ts

| Practice | Bad Approach | Good Approach | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Popular Card Stacking** | Leaving all three cards identical in size and border | Pre-scaling the popular card (`scale(1.04)`) and adding a prominent badge | Guides student attention directly to the optimal offering. |
| **Card Button Alignment** | Letting buttons float at different heights when feature lists vary | Using `display: flex; flex-direction: column;` and `flex-grow: 1` on `.features-list` | Pushes every CTA button cleanly to the bottom baseline. |
| **Mobile Scaling** | Keeping `transform: scale(1.04)` enabled on mobile viewports | Removing or resetting scaling inside `@media (max-width: 1080px)` | Prevents oversized cards from breaking screen boundaries on phones. |
| **Feature Comparisons** | Deleting unavailable features completely from lower tier cards | Listing disabled features with strikethrough styling and muted check icons | Shows prospective students what extra value higher tiers offer. |

---

## 6. Quick Revision Summary Cheat Sheet

- **Visual Dominance**: Use `transform: scale(1.04)` and a distinctive border to create natural focal emphasis on the recommended plan.
- **Micro-Interaction**: `transform: translateY(-8px)` combined with soft expanding `box-shadow` provides responsive tactile feedback.
- **Button Pinning**: Applying `flex-grow: 1` on the feature checklist ensures all buttons align horizontally across every tier card.
- **Responsive Stacking**: Switch the flex parent to `flex-direction: column` and reset card scaling on small mobile devices.

---

# Multiple Choice Questions

### 1. In modern pricing tables, why is the middle or recommended card often given `transform: scale(1.04)` by default?
A. Because the browser renders large text faster
B. To create visual hierarchy and immediately draw the student's eyes to the highest-value option
C. To prevent the user from clicking the other cards
D. To disable CSS transitions on the side cards
**Answer:** B
**Explanation:** Visual hierarchy in UI design guides user focus. Pre-scaling the recommended option makes it instantly distinguishable as the primary plan.

---

### 2. How can you ensure that the CTA buttons across all three pricing cards stay aligned at the exact bottom, even if one card has more feature bullets?
A. Use `margin-top: 500px` on all buttons
B. Set `display: flex; flex-direction: column;` on the card and `flex-grow: 1;` on the features list
C. Set `position: fixed` on the buttons
D. Make the text inside all cards identical
**Answer:** B
**Explanation:** Giving `flex-grow: 1` to the features checklist absorbs all leftover vertical space in the flex column, pushing the button directly to the bottom.

---

### 3. Which CSS positioning strategy allows the "Most Recommended" pill tag to float half-way over the top edge of the card?
A. `position: static; margin-top: -10px;`
B. `position: absolute; top: -14px; left: 50%; transform: translateX(-50%);` on a relatively-positioned card
C. `display: inline-block; float: left;`
D. `position: fixed; top: 0; left: 0;`
**Answer:** B
**Explanation:** Positioning the badge `absolute` with `top: -14px`, `left: 50%`, and `transform: translateX(-50%)` anchors it relative to the parent card and centers it horizontally across the top border.

---

### 4. What happens when a user hovers over a card with `transform: translateY(-8px);`?
A. The card shrinks by 8 pixels
B. The card smoothly elevates 8 pixels upward towards the top of the viewport
C. The card shifts 8 pixels to the left
D. The background color turns transparent
**Answer:** B
**Explanation:** Negative `translateY` moves an element upwards along the vertical Y-axis, creating an appealing floating or lift effect.

---

### 5. Why should `transform: scale(1.04)` on the featured card be reset or removed inside mobile media queries (`max-width: 740px`)?
A. Mobile browsers do not support CSS transforms
B. When stacked vertically, an oversized card can look awkwardly misaligned or trigger unwanted horizontal scrollbars on narrow screens
C. It speeds up mobile network loading times
D. Mobile devices do not support box-shadows
**Answer:** B
**Explanation:** On mobile screens where cards are stacked in a single vertical column, oversized scaling can cause awkward layout asymmetry and horizontal overflow.

---

# Hands-on Practice Challenge

Add a pure CSS "Annual Billing (Save 20%)" discount toggle badge above the pricing table.

### Requirements:
1. Above the cards, create a toggle pill container with two options: "Monthly" and "Annual (Save 20%)".
2. When the "Annual" option is active, display a glowing emerald discount tag (`background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;`).
3. Add a smooth transition when switching between the active and inactive options.

### Complete Solution:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pricing Toggle Challenge</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .billing-toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #ffffff;
      padding: 8px 16px;
      border-radius: 30px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    .toggle-label {
      font-size: 0.95rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s ease;
    }

    .toggle-label.active {
      color: #0f172a;
    }

    /* Switch container */
    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 28px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 28px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    input:checked + .slider {
      background-color: #4f46e5;
    }

    input:checked + .slider:before {
      transform: translateX(22px);
    }

    .discount-pill {
      background: #10b981;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>

  <div class="billing-toggle-wrapper">
    <span class="toggle-label active">Monthly</span>

    <label class="switch">
      <input type="checkbox" checked>
      <span class="slider"></span>
    </label>

    <span class="toggle-label active">
      Annual
      <span class="discount-pill">Save 20%</span>
    </span>
  </div>

</body>
</html>
```
