# Editing, Formatting Cells, Rows, and Columns (सेल, रो और कॉलम फ़ॉर्मेटिंग)

Raw numerical data in a spreadsheet can look dull and confusing without proper formatting. Cell formatting enables you to adjust row heights, widen column borders, wrap long text, format currency symbols (₹), and apply background colors to header rows.

---

## 1. Adjusting Row Height and Column Width

When numbers or text are too wide for a cell:
- **Number Overflow (### Error):** If a cell displays **`###`**, it does **NOT** mean a mathematical error! It simply means **the column is too narrow to display the complete number**.
  - *Fix:* Double-click the dividing boundary line between the column headers (e.g. between column `B` and `C`) to **AutoFit** the column width!
- **Text Overflow:** If text is too long, it overflows into adjacent empty cells.

### Manual Resizing:
- Hover your mouse over the line separating two row or column headers until the cursor turns into a double-headed arrow ($leftrightarrow$ or $\updownarrow$), then click and drag.

---

## 2. Text Wrapping and Merging Cells

1. **Wrap Text (टेक्स्ट रैप करें):**
   - Forces long text strings to wrap onto multiple lines within the same cell, automatically increasing the row height.
   - In LibreOffice Calc: **Format menu $\implies$ Cells $\implies$ Alignment tab $\implies$ Check "Wrap text automatically"**.
   - Shortcut in Excel/Calc to insert a manual line break inside a cell: **`Alt + Enter`**!
2. **Merge & Center (मर्ज और सेंटर):**
   - Combines multiple adjacent cells into one large cell and centers the text heading horizontally.
   - Extensively used for creating main report titles (e.g. merging cells `A1:G1` for *"MSK INSTITUTE STUDENT MARKSHEET 2026"*).

---

## 3. Formatting Numbers, Dates, and Currency

Numbers should reflect their real-world meaning:
- **Currency (मुद्रा):** Formats numbers with the Rupee symbol (`₹`) and two decimal places (e.g. `₹ 12,500.00`).
  - Shortcut: **`Ctrl + Shift + 4`** (or `Ctrl + Shift + $`).
- **Percentage (प्रतिशत):** Multiplies the cell value by 100 and appends a `%` sign (e.g. `0.85` becomes `85%`).
  - Shortcut: **`Ctrl + Shift + 5`** (or `Ctrl + Shift + %`).
- **Date Format:** Converts raw numbers into calendar dates (e.g. `13/09/2026`).
  - Shortcut: **`Ctrl + Shift + 3`** (or `Ctrl + Shift + #`).

---

## 4. Inserting and Deleting Rows/Columns

- **Insert Row:** Right-click a row number $\implies$ select **Insert Rows Above / Below**.
- **Delete Row/Column:** Select row or column $\implies$ press **`Ctrl + -`** (Minus).
- **Shortcut to Insert Row/Column:** **`Ctrl + +`** (Plus).

---

# Multiple Choice Questions

### 1. What does a cell displaying `###` in LibreOffice Calc or MS Excel indicate?
A. Formula division by zero error
B. The column width is too narrow to display the complete number
C. The cell contains corrupted virus data
D. Negative numbers are not allowed
**Answer:** B
**Explanation:** When a column is too narrow to display a formatted number or date, the spreadsheet displays `###`. Widening the column resolves the display immediately.

---

### 2. Which keyboard shortcut inserts a manual line break within the same cell in a spreadsheet?
A. `Enter`
B. `Shift + Enter`
C. `Alt + Enter`
D. `Ctrl + Enter`
**Answer:** C
**Explanation:** Pressing `Alt + Enter` inside a cell creates a new line break within that specific cell, allowing multi-line text entries.

---

### 3. Which feature combines multiple adjacent selected cells into a single unified cell?
A. AutoSum
B. Merge Cells
C. Wrap Text
D. Split Screen
**Answer:** B
**Explanation:** Merge Cells combines selected contiguous cells into a single larger cell, commonly used for top titles and group banners.

---

### 4. What is the keyboard shortcut to format a cell number as Currency (₹ / $)?
A. `Ctrl + Shift + 1`
B. `Ctrl + Shift + 4`
C. `Ctrl + Shift + 5`
D. `Ctrl + F4`
**Answer:** B
**Explanation:** `Ctrl + Shift + 4` (the `$` key on standard US keyboards) applies standard Currency formatting with currency symbol and 2 decimal places.

---

### 5. What happens when you select a column and press `Ctrl + -` (Minus)?
A. The column width decreases by 10%
B. The selected column is deleted
C. Negative numbers are multiplied by -1
D. A new column is inserted
**Answer:** B
**Explanation:** In spreadsheets, `Ctrl + -` is the universal shortcut to delete the currently selected rows, columns, or cell ranges.

---