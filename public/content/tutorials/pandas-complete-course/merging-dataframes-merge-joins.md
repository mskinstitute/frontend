# Relational Joins with pd.merge (Inner, Left, Right, Outer)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

![Pandas Merge Joins](/images/tutorials/pandas/pandas-merge-join-types.svg)

---

## 1. What is Relational Merging?
While `concat()` simply glues tables together, **`pd.merge()`** combines DataFrames based on matching values in common key columns—identically to an **SQL JOIN** or **Excel XLOOKUP / VLOOKUP**.

---

## 2. The 4 Relational Join Types

### 1. Inner Join (`how='inner'` - Default)
Keeps only the rows where the join key exists in **both** tables (the intersection):
```python
import pandas as pd

df_customers = pd.DataFrame({
    'Cust_ID': [1, 2, 3, 4],
    'Name': ['Amit', 'Priya', 'Rohan', 'Sneha']
})

df_orders = pd.DataFrame({
    'Cust_ID': [2, 3, 5],
    'Order_Amount': [4500, 7200, 1900]
})

# Inner join: only customers 2 and 3 match!
inner_df = pd.merge(df_customers, df_orders, on='Cust_ID', how='inner')
print(inner_df)
```

### 2. Left Join (`how='left'`)
Keeps **all** rows from the left table. If no match exists in the right table, right-side columns are filled with `NaN`:
```python
# Keeps all customers (Amit, Priya, Rohan, Sneha)
left_df = pd.merge(df_customers, df_orders, on='Cust_ID', how='left')
```

### 3. Right Join (`how='right'`)
Keeps **all** rows from the right table. Customer 5 (who is not in the customer master table) is included:
```python
right_df = pd.merge(df_customers, df_orders, on='Cust_ID', how='right')
```

### 4. Full Outer Join (`how='outer'`)
Keeps all rows from both tables, unioning unmatched records with `NaN`:
```python
outer_df = pd.merge(df_customers, df_orders, on='Cust_ID', how='outer')
```

---

## 3. Merging on Differently Named Columns
When the left table calls the key `client_id` and the right table calls it `cust_number`:

```python
merged_df = pd.merge(
    df_left,
    df_right,
    left_on='client_id',
    right_on='cust_number',
    how='left'
)
```

---

## 4. Detecting Unmatched Records with `indicator=True`
To audit which table contributed each record (essential for data reconciliation):

```python
audit_df = pd.merge(df_customers, df_orders, on='Cust_ID', how='outer', indicator=True)
print(audit_df['_merge'].value_counts())
```

**Output:**
```text
both          2
left_only     2
right_only    1
Name: _merge, dtype: int64
```

---

# Multiple Choice Questions

### 1. What is the default join type used in `pd.merge(df1, df2, on='key')`?
A. Left join
B. Inner join
C. Outer join
D. Cross join
**Answer:** B
**Explanation:** `how='inner'` is the default merge behavior, keeping only rows with matching keys in both DataFrames.
---

### 2. When joining two DataFrames where the key column is named 'emp_id' in the left table and 'employee_number' in the right table, which parameters must be used?
A. `keys=['emp_id', 'employee_number']`
B. `left_on='emp_id', right_on='employee_number'`
C. `match=('emp_id', 'employee_number')`
D. `on_left='emp_id', on_right='employee_number'`
**Answer:** B
**Explanation:** `left_on` and `right_on` specify different column names when the join keys do not share an identical label.
---

### 3. What does setting `indicator=True` add to the merged DataFrame?
A. An index column
B. A special `_merge` column indicating whether the row came from 'left_only', 'right_only', or 'both'
C. A column of random numbers
D. A boolean flag for duplicates
**Answer:** B
**Explanation:** `indicator=True` produces a categorical `_merge` column showing the source of each record.
---

### 4. Which join type preserves every single record from the left DataFrame regardless of whether a matching record exists in the right table?
A. Right join
B. Left join
C. Inner join
D. Semi join
**Answer:** B
**Explanation:** A Left Join retains 100% of the rows from the left table, filling unmatched right-side attributes with NaN.
---

### 5. What parameter resolves overlapping column names (e.g., both tables have a 'Date' column) during a merge?
A. `suffixes=('_x', '_y')`
B. `rename_dups=True`
C. `overlap='keep'`
D. `alias_cols=True`
**Answer:** A
**Explanation:** The `suffixes` tuple (defaulting to `('_x', '_y')`) appends custom strings to disambiguate identical column names.
---
