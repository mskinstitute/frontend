---
id: html-headings
slug: html-headings
course: html5-complete-course
chapter: 2
topic: 2.1
title: HTML Headings
description: Learn how to use heading tags from h1 to h6, structure webpage outlines, and follow golden SEO rules in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 1
keywords:
  - html headings
  - h1 to h6
  - heading hierarchy
  - seo headings
  - html text basics
  - html for school students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML Headings (`<h1>` to `<h6>`)

Welcome to Chapter 2: **Heading & Paragraphs**! 📰

Imagine picking up a morning newspaper like *The Times of India* or opening your Science textbook. What is the very first thing your eyes notice?
- The **Big Bold Headline** at the top of the page!
- Then the smaller section titles.
- And finally, the detailed story paragraphs.

In HTML, we use **Heading Tags** to create clear titles and subtitles. Headings organize your webpage into neat sections so that readers and search engines (like Google) can understand what your page is about within seconds.

---

# The Six Heading Levels in HTML

HTML gives us **6 levels of headings**, ranging from `<h1>` down to `<h6>`:

```html
<h1>Heading 1 - Most Important Title</h1>
<h2>Heading 2 - Major Section Title</h2>
<h3>Heading 3 - Sub-section Heading</h3>
<h4>Heading 4 - Minor Heading</h4>
<h5>Heading 5 - Small Sub-heading</h5>
<h6>Heading 6 - Least Important Heading</h6>
```

### What Happens in the Browser?
- `<h1>` produces the **largest and boldest** text on the page.
- As the number increases from `1` to `6`, the text size becomes progressively smaller.
- `<h6>` produces the **smallest** heading.

---

# Real-Life Analogy: School Hierarchy

To easily remember when to use which heading, think of your **School Administration**:

```text
🏛️ THE SCHOOL HIERARCHY ANALOGY:

<h1>  Principal               (The one and only chief of the school)
 ├── <h2>  Head of Department (Science, Commerce, Arts)
 │    ├── <h3>  Class Teacher (Class 10A, Class 10B)
 │    │    └── <h4>  Subject Topics (Physics, Chemistry)
```

In the exact same way on a webpage:
- `<h1>` is the **Main Title** of the entire page.
- `<h2>` defines the **Main Sections**.
- `<h3>` defines **Subsections** inside an `<h2>`.
- `<h4>` to `<h6>` are used for smaller sub-topics if needed.

---

# Comparison Table: Heading Levels & Usage

| Tag | Importance | Relative Size | Practical Example |
|---|---|---|---|
| `<h1>` | **Top Priority** (Highest) | Largest | Main title of your article or website page |
| `<h2>` | High | Large | Chapter title or major topic heading |
| `<h3>` | Medium | Medium-large | Sub-topic under a chapter |
| `<h4>` | Normal | Medium | Minor points or sidebar titles |
| `<h5>` | Low | Small | Footer widget titles or fine print headings |
| `<h6>` | **Lowest Priority** | Smallest | Rarely used; smallest sub-notes |

---

# Complete Code Example

Here is how headings and paragraphs work together to create a structured school article:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Solar System Guide</title>
</head>
<body>

  <!-- Main Title: Only ONE per page -->
  <h1>The Solar System and Our Universe</h1>

  <!-- Section 1 -->
  <h2>The Inner Rocky Planets</h2>
  <h3>Planet Mercury</h3>
  <p>Mercury is the closest planet to the Sun and the smallest planet in our solar system.</p>

  <h3>Planet Venus</h3>
  <p>Venus is the hottest planet in our solar system because of its thick atmosphere.</p>

  <!-- Section 2 -->
  <h2>The Outer Gas Giants</h2>
  <h3>Planet Jupiter</h3>
  <p>Jupiter is the largest planet in our solar system, famous for its Great Red Spot.</p>

