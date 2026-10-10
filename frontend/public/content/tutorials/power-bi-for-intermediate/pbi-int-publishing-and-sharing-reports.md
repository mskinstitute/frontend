# Capstone Project: Publishing, RLS Deployment & App Handover

Congratulations on completing the Capstone development! The final phase of an intermediate BI project is **deployment to the cloud**: publishing the `.pbix` report, configuring Row-Level Security, setting up scheduled data refreshes, and publishing the final **Power BI App** for executive stakeholders.

---

## 1. Publishing to the Power BI Service

1. Save your final report file in Power BI Desktop: `Superstore_Executive_Dashboard.pbix`.
2. On the **Home** ribbon tab, click **Publish**.
3. Select your designated collaborative workspace (e.g., `Commercial Operations - Production`).
4. Wait for the upload confirmation: **"Publishing succeeded!"**
5. Click the link to open the live report in your web browser (`app.powerbi.com`).

---

## 2. Setting Up Cloud Row-Level Security (RLS)

Now configure cloud access for regional sales directors:
1. In your workspace, locate the **Dataset / Semantic Model**.
2. Click **More options (...)** $\to$ **Security**.
3. Under the `North_Region_Manager` role, add the email addresses of the northern sales leadership.
4. Click **Test as role** to verify that northern managers can only see North regional figures.
5. Click **Save**.

---

## 3. Publishing the Production App

Never share the raw workspace link with executive leadership. Package the solution into an official App:
1. In your workspace, click **Create app** (or **Update app**) in the top-right corner.
2. In the **Setup** tab:
   - Name the App: `Executive Sales & Operations Portal`.
   - Add a professional description and corporate logo icon.
3. In the **Content** tab:
   - Add your newly published `Superstore_Executive_Dashboard`.
4. In the **Audience** tab:
   - Create audience groups (e.g., `Executive Board`, `Regional Sales Directors`).
   - Grant access via Microsoft Entra ID groups.
5. Click **Publish app** and copy the clean distribution URL!

```
Final Enterprise Handoff Architecture:
[Superstore_Executive_Dashboard.pbix] (Desktop)
                | (Publish)
                v
[Production Workspace] (Staging & Model Management)
  ├── Semantic Model (Scheduled Refresh: 7:00 AM Daily)
  ├── Row-Level Security Configured
  └── Centralized Data Governance
                | (Publish App)
                v
[Executive Power BI App] (Final Consumer Touchpoint)
  └── Clean, Interactive, Secure, Corporate-Ready Portal!
```

---

# Multiple Choice Questions

### 1. What is the recommended delivery vehicle for sharing completed production dashboards with broad corporate business users?
A. Emailing 50MB `.pbix` files as attachments
B. Publishing and distributing a packaged Power BI App from the workspace
C. Printing paper printouts
D. Uploading to a public file-sharing website
**Answer:** B
**Explanation:** Power BI Apps provide a secure, polished, curated portal experience with controlled release cycles, ideal for distributing reports across an enterprise.

### 2. After publishing a report with RLS to the Power BI Service, what essential step must be performed before users can view the report?
A. Reinstall Power BI Desktop
B. Map user email addresses or Entra ID security groups to the defined RLS roles under the Dataset Security settings
C. Change all passwords
D. Delete the dataset
**Answer:** B
**Explanation:** RLS roles created in Desktop remain inactive in the cloud until real users or security groups are assigned to those roles in the Power BI Service.

### 3. How do you configure a Power BI report to update its data automatically every morning at 7:00 AM?
A. Leave Power BI Desktop running on your monitor overnight
B. Configure "Scheduled Refresh" in the Dataset Settings menu within the Power BI Service
C. Write a Windows batch script
D. Ask users to refresh their browsers
**Answer:** B
**Explanation:** Scheduled Refresh in the Power BI Service automates cloud data ingestion on a defined schedule (e.g., daily at 7:00 AM) without manual intervention.

### 4. What happens if you modify visuals in the workspace report after publishing a Power BI App?
A. The App updates immediately, exposing incomplete changes to users
B. End-users continuing using the published App see zero changes until you click "Update App" in the workspace
C. The App is automatically deleted
D. All user licenses expire
**Answer:** B
**Explanation:** The App acts as a stable production release. Developers can modify and test reports in the workspace safely without affecting App consumers until they choose to push the update.

### 5. What milestone represents the successful completion of the Power BI Intermediate level?
A. Passing a typing speed test
B. The ability to architect a normalized Star Schema, author advanced DAX measures (Time Intelligence, CALCULATE, Iterators), enforce Row-Level Security, and deploy enterprise Power BI Apps
C. Memorizing 500 keyboard shortcuts
D. Writing machine code
**Answer:** B
**Explanation:** Intermediate mastery is defined by end-to-end competence: taking raw business requirements through dimensional modeling, advanced calculations, security governance, and production cloud deployment.

---
