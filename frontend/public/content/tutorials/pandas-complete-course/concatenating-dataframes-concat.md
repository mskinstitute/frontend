# Concatenating DataFrames (pd.concat)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Concatenation?
**Concatenation** is the operation of stitching two or more DataFrames together along an axis—either stacking them vertically (adding more rows) or pasting them horizontally (adding more columns).

In Pandas, this is executed via **`pd.concat()`**.

---

## 2. Vertical Concatenation: Stacking Rows (`axis=0`)
The most common use case is combining monthly or regional files that share the same schema:

```python
import pandas as pd

# Monthly sales reports
df_jan = pd.DataFrame({'Emp': ['Aarav', 'Priya'], 'Sales': [45000, 52000]})
df_feb = pd.DataFrame({'Emp': ['Rohan', 'Sneha'], 'Sales': [48000, 61000]})

# Stack rows vertically
# CRITICAL TIP: Always use ignore_index=True to reset row numbering to 0, 1, 2, 3!
df_q1 = pd.concat([df_jan, df_feb], axis=0, ignore_index=True)
print(df_q1)
```

**Output:**
```text
     Emp  Sales
0  Aarav  45000
1  Priya  52000
2  Rohan  48000
3  Sneha  61000
```

---

## 3. Horizontal Concatenation: Pasting Columns (`axis=1`)
When you have matching rows and want to attach additional feature columns:

```python
df_scores = pd.DataFrame({'Math': [92, 85], 'Science': [88, 90]})
df_info = pd.DataFrame({'Name': ['Deepak', 'Ananya']})

# Combine columns horizontally
df_full = pd.concat([df_info, df_scores], axis=1)
print(df_full)
```

---

## 4. Tracking Data Source with Hierarchical Keys
When combining files from different branches or years, you can preserve their origin using the `keys` argument:

```python
df_combined = pd.concat([df_jan, df_feb], keys=['Jan_2026', 'Feb_2026'])
print(df_combined)
```

---

# Multiple Choice Questions

### 1. Which function is used in Pandas to concatenate multiple DataFrames together along an axis?
A. `pd.append()`
B. `pd.concat()`
C. `pd.stack_tables()`
D. `pd.bind()`
**Answer:** B
**Explanation:** `pd.concat()` is the universal and official method for concatenating Series and DataFrames along rows (`axis=0`) or columns (`axis=1`). Note that `df.append()` has been permanently deprecated.
---

### 2. What does `ignore_index=True` do in `pd.concat([df1, df2], ignore_index=True)`?
A. Deletes all index labels and creates a fresh sequential integer index from 0 to N-1
B. Drops duplicate rows
C. Discards the column headers
D. Sorts the rows alphabetically
**Answer:** A
**Explanation:** `ignore_index=True` resets the index in the concatenated result, preventing repeated or clashing index numbers.
---

### 3. Which parameter controls whether concatenation happens by rows (vertically) or by columns (horizontally)?
A. `direction`
B. `axis`
C. `orientation`
D. `mode`
**Answer:** B
**Explanation:** `axis=0` (default) concatenates vertically down rows, while `axis=1` concatenates horizontally across columns.
---

### 4. What happens when concatenating two DataFrames vertically if one DataFrame has a column that the other lacks?
A. Pandas raises an error
B. Pandas performs an outer union by default, filling missing values in the absent column with NaN
C. The missing column is permanently deleted
D. The program crashes
**Answer:** B
**Explanation:** By default (`join='outer'`), Pandas includes all columns from both DataFrames, filling empty spots with NaN.
---

### 5. How can you identify the origin of each row when concatenating multiple DataFrames?
A. Pass `keys=['Batch_A', 'Batch_B']` to create a MultiIndex label
B. Pass `source=True`
C. Pass `track=True`
D. It is not possible in Pandas
**Answer:** A
**Explanation:** The `keys` argument constructs a hierarchical MultiIndex identifying which source DataFrame each row originated from.
---
