---
id: html-quotations-citations
slug: quotations-citations
course: html5-complete-course
chapter: 3
topic: 3.2
title: Quotations & Citations
description: Learn how to format quotations, source citations, abbreviations, and contact addresses in simple English for school students (Classes 8th to 12th).
difficulty: Beginner
readingTime: 8
order: 2
keywords:
  - html quotations
  - blockquote tag
  - q tag
  - abbr tag
  - cite tag
  - address tag
  - bdo tag
  - html for school students
lastUpdated: 2026-09-30
author: MSK Institute
version: 2.1.0
---

# Quotations & Citations in HTML

Welcome to Topic 3.2! 💬

Whenever you write a school essay, an English speech, or a history project, you often:
- Quote inspiring words from great leaders like **Dr. APJ Abdul Kalam**, **Mahatma Gandhi**, or **Swami Vivekananda**,
- Reference the name of a famous book (like *Wings of Fire* or *Discovery of India*),
- Explain short forms like **ISRO**, **NASA**, or **HTML**,
- Provide contact details at the end of the document.

In HTML, we have dedicated **Quotation and Citation Tags** designed specifically for these situations. They help browsers, readers, and Google search understand who said what and where the information came from!

---

# 1. Long Block Quotations: `<blockquote>`

When you want to quote a long sentence or an entire paragraph from a speech, a book, or an external website, use the **`<blockquote>`** tag:

```html
<blockquote cite="https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam">
  Dream is not that which you see while sleeping,
  it is something that does not let you sleep.
</blockquote>
<p>— Dr. A.P.J. Abdul Kalam</p>
```

### How Does the Browser Display It?
The browser automatically **indents** the entire block from the left and right margins with generous spacing. This makes the quoted text immediately stand out from regular paragraphs!

> 💡 **The `cite` Attribute:**
> Inside `<blockquote>`, you can add a `cite="https://..."` attribute to specify the URL where the quote was taken from. It is invisible on screen, but search engines love it for source verification!

---

# 2. Short Inline Quotations: `<q>`

What if you just want to quote a short phrase **inside** a regular sentence? Use the **`<q>`** tag!

```html
<p>
  Mahatma Gandhi once said, <q>Be the change that you wish to see in the world.</q>
</p>
```

### The Magic of the `<q>` Tag! ✨
You do **NOT** need to type quotation marks (`"`) on your keyboard! 

The web browser automatically detects the `<q>` tag and inserts proper, stylish **curly double quotation marks ("...")** around your text.

```text
In Your Code:    Mahatma Gandhi said, <q>Be the change</q>
Browser Renders: Mahatma Gandhi said, "Be the change"
                                      └── Automatic quotes added!
```

⚠️ **Beginner Mistake:** Never type `"..."` yourself inside `<q>` tags, or the browser will show awkward double-double quotes like `""Be the change""`!

---

# 3. Abbreviations & Acronyms: `<abbr>` 💡

In our daily studies, we use hundreds of short forms: **ISRO**, **NASA**, **HTML**, **CPU**, **WHO**, **ATM**.

The **`<abbr>` (Abbreviation)** tag allows you to write the short form while storing the **complete full form** inside the `title` attribute:

```html
<p>
  <abbr title="Indian Space Research Organisation">ISRO</abbr>
  successfully launched Chandrayaan-3 to the Moon.
</p>

<p>
  We are learning
  <abbr title="HyperText Markup Language">HTML</abbr>
  at MSK Institute.
</p>
```

### What Happens on the Screen?
1. The browser displays the text with a subtle **dotted underline** below it (e.g., <ins style="text-decoration: underline dotted;">ISRO</ins>).
2. When a user hovers their mouse cursor over the word, a floating **tooltip box** pops up revealing the full form!

---

# 4. Creative Work Citations: `<cite>` 📚

When you mention the **title of a creative work**—such as a book, a poem, a movie, a song, a painting, or a scientific paper—wrap it inside the **`<cite>`** tag:

```html
<p>
  <cite>Wings of Fire</cite> is an inspiring autobiography written by Dr. APJ Abdul Kalam.
</p>

<p>
  Rabindranath Tagore won the Nobel Prize for his poetry collection <cite>Gitanjali</cite>.
</p>
```

### How Does the Browser Display It?
The browser automatically renders the title of the work in an elegant **italic font**.

> 📌 **Important Rule for `<cite>`:**
> The `<cite>` tag is meant for the **Title of the Work** (the book, movie, or song). It is **NOT** meant for the author's person name!
> - ✅ Correct: `<cite>Gitanjali</cite> by Rabindranath Tagore`
> - ❌ Wrong: `Gitanjali by <cite>Rabindranath Tagore</cite>`

---

# 5. Author Contact Information: `<address>` 📍

The `<address>` element is used to supply contact details (author name, physical address, email, phone number, social media links) for the owner or author of the webpage:

```html
<address>
  Written by Er. Sumit Kumar<br>
  MSK Institute, Station Road<br>
  Shikohabad, Uttar Pradesh<br>
  Email: <a href="mailto:info@mskinstitute.in">info@mskinstitute.in</a>
</address>
```

### How Does the Browser Display It?
- Text inside `<address>` is automatically rendered in *italics*.
- Screen readers recognize this section specifically as contact data.
- It usually lives inside the `<footer>` at the bottom of a website.

