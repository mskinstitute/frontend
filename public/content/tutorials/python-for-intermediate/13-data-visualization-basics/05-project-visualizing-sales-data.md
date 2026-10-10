---
id: python-intermediate-project-visualizing-sales-data
slug: project-visualizing-sales-data
course: python-for-intermediate
chapter: "13: Data Visualization Basics"
topic: "13.5 Project: Visualizing Sales Data"
title: "Project: Visualizing Sales Data in Python"
description: "Master project: visualizing sales data in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 65
keywords:
  - python project visualizing sales data
  - python intermediate
  - python project: visualizing sales data
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Visualizing Sales Data

In this capstone project, we bring together all the data visualization capabilities mastered throughout this chapter—**Matplotlib's Object-Oriented Architecture, Line & Bar Charts, Donut Charts, Seaborn Aesthetics, and Multi-Panel Dashboards**—to build an automated **Executive Sales Analytics Visual Dashboard**.

---

## 1. Project Overview & Dashboard Layout

Our application processes retail transactional sales data and generates a high-resolution, publication-quality 4-panel visual dashboard (`sales_dashboard.png`):

```text
+-------------------------------------------------------------------+
|               EXECUTIVE RETAIL SALES DASHBOARD (2026)             |
+---------------------------------+---------------------------------+
|  Panel 1: Monthly Trend         |  Panel 2: Category Breakdown    |
|  - Continuous Line Chart        |  - Horizontal Bar Chart         |
|  - Fill-between area            |  - Value annotations            |
+---------------------------------+---------------------------------+
|  Panel 3: Regional Share        |  Panel 4: Units Sold Spread     |
|  - Modern Donut Chart           |  - Seaborn Boxplot by Region    |
|  - Percentage contributions     |  - Outlier & median detection   |
+---------------------------------+---------------------------------+
```

---

## 2. Complete Project Implementation

```python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


# -------------------------------------------------------------
# 1. Dataset Initialization
# -------------------------------------------------------------
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
monthly_revenue = [120, 135, 148, 162, 190, 220, 215, 240, 265, 290, 340, 410] # in Lakhs INR

categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Beauty"]
category_revenue = [850, 620, 480, 290, 210]

regions = ["North", "South", "West", "East"]
regional_sales = [38, 28, 22, 12]

# Simulated transaction-level distribution data
np.random.seed(42)
trans_data = {
    "Region": np.repeat(regions, 50),
    "Units_Sold": np.concatenate([
        np.random.normal(45, 10, 50),  # North
        np.random.normal(38, 8, 50),   # South
        np.random.normal(32, 7, 50),   # West
        np.random.normal(25, 5, 50),   # East
    ])
}


# -------------------------------------------------------------
# 2. Building the Visual Dashboard
# -------------------------------------------------------------
def generate_sales_dashboard():
    # Set modern Seaborn visual theme
    sns.set_theme(style="whitegrid", font="sans-serif")
    
    # Create 2x2 multi-panel figure
    fig, axs = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("EXECUTIVE RETAIL SALES & PERFORMANCE DASHBOARD (2026)", 
                 fontsize=16, fontweight="bold", y=0.98, color="#0f172a")

    # ---------------------------------------------------------
    # Panel 1 (Top-Left): Monthly Revenue Growth (Line Plot)
    # ---------------------------------------------------------
    ax1 = axs[0, 0]
    ax1.plot(months, monthly_revenue, color="#2563eb", linewidth=2.8, marker="o", markersize=6, label="Revenue")
    ax1.fill_between(months, monthly_revenue, color="#3b82f6", alpha=0.15)
    ax1.set_title("Monthly Revenue Trajectory (₹ Lakhs)", fontsize=12, fontweight="bold", pad=10)
    ax1.set_ylabel("Revenue (₹ Lakhs)")
    ax1.set_ylim(0, 450)
    
    # Annotate peak Q4 festive season
    ax1.annotate(
        "Diwali & Holiday Peak\n(₹410 L)",
        xy=(11, 410),
        xytext=(8.5, 360),
        arrowprops=dict(facecolor="#1e3a8a", arrowstyle="->", lw=1.5),
        fontweight="bold",
        fontsize=9,
        bbox=dict(boxstyle="round,pad=0.3", fc="#eff6ff", ec="#3b82f6")
    )

    # ---------------------------------------------------------
    # Panel 2 (Top-Right): Revenue by Product Category (Barh)
    # ---------------------------------------------------------
    ax2 = axs[0, 1]
    palette = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]
    bars = ax2.barh(categories[::-1], category_revenue[::-1], color=palette[::-1], height=0.6)
    ax2.set_title("Annual Revenue by Category (₹ Lakhs)", fontsize=12, fontweight="bold", pad=10)
    ax2.set_xlabel("Total Sales (₹ Lakhs)")
    
    # Annotate values directly at bar edges
    for bar in bars:
        w = bar.get_width()
        ax2.text(w + 15, bar.get_y() + bar.get_height()/2, f"₹{w} L", 
                 va="center", fontsize=9, fontweight="bold", color="#334155")
    ax2.set_xlim(0, 1000)

    # ---------------------------------------------------------
    # Panel 3 (Bottom-Left): Regional Sales Share (Donut Chart)
    # ---------------------------------------------------------
    ax3 = axs[1, 0]
    donut_colors = ["#0284c7", "#0d9488", "#f59e0b", "#e11d48"]
    wedges, texts, autotexts = ax3.pie(
        regional_sales,
        labels=regions,
        autopct="%1.1f%%",
        startangle=120,
        colors=donut_colors,
        pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor="white", linewidth=2)  # Donut hole!
    )
    for at in autotexts:
        at.set_color("white")
        at.set_weight("bold")
    ax3.set_title("Regional Revenue Contribution", fontsize=12, fontweight="bold", pad=10)

    # ---------------------------------------------------------
    # Panel 4 (Bottom-Right): Transaction Units Distribution (Seaborn Boxplot)
    # ---------------------------------------------------------
    ax4 = axs[1, 1]
    sns.boxplot(
        data=trans_data, 
        x="Region", 
        y="Units_Sold", 
        palette="Blues_d", 
        ax=ax4,
        boxprops=dict(alpha=0.85)
    )
    ax4.set_title("Order Volume Distribution by Region", fontsize=12, fontweight="bold", pad=10)
    ax4.set_ylabel("Units Sold per Order")

    # Clean up layout and save to disk
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    
    output_filename = "sales_dashboard.png"
    fig.savefig(output_filename, dpi=300, bbox_inches="tight")
    print(f"Sales Dashboard successfully generated and exported to '{output_filename}'.")
    plt.close(fig)


if __name__ == "__main__":
    generate_sales_dashboard()
```

