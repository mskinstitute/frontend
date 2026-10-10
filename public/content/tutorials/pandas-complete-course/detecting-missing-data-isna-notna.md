# Detecting Missing Values (isna, notna, isnull)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Missing Data in Pandas?
Real-world datasets are almost never 100% complete. In Pandas, missing data is represented as:
- **`np.nan`** (Not a Number, a special IEEE floating-point value)
- **`pd.NA`** (Pandas' modern experimental nullable missing indicator)
- **`None`** (Standard Python null object, automatically cast to NaN in numeric columns)

> *Real-world Analogy: Jaise exam me kisi student ki attendance sheet par blank space reh jati hai ya registration form me phone number fill nahi kiya gaya hota, wahi Pandas me NaN kehlata hai.*

---

## 2. Detecting Missing Data: `.isna()` vs `.isnull()`
In Pandas, **`.isna()`** and **`.isnull()`** are 100% identical aliases. `.isna()` is preferred because it matches the modern scientific terminology (is NA).

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'Name': ['Amit', 'Sunita', np.nan, 'Rohan', 'Sneha'],
    'Age': [24, np.nan, 29, 31, np.nan],
    'Salary': [50000, 62000, 58000, np.nan, 67000]
})

print(df.isna())
```

**Output (Boolean Matrix):**
```text
    Name    Age  Salary
0  False  False   False
1  False   True   False
2   True  False   False
3  False  False    True
4  False   True   False
```

---

## 3. Summarizing Missing Data Across Columns
To compute the exact number and percentage of nulls in each column:

```python
# 1. Count of missing values per column
missing_counts = df.isna().sum()
print("Missing counts:\n", missing_counts)

# 2. Percentage of missing values
missing_pct = (df.isna().sum() / len(df)) * 100
print("\nMissing Percentage:\n", missing_pct)
```

**Output:**
```text
Missing counts:
Name      1
Age       2
Salary    1
dtype: int64
```

---

## 4. Filtering Rows with or without Missing Data
- **`df[df['Salary'].isna()]`**: Find all rows where Salary is missing.
- **`df[df['Name'].notna()]`**: Keep only rows where Name is present.

---

# Multiple Choice Questions

### 1. What is the standard representation of missing floating-point values in Pandas?
A. `null`
B. `np.nan`
C. `0`
D. `-1`
**Answer:** B
**Explanation:** Pandas uses NumPy's `np.nan` (Not a Number) as the standard marker for missing floating-point values.
---

### 2. What is the difference between `df.isna()` and `df.isnull()`?
A. `isna()` checks numbers while `isnull()` checks text
B. There is no difference; `isnull()` is an exact alias of `isna()`
C. `isna()` only checks rows while `isnull()` checks columns
D. `isnull()` was removed in Pandas 2.0
**Answer:** B
**Explanation:** In Pandas source code, `df.isnull()` is an exact alias for `df.isna()`.
---

### 3. Which code snippet returns the total count of missing values in each column?
A. `df.isna().sum()`
B. `df.count_nulls()`
C. `df.null_summary()`
D. `df.missing()`
**Answer:** A
**Explanation:** `df.isna().sum()` sums the True values (treated as 1) down each column, producing the total null count per column.
---

### 4. Which method is the logical opposite of `df.isna()`, returning True for valid non-null entries?
A. `df.isvalid()`
B. `df.notna()`
C. `df.has_data()`
D. `df.filled()`
**Answer:** B
**Explanation:** `df.notna()` (or `df.notnull()`) returns True where values are not NA.
---

### 5. Why can direct equality comparison like `np.nan == np.nan` not be used to check for missing values?
A. It raises a SyntaxError
B. According to IEEE 754 floating-point standards, NaN is never equal to anything, including itself (returns False)
C. It always returns True
D. It modifies the dataset
**Answer:** B
**Explanation:** In IEEE floating-point math, `NaN == NaN` always evaluates to `False`. This is why `pd.isna()` or `np.isnan()` must be used.
---
