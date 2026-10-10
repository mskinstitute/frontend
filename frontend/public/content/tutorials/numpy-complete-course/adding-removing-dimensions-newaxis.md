# Expanding & Squeezing Dimensions: np.newaxis & expand_dims

In linear algebra, matrix multiplication, and deep learning libraries (TensorFlow, PyTorch), the dimensionality of an array must frequently be adjusted to satisfy shape requirements. For example, multiplying a 1D vector of length $N$ by a 2D matrix of shape $(N, M)$ requires expanding the 1D vector into a formal 2D column matrix of shape $(N, 1)$ or row matrix of shape $(1, N)$.

NumPy provides intuitive tools to inject or eliminate singleton dimensions (dimensions of size 1):
- `np.newaxis`
- `np.expand_dims()`
- `np.squeeze()`

---

## 1. The Distinction Between 1D Vector vs 2D Matrix

A common conceptual hurdle for beginners is distinguishing between:
- A 1D vector of shape `(N,)`
- A 2D row matrix of shape `(1, N)`
- A 2D column matrix of shape `(N, 1)`

```python
import numpy as np

v = np.array([1, 2, 3, 4])
print("1D Vector shape:", v.shape)        # (4,) -> ndim = 1

# Convert into a 2D Row Vector (1 row, 4 columns)
row_vec = v[np.newaxis, :]
print("Row Vector shape:", row_vec.shape)  # (1, 4) -> ndim = 2

# Convert into a 2D Column Vector (4 rows, 1 column)
col_vec = v[:, np.newaxis]
print("Column Vector shape:
", col_vec)
print("Column Vector shape:", col_vec.shape) # (4, 1) -> ndim = 2
```

---

## 2. What is `np.newaxis`?

Under the hood, `np.newaxis` is simply an alias for Python's `None`. Whenever `np.newaxis` (or `None`) is used in an index slice, NumPy inserts a new axis with length 1 at that position:

```python
# These two expressions are identical:
a = np.array([10, 20, 30])
print(a[np.newaxis, :].shape)  # (1, 3)
print(a[None, :].shape)        # (1, 3)
```

### Inserting Multiple New Dimensions:
```python
# Turn a (3,) vector into a (1, 3, 1, 1) 4D tensor
tensor_4d = a[np.newaxis, :, np.newaxis, np.newaxis]
print("Tensor shape:", tensor_4d.shape)  # (1, 3, 1, 1)
```

---

## 3. Explicit Axis Expansion with `np.expand_dims()`

While `np.newaxis` is concise, `np.expand_dims(arr, axis)` provides explicit programmatic control over the target insertion axis:

```python
x = np.array([[1, 2], [3, 4]])  # shape (2, 2)

# Insert an axis at position 0: shape becomes (1, 2, 2)
x_expanded_0 = np.expand_dims(x, axis=0)
print("axis=0 shape:", x_expanded_0.shape)

# Insert an axis at position 1: shape becomes (2, 1, 2)
x_expanded_1 = np.expand_dims(x, axis=1)
print("axis=1 shape:", x_expanded_1.shape)

# Insert an axis at the end: shape becomes (2, 2, 1)
x_expanded_last = np.expand_dims(x, axis=-1)
print("axis=-1 shape:", x_expanded_last.shape)

# You can also pass a tuple of axes:
x_multi = np.expand_dims(x, axis=(0, 3))
print("Multiple axes (0, 3) shape:", x_multi.shape)  # (1, 2, 2, 1)
```

---

## 4. Removing Singleton Dimensions with `np.squeeze()`

The inverse of dimension expansion is **squeezing**. `np.squeeze()` strips out all dimensions of size 1, collapsing the array back to its minimal dimensional representation:

```python
# A tensor with multiple redundant singleton dimensions
padded_array = np.zeros((1, 28, 28, 1))

# Squeeze all dimensions of size 1
squeezed = np.squeeze(padded_array)
print("Squeezed shape:", squeezed.shape)  # (28, 28)

# Target specific singleton axes only:
partially_squeezed = np.squeeze(padded_array, axis=0)
print("Squeeze axis 0 only:", partially_squeezed.shape)  # (28, 28, 1)
```

> If you specify an axis for `np.squeeze()` that does not have a size of 1 (e.g. `np.squeeze(padded_array, axis=1)` where dimension size is 28), NumPy raises `ValueError: cannot select an axis to squeeze out which has size not equal to one`.

---

# Multiple Choice Questions

### 1. What does `np.newaxis` evaluate to in Python?
A. An integer 0
B. `None`
C. A slice object `slice(None)`
D. An ellipsis object `...`
**Answer:** B
**Explanation:** In NumPy's implementation, `np.newaxis` is defined as an alias for `None`. When placed in index brackets, it inserts a new axis of size 1.

---

### 2. If `arr = np.array([5, 10, 15])`, what is the shape of `arr[:, np.newaxis]`?
A. (1, 3)
B. (3, 1)
C. (3,)
D. (1, 1, 3)
**Answer:** B
**Explanation:** `arr` has length 3 along axis 0. Placing `np.newaxis` at axis 1 adds a second dimension of size 1, resulting in shape `(3, 1)`.

---

### 3. What is the resulting shape of `np.expand_dims(np.zeros((10, 20)), axis=1)`?
A. (1, 10, 20)
B. (10, 1, 20)
C. (10, 20, 1)
D. (10, 20)
**Answer:** B
**Explanation:** Specifying `axis=1` inserts a new singleton dimension at index 1, shifting the original second dimension (size 20) to index 2, giving shape `(10, 1, 20)`.

---

### 4. What does `np.squeeze(np.ones((1, 5, 1, 8)))` return?
A. An array of shape (5, 8)
B. An array of shape (40,)
C. An array of shape (1, 40)
D. An error because two axes have size 1
**Answer:** A
**Explanation:** By default, `np.squeeze()` removes all dimensions whose size is 1. Axes 0 and 2 have size 1, leaving axes of size 5 and 8 with resulting shape `(5, 8)`.

---

### 5. What happens if you run `np.squeeze(np.zeros((3, 4)), axis=0)`?
A. The array is flattened to shape (12,)
B. A ValueError is raised because axis 0 has size 3, not 1
C. The first row is deleted
D. Axis 0 is replaced by 1
**Answer:** B
**Explanation:** `np.squeeze()` can only remove axes that have a size of 1. Attempting to squeeze an axis with size > 1 raises a `ValueError`.

---