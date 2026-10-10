---
id: min-width-max-width-media-queries
slug: min-width-max-width-media-queries
course: css-for-intermediate
chapter: 8
topic: 8.1
title: "Min-Width and Max-Width Media Queries: Modern Range Syntax and Logic"
description: Master CSS media queries for responsive websites. Learn the core logic of min-width vs max-width, modern Media Queries Level 4 range syntax, logical operators (and, not, comma), and print stylesheets.
difficulty: Intermediate
readingTime: 12
order: 22
keywords:
  - media queries
  - min-width
  - max-width
  - range syntax
  - responsive css
  - print styles
lastUpdated: '2026-09-10'
author: MSK Institute Editorial Team
version: 1.0.0
---

# Min-Width and Max-Width Media Queries: Modern Range Syntax and Logic

Think about your school's sports day trials:
* *"Students with height of at least 150 cm (`min-width: 150cm`) are eligible for the Senior High Jump."* (Applies to 150cm, 160cm, 180cm and above).
* *"Students up to a maximum age of 12 years (`max-width: 12yr`) compete in the Sub-Junior relay race."* (Applies to 12, 11, 10 and below).
* *"Students between 130 cm and 150 cm (`130cm <= height <= 150cm`) play on the Middle School badminton court."*

```
+-------------------------------------------------------------------------+
|                  THE MEDIA QUERY TIMELINE SPECTRUM                      |
|                                                                         |
|  0px               640px              1024px                1440px      |
|  |-------------------|-------------------|-------------------|---->     |
|                                                                         |
|  A. max-width: 640px                                                    |
|  <===================] (Applies to mobile phones ONLY)                  |
|                                                                         |
|  B. min-width: 1024px                                                   |
|                      [============================================>     |
|                      (Applies to Laptops, Desktops, and 4K Screens)     |
|                                                                         |
|  C. Range: (640px <= width <= 1024px)                                   |
|                      [===================] (Tablets ONLY)               |
+-------------------------------------------------------------------------+
```

Media queries are the brain of responsive design. They allow your CSS stylesheet to inspect the user's screen resolution, device orientation, and even print settings before deciding which style rules to activate.

In this tutorial, you will master the logic of **`min-width`**, **`max-width`**, **modern Level 4 range syntax (`width >= 768px`)**, and **logical operators**.

---

## 1. The Classic Syntax: `min-width` vs `max-width`

A media query wraps a block of CSS rules inside a conditional `@media` statement:

```css
/* Base styles applied to ALL screens */
body {
  font-size: 16px;
  background-color: #ffffff;
}

/* 1. min-width: Triggers on screens AT LEAST 768px or WIDER (Tablets & Desktops) */
@media (min-width: 768px) {
  body {
    font-size: 18px;
  }
}

/* 2. max-width: Triggers on screens AT MOST 480px or NARROWER (Small Phones) */
@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}
```

### The Difference in Philosophy
* **`min-width` (Additive / Mobile-First):** You write simple styles for small screens first, then *add* richer multi-column enhancements as the screen gets wider.
* **`max-width` (Subtractive / Desktop-First):** You write complex styles for widescreen desktops first, then *remove* or override features as the screen shrinks down to mobile.

---

## 2. Modern CSS Media Queries Level 4: The Range Syntax

For years, developers complained that writing `@media (min-width: 768px) and (max-width: 1024px)` was clunky and repetitive.

All modern browsers now support the clean, mathematical **Range Syntax**:

```css
/* Old Syntax */
@media (min-width: 768px) { ... }

/* Modern Range Syntax (Cleaner & More Intuitive!) */
@media (width >= 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

/* Old Syntax for Tablets */
@media (min-width: 768px) and (max-width: 1024px) { ... }

/* Modern Range Syntax for Tablets */
@media (768px <= width <= 1024px) {
  .tablet-card {
    grid-template-columns: 1fr 1fr;
  }
}
```

This mathematical syntax is 100% supported in Chrome, Firefox, Safari, and Edge.

