# Formulating Null & Alternative Hypotheses & p-values

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. What is Hypothesis Testing?
In business analytics, we constantly test assumptions (e.g. "Did our new website design increase conversion rates?", "Is supplier A producing fewer defective parts than supplier B?").

**Hypothesis Testing** is a formal statistical framework for evaluating whether an observed difference is genuine or merely random sample fluctuation.

---

## 2. Setting Up Hypotheses
1. **Null Hypothesis ($H_0$):** The baseline assumption of **no effect**, no change, or no difference. (e.g. $H_0: \mu_{new} = \mu_{old}$).
2. **Alternative Hypothesis ($H_1$ or $H_a$):** The claim we are trying to prove—that there is a statistically significant effect (e.g. $H_1: \mu_{new} \ne \mu_{old}$).

---

## 3. The P-Value & Significance Level ($\alpha$)
- **Significance Level ($\alpha$):** The probability threshold of committing a Type I error (false positive). By convention, $\alpha = 0.05$ (5%).
- **P-Value:** The probability of observing a result at least as extreme as the sample data, assuming the Null Hypothesis ($H_0$) is true.

### The Decision Rule:
> - **If $p < \alpha$ (e.g. $p < 0.05$):** Reject $H_0$! The result is statistically significant.
> - **If $p \ge \alpha$:** Fail to reject $H_0$. There is insufficient evidence to claim an effect.

---

## 4. Type I vs Type II Errors
- **Type I Error ($alpha$, False Positive):** Rejecting $H_0$ when it was actually true (e.g., convicting an innocent person).
- **Type II Error ($eta$, False Negative):** Failing to reject $H_0$ when it was actually false (e.g., letting a guilty person walk free).

---

# Multiple Choice Questions

### 1. What does a p-value of $p = 0.018$ indicate when evaluated against a significance level of $alpha = 0.05$?
A. Reject the null hypothesis ($H_0$); the difference is statistically significant
B. Fail to reject the null hypothesis
C. The experiment is invalid
D. The effect size is exactly 1.8%
**Answer:** A
**Explanation:** When $p < alpha$, we reject $H_0$, concluding that the observed effect is unlikely to be due to chance alone.
---

### 2. What is a Type I error in statistical testing?
A. False Positive: Rejecting the null hypothesis when it is actually true
B. False Negative: Failing to reject null when it is false
C. A computation error in Python
D. Missing survey responses
**Answer:** A
**Explanation:** A Type I error occurs when researchers conclude an effect exists when in reality it does not (false alarm).
---

### 3. By industry standard convention, what is the default significance level ($alpha$) chosen for business and scientific hypothesis testing?
A. 0.05 (5%)
B. 0.50 (50%)
C. 0.99 (99%)
D. 0.0001
**Answer:** A
**Explanation:** $alpha = 0.05$ is the historical standard established by Ronald Fisher, representing a 5% risk tolerance for Type I errors.
---

### 4. What is the role of the Null Hypothesis ($H_0$)?
A. It acts as the default assumption of no effect or no difference, against which evidence is measured
B. It is the hypothesis the researcher hopes to prove
C. It represents missing data
D. It is only used in biology
**Answer:** A
**Explanation:** $H_0$ serves as the skeptical baseline hypothesis assuming no difference or treatment effect.
---

### 5. Does a statistically significant p-value ($p < 0.05$) automatically mean the finding has high practical or commercial business importance?
A. No, statistical significance only means the effect is unlikely to be random; with large sample sizes, even trivial differences can achieve $p < 0.05$
B. Yes, $p < 0.05$ guarantees massive business profits
C. Yes, p-value measures revenue directly
D. P-values do not apply to business
**Answer:** A
**Explanation:** Statistical significance does not equal practical business significance; analysts must evaluate both p-value and practical effect size (e.g., Cohen's d or revenue impact).
---
