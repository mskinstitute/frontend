# Relational Plots: scatterplot with hue & size mapping

*Reading Time: 8 Mins* | *Level: Intermediate*

---

## 1. Visualizing Relationships Between Continuous Variables
To understand how two numeric variables interact (e.g. Advertising Spend vs Revenue, or Engine Size vs Fuel Efficiency), use **`sns.scatterplot()`**.

---

## 2. Multi-Dimensional Encoding (Hue, Size & Style)
In a single 2D plane, Seaborn can visualize up to **5 variables simultaneously** through aesthetic dimension mapping:
- **X-axis:** Numeric Variable 1
- **Y-axis:** Numeric Variable 2
- **`hue`:** Categorical Variable 3 (Color)
- **`size`:** Numeric Variable 4 (Marker bubble diameter)
- **`style`:** Categorical Variable 5 (Marker shape: circle, cross, triangle)

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, ax = plt.subplots(figsize=(9, 6))

sns.scatterplot(
    data=df,
    x='total_bill',
    y='tip',
    hue='time',        # Color by Lunch vs Dinner
    size='size',       # Bubble size by table party size (1 to 6 people)
    sizes=(30, 250),
    style='smoker',    # Shape by Smoker Yes/No
    palette='deep',
    alpha=0.8,
    ax=ax
)

ax.set_title('Tip Amount vs Total Bill (Multivariate Relationship)')
ax.set_xlabel('Total Bill (USD)')
ax.set_ylabel('Tip Given (USD)')
plt.show()
```

---

# Multiple Choice Questions

### 1. Which parameter in `sns.scatterplot()` scales the diameter of points based on a numeric column (creating a bubble chart)?
A. `size`
B. `diameter`
C. `bubble_scale`
D. `magnify`
**Answer:** A
**Explanation:** The `size` parameter maps a column's values to marker area, and `sizes=(min, max)` controls the point scaling range.
---

### 2. How can you add a linear regression best-fit trendline to a scatter plot in Seaborn?
A. Use `sns.regplot()` or `sns.lmplot()`
B. Use `sns.line_fit()`
C. Use `df.draw_trend()`
D. Regression lines cannot be plotted in Python
**Answer:** A
**Explanation:** `sns.regplot()` and `sns.lmplot()` compute and plot linear regression trendlines with 95% confidence intervals automatically.
---

### 3. What does setting `alpha=0.5` do in a dense scatter plot with thousands of overlapping points?
A. Sets transparency to 50%, making clusters of overlapping points darker and easier to discern
B. Deletes 50% of the data points
C. Shrinks points by half
D. Rotates points 50 degrees
**Answer:** A
**Explanation:** Adjusting transparency (`alpha`) prevents overplotting blindness by making overlapping clusters appear denser.
---

### 4. Which parameter changes the marker shape (e.g. circles, squares, diamonds) based on a categorical variable?
A. `style`
B. `shape`
C. `form`
D. `type`
**Answer:** A
**Explanation:** The `style` parameter maps distinct marker symbols to each category.
---

### 5. What does a positive correlation look like on a scatter plot?
A. Points trend upward from bottom-left to top-right
B. Points trend downward from top-left to bottom-right
C. Points form a horizontal line
D. Points form a perfect circle
**Answer:** A
**Explanation:** A positive relationship shows that as the x-variable increases, the y-variable also increases (sloping upward).
---
