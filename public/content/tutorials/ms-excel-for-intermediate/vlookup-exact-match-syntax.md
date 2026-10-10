# VLOOKUP Basics (Exact Match & Syntax)

**VLOOKUP** (Vertical Lookup) is one of the most widely used functions in business spreadsheets. It searches for a specific search key down the **first column** of a table and retrieves data from a corresponding column in the same row.

---

## 1. Anatomy of the VLOOKUP Formula

Every VLOOKUP statement requires four distinct arguments:

```excel
Syntax:
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

```
+-------------------+-------------------------------------------------------------+
| Argument          | Purpose & Practical Role                                    |
+-------------------+-------------------------------------------------------------+
| lookup_value      | What you are searching for (e.g., EmpID cell "A2").        |
| table_array       | The table range to search (e.g., $E$2:$H$100).              |
| col_index_num     | The column number in table_array from which to return data. |
| [range_lookup]    | FALSE (or 0) for EXACT match; TRUE (or 1) for APPROXIMATE. |
+-------------------+-------------------------------------------------------------+
```

![VLOOKUP and Lookup Functions Architecture](/images/tutorials/ms-excel/lookup-functions-vlookup-xlookup.svg)

---

## 2. Step-by-Step Practical Example

Suppose you have an Employee Directory in 'E2:H50':
* Column E (Col 1): Employee ID (e.g., 'EMP-104')
* Column F (Col 2): Full Name
* Column G (Col 3): Department
* Column H (Col 4): Salary

In an invoice or timesheet sheet, cell **A2** contains 'EMP-104'. To pull the matching **Department**:
```excel
=VLOOKUP(A2, $E$2:$H$50, 3, FALSE)
```

### Explanation of Execution:
1. Excel takes 'EMP-104' from **A2**.
2. It navigates to the first column (Column E) of '$E$2:$H$50'.
3. It scans downward until it finds an exact match for 'EMP-104'.
4. It shifts across to Column 3 of the range (Column G, Department).
5. It returns the department value (e.g., 'Finance').

---

## 3. The 3 Golden Rules of VLOOKUP

1. **The Lookup Column Must Be First (Leftmost):** VLOOKUP cannot look to its left. Your search key (e.g., EmpID) must reside in the leftmost column of 'table_array'.
2. **Lock Your Table Array with Dollar Signs ($):** Always use '$E$2:$H$50' instead of 'E2:H50'. If you forget '$', dragging the formula down shifts the search range into blank cells below!
3. **Always Set Range Lookup to FALSE (0):** For 99% of business lookups (IDs, SKUs, names, codes), always specify **FALSE** (or 0) to ensure exact matching. If omitted, Excel defaults to TRUE (approximate match), which can return incorrect values from unsorted data!

---

# Multiple Choice Questions

### 1. What does the number 3 represent in '=VLOOKUP(A2, $D$2:$G$100, 3, FALSE)'?
A. Look through the first 3 rows only
B. Return the value from the 3rd column of the table range (Column F)
C. Search for 3 consecutive matches
D. Set the font size to 3
**Answer:** B
**Explanation:** The 3rd argument (col_index_num) specifies which column of the table range to return data from (where column 1 is D, column 2 is E, and column 3 is F).

---

### 2. Why is it essential to set the 4th argument of VLOOKUP to FALSE (or 0) when looking up employee IDs or product SKUs?
A. FALSE makes the calculation run faster
B. FALSE enforces an EXACT match, preventing incorrect approximate matches on unsorted lists
C. FALSE converts numbers into text strings
D. FALSE allows searching from right to left
**Answer:** B
**Explanation:** Setting range_lookup to FALSE (or 0) forces VLOOKUP to require an exact match; without it, Excel defaults to TRUE, which requires sorted data and can return incorrect values.

---

### 3. What critical limitation exists in traditional VLOOKUP?
A. It cannot look to the left of the lookup column
B. It can only return numbers, never text
C. It only works on tables with fewer than 100 rows
D. It cannot be dragged down
**Answer:** A
**Explanation:** VLOOKUP requires the lookup key to be in the very first (leftmost) column of the lookup range; it cannot retrieve columns to the left of the lookup key.

---

### 4. What error does VLOOKUP return if the lookup_value cannot be found in the first column of the table array when using FALSE?
A. #REF!
B. #VALUE!
C. #N/A
D. #NULL!
**Answer:** C
**Explanation:** #N/A stands for 'Not Available' and is returned by VLOOKUP when an exact match for the lookup value cannot be located.

---

### 5. Why should you use '$B$2:$E$100' instead of 'B2:E100' for the table_array argument?
A. To convert the table into a chart
B. To lock the table coordinates so they do not shift downward when copying the formula to other rows
C. To enable cloud synchronization
D. To sort the table automatically
**Answer:** B
**Explanation:** Absolute references ($) ensure the search table boundaries remain fixed when the formula is dragged down across multiple rows.

---
