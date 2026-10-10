# Creating Roles & Defining DAX Security Filters

Now that you understand the architectural concepts of Row-Level Security (RLS), let us walk through the exact step-by-step procedure to define static security roles and author DAX filter expressions in Power BI Desktop.

---

## 1. Step-by-Step Role Creation in Power BI Desktop

1. Open your report in **Power BI Desktop**.
2. Navigate to the **Modeling** ribbon tab.
3. Click on **Manage Roles** in the Security group.
4. In the Manage Roles dialog:
   - Click **New** (or **Create**).
   - Name the role (e.g., `North_Region_Manager`).
5. Under **Tables**, select the dimension table containing the attribute to filter (e.g., `Dim_Geography`).
6. In the **Table filter DAX expression** box, write your boolean filter expression:
   ```dax
   [Region] = "North"
   ```
7. Click **Save**.

```
Manage Roles Dialog:
+-----------------------------------------------------------------------------+
| Roles              Tables                 Table Filter DAX Expression       |
| [New]              Dim_Customer           [Region] = "North"                |
| - North_Manager    Dim_Geography  <---                                      |
| - South_Manager    Fact_Sales                                               |
| - Tech_Only                                                                 |
|                                                     [Check DAX] [Save]      |
+-----------------------------------------------------------------------------+
```

---

## 2. Multi-Condition & Advanced DAX Security Filters

Security filters support compound boolean logic (`&&`, `||`, `IN`):

### Example 1: Multi-Region Access
```dax
-- Allows viewing both North and Central regions
[Region] IN {"North", "Central"}
```

### Example 2: Compound Dimension Security
```dax
-- Allows viewing Enterprise customers within the Western territory
[Region] = "West" && RELATED(Dim_Customer[Segment]) = "Enterprise"
```

### Example 3: Threshold Filtering (Restricting Confidential Records)
```dax
-- Hides transactions exceeding sensitive executive limits
Fact_Sales[SalesAmount] <= 50000
```

---

## 3. Assigning Users in the Power BI Service

> **CRITICAL ARCHITECTURAL DISTINCTION:** 
> - **Roles are defined** in Power BI Desktop (`.pbix`).
> - **Members (users/groups) are assigned** in the **Power BI Service** (`app.powerbi.com`)!

After publishing your report to the Power BI Service:
1. Navigate to your Workspace and locate the **Dataset / Semantic Model**.
2. Click the **More Options (...)** icon next to the dataset and select **Security**.
3. Under the role name, enter individual user email addresses or **Microsoft Entra ID (Azure AD) Security Groups**.
4. Click **Add** and **Save**.

```
Power BI Service Security Page:
Role: North_Region_Manager (Members: 3)
  - aarav.sharma@company.com
  - north-sales-team@company.com  (Entra ID Security Group - Best Practice!)
```

---

# Multiple Choice Questions

### 1. Which ribbon tab in Power BI Desktop contains the "Manage Roles" button?
A. Home
B. View
C. Modeling
D. Insert
**Answer:** C
**Explanation:** The **Modeling** ribbon tab hosts data modeling and governance tools, including the "Manage Roles" and "View as" security buttons.

---

### 2. What is the syntax to filter a role to include both the "Electronics" and "Audio" categories using DAX?
A. `[Category] = "Electronics" + "Audio"`
B. `[Category] IN {"Electronics", "Audio"}`
C. `FILTER([Category], "Electronics", "Audio")`
D. `Category == BOTH("Electronics", "Audio")`
**Answer:** B
**Explanation:** In DAX, the `IN` operator followed by a comma-separated list enclosed in curly braces `{}` allows concise filtering across multiple values.

---

### 3. Where are actual user email addresses mapped to the RLS roles you created?
A. Inside the DAX formula editor in Power BI Desktop
B. On the Power BI Service web portal under Dataset Security settings
C. In the Windows Registry
D. In the report's visual title box
**Answer:** B
**Explanation:** Roles are authored in Power BI Desktop, but user email assignments are managed in the Power BI Service under the Dataset's Security menu.

---

### 4. What is the enterprise best practice for assigning users to RLS roles in the Power BI Service?
A. Assigning individual user personal email addresses one by one
B. Assigning Microsoft Entra ID (Azure Active Directory) Security Groups rather than individual accounts
C. Giving every employee administrator rights
D. Hardcoding passwords into the dataset
**Answer:** B
**Explanation:** Assigning Entra ID (Azure AD) security groups simplifies administration: when employees join or leave a department, updating the central active directory group automatically updates their Power BI report access.

---

### 5. What happens if a user belongs to TWO different RLS roles in the same dataset (e.g., `North_Role` and `East_Role`)?
A. Power BI blocks the user with an access conflict error
B. The user receives the union of permissions (they can see data for both North AND East)
C. The user sees zero data
D. Power BI asks the user to choose a role each time they open the report
**Answer:** B
**Explanation:** If a user is assigned to multiple RLS roles, Power BI evaluates the roles using an `OR` union, granting access to the combined dataset permissions of all assigned roles.

---
