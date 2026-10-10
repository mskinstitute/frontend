# Basic Text Functions (CONCATENATE, UPPER, LOWER)

Spreadsheets frequently contain text data—names, email addresses, department codes, and product SKUs—that arrive poorly formatted or fragmented. Excel's text functions allow you to join strings, adjust letter casing, and clean messy imports.

---

## Joining Text: The Ampersand Operator ('&') vs. CONCAT

Combining text from separate cells (e.g., merging First Name in A2 and Last Name in B2 into a Full Name):

### The Ampersand ('&') Operator (The Industry Standard)
The ampersand symbol acts as a text glue operator:
```excel
=A2 & " " & B2
```
- If `A2` is "Sarah" and `B2` is "Jenkins", the formula evaluates to `"Sarah Jenkins"`.
- *Notice*: You must include `" "` (space enclosed in quotation marks) between the ampersands; otherwise, Excel will produce `"SarahJenkins"`!

### The CONCAT & TEXTJOIN Functions
- **CONCAT**: Replaced legacy `CONCATENATE` in modern Excel:
  ```excel
  =CONCAT(A2, " ", B2)
  ```
- **TEXTJOIN**: The modern powerhouse function! Joins an entire range of cells using a designated delimiter and automatically ignores blank cells:
  ```excel
  =TEXTJOIN(", ", TRUE, A2:A10)
  ```
  Produces a clean, comma-separated list in a single cell!

---

## Changing Text Casing

Unlike Microsoft Word, Excel does not have a "Change Case" button on the Ribbon. You must use functions:
- **UPPER**: Converts all letters to UPPERCASE.
  ```excel
  =UPPER("california")  ➔  "CALIFORNIA"
  ```
- **LOWER**: Converts all letters to lowercase (perfect for generating standard email addresses).
  ```excel
  =LOWER("John.Smith@COMPANY.com")  ➔  "john.smith@company.com"
  ```
- **PROPER**: Capitalizes the first letter of every word while making all other letters lowercase (Title Case).
  ```excel
  =PROPER("mIChAel cHeN")  ➔  "Michael Chen"
  ```

---

## Removing Unwanted Spaces: The TRIM Function

Imported database data frequently contains invisible trailing or leading spaces that break lookup formulas:
```excel
=TRIM(A2)
```
- Removes all leading and trailing spaces, and reduces multiple consecutive spaces between words down to a single space.

# Multiple Choice Questions

### 1. Which formula correctly merges the First Name in cell A2 and the Last Name in cell B2 with a space between them?
A. =A2 + B2
B. =A2 & " " & B2
C. =JOIN(A2, B2)
D. =A2 & B2
**Answer:** B
**Explanation:** The ampersand (&) concatenates text strings, and " " inserts the necessary literal space between the two cell values.

---

### 2. Which Excel text function converts messy mixed-case names (such as "jOhN dOE") into properly capitalized title case ("John Doe")?
A. CAPITALIZE
B. TITLECASE
C. PROPER
D. UPPER
**Answer:** C
**Explanation:** The PROPER function converts the first letter of each word to uppercase and all subsequent letters to lowercase.

---

### 3. What does the TRIM function do in Microsoft Excel?
A. Cuts the length of numbers in half
B. Removes all leading and trailing spaces from text, and normalizes internal spaces
C. Deletes the entire column
D. Formats text in italics
**Answer:** B
**Explanation:** TRIM purges irregular extra spaces from text strings, leaving only single spaces between words, which is essential for data cleaning.

---

### 4. Which modern function can merge a range of 20 cells into a single comma-separated list while automatically skipping empty cells?
A. CONCATENATE
B. TEXTJOIN
C. SUMTEXT
D. STRINGMERGE
**Answer:** B
**Explanation:** TEXTJOIN accepts a delimiter (such as ", ") and an argument to ignore empty cells, making it ideal for compiling lists.

---

### 5. What does the formula =LOWER("EXCEL 2026") return?
A. "Excel 2026"
B. "excel 2026"
C. "EXCEL 2026"
D. 2026
**Answer:** B
**Explanation:** The LOWER function converts all alphabetical characters in a text string to lowercase.

---
