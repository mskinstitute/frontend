---
id: project-ecommerce-relational-database
slug: project-ecommerce-relational-database
course: sql-for-intermediate
chapter: Intermediate Capstone Projects
topic: "Project 1: Multi-Table E-Commerce Platform Database"
difficulty: Intermediate
readingTime: 20
order: 47
keywords: ["project","ecommerce schema","relational database design","multi-table joins","mysql capstone"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 1: Multi-Table E-Commerce Platform Database
### Capstone Project 1: Multi-Table E-Commerce Platform Database

Welcome to the first Intermediate Capstone Project! In this comprehensive hands-on project, you will design, implement, populate, and query a production-ready **Relational E-Commerce Database**.

You will bridge everything learned across multi-table relationships, foreign key cascade constraints, multi-table joins, views, and Common Table Expressions.

---

### 1. Architectural Schema Design

Our platform consists of 5 normalized relational tables:
1. `customers`: Core user identity and contact details.
2. `categories`: Self-referencing hierarchical product categories.
3. `products`: Catalog items linked to categories.
4. `orders`: Order headers linked to customers.
5. `order_items`: Line-item junction table bridging orders and products with historical prices.

```
[customers] 1 ────< N [orders] 1 ────< N [order_items] N >──── 1 [products]
                                                                     │
                                                              [categories] (Parent/Child)
```

---

### 2. Complete DDL Implementation Script

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_platform_db;
USE ecommerce_platform_db;

-- 1. Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 2. Hierarchical Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    CONSTRAINT fk_cat_parent 
        FOREIGN KEY (parent_id) REFERENCES categories(category_id) 
        ON DELETE SET NULL
) ENGINE = InnoDB;

-- 3. Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    sku VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    retail_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_prod_category 
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE = InnoDB;

-- 4. Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    CONSTRAINT fk_order_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
        ON DELETE RESTRICT
) ENGINE = InnoDB;

-- 5. Order Items Junction Table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_item_order 
        FOREIGN KEY (order_id) REFERENCES orders(order_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_item_product 
        FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE = InnoDB;
```

---

### 3. Inserting Realistic Seed Data

```sql
-- Seed Customers
INSERT INTO customers (first_name, last_name, email, country) VALUES
('Liam', 'Smith', 'liam.smith@example.com', 'USA'),
('Emma', 'Johnson', 'emma.j@example.com', 'UK'),
('Noah', 'Williams', 'noah.w@example.com', 'Canada'),
('Olivia', 'Brown', 'olivia.b@example.com', 'USA');

-- Seed Hierarchical Categories
INSERT INTO categories (category_id, name, parent_id) VALUES
(1, 'Electronics', NULL),
(2, 'Computers', 1),
(3, 'Laptops', 2),
(4, 'Audio', 1),
(5, 'Headphones', 4);

-- Seed Products
INSERT INTO products (category_id, sku, name, cost_price, retail_price, stock_quantity) VALUES
(3, 'LAP-MAC-16', 'MacBook Pro 16"', 1800.00, 2499.00, 25),
(3, 'LAP-XPS-15', 'Dell XPS 15', 1200.00, 1699.00, 40),
(5, 'AUD-WH-1000', 'Sony WH-1000XM5 Headphones', 220.00, 399.00, 80),
(5, 'AUD-AIR-MAX', 'Apple AirPods Max', 350.00, 549.00, 15);

-- Seed Orders
INSERT INTO orders (order_id, customer_id, order_date, status) VALUES
(1001, 1, '2026-08-01 10:30:00', 'delivered'),
(1002, 2, '2026-08-05 14:15:00', 'delivered'),
(1003, 1, '2026-08-10 16:45:00', 'shipped'),
(1004, 3, '2026-08-12 09:00:00', 'pending');

-- Seed Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1001, 1, 1, 2499.00),
(1001, 3, 2, 399.00),
(1002, 2, 1, 1699.00),
(1003, 4, 1, 549.00),
(1004, 3, 1, 399.00);
```

---

### 4. Advanced Analytics & Production Queries

#### Query A: Customer Lifetime Value (LTV) with Revenue Ranking
```sql
WITH CustomerSpend AS (
    SELECT 
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        c.country,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0.00) AS total_spent,
        COUNT(DISTINCT o.order_id) AS orders_count
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status != 'cancelled'
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY c.customer_id, c.first_name, c.last_name, c.country
)
SELECT 
    full_name,
    country,
    orders_count,
    total_spent,
    DENSE_RANK() OVER (ORDER BY total_spent DESC) AS revenue_rank
FROM CustomerSpend;
```

#### Query B: Product Gross Margin & Sales Velocity View
```sql
CREATE OR REPLACE VIEW v_product_performance AS
SELECT 
    p.product_id,
    p.name AS product_name,
    p.retail_price,
    ROUND((p.retail_price - p.cost_price), 2) AS unit_margin,
    ROUND(((p.retail_price - p.cost_price) / p.retail_price) * 100, 1) AS margin_percentage,
    COALESCE(SUM(oi.quantity), 0) AS total_units_sold,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0.00) AS gross_revenue
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name, p.retail_price, p.cost_price;

-- Query top margin generators:
SELECT * FROM v_product_performance ORDER BY gross_revenue DESC;
```

---

# Multiple Choice Questions

### 1. Why does order_items store unit_price when products table already contains retail_price?
A. MySQL requires all numbers to be duplicated
B. To preserve the historical price at the moment of purchase even if product price changes in the future
C. Because order_items cannot hold foreign keys
D. To speed up full table scans
**Answer:** B
**Explanation:** Product prices fluctuate over time. Capturing unit_price in order_items preserves accurate historical billing records.
---

### 2. In our schema, what happens to order_items when an order is deleted, based on ON DELETE CASCADE?
A. The deletion is rejected with an error
B. All corresponding child line items in order_items are automatically deleted
C. The product records are deleted
D. The customer is notified by email
**Answer:** B
**Explanation:** ON DELETE CASCADE guarantees that deleting an order removes all associated line items in order_items automatically.
---

### 3. What relationship exists between orders and products?
A. One-to-One (1:1)
B. One-to-Many (1:N)
C. Many-to-Many (M:N) mediated by order_items
D. Self-referencing recursive
**Answer:** C
**Explanation:** Orders and Products share an M:N relationship, where one order contains multiple products and one product appears in multiple orders via the order_items junction table.
---

### 4. Which category relationship model was implemented in categories?
A. Many-to-Many cross join
B. Self-referencing recursive hierarchy via parent_id
C. Star schema dimension
D. JSON array column
**Answer:** B
**Explanation:** The categories table uses a self-referencing foreign key (parent_id REFERENCES categories(category_id)) to model arbitrary tree depths.
---

### 5. Why is ON DELETE RESTRICT specified on the customer_id foreign key in orders?
A. To prevent deleting customers who have existing purchase history
B. To force customer accounts to renew annually
C. To prevent customers from ordering twice
D. To disable indexes on customers
**Answer:** A
**Explanation:** ON DELETE RESTRICT guarantees referential integrity by preventing deletion of customer records that have associated historical orders.
---
