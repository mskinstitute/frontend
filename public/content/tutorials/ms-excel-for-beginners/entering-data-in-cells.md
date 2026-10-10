# Entering Data in Cells

Excel is capable of handling millions of data points, but computational reliability depends entirely on clean, accurate data entry. Understanding how Excel identifies, classifies, and automatically detects data types prevents calculation errors and unexpected formula behaviors.

---

## The Four Fundamental Data Types in Excel

Whenever you type into a cell, Excel automatically evaluates the input and classifies it into one of four core data types:

### 1. Text (Labels)
- Contains letters, words, codes, or alphanumeric combinations (e.g., `Acme Corp`, `INV-2026`, `N/A`).
- **Default Alignment**: Aligns to the **LEFT** side of the cell.
- Cannot be used in mathematical calculations directly.

### 2. Numbers (Values)
- Contains digits, decimals, currency indicators, and negatives (e.g., `450`, `19.99`, `-42`, `1500000`).
- **Default Alignment**: Aligns to the **RIGHT** side of the cell.
- Used in mathematical equations and statistical functions.
- *Visual Rule*: If a number is aligned to the left, Excel has mistakenly treated it as text (often caused by leading apostrophes or import errors)!

### 3. Dates and Times
- Dates entered in recognized formats (e.g., `09/15/2026`, `15-Sep-2026`, `2:30 PM`).
- **Default Alignment**: Aligns to the **RIGHT** side of the cell.
- *Under the Hood*: In Excel, **dates are stored as sequential serial numbers**! Day 1 is `January 1, 1900`. Today's date is simply a number around `46,000`. Because dates are numbers, you can subtract two dates to calculate elapsed days!

### 4. Logical (Booleans)
- Exactly two values: `TRUE` or `FALSE`.
- **Default Alignment**: Automatically centered and capitalized in the cell.
- Produced by logical comparison operators (`=`, `>`, `<`, `<=`, `>=`, `<>`).

---

## Data Entry Shortcuts & Techniques

- **Entering Multiline Text within a Single Cell**:
  - Pressing Enter inside a cell finishes data entry and drops to the cell below.
  - To create a line break inside the *same* cell, press **`Alt + Enter`**!
- **Today's Date Shortcut**: Press **`Ctrl + ; `** (semicolon) to insert the current system date as a static timestamp.
- **Current Time Shortcut**: Press **`Ctrl + Shift + ; `** (or `Ctrl + :`) to insert the current system time.
- **Forcing Numbers to be Treated as Text**: Type an apostrophe (`'`) as the first character (e.g., `'01234`). The apostrophe is invisible on the worksheet, preserves leading zeros, and treats the digits as a text string (essential for ZIP codes and telephone numbers).
- **Filling the Same Value across Multiple Selected Cells**: Highlight 20 cells, type your text or number, and press **`Ctrl + Enter`**! The value populates every selected cell simultaneously.

# Multiple Choice Questions

### 1. How does Microsoft Excel align text and numbers by default within a cell?
A. Text aligns to the right; Numbers align to the left
B. Text aligns to the left; Numbers align to the right
C. Both text and numbers center automatically
D. Everything aligns to the left
**Answer:** B
**Explanation:** By default, text strings align to the left margin, whereas numeric values, dates, and times align to the right margin of the cell.

---

### 2. Which keyboard shortcut inserts a line break inside a single cell without advancing to the cell below?
A. Shift + Enter
B. Alt + Enter
C. Ctrl + Enter
D. Tab + Enter
**Answer:** B
**Explanation:** Pressing Alt + Enter inserts a manual line wrap within the active cell, enabling multiline addresses and headers within a single cell.

---

### 3. How does Excel store dates internally beneath the surface?
A. As static picture files
B. As sequential serial numbers starting with January 1, 1900 as number 1
C. As plain text strings
D. In Roman numerals
**Answer:** B
**Explanation:** Excel stores all dates as sequential integers starting from January 1, 1900 (=1), allowing dates to be added, subtracted, and compared mathematically.

---

### 4. How can you prevent Excel from stripping leading zeros when typing numeric strings like postal codes (e.g., "00542")?
A. Change the font color to green
B. Type an apostrophe (') before the number (e.g., '00542)
C. Add three spaces
D. Enclose the digits in quotation marks
**Answer:** B
**Explanation:** A leading apostrophe instructs Excel to treat following digits strictly as text, preserving leading zeros without altering cell size.

---

### 5. Which shortcut inserts the current computer system date as a static value into a cell?
A. Ctrl + ; (semicolon)
B. Ctrl + Shift + ;
C. Alt + D
D. F9
**Answer:** A
**Explanation:** Ctrl + ; stamps the current date into the cell, while Ctrl + Shift + ; stamps the current system time.

---
