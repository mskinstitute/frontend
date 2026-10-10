# Mastering the axis Parameter: Reductions & keepdims

One of the most essential concepts in multi-dimensional computing is understanding how aggregation functions operate across specific **axes**. 

Whether you are computing the average grade per student, the total sales per store across quarters, or normalizing batch activations in a convolutional neural network, mastering the `axis` and `keepdims` parameters is non-negotiable.

---

## 1. The Mental Model of the `axis` Parameter

A common misconception is thinking of `axis` as "operating along a dimension". A far clearer and more intuitive mental model is:

> **The `axis` parameter specifies the dimension that is COLLAPSED (eliminated) during the aggregation.**

Consider a 2D matrix of shape `(rows, cols)` = `(4, 3)`:
- **`axis=0` (Rows collapsed):** Collapses row-by-row down the columns. The row dimension disappears. Output shape is `(3,)` (one result per column).
- **`axis=1` (Columns collapsed):** Collapses column-by-column across the rows. The column dimension disappears. Output shape is `(4,)` (one result per row).
- **`axis=None` (Default):** Collapses **all** dimensions, flattening the array into a single scalar value.

```python
import numpy as np

# 4 students (rows), 3 exam scores each (columns)
grades = np.array([
    [85, 90, 78],  # Student 0
    [72, 88, 91],  # Student 1
    [95, 92, 99],  # Student 2
    [60, 70, 65]   # Student 3
])

print("Original shape:", grades.shape)  # (4, 3)

# 1. Overall class average across all exams and all students (axis=None)
print("Overall average:", np.mean(grades))  # 82.08

# 2. Average score for each exam subject (collapse rows -> axis=0)
exam_averages = np.mean(grades, axis=0)
print("Exam subject averages (shape:", exam_averages.shape, "):", exam_averages)
# Output: [78.  85.  83.25] -> shape (3,)

# 3. Average score for each individual student (collapse cols -> axis=1)
student_averages = np.mean(grades, axis=1)
print("Student averages (shape:", student_averages.shape, "):", student_averages)
# Output: [84.33  83.67  95.33  65.  ] -> shape (4,)
```

---

## 2. In 3D and N-Dimensional Tensors

The exact same rule holds for higher dimensions. If you have an array of shape `(Batch, Height, Width, Channels)` = `(32, 28, 28, 3)`:

- `np.mean(tensor, axis=0)` collapses the batch axis $\implies$ shape becomes `(28, 28, 3)`.
- `np.mean(tensor, axis=(1, 2))` collapses spatial height and width $\implies$ shape becomes `(32, 3)`.
- `np.mean(tensor, axis=-1)` collapses the color channels $\implies$ shape becomes `(32, 28, 28)`.

---

## 3. The Power of `keepdims=True` for Broadcasting

When you compute an axis reduction, NumPy collapses that dimension, dropping the rank by 1. For example, in a $(4, 3)$ matrix, `grades.mean(axis=1)` produces shape `(4,)` rather than `(4, 1)`.

If you immediately try to subtract this mean from the original matrix to center the data:
`grades - student_averages`
NumPy attempts to align trailing dimensions: $(4, 3)$ with $(4,)$, which **fails with a broadcasting ValueError**!

Setting **`keepdims=True`** preserves the collapsed dimension as a **singleton axis of length 1**:

```python
# Calculate student average with keepdims=True -> shape becomes (4, 1)
student_mean_2d = np.mean(grades, axis=1, keepdims=True)
print("With keepdims=True shape:", student_mean_2d.shape)  # (4, 1)

# Now broadcasting works seamlessly! (4, 3) - (4, 1) -> (4, 3)
centered_grades = grades - student_mean_2d
print("
Centered student grades (deviations from each student's average):
", np.round(centered_grades, 2))
```

**Output:**
```text
With keepdims=True shape: (4, 1)

Centered student grades (deviations from each student's average):
 [[ 0.67  5.67 -6.33]
 [-11.67  4.33  7.33]
 [-0.33 -3.33  3.67]
 [-5.    5.    0.  ]]
```

---

## 4. Tuple of Axes Reductions

You can collapse multiple axes simultaneously by passing a tuple of integers:

```python
cube = np.ones((2, 5, 8))

# Collapse axis 0 and axis 2 simultaneously
reduced = np.sum(cube, axis=(0, 2))
print("Reduced shape:", reduced.shape)  # (5,)
print("Values:", reduced)               # Each element is 2 * 8 = 16
```

---

# Multiple Choice Questions

### 1. What is the output shape of `np.sum(arr, axis=0)` for an array of shape (10, 20)?
A. (10, 20)
B. (10,)
C. (20,)
D. (1, 20)
**Answer:** C
**Explanation:** Specifying `axis=0` collapses the 0th dimension (size 10), leaving only the remaining dimension of size 20, with shape `(20,)`.

---

### 2. In a 2D matrix of shape `(N, M)`, which axis parameter computes row-wise sums (the sum across columns for each row)?
A. `axis=0`
B. `axis=1`
C. `axis=-2`
D. `axis=None`
**Answer:** B
**Explanation:** `axis=1` collapses the columns (axis 1), performing the summation across the horizontal columns for each row and producing $N$ values.

---

### 3. What does setting `keepdims=True` do during an aggregation operation?
A. Prevents values from being modified
B. Keeps the reduced dimensions in the output as singleton dimensions of size 1
C. Caches calculations in memory
D. Copies the input array before computing
**Answer:** B
**Explanation:** `keepdims=True` retains the reduced axes with size 1 instead of dropping them, making the resulting array immediately compatible for broadcasting back against the original array.

---

### 4. If `x` has shape (4, 6) and you execute `x - np.mean(x, axis=1)`, why does it raise a broadcasting ValueError?
A. `np.mean` produces complex numbers
B. `np.mean(x, axis=1)` yields shape `(4,)`, which aligns as `(1, 4)` and cannot broadcast against `(4, 6)`
C. Subtraction is not supported on float arrays
D. Matrix dimensions cannot exceed 5
**Answer:** B
**Explanation:** `np.mean(x, axis=1)` collapses axis 1 to produce a 1D array of shape `(4,)`. When broadcasting with `(4, 6)`, trailing dimensions 6 and 4 do not match. Using `keepdims=True` produces shape `(4, 1)` which broadcasts correctly.

---

### 5. What is the output shape when applying `np.mean(arr, axis=(0, 2))` to an array `arr` of shape (5, 8, 12)?
A. (8,)
B. (5, 12)
C. (60,)
D. (1, 8, 1)
**Answer:** A
**Explanation:** Passing a tuple `axis=(0, 2)` eliminates both axis 0 (size 5) and axis 2 (size 12), leaving only axis 1 (size 8), producing output shape `(8,)`.

---