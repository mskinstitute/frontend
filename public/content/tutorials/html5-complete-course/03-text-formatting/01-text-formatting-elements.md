---
id: html-text-formatting-elements
slug: text-formatting-elements
course: html5-complete-course
chapter: 3
topic: 3.1
title: Text Formatting Elements
description: Learn how to format text in HTML using bold, italic, highlighter mark, chemistry subscripts, and math superscripts in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 1
keywords:
  - html text formatting
  - strong vs b
  - em vs i
  - mark tag
  - sub and sup tags
  - del and ins tags
  - html for school students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Text Formatting Elements in HTML

Welcome to Chapter 3: **Text Formatting**! 🎨

Think about how you prepare your **School Notebook** before an exam:
- You use a bright yellow **highlighter** to mark important definitions.
- You write main keywords in **bold dark ink**.
- You write chemistry formulas like **H₂O** with small numbers at the bottom.
- You write math powers like **x²** with small numbers at the top.
- When there is a discount on an item, the old price is crossed out like **~~₹999~~ ₹499**.

In HTML, we have dedicated **Text Formatting Tags** that allow you to do all of these things on your webpage without writing any CSS!

---

# 1. Bold Text: `<b>` vs `<strong>`

Both of these tags make text appear **bold and thick**, but they have different purposes:

```html
<!-- Visual bold only (Styling) -->
<p>This is <b>bold text</b>.</p>

<!-- Important text (Semantic Meaning) -->
<p><strong>Warning:</strong> Do not touch electric wires with wet hands!</p>
```

### What is the Difference?
- **`<b>` (Bold):** Makes the text bold purely for visual style. It does not carry any special extra importance.
- **`<strong>` (Strong Importance):** Tells the web browser, Google search, and Screen Readers (used by visually impaired people) that this text is **critically important**. Screen readers will pronounce `<strong>` words with a serious, emphasized tone!

> 💡 **Best Practice Tip:**
> If a word is genuinely important or an alert, always prefer **`<strong>`**. If it is just for visual styling, use **`<b>`**.

---

# 2. Italic Text: `<i>` vs `<em>`

Both tags tilt the text into *italics*, but just like bold tags, they carry different meanings:

```html
<!-- Visual italic only (Styling) -->
<p>The Latin name for humans is <i>Homo sapiens</i>.</p>

<!-- Emphasized stress (Semantic Meaning) -->
<p>I <em>love</em> learning web development!</p>
```

### What is the Difference?
- **`<i>` (Italic):** Tilts the text sideways. Used for technical terms, foreign language words, scientific names, or thought phrases.
- **`<em>` (Emphasized):** Adds verbal stress and emotion to a word. When reading aloud, a screen reader will emphasize the word *"love"* with voice inflection.

---

# 3. Highlighted Text: `<mark>` (The Yellow Highlighter Pen! 🖍️)

Remember using a fluorescent yellow marker on your school textbook? The `<mark>` tag does the exact same thing in HTML!

It wraps text with a bright, noticeable **yellow highlight background**:

```html
<p>The capital city of India is <mark>New Delhi</mark>.</p>
<p>Your exam starts promptly at <mark>09:00 AM</mark>.</p>
```

**Where is this used?**
- Highlighting search keywords when a user searches for something on a site.
- Highlighting important exam dates, alerts, or key definitions.

---

# 4. Deleted and Inserted Text: `<del>` and `<ins>`

These two tags are commonly used together on **E-commerce shopping websites** (like Amazon or Flipkart) to show product price discounts:

```html
<p>Special Diwali Offer!</p>
<p>Original Price: <del>₹1,999</del></p>
<p>Discounted Price: <ins>₹999</ins></p>
```

### How They Display in the Browser:
- **`<del>` (Deleted):** Draws a strike-through line directly across the text (e.g., ~~₹1,999~~).
- **`<ins>` (Inserted):** Displays the new replacement text with an **underline** (e.g., <u>₹999</u>).

---

# 5. Small Fine Print: `<small>`

The `<small>` tag makes text one size smaller than the surrounding normal paragraph text:

```html
<p>MSK Institute of Technology & Coding.</p>
<p><small>© 2026 MSK Institute. All rights reserved.</small></p>
```

**Where is this used?**
- Copyright notices at the bottom of a website (footer).
- Terms and conditions, disclaimers, or legal fine print.

---

# 6. Chemistry Subscripts: `<sub>` 🧪

Have you ever wondered how to write science formulas like **H₂O** or **CO₂** in HTML?

In chemistry, the small number is placed **slightly below** the normal text line. This is called a **Subscript**, and we use the **`<sub>`** tag:

```html
<!-- Water Formula: H2O -->
<p>Chemical formula of Water is H<sub>2</sub>O.</p>

<!-- Carbon Dioxide: CO2 -->
<p>Plants absorb CO<sub>2</sub> during photosynthesis.</p>

<!-- Glucose: C6H12O6 -->
<p>Glucose formula: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></p>
```

```text
Visualizing Subscript:
H 2 O
  └── Lowered below the text line!
```

---

# 7. Math Superscripts: `<sup>` 📐

In mathematics, powers and exponents (like **x² + y²**) or ordinal dates (like **10th August**) are written **slightly above** the normal text line. This is called a **Superscript**, and we use the **`<sup>`** tag:

```html
<!-- Math Algebra: a2 + b2 -->
<p>Algebra Formula: (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup></p>

<!-- Einstein's Energy Equation: E = mc2 -->
<p>Einstein's Equation: E = mc<sup>2</sup></p>

<!-- Ordinal Class/Dates: 10th Class -->
<p>Aman is a student of 10<sup>th</sup> Class.</p>
```

