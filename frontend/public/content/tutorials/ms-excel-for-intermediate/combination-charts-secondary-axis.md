# Combination Charts with Secondary Axis

In business analytics, you frequently need to compare two metrics that use **vastly different numerical scales** or represent **different units of measurement**—for example, comparing Gross Sales ($100,000 to $1,000,000) against Profit Margin Percentage (5% to 25%). If plotted on a standard single-axis chart, the percentage line flattens into an invisible zero line. A **Combination Chart with a Secondary Axis** solves this problem cleanly.

---

## 1. The Multi-Scale Dilemma

Imagine plotting this monthly summary:
* Revenue: $500,000 (Measured in hundreds of thousands of dollars)
* Units Sold: 4,000 (Measured in thousands of units)
* Customer Satisfaction: 94% (Measured as a decimal fraction between 0.00 and 1.00)

If plotted on a single vertical axis calibrated from $0 to $600,000, 94% (0.94) is indistinguishable from zero!

```
Left Axis (Primary): $0 to $1,000,000   -> Plotted as Clustered Columns (Revenue)
Right Axis (Secondary): 0% to 30%        -> Plotted as a Line Chart (Profit Margin %)
```

![Combo Charts and Secondary Axis](/images/tutorials/ms-excel/charts-and-visualizations.svg)

---

## 2. Step-by-Step: Creating a Combo Chart

1. Select your data range including headers (e.g., Months, Revenue, and Margin %).
2. Go to **Insert > Charts group > Insert Combo Chart** (or click the *See All Charts* dialog launcher arrow).
3. Select the **Combo** tab at the bottom of the *All Charts* window:
   * **Series 1 (Revenue):**
     * Chart Type: **Clustered Column**
     * Secondary Axis box: **Unchecked** (Bound to Primary Left Axis).
   * **Series 2 (Margin %):**
     * Chart Type: **Line** (or Line with Markers)
     * Secondary Axis box: **CHECKED** (Creates the Secondary Right Axis).
4. Click **OK**.

---

## 3. Formatting and Best Practices for Dual-Axis Charts

* **Always Include Axis Titles:** Because dual-axis charts have two vertical scales, viewers will get confused unless you label both:
  * Primary Axis Title: *"Revenue (USD)"*
  * Secondary Axis Title: *"Operating Margin (%)"*
* **Color Coordinate Axes:** Format the font color of the primary Y-axis numbers to match the color of the column bars (e.g., Navy Blue), and the secondary Y-axis numbers to match the line color (e.g., Orange).
* **Calibrate Gridlines:** Ensure horizontal gridlines are tied strictly to the primary axis, or hide gridlines entirely to prevent competing grid lines from confusing readers.

---

# Multiple Choice Questions

### 1. Why would you add a Secondary Axis to an Excel chart?
A. To rotate the chart 90 degrees
B. To clearly display two data series that have vastly different numerical scales or units (such as revenue dollars and profit margin percentages)
C. To make the chart print in black and white
D. To link the chart to Microsoft PowerPoint
**Answer:** B
**Explanation:** A secondary axis provides a second independent vertical scale on the right side of the chart, allowing metrics with different units or scales to be compared legibly.

---

### 2. What happens if you plot $800,000 in Revenue and 15% Margin on a single vertical axis without a secondary axis?
A. Excel crashes
B. The 15% margin appears as a flat line sitting directly on the zero axis because 0.15 is negligible compared to 800,000
C. The numbers are automatically converted into British Pounds
D. Revenue is divided by 100
**Answer:** B
**Explanation:** On a scale reaching $800,000, a percentage value (0.15) is so close to zero that it appears as an invisible flat line along the bottom axis.

---

### 3. Which chart combination is most commonly used for executive sales and margin reporting?
A. Pie chart and Radar chart
B. Clustered Column (for Revenue) and Line with Markers (for Profit Margin %)
C. Bubble chart and Doughnut chart
D. High-Low-Close Stock chart
**Answer:** B
**Explanation:** Combining Clustered Columns for absolute dollar volume with a Line for rate/percentage trends is the enterprise standard combo chart.

---

### 4. Where do you find the Combo Chart option in Microsoft Excel?
A. Review tab > Proofing
B. Insert tab > Charts group > Insert Combo Chart (or All Charts > Combo)
C. Formulas tab > Lookup
D. Data tab > Data Tools
**Answer:** B
**Explanation:** Combo charts are accessed via the Insert tab under the Charts group or by opening the Insert Chart dialog and selecting the 'Combo' category.

---

### 5. Why is adding clear Axis Titles especially crucial on a dual-axis combination chart?
A. To comply with copyright laws
B. Without axis titles, readers cannot know which axis corresponds to which data series
C. Axis titles are required for formulas to update
D. It prevents the chart from being deleted
**Answer:** B
**Explanation:** Because there are two distinct vertical scales with different units, explicit axis titles are essential to prevent misinterpretation.

---
