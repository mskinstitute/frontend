---
title: "Links: Inline, Reference & Automatic URLs"
description: "Construct inline links [text](url), reusable reference links, title tooltips, and bare autolinks <url>."
order: 11
course: "markdown"
slug: "links-inline-reference-autolinks"
---

Hyperlinks are the foundation of the World Wide Web. Markdown provides multiple distinct ways to create links: **Inline Links** (for quick one-off references), **Reference-Style Links** (for clean, readable source text), and **Autolinks** (for bare URLs).

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

### 1. Inline Links (The Most Common Method)

An inline link consists of the **clickable anchor text in square brackets `[ ]`**, immediately followed by the **destination URL in parentheses `( )`**:

```markdown
Visit the official [MSK Institute](https://mskinstitute.in) website.
```

- **HTML Output:** `<a href="https://mskinstitute.in">MSK Institute</a>`

#### Adding a Hover Title (Tooltip):
You can include an optional hover title by adding text in double quotes inside the parentheses:

```markdown
Read our [Python Tutorial](https://mskinstitute.in/tutorials/python-for-beginners "Master Python in 30 days")!
```

---

### 2. Relative & In-Page Anchor Links

Links do not have to point to external websites; they can point to local files or section headings within the same document:

#### Relative File Link:
```markdown
See the [Installation Guide](./docs/install.md) for step-by-step setup.
```

#### In-Page Section Anchor Link:
Markdown parsers automatically convert headings into URL slugs (lowercased, spaces replaced by hyphens):
```markdown
Jump directly to the [System Requirements](#system-requirements) section below.

## System Requirements
- Node.js 18+
- 4GB RAM
```

---

### 3. Reference-Style Links (Clean, Uncluttered Markdown)

When linking to long URLs multiple times throughout an article, inline links can make the raw source text messy and difficult to read. **Reference links** keep your paragraphs clean by defining the destination URL at the bottom of the document:

```markdown
Markdown was designed by [John Gruber][gruber] and [Aaron Swartz][swartz].
Both [gruber] and [swartz] believed in open plain-text standards.

<!-- Link Definitions placed at bottom of file -->
[gruber]: https://daringfireball.net/projects/markdown/
[swartz]: https://en.wikipedia.org/wiki/Aaron_Swartz
```

---

### 4. Autolinks (Bare URLs & Email Addresses)

If you simply want to display a clickable URL or email address without custom anchor text:

#### Standard Markdown Autolink:
Enclose the URL in angle brackets `< >`:
```markdown
Visit <https://mskinstitute.in> or contact <support@mskinstitute.in>.
```

#### GFM Extended Autolinking:
In GitHub Flavored Markdown, any bare URL beginning with `http://`, `https://`, or `www.` is automatically converted into a clickable link without requiring angle brackets:
```markdown
Visit https://mskinstitute.in for courses.
```

---

# Multiple Choice Questions

### 1. What is the standard syntax for creating an inline hyperlink in Markdown?
A. (link text)[https://url.com]
B. [link text](https://url.com)
C. {link text}<https://url.com>
D. <https://url.com>[link text]
**Answer:** B
**Explanation:** Square brackets enclose the visible link text, followed immediately by parentheses containing the URL: [link text](https://url.com).
---

### 2. How do you define a hover tooltip title on a Markdown inline link?
A. [link](https://url.com "Hover Title")
B. [link](https://url.com){title="Hover Title"}
C. [link "Hover Title"](https://url.com)
D. <title link>
**Answer:** A
**Explanation:** Placing quoted text inside the parentheses after the URL defines the HTML title attribute shown on hover.
---

### 3. What is the primary benefit of using Reference-Style links in Markdown?
A. They make the webpage download faster
B. They keep the raw Markdown prose clean and uncluttered by moving long URLs to the bottom of the file
C. They bypass browser firewalls
D. They automatically translate text into French
**Answer:** B
**Explanation:** Reference links separate URLs from paragraph body text, keeping the raw document pleasant and natural to read.
---

### 4. How do you link directly to an internal heading titled '## Installation Guide' on the same page?
A. [Jump to Install](#installation-guide)
B. [Jump to Install](@installation-guide)
C. [Jump to Install](!installation-guide)
D. [Jump to Install](/heading/install)
**Answer:** A
**Explanation:** Headings automatically generate lowercase hyphenated anchor slugs prefixed by a hash (#installation-guide).
---

### 5. In standard CommonMark, how do you turn a bare email address into a clickable mailto link?
A. [email]
B. <support@example.com>
C. (support@example.com)
D. {support@example.com}
**Answer:** B
**Explanation:** Wrapping an email address in angle brackets (<support@example.com>) compiles to <a href="mailto:support@example.com">.
---
