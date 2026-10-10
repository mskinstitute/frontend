# Sorting Arrays: np.sort() vs np.argsort()

Sorting data is a core algorithmic primitive in numerical computing. In scientific pipelines, sorting enables ranking, percentile calculation, quantile binning, nearest-neighbor searches, and ordering multi-column tables.

NumPy provides two complementary sorting paradigms:
- **Direct Sorting (`np.sort()` / `arr.sort()`):** Reorders and returns the actual values.
- **Indirect Sorting (`np.argsort()`):** Returns the **indices** that would sort the array, enabling simultaneous sorting of multiple associated datasets.

---

## 1. Direct Sorting: Function vs In-Place Method

- `np.sort(arr)`: Returns a sorted **copy** of the array, leaving the original array completely untouched.
- `arr.sort()`: Sorts the array **in-place** directly within its existing memory buffer, returning `None`.

```python
import numpy as np

numbers = np.array([42, 17, 89, 3, 25, 68])

# 1. np.sort() returns a new sorted array:
sorted_copy = np.sort(numbers)
print("Sorted copy:    ", sorted_copy)
print("Original intact:", numbers)

# 2. arr.sort() mutates in-place:
numbers.sort()
print("After in-place: ", numbers)
```

---

## 2. Multi-Dimensional Sorting Along Axes

When sorting multi-dimensional arrays, you can specify the target axis along which elements are ordered:

```python
matrix = np.array([
    [9, 2, 7],
    [5, 8, 1],
    [4, 6, 3]
])

# Sort across columns (within each row) -> axis=1 (or axis=-1, default)
row_sorted = np.sort(matrix, axis=1)
print("Row-wise sorted (axis=1):
", row_sorted)

# Sort down rows (within each column) -> axis=0
col_sorted = np.sort(matrix, axis=0)
print("
Column-wise sorted (axis=0):
", col_sorted)
```

**Output:**
```text
Row-wise sorted (axis=1):
 [[2 7 9]
 [1 5 8]
 [3 4 6]]

Column-wise sorted (axis=0):
 [[4 2 1]
 [5 6 3]
 [9 8 7]]
```

---

## 3. Indirect Sorting with `np.argsort()`

In real-world data science, you rarely sort a single isolated column. Instead, you have parallel arrays—such as employee names, salaries, and performance ratings—and sorting by salary must reorder the names and ratings in identical order.

`np.argsort()` returns the array of integer indices that put the array into sorted order:

```python
names = np.array(["Alice", "Bob", "Charlie", "Diana", "Evan"])
salaries = np.array([85000, 42000, 110000, 67000, 95000])

# Get sorted indices of salaries (ascending)
sorted_order = np.argsort(salaries)
print("Indices that sort salaries:", sorted_order)
# Output: [1, 3, 0, 4, 2] -> index 1 (Bob: 42k) is smallest, index 2 (Charlie: 110k) is largest

# Reorder both arrays simultaneously using fancy indexing:
print("
Employees ranked by salary (Lowest to Highest):")
for idx in sorted_order:
    print(f"  {names[idx]:10s} : ${salaries[idx]:,}")
```

### Sorting in Descending Order:
To sort in descending order (highest first), slice the resulting indices with `[::-1]`:
```python
descending_order = np.argsort(salaries)[::-1]
print("Top earner:", names[descending_order[0]])  # Charlie
```

---

## 4. Multi-Key Lexicographical Sorting with `np.lexsort()`

When sorting by multiple columns (e.g. sort primarily by **Surname**, and secondarily by **First Name**):

> **Important Syntax Note for `np.lexsort()`:** The keys are passed as a tuple, and **the LAST key in the tuple is the PRIMARY sort key**!

```python
first_names = np.array(["John", "Jane", "Alice", "Bob"])
last_names  = np.array(["Smith", "Smith", "Brown", "Brown"])

# Sort by last name (primary), then first name (secondary)
# Pass (secondary, primary)
sort_idx = np.lexsort((first_names, last_names))

print("Sorted by Last Name, then First Name:")
for idx in sort_idx:
    print(f"  {last_names[idx]}, {first_names[idx]}")
```

**Output:**
```text
Sorted by Last Name, then First Name:
  Brown, Alice
  Brown, Bob
  Smith, Jane
  Smith, John
```

---

# Multiple Choice Questions

### 1. What is the return value of `arr.sort()`?
A. A new sorted array
B. `None` (it sorts the array in-place)
C. The sorted indices
D. A boolean True
**Answer:** B
**Explanation:** The ndarray method `arr.sort()` sorts the existing memory buffer in-place and returns `None`. To get a new sorted copy without modifying the original, use `np.sort(arr)`.

---

### 2. What does `np.argsort(arr)` return?
A. A sorted copy of the array elements
B. An array of integer indices that would sort the array
C. A boolean mask indicating which elements are in sorted order
D. The median index of the array
**Answer:** B
**Explanation:** `np.argsort()` performs an indirect sort, returning an array of integer indices corresponding to the elements in ascending sorted order.

---

### 3. Given `salaries = np.array([50000, 30000, 80000])`, what is the output of `np.argsort(salaries)`?
A. `array([30000, 50000, 80000])`
B. `array([1, 0, 2])`
C. `array([2, 0, 1])`
D. `array([0, 1, 2])`
**Answer:** B
**Explanation:** 30000 is at index 1 (smallest), 50000 is at index 0 (middle), and 80000 is at index 2 (largest). Thus, the ascending indices are `[1, 0, 2]`.

---

### 4. In `np.lexsort((col_b, col_a))`, which column acts as the primary sort key?
A. `col_b`
B. `col_a`
C. Both columns equally
D. Randomly depending on data types
**Answer:** B
**Explanation:** In NumPy's `lexsort()`, the keys are evaluated in reverse order: the last array in the passed tuple (`col_a`) is the primary sort key, while preceding arrays break ties.

---

### 5. How can you sort a 1D array in descending order using `np.sort()`?
A. `np.sort(arr, reverse=True)`
B. `np.sort(arr)[::-1]`
C. `np.sort_desc(arr)`
D. `arr.sort(order='desc')`
**Answer:** B
**Explanation:** `np.sort()` does not possess a `reverse` keyword argument. The standard, idiomatic NumPy technique is to sort ascending and reverse using slice step `-1`: `np.sort(arr)[::-1]`.

---