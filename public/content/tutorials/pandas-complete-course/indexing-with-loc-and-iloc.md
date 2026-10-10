# Indexing with loc & iloc

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Core Indexers in Pandas
Accessing subsets of data in Pandas is achieved primarily through two explicit indexing accessors:
1. **`loc`**: **L**abel-based indexing (select by column names and row index labels).
2. **`iloc`**: **I**nteger position-based indexing (select by integer offset: 0, 1, 2, ...).

> *Golden Rule: `loc` uses names/labels, `iloc` uses integer positions.*

---

## 2. Setting Up Sample Data
```python
import pandas as pd

data = {
    'Name': ['Aarav', 'Priya', 'Rohan', 'Sneha', 'Kabir'],
    'City': ['Delhi', 'Mumbai', 'Bengaluru', 'Noida', 'Agra'],
    'Score': [92, 88, 95, 79, 85]
}
# Using custom index labels
df = pd.DataFrame(data, index=['R101', 'R102', 'R103', 'R104', 'R105'])
print(df)
```

---

## 3. Label-Based Indexing with `.loc[row_label, col_label]`

### A. Selecting Single Cell or Single Row
```python
# Get row 'R101' as a Series
row_101 = df.loc['R101']

# Get specific cell: Row 'R102', Column 'Score'
score_102 = df.loc['R102', 'Score'] # Returns 88
```

### B. Slicing with `.loc` (INCLUSIVE of endpoints!)
> **Crucial Distinction:** In standard Python slicing `[0:3]`, the stop endpoint 3 is excluded. But with `loc`, both the start label and the stop label are **INCLUDED**!

```python
# Rows from R102 through R104 inclusive, and columns 'Name' through 'Score'
subset = df.loc['R102':'R104', 'Name':'Score']
print(subset)
```

---

## 4. Integer-Based Indexing with `.iloc[row_idx, col_idx]`
`.iloc` operates strictly on 0-based integer positions, adhering to standard Python slice rules (stop position is **EXCLUDED**):

```python
# Get the first row (index 0)
first_row = df.iloc[0]

# Get the last row using negative indexing
last_row = df.iloc[-1]

# Slice first 3 rows (0, 1, 2) and first 2 columns (0, 1)
sub_matrix = df.iloc[0:3, 0:2]
print(sub_matrix)
```

---

## 5. Summary Cheat Table

| Feature | `df.loc[]` | `df.iloc[]` |
| :--- | :--- | :--- |
| **Lookup Mode** | By Label / Name | By Integer Position |
| **Row Selection** | `df.loc['R101']` | `df.iloc[0]` |
| **Slice Endpoints** | **Inclusive** (`'A':'C'` includes C) | **Exclusive** (`0:3` stops at 2) |
| **Boolean Masking** | Supported (`df.loc[df['Score'] > 90]`) | Not directly supported |

---

# Multiple Choice Questions

### 1. What does the 'i' in `.iloc` stand for?
A. Index
B. Integer position
C. Inclusive
D. Iterator
**Answer:** B
**Explanation:** `.iloc` stands for Integer Location (position-based indexing).
---

### 2. How does slicing endpoint behavior differ between `.loc` and `.iloc`?
A. `.loc` is inclusive of the stop label, while `.iloc` is exclusive of the stop integer
B. `.loc` is exclusive, while `.iloc` is inclusive
C. Both are always exclusive
D. Both are always inclusive
**Answer:** A
**Explanation:** `df.loc['A':'C']` includes both 'A' and 'C', whereas `df.iloc[0:3]` includes indices 0, 1, and 2, excluding 3.
---

### 3. Which command selects the very last row of any DataFrame regardless of its index labels?
A. `df.loc[-1]`
B. `df.iloc[-1]`
C. `df.last()`
D. `df.get_end()`
**Answer:** B
**Explanation:** `df.iloc[-1]` uses Python's standard negative integer indexing to access the final row.
---

### 4. Given a DataFrame with index `['A', 'B', 'C']` and column `'Revenue'`, how do you access the Revenue of row 'B' using label-based indexing?
A. `df.loc['B', 'Revenue']`
B. `df.iloc['B', 'Revenue']`
C. `df.get('Revenue', 'B')`
D. `df.cell('B', 'Revenue')`
**Answer:** A
**Explanation:** `df.loc[row_label, col_label]` performs exact label lookup.
---

### 5. What error occurs if you pass a string column name like `'Score'` into `.iloc`?
A. `IndexError`
B. `TypeError: cannot do positional indexing with these indexers of type str`
C. `KeyError`
D. No error, it converts automatically
**Answer:** B
**Explanation:** `.iloc` strictly expects integer positions; passing a string triggers a TypeError.
---
