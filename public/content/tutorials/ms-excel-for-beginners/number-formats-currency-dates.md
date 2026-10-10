# Number Formats (Currency, Percentage, Dates)

Number formatting changes **how a number looks visually** without altering its underlying numerical value. A cell displaying `$1,500.00`, `150000%`, or `1.50E+03` may contain the exact same underlying raw number `1500`. Applying correct number formatting ensures financial clarity and avoids misleading rounding errors.

---

## The Number Formatting Group on the Home Tab

The **Home** tab houses one-click formatting buttons:
- **Number Format Dropdown**: Select between General, Number, Currency, Accounting, Short Date, Long Date, Time, Percentage, Fraction, and Text.
- **Accounting Number Format (`$`)**: Formats as monetary currency.
- **Percent Style (`%`) (`Ctrl + Shift + %`)**: Multiplies the cell value by 100 and displays a percent sign (e.g., `0.25` displays as `25%`).
- **Comma Style (`,`)**: Inserts thousands commas (e.g., `14500` becomes `14,500.00`).
- **Increase / Decrease Decimals**: Adds or removes visible decimal precision points.

---

## Currency vs. Accounting: The Vital Distinction

Both formats display monetary currency, but their layout differences are significant:

| Feature | Currency Format | Accounting Format |
| :--- | :--- | :--- |
| **Currency Symbol Placement** | Sits immediately adjacent to the first digit (e.g., `$1,250.00`). | Aligns flush to the far **left edge** of the cell, leaving digits aligned to the right. |
| **Negative Numbers** | Displayed with a minus sign `-$100.00` or colored red. | Enclosed cleanly in accounting parentheses `$ (100.00)`. |
| **Zero Values** | Displays as `$0.00`. | Displays cleanly as a **dash (`$   -`)**, uncluttering financial statements! |
| **Decimal Point Alignment** | Variable if symbol is close. | Decimal points align mathematically down the entire column. |

---

## Percentage Formatting Mechanics

Remember how Excel calculates percentages:
- Typing **`50%`** into a cell stores the decimal value **`0.5`** internally.
- If a cell already contains the number **`50`**, and you click the **`%`** button, Excel multiplies by 100, resulting in **`5000%`**!
- *Best Practice*: When calculating profit margins, enter formulas as `=Profit/Revenue`, and then click the Percent Style button to format the resulting decimal.

---

## Custom Number Formatting Codes (`Ctrl + 1 > Custom`)

Excel allows custom format strings divided into 4 semicolon-separated sections:
```
Positive_Format ; Negative_Format ; Zero_Format ; Text_Format
```
- **Examples**:
  - `$#,##0.00;($#,##0.00);"-";@` (Standard corporate accounting)
  - `[Green]+#,##0;[Red]-#,##0;"Zero"` (Colors positive numbers green and negatives red)
  - `000-00-0000` (Formats 9 digits as a Social Security number)
  - `"USD " #,##0.00` (Prefixes custom currency labels)

# Multiple Choice Questions

### 1. What is the primary difference between Currency format and Accounting format in Excel?
A. Currency only works in US Dollars; Accounting works in all currencies
B. Accounting aligns the currency symbol to the far-left edge of the cell and displays zero values as a clean dash (-)
C. Currency cannot display decimal points
D. Accounting cannot handle negative numbers
**Answer:** B
**Explanation:** Accounting format aligns currency symbols to the far left, mathematical decimals to the right, and renders zeroes as clean horizontal dashes.

---

### 2. If a cell contains the raw decimal number 0.085, how will it appear after applying the Percentage format with 1 decimal place?
A. 0.085%
B. 8.5%
C. 85%
D. 0.1%
**Answer:** B
**Explanation:** Percentage formatting multiplies the underlying numerical value by 100 and appends a percent sign, converting 0.085 into 8.5%.

---

### 3. Which keyboard shortcut instantly applies the Currency format ($#,##0.00) to selected cells?
A. Ctrl + Shift + $ (Ctrl + Shift + 4)
B. Alt + C
C. Ctrl + Shift + %
D. Ctrl + M
**Answer:** A
**Explanation:** Ctrl + Shift + $ (number 4 key on US keyboards) instantly formats the selected cells in Currency format with two decimal places.

---

### 4. In custom number formatting, what do the four semicolon-delimited sections control in sequence?
A. Top; Bottom; Left; Right
B. Positive; Negative; Zero; Text
C. Font; Color; Size; Border
D. Currency; Date; Time; Percentage
**Answer:** B
**Explanation:** Custom format codes follow the universal order: Positive; Negative; Zero; Text.

---

### 5. Why do cells sometimes display a series of hash symbols (e.g., "######") instead of the formatted number?
A. The formula produced a divide-by-zero error
B. The column is too narrow to display the formatted number or date
C. The worksheet is password encrypted
D. The numbers are negative
**Answer:** B
**Explanation:** A series of hash marks indicates that the column width is too narrow to display the full formatted number or date; expanding column width resolves it immediately.

---
