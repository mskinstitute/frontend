---
id: html-attributes
slug: attributes
course: html5-complete-course
chapter: 1
topic: 1.5
title: Attributes
description: Learn what HTML Attributes are, how to use them with name="value" pairs, and explore common attributes (href, src, alt, title) in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 5
keywords:
  - html attributes
  - what is an html attribute
  - href attribute
  - src attribute
  - alt attribute
  - title attribute
  - boolean attributes
  - html basics for students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML Attributes (Adding Superpowers to Tags)

Welcome to Topic 1.5! ⚡

In the previous lesson, you mastered **HTML Elements**—the basic building blocks of any webpage. Now, imagine you have a plain button or a link on your page. How do you tell the computer:
- Where should this link take the user when clicked?
- Which photo should be displayed inside an image tag?
- What size should the image be?

The answer is: **HTML Attributes**! Attributes give tags extra information and superpowers.

---

# What is an HTML Attribute?

An **Attribute** provides additional settings, properties, or behavior to an HTML element.

Let us understand this with a simple real-life example: **Your School ID Card!** 🪪

```text
🪪 THE SCHOOL ID CARD ANALOGY:

You are a student (an Element):         <student> Rohit </student>

Your ID Card contains your Attributes:
- Roll Number: rollno="24"
- Class:       class="10th"
- House:       house="Red"
- Blood Group: blood="B+"

Complete Element with Attributes:
<student rollno="24" class="10th" house="Red"> Rohit </student>
```

Just like your ID card gives extra details about who you are, **HTML attributes give extra instructions about how an element should behave**.

---

# The Golden Rules of HTML Attributes

Every beginner must remember these 4 simple rules:

1. **Always in the Opening Tag:** Attributes are **ONLY** written inside the opening tag (start tag). They are **NEVER** written in the closing tag!
2. **Name and Value Pair:** Attributes usually come in pairs: `name="value"`.
3. **Always Use Quotes:** Always wrap the value in double quotation marks (`"..."`).
4. **Use Spaces, Not Commas:** If you use multiple attributes in one tag, separate them with a simple space. Never put commas between them!

```html
<!-- Anatomy of an Attribute -->
<a href="https://google.com" target="_blank">Visit Google</a>
── ──────────┬────────────── ───────┬──────
 │           │                      │
Tag    Attribute 1             Attribute 2
```

---

# The Most Common HTML Attributes You Must Know

Here are the most essential attributes every web developer uses every single day:

### 1. The `href` Attribute (For Links)
The `<a>` tag creates clickable hyperlinks. The `href` (Hypertext Reference) attribute tells the browser **which web address (URL)** to open when someone clicks the link:

```html
<a href="https://mskinstitute.in">Visit MSK Institute Website</a>
```

If you don't provide an `href` attribute, the link has nowhere to go!

---

### 2. The `src` Attribute (For Images)
The `<img>` tag displays a picture on your screen. The `src` (Source) attribute tells the browser **where to find the image file**:

```html
<img src="student-award.jpg" alt="Student receiving trophy">
```

- `src` can be a file on your computer (like `myphoto.png`) or a link from the internet (like `https://example.com/logo.png`).

---

### 3. The `alt` Attribute (Alternate Description for Images)
The `alt` attribute provides a text description of the image.

**Why is `alt` so important?**
1. **Broken Images:** If the user's internet is slow or the image file cannot be found, the browser shows this text instead of an ugly broken icon.
2. **Accessibility:** Blind or visually impaired users use "Screen Reader" software that reads the `alt` text aloud to describe the picture!

```html
<!-- If the photo fails to load, users still read: "MSK Computer Lab" -->
<img src="lab.jpg" alt="MSK Computer Lab with students coding">
```

---

### 4. The `width` and `height` Attributes (Setting Image Dimensions)
You can control the size of images using `width` and `height` (measured in pixels):

```html
<img src="school-logo.png" alt="School Logo" width="200" height="100">
```

---

### 5. The `title` Attribute (The Tooltip Helper)
When you add a `title` attribute to any element, a small floating text box (called a **tooltip**) appears whenever a user hovers their mouse cursor over that element!

```html
<p title="Click to read about our computer courses">
  Hover your mouse over this paragraph!
</p>
```

---

### 6. The `target` Attribute (Open in a New Tab)
By default, clicking a link replaces the current webpage. If you want the link to open in a **fresh new browser tab**, use `target="_blank"`:

```html
<a href="https://youtube.com" target="_blank">Open YouTube in New Tab</a>
```

---

### 7. The `lang` Attribute (Declaring Page Language)
As you saw in the boilerplate lesson, the `lang` attribute is used inside the `<html>` root tag to tell search engines and translation tools the language of the page:

```html
<html lang="en"> <!-- English -->
<html lang="hi"> <!-- Hindi -->
```

