# Skewness, Kurtosis & Identifying Outliers with Z-Score

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Distribution Shape: Skewness & Kurtosis
- **Skewness:** Measures asymmetry of the distribution:
  - **Symmetric ($Skew \approx 0$):** $Mean = Median = Mode$.
  - **Right / Positive Skew ($Skew > 0$):** Long tail on the right. $Mean > Median$. (Common in wealth, revenue, response times).
  - **Left / Negative Skew ($Skew < 0$):** Long tail on the left. $Mean < Median$. (Common in human lifespan, test scores).
- **Kurtosis:** Measures "tailedness" and likelihood of extreme events:
  - **Mesokurtic ($Kurt \approx 3$ / Excess $\approx 0$):** Standard normal distribution.
  - **Leptokurtic ($Excess > 0$):** Fat tails, high risk of black-swan outliers.

---

## 2. Detecting Outliers using Z-Scores
The **Z-Score** measures how many standard deviations an observation lies from the mean:
$$Z = \frac{x - \mu}{\sigma}$$

Observations with $|Z| > 3.0$ are statistically classified as extreme outliers:

```python
import pandas as pd
from scipy import stats

data = pd.Series([12, 14, 15, 14, 16, 15, 13, 15, 14, 98]) # 98 is an outlier!

z_scores = stats.zscore(data)
outliers = data[abs(z_scores) > 3.0]
print("Detected Outliers:\n", outliers)
```

---

# Multiple Choice Questions

### 1. In a positively (right) skewed distribution, what is the typical relationship between the Mean and the Median?
A. $Mean > Median$
B. $Mean < Median$
C. $Mean = Median$
D. $Median = 0$
**Answer:** A
**Explanation:** Positive skew pulls the mean toward the long right-hand tail, making $Mean > Median$.
---

### 2. An observation with a Z-Score of $Z = +3.5$ means what?
A. The value is 3.5 units greater than the median
B. The value lies 3.5 standard deviations above the mean (an extreme outlier)
C. The value is 3.5% of the total
D. The value has a 35% probability of occurrence
**Answer:** B
**Explanation:** Z-score measures the signed number of standard deviations an observation is located relative to the mean.
---

### 3. What does high positive excess kurtosis (leptokurtic distribution) indicate in financial risk modeling?
A. The distribution has fat tails and higher probability of extreme outlier events than a normal distribution
B. The dataset is completely empty
C. The asset has zero risk
D. All returns are negative
**Answer:** A
**Explanation:** Leptokurtic distributions have heavy tails, indicating greater likelihood of extreme positive and negative outliers.
---

### 4. Which Pandas method computes the skewness of numerical columns?
A. `df.skew()`
B. `df.asymmetry()`
C. `df.tilt()`
D. `df.shape_metric()`
**Answer:** A
**Explanation:** `df.skew()` returns the unbiased Fisher-Pearson coefficient of skewness.
---

### 5. What threshold for $|Z|$ is commonly used as a rule-of-thumb cutoff for flagging statistical outliers?
A. $|Z| > 3.0$
B. $|Z| > 0.1$
C. $|Z| > 50$
D. $|Z| > 0$
**Answer:** A
**Explanation:** Under a normal distribution, 99.73% of observations fall within $\pm 3$ standard deviations; values beyond $|Z| > 3.0$ are rare outliers.
---
