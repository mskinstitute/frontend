---
id: html5-svg-canvas
slug: html5-svg-canvas
course: html5-complete-course
chapter: 10
topic: 10.4
title: "HTML5 Graphics: SVG & Canvas"
description: Master modern 2D web graphics using Scalable Vector Graphics (<svg>) for crisp icons/diagrams and HTML5 <canvas> for interactive pixel drawing and games in easy Indian English for school students (Classes 8th to 12th).
difficulty: Intermediate
readingTime: 10
order: 4
keywords:
  - html5 graphics
  - svg tag
  - canvas tag
  - scalable vector graphics
  - html5 game development
  - vector vs raster
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML5 Graphics: SVG & Canvas (Drawing on the Web) 🎨

Welcome to Topic 10.4 in **Chapter 10: Media**!

Until now, whenever we wanted to display artwork or illustrations on a webpage, we loaded external image files like `.png`, `.jpg`, or `.webp`.

What happens when a visitor zooms in to **400% on a smartphone**?
Normal raster photos become blurry and pixelated! 

What if you want to:
- Draw a crisp **school emblem or logo** that stays crystal clear on high-resolution Retina screens?
- Build a **dynamic science graph** showing pendulum oscillations?
- Build an interactive **2D computer game** (like Pong, Flappy Bird, or Snake) right inside the browser?

HTML5 introduced two native graphical powerhouses:
1. **SVG (Scalable Vector Graphics)**
2. **HTML5 `<canvas>`**

In this lesson, you will discover how these two technologies work and when to pick each one!

---

# The Real-Life School Analogy: The Geometry Stencil vs The Graph Paper 📐

Think about two common items in your **School Geometry & Math Kit**:

### 1. The Plastic Geometry Stencil (SVG)
When you use a plastic circular stencil to trace a circle with a fine-tip pen:
- The shape is defined by pure geometry (a center point and radius $r$).
- If you trace that circle in your pocket diary, it looks sharp.
- If you project that circle onto a giant 50-foot cinema projector screen, the curves remain **100% razor sharp with zero blur**!
- That is **SVG (Scalable Vector Graphics)**!

### 2. The Math Millimeter Graph Paper (Canvas)
Think of a grid of tiny square millimeters in your mathematics lab manual:
- You color specific coordinate boxes $(x, y)$ with color sketch pens to build a pixelated mosaic image.
- If you hold a magnifying glass over the paper, you see individual colored pixel squares.
- That is **HTML5 `<canvas>`**! It gives you a blank grid of pixels where you can paint dynamically using code!

---

# 1. Scalable Vector Graphics: `<svg>` 🛡️

**SVG** is an XML-based language for describing 2D vector shapes directly inside your HTML document.

Because SVG is made of mathematical equations (lines, curves, and angles), **it has infinite resolution** &mdash; it never blurs, no matter how much you zoom in!

### Basic SVG Shapes:

```html
<!-- An SVG canvas of 300px by 150px -->
<svg width="300" height="150" style="border: 1px dashed #ccc;">

  <!-- 1. Rectangle: x, y, width, height, fill color -->
  <rect x="20" y="20" width="100" height="60" fill="#0A2540" rx="8" />

  <!-- 2. Circle: cx (center X), cy (center Y), r (radius) -->
  <circle cx="180" cy="50" r="35" fill="#FF6B00" />

  <!-- 3. Line: start (x1, y1) to end (x2, y2) -->
  <line x1="20" y1="110" x2="260" y2="110" stroke="#0070F3" stroke-width="4" />

  <!-- 4. Text inside SVG -->
  <text x="25" y="55" fill="white" font-weight="bold" font-family="sans-serif">MSK</text>
</svg>
```

### Why Developers Love Inline SVG:
1. **Zero Blurriness:** Looks stunning on 4K monitors and mobile phones.
2. **Tiny File Size:** A few lines of text replace a 200 KB image file!
3. **Interactive & Stylable:** You can change SVG colors on hover using CSS:
   ```css
   circle:hover { fill: #00CC88; cursor: pointer; }
   ```
4. **Accessible:** Screen readers can read `<title>` and `<desc>` tags placed inside SVG.

---

# 2. Pixel Drawing & Games: The HTML5 `<canvas>` 🎮

While SVG is made of independent vector shapes, **`<canvas>`** is an empty rectangular pixel board.

You create the board in HTML, and then use **JavaScript** like an artist's paintbrush to draw lines, circles, text, and animations:

```html
<!-- Step 1: Create the canvas element in HTML -->
<canvas id="myCanvas" width="400" height="200" style="border: 2px solid #0A2540;"></canvas>

<!-- Step 2: Draw using JavaScript -->
<script>
  // A. Find the canvas board
  const canvas = document.getElementById('myCanvas');

  // B. Get the 2D Drawing Context (our paintbrush!)
  const ctx = canvas.getContext('2d');

  // C. The Coordinate System: (0, 0) is top-left!
  // Draw a solid orange rectangle: fillRect(x, y, width, height)
  ctx.fillStyle = '#FF6B00';
  ctx.fillRect(30, 30, 140, 80);

  // D. Draw a stroked blue circle
  ctx.beginPath();
  ctx.arc(260, 70, 40, 0, 2 * Math.PI); // (x, y, radius, startAngle, endAngle)
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#0A2540';
  ctx.stroke();

  // E. Draw Text on Canvas
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#0A2540';
  ctx.fillText('Hello from Canvas! 🎨', 30, 160);
</script>
```

