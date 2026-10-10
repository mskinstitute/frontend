# Line Plots, Markers, Line Styles & Multiple Series

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. When to Use Line Plots
Line plots are the gold standard for tracking continuous numerical measurements over ordered sequences—most commonly chronological time (hours, days, months, fiscal years).

---

## 2. Plotting Multi-Series Trends with Custom Styling
```python
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales_2025 = [45, 52, 58, 65, 72, 80]
sales_2026 = [50, 60, 68, 79, 88, 98]

fig, ax = plt.subplots(figsize=(9, 5))

# Series 1: Dashed line with circle markers
ax.plot(months, sales_2025, label='FY 2025', color='#64748b', linestyle='--', marker='o', linewidth=2)

# Series 2: Solid line with square markers
ax.plot(months, sales_2026, label='FY 2026', color='#2563eb', linestyle='-', marker='s', linewidth=3)

ax.set_title('Year-over-Year Revenue Trajectory (in Lakhs INR)')
ax.set_xlabel('Month')
ax.set_ylabel('Net Revenue (Lakhs)')
ax.legend(loc='upper left', frameon=True)
ax.grid(True, linestyle=':', alpha=0.6)

plt.show()
```

---

# Multiple Choice Questions

### 1. Which parameter in `ax.plot()` controls whether a line is solid, dashed, or dotted?
A. `line_type`
B. `linestyle` (or `ls`)
C. `pattern`
D. `stroke`
**Answer:** B
**Explanation:** `linestyle` accepts values such as `'-'` (solid), `'--'` (dashed), `':'` (dotted), and `'-.'` (dash-dot).
---

### 2. What does `ax.legend()` do?
A. Generates a key box identifying the labels of the plotted data series
B. Writes a summary of data to disk
C. Generates random sample data
D. Capitalizes titles
**Answer:** A
**Explanation:** `ax.legend()` displays a key linking line colors/styles to the `label` strings specified in `ax.plot()`.
---

### 3. Which marker code represents square points on a Matplotlib line?
A. `marker='s'`
B. `marker='sq'`
C. `marker='box'`
D. `marker='4'`
**Answer:** A
**Explanation:** In Matplotlib marker codes, `'s'` denotes square, `'o'` denotes circle, and `'^'` denotes triangle.
---

### 4. How can you make gridlines subtle and non-intrusive on a chart?
A. `ax.grid(True, linestyle=':', alpha=0.5)`
B. `ax.hide_grid()`
C. `ax.grid_heavy()`
D. Gridlines cannot be styled
**Answer:** A
**Explanation:** Setting a dotted linestyle and low alpha opacity (e.g. 0.5) keeps gridlines faint and readable.
---

### 5. What parameter shades the area between two line curves (e.g. to illustrate confidence intervals)?
A. `ax.shade()`
B. `ax.fill_between(x, y1, y2, alpha=...)`
C. `ax.paint_gap()`
D. `ax.color_band()`
**Answer:** B
**Explanation:** `ax.fill_between()` fills the region between two horizontal curves or lines.
---
