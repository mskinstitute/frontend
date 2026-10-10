# Testing Security & Validating RLS in Power BI

Once you have defined Row-Level Security (RLS) roles and authored DAX filters in Power BI Desktop, you must **test and validate the security rules thoroughly** before deploying the report to production. Publishing untested RLS rules can expose sensitive financial figures or salary records to unauthorized personnel.

---

## 1. The "View as" Feature in Power BI Desktop

Power BI Desktop includes a built-in simulation tool called **View as** (formerly "Test as role") that allows developers to experience the report through the eyes of any role or specific user:

```
View as Roles Dialog:
+-------------------------------------------------------------------+
| View as                                                           |
|                                                                   |
| [ ] None (Default Developer View - Unrestricted)                  |
| [X] North_Region_Manager  <--- Test specific static role          |
| [ ] South_Region_Manager                                          |
|                                                                   |
| [ ] Other user: [ aarav.sharma@company.com ] <--- Test dynamic RLS|
|                                                                   |
|                                            [ OK ]      [ Cancel ] |
+-------------------------------------------------------------------+
```

### Steps to Test a Static Role:
1. In Power BI Desktop, go to the **Modeling** ribbon tab.
2. Click **View as** (located directly next to *Manage Roles*).
3. Check the box corresponding to the role you wish to validate (e.g., `North_Region_Manager`).
4. Click **OK**.
5. Observe the top notification banner: **"Now viewing as: North_Region_Manager"**.
6. Inspect all cards, charts, and matrices. Verify that:
   - Only North region records appear.
   - Total cards reflect only North regional metrics.
   - Slicers only display options relevant to that role.
7. To return to standard view, click **Stop viewing** on the yellow top banner.

---

## 2. Testing Security in the Power BI Service

Testing inside Power BI Desktop validates the DAX formula logic. However, you must also test **role membership** in the Power BI cloud:

1. Open **app.powerbi.com** and navigate to your workspace.
2. Locate the dataset, click **More options (...)**, and select **Security**.
3. Hover over the role name, click the **three dots (...)**, and select **Test as role**.
4. Power BI will open the live report with that role's security context applied.
5. You can also type a colleague's email address into the header search bar to test how dynamic RLS evaluates their specific permissions.

---

## 3. Critical Security Gotcha: Workspace Permissions

> **ENTERPRISE SECURITY ALERT:** 
> Row-Level Security (RLS) is **IGNORED** for users assigned the **Admin**, **Member**, or **Contributor** roles in a workspace!
> - Admins, Members, and Contributors have full edit/build access to the underlying semantic model. Power BI will NOT restrict their view.
> - RLS is strictly enforced **ONLY** for users with the **Viewer** role, or users accessing the report via a **Power BI App** or shared link!

---

# Multiple Choice Questions

### 1. Which feature in Power BI Desktop allows you to simulate viewing the report as a specific security role?
A. Query Diagnostics
B. View as (Test as role)
C. Performance Analyzer
D. Bookmark Navigator
**Answer:** B
**Explanation:** The "View as" feature on the Modeling ribbon lets developers impersonate any defined static role or specific user email to verify that data filters function as expected.

### 2. What happens to RLS rules when a user is assigned the "Member" or "Contributor" role in a Power BI Workspace?
A. Power BI enforces RLS even more strictly
B. RLS is completely bypassed because Members and Contributors possess edit access to the dataset
C. The workspace is locked
D. The user's account is suspended
**Answer:** B
**Explanation:** Power BI only enforces RLS on users with read-only permissions (the "Viewer" workspace role or App consumers). Anyone with edit access (Admin, Member, Contributor) can view all data.

### 3. What visual cue indicates that you are actively testing a role in Power BI Desktop?
A. The report canvas turns black
B. A yellow notification banner appears at the top of the canvas stating "Now viewing as: [Role Name]" with a "Stop viewing" button
C. All visuals disappear
D. A watermarked logo is added to the page
**Answer:** B
**Explanation:** When testing security, Power BI Desktop places a prominent yellow banner across the top of the canvas, reminding you that filters are actively simulated.

### 4. Where do you validate that an individual user email address has been successfully mapped to an RLS role in production?
A. In the Power BI Service by clicking "Test as role" under the Dataset Security settings
B. By calling Microsoft technical support
C. In the local computer's Windows registry
D. By modifying the Power Query M code
**Answer:** A
**Explanation:** The Power BI Service provides a "Test as role" option inside the Dataset Security menu where administrators can test roles and specific user email addresses against the live cloud report.

### 5. Why might a card visual display `$1,000,000` when viewed normally, but change to `$250,000` when viewed as `North_Region_Manager`?
A. The visual has experienced a calculation error
B. The RLS filter successfully restricted the dataset to only rows where `Region = "North"`, confirming the security rule is working
C. DirectQuery has disconnected
D. The currency format changed
**Answer:** B
**Explanation:** The reduction in the card's aggregated metric proves that RLS is actively filtering out rows from other regions, which is the exact intended behavior of the security role.

---