---

## 3. Sample Execution Simulation

```text
Sales Dashboard successfully generated and exported to 'sales_dashboard.png'.
```

The resulting `sales_dashboard.png` image provides a clean 300 DPI executive graphic combining four key statistical and operational perspectives in a unified palette.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Memory Leaks During Multi-Figure Generation
When generating hundreds of charts in an automated reporting loop, always call `plt.close(fig)` after saving each figure to free GUI canvas memory.

### 2. Misleading Zero-Baseline Truncation
Truncating the Y-axis baseline on bar charts exaggerates minor differences between categories, leading to misleading data interpretation.

---

---

## 💻 Try It Yourself: Extension Challenge - Category Breakdown Pie Chart

### Challenge
Add a sub-plot chart to the Sales Data Visualizer displaying percentage sales contribution by product category using a donut pie chart.

### Complete Solution
```python
import matplotlib.pyplot as plt

categories = ["Electronics", "Apparel", "Home Goods", "Books"]
sales = [450000, 280000, 190000, 80000]
colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

plt.figure(figsize=(6, 6))
wedges, texts, autotexts = plt.pie(
    sales, labels=categories, autopct="%1.1f%%", colors=colors,
    startangle=140, pctdistance=0.82
)
# Draw center circle for donut chart
centre_circle = plt.Circle((0, 0), 0.65, fc="white")
plt.gca().add_artist(centre_circle)

plt.title("Sales by Product Category", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("category_donut.png", dpi=150)
print("Donut pie chart saved to 'category_donut.png'.")
plt.close()
```

### Expected Output
```text
Donut pie chart saved to 'category_donut.png'.
```

---

## Practice Quiz

### 1. In our dashboard project, what makes Panel 3 render as a "Donut Chart" rather than a standard solid pie chart?
A. Passing `style="donut"` to Matplotlib
B. Setting `wedgeprops=dict(width=0.45)` to hollow out the central area
C. Adding an outer black border
D. Setting `shadow=True`
**Answer:** B
**Explanation:** Defining a fractional width in `wedgeprops` cuts out the center of the pie, transforming it into a modern donut chart.
---

### 2. Which method was used in Panel 1 to shade the region beneath the revenue trajectory line?
A. `ax.shade()`
B. `ax.fill_between()`
C. `ax.color_area()`
D. `ax.background()`
**Answer:** B
**Explanation:** `ax.fill_between(x, y)` fills the area between a curve and an axis baseline with a semi-transparent color.
---

### 3. Why does the script execute `plt.close(fig)` at the conclusion of dashboard generation?
A. To convert the image into PDF format
B. To free the system memory and GUI canvas resources associated with the figure
C. To force the operating system to shut down
D. To upload the image to a cloud server
**Answer:** B
**Explanation:** Calling `plt.close(fig)` releases memory allocated to figures, preventing memory leaks in automated report generators.
---

### 4. What is the role of `y=0.98` in `fig.suptitle(..., y=0.98)`?
A. It sets font thickness to 98%
B. It positions the master super-title slightly below the very top edge of the canvas so it does not collide with subplots
C. It rotates the text 98 degrees
D. It specifies 98 DPI resolution
**Answer:** B
**Explanation:** The `y` parameter in `suptitle` specifies the vertical coordinate (from 0 to 1) for title placement on the figure canvas.
---

### 5. What statistical insights does the Seaborn boxplot in Panel 4 communicate that a simple average bar chart cannot?
A. The name of the salesperson
B. The median, interquartile range (IQR), variance spread, and statistical outliers
C. Currency exchange rates
D. Network bandwidth
**Answer:** B
**Explanation:** Boxplots reveal data dispersion, medians, quartiles, and outlier anomalies that are masked when reducing data to a simple average.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project 1: Expense Tracker with CSV** (14: Intermediate Projects).

👉 **[Continue to Next Lesson: Project 1: Expense Tracker with CSV →](/tutorials/python-for-intermediate/project-1-expense-tracker-with-csv)**