### The Canvas Coordinate System 🧭
Always remember how canvas coordinates work:
- **$(0, 0)$** is at the **top-left corner** of the canvas!
- **$X$ values** increase towards the **right** &rarr;.
- **$Y$ values** increase downwards &darr; (unlike standard Cartesian school math graphs where $Y$ goes up!).

---

# 3. Head-to-Head Comparison: SVG vs Canvas 🥊

| Feature | SVG (Vector Shapes) 📐 | Canvas (Pixel Bitmap) 🖼️ |
|---|---|---|
| **Drawing Type** | Vector-based (Mathematical formulas) | Raster / Bitmap (Pixel grid) |
| **Resolution** | **Infinite!** Never pixelates or blurs. | Fixed resolution. Can blur if stretched. |
| **DOM Nodes** | Every shape is an HTML DOM element. | A single `<canvas>` tag (shapes are drawn into memory). |
| **CSS Styling** | Yes! Can style and animate shapes via CSS. | No CSS styling for individual shapes. |
| **Event Handling** | Can add `onclick` directly to individual shapes! | Must manually calculate $(x, y)$ mouse click coordinates. |
| **Performance** | Slower if rendering thousands of shapes. | **Lightning fast!** Can render 100,000 particles at 60 FPS. |
| **Best Used For** | Logos, UI icons, school emblems, charts. | 2D/3D browser games, video processing, canvas drawing tools. |

---

# Complete Real-World Project: School Sports Shield & Scoreboard 🏫

