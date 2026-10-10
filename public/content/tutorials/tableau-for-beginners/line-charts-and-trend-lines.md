# Line Charts, Trend Lines & Date Hierarchies

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Automatic Date Hierarchies
When a Date field is dragged onto a shelf in Tableau, it automatically creates an interactive hierarchy:
$$	ext{Year} 	o 	ext{Quarter} 	o 	ext{Month} 	o 	ext{Day}$$
Clicking the plus sign ($+$) on the pill expands the hierarchy!

---

## 2. Date Parts (Discrete) vs Date Values (Continuous)
Right-clicking a date pill reveals two distinct sections of dates:
- **Top Section (Date Part - Blue Discrete):** Compares cyclical patterns across years (e.g., all Januarys across 2024, 2025, 2026 combined into one bucket).
- **Bottom Section (Date Value - Green Continuous):** Plots a chronological timeline from historical past to future (e.g., Jan 2024 $	o$ Feb 2024 $	o$ Mar 2024).

---

## 3. Adding Statistical Trend Lines
- Open the **Analytics Pane** (next to the Data pane) $	o$ Drag **Trend Line** onto the canvas (Linear, Logarithmic, Exponential, Polynomial).

---

# Multiple Choice Questions

### 1. In Tableau, what does the top section of options in a Date field's right-click menu represent?
A. Discrete Date Parts (e.g. cyclical Month independent of year: all Januarys aggregated together)
B. Continuous timeline
C. Timezone conversions
D. Date formats in French
**Answer:** A
**Explanation:** Date Parts (Blue) evaluate calendar segments across all years, revealing seasonality.
---

### 2. In Tableau, what does the bottom section of options in a Date field's right-click menu represent?
A. Continuous Date Values (e.g. sequential chronologically ordered timeline: Jan 2024, Feb 2024...)
B. Day of week only
C. Holiday lists
D. Deletion options
**Answer:** A
**Explanation:** Date Values (Green) plot continuous time-series trajectories chronologically.
---

### 3. Where in Tableau Desktop do you find pre-built analytical features like Trend Lines, Forecasts, and Reference Lines?
A. The Analytics Pane (tab next to the Data Pane)
B. The Windows Start menu
C. The File menu
D. AppSource
**Answer:** A
**Explanation:** The Analytics Pane provides drag-and-drop statistical tools (reference bands, forecasts, box plots).
---

### 4. What statistical metrics are displayed when you hover over an added Trend Line in Tableau?
A. Equation of the line, R-Squared ($R^2$), and P-value
B. Total row count only
C. Memory usage
D. Font size
**Answer:** A
**Explanation:** Tableau displays the mathematical regression formula, coefficient of determination ($R^2$), and p-value on hover.
---

### 5. Can Tableau generate automated predictive forecasts for future time periods?
A. Yes, by dragging 'Forecast' from the Analytics pane onto a time-series line chart
B. No, forecasting requires Python coding only
C. Only for past dates
D. Only on leap years
**Answer:** A
**Explanation:** Tableau features built-in exponential smoothing models that forecast future periods with confidence bands.
---
