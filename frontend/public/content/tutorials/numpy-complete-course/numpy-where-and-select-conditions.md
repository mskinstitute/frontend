# Conditional Selection with np.where() & np.select()

Conditional logic is the backbone of data engineering and scientific pipelines. Often, you need to assign values depending on whether conditions are met—similar to Excel's `IF()` function or SQL's `CASE WHEN ... THEN ... ELSE` statements.

NumPy provides two workhorses for conditional operations:
1. `np.where()`: Vectorized ternary operator `if-else` and index extraction.
2. `np.select()`: Scalable multi-condition decision tables for complex business logic.

---

## 1. Vectorized If-Else with `np.where(condition, x, y)`

The ternary syntax of `np.where` takes three arguments:
`np.where(condition, value_if_true, value_if_false)`

Both `value_if_true` and `value_if_false` can be scalar constants or entire arrays of matching shape:

```python
import numpy as np

exam_scores = np.array([55, 82, 38, 91, 74, 49, 66])

# Assign "Pass" or "Fail" based on score >= 50
results = np.where(exam_scores >= 50, "Pass", "Fail")
print("Status:", results)

# Numeric conditional: add 5 bonus points if score < 50, else leave unchanged
adjusted_scores = np.where(exam_scores < 50, exam_scores + 5, exam_scores)
print("Adjusted scores:", adjusted_scores)
```

**Output:**
```text
Status: ['Pass' 'Pass' 'Fail' 'Pass' 'Pass' 'Fail' 'Pass']
Adjusted scores: [55 82 43 91 74 54 66]
```

---

## 2. Using `np.where(condition)` to Extract Indices

When called with **only one argument** (the condition), `np.where()` acts as an index finder, returning a tuple of coordinate arrays where the condition evaluates to `True`:

```python
voltages = np.array([1.2, 3.8, 5.5, 0.4, 4.9, 5.1])

# Locate indices where voltage exceeds 4.5V
spike_indices = np.where(voltages > 4.5)
print("Indices of voltage spikes:", spike_indices)
print("Actual values:", voltages[spike_indices])
```

**Output:**
```text
Indices of voltage spikes: (array([2, 4, 5], dtype=int64),)
Actual values: [5.5 4.9 5.1]
```

### In 2D Matrices:
In a 2D array, `np.where()` returns a tuple of `(row_indices, col_indices)`:

```python
grid = np.array([
    [10, 95, 20],
    [85, 30, 90]
])

rows, cols = np.where(grid > 80)
print("Rows matching:", rows)
print("Cols matching:", cols)

for r, c in zip(rows, cols):
    print(f"Match found at ({r}, {c}) with value {grid[r, c]}")
```

---

## 3. Multi-Condition Logic with `np.select()`

When your logic involves more than two outcomes (e.g. grading scale A, B, C, D, F), nesting `np.where()` calls quickly turns into unreadable spaghetti code:

```python
# Bad practice: Nested np.where is unreadable
# np.where(c1, a, np.where(c2, b, np.where(c3, c, d)))
```

Instead, use `np.select(condlist, choicelist, default=default_value)`:

```python
ages = np.array([5, 16, 25, 68, 72, 14, 42, 80])

# Define the ordered list of conditions
conditions = [
    ages < 13,                # Child
    (ages >= 13) & (ages < 20),# Teenager
    (ages >= 20) & (ages < 65),# Adult
    ages >= 65                # Senior
]

# Define the corresponding choices
choices = [
    "Child",
    "Teenager",
    "Adult",
    "Senior"
]

# Evaluate cleanly in priority order
categories = np.select(conditions, choices, default="Unknown")
print("Age categories:", categories)
```

**Output:**
```text
Age categories: ['Child' 'Teenager' 'Adult' 'Senior' 'Senior' 'Teenager' 'Adult' 'Senior']
```

### Real-World Business Example: Progressive Tax Rates
```python
incomes = np.array([25000, 65000, 120000, 450000, 80000])

tax_conditions = [
    incomes <= 30000,
    (incomes > 30000) & (incomes <= 100000),
    incomes > 100000
]

tax_rates = [
    incomes * 0.05,
    incomes * 0.15,
    incomes * 0.28
]

total_taxes = np.select(tax_conditions, tax_rates, default=0.0)
print("Tax liability per bracket:
", total_taxes)
```

---

# Multiple Choice Questions

### 1. What does `np.where(arr > 5, 1, 0)` return?
A. A tuple of row and column indices where elements exceed 5
B. A new array where elements > 5 become 1 and all other elements become 0
C. A boolean mask
D. The count of elements greater than 5
**Answer:** B
**Explanation:** When passed three arguments `(condition, x, y)`, `np.where` performs element-wise conditional selection, picking `x` when True and `y` when False.

---

### 2. What is returned when `np.where(condition)` is called with only ONE argument?
A. A boolean array
B. A tuple of index arrays indicating where the condition is True
C. The sum of all elements matching the condition
D. An error requiring 3 parameters
**Answer:** B
**Explanation:** Calling `np.where` with only a condition is equivalent to `np.nonzero(condition)`, returning a tuple of integer index arrays along each axis for all True positions.

---

### 3. Why is `np.select()` preferred over nested `np.where()` calls for 3 or more branches?
A. `np.select` is written in Fortran while `np.where` is written in Python
B. `np.select` avoids deeply nested syntactical complexity and evaluates conditions sequentially with clear paired lists
C. `np.select` supports string inputs whereas `np.where` only supports floats
D. `np.where` cannot be chained more than twice
**Answer:** B
**Explanation:** `np.select(condlist, choicelist, default)` mirrors SQL `CASE WHEN` logic, keeping code linear, readable, and maintainable when handling complex decision branches.

---

### 4. Given `arr = np.array([10, 20, 30])`, what is the output of `np.where(arr > 15)[0]`?
A. `array([1, 2])`
B. `array([20, 30])`
C. `array([True, True])`
D. `2`
**Answer:** A
**Explanation:** Elements at index 1 (20) and index 2 (30) exceed 15. `np.where(arr > 15)` returns `(array([1, 2]),)`, so accessing `[0]` yields the 1D index array `[1, 2]`.

---

### 5. In `np.select(conditions, choices, default=0)`, what happens if an element satisfies multiple conditions simultaneously?
A. A ValueError is thrown
B. The first condition in the list that evaluates to True determines the selected choice
C. All matching choices are added together
D. The default value is selected
**Answer:** B
**Explanation:** `np.select` checks conditions in the specified list order. The first matching condition encountered selects the corresponding choice, short-circuiting subsequent conditions for that element.

---