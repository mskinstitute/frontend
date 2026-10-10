---
id: project-enterprise-audit-and-compliance-system
slug: project-enterprise-audit-and-compliance-system
course: sql-for-advanced
chapter: Production Capstone Projects
topic: "Project 3: Enterprise Compliance & Automated Event Audit Engine"
difficulty: Advanced
readingTime: 25
order: 42
keywords: ["compliance capstone","audit engine","trigger project","forensics","json audit trail","advanced capstone"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 3: Enterprise Compliance & Automated Event Audit Engine
### Advanced Capstone Project 3: Enterprise Compliance & Automated Event Audit Engine

In enterprise environments governed by PCI-DSS, HIPAA, and GDPR regulations, database modifications must be permanently recorded in an immutable, forensic audit trail. 

In this capstone, you will architect an **Automated Event Audit & Compliance Engine** utilizing **Row-Level Triggers**, **Immutable JSON Event Logs**, and **Analytical Anomaly Detection Queries**.

---

### 1. Database Schema DDL

```sql
CREATE DATABASE IF NOT EXISTS compliance_audit_db;
USE compliance_audit_db;

-- 1. Sensitive Master Table: Corporate Payroll & Salaries
CREATE TABLE employee_compensation (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    base_salary DECIMAL(12, 2) NOT NULL,
    bonus_percentage DECIMAL(4, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_modified_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    last_modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 2. Immutable Compliance Audit Ledger
CREATE TABLE compliance_audit_trail (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id INT NOT NULL,
    client_user VARCHAR(100) NOT NULL,
    client_ip VARCHAR(50) NOT NULL,
    delta_payload JSON NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;
```

---

### 2. Enforcing Immutability via Trigger Protection

An audit log is useless if an attacker or rogue administrator can modify or delete audit rows! We enforce **Append-Only Immutability** directly using triggers that reject `UPDATE` and `DELETE` on the audit table:

```sql
DELIMITER //

-- Reject any attempts to UPDATE audit records!
CREATE TRIGGER trg_protect_audit_update
BEFORE UPDATE ON compliance_audit_trail
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SECURITY VIOLATION: Compliance audit records are immutable and cannot be updated!';
END //

-- Reject any attempts to DELETE audit records!
CREATE TRIGGER trg_protect_audit_delete
BEFORE DELETE ON compliance_audit_trail
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SECURITY VIOLATION: Compliance audit records cannot be deleted!';
END //

DELIMITER ;
```

---

### 3. Deploying the Change Data Capture (CDC) Triggers

```sql
DELIMITER //

-- Audit Trigger for INSERT
CREATE TRIGGER trg_comp_audit_insert
AFTER INSERT ON employee_compensation
FOR EACH ROW
BEGIN
    INSERT INTO compliance_audit_trail (
        table_name, action_type, record_id, client_user, client_ip, delta_payload
    )
    VALUES (
        'employee_compensation',
        'INSERT',
        NEW.emp_id,
        USER(),
        SUBSTRING_INDEX(USER(), '@', -1),
        JSON_OBJECT(
            'new_state', JSON_OBJECT(
                'name', NEW.employee_name,
                'salary', NEW.base_salary,
                'bonus', NEW.bonus_percentage
            )
        )
    );
END //

-- Audit Trigger for UPDATE (Captures Before AND After deltas!)
CREATE TRIGGER trg_comp_audit_update
AFTER UPDATE ON employee_compensation
FOR EACH ROW
BEGIN
    -- Log only if financial fields or active status changed
    IF OLD.base_salary != NEW.base_salary 
       OR OLD.bonus_percentage != NEW.bonus_percentage 
       OR OLD.is_active != NEW.is_active THEN
       
        INSERT INTO compliance_audit_trail (
            table_name, action_type, record_id, client_user, client_ip, delta_payload
        )
        VALUES (
            'employee_compensation',
            'UPDATE',
            NEW.emp_id,
            USER(),
            SUBSTRING_INDEX(USER(), '@', -1),
            JSON_OBJECT(
                'old_state', JSON_OBJECT(
                    'salary', OLD.base_salary,
                    'bonus', OLD.bonus_percentage,
                    'is_active', OLD.is_active
                ),
                'new_state', JSON_OBJECT(
                    'salary', NEW.base_salary,
                    'bonus', NEW.bonus_percentage,
                    'is_active', NEW.is_active
                ),
                'salary_delta', NEW.base_salary - OLD.base_salary
            )
        );
    END IF;
END //

DELIMITER ;
```

---

### 4. Testing Compliance & Forensic Analytics

```sql
-- 1. Insert sample staff
INSERT INTO employee_compensation (employee_name, department, base_salary, bonus_percentage)
VALUES ('Dr. Elizabeth Shaw', 'Research', 140000.00, 0.10);

-- 2. Execute salary increase
UPDATE employee_compensation 
SET base_salary = 165000.00 
WHERE emp_id = 1;

-- 3. Verify that rogue attempts to alter the audit log are BLOCKED!
-- This will FAIL with custom security exception!
UPDATE compliance_audit_trail SET client_user = 'hacker' WHERE audit_id = 1;
-- ERROR 1644 (45000): SECURITY VIOLATION: Compliance audit records are immutable and cannot be updated!
```

---

### 5. Compliance Forensic Reporting Query

Auditors want to see any salary changes exceeding $10,000 within the last 30 days:

```sql
SELECT 
    audit_id,
    record_id AS employee_id,
    client_user,
    timestamp,
    delta_payload->>'$.old_state.salary' AS previous_salary,
    delta_payload->>'$.new_state.salary' AS new_salary,
    CAST(delta_payload->>'$.salary_delta' AS DECIMAL(10,2)) AS net_increase
FROM compliance_audit_trail
WHERE action_type = 'UPDATE'
  AND CAST(delta_payload->>'$.salary_delta' AS DECIMAL(10,2)) >= 10000.00
ORDER BY timestamp DESC;
```

---

# Multiple Choice Questions

### 1. How does our compliance system enforce that audit records cannot be tampered with or deleted by rogue administrators?
A. By removing the root account
B. By implementing BEFORE UPDATE and BEFORE DELETE triggers on the audit table that raise a SIGNAL exception
C. By saving data on a blockchain
D. By setting autocommit to 0
**Answer:** B
**Explanation:** BEFORE UPDATE and BEFORE DELETE triggers intercept modification attempts on the audit log and abort them with custom security exceptions.
---

### 2. What does SUBSTRING_INDEX(USER(), '@', -1) extract?
A. The username
B. The client IP address or hostname from the connection string
C. The database port
D. The password hash
**Answer:** B
**Explanation:** Because USER() returns 'username'@'host', taking the substring after the '@' isolates the client host or IP.
---

### 3. Why is the salary_delta explicitly calculated and stored in the update audit JSON payload?
A. MySQL cannot perform subtraction
B. It provides an instant forensic metric for filtering large anomalous salary jumps without re-calculating differentials
C. To comply with UTF-8 encoding
D. To prevent table fragmentation
**Answer:** B
**Explanation:** Storing pre-calculated differentials allows compliance queries to filter directly on high-magnitude anomalies.
---

### 4. What happens if a statement updating employee_compensation fails due to a check constraint?
A. The audit record is still saved
B. The transaction is aborted, and any audit rows generated by the trigger during that statement are rolled back
C. The audit log is corrupted
D. A warning is logged
**Answer:** B
**Explanation:** Triggers participate in the transactional unit of the activating statement; if the statement fails, trigger writes are rolled back.
---

### 5. Under what regulatory standards is immutable audit logging mandatory?
A. CSS3 and HTML5
B. HIPAA, PCI-DSS, SOC2, and GDPR
C. RFC 2616
D. IEEE 802.11
**Answer:** B
**Explanation:** Regulatory frameworks such as HIPAA, PCI-DSS, and SOC2 mandate immutable audit trails for sensitive financial and personal data.
---
