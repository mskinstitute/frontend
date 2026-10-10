# T-Tests Implementation in Python (scipy.stats)

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. When to Use a T-Test?
A **Student's t-test** determines whether the means of two groups are statistically different from each other.

### The 3 Variations of T-Tests:
1. **One-Sample T-Test:** Compares the mean of a single group against a known population benchmark $\mu_0$.
2. **Two-Sample Independent T-Test:** Compares the means of two distinct, unrelated groups (e.g. Website Variant A vs Variant B).
3. **Paired T-Test:** Compares measurements taken on the same subjects before and after an intervention (e.g. Employee skills test Before vs After training).

---

## 2. Python Implementation with `scipy.stats`

```python
import numpy as np
from scipy import stats

# Variant A (Control group conversions)
group_A = np.array([45, 52, 48, 55, 49, 53, 50, 47, 51, 54])
# Variant B (New feature group conversions)
group_B = np.array([58, 62, 59, 65, 57, 63, 61, 60, 64, 59])

# Perform Two-Sample Independent T-Test
# equal_var=False performs Welch's t-test (best practice!)
t_stat, p_val = stats.ttest_ind(group_A, group_B, equal_var=False)

print(f"T-Statistic: {t_stat:.4f}")
print(f"P-Value:     {p_val:.6f}")

if p_val < 0.05:
    print("Conclusion: Reject H0! Variant B produces statistically significantly higher conversions.")
else:
    print("Conclusion: Fail to reject H0.")
```

**Output:**
```text
T-Statistic: -8.8415
P-Value:     0.000000
Conclusion: Reject H0! Variant B produces statistically significantly higher conversions.
```

---

# Multiple Choice Questions

### 1. Which function in `scipy.stats` conducts an independent two-sample t-test between two groups?
A. `stats.ttest_ind()`
B. `stats.ttest_rel()`
C. `stats.ttest_1samp()`
D. `stats.t_two()`
**Answer:** A
**Explanation:** `stats.ttest_ind()` executes an independent two-sample t-test.
---

### 2. Why is setting `equal_var=False` recommended when running `stats.ttest_ind()`?
A. It performs Welch's t-test, which does not assume equal variances between the two groups, providing more reliable results
B. It makes the test run faster
C. It rounds the p-value
D. It deletes outliers automatically
**Answer:** A
**Explanation:** Welch's t-test (`equal_var=False`) is more robust than Student's classic t-test when group sample sizes or variances differ.
---

### 3. Which t-test is appropriate when testing the test scores of the same 30 students before and after a training workshop?
A. Independent two-sample t-test
B. Paired sample t-test (`stats.ttest_rel`)
C. Chi-square test
D. Z-test
**Answer:** B
**Explanation:** Paired t-tests (`ttest_rel`) evaluate repeated measures on the exact same subjects across two timepoints.
---

### 4. What test statistic is evaluated against Student's t-distribution in a t-test?
A. F-statistic
B. T-statistic
C. Chi-square statistic
D. R-squared
**Answer:** B
**Explanation:** The t-statistic measures the ratio of the difference between group means to the standard error of that difference.
---

### 5. If the p-value returned by `stats.ttest_1samp()` is 0.42, what is the proper conclusion at $alpha = 0.05$?
A. Reject null hypothesis
B. Fail to reject null hypothesis; insufficient evidence that sample mean differs from benchmark
C. The benchmark is false
D. Rerun the test 100 times
**Answer:** B
**Explanation:** Since $p = 0.42 > 0.05$, we fail to reject the null hypothesis.
---
