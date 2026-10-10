---
id: project-styled-profile-card
slug: project-styled-profile-card
course: css-for-beginners
chapter: 12
topic: 12.1
title: "Project 1: Styled Student Profile & ID Card"
description: Build a modern, responsive student profile card from scratch combining the box model, gradients, circular avatars, positioning badges, flexbox skill pills, and hover elevations.
difficulty: Beginner
readingTime: 12
order: 35
keywords:
  - css profile card
  - css project
  - circular avatar
  - absolute badge
  - flexbox pills
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project 1: Styled Student Profile & ID Card

Congratulations on reaching Chapter 12! 🎉

Over the past 11 chapters, you have learned the core building blocks of CSS:
- Selectors and cascade rules
- Colors, gradients, and backgrounds
- The Box Model (content, padding, border, margin)
- Typography and custom web fonts
- CSS units (`rem`, `%`, `px`)
- Borders, rounded corners, and box shadows
- Positioning (`relative`, `absolute`, `z-index`)
- Centering and basic Flexbox layouts

Now, it is time to assemble these individual skills into your **first complete, portfolio-ready CSS project**: A modern **Student Profile & ID Card**!

---

# Project Preview & Architecture 📐

Here is the visual layout of the profile card we are building:

```text
+-------------------------------------------------------------+
| [TOP BANNER: Royal Blue & Violet Linear Gradient]           |
|                                                             |
|                                         +-----------------+ |
|                                         | [BADGE] PREFECT | |
|                                         | (pos: absolute) | |
|                                         +-----------------+ |
|               +-----------------------+                     |
|               |  CIRCULAR AVATAR      |                     |
|               |  (border-radius: 50%) |                     |
|               |  (overlapping banner) |                     |
|               +-----------------------+                     |
|                                                             |
|                   Aarav Sharma                              |
|             Head Boy | Class 10-A                           |
|      Delhi Model Senior Secondary School                    |
|                                                             |
|   SKILLS & INTERESTS (Flexbox Row):                         |
|   [ Python ]   [ Web Design ]   [ Cricket ]   [ Robotics ]  |
|                                                             |
|   ACTION BUTTONS (Flexbox Space-Between):                   |
|   [ View Marksheet ]                 [ Send Message ]       |
+-------------------------------------------------------------+
```

---

# CSS Techniques Applied in This Project

1. **Box Model & Centering:** `box-sizing: border-box;` with `margin: 40px auto;` to center the card on the page.
2. **Gradients:** A vibrant 135-degree `linear-gradient` for the top cover banner.
3. **Overlapping Avatar:** `border-radius: 50%;` with a negative top margin (`margin-top: -60px;`) and a thick white border ring to make the portrait pop over the banner.
4. **Absolute Positioning:** Pinned "Head Boy / Prefect" corner ribbon badge (`position: absolute; top: 16px; right: 16px;`).
5. **Flexbox:**
   - Pill badges lined up with `display: flex; gap: 8px; flex-wrap: wrap;`.
   - Action buttons aligned with `display: flex; gap: 12px;`.
6. **Micro-interactions:** Smooth hover lift with `transform: translateY(-6px);` and an elevated `box-shadow`.

---

# Complete Project Code

