---
id: attribute-selectors-attr-patterns
slug: attribute-selectors-attr-patterns
course: css-for-intermediate
chapter: 1
topic: 1.1
title: "Attribute Selectors: Targeting Elements with [attr], ^=, $=, and *="
description: Master advanced CSS attribute selectors. Learn how to target elements by presence, exact value, prefix (^=), suffix ($=), and substring (*=) to write cleaner, class-free stylesheets.
difficulty: Intermediate
readingTime: 10
order: 1
keywords:
  - css attribute selectors
  - substring matching
  - input styling
  - ends with selector
  - starts with selector
  - learn css
lastUpdated: 2026-09-10
author: MSK Institute
version: 1.0
---

# Attribute Selectors: Targeting Elements with [attr], ^=, $=, and *=

Welcome to **CSS for Intermediate (Level 2)**! 🚀

In Level 1, you learned how to select elements by tag name (`p`), class name (`.card`), and ID (`#header`).

While classes are great, writing classes for every single variation quickly clutters your HTML:
`<input type="text" class="input input-text input-required input-disabled">` 😵

HTML tags already carry a treasure trove of information inside their **attributes**: `type`, `href`, `target`, `disabled`, `required`, `download`, and custom `data-*` attributes.

With **CSS Attribute Selectors**, you can directly target elements based on what attributes they possess or what text their attributes contain!

In this lesson, you will master:
1. Basic attribute presence selection (`[disabled]`, `[required]`)
2. Exact value matching (`[type="email"]`)
3. The 3 powerful substring matching operators:
   - `^=` (Starts with)
   - `$=` (Ends with)
   - `*=` (Contains anywhere)
4. Case-insensitive matching with the `i` flag
5. Real-world UI patterns: Auto-styling PDF download links and custom form inputs

---

# The School Library Roll-Call Analogy 📚

Imagine a school librarian searching the **Student Admission Database**:

```text
+-------------------------------------------------------------------------+
|                  ATTRIBUTE SELECTORS IN A SCHOOL DATABASE               |
+-------------------------------------------------------------------------+
| 1. [scholarship]  (PRESENCE)                                            |
|    "Find all students who have a scholarship flag on their file,        |
|    regardless of the scholarship amount."                               |
|                                                                         |
| 2. [section="10-A"]  (EXACT MATCH)                                      |
|    "Find students whose class section is EXACTLY '10-A'."               |
|                                                                         |
| 3. [roll^="2026"]  (STARTS WITH: ^=)                                    |
|    "Find all students whose roll number starts with the year '2026'!"   |
|                                                                         |
| 4. [email$="@school.edu"]  (ENDS WITH: $=)                              |
|    "Find all users whose email ends with the official '@school.edu'     |
|    domain extension!"                                                   |
|                                                                         |
| 5. [subjects*="Bio"]  (CONTAINS: *=)                                    |
|    "Find any student who has 'Bio' anywhere in their subject list!"     |
+-------------------------------------------------------------------------+
```

---

# 1. Attribute Presence: `[attribute]`

Matches any element that simply has the specified attribute present, regardless of what its value is:

```css
/* Target any input that has the HTML 'required' attribute */
input[required] {
  border-left: 4px solid #ef4444; /* Red stripe indicating mandatory field */
}

/* Target any button that is disabled */
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #cbd5e1;
}
```

```html
<!-- Automatically gets red left stripe with zero classes! -->
<input type="text" name="student_name" required>

<!-- Automatically dimmed with not-allowed cursor -->
<button disabled>Submit Registration</button>
```

---

# 2. Exact Value Matching: `[attribute="value"]`

Matches elements where the attribute value is an **exact, character-for-character match**:

```css
/* Style text inputs differently from password or checkbox inputs */
input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

/* Style the submit button with brand blue */
input[type="submit"] {
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

---

# 3. The 3 Substring Operators (`^=`, `$=`, `*=`)

Modern websites dynamically generate URLs and IDs. You often cannot predict the exact full string, but you know how it begins, ends, or what word it contains!

### Operator A: Starts With (`^=`)
Matches when the attribute value **begins** with the specified string:

```css
/* Target all external secure HTTPS links */
a[href^="https://"] {
  color: #059669; /* Emerald Green */
}

/* Target telephone links */
a[href^="tel:"] {
  color: #2563eb;
  font-weight: bold;
}
```

---

### Operator B: Ends With (`$=`)
Matches when the attribute value **ends** with the specified string:

This is one of the most beloved tricks in professional web design: **Automatically styling download file links by their extension!**

```css
/* Style PDF document links */
a[href$=".pdf"] {
  color: #dc2626; /* Crimson Red */
  font-weight: 600;
}

/* Add a PDF emoji automatically after the link! */
a[href$=".pdf"]::after {
  content: " 📄 (PDF)";
  font-size: 12px;
}

