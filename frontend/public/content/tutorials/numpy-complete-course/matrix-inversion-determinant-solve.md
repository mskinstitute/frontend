# Solving Linear Systems: inv(), det(), & solve()

Systems of simultaneous linear equations arise everywhere: in engineering simulations, structural load calculations, econometric models, and machine learning normal equations.

A system of linear equations with $n$ variables is represented in matrix notation as:

$$A \mathbf{x} = \mathbf{b}$$

Where:
- $A$ is the $n \times n$ coefficient matrix.
- $\mathbf{x}$ is the vector of unknown variables.
- $\mathbf{b}$ is the vector of constants.

NumPy's linear algebra module (`numpy.linalg`) provides tools to solve these systems with numerical stability.

![NumPy Linear Algebra](/images/tutorials/numpy/linear-algebra-operations.svg)

---

## 1. Matrix Determinants: `np.linalg.det()`

A square matrix $A$ has a unique inverse if and only if its **determinant is non-zero** ($\det(A) \neq 0$). A matrix with $\det(A) = 0$ is called **singular** or non-invertible:

```python
import numpy as np

A = np.array([[4.0, 7.0],
              [2.0, 6.0]])

# Compute determinant: (4*6) - (7*2) = 24 - 14 = 10
determinant = np.linalg.det(A)
print(f"Determinant: {determinant:.2f}")  # 10.00
```

---

## 2. Solving Systems: Why You Should NEVER Use `inv()`!

Mathematically, the analytical solution to $A \mathbf{x} = \mathbf{b}$ is:

$$\mathbf{x} = A^{-1} \mathbf{b}$$

Many beginners compute this directly using `np.linalg.inv(A) @ b`. 

> **CRITICAL INDUSTRY WARNING:** **Never invert a matrix to solve a linear system!**
> 
> Direct matrix inversion is:
> 1. **Numerically Unstable:** Inversion magnifies floating-point roundoff errors and condition number instabilities.
> 2. **Computationally Inefficient:** Computing $A^{-1}$ takes $\mathcal{O}(n^3)$ operations with high constant factors.
> 
> **Always use `np.linalg.solve(A, b)`!** `solve()` uses LAPACK's optimized LU decomposition with partial pivoting, which is significantly faster and far more numerically precise.

```python
# Solve the linear system:
# 3x + 1y = 9
# 1x + 2y = 8

A = np.array([[3.0, 1.0],
              [1.0, 2.0]])
b = np.array([9.0, 8.0])

# The PROFESSIONAL way:
x = np.linalg.solve(A, b)
print("Solution x, y:", x)  # [2., 3.] -> 3*(2) + 1*(3) = 9; 1*(2) + 2*(3) = 8!

# Verify solution by computing residual norm: ||Ax - b||
residual = np.linalg.norm(A @ x - b)
print(f"Residual error: {residual:.2e}")  # 0.00e+00 (exact!)
```

---

## 3. Matrix Inversion: `np.linalg.inv()`

When theoretical requirements strictly dictate computing the explicit inverse matrix $A^{-1}$ (such as calculating covariance parameter matrices in statistics):

```python
A = np.array([[1.0, 2.0],
              [3.0, 4.0]])

A_inv = np.linalg.inv(A)
print("Inverse matrix A^-1:
", A_inv)

# Verify that A @ A^-1 is the identity matrix I:
identity_check = A @ A_inv
print("
A @ A^-1:
", np.round(identity_check, 4))
```

**Output:**
```text
Inverse matrix A^-1:
 [[-2.   1. ]
 [ 1.5 -0.5]]

A @ A^-1:
 [[1. 0.]
 [0. 1.]]
```

---

## 4. Singular Matrices and Least-Squares: `np.linalg.lstsq()`

If a matrix is non-square (more equations than unknowns) or singular ($det(A) = 0$), `np.linalg.solve()` raises `LinAlgError: Singular matrix`.

To find the best-fit approximate solution that minimizes the sum of squared residuals $\|A\mathbf{x} - \mathbf{b}\|^2_2$, use **Linear Least Squares** (`np.linalg.lstsq`):

```python
# Fitting a linear trend y = mx + c to noisy data
# 4 data points (x, y): (0, 1), (1, 2.2), (2, 2.9), (3, 4.1)
x_pts = np.array([0, 1, 2, 3])
y_pts = np.array([1.0, 2.2, 2.9, 4.1])

# Construct design matrix [x, 1]
A_design = np.column_stack((x_pts, np.ones_like(x_pts)))

# Solve least-squares:
params, residuals, rank, s = np.linalg.lstsq(A_design, y_pts, rcond=None)
slope, intercept = params
print(f"Fitted Line: y = {slope:.2f}x + {intercept:.2f}")
```

---

# Multiple Choice Questions

### 1. What does a matrix determinant equal to zero ($det(A) = 0$) indicate?
A. The matrix is symmetric
B. The matrix is singular and cannot be inverted
C. All matrix elements are zero
D. The matrix is an identity matrix
**Answer:** B
**Explanation:** A matrix with a determinant of zero has linearly dependent rows or columns, making it singular (non-invertible).

---

### 2. Why is `np.linalg.solve(A, b)` preferred over `np.linalg.inv(A) @ b`?
A. `solve()` is written in pure Python
B. `solve()` uses LAPACK LU decomposition, which is faster and substantially more numerically stable than explicit matrix inversion
C. `np.linalg.inv` only works on integers
D. `solve()` returns integers only
**Answer:** B
**Explanation:** Computing an explicit matrix inverse introduces severe floating-point roundoff errors and requires extra computation. `np.linalg.solve()` solves the system directly via LU decomposition.

---

### 3. Which function solves overdetermined or singular linear systems by minimizing squared errors?
A. `np.linalg.det`
B. `np.linalg.lstsq`
C. `np.linalg.inv`
D. `np.linalg.norm`
**Answer:** B
**Explanation:** `np.linalg.lstsq()` computes the least-squares solution to linear matrix equations, accommodating non-square and singular matrices.

---

### 4. What is the expected result of multiplying an invertible matrix $A$ with its inverse $A^{-1}$ ($A @ A^{-1}$)?
A. The zero matrix
B. The identity matrix $I$
C. The transpose of $A$
D. A scalar determinant
**Answer:** B
**Explanation:** By definition of a matrix inverse, multiplying a matrix by its inverse yields the identity matrix ($A A^{-1} = I$).

---

### 5. What exception is raised if `np.linalg.solve()` is given a singular matrix?
A. `ZeroDivisionError`
B. `LinAlgError`
C. `ValueError`
D. `FloatingPointError`
**Answer:** B
**Explanation:** When encountering a non-invertible matrix, NumPy's linear algebra routines raise a `numpy.linalg.LinAlgError`.

---