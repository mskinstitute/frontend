---
id: python-intermediate-introduction-to-matplotlib
slug: introduction-to-matplotlib
course: python-for-intermediate
chapter: "13: Data Visualization Basics"
topic: "13.1 Introduction to Matplotlib"
title: "Introduction to Matplotlib in Python"
description: "Master introduction to matplotlib in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 61
keywords:
  - python introduction to matplotlib
  - python intermediate
  - python introduction to matplotlib
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Introduction to Matplotlib in Python

Data visualization is a vital discipline in modern software engineering, data science, machine learning, and business analytics. While raw numbers and tables convey exact quantities, graphical visualizations immediately reveal patterns, trends, correlations, and anomalies. In Python, **Matplotlib** is the foundational plotting library upon which the entire scientific visualization ecosystem (including Seaborn, Pandas plotting, and scikit-learn) is built.

---

## 1. Installing Matplotlib

Install the library into your active virtual environment:

```bash
python -m pip install matplotlib
```

Import the standard plotting module:
```python
import matplotlib.pyplot as plt
```

---

## 2. The Anatomy of a Matplotlib Figure

To master Matplotlib, you must understand its hierarchical object architecture:

```text
+-------------------------------------------------------------+
| Figure (The complete canvas / window)                       |
|                                                             |
|  Title: Global Sales 2026                                   |
|  +-------------------------------------------------------+  |
|  | Axes (The actual coordinate plot area)                |  |
|  |                                                       |  |
|  | Y-Axis (Ticks & Labels)                               |  |
|  |   ^                                                   |  |
|  |   |           * (Data Point)                          |  |
|  |   |         /                                         |  |
|  |   |   *---*                                           |  |
|  |   +---------------------------> X-Axis                |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

- **`Figure`**: The top-level bounding container holding all axes, titles, subtitles, colorbars, and legends.
- **`Axes`**: The actual plotting coordinate region where data is drawn. A single `Figure` can contain multiple `Axes` (subplots).
- **`Axis`**: The numerical number lines (X and Y) defining limits, ticks, and tick labels.
- **`Artist`**: Virtually everything visible on the canvas (lines, text, patches, markers) is an Artist.

---

## 3. The Two Matplotlib Interfaces: Pyplot vs. Object-Oriented

Matplotlib offers two programming paradigms:

### A. The State-Based Pyplot Interface (`plt.plot`)
Emulates MATLAB's stateful syntax. It keeps track of the "current" figure and axes automatically. Great for quick exploratory checks in interactive notebooks, but harder to maintain in complex applications:

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 25, 40, 55, 80]

plt.plot(x, y)
plt.title("Pyplot State-Based Plot")
plt.xlabel("X Axis")
plt.ylabel("Y Axis")
plt.show()
```

### B. The Object-Oriented (OO) Interface (Recommended!)
Explicitly creates and manipulates `Figure` and `Axes` objects. This is the **industry standard** for clean, scalable, multi-plot code:

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
revenue = [12000, 15000, 18500, 22000, 31000]

# 1. Create Figure and Axes explicitly
fig, ax = plt.subplots(figsize=(8, 4.5))

# 2. Plot on the specific Axes object
ax.plot(months, revenue, color="#2563eb", linewidth=2.5, marker="o")

# 3. Configure titles and labels using ax.set_*
ax.set_title("Monthly Revenue Growth (2026)", fontsize=14, fontweight="bold")
ax.set_xlabel("Month", fontsize=11)
ax.set_ylabel("Revenue (₹)", fontsize=11)
ax.grid(True, linestyle="--", alpha=0.6)

# 4. Display or Save
plt.tight_layout()
plt.show()
```

---

## 4. Saving Plots to Disk: `savefig()`

In web servers, automated reporting scripts, and backend pipelines, you save charts as high-resolution images or vector graphics instead of displaying interactive GUI windows:

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [4, 5, 6])

# Save as high-resolution PNG (300 DPI)
fig.savefig("sales_chart.png", dpi=300, bbox_inches="tight")

# Save as scalable vector graphic (SVG) for web publishing
fig.savefig("sales_chart.svg", format="svg", bbox_inches="tight")

plt.close(fig)  # Release memory
```
Setting `bbox_inches="tight"` ensures no labels or legends are cropped off at the image margins.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting `plt.show()`
In standalone Python scripts, plots are not displayed on screen until `plt.show()` is invoked.

