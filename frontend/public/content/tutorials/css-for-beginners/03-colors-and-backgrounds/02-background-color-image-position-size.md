---
id: background-color-image-position-size
slug: background-color-image-position-size
course: css-for-beginners
chapter: 3
topic: 3.2
title: Background Color, Image, Position, and Size
description: Master CSS background properties - background-color, background-image (url), repeat, position, size (cover vs contain), and attachment with classroom notice board wallpaper analogies.
difficulty: Beginner
readingTime: 10
order: 9
keywords:
  - css background
  - background-image
  - background-size cover contain
  - background-position
  - background-repeat
  - background shorthand
  - learn css
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Background Color, Image, Position, and Size

Have you ever visited a modern website and noticed a stunning, full-screen photo of a mountain, school campus, or city skyline behind the welcome title? 🌄

In CSS, the **background** family of properties gives you full artistic control over what sits behind your text, cards, and sections.

In this lesson, you will master the 6 core background properties:
1. `background-color`
2. `background-image`
3. `background-repeat`
4. `background-position`
5. `background-size` (`cover` vs `contain`)
6. `background-attachment` (`fixed` parallax effect)

---

# The Classroom Notice Board Analogy 📌

Imagine your teacher asks you to decorate the large cork notice board in the back of your classroom:

```text
+-------------------------------------------------------------------------+
|                  THE NOTICE BOARD BACKGROUND MODEL                      |
+-------------------------------------------------------------------------+
| 1. background-color      --> Paint the wooden board soft dark green     |
| 2. background-image      --> Pin a photograph of the school building    |
| 3. background-repeat     --> Do you paste 20 small stickers in a grid,  |
|                              or pin ONE single large photo in center?   |
| 4. background-position   --> Pin the photo in the top-right or center?  |
| 5. background-size       --> Stretch photo to COVER the whole board,    |
|                              or fit the entire photo without cropping?  |
| 6. background-attachment --> Does the photo stay fixed on the wall      |
|                              even if you walk past it? (Parallax)       |
+-------------------------------------------------------------------------+
```

---

# 1. `background-color`

Sets a solid background color behind an element.

```css
.card {
  background-color: #f8fafc;
}
```

> 💡 **Best Practice (The Image Fallback):**
> Even when using a background image, **always declare a `background-color` as a fallback**! If a student's internet is slow and the image takes 5 seconds to download, your white text will still be readable against your dark background color!

---

# 2. `background-image`

To display a photograph or illustration, use the `url()` function:

```css
.hero-banner {
  background-image: url('school-campus.jpg');
}
```

You can pass a local image path (`images/hero.png`) or a full web link (`https://example.com/banner.jpg`).

---

# 3. `background-repeat` (Tiling vs Single)

By default, if an image is smaller than the container, web browsers will automatically tile (repeat) it horizontally and vertically like bathroom tiles!

To control repeating, use `background-repeat`:

| Value | Behavior | Common Use Case |
|---|---|---|
| `no-repeat` | Shows the image **only once** without tiling | Hero banners, logos, large photos |
| `repeat` *(Default)* | Tiles the image horizontally and vertically | Small seamless geometric patterns |
| `repeat-x` | Tiles only horizontally (left to right) | Top border ribbons |
| `repeat-y` | Tiles only vertically (top to bottom) | Side wallpaper strips |

```css
.hero-banner {
  background-image: url('banner.jpg');
  background-repeat: no-repeat; /* Shows only once! */
}
```

---

# 4. `background-position` (Where Does It Sit?)

Sets the starting position of your background image inside the container.

### Position Keywords:
You can combine vertical (`top`, `center`, `bottom`) and horizontal (`left`, `center`, `right`) keywords:

```css
.hero-banner {
  background-position: center;       /* Dead center (Both horizontally & vertically) */
  /* Or: top right, bottom left, center top */
}
```

### Precise Coordinates:
You can also use percentages or pixel measurements:
- `background-position: 50% 50%;` (Exact center)
- `background-position: 20px 40px;` (20px from left, 40px from top)

---

# 5. `background-size` (`cover` vs `contain`)

This is one of the most critical properties in responsive web design! How should the image resize when viewed on a mobile phone vs a giant desktop monitor?

```text
+-----------------------------------+   +-----------------------------------+
|       background-size: cover      |   |      background-size: contain     |
+-----------------------------------+   +-----------------------------------+
|  [ Image fills EVERY corner ]     |   |   [ Entire image is visible ]     |
|  • Completely fills the box.      |   |   • No parts of image are cut.    |
|  • No empty spaces left behind.   |   |   • Scales image to fit inside.   |
|  • Small parts may be cropped out.|   |   • Empty gaps may appear around. |
+-----------------------------------+   +-----------------------------------+
```

### 1. `cover` (Most Popular for Hero Sections ⭐)
Stretches and scales the image so that **every single pixel of the container is covered**. It will never leave empty gaps. If the aspect ratios differ, it will gently crop the outer edges.

```css
.hero-section {
  background-image: url('cricket-ground.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover; /* Stretches to fill whole container! */
}
```

### 2. `contain` (Used When Every Detail Matters)
Scales the image so the **entire picture fits inside the container** without any cropping. If the box is wider than the photo, empty space will remain on the sides.

```css
.certificate-preview {
  background-image: url('gold-medal.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; /* Full picture visible! */
}
```

---

# 6. `background-attachment` (The Parallax Effect)

Controls whether the background scrolls along with the webpage or stays glued in place:

