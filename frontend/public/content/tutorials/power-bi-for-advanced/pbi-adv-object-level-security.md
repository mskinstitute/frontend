# Object-Level Security (OLS): Hiding Sensitive Tables & Columns

While Row-Level Security (RLS) restricts which **rows** a user can see, **Object-Level Security (OLS)** secures data at the **schema metadata level**:
- It allows administrators to **completely hide entire tables or specific columns** (e.g., `EmployeeSalary`, `BankDetails`, `ProfitMargin`) from unauthorized users.
- If a user without OLS permission connects to the dataset via Excel, DAX Studio, or Power BI, the secured table/column **does not exist** in their field list!

---

## 1. RLS vs. Object-Level Security (OLS)

| Security Dimension | Row-Level Security (RLS) | Object-Level Security (OLS) |
| :--- | :--- | :--- |
| **Granularity** | Filters horizontal data **rows** (e.g., Country = "India"). | Secures vertical **columns** or entire **tables** (e.g., hide `Dim_Salaries`). |
| **Metadata Visibility** | Column names remain visible; rows are filtered. | Column/table metadata is completely invisible to unauthorized users. |
| **Authoring Tool** | Configurable directly in Power BI Desktop UI. | Requires external tooling: **Tabular Editor** via XMLA endpoint! |
| **Violation Behavior** | Visual shows filtered data. | Visual utilizing a secured column displays an error to unauthorized users! |

---

## 2. Implementing OLS Using Tabular Editor

Because Power BI Desktop does not have a native GUI button for OLS, developers use the free, open-source community standard: **Tabular Editor**:

```
[Power BI Desktop] ---> [External Tools Tab] ---> [Tabular Editor]
                                                          |
                                                          v
                                               Select Role: "Junior_Analyst"
                                                          |
                                                          v
                                               Select Column: Dim_Employee[BaseSalary]
                                                          |
                                                          v
                                               Set OLS: "None" (Hidden & Inaccessible)
                                                          |
                                                          v
                                               Save Model Back to Power BI Desktop!
```

### OLS Permission Levels in Tabular Editor:
1. **Default:** Inherits standard access permissions.
2. **Read:** User can query and view the table/column.
3. **None:** Table/column is completely inaccessible. It is hidden from field lists, and any visual referencing it will fail to render for that role.

---

## 3. Best Practice for OLS Visual Error Handling

> **CRITICAL ARCHITECTURAL DESIGN WARNING:** 
> If a user subject to an OLS restriction navigates to a report page containing a card visual bound to a secured column (e.g., `BaseSalary`), the visual will break with an error message: *"One or more fields cannot be found"*.
> - **Best Practice:** Isolate sensitive columns to dedicated restricted report pages, or use conditional formatting / dynamic DAX measures that gracefully return BLANK for unauthorized roles.

---

# Multiple Choice Questions

### 1. What is the fundamental difference between Row-Level Security (RLS) and Object-Level Security (OLS)?
A. RLS only works on numbers; OLS works on text
B. RLS filters data records horizontally by row, while OLS secures and completely conceals vertical columns or entire tables from metadata
C. OLS is only available on smartphones
D. RLS requires Tabular Editor, while OLS does not
**Answer:** B
**Explanation:** RLS secures data rows while keeping column structures visible. OLS completely hides entire columns or tables from unauthorized users so they do not even appear in field lists.

### 2. Which external tool integrated into the Power BI "External Tools" ribbon is standard for configuring Object-Level Security (OLS)?
A. Microsoft Word
B. Tabular Editor
C. Paint 3D
D. Windows PowerShell
**Answer:** B
**Explanation:** Tabular Editor connects to the underlying Analysis Services tabular model and provides the metadata editor to set table and column OLS permissions to "None".

### 3. What happens if an unauthorized user attempts to view a visual that references a column protected by Object-Level Security?
A. The visual displays the data in red
B. The visual fails to render and displays a calculation/field not found error
C. The user's computer shuts down
D. The data is translated into Spanish
**Answer:** B
**Explanation:** Because the secured column does not exist from the perspective of that user's security role, the visual throws an error stating that the field cannot be found.

### 4. What OLS permission setting in Tabular Editor completely blocks a role from accessing a table or column?
A. Read
B. None
C. Default
D. Admin
**Answer:** B
**Explanation:** Setting the object permission to "None" revokes all metadata discovery and query permissions for members of that role.

### 5. If a business analyst connects Microsoft Excel to a Power BI dataset via "Analyze in Excel", what does OLS enforce?
A. It corrupts the Excel installation
B. The protected columns and tables will not appear anywhere in the Excel PivotTable field list
C. It allows full access
D. Excel requires a special password
**Answer:** B
**Explanation:** OLS is enforced at the tabular database engine level. External client connections like Excel or DAX Studio honor OLS, concealing the secured fields from the field list.

---
