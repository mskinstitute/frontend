# Best Practices for Report & Visual Performance Optimization

A report that takes 10 seconds to respond every time a user clicks a slicer will be abandoned by business stakeholders. Fast reports (rendering in under 1 to 2 seconds) require disciplined architecture across visual design, DAX formulas, and data modeling.

---

## 1. Visual Design Best Practices: The Rule of 15

Every visual on a Power BI canvas generates at least **one separate query** to the underlying VertiPaq or DirectQuery engine:
- If a page has 30 cards, 5 slicers, 4 bar charts, and 2 tables: clicking a single slicer fires **over 40 simultaneous queries**!
- Browsers and workstations have limited thread pools, causing query queuing and visual stutter.

```
Visual Architecture Comparison:
Anti-Pattern (Sluggish):            Best Practice (High Performance):
30 Individual Single-Value Cards    2 Multi-Row Cards or 1 Matrix Visual
(Fires 30 separate DAX queries)     (Fires only 1 unified DAX query!)
```

> **UX GOLDEN RULE:** Limit active visual elements on a single canvas to **10 to 15 visuals maximum**. Use bookmarks, drillthroughs, and tooltips to provide progressive depth rather than overcrowding.

---

## 2. DAX Formula Best Practices

1. **Avoid `IF` checks on Blank measures:**
   - *Bad:* `IF([Sales] = BLANK(), 0, [Sales])` (forces calculation of unneeded rows).
   - *Good:* `[Sales] + 0` or rely on native visual blank formatting.
2. **Use Variables (`VAR` / `RETURN`) aggressively:**
   - DAX variables are evaluated **once** and cached, preventing redundant recalculations:
   ```dax
   -- Highly Optimized with Variables:
   Profit Margin Ratio = 
   VAR TotalRevenue = [Total Sales]
   VAR TotalExpenses = [Total Costs]
   RETURN
   IF(
       TotalRevenue > 0,
       DIVIDE(TotalRevenue - TotalExpenses, TotalRevenue, 0),
       0
   )
   ```
3. **Prefer `DIVIDE()` over `/` operator.**
4. **Avoid referencing entire tables inside `FILTER()` when a single column suffices:**
   - *Bad:* `FILTER(Fact_Sales, Fact_Sales[Region] = "North")`
   - *Good:* `KEEPFILTERS(Fact_Sales[Region] = "North")`

---

## 3. The Performance Analyzer Tool

Power BI Desktop includes an integrated profiling tool called **Performance Analyzer**:
1. Go to the **View** ribbon tab and check **Performance Analyzer**.
2. Click **Start recording**.
3. Click **Refresh visuals**.
4. Power BI will display exact execution times for every visual, broken down into:
   - **DAX Query:** Time spent in the VertiPaq engine calculating numbers.
   - **Visual Display:** Time spent by the browser rendering pixels, axes, and legends.
   - **Other:** Time spent waiting in the thread queue.

---

# Multiple Choice Questions

### 1. Why does having 40 individual card visuals on a single dashboard page degrade user performance?
A. Card visuals require extra internet bandwidth
B. Each visual generates its own independent DAX query; 40 visuals create query queuing and browser rendering bottlenecks
C. Power BI restricts pages to 10 visuals maximum
D. Cards only support text values
**Answer:** B
**Explanation:** Each card generates a separate query to the engine. Firing dozens of simultaneous queries overwhelms thread limits, causing visible latency when filtering.

### 2. How do DAX Variables (`VAR` ... `RETURN`) improve formula performance?
A. By converting numbers to Roman numerals
B. By evaluating an expression once and caching its result in memory for reuse throughout the formula, preventing redundant recalculations
C. By encrypting the formula logic
D. By bypassing Row-Level Security
**Answer:** B
**Explanation:** Variables in DAX are computed once at the point of declaration and store the resulting scalar or table value, eliminating duplicate sub-expression evaluations.

### 3. Which built-in tool in Power BI Desktop records and displays exact millisecond execution times for every visual on a page?
A. Query Editor
B. Performance Analyzer (located under the View tab)
C. Relationship Manager
D. Windows Task Manager
**Answer:** B
**Explanation:** The Performance Analyzer tool measures the exact duration (in milliseconds) of DAX query generation, visual display rendering, and queue wait times for every visual on the canvas.

### 4. What is the recommended visual replacement when you need to display 10 related KPI metrics instead of 10 individual single-value card visuals?
A. A Scatter Plot
B. A Multi-Row Card, Table, or the new New Card visual (which consolidates multiple metrics into a single query)
C. 10 Pie Charts
D. A Python script visual
**Answer:** B
**Explanation:** Multi-row cards and modern consolidated card visuals bundle multiple metric evaluations into a single query, significantly reducing query overhead.

### 5. If Performance Analyzer reveals that a visual takes 3,200ms total, with 3,000ms spent in "DAX Query" and 200ms in "Visual Display", where should optimization efforts focus?
A. Upgrading the computer's graphics card
B. Optimizing the underlying DAX measure formula and data model relationships
C. Changing chart colors
D. Exporting the file to PDF
**Answer:** B
**Explanation:** A 3,000ms DAX query time indicates that the VertiPaq engine is struggling with inefficient DAX formulas (such as nested iterators or un-optimized filters) or a poor data model schema.

---
