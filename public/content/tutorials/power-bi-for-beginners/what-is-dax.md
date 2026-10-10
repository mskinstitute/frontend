# What is DAX?

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is DAX (Data Analysis Expressions)?
**DAX** is the native formula and query language developed by Microsoft for Power BI, Analysis Services, and Excel Power Pivot.

While DAX looks similar to Excel spreadsheet formulas (it shares functions like `SUM`, `AVERAGE`, and `IF`), **DAX is fundamentally different**:
- Excel formulas calculate over cell references (`A1 + B1`).
- DAX formulas calculate over **entire tables, columns, and relationships** under dynamic filter contexts!

---

## 2. The Two Core Types of Calculations in DAX
1. **Calculated Columns:** Evaluated row-by-row during data refresh. Stored in memory.
2. **Measures:** Dynamic formulas calculated on the fly in response to user slicers and visual filters. Zero storage footprint!

---

# Multiple Choice Questions

### 1. What does the acronym DAX stand for?
A. Data Analysis Expressions
B. Dynamic Analytics XML
C. Database Access Extension
D. Desktop Application X
**Answer:** A
**Explanation:** DAX stands for Data Analysis Expressions.
---

### 2. How do DAX calculations fundamentally differ from classic Microsoft Excel formulas?
A. Excel formulas operate on individual cell coordinates (e.g. A1:B10), while DAX operates on complete columns, tables, and relational filter contexts
B. DAX cannot do addition
C. Excel formulas can only use letters
D. DAX only works in English
**Answer:** A
**Explanation:** DAX is designed for relational tabular models, executing across columns and tables rather than grid cells.
---

### 3. Which software applications support the DAX formula language?
A. Power BI Desktop, Microsoft Analysis Services, and Microsoft Excel Power Pivot
B. Google Sheets
C. Adobe Photoshop
D. MySQL Workbench
**Answer:** A
**Explanation:** DAX is shared across Microsoft's tabular BI platform: Power BI, SSAS Tabular, and Excel Power Pivot.
---

### 4. Do calculated measures take up storage space on your hard drive?
A. No, measures are calculated dynamically in RAM at query time and store zero data on disk
B. Yes, 1 MB per measure
C. Yes, they save as separate text files
D. Only if exported
**Answer:** A
**Explanation:** Measures store only the formula string; calculation occurs on-the-fly when visuals render.
---

### 5. In DAX syntax, what is the best practice for referencing columns vs measures?
A. Always include the table name for columns (e.g. `Sales[Revenue]`) and omit table name for measures (e.g. `[Total Revenue]`)
B. Never use table names
C. Always use lowercase
D. Put measures in quotes
**Answer:** A
**Explanation:** Microsoft best practice dictates fully qualifying columns (`Table[Column]`) and referencing measures as `[MeasureName]` to disambiguate them.
---
