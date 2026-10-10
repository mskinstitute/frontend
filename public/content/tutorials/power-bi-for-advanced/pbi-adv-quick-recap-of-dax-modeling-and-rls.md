# Advanced Power BI: Foundations & Enterprise Capabilities

Welcome to **Power BI for Advanced** (Level 3). At this tier, reporting shifts from desktop dashboards to **enterprise business intelligence architecture**. Advanced BI engineers design systems that handle tens of millions of rows, serve thousands of concurrent global users, enforce multi-tenant security, integrate with cloud data warehouses, and maintain automated DevOps deployment lifecycles.

---

## 1. The Maturity Model of Power BI Development

```
                    The Power BI Developer Progression
                                     |
   +---------------------------------+---------------------------------+
   |                                 |                                 |
Level 1: Beginner                 Level 2: Intermediate             Level 3: Advanced Architect
- Simple Imports & Excel          - Star Schema Modeling            - Enterprise Semantic Models
- Basic Visualizations            - Advanced DAX (CALCULATE, SUMX)  - Context Transition Mastery
- Elementary DAX (SUM, AVERAGE)   - Time Intelligence (YTD, SPLY)   - Dynamic RLS & Object-Level Security
- Basic Dashboards                - Static RLS & Bookmarks          - Incremental Refresh & Aggregations
                                  - Service Workspaces & Apps       - Tabular Editor & DAX Studio Tuning
                                                                    - Git / PBIP & CI/CD Pipelines
```

---

## 2. Core Pillars of Advanced Data Architecture

1. **Analytical Engine Mechanics:** Deep understanding of the VertiPaq formula engine (Single-threaded) vs storage engine (Multi-threaded xmSQL).
2. **Context Transition:** How row context transforms into filter context, and how to avoid catastrophic performance traps.
3. **Enterprise Governance & Security:** Granular access controls including **Dynamic RLS** using Entra ID and **Object-Level Security (OLS)** to hide sensitive columns from metadata.
4. **DevOps & Version Control:** Replacing binary `.pbix` files with source-controlled **Power BI Project (`.pbip`)** files integrated with Git repositories.

---

# Multiple Choice Questions

### 1. What role does a Senior / Lead Power BI Architect primarily play in an enterprise organization?
A. Designing basic pie charts in Microsoft Word
B. Architecting scalable, secure semantic models, governing workspace lifecycles, optimizing DAX query engines, and integrating cloud data warehouses
C. Repairing office network printers
D. Writing manual invoices in Excel
**Answer:** B
**Explanation:** Advanced BI engineering centers around scalability, data governance, performance tuning, and architectural integration rather than basic visualization design.

### 2. What are the two internal query processing engines that work together inside Microsoft Power BI?
A. The Storage Engine (VertiPaq / DirectQuery) and the Formula Engine
B. The Audio Engine and the Video Engine
C. Python Engine and HTML Engine
D. Windows Kernel and Browser Renderer
**Answer:** A
**Explanation:** VertiPaq is split into the Storage Engine (which handles multi-threaded raw data scans and compression) and the Formula Engine (which handles complex single-threaded DAX logic and context transitions).

### 3. What file format was introduced by Microsoft to enable professional Git version control, branch merging, and CI/CD for Power BI developers?
A. `.xlsx`
B. `.pbip` (Power BI Project format)
C. `.zip`
D. `.docx`
**Answer:** B
**Explanation:** The `.pbip` (Power BI Project) format stores reports and datasets as folders of human-readable JSON/TMDL code, allowing developers to track diffs, resolve conflicts, and commit to Git.

### 4. What is Object-Level Security (OLS) compared to Row-Level Security (RLS)?
A. OLS secures physical computer hardware
B. RLS restricts access to specific rows of data, whereas OLS hides entire tables or columns from unauthorized users, including from metadata queries
C. OLS is for desktop only
D. OLS only works on images
**Answer:** B
**Explanation:** While RLS filters row records, OLS completely conceals sensitive columns (e.g., Salary) or tables so that unauthorized users cannot even see that the field exists in the data model.

### 5. Why is the Formula Engine in Power BI generally slower than the Storage Engine for mass data scans?
A. The Formula Engine is single-threaded and executes complex procedural logic, whereas the Storage Engine is multi-threaded and reads compressed columnar data in cache
B. The Formula Engine runs outside the computer
C. The Formula Engine is an external web service
D. It only accepts DirectQuery
**Answer:** A
**Explanation:** The Storage Engine operates multi-threaded at hardware speed. When DAX forces queries back to the single-threaded Formula Engine, execution times can increase significantly.

---
