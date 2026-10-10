---
id: html-entities-symbols
slug: html-entities-symbols
course: html5-complete-course
chapter: 3
topic: 3.3
title: HTML Entities, Symbols & Emojis
description: Learn how to display reserved characters (<, >, &), non-breaking spaces (&nbsp;), currency symbols (Indian Rupee ₹), math formulas, and emojis in easy Indian English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 3
keywords:
  - html entities
  - special characters
  - nbsp non breaking space
  - indian rupee symbol html
  - copyright symbol
  - html emojis
  - math symbols html
  - school html tutorial
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML Entities, Symbols & Emojis (Typing Special Characters) 🪙

Welcome to Topic 3.3 in **Chapter 3: Text Formatting**!

Have you ever tried typing a math formula like:
> **Is 5 < 10?**

...inside an HTML paragraph, only to discover that the browser hides your text or gets completely confused?

Why does that happen? Because the browser sees the less-than sign (`<`) and thinks: *"Oh! The student is trying to start a new HTML tag like `<p>` or `<div>`!"* When it can't find a tag name, your page layout breaks!

What if you want to:
- Type the official **Indian Rupee symbol (₹)**?
- Add a **Copyright symbol (&copy;)** in your website footer?
- Put **three spaces** between words without HTML collapsing them into one space?
- Type math symbols like **degree (&deg;C)**, **multiplication (&times;)**, or **division (&divide;)**?

**HTML Entities solve all of these problems easily!**

---

# The Real-Life School Analogy: The Teacher's Chalkboard Stencil 📐

Think about your **Mathematics & Science blackboard**:

When your math teacher writes equations on the board, standard English letters (A, B, C) aren't enough. The teacher draws:
- The square root radical sign $\sqrt{x}$
- The Greek letter Pi ($\pi = 3.14$)
- The plus-or-minus sign ($\pm 5$)
- The degree circle ($100^\circ\text{C}$)

Your keyboard doesn't have a single key for "Pi" or "Plus-Minus" or "Copyright". 

An **HTML Entity** is like a secret digital stencil code. You type a short code starting with an ampersand (`&`) and ending with a semicolon (`;`), and the browser stamps the beautiful special character right onto your webpage!

---

# 1. Anatomy of an HTML Entity 🔬

Every HTML entity follows a strict format:
```text
&  +  EntityName  +  ;
OR
&# +  EntityNumber + ;
```

1. **Begins with:** An ampersand (`&`).
2. **Body:** Either a friendly word name (e.g. `copy`) or a Unicode decimal number (e.g. `8377`).
3. **Ends with:** A mandatory semicolon (`;`).

> [!WARNING]
> Never forget the closing semicolon (`;`)! If you write `&copy` without `;`, some browsers will fail to display the symbol properly.

---

# 2. The 5 Essential Reserved Characters 🔒

Because HTML uses characters like `<` and `>` to build tags, you must **always** use entity codes when you want to display them as literal text:

| Symbol | Meaning | Entity Name Code | Entity Number Code | Example Code | What Displays |
|---|---|---|---|---|---|
| `<` | Less-than | `&lt;` | `&#60;` | `5 &lt; 10` | 5 < 10 |
| `>` | Greater-than | `&gt;` | `&#62;` | `10 &gt; 5` | 10 > 5 |
| `&` | Ampersand | `&amp;` | `&#38;` | `Physics &amp; Chemistry` | Physics & Chemistry |
| `"` | Double Quotation | `&quot;` | `&#34;` | `He said &quot;Hello&quot;` | He said "Hello" |
| `'` | Single Quote / Apostrophe | `&apos;` | `&#39;` | `Aryan&apos;s Book` | Aryan's Book |

```html
<!-- Displaying raw HTML tags on a tutorial page -->
<p>To make text bold, use the <code>&lt;strong&gt;</code> tag!</p>
```

---

# 3. The Super-Power of Non-Breaking Space: `&nbsp;` 🧲

Have you noticed what happens when you press the Spacebar 10 times in HTML?
```html
<p>Aryan          Sharma</p>
```
The browser ignores 9 of those spaces and displays: `Aryan Sharma`. This is called **whitespace collapse**.

### What does `&nbsp;` do?
**`&nbsp;`** stands for **Non-Breaking Space**. It does two incredible things:

1. **Forces Extra Visible Spaces:**
   ```html
   <!-- Three visible spaces between words -->
   <p>Aryan&nbsp;&nbsp;&nbsp;Sharma</p>
   ```

2. **Acts as Digital Fevicol (Prevents Ugly Line Breaks!):**
   Imagine you write `10 km` or `Class 10` near the right edge of a phone screen. Sometimes `10` stays on line 1, and `km` drops alone to line 2! That looks untidy and awkward.
   
   If you write:
   ```html
   <p>The school marathon distance is 10&nbsp;km.</p>
   ```
   The browser promises **never** to split `10` and `km` across two different lines &mdash; they will always stay glued together!

---

# 4. Currency Symbols: The Indian Rupee `₹` 💰

When displaying school fees, canteen prices, or book costs, you need currency symbols:

