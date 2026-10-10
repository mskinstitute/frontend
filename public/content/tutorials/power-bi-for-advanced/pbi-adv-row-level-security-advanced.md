# Advanced Row-Level Security: Multi-Role Intersections & Hierarchy Security

In enterprise deployments, security requirements rarely consist of simple static filters. Global organizations require **matrix security models**:
- A user can only see data for **their assigned region AND their specific product line**.
- A regional manager must see data for their direct subordinates and all downstream employees across an **organizational hierarchy tree**.

---

## 1. Multi-Dimensional RLS: The Intersection Dilemma

When an employee has multiple access constraints (e.g., Region = North, Department = Healthcare):

### The Common Enterprise Mistake:
Creating two separate roles:
- Role 1: `North_Role` (Filter: `[Region] = "North"`)
- Role 2: `Healthcare_Role` (Filter: `[Department] = "Healthcare"`)

> **CRITICAL SECURITY WARNING:** When a user is assigned both roles, Power BI combines roles with an **`OR` UNION**, NOT an `AND`! The user will see **ALL North data (regardless of dept)** PLUS **ALL Healthcare data (regardless of region)**!

### The Secure Solution: Single Compound Role
```dax
-- Enforces true dimensional intersection (AND)
[Region] = "North" && RELATED(Dim_Product[Department]) = "Healthcare"
```

---

## 2. Manager Hierarchy Security with `PATHCONTAINS`

To allow managers to automatically see data for themselves and everyone reporting up through their chain of command:

```dax
-- Dynamic RLS filter applied on Dim_Employee:
VAR CurrentUserEmail = USERPRINCIPALNAME()
VAR CurrentUserEmployeeID = 
    LOOKUPVALUE(
        Dim_Employee[EmployeeID],
        Dim_Employee[Email],
        CurrentUserEmail
    )
RETURN
PATHCONTAINS(
    Dim_Employee[EmployeePath],
    CurrentUserEmployeeID
)
```

### How It Works:
1. `USERPRINCIPALNAME()` retrieves the login email of the user viewing the report.
2. `LOOKUPVALUE` identifies their internal `EmployeeID`.
3. `PATHCONTAINS` checks if their `EmployeeID` appears anywhere in the `EmployeePath` of any row!
4. Result: The manager automatically sees data for their entire organization without creating thousands of individual static roles!

---

# Multiple Choice Questions

### 1. If a user is assigned to two separate RLS roles in the Power BI Service—one filtering Region="West" and the other filtering Dept="Electronics"—how does Power BI evaluate their access?
A. As an `AND` intersection: they only see Electronics in the West
B. As an `OR` union: they see all West records (all departments) PLUS all Electronics records (all regions)
C. Both roles cancel each other out, showing zero data
D. Power BI prompts the user to select one role upon login
**Answer:** B
**Explanation:** Power BI combines permissions from multiple assigned RLS roles using an `OR` boolean union. To enforce an intersection (`AND`), the conditions must be authored inside a single unified role.

### 2. How does the `PATHCONTAINS` function automate hierarchy security for managers in Power BI?
A. By scanning the manager's inbox
B. By checking whether the logged-in manager's ID exists anywhere in an employee's organizational lineage path, granting access to the entire reporting chain
C. By promoting the manager to Workspace Admin
D. By creating duplicate reports
**Answer:** B
**Explanation:** Because `EmployeePath` contains the entire ancestry chain, checking `PATHCONTAINS(Path, ManagerID)` evaluates to TRUE for the manager and all their direct/indirect subordinates.

### 3. Which DAX function retrieves the authenticated Microsoft Entra ID (Azure AD) user email address inside a security formula?
A. `USERNAME()`
B. `USERPRINCIPALNAME()`
C. `GET_USER()`
D. `AUTH_EMAIL()`
**Answer:** B
**Explanation:** In the Power BI Service, `USERPRINCIPALNAME()` consistently returns the user's corporate email address (UPN) authenticated via Microsoft Entra ID.

### 4. What happens if `LOOKUPVALUE` fails to find the current user's email in the security mapping table during RLS evaluation?
A. It grants the user administrator privileges
B. It returns `BLANK()`, which typically results in the security rule evaluating to FALSE and displaying a blank report (denying access safely)
C. The dataset is corrupted
D. It sends an email to the helpdesk
**Answer:** B
**Explanation:** When a lookup returns BLANK, the security predicate evaluates to FALSE, safely blocking data exposure for unauthorized users.

### 5. Why is dynamic hierarchy RLS using `PATHCONTAINS` superior to static role assignment in an enterprise with 5,000 employees?
A. Static roles do not support numbers
B. A single dynamic rule manages the entire company; when employees are promoted or change teams, updating the database table automatically updates security without modifying the `.pbix` file
C. It reduces visual licensing fees
D. It allows reports to be opened in Excel
**Answer:** B
**Explanation:** Dynamic hierarchy security scales automatically. Changes in organizational reporting structures are reflected on the next scheduled refresh with zero manual role re-assignment.

---
