# Dimensions vs Measures & Discrete (Blue) vs Continuous (Green) Pills

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. The Fundamental Truth of Tableau
Every field in Tableau has **two independent attributes**:
1. **Role:** Dimension vs Measure
2. **Type:** Discrete (Blue) vs Continuous (Green)

> *CRITICAL MISCONCEPTION: Blue does NOT mean text and Green does NOT mean number! Blue means DISCRETE, and Green means CONTINUOUS!*

---

## 2. Blue vs Green: The Visual Rule
- **Blue (Discrete):** Draws **Headers**, categories, and row/column dividers. (e.g., [City], [Year], [Region]).
- **Green (Continuous):** Draws continuous **Axes** and gradient color scales. (e.g., [Profit], [Sales], [Discount %]).

---

# Multiple Choice Questions

### 1. In Tableau, what does a Blue pill represent?
A. A Discrete field (creates categorical headers and dividers)
B. Only text fields
C. A corrupted field
D. A field with missing data
**Answer:** A
**Explanation:** In Tableau, Blue signifies Discrete (distinct individual values that form headers), regardless of whether the field is text or numeric.
---

### 2. In Tableau, what does a Green pill represent?
A. A Continuous field (creates continuous axes and gradient color scales)
B. Only currency fields
C. A newly added field
D. A temporary measure
**Answer:** A
**Explanation:** Green indicates Continuous (an unbroken infinite range that generates an axis).
---

### 3. What is the fundamental difference between a Dimension and a Measure?
A. Dimensions contain qualitative categorical context (slice and dice), while Measures contain quantitative numerical values that can be aggregated
B. Dimensions are blue, measures are red
C. Measures cannot be calculated
D. Dimensions cost money
**Answer:** A
**Explanation:** Dimensions define the level of detail; Measures contain values that are summarized (SUM, AVG).
---

### 4. Can a numerical field (like 'Customer Age') be converted into a Blue Discrete pill?
A. Yes, right-click the field and select 'Convert to Discrete' to use each age as an individual header
B. No, numbers can only be green
C. Only in Tableau Server
D. Only if age is under 18
**Answer:** A
**Explanation:** Any numerical measure can be converted to Discrete, creating distinct categorical headers (e.g. age groups).
---

### 5. When a Green continuous measure is dragged onto the 'Color' mark shelf, what type of color palette does Tableau generate?
A. A continuous color gradient (e.g. light blue to dark blue)
B. A categorical palette with 10 random colors
C. Black and white stripes
D. No color
**Answer:** A
**Explanation:** Continuous fields produce smooth quantitative gradients; discrete fields produce distinct categorical color swatches.
---
