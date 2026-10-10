# Memory Views vs Deep Copies (view() vs copy())

One of the most frequent causes of bugs for developers transitioning from Python lists to NumPy is failing to understand the difference between a **View** and a **Deep Copy**.

---

## 1. The Fundamental Difference

```
+-----------------------------------+-----------------------------------+
| Memory View                       | Deep Copy                         |
+-----------------------------------+-----------------------------------+
| Shares the SAME raw data buffer   | Allocates a BRAND NEW memory      |
| in RAM as the parent array.       | buffer in RAM.                    |
| Mutating the view MUTATES parent! | Mutating the copy leaves original |
| Constant time O(1) creation.      | completely untouched.             |
| Produced by: Standard Slicing.    | Produced by: .copy(), Fancy Index |
+-----------------------------------+-----------------------------------+
```

![NumPy Views vs Deep Copies](/images/tutorials/numpy/views-vs-copies-memory.svg)

---

## 2. Demonstrating View Mutation

When you slice a NumPy array, no new array data is allocated. NumPy merely creates a small new metadata header pointing to the **exact same memory buffer**:

```python
import numpy as np

original = np.array([10, 20, 30, 40, 50])

# Create a slice (This is a VIEW!)
sub_view = original[1:4]
print("Sub-view before:", sub_view)  # [20 30 40]

# Mutate the first element of the view
sub_view[0] = 999

print("Sub-view after: ", sub_view)  # [999  30  40]
print("Original after: ", original)  # [ 10 999  30  40  50]  <-- MUTATED!
```

---

## 3. How to Check if an Array is a View: The 'base' Attribute

You can programmatically verify whether an array owns its data buffer or is merely a view borrowing memory from another object using the **`base`** attribute:

```python
a = np.array([1, 2, 3, 4])
v = a[1:3]     # Slice (View)
c = a.copy()   # Explicit Deep Copy

# For a view, .base references the original parent array
print(v.base is a)    # True (v borrows memory from a!)

# For an independent copy, .base is None
print(c.base is None) # True (c owns its own RAM buffer!)
```

---

## 4. When to Use Deep Copy (.copy())

Whenever you want to extract a sub-region, modify it, or filter it without altering the underlying master dataset, explicitly call **`.copy()`**:

```python
raw_sensor_data = np.array([100.5, 102.3, 99.8, 104.2])

# Safe independent clone
working_copy = raw_sensor_data[:2].copy()

working_copy[0] = 0.0

print(working_copy)       # [0.    102.3]
print(raw_sensor_data)    # [100.5 102.3 99.8 104.2] (Protected!)
```

---

# Multiple Choice Questions

### 1. What happens to the original array 'a' if you execute 'b = a[1:4]' followed by 'b[0] = 99'?
A. Nothing; 'b' is an independent copy
B. Element 'a[1]' is modified to 99 because basic slicing returns a view sharing the original memory buffer
C. It throws an AssignmentError
D. The array 'a' is deleted
**Answer:** B
**Explanation:** Standard slicing produces a view pointing to the original array's memory; mutating the view directly alters the parent array.

---

### 2. What does 'arr.base' evaluate to if 'arr' is an independent array that owns its memory buffer?
A. False
B. None
C. 0
D. True
**Answer:** B
**Explanation:** If an array owns its memory buffer (such as an original array or an explicit .copy()), its base attribute is None.

---

### 3. Which method should you call on an array slice to guarantee that changes made to it will not affect the original array?
A. .clone()
B. .copy()
C. .duplicate()
D. .detach()
**Answer:** B
**Explanation:** The .copy() method performs a deep copy, allocating an independent memory block that decouples it from the source array.

---

### 4. Why does NumPy default to returning views instead of deep copies when slicing arrays?
A. Python does not allow copying arrays
B. Performance: Creating views takes O(1) constant time and zero additional RAM, allowing gigabyte datasets to be sliced instantly
C. Slices cannot be copied
D. To save disk space
**Answer:** B
**Explanation:** Zero-copy slicing allows massive datasets to be sliced and reshaped instantaneously with zero memory allocation overhead.

---

### 5. Does the explicit method 'arr.view()' create a deep copy or a memory view?
A. Deep copy
B. Memory view sharing the same data buffer with a new metadata header
C. Converts to HTML
D. Opens a graphical viewer
**Answer:** B
**Explanation:** arr.view() explicitly constructs a new ndarray object pointing to the exact same underlying memory buffer.

---