---

## 3. Logical Operators: `and`, `not`, and the Comma (Or)

You can chain multiple conditions together using Boolean logic:

```css
/* 1. AND operator: Both conditions MUST be true */
@media (min-width: 768px) and (orientation: landscape) {
  .sidebar {
    display: block;
  }
}

/* 2. COMMA operator: Acts like OR (either condition is true) */
@media (max-width: 480px), (orientation: portrait) {
  .header {
    padding: 10px;
  }
}

/* 3. NOT operator: Inverts the entire query */
@media not all and (hover: hover) {
  /* Targets touchscreens without a precision mouse hover */
  .btn {
    padding: 14px 24px; /* Larger tap targets for fingers */
  }
}
```

---

## 4. Media Types: Screen vs Print

Have you ever tried printing a school project article directly from Wikipedia or a blog, only for the printer to waste 10 pages printing black navigation menus, banner advertisements, and search bars?

You can write specialized print stylesheets using `@media print`:

```css
/* Screen Styles: Dark mode with neon highlights */
@media screen {
  body {
    background-color: #0f172a;
    color: #ffffff;
  }
}

/* Print Styles: When student clicks Ctrl + P (Print) */
@media print {
  /* Hide interactive menus and heavy banners */
  .navbar, .footer, .ad-banner, .btn-action {
    display: none !important;
  }

  /* Force clean white paper and dark ink */
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt;
  }

  /* Expand article to 100% printable paper width */
  .main-article {
    width: 100% !important;
    box-shadow: none !important;
  }
}
```

---

## 5. Common Mistakes to Avoid (Do's and Don'ts)

