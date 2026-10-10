# Removing Duplicates and Cleaning Invisible Spaces

Data integrity is the foundation of dependable analysis. Imported datasets frequently contain redundant identical transactions, trailing spaces, and non-breaking web spaces (ASCII 160) that cause lookups and Pivot Tables to produce erroneous results. Mastering Excel’s advanced deduplication and cleaning routines ensures pristine data pipelines.

---

## 1. The Remove Duplicates Feature

Excel provides a native deduplication engine on the **Data** tab:
1. Click any cell inside your dataset.
2. Go to **Data > Data Tools group > Remove Duplicates**.
3. In the dialog box:
   * Ensure **My data has headers** is checked.
   * **Selecting Key Columns:**
     * To remove completely identical rows, leave **all columns checked**.
     * To deduplicate by a unique identifier (e.g., ensure each Customer ID appears only once regardless of other fields), uncheck all columns and check **only Customer ID**.
4. Click **OK**.
5. Excel displays a confirmation summary: *"14 duplicate values found and removed; 486 unique values remain."*

![Data Cleaning and Deduplication](/images/tutorials/ms-excel/sorting-filtering-tables.svg)

---

## 2. Eradicating Invisible Spaces: TRIM and CLEAN

One of the most insidious errors in Excel occurs when values appear identical on screen, but '=A2=B2' evaluates to **FALSE**:
* **Trailing Spaces:** Accidental keyboard spaces at the end of text strings (e.g., '"Admin "').
* **Non-Breaking Spaces (ASCII 160):** Created when copying text from websites or web applications. Standard '=TRIM()' cannot remove ASCII 160 characters!

### The Industrial-Grade Cleaning Formula:
```excel
=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))
```

### Breakdown of the Formula:
1. **SUBSTITUTE(A2, CHAR(160), " "):** Replaces all stubborn non-breaking web spaces with standard keyboard spaces.
2. **CLEAN(...):** Strips all 32 non-printable ASCII system control characters (line breaks, carriage returns).
3. **TRIM(...):** Strips all leading and trailing spaces and collapses consecutive internal spaces to one.

---

## 3. Dynamic Deduplication with UNIQUE

If you must preserve the original historical records untouched while generating a clean list for reporting:
```excel
=UNIQUE(SourceTable[CustomerID])
```
*Unlike the destructive Remove Duplicates tool, the UNIQUE dynamic array function creates an independent live list that updates automatically as new records arrive!*

---

# Multiple Choice Questions

### 1. What does the native 'Remove Duplicates' tool do when only the 'Email' column is checked in a 5-column table?
A. It deletes only the email text while keeping the other 4 columns
B. It permanently deletes entire rows where the Email address is duplicated, keeping only the first occurrence
C. It sorts the emails alphabetically
D. It colors duplicate emails red
**Answer:** B
**Explanation:** Excel removes complete rows based on uniqueness in the selected columns; choosing only Email ensures each email appears once across the entire table.

---

### 2. Why does standard '=TRIM()' sometimes fail to remove trailing spaces from data copied from websites?
A. Web spaces are often non-breaking spaces (ASCII 160), which TRIM does not recognize as standard spaces (ASCII 32)
B. Web data is read-only
C. TRIM only works on numbers
D. Excel requires an active internet connection to trim web data
**Answer:** A
**Explanation:** Websites commonly utilize non-breaking spaces (HTML &nbsp; or ASCII 160); standard TRIM only removes standard ASCII 32 keyboard spaces.

---

### 3. Which function removes line breaks and non-printable computer control characters (ASCII 0-31) from text?
A. TRIM
B. CLEAN
C. PURGE
D. ERASE
**Answer:** B
**Explanation:** The CLEAN function strips all 32 non-printable control characters from text strings.

---

### 4. Which formula replaces web non-breaking spaces (CHAR 160) with standard spaces so that TRIM can process them?
A. =SUBSTITUTE(A2, CHAR(160), " ")
B. =REPLACE(A2, 160, 32)
C. =CONVERT(A2, "WEB", "EXCEL")
D. =FIX(A2, 160)
**Answer:** A
**Explanation:** Using SUBSTITUTE(A2, CHAR(160), " ") converts non-breaking space characters into standard space characters.

---

### 5. What is the key operational difference between the 'Remove Duplicates' ribbon button and the '=UNIQUE()' function?
A. Remove Duplicates is destructive and permanently modifies source data; UNIQUE creates a non-destructive dynamic array in a new location
B. UNIQUE only works on numbers
C. Remove Duplicates cannot handle text
D. There is no difference
**Answer:** A
**Explanation:** The Remove Duplicates command permanently alters existing cells in place, whereas UNIQUE generates a separate, dynamically updating spilled output.

---
