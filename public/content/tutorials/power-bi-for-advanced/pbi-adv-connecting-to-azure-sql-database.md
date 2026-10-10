# Connecting to Azure SQL Database: Enterprise Security & Ingestion

In enterprise cloud ecosystems, **Azure SQL Database** is one of the primary cloud relational databases powering commercial applications. Connecting Power BI to Azure SQL securely requires configuring cloud firewalls, managing Microsoft Entra ID (formerly Azure AD) authentication, and selecting the optimal connectivity mode.

---

## 1. Authentication & Cloud Firewall Security

When establishing an enterprise connection between Power BI and Azure SQL Database:
1. **Azure Firewall Configuration:**
   - In the Azure Portal, open your Azure SQL logical server.
   - Navigate to **Security** $\to$ **Networking**.
   - Ensure **Allow Azure services and resources to access this server** is toggled to **ON** (allows the cloud Power BI Service to communicate without requiring an on-premises gateway!).
2. **Authentication Protocol:**
   - Instead of basic SQL username/password, use **Microsoft Entra ID (OAuth 2.0)**:
   - Enables Multi-Factor Authentication (MFA).
   - Inherits Single Sign-On (SSO) for DirectQuery reports!

---

## 2. DirectQuery with Kerberos / Entra SSO

When using DirectQuery with Azure SQL:
- You can enable **Single Sign-On (SSO)** via Microsoft Entra ID.
- When User A opens the report, Power BI passes User A's identity directly to the Azure SQL Database.
- Any security rules or SQL permissions configured on the database are enforced natively for that user!

---

# Multiple Choice Questions

### 1. What setting in the Azure SQL Database networking portal must be enabled to allow the cloud Power BI Service to refresh datasets without a gateway?
A. Enable public FTP
B. Allow Azure services and resources to access this server
C. Disable all passwords
D. Change port to 80
**Answer:** B
**Explanation:** Enabling "Allow Azure services to access this server" permits authorized Microsoft cloud services (like Power BI Service) to pass through the Azure network firewall.

### 2. What is the enterprise recommended authentication method when connecting Power BI to Azure SQL Database?
A. Anonymous access
B. Microsoft Entra ID (Azure Active Directory) with MFA / SSO
C. Plain text passwords stored in a spreadsheet
D. Windows 95 login
**Answer:** B
**Explanation:** Microsoft Entra ID provides centralized identity governance, Multi-Factor Authentication (MFA), and secure token-based authentication without hardcoding static database passwords.

### 3. What occurs when Single Sign-On (SSO) is enabled for a DirectQuery connection to Azure SQL Database?
A. The report opens without asking for any login
B. Power BI passes the active report viewer's Entra ID credentials directly to the Azure SQL server, enforcing the user's native database permissions
C. The dataset is exported to Excel
D. The database is put in read-only mode
**Answer:** B
**Explanation:** Entra SSO forwards the user's identity to the database, ensuring database-level security policies and audit logs reflect the individual user querying the data.

### 4. Is an On-Premises Data Gateway required when Power BI connects to an Azure SQL Database?
A. Yes, always
B. No; because both Power BI Service and Azure SQL reside natively in the Microsoft Azure cloud, communication occurs over the secure Azure cloud backbone
C. Only if the report contains charts
D. Only on weekends
**Answer:** B
**Explanation:** Gateways are only required to bridge private on-premises networks to the cloud. Cloud-to-cloud connections within Azure do not require an on-premises gateway.

### 5. In which storage mode does Power BI cache Azure SQL data into the in-memory VertiPaq engine?
A. DirectQuery
B. Import Mode
C. Live Connect
D. Push
**Answer:** B
**Explanation:** Import mode pulls tables from Azure SQL into the local or cloud VertiPaq in-memory engine, providing the fastest analytical performance.

---
