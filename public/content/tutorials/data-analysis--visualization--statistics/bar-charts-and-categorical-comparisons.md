# Bar Charts, Horizontal Bars & Stacked Bars

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Comparing Discrete Categories
While line charts represent continuous trends, **Bar Charts** are designed to compare discrete categories (e.g., Sales by Department, Revenue by Region, Traffic by Channel).

---

## 2. Vertical vs Horizontal Bar Charts
- **Vertical Bars (`ax.bar`):** Best when categories are few (3 to 7) and have short names.
- **Horizontal Bars (`ax.barh`):** Best when comparing many categories (8+) or when category labels are long (e.g., "Customer Relationship Management Department").

```python
import matplotlib.pyplot as plt

cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai']
sales = [1420, 1380, 1150, 890, 780]

fig, ax = plt.subplots(figsize=(9, 4.5))
# Horizontal bar chart sorted by value
ax.barh(cities, sales, color='#0284c7', height=0.6)

ax.set_title('Top Indian Metro Markets by Revenue (Cr INR)')
ax.set_xlabel('Revenue (in Crores)')
ax.invert_yaxis() # Puts the highest value at the top!

# Add direct data value labels on bars
for idx, val in enumerate(sales):
    ax.text(val + 20, idx, f"₹{val} Cr", va='center', fontweight='bold', fontsize=10)

plt.show()
```

---

# Multiple Choice Questions

### 1. Which Matplotlib method renders a horizontal bar chart?
A. `ax.bar()`
B. `ax.barh()`
C. `ax.hbar()`
D. `ax.horizontal()`
**Answer:** B
**Explanation:** `ax.barh()` plots horizontal bars across the y-axis categories.
---

### 2. Why are horizontal bar charts strongly recommended when category labels are lengthy?
A. Horizontal bars allow long labels to be read naturally from left to right without diagonal tilt
B. They load faster
C. Vertical bars do not allow text
D. Horizontal bars can display infinite data
**Answer:** A
**Explanation:** Horizontal bar charts provide ample vertical space for long string names without forcing awkward 45-degree angled text.
---

### 3. What does calling `ax.invert_yaxis()` do on a horizontal bar chart?
A. Inverts colors
B. Reverses the y-axis order so that the top category appears first at the top of the chart
C. Turns bars into line plots
D. Deletes the bottom bar
**Answer:** B
**Explanation:** By default, Matplotlib plots from bottom to top. `invert_yaxis()` flips this so the #1 ranked bar sits at the top.
---

### 4. How do you construct a stacked bar chart in Matplotlib?
A. Use the `bottom` parameter in subsequent `ax.bar()` calls to stack bars on top of preceding values
B. Set `stack=True`
C. Put bars in a Python list
D. Call `ax.stack_bars()`
**Answer:** A
**Explanation:** The `bottom` parameter defines the starting vertical baseline for stacked segments.
---

### 5. What is the recommended best practice for ordering categories in a comparison bar chart?
A. Always keep them in random order
B. Sort them by value (descending or ascending) unless the categories have an inherent chronological order
C. Always sort alphabetically regardless of context
D. Sort by number of characters in the name
**Answer:** B
**Explanation:** Sorting by metric magnitude facilitates immediate comparison between leaders and laggards.
---
