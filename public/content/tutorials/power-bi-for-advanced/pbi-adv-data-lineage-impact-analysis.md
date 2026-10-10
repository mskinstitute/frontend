# Data Lineage & Impact Analysis: Managing Dependencies

In large corporate environments, a single central semantic model may power **50 different downstream reports, 20 dashboards, and multiple automated Power Automate workflows**. 

If a database administrator alters a column name or changes an ETL filter, how do you know which reports will break? The answer is **Data Lineage & Impact Analysis**.

---

## 1. Navigating Lineage View in the Power BI Service

In any workspace in the Power BI Service, click the **Lineage view** icon in the top-right toolbar:

```
[Data Source: Azure SQL] ---> [Dataflow: "Clean Customers"] ---> [Dataset: "Enterprise Sales"]
                                                                        |
                                         +------------------------------+------------------------------+
                                         |                                                             |
                               [Report: Executive Sales]                                     [Report: Regional Profit]
                                         |                                                             |
                               [Dashboard: CEO Summary]                                      [Shared App: Sales Team]
```

---

## 2. Executing Automated Impact Analysis

When you plan to modify or delete a dataset:
1. In Lineage View, select the dataset card.
2. Click **Notify contacts** to send automated email warnings to all report owners before making breaking changes.
3. View the **Impact Analysis** side pane:
   - Total downstream workspaces affected.
   - Total downstream reports and dashboards.
   - Total active monthly viewers who will be impacted!

---

# Multiple Choice Questions

### 1. What does the Lineage View in the Power BI Service visualize?
A. The physical location of office desks
B. The end-to-end dependency chain from underlying data sources to dataflows, datasets, reports, and dashboards
C. The employee hierarchy chart
D. Font styling options
**Answer:** B
**Explanation:** Lineage View renders an interactive graph showing how data flows from source systems through dataflows and datasets into consumer-facing reports and dashboards.

### 2. What tool in Lineage View informs developers how many downstream reports, dashboards, and active users will be affected if a dataset is modified or deleted?
A. Performance Analyzer
B. Impact Analysis
C. Q&A Setup
D. Sync Slicers
**Answer:** B
**Explanation:** Impact Analysis calculates the exact downstream blast radius of a proposed change, showing affected workspaces, reports, and viewer counts.

### 3. Can a dataset in Workspace A power reports located in Workspace B?
A. No, cross-workspace connections are prohibited
B. Yes; cross-workspace dataset sharing allows certified central datasets to serve multiple departmental workspaces securely
C. Only if both workspaces are deleted
D. Only with a free license
**Answer:** B
**Explanation:** Cross-workspace dataset sharing enables decentralized reporting on top of centralized, governed data models.

### 4. What feature in Impact Analysis allows developers to message all report creators dependent on a shared dataset?
A. Slack bot
B. "Notify contacts" email broadcast
C. Print memo
D. Telephone call
**Answer:** B
**Explanation:** The "Notify contacts" button sends an automated email notification to all registered owners of downstream reports, alerting them to planned maintenance or schema modifications.

### 5. Why is establishing clear data lineage a mandatory requirement in regulated industries (Banking, Healthcare)?
A. To reduce screen brightness
B. For regulatory auditability: organizations must prove where their financial numbers originated, how they were transformed, and who accessed them
C. It allows free licenses
D. It replaces SQL databases
**Answer:** B
**Explanation:** Regulatory standards demand transparent data provenance to guarantee that reported figures can be traced back to immutable, verified source records.

---
