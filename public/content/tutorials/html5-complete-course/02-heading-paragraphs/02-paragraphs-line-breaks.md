---
id: html-paragraphs-line-breaks
slug: paragraphs-line-breaks
course: html5-complete-course
chapter: 2
topic: 2.2
title: Paragraphs & Line Breaks
description: Master the paragraph tag p, line breaks with br, divider lines with hr, and understand whitespace collapsing in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - html paragraphs
  - p tag
  - br line break
  - hr divider
  - pre tag
  - whitespace collapsing
  - html text formatting
  - html for school students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Paragraphs, Line Breaks & Dividers (`<p>`, `<br>`, `<hr>`)

Welcome to Topic 2.2! 📄

In the previous lesson, you learned how to create bold titles using heading tags (`<h1>` to `<h6>`). Now, what about the main body text of your website? How do you write sentences, paragraphs, postal addresses, or poems?

In this lesson, we will explore:
1. **The Paragraph Tag (`<p>`)** — for standard body text.
2. **The Line Break Tag (`<br>`)** — for jumping to the next line.
3. **The Horizontal Rule Tag (`<hr>`)** — for drawing neat divider lines.
4. **The Preformatted Tag (`<pre>`)** — for preserving spaces and poem stanzas.

---

# 1. The Paragraph Tag (`<p>`)

The `<p>` tag is used to write paragraphs of text on a webpage.

Whenever you wrap text inside `<p>...</p>`, the web browser does two automatic things:
1. It always starts the paragraph on a **fresh new line**.
2. It automatically adds a comfortable **blank space (margin)** above and below the paragraph, so sentences never look squished together.

### Example:
```html
<p>MSK Institute is a premier computer education center located in Shikohabad.</p>
<p>We provide hands-on practical training in HTML, Python, and Full Stack Web Development.</p>
```

In your browser, these two sentences will appear as two distinct paragraphs with a neat gap separating them.

---

# 2. The Line Break Tag (`<br>`)

What if you want to move to the next line **without** starting a whole new paragraph or adding a large blank gap?

In HTML, pressing **Enter** on your keyboard does **NOT** create a new line in your browser. To force the text to jump to the very next line, we use the **`<br>` (Break)** tag!

### Real-Life Use Case 1: Writing a Postal Address 📬
When you write a school or home address, you want each part on a new line, but without big paragraph gaps:

```html
<p>
  MSK Institute<br>
  Station Road, Near Railway Bridge<br>
  Shikohabad, Uttar Pradesh - 283135
</p>
```

### Real-Life Use Case 2: Writing a Poem 📜
Poems need each rhyming line to appear directly below the previous one:

```html
<p>
  Roses are red,<br>
  Violets are blue,<br>
  HTML is easy,<br>
  And you will master it too!
</p>
```

> 📌 **Remember:**
> `<br>` is an **empty (void) element**. It does not hold any text inside it, so it **never has a closing tag**! Just write `<br>`.

---

# 3. The Horizontal Divider Tag (`<hr>`)

`<hr>` stands for **Horizontal Rule**. It draws a light, straight horizontal line across the width of the webpage.

It is used as a **visual divider** when you are changing topics or moving from one section to another:

```html
<h2>Section 1: Introduction</h2>
<p>In this section, we learn the basics of coding.</p>

<!-- Horizontal Divider Line -->
<hr>

<h2>Section 2: Practical Lab Work</h2>
<p>Now let us write our first code in VS Code.</p>
```

Like `<br>`, `<hr>` is also an **empty (void) tag** and does not require a closing tag.

---

# 4. The Big Secret: HTML Whitespace Collapsing! 🤫

Many beginner students make this mistake when they start writing HTML:

They type this in their code:
```html
<p>
  Hello               Students!
  How         are            you?
</p>
```
And they expect the browser to show all those spaces and newlines!

Lekin jab woh browser mein dekhte hain, the browser displays:
```text
Hello Students! How are you?
```

### Why does this happen?
This behavior is called **Whitespace Collapsing**. 

Web browsers automatically compress multiple consecutive spaces, tabs, and keyboard Enters into **just ONE single space**. 

Whether you press the spacebar 2 times or 50 times, HTML will only display **one single space** on the screen!

```text
In Your Code:      Hello              World!
Browser Renders:   Hello World! (Extra spaces are collapsed!)
```

### Why does HTML do this?
Because it allows developers to indent and format their code neatly with spaces and tabs without accidentally stretching out words on the live webpage.

