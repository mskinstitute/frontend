# Capstone Implementation: Advanced DAX, Security & Azure Integration

In this module, you implement the technical core of the capstone: authoring the advanced DAX measure library, enforcing Dynamic RLS, and connecting the model to Azure cloud services.

---

## 1. Technical Implementation Checklist

- [x] Connect to **`retail_store_database.sql`** (or Azure SQL Database).
- [x] Validate Query Folding across all Power Query transformations.
- [x] Configure Star Schema relationships in Model View.
- [x] Author the Core Advanced DAX Library:
  - Context Transition measures
  - Time Intelligence comparisons (YoY Growth, T12M)
  - Iterators (`SUMX` for net revenue)
  - Dynamic FX conversion
- [x] Implement Dynamic Row-Level Security:
  - `Security_UserMapping` table with `USERPRINCIPALNAME()`
  - Executive override logic
- [x] Connect Tabular Editor to configure Object-Level Security (OLS) on sensitive salary/margin columns.

---

## 2. The Universal Capstone DAX Library

```dax
-- 1. Net Sales with Context Transition Safety
Total Net Sales = 
SUMX(
    Fact_SalesOrders,
    Fact_SalesOrders[Quantity] * Fact_SalesOrders[UnitPrice] * (1 - Fact_SalesOrders[DiscountRate])
)

-- 2. Prior Year Benchmark & YoY Growth
Sales Prior Year = 
CALCULATE(
    [Total Net Sales],
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

Sales YoY Growth % = 
DIVIDE(
    [Total Net Sales] - [Sales Prior Year],
    [Sales Prior Year],
    0
)

-- 3. Dynamic RLS Security Filter on Dim_Security
-- Applied in Manage Roles -> Dynamic_Security role:
VAR UserEmail = USERPRINCIPALNAME()
VAR IsGlobalAdmin = 
    CALCULATE(
        COUNTROWS(Security_Admins),
        Security_Admins[Email] == UserEmail
    ) > 0
RETURN
IF(
    IsGlobalAdmin,
    TRUE(),
    Security_UserMapping[UserEmail] == UserEmail
)
```

---

# Multiple Choice Questions

### 1. In the dynamic security rule above, what is the purpose of the `IsGlobalAdmin` check?
A. It deletes non-admin users
B. It evaluates whether the current viewer is a corporate executive, granting unrestricted visibility (`TRUE()`) across all records
C. It locks the dataset
D. It prints the report
**Answer:** B
**Explanation:** Incorporating an admin check allows designated executives to bypass row-level filtering without requiring separate report files.

### 2. Why must measures like `[Total Net Sales]` be referenced when calculating Year-over-Year variance rather than rewriting the raw `SUM` formula?
A. DAX prohibits writing formulas twice
B. Measure branching (reusing existing measures) promotes code reusability, simplifies maintenance, and guarantees consistent calculations across all derived KPIs
C. It reduces font size
D. It is required by Windows
**Answer:** B
**Explanation:** Measure branching (building complex metrics on top of core base measures) ensures that any future adjustment to revenue calculation automatically cascades to all downstream KPIs.

### 3. What tool connects via the XMLA endpoint to verify that Object-Level Security (OLS) is properly applied to the capstone dataset?
A. Tabular Editor
B. Microsoft Paint
C. Command Prompt
D. Windows Media Player
**Answer:** A
**Explanation:** Tabular Editor allows developers to inspect, author, and validate OLS rules directly against the Analysis Services tabular metadata.

### 4. What protocol ensures that queries sent to Azure SQL Database execute with maximum performance?
A. Query Folding
B. Bluetooth
C. Manual copy-paste
D. CSV export
**Answer:** A
**Explanation:** Query folding ensures transformations are executed as optimized SQL statements on the Azure SQL database server.

### 5. Why is `DIVIDE(..., ..., 0)` strictly enforced across all capstone financial measures?
A. It prevents division-by-zero runtime exceptions, returning a clean zero or blank instead of visual error banners
B. It converts numbers to Roman numerals
C. It speeds up the internet
D. It encrypts the formulas
**Answer:** A
**Explanation:** In enterprise reporting, unhandled calculation errors destroy user confidence. `DIVIDE` guarantees graceful error handling across all visual states.

---
