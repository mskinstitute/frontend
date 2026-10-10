# Using Relationships (Star Schema & Cardinality)

In classical Excel modeling, creating a comprehensive report required using VLOOKUP to pull Customer Name, Product Category, and Store Location into a massive, bloated 50-column sales sheet. In Power Pivot, you build a **Relational Data Model** using a **Star Schema**, connecting tables with lightweight relationships.

---

## 1. The Star Schema: Fact vs. Dimension Tables

A professional data model organizes tables into two distinct categories:

```
+-----------------------------------------------------------------------------------+
| 1. FACT TABLES (The "Data" Table)                                                 |
| Contains transactional events, numbers, and foreign keys.                         |
| Examples: FactSales (OrderID, DateKey, CustomerKey, ProductKey, Revenue, Units).  |
| Characteristic: Contains millions of rows; keys repeat many times (* Many).       |
+-----------------------------------------------------------------------------------+
| 2. DIMENSION TABLES (The "Lookup" Tables)                                         |
| Contains descriptive attributes used for slicing and filtering.                   |
| Examples: DimCustomers, DimProducts, DimStores, DimCalendar.                       |
| Characteristic: Contains unique primary keys with NO duplicates (1 One).          |
+-----------------------------------------------------------------------------------+
```

```
Star Schema Visual Layout:
      [ DimCalendar ]       [ DimProducts ]
                                 /
                                /
               [ FactSalesTable ]
              /                               /                         [ DimCustomers ]       [ DimStores ]
```

![Relational Relationships and Star Schema](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Cardinality: One-to-Many Relationships (1 : *)

When connecting tables in Excel Power Pivot, relationships must almost always follow a **One-to-Many (1 : *)** structure:
* **The "One" Side (1):** Resides in the Dimension table where each key appears exactly once (e.g., 'DimCustomers[CustomerID]').
* **The "Many" Side (*):** Resides in the Fact table where the same customer can make multiple purchases over time (e.g., 'FactSales[CustomerID]').

---

## 3. Step-by-Step: Creating Relationships in Diagram View

1. In Excel, go to **Power Pivot > Manage**.
2. On the *Home* tab of the Power Pivot window, click **Diagram View**.
3. You will see visual boxes representing all loaded tables.
4. Locate **DimProducts**. Find the unique primary key: **ProductKey**.
5. Click and drag **ProductKey** from DimProducts and drop it directly onto **ProductKey** in **FactSales**.
6. A relationship line appears labeled with a **1** at DimProducts and an **`*`** (asterisk) at FactSales!
7. Repeat for Customers, Stores, and Calendar.

---

## 4. Building Multi-Table Pivot Tables

Once relationships are established:
1. Click **Home tab > PivotTable** in the Power Pivot window.
2. In the PivotTable Fields pane, you will see **all related tables**!
3. Drag **Product Category** from *DimProducts* into Rows.
4. Drag **State** from *DimCustomers* into Columns.
5. Drag **Revenue** from *FactSales* into Values.
*Excel calculates the cross-tabulation across three separate tables seamlessly without a single VLOOKUP!*

---

# Multiple Choice Questions

### 1. In relational data modeling, what is the primary distinction between a Fact table and a Dimension table?
A. Fact tables hold transactional metrics and repeating keys; Dimension tables hold unique lookup attributes for slicing
B. Fact tables only hold dates
C. Dimension tables cannot contain numbers
D. Fact tables are always smaller than Dimension tables
**Answer:** A
**Explanation:** Fact tables record historical transactional numbers (sales, clicks, costs) with repeating foreign keys, whereas Dimension tables hold unique descriptive master data.

---

### 2. What relationship cardinality is the standard building block for robust Power Pivot models?
A. Many-to-Many
B. One-to-Many (1 : *)
C. One-to-One
D. Zero-to-Zero
**Answer:** B
**Explanation:** One-to-Many relationships—linking unique primary keys in Dimension tables to repeating foreign keys in Fact tables—form the backbone of relational models.

---

### 3. What happens if you try to drag a relationship from a column in a Dimension table that contains duplicate values?
A. Excel deletes the duplicates automatically
B. Power Pivot displays an error stating that the relationship cannot be created because the column contains duplicate values
C. The computer restarts
D. It creates a circular reference
**Answer:** B
**Explanation:** The "One" side of a relationship strictly requires distinct, unique values; if duplicates exist, Power Pivot rejects the relationship.

---

### 4. What visual icon represents the "Many" side of a relationship line in Power Pivot Diagram View?
A. A number 1
B. An asterisk (*)
C. An exclamation mark
D. A dollar sign
**Answer:** B
**Explanation:** In Power Pivot Diagram View, the "Many" side is designated by an asterisk (*), while the "One" side is marked with a 1.

---

### 5. Why is building a Star Schema in Power Pivot superior to combining everything into one 60-column sheet with VLOOKUP?
A. It minimizes file size through columnar compression and eliminates slow, fragile VLOOKUP calculations
B. It automatically emails reports to customers
C. It allows typing formulas in Spanish
D. It prevents the need for saving files
**Answer:** A
**Explanation:** A normalized star schema avoids duplicating text data millions of times, drastically reducing memory consumption and speeding up calculations.

---
