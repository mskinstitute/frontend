# Sorting Data (Single and Multi-Level)

Sorting rearranges your records to uncover patterns, prioritize tasks, and prepare information for reporting. Excel allows both simple single-column sorting and sophisticated multi-level hierarchical sorting with custom sorting orders.

---

## 1. Single-Column Sorting (A-Z and Z-A)

Single-column sorting rearranges all rows in a dataset according to the values in one selected column:

* **Ascending (A to Z / Smallest to Largest / Oldest to Newest):** Sorts alphabetically from A to Z, numbers from lowest to highest, or dates from earliest to latest.
* **Descending (Z to A / Largest to Smallest / Newest to Oldest):** Inverts the order to display the highest revenue, newest transactions, or reverse alphabetical names at the top.

```
Quick Sort Commands:
- Data Tab > Sort A to Z or Sort Z to A
- Right-click any cell > Sort > Sort A to Z
```

> **Warning: The "Expand the Selection" Dialog:**
> If you select only a single column within a multi-column table before sorting, Excel warns you: *"Excel found data next to your selection."* Always choose **Expand the selection**! If you choose "Continue with the current selection", only that single column will reorder, irreparably scrambling employee names from their salaries and addresses!

---

## 2. Multi-Level Hierarchical Sorting

In real-world business datasets, multiple rows share identical values (e.g., several employees in the 'Sales' department). Multi-level sorting allows you to establish tie-breaker criteria:

![Sorting and Filtering Interface](/images/tutorials/ms-excel/sorting-filtering-tables.svg)

### Setting Up Multi-Level Sorting:
1. Click any single cell inside your dataset.
2. Go to the **Data** tab and click the large **Sort** button (or press **Alt + A + S**).
3. In the Sort dialog box:
   * Ensure **My data has headers** is checked.
   * **Level 1 (Primary):** Sort by **Department** | Sort On: Cell Values | Order: A to Z.
   * Click **Add Level**.
   * **Level 2 (Secondary):** Then by **Branch** | Sort On: Cell Values | Order: A to Z.
   * Click **Add Level**.
   * **Level 3 (Tertiary):** Then by **Sales Amount** | Sort On: Cell Values | Order: Largest to Smallest.
4. Click **OK**.

*Result:* All rows are grouped first by Department. Within each Department, rows are organized alphabetically by Branch. Within each Branch, high-performing sales figures appear at the top.

---

## 3. Custom List Sorting (Non-Alphabetical Orders)

Certain categories possess natural logical sequences that are not alphabetical (e.g., T-Shirt Sizes: Small, Medium, Large, XL; or Priority: High, Medium, Low):

1. In the Sort dialog box, under the **Order** dropdown, choose **Custom List...**.
2. Select an existing custom list (e.g., 'Jan, Feb, Mar...' or 'Sun, Mon, Tue...'), or create a **NEW LIST**.
3. Under *List entries*, type:
   ```
   High
   Medium
   Low
   ```
4. Click **Add**, then click **OK**.
5. Your dataset now sorts strictly according to organizational priority rather than alphabetical 'H-L-M'.

---

# Multiple Choice Questions

### 1. What critical danger occurs if you select only one column in a table and sort with 'Continue with the current selection'?
A. The worksheet becomes read-only
B. Only that single column gets reordered, corrupting row-level data alignment
C. All numbers convert to text strings
D. Excel crashes and deletes the workbook
**Answer:** B
**Explanation:** Sorting without expanding the selection reorders only the highlighted column while leaving adjacent columns stationary, permanently mismatching records across rows.

---

### 2. How can you sort a project task table so that tasks are ordered first by 'Status' (High, Medium, Low) and then by 'Due Date' (Oldest to Newest)?
A. Sort by Due Date, then delete Status
B. Use the Multi-Level Sort dialog box and add a second level using 'Add Level'
C. Filter by Status only
D. Apply AutoSum across both columns
**Answer:** B
**Explanation:** The multi-level Sort dialog box allows you to configure primary, secondary, and tertiary sorting levels with 'Add Level'.

---

### 3. Which option in the Sort dialog box ensures that row 1 containing column titles is not sorted into the data body?
A. Case sensitive
B. Sort left to right
C. My data has headers
D. Header lock
**Answer:** C
**Explanation:** Checking 'My data has headers' instructs Excel to exclude the top row of the selected range from sorting operations.

---

### 4. What feature allows you to sort values in the order 'Jan, Feb, Mar, Apr' instead of alphabetical 'Apr, Feb, Jan, Mar'?
A. Reverse Sorting
B. Custom List Sorting
C. Font Color Sorting
D. Pivot Sorting
**Answer:** B
**Explanation:** Custom Lists define non-alphabetical business sequences like months, days of the week, or priority ratings.

---

### 5. Can Excel sort rows based on cell background color or font color rather than cell values?
A. No, Excel can only sort by numbers and text
B. Yes, by selecting 'Cell Color' or 'Font Color' in the 'Sort On' dropdown of the Sort dialog
C. Only with VBA macro programming
D. Only in Excel Online
**Answer:** B
**Explanation:** In the Sort dialog box, the 'Sort On' dropdown includes 'Cell Color', 'Font Color', and 'Conditional Formatting Icon'.

---
