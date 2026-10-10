---
id: text-align-decoration-transform-spacing
slug: text-align-decoration-transform-spacing
course: css-for-beginners
chapter: 5
topic: 5.3
title: Text Alignment, Decoration, Transform, and Spacing
description: Master text formatting in CSS - text-align (left, center, right, justify), text-decoration (removing link underlines), text-transform (uppercase, capitalize), letter-spacing, and word-spacing with school magazine editor analogies.
difficulty: Beginner
readingTime: 9
order: 16
keywords:
  - text-align css
  - text-decoration none
  - text-transform uppercase
  - letter-spacing
  - word-spacing
  - css typography
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Text Alignment, Decoration, Transform, and Spacing

Have you ever wondered how websites remove the default blue underline from navigation links, make badge titles display in crisp ALL-CAPS without retyping them in HTML, or align paragraph edges neatly like a printed newspaper? 📰

In CSS, text layout is refined using properties that control:
- Where lines align horizontally (**`text-align`**)
- Underlines and strikethroughs (**`text-decoration`**)
- Capitalization rules (**`text-transform`**)
- Horizontal breathing room between letters and words (**`letter-spacing`**, **`word-spacing`**)

Let us explore these powerful properties through the lens of a school magazine editor!

---

# The School Magazine Editor Analogy 🖋️

Imagine you are the chief student editor of your school's **Annual Magazine**:

```text
+-------------------------------------------------------------------------+
|                  THE MAGAZINE EDITOR'S TOOLBOX                          |
+-------------------------------------------------------------------------+
| 1. text-align: center     --> Centering the Principal's message headline|
| 2. text-align: justify    --> Aligning both left & right edges of essays|
|                               neatly like a newspaper column            |
| 3. text-decoration: none  --> Removing ugly underlines from navigation  |
| 4. text-decoration:       --> Striking through old ticket prices        |
|    line-through               (Annual Day Pass: ~Rs. 100~ Free!)        |
| 5. text-transform:        --> Forcing badges to ALL-CAPS without typing |
|    uppercase                  every letter in caps manually in HTML     |
| 6. letter-spacing: 2px    --> Adding breathing room between capital     |
|                               letters for a luxury title feel           |
+-------------------------------------------------------------------------+
```

---

# 1. `text-align` (Horizontal Alignment)

Controls how text is positioned horizontally within its container.

```css
/* Left-aligned: Standard default for English/Hindi */
p {
  text-align: left;
}

/* Centered: Best for headings, hero banners, and cards */
h1 {
  text-align: center;
}

/* Right-aligned: Great for dates, table numbers, invoice totals */
.date-meta {
  text-align: right;
}

/* Justified: Spaces words so both left and right edges align flush */
.newspaper-article {
  text-align: justify;
}
```

```text
[ text-align: left ]        [ text-align: center ]      [ text-align: right ]
Welcome to Class 10         Welcome to Class 10         Welcome to Class 10
Science Exhibition          Science Exhibition          Science Exhibition
Starts at 9:00 AM           Starts at 9:00 AM           Starts at 9:00 AM
```

---

# 2. `text-decoration` (Lines and Underlines)

By default, every web browser automatically draws an underline under `<a>` link tags. One of the very first things frontend developers do is remove or customize that underline!

### 1. Removing Link Underlines (`none` ⭐):
```css
a {
  text-decoration: none; /* Clean links without underlines! */
  color: #2563eb;
}

/* Underline only when user hovers mouse over the link */
a:hover {
  text-decoration: underline;
}
```

### 2. Common Decoration Values:
- `none`: Removes all underlines or lines.
- `underline`: Draws a line directly below the text.
- `line-through`: Draws a line through the middle (perfect for e-commerce discounts: *~₹999~ ₹499*).
- `overline`: Draws a line above the text.

```css
/* E-commerce discount price */
.original-price {
  text-decoration: line-through;
  color: #94a3b8;
}

.discount-price {
  color: #16a34a;
  font-weight: bold;
}
```

### Modern Decorative Modifiers:
In modern CSS, you can even customize the color and wavy style of the line:
```css
/* Fancy red wavy underline */
.highlight-error {
  text-decoration: underline wavy #ef4444;
}
```

---

# 3. `text-transform` (Smart Capitalization)

Why is `text-transform` a lifesaver?  
Imagine you have 100 buttons that need to display in uppercase. Instead of manually typing `<button>SUBMIT APPLICATION</button>` in HTML, you simply write normal sentence case in HTML and let CSS do the transformation!

```css
/* Converts every letter to UPPERCASE */
.badge {
  text-transform: uppercase;
}

/* Capitalizes the first letter of each word */
.student-name {
  text-transform: capitalize;
}

/* Forces all letters to lowercase */
.email-address {
  text-transform: lowercase;
}
```

```text
Original HTML text:   "annual sports meet"
-------------------------------------------------------
text-transform: uppercase   ──▶ "ANNUAL SPORTS MEET"
text-transform: capitalize  ──▶ "Annual Sports Meet"
text-transform: lowercase   ──▶ "annual sports meet"
```

---

# 4. `letter-spacing` and `word-spacing`

These properties adjust the micro-spacing between letters and words:

### 1. `letter-spacing` (Tracking)
Expands or contracts the space between individual letters. It is widely used by UI designers on uppercase headers and small badges to give them a premium, airy aesthetic:

```css
/* Modern elegant badge */
.badge-pill {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px; /* 2px extra space between each letter */
  font-weight: 700;
}
```

