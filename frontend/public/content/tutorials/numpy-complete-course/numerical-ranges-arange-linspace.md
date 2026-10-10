# Generating Numerical Sequences (arange, linspace, logspace)

Mathematical modeling, data plotting, and algorithm testing often require continuous sequences of evenly distributed numbers. NumPy provides three core sequence generation engines: **`np.arange()`**, **`np.linspace()`**, and **`np.logspace()`**.

---

## 1. Step-Based Sequences with np.arange()

`np.arange()` is the NumPy counterpart to Python's built-in `range()`, but returns a contiguous ndarray and supports floating-point steps:

```python
import numpy as np

# Syntax: np.arange([start,] stop[, step,], dtype=None)

# 0 to 9 (start=0 default, step=1 default)
a = np.arange(10)
print(a)  # [0 1 2 3 4 5 6 7 8 9] (Stop value 10 is EXCLUDED!)

# 10 to 50 with step of 5
b = np.arange(10, 50, 5)
print(b)  # [10 15 20 25 30 35 40 45]

# Floating point step
c = np.arange(0.0, 1.0, 0.2)
print(c)  # [0.  0.2 0.4 0.6 0.8]
```

> **The Floating-Point Step Hazard in arange:**
> Because computer hardware stores floating-point numbers in binary fractions, steps like `0.1` have minor precision rounding errors. Sometimes `np.arange(0, 0.3, 0.1)` returns 3 elements, and sometimes 4 depending on floating-point round-off!
> **For floating-point sequences, ALWAYS use `np.linspace()` instead!**

![Array Creation and Numerical Ranges](/images/tutorials/numpy/array-creation-routines.svg)

---

## 2. Sample-Count Sequences with np.linspace()

When generating sample points for charting (such as generating 100 points between $0$ and $2pi$ to plot a smooth Sine wave), you do not know the step size; you know **how many points** you want. `np.linspace()` solves this perfectly:

```python
# Syntax: np.linspace(start, stop, num=50, endpoint=True)

# Generate exactly 5 evenly spaced points between 0 and 1
pts = np.linspace(0, 1, 5)
print(pts)  # [0.   0.25 0.5  0.75 1.  ]
```

### Key Properties of linspace:
* **Endpoint is Included:** Unlike `arange()`, the `stop` value is **included by default**!
* **Calculating the Step:** NumPy calculates the exact step internally: `step = (stop - start) / (num - 1)`.
* **Retaining the Step Size:** Pass `retstep=True` to get both the array and the calculated step delta:
  ```python
  arr, step = np.linspace(0, 100, 5, retstep=True)
  print(step)  # 25.0
  ```

---

## 3. Logarithmic Scales with np.logspace()

For frequencies, decibels, seismic Richter scales, or machine learning hyperparameter tuning (e.g., testing learning rates across orders of magnitude from $10^{-4}$ to $10^{1}$):

```python
# Syntax: np.logspace(start, stop, num=50, base=10.0)

# Generates 5 points spaced evenly on a log scale from 10^1 (10) to 10^4 (10000)
log_pts = np.logspace(1, 4, num=4)
print(log_pts)  # [   10.   100.  1000. 10000.]

# Powers of 2: from 2^0 (1) to 2^8 (256)
powers_of_two = np.logspace(0, 8, num=9, base=2)
print(powers_of_two)  # [  1.   2.   4.   8.  16.  32.  64. 128. 256.]
```

---

# Multiple Choice Questions

### 1. What will 'np.arange(2, 10, 2)' return?
A. array([2, 4, 6, 8, 10])
B. array([2, 4, 6, 8])
C. array([2, 5, 8])
D. array([4, 6, 8, 10])
**Answer:** B
**Explanation:** np.arange excludes the stop boundary (10), starting at 2 and stepping by 2 to yield [2, 4, 6, 8].

---

### 2. Why is 'np.linspace()' strongly preferred over 'np.arange()' when generating floating-point ranges for data visualization?
A. linspace runs in C++ while arange runs in Python
B. Floating-point rounding errors in arange can lead to unpredictable element counts and boundary inclusion
C. linspace cannot handle integers
D. arange does not support decimals
**Answer:** B
**Explanation:** Binary floating-point representation quirks can make the exact stop point in arange unpredictable; linspace guarantees the exact requested number of points.

---

### 3. By default, is the 'stop' value included or excluded in 'np.linspace(0, 10, 5)'?
A. Excluded
B. Included (endpoint=True by default)
C. Included only on weekends
D. Rounded to nearest prime
**Answer:** B
**Explanation:** In np.linspace(), endpoint=True by default, meaning the stop value (10) is guaranteed to be the final element of the array.

---

### 4. What will 'np.linspace(0, 100, 5)' produce?
A. array([0., 20., 40., 60., 80.])
B. array([0., 25., 50., 75., 100.])
C. array([0., 10., 20., 30., 40.])
D. array([5., 25., 50., 75., 100.])
**Answer:** B
**Explanation:** Spacing 5 numbers evenly between 0 and 100 divides the interval into 4 steps of 25.0: 0, 25, 50, 75, 100.

---

### 5. What does the first argument 'start=2' represent in 'np.logspace(2, 5, num=4, base=10)'?
A. The number 2
B. The exponent power 10^2 = 100
C. 20
D. A 2-dimensional matrix
**Answer:** B
**Explanation:** In logspace, the start and stop arguments represent exponents of the specified base (10^2 to 10^5).

---
