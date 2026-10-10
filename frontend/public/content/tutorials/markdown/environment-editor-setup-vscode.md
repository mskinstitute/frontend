---
title: "Environment & Editor Setup (VS Code, Obsidian, Typora)"
description: "Set up the ultimate Markdown workspace using VS Code extensions, Obsidian note-taking, and live previewers."
order: 3
course: "markdown"
slug: "environment-editor-setup-vscode"
---

While you can write Markdown in any basic text editor, modern software engineers and technical writers use purpose-built developer environments that offer **live split-screen previews, automated linting, syntax highlighting, table formatters, and diagram rendering**.

![Markdown Documentation Workspace](/images/tutorials/markdown/markdown-documentation.jpg)

---

### 1. Visual Studio Code (The Industry Standard for Developers)

VS Code has native support for Markdown out of the box, including:
- **Side-by-Side Live Preview:** Press `Ctrl + K V` (Windows/Linux) or `Cmd + K V` (Mac) to open a real-time rendered preview pane next to your editor.
- **Toggle Preview:** Press `Ctrl + Shift + V` to toggle the current tab into a rendered view.
- **Outline View:** The Outline sidebar automatically parses your `#`, `##`, `###` headings into a clickable Table of Contents.

#### Essential VS Code Extensions for Markdown:

| Extension Name | Author | Key Capability |
| :--- | :--- | :--- |
| **Markdown All in One** | Yu Zhang | Keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic), auto TOC generation, list auto-completion. |
| **markdownlint** | David Anson | Static analysis linter that flags broken syntax, bad heading structures, and trailing spaces. |
| **Markdown Table Prettifier** | Alan Walk | Auto-aligns messy pipe tables into beautiful, readable grid columns on save. |
| **Mermaid Markdown Preview** | Matt Bierner | Renders interactive architecture flowcharts and sequence diagrams inside the VS Code preview pane. |

---

### 2. Dedicated Markdown Writing Apps

If you write personal notes, books, or research papers, standalone Markdown editors offer distraction-free experiences:

1. **Obsidian (Local-first Knowledge Base):**
   - Stores everything as plain `.md` files on your local hard drive.
   - Supports bi-directional linking (`[[Page Name]]`), graph view, and LaTeX math equations.
2. **Typora (Seamless Live Preview):**
   - Pioneer of "Hybrid WYSIWYG" Markdown: hides markdown symbols the moment you finish typing a word, displaying rich text immediately in-place.
3. **MarkText (Free & Open Source):**
   - Free alternative to Typora supporting GFM, dark themes, and math equations.

---

### 3. Command-Line & Online Previewers

- **Dillinger.io / StackEdit.io:** In-browser Markdown editors with cloud sync to Google Drive and GitHub.
- **Grip (GitHub Readme Instant Preview):** Python CLI tool that uses GitHub's official API to render local README files exactly as they will look on github.com:
  ```bash
  pip install grip
  grip README.md
  # Opens live preview at http://localhost:6419
  ```

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

# Multiple Choice Questions

### 1. In Visual Studio Code, what default keyboard shortcut opens a live Markdown preview to the side?
A. Ctrl + S
B. Ctrl + K V (Windows) / Cmd + K V (Mac)
C. Alt + F4
D. Ctrl + Z
**Answer:** B
**Explanation:** Ctrl + K followed by V in VS Code opens the Markdown preview to the side of the current active text editor.
---

### 2. Which popular VS Code extension provides automated linting and style validation for Markdown files?
A. markdownlint
B. Docker
C. React DevTools
D. Prettier SQL
**Answer:** A
**Explanation:** markdownlint checks markdown files against standard formatting rules and highlights style errors in real time.
---

### 3. Which note-taking application stores all notes locally as plain .md files and supports bi-directional [[links]]?
A. Microsoft Word
B. Obsidian
C. Google Sheets
D. Adobe Photoshop
**Answer:** B
**Explanation:** Obsidian is a widely used knowledge-management app built entirely on top of local Markdown files.
---

### 4. What is the benefit of using an extension like 'Markdown Table Prettifier'?
A. It changes Markdown into Python code
B. It automatically formats and aligns columns in pipe tables so the raw source text is neat and readable
C. It converts text to audio speech
D. It deletes duplicate files
**Answer:** B
**Explanation:** Markdown Table Prettifier organizes uneven pipe delimiters into clean aligned columns automatically.
---

### 5. What tool allows developers to preview their README.md locally using GitHub's exact rendering engine?
A. Grip
B. VLC Player
C. Calculator
D. WinRAR
**Answer:** A
**Explanation:** Grip is a CLI utility that renders local markdown files via GitHub's Markdown API for accurate local previews.
---
