---
id: setting-up-plotting-environment
slug: setting-up-plotting-environment
course: data-analysis--visualization--statistics
chapter: "1: Data Visualization Foundations & Python Ecosystem"
topic: "1.3 Setting Up Jupyter, Inline Plotting & Figure Sizing"
title: "Setting Up Python Plotting: Jupyter Inline, figsize, DPI & Themes"
description: "Configure Jupyter Notebooks and VS Code for crisp Matplotlib and Seaborn plots using %matplotlib inline, figsize in inches, 300 DPI exports, and tight_layout()."
difficulty: Intermediate
readingTime: 9
order: 3
keywords:
  - matplotlib inline jupyter
  - plt.subplots figsize dpi
  - seaborn set_theme styling
  - plt.tight_layout python
  - high resolution python charts
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.1.0
---

**A professional Python visualization setup configures inline notebook rendering (`%matplotlib inline`), clean global themes (`sns.set_theme()`), explicit figure dimensions in inches (`figsize=(width, height)`), high resolution (`dpi=300`), and automatic margin spacing (`plt.tight_layout()`).**

Leaving Matplotlib at its tiny default `6.4 × 4.8` inch canvas at `100 DPI` produces blurry charts with overlapping axis labels. Setting a reusable styling header at the top of every notebook makes your visual analysis look presentation-ready from the very first plot.

---

## 1. Standard Visualization Boilerplate (Jupyter & VS Code)

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Render charts directly below code cells in Jupyter Notebooks
%matplotlib inline

# Crisp high-DPI rendering on modern displays
%config InlineBackend.figure_format = 'retina'

# Apply clean global styling across Seaborn and Matplotlib
sns.set_theme(style='whitegrid', context='notebook')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['axes.labelsize'] = 11
```

### Popular `sns.set_theme(style=...)` Presets
- **`whitegrid`** → Best for numerical comparisons and bar/line charts with light reference gridlines.
- **`ticks`** → Clean minimalist look ideal for scatter plots and academic publications.
- **`darkgrid`** → Subtle shaded canvas useful for multi-series trend comparisons.

---

## 2. Controlling `figsize`, `DPI` & Preventing Clipped Labels

In Matplotlib, `figsize=(width, height)` is always measured in **inches** (not pixels). Total pixel resolution equals `inches × dpi` (for example, `figsize=(10, 6)` at `dpi=300` exports a razor-sharp `3000 × 1800` pixel graphic).

```python
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
revenue = [120, 145, 160, 152, 188, 210]

fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
ax.plot(months, revenue, marker='o', linewidth=2.5, color='#0A2540')
ax.set_title('Monthly Revenue Growth (₹ Thousands)')
ax.set_xlabel('Month (2026)')
ax.set_ylabel('Revenue (₹K)')

# Automatically adjust margins so titles and tick labels never overlap or clip
plt.tight_layout()

# Save publication-ready 300 DPI PNG for reports & GitHub READMEs
fig.savefig('monthly_revenue.png', dpi=300, bbox_inches='tight')
plt.show()
```

> 💡 **Pro Tip:** Always call `fig.savefig(..., dpi=300, bbox_inches='tight')` **before** `plt.show()`, because `plt.show()` clears the active figure buffer in many notebook environments!

---

## Practice Quiz

### 1. In Jupyter Notebooks, what magic command ensures that generated plots are displayed directly beneath the code cell?
A. `%matplotlib inline`
B. `%show plots`
C. `%plot_here`
D. `%render_canvas`
**Answer:** A
**Explanation:** `%matplotlib inline` configures the IPython backend to embed static PNG/SVG plots directly inside notebook output cells.
---

### 2. In `plt.subplots(figsize=(12, 6))`, what units do the numbers 12 and 6 represent?
A. Pixels
B. Centimeters
C. Inches
D. Millimeters
**Answer:** C
**Explanation:** Matplotlib canvas dimensions in `figsize` are specified in inches `(width, height)`.
---

### 3. What does setting `dpi=300` achieve when creating or saving a figure?
A. Increases the dots per inch (resolution), resulting in crisp, publication-grade graphics
B. Reduces file download time
C. Changes chart colors to grayscale
D. Adds 300 data points
**Answer:** A
**Explanation:** DPI (Dots Per Inch) determines raster resolution. 300 DPI is the industry standard for print and high-definition reports.
---

### 4. Which function sets the global visual aesthetic theme across all Seaborn and Matplotlib plots?
A. `sns.set_theme()`
B. `plt.change_look()`
C. `pd.set_style()`
D. `sns.make_pretty()`
**Answer:** A
**Explanation:** `sns.set_theme(style='whitegrid' | 'darkgrid' | 'ticks')` sets the global aesthetic parameters for figures.
---

### 5. What does `plt.tight_layout()` do?
A. Compresses file size on disk
B. Automatically adjusts subplots, padding, and labels so titles and tick marks do not overlap or get clipped
C. Rounds numbers to integers
D. Deletes empty rows
**Answer:** B
**Explanation:** `plt.tight_layout()` inspects bounding boxes and rescales subplot margins to prevent label overlap.
