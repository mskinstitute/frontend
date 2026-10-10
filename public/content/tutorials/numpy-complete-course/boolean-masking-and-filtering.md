# Boolean Masking & Conditional Filtering

In real-world data analysis, machine learning preprocessing, and scientific pipelines, one of the most frequent operations is extracting or mutating subsets of data based on specific conditions—such as removing outliers, selecting positive sensor readings, or filtering high-value financial transactions.

While standard Python requires list comprehensions, `filter()` functions, or explicit `for` loops with `if` conditions, **NumPy boolean masking** accomplishes this at bare-metal C-speed without generating intermediate Python objects.

---

## 1. What is a Boolean Mask?

A **Boolean mask** is a NumPy array consisting entirely of boolean values (`True` or `False`) that has the exact same shape (or a broadcastable shape) as the source array.

When you apply a relational comparison operator (such as `>`, `<`, `==`, `!=`, `>=`, `<=`) to a NumPy array, NumPy executes an element-wise comparison and returns a boolean array:

```python
import numpy as np

temperatures = np.array([28.5, 31.2, 24.0, 35.8, 19.4, 42.1, 30.0])

# Generate a boolean mask for heatwave days (temp > 30.0)
heatwave_mask = temperatures > 30.0
print("Mask:", heatwave_mask)
print("Mask dtype:", heatwave_mask.dtype)
```

**Output:**
```text
Mask: [False  True False  True False  True False]
Mask dtype: bool
```

---

## 2. Filtering Elements Using Boolean Masks

To extract the values that satisfy the condition, simply pass the boolean mask inside square brackets `[]` as if it were an index. NumPy extracts only the elements where the mask evaluates to `True`:

```python
# Extract temperatures above 30 degrees
hot_days = temperatures[heatwave_mask]
print("Heatwave temperatures:", hot_days)

# You can write this compactly inline in a single step:
freezing = temperatures[temperatures < 20.0]
print("Freezing temperatures:", freezing)
```

**Output:**
```text
Heatwave temperatures: [31.2 35.8 42.1]
Freezing temperatures: [19.4]
```

> **Key Takeaway:** Filtering with a boolean mask always returns a **1D array**, regardless of the dimensionality of the original array, because the number of elements matching the condition along each axis is usually non-uniform.

---

## 3. Combining Multiple Conditions: Bitwise vs Logical Operators

A common mistake made by Python developers transitioning to NumPy is attempting to use standard Python keywords `and`, `or`, and `not` with arrays.

In Python:
- `and` tests the truth value of the entire array object as a single whole, which raises a famous exception: `ValueError: The truth value of an array with more than one element is ambiguous. Use a.any() or a.all()`.
- NumPy requires **element-wise bitwise operators**:
  - `&` for Element-wise AND
  - `|` for Element-wise OR
  - `~` for Element-wise NOT (Inversion)
  - `^` for Element-wise XOR

Because Python's operator precedence evaluates comparison operators (`>`, `<`, `==`) **after** bitwise operators (`&`, `|`), **each condition MUST be enclosed in parentheses `()`.**

```python
scores = np.array([45, 78, 88, 92, 59, 63, 99, 32, 85])

# Find scores between 70 AND 90 (inclusive)
# Parentheses are mandatory!
honor_roll = scores[(scores >= 70) & (scores <= 90)]
print("Honor roll (70-90):", honor_roll)

# Find extreme outliers: scores < 40 OR scores > 95
outliers = scores[(scores < 40) | (scores > 95)]
print("Outliers:", outliers)

# Invert a condition using ~ (scores not failing, where fail is < 50)
failing_mask = scores < 50
passing_scores = scores[~failing_mask]
print("Passing scores:", passing_scores)
```

---

## 4. In-Place Conditional Mutation

Boolean masking is not only for reading data—it provides an ultra-fast way to mutate specific elements in-place:

```python
sensor_readings = np.array([-999.0, 23.4, 25.1, -999.0, 22.8, -999.0])

# Replace missing value sentinels (-999.0) with NaN or 0.0
sensor_readings[sensor_readings == -999.0] = np.nan
print("Cleaned readings:", sensor_readings)

# Cap outlier values (Winsorization)
prices = np.array([12, 45, 230, 89, 540, 15, 72])
prices[prices > 100] = 100
print("Capped prices (max 100):", prices)
```

---

## 5. Handling NaN and Infinite Values

In scientific datasets, data cleaning routinely involves testing for invalid floating-point values (`NaN` and `Inf`). Standard equality comparison `arr == np.nan` always returns `False` because IEEE 754 floating-point standards dictate that `NaN != NaN`.

NumPy provides specialized ufuncs for boolean checks:

```python
data = np.array([10.5, np.nan, 34.2, np.inf, -np.inf, 18.9])

print("Is NaN mask:", np.isnan(data))
print("Is Infinite mask:", np.isinf(data))
print("Is Finite mask:", np.isfinite(data))

# Extract only clean, valid, finite numbers:
valid_data = data[np.isfinite(data)]
print("Valid data points:", valid_data)
```

---

# Multiple Choice Questions

### 1. What does applying a comparison operator like `arr > 10` to a NumPy array produce?
A. A Python list of elements greater than 10
B. A boolean NumPy array of the same shape indicating element-wise truth values
C. A single boolean True or False representing if all elements exceed 10
D. A 1D array of integers containing indices where the condition is true
**Answer:** B
**Explanation:** Relational operators on ndarrays operate element-wise, yielding a boolean ndarray having the identical shape as the input where each position contains True or False.

---

### 2. Why does writing `arr[(arr > 5) and (arr < 15)]` raise a ValueError in NumPy?
A. The `and` keyword does not exist in Python syntax
B. Python's `and` evaluates the boolean truth of the entire array container rather than performing element-wise logical comparison
C. NumPy arrays only allow integer indices, not boolean expressions
D. Slicing syntax does not permit square brackets inside parentheses
**Answer:** B
**Explanation:** Python's logical `and` keyword evaluates truthiness on the operand object as a whole. Because an array with multiple values has ambiguous truthiness, NumPy raises ValueError. The bitwise `&` operator must be used instead.

---

### 3. Which operator is used in NumPy to invert a boolean mask (element-wise logical NOT)?
A. `not`
B. `!`
C. `~`
D. `^`
**Answer:** C
**Explanation:** The tilde operator `~` is the element-wise bitwise NOT operator used to invert boolean masks in NumPy.

---

### 4. What is the output shape when indexing a 2D array of shape (5, 4) with a boolean mask `arr > 0` that matches 7 elements?
A. (5, 4)
B. (7, 4)
C. (7,)
D. (1, 7)
**Answer:** C
**Explanation:** Filtering an N-dimensional array with a boolean mask always collapses the matched elements into a 1D array of shape `(K,)`, where `K` is the count of True entries in the mask.

---

### 5. How can you reliably filter out missing values (`NaN`) from a floating-point NumPy array `arr`?
A. `arr[arr != np.nan]`
B. `arr[np.isnan(arr)]`
C. `arr[~np.isnan(arr)]`
D. `arr[arr == None]`
**Answer:** C
**Explanation:** By IEEE 754 standard, `NaN != NaN` is always True, making direct equality comparison invalid. `np.isnan(arr)` identifies NaNs, and `~np.isnan(arr)` inverts the mask to select non-NaN elements.

---