| Currency | Symbol | Entity Name / Number | Example Code | Result |
|---|---|---|---|---|
| **Indian Rupee** | ₹ | `&#8377;` | `Annual Lab Fee: &#8377; 1,500` | Annual Lab Fee: ₹ 1,500 |
| **US Dollar** | $ | `&dollar;` or `&#36;` | `&dollar; 20` | $ 20 |
| **Euro** | € | `&euro;` or `&#8364;` | `&euro; 50` | € 50 |
| **British Pound** | £ | `&pound;` or `&#163;` | `&pound; 15` | £ 15 |
| **Japanese Yen** | ¥ | `&yen;` or `&#165;` | `&yen; 1000` | ¥ 1000 |

```html
<p>School Canteen Lunch Thali: <strong>&#8377; 60</strong> only.</p>
```

---

# 5. Common Legal & Commercial Symbols 📜

| Symbol | Meaning | Entity Name | Example |
|---|---|---|---|
| **&copy;** | Copyright Notice | `&copy;` | `&copy; 2026 MSK Institute` &rarr; &copy; 2026 MSK Institute |
| **&reg;** | Registered Trademark | `&reg;` | `Android&reg; OS` &rarr; Android&reg; OS |
| **&trade;** | Trademark | `&trade;` | `MSK Notes&trade;` &rarr; MSK Notes&trade; |
| **&sect;** | Section Sign | `&sect;` | `Rule &sect; 4` &rarr; Rule &sect; 4 |

---

# 6. Mathematics & Science Symbols 🧪

No more struggling to write science formulas on your school webpage:

| Symbol | Name | Entity Code | Formula Example |
|---|---|---|---|
| **&times;** | Multiplication Cross | `&times;` | `5 &times; 5 = 25` &rarr; 5 &times; 5 = 25 |
| **&divide;** | Division Symbol | `&divide;` | `100 &divide; 4 = 25` &rarr; 100 &divide; 4 = 25 |
| **&plusmn;** | Plus or Minus | `&plusmn;` | `5 &plusmn; 0.2 mm` &rarr; 5 &plusmn; 0.2 mm |
| **&deg;** | Degree Symbol | `&deg;` | `Normal Body Temp: 37&deg;C` &rarr; Normal Body Temp: 37&deg;C |
| **&pi;** | Greek letter Pi | `&pi;` | `Area = &pi;r&sup2;` &rarr; Area = &pi;r&sup2; |
| **&infin;** | Infinity | `&infin;` | `Focal length: &infin;` &rarr; Focal length: &infin; |
| **&ne;** | Not Equal To | `&ne;` | `x &ne; 0` &rarr; x &ne; 0 |
| **&le;** / **&ge;** | Less/Greater Equal | `&le;` / `&ge;` | `Score &ge; 75%` &rarr; Score &ge; 75% |
| **&micro;** | Micro | `&micro;` | `5 &micro;F capacitor` &rarr; 5 &micro;F capacitor |

---

# 7. Fun with Modern Emojis in HTML 😄

Emojis are characters in the modern **Unicode standard**! You can paste them directly, or use their universal decimal codes starting with `&#`:

```html
<!-- Rocket Emoji -->
<p>Launch Your Project: &#128640; (Code: &#128640;)</p>

<!-- Trophy Emoji -->
<p>First Prize Winner: &#127942; (Code: &#127942;)</p>

<!-- Smiling Face -->
<p>Happy Learning: &#128512; (Code: &#128512;)</p>
```

> [!TIP]
> To ensure emojis and Indian Rupee symbols display properly across all computers and smartphones, **always include `<meta charset="UTF-8">`** inside the `<head>` of your HTML document!

---

# Complete Real-World Project: School Fee & Science Formula Sheet 🏫

Here is a complete, working webpage demonstrating proper use of entities, currency codes, and math formulas:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Delhi Public Model School - Fee Structure & Formula Sheet</title>
</head>
<body>

  <header>
    <h1>Delhi Public Model School &trade;</h1>
    <p>Affiliated with CBSE &bull; New Delhi</p>
  </header>

  <hr>

  <main>
    <!-- Section 1: Fee Structure -->
    <section>
      <h2>Class 10 Annual Fee Schedule (2026-27)</h2>
      <ul>
        <li>Monthly Tuition Fee: <strong>&#8377;&nbsp;2,500</strong></li>
        <li>Computer &amp; Science Lab Fee: <strong>&#8377;&nbsp;600</strong></li>
        <li>Sports &amp; Library Development: <strong>&#8377;&nbsp;400</strong></li>
      </ul>
      <p><em>Note: Late fee of &#8377;&nbsp;50 per week applies if paid after the 10th of every month.</em></p>
    </section>

    <hr>

    <!-- Section 2: Physics Lab Quick Reference -->
    <section>
      <h2>Class 10 Physics Quick Reference Formulae</h2>

      <p>
        <strong>1. Lens Formula:</strong><br>
        1/f = 1/v &minus; 1/u
      </p>

      <p>
        <strong>2. Electric Power Formula:</strong><br>
        P = V &times; I &nbsp;&nbsp;(where V is Voltage &amp; I is Current)
      </p>

      <p>
        <strong>3. Boiling Point of Pure Water:</strong><br>
        Temperature = 100&deg;C &nbsp;&plusmn;&nbsp;0.5&deg;C
      </p>

      <p>
        <strong>4. Area of a Circular Conductor:</strong><br>
        A = &pi;r&sup2; &nbsp;&nbsp;(where &pi; &approx; 3.1416)
      </p>

      <p>
        <strong>5. Resistance Condition:</strong><br>
        For superconductivity, R &rarr; 0 as T &rarr; 0&nbsp;K.
      </p>
    </section>
  </main>

  <hr>

  <footer>
    <p>&copy;&nbsp;2026 Delhi Public Model School. All rights reserved.</p>
    <p>Created with pride by Class 10 Web Club &#128640; &#127942;</p>
  </footer>

