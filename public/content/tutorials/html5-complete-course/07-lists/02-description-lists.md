---
id: description-lists
slug: description-lists
course: html5-complete-course
chapter: 7
topic: 7.2
title: Description Lists
description: Master HTML description lists using dl, dt, and dd elements for building school glossaries, student ID cards, metadata, and FAQ sections in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - html description list
  - dl tag
  - dt tag
  - dd tag
  - definition list
  - faq html
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Description Lists (Glossaries, Dictionaries & FAQs) 📖

Welcome back! In the previous lesson, you learned how to create bulleted lists (`<ul>`) and numbered lists (`<ol>`).

Now, open your school Science, History, or Computer textbook and flip to the very last few pages. What do you see?

You will find a special section called the **Glossary** (or **Vocabulary Index**)!
- On the left side, there is a bold term (like **Photosynthesis** or **Algorithm**).
- Right beneath or beside it, there is an indented paragraph explaining what that term means.

Now look at your school **Identity Card (ID Card)**:
- **Student Name:** Aryan Sharma
- **Class & Section:** 10-B
- **Roll Number:** 18
- **House:** Red Warriors
- **Blood Group:** B+

Notice this pattern?
It is not a bulleted shopping list, and it is not a numbered 1-2-3 recipe. It is a list of **Terms** paired directly with their **Descriptions** (also known as **Key-Value Pairs**)!

In HTML, we have a specialized list made specifically for this: the **Description List** (`<dl>`)!

---

# The 3 Musketeers of Description Lists ⚔️

A Description List does **not** use `<li>` (List Item) tags. Instead, it uses three special tags that work together as a team:

| Tag | Full Name | What It Does (The Real-World Role) |
|:---:|---|---|
| **`<dl>`** | **Description List** | The outer wrapper box that encloses the entire glossary or list. |
| **`<dt>`** | **Description Term** | The **Word**, **Title**, or **Question** you are defining. |
| **`<dd>`** | **Description Details** | The **Definition**, **Answer**, or **Explanation** of the term. |

```text
    <dl>                    <─── Outer Box (Description List)
      <dt>HTML</dt>         <─── The Term (Word)
      <dd>Language...</dd>  <─── The Details (Explanation)
    </dl>
```

---

# Basic Syntax & How Browsers Display It 🖥️

Let's look at a simple Computer Science glossary:

```html
<h3>Web Development Glossary</h3>

<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language &mdash; the skeleton and structure of web pages.</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets &mdash; the colors, fonts, and styling of web pages.</dd>

  <dt>JavaScript</dt>
  <dd>The programming language that adds animations and interactivity to websites.</dd>
</dl>
```

### The Magic Indentation:
When you open this code in your web browser, notice something cool:
- The `<dt>` terms appear on the left margin.
- The browser **automatically indents** each `<dd>` explanation inward with a little margin space!

This gives your content a clean, professional dictionary layout without writing any custom CSS!

---

# 3 Real-World Use Cases for School Projects 🏫

Description lists are widely used by professional web designers for three major layouts:

### 1. The Student Profile Card (Metadata & Key-Value Pairs)
Whenever you want to display personal details, game character statistics, or product specifications:

```html
<div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; padding: 20px; border-radius: 8px;">
  <h3 style="color: #0A2540; margin-top: 0;">Student Identity Card</h3>
  
  <dl>
    <dt><strong>Student Name:</strong></dt>
    <dd>Priya Verma</dd>

    <dt><strong>Class & Section:</strong></dt>
    <dd>Class 10th - Section A</dd>

    <dt><strong>School:</strong></dt>
    <dd>MSK Public School, Shikohabad</dd>

    <dt><strong>Favorite Subject:</strong></dt>
    <dd>Computer Science & Mathematics</dd>
  </dl>
</div>
```

---

### 2. Frequently Asked Questions (FAQ Section) ❓
Every modern website has an FAQ section. A description list is the semantic, accessible way to code questions and answers:

```html
<div style="background-color: #FFF; padding: 20px; border-radius: 8px;">
  <h2 style="color: #FF6B00;">Admissions FAQ</h2>

  <dl>
    <dt style="font-weight: bold; color: #1E293B;">Q: What is the age criteria for Class 8 admissions?</dt>
    <dd style="margin-bottom: 15px; color: #475569;">
      Students should be between 12 and 14 years of age as of March 31st.
    </dd>

    <dt style="font-weight: bold; color: #1E293B;">Q: Are computer coding classes included in the fees?</dt>
    <dd style="margin-bottom: 15px; color: #475569;">
      Yes! All enrolled students receive free hands-on web development training in our computer lab.
    </dd>

    <dt style="font-weight: bold; color: #1E293B;">Q: Do students receive a certificate?</dt>
    <dd style="margin-bottom: 15px; color: #475569;">
      Yes, every student receives an official verifiable certificate with a QR code upon completing the course.
    </dd>
  </dl>
</div>
```

---

### 3. Science Lab Formula Sheet 🔬
You can create clean physics and chemistry reference cheat-sheets:

```html
<h3>Physics Fundamentals</h3>

<dl>
  <dt><strong>Newton's First Law (Inertia):</strong></dt>
  <dd>An object remains at rest or in uniform motion unless acted upon by an external force.</dd>

  <dt><strong>Force Equation:</strong></dt>
  <dd>Force = Mass &times; Acceleration (F = m &middot; a)</dd>
</dl>
```

---

# Advanced Powers of Description Lists 🪄

Did you know that you don't always have to write strictly one `<dt>` followed by one `<dd>`? HTML gives you flexibility!

### 1. One Term with Multiple Descriptions (Like a Dictionary Word)
Just like an English dictionary word can have two different meanings:

