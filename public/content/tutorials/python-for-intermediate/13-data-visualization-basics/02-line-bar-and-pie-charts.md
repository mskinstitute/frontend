---
id: python-intermediate-line-bar-and-pie-charts
slug: line-bar-and-pie-charts
course: python-for-intermediate
chapter: "13: Data Visualization Basics"
topic: "13.2 Line, Bar and Pie Charts"
title: "Line, Bar and Pie Charts in Python"
description: "Master line, bar and pie charts in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 62
keywords:
  - python line bar and pie charts
  - python intermediate
  - python line, bar and pie charts
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Line, Bar, and Pie Charts in Python

Choosing the correct visualization type is essential for communicating data insights effectively. In this guide, we dive into the three most essential chart types in Matplotlib: **Line Charts** (for continuous trends), **Bar Charts** (for categorical comparisons), and **Pie Charts** (for proportional composition).

---

## 1. Line Charts: Trends Over Time (`ax.plot`)

Line charts excel at displaying continuous variables over a sequential progression (such as dates, months, or timestamps):

```python
import matplotlib.pyplot as plt

days = [1, 2, 3, 4, 5, 6, 7]
website_visits = [1200, 1450, 1380, 1800, 2100, 2600, 2400]
mobile_app_visits = [800, 950, 1100, 1300, 1550, 1900, 1850]

fig, ax = plt.subplots(figsize=(8, 4.5))

# Plot multiple lines on the same axes
ax.plot(days, website_visits, label="Website", color="#0284c7", linewidth=2, linestyle="-", marker="o")
ax.plot(days, mobile_app_visits, label="Mobile App", color="#10b981", linewidth=2, linestyle="--", marker="s")

ax.set_title("Weekly User Traffic Comparison", fontsize=13, fontweight="bold")
ax.set_xlabel("Day of Week")
ax.set_ylabel("Active Sessions")
ax.legend(loc="upper left")
ax.grid(True, linestyle=":", alpha=0.6)

plt.tight_layout()
plt.show()
```

---

## 2. Bar Charts: Categorical Comparisons (`ax.bar` & `ax.barh`)

Bar charts compare discrete numerical values across distinct nominal categories.

### Vertical & Horizontal Bar Charts

```python
import matplotlib.pyplot as plt

languages = ["Python", "JavaScript", "TypeScript", "Java", "C++"]
popularity_percent = [31.5, 28.0, 18.2, 12.4, 9.9]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5))

# 1. Vertical Bar Chart
bars = ax1.bar(languages, popularity_percent, color="#6366f1", width=0.6)
ax1.set_title("Most Popular Languages (Vertical)")
ax1.set_ylabel("Market Share (%)")

# Value annotations on top of vertical bars
for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2, yval + 0.5, f"{yval}%", ha="center", va="bottom", fontsize=9)

# 2. Horizontal Bar Chart (ax.barh)
ax2.barh(languages, popularity_percent, color="#f59e0b", height=0.6)
ax2.set_title("Language Adoption (Horizontal)")
ax2.set_xlabel("Share (%)")

plt.tight_layout()
plt.show()
```

### Grouped Bar Charts

To display multi-series comparisons across categories, offset the X-coordinates by the bar width:

```python
import matplotlib.pyplot as plt
import numpy as np

categories = ["Q1", "Q2", "Q3", "Q4"]
sales_2025 = [45, 52, 58, 65]
sales_2026 = [50, 62, 70, 82]

x = np.arange(len(categories))
width = 0.35  # Bar width

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(x - width/2, sales_2025, width, label="2025", color="#94a3b8")
ax.bar(x + width/2, sales_2026, width, label="2026", color="#3b82f6")

ax.set_title("Quarterly Revenue Comparison (in Lakhs ₹)")
ax.set_xticks(x)
ax.set_xticklabels(categories)
ax.legend()
plt.show()
```

---

## 3. Pie & Donut Charts: Proportions of a Whole (`ax.pie`)

Pie charts display how individual segments contribute to 100% of a whole.

```python
import matplotlib.pyplot as plt

categories = ["Engineering", "Sales & Mktg", "Product", "Operations", "Customer Support"]
budgets = [42, 25, 15, 10, 8]
colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

# Explode (detach) the largest slice for emphasis
explode = (0.08, 0, 0, 0, 0)

fig, ax = plt.subplots(figsize=(6, 6))

wedges, texts, autotexts = ax.pie(
    budgets,
    explode=explode,
    labels=categories,
    autopct="%1.1f%%",
    startangle=140,
    colors=colors,
    shadow=True
)

# Customize text styling
for at in autotexts:
    at.set_color("white")
    at.set_weight("bold")

ax.set_title("Annual Corporate Budget Allocation", fontsize=13, fontweight="bold")
plt.show()
```

