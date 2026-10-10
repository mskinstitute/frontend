-- ==============================================================
-- MSK Institute of Technology - Practice Database Dump
-- Database: retail_store_analytics
-- Target: MySQL / MariaDB / Power BI DirectQuery
-- ==============================================================

DROP DATABASE IF EXISTS `retail_store_analytics`;
CREATE DATABASE `retail_store_analytics` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `retail_store_analytics`;

-- 1. Dim_Customers Table
CREATE TABLE `customers` (
  `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) UNIQUE NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `registration_date` DATE NOT NULL,
  `customer_segment` ENUM('Retail', 'Corporate', 'Wholesale') DEFAULT 'Retail'
);

-- 2. Dim_Products Table
CREATE TABLE `products` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `sub_category` VARCHAR(50) NOT NULL,
  `unit_cost` DECIMAL(10,2) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `stock_quantity` INT DEFAULT 100
);

-- 3. Fact_Orders Table
CREATE TABLE `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `shipping_status` ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Delivered',
  `payment_method` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE
);

-- 4. Fact_Order_Items Table
CREATE TABLE `order_items` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `discount_rate` DECIMAL(4,2) DEFAULT 0.00,
  `line_total` DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_rate)) STORED,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT
);

-- -------------------------------------------------------------
-- Seed Data Insertion
-- -------------------------------------------------------------
INSERT INTO `customers` (`full_name`, `email`, `city`, `state`, `registration_date`, `customer_segment`) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', 'New Delhi', 'Delhi', '2024-01-15', 'Corporate'),
('Pooja Verma', 'pooja.verma@example.com', 'Mumbai', 'Maharashtra', '2024-02-10', 'Retail'),
('Rahul Patel', 'rahul.patel@example.com', 'Ahmedabad', 'Gujarat', '2024-03-01', 'Wholesale'),
('Sneha Reddy', 'sneha.reddy@example.com', 'Hyderabad', 'Telangana', '2024-03-22', 'Retail'),
('Vikram Singh', 'vikram.singh@example.com', 'Bengaluru', 'Karnataka', '2024-04-05', 'Corporate');

INSERT INTO `products` (`product_name`, `category`, `sub_category`, `unit_cost`, `unit_price`, `stock_quantity`) VALUES
('Pro Wireless Noise-Cancelling Headphones', 'Electronics', 'Audio', 4500.00, 7999.00, 150),
('Ergonomic Mesh Office Chair', 'Furniture', 'Seating', 3200.00, 6499.00, 80),
('Mechanical Gaming Keyboard RGB', 'Electronics', 'Peripherals', 1800.00, 3299.00, 200),
('Adjustable Height Standing Desk', 'Furniture', 'Desks', 8500.00, 14999.00, 45),
('Ultra HD 27-inch 4K Monitor', 'Electronics', 'Displays', 12000.00, 18999.00, 60),
('USB-C 7-in-1 Multiport Hub', 'Electronics', 'Accessories', 800.00, 1599.00, 350);

INSERT INTO `orders` (`customer_id`, `order_date`, `shipping_status`, `payment_method`) VALUES
(1, '2025-01-10', 'Delivered', 'Credit Card'),
(2, '2025-01-14', 'Delivered', 'UPI'),
(3, '2025-01-18', 'Delivered', 'Net Banking'),
(4, '2025-02-02', 'Delivered', 'UPI'),
(5, '2025-02-11', 'Delivered', 'Credit Card');

INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `unit_price`, `discount_rate`) VALUES
(1, 1, 2, 7999.00, 0.10),
(1, 3, 1, 3299.00, 0.05),
(2, 2, 1, 6499.00, 0.00),
(3, 4, 4, 14999.00, 0.15),
(3, 5, 4, 18999.00, 0.15),
(4, 6, 2, 1599.00, 0.00),
(5, 1, 1, 7999.00, 0.05),
(5, 5, 1, 18999.00, 0.10);

-- -------------------------------------------------------------
-- Analytical Star Schema View for Power BI DirectQuery
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW `vw_sales_summary` AS
SELECT 
    o.order_id,
    o.order_date,
    c.full_name AS customer_name,
    c.city,
    c.state,
    c.customer_segment,
    p.product_name,
    p.category,
    p.sub_category,
    oi.quantity,
    oi.unit_price,
    oi.discount_rate,
    oi.line_total,
    (oi.line_total - (p.unit_cost * oi.quantity)) AS line_profit
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
