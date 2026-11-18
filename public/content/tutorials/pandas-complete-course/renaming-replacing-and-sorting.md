---
id: renaming-replacing-and-sorting
slug: renaming-replacing-and-sorting
course: pandas-complete-course
chapter: "5: Data Transformation & String Operations"
topic: "5.3 Renaming Columns, Replacing Values & Sorting"
title: "Renaming Columns, Replacing Values & Sorting"
description: "Learn Renaming Columns, Replacing Values & Sorting in Pandas with practical examples, analyst workflows, and interactive practice quizzes at MSK Institute."
difficulty: Intermediate
readingTime: 6
order: 3
keywords:
  - renaming columns replacing values sorting
  - pandas tutorial
  - renaming replacing and sorting
  - data analysis course
  - MSK Institute
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

---

## 1. Renaming Columns & Index Labels (`rename`)
Often raw datasets come with messy column names containing spaces, typos, or special characters. Use `df.rename()`:

```python
import pandas as pd

df = pd.DataFrame({
    'emp id': [101, 102, 103],
    'emp_name': ['Amit', 'Sunita', 'Karan'],
    'sal': [50000, 75000, 62000]
})

# Renaming specific columns using a dictionary
df_renamed = df.rename(columns={
    'emp id': 'Employee_ID',
    'emp_name': 'Full_Name',
    'sal': 'Salary_INR'
})
print(df_renamed)
```

### Bulk Column Renaming (Sanitizing All Headers):
```python
# Clean all column names: lowercase and replace spaces with underscores
df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
```

---

## 2. Replacing Values Across Columns (`replace`)
The `.replace()` method searches and replaces specific values across a Series or entire DataFrame:

```python
# Replace legacy department codes with full names
df['Department'] = df['Department'].replace({
    'MKT': 'Marketing',
    'FIN': 'Finance',
    'ENG': 'Engineering'
})
```

---

## 3. Sorting Data in Pandas

### A. Sorting by Column Values (`sort_values`)
```python
# Sort by Salary descending
df_sorted = df.sort_values(by='Salary_INR', ascending=False)

# Multi-column sorting: First by Department (Ascending), then by Salary (Descending)
df_multi_sort = df.sort_values(
    by=['Department', 'Salary_INR'],
    ascending=[True, False]
)
```

### B. Sorting by Index Labels (`sort_index`)
After filtering or grouping operations, restore original sequential index ordering:
```python
df_restored = df.sort_index(ascending=True)
```

---

## 4. Inspecting Extremes: `nlargest` & `nsmallest`
Instead of sorting a 10-million row table just to find the top 5 earners, use the optimized `nlargest()` method:

```python
# Top 5 highest earners
top_5 = df.nlargest(5, 'Salary_INR')

# 3 lowest revenue products
bottom_3 = df.nsmallest(3, 'Revenue')
```

---

## Practice Quiz
### 1. Which parameter in `df.sort_values()` determines whether sorting is lowest-to-highest or highest-to-lowest?
A. `reverse=True`
B. `ascending=True`
C. `direction='up'`
D. `order='desc'`
**Answer:** B
**Explanation:** `ascending=True` sorts in ascending order (default), while `ascending=False` sorts in descending order.
---

### 2. How can you rename the column `'old_col'` to `'new_col'` in a DataFrame?
A. `df.rename(columns={'old_col': 'new_col'})`
B. `df.change_name('old_col', 'new_col')`
C. `df.columns.replace('old_col', 'new_col')`
D. `df.set_column('old_col', 'new_col')`
**Answer:** A
**Explanation:** `df.rename(columns={'old_name': 'new_name'})` renames specific columns via a dictionary mapping.
---

### 3. Which method efficiently retrieves the top 10 highest rows based on a specific column without sorting the entire dataset?
A. `df.nlargest(10, 'col_name')`
B. `df.top(10, 'col_name')`
C. `df.max_rows(10)`
D. `df.get_highest(10)`
**Answer:** A
**Explanation:** `df.nlargest(n, 'column')` uses an internal heap queue algorithm to return the top `n` rows faster than a full sort.
---

### 4. If you want to sort by 'Department' ascending and 'Salary' descending simultaneously, what syntax is used?
A. `df.sort_values(by=['Department', 'Salary'], ascending=[True, False])`
B. `df.sort_values('Department', 'Salary', reverse=[False, True])`
C. `df.sort(['Department+', 'Salary-'])`
D. Multiple sorting cannot be done in one command
**Answer:** A
**Explanation:** You can pass lists to both `by` and `ascending` parameters to specify individual sort directions per column.
---

### 5. What does `df.sort_index()` do?
A. Sorts the rows based on the index labels rather than the column values
B. Generates a new index
C. Removes the index
D. Sorts column names alphabetically
**Answer:** A
**Explanation:** `sort_index()` re-orders rows according to their index labels (e.g. alphabetically or chronologically).
---
