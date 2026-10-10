---
id: implementing-audit-logging-with-triggers
slug: implementing-audit-logging-with-triggers
course: sql-for-advanced
chapter: Database Triggers
topic: "Building an Automated Audit Logging System with Triggers"
difficulty: Advanced
readingTime: 14
order: 24
keywords: ["audit logging","audit trail","compliance trigger","change data capture","user tracking"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Building an Automated Audit Logging System with Triggers
Regulatory frameworks (such as HIPAA, SOC2, and PCI-DSS) require software systems to maintain an immutable, tamper-evident **Audit Trail** of all changes made to sensitive data.

Relying on application code to record audit entries is dangerous: developers might forget to add audit calls, or direct modifications executed via the MySQL CLI would bypass auditing completely.

**Database Triggers** guarantee that 100% of modifications are logged at the storage layer.

---

### Step 1: Designing the Centralized Audit Table

```sql
CREATE TABLE audit_log (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    operation_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id INT NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    old_data JSON NULL,
    new_data JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;
```

By storing row snapshots in **JSON**, a single audit table can track changes across *any* table regardless of differing schema columns!

---

### Step 2: Implementing the INSERT Audit Trigger

```sql
DELIMITER //

CREATE TRIGGER trg_audit_products_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name, 
        operation_type, 
        record_id, 
        changed_by, 
        old_data, 
        new_data
    )
    VALUES (
        'products',
        'INSERT',
        NEW.product_id,
        USER(), -- Captures 'username'@'hostname' of connecting client
        NULL,
        JSON_OBJECT(
            'sku', NEW.sku,
            'name', NEW.name,
            'retail_price', NEW.retail_price
        )
    );
END //

DELIMITER ;
```

---

### Step 3: Implementing the UPDATE Audit Trigger

```sql
DELIMITER //

CREATE TRIGGER trg_audit_products_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- Log update only if price or name actually changed
    IF OLD.retail_price != NEW.retail_price OR OLD.name != NEW.name THEN
        INSERT INTO audit_log (
            table_name, 
            operation_type, 
            record_id, 
            changed_by, 
            old_data, 
            new_data
        )
        VALUES (
            'products',
            'UPDATE',
            NEW.product_id,
            USER(),
            JSON_OBJECT('name', OLD.name, 'retail_price', OLD.retail_price),
            JSON_OBJECT('name', NEW.name, 'retail_price', NEW.retail_price)
        );
    END IF;
END //

DELIMITER ;
```

---

### Step 4: Implementing the DELETE Audit Trigger

```sql
DELIMITER //

CREATE TRIGGER trg_audit_products_delete
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name, 
        operation_type, 
        record_id, 
        changed_by, 
        old_data, 
        new_data
    )
    VALUES (
        'products',
        'DELETE',
        OLD.product_id,
        USER(),
        JSON_OBJECT('sku', OLD.sku, 'name', OLD.name, 'retail_price', OLD.retail_price),
        NULL
    );
END //

DELIMITER ;
```

---

### Querying the Audit History

Now, auditors can track the entire forensic history of any item:

```sql
SELECT 
    audit_id,
    operation_type,
    changed_by,
    created_at,
    JSON_UNQUOTE(JSON_EXTRACT(old_data, '$.retail_price')) AS old_price,
    JSON_UNQUOTE(JSON_EXTRACT(new_data, '$.retail_price')) AS new_price
FROM audit_log
WHERE record_id = 501 AND table_name = 'products'
ORDER BY created_at DESC;
```

---

# Multiple Choice Questions

### 1. Why is database-level trigger auditing superior to application-level auditing?
A. Triggers run faster than C++ code
B. Triggers capture 100% of data modifications, including direct manual edits made via the MySQL CLI or external scripts
C. Triggers do not consume disk space
D. Triggers work without primary keys
**Answer:** B
**Explanation:** Application-level auditing can be bypassed by direct CLI connections or bugs; triggers guarantee comprehensive capture directly at the storage engine boundary.
---

### 2. Which MySQL function captures the identity and host of the database user who performed the modification?
A. CLIENT()
B. USER()
C. WHOAMI()
D. SESSION_NAME()
**Answer:** B
**Explanation:** The USER() function returns the current client connection string in the format 'username'@'hostname'.
---

### 3. Why is JSON an excellent format for storing row states in audit tables?
A. JSON automatically compresses images
B. It allows a single centralized audit table to store arbitrary changing schema columns from multiple tables
C. MySQL requires JSON for all triggers
D. JSON disables transaction locks
**Answer:** B
**Explanation:** JSON enables a unified audit schema to record structured before-and-after snapshots across tables with different numbers of columns.
---

### 4. Which trigger timing is appropriate for recording audit log entries after a successful modification?
A. BEFORE
B. AFTER
C. INSTEAD OF
D. DELAYED
**Answer:** B
**Explanation:** AFTER triggers ensure that audit rows are generated only after the parent row modification has succeeded.
---

### 5. If the main table update is rolled back, what happens to the audit row inserted by the AFTER UPDATE trigger?
A. It remains saved in the audit table
B. It is automatically rolled back along with the transaction
C. It moves to an error queue
D. It triggers a server alert
**Answer:** B
**Explanation:** Triggers execute inside the same transactional boundary as the triggering statement; rolling back the parent statement rolls back all trigger operations.
---
