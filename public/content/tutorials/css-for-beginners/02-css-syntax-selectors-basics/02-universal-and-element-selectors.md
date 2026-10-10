---
id: universal-and-element-selectors
slug: universal-and-element-selectors
course: css-for-beginners
chapter: 2
topic: 2.2
title: Universal and Element Selectors
description: Master the Universal Selector (*) and Element/Type Selectors (p, h1, button) to target HTML elements across your entire page, with Indian school morning assembly analogies.
difficulty: Beginner
readingTime: 8
order: 5
keywords:
  - universal selector
  - element selector
  - type selector
  - css selectors
  - css basics
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Universal and Element Selectors

Before CSS can apply a single splash of color or change a font, it needs to know: **"Who should I apply this style to?"** 🎯

In CSS, the tool you use to target HTML elements is called a **Selector**.

In this lesson, we will explore the two most fundamental selectors in web design:
1. The **Universal Selector (`*`)**
2. The **Element (or Type) Selector (`h1`, `p`, `button`, etc.)**

Let us understand both using a fun school morning assembly analogy!

---

# The Morning Assembly Analogy 🏫

Imagine your entire school gathered in the playground for the 8:00 AM morning assembly:

```text
+-------------------------------------------------------------------------+
|                  HOW SELECTORS TARGET STUDENTS                          |
+-------------------------------------------------------------------------+
| 1. THE WHISTLE BLOWS (* Universal Selector):                            |
|    The Physical Education teacher blows a loud whistle.                 |
|    EVERY SINGLE STUDENT on the ground immediately stands at attention!  |
|                                                                         |
| 2. CALLING A CLASS (Element / Type Selector):                           |
|    The teacher announces: "Class 10 students, step forward!"            |
|    Only students belonging to Class 10 step forward;                    |
|    students of Class 6, 7, 8, and 9 remain where they are.              |
+-------------------------------------------------------------------------+
```

---

# 1. The Universal Selector (`*`)

The **Universal Selector** is represented by an asterisk symbol (`*`).

It matches and selects **every single HTML element** on the entire webpage — headings, paragraphs, lists, images, buttons, and containers alike!

### Basic Syntax:
```css
* {
  color: #1e293b;
}
```
In the code above, the asterisk `*` tells the browser: *"Turn the text color of every single element on this page to slate dark gray!"*

### Where is the Universal Selector Actually Used?
Professional web developers almost always use the universal selector at the very top of their CSS file for what is called a **CSS Reset**.

By default, every web browser (Chrome, Safari, Edge) adds its own unwanted margins and spacing to web pages. Developers use `*` to reset everything to zero for consistent layout:

```css
/* Universal Box Reset (Used in almost every website) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### ⚠️ A Warning on the Universal Selector:
Do not use `*` to set heavy styling properties like `background-color`, `border`, or `font-size`. Because `*` selects thousands of elements at once, applying heavy animations or shadows with it can slow down your webpage!

---

# 2. The Element (Type) Selector

The **Element Selector** (also known as the **Type Selector**) targets HTML elements by their tag name directly.

Whenever you want all instances of an HTML tag to look consistent across your website, you use an element selector.

### Common Examples:
```css
/* Styles all <h1> headings */
h1 {
  color: #1e3a8a;
  font-family: Georgia, serif;
}

/* Styles all paragraphs */
p {
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
}

/* Styles all clickable links */
a {
  color: #0284c7;
  text-decoration: none;
}

/* Styles all buttons */
button {
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
}
```

---

# Practical Demonstration: Seeing Both in Action

Let us combine both selectors in an HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Selectors in Action</title>
  <style>
    /* 1. Universal Selector: Removes default outer gaps */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      background-color: #f8fafc;
    }

    /* 2. Element Selectors: Styling tags by their name */
    h1 {
      color: #0f172a;
      margin-bottom: 12px;
    }

    h2 {
      color: #3b82f6;
      margin-top: 20px;
      margin-bottom: 8px;
    }

    p {
      color: #334155;
      margin-bottom: 16px;
      font-size: 16px;
    }

    button {
      background-color: #10b981;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>School Annual Science Fair</h1>
  <p>Welcome to our annual project exhibition website.</p>

  <h2>Robot Competition</h2>
  <p>Students from Class 9 and 10 will showcase line-following robots.</p>

  <button>Register Your Team</button>
</body>
</html>
```