### 2. Mismatched X and Y Array Dimensions
Matplotlib requires X and Y sequences to have the exact same number of data points. If `len(x) != len(y)`, it raises a `ValueError: x and y must have same first dimension`.

---

---

## 💻 Try It Yourself: Basic Temperature Trend Plot

### Scenario
Plot daily temperatures recorded over one week in Shikohabad using Matplotlib. Add gridlines, axis labels, markers, and a descriptive title.

### Complete Solution
```python
import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
temperatures = [28.5, 30.0, 31.2, 29.8, 32.5, 33.0, 31.8]

plt.figure(figsize=(8, 4.5))
plt.plot(days, temperatures, marker="o", color="#2563eb", linewidth=2, label="Daily High (°C)")
plt.title("Weekly Temperature Trend - Shikohabad", fontsize=14, fontweight="bold")
plt.xlabel("Day of Week", fontsize=11)
plt.ylabel("Temperature (°C)", fontsize=11)
plt.grid(True, linestyle="--", alpha=0.6)
plt.legend()
plt.tight_layout()
plt.savefig("temperature_trend.png", dpi=150)
print("Temperature trend plot saved to 'temperature_trend.png'.")
plt.close()
```

### Expected Output
```text
Temperature trend plot saved to 'temperature_trend.png'.
```

---

## Practice Quiz

### 1. In Matplotlib's object architecture, what is the difference between a `Figure` and an `Axes`?
A. `Figure` is for 3D plots; `Axes` is for 2D plots
B. `Figure` is the overall canvas window, while `Axes` is the specific coordinate area where data is plotted
C. `Axes` is a list of colors
D. There is no difference
**Answer:** B
**Explanation:** The `Figure` acts as the master canvas containing one or more `Axes` subplots where lines and bars are drawn.
---

### 2. Why is the Object-Oriented (OO) interface (`fig, ax = plt.subplots()`) preferred over stateful `plt.plot()` for production code?
A. The OO interface is written in C++
B. The OO interface provides explicit, fine-grained control over individual figures and subplots without relying on hidden global state
C. `plt.plot()` is deprecated
D. The OO interface uses less internet bandwidth
**Answer:** B
**Explanation:** The Object-Oriented interface allows unambiguous manipulation of specific figures and subplots, avoiding state-related bugs in larger applications.
---

### 3. Which method is used to save a Matplotlib chart to a high-resolution image file on disk?
A. `fig.write_image()`
B. `fig.export()`
C. `fig.savefig()`
D. `fig.dump()`
**Answer:** C
**Explanation:** `fig.savefig(filepath, dpi=...)` writes the figure to an image file (PNG, JPG, PDF, SVG).
---

### 4. What does the parameter `bbox_inches="tight"` do when saving a figure?
A. Compresses image resolution to 72 DPI
B. Automatically crops excess whitespace and prevents labels from being cut off at the borders
C. Converts the chart to grayscale
D. Inverts axis colors
**Answer:** B
**Explanation:** `bbox_inches="tight"` recalculates the bounding box to enclose all labels and legends cleanly.
---

### 5. What standard method is called to release memory resources associated with a figure after saving it?
A. `plt.clean()`
B. `plt.close(fig)`
C. `fig.delete()`
D. `del fig.memory`
**Answer:** B
**Explanation:** `plt.close(fig)` frees the memory allocated for the figure canvas, which is crucial in batch scripts generating many plots.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Line, Bar and Pie Charts** (13: Data Visualization Basics).

👉 **[Continue to Next Lesson: Line, Bar and Pie Charts →](/tutorials/python-for-intermediate/line-bar-and-pie-charts)**
