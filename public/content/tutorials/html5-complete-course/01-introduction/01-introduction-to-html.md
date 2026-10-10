---
id: html-introduction
slug: introduction-to-html
course: html5-complete-course
chapter: 1
topic: 1.1
title: Introduction to HTML
description: Learn what HTML is, how websites work, and understand Tags, Elements, and Attributes in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 1
keywords:
  - what is html
  - introduction to html
  - html for school students
  - learn html5
  - web development basics
  - tags elements attributes
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Introduction to HTML

Welcome to the exciting world of **Web Development**! 🎉

If you are a school student in **Class 8th, 9th, 10th, 11th, or 12th** and you want to learn how websites like Google, YouTube, or Wikipedia are created, HTML is your very first step.

Every single website on the internet is built using **HTML**. Without HTML, a web browser cannot display text, images, or buttons.

---

# What is HTML? (Full Form & Meaning)

**HTML** stands for:

- **H** - **Hyper**
- **T** - **Text**
- **M** - **Markup**
- **L** - **Language**

Let us understand each word in simple everyday terms:

1. **HyperText:** 
   This means clickable text containing links. For example, when you search on Google and click on any blue link, a new webpage opens up. That clickable link is called *HyperText*.

2. **Markup:** 
   This means "marking" or labeling your content so the computer knows what it is. Just like you underline a main heading or highlight important points in your school notebook, in HTML we use **tags** to tell the browser: *"This is a heading"*, *"This is a paragraph"*, or *"This is an image"*.

3. **Language:** 
   It is a standard language that every web browser (like Google Chrome, Microsoft Edge, and Mozilla Firefox) easily understands and shows on your screen.

> 💡 **Important Rule to Remember:**
> HTML is **NOT** a programming language. It is a **Markup Language**. It does not have complex mathematics, formulas, loops (`for`, `while`), or decision-making logic (`if-else`). Its only job is to organize and structure content on a webpage.

---

# Real-Life Example: How a Website is Built

To understand how a website works, let us look at the **Human Body** or a **House**:

| Part | Real-Life Example (Human Body) | Real-Life Example (House) | Role on a Website |
|---|---|---|---|
| **HTML** | **Bones & Skeleton** | **Bricks, Walls & Roof** | Creates the basic structure and raw content (headings, text, images). |
| **CSS** | **Skin, Clothes & Hair Style** | **Paint, Tiles & Furniture** | Makes the website look beautiful, colorful, and well-designed. |
| **JavaScript** | **Brain & Muscle Movement** | **Electric Wiring, Switches & Fans** | Adds action and interactivity (what happens when you click a button). |

Without HTML, you cannot put any content on a webpage!

---

# Who Created HTML? (History)

- HTML was invented in **1991** by **Sir Tim Berners-Lee** at CERN research laboratory in Switzerland.
- He created it so scientists could easily share research documents with each other across computer networks.
- Today, we use **HTML5**, which is the latest, fastest, and most mobile-friendly version of HTML.

---

# How Does HTML Work?

When you create an HTML file on your computer and open it in Google Chrome or Edge:

```text
Your Code (index.html)  ➡️  Web Browser (Chrome/Edge)  ➡️  Clean Webpage on Screen
```

1. The browser reads your file line by line from top to bottom.
2. The browser recognizes the HTML tags.
3. According to the tags, it arranges headings, paragraphs, and images neatly on your screen.

---

# Quick Summary

- ✅ **HTML** stands for **HyperText Markup Language**.
- ✅ HTML builds the **structure** of every webpage.
- ✅ HTML is a **markup language**, not a programming language.
- ✅ **HTML5** is the latest and standard version of HTML.

---

---

## ⚠️ Common Beginner Mistakes & How to Avoid Them

### 1. Forgetting to Close Non-Empty Tags
Every paired tag must have a matching closing tag with a forward slash `/`:
```html
<!-- ❌ INCORRECT (Missing closing tag) -->
<p>This paragraph is never closed!
<h1>Next Heading</h1>

<!-- ✅ CORRECT -->
<p>This paragraph is cleanly closed.</p>
<h1>Next Heading</h1>
```

### 2. Writing Tags in Uppercase
While browsers tolerate `<H1>` or `<P>`, standard modern W3C HTML5 code conventions strictly use lowercase tag and attribute names:
```html
<!-- ❌ Outdated practice -->
<DIV CLASS="CONTAINER"><P>Text</P></DIV>

<!-- ✅ Modern W3C Standard -->
<div class="container"><p>Text</p></div>
```

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. What is the full form of HTML?
A. Hyper Text Markup Language
B. High Tech Modern Language
C. Hyperlink Text Making Language
D. Home Tool Markup Language
**Answer:** A

---

### 2. Which of the following statements about HTML is true?
A. HTML is a programming language with loops and calculations
B. HTML requires special paid software to run
C. HTML is a markup language that defines the structure of a webpage
D. HTML was created by Google in 2020
**Answer:** C

---

### 3. Who invented HTML in the year 1991?
A. Bill Gates
B. Steve Jobs
C. Sir Tim Berners-Lee
D. Mark Zuckerberg
**Answer:** C

---

### 4. What file extension must be used when saving an HTML document?
A. `.txt`
B. `.docx`
C. `.html` or `.htm`
D. `.css`
**Answer:** C

---

# Practice Challenge (Try It Yourself)

1. Open **Notepad** on your computer.
2. Type the following code:
```html copy
<h1>My First Webpage</h1>
<p>I am a Class 10 student and I am excited to learn web development!</p>
```
3. Click `File -> Save As` and name the file: `mypage.html` (make sure to include `.html` at the end).
4. Go to the folder where you saved it, and double-click `mypage.html`.
5. Your very first webpage will open right inside your web browser! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **Basic Document Structure** (Introduction).

👉 **[Continue to Next Lesson: Basic Document Structure →](/tutorials/html5-complete-course/basic-document-structure)**
