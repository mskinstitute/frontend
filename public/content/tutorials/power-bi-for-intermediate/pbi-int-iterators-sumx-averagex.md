# DAX Iterators: Row-by-Row Evaluation with SUMX, AVERAGEX & RANKX

Standard aggregation functions (`SUM`, `AVERAGE`, `MIN`, `MAX`) take a single column as input and aggregate all visible values in that column under the current filter context. However, real-world business formulas frequently require calculating values **row-by-row before aggregating**—this is the domain of **DAX Iterators** (commonly known as the **"X-Functions"**).

---

## 1. Aggregators vs. Iterators

| Feature | Standard Aggregators (`SUM`, `AVERAGE`) | Iterators (`SUMX`, `AVERAGEX`, `MAXX`, `MINX`) |
| :--- | :--- | :--- |
| **Syntax** | `SUM(Table[Column])` | `SUMX(Table, RowExpression)` |
| **Input** | A single column reference | A table (or table expression) AND a scalar row calculation |
| **Evaluation Mechanism** | Operates strictly across the pre-existing column | Iterates row-by-row, computes the expression in Row Context, then aggregates |
| **Memory Efficiency** | High (native columnar scan) | High (avoids creating permanent calculated columns in memory) |

```
The SUMX Execution Pipeline:
Table: Fact_OrderItems (Rows 1 to N)
   [Row 1]: Qty (2) * UnitPrice ($50) * (1 - Discount 0.10) = $90
   [Row 2]: Qty (1) * UnitPrice ($120) * (1 - Discount 0.00) = $120
   [Row 3]: Qty (5) * UnitPrice ($10) * (1 - Discount 0.20) = $40
      |
      +---> VertiPaq sums the results: $90 + $120 + $40 = $250!
```

---

## 2. Implementing SUMX: Dynamic Revenue Calculation

Instead of polluting your data model with a calculated column for line total, compute it dynamically:

```dax
-- Total Net Sales using SUMX
Total Net Sales = 
SUMX(
    Fact_OrderItems,
    Fact_OrderItems[Quantity] * Fact_OrderItems[UnitPrice] * (1 - Fact_OrderItems[DiscountRate])
)
```

### Filtering Inside an Iterator
Because the first argument of an iterator is any valid **Table Expression**, you can combine iterators with `FILTER`:

```dax
-- High-Value Order Sales (Orders with Sales > $1,000)
High Value Sales = 
SUMX(
    FILTER(
        Fact_OrderItems,
        Fact_OrderItems[UnitPrice] > 1000
    ),
    Fact_OrderItems[Quantity] * Fact_OrderItems[UnitPrice]
)
```

---

## 3. Dynamic Ranking with RANKX

`RANKX` evaluates a table and ranks each row dynamically according to a measure:

```dax
-- Rank Products by Sales
Product Sales Rank = 
IF(
    ISBLANK([Total Sales]),
    BLANK(),
    RANKX(
        ALL(Dim_Product[ProductName]), 
        [Total Sales], 
        , 
        DESC, 
        Dense
    )
)
```

### RANKX Parameter Breakdown
1. **Table (`ALL(Dim_Product[ProductName])`):** The list of all items to be ranked. Using `ALL` removes outer row filters so each product is compared against all products.
2. **Expression (`[Total Sales]`):** The metric used for ranking.
3. **Value (Omitted):** Evaluates the expression for the current item.
4. **Order (`DESC`):** Highest sales receives Rank 1.
5. **Ties (`Dense`):** Tied ranks do not skip numbers (e.g., 1, 2, 2, 3 instead of 1, 2, 2, 4).

---

## 4. Performance Considerations for Iterators

- Iterators introduce **Row Context**. When nesting iterators inside other iterators (e.g., `SUMX(..., AVERAGEX(...))`), the VertiPaq engine must perform quadratic loop iterations, which can degrade report speed on datasets with millions of rows.
- Always filter tables as early as possible using the smallest table expression in the first parameter.

---

# Multiple Choice Questions

### 1. What is the fundamental difference between `SUM(Table[Sales])` and `SUMX(Table, Expression)`?
A. `SUM` is an iterator, while `SUMX` only supports text data types
B. `SUM` sums an existing single column, whereas `SUMX` evaluates an expression row-by-row across a table and then sums the results
C. `SUMX` cannot be used in card visuals
D. `SUM` requires an internet connection
**Answer:** B
**Explanation:** `SUM` operates directly on an existing column. `SUMX` takes a table and an arbitrary mathematical expression, evaluates the expression for each row in that table, and sums the resulting values.

---

### 2. In the formula `SUMX(Fact_Sales, Fact_Sales[Qty] * Fact_Sales[Price])`, what context is created by `SUMX` to evaluate `Qty * Price`?
A. Filter Context
B. Row Context
C. Report Context
D. Drillthrough Context
**Answer:** B
**Explanation:** Iterators such as `SUMX`, `AVERAGEX`, and `MINX` instantiate a Row Context for the table passed in the first parameter, allowing the expression to reference column values from that specific row.

---

### 3. Why is using `ALL(Dim_Product[ProductName])` inside `RANKX` essential when ranking products in a table visual?
A. To sort the visual in alphabetical order
B. To clear the visual's filter context so the current product is evaluated against all products in the catalog
C. To prevent products with zero sales from showing
D. To convert text names into numbers
**Answer:** B
**Explanation:** Inside a table visual, each row is naturally filtered to a single product. Without `ALL()`, `RANKX` would compare each product only against itself, giving every product a rank of 1.

---

### 4. What tie-breaking method in `RANKX` assigns consecutive ranks (e.g., 1, 2, 2, 3) without skipping rank positions?
A. Skip
B. Dense
C. Continuous
D. Alphabetical
**Answer:** B
**Explanation:** In `RANKX`, the `Dense` option assigns the immediate next integer after a tie (1, 2, 2, 3), whereas the default `Skip` option skips numbers (1, 2, 2, 4).

---

### 5. Why is replacing multiple Calculated Columns with a single `SUMX` measure considered a Power BI performance best practice?
A. Calculated columns cannot be used in bar charts
B. `SUMX` evaluates on-the-fly without occupying permanent RAM storage, keeping model file size compact
C. `SUMX` disables scheduled refresh requirements
D. Calculated columns can only be authored in Power Query M language
**Answer:** B
**Explanation:** Calculated columns increase RAM footprint and file size because their results are stored permanently row-by-row in VertiPaq. A `SUMX` measure calculates the values dynamically at visual runtime.

---
