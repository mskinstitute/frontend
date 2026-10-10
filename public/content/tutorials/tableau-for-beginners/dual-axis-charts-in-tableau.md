# Dual Axis & Combined Axis Charts

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. When to Use Dual Axis Charts
A **Dual Axis Chart** overlays two independent measures on the same visual canvas with separate y-axes (left and right).
- **Classic Use Case (Combo Chart):** Plotting **Sales (Volume - Bars)** on the left axis and **Profit Margin % (Rate - Line)** on the right axis over time.

---

## 2. How to Build a Dual Axis Chart:
1. Drag Measure 1 (`Sales`) and Measure 2 (`Profit`) onto the **Rows** shelf (creates two stacked charts).
2. Right-click the second measure pill on Rows $	o$ Select **Dual Axis**.
3. *CRITICAL STEP:* If both measures share the same unit (e.g. INR), right-click the right axis $	o$ Select **Synchronize Axis**!
4. Customize mark types independently in the Marks card (e.g., Bar for Sales, Line for Profit).

---

# Multiple Choice Questions

### 1. What step must you always take when plotting two measures that share the same scale on a Dual Axis chart to prevent misleading comparisons?
A. Right-click the secondary axis and select 'Synchronize Axis'
B. Delete the left axis
C. Divide both by 10
D. Turn the chart upside down
**Answer:** A
**Explanation:** Synchronizing axes ensures both left and right axes align to identical scale tick increments.
---

### 2. How can you set one measure to display as Bars and the other as a Line on a Dual Axis chart?
A. In the Marks Card, select each measure's individual sub-tab and choose 'Bar' and 'Line' respectively
B. It is not possible in Tableau
C. Use 'Show Me'
D. Change Windows settings
**Answer:** A
**Explanation:** Dual axis creates dedicated Marks sub-cards for each measure, allowing independent mark type selection.
---

### 3. What is the difference between a 'Dual Axis Chart' and a 'Combined Axis (Shared Axis) Chart'?
A. Dual Axis has two independent axes on left and right; Combined Axis merges two measures onto a single shared axis
B. Combined axis cannot show numbers
C. Dual axis is deprecated
D. There is no difference
**Answer:** A
**Explanation:** Shared axis blends measures onto one vertical scale; dual axis maintains two separate scales.
---

### 4. How do you create a Combined Axis chart in Tableau?
A. Drag the second measure directly onto the existing measure's vertical axis ruler until two parallel green rulers appear
B. Click 'Dual Axis'
C. Copy-paste
D. Use a table calculation
**Answer:** A
**Explanation:** Dropping a measure directly on an active axis ruler combines them into a shared `Measure Values` axis.
---

### 5. Why is a combo chart (Bar + Line) popular in executive reporting?
A. It effectively shows the relationship between total volume (bars) and profitability rate/margin (line) simultaneously
B. It uses less ink
C. It proves the analyst knows Tableau
D. It runs without an internet connection
**Answer:** A
**Explanation:** Overlaying absolute volume with fractional rate provides complete situational awareness in one visual.
---
