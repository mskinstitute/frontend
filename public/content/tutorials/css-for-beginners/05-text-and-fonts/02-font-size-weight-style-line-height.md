---
id: font-size-weight-style-line-height
slug: font-size-weight-style-line-height
course: css-for-beginners
chapter: 5
topic: 5.2
title: "Font Size, Weight, Style, and Line Height"
description: Master font-size (px, rem), font-weight (100-900), font-style (italic), and line-height with school teacher's blackboard chalk and ruled notebook line analogies.
difficulty: Beginner
readingTime: 9
order: 15
keywords:
  - font-size css
  - font-weight
  - font-style italic
  - line-height
  - rem vs px
  - css typography
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Font Size, Weight, Style, and Line Height

Have you ever opened a blog post or news article and found it so easy and relaxing to read that you finished the entire article without tiring your eyes? Or conversely, opened a website where the text was tiny, crammed tightly together, and gave you an instant headache? 📖

The difference between pleasant reading and eye strain comes down to 4 typography properties:
1. **`font-size`** (How large the letters are)
2. **`font-weight`** (How thick or bold the letters are)
3. **`font-style`** (Normal or slanted italics)
4. **`line-height`** (The vertical breathing room between lines)

Let us master these essential properties using school classroom analogies!

---

# The Blackboard & Ruled Notebook Analogy 📝

Think about how your teacher writes on the blackboard and how you write in your school notebook:

```text
+-------------------------------------------------------------------------+
|                    THE 4 TYPOGRAPHY PILLARS                             |
+-------------------------------------------------------------------------+
| 1. font-size    --> Big chalk letters for Chapter Titles (32px),        |
|                     medium letters for Subheadings, small for notes.    |
|                                                                         |
| 2. font-weight  --> Pressing the chalk firmly on the board for BOLD,    |
|                     or writing gently with light pressure (Thin/Normal).|
|                                                                         |
| 3. font-style   --> Slanting scientific names or foreign words          |
|                     (Italics for emphasis: Homo sapiens).               |
|                                                                         |
| 4. line-height  --> The ruled lines in your English four-line notebook! |
|                     Leaving space so descenders ('g', 'y', 'p') don't   |
|                     crash into tall letters ('h', 'k', 'l') below!      |
+-------------------------------------------------------------------------+
```

---

# 1. `font-size` (Pixels vs REMs)

Sets the physical size of your text on the screen.

### Two Common Units:
1. **Pixels (`px`):** Fixed absolute size.
   ```css
   h1 { font-size: 32px; }
   p  { font-size: 16px; }
   ```
2. **REMs (`rem`):** Relative to the Root HTML font size (Modern standard ⭐).
   By default, almost all web browsers set root font size to `16px`.
   - `1rem = 16px`
   - `1.5rem = 24px` (`1.5 * 16`)
   - `2rem = 32px` (`2 * 16`)

```css
/* Professional responsive typography using rem */
h1 {
  font-size: 2rem; /* Exactly 32px */
}

p {
  font-size: 1rem; /* Exactly 16px */
}
```

> 💡 **Why Professionals Love `rem`:**
> If an elderly user or visually impaired student changes their smartphone or browser settings to "Large Text", websites built with `rem` scale up smoothly to keep text accessible!

---

# 2. `font-weight` (Boldness & Thickness)

Controls how thick or thin the strokes of your characters appear.

You can use **keywords** or **numeric values** from `100` to `900`:

```text
  100        300        400         600         700        900
 (Thin)    (Light)    (Normal)    (Semi-Bold)  (Bold)    (Black/Heavy)
```

### Common Keywords:
```css
p {
  font-weight: normal; /* Default value: 400 */
}

strong, h1, h2 {
  font-weight: bold;   /* Standard bold: 700 */
}

.subheading {
  font-weight: 600;    /* Modern semi-bold */
}
```

> ⚠️ **Note:** A font can only display numeric weights (like `300` or `600`) if the font family actually has those weight files installed. If a font only comes in normal and bold, the browser will approximate the closest match.

---

# 3. `font-style` (Italics)

Used primarily to slant text for emphasis, book titles, scientific terms, or quotes.

```css
/* Normal upright text (Default) */
p {
  font-style: normal;
}

/* Slanted italic text */
blockquote, em {
  font-style: italic;
}
```

---

# 4. `line-height` (The Secret to Comfortable Reading ⭐)

`line-height` controls the vertical distance between lines of text in a paragraph.

### The Problem of Default Text:
By default, browser line-height is very tight (around `1.1` to `1.2`). When a paragraph wraps across 5 lines, the lines are cramped together like people in a crowded bus!

```text
[ Bad: Tight line-height (1.1) ]      [ Good: Comfortable line-height (1.6) ]
The annual examinations will begin   The annual examinations will begin
from next Monday in the auditorium.  from next Monday in the auditorium.
Students must bring admit cards.
                                     Students must bring admit cards.
```

### The Best Practice: Use Unitless Numbers!
Always declare `line-height` as a **unitless number** (without `px`):

