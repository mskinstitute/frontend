# Measures of Central Tendency & Dispersion

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. What is Central Tendency?
**Central Tendency** describes the central or typical value around which quantitative data points cluster:
- **Mean (Average):** The arithmetic center $\bar{x} = \frac{\sum x}{n}$. Highly sensitive to extreme outliers.
- **Median (50th Percentile):** The middle value when sorted. Resistant to outliers (robust).
- **Mode:** The most frequently occurring value in the dataset.

---

## 2. What is Statistical Dispersion?
**Dispersion** measures how widely the data points are spread out from the center:
- **Range:** $Max - Min$
- **Variance ($s^2$):** The average squared deviation from the mean: $s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$.
- **Standard Deviation ($s$):** The square root of variance: $s = \sqrt{s^2}$ (in original data units!).
- **Interquartile Range (IQR):** $Q3 - Q1$ (spread of middle 50%).

```python
import pandas as pd
import numpy as np

salaries = pd.Series([35000, 42000, 39000, 45000, 51000, 48000, 1500000]) # Note extreme outlier!

print(f"Mean:   ₹{salaries.mean():,.2f}")   # Heavily distorted by outlier!
print(f"Median: ₹{salaries.median():,.2f}") # Unaffected, represents true typical salary!
print(f"Std Dev: ₹{salaries.std():,.2f}")
print(f"IQR:    ₹{salaries.quantile(0.75) - salaries.quantile(0.25):,.2f}")
```

---

# Multiple Choice Questions

### 1. In a dataset with extreme high outliers (e.g. employee salaries with a billionaire CEO), which measure of central tendency is the most reliable?
A. Mean
B. Median
C. Range
D. Standard deviation
**Answer:** B
**Explanation:** The median is a non-parametric, robust measure that is not pulled by extreme high or low outliers.
---

### 2. What is the mathematical relationship between Variance and Standard Deviation?
A. Standard Deviation is the square root of Variance ($s = \sqrt{s^2}$)
B. Variance is the square root of Standard Deviation
C. Standard Deviation is Variance multiplied by 2
D. They are completely unrelated
**Answer:** A
**Explanation:** Standard deviation is defined as the positive square root of variance, returning dispersion back into original measurement units.
---

### 3. If a dataset has a standard deviation of 0, what does this imply?
A. All observations in the dataset have the exact same value
B. All observations are negative
C. The mean is zero
D. The calculation failed
**Answer:** A
**Explanation:** Zero dispersion means every data point is identical to the mean.
---

### 4. Which quantile corresponds to the Median of a dataset?
A. 25th percentile (Q1)
B. 50th percentile (Q2)
C. 75th percentile (Q3)
D. 90th percentile
**Answer:** B
**Explanation:** The 50th percentile (or second quartile Q2) divides sorted data into two equal halves.
---

### 5. Why is sample variance divided by $n - 1$ instead of $n$ (Bessel's correction)?
A. To correct for bias, providing an unbiased estimator of the true population variance
B. Because of zero indexing in Python
C. To prevent division by zero in all cases
D. Because the last row is always dropped
**Answer:** A
**Explanation:** Bessel's correction ($n - 1$ degrees of freedom) compensates for the fact that sample spread underestimates population spread.
---
