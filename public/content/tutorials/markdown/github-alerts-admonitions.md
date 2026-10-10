---
title: "GitHub Alerts & Admonitions"
description: "Implement official GitHub callout alerts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], and > [!CAUTION]."
order: 19
course: "markdown"
slug: "github-alerts-admonitions"
---

When writing documentation, software manuals, or installation guides, certain pieces of information require immediate visual distinction—such as a critical security warning, a helpful tip, or a breaking change alert. In late 2023, GitHub officially introduced standardized **Markdown Alerts (Admonitions)**.

![Markdown Syntax Anatomy](/images/tutorials/markdown/markdown-syntax-cheatsheet-anatomy.svg)

---

### 1. The 5 Official GitHub Alert Types

GitHub alerts extend standard blockquote syntax by placing an alert identifier in square brackets (`[!TYPE]`) on the very first line:

```markdown
> [!NOTE]
> Useful background information that users should know, even when skimming.

> [!TIP]
> Helpful advice, shortcuts, or performance recommendations for doing things better.

> [!IMPORTANT]
> Key information users need to know to achieve their goal and prevent errors.

> [!WARNING]
> Urgent info that needs user attention to avoid breaking changes or unexpected behavior.

> [!CAUTION]
> Advises about potential risks, destructive actions, or irreversible consequences (e.g. Data loss).
```

---

### 2. Visual Styling & Color Coding

Each alert type renders with a distinct theme, accent border, and leading SVG icon:

| Alert Syntax | Accent Color | Visual Theme & Icon | Typical Real-World Use Case |
| :--- | :--- | :--- | :--- |
| `> [!NOTE]` | **Blue** | ℹ️ Information Circle | Explaining backward compatibility, historical context |
| `> [!TIP]` | **Green** | 💡 Lightbulb | Keyboard shortcuts, performance optimizations |
| `> [!IMPORTANT]` | **Purple** | ❗ Exclamation Diamond | Prerequisite software versions (e.g., Node.js 18+ required) |
| `> [!WARNING]` | **Amber/Orange** | ⚠️ Warning Triangle | Deprecated API endpoints, migration deadlines |
| `> [!CAUTION]` | **Red** | 🛑 Octagon Stop | `rm -rf` commands, dropping production databases |

---

### 3. Syntax Rules & Formatting Guidelines

To ensure alerts render properly across GitHub, GitLab, and modern SSGs:
1. **Uppercase Required:** The alert keyword **must be in all caps**: `[!NOTE]` (not `[!note]`).
2. **First Line Only:** The `[!TYPE]` token must appear on the very first line of the blockquote immediately following the `>` marker.
3. **Multi-Line Body:** Subsequent lines of text must also begin with a `>` marker.
4. **Rich Content:** You can include bold text, inline code, and links inside an alert:

```markdown
> [!WARNING]
> Running `npm run reset-db` will permanently erase all local tables.
> Please make sure you have created a backup before executing this command!
```

---

# Multiple Choice Questions

### 1. What syntax is used on the first line of a blockquote to create an official GitHub Note alert?
A. > [!NOTE]
B. > :::note
C. > @alert note
D. > {note}
**Answer:** A
**Explanation:** GitHub standardized alert callouts using blockquote syntax followed by square brackets and an exclamation mark: > [!NOTE].
---

### 2. Which alert type renders with a green accent color and lightbulb icon for helpful shortcuts?
A. > [!NOTE]
B. > [!TIP]
C. > [!DANGER]
D. > [!WARNING]
**Answer:** B
**Explanation:** The [!TIP] alert renders with a green border and lightbulb icon to highlight helpful recommendations.
---

### 3. Which alert level is recommended for warning users about irreversible data loss or destructive commands?
A. > [!NOTE]
B. > [!TIP]
C. > [!CAUTION]
D. > [!INFO]
**Answer:** C
**Explanation:** [!CAUTION] renders with an urgent red accent color to alert users about severe risks, destructive actions, or data loss.
---

### 4. Must the alert keyword inside '[!WARNING]' be written in uppercase?
A. Yes, GitHub's specification strictly requires all-caps (e.g. [!WARNING])
B. No, it must be lowercase
C. Case does not matter
D. It must be written in binary
**Answer:** A
**Explanation:** The GitHub specification requires the alert identifier to be in uppercase letters (e.g. [!NOTE], [!WARNING]).
---

### 5. Can an alert contain inline code formatting such as '`npm install`'?
A. No, alerts only support plain unformatted text
B. Yes, alerts support standard Markdown elements like inline code, links, and bold text
C. Only if written in HTML
D. Only on Sundays
**Answer:** B
**Explanation:** Alert bodies support the full range of inline Markdown syntax including code, links, and bold emphasis.
---
