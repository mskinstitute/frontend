# Calculated Fields and Calculated Items

While Pivot Tables aggregate existing data fields, enterprise reporting often demands **derived mathematical metrics** that do not exist in the raw dataset—such as Tax Liability, Profit Margin, Commission Bonus, or Variance Analysis. **Calculated Fields** allow you to embed custom formulas directly into the Pivot Table calculation engine.

---

## 1. Calculated Fields vs. Calculated Items

```
+-----------------------------------+-----------------------------------+
| Calculated Field                  | Calculated Item                   |
+-----------------------------------+-----------------------------------+
| Creates a brand-new COLUMN of data| Creates a new ROW inside an       |
| by executing math on existing     | existing field category (e.g.,    |
| fields (e.g., =Revenue - Cost).   | =North + South).                  |
+-----------------------------------+-----------------------------------+
```

![Calculated Fields in Pivot Tables](/images/tutorials/ms-excel/pivot-tables-and-fields.svg)

---

## 2. Step-by-Step: Creating a Calculated Field

Suppose your source data has **Revenue** and **Expenses**, but lacks a **Net Profit** column:

1. Click any cell inside your Pivot Table.
2. Go to the **PivotTable Analyze** tab on the Ribbon.
3. In the *Calculations* group, click **Fields, Items, & Sets > Calculated Field...**.
4. In the *Insert Calculated Field* dialog box:
   * **Name:** Type **NetProfit**.
   * **Formula:** Type:
     ```excel
     =Revenue - Expenses
     ```
     *(You can double-click field names in the list to insert them into the formula).*
5. Click **Add**, then click **OK**.
6. A new field named **Sum of NetProfit** appears in your Pivot Table and is permanently available in your PivotTable Fields list!

---

## 3. Calculating Ratios: Profit Margin %

To calculate Profit Margin percentage:
1. Open **Calculated Field...**.
2. Name: **MarginPct**.
3. Formula:
   ```excel
   =(Revenue - Expenses) / Revenue
   ```
4. Click **OK**.
5. Format the resulting column as **Percentage** via *Value Field Settings*.

> **The Golden Rule of Calculated Fields:**
> A Calculated Field always performs the formula on the **SUM of the fields**, not on individual rows! For example, '=Revenue / Units' calculates 'SUM(Revenue) / SUM(Units)'. This is mathematically correct for weighted averages and ratios!

---

## 4. Managing and Modifying Formulas

To edit or delete an existing Calculated Field:
1. Return to **Fields, Items, & Sets > Calculated Field...**.
2. In the **Name** dropdown, select your custom field (e.g., 'NetProfit').
3. Modify the formula or click **Delete** to remove it permanently.
4. To view a complete printed audit trail of all custom calculations, choose **Fields, Items, & Sets > List Formulas**. Excel generates a brand-new worksheet listing every formula!

---

# Multiple Choice Questions

### 1. What does a 'Calculated Field' create inside a Pivot Table?
A. A new worksheet
B. A new virtual data field (column) performing calculations on existing fields
C. A macro button
D. A chart template
**Answer:** B
**Explanation:** Calculated Fields generate new virtual data columns that evaluate mathematical formulas across existing Pivot Table fields.

---

### 2. Where is the command to create a Calculated Field located on the Ribbon?
A. Home tab > Clipboard
B. PivotTable Analyze tab > Fields, Items, & Sets > Calculated Field...
C. Insert tab > Sparklines
D. Data tab > What-If Analysis
**Answer:** B
**Explanation:** Calculated Fields are managed under the PivotTable Analyze ribbon tab within the Fields, Items, & Sets menu.

---

### 3. How does Excel evaluate a formula like '=Sales * 0.10' inside a Calculated Field?
A. It calculates row by row in the raw data, then averages them
B. It sums all the Sales first, and then multiplies the total sum by 0.10
C. It rounds all numbers to the nearest integer
D. It generates a syntax error
**Answer:** B
**Explanation:** Calculated Fields always operate on the aggregated sums of the underlying fields: SUM(Sales) * 0.10.

---

### 4. How can you generate an audit report that lists all custom Calculated Fields and their formulas on a new worksheet?
A. Press Ctrl + P
B. PivotTable Analyze > Fields, Items, & Sets > List Formulas
C. File > Export > Audit
D. Review tab > Inspect Document
**Answer:** B
**Explanation:** The 'List Formulas' command generates a dedicated reference worksheet detailing every custom calculation and its formula syntax.

---

### 5. Can a Calculated Field use text functions like LEFT, MID, or IF statements referencing text fields?
A. Yes, all Excel functions work identically in Calculated Fields
B. No, Calculated Fields can only perform arithmetic operations (+, -, *, /) on numeric sums
C. Only with VBA scripts enabled
D. Only on Macintosh computers
**Answer:** B
**Explanation:** Calculated Fields operate strictly on numeric aggregations and cannot manipulate individual text strings or row-level string functions.

---