/* Style Excel spreadsheet downloads */
a[href$=".xlsx"],
a[href$=".csv"] {
  color: #16a34a; /* Excel Green */
}

a[href$=".xlsx"]::after {
  content: " 📊 (Excel)";
  font-size: 12px;
}
```

---

### Operator C: Contains Anywhere (`*=`)
Matches when the specified string appears **anywhere** inside the attribute value:

```css
/* Highlight links leading anywhere to Google (google.com, drive.google.com, docs.google.com) */
a[href*="google"] {
  text-decoration-color: #ea4335;
}

/* Target elements with class names containing 'icon-' */
[class*="icon-"] {
  display: inline-flex;
  align-items: center;
}
```

---

# 4. Case-Insensitive Matching with the `i` Flag

By default, attribute values in CSS can be case-sensitive depending on the attribute. If a user uploads a file with `.PDF` in uppercase, `a[href$=".pdf"]` might fail!

To force case-insensitive matching, add the **`i` modifier** before the closing bracket:

```css
/* Matches .pdf, .PDF, .Pdf, or .pDf! */
a[href$=".pdf" i] {
  color: #dc2626;
}
```

---

# Attribute Selectors Quick Reference Table 📊

| Selector | Meaning | Example | Real-World Use Case |
| :--- | :--- | :--- | :--- |
| `[attr]` | Attribute is present | `input[disabled]` | Styling disabled form controls |
| `[attr="val"]` | Exact match | `input[type="radio"]` | Styling radio buttons |
| `[attr^="val"]` | Starts with | `a[href^="https://"]` | Styling external secure links |
| `[attr$="val"]` | Ends with | `a[href$=".pdf"]` | Auto-detecting document downloads |
| `[attr*="val"]` | Contains anywhere | `a[href*="youtube"]` | Video link badges |
| `[attr~="val"]` | Space-separated word | `[data-tags~="maths"]` | Filtering custom tag lists |
| `[attr="val" i]` | Case-insensitive | `a[href$=".jpg" i]` | Catching both `.jpg` and `.JPG` |

---

# Common Mistakes Beginners Make ❌

| Bad Practice ❌ | Why It Fails ⚠️ | Better Approach ✅ |
| :--- | :--- | :--- |
| Writing `input[required="true"]` | HTML boolean attributes like `required` or `disabled` do not need a value. | Just write `input[required]` or `button[disabled]`. |
| Confusing `^=` (starts with) and `$=` (ends with) | Writing `a[href^=".pdf"]` looks for links *starting* with `.pdf`, matching zero URLs! | Use `$=` for file extensions: `a[href$=".pdf"]`. |
| Forgetting quotes around URLs with special characters | While simple values work without quotes, values with slashes (`https://`) can cause parsing errors. | Always wrap attribute values in quotes: `[href^="https://"]`. |
| Not adding the `i` flag for file extensions | Misses downloads ending with capital `.PDF` or `.PNG`. | Add `i`: `a[href$=".pdf" i]`. |

---

# Summary Cheat Sheet 📌

- **Attribute selectors** target HTML elements directly by their attributes without polluting markup with extra classes.
- **`[attr]`** checks presence; **`[attr="val"]`** checks exact equality.
- **The Substring Trio:**
  - **`^=`** = Starts with (`href^="https://"`)
  - **`$=`** = Ends with (`href$=".pdf"`)
  - **`*=`** = Contains anywhere (`href*="portal"`)
- **`i` modifier:** Makes substring comparison case-insensitive.

---

# Multiple Choice Questions

### 1. Which CSS selector selects all hyperlink elements whose `href` attribute ends with `.pdf`?
A. `a[href^=".pdf"]`
B. `a[href$=".pdf"]`
C. `a[href*=".pdf"]`
D. `a.pdf-file`
**Answer:** B
**Explanation:** The dollar symbol (`$=`) is the "ends with" attribute selector in CSS, perfect for targeting file extensions.

---

### 2. What does the caret symbol (`^=`) signify in an attribute selector like `a[href^="https://"]`?
A. The attribute value must contain the substring anywhere
B. The attribute value must begin with "https://"
C. The attribute value must be uppercase
D. The attribute value is optional
**Answer:** B
**Explanation:** `^=` matches any attribute value that starts with the specified prefix string.

---

### 3. How do you ensure that a file extension selector matches both `.pdf` and uppercase `.PDF`?
A. Add the `i` modifier before the closing bracket: `a[href$=".pdf" i]`
B. Write two separate CSS files
C. Set `text-transform: uppercase;`
D. Use `!important`
**Answer:** A
**Explanation:** The `i` flag placed inside an attribute selector forces case-insensitive string matching.

---

