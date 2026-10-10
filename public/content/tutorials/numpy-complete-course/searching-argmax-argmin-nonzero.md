# Locating Extrema: argmax(), argmin(), & nonzero()

Finding where extreme values occur—such as locating the maximum probability class in neural network classification, pinpointing the peak signal in a spectroscopy scan, or identifying active sensor triggers—is a standard task across numerical science.

NumPy provides fast vector routines for searching arrays:
- `np.argmax()` / `np.argmin()`: Indices of global or directional extrema.
- `np.unravel_index()`: Converting flat 1D indices into multi-dimensional coordinates.
- `np.nonzero()`: Finding coordinates of non-zero elements.

---

## 1. Locating Extrema in 1D Arrays

```python
import numpy as np

sensor_voltages = np.array([0.45, 1.20, 4.88, 2.15, 0.95, 4.88])

# Index of the first maximum element
max_idx = np.argmax(sensor_voltages)
print("Max index:", max_idx)               # Index 2
print("Max value:", sensor_voltages[max_idx]) # 4.88

# Index of the minimum element
min_idx = np.argmin(sensor_voltages)
print("Min index:", min_idx)               # Index 0
print("Min value:", sensor_voltages[min_idx]) # 0.45
```

> **Tie-Breaking Rule:** If the maximum or minimum value occurs multiple times in the array, both `argmax()` and `argmin()` return the index of the **first occurrence**.

---

## 2. Directional Extrema with the `axis` Parameter

In classification machine learning (such as MNIST digit recognition or image tagging), the model outputs a 2D matrix of shape `(batch_size, num_classes)` containing predicted probability scores. To extract the predicted class for each sample, compute `argmax` across class columns (`axis=1`):

```python
# 4 samples, 3 classes (e.g. [Cat, Dog, Bird])
predicted_probabilities = np.array([
    [0.10, 0.85, 0.05],  # Sample 0 -> Dog (index 1)
    [0.72, 0.18, 0.10],  # Sample 1 -> Cat (index 0)
    [0.05, 0.25, 0.70],  # Sample 2 -> Bird (index 2)
    [0.30, 0.60, 0.10]   # Sample 3 -> Dog (index 1)
])

# Extract predicted class label for every sample
predicted_classes = np.argmax(predicted_probabilities, axis=1)
print("Predicted classes:", predicted_classes)  # [1, 0, 2, 1]
```

---

## 3. Multi-Dimensional Coordinates with `np.unravel_index()`

When `argmax()` is called on a multi-dimensional array **without** specifying an axis, it flattens the array conceptually and returns a single integer representing the flat index.

To convert that flat integer into true $(row, col)$ or $(depth, row, col)$ coordinates, use `np.unravel_index()`:

```python
heatmap = np.array([
    [12, 45, 23],
    [88, 15, 99],   # 99 is maximum at row 1, col 2
    [34, 76, 50]
])

# 1. Flat argmax
flat_idx = np.argmax(heatmap)
print("Flat max index:", flat_idx)  # Index 5 (in flattened [12, 45, 23, 88, 15, 99...])

# 2. Unravel into true 2D matrix coordinates:
coords = np.unravel_index(flat_idx, heatmap.shape)
print("2D Matrix coordinates (row, col):", coords)  # (1, 2)
print("Value at coordinates:", heatmap[coords])      # 99
```

---

## 4. Finding Non-Zero Elements with `np.nonzero()`

`np.nonzero()` returns a tuple of coordinate arrays, one for each dimension, containing the indices where elements are non-zero:

```python
sparse_grid = np.array([
    [0, 5, 0],
    [3, 0, 0],
    [0, 0, 9]
])

rows, cols = np.nonzero(sparse_grid)
print("Non-zero row indices:", rows)  # [0, 1, 2]
print("Non-zero col indices:", cols)  # [1, 0, 2]

# Count non-zero elements fast:
print("Total non-zero count:", np.count_nonzero(sparse_grid))  # 3
```

---

# Multiple Choice Questions

### 1. In the case of multiple identical maximum values in an array, which index does `np.argmax()` return?
A. The last occurrence
B. The first occurrence
C. A list of all occurrences
D. Randomly selected index
**Answer:** B
**Explanation:** `np.argmax()` scans elements in index order and returns the index corresponding to the first occurrence of the maximum value.

---

### 2. In a neural network probability matrix `probs` of shape `(100, 10)` (100 samples, 10 classes), which command extracts the predicted class for each sample?
A. `np.argmax(probs, axis=0)`
B. `np.argmax(probs, axis=1)`
C. `np.max(probs)`
D. `np.argsort(probs)`
**Answer:** B
**Explanation:** `axis=1` collapses the 10 class columns for each row, returning a 1D array of 100 indices indicating which class had the highest probability for each sample.

---

### 3. Which NumPy function maps a flat 1D argmax index back to a tuple of multi-dimensional matrix coordinates?
A. `np.reshape_index()`
B. `np.unravel_index()`
C. `np.ravel_multi_index()`
D. `np.expand_dims()`
**Answer:** B
**Explanation:** `np.unravel_index(indices, shape)` converts a flat index or array of flat indices into a tuple of coordinate arrays for an array of the given shape.

---

### 4. What does `np.count_nonzero(arr)` do?
A. Counts how many elements in `arr` are equal to zero
B. Counts how many elements in `arr` are not equal to zero
C. Returns the sum of all elements
D. Replaces zero values with 1
**Answer:** B
**Explanation:** `np.count_nonzero()` efficiently tallies the total number of non-zero (or True) values across an array or along a specified axis.

---

### 5. If `arr = np.array([[0, 8], [3, 0]])`, what is returned by `np.nonzero(arr)`?
A. `(array([0, 1]), array([1, 0]))`
B. `array([8, 3])`
C. `array([0, 1])`
D. `[8, 3]`
**Answer:** A
**Explanation:** `np.nonzero()` returns a tuple of arrays representing coordinates for each axis. The non-zero elements are at `(0, 1)` and `(1, 0)`.

---