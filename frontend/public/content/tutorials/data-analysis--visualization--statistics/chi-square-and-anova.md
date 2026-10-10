# Chi-Square Test of Independence & ANOVA Basics

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. When Categorical Data Meets Statistics: Chi-Square
While t-tests compare numerical means, the **Chi-Square ($\chi^2$) Test of Independence** evaluates whether two categorical variables are independent or related (e.g., Is Customer Churn related to Device Type: Mobile vs Desktop?).

```python
import pandas as pd
from scipy import stats

# Contingency Table: Device vs Churn
# Rows: Mobile, Desktop; Columns: Retained, Churned
contingency_table = [
    [120, 30], # Mobile: 120 retained, 30 churned
    [80, 50]   # Desktop: 80 retained, 50 churned
]

chi2_stat, p_val, dof, expected = stats.chi2_contingency(contingency_table)

print(f"Chi2 Statistic: {chi2_stat:.4f}")
print(f"P-Value:        {p_val:.4f}")
```

---

## 2. Comparing 3 or More Means: One-Way ANOVA
A common amateur mistake is running multiple t-tests to compare 3 or more groups (e.g. Sales across North, South, East, West). Doing so multiplies your Type I error rate!

Instead, use **ANOVA (Analysis of Variance)**, which uses the **F-statistic** to evaluate whether *at least one* group mean differs:

```python
group_north = [45, 52, 48, 50]
group_south = [65, 70, 68, 72]
group_east  = [55, 58, 54, 57]

f_stat, p_val = stats.f_oneway(group_north, group_south, group_east)
print(f"ANOVA F-Stat: {f_stat:.4f}, P-Value: {p_val:.4f}")
```

---

# Multiple Choice Questions

### 1. Which statistical test evaluates whether two categorical variables are independent of each other?
A. Student's t-test
B. Chi-Square Test of Independence (`stats.chi2_contingency`)
C. Linear regression
D. Pearson correlation
**Answer:** B
**Explanation:** The Chi-Square test of independence examines contingency tables to determine if categorical frequencies diverge from expected independence.
---

### 2. Why should you NOT perform multiple pairwise t-tests to compare 4 regional groups?
A. It causes family-wise error rate inflation (drastically inflating the probability of committing a Type I error)
B. Python cannot run more than 1 t-test
C. T-tests only work on integers
D. The results become negative
**Answer:** A
**Explanation:** Multiple testing inflates $alpha$; with 4 groups (6 pairwise tests), the false-positive rate spikes from 5% to nearly 26%. ANOVA tests all groups simultaneously.
---

### 3. What is the test statistic calculated during an ANOVA test?
A. F-statistic (ratio of variance between groups to variance within groups)
B. Z-score
C. T-statistic
D. Chi-square
**Answer:** A
**Explanation:** ANOVA evaluates the F-ratio ($MS_{between} / MS_{within}$).
---

### 4. If an ANOVA test yields $p = 0.002$, what is the conclusion?
A. All group means are exactly identical
B. At least one group mean is statistically significantly different from the others
C. All group variances are zero
D. The sample size was too small
**Answer:** B
**Explanation:** A significant ANOVA indicates that at least one group mean deviates, warranting post-hoc tests (like Tukey HSD) to locate the difference.
---

### 5. In `stats.chi2_contingency()`, what does the 'expected' return array represent?
A. The theoretical frequencies that would occur if the two variables were completely independent
B. The customer expectations survey
C. Predictions for next year
D. Median values
**Answer:** A
**Explanation:** The expected table contains the frequencies calculated under the assumption that the null hypothesis (complete independence) is true.
---
