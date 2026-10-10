# Set Operations: unique(), intersect1d(), isin()

Working with categorical variables, database identifiers, and discrete groups frequently requires set-theoretic operations—such as finding distinct values, computing intersections between user cohorts, and testing membership across master lists.

NumPy provides high-performance 1D set operations implemented on sorted arrays, executing orders of magnitude faster than standard Python `set` objects.

---

## 1. Extracting Distinct Elements with `np.unique()`

`np.unique(ar)` finds all unique elements in an array and returns them in **sorted order**:

```python
import numpy as np

customer_ids = np.array([105, 102, 108, 102, 105, 109, 102, 108])

distinct_ids = np.unique(customer_ids)
print("Unique customer IDs (sorted):", distinct_ids)
```

**Output:**
```text
Unique customer IDs (sorted): [102 105 108 109]
```

### Advanced Features of `np.unique()`:
`np.unique()` provides three powerful optional parameters:
1. **`return_counts=True`:** Returns the frequency count of each distinct element.
2. **`return_index=True`:** Returns the index of the first occurrence of each unique element.
3. **`return_inverse=True`:** Returns integer indices to reconstruct the original array from the unique values (categorical label encoding!).

```python
labels = np.array(["Cat", "Dog", "Dog", "Bird", "Cat", "Dog"])

classes, counts = np.unique(labels, return_counts=True)
print("Distinct classes:", classes)
print("Frequency counts:", counts)

# Integer encoding (reconstruction indices):
classes, encoded = np.unique(labels, return_inverse=True)
print("Integer Encoded:", encoded)
print("Reconstructed:   ", classes[encoded])
```

**Output:**
```text
Distinct classes: ['Bird' 'Cat' 'Dog']
Frequency counts: [1 2 3]
Integer Encoded: [1 2 2 0 1 2]
Reconstructed:    ['Cat' 'Dog' 'Dog' 'Bird' 'Cat' 'Dog']
```

---

## 2. Testing Membership with `np.isin()`

To check whether elements in an array belong to a reference target list or cohort, use `np.isin(element, test_elements)`. It returns a boolean array of the same shape:

```python
product_catalog = np.array([101, 102, 103, 104, 105, 106, 107])
promotional_skus = np.array([102, 105, 999])

# Boolean mask of promotional products
is_promo = np.isin(product_catalog, promotional_skus)
print("Is promo mask:", is_promo)

# Filter catalog:
print("Promotional products in stock:", product_catalog[is_promo])
```

---

## 3. Set Theoretic Operations: Union, Intersection, Difference

NumPy implements standard mathematical set algebra on 1D arrays:

```python
cohort_A = np.array([1, 2, 3, 4, 5, 6])
cohort_B = np.array([4, 5, 6, 7, 8, 9])

# 1. Intersection: Elements present in BOTH sets (A ∩ B)
common = np.intersect1d(cohort_A, cohort_B)
print("Intersection (common):    ", common)  # [4 5 6]

# 2. Union: Elements present in EITHER set (A ∪ B)
all_unique = np.union1d(cohort_A, cohort_B)
print("Union (all unique):       ", all_unique)  # [1 2 3 4 5 6 7 8 9]

# 3. Difference: Elements in A that are NOT in B (A - B)
only_A = np.setdiff1d(cohort_A, cohort_B)
print("Difference (in A, not B): ", only_A)  # [1 2 3]

# 4. Symmetric Difference: Elements in A or B, but NOT both (XOR)
exclusive = np.setxor1d(cohort_A, cohort_B)
print("Exclusive (A XOR B):      ", exclusive)  # [1 2 3 7 8 9]
```

---

# Multiple Choice Questions

### 1. In what order does `np.unique()` return the distinct elements?
A. In order of first appearance
B. In sorted ascending order
C. In reverse order of appearance
D. Unordered
**Answer:** B
**Explanation:** `np.unique()` always sorts the unique elements in ascending numerical or alphabetical order.

---

### 2. Which parameter of `np.unique()` returns the occurrence frequency of each distinct value?
A. `return_frequency=True`
B. `return_counts=True`
C. `return_totals=True`
D. `count=True`
**Answer:** B
**Explanation:** Setting `return_counts=True` in `np.unique()` instructs NumPy to return a second array containing the count of occurrences for each unique value.

---

### 3. What does `np.intersect1d(arr1, arr2)` compute?
A. All elements appearing in both `arr1` and `arr2`
B. All elements appearing in either array
C. Elements in `arr1` not found in `arr2`
D. The dot product of both arrays
**Answer:** A
**Explanation:** `np.intersect1d()` calculates the mathematical set intersection, returning sorted unique values found in both input arrays.

---

### 4. Given `catalog = np.array([10, 20, 30, 40])`, what is the output of `np.isin(catalog, [20, 99])`?
A. `array([False,  True, False, False])`
B. `array([20])`
C. `True`
D. `array([1])`
**Answer:** A
**Explanation:** `np.isin()` tests element-wise membership and returns a boolean array of matching shape with True where catalog elements exist in the test list.

---

### 5. What does setting `return_inverse=True` in `np.unique()` provide?
A. The mathematical reciprocal ($1/x$) of each unique element
B. An integer array of indices that can be used to reconstruct the original input array from the unique array
C. The array sorted in descending order
D. The count of elements not present
**Answer:** B
**Explanation:** `return_inverse=True` returns an array of integer indices such that `unique_arr[inverse_indices]` exactly reconstructs the original input array, widely used for label encoding.

---