</body>
</html>
```

---

# Common Beginner Mistakes & Best Practices ⚠️

| ❌ Common Mistake | ✅ Best Practice | Why It Matters |
|---|---|---|
| Typing literal `<` or `>` inside normal text (e.g. `a < b`). | Always write `a &lt; b` or `a &gt; b`. | The browser will mistake `<` for the opening of an unclosed HTML tag! |
| Forgetting the semicolon (`;`) at the end of an entity code (`&copy`). | Always include the semicolon: `&copy;`. | Missing semicolon causes inconsistent rendering on mobile browsers. |
| Pressing the Spacebar 20 times to space out text. | Use CSS margins or `&nbsp;` sparingly. | HTML automatically collapses multiple consecutive spaces into a single space. |
| Forgetting `<meta charset="UTF-8">`. | Always place `<meta charset="UTF-8">` in `<head>`. | UTF-8 allows browsers to correctly display Indian Rupee (`₹`), emojis, and Hindi characters without corruption. |

---

# Quick Summary (Revision Notes) 🧠

- **HTML Entities** display reserved characters, math symbols, and currencies that are not easily typed on keyboards.
- Entities begin with an **`&`** and end with a **`;`**.
- **The Big Five Reserved Characters:**
  - `&lt;` (<)
  - `&gt;` (>)
  - `&amp;` (&)
  - `&quot;` (")
  - `&apos;` (')
- **`&nbsp;` (Non-Breaking Space)** forces extra spaces and prevents words/numbers from breaking awkwardly across lines.
- **`&#8377;`** displays the official Indian Rupee symbol (**₹**).
- **`&copy;`** displays the Copyright symbol (**&copy;**).
- Math symbols like `&times;` ($\times$), `&divide;` ($\div$), `&deg;` ($^\circ$), and `&pi;` ($\pi$) help write clear scientific formulas.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which HTML entity correctly represents the less-than sign (`<`)?
A. `&less;`
B. `&lt;`
C. `&#less;`
D. `&l;`
**Answer:** B

---

### 2. What does `&nbsp;` stand for in HTML?
A. New Blank Section Paragraph
B. Non-Breaking Space
C. Number Between System Positions
D. Native Browser Special Page
**Answer:** B

---

### 3. Which code displays the official Indian Rupee currency symbol (`₹`)?
A. `&rupee;`
B. `&#8377;`
C. `&inr;`
D. `&#100;`
**Answer:** B

---

### 4. What character must ALWAYS be placed at the very end of an HTML entity?
A. A colon (`:`)
B. A period (`.`)
C. A semicolon (`;`)
D. An exclamation mark (`!`)
**Answer:** C

---

### 5. Which entity code displays the mathematical degree symbol (&deg;) for writing temperatures like 37&deg;C?
A. `&degree;`
B. `&deg;`
C. `&#temp;`
D. `&circle;`
**Answer:** B

---

# Hands-on Practice Challenge 🎯

Open VS Code and create a file named **`science-canteen-menu.html`**.

### Your Challenge:
Create a **School Canteen & Stationery Store Price List**:
1. **School Header:** Include your school name with `&trade;` and a copyright notice with `&copy; 2026`.
2. **Canteen Menu Table:**
   - Display at least 4 food items (e.g. Samosa, Veg Sandwich, Mango Juice, Fruit Salad).
   - Display their prices using the **Indian Rupee symbol (`&#8377;`)** (e.g. `&#8377;&nbsp;15`).
3. **Stationery Discount Rules:**
   - Write a sentence: *"Buy &gt; 5 notebooks to get a 10% discount!"* using `&gt;`.
   - Write: *"Calculators: Error margin &plusmn;&nbsp;0.01"* using `&plusmn;`.
4. **Chemistry Tip:**
   - Write: *"Store chemical reagents at temperature &le;&nbsp;25&deg;C"* using `&le;` and `&deg;`.
5. **Add Emojis:** Add celebration emojis using Unicode decimal codes (like `&#128512;` and `&#128640;`).

Open your file in Google Chrome or Microsoft Edge to see your symbols render cleanly!
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **HTML Comments** (Comments).

👉 **[Continue to Next Lesson: HTML Comments →](/tutorials/html5-complete-course/html-comments)**
