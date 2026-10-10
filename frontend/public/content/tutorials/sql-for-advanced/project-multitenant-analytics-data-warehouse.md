---
id: project-multitenant-analytics-data-warehouse
slug: project-multitenant-analytics-data-warehouse
course: sql-for-advanced
chapter: Production Capstone Projects
topic: "Project 2: Multi-Tenant Analytics Warehouse with Partitioning"
difficulty: Advanced
readingTime: 25
order: 41
keywords: ["data warehouse capstone","partitioning project","multi-tenant analytics","json analytics","advanced capstone"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 2: Multi-Tenant Analytics Warehouse with Partitioning
### Advanced Capstone Project 2: Multi-Tenant Analytics Warehouse with Partitioning

In software-as-a-service (SaaS) business models, multi-tenant databases store telemetry and analytics data for thousands of corporate tenants in a shared data warehouse. As event volume scales into tens of millions of records per month, architects must leverage **Range Partitioning**, **Virtual Columns**, and **Window Functions** to deliver sub-second analytical reporting.

---

### 1. Warehouse Architecture & Schema DDL

```sql
CREATE DATABASE IF NOT EXISTS saas_analytics_dw;
USE saas_analytics_dw;

-- 1. Tenants Master Table
CREATE TABLE tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    plan_tier ENUM('STARTER', 'GROWTH', 'ENTERPRISE') NOT NULL,
    created_at DATE NOT NULL
) ENGINE = InnoDB;

-- 2. Partitioned Telemetry Event Stream
CREATE TABLE tenant_event_logs (
    event_id BIGINT AUTO_INCREMENT NOT NULL,
    tenant_id INT NOT NULL,
    event_name VARCHAR(50) NOT NULL,
    event_timestamp DATETIME NOT NULL,
    payload JSON NOT NULL,
    
    -- Virtual Generated Column extracting response latency from JSON
    latency_ms INT GENERATED ALWAYS AS (payload->>'$.response_time_ms') VIRTUAL,
    
    -- Mandatory composite primary key including the partitioning column!
    PRIMARY KEY (event_id, event_timestamp),
    INDEX idx_tenant_time (tenant_id, event_timestamp),
    INDEX idx_latency (latency_ms)
) ENGINE = InnoDB
PARTITION BY RANGE (YEAR(event_timestamp)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

---

### 2. Populating Enterprise Seed Data

```sql
-- Seed Tenants
INSERT INTO tenants (tenant_id, company_name, plan_tier, created_at) VALUES
(1, 'Acme Cloud Corp', 'ENTERPRISE', '2024-01-10'),
(2, 'Starlight Media', 'GROWTH', '2024-06-15'),
(3, 'Nexus Fintech', 'ENTERPRISE', '2025-02-01');

-- Seed Event Telemetry
INSERT INTO tenant_event_logs (tenant_id, event_name, event_timestamp, payload) VALUES
(1, 'api_request', '2025-08-10 10:15:00', '{"endpoint": "/v1/users", "response_time_ms": 45, "status": 200}'),
(1, 'api_request', '2025-08-10 10:16:00', '{"endpoint": "/v1/reports", "response_time_ms": 320, "status": 200}'),
(1, 'api_request', '2025-08-10 10:17:00', '{"endpoint": "/v1/users", "response_time_ms": 52, "status": 200}'),
(2, 'api_request', '2025-08-10 11:00:00', '{"endpoint": "/v1/stream", "response_time_ms": 110, "status": 200}'),
(3, 'api_request', '2025-08-10 12:30:00', '{"endpoint": "/v1/transfer", "response_time_ms": 850, "status": 504}'),
(1, 'api_request', '2026-01-05 09:00:00', '{"endpoint": "/v1/billing", "response_time_ms": 65, "status": 200}');
```

---

### 3. High-Performance Executive Analytics Queries

#### Query 1: Partition-Pruned Latency Percentiles per Tenant
Calculate average, 95th percentile, and moving average latency while pruning to partition `p2025`:

```sql
EXPLAIN 
SELECT 
    t.company_name,
    e.event_timestamp,
    e.latency_ms,
    -- Running average latency for tenant
    ROUND(
        AVG(e.latency_ms) OVER (
            PARTITION BY e.tenant_id 
            ORDER BY e.event_timestamp 
            ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
        ), 
        1
    ) AS rolling_latency_avg,
    -- Percentile rank of latency
    ROUND(PERCENT_RANK() OVER (PARTITION BY e.tenant_id ORDER BY e.latency_ms ASC), 3) AS latency_percentile
FROM tenant_event_logs e
JOIN tenants t ON e.tenant_id = t.tenant_id
WHERE e.event_timestamp >= '2025-01-01' AND e.event_timestamp < '2026-01-01'
ORDER BY t.company_name, e.event_timestamp;
```

#### Query 2: Multi-Tenant JSON SLA Compliance Dashboard View
```sql
CREATE OR REPLACE VIEW v_tenant_sla_metrics AS
SELECT 
    t.tenant_id,
    t.company_name,
    t.plan_tier,
    COUNT(e.event_id) AS total_requests,
    ROUND(AVG(e.latency_ms), 1) AS avg_latency_ms,
    MAX(e.latency_ms) AS max_latency_ms,
    -- Count SLA breaches (latency > 500ms)
    SUM(CASE WHEN e.latency_ms > 500 THEN 1 ELSE 0 END) AS sla_breaches,
    ROUND(
        (SUM(CASE WHEN e.latency_ms <= 500 THEN 1 ELSE 0 END) / COUNT(e.event_id)) * 100, 
        2
    ) AS sla_compliance_percentage
FROM tenants t
LEFT JOIN tenant_event_logs e ON t.tenant_id = e.tenant_id
GROUP BY t.tenant_id, t.company_name, t.plan_tier;

-- Query SLA compliance view
SELECT * FROM v_tenant_sla_metrics;
```

---

# Multiple Choice Questions

### 1. Why was PRIMARY KEY (event_id, event_timestamp) defined on tenant_event_logs?
A. MySQL requires all primary keys to have two columns
B. MySQL mandates that the partitioning column (event_timestamp) must be included in the primary key
C. To prevent foreign keys from working
D. To disable auto-increment
**Answer:** B
**Explanation:** MySQL table partitioning rules dictate that the partitioning key must be part of every unique index, including the Primary Key.
---

### 2. What allows the query WHERE latency_ms > 500 to utilize an index even though the latency value is stored in JSON?
A. Full-Text indexing
B. A B+Tree index defined on the VIRTUAL generated column (latency_ms)
C. Memory tables
D. Adaptive Hash Index only
**Answer:** B
**Explanation:** Virtual generated columns extract scalar JSON values into an indexable B+Tree structure without storing duplicate row text on disk.
---

### 3. Which partition is scanned when querying WHERE event_timestamp BETWEEN '2025-06-01' AND '2025-07-01'?
A. All partitions (p2024, p2025, p2026, p_future)
B. Only partition p2025 (Partition Pruning)
C. None
D. p_future only
**Answer:** B
**Explanation:** The optimizer executes partition pruning, reading only the single physical partition corresponding to year 2025.
---

### 4. What does the rolling_latency_avg calculation demonstrate?
A. An unindexed full table scan
B. A 6-row sliding window frame (ROWS BETWEEN 5 PRECEDING AND CURRENT ROW) smoothing response time spikes
C. An uncommitted dirty read
D. A deadlock condition
**Answer:** B
**Explanation:** The sliding window frame calculates a rolling average across the 5 preceding rows plus the current row per tenant.
---

### 5. How can 2024 telemetry data be instantly removed at the end of its retention window without downtime?
A. DELETE FROM tenant_event_logs WHERE YEAR(event_timestamp) = 2024;
B. ALTER TABLE tenant_event_logs DROP PARTITION p2024;
C. DROP TABLE tenant_event_logs;
D. TRUNCATE DATABASE;
**Answer:** B
**Explanation:** DROP PARTITION p2024 deletes all 2024 records near-instantaneously via file unlinking with minimal lock impact.
---
