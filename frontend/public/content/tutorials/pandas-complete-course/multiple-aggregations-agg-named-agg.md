# Multiple Aggregations & NamedAgg

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Beyond Single Aggregations
In business reporting, a manager rarely wants just the sum of sales. They want the **Sum**, **Average**, **Minimum**, **Maximum**, and **Transaction Count** all in one table. 

Pandas provides the **`.agg()`** (or `.aggregate()`) method to compute multiple metrics simultaneously across different columns.

---

## 2. Using `.agg()` with Multiple Built-in Functions
```python
import pandas as pd

df = pd.DataFrame({
    'Branch': ['Delhi', 'Delhi', 'Mumbai', 'Mumbai', 'Delhi'],
    'Revenue': [120000, 85000, 140000, 190000, 95000],
    'Expenses': [45000, 30000, 50000, 70000, 35000]
})

# Multiple aggregations on a single column
summary = df.groupby('Branch')['Revenue'].agg(['count', 'sum', 'mean', 'max'])
print(summary)
```

**Output:**
```text
        count     sum           mean     max
Branch                                      
Delhi       3  300000  100000.000000  120000
Mumbai      2  330000  165000.000000  190000
```

---

## 3. Applying Different Aggregations to Different Columns
Pass a dictionary where **keys are column names** and **values are lists of aggregation functions**:

```python
custom_metrics = df.groupby('Branch').agg({
    'Revenue': ['sum', 'mean'],
    'Expenses': ['sum', 'max']
})
print(custom_metrics)
```

---

## 4. Modern Best Practice: Named Aggregations (`NamedAgg`)
When using standard `.agg()`, Pandas generates hierarchical multi-level column headers (e.g. `('Revenue', 'sum')`), which are awkward to query.

**Named Aggregation** allows you to specify clean, custom output column names directly during the aggregation:

```python
# Modern clean syntax (Pandas 0.25+)
clean_report = df.groupby('Branch', as_index=False).agg(
    Total_Revenue=pd.NamedAgg(column='Revenue', aggfunc='sum'),
    Avg_Revenue=pd.NamedAgg(column='Revenue', aggfunc='mean'),
    Max_Expense=pd.NamedAgg(column='Expenses', aggfunc='max'),
    Transactions=pd.NamedAgg(column='Revenue', aggfunc='count')
)
print(clean_report)
```

**Output:**
```text
   Branch  Total_Revenue  Avg_Revenue  Max_Expense  Transactions
0   Delhi         300000     100000.0        45000             3
1  Mumbai         330000     165000.0        70000             2
```

---

# Multiple Choice Questions

### 1. Which method allows computing multiple statistical aggregations (e.g. sum, mean, max) simultaneously in a GroupBy?
A. `.agg()`
B. `.compute_all()`
C. `.multi()`
D. `.combine()`
**Answer:** A
**Explanation:** `.agg()` (or `.aggregate()`) computes one or more operations across specified group columns.
---

### 2. What problem does `pd.NamedAgg` solve in Pandas?
A. It prevents multi-level hierarchical column headers and allows naming output columns directly
B. It fixes missing values
C. It sorts columns alphabetically
D. It encrypts sensitive data
**Answer:** A
**Explanation:** NamedAgg generates flat, cleanly labeled column names (e.g. `Total_Sales=('Sales', 'sum')`), eliminating annoying MultiIndex column tuples.
---

### 3. How do you apply 'mean' to column 'Age' and 'sum' to column 'Salary' in a single groupby call?
A. `df.groupby('Dept').agg({'Age': 'mean', 'Salary': 'sum'})`
B. `df.groupby('Dept').apply(['Age.mean()', 'Salary.sum()'])`
C. `df.groupby('Dept').calc(Age='mean', Salary='sum')`
D. `df.groupby('Dept').both('Age', 'Salary')`
**Answer:** A
**Explanation:** Passing a dictionary to `.agg()` maps specific columns to their designated aggregation functions.
---

### 4. Can custom Python functions or lambda expressions be passed into `.agg()`?
A. No, only string names like 'mean' are accepted
B. Yes, custom functions and lambdas can be passed directly into `.agg()`
C. Only if written in C++
D. Only for integer columns
**Answer:** B
**Explanation:** `.agg()` accepts built-in function strings, NumPy functions (`np.std`), and user-defined custom functions.
---

### 5. What is the difference between `agg('count')` and `agg('size')`?
A. `count` ignores null values while `size` counts all rows including nulls
B. `size` only counts positive numbers
C. There is no difference
D. `count` returns memory in bytes
**Answer:** A
**Explanation:** `count` computes the count of valid non-null entries, whereas `size` returns total row count regardless of nulls.
---
