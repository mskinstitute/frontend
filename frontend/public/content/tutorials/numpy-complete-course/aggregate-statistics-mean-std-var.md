# Summary Statistics: sum(), prod(), mean(), std(), var()

Descriptive statistics summarize, describe, and reveal properties of numerical datasets. In data science, feature engineering, and statistical modeling, calculating aggregates—such as totals, averages, standard deviations, and variances—is a fundamental first step.

NumPy provides highly optimized aggregation functions implemented in C, equipped with options for numerical stability and degree-of-freedom adjustments.

---

## 1. Core Summary Functions

```python
import numpy as np

data = np.array([12.5, 18.2, 29.4, 15.1, 22.8, 31.0, 19.6])

print("Count:              ", data.size)
print("Sum:                ", np.sum(data))
print("Product:            ", np.prod(data))
print("Minimum:            ", np.min(data))
print("Maximum:            ", np.max(data))
print("Mean (Average):     ", np.mean(data))
print("Median (50th %ile): ", np.median(data))
print("Variance:           ", np.var(data))
print("Standard Deviation: ", np.std(data))
```

---

## 2. Population vs Sample Variance: The `ddof` Parameter

A critical statistical distinction often missed by beginners is **Degrees of Freedom**:

$$\sigma^2_{\text{pop}} = \frac{1}{N} \sum_{i=1}^N (x_i - \mu)^2 \qquad s^2_{\text{sample}} = \frac{1}{N - 1} \sum_{i=1}^N (x_i - \bar{x})^2$$

- In **NumPy**, by default, `np.var()` and `np.std()` set `ddof=0` (**Population variance**, dividing by $N$).
- In **Pandas**, by default, `.var()` and `.std()` set `ddof=1` (**Sample variance**, dividing by $N - 1$, Bessel's correction).

To match unbiased sample statistics in academic research or Pandas:

```python
samples = np.array([10.0, 12.0, 23.0, 23.0, 16.0, 23.0, 21.0, 16.0])

# Population standard deviation (divide by N):
pop_std = np.std(samples, ddof=0)
print(f"Population Std (ddof=0): {pop_std:.4f}")

# Unbiased sample standard deviation (divide by N - 1):
sample_std = np.std(samples, ddof=1)
print(f"Sample Std (ddof=1):     {sample_std:.4f}")
```

**Output:**
```text
Population Std (ddof=0): 4.8974
Sample Std (ddof=1):     5.2372
```

---

## 3. Cumulative Aggregations: `cumsum()` and `cumprod()`

In time-series analysis and financial quantitative modeling, running totals and compound returns are computed via cumulative functions:

```python
# Daily stock price percentage returns
daily_returns = np.array([0.02, -0.01, 0.03, 0.015, -0.005])

# Cumulative sum (running total)
cumulative_gains = np.cumsum(daily_returns)
print("Cumulative gains:", cumulative_gains)

# Compound growth: (1 + r1) * (1 + r2) * ...
growth_factors = 1.0 + daily_returns
wealth_index = np.cumprod(growth_factors)
print("Wealth growth index:", wealth_index)
```

---

## 4. Handling Missing Data with `nanmean`, `nansum`, etc.

If an array contains even a single `np.nan` (Not a Number), standard aggregation functions return `nan` by default:

```python
dirty_data = np.array([10.0, 25.0, np.nan, 40.0, 15.0])

print("Standard sum:", np.sum(dirty_data))    # Output: nan
print("Standard mean:", np.mean(dirty_data))  # Output: nan
```

NumPy includes a dedicated family of **NaN-safe functions** that automatically ignore missing values during computation:

```python
print("NaN-safe sum:  ", np.nansum(dirty_data))   # 90.0
print("NaN-safe mean: ", np.nanmean(dirty_data))  # 90 / 4 = 22.5
print("NaN-safe std:  ", np.nanstd(dirty_data))   # calculates over 4 valid items
print("NaN-safe min:  ", np.nanmin(dirty_data))   # 10.0
```

---

# Multiple Choice Questions

### 1. What is the default value of the Delta Degrees of Freedom (`ddof`) parameter in `np.std()` and `np.var()`?
A. 1
B. 0
C. 2
D. None
**Answer:** B
**Explanation:** NumPy defaults to `ddof=0` (population variance, dividing by $N$), unlike Pandas which defaults to `ddof=1` (sample variance with Bessel's correction).

---

### 2. If an array contains `[5.0, 15.0, np.nan]`, what does `np.mean(arr)` evaluate to?
A. 10.0
B. 6.67
C. `np.nan`
D. It raises a ValueError
**Answer:** C
**Explanation:** Standard aggregation functions propagate NaNs. Any arithmetic operation involving NaN produces NaN. To ignore NaNs, use `np.nanmean()`.

---

### 3. Which NumPy function computes the running cumulative sum of an array?
A. `np.sum_all()`
B. `np.cumsum()`
C. `np.running_sum()`
D. `np.add_reduce()`
**Answer:** B
**Explanation:** `np.cumsum()` computes the cumulative sum of elements along a given axis, returning an array of the same size where each position is the sum of all preceding elements.

---

### 4. Given `data = np.array([10, 20, 30])`, what is the result of `np.cumprod(data)`?
A. `[10, 200, 6000]`
B. `6000`
C. `[10, 30, 60]`
D. `[10, 100, 1000]`
**Answer:** A
**Explanation:** `np.cumprod` calculates running products: position 0 is 10; position 1 is $10 	imes 20 = 200$; position 2 is $200 	imes 30 = 6000$.

---

### 5. How can you calculate the unbiased sample variance (dividing by $N-1$) of an array `x` in NumPy?
A. `np.var(x)`
B. `np.var(x, ddof=1)`
C. `np.sample_var(x)`
D. `np.var(x) / (len(x) - 1)`
**Answer:** B
**Explanation:** Setting `ddof=1` in `np.var()` applies Bessel's correction, dividing the sum of squared deviations by $N - 1$ to calculate unbiased sample variance.

---