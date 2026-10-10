# Distribution Plots: histplot, kdeplot, and ecdfplot

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Visualizing Distributions with Seaborn
Seaborn provides three dedicated functions for exploring distributions:
1. **`sns.histplot()`**: Modern flexible histogram with binning and optional KDE overlays.
2. **`sns.kdeplot()`**: Kernel Density Estimation representing continuous probability density curves without arbitrary bin cutoffs.
3. **`sns.ecdfplot()`**: Empirical Cumulative Distribution Function—the most rigorous statistical plot for percentiles.

---

## 2. Using `sns.histplot()` with `kde=True` and `hue`
```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, ax = plt.subplots(figsize=(8, 5))
# Plot total_bill distribution split by lunch vs dinner
sns.histplot(
    data=df,
    x='total_bill',
    hue='time',
    kde=True,
    bins=25,
    palette='Set2',
    alpha=0.6,
    ax=ax
)
ax.set_title('Total Bill Distribution by Meal Time')
plt.show()
```

---

## 3. What is an ECDF Plot (`ecdfplot`)?
An **ECDF** plot displays the exact proportion of observations less than or equal to a given value. It requires zero binning parameters, completely avoiding the subjectivity of choosing bin counts:

```python
# At what bill amount do 80% of customers fall below?
sns.ecdfplot(data=df, x='total_bill')
plt.axhline(0.80, color='red', linestyle=':')
plt.show()
```

---

# Multiple Choice Questions

### 1. Which modern Seaborn function replaces the legacy `sns.distplot()` for plotting histograms and density curves?
A. `sns.histplot()`
B. `sns.plot_distribution()`
C. `sns.binned_plot()`
D. `sns.freq()`
**Answer:** A
**Explanation:** Starting in Seaborn 0.11+, `sns.histplot()` and `sns.displot()` replaced the deprecated `sns.distplot()`.
---

### 2. What does setting `kde=True` inside `sns.histplot()` do?
A. Overlays a smooth Kernel Density Estimation curve on top of the binned bars
B. Deletes the histogram
C. Colors the chart red
D. Replaces the data with random samples
**Answer:** A
**Explanation:** `kde=True` fits and plots a continuous kernel density estimate alongside the histogram bars.
---

### 3. What does an ECDF (Empirical Cumulative Distribution Function) plot show on its y-axis?
A. Raw counts
B. Cumulative proportions/percentiles ranging from 0.0 to 1.0 (0% to 100%)
C. Standard deviations
D. Average profit
**Answer:** B
**Explanation:** The y-axis in an ECDF plot shows the cumulative percentile fraction of data points $le x$.
---

### 4. What is the primary advantage of `kdeplot` over a traditional histogram?
A. It eliminates the arbitrary choice of bin boundaries and bin widths, showing a continuous probability surface
B. It runs faster on Excel
C. It only works on small datasets
D. It rounds numbers to integers
**Answer:** A
**Explanation:** Histograms can alter their appearance depending on where bin cutoffs happen to land; KDE provides a smooth non-parametric density estimation.
---

### 5. In `sns.kdeplot(data=df, x='Salary', hue='Gender')`, what does Seaborn render?
A. Two overlaid, color-coded density distribution curves—one for each gender
B. A pie chart
C. A 3D cube
D. An error
**Answer:** A
**Explanation:** The `hue='Gender'` parameter partitions the data into separate subsets and draws an individual density curve for each group.
---
