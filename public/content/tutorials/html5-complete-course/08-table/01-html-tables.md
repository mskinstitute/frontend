---
id: html-tables
slug: html-tables
course: html5-complete-course
chapter: 8
topic: 8.1
title: HTML Tables
description: Learn how to organize data into neat rows and columns using HTML tables, table headers (th), table data (td), captions, thead, tbody, and tfoot in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 1
keywords:
  - html tables
  - table tag
  - tr tag
  - th tag
  - td tag
  - thead tbody tfoot
  - table caption
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML Tables (Rows, Columns & Data Grids) 📊

Welcome to Chapter 8: **Tables in HTML**!

Look at the classroom wall or your school diary. What is pinned on the softboard?
- Your **Weekly Class Timetable** (Monday to Saturday periods).
- Your **Term Examination Date Sheet** (Dates, Timing, and Subject names).
- Your **Annual School Report Card / Marksheet** (Subject, Maximum Marks, Marks Obtained, Grade).
- An **IPL Cricket Points Table** (Matches Played, Won, Lost, Points, Net Run Rate).

All of these are real-world examples of **Tabular Data**!

When information is arranged into clean horizontal rows and vertical columns, our eyes can compare numbers and read facts in a split second.

In this lesson, you will learn how to build clean, professional data tables using HTML!

---

# The Grid Concept: Rows, Columns & Cells 📐

Before writing code, let's understand how a table is constructed:

```text
               Column 1        Column 2        Column 3
                  │               │               │
                  ▼               ▼               ▼
 Row 1 ──► ┌──────────────┬──────────────┬──────────────┐
           │ Subject      │ Max Marks    │ Marks Scored │  <── Header Row
 Row 2 ──► ├──────────────┼──────────────┼──────────────┤
           │ Mathematics  │ 100          │ 95           │  <── Data Row
 Row 3 ──► ├──────────────┼──────────────┼──────────────┤
           │ Science      │ 100          │ 92           │  <── Data Row
           └──────────────┴──────────────┴──────────────┘
                                  ▲
                                  │
                 A single box inside is called a CELL
```

- **Row (Horizontal ➡️):** Goes from left to right.
- **Column (Vertical ⬇️):** Goes from top to bottom.
- **Cell (Single Box 📦):** Every small box where a row and column intersect.

---

# The 4 Fundamental Table Tags 🧱

To build any basic table in HTML, you only need four core tags:

| Tag | Full Name | What It Does |
|:---:|---|---|
| **`<table>`** | **Table Container** | The outer box that holds the entire table together. |
| **`<tr>`** | **Table Row** | Creates a new horizontal row from left to right. |
| **`<th>`** | **Table Header** | A special cell for column titles. Text is automatically **bold** and **centered**! |
| **`<td>`** | **Table Data** | A normal cell holding regular information. Text is regular and left-aligned. |

---

# Writing Your Very First HTML Table

Let's build a simple student report card table:

```html
<table border="1">
  <!-- Row 1: Column Headings -->
  <tr>
    <th>Subject</th>
    <th>Max Marks</th>
    <th>Marks Obtained</th>
    <th>Grade</th>
  </tr>

  <!-- Row 2: Mathematics -->
  <tr>
    <td>Mathematics</td>
    <td>100</td>
    <td>98</td>
    <td>A1</td>
  </tr>

  <!-- Row 3: Science -->
  <tr>
    <td>Science</td>
    <td>100</td>
    <td>94</td>
    <td>A1</td>
  </tr>

  <!-- Row 4: English -->
  <tr>
    <td>English</td>
    <td>100</td>
    <td>89</td>
    <td>A2</td>
  </tr>
</table>
```

### Notice the 3 Golden Rules Here:
1. Every row starts with **`<tr>`** and ends with **`</tr>`**.
2. The top row uses **`<th>`** tags because they are column headings.
3. The data rows underneath use **`<td>`** tags for regular numbers and text.

---

# Why Did We Add `border-collapse: collapse`? 🪄

By default, old HTML tables put a tiny annoying double gap between cell borders (it looks like two parallel lines around every box).

To fix this and make your table look clean and modern like a real school marksheet, developers always add this magic CSS line:

```css
table {
  border-collapse: collapse; /* Collapses double borders into single neat lines! */
}
```

---

# Semantic Structure Tags: `<thead>`, `<tbody>`, `<tfoot>` & `<caption>` 🏛️

When professional developers and school examination portals build large tables, they divide them into three logical sections—just like a human body has a **Head**, a **Body**, and **Feet**:

```text
    ┌──────────────────────────────────────────────┐
    │  <caption> Table Title / Description </caption>│
    ├──────────────────────────────────────────────┤
    │  <thead>   Column Headings (th)        </thead>│
    ├──────────────────────────────────────────────┤
    │  <tbody>   Actual Data Rows (td)       </tbody>│
    ├──────────────────────────────────────────────┤
    │  <tfoot>   Totals, Averages, Summary   </tfoot>│
    └──────────────────────────────────────────────┘
```

### 1. `<caption>` (The Table Title)
A caption is the official title of the table. It must be placed immediately after the opening `<table>` tag. Screen readers for visually impaired students read the caption first so they know what the table is about!

### 2. `<thead>` (Table Head)
Encloses the header row containing your `<th>` elements. If your table is printed on paper across 5 pages, modern browsers repeat `<thead>` at the top of every printed page!

### 3. `<tbody>` (Table Body)
Wraps all the main rows of your data.

### 4. `<tfoot>` (Table Footer)
Wraps the bottom row showing totals, averages, overall percentages, or remarks.

---

