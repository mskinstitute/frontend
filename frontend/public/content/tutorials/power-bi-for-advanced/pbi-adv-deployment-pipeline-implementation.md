# Capstone Release: Deployment Pipeline, Production & Governance

You have reached the final milestone of **Power BI for Advanced**! In this concluding lesson, you will deploy the capstone solution through the enterprise **Deployment Pipeline**, apply environment parameter rules, publish the production **Power BI App**, and deliver the final handover.

---

## 1. Executing the Production Release Sequence

```
1. GIT COMMIT & CODE REVIEW
   - Save project as .pbip format.
   - Commit to Git repository branch `feature/capstone-release`.
   - Submit Pull Request (PR) in Azure DevOps / GitHub.
   - Senior Architect performs peer code review & merges to `main`.
                   |
2. DEPLOYMENT TO STAGING (DEV WORKSPACE)
   - Workspace automatically synchronizes with Git `main` branch.
   - Validate report visuals in Development workspace.
                   |
3. PIPELINE PROMOTION TO TEST (UAT)
   - Open Deployment Pipeline. Click "Deploy to Test".
   - Parameter rules automatically switch connection to Staging database.
   - Business stakeholders perform User Acceptance Testing (UAT).
   - Verify that RLS "View as" tests pass for regional roles.
                   |
4. PIPELINE PROMOTION TO PRODUCTION
   - Click "Deploy to Production".
   - Parameter rules switch to live enterprise Data Warehouse.
   - Configure Scheduled Refresh (Daily 6:00 AM).
                   |
5. PUBLISH PRODUCTION POWER BI APP
   - Package reports into the Executive App.
   - Define Audiences (Board Members, Regional Directors).
   - Distribute App URL across the enterprise!
```

---

## 2. Final Architecture Verification

| Operational Standard | Verification Metric | Status |
| :--- | :--- | :--- |
| **Data Modeling** | Normalized Star Schema, 1-to-Many relationships, Auto Date/Time disabled | **VERIFIED** |
| **DAX Optimization** | Modular DAX, Variables (`VAR`), Iterators (`SUMX`), Server Timings SE > 80% | **VERIFIED** |
| **Security Governance** | Dynamic RLS (`USERPRINCIPALNAME`), Object-Level Security via Tabular Editor | **VERIFIED** |
| **ALM & DevOps** | `.pbip` Git version control, 3-Stage Deployment Pipeline with Parameter Rules | **VERIFIED** |
| **Consumption** | Power BI App published, Mobile Layout configured, Scheduled Refresh active | **VERIFIED** |

---

# Multiple Choice Questions

### 1. What sequence represents the correct enterprise promotion path for a Power BI solution?
A. Development $\to$ Production directly
B. Development $\to$ Test (UAT) $\to$ Production
C. Production $\to$ Development
D. Test $\to$ Development $\to$ Production
**Answer:** B
**Explanation:** Standard enterprise IT lifecycle management mandates developing in Dev, validating in Test (UAT), and deploying only approved versions to Production.

### 2. How are database credentials and server names maintained across different stages of a Deployment Pipeline?
A. By manually editing the `.pbix` file before every deployment
B. By configuring Deployment Rules (Parameter Rules and Data Source Rules) within the pipeline interface
C. By using identical passwords everywhere
D. By hardcoding them in DAX
**Answer:** B
**Explanation:** Deployment rules decouple environment configuration from report definitions, automatically repointing datasets to correct regional or stage-specific databases upon promotion.

### 3. What is the role of the Pull Request (PR) in the modern Power BI developer workflow?
A. To print the report
B. To allow senior architects to review DAX code, model relationships, and M transformations before changes are merged into the production Git branch
C. To delete old workspaces
D. To change chart colors
**Answer:** B
**Explanation:** Pull requests provide a governance checkpoint where team leads audit code quality, performance impacts, and security rules before deployment.

### 4. What final action completes the project handover to business stakeholders?
A. Giving end-users administrator access to the production workspace
B. Publishing the final Power BI App with tailored audience permissions and providing the clean App portal link
C. Emailing the `.pbix` file to all employees
D. Deleting the Development workspace
**Answer:** B
**Explanation:** Publishing the Power BI App delivers a governed, professional consumption portal for end-users, completing the enterprise deployment lifecycle.

### 5. What hallmark signifies true Power BI Advanced Mastery?
A. The ability to create 10 different colors in a pie chart
B. The comprehensive capability to architect scalable star schemas, tune DAX query engines, implement dynamic RLS and OLS, manage CI/CD pipelines, and deliver governed enterprise BI solutions
C. Typing DAX formulas without looking at the keyboard
D. Knowing how to save a file in Excel
**Answer:** B
**Explanation:** Advanced mastery is characterized by enterprise architectural competence: designing high-performance models, enforcing multi-tenant security, governing lifecycle pipelines, and delivering measurable business value.

---