```text
Visualizing Superscript:
   2
(a)
└── Raised above the text line!
```

> 📌 **Memory Trick to Never Confuse `<sub>` and `<sup>`:**
> - **`sub`** = **Submarine** (goes **down** deep under the sea!) 🌊 ➔ `<sub>` is **down below**.
> - **`sup`** = **Superman** (flies **up** high in the sky!) 🦸 ➔ `<sup>` is **up above**.

---

# 8. Underlined Text: `<u>`

The `<u>` tag puts a solid line directly underneath text:

```html
<p>Please <u>sign here</u> with a blue pen.</p>
```

⚠️ **Warning for Beginners:**
On the internet, users expect underlined text to be a **clickable link**. If you underline normal text, users will keep clicking on it thinking it is a link! Use `<u>` sparingly.

---

# Master Comparison Table: HTML Formatting Tags

| Tag | Tag Name | What It Does | Real-Life School Example |
|---|---|---|---|
| `<b>` | Bold | Visually thick text | `<b>Important</b>` |
| `<strong>` | Strong | High importance / warning alert | `<strong>Danger!</strong>` |
| `<i>` | Italic | Visually tilted text | `<i>Homo sapiens</i>` |
| `<em>` | Emphasized | Verbal stress & emotion | `<em>I told you!</em>` |
| `<mark>` | Mark | Yellow highlighter background | `<mark>Correct Answer</mark>` |
| `<small>` | Small | Smaller fine print / copyright | `<small>© 2026 MSK</small>` |
| `<del>` | Delete | Strikethrough line across text | `<del>₹999</del>` |
| `<ins>` | Insert | Underlines newly added text | `<ins>₹499</ins>` |
| `<sub>` | Subscript | Lowers text below the baseline | `H<sub>2</sub>O` (Water) |
| `<sup>` | Superscript | Raises text above the baseline | `x<sup>2</sup>` or `10<sup>th</sup>` |
| `<u>` | Underline | Puts a line under the text | `<u>Read this</u>` |

---

# Common Beginner Mistakes to Avoid

1. ⚠️ **Forgetting to Close a Formatting Tag:**
   ```html
   <!-- WRONG: The entire page turns yellow! -->
   <p>The answer is <mark>42. Next question...</p>

   <!-- CORRECT -->
   <p>The answer is <mark>42</mark>. Next question...</p>
   ```

2. ⚠️ **Mixing up `<sub>` and `<sup>`:**
   - Remember: **Sub**marine goes **down** (`H<sub>2</sub>O`), **Super**man flies **up** (`x<sup>2</sup>`).

3. ⚠️ **Incorrect Tag Nesting:**
   - Always close the inner tag before closing the outer tag:
   ```html
   <!-- CORRECT -->
   <p>This is <strong><mark>very important</mark></strong> text.</p>
   ```

---

# Quick Summary

- ✅ Use **`<strong>`** for critical alerts and **`<b>`** for simple bold styling.
- ✅ Use **`<em>`** for spoken emphasis and **`<i>`** for italic terms.
- ✅ Use **`<mark>`** to highlight words with a bright yellow background.
- ✅ Use **`<del>`** and **`<ins>`** for showing old vs new discounted prices.
- ✅ Use **`<sub>`** for Chemistry formulas (like H₂O).
- ✅ Use **`<sup>`** for Math powers (like x²) and ordinals (like 10th).
- ✅ Always remember to close every formatting tag you open!

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which tag is used to write chemical formulas like H₂O where the number sits below the text line?
A. `<sup>`
B. `<sub>`
C. `<below>`
D. `<down>`
**Answer:** B

---

### 2. Which tag gives text a bright yellow background like a highlighter pen?
A. `<highlight>`
B. `<yellow>`
C. `<mark>`
D. `<color>`
**Answer:** C

---

### 3. How should you write the mathematical expression x² in HTML?
A. `x<pow>2</pow>`
B. `x<sub>2</sub>`
C. `x<sup>2</sup>`
D. `x<up>2</up>`
**Answer:** C

---

### 4. What is the semantic difference between `<strong>` and `<b>`?
A. `<b>` makes text green, `<strong>` makes text red
B. `<strong>` indicates important text with strong semantic weight (announced strongly by screen readers), while `<b>` is purely visual bold styling
C. `<strong>` can only be used inside headings
D. There is no difference at all
**Answer:** B

---

### 5. Which tag pair is used to display an old struck-through price and an updated newly inserted price?
A. `<old>` and `<new>`
B. `<cut>` and `<add>`
C. `<del>` and `<ins>`
D. `<strike>` and `<u>`
**Answer:** C

---

# Practice Challenge (Try It Yourself)

1. Open your `index.html` file in VS Code.
2. Inside `<body>`, create a **Science & Math Study Sheet**:
   - Write: `Photosynthesis converts 6CO<sub>2</sub> + 6H<sub>2</sub>O into glucose.`
   - Write: `Pythagoras Theorem: a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>.`
   - Write a special offer on computer books: `Book Price: <del>₹500</del> <ins>₹299</ins> only!`
   - Highlight the word: `<mark>Special Offer</mark>`.
3. Save the file (`Ctrl + S`) and view your clean, formatted study sheet live in your browser! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Quotations & Citations** (Text Formatting).

👉 **[Continue to Next Lesson: Quotations & Citations →](/tutorials/html5-complete-course/quotations-citations)**