### Complete Semantic Table Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>School Fee Structure</title>
</head>
<body>

  <table border>
    <!-- Caption: Table Title -->
    <caption>MSK School Annual Fee Breakdown (Class 10th)</caption>

    <!-- Table Header -->
    <thead>
      <tr>
        <th>Fee Category</th>
        <th>Frequency</th>
        <th>Amount (₹)</th>
      </tr>
    </thead>

    <!-- Table Body -->
    <tbody>
      <tr>
        <td>Tuition & Lab Fee</td>
        <td>Quarterly</td>
        <td>₹4,500</td>
      </tr>
      <tr>
        <td>Computer Science & Robotics Lab</td>
        <td>Annual</td>
        <td>₹1,500</td>
      </tr>
      <tr>
        <td>Library & Sports Development</td>
        <td>Annual</td>
        <td>₹1,000</td>
      </tr>
    </tbody>

    <!-- Table Footer -->
    <tfoot>
      <tr>
        <td>Total First Quarter Payable</td>
        <td>One Time</td>
        <td>₹7,000</td>
      </tr>
    </tfoot>
  </table>

</body>
</html>
```

---

# An Important Warning: Tables Are NOT for Webpage Layouts! ⚠️

In the late 1990s (when web design was brand new), developers used `<table>` tags to arrange headers, sidebars, and footers on websites. 

> 🚫 **Never use tables for page layouts today!**
> - Tables are heavy and slow to load for layout purposes.
> - They break on mobile phones and small smartphone screens.
> - Page layouts must **always** be built using modern CSS tools like **Flexbox** and **CSS Grid**.
> - **Only use `<table>` when you have real tabular data** (numbers, schedules, timetables, comparison lists)!

---

# Common Beginner Mistakes (And How to Avoid Them) ⚠️

### 1. ⚠️ Writing `<td>` directly inside `<table>` without a `<tr>`
You cannot drop data cells floating inside a table! They must always live inside a row (`<tr>`).
```html
<!-- ❌ WRONG: Missing <tr> wrapper -->
<table>
  <td>Item 1</td>
  <td>Item 2</td>
</table>

<!-- ✅ CORRECT: Wrapped in <tr> -->
<table>
  <tr>
    <td>Item 1</td>
    <td>Item 2</td>
  </tr>
</table>
```

### 2. ⚠️ Confusing `<th>` with `<thead>`
- **`<th>`** is a single **cell tag** (replaces `<td>` for headers).
- **`<thead>`** is a **section wrapper tag** that wraps an entire header `<tr>`.

### 3. ⚠️ Unbalanced Columns
If your top header row has 4 columns (`<th>`), every data row underneath should also have 4 cells (`<td>`). If one row has only 2 cells, your table will look broken and misaligned!

---

# Quick Summary

- ✅ HTML tables are created using the **`<table>`** container tag.
- ✅ Tables are organized in horizontal rows using **`<tr>` (Table Row)** tags.
- ✅ Use **`<th>` (Table Header)** for column titles (automatically bold and centered).
- ✅ Use **`<td>` (Table Data)** for regular data cells (regular left-aligned text).
- ✅ Add **`border-collapse: collapse;`** in CSS to merge double borders into neat single lines.
- ✅ Semantic tables use **`<caption>`** for the title, **`<thead>`** for headings, **`<tbody>`** for data rows, and **`<tfoot>`** for summary/totals.
- ✅ Tables should **only** be used for tabular data, never for webpage layouts.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which tag creates a new horizontal row inside an HTML table?
A. `<row>`
B. `<td>`
C. `<tr>`
D. `<th>`
**Answer:** C

---

### 2. What is the difference between `<th>` and `<td>`?
A. `<th>` is for images, `<td>` is for text
B. `<th>` text is bold and centered by default, while `<td>` text is normal and left-aligned
C. `<th>` can only be used once per table
D. `<td>` creates rows, `<th>` creates columns
**Answer:** B

---

### 3. Which tag should be used as the very first child of a `<table>` to provide an accessible title?
A. `<title>`
B. `<header>`
C. `<caption>`
D. `<heading>`
**Answer:** C

---

### 4. Which CSS property eliminates the gap between table cell borders to create single clean lines?
A. `border-style: single;`
B. `border-collapse: collapse;`
C. `border-spacing: none;`
D. `border-merge: true;`
**Answer:** B

---

### 5. Why should you NOT use `<table>` tags to design a website's overall page layout?
A. Tables are prohibited by law
B. Browsers will refuse to open the page
C. Tables are not responsive for mobile devices and harm web accessibility
D. Tables turn all text blue
**Answer:** C

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`my-report-card.html`**.

### Your Challenge:
Create your own professional School Annual Examination Marksheet:
1. Add a `<caption>` with: *"Class 10 Annual Examination Marksheet 2026"*.
2. Wrap column headings inside `<thead>` with columns: `Subject`, `Max Marks`, `Marks Scored`, and `Result`.
3. Add 4 subjects in `<tbody>` (e.g. Maths, Science, English, Social Science).
4. Add a `<tfoot>` row calculating the **Total Marks** (e.g. 400) and **Grand Total Scored**.
5. Style it with `border-collapse: collapse;` and add nice padding so the marksheet looks crisp and clean!
6. Open your marksheet in your browser and check your score!

---

**Next Up:** In Topic 8.2, we will explore **Colspan & Rowspan** &mdash; how to merge cells horizontally and vertically like a spreadsheet master!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Colspan & Rowspan** (Table).

👉 **[Continue to Next Lesson: Colspan & Rowspan →](/tutorials/html5-complete-course/colspan-rowspan)**
