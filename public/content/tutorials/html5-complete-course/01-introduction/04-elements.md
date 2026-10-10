---
id: html-elements
slug: elements
course: html5-complete-course
chapter: 1
topic: 1.4
title: Elements
description: Master HTML Elements, nested elements, and empty (void) tags in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 7
order: 4
keywords:
  - html elements
  - what is an html element
  - nested elements
  - empty tags
  - void elements
  - html tags vs elements
  - html basics for students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# HTML Elements (The Building Blocks)

Welcome to Topic 1.4! 🧱

In the previous lessons, you got introduced to HTML and set up VS Code on your computer. Now it is time to understand the most important concept in all of web development: **HTML Elements**.

Every webpage you see on the internet—every headline, paragraph, picture, button, and link—is an **HTML Element**. If a webpage is a brick building, HTML elements are the individual bricks used to build it.

---

# What is an HTML Element?

An **HTML Element** is everything from the starting tag to the ending tag, including the content inside it.

Let us use a simple real-life example: **A Sandwich!** 🥪

```text
🥪 THE SANDWICH ANALOGY:

[ Top Bread Slice ]   ➡️   Opening Tag:   <p>
[ Tasty Veggie Filling ] ➡️ Content:       I love web development!
[ Bottom Bread Slice ] ➡️  Closing Tag:   </p>

Together, all three parts make a complete Sandwich (HTML Element)!
```

### The Three Parts of an HTML Element:
1. **Opening Tag (Start Tag):** Tells the browser where the element begins (e.g., `<p>`).
2. **Content:** The actual text, image, or message displayed on your screen (e.g., `I love web development!`).
3. **Closing Tag (End Tag):** Tells the browser where the element ends. It always includes a forward slash `/` (e.g., `</p>`).

```html
<p>This entire line is an HTML element.</p>
```

---

# Tag vs. Element (Never Get Confused!)

Many students use the words "Tag" and "Element" as if they mean the exact same thing. But there is a clear difference:

| Term | What It Means | Example |
|---|---|---|
| **Tag** | Just the label inside the angle brackets `< >` | `<p>` (opening tag) or `</p>` (closing tag) |
| **Element** | The complete combination of start tag + content + end tag | `<p>Hello Students</p>` |

---

# Types of HTML Elements

HTML has two main types of elements:

### 1. Normal Container Elements (Paired Elements)
These elements contain text or other tags inside them. They **must have both** an opening tag and a closing tag:

```html
<h1>Main Title of My Page</h1>
<p>This is a normal paragraph element.</p>
<button>Click Here</button>
```

---

### 2. Empty Elements (Void / Self-Closing Elements)
Some elements do not contain any text inside them. Because they have no content, they **do not need a closing tag**!

Here are the most common empty elements you will use:

| Tag | Full Name | What It Does | Example |
|---|---|---|---|
| `<br>` | Break | Moves text to the next line (like pressing Enter) | `<p>Line 1<br>Line 2</p>` |
| `<hr>` | Horizontal Rule | Draws a straight horizontal divider line across the page | `<hr>` |
| `<img>` | Image | Embeds a picture on the page | `<img src="photo.jpg" alt="Nature">` |
| `<input>` | Input Field | Creates a box for typing text or passwords | `<input type="text">` |

> 📌 **Good Practice Tip:**
> In modern HTML5, you can write `<br>` or `<br />`. Both work identically in all browsers, but simple `<br>` is standard and easier to write.

---

# Nested Elements (Elements Inside Elements)

In HTML, you can place elements inside other elements. This is called **Nesting**.

Think of nesting like your **School Bag**:
- Your **School Bag** is the big outer container (`<body>`).
- Inside your school bag is your **Pencil Box** (`<p>`).
- Inside your pencil box is a **Sharpener** (`<b>`).

### Example of Nested Code:
```html
<p>Welcome to <b>MSK Institute</b> in Shikohabad.</p>
```

In this example:
- The `<p>` element wraps the entire sentence.
- The `<b>` element is **nested inside** `<p>` to make the words *"MSK Institute"* appear **bold**.

```text
Visualizing Nesting:
┌────────────────────────────────────────────────────────┐
│ <p> Welcome to <b>MSK Institute</b> in Shikohabad. </p>│
│                └───────┬──────┘                        │
│                  Nested Child                          │
└────────────────────────┼───────────────────────────────┘
                    Parent Element
```

