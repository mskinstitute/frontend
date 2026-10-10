---
title: "Footnotes & Citation References"
description: "Reference citations and footnotes using GFM [^1] syntax with auto-linked bottom notes."
order: 18
course: "markdown"
slug: "footnotes-citation-references"
---

When writing comprehensive research papers, technical documentation, or historical overviews, citing sources and adding supplementary notes without disrupting the narrative flow is essential. In GitHub Flavored Markdown and extended specifications, **Footnotes** provide automated, bi-directional linking.

![Markdown Compilation Pipeline](/images/tutorials/markdown/markdown-parsing-rendering-pipeline.svg)

---

### 1. Footnote Syntax

Footnotes consist of two connected parts:
1. **The Footnote Reference:** Inserted inline where you want the small superscript citation number to appear.
2. **The Footnote Definition:** Placed anywhere in the document (typically at the very bottom) providing the detailed reference text.

```markdown
Markdown was originally developed in 2004[^1] by John Gruber with input from Aaron Swartz[^2].

<!-- Footnote Definitions (usually placed at bottom of page) -->
[^1]: Gruber, John. "Markdown." Daring Fireball, 2004.
[^2]: Swartz, Aaron. "Aaron Swartz: The Web's Prodigy." The New Yorker, 2013.
```

---

### 2. How Footnotes Render in the Browser

When compiled to HTML:
- The inline reference `[^1]` renders as a small, superscript clickable number: `<sup><a href="#fn-1">1</a></sup>`.
- All footnote definitions are automatically gathered, sorted, and rendered at the very **bottom of the page** in an ordered list with back-to-top return arrows (`↩`).
- Clicking the footnote number jumps the user to the definition at the bottom; clicking the return arrow jumps back to where they left off in the text!

---

### 3. Named Footnote Identifiers

Footnote identifiers do not have to be numbers! You can use descriptive alphanumeric words:

```markdown
According to the official RFC standard[^rfc], Markdown MIME type is text/markdown.

[^rfc]: RFC 7763: The text/markdown Media Type, IETF (2016).
```
*(The browser will still automatically renumber them consecutively as 1, 2, 3 in the rendered document!)*

---

### 4. Multi-Paragraph Footnotes

To include multiple paragraphs or code snippets inside a single footnote definition, indent the subsequent lines by **4 spaces**:

```markdown
Here is a complex technical citation[^detailed].

[^detailed]: First paragraph explaining the historical context.

    Second paragraph providing reproduction steps.
    ```bash
    git log --oneline
    ```
```

---

# Multiple Choice Questions

### 1. What syntax is used to insert a footnote reference in GFM Markdown?
A. [^1]
B. [*1*]
C. (footnote: 1)
D. <footnote>1</footnote>
**Answer:** A
**Explanation:** A caret symbol inside square brackets ([^1]) creates an automated footnote reference link in GFM.
---

### 2. Where do footnote definitions typically appear in the rendered HTML output?
A. In a popup modal window
B. Automatically collected and rendered at the very bottom of the document
C. In the browser title bar
D. In a separate PDF file
**Answer:** B
**Explanation:** Markdown parsers collect all footnote definitions and render them at the bottom of the page with return back-links.
---

### 3. What happens if you use non-numeric names like '[^rfc]' for footnote identifiers?
A. It causes a syntax crash
B. The parser automatically numbers them sequentially as [1], [2], etc., in the rendered document
C. It prints the word 'ERROR'
D. It deletes the footnote
**Answer:** B
**Explanation:** Identifiers can be any alphanumeric word; the parser handles consecutive numbering automatically.
---

### 4. How do you add a second paragraph inside a single footnote definition?
A. Indent the second paragraph by 4 spaces (or 1 tab)
B. Use a semicolon
C. Type [^1.2]
D. Footnotes cannot have multiple paragraphs
**Answer:** A
**Explanation:** Indenting additional lines by 4 spaces keeps them within the preceding footnote definition container.
---

### 5. What interactive feature do compiled GFM footnotes provide?
A. They play audio speech
B. Bi-directional navigation: clicking the superscript number jumps to the footnote, and clicking the back-arrow returns to the text
C. They download external malware
D. They translate text to Latin
**Answer:** B
**Explanation:** Compiled footnotes include clickable anchor links that navigate down to the reference and return arrows that jump back to the reading location.
---
