# Power Query Editor Basics

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Power Query?
**Power Query** is the ETL (Extract, Transform, Load) engine inside Power BI. Every transformation step you perform (e.g. removing columns, filtering rows, replacing values) is recorded sequentially in the **Applied Steps** pane using Microsoft's functional language: **M**.

---

## 2. Applied Steps: The Non-Destructive Recipe
Unlike Excel where deleting a column permanently modifies your original data file, Power Query is **non-destructive**:
- The source file remains completely untouched.
- Power Query builds an executable script of transformations.
- During every data refresh, Power Query re-executes each step in exact order.

---

## 3. The Power Query Ribbon
- **Home:** Split column, Group By, Merge Queries, Append Queries.
- **Transform:** Modifies existing columns in place (e.g. uppercase, math, transpose).
- **Add Column:** Creates a new column while preserving the original column (e.g. Custom Column, Conditional Column).

---

# Multiple Choice Questions

### 1. What is the programming language that operates under the hood of Power Query?
A. M formula language
B. DAX
C. Python
D. Visual Basic
**Answer:** A
**Explanation:** Power Query transformations are written in the M functional formula language.
---

### 2. What does the 'Applied Steps' pane in Power Query represent?
A. A non-destructive, sequential list of transformation instructions applied to the data during refresh
B. A list of website links
C. An error log
D. A chat window
**Answer:** A
**Explanation:** Applied Steps records every transformation step in sequence, allowing you to delete, reorder, or modify steps at any time.
---

### 3. What is the crucial difference between the 'Transform' tab and the 'Add Column' tab in Power Query?
A. 'Transform' modifies the selected column in-place, while 'Add Column' creates a new column and keeps the original
B. 'Transform' is for numbers; 'Add Column' is for text
C. 'Add Column' costs money
D. There is no difference
**Answer:** A
**Explanation:** 'Transform' overwrites the existing column; 'Add Column' produces an additional column with the calculated result.
---

### 4. How do you undo a mistake made in Power Query?
A. Click the red 'X' icon next to the corresponding step in the 'Applied Steps' pane
B. Close Windows
C. Reinstall Power BI
D. Press Delete key 10 times
**Answer:** A
**Explanation:** Clicking the 'X' removes the applied step, reverting the table state to the preceding step.
---

### 5. What button must you click in Power Query to apply transformations and return to the Power BI Desktop canvas?
A. Close & Apply
B. Save As
C. Export
D. Commit
**Answer:** A
**Explanation:** 'Close & Apply' executes the Power Query recipe, loads the cleaned data into the model, and returns to the canvas.
---
