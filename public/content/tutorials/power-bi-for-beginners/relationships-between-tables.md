# Relationships Between Tables

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Relational Modeling in Power BI?
In real business systems, data is separated into multiple tables (e.g. `Customers`, `Products`, `Orders`). Rather than merging everything into one massive, slow table, Power BI connects tables using **Relationships** based on matching key columns.

---

## 2. Cardinality Types
- **1-to-Many ($1:*$):** The gold standard of data modeling. One record in the primary dimension table (e.g., Customer Master) relates to multiple transactions in the fact table (e.g., Sales Orders).
- **Many-to-1 ($*:1$):** Same as 1-to-many from the perspective of the fact table.
- **1-to-1 ($1:1$):** Rare. Usually indicates two tables that should be merged.
- **Many-to-Many ($*:*$):** Complex. Can cause ambiguous filter paths and performance degradation. Requires a bridge table.

---

## 3. Cross-Filter Direction
- **Single (Default & Best Practice):** The dimension table filters the fact table. Filters flow in one direction along the arrow.
- **Both (Bidirectional):** Filters flow in both directions. Use with extreme caution as it can produce unintended calculation results.

---

# Multiple Choice Questions

### 1. What is the most standard, efficient, and recommended relationship cardinality in Power BI?
A. One-to-Many ($1:*$)
B. Many-to-Many ($*:*$)
C. One-to-One ($1:1$)
D. Zero-to-Zero
**Answer:** A
**Explanation:** One-to-many relationships (Dimension to Fact) are the foundation of optimal dimensional modeling.
---

### 2. In a 1-to-Many relationship between 'Customers' and 'Sales', which table sits on the 'One' side?
A. Customers (each customer ID appears exactly once)
B. Sales (customers make multiple purchases)
C. Both
D. Neither
**Answer:** A
**Explanation:** The dimension table contains unique primary keys, sitting on the 'One' side of the relationship.
---

### 3. What indicates the direction that filters propagate between related tables in the Model View?
A. The arrow on the relationship connection line
B. The color of the line
C. The thickness of the table border
D. Table alphabetical order
**Answer:** A
**Explanation:** The arrow on the relationship line shows the direction in which filter selections flow across tables.
---

### 4. Why is bidirectional cross-filtering ('Both') discouraged as a default setting?
A. It can introduce ambiguity into filter propagation paths and significantly degrade DAX calculation performance
B. It crashes Windows
C. It deletes measures
D. It only works on dates
**Answer:** A
**Explanation:** Bidirectional filtering can cause unexpected filter bleed across related tables and slow down query execution.
---

### 5. What happens if you try to create a second active relationship between the same two tables?
A. Power BI creates an 'Inactive' relationship (represented by a dashed line), which can be activated using the `USERELATIONSHIP()` DAX function
B. Power BI crashes
C. The first relationship is deleted
D. Both relationships become active
**Answer:** A
**Explanation:** Only one relationship can be active between two tables; additional connections are marked inactive (dashed line).
---
