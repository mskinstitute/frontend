---
title: "Unordered Lists & Bullet Customization"
description: "Create bulleted lists using asterisks, dashes, and plus signs, with tight vs loose spacing."
order: 8
course: "markdown"
slug: "unordered-lists-bullets"
---

Lists are indispensable for organizing information, outlining features, and enumerating project requirements. In Markdown, **unordered lists** represent bulleted collections where the sequence does not imply a chronological order.

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

### 1. Unordered List Markers

You can create an unordered bullet item using any of three characters: **dash (`-`)**, **asterisk (`*`)**, or **plus (`+`)**, followed by a space:

```markdown
- Item using a hyphen/dash
- Second item
- Third item

* Item using an asterisk
* Second item

+ Item using a plus sign
+ Second item
```

All three symbols compile to the identical HTML `<ul><li>...</li></ul>` structure.

> **Team Convention:** Most engineering style guides (such as Google and GitHub) recommend sticking exclusively to **hyphens (`-`)** for consistency.

---

### 2. Nested Unordered Lists

To nest a sub-list inside an existing list item, indent the sub-items by **2 or 4 spaces** (or 1 Tab):

```markdown
- Frontend Technologies
  - React.js
  - Next.js
  - Tailwind CSS
- Backend Technologies
  - Node.js
  - Python FastAPI
  - PostgreSQL
```

---

### 3. Tight vs. Loose Lists (Spacing Matters!)

Understanding the difference between tight and loose lists is a mark of an experienced Markdown writer:

#### Tight List (No paragraph wrapping):
When items have no blank lines between them, the HTML compiles without `<p>` tags inside the `<li>`:
```markdown
- Clean item 1
- Clean item 2
- Clean item 3
```
*HTML:* `<li>Clean item 1</li>`

#### Loose List (With paragraph wrapping):
If you insert a blank line between any items in the list, the entire list becomes "loose", wrapping each item in `<p>` tags with extra paragraph margins:
```markdown
- Detailed item 1 with extensive explanation.

- Detailed item 2 with further instructions.
```
*HTML:* `<li><p>Detailed item 1 with extensive explanation.</p></li>`

---

# Multiple Choice Questions

### 1. Which of the following symbols CANNOT be used to create an unordered list item in standard Markdown?
A. Hyphen (-)
B. Asterisk (*)
C. Plus sign (+)
D. Dollar sign ($)
**Answer:** D
**Explanation:** Standard Markdown supports -, *, and + as unordered bullet markers. The dollar sign ($) is not a list marker.
---

### 2. Which HTML element is generated for an unordered list container in Markdown?
A. <ol>
B. <ul>
C. <dl>
D. <menu>
**Answer:** B
**Explanation:** Unordered bullet lists compile to an HTML <ul> (Unordered List) element.
---

### 3. How do you nest a sub-bullet list inside an existing list item?
A. Type -> before the word
B. Indent the child items by 2 or 4 spaces beneath the parent item
C. Use a colon at the end of the line
D. Enclose the items in parentheses
**Answer:** B
**Explanation:** Indenting the child line by 2 or 4 spaces nests it as a sub-list item inside the preceding parent item.
---

### 4. What distinguishes a 'loose list' from a 'tight list' in Markdown parsing?
A. A loose list has blank lines between items, causing parsers to wrap list items in <p> paragraph tags
B. A loose list uses numbers instead of bullets
C. A loose list is rendered in italic font
D. A loose list deletes the last item
**Answer:** A
**Explanation:** Adding blank lines between list items makes the list loose, instructing the parser to wrap item contents in <p> tags for larger spacing.
---

### 5. What is the recommended industry standard symbol for unordered lists across modern repositories?
A. Hyphen (-)
B. Plus (+)
C. Ampersand (&)
D. Tilde (~)
**Answer:** A
**Explanation:** The hyphen (-) is the most commonly recommended marker in documentation style guides for consistency.
---
