---
id: project-employee-hierarchy-analytics
slug: project-employee-hierarchy-analytics
course: sql-for-intermediate
chapter: Intermediate Capstone Projects
topic: "Project 3: Corporate Employee Hierarchy & Departmental Analytics Engine"
difficulty: Intermediate
readingTime: 20
order: 49
keywords: ["org chart project","recursive cte project","department analytics","analytics engine","mysql capstone"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 3: Corporate Employee Hierarchy & Departmental Analytics Engine
### Capstone Project 3: Corporate Employee Hierarchy & Departmental Analytics Engine

Enterprise organizations are complex structures containing multi-tier managerial hierarchies, cross-departmental budgets, and salary grades. 

In this capstone, you will construct a corporate data warehouse schema and deploy an **Analytics Engine** combining **Recursive Common Table Expressions**, **Window Functions**, and **Multi-Table Aggregations** to extract executive insights.

---

### 1. Database Schema & Architecture

Our schema models corporate organizational charts:
- `departments`: Department names, locations, and annual budget caps.
- `employees`: Staff records containing salaries, department associations, and a self-referencing `manager_id`.
- `performance_reviews`: Quarterly performance scores (1.0 to 5.0) evaluated over time.

```sql
CREATE DATABASE IF NOT EXISTS corporate_analytics_db;
USE corporate_analytics_db;

-- 1. Departments
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(50) NOT NULL,
    annual_budget DECIMAL(15, 2) NOT NULL
) ENGINE = InnoDB;

-- 2. Employees with Hierarchical Self-Reference
CREATE TABLE employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    manager_id INT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL,
    hire_date DATE NOT NULL,
    CONSTRAINT fk_emp_dept 
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    CONSTRAINT fk_emp_manager 
        FOREIGN KEY (manager_id) REFERENCES employees(emp_id) 
        ON DELETE SET NULL
) ENGINE = InnoDB;

-- 3. Performance Reviews
CREATE TABLE performance_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    review_period VARCHAR(10) NOT NULL, -- e.g. '2026-Q1'
    rating DECIMAL(2, 1) NOT NULL CHECK (rating BETWEEN 1.0 AND 5.0),
    CONSTRAINT fk_review_emp 
        FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
) ENGINE = InnoDB;
```

---

### 2. Inserting Realistic Enterprise Seed Data

```sql
-- Seed Departments
INSERT INTO departments (dept_id, dept_name, location, annual_budget) VALUES
(1, 'Executive', 'New York', 2000000.00),
(2, 'Engineering', 'San Francisco', 5000000.00),
(3, 'Sales & Marketing', 'New York', 3000000.00);

-- Seed Org Hierarchy
INSERT INTO employees (emp_id, dept_id, manager_id, first_name, last_name, job_title, salary, hire_date) VALUES
(1, 1, NULL, 'Sarah', 'Connor', 'CEO', 450000.00, '2018-01-15'),
(2, 2, 1, 'Alex', 'Murphy', 'VP of Engineering', 280000.00, '2019-03-01'),
(3, 3, 1, 'Jordan', 'Belfort', 'VP of Sales', 260000.00, '2019-06-15'),
(4, 2, 2, 'Ada', 'Lovelace', 'Principal Architect', 210000.00, '2020-01-10'),
(5, 2, 2, 'Alan', 'Turing', 'Lead Dev', 180000.00, '2020-05-20'),
(6, 2, 5, 'Grace', 'Hopper', 'Senior Dev', 150000.00, '2021-02-14'),
(7, 2, 5, 'Linus', 'Torvalds', 'Software Engineer', 125000.00, '2022-08-01'),
(8, 3, 3, 'Don', 'Draper', 'Account Director', 160000.00, '2021-09-01');

-- Seed Performance Reviews
INSERT INTO performance_reviews (emp_id, review_period, rating) VALUES
(4, '2026-Q1', 4.9),
(5, '2026-Q1', 4.7),
(6, '2026-Q1', 4.8),
(7, '2026-Q1', 4.2),
(8, '2026-Q1', 4.5);
```

---

### 3. Executive Analytics Queries

#### Query 1: Complete Organizational Hierarchy Traversal (Recursive CTE)
Unroll the reporting chain from the CEO down to junior developers:

```sql
WITH RECURSIVE OrgTree AS (
    -- 1. Anchor: CEO (Level 1)
    SELECT 
        emp_id,
        CONCAT(first_name, ' ', last_name) AS employee_name,
        job_title,
        manager_id,
        1 AS org_level,
        CAST(first_name AS CHAR(255)) AS management_chain
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 2. Recursive Member: Direct Reports
    SELECT 
        e.emp_id,
        CONCAT(e.first_name, ' ', e.last_name),
        e.job_title,
        e.manager_id,
        o.org_level + 1,
        CONCAT(o.management_chain, ' -> ', e.first_name)
    FROM employees e
    JOIN OrgTree o ON e.manager_id = o.emp_id
)
SELECT 
    org_level,
    employee_name,
    job_title,
    management_chain
FROM OrgTree
ORDER BY management_chain;
```

#### Query 2: Department Salary Benchmarking with Window Functions
Compare each employee's compensation against departmental averages and quartiles:

```sql
SELECT 
    d.dept_name,
    CONCAT(e.first_name, ' ', e.last_name) AS staff_name,
    e.job_title,
    e.salary,
    -- Departmental salary metrics
    ROUND(AVG(e.salary) OVER(PARTITION BY e.dept_id), 2) AS dept_avg_salary,
    ROUND(e.salary - AVG(e.salary) OVER(PARTITION BY e.dept_id), 2) AS diff_from_dept_avg,
    -- Departmental rank
    DENSE_RANK() OVER(PARTITION BY e.dept_id ORDER BY e.salary DESC) AS dept_salary_rank,
    -- Quartile bucket within department
    NTILE(2) OVER(PARTITION BY e.dept_id ORDER BY e.salary DESC) AS salary_tier
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
ORDER BY d.dept_name, dept_salary_rank;
```

#### Query 3: Department Budget Utilization & Headcount View
```sql
CREATE OR REPLACE VIEW v_department_payroll_summary AS
SELECT 
    d.dept_id,
    d.dept_name,
    d.annual_budget,
    COUNT(e.emp_id) AS headcount,
    COALESCE(SUM(e.salary), 0.00) AS total_payroll,
    ROUND(d.annual_budget - COALESCE(SUM(e.salary), 0.00), 2) AS remaining_budget,
    ROUND((COALESCE(SUM(e.salary), 0.00) / d.annual_budget) * 100, 1) AS budget_consumed_pct
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name, d.annual_budget;

-- Query payroll summary:
SELECT * FROM v_department_payroll_summary;
```

---

# Multiple Choice Questions

### 1. In our recursive OrgTree query, what constitutes the Anchor member?
A. The JOIN with departments table
B. The query selecting employees WHERE manager_id IS NULL (the CEO)
C. The UNION ALL operator
D. The DENSE_RANK() window function
**Answer:** B
**Explanation:** The anchor member generates the initial seed row of the tree traversal by identifying the root employee who has no manager (manager_id IS NULL).
---

### 2. What does CAST(first_name AS CHAR(255)) accomplish in the Anchor member of the recursive CTE?
A. Encrypts the employee name
B. Ensures the recursive string column has sufficient allocated character width to prevent string truncation during CONCAT iterations
C. Converts names to lowercase
D. Creates an index on first_name
**Answer:** B
**Explanation:** In recursive CTEs, column data types are inferred from the anchor; casting to a wide CHAR/VARCHAR prevents buffer truncation as strings grow through concat iterations.
---

### 3. Which window function was used to calculate the departmental salary ranking without skipping rank numbers for ties?
A. ROW_NUMBER()
B. DENSE_RANK()
C. RANK()
D. NTILE()
**Answer:** B
**Explanation:** DENSE_RANK() assigns sequential ranks to ordered rows without gaps or skips when duplicate salaries occur.
---

### 4. What does the expression salary - AVG(salary) OVER(PARTITION BY dept_id) calculate?
A. The company's total annual tax obligation
B. The difference between an employee's salary and their department's average compensation
C. The employee's net take-home pay
D. The remaining departmental budget
**Answer:** B
**Explanation:** This window expression subtracts the department's partitioned average salary from the individual employee's salary to show variance.
---

### 5. Why is ON DELETE SET NULL appropriate for the manager_id foreign key constraint?
A. It deletes all employees if the CEO resigns
B. If a manager departs, their direct reports' manager_id becomes NULL rather than deleting the employees
C. It forces all staff to report to human resources
D. It prevents managers from receiving salary increases
**Answer:** B
**Explanation:** ON DELETE SET NULL ensures that removing a supervisor record does not cascade-delete their subordinates; instead, subordinates simply have their manager_id temporarily set to NULL.
---
