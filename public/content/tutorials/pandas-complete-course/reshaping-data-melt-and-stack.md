# Reshaping Data: Melt, Stack & Unstack

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Wide Format vs Long (Tidy) Format
In data analytics, data typically arrives in one of two formats:
- **Wide Format:** Human-friendly tables where dates or categories are spread horizontally across multiple column headers (common in Excel financial reports).
- **Long / Tidy Format:** Machine-friendly format where each variable is a column and each observation is a single row (essential for databases, Tableau, Power BI, and Seaborn).

---

## 2. Converting Wide to Long with `pd.melt()`
**`pd.melt()`** unpivots a DataFrame from wide format to long format:

```python
import pandas as pd

# Wide Excel-style report
df_wide = pd.DataFrame({
    'City': ['Delhi', 'Mumbai'],
    'Q1_Sales': [45000, 72000],
    'Q2_Sales': [52000, 68000],
    'Q3_Sales': [61000, 81000]
})
print("Wide Table:\n", df_wide)

# Unpivot into Tidy Long Format
df_long = pd.melt(
    df_wide,
    id_vars=['City'],                          # Identifier columns to keep fixed
    value_vars=['Q1_Sales', 'Q2_Sales', 'Q3_Sales'], # Columns to unpivot into rows
    var_name='Quarter',                       # New column name for former column headers
    value_name='Revenue_INR'                  # New column name for the values
)
print("\nLong Tidy Table:\n", df_long)
```

**Output:**
```text
Long Tidy Table:
     City   Quarter  Revenue_INR
0   Delhi  Q1_Sales        45000
1  Mumbai  Q1_Sales        72000
2   Delhi  Q2_Sales        52000
3  Mumbai  Q2_Sales        68000
4   Delhi  Q3_Sales        61000
5  Mumbai  Q3_Sales        81000
```

---

## 3. Reshaping with `stack()` & `unstack()`
- **`stack()`**: Pivots the innermost column level to the innermost row index level (makes DataFrame taller and narrower).
- **`unstack()`**: Pivots the innermost row index level to the innermost column level (makes DataFrame shorter and wider).

```python
# Stacking moves columns into a MultiIndex Series
stacked = df_wide.set_index('City').stack()

# Unstacking restores it back to columns
restored = stacked.unstack()
```

---

# Multiple Choice Questions

### 1. Which function converts a wide DataFrame into a long (tidy) DataFrame by unpivoting columns into rows?
A. `pd.melt()`
B. `pd.pivot()`
C. `pd.flatten()`
D. `pd.stretch()`
**Answer:** A
**Explanation:** `pd.melt()` unpivots specified columns into rows, transforming wide data into long format.
---

### 2. In `pd.melt(df, id_vars=['City'])`, what do the columns in `id_vars` represent?
A. Columns that should remain unchanged as row identifier variables
B. Columns to be deleted
C. Columns containing missing data
D. Numerical values to be summed
**Answer:** A
**Explanation:** `id_vars` specifies the identifier columns that stay fixed as rows while the remaining columns are melted.
---

### 3. What does `df.unstack()` do?
A. Moves an index level from the rows up to become column headers
B. Drops the index
C. Unzips a file
D. Deletes all NaN values
**Answer:** A
**Explanation:** `unstack()` pivots the innermost row index level into column headers.
---

### 4. Why is 'tidy' (long) data preferred when exporting data to Tableau or Power BI?
A. BI engines and visualization libraries operate most effectively when each row represents a single observation and dimensions are in dedicated columns
B. Tidy data cannot contain numbers
C. Tidy data disables SQL queries
D. Tidy data uses more hard drive space
**Answer:** A
**Explanation:** Relational BI tools and visualization libraries (Seaborn, Power BI, Tableau) require normalized, long-form tables to construct dynamic dimension slicers and measures.
---

### 5. In `pd.melt()`, which parameters customize the names of the resulting melted columns?
A. `var_name` and `value_name`
B. `col_name` and `row_name`
C. `x_name` and `y_name`
D. `new_keys` and `new_vals`
**Answer:** A
**Explanation:** `var_name` names the column holding the unpivoted headers, and `value_name` names the column holding the values.
---
