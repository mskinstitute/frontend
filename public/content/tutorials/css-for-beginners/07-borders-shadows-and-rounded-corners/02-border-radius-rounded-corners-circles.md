---
id: border-radius-rounded-corners-circles
slug: border-radius-rounded-corners-circles
course: css-for-beginners
chapter: 7
topic: 7.2
title: "Border Radius: Rounded Corners, Pills, and Circular Avatars"
description: Master border-radius in CSS - subtle card corners (8px), pill buttons (50px), circular profile avatars (50%), and 4-corner individual curves with cricket ball and school stamp analogies.
difficulty: Beginner
readingTime: 9
order: 21
keywords:
  - border-radius
  - rounded corners css
  - circular avatar
  - pill button
  - 4-corner border radius
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Border Radius: Rounded Corners, Pills, and Circular Avatars

In the early days of the web, every single box, button, and image had sharp, 90-degree razor corners like an old iron trunk box. 🗃️

Today, look at your smartphone screen, YouTube cards, Instagram buttons, and school ID badges: almost everything has soft, friendly, and elegant curved corners.

In CSS, the property that rounds off corners is called **`border-radius`**.

In this lesson, you will master:
1. How `border-radius` works under the hood
2. The 3 most popular UI patterns: **Cards**, **Pill Buttons**, and **Circular Avatars**
3. Styling individual corners for creative shapes (like speech bubbles and leaves)
4. Why `overflow: hidden` is essential when rounding card images

---

# The Cricket Ball & Compass Analogy 🏏

How does the browser calculate a rounded corner?

Imagine taking a geometry compass, placing it inside the corner of a square piece of cardboard, and drawing a circular arc of radius **R**:

```text
       SHARP CORNER (0px)                 ROUNDED CORNER (16px)

       +───────────────                   ╭───────────────
       │                                 /   (Radius: 16px)
       │                                │
       │                                │
```

- When `border-radius: 0;` &rarr; The corner is a sharp 90-degree point.
- When you increase the radius (e.g., `8px`, `16px`, `24px`) &rarr; The corner curves more gently!

> 💡 **Fun Fact:** You do **not** need a visible border for `border-radius` to work! Even if an element has no border, `border-radius` curves the background color and clipping boundary of the element.

---

# Pattern 1: Subtle Modern Card Corners (8px to 16px)

The most common use of `border-radius` in modern web design is giving cards, modals, and text inputs a soft, welcoming feel:

```css
.card {
  background-color: white;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px; /* Soft, modern curve */
}

input[type="text"] {
  border: 1px solid #cbd5e1;
  border-radius: 6px;  /* Subtle curve for inputs */
  padding: 8px 12px;
}
```

---

# Pattern 2: The Pill Button (Capsule Shape ⭐)

Have you seen pill-shaped buttons on YouTube, Spotify, or Netflix with completely semi-circular ends?

```css
.pill-btn {
  background-color: #2563eb;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 9999px; /* Or 50px */
  cursor: pointer;
  font-weight: bold;
}
```

```text
       (===============================)
        ▲                             ▲
        └─ Fully rounded capsule ends ┘
```

### Why `9999px`?
If you give `border-radius` a number much larger than the height of the button (like `50px` or `9999px`), the browser automatically caps the curve to a perfect semicircle on both ends, creating an indestructible pill shape regardless of how wide the button stretches!

---

# Pattern 3: The Perfect Circular Avatar (50% ⭐)

How do platforms like Google, WhatsApp, and GitHub make student profile pictures display as perfect circles?

### The Two Golden Rules for Perfect Circles:
1. The element must have **equal width and height** (a perfect square: `width: 80px; height: 80px;`).
2. Set **`border-radius: 50%;`**.

```css
.avatar-img {
  width: 90px;
  height: 90px;
  border-radius: 50%; /* Makes a perfect square into a perfect circle! */
  object-fit: cover;  /* Prevents the student's photo from stretching */
  border: 3px solid #3b82f6;
}
```

### ⚠️ Common Beginner Trap: The Oval / Egg Shape!
If your image is `width: 120px` and `height: 80px` (a rectangle), setting `border-radius: 50%` will turn it into an **oval or egg shape**, NOT a circle! **The width and height must be strictly equal.**

---

# Styling Individual Corners (The Clockwise Rule)

You can round each corner independently:
- `border-top-left-radius`
- `border-top-right-radius`
- `border-bottom-right-radius`
- `border-bottom-left-radius`

### Shorthand (Clockwise from Top-Left):
`border-radius: top-left top-right bottom-right bottom-left;`

```css
/* Creative Leaf Shape */
.leaf-card {
  border-radius: 30px 0 30px 0;
}

/* Chat Message Bubble (Tail in bottom-left) */
.chat-bubble {
  background-color: #e0e7ff;
  padding: 14px;
  border-radius: 16px 16px 16px 0; /* Bottom-left stays sharp like a tail! */
}
```

```text
[ Chat Bubble Shape: border-radius: 16px 16px 16px 0; ]

╭──────────────────────────╮
│ Hi Rahul, see you at     │
│ the Science Lab at 3 PM! │
╰──────────────────────────┘
▲
└─ Sharp 0px corner creates the speech tail!
```

---

# ⚠️ The Card Image Bleed Bug (and How to Fix It!)

Have you ever created a card with `border-radius: 16px`, placed an image at the top of the card, and noticed that the **image's square corners poke out past the card's rounded border**?

