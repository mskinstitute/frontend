---
id: colspan-rowspan
slug: colspan-rowspan
course: html5-complete-course
chapter: 8
topic: 8.2
title: Colspan & Rowspan
description: Master merging table cells horizontally and vertically using the colspan and rowspan attributes with fun school timetable and invoice examples in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - colspan
  - rowspan
  - merge cells html
  - html tables
  - table layout
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Colspan & Rowspan (Merging Cells Like a Pro) 🧩

Welcome back! In the previous lesson, you learned how to create a basic table using `<table>`, `<tr>`, `<th>`, and `<td>`.

Now, imagine looking at your school's **Weekly Class Timetable**:
- On Friday afternoon, Periods 4 and 5 are combined into one single, extended **Double Robotics & Computer Lab** session!
- Every day at 12:00 PM, all classes pause for the **Lunch Break**. The lunch break doesn't need 6 separate little boxes; it stretches across the entire day as one big continuous banner!

In spreadsheet apps like Microsoft Excel or Google Sheets, this feature is called **"Merge Cells"**.

In HTML, we don't have a "Merge" button. Instead, we have two powerful attributes:
1. **`colspan` (Column Span):** Merges cells **horizontally** across multiple columns (left to right ↔️).
2. **`rowspan` (Row Span):** Merges cells **vertically** down multiple rows (top to bottom ↕️).

Let's master how to use both without messing up your table layout!

---

# 1. The `colspan` Attribute (Horizontal Merging ↔️)

The word **`colspan`** stands for **Column Span**. 

It tells the browser: *"Hey, make this single cell stretch wider so it occupies the space of multiple columns!"*

$$\text{colspan="number\_of\_columns"}$$

### The Cardinal Rule of `colspan`:
If a normal row has **3 columns**, and you tell one cell to take up **2 columns** (`colspan="2"`), your row already has:
$$2 + 1 = 3\text{ columns worth of space!}$$

Therefore, you **must delete one `<td>`** from that row! If you forget to delete it, that row will have an extra box sticking out of the table edge like a crooked brick!

---

### Visualizing `colspan`:

```text
Row 1:  [  Subject  ] [  Max Marks  ] [ Marks Scored ]  <── 3 normal columns
        ──────────────────────────────────────────────
Row 2:  [        Grand Total Marks        ] [  192   ]  <── colspan="2" + 1 cell = 3!
        └────────────────┬────────────────┘
                         ▲
                 Stretches across 2 columns!
```

### Code Example: Total Marks Row

```html
<table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
  <tr>
    <th style="padding: 8px;">Subject</th>
    <th style="padding: 8px;">Max Marks</th>
    <th style="padding: 8px;">Marks Obtained</th>
  </tr>
  <tr>
    <td style="padding: 8px;">Mathematics</td>
    <td style="padding: 8px;">100</td>
    <td style="padding: 8px;">98</td>
  </tr>
  <tr>
    <td style="padding: 8px;">Science</td>
    <td style="padding: 8px;">100</td>
    <td style="padding: 8px;">94</td>
  </tr>

  <!-- Footer Row using colspan="2" -->
  <tr style="background-color: #FEF3C7; font-weight: bold;">
    <td colspan="2" style="padding: 8px; text-align: right;">Total Marks Scored:</td>
    <td style="padding: 8px;">192 / 200</td>
  </tr>
</table>
```

Notice how the bottom row only contains **two `<td>` tags**! The first `<td>` has `colspan="2"`, so together they cleanly match the 3 columns above.

---

# 2. The `rowspan` Attribute (Vertical Merging ↕️)

The word **`rowspan`** stands for **Row Span**.

It tells the browser: *"Make this single cell stretch downwards so it spans across multiple rows vertically!"*

$$\text{rowspan="number\_of\_rows"}$$

---

### The Cardinal Rule of `rowspan`:
When a cell in Row 1 has `rowspan="2"`, it reaches down and occupies space in **Row 2**.

