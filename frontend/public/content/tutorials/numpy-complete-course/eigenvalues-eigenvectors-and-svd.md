# Matrix Decompositions: eig(), eigh(), & SVD

Matrix decomposition (factorization) expresses a complex matrix as a product of canonical, interpretable constituent components. In modern computing, spectral decompositions and **Singular Value Decomposition (SVD)** power:
- Principal Component Analysis (PCA) for dimensionality reduction.
- Recommendation engines (collaborative filtering / matrix completion).
- Image compression and denoising.
- Google's original PageRank algorithm and quantum mechanics state vectors.

NumPy's `np.linalg` module provides production-grade LAPACK bindings for these algorithms.

---

## 1. Eigenvalues and Eigenvectors: `np.linalg.eig()`

For a square matrix $A$, an **eigenvector** $\mathbf{v}$ and corresponding **eigenvalue** $\lambda$ satisfy:

$$A \mathbf{v} = \lambda \mathbf{v}$$

This states that multiplying matrix $A$ by vector $\mathbf{v}$ does not alter its direction—it merely scales it by factor $\lambda$.

```python
import numpy as np

A = np.array([
    [2.0, 1.0],
    [1.0, 2.0]
])

# Compute eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)

print("Eigenvalues:  ", eigenvalues)
print("Eigenvectors:
", eigenvectors)

# Verification: A @ v == lambda * v for the first eigenpair
v0 = eigenvectors[:, 0]
lambda0 = eigenvalues[0]

print("
A @ v0:      ", A @ v0)
print("lambda0 * v0:", lambda0 * v0)
```

**Output:**
```text
Eigenvalues:   [3. 1.]
Eigenvectors:
 [[ 0.70710678 -0.70710678]
 [ 0.70710678  0.70710678]]

A @ v0:       [2.12132034 2.12132034]
lambda0 * v0: [2.12132034 2.12132034]
```

> **Crucial Array Structure:** The eigenvectors in NumPy are returned as **column vectors**! The $i$-th eigenvector is accessed as `eigenvectors[:, i]`, NOT `eigenvectors[i]`.

---

## 2. Symmetric / Hermitian Matrices: `np.linalg.eigh()`

In data science, covariance and correlation matrices are always **symmetric** ($A = A^T$).

For symmetric or Hermitian matrices, **always use `np.linalg.eigh()`** rather than `eig()`:
- Guaranteed purely real eigenvalues (no spurious imaginary components like `0.0j`).
- Uses specialized LAPACK routines that are approximately **2x faster** and numerically more stable.
- Guaranteed to return eigenvalues in **ascending sorted order**.

```python
# Covariance matrix (always symmetric)
cov_matrix = np.array([[4.0, 1.5],
                       [1.5, 3.0]])

# eigh guarantees real sorted eigenvalues:
w, v = np.linalg.eigh(cov_matrix)
print("Sorted real eigenvalues:", w)
```

---

## 3. Singular Value Decomposition (SVD): `np.linalg.svd()`

While eigendecomposition applies only to square matrices, **SVD works on ANY $M \times N$ rectangular matrix**:

$$A = U \Sigma V^T$$

Where:
- $U$: $M \times M$ orthogonal matrix (left singular vectors).
- $\Sigma$: $M \times N$ diagonal matrix of singular values in descending order.
- $V^T$: $N \times N$ orthogonal matrix (right singular vectors transposed).

```python
M = np.array([[1.0, 2.0, 3.0],
              [4.0, 5.0, 6.0]])  # shape (2, 3)

U, s, Vt = np.linalg.svd(M)

print("U shape: ", U.shape)   # (2, 2)
print("s vector:", s)         # singular values: [9.508032, 0.77286964]
print("Vt shape:", Vt.shape)  # (3, 3)
```

---

## 4. Real-World Application: Low-Rank Image Compression

A grayscale image of size $1000 \times 1000$ requires $1,000,000$ numbers. By truncating the SVD to the top $k$ singular values (low-rank approximation), we can reconstruct high-fidelity images using a tiny fraction of the data:

$$\tilde{A}_k = \sum_{i=1}^k s_i \mathbf{u}_i \mathbf{v}_i^T$$

```python
# Create a synthetic 100x100 pattern
X = np.random.randn(100, 100)
U, s, Vt = np.linalg.svd(X)

# Reconstruct using only the top 10 components (rank-10 approximation)
k = 10
compressed = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
print("Compressed approximation shape:", compressed.shape)
print(f"Data reduction: {100*100} floats reduced to {10*(100 + 1 + 100)} floats!")
```

---

# Multiple Choice Questions

### 1. In NumPy's `np.linalg.eig()`, how is the $i$-th eigenvector accessed from the returned eigenvector matrix `v`?
A. `v[i]`
B. `v[:, i]`
C. `v[i, :]`
D. `v.T[i, i]`
**Answer:** B
**Explanation:** Eigenvectors are normalized column vectors stored vertically. The $i$-th eigenvector corresponds to the $i$-th column, accessed via `v[:, i]`.

---

### 2. Why should `np.linalg.eigh()` be used instead of `np.linalg.eig()` for covariance matrices?
A. It only works on 1D arrays
B. Covariance matrices are symmetric, and `eigh` is optimized for symmetric/Hermitian matrices, ensuring real eigenvalues and faster computation
C. `eig()` cannot calculate determinants
D. `eigh()` converts values to integers
**Answer:** B
**Explanation:** The 'h' in `eigh` stands for Hermitian (symmetric). It leverages specialized LAPACK routines that run approximately 2x faster, avoid spurious imaginary artifacts, and sort eigenvalues.

---

### 3. What shapes are returned by `np.linalg.svd(A)` for a matrix $A$ of shape $(M, N)$ with default full matrices?
A. $U: (M, M)$, $s: (\min(M, N),)$, $V^T: (N, N)$
B. $U: (M, N)$, $s: (M, N)$, $V^T: (N, N)$
C. $U: (M, 1)$, $s: (N, 1)$, $V^T: (1, 1)$
D. A single tuple of scalars
**Answer:** A
**Explanation:** In full SVD, $U$ is $(M, M)$, $s$ is a 1D vector of $min(M, N)$ singular values in descending order, and $V^T$ is $(N, N)$.

---

### 4. What does Singular Value Decomposition (SVD) represent geometrically?
A. Transposition followed by inversion
B. Rotation/reflection ($V^T$), scaling along axes ($s$), followed by another rotation/reflection ($U$)
C. Random sampling
D. Row reduction to echelon form
**Answer:** B
**Explanation:** SVD decomposes any linear transformation into three consecutive geometric actions: an initial orthogonal rotation/reflection, a scaling along the axes by singular values, and a final orthogonal rotation/reflection.

---

### 5. If $A \mathbf{v} = \lambda \mathbf{v}$, what is $\mathbf{v}$ called?
A. Eigenvalue
B. Eigenvector
C. Singular scalar
D. Residual
**Answer:** B
**Explanation:** In linear algebra, $mathbf{v}$ is the eigenvector corresponding to eigenvalue $lambda$ because matrix $A$ only scales $mathbf{v}$ without rotating it.

---