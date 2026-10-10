---
id: project-simple-landing-page-layout
slug: project-simple-landing-page-layout
course: css-for-beginners
chapter: 12
topic: 12.2
title: "Project 2: Simple School Club Landing Page"
description: Build a complete, responsive school club landing page from scratch. Master the container pattern, hero banner, flexbox feature card grid, and alert strips.
difficulty: Beginner
readingTime: 12
order: 36
keywords:
  - css landing page
  - css project
  - flexbox grid
  - hero section
  - container pattern
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project 2: Simple School Club Landing Page

In Project 1, we built an individual component: a student profile card. 📱

Now, we are taking the next leap: building an entire **Full-Page Website Layout**!

In this project, you will design and code a complete **School Coding & Robotics Club Landing Page** featuring:
1. A clean brand header with navigational links
2. An eye-catching **Hero Banner** with primary and secondary call-to-action buttons
3. An urgent announcement alert strip with an accent border
4. A **3-Column Feature Cards Section** powered by Flexbox
5. A dark, modern website footer

---

# Page Architecture & Wireframe 📐

Here is the blueprint of our landing page:

```text
+-------------------------------------------------------------------------+
| [HEADER & NAVBAR]                                                       |
| Logo: DPS Coding Club                 Links: [ About ] [ Projects ] [ Join ]
+-------------------------------------------------------------------------+
| [HERO SECTION (Navy Gradient)]                                          |
|                                                                         |
|            Ignite Your Passion for Code & Robotics 🤖                   |
|      Learn Python, build smart Arduino robots, and compete              |
|              in national inter-school hackathons!                       |
|                                                                         |
|           [ Join the Club (CTA) ]     [ View Projects ]                 |
+-------------------------------------------------------------------------+
| [ALERT STRIP: Upcoming Hackathon Announcement (Left Accent Border)]     |
+-------------------------------------------------------------------------+
| [3-COLUMN FEATURE CARDS (Flexbox with Gap)]                             |
| +---------------------+  +---------------------+  +-------------------+ |
| | 🐍 Python & Web     |  | 🤖 Robotics & IoT   |  | 🏆 Olympiads      | |
| | Learn HTML5 & CSS3  |  | Sensors & Circuits  |  | Win State Trophies| |
| +---------------------+  +---------------------+  +-------------------+ |
+-------------------------------------------------------------------------+
| [FOOTER: Copyright & Social Links]                                      |
+-------------------------------------------------------------------------+
```

---

# Key CSS Concepts Applied

1. **The Container Pattern:**
   ```css
   .container {
     max-width: 1100px;
     margin: 0 auto;
     padding: 0 20px;
   }
   ```
   This prevents content from stretching awkwardly to the extreme edges on wide desktop monitors!
2. **Hero Section Styling:** Deep linear gradient (`linear-gradient(135deg, #0f172a, #1e3a8a)`), white contrasting text, and spacious vertical padding.
3. **Accent Left Border Alert:** `border-left: 6px solid #2563eb;` with a soft tinted background.
4. **Flexbox 3-Card Grid:** `display: flex; gap: 24px;` with `flex: 1;` so all 3 cards match heights and share width equally.
5. **Interactive Card Hover:** Smooth lift with `transform: translateY(-5px);` and elevation shadow.

---

# Complete Project Code

