# Dropping & Filling Missing Values (dropna, fillna)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Strategies for Handling Missing Data
Once missing values are identified, a Data Analyst has two primary remedies:
1. **Deletion / Dropping (`dropna`):** Remove rows or columns containing nulls (best when missingness is tiny, e.g. < 2%).
2. **Imputation / Filling (`fillna`):** Replace missing values with domain-appropriate surrogates (mean, median, mode, forward-fill, or a sentinel constant).

---

## 2. Dropping Missing Data (`df.dropna`)

### Key Parameters:
- **`how='any'` (Default):** Drops a row if *even one* column is null.
- **`how='all'`:** Drops a row only if *all* columns are null.
- **`subset=['ColA', 'ColB']`:** Checks for nulls only in specified critical columns.
- **`axis=1`:** Drops entire columns containing nulls.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'Name': ['Amit', 'Sunita', np.nan, 'Rohan'],
    'Age': [24, np.nan, 29, 31],
    'Salary': [50000, 62000, np.nan, 75000]
})

# Drop rows where 'Name' is null (essential identifier)
df_valid_names = df.dropna(subset=['Name'])

# Drop rows only if both Age and Salary are missing
df_clean = df.dropna(subset=['Age', 'Salary'], how='all')
```

---

## 3. Imputing Missing Values (`df.fillna`)

### A. Filling with a Constant
```python
# Fill missing names with 'Unknown'
df['Name'] = df['Name'].fillna('Unknown')
```

### B. Statistical Imputation (Mean & Median)
In financial and numerical datasets, imputing with the **median** is preferred over the mean because the median is robust to extreme outliers:

```python
# Impute Age with median age
median_age = df['Age'].median()
df['Age'] = df['Age'].fillna(median_age)

# Impute Salary with mean salary
df['Salary'] = df['Salary'].fillna(df['Salary'].mean())
```

### C. Sequential Imputation: Forward Fill & Backward Fill
In time-series and sensor data, use `ffill()` (propagate last valid observation forward) or `bfill()` (propagate next valid observation backward):

```python
# Forward fill
df_filled = df.ffill()
```

---

# Multiple Choice Questions

### 1. What is the default behavior of `df.dropna()`?
A. Drops a row if any column in that row contains a NaN
B. Drops a row only if all columns are NaN
C. Drops all numeric columns
D. Replaces NaN with zero
**Answer:** A
**Explanation:** By default, `df.dropna()` uses `how='any'` and `axis=0`, removing any row that contains at least one null value.
---

### 2. How can you drop rows only when the 'Customer_Email' column is missing?
A. `df.dropna(columns=['Customer_Email'])`
B. `df.dropna(subset=['Customer_Email'])`
C. `df.drop_nulls('Customer_Email')`
D. `df.dropna(filter='Customer_Email')`
**Answer:** B
**Explanation:** The `subset` parameter restricts the null search to the specified list of column names.
---

### 3. Why is the median often preferred over the mean when imputing missing numeric values in skewed data (like salaries)?
A. Because median is faster to compute
B. Because the median is not influenced by extreme outliers (skew-resistant)
C. Because mean only works on integers
D. Because Pandas does not support mean imputation
**Answer:** B
**Explanation:** Outliers (like an extreme ₹10 crore salary in an average ₹5 lakh dataset) heavily distort the mean, whereas the median remains stable.
---

### 4. What does the `df.ffill()` method do?
A. Fills missing values by copying the last valid previous value forward
B. Fills all values with False
C. Fills missing values with the next future value
D. Forces full column formatting
**Answer:** A
**Explanation:** `ffill()` (forward fill) propagates the last observed non-null value forward to replace subsequent missing values.
---

### 5. What parameter in `fillna()` allows updating the original DataFrame directly without reassigning?
A. `inplace=True`
B. `direct=True`
C. `mutate=True`
D. `commit=True`
**Answer:** A
**Explanation:** Setting `inplace=True` modifies the existing DataFrame in memory.
---
