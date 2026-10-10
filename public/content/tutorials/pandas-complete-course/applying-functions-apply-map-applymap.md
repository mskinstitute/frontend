# Applying Custom Functions (apply, map, applymap)

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. When Vectorization Isn't Enough
Pandas built-in vectorized operations are always the fastest approach. However, real-world business logic often requires custom branching (e.g. tax calculations, complex regex transformations, or calling external APIs). For these tasks, Pandas provides:
- **`Series.map()`**: Map values of a Series using a dictionary or 1-to-1 function.
- **`Series.apply()`** / **`DataFrame.apply()`**: Apply arbitrary functions across a Series or along DataFrame axes.
- **`DataFrame.map()`** (formerly `applymap` in older Pandas): Apply a function element-wise across the entire table.

---

## 2. Using `Series.map()` for Value Substitution
```python
import pandas as pd

df = pd.DataFrame({
    'Employee': ['Aarav', 'Priya', 'Rohan'],
    'Gender_Code': ['M', 'F', 'M'],
    'Grade': ['A', 'B', 'A']
})

# Dictionary mapping for quick translation
gender_map = {'M': 'Male', 'F': 'Female'}
df['Gender'] = df['Gender_Code'].map(gender_map)
print(df)
```

---

## 3. Using `Series.apply()` with Custom Functions & Lambdas
```python
def calculate_tax(salary):
    if salary > 100000:
        return salary * 0.30
    elif salary > 50000:
        return salary * 0.20
    else:
        return salary * 0.05

df_salaries = pd.DataFrame({'Emp': ['A', 'B', 'C'], 'Salary': [120000, 65000, 40000]})

# Apply custom function to Salary column
df_salaries['Tax_INR'] = df_salaries['Salary'].apply(calculate_tax)

# Or with an inline lambda function
df_salaries['Take_Home'] = df_salaries.apply(lambda row: row['Salary'] - row['Tax_INR'], axis=1)
print(df_salaries)
```

> **CRITICAL TIP:** When applying a function across multiple columns of a single row, pass **`axis=1`** so the lambda receives the row as a Series!

---

## 4. Performance Warning: The Cost of `apply()`
Unlike native vectorized methods (which run compiled in C), `.apply()` is effectively a Python-level loop under the hood. 

Always prefer native vectorized math where possible:
- **Fast:** `df['Total'] = df['Price'] * df['Qty']` (Vectorized C speed)
- **Slow:** `df['Total'] = df.apply(lambda r: r['Price'] * r['Qty'], axis=1)` (Python loop speed)

---

# Multiple Choice Questions

### 1. Which method is best suited for replacing values in a Series using a dictionary lookup table?
A. `Series.map()`
B. `Series.dict_replace()`
C. `Series.lookup()`
D. `Series.swap()`
**Answer:** A
**Explanation:** `Series.map(dict_obj)` maps existing values to new values using key-value pairs in a dictionary.
---

### 2. When calling `df.apply(custom_func, axis=1)`, what does the function receive as its argument?
A. Each column as a Series
B. Each row as a Series
C. A single scalar integer
D. The entire DataFrame at once
**Answer:** B
**Explanation:** Passing `axis=1` applies the function row-by-row, passing each row to `custom_func`.
---

### 3. In Pandas 2.1+, which method replaces the deprecated `DataFrame.applymap()` for applying a function element-wise to every cell in a DataFrame?
A. `df.map()`
B. `df.cell_apply()`
C. `df.transform_all()`
D. `df.element_wise()`
**Answer:** A
**Explanation:** Starting in Pandas 2.1.0, `DataFrame.applymap()` was deprecated in favor of the unified `DataFrame.map()`.
---

### 4. Why should you avoid using `df.apply(..., axis=1)` for simple arithmetic operations like `Col_A + Col_B`?
A. It produces inaccurate floating-point results
B. It is a slow Python-level iteration that is significantly slower than native vectorized column addition
C. It deletes the index
D. It only works on string columns
**Answer:** B
**Explanation:** Vectorized column arithmetic (`df['A'] + df['B']`) executes in optimized C/NumPy memory; `apply(axis=1)` invokes a Python function for every row.
---

### 5. What will `pd.Series(['delhi', 'mumbai']).apply(str.upper)` return?
A. `['DELHI', 'MUMBAI']`
B. `['delhi', 'mumbai']`
C. `['Delhi', 'Mumbai']`
D. An error
**Answer:** A
**Explanation:** `apply(str.upper)` executes Python's built-in `str.upper` function on every string in the Series.
---
