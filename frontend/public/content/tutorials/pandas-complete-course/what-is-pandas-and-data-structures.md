# What is Pandas & Core Architecture

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

![Pandas Architecture](/images/tutorials/pandas/pandas-series-dataframe-anatomy.svg)

---

## 1. What is Pandas? (Introduction & Purpose)
**Pandas** is the foundational open-source Python library used worldwide for data manipulation, data wrangling, cleaning, and exploratory data analysis (EDA). Built directly on top of NumPy, Pandas introduces intuitive, flexible, and high-performance two-dimensional labeled data structures that bring the flexibility of SQL tables and Microsoft Excel spreadsheets directly into Python.

In simple Indian English terms:
> *Jaise Excel me aapke paas sheets, rows, columns aur formulas hote hain, bilkul waise hi Python ke andar Pandas aapko supercharged tables deta hai jo millions of rows ko seconds me process kar sakti hain.*

### Why Pandas Over Raw Python or Excel?
- **Scale:** While Excel struggles with beyond 100,000 rows, Pandas handles millions of records effortlessly using optimized C-extensions.
- **Automation & Pipelines:** Instead of manually clicking buttons in Excel every Monday, a Pandas script automates data extraction, cleaning, and reporting with one click.
- **Heterogeneous Data:** Unlike pure NumPy arrays where all elements must share the exact same datatype, a Pandas table can contain integers, floats, dates, text, and booleans across different columns simultaneously.

---

## 2. Core Data Structures: Series vs DataFrame vs Index
Pandas is architected around three foundational building blocks:

### 1. pd.Series (1-Dimensional Labeled Array)
A `Series` is a one-dimensional array capable of holding any data type (integers, strings, floating-point numbers, Python objects). It consists of two parallel arrays:
1. **The Values:** The actual data (stored as a continuous NumPy array).
2. **The Index:** An explicit array of data labels mapping to each value.

```python
import pandas as pd

# Creating a simple Series
daily_revenue = pd.Series([45000, 52000, 48000, 61000], index=['Mon', 'Tue', 'Wed', 'Thu'], name='Revenue_INR')
print(daily_revenue)
```

**Output:**
```text
Mon    45000
Tue    52000
Wed    48000
Thu    61000
Name: Revenue_INR, dtype: int64
```

### 2. pd.DataFrame (2-Dimensional Labeled Tabular Matrix)
A `DataFrame` is a two-dimensional, size-mutable, and potentially heterogeneous tabular data structure with labeled axes (rows and columns). You can think of a DataFrame as a dictionary of Series objects sharing a common Index:

```python
data = {
    'Employee': ['Aarav', 'Priya', 'Rohan', 'Sneha'],
    'Department': ['Analytics', 'Finance', 'Engineering', 'Marketing'],
    'Salary': [65000, 58000, 82000, 61000]
}
df = pd.DataFrame(data)
print(df)
```

**Output:**
```text
  Employee   Department  Salary
0    Aarav    Analytics   65000
1    Priya      Finance   58000
2    Rohan  Engineering   82000
3    Sneha    Marketing   61000
```

### 3. pd.Index (Immutable Axis Labels)
The `Index` object stores axis labels for Series and DataFrames. It behaves like an immutable ordered multiset, enabling ultra-fast $O(1)$ lookups, relational alignments, and slice operations.

---

## 3. The Two Coordinate Axes: axis=0 vs axis=1
One of the most frequent points of confusion for beginners is understanding axis direction:
- **`axis=0` (Rows / Vertical direction):** Operations run down the rows. For example, `df.mean(axis=0)` computes the mean of each column down all rows.
- **`axis=1` (Columns / Horizontal direction):** Operations run across the columns. For example, `df.drop('Department', axis=1)` drops the vertical column.

---

## 4. Key Takeaways & Best Practices
- Always import Pandas using the standard community alias: `import pandas as pd`.
- A DataFrame is simply a collection of Series sharing a single index.
- Operations in Pandas are vectorized by default—avoid using Python `for` loops when calculating columns.

---

# Multiple Choice Questions

### 1. What is the fundamental difference between a NumPy ndarray and a Pandas DataFrame?
A. NumPy is written in C whereas Pandas is written only in pure Python
B. A NumPy array must have a homogeneous data type across all elements, whereas a Pandas DataFrame can store different data types in different columns
C. Pandas DataFrames do not support mathematical operations
D. NumPy arrays can only be 1-dimensional
**Answer:** B
**Explanation:** NumPy arrays require all elements to share the same datatype (homogeneous), whereas each column of a Pandas DataFrame can have a different datatype (heterogeneous, e.g., string, float, integer).
---

### 2. What data structure represents a single column inside a Pandas DataFrame?
A. pd.Matrix
B. pd.Index
C. pd.Series
D. pd.Vector
**Answer:** C
**Explanation:** A Pandas DataFrame is architecturally a collection of 1-dimensional pd.Series objects sharing a common Index.
---

### 3. In Pandas, what does the parameter `axis=0` represent?
A. Operations applied horizontally across columns
B. Operations applied vertically down rows
C. Matrix transpose operation
D. Index resetting operation
**Answer:** B
**Explanation:** In Pandas, `axis=0` (or `axis='index'`) performs computations vertically down rows, whereas `axis=1` (or `axis='columns'`) acts across columns.
---

### 4. Which of the following is an immutable data structure used for row and column labels in Pandas?
A. pd.Index
B. pd.List
C. pd.Array
D. pd.Label
**Answer:** A
**Explanation:** pd.Index is an immutable sequence used to store axis labels for both Series and DataFrames, ensuring relational integrity and fast lookups.
---

### 5. Why is Pandas preferred over standard Python lists for data analysis tasks?
A. It provides vectorized C-level performance, rich tabular alignment, and built-in missing data handling
B. It requires less hard drive space during file downloads
C. It eliminates the need for Python variables
D. It only works on cloud servers
**Answer:** A
**Explanation:** Pandas uses Cython and NumPy under the hood to execute vectorized column operations at C speed, providing automatic label alignment and missing value handling that Python lists lack.
---