### What Happens on the Screen?
1. The `*` rule ensures there are no strange default gaps pushing elements around.
2. The `h1` selector finds the main title and gives it a deep slate color.
3. The `h2` selector finds the sub-heading and styles it sky blue.
4. The `p` selector automatically formats **both paragraphs** identically with clean text spacing.
5. The `button` selector turns the register button into a modern green pill button.

---

# When to Use Element Selectors vs When NOT to

| Scenario | Should You Use Element Selector? | Better Alternative |
|---|:---:|---|
| Setting standard default styles for all `body`, `h1`, `p`, or `table` elements. | ✅ **YES** | Perfect use case. |
| Making just **one specific paragraph** red while keeping others black. | ❌ **NO** | Use a **Class Selector** (e.g. `.warning-text`). |
| Styling one unique button differently (e.g., Delete button vs Save button). | ❌ **NO** | Use distinct classes (`.btn-delete`, `.btn-save`). |

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| Putting a dot before an element name (`.p { color: red; }`). | Write the tag name directly (`p { color: red; }`). | A dot (`.`) is strictly reserved for class selectors! The browser will look for `<tag class="p">` which does not exist. |
| Putting angle brackets in CSS (`<p> { color: red; }`). | Write just the tag name without brackets (`p { color: red; }`). | CSS does not use HTML angle brackets `< >`. |
| Writing `* { font-size: 20px; }` to make headings big. | Style headings specifically (`h1 { font-size: 32px; }`). | If you set font size on `*`, it forces paragraphs, buttons, and captions to the same size! |

---

# Quick Revision Summary

- ✅ A **CSS Selector** identifies which HTML elements to style.
- ✅ The **Universal Selector (`*`)** targets every single element on the webpage.
- ✅ The universal selector is most commonly used for a **CSS Reset** (`margin: 0; padding: 0; box-sizing: border-box;`).
- ✅ The **Element (Type) Selector** uses the HTML tag name directly (`h1`, `p`, `a`, `button`) without any dots or brackets.
- ✅ Element selectors apply changes to **all** instances of that tag across the entire webpage.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which symbol represents the Universal Selector in CSS?
A. `#`
B. `.`
C. `*`
D. `@`
**Answer:** C

---

### 2. Which of the following is the correct CSS rule to change the text color of all paragraph tags to green?
A. `<p> { color: green; }`
B. `.p { color: green; }`
C. `p { color: green; }`
D. `#p { color: green; }`
**Answer:** C

---

### 3. What is the most common reason developers use the Universal Selector (`*`) at the start of a stylesheet?
A. To create a 3D animation
B. To reset default browser margins and paddings
C. To link an external JavaScript file
D. To change the browser's language setting
**Answer:** B

---

### 4. What will happen if you write `.h1 { color: blue; }` instead of `h1 { color: blue; }` in your stylesheet?
A. All `<h1>` tags will turn blue automatically
B. The browser will look for an element with `class="h1"`, so standard `<h1>` tags without that class will NOT turn blue
C. The browser will show a syntax error screen
D. The heading text will disappear
**Answer:** B

---

### 5. If an HTML page has five different `<p>` tags, which paragraphs will be affected by `p { font-size: 18px; }`?
A. Only the first paragraph
B. Only the last paragraph
C. All five paragraphs
D. None of the paragraphs
**Answer:** C

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `assembly.html`.
2. Build an announcement page for your school with:
   - One `<h1>` tag: `Welcome to Green Valley Public School`
   - Two `<h2>` tags: `Notice Board` and `Upcoming Sports Meet`
   - Three `<p>` tags with text of your choice.
   - One `<button>` tag: `Download Syllabus`
3. Write an internal `<style>` block using:
   - The **Universal Selector (`*`)** to set `margin: 0; padding: 0; box-sizing: border-box;`.
   - The **Element Selector `body`** to add `font-family: Arial; padding: 20px; background-color: #f1f5f9;`.
   - The **Element Selector `h1`** to make it dark navy blue (`#1e3a8a`).
   - The **Element Selector `h2`** to make it teal (`#0d9488`).
   - The **Element Selector `p`** to give it a readable font size (`16px`) and gray color (`#475569`).
   - The **Element Selector `button`** to give it a blue background with white text and rounded corners.
4. Open the file in Chrome or Edge and see your clean, consistent design come alive! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Class and ID Selectors** (CSS Syntax & Selectors Basics).

👉 **[Continue to Next Lesson: Class and ID Selectors →](/tutorials/css-for-beginners/class-and-id-selectors)**
