# Element-wise Arithmetic & Logical Operators

In NumPy, mathematical and comparison operators applied to arrays operate **element-by-element** (element-wise) by default. This contrasts with linear algebra matrix conventions (where multiplication denotes dot products) or standard Python lists (where `+` concatenates lists and `*` duplicates them).

---

## 1. Basic Arithmetic Operators

All standard Python arithmetic operators have vectorized element-wise implementations in NumPy:

```python
import numpy as np

a = np.array([10, 20, 30, 40], dtype=float)
b = np.array([2,  4,  5,  8], dtype=float)

print("Addition (a + b):        ", a + b)
print("Subtraction (a - b):     ", a - b)
print("Multiplication (a * b):  ", a * b)
print("True Division (a / b):   ", a / b)
print("Floor Division (a // b): ", a // b)
print("Exponentiation (a ** 2): ", a ** 2)
print("Modulus (a % b):         ", a % b)
```

**Output:**
```text
Addition (a + b):         [12. 24. 35. 48.]
Subtraction (a - b):      [ 8. 16. 25. 32.]
Multiplication (a * b):   [ 20.  80. 150. 320.]
True Division (a / b):    [5. 5. 6. 5.]
Floor Division (a // b):  [5. 5. 6. 5.]
Exponentiation (a ** 2):  [ 100.  400.  900. 1600.]
Modulus (a % b):          [0. 0. 0. 0.]
```

> **Crucial Linear Algebra Distinction:** In NumPy, `a * b` is **element-wise Hadamard product**. It is NOT matrix multiplication. For matrix multiplication, use the `@` operator or `np.matmul()`.

---

## 2. In-Place Arithmetic Operators

NumPy supports compound in-place operators (`+=`, `-=`, `*=`, `/=`), which modify the array's existing memory buffer directly without creating an intermediate array:

```python
counter = np.ones(5)
print("Initial id:", id(counter))

# In-place addition modifies buffer directly
counter += 5
print("After += 5:", counter)
print("Same object id?", id(counter))  # True!

# In contrast, counter = counter + 5 allocates a new object
```

> **Warning on In-Place Type Casting:** In-place operators cannot automatically cast to a higher dtype. For instance, executing `int_arr += 2.5` raises `UFuncTypeError: Cannot cast ufunc 'add' output from dtype('float64') to dtype('int32') with casting rule 'same_kind'`.

---

## 3. Comparison Operators

Applying comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) evaluates each element independently, producing a boolean array:

```python
readings = np.array([12.1, 15.4, 9.8, 22.0, 18.3])
baseline = 15.0

print("Greater than baseline: ", readings > baseline)
print("Equal to 22.0:         ", readings == 22.0)
```

**Output:**
```text
Greater than baseline:  [False  True False  True  True]
Equal to 22.0:          [False False False  True False]
```

---

## 4. Array-Wide Logical Reductions: `all()` and `any()`

To evaluate whether **all** elements or **at least one** element satisfy a condition, use `np.all()` and `np.any()`:

```python
quality_scores = np.array([98, 92, 95, 89, 94])

# Check if ALL parts pass quality threshold (> 85)
all_passed = np.all(quality_scores > 85)
print("Did all parts pass?", all_passed)  # True

# Check if ANY part has a near-perfect score (>= 98)
has_perfect = np.any(quality_scores >= 98)
print("Any near-perfect parts?", has_perfect)  # True
```

### Evaluating Tolerant Floating-Point Equality:
Because of IEEE 754 floating-point rounding errors, direct equality `a == b` is dangerous for floats. Use `np.isclose()` or `np.allclose()`:

```python
val1 = np.array([0.1 + 0.2])
val2 = np.array([0.3])

print("Direct equality:", val1 == val2)                  # [False] !
print("np.isclose:", np.isclose(val1, val2))             # [True]
print("np.allclose:", np.allclose(val1, val2))           # True
```

---

# Multiple Choice Questions

### 1. What is the output of `np.array([1, 2, 3]) * np.array([2, 3, 4])`?
A. A scalar dot product: 20
B. A 1D array: `[2, 6, 12]`
C. A 3x3 outer product matrix
D. An error because matrix dimensions must match (3, 1) and (1, 3)
**Answer:** B
**Explanation:** The `*` operator in NumPy denotes element-wise multiplication (Hadamard product), computing `[1*2, 2*3, 3*4] = [2, 6, 12]`.

### 2. How does `arr += 5` differ from `arr = arr + 5`?
A. `arr += 5` modifies the existing array buffer in-place without allocating a new array
B. `arr = arr + 5` is faster because it uses GPU registers
C. `arr += 5` works on lists while `arr = arr + 5` works on arrays
D. There is no difference
**Answer:** A
**Explanation:** In-place operators like `+=` mutate the array's underlying memory buffer directly, avoiding new memory allocation and reducing garbage collection pressure.

---

### 3. Which function reliably checks if two floating-point arrays are equal within a specified numerical tolerance?
A. `arr1 == arr2`
B. `np.allclose(arr1, arr2)`
C. `np.equal(arr1, arr2)`
D. `np.where(arr1 == arr2)`
**Answer:** B
**Explanation:** `np.allclose()` tests whether all corresponding elements in two arrays are equal within absolute (`atol`) and relative (`rtol`) tolerances, preventing false negatives from floating-point rounding errors.

---

### 4. What does `np.any(arr < 0)` evaluate to?
A. True if at least one element in `arr` is negative
B. True only if all elements in `arr` are negative
C. An array of negative values
D. The count of negative elements
**Answer:** A
**Explanation:** `np.any()` computes a logical OR reduction across elements, returning a single boolean True if one or more elements satisfy the condition.

---

### 5. What happens if you try to perform `int_arr += 1.5` on an integer array of dtype `int32`?
A. `int_arr` is silently converted to `float64`
B. 1.5 is rounded to 1
C. NumPy raises a `UFuncTypeError` because in-place operations cannot cast to higher dtypes
D. The decimal part is discarded without error
**Answer:** C
**Explanation:** In-place operators cannot change the memory buffer's dtype. Casting from float64 back into int32 requires explicit assignment or casting, so NumPy raises a type error.

---