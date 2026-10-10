# Identity Matrices & Diagonal Arrays (eye, identity, diag)

In linear algebra, statistics, and machine learning, square matrices with ones along the main diagonal—known as **Identity Matrices**—act as the multiplicative identity element (analogous to the number 1 in scalar arithmetic). NumPy provides dedicated functions to construct identity matrices and manipulate matrix diagonals.

---

## 1. Creating Identity Matrices: np.eye() vs np.identity()

Both functions generate matrices with ones along the diagonal and zeros elsewhere, but `np.eye()` is significantly more flexible:

```python
import numpy as np

# np.identity(n) -> Strict square N x N matrix
I_square = np.identity(3)
print(I_square)
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]

# np.eye(N, M, k) -> Supports non-square shapes and diagonal offsets (k)!
E_rect = np.eye(N=3, M=4)
print(E_rect)
# [[1. 0. 0. 0.]
#  [0. 1. 0. 0.]
#  [0. 0. 1. 0.]]
```

![Linear Algebra and Matrix Operations](/images/tutorials/numpy/linear-algebra-operations.svg)

---

## 2. Offsetting Diagonals with the 'k' Parameter

In `np.eye()`, the `k` parameter shifts the diagonal of ones:
* **`k = 0` (Default):** Main diagonal.
* **`k > 0` (Positive):** Shifts the diagonal **above** the main diagonal (super-diagonal).
* **`k < 0` (Negative):** Shifts the diagonal **below** the main diagonal (sub-diagonal).

```python
# Shift diagonal 1 position UP (k=1)
print(np.eye(4, k=1, dtype=int))
# [[0 1 0 0]
#  [0 0 1 0]
#  [0 0 0 1]
#  [0 0 0 0]]

# Shift diagonal 1 position DOWN (k=-1)
print(np.eye(4, k=-1, dtype=int))
# [[0 0 0 0]
#  [1 0 0 0]
#  [0 1 0 0]
#  [0 0 1 0]]
```

---

## 3. The Dual-Role of np.diag()

The **`np.diag()`** function performs two completely different operations depending on what you pass into it:

### Behavior A: Extracting the Diagonal from a 2D Matrix
When passed a 2D matrix, it extracts the diagonal elements into a 1D vector:
```python
matrix = np.array([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
])

diag_elements = np.diag(matrix)
print(diag_elements)  # [10 50 90]
```

### Behavior B: Constructing a 2D Matrix from a 1D Vector
When passed a 1D vector, it constructs a 2D square matrix with those values along the diagonal and zeros everywhere else:
```python
# Create diagonal covariance / scaling matrix
scaling_matrix = np.diag([5, 10, 15])
print(scaling_matrix)
# [[ 5  0  0]
#  [ 0 10  0]
#  [ 0  0 15]]
```

---

# Multiple Choice Questions

### 1. What is the multiplicative property of an identity matrix 'I' when multiplied with a compatible matrix 'A': 'A @ I'?
A. It returns zero
B. It returns matrix A unchanged (A @ I = A)
C. It inverts matrix A
D. It squares all numbers in A
**Answer:** B
**Explanation:** The identity matrix serves as the multiplicative neutral element in linear algebra; any matrix multiplied by the identity matrix yields itself.

---

### 2. What is the key functional difference between 'np.identity()' and 'np.eye()'?
A. np.identity only works in Python 2
B. np.eye can create non-square rectangular matrices and supports the diagonal offset parameter 'k'
C. np.identity can only hold text
D. There is no difference
**Answer:** B
**Explanation:** np.identity(N) strictly creates square N x N matrices on the main diagonal, whereas np.eye(N, M, k) supports arbitrary rows, columns, and shifted diagonals.

---

### 3. What will 'np.diag([4, 7, 9])' return?
A. A 1D array: array([4, 7, 9])
B. A 3x3 square matrix with 4, 7, and 9 along the main diagonal and zeros elsewhere
C. The sum: 20
D. A syntax error
**Answer:** B
**Explanation:** Passing a 1D vector into np.diag() constructs a square 2D matrix with those elements positioned along the diagonal.

---

### 4. What will 'np.eye(3, k=-1, dtype=int)' place along the main diagonal (index [0,0], [1,1], [2,2])?
A. Ones
B. Zeros (because k=-1 shifted the ones to the sub-diagonal below the main diagonal)
C. Twos
D. Minus ones
**Answer:** B
**Explanation:** A k value of -1 shifts the diagonal of ones down by one row, leaving the main diagonal populated with zeros.

---

### 5. If matrix 'M' is a 4x4 matrix, what is the shape of the output returned by 'np.diag(M)'?
A. (4, 4)
B. (4,)
C. (16,)
D. (1,)
**Answer:** B
**Explanation:** Passing a 2D matrix into np.diag() extracts its diagonal values into a 1D vector of length 4.

---
