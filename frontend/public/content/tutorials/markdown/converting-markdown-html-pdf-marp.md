---
title: "Converting Markdown to HTML, PDF & Slides (Marp/Pandoc)"
description: "Convert markdown documents into polished PDFs, ePub books, and presentation slide decks using Pandoc and Marp."
order: 26
course: "markdown"
slug: "converting-markdown-html-pdf-marp"
---

One of Markdown's greatest superpowers is its **format portability**. Because Markdown represents semantic document structure in plain text, you can write once and convert into professional printable PDFs, eBook formats (ePub), technical documentation sites, or even animated slide decks!

![Markdown Compilation Pipeline](/images/tutorials/markdown/markdown-parsing-rendering-pipeline.svg)

---

### 1. Pandoc (The Universal Document Swiss Army Knife)

[Pandoc](https://pandoc.org) is the undisputed industry standard command-line document converter. It can convert Markdown into virtually any existing format:

```
                  ┌─────────> HTML5 / Web Page
                  ├─────────> PDF (via LaTeX / wkhtmltopdf)
Markdown (.md) ───┼─────────> Microsoft Word (.docx)
                  ├─────────> EPUB eBook
                  └─────────> Man Pages / Plain Text
```

#### Common Pandoc Commands:
```bash
# 1. Convert Markdown to a standalone HTML5 page with styling:
pandoc README.md -s -o index.html

# 2. Convert Markdown to a Microsoft Word document:
pandoc notes.md -o notes.docx

# 3. Convert Markdown to a PDF book using wkhtmltopdf:
pandoc book.md -o book.pdf --pdf-engine=wkhtmltopdf
```

---

### 2. Marp (Markdown Presentation Ecosystem)

Creating slides in PowerPoint often wastes hours on manual alignment and font adjustments. **Marp** allows you to build stunning presentation slide decks **entirely in Markdown**!

#### How Marp Works:
Separate your slides using horizontal rules (`---`):

```markdown
---
marp: true
theme: default
paginate: true
header: "MSK Institute • Web Development"
footer: "© 2026 Er. Sumit Kumar"
---

# 🚀 Introduction to Full-Stack Architecture
### Er. Sumit Kumar, MSK Institute

---

# 📌 Today's Agenda
1. Frontend with Next.js 15
2. Backend APIs with Node & Express
3. Relational Databases with PostgreSQL
4. Deployment on Cloud Infrastructure

---

# 💡 Why Plain Text Markdown?
- Version controllable with Git
- Portable across all operating systems
- Clean and distraction-free!
```

#### Exporting Marp Slides:
With the **Marp for VS Code** extension, you can export your slide deck to **PDF, HTML, or PowerPoint PPTX** with a single click!

---

# Multiple Choice Questions

### 1. Which command-line tool is widely known as the 'Swiss Army Knife' of document conversion?
A. Pandoc
B. FFmpeg
C. ImageMagick
D. Webpack
**Answer:** A
**Explanation:** Pandoc is the premier universal document converter capable of translating Markdown into HTML, PDF, Word, ePub, and more.
---

### 2. In Marp presentation syntax, what delimiter separates individual slide pages?
A. Horizontal rules (---)
B. Double dollar signs ($$)
C. Semicolons (;;;)
D. At signs (@@@)
**Answer:** A
**Explanation:** Marp uses standard Markdown horizontal divider lines (---) to demarcate individual slide boundaries.
---

### 3. Which Marp YAML frontmatter setting enables automatic slide page numbering?
A. paginate: true
B. numbers: on
C. count: yes
D. page: auto
**Answer:** A
**Explanation:** Setting 'paginate: true' in the Marp frontmatter instructs the slide compiler to render page numbers on each slide.
---

### 4. What output formats can Marp export slide decks into?
A. Only plain text
B. HTML, PDF, and Microsoft PowerPoint (.pptx)
C. MP3 audio files only
D. Binary firmware files
**Answer:** B
**Explanation:** Marp exports Markdown presentations to interactive HTML, printable PDF slides, or editable PowerPoint PPTX presentations.
---

### 5. What flag tells Pandoc to generate a complete standalone HTML document with <head> and <body> tags?
A. -s (or --standalone)
B. -r
C. -f
D. -x
**Answer:** A
**Explanation:** The -s (--standalone) flag instructs Pandoc to output a complete valid HTML document with metadata rather than a fragment.
---
