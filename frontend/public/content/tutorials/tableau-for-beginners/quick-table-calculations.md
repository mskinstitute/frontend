# Table Calculations: Running Total, Percent of Total, Rank & Moving Average

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What are Table Calculations?
**Table Calculations** are secondary calculations performed on the **already aggregated results** in the visual cache. They evaluate based on the layout of the table without querying the underlying database!

---

## 2. Common Quick Table Calculations
Right-click any Measure on a shelf $	o$ **Quick Table Calculation**:
1. **Running Total:** Cumulative sum over time.
2. **Percent of Total:** Proportional percentage contributing to 100%.
3. **Rank:** Assigns ordinal rank ($1, 2, 3...$) to categories.
4. **Moving Average:** Smooths out trailing fluctuations over $N$ periods.
5. **Year-over-Year Growth:** Computes percentage difference from prior period.

---

## 3. Addressing & Partitioning (Compute Using)
- **Compute Using $	o$ Table (across):** Evaluates horizontally across columns.
- **Compute Using $	o$ Table (down):** Evaluates vertically down rows.

---

# Multiple Choice Questions

### 1. When are Table Calculations evaluated in Tableau's Order of Operations?
A. Very late in the pipeline, on the already-aggregated numbers in the view's visual cache
B. In the raw database before loading
C. In Power Query
D. During installation
**Answer:** A
**Explanation:** Table calculations run in local memory against the summarized query results returned to the visual.
---

### 2. What visual indicator appears on a pill on a shelf when a Table Calculation is applied to it?
A. A small delta ($Delta$) triangle icon on the right side of the pill
B. A star icon
C. The pill turns red
D. A plus sign
**Answer:** A
**Explanation:** The delta symbol ($Delta$) denotes that an active table calculation is operating on that measure.
---

### 3. What does 'Compute Using $	o$ Table (down)' instruct Tableau to do when calculating 'Percent of Total'?
A. Calculate percentages so that the sum of each vertical column equals 100%
B. Calculate percentages across the row
C. Divide by the grand total of the database
D. Sort down
**Answer:** A
**Explanation:** 'Table (down)' evaluates along the vertical direction of the table.
---

### 4. How do you create a 3-month trailing moving average in Tableau?
A. Right-click measure $	o$ Quick Table Calculation $	o$ Moving Average $	o$ Edit Table Calculation to set 2 previous periods + current period
B. Use a calculator
C. Write a Python loop
D. Moving averages are not supported
**Answer:** A
**Explanation:** The Moving Average calculation settings allow defining the trailing and forward window size.
---

### 5. What function calculates the ordinal rank of a category within a table calculation?
A. `RANK()` (or `RANK_DENSE()`)
B. `ORDER()`
C. `POSITION()`
D. `ROW_NUMBER()`
**Answer:** A
**Explanation:** `RANK()` evaluates ordinal rankings across the specified partition.
---
