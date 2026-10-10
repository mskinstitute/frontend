---
id: how-css-works-with-html
slug: how-css-works-with-html
course: css-for-beginners
chapter: 1
topic: 1.2
title: How CSS Works with HTML
description: Learn the anatomy of a CSS rule (Selector, Property, Value), how web browsers read HTML and CSS into the DOM and CSSOM to create the Render Tree, explained with Indian school stage play analogies.
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - how css works
  - css syntax
  - css selector property value
  - dom and cssom
  - render tree
  - browser rendering pipeline
  - css basics
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# How CSS Works with HTML

Now that you know what CSS is, let us dive into how CSS actually connects with HTML to make web pages look beautiful! 🎭

Imagine you are putting on an **Annual Day Stage Play** at school:
- The **Actors** standing on the stage are the **HTML Elements** (headings, paragraphs, buttons, pictures).
- The **Costume Designer & Stage Director** giving instructions from behind the curtain is **CSS**!

CSS shouts instructions to the actors:
> *"All `<p>` actors wear dark blue clothes!"*  
> *"The `<h1>` actor, stand tall in the center of the stage with a large bold font!"*  
> *"The `<button>` actor, paint yourself emerald green with rounded corners!"*

Let us see how web browsers translate these styling instructions into clean, precise code.

---

# Anatomy of a CSS Rule

In CSS, every instruction you write is called a **CSS Rule** (or Rule Set). 

Here is the basic structure of a CSS rule:

```css
h1 {
  color: crimson;
  font-size: 32px;
}
```

Let us look at its anatomy using this clear visual diagram:

```text
       Selector
         │
         ▼
        h1  {
              color : crimson ;   ◄── Declaration 1
              ▲         ▲     ▲
              │         │     │
              │         │     └─ Semicolon (Ends instruction)
              │         └─────── Value (What setting to give)
              └───────────────── Property (What to change)

              font-size : 32px ;  ◄── Declaration 2
            }
            ▲
            │
            └─ Declaration Block (Enclosed in curly braces)
```

### The 5 Essential Parts of a CSS Rule:

1. **Selector:**
   The selector specifies **who** you want to style. In the example above, `h1` tells the browser: *"Find every `<h1>` element on the page and apply these styles to it."*
2. **Declaration Block:**
   The curly braces `{ ... }` group all your styling declarations together. Everything inside these braces applies to the chosen selector.
3. **Property:**
   The property indicates **what** visual aspect you want to change. Examples: `color`, `font-size`, `background-color`, `margin`, `border`.
4. **Value:**
   The value is the specific choice you assign to that property. If the property is `color`, the value could be `crimson`, `#ff0000`, or `rgb(220, 20, 60)`.
5. **Punctuation Marks (Colon & Semicolon):**
   - The **colon (`:`)** separates the property name from its value (`color: crimson`).
   - The **semicolon (`;`)** marks the end of each declaration line, just like a full stop marks the end of a sentence in English.

---

# How the Browser Displays HTML + CSS (Under the Hood)

Have you ever wondered what happens inside Google Chrome, Firefox, or Edge when you load a website? The browser goes through a step-by-step assembly pipeline:

```text
+-----------------------+           +-----------------------+
|      HTML Code        |           |       CSS Code        |
|  (index.html file)    |           |   (style.css file)    |
+-----------+-----------+           +-----------+-----------+
            │                                   │
            ▼                                   ▼
+-----------------------+           +-----------------------+
|          DOM          |           |         CSSOM         |
| Document Object Model |           |    CSS Object Model   |
| (Tree of HTML tags)   |           | (Tree of Style Rules) |
+-----------+-----------+           +-----------+-----------+
            │                                   │
            └─────────────────┬─────────────────┘
                              ▼
                  +-----------------------+
                  |      RENDER TREE      |
                  | (Content + Styling)   |
                  +-----------+-----------+
                              │
                              ▼
                  +-----------------------+
                  |   LAYOUT & PAINTING   |
                  |   (Pixels on Screen)  |
                  +-----------------------+
```

### The 4 Steps Explained Simply:

1. **Building the DOM (Document Object Model):**
   The browser reads your HTML line by line and converts tags (`<html>`, `<body>`, `<h1>`, `<p>`) into a family tree of objects called the **DOM**. Think of this as the school teacher creating a student roll-call register.
2. **Building the CSSOM (CSS Object Model):**
   Simultaneously, the browser reads all CSS rules and builds the **CSSOM**. This is like the school uniform rulebook describing which badges, colors, and ties belong to which grade.
3. **Combining into the Render Tree:**
   The browser matches the student register (DOM) with the uniform rules (CSSOM). Elements that are hidden (like `display: none`) are left out.
