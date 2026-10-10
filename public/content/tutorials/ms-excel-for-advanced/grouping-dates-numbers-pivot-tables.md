# Grouping Dates and Numbers in Pivot Tables

Raw transactional data typically contains granular timestamps (e.g., '2026-03-14 09:22:15') or continuous numerical values (e.g., ages from 18 to 75). Trying to analyze this without aggregation results in thousands of unreadable rows. **Grouping** allows you to roll dates up into Years, Quarters, and Months, or bin numerical scores into structured frequency brackets.

---

## 1. Grouping Date Fields (Years, Quarters, Months)

When you drag a date field into the **Rows** area of a modern Pivot Table, Excel often auto-groups it. If not, or if you wish to adjust the intervals:

1. Right-click any date cell in the Pivot Table.
2. Select **Group...** from the contextual menu.
3. In the Grouping dialog box:
   * **Starting at / Ending at:** Set boundary dates.
   * **By:** Highlight one or more time horizons:
     * **Seconds / Minutes / Hours** (For call centers & web logs)
     * **Days** (Set *Number of days: 7* for weekly tracking!)
     * **Months / Quarters / Years** (For fiscal reporting)
4. Click **OK**.

```
Nested Date Hierarchy in Pivot Rows:
- 2026
  ├── Qtr 1
  │   ├── Jan: $120,000
  │   ├── Feb: $145,000
  │   └── Mar: $160,000
  └── Qtr 2 ...
```

![Pivot Table Grouping and Hierarchies](/images/tutorials/ms-excel/pivot-tables-and-fields.svg)

---

## 2. Grouping Numeric Ranges into Custom Bins

Beyond dates, grouping works on numeric values such as Age, Salary, or Order Value:

### Example: Customer Demographics by Age Bracket
Suppose you have customer ages from 18 to 82:
1. Drag **Age** into the **Rows** area.
2. Drag **Customer ID** into the **Values** area (*Count of Customer ID*).
3. Right-click any age number in the table and choose **Group...**.
4. In the Grouping dialog:
   * **Starting at:** '18'
   * **Ending at:** '80'
   * **By:** '10' (Creates 10-year brackets)
5. Click **OK**.

*Resulting Brackets:*
* '<18'
* '18-27'
* '28-37'
* '38-47'
* '48-57'
* '58-67'
* '>=68'

---

## 3. Ungrouping Data

If you need to return to raw transaction dates or individual numbers:
* Right-click any grouped cell in the Pivot Table.
* Select **Ungroup**.
* Excel instantly restores the granular line-item records.

---

# Multiple Choice Questions

### 1. How do you open the Grouping dialog box for a date or numeric field in a Pivot Table?
A. Double-click the title bar
B. Right-click any date or number cell in the Pivot Table and choose 'Group...'
C. Press Ctrl + G
D. Data tab > Advanced Filter
**Answer:** B
**Explanation:** Right-clicking any item in the target field column of the Pivot Table and selecting 'Group...' opens the Grouping configuration modal.

---

### 2. How can you group daily sales transactions into clean weekly (7-day) intervals in a Pivot Table?
A. Select By: Days and set 'Number of days' to 7
B. Type "Week" in row 1
C. Use the WEEKDAY formula on the raw table
D. Pivot Tables cannot group by week
**Answer:** A
**Explanation:** In the Grouping dialog, selecting 'Days' as the sole interval enables the 'Number of days' counter, which can be set to 7 for weekly intervals.

---

### 3. When grouping numbers (such as customer age or income), what do the 'Starting at', 'Ending at', and 'By' fields define?
A. The font colors
B. The lower boundary, upper boundary, and bucket/bin size
C. The password security parameters
D. The calculation speed
**Answer:** B
**Explanation:** 'Starting at' and 'Ending at' establish the outer limits, while 'By' defines the interval size for each histogram bin.

---

### 4. What happens if a date column contains even a single blank cell or text entry when you attempt to group by Months/Years?
A. Excel automatically fixes the error
B. Excel displays an error message stating "Cannot group that selection"
C. The Pivot Table deletes the column
D. The entire workbook converts to CSV
**Answer:** B
**Explanation:** Pivot Table date grouping requires 100% clean date data types; any blank cell or text string causes the "Cannot group that selection" error.

---

### 5. How do you revert a grouped Pivot Table field back to its raw, unaggregated state?
A. Press Ctrl + Z repeatedly
B. Right-click the grouped field and select 'Ungroup'
C. Delete the worksheet
D. Clear all filters
**Answer:** B
**Explanation:** Right-clicking any grouped item and choosing 'Ungroup' dissolves the grouping intervals and restores the original raw values.

---