### 2. `word-spacing`
Controls the spacing between entire words:
```css
h2 {
  word-spacing: 4px;
}
```

---

# 5. `text-indent` (First-Line Indentation)

In printed storybooks and textbooks, the very first line of a new paragraph is often pushed inward by a few centimeters. In CSS, you achieve this using `text-indent`:

```css
/* Indents the first line of every paragraph by 30px */
.story p {
  text-indent: 30px;
}
```

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| Typing all caps directly in HTML (`<h1>ADMISSIONS</h1>`). | Use `text-transform: uppercase;`. | Keeping HTML in natural sentence case helps screen readers pronounce words correctly instead of spelling them out as abbreviations! |
| Using `text-align: center` on inline tags like `<span>`. | Apply `text-align` to the parent block element (like `<p>` or `<div>`). | Inline elements have no outer width to center within. |
| Forgetting `text-decoration: none` on button links. | Add `text-decoration: none;` to navigation `<a>` tags. | Without it, link buttons will show an unsightly underline across the button text. |

---

# Quick Revision Summary

- ✅ `text-align` sets horizontal alignment: `left`, `center`, `right`, or `justify`.
- ✅ `text-decoration: none` removes the default browser underline from links.
- ✅ `text-decoration: line-through` strikes through text (ideal for discounted prices).
- ✅ `text-transform: uppercase` converts text to capital letters cleanly through CSS.
- ✅ `letter-spacing` adds breathing room between individual characters for refined titles.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which CSS property and value is used to remove the default underline from an HTML `<a>` link?
A. `text-style: none;`
B. `text-decoration: none;`
C. `underline: false;`
D. `link-style: remove;`
**Answer:** B

---

### 2. What is the effect of applying `text-transform: capitalize;` to the phrase "science and technology"?
A. "SCIENCE AND TECHNOLOGY"
B. "Science And Technology"
C. "science and technology"
D. "Science and technology"
**Answer:** B

---

### 3. Which value of `text-align` adjusts the spacing between words so that text aligns flush with both the left and right margins, like a printed newspaper?
A. `center`
B. `justify`
C. `spread`
D. `both`
**Answer:** B

---

### 4. Which CSS property adds extra breathing room specifically between individual characters in a heading?
A. `word-spacing`
B. `letter-spacing`
C. `line-height`
D. `font-stretch`
**Answer:** B

---

### 5. What CSS declaration is best suited to display a discounted strike-through price like "~₹500~ ₹299"?
A. `text-decoration: line-through;`
B. `text-decoration: underline;`
C. `font-style: strikethrough;`
D. `text-transform: strike;`
**Answer:** A

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `magazine-badge.html`.
2. Build a modern event ticket card featuring all the text formatting techniques:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Magazine Typography Challenge</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         background-color: #f1f5f9;
         padding: 40px 20px;
         display: flex;
         justify-content: center;
       }

       .event-card {
         max-width: 440px;
         background-color: white;
         border-radius: 12px;
         padding: 28px;
         box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
       }

       /* 1. Category Pill Badge */
       .badge {
         display: inline-block;
         background-color: #dbeafe;
         color: #1e40af;
         padding: 6px 12px;
         border-radius: 50px;
         font-size: 11px;
         font-weight: bold;
         text-transform: uppercase;   /* Automatic ALL-CAPS */
         letter-spacing: 1.5px;       /* Tracking space */
         margin-bottom: 12px;
       }

       /* 2. Main Title */
       h2 {
         color: #0f172a;
         text-transform: capitalize;  /* Capitalize every word */
         margin-bottom: 12px;
       }

       /* 3. Description */
       p {
         color: #475569;
         line-height: 1.6;
         text-align: justify;         /* Clean newspaper alignment */
         margin-bottom: 20px;
       }

       /* 4. Pricing */
       .pricing {
         margin-bottom: 20px;
         font-size: 18px;
       }

       .old-price {
         text-decoration: line-through; /* Strikethrough */
         color: #94a3b8;
         margin-right: 10px;
       }

       .new-price {
         color: #16a34a;
         font-weight: bold;
         font-size: 22px;
       }

       /* 5. Clean Link Button */
       .btn-link {
         display: block;
         text-align: center;
         background-color: #2563eb;
         color: white;
         text-decoration: none;       /* No underline */
         padding: 12px;
         border-radius: 6px;
         font-weight: bold;
       }

       .btn-link:hover {
         background-color: #1d4ed8;
       }
     </style>
   </head>
   <body>
     <div class="event-card">
       <span class="badge">Robotics Workshop</span>
       <h2>annual national robotics carnival</h2>
       <p>Join over five hundred young engineers for three exciting days of autonomous line-following bot competitions, drone flight simulations, and hands-on sensor programming workshops.</p>
       <div class="pricing">
         <span class="old-price">Rs. 999</span>
         <span class="new-price">Rs. 499 (Students)</span>
       </div>
       <a href="#" class="btn-link">Book Your Seat</a>
     </div>
   </body>
   </html>
   ```
3. Open the file in your browser to see how `text-transform`, `letter-spacing`, `line-through`, and `text-decoration: none` create a stunning, polished layout! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Absolute Units: Pixels (px), Points (pt)** (CSS Units and Measurements).

👉 **[Continue to Next Lesson: Absolute Units: Pixels (px), Points (pt) →](/tutorials/css-for-beginners/css-units-absolute-px-pt)**
