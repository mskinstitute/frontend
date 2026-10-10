# Inspecting Array Attributes (shape, ndim, size, itemsize)

Every NumPy ndarray encapsulates a lightweight metadata header describing its structure in memory. Being able to inspect an array’s **shape, dimensions, memory strides, and byte layout** is essential for debugging data pipelines and optimizing neural networks.

---

## 1. The Core Four Attributes

```
+-----------------------------------------------------------------------------------+
| 1. arr.ndim      -> Number of axes / dimensions (e.g., 1 for vector, 2 for matrix)|
| 2. arr.shape     -> Tuple of integers showing array length along each axis        |
| 3. arr.size      -> Total cumulative count of elements in the entire array        |
| 4. arr.dtype     -> Data type of elements (int32, float64, bool, etc.)            |
+-----------------------------------------------------------------------------------+
```

```python
import numpy as np

arr = np.array([
    [10.0, 20.0, 30.0, 40.0],
    [50.0, 60.0, 70.0, 80.0],
    [90.0, 100.0, 110.0, 120.0]
], dtype=np.float64)

print("Dimensions (ndim):", arr.ndim)   # 3 rows x 4 cols = 2 dimensions
print("Shape (shape):    ", arr.shape)  # (3, 4)
print("Total Size (size):", arr.size)   # 12 elements (3 * 4)
print("Data Type (dtype):", arr.dtype)  # float64
```

![Anatomy of Array Attributes and Shapes](/images/tutorials/numpy/ndarray-anatomy-axes-shapes.svg)

---

## 2. Low-Level Memory Attributes: itemsize, nbytes & strides

For systems programmers and high-performance engineers, NumPy exposes direct hardware layout parameters:

* **`arr.itemsize`:** Number of bytes consumed by a single element:
  * `float64` -> **8 bytes**
  * `int32` -> **4 bytes**
  * `uint8` -> **1 byte**
* **`arr.nbytes`:** Total bytes consumed by the entire data buffer:
  $$	ext{nbytes} = 	ext{size} 	imes 	ext{itemsize}$$
  For our (3, 4) float64 array: $12 	imes 8 = mathbf{96 	ext{ bytes}}$.
* **`arr.strides`:** The number of bytes the CPU must jump in memory to move 1 step along each axis:
  * In our (3, 4) float64 array: `arr.strides` is `(32, 8)`.
  * To advance to the next column (+1 in axis 1), skip **8 bytes** (1 float).
  * To advance to the next row (+1 in axis 0), skip **32 bytes** (4 floats $	imes$ 8 bytes).

---

## 3. Practical Array Diagnostics Function

A useful pattern when debugging tensor shapes in data pipelines:

```python
def inspect_array(name, a):
    print(f"[{name}] shape={a.shape} | ndim={a.ndim} | size={a.size} | "
          f"dtype={a.dtype} | RAM={a.nbytes}B | strides={a.strides}")

# Example:
x = np.ones((100, 200), dtype=np.int32)
inspect_array("FeatureMatrix", x)
# Output: [FeatureMatrix] shape=(100, 200) | ndim=2 | size=20000 | dtype=int32 | RAM=80000B | strides=(800, 4)
```

---

# Multiple Choice Questions

### 1. What does the 'shape' attribute return for an array created with 'np.zeros((4, 7, 3))'?
A. 84
B. 3
C. (4, 7, 3)
D. (84,)
**Answer:** C
**Explanation:** The shape attribute returns a tuple of integers indicating the length of the array along each respective dimension.

---

### 2. If an array has shape (5, 4) and dtype 'int64' (8 bytes), what will 'arr.nbytes' return?
A. 20
B. 160
C. 40
D. 8
**Answer:** B
**Explanation:** Total elements (size) = 5 * 4 = 20. Total bytes (nbytes) = 20 * 8 bytes = 160 bytes.

---

### 3. What is the relationship between 'arr.size', 'arr.itemsize', and 'arr.nbytes'?
A. arr.size = arr.itemsize * arr.nbytes
B. arr.nbytes = arr.size * arr.itemsize
C. arr.itemsize = arr.size + arr.nbytes
D. They are unrelated
**Answer:** B
**Explanation:** Total memory in bytes (nbytes) is exactly equal to the number of elements (size) multiplied by the byte size of each element (itemsize).

---

### 4. What does the 'strides' attribute of an ndarray describe?
A. The number of CPU cores running
B. The step size in bytes that must be traversed in RAM to advance one index along each respective axis
C. The number of loops in Python
D. The random seed
**Answer:** B
**Explanation:** Strides dictate the memory stepping offsets in bytes required to move to the next adjacent element along each dimension.

---

### 5. What will 'np.array(42).ndim' return for a 0-dimensional scalar?
A. 1
B. 0
C. (1,)
D. None
**Answer:** B
**Explanation:** A pure scalar (single number without array brackets) has zero dimensions, returning ndim = 0 and shape = ().

---