---

# Summary Table of Key Attributes

| Attribute | Used In Tags | What It Specifies | Example |
|---|---|---|---|
| `href` | `<a>` | Link destination URL | `<a href="https://google.com">` |
| `src` | `<img>`, `<video>`, `<script>` | Path or URL to the file | `<img src="pic.jpg">` |
| `alt` | `<img>` | Alternate description text | `<img alt="School Logo">` |
| `width` / `height` | `<img>`, `<video>` | Size dimensions in pixels | `<img width="300">` |
| `title` | Any tag | Mouse hover tooltip text | `<h1 title="Welcome!">` |
| `target` | `<a>` | Where to open the link | `<a target="_blank">` |
| `lang` | `<html>` | Document language | `<html lang="en">` |

---

# What are Boolean Attributes? (True / False Attributes)

Some special HTML attributes do not need a `"value"`. Their mere presence inside a tag turns on that feature! These are called **Boolean Attributes**.

### Common Examples:
1. **`disabled`:** Turns off an input field or button so users cannot click or type into it.
   ```html
   <button disabled>Button is Disabled</button>
   ```

2. **`required`:** Makes an input field mandatory in a form (user cannot submit without filling it).
   ```html
   <input type="text" required>
   ```

3. **`readonly`:** Users can read the text but cannot edit or change it.
   ```html
   <input type="text" value="Read only text" readonly>
   ```

---

# Common Beginner Mistakes with Attributes

1. ⚠️ **Writing Attributes in Closing Tags:**
   - ❌ Wrong: `</p title="Hello">`
   - ✅ Correct: `<p title="Hello">`

2. ⚠️ **Forgetting Quotation Marks:**
   - ❌ Wrong: `<a href=https://google.com>`
   - ✅ Correct: `<a href="https://google.com">`

3. ⚠️ **Spelling Mistakes in Attribute Names:**
   - ❌ Wrong: `<img scr="photo.jpg">` *(Many beginners type `scr` instead of `src`!)*
   - ✅ Correct: `<img src="photo.jpg">`

4. ⚠️ **Using Commas Between Attributes:**
   - ❌ Wrong: `<img src="photo.jpg", alt="Photo", width="200">`
   - ✅ Correct: `<img src="photo.jpg" alt="Photo" width="200">`

---

# Quick Summary

- ✅ **Attributes** provide extra information, settings, and instructions to HTML tags.
- ✅ Attributes are **always written inside the opening tag**, never in the closing tag.
- ✅ Attributes usually follow the format: `name="value"`.
- ✅ Always use double quotation marks around attribute values.
- ✅ Use **`href`** for link destinations and **`src`** for image paths.
- ✅ Use **`alt`** to describe images for screen readers and slow connections.
- ✅ Use **`target="_blank"`** to open links in a new browser tab.
- ✅ **Boolean Attributes** (like `disabled` and `required`) do not require values.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Where should an HTML attribute always be placed?
A. Inside the closing tag
B. Inside the opening tag
C. Between the two tags alongside content
D. Outside the `<html>` tag
**Answer:** B

---

### 2. Which attribute specifies the destination URL for a hyperlink (`<a>` tag)?
A. `src`
B. `link`
C. `href`
D. `target`
**Answer:** C

---

### 3. Why is the `alt` attribute important for image tags?
A. It changes the background color of the image
B. It makes the image load faster
C. It provides alternate descriptive text if the image fails to load or for screen readers
D. It automatically adds animation to the image
**Answer:** C

---

### 4. What type of attribute is `disabled` or `required`?
A. Text Attribute
B. Boolean Attribute (presence alone means true)
C. Numeric Attribute
D. CSS Attribute
**Answer:** B

---

### 5. What value of the `target` attribute opens a link in a fresh, new browser tab?
A. `_self`
B. `_parent`
C. `_blank`
D. `_new`
**Answer:** C

---

# Practice Challenge (Try It Yourself)

1. Open your `index.html` file in VS Code.
2. Inside `<body>`, try adding:
   - A link to your favorite website with `target="_blank"` so it opens in a new tab:
     ```html
     <a href="https://wikipedia.org" target="_blank">Visit Wikipedia</a>
     ```
   - An image tag with `src`, `alt`, and `width`:
     ```html
     <img src="https://picsum.photos/300/200" alt="Sample picture" width="300">
     ```
   - A paragraph with a helpful hover message using the `title` attribute:
     ```html
     <p title="Tip: You are doing great in web development!">Hover over this tip!</p>
     ```
3. Save your file (`Ctrl + S`) and view your interactive webpage live with Live Server! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **HTML Headings** (Heading & Paragraphs).

👉 **[Continue to Next Lesson: HTML Headings →](/tutorials/html5-complete-course/html-headings)**