Therefore, when you write **Row 2**, you **must write ONE FEWER `<td>`** because that column is already filled by the cell reaching down from above!

### Visualizing `rowspan`:

```text
Row 1:  ┌───────────────┬───────────────┬───────────────┐
        │ Science       │ Theory Exam   │ 68 / 70       │
Row 2:  │ (rowspan="2") ├───────────────┼───────────────┤
        │               │ Practical Lab │ 28 / 30       │  <── Only 2 cells written here!
        └───────────────┴───────────────┴───────────────┘
```

### Code Example: Theory & Practical Marks

```html
<table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
  <tr style="background-color: #0A2540; color: white;">
    <th style="padding: 8px;">Subject</th>
    <th style="padding: 8px;">Exam Type</th>
    <th style="padding: 8px;">Marks Obtained</th>
  </tr>

  <!-- First Row: Science with rowspan="2" -->
  <tr>
    <td rowspan="2" style="padding: 8px; font-weight: bold; background-color: #F1F5F9;">Science</td>
    <td style="padding: 8px;">Theory Paper</td>
    <td style="padding: 8px;">68 / 70</td>
  </tr>

  <!-- Second Row: Notice we DO NOT write the Subject cell here! -->
  <tr>
    <td style="padding: 8px;">Practical Lab</td>
    <td style="padding: 8px;">28 / 30</td>
  </tr>
</table>
```

Look closely at the second `<tr>`. It only has **two `<td>` elements**! The first column is already claimed by `<td rowspan="2">Science</td>` from the row above.

---

# 3. Putting Both Together: School Timetable 🏆

Let's build a real school timetable that uses **both `colspan` and `rowspan`**!

- **`colspan="4"`** for the universal **Lunch Break** that spans all periods.
- **`rowspan="2"`** for a **Double Practical Lab** on Friday.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Class 10 Timetable</title>
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    th, td {
      border: 1px solid #94A3B8;
      padding: 10px;
    }
    th {
      background-color: #0A2540;
      color: white;
    }
    .lunch {
      background-color: #FED7AA;
      font-weight: bold;
      letter-spacing: 2px;
      color: #9A3412;
    }
    .lab {
      background-color: #DBEAFE;
      font-weight: bold;
      color: #1E40AF;
    }
  </style>
</head>
<body>

  <h2>Weekly Class Timetable (Class 10th-B)</h2>

  <table>
    <tr>
      <th>Day</th>
      <th>Period 1</th>
      <th>Period 2</th>
      <th>Period 3</th>
      <th>Period 4</th>
    </tr>

    <!-- Monday Row -->
    <tr>
      <td><strong>Monday</strong></td>
      <td>Mathematics</td>
      <td>English</td>
      <td>Science</td>
      <td>Social Science</td>
    </tr>

    <!-- Tuesday Row -->
    <tr>
      <td><strong>Tuesday</strong></td>
      <td>Hindi</td>
      <td>Mathematics</td>
      <td>Computer Science</td>
      <td>Physical Education</td>
    </tr>

    <!-- Lunch Break Row: Stretches across all 4 periods using colspan="4"! -->
    <tr>
      <td><strong>Daily</strong></td>
      <td colspan="4" class="lunch">🥗 LUNCH BREAK (12:00 PM - 12:45 PM) 🥪</td>
    </tr>

    <!-- Wednesday Row with Double Lab using colspan="2" -->
    <tr>
      <td><strong>Wednesday</strong></td>
      <td>English</td>
      <td>Mathematics</td>
      <td colspan="2" class="lab">🔬 Physics Lab (Double Period)</td>
    </tr>
  </table>

