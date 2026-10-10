# Cleaning and Transforming Data

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Common Data Cleaning Tasks in Power Query

### 1. Use First Row as Headers
Raw CSV and Excel files often import with generic column headers (`Column1`, `Column2`) while the actual headers sit in row 1.
- Click **"Use First Row as Headers"** on the Home ribbon.

### 2. Changing Data Types
Always enforce correct datatypes (e.g. Dates to `Date`, Revenue to `Fixed decimal number`, IDs to `Text`).
- *Pro Tip:* Always store numerical identifiers (like Zip Codes, Phone Numbers, or Student IDs) as **Text**, so Power BI does not attempt to sum them up!

### 3. Unpivoting Columns (Wide to Long)
If months are spread across columns (`Jan`, `Feb`, `Mar`), select the attribute columns and click **Transform $	o$ Unpivot Columns**.

---

# Multiple Choice Questions

### 1. Why should telephone numbers and pincodes be formatted as Text rather than Whole Numbers in Power Query?
A. To prevent Power BI from automatically aggregating (summing or averaging) them on charts
B. Because numbers use too much RAM
C. Because phones have letters
D. Power BI cannot load numeric phone numbers
**Answer:** A
**Explanation:** Numeric columns are treated as quantitative measures by default; setting them as Text signals that they are categorical dimensions.
---

### 2. What transformation turns a wide Excel sheet with months spread across columns into a normalized 2-column tabular format (Attribute and Value)?
A. Unpivot Columns
B. Transpose
C. Group By
D. Pivot Column
**Answer:** A
**Explanation:** Unpivoting rotates horizontal column headers into vertical row records, essential for building dynamic time slicers.
---

### 3. What does 'Remove Duplicates' do when applied to a selected column in Power Query?
A. Retains only the first occurrence of each distinct value in that column and deletes subsequent duplicate rows
B. Deletes all data
C. Replaces duplicates with zero
D. Highlights duplicates in yellow
**Answer:** A
**Explanation:** 'Remove Duplicates' keeps unique records based on the selected column(s).
---

### 4. Which feature creates a new column based on IF-THEN-ELSE business conditions through an intuitive GUI dialog?
A. Conditional Column
B. Custom Column
C. Index Column
D. Column From Examples
**Answer:** A
**Explanation:** The 'Conditional Column' wizard allows users to build nested IF-ELSE logic visually without writing raw code.
---

### 5. What does the 'Column From Examples' feature do in Power Query?
A. It deduces the transformation logic automatically based on a few sample output values provided by the user
B. Downloads examples from the internet
C. Creates fake dummy data
D. Tests database performance
**Answer:** A
**Explanation:** 'Column From Examples' leverages AI synthesis: you provide sample desired outputs, and Power Query generates the M code.
---
