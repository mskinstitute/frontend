# Array Reshaping with reshape() & -1 Dimension

In machine learning models, computer vision pipelines, and matrix algebra, manipulating the dimensions and geometric layout of arrays is a ubiquitous daily requirement. For instance, a neural network layer may require flattening a 2D image matrix of `(28, 28)` pixels into a 1D vector of `784` features, or batching `1000` samples into mini-batches of `(32, 10, 10)`.

NumPy's `reshape()` method allows you to change the shape of an array without changing its underlying data or reallocating memory.

![NumPy Reshaping and Stacking](/images/tutorials/numpy/reshaping-stacking-splitting.svg)

---

## 1. The Fundamental Invariant of Reshaping

The cardinal rule of reshaping is that **the total number of elements (the product of dimension sizes) must remain strictly identical before and after the reshape operation**:

$$\prod_{i} \text{old\_shape}[i] = \prod_{j} \text{new\_shape}[j] = \text{total\_elements}$$

```python
import numpy as np

# Create a 1D array of 12 elements (indices 0 to 11)
a = np.arange(12)
print("Original shape:", a.shape)  # (12,)

# Reshape into a 3x4 matrix (3 * 4 = 12)
matrix_3x4 = a.reshape(3, 4)
print("3x4 Matrix:
", matrix_3x4)

# Reshape into a 2x2x3 3D tensor (2 * 2 * 3 = 12)
tensor_3d = a.reshape(2, 2, 3)
print("2x2x3 Tensor:
", tensor_3d)
```

### Incompatible Shapes Raise ValueError
If you attempt to reshape an array of 12 elements into a shape whose product is not 12 (e.g. `(3, 5)` which requires 15 elements), NumPy raises an exception:

```python
# Raises: ValueError: cannot reshape array of size 12 into shape (3,5)
try:
    a.reshape(3, 5)
except ValueError as e:
    print("Caught Error:", e)
```

---

## 2. Dynamic Dimension Deduction with `-1`

Calculating dimension sizes manually becomes tedious and error-prone when processing dynamic datasets with variable batch sizes. NumPy allows you to specify **`-1` for exactly one dimension**. NumPy will automatically deduce the required size for that dimension by dividing the total element count by the product of the remaining dimensions:

```python
raw_data = np.arange(60)

# Reshape into 5 rows, automatically deduce columns (60 / 5 = 12)
grid1 = raw_data.reshape(5, -1)
print("grid1 shape:", grid1.shape)  # (5, 12)

# Reshape into 4 columns, automatically deduce rows (60 / 4 = 15)
grid2 = raw_data.reshape(-1, 4)
print("grid2 shape:", grid2.shape)  # (15, 4)

# Automatically deduce depth in a 3D volume
volume = raw_data.reshape(3, 4, -1)
print("volume shape:", volume.shape)  # (3, 4, 5)
```

> **Rule:** You can only provide `-1` for **at most one** dimension. Specifying `arr.reshape(-1, -1)` will raise `ValueError: can only specify one unknown dimension`.

---

## 3. Memory Layout: C-Order vs Fortran-Order

When reshaping, the order in which elements are read from and written to the dimensions matters:

- **C-Style (`order='C'`, Default):** Row-major order. The last index changes fastest (rows are filled left-to-right before moving to the next row). Matches C, C++, and Python conventions.
- **Fortran-Style (`order='F'`):** Column-major order. The first index changes fastest (columns are filled top-to-bottom before moving to the next column). Matches Fortran, MATLAB, and R conventions.

```python
v = np.arange(1, 7)

# C-order (Default)
c_matrix = v.reshape((2, 3), order='C')
print("C-order:
", c_matrix)

# Fortran-order
f_matrix = v.reshape((2, 3), order='F')
print("Fortran-order:
", f_matrix)
```

**Output:**
```text
C-order:
 [[1 2 3]
 [4 5 6]]

Fortran-order:
 [[1 3 5]
 [2 4 6]]
```

---

## 4. Does `reshape()` Return a View or a Copy?

In almost all standard cases where the memory buffer is contiguous, **`reshape()` returns a VIEW** of the original data. Modifying elements of the reshaped array modifies the original array:

```python
original = np.array([1, 2, 3, 4, 5, 6])
reshaped = original.reshape(2, 3)

# Mutate an element in the reshaped view
reshaped[0, 0] = 999

print("Original array:", original)
print("Shared base:", reshaped.base is original)
```

**Output:**
```text
Original array: [999   2   3   4   5   6]
Shared base: True
```

> If an array has been heavily sliced or transposed such that its memory is non-contiguous, `reshape()` may be forced to allocate a copy to satisfy the new stride layout.

---

# Multiple Choice Questions

### 1. What is the fundamental requirement when reshaping an array using `arr.reshape(new_shape)`?
A. The number of dimensions must always increase
B. The product of the dimensions in `new_shape` must equal `arr.size`
C. The dtype of the array must be floating point
D. The new shape must be a square matrix
**Answer:** B
**Explanation:** Reshaping reorganizes the existing elements into a new coordinate layout without altering the total count. Therefore, the product of the new dimensions must strictly match the array's total size (`arr.size`).

---

### 2. How many dimensions can be set to `-1` in a single `reshape()` call?
A. Any number of dimensions
B. Up to two dimensions
C. Exactly one dimension
D. None; `-1` is not valid syntax
**Answer:** C
**Explanation:** `-1` acts as a placeholder telling NumPy to calculate the dimension dynamically. Because multiple unknown dimensions would create an indeterminate equation, only one dimension can be set to `-1`.

---

### 3. What is the inferred shape when calling `np.arange(24).reshape(2, -1, 3)`?
A. (2, 4, 3)
B. (2, 6, 3)
C. (2, 12, 3)
D. (2, 2, 3)
**Answer:** A
**Explanation:** The total elements are 24. The product of known dimensions is `2 * 3 = 6`. Therefore, the unknown dimension is calculated as `24 / 6 = 4`, resulting in shape `(2, 4, 3)`.

---

### 4. What is the default memory ordering used by `reshape()` if the `order` parameter is omitted?
A. Column-major ('F')
B. Row-major ('C')
C. Zig-zag order ('Z')
D. Diagonal order ('D')
**Answer:** B
**Explanation:** By default, NumPy uses C-contiguous row-major order (`order='C'`), where the last index varies fastest.

---

### 5. In standard contiguous memory, what does `arr.reshape(...)` return?
A. A completely independent deep copy
B. A view pointing to the exact same underlying memory buffer
C. A Python list
D. A memory-mapped file descriptor
**Answer:** B
**Explanation:** As long as memory strides permit, `reshape()` constructs a new ndarray header (view) that shares the underlying memory buffer with zero data copying.

---