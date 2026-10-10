---
title: 'Custom Bullets & Numbering'
description: 'Advanced outline numbering: build multi-tiered legal numbering (1.1, 1.1.1), link numbering to Heading styles, and manage tab stops.'
keywords:
  - multilevel list
  - legal numbering
  - heading numbering
  - custom list
  - advanced numbering
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'custom-bullets-numbering'
---

# Custom Bullets & Numbering

## Advanced Multilevel & Legal Numbering

Technical manuals, government specifications, engineering documentation, and legal contracts require hierarchical numbering (e.g. `1.0`, `1.1`, `1.1.1`, `1.1.2`).

Setting up multilevel lists correctly requires **linking list levels to Word's built-in Heading styles**.

![Advanced Multilevel Numbering and Outline Setup](/images/tutorials/ms-word/home-paragraph-formatting.svg)

### 1. Linking Multilevel Lists to Heading Styles (The Industry Standard)

When numbering is linked to Heading styles:
- Applying `Heading 1` automatically numbers the title as **`1.0 Introduction`**.
- Applying `Heading 2` automatically numbers the section as **`1.1 Background`**.
- Applying `Heading 3` automatically numbers the subtopic as **`1.1.1 Architecture`**.
- The Table of Contents, Navigation Pane, and Cross-References all reflect the exact numbers automatically!

#### How to Configure It:
1. Place cursor in a normal paragraph.
2. Go to **Home** tab > **Paragraph** group > click **Multilevel List** dropdown.
3. Select the pre-configured gallery card that displays **`1 Heading 1, 1.1 Heading 2, 1.1.1 Heading 3`**.
4. That's it! Every heading you format now inherits synchronized outline numbering automatically!

### 2. Defining a Custom Multilevel List

To customize the exact prefixes or indents:
1. Click **Multilevel List > Define New Multilevel List...**
2. In the dialog, click the **More >>** button at the bottom-left to expose all settings:
   - **Click level 1**: Set number style (`1, 2, 3`). On the right, select **Link level to style: Heading 1**.
   - **Click level 2**: In the "Enter formatting for number" box, type the prefix or check **Include level number from: Level 1**, add a period, then select number style for level 2. Link level to style: **Heading 2**.
   - **Click level 3**: Link level to style: **Heading 3**.
   - Set **Follow number with**: Choose **Space** or **Tab character**.
3. Click **OK**.

### 3. Legal Style Numbering Checkbox

In legal contracts, even if Level 1 uses Roman numerals (`Article I`), sub-clauses must use Arabic numbers (`Section 1.1` instead of `I.1`).
- Simply check the **Legal style numbering** checkbox in the Multilevel List dialog to force all ancestral level numbers into clean Arabic numerals!

# Multiple Choice Questions

### 1. Why should advanced multilevel numbering always be linked to built-in Heading styles?
A. It reduces file size
B. Headings automatically number themselves and sync with the Table of Contents and Navigation Pane
C. Printers require heading links
D. Word crashes otherwise
**Answer:** B
**Explanation:** Linking multilevel numbering to Heading styles automates outline hierarchy throughout the entire document.
---

### 2. What is the purpose of checking the "Legal style numbering" box in the Multilevel List dialog?
A. Adds a copyright symbol
B. Converts ancestral Roman numerals (e.g. Article I) into Arabic numerals (1.1) for sub-clauses
C. Locks the file with legal encryption
D. Underlines all numbers
**Answer:** B
**Explanation:** Legal style numbering forces preceding level numbers into Arabic numerals (1.1 instead of I.1).
---

### 3. Where can you expose advanced options (like "Link level to style") inside the Define New Multilevel List dialog?
A. Press F1
B. Click the "More >>" button at the bottom-left
C. Right-click canvas
D. Open View menu
**Answer:** B
**Explanation:** Clicking "More >>" reveals advanced options including style linking and character spacing.
---

### 4. In the Multilevel List dialog, what does "Follow number with: Space" do instead of "Tab character"?
A. Deletes the number
B. Leaves a compact single space between the number and text rather than a wide tab jump
C. Centers the paragraph
D. Double spaces the lines
**Answer:** B
**Explanation:** "Follow number with: Space" keeps numbers snugly adjacent to titles without awkward tab gaps.
---

### 5. Under which Ribbon group is the Multilevel List dropdown tool found?
A. Home > Font
B. Home > Paragraph
C. Layout > Page Setup
D. References > Captions
**Answer:** B
**Explanation:** Home > Paragraph contains the Bullets, Numbering, and Multilevel List tool buttons.
---

