---
title: 'Custom Styles & Themes'
description: 'Master Word style architecture: modifying style properties, style hierarchy (Style Based On), Style Inspector, and Theme palettes.'
keywords:
  - custom styles
  - style hierarchy
  - style inspector
  - theme colors
  - modify style
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'custom-styles-themes'
---

# Custom Styles & Themes

## Style Architecture & Document Themes

Professional document publishing relies on rigorous typographic hierarchy. Relying on manual toolbar formatting leads to inconsistencies where one section uses 14pt Calibri and another uses 15pt Arial. Styles eliminate this chaos.

### 1. The Style Hierarchy ("Style Based On")

Every style in Microsoft Word belongs to an inheritance family:
- The root ancestor is the **Normal** style.
- When you create or modify a style, you can configure **Style based on: Normal**.
- *Inheritance Magic*: If you change the font family of `Normal` from Calibri to Garamond, every heading and subheading based on Normal updates its typeface automatically while retaining its own unique bolding and size!

### 2. Modifying Existing Styles

Never highlight each heading to change its color! Instead:
1. In the **Home > Styles** gallery, right-click **Heading 1** > click **Modify...**
2. In the Modify Style dialog:
   - Change Font, Size, Bold, and Color (e.g. Navy Blue `#185ABD`).
   - Click **Format** dropdown at the bottom-left:
     - **Paragraph**: Set Space Before to `12pt`, Space After to `6pt`, check **Keep with next**!
     - **Border**: Add an elegant horizontal border line beneath the heading.
3. Check **New documents based on this template** if you want this style update permanent.
4. Click **OK**. Every Heading 1 throughout your entire document updates in a millisecond!

### 3. The Style Inspector

When text refuses to format properly due to hidden overrides:
1. Click the Dialog Box Launcher (`↘`) in the Styles group.
2. At the bottom of the Styles pane, click the **Style Inspector** icon (magnifying glass with an `A`).
3. The Style Inspector reveals:
   - Paragraph Style: e.g. `Heading 2`
   - Plus Character Formatting: e.g. `Bold, Italic, 16pt (Manually overridden!)`
4. Click the **Clear Character Style** button to strip rogue manual overrides and restore pristine style purity!

### 4. Global Document Themes

Located on the **Design** tab:
- **Colors**: Changes the 8-color palette across all shapes, tables, charts, and headings.
- **Fonts**: Changes the Body / Heading font pairing (e.g., Century Gothic + Garamond) across the entire document instantly.

# Multiple Choice Questions

### 1. What happens when you modify a Style by right-clicking it and selecting "Modify"?
A. Only the currently highlighted word updates
B. Every paragraph in the document formatted with that style updates immediately
C. The style is deleted
D. Word resets to factory defaults
**Answer:** B
**Explanation:** Modifying a style globally propagates formatting updates to every instance across the entire document.
---

### 2. Which Paragraph setting inside a Heading style prevents a heading from sitting alone at the bottom of a page without its body text?
A. Keep with next
B. Page Break Before
C. Widow/Orphan control
D. Hyphenation
**Answer:** A
**Explanation:** "Keep with next" glues the heading to the first paragraph beneath it, preventing lonely orphan headings.
---

### 3. What tool reveals hidden manual formatting overrides that are conflicting with an assigned Style?
A. Font Dialog
B. The Style Inspector
C. Spelling Checker
D. Word Count
**Answer:** B
**Explanation:** The Style Inspector diagnoses and separates paragraph style definitions from manual character overrides.
---

### 4. What is the base root style from which most standard body and heading styles inherit properties in Word?
A. Heading 1
B. Title
C. Normal
D. Default Paragraph
**Answer:** C
**Explanation:** The "Normal" style is the root parent style in Microsoft Word's typography hierarchy.
---

### 5. Under which Ribbon tab can you globally switch the entire document's color palette and font pairing in one click?
A. Home
B. Design
C. Layout
D. View
**Answer:** B
**Explanation:** The Design tab houses global Document Formatting themes, color palettes, and font pairings.
---

