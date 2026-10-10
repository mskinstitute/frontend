# Advanced Filter Options & Extracting Unique Records

While standard AutoFilter handles straightforward criteria, Excel's **Advanced Filter** handles complex boolean logic (combining multiple AND/OR statements across various columns) and allows you to copy filtered records or extract a clean list of unique values directly to a separate location.

---

## 1. Setting Up Criteria Ranges for Advanced Filter

Advanced Filter requires three dedicated ranges on your sheet:
1. **List Range:** Your primary raw data table including headers (e.g., 'A1:E200').
2. **Criteria Range:** A separate block containing identical column headers with search conditions placed below them.
3. **Copy To Range (Optional):** Destination headers where extracted rows should be pasted.

```
Criteria Range Setup Logic:
- Conditions placed on the SAME ROW evaluate as AND logic.
- Conditions placed on DIFFERENT ROWS evaluate as OR logic.

Example (AND Logic):
+-------------------+------------------+
| Department        | Salary           |
+-------------------+------------------+
| Sales             | >50000           |  <- (Department = "Sales" AND Salary > 50000)
+-------------------+------------------+

Example (OR Logic):
+-------------------+------------------+
| Department        | Salary           |
+-------------------+------------------+
| Sales             |                  |  <- (Department = "Sales")
| IT                | >70000           |  <- OR (Department = "IT" AND Salary > 70000)
+-------------------+------------------+
```

---

## 2. Step-by-Step: Executing Advanced Filter

1. Set up your criteria range in empty cells above or to the side of your main table.
2. Go to **Data > Advanced** (in the Sort & Filter group).
3. In the Advanced Filter dialog box:
   * Select **Copy to another location** (recommended so original data is untouched).
   * **List range:** Select '$A$1:$E$200'.
   * **Criteria range:** Select '$G$1:$H$2'.
   * **Copy to:** Select destination cell '$J$1'.
4. Click **OK**. Excel extracts all matching records immediately to Column J!

![Filtering and Managing Data Tables](/images/tutorials/ms-excel/sorting-filtering-tables.svg)

---

## 3. Extracting Unique (Distinct) Records

Removing duplicates directly alters your source data. If you want to generate a unique list of clients, products, or cities without touching the original table:

1. Click **Data > Advanced**.
2. Select **Copy to another location**.
3. In **List range**, select the column containing duplicate entries (e.g., '$B$1:$B$500').
4. Leave **Criteria range** completely blank.
5. In **Copy to**, select an empty cell (e.g., '$M$1').
6. Check the box **Unique records only**.
7. Click **OK**.
*Excel outputs a deduplicated, clean list of unique values!*

---

# Multiple Choice Questions

### 1. In Excel Advanced Filter criteria ranges, how do you specify an OR condition between two fields?
A. Separate the values with a comma on the same row
B. Place the criteria on different rows beneath the corresponding headers
C. Type 'OR' between the column headers
D. Use the '|' pipe symbol
**Answer:** B
**Explanation:** In Advanced Filter criteria ranges, criteria on the same row evaluate as AND, while criteria on separate rows evaluate as OR.

---

### 2. What happens if you check 'Unique records only' in the Advanced Filter dialog box?
A. Duplicate records are deleted permanently from the source sheet
B. Only distinct records are displayed or copied to the destination, ignoring duplicates
C. All numbers are rounded to the nearest integer
D. Only rows with unique primary keys in column A are sorted
**Answer:** B
**Explanation:** The 'Unique records only' option filters out duplicate rows so only unique, distinct instances appear in the output.

---

### 3. Where must the column headers in an Advanced Filter Criteria Range come from?
A. They must be newly invented names
B. They must match the exact spelling and formatting of the source table headers
C. They must be enclosed in square brackets
D. They must be written in lowercase
**Answer:** B
**Explanation:** Advanced Filter maps conditions by header name; the criteria headers must match the source data column headers exactly.

---

### 4. Which Advanced Filter action setting keeps your original data in place while writing the filtered subset into a new location?
A. Filter the list, in-place
B. Copy to another location
C. Export to CSV
D. Transpose selection
**Answer:** B
**Explanation:** Selecting 'Copy to another location' extracts matching rows into a designated destination range without hiding rows in the source list.

---

### 5. If your criteria range specifies Department as 'Finance' and Rating as '>4' on the exact same row, what records will be returned?
A. All Finance employees plus all employees with rating > 4
B. Only employees who work in Finance AND have a rating greater than 4
C. Only employees with rating 4
D. None, because inequality symbols are not permitted
**Answer:** B
**Explanation:** Conditions placed on the same row of a criteria range evaluate using logical AND.

---
