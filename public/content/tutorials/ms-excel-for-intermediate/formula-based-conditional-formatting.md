# Using Custom Formulas in Conditional Formatting

While preset conditional formatting rules inspect each cell individually, **Formula-Based Conditional Formatting** unlocks total analytical freedom. By writing a formula that evaluates to **TRUE** or **FALSE**, you can highlight entire rows, cross-reference external cells, check multi-criteria conditions, and highlight weekend dates automatically.

---

## 1. The Core Rule: Formulas Must Evaluate to TRUE or FALSE

When you choose **Use a formula to determine which cells to format**, Excel tests each cell against your expression. If the expression returns **TRUE** (or any non-zero number), the format is applied; if it returns **FALSE** (or 0), formatting is skipped.

![Conditional Formatting Rules Engine](/images/tutorials/ms-excel/conditional-formatting-rules.svg)

---

## 2. Highlighting an Entire Row Based on One Column's Value

The most requested conditional formatting feature in enterprise reporting is highlighting the **entire table row** when a specific condition is met (e.g., highlighting all rows where Status is 'Overdue'):

### Step-by-Step Instructions:
1. Select your entire data range excluding headers (e.g., 'A2:G100'). Ensure active cell focus is on **A2**.
2. Click **Home > Conditional Formatting > New Rule**.
3. Select **Use a formula to determine which cells to format**.
4. In the formula box, type:
   ```excel
   =$E2="Overdue"
   ```
5. **Notice the Dollar Sign Placement:**
   * '$E2' locks Column **E** with the dollar sign so that cells in columns A, B, C, D, E, F, and G all look at Column E to decide whether to color themselves.
   * Row '2' has **no** dollar sign, allowing Excel to inspect row 2 for row 2, row 3 for row 3, and so forth down the table.
6. Click **Format...**, choose your fill color (e.g., soft red), and click **OK**.

---

## 3. Highlighting Rows Between Two Dates or Weekends

### Highlighting Weekends (Saturdays and Sundays):
To shade date columns when a date falls on a weekend:
```excel
=WEEKDAY(A2, 2) > 5
```
*(In return type 2, Monday = 1 through Saturday = 6 and Sunday = 7, so values > 5 represent weekend days).*

### Multi-Condition Highlighting with AND / OR:
Highlight orders from the 'North' region that exceed 10,000 in revenue:
```excel
=AND($B2="North", $D2>10000)
```

---

# Multiple Choice Questions

### 1. In formula-based conditional formatting, what value must your formula return for the formatting to be applied?
A. Any text string
B. Exactly 0
C. TRUE (or any non-zero numerical equivalent)
D. #N/A
**Answer:** C
**Explanation:** Conditional formatting evaluates boolean expressions; formatting is triggered whenever the formula returns TRUE or a non-zero number.

---

### 2. To highlight an entire row from A2:G100 if the Status in column E is 'Completed', which formula must be entered?
A. =E2="Completed"
B. =$E$2="Completed"
C. =$E2="Completed"
D. =E$2="Completed"
**Answer:** C
**Explanation:** Using =$E2 locks column E with the dollar sign so every cell in the row checks column E, while allowing row numbers to increment dynamically.

---

### 3. What happens if you accidentally use '=$E$2="Completed"' when applying a row-highlighting rule across A2:G100?
A. Only cell E2 is highlighted
B. If cell E2 is "Completed", every single row from row 2 to 100 will be highlighted
C. Excel displays a circular reference error
D. No cells can be formatted
**Answer:** B
**Explanation:** Because both column and row are locked ($E$2), every cell in the table evaluates only cell E2. If E2 is Completed, the entire table lights up.

---

### 4. Which formula highlights rows where the delivery date in column C is earlier than today's date?
A. =$C2 < TODAY()
B. =TODAY($C2)
C. =$C2 = "YESTERDAY"
D. =NOW() > $C$2
**Answer:** A
**Explanation:** The formula '=$C2 < TODAY()' checks if the date in column C is before the current system calendar date.

---

### 5. Why must the formula in the Conditional Formatting dialog be written relative to the very first top-left cell of the selected range?
A. Excel only checks the top-left cell and ignores the rest
B. Excel projects the formula across the rest of the selection starting from that top-left anchor coordinate
C. Excel requires alphabetical ordering
D. It is a limitation of the Windows clipboard
**Answer:** B
**Explanation:** Excel maps the entered formula starting at the active top-left cell of the selection, offsetting references for all other cells across the range.

---
