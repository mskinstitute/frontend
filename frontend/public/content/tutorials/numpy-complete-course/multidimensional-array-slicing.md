# Multi-Dimensional Array Slicing (Row, Column & Matrix Slices)

In multi-dimensional arrays, slicing generalizes across multiple axes. Unlike standard Python (which requires clumsy chained brackets like `matrix[row][col]`), NumPy allows clean comma-separated slicing along every axis simultaneously: **`arr[row_slice, col_slice]`**.

---

## 1. The 2D Coordinate Syntax: arr[rows, cols]

In a 2D matrix:
* **Axis 0** represents **Rows** (vertical dimension).
* **Axis 1** represents **Columns** (horizontal dimension).

```python
import numpy as np

# Create a 4x5 matrix (4 rows, 5 columns)
grid = np.array([
    [10, 11, 12, 13, 14],
    [20, 21, 22, 23, 24],
    [30, 31, 32, 33, 34],
    [40, 41, 42, 43, 44]
])

# Extract a single element at Row 2, Column 3
print(grid[2, 3])  # 33
```

![Multi-Dimensional Array Slicing Grid](/images/tutorials/numpy/indexing-slicing-strides.svg)

---

## 2. Extracting Complete Rows and Columns

By using a lone colon `:` for an axis, you select all elements along that dimension:

```python
# Extract entire Row 1 (all columns)
row_1 = grid[1, :]
print(row_1)  # [20 21 22 23 24]

# Extract entire Column 2 (all rows)
col_2 = grid[:, 2]
print(col_2)  # [12 22 32 42]
```

---

## 3. Sub-Matrix Slicing (2D Blocks)

You can slice rows and columns simultaneously to extract sub-grids:

```python
# Extract Rows 1 to 3 (exclusive) and Columns 1 to 4 (exclusive)
sub_block = grid[1:3, 1:4]
print(sub_block)
# [[21 22 23]
#  [31 32 33]]
```

---

## 4. Preserving Dimensions vs Reducing Dimensions

Notice the subtle difference between slicing with a single integer versus a slice range:

```python
# Case A: Dimensionality Reduction (Returns 1D array)
r1 = grid[0, :]
print(r1.shape)  # (5,) -> ndim reduced from 2 to 1!

# Case B: Dimensionality Preserved (Returns 2D array with 1 row)
r2 = grid[0:1, :]
print(r2.shape)  # (1, 5) -> ndim remains 2!
```
*In machine learning algorithms and neural networks, keeping rank-2 shapes `(1, 5)` is often mandatory for matrix multiplication!*

---

## 5. The Ellipsis Operator (...)

When slicing arrays with 4, 5, or more dimensions (such as video frames: `[batch, frames, height, width, channels]`), writing colons for every axis becomes tedious. The **Ellipsis (`...`)** automatically expands to as many full-slice colons `:` as needed:

```python
video = np.zeros((32, 100, 1080, 1920, 3))

# Select only the Red channel (channel 0) across all batches, frames, height, and width:
red_channel = video[..., 0]  # Equivalent to video[:, :, :, :, 0]
print(red_channel.shape)     # (32, 100, 1080, 1920)
```

---

# Multiple Choice Questions

### 1. In a 2D NumPy array 'arr', how do you extract the entire third column across all rows?
A. arr[3, :]
B. arr[:, 2]
C. arr[2, :]
D. arr[:, 3]
**Answer:** B
**Explanation:** Python uses 0-based indexing; column 3 is index 2. arr[:, 2] selects all rows (:) in column index 2.

---

### 2. How does 'arr[0, :]' differ from 'arr[0:1, :]'?
A. arr[0, :] returns a 1D vector of shape (N,); arr[0:1, :] preserves rank-2 dimensionality returning shape (1, N)
B. They return completely different numbers
C. arr[0:1, :] deletes the row
D. There is no difference
**Answer:** A
**Explanation:** Indexing with a scalar integer reduces the dimension (rank), returning a 1D array; slicing with a range [0:1] retains the 2D matrix structure.

---

### 3. What does the Ellipsis operator '...' do in multidimensional slicing: 'tensor[..., 0]'?
A. Stops the execution
B. Expands to fill as many complete slice colons (:) as necessary to span intermediate unspecified dimensions
C. Fills the array with dots
D. Generates random numbers
**Answer:** B
**Explanation:** The Ellipsis (...) represents all intervening dimensions not explicitly specified in the slice.

---

### 4. If matrix M has shape (6, 8), what will be the shape of 'M[2:5, 3:7]'?
A. (3, 4)
B. (2, 3)
C. (6, 8)
D. (5, 7)
**Answer:** A
**Explanation:** Rows 2:5 yields 3 rows (indices 2, 3, 4). Columns 3:7 yields 4 columns (indices 3, 4, 5, 6). The resulting shape is (3, 4).

---

### 5. Why is 'matrix[1, 2]' preferred over 'matrix[1][2]' in NumPy?
A. matrix[1][2] creates a temporary intermediate array object for matrix[1], adding unnecessary overhead, whereas matrix[1, 2] accesses memory directly in one step
B. matrix[1][2] is illegal syntax in Python
C. matrix[1, 2] converts the number to string
D. It saves the file to disk
**Answer:** A
**Explanation:** Chained indexing (matrix[1][2]) creates an unnecessary intermediate 1D slice object; multidimensional comma indexing (matrix[1, 2]) computes the memory offset directly in C.

---