```html
<dl>
  <dt><strong>Cricket</strong></dt>
  <dd>1. A popular bat-and-ball sport played between two teams of 11 players.</dd>
  <dd>2. A small nocturnal insect famous for making high-pitched chirping sounds.</dd>
</dl>
```

### 2. Multiple Terms Sharing One Description (Synonyms)
When two different words mean the exact same thing:

```html
<dl>
  <!-- Two terms sharing the same definition -->
  <dt><strong>Water</strong></dt>
  <dt><strong>H<sub>2</sub>O</strong></dt>
  <dd>The transparent, odorless, and tasteless liquid essential for all known forms of life.</dd>
</dl>
```

---

# The Grand Comparison: `<ul>` vs `<ol>` vs `<dl>` 🏆

Here is your master cheat-sheet comparing all three HTML list types:

| Feature | Unordered List (`<ul>`) | Ordered List (`<ol>`) | Description List (`<dl>`) |
|---|---|---|---|
| **Primary Meaning** | Order does NOT matter | Sequence / Rank matters | Terms paired with definitions |
| **Child Tags** | `<li>` | `<li>` | `<dt>` and `<dd>` (NO `<li>`) |
| **Default Marker** | Black bullets (`•`) | Numbers (`1.`, `2.`, `3.`) | Indented margin for `<dd>` |
| **Real-Life Example** | Pencil box items, shopping lists | Chai recipe, cricket batting lineup | Science glossary, Student ID, FAQ |
| **Best For** | Bullet points & navigation links | Step-by-step guides & rankings | Dictionaries, profiles, key-value data |

---

# Common Beginner Mistakes (And How to Avoid Them) ⚠️

### 1. ⚠️ Putting `<li>` tags inside `<dl>`
This is the #1 mistake students make! Description lists **never** use `<li>`. They only use `<dt>` and `<dd>`.
```html
<!-- ❌ WRONG: Do not put <li> inside <dl>! -->
<dl>
  <li><dt>HTML</dt></li>
  <li><dd>Language</dd></li>
</dl>

<!-- ✅ CORRECT: Place <dt> and <dd> directly inside <dl> -->
<dl>
  <dt>HTML</dt>
  <dd>Language</dd>
</dl>
```

### 2. ⚠️ Mixing up `<dt>` and `<dd>`
- Remember: **`t`** is for **Term** (the word).
- **`d`** is for **Description** (the explanation).
```html
<!-- ❌ WRONG: Flipped around! -->
<dl>
  <dd>Photosynthesis</dd>
  <dt>The process by which plants make food using sunlight.</dt>
</dl>

<!-- ✅ CORRECT: Term first, then details! -->
<dl>
  <dt>Photosynthesis</dt>
  <dd>The process by which plants make food using sunlight.</dd>
</dl>
```

### 3. ⚠️ Forgetting the parent `<dl>` tag
Never float a `<dt>` or `<dd>` on its own without wrapping it inside a `<dl>...</dl>` container.

---

# Quick Summary

- ✅ A **Description List (`<dl>`)** organizes terms and their matching descriptions (key-value pairs).
- ✅ **`<dt>`** defines the **Description Term** (the word, question, or label).
- ✅ **`<dd>`** defines the **Description Details** (the definition, answer, or value).
- ✅ The web browser automatically indents `<dd>` elements inward for a clean reading layout.
- ✅ Description lists are the standard choice for **glossaries**, **student metadata cards**, and **FAQ sections**.
- ✅ You can have multiple `<dd>` tags for a single `<dt>` (e.g. words with multiple definitions).
- ✅ **Never** use `<li>` tags inside a `<dl>`!

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which tag creates the parent container for a Description List?
A. `<list>`
B. `<dl>`
C. `<dt>`
D. `<def>`
**Answer:** B

---

### 2. What does the `<dt>` tag stand for in HTML?
A. Description Title
B. Description Term
C. Definition Text
D. Document Table
**Answer:** B

---

### 3. What does the `<dd>` tag stand for in HTML?
A. Description Data / Details
B. Definition Document
C. Direct Description
D. Double Data
**Answer:** A

---

### 4. Which of the following tags should NEVER be placed directly inside a `<dl>`?
A. `<dt>`
B. `<dd>`
C. `<li>`
D. `<script>`
**Answer:** C

---

### 5. By default, how does the web browser visually distinguish `<dd>` from `<dt>`?
A. It highlights `<dd>` in yellow
B. It automatically indents `<dd>` with left margin spacing
C. It places a bullet point next to `<dd>`
D. It underlines `<dd>`
**Answer:** B

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`space-glossary.html`**.

### Your Challenge:
Build an "Indian Space Missions Glossary" celebrating ISRO using `<dl>`, `<dt>`, and `<dd>`:
1. **Container:** Create a `<dl>` inside a light gray bordered card.
2. **Chandrayaan-3:** Add the term `<dt>Chandrayaan-3</dt>` and describe its historic soft-landing on the Moon's South Pole in `<dd>`.
3. **Aditya-L1:** Add `<dt>Aditya-L1</dt>` and describe its mission to study the Sun from the Lagrange Point 1 in `<dd>`.
4. **Gaganyaan:** Add `<dt>Gaganyaan</dt>` and explain India's upcoming human spaceflight mission.
5. **Synonym Test:** Add two terms `<dt>ISRO</dt>` and `<dt>Indian Space Research Organisation</dt>` sharing a single `<dd>` explaining the national space agency.
6. Open your file in the browser and admire your clean, professional glossary!

---

**Congratulations!** You have completed Chapter 7: Lists! You are now a master at organizing data with bullet points, numbered rankings, and dictionary glossaries!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **HTML Tables** (Table).

👉 **[Continue to Next Lesson: HTML Tables →](/tutorials/html5-complete-course/html-tables)**
