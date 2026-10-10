# The Dev-Test-Prod Lifecycle: Environment Isolation & Governance

A disciplined **Dev-Test-Prod (Development, Testing, Production)** lifecycle is the bedrock of corporate IT governance. This chapter details the formal procedural rules, parameter management, and user permissions required to execute a seamless promotion cycle.

---

## 1. Environment Role Segregation

Enterprise compliance standards (such as SOX, HIPAA, and ISO 27001) require strict **separation of duties**:

| Lifecycle Stage | Workspace Name Example | Authorized Personas | Access Permissions | Connected Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `Commercial BI - Dev` | BI Developers & Data Engineers | Admin, Member, Contributor | `dev-dw.company.com` (Dev Database / Test Data) |
| **Test (UAT)** | `Commercial BI - Test`| Business Analysts, QA, SME Key Users | Contributor (QA team), Viewer (Business Testers) | `uat-dw.company.com` (Staging Mirror of Prod) |
| **Production** | `Commercial BI - Prod`| BI Lead / Release Manager (Admin); End-Users (Viewers via App) | Admin (Release Manager Only); Viewer (End Users) | `prod-dw.company.com` (Live Production Data Warehouse) |

---

## 2. Parameterizing Environments in Power Query

Hardcoding server and database names in Power Query is an enterprise anti-pattern. Instead, define **Environment Parameters**:

```powerquery
// Power Query Parameter: ServerName
ServerName = "dev-sql.company.com" meta [IsParameterQuery=true, Type="Text"]

// Power Query Parameter: DatabaseName
DatabaseName = "SalesEnterprise_Dev" meta [IsParameterQuery=true, Type="Text"]

// Connection Step:
Source = Sql.Database(ServerName, DatabaseName)
```

When promoting through the Deployment Pipeline, configure a **Parameter Rule** to automatically map:
- In Dev: `ServerName = "dev-sql.company.com"`
- In Test: `ServerName = "uat-sql.company.com"`
- In Prod: `ServerName = "prod-sql.company.com"`

---

# Multiple Choice Questions

### 1. Why is hardcoding production database server names directly into Power Query M steps considered an enterprise anti-pattern?
A. Power Query cannot read text strings
B. It couples the report strictly to one server, preventing automated promotion across isolated Dev, Test, and Prod database environments
C. It deletes the data source credentials
D. It slows down the computer
**Answer:** B
**Explanation:** Hardcoded connection strings prevent automated environment switching. Using parameters allows deployment pipelines to dynamically route queries to appropriate servers.

### 2. What role should corporate business consumers be granted in the Production workspace?
A. Admin
B. Contributor
C. Viewer (or consumption access via a published Power BI App)
D. Member
**Answer:** C
**Explanation:** Business consumers require read-only access. Granting them Viewer permissions or access through an App enforces security, prevents accidental edits, and respects RLS.

### 3. What does "User Acceptance Testing" (UAT) in the Test stage verify before promoting a dataset to Production?
A. That the monitor is plugged in
B. That the numbers, DAX calculations, and visual filters match validated financial and business truth as confirmed by subject matter experts (SMEs)
C. That the dataset file size is exactly 1 GB
D. That all visuals are pie charts
**Answer:** B
**Explanation:** UAT allows business stakeholders to validate calculation logic and operational KPIs against known benchmarks before the report becomes an official source of truth.

### 4. Who should hold "Admin" permissions in an enterprise Production Power BI workspace?
A. Every employee in the company
B. Only designated Release Managers or Lead BI Architects responsible for governed production deployments
C. External contractors
D. Only the database server
**Answer:** B
**Explanation:** Restricting Admin rights in production workspaces prevents unauthorized schema changes, rogue dataset deletions, and security misconfigurations.

### 5. What happens to report bookmarks and custom page layouts when an updated report is promoted from Test to Production in a deployment pipeline?
A. They are deleted permanently
B. The report in Production is updated with the new layouts and bookmarks while maintaining production dataset connections
C. The pipeline requires re-entering all passwords
D. DirectQuery is disabled
**Answer:** B
**Explanation:** Promoting an item updates the production artifact with the latest definitions, layouts, and measures while preserving production-specific data source rules.

---
