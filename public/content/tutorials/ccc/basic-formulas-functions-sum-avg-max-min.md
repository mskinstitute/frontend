# Basic Formulas and Functions (फॉर्मूले और बुनियादी फंक्शन्स)

The true magic of spreadsheets lies in automated mathematical computation. A spreadsheet allows you to calculate totals, averages, percentages, and statistical limits instantly across thousands of rows.

---

## 1. The Cardinal Rule: The Equals Sign (=)

> **CRITICAL RULE FOR CCC EXAM:**
> Every single formula or function in LibreOffice Calc and MS Excel **MUST begin with an equals sign (`=`)**!
> If you type `SUM(A1:A5)` without `=`, the spreadsheet will treat it as simple plain text!

---

## 2. Difference Between Formula and Function

- **Formula (फॉर्मूला):** A custom user-defined mathematical expression using operators:
  - *Example:* `=A1 + B1 * 10`
- **Function (फ़ंक्शन):** A pre-defined, built-in formula provided by the spreadsheet software that accepts arguments and returns a calculated result:
  - *Example:* `=SUM(A1:A10)`

---

## 3. The Big 5 Core Functions

### A. SUM() - योग (Total)
Calculates the total sum of all numbers in a range:
```text
=SUM(A1:A10)          --> Adds numbers from cell A1 through A10
=SUM(A1, B1, C1)      --> Adds individual separated cells
```
- **AutoSum Shortcut:** In Calc, press **`Alt + Sigma`** or in Excel press **`Alt + =`** to automatically detect adjacent numbers and insert the SUM formula!

### B. AVERAGE() - औसत (Mean)
Calculates the arithmetic mean by dividing the sum of values by the count of numbers:
```text
=AVERAGE(B1:B5)       --> If values are 10, 20, 30, average is 20
```

### C. MAX() - अधिकतम मान (Highest Value)
Finds the largest numerical value in a range:
```text
=MAX(C1:C100)         --> Finds the highest marks in a class
```

### D. MIN() - न्यूनतम मान (Lowest Value)
Finds the smallest numerical value in a range:
```text
=MIN(C1:C100)         --> Finds the lowest marks in a class
```

### E. COUNT() vs COUNTA()
- **`=COUNT(A1:A10)`:** Counts **ONLY cells containing NUMBERS**. Ignores blank cells and text!
- **`=COUNTA(A1:A10)`:** Counts **ALL non-empty cells** (Numbers + Text labels + Dates).
- **`=COUNTBLANK(A1:A10)`:** Counts only empty/blank cells.

---

## 4. Relative vs Absolute Cell Referencing ($ Sign)

When you copy a formula across rows:
- **Relative Reference (सापेक्ष - e.g. `A1`):** By default, cell addresses change automatically relative to where you copy the formula (e.g. copying `=A1+B1` down to the next row becomes `=A2+B2`).
- **Absolute Reference (स्थिर - e.g. `$A$1`):** Placing a dollar sign (**`$`**) in front of the column letter and row number locks the cell address so it **never changes** when copied!
- **Shortcut Key to Toggle References:** Press **`F4`** (or **`Shift + F4`** in LibreOffice Calc) to cycle between `A1`, `$A$1`, `A$1`, and `$A1`.

---

# Multiple Choice Questions

### 1. With which character must all formulas and functions begin in LibreOffice Calc?
A. `#`
B. `=`
C. `+`
D. `@`
**Answer:** B
**Explanation:** All formulas and functions in spreadsheet software must strictly begin with an equals sign (`=`) to signal to the calculation engine that a mathematical expression follows.

---

### 2. Which function calculates the highest numerical value in a range of cells?
A. `HIGH()`
B. `MAX()`
C. `TOP()`
D. `GREATEST()`
**Answer:** B
**Explanation:** The `MAX()` function scans all numbers in the specified arguments and returns the single largest numerical value.

---

### 3. What is the difference between `COUNT()` and `COUNTA()` in spreadsheets?
A. `COUNT()` counts only text, `COUNTA()` counts numbers
B. `COUNT()` counts only numerical cells, while `COUNTA()` counts all non-empty cells (numbers and text)
C. `COUNT()` is faster than `COUNTA()`
D. There is no difference
**Answer:** B
**Explanation:** `COUNT()` strictly tallies cells containing numbers. `COUNTA()` (Count All) tallies any cell that is not blank, regardless of whether it contains text or numbers.

---

### 4. What symbol is used in spreadsheets to create an Absolute (fixed/locked) cell reference (e.g. `$A$1`)?
A. `%`
B. `$`
C. `&`
D. `*`
**Answer:** B
**Explanation:** The dollar sign (`$`) is the absolute reference operator. It locks the following column or row coordinate so it remains unchanged when copied across formulas.

---

### 5. What is the output of the formula `=SUM(5, 10, 15)`?
A. 30
B. 15
C. 5
D. Error
**Answer:** A
**Explanation:** The `SUM` function adds its arguments: $5 + 10 + 15 = 30$.

---