Create a file named `student-profile-card.html` in your editor and paste the following complete code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Profile Card Project | MSK Institute</title>
  <style>
    /* 1. Global Box-Sizing & Page Reset */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px 15px;
    }

    /* 2. Main Profile Card Container */
    .profile-card {
      position: relative; /* ANCHOR FOR ABSOLUTE BADGES */
      width: 100%;
      max-width: 380px;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden; /* Clips banner corners to match border-radius */
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Hover Elevation Effect */
    .profile-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14);
    }

    /* 3. Top Gradient Cover Banner */
    .card-banner {
      height: 130px;
      background: linear-gradient(135deg, #1e40af, #7c3aed);
      position: relative;
    }

    /* Absolute Status Badge */
    .status-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background-color: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    /* 4. Circular Avatar */
    .avatar-wrapper {
      text-align: center;
      margin-top: -55px; /* Pulls avatar upwards over the banner! */
      position: relative;
      z-index: 2;
    }

    .avatar-img {
      width: 110px;
      height: 110px;
      border-radius: 50%; /* Perfect Circle */
      border: 5px solid #ffffff; /* Crisp white frame */
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 44px;
      color: white;
      user-select: none;
    }

    /* 5. Card Body & Student Details */
    .card-body {
      padding: 16px 24px 28px 24px;
      text-align: center;
    }

    .student-name {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .student-role {
      font-size: 14px;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 6px;
    }

    .student-school {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 20px;
    }

    /* 6. Section Subheading */
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #94a3b8;
      margin-bottom: 10px;
      text-align: left;
    }

    /* 7. Flexbox Skill Badges */
    .skills-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .skill-pill {
      background-color: #f1f5f9;
      color: #334155;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;
      transition: background-color 0.2s;
    }

    .skill-pill:hover {
      background-color: #e2e8f0;
    }

    /* 8. Action Buttons Group */
    .action-group {
      display: flex;
      gap: 12px;
    }

    .btn {
      flex: 1; /* Both buttons expand equally */
      padding: 12px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .btn-secondary:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- The Complete Profile Card -->
  <div class="profile-card">
    <!-- Top Cover Banner -->
    <div class="card-banner">
      <span class="status-badge">⭐ Head Boy</span>
    </div>

    <!-- Overlapping Circular Avatar -->
    <div class="avatar-wrapper">
      <div class="avatar-img">👨‍🎓</div>
    </div>

    <!-- Student Bio -->
    <div class="card-body">
      <h2 class="student-name">Aarav Sharma</h2>
      <p class="student-role">Class 10-A | Science & Computers</p>
      <p class="student-school">Delhi Model Senior Secondary School</p>

      <!-- Skills -->
      <div class="section-title">Skills & Interests</div>
      <div class="skills-group">
        <span class="skill-pill">💻 Python</span>
        <span class="skill-pill">🌐 HTML & CSS</span>
        <span class="skill-pill">🏏 Cricket</span>
        <span class="skill-pill">🤖 Robotics</span>
        <span class="skill-pill">🎨 UI Design</span>
      </div>

      <!-- Actions -->
      <div class="action-group">
        <a href="#marksheet" class="btn btn-secondary">Report Card</a>
        <a href="#message" class="btn btn-primary">Connect</a>
      </div>
    </div>
  </div>

</body>
</html>
```

---

# How It Works: Key Takeaways

1. **`border-radius: 20px; overflow: hidden;` on `.profile-card`:**
   Because the `.card-banner` has square top corners, setting `overflow: hidden;` on the parent card automatically clips the banner's corners to match the card's 20px curves!
2. **The Negative Margin Avatar Trick:**
   `margin-top: -55px;` pulls the avatar circle exactly 55px upwards into the gradient banner, creating that iconic modern profile card overlap!
3. **`flex: 1;` on the Action Buttons:**
   Inside `.action-group { display: flex; }`, setting `flex: 1` on both buttons ensures they share horizontal space 50/50 with zero math required.

---

---

## ⚠️ Beginner Project Production Best Practices

1. **Avoid Rigid Pixel Heights:** Let containers grow organically with their content using padding rather than hardcoding `height: 400px`.
2. **Add Smooth Transitions to Hover States:** Always include `transition: all 0.2s ease;` on interactive buttons and cards to avoid jarring visual jumps.
3. **Keep Accessible Contrast:** Ensure text colors maintain a high contrast ratio against backgrounds (minimum 4.5:1 for standard body text).

---

## Practice Quiz

### 1. Which CSS technique is used to create the classic modern effect where the circular avatar overlaps the top banner?
A. Applying a negative top margin (`margin-top: -55px;`) on the avatar container
B. Setting the avatar width to -100px
C. Deleting the banner background
D. Using `display: none`
**Answer:** A

---

### 2. Why is `overflow: hidden;` applied to the `.profile-card` parent container?
A. To stop the user from scrolling the card
B. To ensure that the top gradient banner's sharp square corners are clipped to match the card's rounded `border-radius: 20px;`
C. To turn the card invisible
D. Because CSS requires all cards to hide overflow
**Answer:** B

---

### 3. How does `border-radius: 50%;` turn a square `<div>` (110px $\times$ 110px) into a perfect circle?
A. It rounds every corner by half of the element's width and height, creating a continuous curved circle
B. It converts the HTML element into an SVG image
C. It compresses the pixels by 50%
D. It rotates the box 360 degrees
**Answer:** A

---

### 4. What does setting `flex: 1;` accomplish on the two action buttons inside `.action-group { display: flex; }`?
A. It makes button 1 bigger than button 2
B. It forces both buttons to grow equally to fill the entire horizontal width of the card
C. It stacks the buttons on top of each other
D. It hides the secondary button
**Answer:** B

---

### 5. Why is `position: relative;` placed on `.profile-card` when the "Head Boy" status badge has `position: absolute;`?
A. To make the badge spin on hover
B. To serve as the coordinate boundary anchor so the badge positions relative to the card rather than flying across the whole web page
C. To prevent the badge from having text
D. Because absolute badges only accept yellow colors without relative parents
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open `student-profile-card.html` in your editor.
2. Customize the card with your own name, grade, favorite school subjects, and sports!
3. Add a second badge on the top-left corner displaying your House color (e.g., Red House or Emerald House)!
4. Test the card on your mobile phone to verify that the card adapts cleanly to smaller touchscreens! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Project 2: Simple School Club Landing Page** (Beginner Projects).

👉 **[Continue to Next Lesson: Project 2: Simple School Club Landing Page →](/tutorials/css-for-beginners/project-simple-landing-page-layout)**
