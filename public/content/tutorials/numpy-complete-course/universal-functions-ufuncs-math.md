# Mathematical ufuncs: Trigonometric, Exponential, Logarithmic

At the technical core of NumPy's blazing numerical speed lies the concept of **Universal Functions** (commonly abbreviated as **ufuncs**). 

A **ufunc** is a function that operates on ndarrays in an element-by-element fashion. Unlike standard Python math functions from the `math` module (which accept only single scalar numbers and must be invoked sequentially inside loops), NumPy ufuncs are compiled C routines that support broadcasting, type coercion, and direct memory output targeting.

![NumPy Vectorization and ufuncs](/images/tutorials/numpy/vectorization-and-ufuncs.svg)

---

## 1. Trigonometric and Angle Routines

NumPy provides complete implementations of trigonometric functions. All trigonometric ufuncs expect angles expressed in **radians** (not degrees):

$$\text{radians} = \text{degrees} \times \frac{\pi}{180}$$

```python
import numpy as np

# Create angles in degrees and convert to radians
angles_deg = np.array([0, 30, 45, 60, 90, 180, 270, 360])
angles_rad = np.deg2rad(angles_deg)  # or np.radians(angles_deg)

# Evaluate sine, cosine, and tangent simultaneously
sin_values = np.sin(angles_rad)
cos_values = np.cos(angles_rad)
tan_values = np.tan(angles_rad)

print("Degrees: ", angles_deg)
print("Sine:    ", np.round(sin_values, 4))
print("Cosine:  ", np.round(cos_values, 4))
```

**Output:**
```text
Degrees:  [  0  30  45  60  90 180 270 360]
Sine:     [ 0.      0.5     0.7071  0.866   1.      0.     -1.     -0.    ]
Cosine:   [ 1.      0.866   0.7071  0.5     0.     -1.     -0.      1.    ]
```

### Inverse Trigonometric Functions and `arctan2`:
When computing angles from Cartesian coordinates $(x, y)$, standard `arctan(y/x)` loses quadrant information and risks division by zero. Always use `np.arctan2(y, x)`:

```python
y = np.array([1.0, 1.0, -1.0, -1.0])
x = np.array([1.0, -1.0, -1.0, 1.0])

# Correct quadrant angle in [-pi, pi]
theta = np.rad2deg(np.arctan2(y, x))
print("Quadrant angles (deg):", theta)  # [45. 135. -135. -45.]
```

---

## 2. Exponential and Logarithmic ufuncs

Logarithmic and exponential transformations are essential across data preprocessing (log-transforming skewed financial returns or heavy-tailed distributions):

```python
x = np.array([1.0, 10.0, 100.0, 1000.0])

# Natural logarithm (base e)
print("Natural log (ln x):    ", np.log(x))

# Common logarithm (base 10)
print("Base-10 log (log10 x): ", np.log10(x))

# Binary logarithm (base 2 - information theory / bits)
print("Base-2 log (log2 x):   ", np.log2(x))

# Natural exponential (e^x)
powers = np.array([0.0, 1.0, 2.0, 3.0])
print("exp(x):                ", np.exp(powers))
```

### Numerical Precision: `log1p` and `expm1`
When $x$ is near zero, evaluating $\ln(1 + x)$ using `np.log(1 + x)` suffers from catastrophic floating-point cancellation. NumPy provides `np.log1p(x)` and its inverse `np.expm1(x)`:

```python
tiny = 1e-15
print("Standard log(1 + tiny):", np.log(1.0 + tiny))   # loses precision: 0.0 or truncated
print("Precision log1p(tiny):  ", np.log1p(tiny))       # accurate: 1e-15
```

---

## 3. High-Performance Optimization: The `out` Parameter

Every time you execute `y = np.sin(x)`, NumPy allocates a brand new memory buffer for the result. When processing massive datasets (gigabytes of sensor streams), continuous memory allocations trigger garbage collection and waste bandwidth.

All ufuncs provide an optional **`out` parameter** to write results directly into an existing pre-allocated buffer:

```python
data = np.linspace(0, 10, 10_000_000)
output_buffer = np.empty_like(data)

# Writes directly into output_buffer without allocating new RAM!
np.sin(data, out=output_buffer)
print("Buffer successfully populated in-place. Mean:", output_buffer.mean())
```

---

# Multiple Choice Questions

### 1. In what unit of measurement do trigonometric ufuncs like `np.sin()` and `np.cos()` expect input angles?
A. Degrees
B. Radians
C. Gradians
D. Revolutions
**Answer:** B
**Explanation:** NumPy's trigonometric universal functions strictly expect angles in radians. Use `np.deg2rad()` or `np.radians()` to convert from degrees.

---

### 2. Why is `np.arctan2(y, x)` preferred over `np.arctan(y / x)` in computer vision and robotics?
A. `np.arctan2` runs on GPUs
B. `np.arctan2` correctly identifies the full four-quadrant angle in `[-pi, pi]` and handles division by zero when `x == 0`
C. `np.arctan` only works with integer dtypes
D. `np.arctan2` converts the output to degrees automatically
**Answer:** B
**Explanation:** `np.arctan2(y, x)` takes signs of both arguments into account to determine the correct quadrant between $-pi$ and $+pi$, and cleanly avoids division-by-zero errors when $x = 0$.

---

### 3. What is the benefit of using `np.log1p(x)` instead of `np.log(1 + x)` when `x` is extremely small (e.g. `1e-15`)?
A. It calculates base-10 logarithm instead of base-e
B. It avoids catastrophic floating-point cancellation error when adding small numbers to 1.0
C. It rounds numbers to the nearest integer
D. It accepts negative values without returning NaN
**Answer:** B
**Explanation:** Standard floating-point addition `1.0 + 1e-15` loses low-order bits due to precision limits. `np.log1p(x)` utilizes specialized Taylor series algorithms to retain precision for near-zero inputs.

---

### 4. What does the `out` parameter in a universal function like `np.exp(x, out=buffer)` accomplish?
A. It redirects printed outputs to a file
B. It stores results into a pre-allocated memory array without allocating new heap memory
C. It limits output values to positive numbers
D. It flattens the output array
**Answer:** B
**Explanation:** Passing a pre-allocated array to `out` instructs the C loop to write results directly into that memory block, eliminating dynamic memory allocations and boosting performance.

---

### 5. Which NumPy ufunc computes the common base-10 logarithm?
A. `np.ln()`
B. `np.log()`
C. `np.log10()`
D. `np.logb(10)`
**Answer:** C
**Explanation:** `np.log()` computes the natural (base $e$) logarithm, while `np.log10()` computes the common (base 10) logarithm.

---