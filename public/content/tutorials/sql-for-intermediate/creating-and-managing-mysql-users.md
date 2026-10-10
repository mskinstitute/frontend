---
id: creating-and-managing-mysql-users
slug: creating-and-managing-mysql-users
course: sql-for-intermediate
chapter: MySQL User Management & Security
topic: "Creating & Managing MySQL Users"
difficulty: Intermediate
readingTime: 12
order: 43
keywords: ["create user","drop user","mysql users","host part","mysql security","caching_sha2_password"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Creating & Managing MySQL Users
In a production MySQL deployment, allowing applications, developers, or microservices to connect as the `root` superuser is an immense security hazard. Secure database administration mandates creating dedicated user accounts adhering to the **Principle of Least Privilege**.

In MySQL, a user identity consists of two distinct components: the **Username** and the **Host**:
```
'username'@'host'
```

---

### Understanding the Host Component

The host portion dictates from which physical network address or domain the user is allowed to connect:

- `'app_user'@'localhost'`: Allowed to connect **only** from the local machine hosting MySQL (via local UNIX socket or 127.0.0.1).
- `'app_user'@'192.168.1.50'`: Allowed to connect **only** from this specific IP address.
- `'app_user'@'10.0.%.%'`: Allowed to connect from any IP within the `10.0.0.0/16` subnet.
- `'app_user'@'%'`: Allowed to connect from **any host** across the network/internet.

> **Crucial Concept:** `'admin'@'localhost'` and `'admin'@'%'` are treated by MySQL as **two entirely separate accounts** with independent passwords and privileges!

---

### Creating MySQL Users (CREATE USER)

```sql
CREATE USER [IF NOT EXISTS] 'username'@'hostname' 
IDENTIFIED BY 'strong_password';
```

#### Real-World Examples:
```sql
-- 1. Create a local web application user
CREATE USER 'webapp'@'localhost' 
IDENTIFIED BY 'SecureAppPass!2026';

-- 2. Create a reporting analyst user allowed from the office VPN
CREATE USER 'bi_analyst'@'192.168.10.%' 
IDENTIFIED BY 'Analyst#Pass987';

-- 3. Create a microservice user connecting from any container in AWS ECS
CREATE USER 'orders_service'@'%' 
IDENTIFIED BY 'MicroServiceKey$2026';
```

---

### Authentication Plugins: caching_sha2_password vs mysql_native_password

Starting in MySQL 8.0, the default authentication plugin is **`caching_sha2_password`**, providing SHA-256 password hashing and secure RSA key-pair exchanges.

If an older legacy application driver (e.g., an outdated PHP 5.6 or Python 2 client) fails to connect, you can specify the legacy plugin:
```sql
CREATE USER 'legacy_app'@'%' 
IDENTIFIED WITH mysql_native_password BY 'OldPass123';
```

---

### Altering User Passwords and Renaming Users

```sql
-- Change an existing user's password
ALTER USER 'webapp'@'localhost' 
IDENTIFIED BY 'NewUpdatedPassword$2026';

-- Rename a user account
RENAME USER 'webapp'@'localhost' TO 'ecommerce_app'@'localhost';
```

---

### Listing and Deleting Users

All user accounts are stored in the `user` table of the system `mysql` database:

```sql
-- View all configured accounts and their authentication plugins
SELECT user, host, plugin, account_locked 
FROM mysql.user;

-- Safely delete an obsolete user
DROP USER IF EXISTS 'old_service'@'%';
```

---

# Multiple Choice Questions

### 1. In MySQL, how is a complete user account uniquely identified?
A. By username only
B. By 'username'@'hostname'
C. By email address
D. By primary key integer
**Answer:** B
**Explanation:** MySQL accounts are identified by the combination of username and host (e.g., 'app'@'localhost').
---

### 2. What does the wildcard '%' mean in 'developer'@'%'?
A. The user has 100% root privileges
B. The user can connect from any network host or IP address
C. The user password expires after 30 days
D. The account is disabled
**Answer:** B
**Explanation:** The percent sign '%' is a wildcard indicating the user may connect from any client IP address.
---

### 3. What is the default authentication plugin in MySQL 8.0?
A. mysql_native_password
B. caching_sha2_password
C. md5_crypt
D. pam_ldap
**Answer:** B
**Explanation:** MySQL 8.0 uses caching_sha2_password as its default authentication plugin for improved cryptographic security.
---

### 4. Which SQL command permanently deletes a MySQL user account?
A. DELETE USER 'john'@'localhost';
B. REMOVE USER 'john'@'localhost';
C. DROP USER IF EXISTS 'john'@'localhost';
D. TRUNCATE USER 'john'@'localhost';
**Answer:** C
**Explanation:** DROP USER is the standard DDL statement to remove MySQL user accounts and clean up their associated privilege rows.
---

### 5. In which system table does MySQL store user account definitions and authentication credentials?
A. performance_schema.users
B. information_schema.accounts
C. mysql.user
D. sys.credentials
**Answer:** C
**Explanation:** User metadata, hosts, password hashes, and global permissions are stored in the mysql.user system catalog table.
---
