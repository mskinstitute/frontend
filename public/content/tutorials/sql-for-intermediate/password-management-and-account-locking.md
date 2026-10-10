---
id: password-management-and-account-locking
slug: password-management-and-account-locking
course: sql-for-intermediate
chapter: MySQL User Management & Security
topic: "Password Management & Account Locking"
difficulty: Intermediate
readingTime: 12
order: 46
keywords: ["account lock","password expiration","password history","mysql security","failed login attempts"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Password Management & Account Locking
Modern compliance frameworks (such as SOC2, PCI-DSS, and ISO 27001) enforce strict identity governance policies on database infrastructure:
- Periodic password expiration
- Prohibition against password reuse (history tracking)
- Automatic account locking after consecutive failed login attempts
- Temporary suspension of inactive accounts without deleting their grants

MySQL 8.0 introduces enterprise-grade **Password Management and Account Locking** controls built directly into the server core.

---

### Account Locking and Unlocking

If an employee departs or a service credential is suspected of compromise, deleting the account immediately might break audit logs or foreign keys. Instead, administrators can **lock the account**, immediately rejecting all connection attempts while preserving privileges:

```sql
-- Lock an account (blocks all authentication attempts)
ALTER USER 'contractor'@'%' ACCOUNT LOCK;

-- Unlock the account when approved
ALTER USER 'contractor'@'%' ACCOUNT UNLOCK;

-- Create an account in an initially locked state
CREATE USER 'staging_app'@'%' 
IDENTIFIED BY 'TempPass#2026' 
ACCOUNT LOCK;
```

If a client attempts to connect using a locked account, MySQL returns:
`ERROR 3118 (HY000): Access denied for user 'contractor'@'%'. Account is locked.`

---

### Password Expiration Policies

You can enforce password rotation policies globally or on a per-user basis:

```sql
-- Require password rotation every 90 days
ALTER USER 'finance_user'@'%' 
PASSWORD EXPIRE INTERVAL 90 DAY;

-- Force the user to change password immediately on their very next login
ALTER USER 'finance_user'@'%' 
PASSWORD EXPIRE;

-- Exempt service accounts (microservices) from password expiration
ALTER USER 'orders_microservice'@'%' 
PASSWORD EXPIRE NEVER;
```

---

### Preventing Password Reuse (Password History)

To prevent users from alternating between two passwords:

```sql
-- Forbid reuse of the last 5 passwords
ALTER USER 'finance_user'@'%' 
PASSWORD HISTORY 5;

-- Forbid reuse of any password used within the last 365 days
ALTER USER 'finance_user'@'%' 
PASSWORD REUSE INTERVAL 365 DAY;
```

---

### Automated Account Locking for Failed Logins

MySQL 8.0 includes built-in protection against brute-force password guessing attacks:

```sql
ALTER USER 'admin_user'@'%'
FAILED_LOGIN_ATTEMPTS 4
PASSWORD_LOCK_TIME 1;
```
- `FAILED_LOGIN_ATTEMPTS 4`: If 4 consecutive incorrect passwords are provided, the account locks.
- `PASSWORD_LOCK_TIME 1`: The account remains locked for 1 day (or use `UNBOUNDED` to require manual DBA unlocking).

---

### Summary Table of Account Governance Directives

| Directive | Purpose | Example |
| :--- | :--- | :--- |
| **ACCOUNT LOCK / UNLOCK** | Administratively suspend or activate an account | `ALTER USER 'u'@'%' ACCOUNT LOCK;` |
| **PASSWORD EXPIRE** | Force password change on next login | `ALTER USER 'u'@'%' PASSWORD EXPIRE;` |
| **PASSWORD EXPIRE INTERVAL N DAY** | Set automatic expiration timeframe | `... PASSWORD EXPIRE INTERVAL 60 DAY;` |
| **PASSWORD HISTORY N** | Disallow reusing previous N passwords | `... PASSWORD HISTORY 6;` |
| **FAILED_LOGIN_ATTEMPTS N** | Lockout threshold for bad passwords | `... FAILED_LOGIN_ATTEMPTS 3;` |

---

# Multiple Choice Questions

### 1. Which SQL command immediately prevents a user from logging in without deleting their account or privileges?
A. ALTER USER 'john'@'%' ACCOUNT LOCK;
B. DROP USER 'john'@'%';
C. SHUTDOWN USER 'john'@'%';
D. REVOKE CONNECT FROM 'john'@'%';
**Answer:** A
**Explanation:** ACCOUNT LOCK suspends an account from logging in while retaining its grants, permissions, and metadata intact.
---

### 2. What does ALTER USER 'dev'@'%' PASSWORD EXPIRE; force the user to do?
A. Deletes their account after 24 hours
B. Forces the user to change their password on their very next connection
C. Encrypts all their tables
D. Reverts password to 'root'
**Answer:** B
**Explanation:** PASSWORD EXPIRE marks the current credential expired, requiring the user to change their password immediately upon their next login.
---

### 3. Which clause prevents a user from alternating between the same two passwords?
A. PASSWORD UNIQUE 2
B. PASSWORD HISTORY 5
C. PREVENT REPEAT PASSWORDS
D. STRICT PASSWORD CHECK
**Answer:** B
**Explanation:** The PASSWORD HISTORY clause enforces that new passwords cannot match any of the preceding N recorded passwords.
---

### 4. What does FAILED_LOGIN_ATTEMPTS 3 combined with PASSWORD_LOCK_TIME 1 accomplish?
A. Deletes the user after 3 mistakes
B. Locks the account for 1 day after 3 consecutive failed password attempts
C. Sends an SMS alert after 1 minute
D. Restarts MySQL server
**Answer:** B
**Explanation:** This configuration locks the account automatically for 1 day if 3 consecutive incorrect passwords are submitted.
---

### 5. Why is ACCOUNT LOCK preferred over DROP USER when an employee takes extended medical leave?
A. DROP USER permanently deletes all data created by that user
B. ACCOUNT LOCK retains all existing grants and privileges so access can be instantly restored upon return
C. MySQL prohibits dropping accounts that have existed for more than 1 year
D. ACCOUNT LOCK requires less disk space
**Answer:** B
**Explanation:** Locking temporarily disables access without requiring administrators to recreate accounts and reassign complex privilege matrices later.
---
