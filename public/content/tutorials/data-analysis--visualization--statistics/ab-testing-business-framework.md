# A/B Testing Framework for Business & Product Decisions

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. What is A/B Testing?
**A/B Testing** (split testing) is the gold-standard scientific methodology used by top tech companies (Google, Amazon, Netflix, Flipkart) to validate product changes against measurable business KPIs.

---

## 2. The 5-Step A/B Testing Lifecycle
1. **Hypothesis Formulation:** e.g., *"Changing the checkout button from blue to green will increase checkout completion rates by at least 2 percentage points."*
2. **Sample Size & Power Analysis:** Calculate required sample size *before* starting to achieve $80%$ statistical power at $alpha = 0.05$.
3. **Randomized Assignment:** Split incoming user sessions randomly ($50/50$) into Control ($A$) and Treatment ($B$) groups.
4. **Experiment Execution:** Run the test for full business cycles (usually 2 full weeks to capture weekend vs weekday behavior).
5. **Statistical Evaluation:** Compute conversion rate differences, z-scores, p-values, and confidence intervals.

```python
from statsmodels.stats.proportion import proportions_ztest

# Conversions in Control vs Treatment
conversions = [120, 160]   # 120 converted in A, 160 in B
total_visitors = [2000, 2000] # 2,000 visitors in each bucket

z_stat, p_val = proportions_ztest(conversions, total_visitors)
print(f"Z-Stat: {z_stat:.4f}, P-Value: {p_val:.4f}")
```

---

# Multiple Choice Questions

### 1. Why must an A/B test run for a minimum duration of at least 1 to 2 full business cycles (e.g. 14 days)?
A. To account for day-of-week seasonality (e.g. weekend vs weekday shopping behavior) and novelty effects
B. Because Python scripts take 2 weeks to run
C. To let the servers cool down
D. Because Google requires 14 days
**Answer:** A
**Explanation:** Running tests across full weeks accounts for periodic weekly variations and transient novelty effects from returning users.
---

### 2. In experiment design, what is 'Statistical Power' (typically targeted at 80%)?
A. The probability of correctly detecting a genuine treatment effect when one actually exists ($1 - eta$)
B. The speed of the server
C. The number of CPU cores used
D. The total profit generated
**Answer:** A
**Explanation:** Statistical power ($1 - eta$) is the sensitivity of the test to avoid Type II false negatives.
---

### 3. What serious statistical error occurs if you continuously check the p-value every hour and stop the test the moment $p < 0.05$?
A. 'Peeking problem' (drastically inflates Type I false positive rate due to optional stopping)
B. Database lock
C. Zero variance
D. It improves test accuracy
**Answer:** A
**Explanation:** Repeatedly testing accumulating data without correcting thresholds invalidates the test mathematics, creating artificial false alarms.
---

### 4. Which function in `statsmodels` performs two-proportion hypothesis testing for conversion rates?
A. `proportions_ztest()`
B. `ab_test_run()`
C. `conversion_compare()`
D. `stats.diff()`
**Answer:** A
**Explanation:** `proportions_ztest()` evaluates differences between two independent conversion proportions.
---

### 5. What is the 'Novelty Effect' in A/B testing?
A. Existing users temporarily interact more with a new feature simply because it looks new, before behavior reverts to baseline
B. Reading novels online
C. Using new Python libraries
D. Designing colorful buttons
**Answer:** A
**Explanation:** The novelty effect causes an initial temporary spike in engagement that decays once users become accustomed to the interface.
---