```css
body {
  font-size: 16px;
  line-height: 1.6; /* 1.6 times the font size (16 * 1.6 = 25.6px line box) */
}
```

Why unitless? Because child elements (headings, small captions) will automatically multiply their own font-size by `1.6`, preventing strange inheritance bugs!

---

# The All-in-One `font` Shorthand

You can combine style, weight, size, line-height, and family into a single declaration:

```css
/* Separate declarations */
p {
  font-style: italic;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.5;
  font-family: Arial, sans-serif;
}

/* Equivalent Shorthand */
p {
  font: italic bold 18px/1.5 Arial, sans-serif;
}
```

> ⚠️ **Syntax Rule for Shorthand:**
> Notice `18px/1.5`: `size` and `line-height` must be separated by a forward slash (`/`). Also, in shorthand, `font-size` and `font-family` are **mandatory**!

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| `font-weight: 700px;` *(Adding px to weight)* | `font-weight: 700;` or `bold`. | Font weight is a dimensionless scale (100 to 900), never measured in pixels. |
| Using `line-height: 25px` on headings. | Use unitless numbers: `line-height: 1.3;`. | A fixed 25px line-height on a 36px heading causes lines of text to collide and overlap! |
| Using `font-size: 12px` for main paragraph text. | Keep body text between `15px` and `18px` (`1rem`). | Anything below 14px strains students' eyes on modern high-DPI screens. |

---

# Quick Revision Summary

- ✅ `font-size` sets text size in `px` or responsive `rem` (`1rem = 16px`).
- ✅ `font-weight` sets thickness: `400` is normal, `700` is bold.
- ✅ `font-style: italic` slants characters for quotes, emphasis, and citations.
- ✅ `line-height` sets vertical line spacing; **unitless `1.5` to `1.6`** is optimal for readability.
- ✅ In the `font` shorthand, `size/line-height` are joined by a forward slash (`18px/1.5`).

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. If the browser root font size is the standard 16px, what is the computed size of `font-size: 1.5rem;`?
A. 20px
B. 24px
C. 32px
D. 18px
**Answer:** B

---

### 2. Which numeric `font-weight` corresponds to standard `normal` body text?
A. 100
B. 400
C. 700
D. 900
**Answer:** B

---

### 3. Why is it considered best practice to declare `line-height` as a unitless value (such as `1.6`) rather than with pixels?
A. Because computers do not understand pixels
B. Because unitless line-height scales proportionally with whatever font-size child elements inherit
C. Because unitless numbers load faster over the internet
D. Because pixels are deprecated in CSS
**Answer:** B

---

### 4. In the shorthand declaration `font: bold 16px/1.5 Arial, sans-serif;`, what does the value `1.5` specify?
A. Letter spacing
B. Font weight
C. Line height
D. Word spacing
**Answer:** C

---

### 5. Which CSS property is used to make text appear in slanted italics?
A. `text-decoration: italic;`
B. `font-weight: italic;`
C. `font-style: italic;`
D. `text-transform: italic;`
**Answer:** C

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `article-reading.html`.
2. Build an educational article formatted for maximum reading comfort:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Optimal Typography Challenge</title>
     <style>
       body {
         background-color: #f8fafc;
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         padding: 40px 20px;
       }

       .article-container {
         max-width: 680px;      /* Golden line length for reading */
         margin: 0 auto;
         background-color: white;
         padding: 36px;
         border-radius: 12px;
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
       }

       h1 {
         font-size: 2.25rem;   /* 36px */
         font-weight: 700;     /* Bold */
         color: #0f172a;
         line-height: 1.25;    /* Tighter line-height for headings */
         margin-bottom: 16px;
       }

       .author-meta {
         font-size: 0.9rem;
         color: #64748b;
         font-style: italic;
         margin-bottom: 24px;
       }

       p {
         font-size: 1.05rem;   /* ~17px */
         font-weight: 400;     /* Normal */
         line-height: 1.7;     /* Breathable, relaxed line height */
         color: #334155;
         margin-bottom: 18px;
       }
     </style>
   </head>
   <body>
     <article class="article-container">
       <h1>The Secrets of the Deep Ocean</h1>
       <div class="author-meta">By Science Club | Published on 10th September 2026</div>
       <p>More than seventy percent of our planet is covered by water, yet scientists know more about the surface of Mars than the bottom of our own oceans.</p>
       <p>In the pitch-black abyss miles below the surface, creatures generate their own glowing light using biological chemical reactions called bioluminescence.</p>
     </article>
   </body>
   </html>
   ```
3. Open the file in your browser and notice how the combination of `font-size: 1.05rem` and `line-height: 1.7` makes reading pure pleasure! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Text Alignment, Decoration, Transform, and Spacing** (Text and Fonts).

👉 **[Continue to Next Lesson: Text Alignment, Decoration, Transform, and Spacing →](/tutorials/css-for-beginners/text-align-decoration-transform-spacing)**