---

# 6. Reversing Text: `<bdo>` (Bi-Directional Override) 🔄

`bdo` stands for **Bi-Directional Override**. It is used to override the current text reading direction.

Most languages (like English and Hindi) are read **Left-to-Right (`dir="ltr"`)**. Some languages (like Arabic and Urdu) are read **Right-to-Left (`dir="rtl"`)**.

You can use `<bdo dir="rtl">` to flip English text completely backwards!

```html
<p>Normal English Text: Hello Students</p>

<!-- Reversed Text -->
<p><bdo dir="rtl">Hello Students</bdo></p>
```

### What Appears on the Screen?
The browser displays:
```text
stnedutS olleH
```
It reads the letters backwards from right to left! It is a fun and powerful tool for multilingual websites.

---

# Master Comparison Table: Quotation Tags

| Tag | Tag Name | Browser Visual Effect | When to Use It |
|---|---|---|---|
| `<blockquote>` | Block Quote | Indented block with left & right margins | Long quotes taken from another speech or document |
| `<q>` | Inline Quote | Automatically adds double quotes (`"..."`) | Short quotes embedded inside a regular sentence |
| `<abbr>` | Abbreviation | Dotted underline + hover tooltip | Acronyms and short forms (ISRO, WHO, HTML) |
| `<cite>` | Citation | Italic font style | Titles of books, poems, movies, or research papers |
| `<address>` | Address | Italic font with semantic contact markup | Author or company contact details |
| `<bdo>` | BDO | Flips text direction (LTR vs RTL) | Reversing text direction |

---

# Common Beginner Mistakes to Avoid

1. ⚠️ **Typing Manual Quotes Inside `<q>`:**
   - ❌ Wrong: `<p>Gandhi said, <q>"Truth is God."</q></p>` *(Shows: ""Truth is God."")*
   - ✅ Correct: `<p>Gandhi said, <q>Truth is God.</q></p>` *(Shows: "Truth is God.")*

2. ⚠️ **Forgetting the `title` Attribute in `<abbr>`:**
   - Without `title="Full Form"`, the tooltip will not work! Always provide `title`.

3. ⚠️ **Using `<cite>` for a Person's Name:**
   - Use `<cite>` only for the book, song, or movie title, not the author's name.

---

# Quick Summary

- ✅ Use **`<blockquote>`** for long quotations; it automatically indents the text block.
- ✅ Use **`<q>`** for short inline quotes; the browser automatically adds `"..."` quotes.
- ✅ Use **`<abbr title="...">`** to show full forms when users hover over acronyms.
- ✅ Use **`<cite>`** for creative work titles (books, songs, films); it renders in *italics*.
- ✅ Use **`<address>`** for author or organization contact information.
- ✅ Use **`<bdo dir="rtl">`** to reverse text reading direction.

---

## Practice Quiz

Test your understanding with these multiple-choice questions:

### 1. Which HTML tag automatically adds quotation marks around text without you typing them?
A. `<blockquote>`
B. `<quote>`
C. `<q>`
D. `<cite>`
**Answer:** C

---

### 2. How do you provide the full expansion for an acronym so it appears as a tooltip on hover?
A. `<abbr full="Indian Space Research Organisation">ISRO</abbr>`
B. `<abbr title="Indian Space Research Organisation">ISRO</abbr>`
C. `<abbr desc="Indian Space Research Organisation">ISRO</abbr>`
D. `<acronym text="Indian Space Research Organisation">ISRO</acronym>`
**Answer:** B

---

### 3. What is the `<cite>` tag used for?
A. To cite the title of a creative work like a book, movie, or poem
B. To display the physical home address of the user
C. To write large block quotes
D. To underline text
**Answer:** A

---

### 4. Which tag should you use for long, multi-line quotations that require an indented block?
A. `<q>`
B. `<blockquote>`
C. `<longquote>`
D. `<cite>`
**Answer:** B

---

### 5. What is the semantic purpose of the `<address>` element?
A. To locate the user using GPS
B. To provide contact information for the author or owner of the document or article
C. To format house numbers in bold
D. To open a map application
**Answer:** B

---

# Practice Challenge (Try It Yourself)

1. Open VS Code and open your `index.html` file.
2. Inside `<body>`, create an **Inspiration & Tribute Card** for **Dr. APJ Abdul Kalam**:
   - Add an `<h1>` heading: `Tribute to Dr. A.P.J. Abdul Kalam`.
   - Add an `<abbr>` tag for `ISRO` with its full form in the `title` attribute.
   - Mention his famous autobiography using `<cite>Wings of Fire</cite>`.
   - Add his famous quote using `<blockquote>`.
   - Add a short quote in a sentence using `<q>`.
   - At the bottom, add an `<address>` tag with your name and school name.
3. Save the file (`Ctrl + S`) and view your tribute webpage live with Live Server! 🚀
---

## 🚀 What's Next?

In the next lesson, we will continue your web development journey with **HTML Entities, Symbols & Emojis** (Text Formatting).

👉 **[Continue to Next Lesson: HTML Entities, Symbols & Emojis →](/tutorials/html5-complete-course/html-entities-symbols)**
