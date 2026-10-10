# Advanced Text to Columns (Delimited and Fixed Width)

Exported mainframe files, CSV logs, and banking statements often arrive as concatenated strings crammed into a single column. **Text to Columns** parses these strings into structured tabular columns using custom delimiters or fixed character positions.

---

## 1. Delimited vs. Fixed Width

```
+-----------------------------------+-----------------------------------+
| Delimited Parsing                 | Fixed Width Parsing               |
+-----------------------------------+-----------------------------------+
| Fields are separated by specific  | Fields align at consistent        |
| characters: commas, tabs, pipes   | character counts (e.g., chars 1-10|
| (|), or semicolons.               | is ID, chars 11-30 is Name).      |
+-----------------------------------+-----------------------------------+
```

![Text to Columns and Data Formatting](/images/tutorials/ms-excel/sorting-filtering-tables.svg)

---

## 2. Step-by-Step: Delimited Parsing

1. Select the single column containing your combined data (e.g., 'A2:A500').
2. Go to **Data > Data Tools > Text to Columns**.
3. **Step 1 of 3:** Choose **Delimited** > Click **Next**.
4. **Step 2 of 3 (Delimiters):**
   * Check **Comma**, **Tab**, or check **Other** and type custom delimiters like pipe (`|`) or hash (`#`).
   * Check **Treat consecutive delimiters as one** (prevents empty blank columns when multiple spaces separate words).
5. **Step 3 of 3 (Column Data Formats):**
   * Highlight each preview column to set its specific data format:
     * **Text:** Critical for Employee IDs, Zip Codes, and phone numbers with leading zeros (e.g., "00451")! If left as "General", Excel converts "00451" into the number "451", destroying the leading zeros!
     * **Date:** Select format matching incoming data (e.g., **DMY** or **MDY**).
     * **Do not import column (skip):** Excludes unwanted fields from being pasted.
   * **Destination:** Select '$B$2' so your original raw Column A remains intact as a backup!
6. Click **Finish**.

---

## 3. Fixed Width Parsing

When data originates from legacy mainframe COBOL systems without delimiters:
1. Select **Fixed width** in Step 1.
2. In Step 2, Excel displays a visual ruler.
3. Click the ruler to insert break lines with arrows.
4. Drag break lines to adjust column widths, or double-click a line to remove it.
5. Click **Finish**.

---

## 4. Secret Pro Tip: Rapid Date Format Conversion

Did you import dates formatted as text (e.g., "2026.11.25" or "25-10-2026") that Excel fails to recognize as valid dates?
1. Select the column.
2. Open **Text to Columns**.
3. Click **Next**, then **Next** to jump directly to **Step 3**.
4. Select **Date** and pick the source format (e.g., **YMD**).
5. Click **Finish**.
*Excel instantly converts all text strings into true, mathematical Excel serial dates without breaking them into columns!*

---

# Multiple Choice Questions

### 1. Where on the Ribbon is the Text to Columns tool located?
A. Home tab > Cells
B. Data tab > Data Tools group
C. Formulas tab > Defined Names
D. Review tab > Language
**Answer:** B
**Explanation:** Text to Columns is located in the Data Tools group on the Data tab.

---

### 2. What happens if you parse a column containing leading-zero postal codes (e.g., "01234") and leave the column format as 'General'?
A. Excel preserves the zeros
B. Excel treats the values as numbers and strips off the leading zeros, leaving "1234"
C. Excel returns an error
D. The postal codes are deleted
**Answer:** B
**Explanation:** The General format automatically interprets digit strings as numbers, discarding non-significant leading zeros. Setting the column format to 'Text' in Step 3 preserves leading zeros.

---

### 3. What does checking 'Treat consecutive delimiters as one' do during delimited parsing?
A. Combines all columns into one
B. Treats multiple back-to-back delimiters (such as multiple spaces) as a single separator, avoiding blank interstitial columns
C. Deletes punctuation
D. Formats text in uppercase
**Answer:** B
**Explanation:** Treating consecutive delimiters as one ensures that repeated spaces or commas do not generate unwanted empty columns.

---

### 4. How can you ensure that Text to Columns does not overwrite your original source data column?
A. Save the file as a PDF
B. Change the 'Destination' cell address in Step 3 to an adjacent empty column (e.g., $B$2)
C. Close Excel
D. Turn off AutoSave
**Answer:** B
**Explanation:** Setting the Destination address to an empty adjacent column preserves the original raw text column while placing parsed results into new columns.

---

### 5. How can Text to Columns be used to repair a column of stubborn text dates without splitting them?
A. Select Fixed Width, delete all break lines, set Step 3 to Date with the source format, and click Finish
B. Change the font to Arial
C. Multiply by zero
D. Use the SPELLCHECK function
**Answer:** A
**Explanation:** Skipping delimiter splits and designating the column as Date in Step 3 instructs Excel's conversion engine to re-parse and coerce the text into authentic serial dates.

---
