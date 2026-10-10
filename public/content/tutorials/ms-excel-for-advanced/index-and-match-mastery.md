# INDEX & MATCH for Dynamic 2-Way Lookups

For decades, **INDEX and MATCH** has been the gold standard combination for advanced Excel modelers. Unlike VLOOKUP, INDEX and MATCH is immune to inserted or deleted columns, can look to the left, consumes significantly less memory on large datasets, and performs dynamic two-way matrix lookups across rows and columns simultaneously.

---

## 1. Understanding INDEX and MATCH Individually

Rather than relying on one monolithic function, this technique combines two specialized tools:

```
+-----------------------------------------------------------------------------------+
| 1. The INDEX Function:                                                            |
| Returns the value at a specific coordinate inside a range.                        |
| Syntax: =INDEX(array, row_num, [col_num])                                         |
| Example: =INDEX(B2:B100, 5) -> Returns the 5th item in column B.                  |
+-----------------------------------------------------------------------------------+
| 2. The MATCH Function:                                                            |
| Searches for a value and returns its relative POSITION number.                   |
| Syntax: =MATCH(lookup_value, lookup_array, [match_type])                          |
| Example: =MATCH("Rajesh", A2:A100, 0) -> Returns 5 (if Rajesh is on row 5).      |
+-----------------------------------------------------------------------------------+
```

![INDEX and MATCH vs VLOOKUP](/images/tutorials/ms-excel/lookup-functions-vlookup-xlookup.svg)

---

## 2. Combining Them for Dynamic Left Lookups

Suppose you need to look up an **Employee ID** in Column **C**, but return their **Full Name** which is in Column **A** (to the left!). VLOOKUP cannot do this, but INDEX/MATCH does it effortlessly:

```excel
=INDEX($A$2:$A$100, MATCH(E2, $C$2:$C$100, 0))
```

### Step-by-Step Mechanical Execution:
1. 'MATCH(E2, $C$2:$C$100, 0)' scans down column C, finds the target ID, and returns position **14**.
2. The formula becomes '=INDEX($A$2:$A$100, 14)'.
3. INDEX fetches the value from the 14th cell of Column A and returns the employee's name!

---

## 3. Two-Way Matrix Lookups (Row and Column Intersection)

What if you have a matrix table where products are in rows and monthly shipping zones are across columns?

```
Two-Way Lookup Table Grid (A1:E10):
            | Zone 1 (Col B) | Zone 2 (Col C) | Zone 3 (Col D) | Zone 4 (Col E) |
+-----------+----------------+----------------+----------------+----------------+
| Product A | $15            | $25            | $35            | $50            |
| Product B | $30            | $40            | $60            | $85            |
+-----------+----------------+----------------+----------------+----------------+
```

To look up 'Product B' in Row and 'Zone 3' in Column:
```excel
=INDEX($B$2:$E$10, MATCH("Product B", $A$2:$A$10, 0), MATCH("Zone 3", $B$1:$E$1, 0))
```

*How it works:*
* The first MATCH finds the vertical row coordinate (Row 2).
* The second MATCH finds the horizontal column coordinate (Column 3).
* INDEX returns the exact cell intersection: **$60**!

---

# Multiple Choice Questions

### 1. What does the MATCH function return when searching for a value in a list?
A. The actual text or number found in the cell
B. The relative position (index number) of the item within the searched range
C. A boolean TRUE or FALSE
D. The memory address of the RAM
**Answer:** B
**Explanation:** MATCH returns the relative sequential position (e.g., 1, 2, 5, 14) of the lookup value within the specified single-row or single-column array.

---

### 2. How does INDEX and MATCH overcome VLOOKUP's most severe limitation?
A. It can retrieve values from columns located to the left of the lookup column
B. It eliminates the need for formulas
C. It only works on dates
D. It prevents users from printing the sheet
**Answer:** A
**Explanation:** Because the return range (in INDEX) and lookup range (in MATCH) are decoupled, INDEX can easily fetch data from columns to the left of the lookup range.

---

### 3. What does setting the 3rd argument of MATCH to 0 signify?
A. Return 0 if not found
B. Perform an EXACT match search
C. Perform an approximate match on descending data
D. Search from bottom to top
**Answer:** B
**Explanation:** A match_type of 0 instructs the MATCH function to find the first exact match for the lookup value.

---

### 4. What happens to a VLOOKUP formula with column index 4 if a user inserts a new column between columns 2 and 3?
A. VLOOKUP adjusts automatically
B. VLOOKUP continues pulling from column index 4, which now contains the wrong data
C. VLOOKUP turns into a chart
D. Excel displays an alert
**Answer:** B
**Explanation:** VLOOKUP hardcodes static column index integers; inserting a column shifts underlying fields and causes VLOOKUP to retrieve data from the wrong column.

---

### 5. In a two-way matrix lookup, what do the second and third arguments of '=INDEX(array, row_num, col_num)' represent?
A. Font size and row height
B. The row coordinate returned by the first MATCH, and the column coordinate returned by the second MATCH
C. The date and time
D. The page number and sheet index
**Answer:** B
**Explanation:** In a two-way lookup, the first MATCH provides the row coordinate and the second MATCH provides the column coordinate to pinpoint the intersecting cell.

---
