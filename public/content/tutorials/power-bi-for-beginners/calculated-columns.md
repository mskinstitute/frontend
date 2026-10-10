# Calculated Columns

*Reading Time: 8 Mins* | *Level: Beginner to Advanced*

---

## 1. What is a Calculated Column?
A **Calculated Column** is an extension of a table created by writing a DAX formula that evaluates **row-by-row** during data refresh. The result is physically stored in memory as part of the table.

```dax
// Calculated Column Syntax
Total_Price = Sales[Quantity] * Sales[Unit_Price]

// Conditional Categorical Column
Customer_Tier = IF(Customer[Annual_Spend] > 100000, "Platinum", "Standard")
```

---

## 2. Row Context in Calculated Columns
Calculated columns operate under **Row Context**. This means the formula automatically knows which row it is currently evaluating, allowing direct column references without explicit row loop code.

---

## 3. When to Use Calculated Columns?
- When you need to use the resulting values in a **Slicer** or as an **Axis category** on a chart.
- When you need to group data into discrete bands (e.g. Age Groups: "18-25", "26-35").
- *Warning:* Calculated columns consume RAM on disk and in memory. Do not use them for aggregations that belong in measures!

---

# Multiple Choice Questions

### 1. When is a calculated column evaluated and stored?
A. During data refresh, and stored in RAM as part of the table
B. Dynamically on every visual mouse click
C. Only when exporting to PDF
D. Never stored
**Answer:** A
**Explanation:** Calculated columns are computed during data load/refresh and persisted directly in the in-memory data model.
---

### 2. Under what evaluation context does a calculated column formula execute?
A. Row Context
B. Filter Context
C. Global Context
D. Canvas Context
**Answer:** A
**Explanation:** Calculated columns evaluate under Row Context, calculating values row-by-row.
---

### 3. Which of the following is an ideal use case for a Calculated Column rather than a Measure?
A. Creating age cohorts (e.g., "20-30", "31-40") to be used as categories on a chart's X-axis or in a Slicer
B. Calculating total sum of revenue
C. Calculating profit margin percentage
D. Counting total transactions
**Answer:** A
**Explanation:** Calculated columns produce row-level values that can be used to slice, dice, and categorize visuals.
---

### 4. What is the primary drawback of creating excessive calculated columns in large datasets?
A. They increase file size and consume valuable RAM because values are stored for every single row
B. They delete relationships
C. They change the font to comic sans
D. They disable visuals
**Answer:** A
**Explanation:** Calculated columns physically occupy space in memory for every row, bloating model size.
---

### 5. In DAX, which function accesses values from a related table sitting on the 'One' side of a relationship within a calculated column?
A. `RELATED()`
B. `LOOKUP_ROW()`
C. `FETCH()`
D. `GET_PARENT()`
**Answer:** A
**Explanation:** The `RELATED(Table[Column])` function traverses many-to-one relationships to retrieve values from the related dimension table.
---
