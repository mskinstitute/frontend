# Splitting Arrays: split(), hsplit(), & vsplit()

The reverse of array joining is **array splitting**—breaking a large array into multiple smaller sub-arrays. This is standard in machine learning pipelines when splitting feature matrices $X$ from label vectors $y$, or dividing a dataset into equal batches.

NumPy provides three intuitive splitting routines:
- `np.split()`: General splitting along any specified axis.
- `np.vsplit()`: Vertical splitting (row-wise / along axis 0).
- `np.hsplit()`: Horizontal splitting (column-wise / along axis 1).

---

## 1. General Splitting with `np.split()`

`np.split(ary, indices_or_sections, axis=0)` accepts two modes for dividing an array:
1. **An integer $N$:** Splits the array into $N$ **equal-sized** sub-arrays. (The dimension size along the split axis must be evenly divisible by $N$).
2. **A list of integer indices:** Splits the array at specific partition boundaries.

### Mode 1: Equal Sections
```python
import numpy as np

arr = np.arange(12)  # [0, 1, 2, ..., 11]

# Split into 3 equal parts (12 / 3 = 4 elements each)
parts = np.split(arr, 3)
for i, p in enumerate(parts):
    print(f"Part {i}:", p)
```

**Output:**
```text
Part 0: [0 1 2 3]
Part 1: [4 5 6 7]
Part 2: [8 9 10 11]
```

> If the array size is not divisible by $N$, `np.split()` raises `ValueError: array split does not result in an equal division`. To allow unequal splitting, use `np.array_split()`.

### Mode 2: Explicit Index Partitions
```python
# Split at index 2 and index 7
# Results in: arr[:2], arr[2:7], arr[7:]
sections = np.split(arr, [2, 7])
print("Section 0 (0 to 2):", sections[0])
print("Section 1 (2 to 7):", sections[1])
print("Section 2 (7 to end):", sections[2])
```

---

## 2. Vertical Splitting: `np.vsplit()`

`np.vsplit()` splits a 2D array vertically (dividing rows). It is equivalent to `np.split(..., axis=0)`:

```python
dataset = np.arange(24).reshape(6, 4)
print("Original 6x4 Dataset:
", dataset)

# Split 6 rows into 2 equal halves (3 rows each)
top_half, bottom_half = np.vsplit(dataset, 2)
print("
Top half (3 rows):
", top_half)
print("
Bottom half (3 rows):
", bottom_half)
```

---

## 3. Horizontal Splitting: `np.hsplit()`

`np.hsplit()` splits an array horizontally (dividing columns). It is equivalent to `np.split(..., axis=1)`.

### Real-World Machine Learning Example: Splitting Features $X$ and Target $y$
In supervised learning datasets, the target label $y$ is often the last column, while features $X$ occupy all preceding columns:

```python
# 5 samples with 3 features + 1 target label (5x4 matrix)
data = np.array([
    [1.5, 2.3, 0.9, 1],
    [3.1, 1.2, 4.4, 0],
    [2.8, 5.1, 3.2, 1],
    [0.9, 1.8, 2.1, 0],
    [4.2, 3.9, 5.0, 1]
])

# Split horizontally after index 3: columns 0-2 (features), column 3 (target)
X, y = np.hsplit(data, [3])
print("Features X (Shape:", X.shape, "):
", X)
print("
Target y (Shape:", y.shape, "):
", y)
```

---

## 4. Unequal Splitting with `np.array_split()`

When you need to divide a dataset of say 10 samples across 3 workers, $10$ is not divisible by $3$. `np.array_split()` cleanly distributes the remainder across the first sub-arrays:

```python
ten_items = np.arange(10)

# Splits 10 items into 3 chunks: lengths 4, 3, and 3
chunks = np.array_split(ten_items, 3)
for i, c in enumerate(chunks):
    print(f"Worker {i} chunk (size {len(c)}):", c)
```

**Output:**
```text
Worker 0 chunk (size 4): [0 1 2 3]
Worker 1 chunk (size 3): [4 5 6]
Worker 2 chunk (size 3): [7 8 9]
```

---

# Multiple Choice Questions

### 1. What happens if you call `np.split(np.arange(10), 3)`?
A. The last element is discarded and three arrays of 3 elements are returned
B. A ValueError is raised because 10 is not evenly divisible by 3
C. Three arrays of lengths 4, 3, 3 are returned
D. An array of floats is returned
**Answer:** B
**Explanation:** `np.split` strictly requires an equal division when an integer section count is provided. For unequal splits without an error, `np.array_split()` must be used.

---

### 2. What slices are created by `np.split(arr, [3, 8])`?
A. `arr[:3]`, `arr[3:8]`, and `arr[8:]`
B. `arr[3]`, `arr[8]`
C. `arr[:3]` and `arr[8:]`
D. `arr[3:8]` only
**Answer:** A
**Explanation:** Providing a 1D list of indices `[i1, i2]` partitions the array into three segments: `[:i1]`, `[i1:i2]`, and `[i2:]`.

---

### 3. Which function is equivalent to `np.split(matrix, 2, axis=0)` for a 2D matrix?
A. `np.hsplit(matrix, 2)`
B. `np.vsplit(matrix, 2)`
C. `np.dsplit(matrix, 2)`
D. `np.squeeze(matrix)`
**Answer:** B
**Explanation:** `np.vsplit()` divides arrays vertically along axis 0 (rows), making it identical to `np.split(matrix, sections, axis=0)`.

---

### 4. Given a matrix of shape (8, 6), what is the shape of each sub-array after `np.hsplit(matrix, 3)`?
A. (4, 6)
B. (8, 2)
C. (8, 3)
D. (2, 6)
**Answer:** B
**Explanation:** `hsplit` divides the 6 columns along axis 1 into 3 equal chunks: `6 / 3 = 2` columns each. The row dimension (8) remains unchanged, producing sub-arrays of shape `(8, 2)`.

---

### 5. How does `np.array_split(arr, N)` differ from `np.split(arr, N)`?
A. `np.array_split` converts all elements to float
B. `np.array_split` allows unequal division when `arr.shape[axis]` is not evenly divisible by `N`
C. `np.array_split` returns a single concatenated array
D. `np.array_split` only accepts 1D arrays
**Answer:** B
**Explanation:** `np.array_split()` accommodates divisions where the length is not an exact multiple of `N` by adjusting sub-array sizes to handle remainders gracefully without throwing an exception.

---