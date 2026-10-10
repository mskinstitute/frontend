# What is Row-Level Security (RLS)? Architecture & Concepts

In enterprise analytics, different users require different slices of the same data. For example:
- The **North Region Sales Manager** should only see sales data for the North region.
- The **South Region Sales Manager** should only see data for the South region.
- The **Chief Executive Officer (CEO)** should see all global data.

Without security, an organization would be forced to create, publish, and maintain separate `.pbix` files for every single manager—an unmaintainable operational nightmare!

---

## 1. The Principle of Row-Level Security (RLS)

**Row-Level Security (RLS)** restricts data access for given users at the data row level. Filters are applied at the database engine level, ensuring that users cannot bypass security through custom visuals, export to Excel, or Q&A queries.

```
                               Single Gold Master Dataset
                                            |
                         +------------------+------------------+
                         |                                     |
           [Role: North_Manager]                     [Role: South_Manager]
           Filter: Region = "North"                  Filter: Region = "South"
                         |                                     |
                         v                                     v
                 North Regional Sales                  South Regional Sales
                     Visual View                           Visual View
```

---

## 2. Static RLS vs. Dynamic RLS

| Feature | Static RLS (Intermediate Level) | Dynamic RLS (Advanced Level) |
| :--- | :--- | :--- |
| **Configuration** | Explicit DAX filter rules hardcoded for each role (e.g., `Region = "North"`). | A single dynamic rule using `USERPRINCIPALNAME()`. |
| **Scalability** | Best for small teams with few static divisions (e.g., 4 geographical regions). | Scalable to thousands of employees across complex organizational hierarchies. |
| **Maintenance** | Requires creating new roles whenever a new region or department is added. | Zero maintenance; uses an employee security mapping table. |

---

## 3. How RLS Propagates Through Data Models

RLS filters defined on a Dimension table automatically **propagate to downstream Fact tables** along the standard 1-to-Many relationships:

```
[Dim_Geography]
DAX Filter: [Region] = "North"
       |
       |  (1-to-Many Relationship Filters Downward)
       v
[Fact_Sales]
Only sales records matching "North" geography are visible to the user!
```

> **Security Alert:** By default, RLS filters flow strictly in the direction of the relationship arrows. Ensure your Star Schema relationships point towards the fact tables so that dimension restrictions protect transactional rows!

---

# Multiple Choice Questions

### 1. What is the primary business objective of implementing Row-Level Security (RLS) in Power BI?
A. To encrypt the hard drive of the user's laptop
B. To restrict data row access for specific users within a single shared dataset and report
C. To prevent users from viewing the report outside of working hours
D. To speed up data refresh times
**Answer:** B
**Explanation:** RLS ensures that different users accessing the exact same report only see the specific rows of data they are authorized to view, eliminating the need to maintain duplicate report files.

---

### 2. Where are Row-Level Security roles initially defined and configured?
A. In the Power BI Mobile app
B. In Power BI Desktop under the "Modeling" tab using the "Manage Roles" dialog
C. In Microsoft Excel via Power Pivot
D. In the Windows Control Panel
**Answer:** B
**Explanation:** RLS roles and their corresponding DAX filter rules are created in Power BI Desktop using the **Manage Roles** interface on the Modeling ribbon tab.

---

### 3. What happens if a user who is restricted by RLS exports report data to a CSV or Excel file?
A. The export feature is completely disabled
B. The exported file contains only the restricted subset of rows the user is permitted to see
C. The exported file reveals all un-filtered corporate data
D. Power BI sends an alert to the administrator
**Answer:** B
**Explanation:** RLS is enforced at the VertiPaq data engine level. Any export to Excel or CSV honors the active user's RLS constraints, preventing unauthorized data exposure.

---

### 4. If an RLS rule is defined on `Dim_Department[DepartmentName] = "Finance"`, how does this filter restrict rows in `Fact_Payroll`?
A. It requires manual SQL updates in the database
B. It automatically flows downward through the active One-to-Many relationship from `Dim_Department` to `Fact_Payroll`
C. It requires creating a duplicate payroll table
D. It only works if both tables are merged into one flat table
**Answer:** B
**Explanation:** RLS filters follow normal model relationships. A filter placed on the 1-side dimension table naturally cascades down to filter the many-side fact table.

---

### 5. In which scenario is Static RLS most appropriate?
A. When an organization has 10,000 employees changing branches weekly
B. When an organization has a small, stable set of divisions (such as 3 fixed regional territories)
C. When security rules are based on real-time GPS location
D. When no users require security restrictions
**Answer:** B
**Explanation:** Static RLS works well for small, fixed groupings (like East, West, North, South) where creating and assigning a few predefined roles is manageable.

---
