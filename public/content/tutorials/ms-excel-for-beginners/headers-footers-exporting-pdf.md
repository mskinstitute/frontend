# Headers, Footers and Exporting as PDF

Finalizing reports for executive leadership or client distribution requires adding standardized document metadata—such as company confidentiality notices, date stamps, and page numbers—followed by exporting to a clean, universal PDF document.

---

## Adding Headers and Footers in Excel

Unlike Word, Excel worksheets do not display headers and footers in Normal View. To configure them:
1. Go to **View > Page Layout** (or **Insert > Header & Footer**).
2. The display switches to page-based view, revealing three distinct header boxes across the top (Left, Center, Right) and three footer boxes across the bottom.
3. Clicking inside any header/footer box activates the contextual **Header & Footer** ribbon tab.

### Dynamic Header & Footer Elements:
- **Page Number**: Inserts `&[Page]` (prints the current page number).
- **Number of Pages**: Inserts `&[Pages]` (total page count). Combine them: `Page &[Page] of &[Pages]`!
- **Current Date**: Inserts `&[Date]` (updates dynamically to the print date).
- **Current Time**: Inserts `&[Time]`.
- **File Path / File Name**: Inserts `&[File]` (prints the workbook filename).
- **Sheet Name**: Inserts `&[Tab]` (prints the active worksheet name).
- **Picture**: Inserts a corporate logo image into the header.

---

## Printing Gridlines and Row/Column Headings

By default, the faint gray worksheet gridlines do **NOT** print on paper:
- To print gridlines: Go to **Page Layout > Sheet Options**. Under **Gridlines**, check **[✓] Print**.
- To print column letters (A, B, C) and row numbers (1, 2, 3) for auditing purposes: Under **Headings**, check **[✓] Print**.

---

## Exporting as a PDF Document

PDF is the universal standard for emailing invoices, proposals, and quarterly reports:
1. Go to **File > Export > Create PDF/XPS Document**.
2. Click **Create PDF/XPS**.
3. Choose your file destination and filename.
4. **The Options Dialog**: Click **Options...** before saving:
   - **Publish what**:
     - *Selection*: Prints only the highlighted cells.
     - *Active sheet(s)*: Default option.
     - *Entire workbook*: Compiles all worksheets into a single multi-page PDF document!
5. Click **Publish**. Excel renders a pristine, high-resolution vector PDF!

# Multiple Choice Questions

### 1. Why do worksheet gridlines appear on your computer monitor but fail to appear when printed onto physical paper?
A. The printer is out of black ink
B. By default, Excel's "Print Gridlines" option is disabled; it must be checked under Page Layout > Sheet Options
C. Gridlines only print on color printers
D. You must save as PDF first
**Answer:** B
**Explanation:** Excel displays gridlines on screen for navigation but suppresses them on paper by default until "Print" is checked in Sheet Options.

---

### 2. Which dynamic code string displays standard pagination like "Page 1 of 12" in an Excel footer?
A. Page {P} of {TOTAL}
B. Page &[Page] of &[Pages]
C. =PAGE() / =PAGES()
D. Page # of ##
**Answer:** B
**Explanation:** Excel's Header & Footer engine uses the &[Page] code for the active page and &[Pages] for the total page count.

---

### 3. Which view mode displays the worksheet divided into physical paper pages with clickable Header and Footer zones?
A. Normal View
B. Page Layout View
C. Page Break Preview
D. Draft View
**Answer:** B
**Explanation:** "Page Layout View" renders worksheets as physical pages with top/bottom margins, showing real-time headers and footers.

---

### 4. How can you export every worksheet in a workbook into a single compiled PDF file?
A. Print each sheet separately and staple them
B. In File > Export > Create PDF, click Options and select "Entire workbook"
C. Group the sheets and press Ctrl + S
D. Rename the file to .pdf
**Answer:** B
**Explanation:** Selecting "Entire workbook" under Export Options compiles all worksheets sequentially into a single unified PDF document.

---

### 5. What header element code inserts the worksheet tab name dynamically?
A. &[File]
B. &[Tab]
C. &[Sheet]
D. &[Name]
**Answer:** B
**Explanation:** The &[Tab] code dynamically inserts the name of the active worksheet tab into the header or footer.

---