- `scroll` *(Default)*: The background image scrolls along as the user scrolls down the page.
- `fixed`: The image stays **locked to the screen viewpoint**! As the user scrolls, the text glides smoothly over the frozen background, creating a stunning 3D **Parallax Window Effect**.

```css
.parallax-section {
  background-image: url('stars.jpg');
  background-attachment: fixed; /* Glued to screen! */
  background-size: cover;
  background-position: center;
}
```

---

# The All-in-One `background` Shorthand

Instead of writing 5 separate lines of CSS, you can combine them into a single `background` shorthand declaration:

```css
/* Writing properties separately */
.hero {
  background-color: #0f172a;
  background-image: url('banner.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Equivalent All-in-One Shorthand */
.hero {
  background: #0f172a url('banner.jpg') no-repeat center / cover fixed;
}
```

> ⚠️ **Syntax Note for Shorthand:**
> Notice the forward slash (`/`) between position and size: `center / cover`. In CSS shorthand, `size` must always follow `position` separated by a slash!

---

# Common Beginner Mistakes (Do's and Don'ts)

| What Beginners Do (Don't ❌) | What You Should Do Instead (Do ✅) | Why? |
|---|---|---|
| Forgetting quotes or `url()`: `background-image: photo.jpg;` | Write `background-image: url('photo.jpg');`. | The browser requires the `url(...)` wrapper to fetch the image file. |
| Forgetting a fallback `background-color`. | Always add a dark or light fallback color. | If the image fails to load, white text on white default background becomes invisible! |
| Using `width` and `height` instead of `background-size`. | Use `background-size: cover;`. | `width` and `height` resize the HTML container box, not the background image. |
| Forgetting slash in shorthand: `center cover`. | Write `center / cover`. | The slash `/` is required by CSS syntax to distinguish position from size. |

---

# Quick Revision Summary

- ✅ `background-color` sets a solid color fill and serves as a vital fallback.
- ✅ `background-image: url('path')` loads an image into the background.
- ✅ `background-repeat: no-repeat` prevents the image from repeating in a tiled grid.
- ✅ `background-position: center` centers the image horizontally and vertically.
- ✅ `background-size: cover` stretches the image to completely fill the element without blank spaces.
- ✅ `background-attachment: fixed` creates a sleek parallax window scrolling effect.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which CSS property value prevents a background image from repeating like tiles across the screen?
A. `background-repeat: stop;`
B. `background-repeat: no-repeat;`
C. `background-tile: false;`
D. `background-repeat: once;`
**Answer:** B

---

### 2. What happens when you set `background-size: cover` on a container?
A. The image shrinks to fit inside without cropping any part
B. The image is deleted and replaced with a solid color
C. The image scales to completely fill the container, cropping outer edges if necessary to avoid blank spaces
D. The image automatically repeats 4 times
**Answer:** C

---

### 3. Which value of `background-attachment` keeps a background image frozen in place while the rest of the page scrolls over it?
A. `scroll`
B. `fixed`
C. `static`
D. `sticky`
**Answer:** B

---

### 4. When writing the CSS `background` shorthand property, what character must separate `position` and `size`?
A. Comma (`,`)
B. Colon (`:`)
C. Forward slash (`/`)
D. Hyphen (`-`)
**Answer:** C

---

### 5. Why should developers always specify a fallback `background-color` when using a background image with white text?
A. It speeds up the computer's CPU
B. If the image fails to load or loads slowly, white text remains readable against the fallback color
C. The HTML validator requires it by law
D. It automatically adds a drop shadow to text
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open your code editor and create `hero-banner.html`.
2. Build a modern school welcome banner with:
   - A dark background image (or gradient fallback).
   - Centered white heading and subtitle.
   - A modern call-to-action button.
3. Paste the following code to see all background properties working in harmony:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>Hero Banner Challenge</title>
     <style>
       * {
         margin: 0;
         padding: 0;
         box-sizing: border-box;
       }

       body {
         font-family: Arial, sans-serif;
       }

       /* Full-width Hero Section */
       .hero-section {
         min-height: 400px;
         background-color: #0f172a; /* Fallback color */
         background-image: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), 
                           url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop');
         background-repeat: no-repeat;
         background-position: center;
         background-size: cover;
         
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         text-align: center;
         color: white;
         padding: 40px 20px;
       }

       .hero-section h1 {
         font-size: 36px;
         margin-bottom: 12px;
       }

       .hero-section p {
         font-size: 18px;
         max-width: 600px;
         margin-bottom: 24px;
         color: #cbd5e1;
       }

       .hero-btn {
         background-color: #2563eb;
         color: white;
         padding: 12px 28px;
         font-size: 16px;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         font-weight: bold;
       }
     </style>
   </head>
   <body>
     <section class="hero-section">
       <h1>Empowering Future Innovators</h1>
       <p>Admissions open for Class 8th to 12th in Web Development, Python, and Artificial Intelligence.</p>
       <button class="hero-btn">Explore Courses</button>
     </section>
   </body>
   </html>
   ```
4. Open the file in Chrome or Edge to see how `cover`, `center`, and the dark tint overlay create an incredible, professional hero banner! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web styling journey with **CSS Gradients: Linear and Radial Gradients** (Colors and Backgrounds).

👉 **[Continue to Next Lesson: CSS Gradients: Linear and Radial Gradients →](/tutorials/css-for-beginners/css-gradients-linear-radial)**
