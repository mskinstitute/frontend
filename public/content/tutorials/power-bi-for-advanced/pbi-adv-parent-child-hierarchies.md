# Parent-Child Hierarchies in DAX: PATH, PATHITEM & Organizational Trees

In organizational management, employee reporting structures, and general ledger chart of accounts, data is frequently organized in **Parent-Child Hierarchies**:
- An employee reports to a Manager.
- That Manager reports to a Director.
- The Director reports to a Vice President.
- The Vice President reports to the CEO.

Unlike fixed-depth product hierarchies (Category $\to$ SubCategory $\to$ Product), parent-child hierarchies have **uneven and variable depth** (one branch may have 3 levels, while another has 7 levels).

---

## 1. The DAX PATH Functions

DAX provides specialized functions to unravel recursive parent-child structures into linear, navigable dimensions:

| Function | Purpose | Syntax |
| :--- | :--- | :--- |
| **`PATH`** | Generates a delimited text string tracing the lineage from top root to current node. | `PATH(IDColumn, ParentIDColumn)` |
| **`PATHLENGTH`** | Returns the depth (level count) of the current node in the hierarchy tree. | `PATHLENGTH(PathColumn)` |
| **`PATHITEM`** | Extracts the specific ancestor ID at a designated level of the path. | `PATHITEM(PathColumn, Position, [Type])` |
| **`PATHCONTAINS`** | Checks whether a specific ancestor ID exists anywhere within the path (ideal for security!). | `PATHCONTAINS(PathColumn, ManagerID)` |

---

## 2. Step-by-Step Parent-Child Flattening

Consider `Dim_Employee` with `EmployeeID` and `ManagerID`:

```
EmployeeID | EmployeeName  | ManagerID
---------------------------------------
1          | Satya (CEO)   | BLANK
2          | Scott (EVP)   | 1
3          | Julia (CVP)   | 2
4          | Aarav (Eng)   | 3
```

### Step 1: Create the Hierarchy Path Column
```dax
EmployeePath = PATH(Dim_Employee[EmployeeID], Dim_Employee[ManagerID])
-- Result for Aarav: "1|2|3|4"
```

### Step 2: Extract Leveled Hierarchy Columns
```dax
Level_1_Executive = 
LOOKUPVALUE(
    Dim_Employee[EmployeeName],
    Dim_Employee[EmployeeID],
    PATHITEM(Dim_Employee[EmployeePath], 1, INTEGER)
)

Level_2_VP = 
LOOKUPVALUE(
    Dim_Employee[EmployeeName],
    Dim_Employee[EmployeeID],
    PATHITEM(Dim_Employee[EmployeePath], 2, INTEGER)
)

Level_3_Director = 
LOOKUPVALUE(
    Dim_Employee[EmployeeName],
    Dim_Employee[EmployeeID],
    PATHITEM(Dim_Employee[EmployeePath], 3, INTEGER)
)
```

Now you can drag `Level_1_Executive`, `Level_2_VP`, and `Level_3_Director` into a standard Matrix visual to render a clean, drillable organizational tree!

---

# Multiple Choice Questions

### 1. What DAX function converts a recursive Parent-Child relationship (e.g., EmployeeID and ManagerID) into a delimited string tracing the full lineage path?
A. `HIERARCHY()`
B. `PATH(IDColumn, ParentIDColumn)`
C. `PARENT()`
D. `STRING_CONCAT()`
**Answer:** B
**Explanation:** `PATH` traverses the parent-child relationships recursively and outputs a pipe-delimited string of ancestor IDs from root to current item (e.g., `"1|5|12|45"`).

### 2. What delimiter does the DAX `PATH` function use internally to separate ancestor IDs?
A. Comma (`,`)
B. Pipe character (`|`)
C. Forward slash (`/`)
D. Semicolon (`;`)
**Answer:** B
**Explanation:** The `PATH` function automatically formats lineages using the vertical bar / pipe delimiter (`|`), which is recognized by all other DAX path functions.

### 3. How do you determine the depth level of an employee in an organizational hierarchy tree?
A. `COUNTROWS(Dim_Employee)`
B. `PATHLENGTH(Dim_Employee[EmployeePath])`
C. `MAX(Dim_Employee[Salary])`
D. `LEN(Dim_Employee[Name])`
**Answer:** B
**Explanation:** `PATHLENGTH` counts the number of elements in a path string, directly indicating the depth of that node in the organizational tree.

### 4. Which function checks whether a specific manager exists anywhere in an employee's management chain for organizational Row-Level Security?
A. `SEARCH()`
B. `PATHCONTAINS(Dim_Employee[EmployeePath], ManagerID)`
C. `FIND()`
D. `EXISTS()`
**Answer:** B
**Explanation:** `PATHCONTAINS` returns TRUE if the specified identifier is found anywhere in the path string, making it the premier pattern for manager-level hierarchy security.

### 5. Why is flattening parent-child hierarchies into discrete columns (`Level 1`, `Level 2`, `Level 3`) necessary for Power BI visuals?
A. Power BI cannot display text without flattening
B. Standard visuals (Matrix, Treemap) require discrete, structured columns to generate interactive drill-down hierarchy levels
C. It disables direct relationships
D. It reduces the need for DAX
**Answer:** B
**Explanation:** Standard Power BI visuals require tabular dimension columns to form drill-down levels in the visual wells. Flattening parent-child paths supplies these discrete levels.

---
