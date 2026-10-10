# Enterprise Workspace Governance & Tenant Administration

Without centralized governance, a Power BI tenant can quickly devolve into chaos: hundreds of orphaned workspaces, duplicated datasets, unauthorized data exports, and broken security rules. Enterprise BI architects must establish strict **tenant administration policies and workspace governance frameworks**.

---

## 1. Enterprise Workspace Topologies

Organizations structure workspaces according to functional domain models:

```
                            Enterprise Workspace Hierarchy
                                           |
     +-------------------------------------+-------------------------------------+
     |                                                                           |
[Central Enterprise Data Platform]                                    [Domain / Departmental Workspaces]
- Workspace: "Core Enterprise Semantics"                             - Workspace: "Global Sales Analytics"
- Owned by Enterprise Data Engineering Team                          - Workspace: "Supply Chain & Logistics"
- Houses Golden Certified Semantic Models                            - Houses reports created by business analysts
- Read-only for downstream report builders                           - Connects to Core Semantics via live connection
```

---

## 2. Key Tenant Settings in the Power BI Admin Portal

The **Power BI Admin Portal** controls global security policies for the entire company:

1. **Export and Sharing Settings:**
   - *Export data to Excel:* Restrict to authorized security groups (prevents mass data leakage).
   - *Publish to Web (Public):* **MUST BE DISABLED!** (Publish to web exposes corporate data to the public internet with zero authentication!).
2. **Integration Settings:**
   - *XMLA Endpoint Access:* Toggle Read/Write permissions for Premium workspaces.
   - *AI Features:* Enable/disable Azure OpenAI and Cognitive Services.
3. **Audit Logs:** Integrated with **Microsoft 365 Unified Audit Logs** to track who accessed, exported, or deleted any report.

---

# Multiple Choice Questions

### 1. Why must the "Publish to web (public)" setting be strictly DISABLED or restricted in the Power BI Admin Portal?
A. It speeds up report loading
B. "Publish to web" bypasses all security, authentication, and RLS, making confidential corporate data publicly accessible on search engines
C. It causes printer errors
D. It prevents users from creating slicers
**Answer:** B
**Explanation:** "Publish to web" creates public links that require no login, exposing company data to the world. It must be disabled to prevent catastrophic data leaks.

### 2. What architecture separates data modeling from visual report authoring across different workspaces?
A. The Golden Dataset / Thin Report architecture (reports in departmental workspaces connect via Live Connection to a centralized dataset in a core workspace)
B. Single Flat File architecture
C. Excel macro automation
D. Direct CSV mapping
**Answer:** A
**Explanation:** The "Thin Report" pattern decouples data engineering from report visualization, preventing redundant models and ensuring unified business metric definitions.

### 3. Which administrative portal allows enterprise administrators to monitor user activity, configure capacity SKUs, and manage global security settings?
A. Power BI Admin Portal (accessed via Settings in app.powerbi.com)
B. Windows Device Manager
C. Command Prompt
D. Visual Studio Marketplace
**Answer:** A
**Explanation:** The Power BI Admin Portal provides central control over tenant settings, user licenses, capacity assignments, and auditing.

### 4. Where are Power BI user interactions (such as view report, export data, and modify roles) logged for enterprise security auditing?
A. In temporary browser cookies
B. In the Microsoft 365 Unified Audit Log (and Azure Log Analytics)
C. In an Excel spreadsheet on the desktop
D. Nowhere; activities are anonymous
**Answer:** B
**Explanation:** Power BI logs all administrative and user events to the Microsoft 365 Audit Log, enabling corporate security operations centers (SOCs) to monitor compliance.

### 5. What workspace role should be granted to external contractors who only need to build visual report pages without modifying data models or publishing apps?
A. Admin
B. Member
C. Contributor
D. None
**Answer:** C
**Explanation:** Contributors can create, edit, and delete reports and dashboards within a workspace, but lack administrative rights to manage permissions or publish public apps.

---
