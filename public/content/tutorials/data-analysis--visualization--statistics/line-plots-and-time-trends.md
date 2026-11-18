---
id: line-plots-and-time-trends
slug: line-plots-and-time-trends
course: data-analysis--visualization--statistics
chapter: "2: Matplotlib Architecture & Core Plotting"
topic: "2.2 Line Plots, Markers, Line Styles & Multiple Series"
title: "Matplotlib Line Plots: Multi-Series Trends, Markers & fill_between()"
description: "Create clear time-series line plots in Matplotlib using custom linestyle, markers, legends, subtle grids, and shaded variance bands with ax.fill_between()."
difficulty: Intermediate
readingTime: 9
order: 2
keywords:
  - matplotlib line plot tutorial
  - matplotlib linestyle markers
  - matplotlib multiple series legend
  - ax.fill_between python
  - time series plotting python
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

**Line plots in Matplotlib (`ax.plot()`) track continuous numerical measurements across ordered intervals—most commonly time (days, months, quarters, or fiscal years)—making upward momentum, seasonality, and year-over-year gaps immediately visible.**

Never use a line plot for unordered categories (like comparing cities or product names—use a bar chart for those). Reserve line plots for ordered sequences where slopes between consecutive points carry real meaning.

---

## 1. Essential Line Styling & Marker Reference

| Parameter | Common Values | Visual Purpose |
| :--- | :--- | :--- |
| `linestyle` (`ls`) | `'-'` (solid), `'--'` (dashed), `':'` (dotted), `'-.'` (dash-dot) | Distinguish baseline vs current year or actual vs forecast |
| `marker` | `'o'` (circle), `'s'` (square), `'^'` (triangle), `'D'` (diamond) | Emphasize exact measurement timestamps |
| `linewidth` (`lw`) | `1.5` to `3.5` | Give primary KPI series stronger visual weight |
| `alpha` | `0.15` to `1.0` | Keep gridlines and shaded bands subtle and readable |

---

## 2. Multi-Series Comparison & Shaded Variance with `ax.fill_between()`

When comparing two series—such as FY 2025 vs FY 2026 revenue, or forecast confidence intervals—combine distinct `linestyle`/`marker` styles with `ax.fill_between()` to highlight the growth gap visually:

```python
import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales_2025 = [45, 52, 58, 65, 72, 80]
sales_2026 = [50, 60, 68, 79, 88, 98]

fig, ax = plt.subplots(figsize=(10, 5.5), dpi=150)

# Series 1: Previous year baseline (dashed line + circle markers)
ax.plot(months, sales_2025, label='FY 2025', color='#64748b', linestyle='--', marker='o', linewidth=2)

# Series 2: Current year primary focus (solid line + square markers)
ax.plot(months, sales_2026, label='FY 2026', color='#0A2540', linestyle='-', marker='s', linewidth=3)

# Shade the YoY revenue gain between the two series
ax.fill_between(months, sales_2025, sales_2026, color='#FF6B00', alpha=0.15, label='YoY Growth Gap')

ax.set_title('Year-over-Year Revenue Trajectory (₹ Lakhs)')
ax.set_xlabel('Month')
ax.set_ylabel('Net Revenue (₹ Lakhs)')
ax.legend(loc='upper left', frameon=True)
ax.grid(True, linestyle=':', alpha=0.5)

plt.tight_layout()
plt.show()
```

### Design Best Practices for Executive Line Charts
1. **Limit to 3–4 lines per chart** to avoid "spaghetti charts" that executives cannot parse.
2. **Use muted gray + dashed lines** for historical baselines, and a bold brand color for the current period.
3. **Keep gridlines subtle** (`linestyle=':', alpha=0.5`) so data lines remain the unmistakable hero.

---

## Practice Quiz

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
