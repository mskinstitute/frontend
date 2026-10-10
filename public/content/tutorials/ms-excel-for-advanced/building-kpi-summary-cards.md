# Building Dynamic KPI Summary Cards

**KPI (Key Performance Indicator) Cards** are the prominent summary blocks situated at the top of an executive dashboard. They communicate vital health metrics—such as Total Revenue, Year-to-Date Margin, Total Orders, and Customer Satisfaction—along with comparative badges indicating whether performance is pacing ahead or behind target.

---

## 1. Anatomy of a High-Impact KPI Card

A professional KPI card is composed of four visual elements:

```
+---------------------------------------+
|  TOTAL REVENUE                        | <- 1. Metric Title (Small, Slate Gray)
|  $4,850,200                           | <- 2. Big Hero Number (28pt, Bold Navy)
|  [ ▲ +14.2% vs Target ]               | <- 3. Variance Indicator Badge
+---------------------------------------+
```

![Dynamic KPI Summary Cards](/images/tutorials/ms-excel/executive-sales-dashboard.svg)

---

## 2. Step-by-Step Construction: The Floating Shape Method

While you can format worksheet cells directly, creating KPI cards using **Shapes linked to formula cells** allows for pixel-perfect alignment and prevents row height adjustments from breaking card proportions:

### Step 1: Calculate the Metric in Your Calculation Tab
On your 'Calc_Pivots' tab:
* Cell **B10:** '=SUM(FactSales[Revenue])'
* Cell **B11:** '=(B10 - TargetSales) / TargetSales' (Formatted as '+14.2%')

### Step 2: Draw and Style the Card Container
1. On your Dashboard tab, click **Insert > Shapes > Rounded Rectangle**.
2. Set dimensions: Height = 1.8 inches, Width = 3.2 inches.
3. Shape Fill: Crisp White. Shape Outline: Soft Gray (1pt).
4. Apply a soft outer drop shadow (*Shape Effects > Shadow > Offset Bottom*).

### Step 3: Insert the Linked Hero Number Text Box
1. Go to **Insert > Text Box**. Draw a small box inside the card.
2. Click the **border of the Text Box** so the cursor is not flashing inside.
3. Click inside the **Formula Bar** at the top of Excel.
4. Type:
   ```excel
   =Calc_Pivots!$B$10
   ```
5. Press **Enter**.
6. Format the text: 26pt, Segoe UI or Calibri, Bold, Deep Charcoal color.
*The text box is now dynamically linked to your calculation cell! Whenever sales change, the KPI card updates live!*

---

## 3. Adding Dynamic Variance Badges (Up/Down Arrows)

To show whether the metric increased or decreased compared to the previous period:
1. In cell **B12** of your calculation tab, write a dynamic status string:
   ```excel
   =IF(B11>=0, "▲ +" & TEXT(B11, "0.0%") & " vs Target", "▼ " & TEXT(B11, "0.0%") & " vs Target")
   ```
2. Link a second small text box inside the KPI card to '=Calc_Pivots!$B$12'.
3. Apply conditional font colors (Forest Green for positive, Crimson Red for negative).

---

# Multiple Choice Questions

### 1. How do you link an Excel Text Box to display the live value of cell Calc_Pivots!$B$10?
A. Type '=Calc_Pivots!$B$10' inside the text box body
B. Select the text box border, click the Formula Bar, type '=Calc_Pivots!$B$10', and press Enter
C. Write a macro in C++
D. Right-click the text box and choose 'Hyperlink'
**Answer:** B
**Explanation:** Linking a shape or text box to a cell requires selecting the shape border and typing the equal sign reference directly into the Excel Formula Bar.

---

### 2. Why is building KPI cards using floating graphic shapes preferred over standard worksheet cells in executive dashboards?
A. Floating shapes allow pixel-perfect placement and cannot be distorted when underlying worksheet columns are resized
B. Worksheet cells cannot hold numbers larger than 1,000
C. Shapes calculate 10 times faster
D. Microsoft requires shapes for all dashboards
**Answer:** A
**Explanation:** Floating shapes provide complete layout flexibility, allowing precise positioning that remains stable regardless of grid adjustments.

---

### 3. Which formula snippet formats a decimal value (e.g., 0.142) into a formatted percentage string '+14.2%'?
A. =PERCENT(0.142)
B. =TEXT(0.142, "+0.0%")
C. =VALUE(0.142, "%")
D. =STRING(0.142)
**Answer:** B
**Explanation:** The TEXT function with format mask "+0.0%" converts numbers into formatted text strings with explicit plus signs and decimal precision.

---

### 4. What is the 'Big Hero Number' in a KPI card?
A. The card's serial number
B. The prominent, oversized primary numerical metric (e.g., $4.2M) designed to seize immediate viewer attention
C. The telephone number of the CEO
D. The formula syntax
**Answer:** B
**Explanation:** The "Big Hero Number" is the prominent focal metric displayed in large bold font for immediate visual communication.

---

### 5. What happens to the value displayed inside a linked KPI text box when new data is refreshed in the workbook?
A. It displays #REF!
B. It updates automatically in real time to reflect the new calculated value
C. It must be manually deleted and redrawn
D. It opens an email prompt
**Answer:** B
**Explanation:** Linked text boxes maintain dynamic two-way bindings to their source cells, updating immediately whenever recalculation occurs.

---
