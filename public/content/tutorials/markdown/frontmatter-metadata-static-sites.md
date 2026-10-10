---
title: "Frontmatter & Metadata for Static Sites"
description: "Structure YAML and JSON frontmatter blocks (---) for SEO titles, publish dates, authors, and tag taxonomies."
order: 23
course: "markdown"
slug: "frontmatter-metadata-static-sites"
---

While Markdown excels at formatting readable document text, modern web publishing platforms (like Next.js, Astro, Jekyll, Hugo, and Docusaurus) also require structured data—such as post titles, publication dates, SEO meta descriptions, authors, and tag categories.

**Frontmatter** is a standardized block of metadata placed at the **very top** of a Markdown file, cleanly separated from the body text.

![Markdown Compilation Pipeline](/images/tutorials/markdown/markdown-parsing-rendering-pipeline.svg)

---

### 1. YAML Frontmatter Syntax

The most popular format is **YAML Frontmatter**, enclosed between two lines of **triple hyphens (`---`)**:

```markdown
---
title: "Mastering TypeScript Generics in 2026"
description: "A comprehensive guide to building reusable, type-safe data structures with generics."
date: 2026-09-13
author: "Er. Sumit Kumar"
tags: ["typescript", "programming", "web-dev"]
featured: true
readingTime: 6
---

# Mastering TypeScript Generics in 2026

Generics allow developers to create components that work over a variety of types...
```

---

### 2. How Parsers Extract Frontmatter

When a static site generator (or a library like `gray-matter`) processes a Markdown file:
1. It reads the top block between the `---` fences.
2. It parses the YAML into a standard JavaScript object:
   ```javascript
   {
     data: {
       title: "Mastering TypeScript Generics in 2026",
       date: "2026-09-13",
       tags: ["typescript", "programming"],
       featured: true
     },
     content: "# Mastering TypeScript Generics in 2026

Generics allow..."
   }
   ```
3. The metadata (`data`) is used to populate page `<title>`, OpenGraph preview cards, and blog listing filters, while the body text (`content`) is rendered as HTML!

---

### 3. Frontmatter Formats (YAML vs JSON vs TOML)

While YAML is used by 95% of developers, other formats are supported:

| Format | Opening / Closing Delimiter | Syntax Example |
| :--- | :--- | :--- |
| **YAML** | `---` | `title: "My Post"` |
| **TOML** | `+++` | `title = "My Post"` (Common in Hugo) |
| **JSON** | `;;;` or `---` | `{ "title": "My Post" }` |

---

# Multiple Choice Questions

### 1. What delimiter lines enclose YAML frontmatter at the very top of a Markdown file?
A. Triple hyphens (---)
B. Triple hashes (###)
C. Triple asterisks (***)
D. Triple quotes (""")
**Answer:** A
**Explanation:** YAML frontmatter is placed at the beginning of a file bounded by triple-hyphen (---) divider lines.
---

### 2. Which popular Node.js library is widely used to parse frontmatter and content from Markdown files?
A. gray-matter
B. express
C. mongoose
D. redux
**Answer:** A
**Explanation:** 'gray-matter' is the industry-standard npm package for extracting frontmatter metadata and content from markdown strings.
---

### 3. What happens to the frontmatter block when the Markdown is rendered to HTML in the browser?
A. It is printed in bold at the top of the webpage
B. It is stripped from the rendered body text and used behind the scenes for metadata, titles, and routing
C. It throws an error
D. It is sent as an email
**Answer:** B
**Explanation:** Frontmatter is consumed by the build engine for data/SEO purposes and is not rendered directly in the HTML body output.
---

### 4. Which alternative frontmatter delimiter is used by the Hugo static site generator for TOML metadata?
A. Triple plus signs (+++)
B. Triple colons (:::)
C. Triple tildes (~~~)
D. Double slashes (//)
**Answer:** A
**Explanation:** Hugo supports TOML frontmatter bounded by triple plus signs (+++).
---

### 5. How are array values (such as blog tags) represented in YAML frontmatter?
A. tags: ["web", "javascript", "react"] or bullet lines under tags:
B. tags = web + javascript
C. <tags>web</tags>
D. tags(web, js)
**Answer:** A
**Explanation:** YAML supports inline arrays with square brackets [a, b] or indented hyphenated lines.
---
