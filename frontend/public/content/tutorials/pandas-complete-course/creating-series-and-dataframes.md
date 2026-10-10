# Creating Series & DataFrames from Scratch

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Creating a Pandas Series
A `pd.Series` can be created from Python lists, dictionaries, tuples, or NumPy arrays.

### A. From a Python List
```python
import pandas as pd

# Creating a series with custom string index
temperatures = pd.Series([32.5, 34.0, 31.8, 35.2], index=['Delhi', 'Agra', 'Noida', 'Mathura'], name='Temp_Celsius')
print(temperatures)
```

**Output:**
```text
Delhi      32.5
Agra       34.0
Noida      31.8
Mathura    35.2
Name: Temp_Celsius, dtype: float64
```

### B. From a Python Dictionary
When creating a Series from a dictionary, the dictionary **keys** automatically become the Series **Index**, and the dictionary values become the data:

```python
student_scores = {'Amit': 88, 'Sunita': 94, 'Kavita': 91, 'Rahul': 76}
scores_series = pd.Series(student_scores, name='Math_Score')
print(scores_series)
```

---

## 2. Creating DataFrames from Scratch

### Method 1: Dictionary of Lists / Arrays (Most Common)
Here, each key becomes a **Column Name**, and the corresponding list becomes the column values (all lists must be of equal length):

```python
data = {
    'Student_ID': [101, 102, 103, 104],
    'Name': ['Deepak', 'Ananya', 'Vikas', 'Pooja'],
    'City': ['Shikohabad', 'Firozabad', 'Agra', 'Lucknow'],
    'Marks': [85.5, 92.0, 78.5, 95.0]
}

df = pd.DataFrame(data)
print(df)
```

**Output:**
```text
   Student_ID    Name        City  Marks
0         101  Deepak  Shikohabad   85.5
1         102  Ananya   Firozabad   92.0
2         103   Vikas        Agra   78.5
3         104   Pooja     Lucknow   95.0
```

### Method 2: List of Dictionaries (Row-Oriented Format)
Often data comes from REST APIs or MongoDB as a list of JSON records:

```python
records = [
    {'Product': 'Laptop', 'Price': 55000, 'Stock': 12},
    {'Product': 'Mouse', 'Price': 650, 'Stock': 80},
    {'Product': 'Keyboard', 'Price': 1500, 'Stock': 45}
]

df_products = pd.DataFrame(records)
print(df_products)
```

### Method 3: From a 2D NumPy Array with Custom Columns
```python
import numpy as np

matrix = np.random.randint(10, 100, size=(3, 3))
df_matrix = pd.DataFrame(matrix, columns=['A', 'B', 'C'], index=['Row_1', 'Row_2', 'Row_3'])
print(df_matrix)
```

---

## 3. Essential Inspection Attributes
Once a DataFrame is instantiated, inspect its dimensions and metadata immediately:

```python
print(df.shape)    # (rows, columns) -> (4, 4)
print(df.columns)  # Index(['Student_ID', 'Name', 'City', 'Marks'], dtype='object')
print(df.index)    # RangeIndex(start=0, stop=4, step=1)
print(df.dtypes)   # Datatypes for each column
```

---

# Multiple Choice Questions

### 1. When creating a Pandas Series from a standard Python dictionary, what do the dictionary keys become?
A. The Series values
B. The Series Index labels
C. The Column names
D. The Series name
**Answer:** B
**Explanation:** When passing a dictionary to `pd.Series(dict_obj)`, the dictionary keys are mapped directly to the Series index labels.
---

### 2. If you construct a DataFrame from a dictionary of lists, what requirement must be satisfied?
A. All lists must contain only numerical data
B. All lists must have the exact same length
C. The dictionary must have at least 10 keys
D. The list values must be sorted alphabetically
**Answer:** B
**Explanation:** In a dictionary of lists passed to `pd.DataFrame()`, each list represents a column; therefore, all lists must be of equal length, otherwise Pandas raises a `ValueError: All arrays must be of the same length`.
---

### 3. Which attribute returns a tuple representing the dimensionality (rows, columns) of a DataFrame?
A. `df.size`
B. `df.shape`
C. `df.ndim`
D. `df.dim`
**Answer:** B
**Explanation:** `df.shape` returns a tuple `(number_of_rows, number_of_columns)`.
---

### 4. What is the output of `df.dtypes`?
A. A list of all unique values in the dataset
B. The data type of each column in the DataFrame
C. The memory size of the DataFrame in bytes
D. The first 5 rows of the DataFrame
**Answer:** B
**Explanation:** `df.dtypes` returns a Series containing the data type (e.g. `int64`, `float64`, `object`) of each individual column.
---

### 5. What does the `df.head(3)` method do?
A. Returns the top 3 rows of the DataFrame
B. Returns the top 3 columns of the DataFrame
C. Deletes the first 3 rows
D. Renames the first 3 columns
**Answer:** A
**Explanation:** The `.head(n)` method returns the first `n` rows (defaulting to 5 if `n` is omitted).
---