| Bad Practice (Don't) | Good Practice (Do) | Why? |
| :--- | :--- | :--- |
| Forgetting the viewport meta tag in HTML `<head>` | Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | Without this meta tag, mobile smartphones ignore media queries and zoom out to 980px desktop view! |
| Writing overlapping boundaries: `max-width: 768px` and `min-width: 768px` | Use `max-width: 767.98px` and `min-width: 768px` (or modern `<= 767px` and `>= 768px`) | Prevents conflicting styles when a device screen width is exactly 768px. |
| Hardcoding media queries for specific phone brands (iPhone 14 query) | Base breakpoints on your content layout needs, not device names | Thousands of Android and Apple phones exist with different pixel ratios. |
| Overusing `!important` inside media queries | Structure your stylesheet cascade logically | Media queries placed lower in the stylesheet naturally override earlier rules. |

---

## 6. Quick Revision Summary (Cheat Sheet)

* **`min-width: 768px`**: Styles apply from 768px upward (Mobile-First enhancement).
* **`max-width: 767px`**: Styles apply from 767px downward (Desktop-First constraint).
* **Level 4 Range Syntax**: `@media (width >= 768px)` and `@media (600px <= width <= 900px)` provide clean mathematical notation.
* **Logical Operators**: `and` requires all conditions to match; comma `,` acts as `or`.
* **Print Stylesheets**: Use `@media print` to hide navigation bars, buttons, and dark backgrounds when printing documents.

---

# Multiple Choice Questions

### 1. Which HTML tag is strictly required inside `<head>` for CSS media queries to function properly on mobile devices?
A. `<meta name="robots" content="index">`
B. `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
C. `<meta charset="UTF-8">`
D. `<link rel="responsive" href="style.css">`
**Answer:** B
**Explanation:** The viewport meta tag tells mobile browsers to match screen dimensions to CSS pixels at a 1:1 scale rather than simulating a 980px desktop screen.

---

### 2. Under modern CSS Media Queries Level 4, what is the shorthand equivalent of `@media (min-width: 1024px)`?
A. `@media (width >= 1024px)`
B. `@media (width == 1024px)`
C. `@media (width =< 1024px)`
D. `@media (screen: 1024px)`
**Answer:** A
**Explanation:** Media Queries Level 4 allows standard comparison operators; width >= 1024px is identical to min-width: 1024px.

---

### 3. If you want styles to apply ONLY to screen sizes between 600px and 900px inclusive, which query is correct?
A. `@media (min-width: 600px) or (max-width: 900px)`
B. `@media (600px <= width <= 900px)`
C. `@media (width: 600px to 900px)`
D. `@media (min-width: 900px) and (max-width: 600px)`
**Answer:** B
**Explanation:** Modern range syntax permits chaining minimum and maximum boundaries: (600px <= width <= 900px).

---

### 4. In a media query, which character acts as the logical `OR` operator between conditions?
A. Ampersand (`&`)
B. Pipe (`|`)
C. Comma (`,`)
D. Plus (`+`)
**Answer:** C
**Explanation:** In CSS media queries, a comma-separated list of media queries acts as a logical OR (if either query evaluates to true, the block applies).

---

### 5. What is the primary purpose of writing an `@media print` stylesheet block?
A. To print text automatically onto the user's screen
B. To format the webpage specifically for physical paper printing, hiding ads, menus, and dark backgrounds
C. To accelerate page rendering by 200%
D. To download a PDF copy to the desktop
**Answer:** B
**Explanation:** @media print targets the printed paper output, stripping away interactive navigation menus and background colors to conserve ink and ensure document readability.

---

## 7. Hands-on Practice Challenge: The School Student Identity Card

Create a responsive and printable School Student Identity Card:
1. On desktop screens (`width >= 768px`), display the card horizontally with the student photo on the left and credentials on the right.
2. On mobile screens (`width < 768px`), stack the photo on top of the text details.
3. Include an `@media print` stylesheet that removes the dark background, hides the "Print ID Card" button, and centers a crisp, black-and-white card for physical printing!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student ID Card - Media Query Lab</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .id-wrapper {
      max-width: 600px;
      width: 100%;
    }

    /* 1. BASE ID CARD (Desktop Layout) */
    .id-card {
      background-color: #1e293b;
      border: 2px solid #3b82f6;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .student-photo {
      width: 120px;
      height: 140px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3.5rem;
      flex-shrink: 0;
      border: 2px solid #60a5fa;
    }

    .id-details {
      flex: 1;
    }

    .school-crest {
      font-size: 0.8rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }

    .student-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .id-meta {
      font-size: 0.9rem;
      color: #cbd5e1;
      line-height: 1.6;
    }

    .btn-print {
      margin-top: 20px;
      background-color: #2563eb;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* 2. MODERN LEVEL 4 RANGE SYNTAX: MOBILE PHONE COLLAPSE */
    @media (width < 768px) {
      .id-card {
        flex-direction: column; /* Stack photo above details */
        text-align: center;
        padding: 20px;
      }

      .student-photo {
        width: 100px;
        height: 120px;
      }
    }

    /* 3. PRINT STYLESHEET (Physical Paper Output) */
    @media print {
      body {
        background-color: transparent !important;
        color: #000000 !important;
      }

      .btn-print {
        display: none !important; /* Hide button on paper! */
      }

      .id-card {
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 2px solid #000000 !important;
        box-shadow: none !important;
      }

      .student-name {
        color: #000000 !important;
      }

      .id-meta {
        color: #333333 !important;
      }

      .school-crest {
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>

  <div class="id-wrapper">
    <div class="id-card">
      <div class="student-photo">👨‍🎓</div>
      <div class="id-details">
        <div class="school-crest">Delhi Public School &bull; RK Puram</div>
        <h2 class="student-name">Anmol Saxena</h2>
        <div class="id-meta">
          <div><strong>Roll No:</strong> DPS-2026-4412</div>
          <div><strong>Class & Sec:</strong> 11-A (Science Stream)</div>
          <div><strong>Blood Group:</strong> O +ve &bull; <strong>Valid Till:</strong> Mar 2027</div>
        </div>
      </div>
    </div>

    <button class="btn-print" onclick="window.print()">🖨️ Print Student ID</button>
  </div>

</body>
</html>
```
