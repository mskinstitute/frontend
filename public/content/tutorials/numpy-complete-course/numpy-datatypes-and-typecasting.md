# NumPy Data Types (dtype) & Type Casting (astype)

Because NumPy allocates contiguous memory buffers, it cannot store dynamic arbitrary types in individual cells. Instead, it relies on fixed-width, low-level **C-compatible data types** known as **dtypes**. Understanding dtypes is vital for preventing integer overflows and optimizing memory consumption.

---

## 1. Overview of NumPy Data Types

NumPy offers granular control over bit-width and signedness:

| Category | Dtype Names | Bit Width | Permitted Range / Value |
| :--- | :--- | :--- | :--- |
| **Integer (Signed)** | `int8`, `int16`, `int32`, `int64` | 8, 16, 32, 64 bits | Negative and positive whole numbers (`int8`: -128 to 127) |
| **Integer (Unsigned)**| `uint8`, `uint16`, `uint32`, `uint64` | 8, 16, 32, 64 bits | Non-negative integers (`uint8`: 0 to 255; ideal for pixels!) |
| **Floating Point** | `float16`, `float32`, `float64` | 16, 32, 64 bits | Real numbers with fractional decimals |
| **Complex** | `complex64`, `complex128` | 64, 128 bits | Numbers with real and imaginary components ($3 + 4j$) |
| **Boolean** | `bool` or `bool_` | 8 bits (1 byte) | `True` or `False` |
| **String / Unicode** | `str_` or `U<N>` | Variable | Fixed-width Unicode characters |

```python
import numpy as np

# Inspecting automatic type inference
x = np.array([1, 2, 3])
print(x.dtype)  # int64 (on 64-bit OS)

y = np.array([1.0, 2.5, 3.8])
print(y.dtype)  # float64
```

![Data Types and Array Anatomy](/images/tutorials/numpy/ndarray-anatomy-axes-shapes.svg)

---

## 2. Type Casting with astype()

To convert an existing array from one data type to another, use the **`astype()`** method.

> **Crucial Rule:** `astype()` always creates and returns a **NEW deep copy** of the array in memory; it never mutates the original array in-place!

```python
# Original float array
floats = np.array([1.2, 2.8, 3.5, 4.9])

# Convert to integers (Truncates decimals toward zero!)
integers = floats.astype(np.int32)
print(integers)  # [1 2 3 4]
print(integers.dtype)  # int32

# Convert strings to numbers
str_data = np.array(["10.5", "20.2", "30.8"])
nums = str_data.astype(np.float64)
print(nums.sum())  # 61.5
```

---

## 3. The Danger of Integer Overflow

When using small fixed-width integer types (like `int8` or `uint8`), exceeding the maximum boundary value wraps around without warning:

```python
# uint8 allows values from 0 to 255
pixels = np.array([250, 254, 255], dtype=np.uint8)

# Adding 5 to each element causes integer OVERFLOW!
overflowed = pixels + 5
print(overflowed)  # [255, 3, 4]  <-- 255 wrapped around to 4!
```
*In financial calculations or large aggregates, always use `int64` or `float64` to avoid silent arithmetic overflow!*

---

# Multiple Choice Questions

### 1. What does the 'astype()' method do to an existing NumPy array?
A. Modifies the array in-place without copying
B. Creates and returns a brand new copy of the array converted to the requested dtype
C. Deletes all negative numbers
D. Sorts the array
**Answer:** B
**Explanation:** astype() is a non-destructive method that allocates a new memory buffer and casts the values into the target dtype.

---

### 2. What is the value range of an unsigned 8-bit integer ('uint8') in NumPy?
A. -128 to 127
B. 0 to 255
C. 0 to 65,535
D. -255 to 255
**Answer:** B
**Explanation:** An unsigned 8-bit integer (2^8 = 256 states) represents non-negative numbers strictly from 0 to 255.

---

### 3. What happens when you cast a floating-point number 7.89 into an integer using 'astype(int)'?
A. It rounds up to 8
B. It truncates the decimal portion toward zero, becoming 7
C. It raises a TypeError
D. It returns NaN
**Answer:** B
**Explanation:** In C and NumPy, integer casting truncates fractional decimals toward zero rather than rounding.

---

### 4. What will happen if you add 1 to a uint8 array containing the value 255: 'np.array([255], dtype=np.uint8) + 1'?
A. Returns array([256])
B. Triggers an OverflowError exception
C. Wraps around to 0 due to 8-bit integer overflow
D. Converts into float
**Answer:** C
**Explanation:** Fixed-width integer types experience modular wrap-around overflow; 255 + 1 in 8-bit unsigned arithmetic wraps back to 0.

---

### 5. Which of the following data types occupies the least amount of memory per element?
A. np.float64
B. np.int32
C. np.int8
D. np.complex128
**Answer:** C
**Explanation:** np.int8 consumes exactly 1 byte (8 bits) per element, compared to 4 bytes for int32 and 8 bytes for float64.

---
