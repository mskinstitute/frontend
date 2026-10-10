# Creating 1D, 2D & 3D Arrays from Lists & Tuples

The most intuitive way to begin using NumPy is by converting native Python sequences—such as lists and tuples—into multidimensional NumPy arrays using the **`np.array()`** factory function.

---

## 1. Creating 1D Arrays (Vectors)

A 1D array corresponds mathematically to a **vector** (a sequence of values with a single dimension):

```python
import numpy as np

# From a Python list
scores = [85, 92, 78, 90, 88]
arr_1d = np.array(scores)

print(arr_1d)         # [85 92 78 90 88]
print(type(arr_1d))   # <class 'numpy.ndarray'>
print(arr_1d.ndim)    # 1 (One dimension)
print(arr_1d.shape)   # (5,) (Length of 5 elements)
```

*Notice:* When printed, NumPy arrays do not display commas between elements (unlike Python lists `[85, 92, ...]`), visually distinguishing them as mathematical matrices.

![Anatomy of NumPy Ndarrays](/images/tutorials/numpy/ndarray-anatomy-axes-shapes.svg)

---

## 2. Creating 2D Arrays (Matrices)

A 2D array corresponds to a **matrix** or a tabular spreadsheet with rows and columns, created by passing a **nested list of lists**:

```python
matrix_data = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]

matrix = np.array(matrix_data)

print(matrix)
# [[10 20 30]
#  [40 50 60]
#  [70 80 90]]

print(matrix.ndim)   # 2 (Two dimensions: Rows and Columns)
print(matrix.shape)  # (3, 3) (3 rows, 3 columns)
```

> **The Inhomogeneous Trap:**
> Every sub-list in a 2D array **must have identical length**! If you pass `[[1, 2], [3, 4, 5]]`, modern NumPy raises a `ValueError` because it cannot form a rectangular contiguous C-array.

---

## 3. Creating 3D Arrays (Tensors / Batches / Color Images)

A 3D array adds a depth dimension, represented as a list of lists of lists. In machine learning, 3D arrays represent batches of matrices or RGB color images:

```python
# 2 layers, each having 3 rows and 4 columns: shape (2, 3, 4)
tensor_3d = np.array([
    [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
    ],
    [
        [13, 14, 15, 16],
        [17, 18, 19, 20],
        [21, 22, 23, 24]
    ]
])

print(tensor_3d.ndim)   # 3
print(tensor_3d.shape)  # (2, 3, 4)
print(tensor_3d.size)   # 24 total elements
```

---

## 4. Specifying Explicit Data Types on Creation

You can dictate the memory precision upon array creation using the `dtype` parameter:

```python
# Force floating-point representation
floats = np.array([1, 2, 3, 4], dtype=np.float32)
print(floats)  # [1. 2. 3. 4.]

# Force 8-bit unsigned integers (0 to 255, perfect for image pixels!)
pixels = np.array([0, 128, 255], dtype=np.uint8)
```

---

# Multiple Choice Questions

### 1. What function is used to convert a native Python list or tuple into a NumPy ndarray?
A. np.to_array()
B. np.array()
C. np.create()
D. np.convert()
**Answer:** B
**Explanation:** np.array() is the primary factory routine that takes sequences (lists, tuples) and constructs an ndarray.

---

### 2. What will be the 'shape' attribute of 'np.array([[1, 2, 3], [4, 5, 6]])'?
A. (6,)
B. (3, 2)
C. (2, 3)
D. (2, 2, 2)
**Answer:** C
**Explanation:** The nested list has 2 rows and 3 columns, producing a shape tuple of (2, 3).

---

### 3. How does the console print output of a NumPy array visually differ from a standard Python list?
A. NumPy arrays are printed in green font
B. Elements in a NumPy array are separated by spaces rather than commas
C. NumPy arrays are printed backwards
D. NumPy arrays do not have brackets
**Answer:** B
**Explanation:** When printed in the terminal, ndarrays format elements cleanly separated by spaces without commas between items.

---

### 4. What happens if you try to create an array with ragged sub-lists of inconsistent lengths: 'np.array([[1, 2], [3, 4, 5]])' in modern NumPy?
A. NumPy automatically fills missing cells with zeros
B. It raises a ValueError because rectangular homogeneity is strictly required
C. It converts the numbers into Roman numerals
D. It deletes the second row
**Answer:** B
**Explanation:** Modern NumPy requires rectangular sub-lists of matching lengths; jagged arrays trigger a ValueError.

---

### 5. Which parameter in 'np.array()' allows you to explicitly enforce a 32-bit floating point data type?
A. type="float"
B. dtype=np.float32
C. precision=32
D. mode="float"
**Answer:** B
**Explanation:** The 'dtype' parameter (Data Type) specifies the exact numeric representation in memory, such as np.float32 or np.int64.

---
