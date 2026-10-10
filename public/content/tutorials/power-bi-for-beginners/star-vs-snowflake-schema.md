# Star vs Snowflake Schema

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is Dimensional Modeling?
Dimensional modeling is the industry-standard data warehousing design technique introduced by Ralph Kimball. It organizes tables into two distinct categories:
1. **Fact Tables:** Contain quantitative, measurable business transactions and events (e.g. `Sales_Amount`, `Units_Sold`, `Order_Date`). Usually narrow, with millions of rows.
2. **Dimension Tables:** Contain descriptive context and attributes used to filter, slice, and group the facts (e.g. `Customer_Name`, `Product_Category`, `Store_Location`). Usually wide, with fewer rows.

---

## 2. Star Schema vs Snowflake Schema

### Star Schema (Recommended by Microsoft for Power BI):
- Fact table sits in the center, directly connected to surrounding Dimension tables.
- Looks like a star ($star$).
- **De-normalized dimensions:** Fast, simple, highly optimized for Power BI's VertiPaq engine.

### Snowflake Schema:
- Dimensions are further normalized into sub-dimension tables (e.g. `Product` links to `Subcategory`, which links to `Category`).
- Requires more relationship hops, increasing query complexity.

---

# Multiple Choice Questions

### 1. Which schema design is officially recommended by Microsoft for optimal Power BI performance?
A. Star Schema
B. 3rd Normal Form
C. Completely flat single table
D. Snowflake with 10 levels
**Answer:** A
**Explanation:** Microsoft strongly recommends Star Schema design for Power BI because the VertiPaq engine is optimized for single-hop dimensional filtering.
---

### 2. What type of data is stored in a Fact table?
A. Numerical metrics, transaction quantities, sales revenue, and foreign keys
B. Customer biographies
C. Company logos
D. Web browser history
**Answer:** A
**Explanation:** Fact tables record business transaction events and numeric metrics alongside foreign keys linking to dimensions.
---

### 3. What distinguishes a Snowflake schema from a Star schema?
A. In a Snowflake schema, dimension tables are normalized into sub-tables (e.g., Product $	o$ SubCategory $	o$ Category)
B. Star schemas have no relationships
C. Snowflake schemas cannot contain numbers
D. Star schemas only work in winter
**Answer:** A
**Explanation:** Snowflake schemas split dimensions into hierarchical normalized sub-tables, whereas Star schemas keep dimensions consolidated.
---

### 4. What is a 'Surrogate Key' in a dimensional model?
A. An artificial unique integer identifier generated specifically for the data warehouse (e.g. `Customer_SK`)
B. A duplicate key
C. A password
D. A foreign currency code
**Answer:** A
**Explanation:** Surrogate keys are synthetic integer keys created in the warehouse to uniquely identify dimension records independently of source system IDs.
---

### 5. Why are single giant flat tables (denormalized into one 100-column table) bad for enterprise Power BI models?
A. They cause massive redundancy, high memory consumption, slow DAX calculations, and make slicing across dimensions difficult
B. Power BI cannot open files with more than 5 columns
C. They prevent report printing
D. Colors do not work
**Answer:** A
**Explanation:** Single flat tables duplicate descriptive text across millions of rows, bloating memory and degrading calculation performance.
---
