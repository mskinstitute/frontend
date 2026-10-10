# Categorical Plots: boxplot, violinplot, and countplot

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Comparing Distributions Across Categorical Groups
To compare numerical distributions across discrete categories, Seaborn provides:
- **`sns.boxplot()`**: Shows the 5-number statistical summary (Min, Q1, Median, Q3, Max) and identifies outliers.
- **`sns.violinplot()`**: Combines a box plot with a rotated kernel density curve to reveal multimodal shapes.
- **`sns.countplot()`**: Displays frequency counts for categorical variables (like an automated `value_counts()`).

---

## 2. Anatomy of a Box Plot
A **Box Plot (Box-and-Whisker)** provides 5 key metrics:
1. **Median (Q2 / 50th percentile):** The central line inside the box.
2. **First Quartile (Q1 / 25th percentile):** Bottom of the box.
3. **Third Quartile (Q3 / 75th percentile):** Top of the box.
4. **Interquartile Range (IQR):** $IQR = Q3 - Q1$ (the middle 50% of the data).
5. **Whiskers:** Extend to $1.5 	imes IQR$ from Q1 and Q3. Points beyond whiskers are plotted as individual outlier markers!

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# 1. Box Plot with Outliers
sns.boxplot(data=df, x='day', y='total_bill', palette='Set2', ax=axes[0])
axes[0].set_title('Total Bill by Day (Box Plot)')

# 2. Violin Plot (Shows Bimodal Peaks)
sns.violinplot(data=df, x='day', y='total_bill', palette='Set2', inner='quartile', ax=axes[1])
axes[1].set_title('Total Bill Density by Day (Violin Plot)')

plt.show()
```

---

# Multiple Choice Questions

### 1. In a standard Tukey Box Plot, how is the Interquartile Range (IQR) calculated?
A. $IQR = Q3 - Q1$
B. $IQR = Max - Min$
C. $IQR = Mean / Std$
D. $IQR = Median 	imes 2$
**Answer:** A
**Explanation:** The IQR represents the spread of the middle 50% of data observations: $Q3 (75th percentile) - Q1 (25th percentile)$.
---

### 2. In a box plot, data points that lie beyond which threshold are marked as outliers?
A. Beyond $1.5 	imes IQR$ below Q1 or above Q3
B. Beyond 1 standard deviation
C. Any negative number
D. Any number greater than 100
**Answer:** A
**Explanation:** Standard convention defines outliers as points lying further than $1.5 	imes IQR$ below the lower quartile or above the upper quartile.
---

### 3. What unique insight does a Violin Plot show that a standard Box Plot conceals?
A. Bimodality / Multimodality (multiple distinct density peaks in the data distribution)
B. The total number of rows
C. Exact dates
D. Column names
**Answer:** A
**Explanation:** Box plots only summarize quartiles; a violin plot shows the actual probability density curve, revealing whether data has multiple peaks (bimodal).
---

### 4. Which Seaborn function plots the frequency count of each categorical value without requiring pre-aggregation?
A. `sns.countplot()`
B. `sns.barplot()`
C. `sns.tableplot()`
D. `sns.hist()`
**Answer:** A
**Explanation:** `sns.countplot(data=df, x='Category')` automatically tallies occurrences and draws bar counts.
---

### 5. What does the central line inside a box plot's rectangular box represent?
A. The Mean
B. The Median (50th percentile)
C. The Mode
D. The Standard Deviation
**Answer:** B
**Explanation:** The line drawn through the middle of the box represents the 50th percentile (the Median).
---
