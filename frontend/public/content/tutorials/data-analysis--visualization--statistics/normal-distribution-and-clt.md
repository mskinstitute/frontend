# Normal Distribution, Z-Scores & Central Limit Theorem

*Reading Time: 8 Mins* | *Level: Intermediate*

![Hypothesis Testing Curve](/images/tutorials/data-analysis--visualization--statistics/hypothesis-testing-bell-curve.svg)

---

## 1. The Normal (Gaussian) Distribution
The **Normal Distribution** is the bell-shaped probability distribution foundational to all inferential statistics. It is governed by two parameters: the **Mean ($\mu$)** and the **Standard Deviation ($\sigma$)**.

### The 68-95-99.7 Empirical Rule:
- **$68.27\%$** of data falls within $\mu \pm 1\sigma$.
- **$95.45\%$** of data falls within $\mu \pm 2\sigma$ (precisely $\pm 1.96\sigma$ for 95.0%).
- **$99.73\%$** of data falls within $\mu \pm 3\sigma$.

---

## 2. The Central Limit Theorem (CLT)
The **Central Limit Theorem** is arguably the most powerful concept in statistics:

> *Regardless of the underlying population distribution (whether skewed, uniform, bimodal, or exponential), the sampling distribution of the sample mean ($\bar{x}$) approaches a normal distribution as the sample size $n$ increases (typically $n \ge 30$).*

### Standard Error of the Mean:
$$SE = \frac{\sigma}{\sqrt{n}}$$

As your sample size $n$ increases, your uncertainty ($SE$) shrinks by the square root of $n$.

---

# Multiple Choice Questions

### 1. According to the Empirical Rule of a Normal Distribution, approximately what percentage of observations fall within $\pm 2$ standard deviations of the mean?
A. 50%
B. 68%
C. 95%
D. 99.7%
**Answer:** C
**Explanation:** The empirical 68-95-99.7 rule dictates that approximately 95% of data falls within 2 standard deviations (specifically 1.96 standard deviations).
---

### 2. What does the Central Limit Theorem (CLT) state about the distribution of sample means?
A. The sample mean distribution will be approximately normal for sufficiently large $n$ ($n \ge 30$), even if the underlying population is not normally distributed
B. All populations are normally distributed
C. Sample means will always equal the median
D. Data size does not matter
**Answer:** A
**Explanation:** The CLT proves that sums and means of independent random variables converge toward a Gaussian normal distribution regardless of the parent distribution shape.
---

### 3. What is the Standard Error (SE) of the sample mean?
A. The standard deviation of the sample mean across repeated samples: $SE = \sigma / \sqrt{n}$
B. A programming bug
C. The maximum error in a survey
D. Total variance squared
**Answer:** A
**Explanation:** Standard error measures the precision of the sample mean estimating the population mean.
---

### 4. What happens to the Standard Error as sample size $n$ increases from 100 to 400?
A. It increases by 4x
B. It is cut in half (reduced by a factor of $\sqrt{4} = 2$)
C. It remains identical
D. It becomes zero
**Answer:** B
**Explanation:** Because $n$ is inside the square root in the denominator ($SE = \sigma / \sqrt{n}$), multiplying $n$ by 4 divides $SE$ by 2.
---

### 5. In a Standard Normal Distribution, what are the values of the mean and standard deviation?
A. $\mu = 0, \sigma = 1$
B. $\mu = 1, \sigma = 0$
C. $\mu = 100, \sigma = 15$
D. $\mu = 50, \sigma = 5$
**Answer:** A
**Explanation:** A standard normal distribution (Z-distribution) has a mean of 0 and a standard deviation of 1.
---
