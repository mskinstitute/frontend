---
title: "Images, Alt Text & Captions"
description: "Embed images with ![alt](url), link images to URLs, and write accessible descriptive alt text."
order: 12
course: "markdown"
slug: "images-alt-text-captions"
---

Visual assets—such as architectural diagrams, UI mockups, and charts—make technical documentation engaging and easy to understand. In Markdown, image syntax is closely related to link syntax, differentiated by a single leading **exclamation mark (`!`)**.

![Markdown Documentation](/images/tutorials/markdown/markdown-documentation.jpg)

---

### 1. Basic Image Syntax

To embed an image in Markdown, prefix the link syntax with an **exclamation mark (`!`)**:

```markdown
![Descriptive Alt Text](https://example.com/logo.png)
```

- **The Exclamation Mark (`!`):** Tells the parser this is an embedded image, not a clickable text hyperlink.
- **Square Brackets `[ ]`:** Contain the **Alt Text** (alternative text used by screen readers and displayed if the image fails to load).
- **Parentheses `( )`:** Contain the image source path or URL.

#### Optional Image Title:
Just like links, you can include an optional title displayed on hover:

```markdown
![Git Architecture Flowchart](/images/git-flow.png "Git Branching Workflow Diagram")
```

- **HTML Output:**  
  `<img src="/images/git-flow.png" alt="Git Architecture Flowchart" title="Git Branching Workflow Diagram" />`

---

### 2. Writing Accessible Alt Text (A11y Best Practices)

Alt text is essential for web accessibility:
1. **Screen Readers:** Visually impaired developers rely on screen readers that read the alt text aloud.
2. **Broken Images:** If an image fails to load due to network errors, the browser displays the alt text in its place.
3. **SEO Ranking:** Search engines crawl alt text to understand the context of documentation images.

| Bad Alt Text (Avoid) | Good Accessible Alt Text |
| :--- | :--- |
| `![image](pic.png)` | `![High-level system architecture diagram showing client, API gateway, and PostgreSQL database](pic.png)` |
| `![photo](img.jpg)` | `![Screenshot of VS Code editor displaying debug console with breakpoint at line 42](img.jpg)` |

---

### 3. Clickable Image Links (Image inside a Link)

Often you want a badge, logo, or diagram preview to be clickable (e.g., clicking a thumbnail opens the full-resolution diagram, or clicking an npm badge opens the npm package page).

To make an image clickable, simply wrap the entire image expression inside a standard link:

```markdown
[![Build Status Badge](https://github.com/msk/api/workflows/CI/badge.svg)](https://github.com/msk/api/actions)
```

```
[  ![Alt](badge.svg)  ](  https://target-url.com  )
└────── Image ───────┘ └────── Link Target ───────┘
```

---

### 4. Controlling Image Dimensions (Width & Height)

Standard Markdown syntax does **NOT** provide native properties for adjusting image dimensions (like width or height). When you need to scale an image down (e.g. A logo that renders too large):

#### Use Raw HTML `<img>`:
```markdown
<img src="/images/tutorials/markdown/markdown-parsing-rendering-pipeline.svg" alt="Pipeline" width="600" />
```

Raw HTML is 100% valid inside Markdown documents and gives you exact pixel control!

---

# Multiple Choice Questions

### 1. What character distinguishes Markdown image syntax from standard hyperlink syntax?
A. At sign (@)
B. Exclamation mark (!)
C. Question mark (?)
D. Hash (#)
**Answer:** B
**Explanation:** Placing an exclamation mark before the square brackets (![alt](url)) instructs the parser to render an <img> tag rather than an <a> link.
---

### 2. In '![Database Schema](/img/db.png)', what purpose does the text inside the square brackets serve?
A. It names the computer file
B. It provides alternative text (alt text) for screen readers and search engines
C. It sets the background color
D. It encodes the image in base64
**Answer:** B
**Explanation:** The text inside square brackets becomes the HTML alt attribute (<img alt="Database Schema" ...>).
---

### 3. How do you create an image that functions as a clickable hyperlink in Markdown?
A. Put [!link] inside {image}
B. Nest the image syntax inside the square brackets of a standard link: [![alt](img.png)](https://url.com)
C. Images cannot be links in Markdown
D. Type 'clickable=true'
**Answer:** B
**Explanation:** Wrapping the image syntax inside a link construct creates an <a> tag wrapping the <img> element.
---

### 4. Why does standard Markdown lack native width and height controls for images?
A. The creator forgot about monitors
B. Markdown prioritizes simplicity; writers can use native HTML <img width="..." /> whenever exact sizing is needed
C. HTML bans image resizing
D. All web images must be 100x100 pixels
**Answer:** B
**Explanation:** Markdown keeps its syntax lean; when custom layout parameters like width or height are required, raw HTML <img> is the intended solution.
---

### 5. Which of the following is an example of high-quality accessible alt text for a code diagram?
A. ![diagram](diag.png)
B. ![pic1](diag.png)
C. ![Sequence diagram illustrating JWT authentication flow between Client, Auth Server, and Database](diag.png)
D. ![](diag.png)
**Answer:** C
**Explanation:** Descriptive alt text explains the key informational content of the diagram for users who cannot view the visual asset.
---
