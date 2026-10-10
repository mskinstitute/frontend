# Flattening Arrays: ravel() vs flatten()

Flattening transforms a multi-dimensional array (2D matrix, 3D image tensor, or higher-order volume) into a continuous, 1-dimensional array. This operation is ubiquitous before feeding image pixels into dense neural network layers, computing histograms, or serializing data.

NumPy provides two primary methods for this operation:
- `arr.ravel()`
- `arr.flatten()`

While both methods return a 1D array with identical elements, their **memory allocation mechanics and performance profiles are fundamentally different**.

---

## 1. The Core Distinction: View vs Copy

```text
+---------------+---------------------+-----------------------+--------------------+
| Method        | Memory Allocation   | Modifies Original?    | Speed Performance  |
+---------------+---------------------+-----------------------+--------------------+
| arr.ravel()   | VIEW (when possible)| YES (in-place linked) | Blazing fast (0 ms)|
| arr.flatten() | COPY (always)       | NO (completely safe)  | Slower (allocates) |
+---------------+---------------------+-----------------------+--------------------+
```

---

## 2. Using `ravel()`: Zero-Copy Flattening

`ravel()` inspects the memory strides of the array. If the array is contiguous, it creates a new 1D array header pointing directly to the existing data buffer **without allocating or copying any memory**:

```python
import numpy as np

grid = np.array([[10, 20, 30],
                 [40, 50, 60]])

# Create a 1D representation with ravel
raveled_view = grid.ravel()
print("Raveled 1D array:", raveled_view)

# Mutate an element in the raveled array
raveled_view[0] = 999

# The original array IS MODIFIED!
print("Original grid after modifying raveled view:
", grid)
print("Shares memory:", np.shares_memory(grid, raveled_view))
```

**Output:**
```text
Raveled 1D array: [10 20 30 40 50 60]
Original grid after modifying raveled view:
 [[999  20  30]
 [ 40  50  60]]
Shares memory: True
```

---

## 3. Using `flatten()`: Safe Copy Allocation

`flatten()` is a method of `ndarray` that **always allocates fresh memory** and copies every element into the new buffer:

```python
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])

# Create a flat copy
flat_copy = matrix.flatten()
print("Flattened array:", flat_copy)

# Mutate an element in the flattened copy
flat_copy[0] = 777

# The original array remains completely untouched
print("Original matrix after modifying flat copy:
", matrix)
print("Shares memory:", np.shares_memory(matrix, flat_copy))
```

**Output:**
```text
Flattened array: [1 2 3 4 5 6]
Original matrix after modifying flat copy:
 [[1 2 3]
 [4 5 6]]
Shares memory: False
```

---

## 4. When Does `ravel()` Fall Back to a Copy?

If an array has non-contiguous memory layout—such as after a transpose or step-sliced indexing—it is mathematically impossible to represent a flattened version with a single uniform 1D stride. In that case, `ravel()` automatically allocates a copy:

```python
base = np.arange(9).reshape(3, 3)
transposed = base.T  # Transpose changes strides, breaking C-contiguity

print("Is contiguous?", transposed.flags.c_contiguous)  # False
r = transposed.ravel()
print("Shares memory after transpose?", np.shares_memory(transposed, r))  # False
```

---

## 5. Flattening Orders: 'C' vs 'F'

Both methods accept the `order` parameter:
- `'C'`: Flatten row-by-row (default).
- `'F'`: Flatten column-by-column.

```python
sample = np.array([[1, 2],
                   [3, 4]])

print("Row-major (C):", sample.flatten(order='C'))  # [1, 2, 3, 4]
print("Col-major (F):", sample.flatten(order='F'))  # [1, 3, 2, 4]
```

---

# Multiple Choice Questions

### 1. What is the primary difference between `arr.ravel()` and `arr.flatten()`?
A. `ravel()` only works on 2D arrays, whereas `flatten()` works on any dimension
B. `ravel()` returns a view whenever possible, while `flatten()` always returns an independent copy
C. `flatten()` operates in Fortran order while `ravel()` operates in C order
D. `ravel()` converts elements to float while `flatten()` preserves dtype
**Answer:** B
**Explanation:** `ravel()` avoids memory allocation by returning a view when the array is contiguous, whereas `flatten()` always allocates new memory and returns a copy.

---

### 2. If you execute `b = a.flatten(); b[0] = 100`, what happens to `a[0, 0]`?
A. It changes to 100
B. It remains unchanged because `flatten()` creates an independent copy
C. It raises a ReadOnlyError
D. It becomes 0
**Answer:** B
**Explanation:** Because `flatten()` creates an independent copy, changes to `b` do not affect the original array `a`.

---

### 3. Under what condition will `arr.ravel()` return a copy instead of a view?
A. When `arr` contains integers
B. When the array is non-contiguous in memory (e.g. after a transpose operation)
C. When `arr.ndim == 2`
D. When `arr` has fewer than 100 elements
**Answer:** B
**Explanation:** A 1D view requires contiguous memory with uniform strides. If memory is non-contiguous (such as after transposing or strided slicing), `ravel()` must allocate a copy.

---

### 4. Which function can be imported as a top-level NumPy function: `np.ravel(a)` or `np.flatten(a)`?
A. Both `np.ravel` and `np.flatten`
B. Only `np.ravel(a)`; `flatten()` is strictly an ndarray instance method
C. Only `np.flatten(a)`
D. Neither; both are strictly methods
**Answer:** B
**Explanation:** `np.ravel(a)` exists as a top-level function in NumPy, whereas `flatten()` is only an instance method on `ndarray` objects (`a.flatten()`).

---

### 5. What is the result of `np.array([[10, 20], [30, 40]]).ravel(order='F')`?
A. `[10, 20, 30, 40]`
B. `[10, 30, 20, 40]`
C. `[40, 30, 20, 10]`
D. `[[10, 30], [20, 40]]`
**Answer:** B
**Explanation:** With `order='F'` (Fortran order), elements are read column-by-column: column 0 contains `[10, 30]`, and column 1 contains `[20, 40]`, yielding `[10, 30, 20, 40]`.

---