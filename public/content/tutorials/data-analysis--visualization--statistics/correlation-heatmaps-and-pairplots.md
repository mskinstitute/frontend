# Correlation Heatmaps & PairPlots for Multivariate EDA

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Multivariate Exploration
When exploring a dataset with multiple numeric columns, you must answer two core questions:
1. Which features are strongly correlated with each other?
2. Are there collinear features that could distort machine learning models?

---

## 2. Correlation Heatmaps (`sns.heatmap`)
The Pearson correlation coefficient $r$ ranges from **-1.0** (perfect negative correlation) to **+1.0** (perfect positive correlation), with **0.0** representing no linear relationship.

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('iris')

# Compute correlation matrix of numeric columns
corr_matrix = df.drop('species', axis=1).corr()

fig, ax = plt.subplots(figsize=(7, 5))
sns.heatmap(
    corr_matrix,
    annot=True,          # Print correlation numbers inside cells
    fmt='.2f',          # Format numbers to 2 decimal places
    cmap='coolwarm',     # Diverging color map
    vmin=-1, vmax=1,     # Anchors color map between -1 and +1
    linewidths=1.5,
    cbar=True,
    ax=ax
)

ax.set_title('Feature Correlation Heatmap Matrix')
plt.show()
```

---

## 3. PairPlots for Pairwise Feature Inspection
```python
# PairPlot plots bivariate distributions across all pairs of numeric columns
sns.pairplot(df, hue='species', palette='Dark2', diag_kind='kde')
plt.show()
```

---

# Multiple Choice Questions

### 1. What does a Pearson correlation coefficient value of $r = -0.92$ indicate?
A. Strong negative linear relationship (as one variable rises, the other falls proportionally)
B. Weak relationship
C. Perfect positive relationship
D. Zero correlation
**Answer:** A
**Explanation:** Values close to -1.0 indicate a strong inverse/negative linear relationship.
---

### 2. In `sns.heatmap()`, which parameter prints the numerical correlation coefficients directly inside each grid cell?
A. `annot=True`
B. `show_numbers=True`
C. `values=True`
D. `print_cells=True`
**Answer:** A
**Explanation:** `annot=True` (annotate) displays the calculated cell value inside each heatmap tile.
---

### 3. What does `sns.pairplot()` render?
A. A matrix of pairwise scatterplots for all numeric feature combinations, with univariate distributions along the diagonal
B. A single line chart
C. A 3D pie chart
D. A time series plot
**Answer:** A
**Explanation:** `pairplot()` generates a grid of pairwise bivariate scatter plots for all numeric columns in a DataFrame.
---

### 4. Why should you pass `vmin=-1, vmax=1` when plotting a correlation matrix heatmap?
A. To prevent the color scale from being misleadingly anchored only to the local minimum and maximum correlation in the sample
B. To avoid Python errors
C. To turn all correlations into integers
D. To delete missing values
**Answer:** A
**Explanation:** Explicitly setting the color bounds to -1 and +1 ensures that colors represent standardized statistical correlation correctly.
---

### 5. What type of plot is typically drawn along the diagonal of a `pairplot` when using `diag_kind='kde'`?
A. A smooth Kernel Density Estimation curve showing each variable's individual distribution
B. A scatter plot of the variable against itself
C. An empty white box
D. A bar chart
**Answer:** A
**Explanation:** Because a variable plotted against itself would just be a diagonal straight line, Seaborn displays its univariate density distribution along the diagonal.
---
