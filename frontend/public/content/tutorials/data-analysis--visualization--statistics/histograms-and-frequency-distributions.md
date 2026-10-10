# Histograms, Bins & Frequency Distributions

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. What is a Histogram?
A **Histogram** visualizes the distribution of a continuous numerical variable by dividing the data range into equal-width intervals called **bins** and counting how many data observations fall into each bin.

> *Difference from Bar Chart: A bar chart compares discrete categories (like Cities). A histogram illustrates the spread, skewness, and frequency density of a continuous numeric variable (like Employee Ages or Salaries).*

---

## 2. Plotting Histograms with Custom Bins & KDE
```python
import matplotlib.pyplot as plt
import numpy as np

# Generate 1,000 synthetic transaction amounts
np.random.seed(42)
transaction_amounts = np.random.gamma(shape=3, scale=500, size=1000)

fig, ax = plt.subplots(figsize=(8, 5))
# bins=30 creates 30 bins; density=True normalizes counts to probability density
n, bins, patches = ax.hist(
    transaction_amounts,
    bins=30,
    color='#3b82f6',
    edgecolor='#1e293b',
    alpha=0.75
)

ax.set_title('Transaction Value Frequency Distribution')
ax.set_xlabel('Transaction Amount (INR)')
ax.set_ylabel('Frequency (Transaction Count)')
ax.axvline(np.median(transaction_amounts), color='red', linestyle='--', label=f'Median: ₹{np.median(transaction_amounts):.0f}')
ax.legend()

plt.show()
```

---

# Multiple Choice Questions

### 1. What is the key distinction between a bar chart and a histogram?
A. Bar charts represent discrete categorical variables, whereas histograms represent the continuous distribution of numerical data divided into bins
B. Histograms only work on text
C. Bar charts can only have 3 bars
D. Histograms cannot have colors
**Answer:** A
**Explanation:** Bar charts compare discrete categories; histograms group continuous numerical values into intervals (bins) to reveal distribution shape.
---

### 2. What happens to a histogram if you choose too few bins (e.g. `bins=2`)?
A. The histogram crashes
B. Oversmoothing occurs, obscuring critical distribution shapes and multimodal peaks
C. The plot becomes too detailed
D. Data points are deleted
**Answer:** B
**Explanation:** Too few bins over-aggregates data, hiding underlying distribution features.
---

### 3. What does setting `density=True` in `ax.hist()` accomplish?
A. Normalizes the histogram so that the total area under the bars sums to 1.0 (probability density)
B. Makes the bars darker
C. Removes empty bins
D. Counts characters
**Answer:** A
**Explanation:** `density=True` converts raw frequency counts into a normalized probability density distribution.
---

### 4. Which parameter in `ax.hist()` adds a visible border between neighboring bars to improve visual clarity?
A. `edgecolor`
B. `border_width`
C. `stroke_color`
D. `gap=True`
**Answer:** A
**Explanation:** `edgecolor='black'` draws distinct outlines around each bin bar.
---

### 5. What does `ax.axvline(x=500)` draw on a plot?
A. A horizontal line at y=500
B. A vertical reference line spanning the entire axes height at x=500
C. A box plot
D. An arrow pointing down
**Answer:** B
**Explanation:** `axvline` draws an infinite vertical reference line across the plot, ideal for marking means or benchmark thresholds.
---
