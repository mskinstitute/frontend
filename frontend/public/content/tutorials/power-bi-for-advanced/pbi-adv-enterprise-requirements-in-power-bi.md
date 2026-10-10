# Enterprise Architecture & Governance Requirements

When deploying Power BI across an enterprise with 10,000+ employees, business intelligence is subject to the same rigorous compliance, security, and auditing standards as core ERP or financial banking software.

---

## 1. Enterprise Quality Attributes (The 5 Pillars)

```
                            Enterprise BI SLA Standards
                                         |
     +-----------------+-----------------+-----------------+-----------------+
     |                 |                 |                 |                 |
Performance       Scalability       Security          Reliability       Auditability
- Sub-second UI   - Hundreds of     - Dynamic RLS     - Automated Daily - Tenant Auditing
- Fast refreshes  - Millions of     - OLS             - Gateways & SLA  - Activity Logs
- < 1.5s visual   - Rows (DirectQ   - Data Loss       - High-Avail      - Lineage View
  render times      & Incremental)    Prevention      - Disaster Recov    & Metadata
```

---

## 2. Capacity Planning: Pro vs. Premium vs. Fabric (F-SKUs)

| Capability / Resource | Power BI Pro | Power BI Premium Per User (PPU) | Microsoft Fabric (Capacity F-SKU / P-SKU) |
| :--- | :--- | :--- | :--- |
| **Licensing Model** | Per user/month ($10/user) | Per user/month ($20/user) | Per organizational compute capacity (hourly/monthly) |
| **Model Size Limit** | 1 GB compressed | 100 GB compressed | 400 GB+ (Large Dataset Storage Format) |
| **Refresh Frequency**| 8 times per day | 48 times per day | 48 times per day (or streaming real-time) |
| **Free User Access** | No (All consumers need Pro) | No (All consumers need PPU) | **YES!** Anyone in the org can view reports without a license |
| **Deployment Pipelines**| No | Yes | **YES** |
| **XMLA Read/Write Endpoint**| Read-only | Yes | **YES** (Enables Tabular Editor, ALM Toolkit) |

---

## 3. Microsoft Purview & Data Loss Prevention (DLP)

In regulated industries (Banking, Healthcare, Defense), reports containing personally identifiable information (PII) or financial account numbers must be protected against unauthorized distribution.

### Enterprise Compliance Controls:
1. **Sensitivity Labels:** Powered by Microsoft Purview Information Protection (e.g., `General`, `Confidential`, `Highly Confidential - Finance`).
2. **Encrypted Exports:** When a user exports data from a report with a "Confidential" sensitivity label to Excel or PDF, the file remains encrypted and cannot be opened on unauthorized devices!
3. **Data Loss Prevention (DLP) Policies:** Automatically scan semantic models for sensitive patterns (Credit card numbers, Social Security Numbers) and notify security admins.

---

# Multiple Choice Questions

### 1. Which Power BI capacity tier allows thousands of corporate users with Free licenses to consume reports without purchasing individual Pro licenses?
A. Power BI Desktop
B. Power BI Pro
C. Dedicated Fabric Capacity (F64+ SKU) or Power BI Premium Capacity (P-SKU)
D. Microsoft Excel Online
**Answer:** C
**Explanation:** Dedicated capacities (Fabric F64 or Premium P1) license the organizational server compute rather than individual seats, enabling unlimited free users to consume reports.

### 2. What enterprise management tool enables third-party modeling software (such as Tabular Editor, DAX Studio, and ALM Toolkit) to connect directly to Power BI datasets?
A. Windows Notepad
B. XMLA Read/Write Endpoints (available in Premium / Fabric capacity)
C. Bluetooth pairing
D. Internet Explorer
**Answer:** B
**Explanation:** The XMLA endpoint exposes standard analysis services communication protocols, allowing external DevOps and modeling tools to query, update, and manage semantic models programmatically.

### 3. What is the maximum compressed model size limit allowed for a single dataset in a standard Power BI Pro workspace?
A. 100 MB
B. 1 GB
C. 50 GB
D. Unlimited
**Answer:** B
**Explanation:** Standard Power BI Pro enforces a maximum dataset size limit of 1 GB in memory. Models exceeding 1 GB require Premium capacity or DirectQuery architecture.

### 4. What happens when a user exports data to Excel from a Power BI report that has a "Highly Confidential" Microsoft Purview Sensitivity Label applied?
A. The export fails with a printer error
B. The exported Excel file inherits the exact same encryption and security permissions, preventing unauthorized access outside the organization
C. The report is deleted
D. The label is stripped from the file
**Answer:** B
**Explanation:** Microsoft Purview sensitivity labels persist through data exports, ensuring downloaded Excel or PDF files remain encrypted under the same access policies.

### 5. What enterprise feature in Power BI Service allows organizations to track which downstream reports and dashboards will break if a data warehouse table column is renamed?
A. Performance Analyzer
B. Data Lineage View (Impact Analysis)
C. Auto Date/Time
D. Bookmark Navigator
**Answer:** B
**Explanation:** The Data Lineage View visualizes the complete end-to-end data pipeline from source to dataflow, dataset, report, and dashboard, enabling one-click Impact Analysis across all dependencies.

---
