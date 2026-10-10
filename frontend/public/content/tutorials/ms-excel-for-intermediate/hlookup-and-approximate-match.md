# HLOOKUP Basics & Approximate Match Ranges

While VLOOKUP operates on vertical columns, **HLOOKUP** (Horizontal Lookup) searches horizontally across the **top row** of a table and retrieves data from a specified row below. Additionally, mastering **Approximate Match** ('TRUE' or '1') unlocks tiered calculations like tax brackets, commission tiers, and grading scales.

---

## 1. Anatomy and Usage of HLOOKUP

When data tables are structured horizontally (with headers running along rows rather than down columns), HLOOKUP is used:

```excel
Syntax:
=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
```

```
Horizontal Table Structure:
Row 1 (Lookup Row) : | 2024  | 2025  | 2026  | 2027  |
Row 2 (Revenue)    : | $500K | $620K | $750K | $900K |
Row 3 (Expenses)   : | $320K | $410K | $480K | $550K |
```

To look up '2026' and return 'Expenses' (Row 3):
```excel
=HLOOKUP(2026, $B$1:$E$3, 3, FALSE)
```
*Returns: '$480K'*

---

## 2. When and How to Use Approximate Match (TRUE / 1)

While exact match ('FALSE') looks for identical strings, **Approximate Match** ('TRUE' or '1') finds the closest value that is **less than or equal to** the lookup value.

![Lookup Functions and Approximate Ranges](/images/tutorials/ms-excel/lookup-functions-vlookup-xlookup.svg)

### The Golden Rule of Approximate Match:
> **CRITICAL:** The first column (or row) of your lookup table **MUST BE SORTED IN ASCENDING ORDER** (lowest to highest). If it is not sorted, approximate match will return completely erratic, incorrect results!

### Practical Business Scenario: Sales Commission Tiers
Lookup Table ('G2:H6') - Sorted Ascending:
```
+--------------------+-------------------+
| Sales Threshold    | Commission Rate   |
+--------------------+-------------------+
| $0                 | 0%                |
| $10,000            | 5%                |
| $25,000            | 8%                |
| $50,000            | 12%               |
| $100,000           | 15%               |
+--------------------+-------------------+
```

Formula for an employee who sold **$34,500**:
```excel
=VLOOKUP(34500, $G$2:$H$6, 2, TRUE)
```

### How Excel Resolves This:
1. Excel scans down Column G: 0... 10,000... 25,000... 50,000.
2. 50,000 is greater than 34,500, so Excel steps back to the previous tier: **$25,000**.
3. It moves to Column 2 and returns **8%**!

---

# Multiple Choice Questions

### 1. What is the fundamental operational difference between VLOOKUP and HLOOKUP?
A. VLOOKUP works only on numbers; HLOOKUP works only on text
B. VLOOKUP searches vertically down the first column; HLOOKUP searches horizontally across the first row
C. VLOOKUP requires sorted tables; HLOOKUP does not
D. HLOOKUP is only available on Mac computers
**Answer:** B
**Explanation:** VLOOKUP searches vertically down column 1 of a table, whereas HLOOKUP searches horizontally across row 1 of a table.

---

### 2. What mandatory condition must your lookup table meet when using Approximate Match (TRUE / 1)?
A. The table must have exactly 10 rows
B. The first column (or row) must be sorted in ascending order
C. All values must be capitalized
D. The range must be converted into an Excel Table
**Answer:** B
**Explanation:** For approximate lookups to navigate threshold tiers accurately, the lookup column or row must be sorted in ascending order.

---

### 3. If a commission table has tiers at 0, 1000, 5000, and 10000, what tier will an approximate match VLOOKUP assign to a sales value of 4,200?
A. 0
B. 1000
C. 5000
D. #N/A
**Answer:** B
**Explanation:** Approximate match finds the largest value that is less than or equal to the lookup value. Since 4,200 is between 1,000 and 5,000, it steps back to 1,000.

---

### 4. In '=HLOOKUP("Q3", A1:Z5, 4, FALSE)', what does the number 4 specify?
A. Search in column 4
B. Return the value from the 4th row of the specified table range
C. Repeat the search 4 times
D. Format the answer with 4 decimal places
**Answer:** B
**Explanation:** In HLOOKUP, row_index_num indicates which row of the table array contains the return value.

---

### 5. What value does Excel use for the range_lookup argument if you omit the fourth argument entirely in a VLOOKUP formula?
A. FALSE (0)
B. TRUE (1 - Approximate Match)
C. #ERROR
D. NULL
**Answer:** B
**Explanation:** If omitted, Excel defaults the 4th argument of VLOOKUP and HLOOKUP to TRUE (approximate match).

---
