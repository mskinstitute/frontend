# Boolean Indexing & DataFrame Querying

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Boolean Indexing?
**Boolean Indexing** (also called filtering or masking) is the process of selecting rows based on specific conditions applied to column values. It is the Python equivalent of SQL's `WHERE` clause.

---

## 2. Basic Single-Condition Filtering
When you evaluate a comparison condition on a Series, Pandas returns a Boolean Series of `True` and `False` values:

```python
import pandas as pd

df = pd.DataFrame({
    'Name': ['Aarav', 'Priya', 'Rohan', 'Sneha', 'Deepak'],
    'Department': ['IT', 'HR', 'IT', 'Finance', 'IT'],
    'Salary': [65000, 48000, 82000, 54000, 71000],
    'Age': [26, 31, 35, 29, 24]
})

# Condition: Employees with Salary > 60,000
high_salary_mask = df['Salary'] > 60000

# Apply the mask to the DataFrame
high_earners = df[high_salary_mask]
print(high_earners)
```

---

## 3. Multiple Conditions: The `&` (AND) and `|` (OR) Operators

### CRITICAL RULES for Compound Filtering in Pandas:
1. Use **bit-wise operators**: `&` (AND), `|` (OR), `~` (NOT).
2. Do **NOT** use Python's `and` / `or` / `not` keywords.
3. Every individual condition **MUST be wrapped in parentheses `(...)`** due to Python operator precedence.

```python
# AND condition: IT Department AND Salary > 70,000
it_seniors = df[(df['Department'] == 'IT') & (df['Salary'] > 70000)]

# OR condition: Department is HR OR Age < 25
mixed_group = df[(df['Department'] == 'HR') | (df['Age'] < 25)]

# NOT condition: Employees NOT in IT
non_it = df[~(df['Department'] == 'IT')]
```

---

## 4. Convenient Filtering Methods

### A. `.isin()` (SQL `IN` Equivalent)
Instead of chaining multiple `|` conditions:
```python
target_depts = ['HR', 'Finance']
filtered_df = df[df['Department'].isin(target_depts)]
```

### B. `.between()` (SQL `BETWEEN` Equivalent)
```python
# Salaries between 50,000 and 75,000 (inclusive by default)
mid_tier = df[df['Salary'].between(50000, 75000)]
```

---

## 5. Clean Querying with `df.query()`
For cleaner syntax without repetitive `df['col']` references, use `.query()`:

```python
# Readability is clean like SQL!
result = df.query("Department == 'IT' and Salary > 70000")

# Referencing external Python variables with @ symbol
min_sal = 60000
result2 = df.query("Salary >= @min_sal and Age < 30")
```

---

# Multiple Choice Questions

### 1. Which operator must be used for logical AND when combining Boolean conditions in Pandas?
A. `and`
B. `&&`
C. `&`
D. `AND`
**Answer:** C
**Explanation:** In Pandas, bitwise `&` is required for element-wise Boolean AND operations across Series.
---

### 2. Why must individual conditions be enclosed in parentheses when combining masks, such as `(df['A'] > 5) & (df['B'] < 10)`?
A. Because Python's bitwise `&` has higher precedence than comparison operators `>` and `<`
B. It is required only for formatting
C. To prevent memory overflow
D. Because Pandas requires all functions to have brackets
**Answer:** A
**Explanation:** Without parentheses, Python evaluates `5 & df['B']` first due to operator precedence, which triggers a TypeError or ValueError.
---

### 3. What is the Pandas equivalent of the SQL clause `WHERE City IN ('Delhi', 'Mumbai', 'Noida')`?
A. `df['City'].contains(['Delhi', 'Mumbai', 'Noida'])`
B. `df['City'].isin(['Delhi', 'Mumbai', 'Noida'])`
C. `df['City'].match(['Delhi', 'Mumbai', 'Noida'])`
D. `df['City'].in_list(['Delhi', 'Mumbai', 'Noida'])`
**Answer:** B
**Explanation:** The `.isin()` method checks if elements are contained within a passed sequence.
---

### 4. When using `df.query()`, what prefix is used to refer to a Python variable defined in the local environment?
A. `$`
B. `#`
C. `@`
D. `:`
**Answer:** C
**Explanation:** The `@` symbol (e.g. `df.query("Salary > @min_salary")`) allows referencing local Python variables inside query strings.
---

### 5. What does the tilde operator `~` represent in Boolean masking?
A. Bitwise XOR
B. Logical NOT (inverts True to False and vice-versa)
C. Regular expression match
D. Approximate equality
**Answer:** B
**Explanation:** The tilde `~` negates a Boolean mask, filtering rows where the condition is False.
---
