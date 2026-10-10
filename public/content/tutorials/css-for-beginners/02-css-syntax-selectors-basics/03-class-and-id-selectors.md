---
id: class-and-id-selectors
slug: class-and-id-selectors
course: css-for-beginners
chapter: 2
topic: 2.3
title: Class and ID Selectors
description: Master Class (.classname) and ID (#idname) selectors in CSS. Understand reusability, uniqueness, specificity, and multi-class styling with Indian school house badges and Aadhaar card analogies.
difficulty: Beginner
readingTime: 9
order: 6
keywords:
  - class selector
  - id selector
  - css classes
  - css id
  - class vs id
  - specificity
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Class and ID Selectors

In the previous lesson, you saw that an **Element Selector** (like `p { color: blue; }`) styles *every single paragraph* on your page.

But what if you have 10 paragraphs on a page, and you want:
- 8 paragraphs to stay normal dark gray,
- 1 paragraph to have a yellow warning box, and
- 1 paragraph to have a green success message?

Element selectors cannot do this! This is where **Class Selectors** and **ID Selectors** become your best friends. 🚀

---

# The Indian School Analogy: House Badges vs Aadhaar Cards 🏷️

To never get confused between a Class and an ID, remember this simple mental model:

```text
+-------------------------------------------------------------------------+
|                  CLASS vs ID: THE SCHOOL ANALOGY                        |
+-------------------------------------------------------------------------+
| CLASS SELECTOR (.dot)       --> THE SCHOOL HOUSE BADGE                  |
|                                 (Red House / Shivaji House)             |
| • Many different students can wear the same Red House badge.            |
| • One student can wear multiple badges (e.g., Red House + Sports Cap).  |
| • Reusable across many elements on the page.                            |
|                                                                         |
| ID SELECTOR (#hash)         --> THE STUDENT ROLL NUMBER / AADHAAR CARD  |
|                                 (Roll No: 1042 / Aadhaar ID)            |
| • Strictly UNIQUE to one single person in the entire school.            |
| • No two elements on the same webpage should ever have the same ID.     |
+-------------------------------------------------------------------------+
```

---

# 1. The Class Selector (`.classname`)

A **Class Selector** targets one or more HTML elements that share a specific `class` attribute.

### How to Write a Class in HTML and CSS:
1. In your **HTML**, add the `class` attribute:
   ```html
   <p class="highlight">This is an urgent announcement!</p>
   ```
2. In your **CSS**, prefix the class name with a **period (dot `.` )**:
   ```css
   .highlight {
     background-color: #fef08a;
     color: #854d0e;
     padding: 8px 12px;
     border-radius: 6px;
   }
   ```

> ⚠️ **Crucial Rule:**
> In CSS, you write a dot: `.highlight`.  
> In HTML, you **DO NOT** write a dot: `class="highlight"` (never `class=".highlight"`).

### Reusability: The Superpower of Classes
You can apply the exact same class to completely different HTML tags!
```html
<h1 class="text-center">Annual Sports Meet</h1>
<p class="text-center">Friday, 10th October at the Main Stadium</p>
<button class="text-center">Download Schedule</button>
```
```css
.text-center {
  text-align: center;
}
```
All three elements will automatically be centered!

### Multi-Class Styling (Mixing & Matching)
An HTML element can have **multiple classes at the same time**. Separate each class name with a simple space:

```html
<!-- One button using two classes -->
<button class="btn btn-success">Submit Application</button>
<button class="btn btn-danger">Cancel</button>
```

```css
/* Base styling for all buttons */
.btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* Specific color theme classes */
.btn-success {
  background-color: #16a34a;
  color: white;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}
```
This multi-class pattern is used by top frameworks like Bootstrap and Tailwind CSS!

---

# 2. The ID Selector (`#idname`)

An **ID Selector** targets **one unique HTML element** on the page that has a matching `id` attribute.

### How to Write an ID in HTML and CSS:
1. In your **HTML**, add the `id` attribute:
   ```html
   <header id="main-header">
     <h1>MSK Institute</h1>
   </header>
   ```
2. In your **CSS**, prefix the ID name with a **hash symbol (`#`)**:
   ```css
   #main-header {
     background-color: #1e3a8a;
     color: white;
     padding: 24px;
     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }
   ```

### ⚠️ Strict Rules for IDs:
1. **Uniqueness:** An ID name can be used **only once per HTML page**. Having two elements with `id="submit-btn"` is invalid HTML!
2. **One ID per element:** An element cannot have multiple IDs (unlike classes).
3. **Naming rules:** ID and Class names cannot start with a number (e.g. `#1header` is invalid; use `#header-1` instead).

---

# Class vs ID: Head-to-Head Comparison

| Feature | Class Selector | ID Selector |
|---|---|---|
| **CSS Symbol** | Period / Dot (`.card`) | Hash / Pound (`#header`) |
| **HTML Attribute** | `class="card"` | `id="header"` |
| **How many elements can have it?** | Unlimited elements on the page | **Only 1 unique element** on the page |
| **Can one element have multiple?** | Yes (`class="btn btn-large btn-blue"`) | No (Only 1 ID per element) |
| **Specificity (Priority)** | Medium priority | **High priority** (Overrides classes) |
| **Best Used For** | Reusable components (cards, buttons, alerts) | Unique landmarks (header, footer, modal container) |

---

# The Specificity Showdown (Who Wins?)

What happens if an element has **both** an ID and a Class rule that specify conflicting text colors?

```html
<p id="special-note" class="warning-note">Admissions close at 5:00 PM today.</p>
```

```css
.warning-note {
  color: orange;
}

#special-note {
  color: red;
}
```

### The Winner is: **ID Selector (`color: red;`)** 🏆

Because an ID is unique to a single element, the browser considers it much more specific than a class. An ID rule will always beat a class rule, no matter what order they are written in your stylesheet!

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| `<div class=".card">` | `<div class="card">` | The dot (`.`) belongs in the CSS file, never inside the HTML attribute. |
| Using the same `id="nav"` on 3 different menus. | Use `class="nav"` on all 3 menus. | IDs must be strictly unique per webpage. |
| Giving an element multiple IDs: `id="main top"`. | Use multiple classes: `class="main top"`. | HTML only allows a single value inside `id="..."`. |
| `.1st-box { ... }` *(Starts with a number)* | `.first-box` or `.box-1 { ... }` | CSS class and ID names must not start with a digit. |

---

# Quick Revision Summary

- ✅ A **Class Selector** starts with a dot (`.`) in CSS and is reusable on multiple elements.
- ✅ An **ID Selector** starts with a hash (`#`) in CSS and must be unique to one element on the page.
- ✅ In HTML attributes, never include the dot or hash (write `class="card"`, not `class=".card"`).
- ✅ An element can have multiple classes separated by spaces (`class="badge badge-success"`).
- ✅ In a specificity battle, **ID rules override Class rules**.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which symbol is used in a CSS file to select an element by its class name?
A. `#`
B. `.`
C. `*`
D. `@`
**Answer:** B

---

### 2. Which of the following statements about ID selectors is completely TRUE?
A. An ID name must begin with a number
B. Multiple elements on the same webpage should share the exact same ID
C. An ID must be unique to only one element per webpage
D. ID rules have lower priority than element selectors
**Answer:** C

---

### 3. Which HTML snippet correctly assigns two different classes to a single button?
A. `<button class="btn, btn-primary">`
B. `<button class="btn" class="btn-primary">`
C. `<button class="btn btn-primary">`
D. `<button class=".btn .btn-primary">`
**Answer:** C

---

### 4. In a CSS file, which selector matches the HTML tag `<div id="profile-card">`?
A. `.profile-card`
B. `profile-card`
C. `#profile-card`
D. `*profile-card`
**Answer:** C

---

### 5. If an element has `class="text-blue"` (setting blue text) and `id="title"` (setting red text), what color will the text display?
A. Blue
B. Red
C. Purple (a mix of red and blue)
D. Black (Browser Default)
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `school-cards.html`.
2. Create 3 student profile cards with the following HTML:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Student House Badges</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         background-color: #f1f5f9;
         padding: 30px;
       }

       /* Base card class (reused by all 3 cards) */
       .card {
         background-color: white;
         border-radius: 8px;
         padding: 16px;
         margin-bottom: 16px;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
       }

       /* House color badge classes */
       .red-house {
         border-left: 6px solid #dc2626;
       }

       .blue-house {
         border-left: 6px solid #2563eb;
       }

       .green-house {
         border-left: 6px solid #16a34a;
       }

       /* Unique Head Girl badge using ID */
       #head-girl {
         background-color: #fefce8;
         border: 2px dashed #ca8a04;
       }
     </style>
   </head>
   <body>
     <h1>Student Council 2026</h1>

     <div class="card red-house" id="head-girl">
       <h3>Priya Sharma</h3>
       <p>Role: Head Girl | House: Shivaji (Red)</p>
     </div>

     <div class="card blue-house">
       <h3>Aman Verma</h3>
       <p>Role: Sports Captain | House: Tagore (Blue)</p>
     </div>

     <div class="card green-house">
       <h3>Neha Patel</h3>
       <p>Role: Cultural Secretary | House: Ashoka (Green)</p>
     </div>
   </body>
   </html>
   ```
3. Open the file in your browser. Notice how:
   - All three cards share the base `.card` styling.
   - Each card gets its house stripe using a secondary class (`.red-house`, `.blue-house`, `.green-house`).
   - Priya Sharma's card gets a golden border and warm yellow background thanks to its unique `#head-girl` ID! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Grouping and Combinator Selectors** (CSS Syntax & Selectors Basics).

👉 **[Continue to Next Lesson: Grouping and Combinator Selectors →](/tutorials/css-for-beginners/grouping-and-combinator-selectors)**