4. **Layout & Paint:**
   The browser calculates the exact pixel coordinates of every box on your screen (Layout) and colors the pixels onto your monitor or smartphone display (Paint).

---

# A Real Code Example: Connecting HTML and CSS

Here is a complete HTML document with CSS styling applied:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Class 10 Science Exhibition</title>
  <style>
    /* CSS Styling Rules */
    body {
      background-color: #f8fafc;
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    h1 {
      color: #1e40af;
      text-align: center;
      text-transform: uppercase;
    }

    p {
      color: #334155;
      font-size: 16px;
      line-height: 1.6;
    }

    .highlight {
      background-color: #fef08a;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Science Exhibition 2026</h1>
  <p>All students of Classes 8th to 12th are invited to present their working models.</p>
  <p>Venue: <span class="highlight">Main School Auditorium</span> at 10:00 AM.</p>
</body>
</html>
```

### What Happens Here?
1. The `body` rule sets a light grayish-blue background (`#f8fafc`) and a clean font (`Arial`).
2. The `h1` rule turns the exhibition heading deep navy blue, centers it, and converts all letters to uppercase.
3. The `p` rule makes the paragraph text soft slate gray with pleasant line spacing (`line-height: 1.6`).
4. The `.highlight` rule adds a yellow marker background around the venue name with soft rounded corners.

---

# Common Beginner Syntax Errors (Do's and Don'ts)

Even experienced programmers occasionally make small syntax typos. Keep these rules handy:

| Beginner Mistake (Don't ❌) | Correct CSS Code (Do ✅) | Why It Fails |
|---|---|---|
| `color = red;` | `color: red;` | CSS uses a **colon (`:`)**, not an equals sign (`=`). |
| `font-size: 18px` *(missing semicolon)* | `font-size: 18px;` | Without a semicolon, the browser gets confused about where one rule ends and the next begins. |
| `font size: 20px;` *(space in property name)* | `font-size: 20px;` | CSS properties with two words use a **hyphen (`-`)**, never a blank space. |
| `h1 ( color: blue; )` | `h1 { color: blue; }` | Declarations must be inside **curly braces `{ }`**, not parentheses `( )`. |
| `colour: green;` | `color: green;` | CSS uses standard **American English spelling** (`color`, not `colour`). |

---

# Quick Revision Summary

- ✅ A CSS rule consists of a **Selector** and a **Declaration Block**.
- ✅ Inside `{ ... }`, each line contains a **Property**, a **Colon (`:`)**, a **Value**, and ends with a **Semicolon (`;`)**.
- ✅ The **DOM** represents the HTML structure, and the **CSSOM** represents the styling rules.
- ✅ The browser merges the DOM and CSSOM to create the **Render Tree**, which calculates geometry and paints pixels on your screen.
- ✅ Always use hyphens for multi-word properties (`font-size`, `background-color`, `line-height`).

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. In the CSS rule `p { color: blue; }`, what is `color` called?
A. Selector
B. Property
C. Value
D. Declaration Block
**Answer:** B

---

### 2. Which punctuation mark must separate a CSS property from its value?
A. Equals sign (`=`)
B. Semicolon (`;`)
C. Colon (`:`)
D. Comma (`,`)
**Answer:** C

---

### 3. What punctuation mark is required at the end of each CSS declaration?
A. Semicolon (`;`)
B. Full stop (`.`)
C. Exclamation mark (`!`)
D. Question mark (`?`)
**Answer:** A

---

### 4. What is created when the web browser combines the DOM and the CSSOM?
A. JavaScript Engine
B. Render Tree
C. Database Table
D. Operating System Kernel
**Answer:** B

---

### 5. Which of the following CSS declarations is written with 100% correct syntax?
A. `background color: yellow;`
B. `background-color = yellow;`
C. `background-color: yellow;`
D. `background-color: "yellow"`
**Answer:** C

---

# Practice Challenge (Try It Yourself)

Below is a broken piece of CSS code containing **3 syntax errors**.

### The Broken Code:
```css
/* Can you find and fix the 3 errors? */
h2 (
  text align: center;
  color = royalblue;
  font-size: 24px
)
```

### Your Challenge:
1. Identify the 3 errors:
   - What brackets should wrap the declarations?
   - How should two-word properties be written?
   - What punctuation mark separates property from value, and what ends the declaration?
2. Write the corrected version in your text editor.
3. Test it inside an HTML file with an `<h2>` heading to see it turn royal blue and center-aligned! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Inline, Internal, External CSS** (Introduction to CSS).

👉 **[Continue to Next Lesson: Inline, Internal, External CSS →](/tutorials/css-for-beginners/inline-internal-external-css)**