### 4. Which of the following is the cleanest way to style all required form input fields with a red border without adding classes?
A. `input.must-fill { border-color: red; }`
B. `input[required] { border-color: red; }`
C. `input[status="mandatory"] { border-color: red; }`
D. `input:has-text { border-color: red; }`
**Answer:** B
**Explanation:** The presence selector `input[required]` directly matches any input carrying the standard HTML5 `required` attribute.

---

### 5. What does the asterisk (`*=`) operator match in `a[href*="wikipedia"]`?
A. Only links that start with "wikipedia"
B. Only links that end with "wikipedia"
C. Any link where the word "wikipedia" appears anywhere inside the `href` attribute value
D. Links that have exactly 9 characters
**Answer:** C
**Explanation:** The `*=` operator is the "contains" selector, matching occurrences of the substring anywhere within the attribute value.

---

# Practice Challenge (Try It Yourself)

1. Create an HTML file named `school-downloads-center.html`.
2. Build an attractive school downloads center where links automatically receive appropriate brand colors and icons based entirely on attribute selectors:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>School Downloads Center | Attribute Selectors Lab</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         background-color: #f8fafc;
         padding: 40px 20px;
         max-width: 650px;
         margin: 0 auto;
       }

       .card {
         background-color: white;
         padding: 30px;
         border-radius: 12px;
         box-shadow: 0 4px 15px rgba(0,0,0,0.06);
       }

       h2 {
         color: #0f172a;
         margin-top: 0;
         border-bottom: 2px solid #e2e8f0;
         padding-bottom: 10px;
       }

       .download-list {
         list-style: none;
         padding: 0;
         margin: 20px 0;
       }

       .download-list li {
         padding: 12px 16px;
         border-bottom: 1px solid #f1f5f9;
         display: flex;
         align-items: center;
         justify-content: space-between;
       }

       .download-list a {
         text-decoration: none;
         font-weight: 500;
         display: inline-flex;
         align-items: center;
         gap: 8px;
         transition: opacity 0.2s;
       }

       .download-list a:hover {
         opacity: 0.8;
       }

       /* 1. PDF Links: Red accent + PDF badge */
       a[href$=".pdf" i] {
         color: #dc2626;
       }

       a[href$=".pdf" i]::after {
         content: "PDF Document";
         font-size: 11px;
         background-color: #fee2e2;
         color: #991b1b;
         padding: 3px 8px;
         border-radius: 4px;
         font-weight: bold;
       }

       /* 2. Excel / CSV Links: Green accent + Excel badge */
       a[href$=".xlsx" i],
       a[href$=".csv" i] {
         color: #16a34a;
       }

       a[href$=".xlsx" i]::after,
       a[href$=".csv" i]::after {
         content: "Excel Sheet";
         font-size: 11px;
         background-color: #dcfce7;
         color: #166534;
         padding: 3px 8px;
         border-radius: 4px;
         font-weight: bold;
       }

       /* 3. External Secure HTTPS Links: Blue accent */
       a[href^="https://"] {
         color: #2563eb;
       }

       /* 4. Required Inputs: Automatic Orange Accent Stripe */
       .form-section {
         margin-top: 30px;
         border-top: 2px dashed #e2e8f0;
         padding-top: 20px;
       }

       input[type="text"] {
         width: 100%;
         padding: 10px;
         margin-bottom: 12px;
         border: 1px solid #cbd5e1;
         border-radius: 6px;
         box-sizing: border-box;
       }

       /* Mandatory field highlighting */
       input[required] {
         border-left: 5px solid #f59e0b;
         background-color: #fffbeb;
       }
     </style>
   </head>
   <body>
     <div class="card">
       <h2>DPS School Resource Downloads</h2>
       <ul class="download-list">
         <li>
           <span>Class 10 Physics Syllabus 2026</span>
           <a href="downloads/physics-syllabus.pdf">Download</a>
         </li>
         <li>
           <span>Term 1 Examination Marksheet Template</span>
           <a href="downloads/marksheet-template.xlsx">Download</a>
         </li>
         <li>
           <span>Annual Sports Day Registration Form</span>
           <a href="downloads/sports-registration.PDF">Download</a>
         </li>
         <li>
           <span>CBSE Official Academic Portal</span>
           <a href="https://cbse.gov.in" target="_blank">Visit Site ↗</a>
         </li>
       </ul>

       <div class="form-section">
         <h3>Student Verification Portal</h3>
         <p style="font-size: 13px; color: #64748b;">
           Notice how the required field automatically displays an amber left stripe!
         </p>
         <input type="text" placeholder="Roll Number (Required)" required>
         <input type="text" placeholder="Optional Guardian Mobile">
       </div>
     </div>
   </body>
   </html>
   ```
3. Open this file in your browser to observe how attribute selectors automatically decorate different file types with zero redundant class names! 🎯
