---
id: project-2-inventory-billing-stl-map
slug: project-2-inventory-billing-stl-map
course: cpp-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 2: Inventory & Billing Engine Using STL Map and Vector"
difficulty: Intermediate
readingTime: 16
order: 31
keywords: ["inventory billing system","stl map project","cart checkout","gst invoice","c++ intermediate project"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛒 Portfolio Project 2: Inventory & Billing Engine

## Introduction
Enterprise retail software requires catalog management, inventory level decrementation, and automated tax calculations. This project leverages **`std::map`** for inventory stock tracking and **`std::vector`** for cart receipts.

---

## 🎯 Features
1. Item catalog storing product details, unit prices, and stock quantity.
2. Cart checkout with quantity validation.
3. Automatically computes 18% GST and formats printable invoice.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <iomanip>

struct Product {
    std::string name;
    double unitPrice;
    int stockQuantity;
};

struct CartItem {
    std::string productCode;
    std::string name;
    double unitPrice;
    int quantity;
};

class BillingSystem {
private:
    std::map<std::string, Product> m_catalog;

public:
    BillingSystem() {
        // Seed catalog
        m_catalog["CPP-BOOK"] = {"Modern C++ Primer Book", 650.0, 25};
        m_catalog["USB-64GB"] = {"Sandisk 64GB Flash Drive", 450.0, 40};
        m_catalog["DEV-NOTE"] = {"MSK Engineering Spiral Notebook", 120.0, 100};
        m_catalog["OPT-MOUSE"] = {"Wireless Optical Mouse", 799.0, 15};
    }

    void printCatalog() const {
        std::cout << "\n=== MSK Institute Tech Store Catalog ===\n";
        std::cout << std::left << std::setw(12) << "Code" 
                  << std::setw(32) << "Item Description" 
                  << std::setw(12) << "Price (₹)" 
                  << std::setw(10) << "Stock" << "\n";
        std::cout << std::string(66, '-') << "\n";

        for (const auto& [code, p] : m_catalog) {
            std::cout << std::left << std::setw(12) << code 
                      << std::setw(32) << p.name 
                      << std::setw(12) << std::fixed << std::setprecision(2) << p.unitPrice 
                      << std::setw(10) << p.stockQuantity << "\n";
        }
    }

    void checkout(const std::vector<std::pair<std::string, int>>& orders) {
        std::vector<CartItem> cart;
        double subtotal = 0.0;

        for (const auto& [code, qty] : orders) {
            auto it = m_catalog.find(code);
            if (it == m_catalog.end()) {
                std::cout << "[ERROR]: Item code " << code << " not found.\n";
                continue;
            }

            if (it->second.stockQuantity < qty) {
                std::cout << "[ERROR]: Insufficient stock for " << it->second.name << "\n";
                continue;
            }

            // Deduct stock
            it->second.stockQuantity -= qty;
            double itemTotal = it->second.unitPrice * qty;
            subtotal += itemTotal;
            cart.push_back({code, it->second.name, it->second.unitPrice, qty});
        }

        // Print Invoice
        double gst = subtotal * 0.18;
        double grandTotal = subtotal + gst;

        std::cout << "\n=======================================================\n";
        std::cout << "                  TAX INVOICE / RECEIPT                 \n";
        std::cout << "=======================================================\n";
        for (const auto& item : cart) {
            std::cout << std::left << std::setw(30) << item.name 
                      << " x" << std::setw(4) << item.quantity
                      << " = ₹" << (item.unitPrice * item.quantity) << "\n";
        }
        std::cout << "-------------------------------------------------------\n";
        std::cout << "Subtotal     : ₹" << std::fixed << std::setprecision(2) << subtotal << "\n";
        std::cout << "GST (18%)    : ₹" << gst << "\n";
        std::cout << "Grand Total  : ₹" << grandTotal << "\n";
        std::cout << "=======================================================\n";
    }
};

int main() {
    BillingSystem store;
    store.printCatalog();

    std::vector<std::pair<std::string, int>> customerOrder = {
        {"CPP-BOOK", 2},
        {"DEV-NOTE", 3},
        {"USB-64GB", 1}
    };

    store.checkout(customerOrder);
    return 0;
}
```
