---
title: "Markdown Flavors & Specifications (CommonMark vs GFM)"
description: "Understand the differences between Original Markdown, CommonMark, and GitHub Flavored Markdown (GFM)."
order: 2
course: "markdown"
slug: "markdown-flavors-commonmark-gfm"
---

As Markdown grew from a small scripting utility in 2004 into the global standard for software documentation, different software programs began implementing their own syntax variations. These variations are known as **Markdown Flavors**.

To prevent chaos and ensure documents render identically everywhere, formal specifications like **CommonMark** and **GitHub Flavored Markdown (GFM)** were established.

![Markdown Compilation Pipeline](/images/tutorials/markdown/markdown-parsing-rendering-pipeline.svg)

---

### 1. Why Did Flavors Emerge?

John Gruber's original 2004 Markdown specification was ambiguous about edge cases:
- *What happens if you have an ordered list inside a blockquote without a blank line?*
- *How should four spaces inside an emphasis tag be parsed?*
- *What about tables, task lists, and syntax-highlighted code blocks?* (None of these existed in original Markdown!)

Different developers built parsers in Perl, Python, PHP, and JavaScript, each resolving ambiguities differently. A file that looked perfect on one website broke on another.

---

### 2. The Three Major Specifications

```
Original Markdown (2004)
        │
        ▼
CommonMark (2014)  ───> Standardized formal specification with 600+ test cases
        │
        ▼
GitHub Flavored Markdown (GFM) ───> CommonMark + Tables + Task Lists + Strikethrough + Autolinks
```

#### 1. Original Gruber Markdown (2004)
- Minimalist baseline: Headings (`#`), basic lists, blockquotes (`>`), simple links (`[text](url)`), and images (`![alt](url)`).
- Lacks support for tables, strikethrough, syntax highlighting, or task checkboxes.

#### 2. CommonMark (2014)
- Created by a group including Jeff Atwood (Stack Overflow co-founder) and John MacFarlane (Pandoc creator).
- Provides an exhaustive, unambiguous specification with over 600 automated compliance tests.
- Defines exact behavior for nested lists, whitespace handling, and delimiter balancing.

#### 3. GitHub Flavored Markdown (GFM)
- A strict superset of **CommonMark**. It includes everything in CommonMark plus critical extensions demanded by developers:
  - **Tables:** Using pipe (`|`) and hyphen (`-`) syntax.
  - **Task Lists:** Clickable checkboxes (`- [ ]` and `- [x]`).
  - **Strikethrough:** Double tildes (`~~text~~`).
  - **Autolinks:** Plain URLs like `https://example.com` automatically become clickable links without brackets.
  - **Fenced Code Blocks:** Code blocks with triple backticks and language identifiers (```js).

---

### 3. Comparison Matrix of Markdown Flavors

| Feature | Original Markdown (2004) | CommonMark (2014) | GitHub Flavored Markdown (GFM) |
| :--- | :---: | :---: | :---: |
| **Strict Grammar Spec** | No (Ambiguous) | Yes (Formal RFC) | Yes (Extends CommonMark) |
| **Fenced Code Blocks (```)** | No (Indented only) | Yes | Yes |
| **Tables (`| ... |`)** | No | No | **Yes** |
| **Task Lists (`- [x]`)** | No | No | **Yes** |
| **Strikethrough (`~~`)** | No | No | **Yes** |
| **URL Autolinking** | No | No | **Yes** |
| **Alert Admonitions (`> [!NOTE]`)**| No | No | **Yes (GitHub Native)** |

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

### 4. Which Flavor Should You Use?

For 99% of modern web development, documentation, and technical writing, **GitHub Flavored Markdown (GFM)** is the industry standard. Nearly all major modern parsers (Remark, MDX, VS Code, Next.js) either support GFM by default or via official plugins.

---

# Multiple Choice Questions

### 1. What was the primary motivation behind the creation of the CommonMark specification in 2014?
A. To make Markdown files executable binaries
B. To create an unambiguous, formalized standard specification that renders consistently across all parsers
C. To remove images from Markdown
D. To replace HTML completely
**Answer:** B
**Explanation:** CommonMark was created to standardize the ambiguous edge cases of original Markdown and ensure identical rendering across different tools and platforms.
---

### 2. GitHub Flavored Markdown (GFM) is built as a strict extension on top of which specification?
A. HTML4
B. CommonMark
C. LaTeX
D. PostScript
**Answer:** B
**Explanation:** GFM formally adopts the CommonMark specification as its foundation and adds developer extensions like tables, task lists, and strikethrough.
---

### 3. Which of the following features is supported in GFM but was NOT part of the original 2004 Markdown specification?
A. Blockquotes (>)
B. Tables with pipe syntax (|)
C. Headings (#)
D. Bulleted lists (-)
**Answer:** B
**Explanation:** Tables were not included in original Markdown; they were introduced as an extension popularized by PHP Markdown Extra and formalized in GFM.
---

### 4. How does GitHub Flavored Markdown (GFM) format strikethrough text?
A. --text--
B. ~~text~~
C. ==text==
D. !!text!!
**Answer:** B
**Explanation:** GFM uses double tildes (~~text~~) to render strikethrough text (<del>text</del> in HTML).
---

### 5. In standard CommonMark, what syntax is used for fenced code blocks?
A. Triple backticks (```) or triple tildes (~~~)
B. Double dollar signs ($$)
C. HTML <div> tags only
D. Question marks (???)
**Answer:** A
**Explanation:** Fenced code blocks in CommonMark and GFM can be opened and closed with either three or more backticks (```) or three or more tildes (~~~).
---
