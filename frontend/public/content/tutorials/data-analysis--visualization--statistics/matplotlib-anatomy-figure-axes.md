# Matplotlib Anatomy: Figure, Axes, Subplots & Ticks

*Reading Time: 8 Mins* | *Level: Intermediate*

![Matplotlib Figure Anatomy](/images/tutorials/data-analysis--visualization--statistics/matplotlib-figure-anatomy.svg)

---

## 1. Object-Oriented (OO) API vs Pyplot State-Machine
Matplotlib has two interfaces:
1. **The Pyplot State-Machine (`plt.plot()`)**: Implicit, MATLAB-like. Quick for throwaway scripts, but confusing for complex layouts.
2. **The Object-Oriented API (`fig, ax = plt.subplots()`)**: Explicit, clean, professional. You hold direct references to the **Figure** (the canvas) and **Axes** (the plot).

---

## 2. The Core Anatomy of a Plot
- **Figure:** The top-level bounding window holding all subplots, titles, and legends.
- **Axes:** The actual coordinate plotting area with an x-axis and y-axis.
- **Axis / Ticks:** The scales with major and minor tick markers and labels.
- **Spines:** The 4 boundary lines enclosing the plotting area (top, bottom, left, right).

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1, 2, 3, 4], [10, 25, 20, 35], color='#2563eb', linewidth=2.5, marker='o')

ax.set_title('Monthly Performance Metric', fontsize=14, fontweight='bold')
ax.set_xlabel('Quarter')
ax.set_ylabel('Profit (in Lakhs)')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.show()
```

---

# Multiple Choice Questions

### 1. In Matplotlib's Object-Oriented API, what does `fig` represent?
A. A single data curve
B. The top-level canvas window that contains all subplots, titles, and elements
C. The X-axis tick labels
D. The color palette
**Answer:** B
**Explanation:** The Figure is the top-level container for all elements of the plot.
---

### 2. What is an `Axes` object in Matplotlib?
A. The plural of the word axis only
B. The actual individual plot or subplot area containing an x-axis, y-axis, data curves, and labels
C. A 3D graphics card setting
D. An error message
**Answer:** B
**Explanation:** An `Axes` is the coordinate plane where data points, lines, bars, and labels are drawn.
---

### 3. How do you create a 2x2 grid of subplots using Matplotlib's OO interface?
A. `fig, axes = plt.subplots(nrows=2, ncols=2)`
B. `plt.grid(4)`
C. `fig = plt.figure(2, 2)`
D. `ax.split(4)`
**Answer:** A
**Explanation:** `plt.subplots(nrows=2, ncols=2)` generates a 2x2 array of Axes objects.
---

### 4. How do you remove the top and right enclosing borders (spines) from a chart for a clean modern aesthetic?
A. `ax.spines['top'].set_visible(False)` and `ax.spines['right'].set_visible(False)`
B. `ax.remove_border()`
C. `plt.no_lines()`
D. `fig.spines_delete()`
**Answer:** A
**Explanation:** Individual spines are accessed via the dictionary `ax.spines` and hidden by setting visibility to False.
---

### 5. Why is the Object-Oriented interface preferred over `plt.plot()` for production dashboards?
A. It runs 100 times faster
B. It provides explicit references to specific axes, avoiding state confusion when plotting multiple charts simultaneously
C. Pyplot is deprecated
D. OO code only works on macOS
**Answer:** B
**Explanation:** With the OO API, methods are called explicitly on the target `ax`, eliminating ambiguity when managing multiple subplots.
---
