# Reading Excel Spreadsheets & Multiple Sheets

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. Reading Excel Files into Pandas
Microsoft Excel (`.xlsx`, `.xls`) is the enterprise standard for business reporting. Pandas leverages the `openpyxl` (for `.xlsx`) and `xlrd` (for legacy `.xls`) libraries behind the scenes to parse complex workbooks.

```bash
# Ensure required engine is installed
pip install openpyxl
```

---

## 2. Basic Excel Reading
```python
import pandas as pd

# Load the first sheet of an Excel file
df = pd.read_excel('Q3_Financial_Model.xlsx')
print(df.head())
```

---

## 3. Reading Specific Sheets & Multiple Worksheets

### A. Load by Sheet Name or Index
```python
# By sheet name
df_sales = pd.read_excel('Company_Data.xlsx', sheet_name='Sales_North')

# By zero-indexed position (e.g., 2nd sheet)
df_expenses = pd.read_excel('Company_Data.xlsx', sheet_name=1)
```

### B. Load ALL Sheets Simultaneously
Passing `sheet_name=None` returns an ordered dictionary where the keys are sheet names and values are the corresponding DataFrames:

```python
all_sheets = pd.read_excel('Company_Data.xlsx', sheet_name=None)

# Inspect available sheets
print("Found sheets:", list(all_sheets.keys()))

# Access individual sheet DataFrame
df_hr = all_sheets['HR_Headcount']
print(df_hr.shape)
```

---

## 4. Advanced Ingestion: Skipping Metadata Rows
Many corporate Excel templates contain company logos, title banners, or blank rows at the top before the actual table header begins:

```python
df_clean = pd.read_excel(
    'Monthly_Report.xlsx',
    sheet_name='Summary',
    skiprows=4,       # Skip first 4 rows containing company banner & blank space
    usecols="B:G",    # Excel column range syntax (columns B through G)
    nrows=50          # Read only the first 50 data rows
)
```

---

## 5. Writing to Multi-Sheet Excel Workbooks (`ExcelWriter`)
To export multiple DataFrames into different tabs of a single Excel file, use `pd.ExcelWriter`:

```python
with pd.ExcelWriter('Final_Audit_Report.xlsx', engine='openpyxl') as writer:
    df_sales.to_excel(writer, sheet_name='Sales_Summary', index=False)
    df_expenses.to_excel(writer, sheet_name='Expense_Breakdown', index=False)

print("Workbook with multiple sheets saved successfully!")
```

---

# Multiple Choice Questions

### 1. Which Python library is required by Pandas to read and write modern `.xlsx` Excel files?
A. `xlwt`
B. `openpyxl`
C. `xlsx-reader`
D. `pyexcel`
**Answer:** B
**Explanation:** `openpyxl` is the standard underlying engine used by Pandas for `.xlsx` files.
---

### 2. What does `pd.read_excel('report.xlsx', sheet_name=None)` return?
A. None (an empty object)
B. Only the last sheet in the workbook
C. A Python dictionary where keys are sheet names and values are DataFrames
D. An error because sheet_name cannot be None
**Answer:** C
**Explanation:** When `sheet_name=None`, Pandas reads all worksheets in the workbook and returns them packed inside a dictionary of DataFrames.
---

### 3. How do you skip the first 3 non-data banner rows when loading an Excel sheet in Pandas?
A. `offset=3`
B. `skiprows=3`
C. `drop_header=3`
D. `ignore_rows=[1,2,3]`
**Answer:** B
**Explanation:** The `skiprows=3` parameter skips the specified number of rows at the top of the sheet before reading the header.
---

### 4. Which class should you use to write multiple DataFrames to different worksheets within a single Excel file?
A. `pd.ExcelWriter`
B. `pd.MultiSheetExport`
C. `pd.WorkbookBuilder`
D. `pd.SheetConsolidator`
**Answer:** A
**Explanation:** `pd.ExcelWriter` creates an Excel workbook context manager that allows calling `.to_excel(writer, sheet_name=...)` multiple times.
---

### 5. In `pd.read_excel()`, what does `usecols="B:F"` specify?
A. Columns named 'B' and 'F' only
B. All columns from Excel column letter B through column F inclusive
C. Rows indexed between B and F
D. Formulas spanning cells B to F
**Answer:** B
**Explanation:** Pandas supports Excel-style column range notation like `"B:F"` to load only the designated range of columns.
---
