# GroupBy Mechanics: Split-Apply-Combine

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

![GroupBy Mechanics](/images/tutorials/pandas/pandas-groupby-split-apply-combine.svg)

---

## 1. What is GroupBy?
The **GroupBy** operation is one of the most fundamental workflows in data analytics. In SQL, it corresponds to `GROUP BY`; in Excel, it corresponds to creating a `PivotTable`.

The GroupBy architecture follows the **Split-Apply-Combine** paradigm:
1. **Split:** Divide the DataFrame into groups based on keys (e.g., City, Department, Product Category).
2. **Apply:** Apply an aggregation function independently to each group (e.g., `mean`, `sum`, `count`, `std`).
3. **Combine:** Merge the individual group summaries back into a single clean DataFrame.

---

## 2. Basic GroupBy Aggregation
```python
import pandas as pd

data = {
    'Region': ['North', 'South', 'North', 'South', 'East', 'North'],
    'Sales_Person': ['Amit', 'Priya', 'Rohan', 'Sneha', 'Deepak', 'Kavita'],
    'Sales': [45000, 72000, 55000, 68000, 39000, 61000],
    'Bonus': [4500, 7000, 5000, 6500, 3500, 6000]
}
df = pd.DataFrame(data)

# Calculate total sales by Region
region_sales = df.groupby('Region')['Sales'].sum()
print(region_sales)
```

**Output:**
```text
Region
East      39000
North    161000
South    140000
Name: Sales, dtype: int64
```

---

## 3. Keeping the Group Key as a Normal Column (`as_index=False`)
By default, Pandas sets the grouping key as the index of the output. In modern data pipelines, keeping it as a normal column is usually preferred:

```python
# Notice as_index=False keeps 'Region' as a normal column!
region_summary = df.groupby('Region', as_index=False)['Sales'].mean()
print(region_summary)
```

---

## 4. Grouping by Multiple Columns
```python
# Group by Region AND Department
multi_group = df.groupby(['Region', 'Sales_Person'])['Sales'].sum()
```

---

## 5. Iterating Through Groups
A GroupBy object is an iterable of `(group_name, group_dataframe)` tuples:

```python
for region_name, group_df in df.groupby('Region'):
    print(f"=== Region: {region_name} (Total Rows: {len(group_df)}) ===")
    print(group_df[['Sales_Person', 'Sales']])
```

---

# Multiple Choice Questions

### 1. What are the three phases of the GroupBy mechanism in Pandas?
A. Load, Filter, Save
B. Split, Apply, Combine
C. Slice, Dice, Merge
D. Select, From, Where
**Answer:** B
**Explanation:** The canonical pattern formulated by Hadley Wickham and implemented in Pandas is Split-Apply-Combine.
---

### 2. What does setting `as_index=False` accomplish in `df.groupby('City', as_index=False)`?
A. Deletes the City column
B. Keeps 'City' as a normal column in the output DataFrame instead of setting it as the row index
C. Prevents duplicate rows
D. Speeds up sorting
**Answer:** B
**Explanation:** `as_index=False` outputs standard SQL-like flat tabular results with a default integer index.
---

### 3. What is returned when you call `df.groupby('Category')` without an aggregation function?
A. A new DataFrame
B. A `DataFrameGroupBy` object (lazy execution until an aggregation method is called)
C. A Python list
D. None
**Answer:** B
**Explanation:** `df.groupby()` returns a lazy `DataFrameGroupBy` object that waits for an aggregation method (like `.sum()`, `.mean()`) to execute.
---

### 4. Which code snippet computes the average sales for each department?
A. `df.groupby('Department')['Sales'].mean()`
B. `df.average('Sales', by='Department')`
C. `df.mean(groupby='Department')`
D. `df['Sales'].groupby('Department')`
**Answer:** A
**Explanation:** Group by the key column `'Department'`, select the value column `['Sales']`, and apply the aggregation `.mean()`.
---

### 5. What does `df.groupby('Category').size()` return?
A. The memory size of each group in bytes
B. The total number of rows in each group (including nulls)
C. The number of unique columns
D. The width of the table
**Answer:** B
**Explanation:** `.size()` counts the total number of rows in each group, including missing values (unlike `.count()`, which counts only non-nulls).
---
