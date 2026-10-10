# Stacking Arrays: np.vstack(), np.hstack(), & np.concatenate()

Combining multiple datasets, merging feature matrices with target labels, and assembling image tiles are fundamental tasks in numerical data pipelines.

NumPy provides specialized functions to combine arrays along existing or new axes:
- `np.concatenate()`: The generalized foundational routine.
- `np.vstack()`: Vertical stacking (row-wise / along axis 0).
- `np.hstack()`: Horizontal stacking (column-wise / along axis 1).

![NumPy Reshaping and Stacking](/images/tutorials/numpy/reshaping-stacking-splitting.svg)

---

## 1. General Array Concatenation: `np.concatenate()`

`np.concatenate((a1, a2, ...), axis=0)` joins a sequence of arrays along an **existing axis**. All input arrays must have the exact same shape, except in the dimension corresponding to `axis`:

```python
import numpy as np

A = np.array([[1, 2],
              [3, 4]])

B = np.array([[5, 6],
              [7, 8]])

# Concatenate vertically along axis 0 (rows)
concat_axis0 = np.concatenate((A, B), axis=0)
print("Concatenate axis 0 (Shape:", concat_axis0.shape, "):
", concat_axis0)

# Concatenate horizontally along axis 1 (columns)
concat_axis1 = np.concatenate((A, B), axis=1)
print("
Concatenate axis 1 (Shape:", concat_axis1.shape, "):
", concat_axis1)
```

**Output:**
```text
Concatenate axis 0 (Shape: (4, 2) ):
 [[1 2]
 [3 4]
 [5 6]
 [7 8]]

Concatenate axis 1 (Shape: (2, 4) ):
 [[1 2 5 6]
 [3 4 7 8]]
```

---

## 2. Vertical Stacking: `np.vstack()`

`np.vstack()` stacks arrays vertically (row on top of row). For 2D arrays, this is equivalent to `np.concatenate(..., axis=0)`.

Crucially, for **1D arrays**, `np.vstack()` treats them as rows of shape `(1, N)` and stacks them into a 2D matrix:

```python
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])

# Stacking 1D arrays vertically creates a 2D array of shape (2, 3)
v_stacked = np.vstack((x, y))
print("vstack 1D arrays:
", v_stacked)
print("Shape:", v_stacked.shape)
```

**Output:**
```text
vstack 1D arrays:
 [[1 2 3]
 [4 5 6]]
Shape: (2, 3)
```

---

## 3. Horizontal Stacking: `np.hstack()`

`np.hstack()` stacks arrays horizontally (column next to column).

- For **2D arrays**, it stacks along columns (equivalent to `np.concatenate(..., axis=1)`).
- For **1D arrays**, it concatenates them end-to-end into a longer 1D array:

```python
# For 1D arrays: concatenates along the single axis
h_1d = np.hstack((x, y))
print("hstack 1D arrays:", h_1d)  # [1 2 3 4 5 6]
print("Shape:", h_1d.shape)        # (6,)

# For 2D arrays: stacks side-by-side
M1 = np.ones((2, 2))
M2 = np.zeros((2, 3))
h_2d = np.hstack((M1, M2))
print("
hstack 2D arrays:
", h_2d)
print("Shape:", h_2d.shape)        # (2, 5)
```

---

## 4. Dimensional Alignment Rules and Common Pitfalls

When concatenating or stacking arrays, shape mismatches along non-concatenating axes raise `ValueError`:

```python
A = np.ones((3, 4))
B = np.ones((2, 5))

# Attempting to vstack A (4 cols) and B (5 cols) will fail:
try:
    np.vstack((A, B))
except ValueError as e:
    print("Alignment Error:", e)
    # Output: all the input array dimensions for the concatenation
    # axis must match exactly, but along dimension 1,
    # the array at index 0 has size 4 and the array at index 1 has size 5
```

---

# Multiple Choice Questions

### 1. What is the required argument format for arrays passed to `np.concatenate()`?
A. Individual positional arguments: `np.concatenate(a, b, c)`
B. A tuple or list sequence: `np.concatenate((a, b, c))`
C. A dictionary of arrays
D. A single string specifying the variable names
**Answer:** B
**Explanation:** `np.concatenate` expects a sequence (tuple or list) of arrays as its first parameter, such as `np.concatenate((a, b), axis=0)`.

---

### 2. What is the resulting shape when executing `np.vstack((np.array([1, 2, 3]), np.array([4, 5, 6])))`?
A. (6,)
B. (2, 3)
C. (3, 2)
D. (1, 6)
**Answer:** B
**Explanation:** `np.vstack` promotes 1D arrays of shape `(N,)` to 2D row arrays of shape `(1, N)` and concatenates them vertically, resulting in shape `(2, 3)`.

---

### 3. What is the resulting shape when executing `np.hstack((np.array([1, 2, 3]), np.array([4, 5, 6])))`?
A. (6,)
B. (2, 3)
C. (1, 6)
D. (3, 2)
**Answer:** A
**Explanation:** For 1D arrays, `np.hstack` performs simple end-to-end concatenation along the single existing axis, yielding a 1D array of shape `(6,)`.

---

### 4. Given 2D arrays `A` of shape (3, 4) and `B` of shape (3, 2), which function will successfully combine them?
A. `np.vstack((A, B))`
B. `np.hstack((A, B))`
C. `np.concatenate((A, B), axis=0)`
D. None; their shapes are incompatible
**Answer:** B
**Explanation:** To stack horizontally along axis 1, the row dimensions (axis 0) must match. Both `A` and `B` have 3 rows, so `np.hstack` produces a combined array of shape `(3, 6)`.

---

### 5. How does `np.concatenate((a, b), axis=None)` behave?
A. It raises a ValueError
B. It flattens all input arrays before concatenating them into a 1D array
C. It stacks them along a newly created dimension
D. It performs matrix multiplication
**Answer:** B
**Explanation:** When `axis=None`, `np.concatenate()` automatically flattens all input arrays and concatenates them into a single 1D array.

---