</body>
</html>
```

---

# Pro Tips for Professional Table Styling 🎨

### Tip 1: Zebra Striping (Easy-to-Read Alternate Rows)
When a table has 20 rows of student marks, it is easy for eyes to slip across lines. In CSS, you can color every even row with a soft background using `:nth-child(even)`:

```css
/* Gives alternate rows a gentle light gray tint */
tbody tr:nth-child(even) {
  background-color: #F8FAFC;
}
```

### Tip 2: Hover Highlight
Make rows highlight when the user hovers their mouse:

```css
tbody tr:hover {
  background-color: #F1F5F9;
  cursor: pointer;
}
```

---

# Common Beginner Mistakes (And How to Avoid Them) ⚠️

### 1. ⚠️ The "Pushed-Out Box" Mistake (Forgetting to delete extra cells)
When you add `colspan="2"`, you are adding width. You **must remove** one regular `<td>` from that row. Otherwise, the table will look broken with one cell hanging outside!

### 2. ⚠️ Putting `colspan` or `rowspan` on `<tr>`
Rows cannot span columns. Only individual cells (`<th>` or `<td>`) can have `colspan` or `rowspan`!
```html
<!-- ❌ WRONG: tr cannot have colspan! -->
<tr colspan="3">...</tr>

<!-- ✅ CORRECT: Place on th or td -->
<tr>
  <td colspan="3">...</td>
</tr>
```

### 3. ⚠️ Adding extra cells in rows under a `rowspan`
Remember that `rowspan` pushes down into the row below. If your table has 3 columns and Row 1 spans into Row 2, Row 2 only needs 2 cells!

---

# Quick Summary

- ✅ **`colspan`** merges cells **horizontally** across columns (left to right ↔️).
- ✅ When using `colspan="N"`, you must remove `(N - 1)` cells from that row so the row stays balanced.
- ✅ **`rowspan`** merges cells **vertically** down rows (top to bottom ↕️).
- ✅ When using `rowspan="N"`, subsequent rows covered by the span must contain fewer cells.
- ✅ `colspan` and `rowspan` can **only** be added to `<th>` or `<td>` tags (never to `<tr>`).
- ✅ You can combine both in the same table to build complex schedules, invoices, and timetables.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which attribute is used to merge two or more columns horizontally?
A. `colmerge`
B. `colspan`
C. `rowspan`
D. `colwidth`
**Answer:** B

---

### 2. If a table has 4 columns and you write `<td colspan="3">`, how many more `<td>` cells can you add to that row?
A. 0
B. 1
C. 2
D. 3
**Answer:** B

---

### 3. Which attribute is used to make a cell stretch vertically down across multiple rows?
A. `rowspan`
B. `rowmerge`
C. `colspan`
D. `vertical-align`
**Answer:** A

---

### 4. On which HTML tag can you legally apply the `colspan` attribute?
A. `<table>`
B. `<tr>`
C. `<td>` or `<th>`
D. `<tbody>`
**Answer:** C

---

### 5. If a cell in Row 1 has `rowspan="2"`, how many cells should you omit from the corresponding column in Row 2?
A. 0 cells
B. 1 cell
C. 2 cells
D. 3 cells
**Answer:** B

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`school-sports-schedule.html`**.

### Your Challenge:
Create a "School Annual Sports Day Tournament Schedule":
1. **Header Row:** Create 4 columns: `Time Slot`, `Court / Field`, `Sport Event`, and `Age Category`.
2. **Morning Session:** Add two matches (e.g. Badminton Under-14 and Table Tennis Under-16).
3. **Opening Ceremony Banner:** Use `<td colspan="4">` to create a bold opening ceremony banner across all 4 columns: *"10:00 AM &mdash; Grand Torch Lighting & March Past by Chief Guest"*.
4. **Cricket Match:** A cricket match takes two time slots (11:00 AM - 01:00 PM). Use `<td rowspan="2">` in the Sport Event column to show a 2-hour Double-Slot Cricket Final!
5. Test your file in your browser and make sure all borders align perfectly without any crooked cells!

---

**Congratulations!** You have completed Chapter 8: Tables! You can now organize complex numerical data, marks, and schedules like a professional web developer!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Block vs Inline Elements** (Block & Inline).

👉 **[Continue to Next Lesson: Block vs Inline Elements →](/tutorials/html5-complete-course/block-vs-inline-elements)**
