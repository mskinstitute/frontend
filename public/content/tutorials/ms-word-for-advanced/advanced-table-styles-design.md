---
title: 'Advanced Table Styles & Design'
description: 'Build custom branded table styles: modify table XML templates, diagonal borders, custom shading palettes, and default cell alignments.'
keywords:
  - custom table styles
  - table design
  - diagonal borders
  - new table style
  - table formatting
duration: '18 min'
level: 'Advanced'
track: 'ms-word-for-advanced'
slug: 'advanced-table-styles-design'
---

# Advanced Table Styles & Design

## Custom Branded Table Styles

While Word provides dozens of built-in table styles, corporate publishing requires adhering to brand style guides with exact corporate HEX colors, custom border weights, and specific font hierarchies.

![Advanced Table Styles and Design Customization](/images/tutorials/ms-word/tables-insert-format.svg)

### 1. Creating a New Custom Table Style

1. Place your cursor inside any table.
2. Go to **Table Design** tab.
3. Click the **More** dropdown arrow on the Table Styles gallery (bottom-right of gallery).
4. Click **New Table Style...** at the bottom.
5. In the style editor:
   - **Name**: e.g., `MSK Corporate Ledger`.
   - **Style based on**: Normal Table.
   - **Apply formatting to**:
     - *Whole table*: Set base font (`Segoe UI, 10pt`), subtle horizontal grid lines.
     - *Header row*: Deep Navy fill (`#185ABD`), 11pt Bold White text, center alignment.
     - *Total row*: Light Blue fill, 11pt Bold Navy text, double bottom border.
     - *Banded rows*: Alternating `#F8FAFC` and White shading.
6. Check **New documents based on this template** so your custom style is saved permanently!

### 2. Diagonal Cell Borders

Diagonal borders split a single corner cell to label both the row header and column header simultaneously:
1. Click the top-left corner cell of your table.
2. Go to **Table Design > Borders > Diagonal Down Border** (or Diagonal Up Border).
3. A crisp angled dividing line appears across the cell.
4. Type both labels (e.g. *Day* and *Time*):
   - Format *Day* as Align Right.
   - Format *Time* as Align Left.

### 3. Converting Tables to Plain Text (and Vice Versa)

- **Table to Text**:
  - Go to **Layout > Data > Convert to Text**.
  - Choose separator: **Tabs**, **Commas (CSV)**, or **Paragraph marks**.
  - Strips the grid, leaving clean tab-separated text!
- **Text to Table**:
  - Highlight comma or tab-separated text.
  - Go to **Insert > Table > Convert Text to Table...**
  - Word automatically detects delimiters and reconstructs the table instantly!

# Multiple Choice Questions

### 1. Where can you create a reusable custom table style with your company's exact brand colors?
A. File > Print
B. Table Design > Table Styles gallery > New Table Style...
C. Review > Style Guide
D. Insert > WordArt
**Answer:** B
**Explanation:** Table Design > New Table Style allows building branded table styles with custom headers, fills, and borders.
---

### 2. Which border tool draws an angled line across a corner cell to label rows and columns in the same box?
A. Border Painter
B. Diagonal Down / Diagonal Up Border
C. Outside Border
D. Cross Border
**Answer:** B
**Explanation:** Diagonal borders draw an angled divider line across a cell.
---

### 3. Which command converts an existing structured table into plain tab-separated or comma-separated text?
A. Delete Table
B. Layout > Data > Convert to Text
C. Cut Table
D. Export to Notepad
**Answer:** B
**Explanation:** Table Tools > Layout > Convert to Text strips the table structure while preserving data separated by tabs or commas.
---

### 4. Can a custom table style apply different formatting to the Header Row, Total Row, and Banded Rows automatically?
A. No, table styles format all cells identically
B. Yes, through the "Apply formatting to" dropdown in the style editor
C. Only in Microsoft Excel
D. Requires writing VBA code
**Answer:** B
**Explanation:** The Table Style editor provides conditional formatting targets for Whole Table, Header Row, Total Row, and Banded Rows.
---

### 5. How can you convert raw comma-separated values (CSV) into a structured table in Word?
A. Type lines manually
B. Insert > Table > Convert Text to Table...
C. Copy to Excel and back
D. Use Format Painter
**Answer:** B
**Explanation:** Insert > Table > Convert Text to Table automatically parses comma or tab-delimited text into a table.
---