Here is a complete, working HTML webpage featuring a pure SVG School Shield Emblem and an interactive Canvas target score game:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vidya Niketan - SVG & Canvas Demo</title>
  <style>
    body { font-family: sans-serif; max-width: 750px; margin: 30px auto; padding: 0 15px; }
    .badge-card { display: flex; align-items: center; gap: 20px; background: #f0f4f8; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>

  <header>
    <h1>School Creative Technology Lab 🔬</h1>
    <p>Demonstrating Vector Graphics (SVG) & Raster Canvas Animation</p>
  </header>

  <hr>

  <main>
    <!-- Part 1: SVG Vector Shield Emblem -->
    <section>
      <h2>1. School House Championship Shield (Pure SVG)</h2>
      <p>This shield icon is drawn with pure HTML code &mdash; no external image files needed!</p>

      <div class="badge-card">
        <svg width="120" height="140" viewBox="0 0 120 140" aria-label="School House Shield Emblem">
          <!-- Shield Outer Border -->
          <polygon points="60,10 110,35 100,110 60,135 20,110 10,35" fill="#0A2540" stroke="#FF6B00" stroke-width="4" />
          
          <!-- Inner Golden Star -->
          <polygon points="60,35 67,52 85,52 70,64 76,82 60,70 44,82 50,64 35,52 53,52" fill="#FFD700" />

          <!-- Shield Banner Text -->
          <text x="60" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="sans-serif">TAGORE</text>
        </svg>

        <div>
          <h3>Red House (Tagore Champions)</h3>
          <p>Zoom in on this badge with your browser &mdash; the golden star and shield edges will remain perfectly sharp forever!</p>
        </div>
      </div>
    </section>

    <hr>

    <!-- Part 2: Interactive HTML5 Canvas Archery Target -->
    <section>
      <h2>2. Interactive Archery Target (HTML5 Canvas)</h2>
      <p>Click the button below to draw an Olympic-style archery target on the canvas:</p>

      <canvas id="archery-board" width="300" height="300" style="border: 2px solid #333; background: #fff;"></canvas>
      <br><br>
      <button type="button" onclick="drawTarget()">🎯 Draw Archery Target</button>
    </section>
  </main>

  <script>
    function drawTarget() {
      const canvas = document.getElementById('archery-board');
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Clear previous drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ring 1: White outer ring (radius 120)
      drawCircle(ctx, centerX, centerY, 120, '#ffffff', '#000000');

      // Ring 2: Black ring (radius 90)
      drawCircle(ctx, centerX, centerY, 90, '#000000', '#000000');

      // Ring 3: Blue ring (radius 65)
      drawCircle(ctx, centerX, centerY, 65, '#0070F3', '#000000');

      // Ring 4: Red ring (radius 40)
      drawCircle(ctx, centerX, centerY, 40, '#FF3366', '#000000');

      // Ring 5: Yellow Bullseye (radius 18)
      drawCircle(ctx, centerX, centerY, 18, '#FFD700', '#000000');

      // Target Crosshair
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.fillText('+ 100 PTS', centerX - 25, centerY + 4);
    }

    function drawCircle(ctx, x, y, r, fillColor, strokeColor) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  </script>

  <hr>

  <footer>
    <p>&copy; 2026 Vidya Niketan Creative Lab. Powered by HTML5.</p>
  </footer>

</body>
</html>
```

---

# Common Beginner Mistakes & Best Practices ⚠️

| ❌ Common Mistake | ✅ Best Practice | Why It Matters |
|---|---|---|
| Setting Canvas size with CSS width/height (`style="width: 400px;"`). | Always set Canvas dimensions using HTML attributes: `<canvas width="400" height="300">`. | CSS width stretches the pixel bitmap, causing blurry, distorted graphics! |
| Using Canvas for logos and website icons. | Use SVG for logos and icons. | SVG scales infinitely without blurriness and has a much smaller file size. |
| Forgetting `ctx.beginPath()` before drawing paths on Canvas. | Always call `ctx.beginPath()` before starting a new shape. | Without `beginPath()`, previous shapes reconnect and create messy unwanted lines. |
| Forgetting accessibility on SVG (`aria-label`). | Add `aria-label` or `<title>` inside `<svg>` icons. | Screen readers need accessible labels to describe the graphic to visually impaired users. |
| Thinking $(0, 0)$ is at the bottom-left of Canvas. | Remember that $(0, 0)$ is at the **top-left corner**. | Canvas coordinates increase downwards on the $Y$-axis! |

---

# Quick Summary (Revision Notes) 🧠

- **SVG (Scalable Vector Graphics)** uses mathematical formulas (lines, curves, polygons) to create infinite-resolution graphics that never blur.
- Common SVG shape tags: `<rect>`, `<circle>`, `<line>`, `<polygon>`, and `<text>`.
- Individual SVG elements can be styled with CSS and receive mouse click events.
- **HTML5 `<canvas>`** is an empty pixel-based bitmap grid manipulated dynamically with JavaScript via its 2D context (`getContext('2d')`).
- Canvas coordinate $(0, 0)$ starts at the **top-left** corner; $X$ increases rightward, $Y$ increases downward.
- **When to choose SVG:** Logos, UI icons, badges, school crests, and static charts.
- **When to choose Canvas:** 2D browser games, high-frequency particle animations, and photo filter manipulation.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. What happens when you zoom in on an SVG graphic by 500%?
A. It becomes pixelated and blurry
B. It remains 100% razor sharp with zero loss in visual quality
C. The colors invert into black and white
D. The browser crashes
**Answer:** B

---

### 2. Which tag is used in SVG to draw a circle with a center point and radius?
A. `<round>`
B. `<circle cx="..." cy="..." r="...">`
C. `<dot>`
D. `<arc>`
**Answer:** B

---

### 3. Where is the origin coordinate $(0, 0)$ located on an HTML5 `<canvas>`?
A. In the exact center
B. At the bottom-left corner
C. At the top-left corner
D. At the bottom-right corner
**Answer:** C

---

### 4. Which JavaScript method retrieves the drawing context used to paint on a `<canvas>`?
A. `canvas.getPaintbrush()`
B. `canvas.getContext('2d')`
C. `canvas.createTool()`
D. `canvas.drawContext()`
**Answer:** B

---

### 5. Why should you prefer Canvas over SVG when building a fast-paced 2D action game with 5,000 moving objects?
A. SVG cannot display colors
B. Canvas renders directly into a pixel bitmap in memory, making it much faster for thousands of moving objects
C. SVG only works on desktop computers
D. Canvas does not require electricity
**Answer:** B

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`creative-graphics-lab.html`**.

### Your Challenge:
Build a **School Science & Sports Graphic Studio**:
1. **SVG School Crest (Vector):**
   - Create an `<svg width="200" height="200">`.
   - Draw a blue circle base: `<circle cx="100" cy="100" r="80" fill="#0A2540" />`.
   - Add a smaller white inner circle: `<circle cx="100" cy="100" r="70" fill="white" />`.
   - Place your school initials inside with `<text x="100" y="110" text-anchor="middle" fill="#FF6B00" font-size="28" font-weight="bold">MSK</text>`.
2. **Canvas Cricket Pitch (Raster):**
   - Create a `<canvas id="pitch" width="300" height="200">`.
   - Using JavaScript, draw a green cricket field background with `ctx.fillStyle = '#2d6a4f'; ctx.fillRect(0, 0, 300, 200);`.
   - Draw a rectangular tan cricket pitch in the center: `ctx.fillStyle = '#e9c46a'; ctx.fillRect(100, 20, 100, 160);`.
   - Draw three white cricket stumps using lines or thin rectangles.

Open the file in your browser to admire your custom vector badge and painted canvas pitch!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Forms & Input Types** (Form).

👉 **[Continue to Next Lesson: Forms & Input Types →](/tutorials/html5-complete-course/forms-input-types)**
