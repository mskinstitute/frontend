# Vector & Matrix Multiplication: dot(), matmul(), and @

In linear algebra, machine learning (neural networks, linear regression), and 3D computer graphics, matrix multiplication is the foundational building block. 

One of the most frequent points of confusion for newcomers to NumPy is distinguishing between **element-wise multiplication** (`*`) and **formal linear algebraic matrix multiplication** (`@` or `matmul()`).

![NumPy Linear Algebra](/images/tutorials/numpy/linear-algebra-operations.svg)

---

## 1. Element-wise vs Matrix Multiplication

- **Element-wise Product (`*`):** Multiplies elements at matching positions. Arrays must have compatible shapes for broadcasting.
- **Matrix Multiplication (`@` or `np.matmul`):** Computes row-by-column inner dot products according to formal linear algebra rules:

$$C_{ij} = \sum_{k=1}^K A_{ik} B_{kj}$$

For matrices $A$ of shape $(M, K)$ and $B$ of shape $(K, N)$, the inner dimensions ($K$) **must match exactly**, and the resulting matrix $C$ has shape $(M, N)$.

```python
import numpy as np

A = np.array([[1, 2],
              [3, 4]])

B = np.array([[5, 6],
              [7, 8]])

# 1. Element-wise (Hadamard) product:
print("Element-wise (A * B):
", A * B)
# [[1*5, 2*6], [3*7, 4*8]] = [[5, 12], [21, 32]]

# 2. Formal Matrix Multiplication using @ operator (Python 3.5+ standard):
print("
Matrix Multiplication (A @ B):
", A @ B)
# [[1*5 + 2*7, 1*6 + 2*8], [3*5 + 4*7, 3*6 + 4*8]] = [[19, 22], [43, 50]]
```

---

## 2. The Difference Between `np.dot()` and `np.matmul()`

NumPy provides both `np.dot()` and `np.matmul()` (or the `@` operator). For 2D matrices, they produce identical results. However, their behaviors diverge on 1D vectors and higher-order tensors:

### A. 1D Vector Dot Product (Inner Product)
For 1D vectors, both compute the standard scalar inner product:

```python
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
print("Vector inner product:", np.dot(v1, v2))     # 32
print("Using @ operator:    ", v1 @ v2)             # 32
```

### B. Higher-Order Tensors and Batch Matrix Multiplication
This is where `matmul()` / `@` shines and is the standard for deep learning:
- **`np.matmul()`** treats trailing 2 dimensions as matrices and **broadcasts over leading batch dimensions**.
- **`np.dot()`** computes a sum-product over the last axis of $A$ and second-to-last axis of $B$, which is **not** batch matrix multiplication!

```python
# Batch of 10 matrices, each 3x4
batch_A = np.random.randn(10, 3, 4)
# Batch of 10 matrices, each 4x5
batch_B = np.random.randn(10, 4, 5)

# Matmul performs 10 simultaneous 3x5 matrix multiplications:
batch_result = batch_A @ batch_B
print("Batch matmul shape:", batch_result.shape)  # (10, 3, 5)
```

---

## 3. Vector-Matrix Multiplication

When multiplying a 1D vector $v$ with a 2D matrix $M$:
- If $v$ is on the left (`v @ M`), NumPy temporarily promotes $v$ to a row matrix $(1, K)$, performs multiplication, and squeezes the output back to a 1D vector.
- If $v$ is on the right (`M @ v`), NumPy promotes $v$ to a column matrix $(K, 1)$, performs multiplication, and squeezes back:

```python
M = np.array([[1, 2, 3],
              [4, 5, 6]])  # shape (2, 3)

v = np.array([10, 20, 30])  # shape (3,)

result = M @ v
print("M @ v shape:", result.shape)  # (2,)
print("M @ v result:", result)       # [1*10 + 2*20 + 3*30, 4*10 + 5*20 + 6*30] = [140, 320]
```

---

# Multiple Choice Questions

### 1. Which Python operator is designated for matrix multiplication?
A. `*`
B. `**`
C. `@`
D. `^`
**Answer:** C
**Explanation:** Introduced in Python 3.5 (PEP 465), the `@` operator designates matrix multiplication and invokes `__matmul__` on NumPy ndarrays.

---

### 2. If matrix $A$ has shape $(4, 7)$ and matrix $B$ has shape $(7, 3)$, what is the shape of $A @ B$?
A. (4, 7)
B. (7, 7)
C. (4, 3)
D. (3, 4)
**Answer:** C
**Explanation:** The inner dimensions (7) match and cancel out, yielding a resulting matrix with dimensions of the outer shapes: $(4, 3)$.

---

### 3. What is the fundamental difference between `np.matmul` and `np.dot` on 3D tensors?
A. `np.matmul` only works on floats
B. `np.matmul` performs batch matrix multiplication by broadcasting over leading dimensions, whereas `np.dot` computes tensor contraction
C. `np.dot` is faster on GPUs
D. `np.matmul` does not support 2D arrays
**Answer:** B
**Explanation:** `np.matmul` treats multi-dimensional arrays as batches of 2D matrices, broadcasting across batch dimensions—crucial for deep learning architectures.

---

### 4. Given `a = np.array([1, 2])` and `b = np.array([3, 4])`, what is `a * b`?
A. `array([3, 8])`
B. `11`
C. `array([[3, 4], [6, 8]])`
D. `array([4, 6])`
**Answer:** A
**Explanation:** The `*` operator performs element-wise multiplication: `[1*3, 2*4] = [3, 8]`. (The matrix/dot product would be $1	imes3 + 2	imes4 = 11$).

---

### 5. Why does multiplying a matrix of shape (3, 5) with a matrix of shape (3, 5) using `A @ B` raise a ValueError?
A. Matrices must be square
B. The inner dimensions (5 and 3) do not match
C. The dtype is incompatible
D. The arrays must be transposed first
**Answer:** B
**Explanation:** In matrix multiplication $(M, K) 	imes (P, N)$, $K$ must equal $P$. Here $K=5$ and $P=3$, which are incompatible.

---