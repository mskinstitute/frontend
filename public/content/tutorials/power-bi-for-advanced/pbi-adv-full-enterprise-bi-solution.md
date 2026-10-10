# Capstone Architecture: The Enterprise BI End-to-End Solution

In this final capstone sequence, you step into the role of **Chief Enterprise BI Architect**. You will synthesize every concept mastered across Level 1, Level 2, and Level 3 into a mission-critical, enterprise-grade business intelligence platform.

---

## 1. Master Enterprise Architecture Blueprint

```
[ERP / CRM / Cloud SQL] ---> [Azure Data Lake Storage (OneLake)]
                                         |
                                         v
                     [ETL & Transformation: Power BI Dataflows]
                                         |
                                         v
               [THE HUB: Master Certified Semantic Model (.pbip)]
               - Star Schema with 1-to-Many Relationships
               - Dynamic Row-Level Security (USERPRINCIPALNAME)
               - Object-Level Security (Tabular Editor)
               - Optimized DAX Measures (TMDL / Git Versioned)
               - Incremental Refresh (10-Year History)
                                         |
                                         v (XMLA / Live Connection)
               +-------------------------+-------------------------+
               |                                                   |
    [Thin Interactive Report Suite]                       [Paginated Operational Suite]
    - Executive Dashboard                                 - Customer Invoices (RDL)
    - Sales & Margin Deep-Dive                            - Statutory Financial Statements
    - Supply Chain Operations                             - Pixel-Perfect Regulatory PDFs
               |                                                   |
               +-------------------------+-------------------------+
                                         |
                                         v
                     [Deployment Pipeline: Dev -> Test -> Prod]
                                         |
                                         v
                [Power BI App Distributed to 10,000 Consumers!]
```

---

# Multiple Choice Questions

### 1. In a multi-tier enterprise BI solution, where should business ETL data transformations be centralized to prevent code duplication?
A. Inside individual card visuals
B. Inside Power BI Dataflows or cloud lakehouse pipelines
C. In Microsoft Word
D. In the user's browser cache
**Answer:** B
**Explanation:** Centralizing ETL in Dataflows or lakehouse pipelines processes and standardizes data once, allowing all downstream models to consume certified tables.

### 2. What role does the "Master Certified Semantic Model" play in enterprise BI architecture?
A. It acts as the single source of verified analytical truth, defining core business calculations and enforcing database security across the entire enterprise
B. It acts as an email server
C. It generates PowerPoint slides
D. It stores office passwords
**Answer:** A
**Explanation:** The master semantic model centralizes data relationships, security, and DAX calculations, preventing metric discrepancy across departmental reports.

### 3. How do "Thin Reports" connect to the central Master Semantic Model?
A. Via USB cable
B. Via high-speed Live Connection (or DirectQuery over Power BI datasets)
C. By copying the data into memory
D. Through email attachments
**Answer:** B
**Explanation:** Thin reports establish a live connection to the cloud dataset, rendering visuals without caching local data.

### 4. Which file format and version control system enables multi-developer team collaboration on the master semantic model?
A. `.pbip` (Power BI Project) format tracked via Git / Azure DevOps
B. `.zip` file on a shared drive
C. Printed paper binders
D. Excel files
**Answer:** A
**Explanation:** `.pbip` stores models as modular TMDL code, allowing engineering teams to branch, merge, and review code via Git.

### 5. What delivery vehicle packages the entire suite of reports and dashboards into a single governed portal for business users?
A. A Power BI App with customized audience permissions
B. An email containing 50 links
C. A public website
D. A hard drive
**Answer:** A
**Explanation:** Power BI Apps provide a unified, secure portal with structured navigation and audience-targeted access controls.

---
