# SSRS Migration & Power BI Report Builder Integration

For over 20 years, **SQL Server Reporting Services (SSRS)** served as the global backbone for enterprise operational reporting. Today, Fortune 500 enterprises are consolidating their on-premises SSRS infrastructure into the cloud via **Power BI Paginated Reports**.

---

## 1. The Migration Pathway: On-Premises SSRS to Power BI Cloud

Migrating from legacy SSRS to Power BI Service provides immense cost and operational benefits:
- Eliminates expensive on-premises SQL Server licensing and dedicated server hardware.
- Unifies interactive dashboards (`.pbix`) and operational reports (`.rdl`) inside a single cloud portal (`app.powerbi.com`).
- Enables modern cloud delivery: automated email subscriptions, SharePoint embeds, and Power Automate PDF generation.

```
                      SSRS Modernization Architecture
                                     |
    [Legacy On-Premises SSRS (.rdl)]  =====>  [Power BI Report Builder]
                                                       |
                                                       v (Cloud Migration)
                                            [Power BI Service Workspace]
                                                       |
                               +-----------------------+-----------------------+
                               |                                               |
                     [Web Portal Viewing]                            [Automated Power Automate]
                     Export to PDF, Excel, Word                      Burst invoices to 1,000 clients
```

---

## 2. Authoring in Power BI Report Builder

1. Download and launch **Power BI Report Builder**.
2. **Data Source:** Connect to an on-premises SQL Server (via Gateway), an Azure SQL Database, or an existing **Power BI Semantic Model**.
3. **Dataset:** Author a query using native SQL, MDX, or DAX.
4. **Insert Tablix:** Add a Table, Matrix, or List.
5. **Expressions:** Use Visual Basic (`VB.NET`) expressions for dynamic logic:
   ```vb
   =IIF(Fields!Sales.Value > 100000, "Green", "Red")
   ```
6. Save and publish directly to the Power BI Service workspace!

---

# Multiple Choice Questions

### 1. What legacy on-premises Microsoft reporting technology is directly modernized by Power BI Paginated Reports?
A. Microsoft Access
B. SQL Server Reporting Services (SSRS)
C. Windows Media Center
D. Microsoft FrontPage
**Answer:** B
**Explanation:** Power BI Paginated Reports represent the modern cloud evolution of SSRS, running the exact same `.rdl` engine natively inside the Power BI cloud.

### 2. Can existing on-premises SSRS `.rdl` files be uploaded directly to the Power BI Service?
A. No; every report must be rebuilt from scratch
B. Yes; standard `.rdl` files can be published directly to a Power BI workspace without rewriting report definitions
C. Only if all tables are deleted
D. Only on Windows 7
**Answer:** B
**Explanation:** Because Power BI paginated reports use the identical RDL standard, existing SSRS `.rdl` files can be uploaded directly to compatible Power BI workspaces.

### 3. What programming expression language is used inside Power BI Report Builder for calculated fields and formatting?
A. Python
B. Visual Basic (.NET) expressions (e.g., `=IIF(...)`, `=Fields!Name.Value`)
C. PHP
D. Rust
**Answer:** B
**Explanation:** Report Builder utilizes standard .NET Visual Basic expressions for conditional formatting, string concatenation, and mathematical operations.

### 4. What is a "Tablix" in Power BI Report Builder?
A. A tablet computer
B. The unified data visual container that can behave as a Table (fixed columns), a Matrix (dynamic pivoting columns), or a List (freeform repeat)
C. A database table
D. A custom theme
**Answer:** B
**Explanation:** "Tablix" (Table + Matrix) is the core visual engine in Report Builder, providing the foundation for lists, tables, and crosstab matrices.

### 5. What automation tool can be paired with Power BI Paginated Reports to automatically burst thousands of personalized PDF invoices to customer emails every month?
A. Windows Calculator
B. Power Automate (using the "Export to File for Paginated Reports" action)
C. Microsoft Paint
D. Command Prompt
**Answer:** B
**Explanation:** Power Automate features native connectors to run paginated reports with dynamic parameters, export them to PDF, and email them automatically to clients.

---
