# Setting, Resetting & Managing Indices

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is the DataFrame Index?
The **Index** is the backbone of relational alignment in Pandas. It provides unique labels that identify each row, enabling instant lookups, joins, and time-series resampling.

By default, when creating or loading a DataFrame, Pandas assigns a default zero-indexed integer range: `RangeIndex(0, 1, 2, ...)`.

---

## 2. Setting an Existing Column as the Index (`set_index`)
When a column contains unique identifiers (like `Employee_ID`, `Roll_No`, or `Timestamp`), promoting it to the Index provides faster query speeds and cleaner semantics:

```python
import pandas as pd

df = pd.DataFrame({
    'Emp_ID': ['E101', 'E102', 'E103', 'E104'],
    'Name': ['Amit', 'Sunita', 'Karan', 'Pooja'],
    'Department': ['Sales', 'IT', 'Finance', 'HR']
})

# Promote 'Emp_ID' to be the Index
df_indexed = df.set_index('Emp_ID')
print(df_indexed)
```

**Output:**
```text
         Name Department
Emp_ID                  
E101     Amit      Sales
E102   Sunita         IT
E103    Karan    Finance
E104    Pooja         HR
```

Now row lookups by employee ID are immediate:
```python
employee_record = df_indexed.loc['E102']
```

---

## 3. Resetting the Index (`reset_index`)
After filtering, sorting, or grouping, the index labels may become jumbled or discontinuous (e.g., rows 3, 7, 12). `reset_index()` restores a clean `0, 1, 2, ...` index:

```python
# Revert 'Emp_ID' back to a normal column and restore integer range index
df_restored = df_indexed.reset_index()
print(df_restored)
```

### Discarding the Old Index (`drop=True`)
If you filter rows and do **not** want the old index saved as a new column:
```python
df_filtered = df[df['Department'] == 'IT']
# Reset index without keeping the old index column
df_clean = df_filtered.reset_index(drop=True)
```

---

## 4. MultiIndex (Hierarchical Indexing)
Pandas allows DataFrames to have multiple index levels, enabling high-dimensional data representation in a 2D table:

```python
df_multi = df.set_index(['Department', 'Emp_ID'])
print(df_multi)
```

---

# Multiple Choice Questions

### 1. What does the `df.set_index('Customer_ID')` method do?
A. Renames the column 'Customer_ID' to 'Index'
B. Moves the 'Customer_ID' column to become the row index of the DataFrame
C. Deletes the 'Customer_ID' column
D. Sorts the DataFrame alphabetically by 'Customer_ID'
**Answer:** B
**Explanation:** `set_index()` converts one or more existing columns into the DataFrame's row index labels.
---

### 2. What happens if you run `df.reset_index(drop=True)`?
A. The existing index is completely discarded rather than inserted as a new column
B. All columns are deleted
C. The first row of data is dropped
D. A KeyError is raised
**Answer:** A
**Explanation:** Passing `drop=True` discards the current index, resetting it to default 0-based integers without inserting the old index as a column.
---

### 3. What is the default index type created when a DataFrame is initialized without specifying an index?
A. MultiIndex
B. DatetimeIndex
C. RangeIndex
D. CategoricalIndex
**Answer:** C
**Explanation:** Pandas assigns a `RangeIndex` starting from 0 up to `len(df)-1` with a step of 1.
---

### 4. Which parameter can be passed to `df.set_index('col', inplace=True)` to modify the original DataFrame directly?
A. `overwrite=True`
B. `inplace=True`
C. `modify=True`
D. `persist=True`
**Answer:** B
**Explanation:** Setting `inplace=True` performs the mutation directly on the caller DataFrame without returning a new copy.
---

### 5. Can a DataFrame have multiple columns forming a composite, multi-level index?
A. No, Pandas only supports 1 index column
B. Yes, by passing a list of column names to `set_index(['Region', 'City'])`, creating a MultiIndex
C. Only if the data is numerical
D. Only when loading from Excel files
**Answer:** B
**Explanation:** Passing a list of column names creates a hierarchical MultiIndex, allowing sophisticated multi-level slicing.
---
