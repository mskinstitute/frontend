# Setting Up Jupyter, Inline Plotting & Figure Sizing

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Setting Up the Visualization Environment
To create clean charts in Jupyter Notebooks or VS Code:

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Enable inline rendering inside Jupyter Notebooks
%matplotlib inline

# Set high-resolution display for Retina / 4K screens
%config InlineBackend.figure_format = 'retina'

# Apply standard clean styling
sns.set_theme(style='whitegrid')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
```

---

## 2. Managing Figure Size & DPI
Never accept default cramped charts. Always control canvas dimensions:

```python
# figsize=(width_in_inches, height_in_inches), dpi=dots_per_inch
fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
```

---

# Multiple Choice Questions

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
---
