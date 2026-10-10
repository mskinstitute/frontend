# Built-in Creation Routines (zeros, ones, full, empty)

Converting Python lists is convenient for small tests, but in production machine learning and scientific simulations, allocating arrays containing millions of pre-initialized cells must be done without allocating Python objects first. NumPy provides specialized **built-in memory allocation routines**.

---

## 1. Allocating Zeros with np.zeros()

`np.zeros()` allocates a contiguous block of memory and fills every byte with **0**:

```python
import numpy as np

# 1D array of 5 float zeros
z1 = np.zeros(5)
print(z1)  # [0. 0. 0. 0. 0.] (Default dtype is float64)

# 2D matrix of 3 rows and 4 columns filled with integer zeros
z2 = np.zeros((3, 4), dtype=int)
print(z2)
# [[0 0 0 0]
#  [0 0 0 0]
#  [0 0 0 0]]
```

*Common Use Case:* Initializing weight matrices, zero-padding convolution masks, or accumulator buffers in numerical simulations.

![NumPy Array Creation Routines](/images/tutorials/numpy/array-creation-routines.svg)

---

## 2. Allocating Ones with np.ones()

`np.ones()` operates identically to `zeros()`, but initializes every element to **1**:

```python
# Matrix of ones with shape (2, 3)
ones_arr = np.ones((2, 3), dtype=np.float32)
print(ones_arr)
# [[1. 1. 1.]
#  [1. 1. 1.]]
```

*Common Use Case:* Baseline probability priors, bias vectors in neural networks, and multiplier masks.

---

## 3. Allocating Constant Values with np.full()

When you need an array initialized with any arbitrary constant value (e.g., `7`, `-1`, `3.14`, or `np.nan`):

```python
# Create a 3x3 matrix filled entirely with 99
f1 = np.full((3, 3), fill_value=99)
print(f1)
# [[99 99 99]
#  [99 99 99]
#  [99 99 99]]

# Matrix filled with NaN (Not a Number) for missing data tracking
nan_matrix = np.full((2, 4), fill_value=np.nan)
```

---

## 4. High-Speed Allocation with np.empty()

What if you are about to overwrite every single element of an array immediately with data from a disk stream or sensor? Initializing cells to `0` wastes CPU write cycles. `np.empty()` allocates memory **without initializing its values**:

```python
# Allocates memory instantly without clearing existing RAM contents
raw_buffer = np.empty((3, 3))
print(raw_buffer)  # Contains uninitialized garbage values from memory!
```

> **Caution with np.empty():**
> `np.empty()` does not clear memory! The array will contain unpredictable residual bits (garbage values) left behind by other applications. Never read from an `empty()` array before writing to it!

---

## 5. The Like-Family: Matching Existing Arrays

NumPy provides companion routines that mirror the shape and dtype of an existing template array:

```python
ref = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int32)

# Same shape (2, 3) and dtype (int32), but all zeros
z_like = np.zeros_like(ref)

# Same shape and dtype, but filled with 500
f_like = np.full_like(ref, 500)
```

---

# Multiple Choice Questions

### 1. What is the default data type (dtype) created by 'np.zeros(5)' if no explicit dtype is provided?
A. int32
B. float64
C. bool
D. string
**Answer:** B
**Explanation:** NumPy array creation routines like np.zeros() and np.ones() default to 64-bit floating point (float64) numbers.

---

### 2. What does 'np.empty((3, 3))' return?
A. An array with 0 rows and 0 columns
B. An array allocated in memory containing arbitrary uninitialized residual garbage values
C. An array of empty strings
D. A Python NoneType
**Answer:** B
**Explanation:** np.empty() allocates the memory buffer without spending CPU time zeroing the bits, leaving whatever residual data was previously in that RAM space.

---

### 3. Which function creates a (4, 4) matrix where every element is initialized to the number -1?
A. np.minus_ones((4, 4))
B. np.full((4, 4), -1)
C. np.fill((4, 4), -1)
D. np.constant((4, 4), -1)
**Answer:** B
**Explanation:** np.full(shape, fill_value) initializes an array of the specified dimensions populated with the given constant value.

---

### 4. How can you quickly create an array of ones that has the exact same shape and data type as an existing array named 'features'?
A. np.ones(features.shape, dtype=features.dtype)
B. np.ones_like(features)
C. Both A and B are valid, with B being the most idiomatic
D. features.to_ones()
**Answer:** C
**Explanation:** While np.ones(features.shape, dtype=features.dtype) works, np.ones_like(features) is the idiomatic, built-in shorthand.

---

### 5. Why should 'np.zeros()' be passed a tuple for multidimensional shapes (e.g., 'np.zeros((3, 4))') rather than two separate arguments?
A. The first argument is the shape tuple; passing 'np.zeros(3, 4)' causes 4 to be interpreted as the dtype parameter
B. Separate arguments are deprecated in Python 3
C. Tuples calculate faster than numbers
D. Separate numbers cause an operating system crash
**Answer:** A
**Explanation:** In np.zeros(shape, dtype=float, ...), the shape argument must be a sequence (like a tuple (3, 4)); passing separate numbers passes 4 to the dtype argument, causing a TypeError.

---
