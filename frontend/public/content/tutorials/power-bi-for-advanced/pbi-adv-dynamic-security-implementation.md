# End-to-End Dynamic Security Architecture

In modern global enterprises, maintaining static RLS roles (e.g., creating 50 separate roles for 50 country managers) is an administrative failure. Whenever a country manager resigns or moves to another territory, a BI developer would have to manually edit the `.pbix` file and republish it.

The enterprise standard is **Dynamic Row-Level Security driven by a Security Bridge Table**.

---

## 1. Dynamic RLS Architecture Overview

Dynamic RLS uses a data-driven approach where user permissions are stored inside an internal relational database table:

```
[Transactional Fact Table]
OrderID | RegionKey | SalesAmount
     ^
     | (Relationship: 1-to-Many)
[Dim_Region]
RegionKey | RegionName
     ^
     | (Relationship: 1-to-Many Single or Bi-directional)
[Security_UserRegionMapping]
Email                      | RegionKey
aarav.sharma@company.com   | 1 (North)
aarav.sharma@company.com   | 2 (East)   <--- Multiple rows grant access to multiple regions!
pooja.verma@company.com    | 3 (South)
```

---

## 2. The Single Universal DAX Security Filter

With this architecture in place, you configure **EXACTLY ONE ROLE** in the entire model (e.g., `Dynamic_User_Security`).

### The Filter Formula on `Security_UserRegionMapping`:
```dax
[Email] = USERPRINCIPALNAME()
```

### How the Filter Propagates:
1. When Aarav logs into the Power BI Service, `USERPRINCIPALNAME()` returns `aarav.sharma@company.com`.
2. The `Security_UserRegionMapping` table is filtered to only his rows (`RegionKey = 1` and `RegionKey = 2`).
3. This filter naturally propagates through the relationship into `Dim_Region` and downstream into `Fact_Sales`!
4. Aarav sees both North and East data automatically!

---

## 3. Handling Superusers (CEO / Executive Override)

Executives need to see **ALL** data across all regions. We can build an override into the dynamic DAX filter:

```dax
-- Dynamic RLS with Executive Exemption:
VAR CurrentUser = USERPRINCIPALNAME()
VAR IsExecutive = 
    CALCULATE(
        COUNTROWS(Security_ExecExemptions),
        Security_ExecExemptions[Email] = CurrentUser
    ) > 0
RETURN
IF(
    IsExecutive,
    TRUE(),  -- Bypass all filters: sees 100% of global data!
    [Email] = CurrentUser
)
```

---

# Multiple Choice Questions

### 1. What is the chief operational advantage of data-driven Dynamic RLS over Static RLS?
A. It speeds up screen refreshing
B. User permissions are maintained in a database table; adding new employees or changing territories updates security automatically without modifying or republishing the `.pbix` report
C. It eliminates the need for internet access
D. It bypasses Power BI licensing
**Answer:** B
**Explanation:** Dynamic RLS reads permissions dynamically from a mapping table. Data engineers can add, remove, or modify user assignments in the source database without touching the report model.

### 2. What DAX function is the cornerstone of Dynamic RLS in the cloud Power BI Service?
A. `GET_USER()`
B. `USERPRINCIPALNAME()`
C. `NOW()`
D. `RANDOM()`
**Answer:** B
**Explanation:** `USERPRINCIPALNAME()` returns the authenticated corporate email address of the current active viewer, enabling personalized security filtering.

### 3. How can a single user be granted access to three different sales regions using a Dynamic RLS mapping table?
A. By creating three separate Power BI accounts
B. By inserting three rows for that user's email address in the security mapping table, each containing a different RegionKey
C. By sharing three passwords
D. It is impossible in Power BI
**Answer:** B
**Explanation:** A mapping table supports One-to-Many relationships. Having multiple rows with the same user email paired with different dimension keys grants access to all corresponding territories.

### 4. How can executive leadership (such as the CEO or Chief Risk Officer) be granted unrestricted global data visibility within a dynamic RLS model?
A. By making the CEO a Viewer
B. By including an executive exemption check in the DAX rule (e.g., checking if the user exists in an executive list and returning `TRUE()`)
C. By turning off RLS for the entire company
D. By sending the CEO a spreadsheet
**Answer:** B
**Explanation:** Adding an `IF(IsExecutive, TRUE(), ...)` condition allows authorized executives to bypass row filtering and view all enterprise data within the same shared report.

### 5. What relationship cross-filter setting is often required between a Security Mapping table and a Dimension table to ensure filters propagate correctly?
A. Relationship must be deleted
B. Cross-filter direction must be configured so that filters on the mapping table flow into the dimension and fact tables
C. Both tables must be merged in Excel
D. DirectQuery must be disabled
**Answer:** B
**Explanation:** Filter propagation must flow from the security mapping table through the dimension table and into the transactional fact table to ensure complete data protection.

---