---

# The Golden Rule of Nesting (First In, Last Out)

Tags must always be closed in the reverse order of how they were opened. The tag that opens **last** must close **first**!

- ✅ **Correct Nesting:**
  ```html
  <p>Learning HTML is <i><b>super easy</b></i>!</p>
  ```
  *(Here `<b>` opened last, so `</b>` closed first. Then `</i>`, and finally `</p>`.)*

- ❌ **Wrong Nesting (Overlapping Tags):**
  ```html
  <p>Learning HTML is <i><b>super easy</i></b>!</p>
  ```
  *(Here `<b>` opened inside `<i>`, but `<i>` was closed before `<b>`. This confuses browsers!)*

---

# Case Sensitivity: Small Letters vs Capital Letters

HTML is **case-insensitive**, meaning `<P>`, `<p>`, and `<P>` all work in browsers.

However, international web standards (W3C) strongly recommend writing all HTML tags in **lowercase (small letters)**:
- ✅ Standard: `<p>`, `<h1>`, `<div>`
- ❌ Avoid: `<P>`, `<H1>`, `<DIV>`

Writing in lowercase makes your code clean, professional, and easy to read.

---

# Common Beginner Mistakes with Elements

1. ⚠️ **Forgetting to Close a Container Tag:**
   ```html
   <!-- WRONG: The entire page below might become bold! -->
   <p>This is <b>important text.</p>

   <!-- CORRECT -->
   <p>This is <b>important</b> text.</p>
   ```

2. ⚠️ **Trying to Close an Empty Element:**
   ```html
   <!-- WRONG: <br> does not have a closing tag! -->
   <br></br>

   <!-- CORRECT -->
   <br>
   ```

3. ⚠️ **Incorrect Nesting Order:**
   Always remember: The inner tag must close before the outer tag closes.

---

# Quick Summary

- ✅ An **HTML Element** consists of an Opening Tag, Content, and a Closing Tag.
- ✅ A **Tag** is just `<p>` or `</p>`, while an **Element** is the complete bundle.
- ✅ **Normal Elements** have closing tags (e.g., `<h1>...</h1>`, `<p>...</p>`).
- ✅ **Empty Elements (Void Tags)** do not have closing tags (e.g., `<br>`, `<hr>`, `<img>`).
- ✅ **Nesting** means placing one element inside another.
- ✅ Always close tags in the reverse order of how they opened (**First in, Last out**).
- ✅ Always write tag names in **lowercase**.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which of the following is an empty (void) element that does NOT require a closing tag?
A. `<p>`
B. `<br>`
C. `<h1>`
D. `<button>`
**Answer:** B

---

### 2. What is the correct way to nest bold text inside a paragraph?
A. `<p>Hello <b>World</p></b>`
B. `<b><p>Hello World</b></p>`
C. `<p>Hello <b>World</b></p>`
D. `<p><b>Hello World</p>`
**Answer:** C

---

### 3. What is the difference between an HTML tag and an HTML element?
A. A tag is for images, and an element is for text
B. A tag is only the bracketed keyword (`<p>`), while an element includes the tags and content
C. Tags are written in lowercase, and elements must be written in uppercase
D. There is no difference at all
**Answer:** B

---

### 4. Which of the following is another example of a void / empty HTML element?
A. `<div>`
B. `<hr>`
C. `<span>`
D. `<h2>`
**Answer:** B

---

### 5. Why should all HTML tag names be written in lowercase according to W3C standards?
A. Uppercase tags cause computers to overheat
B. Lowercase tags are the modern web standard, cleaner to read, and strictly required by XHTML
C. Browsers refuse to open uppercase tags
D. Uppercase tags delete your CSS styles
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open VS Code and open your `index.html` file.
2. Inside `<body>`, create:
   - An `<h1>` heading with your school's name.
   - A `<p>` paragraph describing your favorite subject.
   - Use `<b>` inside the paragraph to make your subject bold.
   - Use `<br>` to split the sentence into two separate lines.
   - Add an `<hr>` horizontal divider line below it.
3. Save your file (`Ctrl + S`) and check your live page in the browser! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Attributes** (Introduction).

👉 **[Continue to Next Lesson: Attributes →](/tutorials/html5-complete-course/attributes)**