### Creating a Modern Donut Chart
Add a white center circle to transform a standard pie chart into a modern donut chart:
```python
# Create central white circle
centre_circle = plt.Circle((0, 0), 0.70, fc="white")
fig.gca().add_artist(centre_circle)
```

---

## 4. When to Use Which Chart?

| Chart Type | Best Used When... | Avoid When... |
| :--- | :--- | :--- |
| **Line Chart** | Showing trends, rate of change, or time-series | Categories have no logical sequence |
| **Bar Chart** | Comparing discrete categorical amounts | You have hundreds of continuous data points |
| **Pie Chart** | Showing 2-5 simple parts of a 100% total | You have >6 slices or tiny differences in size |

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Using Pie Charts with Too Many Categories
Pie charts become unreadable when displaying more than 5–6 slices. Use a horizontal bar chart for datasets with numerous categories.

### 2. Cluttered X-Axis Labels
When x-axis categories have long names, they overlap horizontally. Rotate them using `plt.xticks(rotation=45, ha='right')` for clean readability.

---

---

## 💻 Try It Yourself: Comparing Quarterly Revenue Bar Chart

### Scenario
Create a vertical bar chart comparing revenue across 4 fiscal quarters, coloring the highest quarter differently and displaying data labels on top of each bar.

### Complete Solution
```python
import matplotlib.pyplot as plt

quarters = ["Q1", "Q2", "Q3", "Q4"]
revenue = [12.5, 15.8, 14.2, 19.5]  # in Lakhs INR
colors = ["#93c5fd", "#93c5fd", "#93c5fd", "#2563eb"]  # Highlight Q4

plt.figure(figsize=(7, 4.5))
bars = plt.bar(quarters, revenue, color=colors, width=0.55)

for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.3, f"₹{yval}L", ha="center", va="bottom", fontweight="bold")

plt.title("Fiscal Year Quarterly Revenue", fontsize=13, fontweight="bold")
plt.ylabel("Revenue (₹ Lakhs)")
plt.ylim(0, 24)
plt.tight_layout()
plt.savefig("quarterly_revenue.png", dpi=150)
print("Chart saved to 'quarterly_revenue.png'.")
plt.close()
```

### Expected Output
```text
Chart saved to 'quarterly_revenue.png'.
```

---

## Practice Quiz

### 1. Which chart type is best suited for visualizing website traffic trends over 30 days?
A. Pie chart
B. Line chart
C. Scatter plot
D. Donut chart
**Answer:** B
**Explanation:** Line charts are specifically designed to illustrate continuous trends and rates of change across sequential intervals like time.
---

### 2. Which method on a Matplotlib `Axes` object creates a horizontal bar chart?
A. `ax.hbar()`
B. `ax.barh()`
C. `ax.horizontal_bar()`
D. `ax.plot_bar(horizontal=True)`
**Answer:** B
**Explanation:** `ax.barh()` creates horizontal bar plots, whereas `ax.bar()` creates vertical bar plots.
---

### 3. What does the parameter `autopct="%1.1f%%"` accomplish in `ax.pie()`?
A. It rounds values to the nearest integer
B. It automatically formats and displays the percentage contribution on each slice with one decimal place
C. It sorts the slices in descending order
D. It colors each slice automatically
**Answer:** B
**Explanation:** `autopct` formats the numeric percentage label rendered inside each pie slice.
---

### 4. What is the primary visual drawback of using pie charts with more than 7 or 8 categories?
A. Pie charts consume too much GPU memory
B. Slices become narrow, cluttered, and difficult for human eyes to compare accurately
C. Matplotlib crashes with more than 5 slices
D. Percentages cannot add up to 100%
**Answer:** B
**Explanation:** Human visual perception struggles to compare angles when there are numerous small slices; a horizontal bar chart is far more legible for many categories.
---

### 5. In a multi-line chart, what method must be called to display the legend mapping line colors to their respective labels?
A. `ax.show_labels()`
B. `ax.legend()`
C. `ax.render_key()`
D. `ax.display_info()`
**Answer:** B
**Explanation:** `ax.legend()` renders the legend box mapping line labels to their respective colors and markers.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Customizing Graphs** (13: Data Visualization Basics).

👉 **[Continue to Next Lesson: Customizing Graphs →](/tutorials/python-for-intermediate/customizing-graphs)**
