# Merging and Appending Queries (Joins & Unions)

In corporate environments, business intelligence requires combining multiple datasets. In Power Query, you combine tables using two fundamental operations: **Appending** (stacking tables vertically) and **Merging** (joining tables horizontally based on matching keys).

---

## 1. Appending Queries (Vertical Stacking / UNION)

Appending stacks rows from two or more tables with identical column schemas into a single master table:

```
Table 1 (Jan Sales - 1,000 rows)
       +
Table 2 (Feb Sales - 1,200 rows)
       =
Appended Table (Jan + Feb Sales - 2,200 rows!)
```

### Step-by-Step Appending:
1. In Power Query Editor, go to **Home > Combine group > Append Queries > Append Queries as New**.
2. Select **Two tables** (or *Three or more tables*).
3. Choose Table 1 and Table 2.
4. Click **OK**.
*Excel concatenates all rows into a unified table!*

![Power Query Append and Merge Architecture](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Merging Queries (Horizontal Joining / VLOOKUP Replacement)

Merging matches rows between two tables based on a **common key column** (e.g., CustomerID or ProductSKU), acting as a faster, non-breaking replacement for VLOOKUP across millions of rows.

### The 6 Relational Join Kinds in Power Query:
```
+-----------------------------------+---------------------------------------------------+
| Join Kind                         | Rows Retained in Merged Output                    |
+-----------------------------------+---------------------------------------------------+
| Left Outer (Default)              | ALL rows from Table 1, and matching from Table 2. |
| Right Outer                       | ALL rows from Table 2, and matching from Table 1. |
| Full Outer                        | ALL rows from both tables (unmatched filled null).|
| Inner                             | ONLY rows that match in BOTH tables.              |
| Left Anti                         | Rows in Table 1 that have NO MATCH in Table 2.    |
| Right Anti                        | Rows in Table 2 that have NO MATCH in Table 1.    |
+-----------------------------------+---------------------------------------------------+
```

### Step-by-Step Merging:
1. Click **Home > Combine group > Merge Queries > Merge Queries as New**.
2. Select **Primary Table** (e.g., 'Orders') at the top.
3. Select **Lookup Table** (e.g., 'Customers') at the bottom.
4. Click the matching key column in both previews (e.g., 'CustomerID').
5. Select **Join Kind: Left Outer**.
6. Click **OK**.
7. In the resulting table, the merged column contains a `[Table]` object.
8. Click the **Expand Icon** (two diverging arrows) on the header, select which columns to bring in (e.g., 'CustomerName', 'City'), uncheck *Use original column name as prefix*, and click **OK**!

---

## 3. Auditing with Anti-Joins

* **Left Anti-Join:** Identifies missing master data—such as finding orders placed by customer IDs that do not exist in the master customer database!
* **Right Anti-Join:** Identifies registered customers who have never placed an order.

---

# Multiple Choice Questions

### 1. What is the operational difference between Appending and Merging queries in Power Query?
A. Appending stacks rows vertically (adding rows); Merging joins columns horizontally based on matching keys (adding columns)
B. Appending works only on text; Merging works only on numbers
C. Merging deletes data; Appending saves data
D. There is no difference
**Answer:** A
**Explanation:** Appending is a vertical concatenation (UNION) of rows, while Merging is a horizontal relational join based on common key columns.

---

### 2. Which Join Kind returns all records from the first table, along with matching records from the second table, leaving unmatched records with null values?
A. Inner Join
B. Left Outer Join
C. Right Anti Join
D. Full Outer Join
**Answer:** B
**Explanation:** Left Outer Join retains 100% of rows from the primary (left) table and attaches matching records from the secondary (right) table.

---

### 3. Which Join Kind is ideal for identifying orphan records (such as orders that have an invalid Product ID missing from the inventory master list)?
A. Full Outer
B. Left Anti Join
C. Inner Join
D. Cross Join
**Answer:** B
**Explanation:** A Left Anti Join isolates only rows in the first table that have no matching key in the second table, pinpointing missing or invalid records.

---

### 4. What must you click after performing a Merge in Power Query to reveal and extract the joined columns?
A. The Refresh button
B. The Expand button (two arrows pointing in opposite directions) on the new column header
C. The Close & Load button
D. The Filter funnel
**Answer:** B
**Explanation:** The Expand icon on the merged column allows you to select which specific fields from the joined table should be expanded into the query.

---

### 5. What Join Kind keeps ONLY the rows that exist in both tables simultaneously?
A. Left Outer
B. Inner Join
C. Right Outer
D. Left Anti
**Answer:** B
**Explanation:** Inner Join retains exclusively the intersection of records where matching key values are present in both tables.

---
