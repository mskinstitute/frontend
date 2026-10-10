# Mini Project: Executive Sales & Profitability Dashboard

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Executive Dashboard Project Overview
In this capstone lesson, we bring together Matplotlib and Seaborn to construct a **2x2 Multi-Panel Executive Sales Dashboard** displaying:
1. **Top-Left:** Monthly Revenue Trend with Target Benchmark
2. **Top-Right:** Revenue Breakdown by Product Category
3. **Bottom-Left:** Profitability vs Discount Scatter Plot
4. **Bottom-Right:** Regional Performance Comparison (Horizontal Bar Chart)

---

## 2. Complete Python Implementation
```python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Set global theme
sns.set_theme(style='whitegrid')
fig, axes = plt.subplots(2, 2, figsize=(14, 10), dpi=150)
fig.suptitle('MSK Institute - Executive Sales & Profitability Dashboard (FY 2026)', fontsize=16, fontweight='bold', y=0.98)

# Panel 1: Monthly Trend
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
rev = [45, 52, 60, 68, 85, 95]
axes[0, 0].plot(months, rev, marker='o', color='#2563eb', linewidth=2.5, label='Actual')
axes[0, 0].axhline(70, color='#ef4444', linestyle='--', label='Monthly Target (70L)')
axes[0, 0].set_title('Monthly Revenue Trajectory (Lakhs INR)')
axes[0, 0].legend()

# Panel 2: Product Category Share
categories = ['Data Analytics', 'Full Stack Web', 'Python Backend', 'Cloud DevOps']
shares = [40, 25, 20, 15]
axes[0, 1].bar(categories, shares, color=['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'])
axes[0, 1].set_title('Revenue Share by Tech Track (%)')
axes[0, 1].set_xticklabels(categories, rotation=15, ha='right')

# Panel 3: Discount vs Profitability
discounts = np.random.uniform(5, 40, 100)
profits = 100 - (discounts * 2.2) + np.random.normal(0, 10, 100)
axes[1, 0].scatter(discounts, profits, color='#059669', alpha=0.7)
axes[1, 0].set_title('Discount % vs Operating Margin Impact')
axes[1, 0].set_xlabel('Discount Offered (%)')
axes[1, 0].set_ylabel('Profit Margin (%)')

# Panel 4: Regional Performance
regions = ['Delhi NCR', 'Western UP', 'Mumbai Metro', 'Bengaluru Hub']
performance = [320, 280, 210, 190]
axes[1, 1].barh(regions, performance, color='#0284c7')
axes[1, 1].invert_yaxis()
axes[1, 1].set_title('Gross Enrollments by Regional Hub')

plt.tight_layout()
plt.show()
```

---

# Multiple Choice Questions

### 1. In a 2x2 subplot layout created with `fig, axes = plt.subplots(2, 2)`, how is the bottom-left subplot referenced?
A. `axes[1, 0]`
B. `axes[0, 1]`
C. `axes[2, 1]`
D. `axes[3]`
**Answer:** A
**Explanation:** 2D NumPy array indexing uses `[row_index, col_index]`. Row 1 (bottom), Column 0 (left) references `axes[1, 0]`.
---

### 2. Which command sets an overarching master title across the entire multi-panel dashboard figure?
A. `fig.suptitle('Dashboard Title')`
B. `plt.master_title()`
C. `ax.big_title()`
D. `fig.header()`
**Answer:** A
**Explanation:** `fig.suptitle()` sets a centralized super-title spanning all subplots in the figure.
---

### 3. What is the primary purpose of constructing a multi-panel dashboard figure over showing isolated charts?
A. It provides holistic contextual situational awareness, enabling leaders to cross-reference multiple business dimensions on a single screen
B. It saves paper
C. It reduces database size
D. It runs without an operating system
**Answer:** A
**Explanation:** Dashboards consolidate interconnected operational metrics into a single unified view for root-cause and trend analysis.
---

### 4. How do you rotate x-axis tick labels by 45 degrees so long category strings do not overlap?
A. `ax.tick_params(axis='x', rotation=45)` (or `plt.xticks(rotation=45)`)
B. `ax.tilt_x(45)`
C. `ax.angle(45)`
D. `ax.spin(45)`
**Answer:** A
**Explanation:** Rotating x-axis tick labels by 45 degrees prevents text collisions when category names are long.
---

### 5. What role does an executive dashboard play in a data analyst's professional portfolio?
A. Demonstrates end-to-end technical competence, business acumen, and data storytelling ability to prospective employers
B. It is only used for student homework
C. It proves hardware speed
D. It replaces all database engineers
**Answer:** A
**Explanation:** Executive dashboards showcase an analyst's ability to turn business questions into actionable, visually compelling decision tools.
---
