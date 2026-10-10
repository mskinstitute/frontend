# Page Layout, Orientation and Margins

Spreadsheet tables are typically wider than standard text documents. Understanding orientation settings, custom margins, and scaling controls ("Fit to 1 Page Wide") prevents awkward print splits and ensures presentation-ready reports.

---

## Page Orientation: Portrait vs. Landscape

On the **Page Layout** tab, click **Orientation**:
- **Portrait (Vertical)**: Taller than it is wide. Best for tall, narrow lists with 3 to 6 columns and dozens of rows.
- **Landscape (Horizontal)**: Wider than it is tall. **The default recommendation for 90% of business spreadsheets**, allowing tables with 8 to 14 columns (such as a 12-month annual budget) to span a single page comfortably!

---

## Margins & Centering on Page

On the **Page Layout** tab, click **Margins**:
- Select from presets: **Normal**, **Wide**, or **Narrow** (Narrow margins maximize printable spreadsheet grid area).
- Click **Custom Margins...** to access fine controls:
  - **Top, Bottom, Left, Right**: Adjust in inches or centimeters.
  - **Center on Page Options**:
    - **[✓] Horizontally**: Centers your table between the left and right margins, preventing awkward left-skewed prints!
    - **[✓] Vertically**: Centers the table between top and bottom.

---

## The Ultimate Excel Print Fix: "Fit to 1 Page Wide"

The #1 complaint in Excel printing is the "single stray column" that prints alone on page 2:
1. Go to **Page Layout**.
2. Look at the **Scale to Fit** group on the ribbon:
   - **Width**: Change from *Automatic* to **`1 page`**!
   - **Height**: Leave as **`Automatic`**!
3. **Why this is genius**:
   - Excel dynamically shrinks the font size just enough to force all columns to fit across one page wide.
   - Because Height remains *Automatic*, long 500-row tables flow naturally down pages 1, 2, 3, and 4 without being squished into an unreadable microscopic single page!

---

## Repeating Header Rows on Every Page ('Print Titles')

When printing a 10-page inventory report, Page 2 through Page 10 become unreadable because the top header row ("Name", "SKU", "Price") only printed on Page 1:
1. Go to **Page Layout > Print Titles**.
2. In the Page Setup dialog, locate **Rows to repeat at top**.
3. Click inside the box, then click Row 1 on your worksheet (Excel enters `$1:$1`).
4. Click **OK**.
5. When printed, Row 1 will automatically repeat at the top of every single printed page!

# Multiple Choice Questions

### 1. Which page orientation is generally recommended for wide corporate spreadsheets containing 10 to 15 columns?
A. Portrait
B. Landscape
C. Square
D. Inverted
**Answer:** B
**Explanation:** Landscape orientation provides greater horizontal width, allowing wide multi-column financial tables to fit without column truncation.

---

### 2. How can you force all columns to fit on a single page width while allowing long rows to flow naturally across multiple pages?
A. Set Margins to zero
B. Under Page Layout > Scale to Fit, set Width to "1 page" and Height to "Automatic"
C. Delete column borders
D. Zoom out to 50%
**Answer:** B
**Explanation:** Setting Width to "1 page" and Height to "Automatic" scales column widths to fit the page horizontally while letting rows span multiple vertical pages cleanly.

---

### 3. Which feature in Page Layout > Print Titles causes the top table header row to print at the top of every subsequent printed page?
A. Print Gridlines
B. Rows to repeat at top
C. Header Row Lock
D. Title Freeze
**Answer:** B
**Explanation:** "Rows to repeat at top" duplicates the specified header rows at the top of every physical page in multi-page printouts.

---

### 4. Which margin preset provides the maximum printable canvas area for wide data tables?
A. Normal
B. Wide
C. Narrow
D. Custom Zero
**Answer:** C
**Explanation:** The "Narrow" margin preset reduces header, footer, left, and right margins, maximizing printable worksheet area.

---

### 5. Where can you enable the setting to center a small data table horizontally between the left and right paper edges?
A. File > Options > Advanced
B. Page Layout > Margins > Custom Margins > Center on page: Horizontally
C. Home > Alignment > Merge & Center
D. View > Zoom to Selection
**Answer:** B
**Explanation:** The Custom Margins dialog features "Center on page" checkboxes (Horizontally and Vertically) to balance table placement on printed pages.

---