```text
[ Broken: Image corners poke out! ]      [ Fixed: overflow: hidden ]
+----+────────────────────────+----+     ╭────────────────────────╮
|IMG |                        |IMG |     │                        │
+----+                        +----+     │  Image neatly clipped  │
╰──────────────────────────────────╯     ╰────────────────────────╯
```

### The Fix: Add `overflow: hidden;` to the Card!
```css
.card {
  border-radius: 16px;
  overflow: hidden; /* Clips any child images to match the rounded curve! */
}
```

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| Setting `border-radius: 50%` on a rectangle (100px x 60px). | Ensure `width` and `height` are equal before setting `50%`. | Rectangles with 50% radius turn into squished ovals instead of circles. |
| Letting images poke out of rounded cards. | Add `overflow: hidden;` to the parent card. | Forces the inner image to conform to the parent's rounded corners. |
| Over-rounding cards to 50px so text gets cut off. | Keep cards between `8px` and `16px`. | Excessive radius on cards eats into internal content space. |

---

# Quick Revision Summary

- ✅ `border-radius` curves the corners of an element.
- ✅ You do not need a border property for `border-radius` to work.
- ✅ Subtle curves on cards typically range between **`8px` and `16px`**.
- ✅ **Pill buttons** use a large radius like **`9999px`** or `50px`.
- ✅ **Circular avatars** require equal `width` and `height` plus **`border-radius: 50%`**.
- ✅ Individual corners follow clockwise order: Top-Left &rarr; Top-Right &rarr; Bottom-Right &rarr; Bottom-Left.
- ✅ Use **`overflow: hidden`** on parent cards to prevent inner images from bleeding out.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which CSS property value transforms a 100px by 100px square image into a perfect circle?
A. `border-style: circle;`
B. `border-radius: 50%;`
C. `border-shape: round;`
D. `border-radius: 100px;`
**Answer:** B

---

### 2. What shape results if you apply `border-radius: 50%;` to an image that is 200px wide and 100px tall?
A. A perfect circle
B. An oval / ellipse
C. A square
D. A triangle
**Answer:** B

---

### 3. Which declaration creates a capsule-shaped "pill" button with fully rounded ends?
A. `border-radius: 9999px;`
B. `border-radius: 2px;`
C. `border-style: pill;`
D. `border-width: 50%;`
**Answer:** A

---

### 4. Following the 4-value shorthand, which corner is targeted by the FIRST value in `border-radius: 20px 10px 5px 0;`?
A. Top-Right
B. Top-Left
C. Bottom-Right
D. Bottom-Left
**Answer:** B

---

### 5. Why do image corners sometimes poke out past the rounded corners of a parent card, and how is it resolved?
A. The image resolution is too high; compress the image
B. Child elements do not automatically clip to parent curves; add `overflow: hidden;` to the parent container
C. The image is in PNG format; change it to JPEG
D. Increase the border-width to 50px
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `avatar-card.html`.
2. Build a modern student council card featuring:
   - A rounded card with `overflow: hidden;`
   - A circular avatar with a blue border
   - A pill-shaped status badge
   - A speech bubble quote
3. Paste and test this code:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Border Radius Challenge</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         background-color: #f1f5f9;
         padding: 40px;
         display: flex;
         justify-content: center;
       }

       .profile-card {
         width: 100%;
         max-width: 380px;
         background-color: white;
         border-radius: 16px;         /* Rounded Card */
         overflow: hidden;            /* Prevents bleed */
         box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
         text-align: center;
         padding-bottom: 24px;
       }

       .card-header-bg {
         height: 90px;
         background: linear-gradient(135deg, #2563eb, #38bdf8);
       }

       .avatar {
         width: 80px;
         height: 80px;
         border-radius: 50%;          /* Perfect Circle */
         background-color: white;
         border: 4px solid white;
         margin: -40px auto 12px auto; /* Pulls avatar up into header */
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 36px;
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
       }

       .badge-pill {
         display: inline-block;
         background-color: #dcfce7;
         color: #15803d;
         padding: 6px 16px;
         border-radius: 9999px;       /* Pill Badge */
         font-size: 12px;
         font-weight: bold;
         margin-bottom: 16px;
       }

       .quote-bubble {
         background-color: #f8fafc;
         border: 1px solid #e2e8f0;
         padding: 14px;
         margin: 0 24px;
         border-radius: 12px 12px 12px 0; /* Chat Bubble tail */
         font-size: 14px;
         color: #475569;
         font-style: italic;
       }
     </style>
   </head>
   <body>
     <div class="profile-card">
       <div class="card-header-bg"></div>
       <div class="avatar">👩‍🎓</div>
       <h3>Ananya Deshmukh</h3>
       <div class="badge-pill">Head Girl 2026</div>
       <div class="quote-bubble">
         "Leading with empathy, excellence, and dedication to our school community."
       </div>
     </div>
   </body>
   </html>
   ```
4. Open the file in your browser to admire how the card, circle, pill, and speech bubble all demonstrate the versatility of `border-radius`! 🎯
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **Box Shadows and Text Shadows: Depth and Elevation** (Borders, Shadows and Rounded Corners).

👉 **[Continue to Next Lesson: Box Shadows and Text Shadows: Depth and Elevation →](/tutorials/css-for-beginners/box-shadows-and-text-shadows)**