---

# 5. The `<pre>` Tag (Preformatted Text)

What if you **really want** the browser to preserve your exact spaces, tabs, and line breaks?

That is where the **`<pre>` (Preformatted Text)** tag comes to the rescue!

Whatever you write inside `<pre>...</pre>` will be displayed **exactly as you typed it** in a clean monospace font (like a typewriter):

```html
<pre>
  Item           Price      Qty
  Notebook       ₹50        2
  Pen            ₹10        5
</pre>
```

### Perfect for ASCII Art:
```html
<pre>
   /\_/\  
  ( o.o ) 
   > ^ <
  Cute Cat ASCII Art!
</pre>
```

---

# Comparison Table: `<p>`, `<br>`, `<hr>`, `<pre>`

| Tag | Tag Type | Closing Tag Needed? | Main Purpose |
|---|---|---|---|
| `<p>` | Container | Yes (`</p>`) | Creates standard body paragraphs with top & bottom margins |
| `<br>` | Empty (Void) | **No** | Moves text to the next line without extra spacing |
| `<hr>` | Empty (Void) | **No** | Draws a neat horizontal dividing line across the page |
| `<pre>` | Container | Yes (`</pre>`) | Preserves exact spaces, tabs, and line breaks as typed |

---

# Common Beginner Mistakes to Avoid

1. ⚠️ **Pressing Enter in Code Instead of Using `<br>`:**
   - Pressing Enter in your code editor does not create a new line in the browser. Always use `<br>` when you want a line break.

2. ⚠️ **Writing Closing Tags for `<br>` or `<hr>`:**
   - ❌ Wrong: `<br></br>` or `<hr></hr>`
   - ✅ Correct: Just write `<br>` and `<hr>`.

3. ⚠️ **Nesting `<p>` Inside Another `<p>`:**
   - ❌ Wrong: `<p>Outer paragraph <p>Inner paragraph</p></p>`
   - ✅ Browsers automatically close the first paragraph when they encounter a second `<p>`. Always write paragraphs one after another.

---

# Quick Summary

- ✅ Use **`<p>`** for regular paragraphs of body text.
- ✅ Browsers automatically add spacing above and below `<p>` tags.
- ✅ Use **`<br>`** to break a line (perfect for poems and addresses).
- ✅ Use **`<hr>`** to draw a horizontal dividing line between topics.
- ✅ Both `<br>` and `<hr>` are **empty tags** and do not need closing tags.
- ✅ **Whitespace Collapsing:** HTML automatically turns multiple spaces and enters into a single space.
- ✅ Use **`<pre>`** if you need to preserve exact spaces, tabs, and indentation.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which HTML tag is used to create a line break within a paragraph?
A. `<break>`
B. `<lb>`
C. `<br>`
D. `<newline>`
**Answer:** C

---

### 2. What happens when you type 10 spaces between two words inside a `<p>` tag?
A. The browser displays all 10 spaces
B. The browser produces an error
C. The browser collapses them into a single space
D. The second word disappears
**Answer:** C

---

### 3. Which tag should you use if you want to preserve exact spaces and line breaks as typed?
A. `<p>`
B. `<pre>`
C. `<text>`
D. `<format>`
**Answer:** B

---

### 4. What does the `<hr>` tag do when added to a webpage?
A. Adds a headline
B. Draws a thematic horizontal divider line across the page
C. Highlights the text in red
D. Plays a sound
**Answer:** B

---

### 5. Why should you NOT use empty `<p></p>` tags just to create vertical spacing between items?
A. It causes screen readers to announce empty paragraphs and clutters the HTML structure; use CSS margins instead
B. Browsers crash when encountering empty paragraphs
C. Empty paragraphs turn red
D. Empty paragraphs are illegal
**Answer:** A

---

# Practice Challenge (Try It Yourself)

1. Open your `index.html` in VS Code.
2. Inside `<body>`, create:
   - An `<h1>` heading: `My School & Favorite Poem`.
   - A `<p>` paragraph with your school name and postal address separated cleanly using `<br>`.
   - An `<hr>` divider line.
   - A short 4-line poem written using either `<p>` with `<br>` tags, or using `<pre>`.
3. Save the file (`Ctrl + S`) and view it live in your browser to verify the spacing! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Text Formatting Elements** (Text Formatting).

👉 **[Continue to Next Lesson: Text Formatting Elements →](/tutorials/html5-complete-course/text-formatting-elements)**