</body>
</html>
```

Notice how clean, organized, and easy to read this structure is! Anyone reading this page can instantly understand the hierarchy.

---

# 4 Golden Rules for Using Headings (Best Practices)

To write clean, professional code that ranks high on Google, always follow these four rules:

### 1. Use Only ONE `<h1>` Per Webpage ⚠️
- Every webpage should have **only one** `<h1>` tag representing the primary topic of the document.
- Think of `<h1>` like the title printed on the cover of a notebook. A notebook only has one main title on the cover!
- Using 5 or 6 different `<h1>` tags on one page confuses Google and hurts your SEO ranking.

### 2. Never Skip Heading Levels
- Always follow a natural step-by-step staircase:
  - ✅ Correct: `<h1>` ➔ `<h2>` ➔ `<h3>`
  - ❌ Wrong: `<h1>` ➔ `<h4>` *(Do not jump directly from h1 to h4!)*
- Maintain a proper outline hierarchy.

### 3. Do NOT Use Headings Just for Big or Bold Text
- Many beginners use `<h1>` simply because they want some random sentence to look big.
- **Never do this!** Headings are meant for structure and titles, not for styling.
- If you just want big text, use a paragraph `<p>` and make it big with CSS styling or use `<b>` for bold text.

### 4. Keep Headings Short and Clear
- A heading should be a punchy title (usually 3 to 8 words). Never put full paragraphs of text inside an `<h1>` or `<h2>` tag!

---

# Common Beginner Mistakes to Avoid

1. ⚠️ **Forgetting to Close a Heading Tag:**
   ```html
   <!-- WRONG: All text below will accidentally turn into a huge heading! -->
   <h1>My Daily Routine
   <p>I wake up at 6 AM.</p>

   <!-- CORRECT -->
   <h1>My Daily Routine</h1>
   <p>I wake up at 6 AM.</p>
   ```

2. ⚠️ **Using `<h7>`, `<h8>`, or `<h0>`:**
   - HTML only supports headings from `<h1>` to `<h6>`. There is no `<h7>` or `<h0>`.

3. ⚠️ **Putting Links Around Whole Headings Incorrectly:**
   ```html
   <!-- CORRECT: Put the link inside the heading -->
   <h2><a href="https://example.com">Read More News</a></h2>
   ```

---

# Quick Summary

- ✅ HTML provides **6 heading levels**: `<h1>` (highest) down to `<h6>` (lowest).
- ✅ Headings give structure and an outline to your webpage.
- ✅ Always use **exactly one `<h1>`** per page for the main title.
- ✅ Never skip heading levels (e.g., do not jump from `<h1>` directly to `<h3>`).
- ✅ Use headings for titles and structure, **not just to make text look big**.
- ✅ Always close your heading tags (`</h1>`, `</h2>`).

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which HTML heading tag represents the highest level of importance?
A. `<h0>`
B. `<h6>`
C. `<h1>`
D. `<header>`
**Answer:** C

---

### 2. How many `<h1>` tags should you ideally use on a single webpage?
A. As many as possible
B. Exactly one
C. At least five
D. None
**Answer:** B

---

### 3. What is wrong with the following code snippet?
```html
<h1>Welcome to My Blog</h1>
<h4>Latest News</h4>
```
A. You cannot use text inside h1
B. The code skipped h2 and h3 levels directly to h4
C. h4 is not a valid HTML tag
D. Headings cannot follow each other
**Answer:** B

---

### 4. Why should you NOT use heading tags like `<h1>` or `<h2>` just to make text bold or big?
A. It causes the computer to shut down
B. Headings define document structure for Google SEO and screen readers; use CSS or font styling for appearance
C. Browsers charge money for each heading
D. Headings can only be used once a year
**Answer:** B

---

### 5. What is the smallest, least important standard HTML heading level?
A. `<h10>`
B. `<h6>`
C. `<h0>`
D. `<h12>`
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open VS Code and open your `index.html` file.
2. Clear the contents inside `<body>` and create a structured page about **Your Favorite Sport**:
   - Add an `<h1>` with the sport's name (e.g., `Cricket: India's Favorite Sport`).
   - Add an `<h2>` for `Basic Rules`.
   - Add two `<h3>` tags under it for `Batting Rules` and `Bowling Rules` with short paragraph explanations.
   - Add another `<h2>` for `Famous Players`.
3. Save your file (`Ctrl + S`) and check how neatly your browser displays the hierarchy! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Paragraphs & Line Breaks** (Heading & Paragraphs).

👉 **[Continue to Next Lesson: Paragraphs & Line Breaks →](/tutorials/html5-complete-course/paragraphs-line-breaks)**
