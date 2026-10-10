# Parameters & Dynamic Controls

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is a Parameter in Tableau?
A **Parameter** is a dynamic workbook variable (number, date, or string) that replaces a constant value in calculations, filters, and reference lines.

Unlike filters (which are tied to existing data columns), **parameters are global independent controls**:
$$	ext{Parameter Control} 	o 	ext{Calculated Field / Filter} 	o 	ext{Visual Change}$$

---

## 2. Classic Use Cases for Parameters
1. **Dynamic Top N Filter:** Allow end-users to type or slide how many top products they want to see (Top 5, Top 10, Top 25).
2. **What-If Scenario Modeling:** Test the impact of increasing discounts by $X\%$ or sales commissions by $Y\%$.
3. **Dynamic Measure Switcher:** A single dropdown allowing users to swap between viewing `Sales`, `Profit`, or `Quantity` on the same chart!

---

# Multiple Choice Questions

### 1. What is a Parameter in Tableau?
A. A workbook-wide dynamic variable that allows users to pass custom input values into calculations, reference lines, and filters
B. A database password
C. A fixed column in Excel
D. A physical computer setting
**Answer:** A
**Explanation:** Parameters provide interactive user input widgets (sliders, lists, type-ins) that drive dynamic formulas.
---

### 2. Can a parameter change visual elements directly on its own without being connected to a calculation or filter?
A. No, a parameter is just a variable; it must be referenced inside a calculated field, top filter, or reference line to affect visuals
B. Yes, parameters draw charts automatically
C. Only on mobile devices
D. Only if paid
**Answer:** A
**Explanation:** A parameter does nothing by itself until linked to a calculation or filter condition.
---

### 3. How do you build a dynamic measure selector (allowing users to toggle a chart between Sales, Profit, and Quantity)?
A. Create a string parameter with choices ('Sales', 'Profit'), and reference it in a `CASE [Parameter] WHEN 'Sales' THEN [Sales]... END` calculated field
B. Duplicate the worksheet 10 times
C. Write custom SQL
D. Use a pie chart
**Answer:** A
**Explanation:** A CASE statement driven by a parameter dynamically returns the selected measure to the chart shelf.
---

### 4. What data types can a Tableau Parameter hold?
A. Float, Integer, String, Boolean, Date, and DateTime
B. Images and videos only
C. Only text
D. Only numbers
**Answer:** A
**Explanation:** Tableau parameters support all standard data types.
---

### 5. What are 'Parameter Actions' in Tableau?
A. Interactive dashboard triggers that update a parameter's value when a user clicks or hovers on marks in a chart
B. Database triggers
C. Export actions
D. User permissions
**Answer:** A
**Explanation:** Parameter Actions allow canvas mark clicks to set parameter values dynamically.
---
