# Power BI Service: Workspaces, Roles & App Publishing

Developing reports in Power BI Desktop is only half the journey. In corporate environments, reports are published to the **Power BI Service (Cloud)** (`app.powerbi.com`) to be shared with business users through **Workspaces** and packaged into professional **Power BI Apps**.

---

## 1. Personal Workspace vs. Collaborative Workspaces

- **My Workspace:** A personal sandbox for individual developers. **Never use My Workspace for production enterprise reports!** If an employee leaves the company, their personal workspace is deleted, breaking all reports.
- **Collaborative Workspaces:** Shared departmental environments (e.g., `Sales & Distribution Analytics`, `Finance Production`) owned by the organization and managed by multiple administrators.

---

## 2. Workspace Roles & Governance Matrix

Power BI Workspaces support four distinct security roles:

| Workspace Role | Can Edit Reports / Datasets? | Can Manage Access? | Can Publish / Update Apps? | RLS Enforced? | Intended Audience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Yes | Yes (Full Control) | Yes | **NO** | BI Lead / System Admin |
| **Member** | Yes | Can add Viewers/Contributors | Yes | **NO** | Senior BI Developers |
| **Contributor**| Yes | No | No | **NO** | Junior Developers / Data Engineers |
| **Viewer** | **NO** (Read-Only) | No | No | **YES** | Business Consumers & Stakeholders |

---

## 3. The Gold Standard: Publishing a Power BI App

Rather than giving business users direct access to the messy workspace where reports are actively being edited, developers package validated reports into a **Power BI App**:

```
Development & Distribution Pipeline:
[Power BI Desktop] 
       | (Publish)
       v
[Workspace: "Finance Analytics - Staging"]  <--- Developers & QA (Admin, Member)
       | (Package & Publish App)
       v
[Power BI App: "Executive Financial Portal"] <--- 5,000 Corporate End-Users (Viewers)
```

### Why Distribute via Apps?
1. **Clean Navigation:** Custom multi-level navigation trees, external links, and structured tabs.
2. **Controlled Releases:** You can make edits to reports in the workspace without end-users seeing half-finished changes until you click **Update App**.
3. **Targeted Audiences:** A single App can serve multiple audience groups (e.g., Executives see Tab A, Managers see Tab B) within the same underlying reports!

---

# Multiple Choice Questions

### 1. Why should enterprise production reports NEVER be published to "My Workspace"?
A. My Workspace cannot display bar charts
B. "My Workspace" is tied to an individual employee's personal account; if they leave the company or change departments, the workspace and its reports are lost
C. My Workspace charges $100 per click
D. My Workspace only supports Python scripts
**Answer:** B
**Explanation:** Personal workspaces lack shared organizational ownership. Production assets must reside in shared collaborative workspaces to ensure business continuity.

### 2. Which Workspace role is the ONLY role where Row-Level Security (RLS) is actively enforced?
A. Admin
B. Member
C. Contributor
D. Viewer
**Answer:** D
**Explanation:** Admin, Member, and Contributor roles possess dataset edit permissions and bypass RLS. Only the read-only **Viewer** role enforces RLS constraints.

### 3. What is the primary advantage of distributing reports to business users via a Power BI App rather than direct workspace access?
A. Apps make reports run in 3D
B. Apps decouple development from consumption, allowing developers to safely stage and test report changes in the workspace without impacting users until the App is updated
C. Apps eliminate the need for Power BI licenses
D. Apps automatically translate reports into foreign languages
**Answer:** B
**Explanation:** A Power BI App acts as a published snapshot. Developers can modify workspace reports in staging without end-users seeing incomplete changes until the app is formally updated.

### 4. Who has permission to add other users as Admins in a Power BI Workspace?
A. Viewers
B. Contributors
C. Workspace Admins only
D. Anyone with an email address
**Answer:** C
**Explanation:** Only Workspace Admins have full administrative authority to modify membership roles and grant admin privileges to other colleagues.

### 5. How can you display different report tabs to Sales Managers versus Executives within the same published Power BI App?
A. Create two separate Power BI tenants
B. Use the "Audiences" feature in the Power BI App configuration to control tab visibility for specific Entra ID user groups
C. Email separate PDF files
D. Hide the visuals in Power Query
**Answer:** B
**Explanation:** Power BI Apps feature an **Audiences** capability, enabling developers to show or hide specific navigation items and report pages based on user security group membership.

---