Create a file named `school-club-landing-page.html` in your editor and paste the following complete code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DPS Coding & Robotics Club | Landing Page Project</title>
  <style>
    /* 1. Global Reset & Box Sizing */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      line-height: 1.6;
    }

    /* 2. Global Max-Width Container */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* 3. Header & Navigation */
    .site-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .brand-logo {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo span {
      color: #2563eb;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 24px;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: #475569;
      font-weight: 500;
      font-size: 15px;
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: #2563eb;
    }

    .btn-header {
      background-color: #2563eb;
      color: white !important;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
    }

    .btn-header:hover {
      background-color: #1d4ed8;
    }

    /* 4. Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      padding: 80px 0;
      text-align: center;
    }

    .hero-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 18px;
      letter-spacing: -0.5px;
    }

    .hero-subtitle {
      font-size: 18px;
      color: #cbd5e1;
      max-width: 650px;
      margin: 0 auto 32px auto;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .btn {
      display: inline-block;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: #38bdf8;
      color: #0f172a;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
    }

    .btn-primary:hover {
      background-color: #7dd3fc;
      transform: translateY(-2px);
    }

    .btn-outline {
      background-color: transparent;
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: #ffffff;
      transform: translateY(-2px);
    }

    /* 5. Alert Announcement Strip */
    .alert-strip {
      margin-top: -25px; /* Floats over hero boundary */
      position: relative;
      z-index: 10;
    }

    .alert-box {
      background-color: #ffffff;
      border-left: 6px solid #2563eb;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
    }

    .alert-text strong {
      color: #0f172a;
    }

    .alert-date {
      color: #2563eb;
      font-weight: bold;
      font-size: 13px;
      background-color: #eff6ff;
      padding: 4px 10px;
      border-radius: 20px;
    }

    /* 6. Features / Wings Section */
    .features-section {
      padding: 70px 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-header h2 {
      font-size: 30px;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .section-header p {
      color: #64748b;
      font-size: 16px;
    }

    /* Flexbox 3-Card Grid */
    .features-grid {
      display: flex;
      gap: 24px;
    }

    .feature-card {
      flex: 1; /* Equal 1/3 width columns */
      background-color: #ffffff;
      border-radius: 12px;
      padding: 30px 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
      border-top: 4px solid #2563eb; /* Top Accent Stripe */
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .feature-card.robotics {
      border-top-color: #10b981; /* Emerald Accent */
    }

    .feature-card.hackathons {
      border-top-color: #f59e0b; /* Amber Accent */
    }

    .feature-icon {
      font-size: 40px;
      margin-bottom: 16px;
      display: inline-block;
    }

    .feature-card h3 {
      font-size: 20px;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .feature-card p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
    }

    /* 7. Footer */
    .site-footer {
      background-color: #0f172a;
      color: #94a3b8;
      padding: 40px 0;
      border-top: 1px solid #1e293b;
      text-align: center;
      font-size: 14px;
    }

    .site-footer a {
      color: #38bdf8;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <!-- 1. Sticky Navigation Header -->
  <header class="site-header">
    <div class="container nav-bar">
      <a href="#" class="brand-logo">🤖 DPS <span>CodeClub</span></a>
      <ul class="nav-menu">
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#wings" class="nav-link">Wings</a></li>
        <li><a href="#events" class="nav-link">Hackathons</a></li>
        <li><a href="#join" class="nav-link btn-header">Join Club</a></li>
      </ul>
    </div>
  </header>

  <!-- 2. Hero Section -->
  <section class="hero-section">
    <div class="container">
      <h1 class="hero-title">Build Robots. Write Code.<br>Create the Future.</h1>
      <p class="hero-subtitle">
        Join over 150+ student innovators at Delhi Public School learning Python programming, Arduino robotics, and competitive web development.
      </p>
      <div class="hero-actions">
        <a href="#join" class="btn btn-primary">Join Club 2026</a>
        <a href="#wings" class="btn btn-outline">Explore Wings</a>
      </div>
    </div>
  </section>

  <!-- 3. Announcement Alert Strip -->
  <div class="alert-strip">
    <div class="container">
      <div class="alert-box">
        <div class="alert-text">
          📢 <strong>Annual Inter-School Hackathon 2026:</strong> Registrations are officially open for Class 8 to 12 teams!
        </div>
        <div class="alert-date">Trials: Oct 18</div>
      </div>
    </div>
  </div>

  <!-- 4. Three-Column Feature Cards Section -->
  <section id="wings" class="features-section">
    <div class="container">
      <div class="section-header">
        <h2>Our Three Specialization Wings</h2>
        <p>Choose your pathway or cross-train across all three disciplines</p>
      </div>

      <div class="features-grid">
        <!-- Card 1 -->
        <div class="feature-card">
          <span class="feature-icon">💻</span>
          <h3>Web & App Development</h3>
          <p>
            Master HTML5, CSS3, JavaScript, and Python. Build real-world school websites, quiz portals, and utility tools for your peers.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="feature-card robotics">
          <span class="feature-icon">🤖</span>
          <h3>Robotics & IoT Lab</h3>
          <p>
            Work with Arduino boards, ultrasonic distance sensors, and servo motors. Design automated line-following and obstacle-avoiding rovers.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="feature-card hackathons">
          <span class="feature-icon">🏆</span>
          <h3>Competitive Olympiads</h3>
          <p>
            Sharpen algorithmic problem-solving skills for the National Cyber Olympiad (NCO) and state-level hackathons with mentor guidance.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Footer -->
  <footer class="site-footer">
    <div class="container">
      <p>© 2026 DPS Coding & Robotics Club. Designed with clean HTML5 & CSS3.</p>
      <p style="margin-top: 6px;">
        Part of the <a href="#">MSK Institute Student Network</a>.
      </p>
    </div>
  </footer>

</body>
</html>
```

---

# Architecture Breakdown: What Makes It Professional?

1. **The Container Pattern:** Notice how `.container` is reused inside the header, hero, alert strip, features, and footer. It enforces consistent alignment across the entire page.
2. **The Floating Alert Box:** Setting `margin-top: -25px;` and `position: relative; z-index: 10;` pulls the white alert strip partially over the bottom of the navy hero banner, giving depth and layering!
3. **Flexbox 3-Card Grid:** `.features-grid { display: flex; gap: 24px; }` guarantees equal gutters between the cards without requiring fragile column percentages or floats.

---

---

## ⚠️ Beginner Project Production Best Practices

1. **Avoid Rigid Pixel Heights:** Let containers grow organically with their content using padding rather than hardcoding `height: 400px`.
2. **Add Smooth Transitions to Hover States:** Always include `transition: all 0.2s ease;` on interactive buttons and cards to avoid jarring visual jumps.
3. **Keep Accessible Contrast:** Ensure text colors maintain a high contrast ratio against backgrounds (minimum 4.5:1 for standard body text).

---

## Practice Quiz

### 1. What is the main purpose of the `.container { max-width: 1100px; margin: 0 auto; }` pattern?
A. To prevent web content from stretching uncontrollably across ultra-wide monitors and center it neatly on the screen
B. To delete all HTML headings
C. To force the browser into full-screen mode
D. To download Google Fonts automatically
**Answer:** A

---

### 2. How is the announcement alert box given a stylish colored stripe on its left side?
A. Using `border-left: 6px solid #2563eb;`
B. By adding a blue image
C. By typing a blue pipe symbol `|`
D. Using `text-decoration: left-stripe;`
**Answer:** A

---

### 3. Which Flexbox property and value applied to `.features-grid` creates equal 24px spaces between the three feature cards?
A. `space: 24px;`
B. `gap: 24px;`
C. `margin-between: 24px;`
D. `padding-all: 24px;`
**Answer:** B

---

### 4. What CSS technique pulls the alert box upward so that it partially overlaps the bottom edge of the hero banner?
A. `position: fixed;`
B. A negative margin (`margin-top: -25px;`) combined with `position: relative;`
C. `padding-top: -25px;`
D. `border-top: -25px;`
**Answer:** B

---

### 5. Why do all three feature cards have equal height in this layout?
A. Because they each have a fixed `height: 300px;`
B. Because flex items default to `align-items: stretch;`, stretching all sibling cards to match the height of the tallest card in the row
C. Because all cards have the exact same number of letters
D. Because HTML tables were used
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open `school-club-landing-page.html` in your browser and resize the window to see how it responds.
2. Customize the hero heading and subtitle for your own school or sports club.
3. Add a fourth card to the `.features-grid` (for example, "Game Design & Unity") and observe how Flexbox automatically adapts the layout! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Project 3: Modern Responsive Navigation Bar & Dropdown** (Beginner Projects).

👉 **[Continue to Next Lesson: Project 3: Modern Responsive Navigation Bar & Dropdown →](/tutorials/css-for-beginners/project-navigation-bar-styling)**
