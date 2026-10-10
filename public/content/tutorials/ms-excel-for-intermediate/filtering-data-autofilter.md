# Filtering Data with AutoFilter

Filtering enables you to temporarily isolate and view specific rows that meet defined criteria while hiding irrelevant data without deleting anything. AutoFilter is one of Excel’s most essential features for day-to-day data investigation.

---

## 1. Enabling and Using AutoFilter

To activate filtering across a tabular range:
1. Click any cell within your data range.
2. Go to **Data > Filter** (or press shortcut **Ctrl + Shift + L**).
3. Drop-down arrows immediately appear on every column header.

```
+---------------+------------------+----------------+
| Product [v]   | Category [v]     | Revenue [v]    |
+---------------+------------------+----------------+
| Laptop        | Electronics      | $1,200         |
| Chair         | Furniture        | $150           |
| Mouse         | Electronics      | $25            |
+---------------+------------------+----------------+
```

### Key AutoFilter Capabilities:
* **Checkbox Filtering:** Click the arrow, uncheck *(Select All)*, and check only desired values (e.g., 'Electronics').
* **Search Box:** Type keywords inside the search bar to locate specific names or codes among thousands of entries.
* **Row Number Indication:** When a filter is active, hidden rows are not deleted; the row numbers turn **blue** and skipped row numbers reveal that data is filtered.

---

## 2. Specialized Type-Specific Filters

Excel automatically detects the data type in each column and offers specialized filtering logic:

### A. Text Filters (For text columns):
* **Equals / Does Not Equal:** Exact string match.
* **Begins With / Ends With:** Locates customer codes or SKUs starting with specific prefixes (e.g., 'INV-2026-').
* **Contains / Does Not Contain:** Searches for substrings anywhere in the cell text.

### B. Number Filters (For numeric columns):
* **Greater Than / Less Than / Between:** Isolate sales greater than 50,000 or profit margins between 10% and 25%.
* **Top 10...:** Displays the Top N (or Bottom N) items or percentages.
* **Above Average / Below Average:** Automatically calculates the column mean and shows only qualifying values.

### C. Date Filters (For calendar columns):
* **Dynamic Time Horizons:** Filter by 'Today', 'Yesterday', 'This Week', 'Last Month', 'This Quarter', or 'Next Year'.
* **Year-to-Date (YTD):** View all records from Jan 1 of the current year up to today.
* **All Dates in the Period:** Filter across all Januaries regardless of calendar year.

---

## 3. Clearing Filters vs. Removing AutoFilter

* **Clear Filter on a Column:** Click the filter funnel icon on that header and click **Clear Filter From [Column Name]** (or press **Alt + A + C**). This restores all rows while keeping the filter arrows active.
* **Remove AutoFilter Entirely:** Press **Ctrl + Shift + L** to remove the drop-down arrows and display all data.

---

# Multiple Choice Questions

### 1. What visual indicator in Excel shows that a filter is actively hiding rows on a worksheet?
A. The sheet background turns red
B. The row numbers turn blue and certain row numbers are skipped
C. All text becomes italicized
D. A warning pop-up appears every 30 seconds
**Answer:** B
**Explanation:** When rows are hidden by an active filter, the visible row numbers turn blue and non-consecutive numbers show where rows are suppressed.

---

### 2. Which keyboard shortcut toggles AutoFilter on and off across table headers?
A. Ctrl + F
B. Ctrl + Shift + L
C. Alt + F4
D. Ctrl + Alt + V
**Answer:** B
**Explanation:** Ctrl + Shift + L is the standard shortcut to toggle AutoFilter drop-down arrows.

---

### 3. If you want to view transactions that occurred between $5,000 and $10,000, which filter option should you choose under 'Number Filters'?
A. Equals
B. Between...
C. Top 10...
D. Above Average
**Answer:** B
**Explanation:** 'Between...' allows you to set lower and upper numerical boundary conditions simultaneously.

---

### 4. What happens to formulas referencing cells that become hidden by an AutoFilter?
A. They return #REF!
B. Standard functions like SUM still calculate all cells, whereas SUBTOTAL only includes visible cells
C. They are automatically deleted
D. They convert to static values
**Answer:** B
**Explanation:** Standard SUM includes both visible and hidden rows; using SUBTOTAL with function number 9 or 109 calculates only the visible filtered rows.

---

### 5. How can you remove a filter from a single column without removing the filter arrows from the rest of the sheet?
A. Press Ctrl + Z
B. Click the filter icon on that column and select 'Clear Filter From...'
C. Press Ctrl + Shift + L twice
D. Delete the header text
**Answer:** B
**Explanation:** Clicking the funnel icon on a specific column and selecting 'Clear Filter From [Column]' resets that column while preserving other active filters.

---
