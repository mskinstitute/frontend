---
id: project-retail-inventory-management
slug: project-retail-inventory-management
course: sql-for-beginners
chapter: Practical Capstone Projects
topic: "Project 2: Retail Store Inventory Management System"
difficulty: Beginner
readingTime: 15
order: 55
keywords: ["retail inventory project","stock management","sql inventory","product catalog schema","capstone 2"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 2: Retail Store Inventory Management System
In retail, e-commerce, and warehouse operations, profitability hinges on accurate inventory management. A retailer must know when product stock falls below critical thresholds, calculate the total monetary value of warehouse assets, prevent duplicate SKU barcodes, and handle price updates safely.

In this capstone project, you will engineer a complete **Retail Store Inventory Management System** in MySQL.

---

## 1. System Requirements & Schema Design

Our retail inventory system requires:
1. **Product Categories** (Electronics, Apparel, Groceries, Home Goods).
2. **Product Catalog** (Unique SKU, title, purchase cost, retail selling price, stock on hand, reorder thresholds).
3. **Stock Reorder Alerts** & Inventory Valuation Reports.

---

## 2. Step 1: DDL Database & Table Setup

```sql
CREATE DATABASE IF NOT EXISTS msk_retail_inventory
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE msk_retail_inventory;

-- Table 1: Product Categories
CREATE TABLE IF NOT EXISTS categories (
    category_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    tax_rate DECIMAL(4, 2) NOT NULL DEFAULT 18.00 -- Standard 18% GST
) ENGINE = InnoDB;

-- Table 2: Product Master Inventory
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    sku_code VARCHAR(20) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    cost_price DECIMAL(10, 2) NOT NULL,
    retail_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reorder_threshold INT UNSIGNED NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_restocked_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Constraints
    CONSTRAINT chk_profit_margin CHECK (retail_price >= cost_price),
    CONSTRAINT fk_items_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE = InnoDB;
```

---

## 3. Step 2: DML Stock Ingestion

```sql
-- Populate Categories:
INSERT INTO categories (category_name, tax_rate) VALUES
    ('Electronics', 18.00),
    ('Office Stationery', 12.00),
    ('Beverages', 5.00),
    ('Computer Accessories', 18.00);

-- Populate Inventory Items:
INSERT INTO inventory_items 
    (sku_code, item_name, category_id, cost_price, retail_price, stock_quantity, reorder_threshold, last_restocked_at) 
VALUES
    ('SKU-ELEC-001', 'Noise-Cancelling Wireless Headphones', 1, 4500.00, 7999.00, 4, 15, '2026-02-10 10:00:00'),
    ('SKU-ELEC-002', '4K Ultra-HD Monitor 27-inch', 1, 14000.00, 21999.00, 18, 5, '2026-02-15 14:30:00'),
    ('SKU-ACC-001', 'Ergonomic Optical Mouse', 4, 350.00, 799.00, 65, 20, '2026-01-20 09:00:00'),
    ('SKU-ACC-002', 'Mechanical Gaming Keyboard', 4, 1800.00, 3499.00, 8, 12, '2026-02-01 16:00:00'),
    ('SKU-STAT-001', 'A4 Executive Notebook 200 Pages', 2, 60.00, 150.00, 120, 30, '2026-01-10 11:00:00'),
    ('SKU-BEV-001', 'Organic Roasted Green Tea 250g', 3, 180.00, 350.00, 2, 25, '2026-02-28 08:45:00');
```

---

## 4. Step 3: Production Warehouse Queries

```sql
-- Query 1: Automated Low-Stock Reorder Alert
-- Find all items where current stock is at or below the reorder threshold:
SELECT 
    sku_code,
    item_name,
    stock_quantity,
    reorder_threshold,
    (reorder_threshold - stock_quantity) AS units_needed_to_reorder
FROM inventory_items
WHERE is_active = TRUE 
  AND stock_quantity <= reorder_threshold
ORDER BY stock_quantity ASC;

-- Query 2: Warehouse Asset Valuation Report
-- Calculate total wholesale asset value vs projected retail revenue per category:
SELECT 
    category_id,
    COUNT(*) AS total_skus,
    SUM(stock_quantity) AS total_physical_items,
    SUM(cost_price * stock_quantity) AS total_cost_valuation,
    SUM(retail_price * stock_quantity) AS total_retail_valuation,
    SUM((retail_price - cost_price) * stock_quantity) AS projected_gross_profit
FROM inventory_items
GROUP BY category_id
ORDER BY projected_gross_profit DESC;

-- Query 3: Stock Refill Operation (Restocking)
-- Restock 'Noise-Cancelling Wireless Headphones' with 50 units:
UPDATE inventory_items
SET stock_quantity = stock_quantity + 50,
    last_restocked_at = CURRENT_TIMESTAMP
WHERE sku_code = 'SKU-ELEC-001';
```

---

## 5. Capstone Takeaways

This project illustrates how database constraints protect business viability:
- The `chk_profit_margin` constraint ensures products cannot be accidentally listed for less than wholesale cost.
- Mathematical aggregations compute live warehouse valuations without manual spreadsheet calculations.

---

# Multiple Choice Questions

### 1. In Query 1, how is the low-stock condition identified?
A. WHERE stock_quantity = 0
B. WHERE is_active = TRUE AND stock_quantity <= reorder_threshold
C. WHERE stock_quantity > 100
D. HAVING stock_quantity < 10
**Answer:** B
**Explanation:** Comparing `stock_quantity <= reorder_threshold` identifies items whose inventory has depleted to or below the designated reorder trigger.
---

### 2. What business protection does the constraint `CHECK (retail_price >= cost_price)` enforce?
A. It ensures customers receive a 50% discount
B. It guarantees that an item cannot be sold at a price lower than its wholesale acquisition cost
C. It limits retail prices to under ₹1,000
D. It prevents returns
**Answer:** B
**Explanation:** The check constraint mandates that the retail selling price must equal or exceed the cost price, preventing accidental negative-margin sales.
---

### 3. How does Query 3 perform a safe relative inventory update?
A. By replacing the row with REPLACE INTO
B. By using `stock_quantity = stock_quantity + 50` and updating the timestamp
C. By deleting the item and re-inserting it
D. By setting stock to 50
**Answer:** B
**Explanation:** Relative arithmetic updates add the new shipment to the existing count without risking overwriting concurrent sales.
---

### 4. What does `SUM((retail_price - cost_price) * stock_quantity)` calculate?
A. Total tax owed
B. Total projected gross profit across all available units of inventory
C. Total shipping charges
D. Average price per SKU
**Answer:** B
**Explanation:** The margin per unit (`retail_price - cost_price`) multiplied by total units on hand computes total potential gross profit.
---

### 5. Why is `sku_code` marked as `UNIQUE` in the table definition?
A. To prevent multiple different products from sharing the same barcode / stock keeping unit
B. To hide the SKU from users
C. To force the SKU to be a number
D. Because foreign keys require it
**Answer:** A
**Explanation:** A Stock Keeping Unit (SKU) must be unique to ensure inventory tracking and barcode scans map to exactly one product.
---
