# Case Study 3: Supply Chain, Logistics & Inventory Optimization

Supply chain leaders manage tight trade-offs between **carrying costs** (holding too much inventory in warehouses) and **stockout risks** (running out of inventory and losing sales). This case study details the architecture of an enterprise Supply Chain & Inventory Dashboard.

---

## 1. Key Supply Chain Performance Metrics

- **Days Inventory Outstanding (DIO):** Measures the average number of days it takes for inventory to turn into sales.
- **Safety Stock Threshold:** Minimum inventory required to guard against supply delivery delays.
- **On-Time In-Full (OTIF) Delivery Rate %:** The gold-standard logistics metric evaluating whether shipments arrived on schedule with complete item quantities.

```
Inventory Replenishment Trigger:
[Current Stock Level] vs. [Reorder Point = (Lead Time * Daily Usage) + Safety Stock]
          |
          v
   Is Current Stock < Reorder Point?
       /                         \
    (YES)                       (NO)
     v                           v
[TRIGGER PURCHASE ORDER!]     [INVENTORY HEALTHY]
```

---

## 2. Core Supply Chain DAX Formulations

```dax
-- 1. Days Inventory Outstanding (DIO)
-- Formula: (Average Inventory Value / COGS) * 365
Days Inventory Outstanding = 
VAR AvgInventory = AVERAGE(Fact_Inventory[InventoryValuation])
VAR AnnualCOGS = [Total COGS]
RETURN
DIVIDE(AvgInventory, AnnualCOGS, 0) * 365

-- 2. On-Time In-Full (OTIF) Delivery %
OTIF Rate % = 
DIVIDE(
    CALCULATE(
        COUNTROWS(Fact_Shipments),
        Fact_Shipments[IsOnTime] == TRUE() && Fact_Shipments[IsInFull] == TRUE()
    ),
    COUNTROWS(Fact_Shipments),
    0
)

-- 3. Stockout Risk Flag
Stockout Risk Items Count = 
CALCULATE(
    DISTINCTCOUNT(Dim_Product[ProductID]),
    Fact_Inventory[QuantityOnHand] <= Fact_Inventory[ReorderPoint]
)
```

---

# Multiple Choice Questions

### 1. In supply chain analytics, what does the "Days Inventory Outstanding" (DIO) metric measure?
A. The number of warehouse employees
B. The average number of days it takes for an enterprise to turn its inventory into sales
C. The delivery truck speed
D. The warehouse rent
**Answer:** B
**Explanation:** DIO measures inventory turnover efficiency. A lower DIO indicates that capital is not tied up in idle warehouse stock for extended periods.

### 2. What does the logistics metric "OTIF" stand for?
A. On-Time In-Full
B. Order Tracking In Flight
C. Operational Technology Integrated Flow
D. Overall Transportation Index Factor
**Answer:** A
**Explanation:** OTIF (On-Time In-Full) measures the percentage of orders delivered on or before the committed delivery date with complete quantities.

### 3. What components are mathematically combined to determine an item's Reorder Point?
A. Product color and weight
B. (Average Lead Time $\times$ Daily Demand) $+$ Safety Stock
C. Sales price multiplied by tax rate
D. Warehouse zip code
**Answer:** B
**Explanation:** The reorder point accounts for the inventory consumed during vendor lead time plus a safety buffer for demand variability.

### 4. What visual technique on an inventory matrix instantly alerts warehouse managers to items that have breached their safety stock threshold?
A. Setting font size to 8pt
B. Conditional Formatting using red background fill or icon indicators on rows where `QuantityOnHand <= ReorderPoint`
C. Hiding the item
D. Printing the report
**Answer:** B
**Explanation:** Conditional formatting icons (such as red warning flags) immediately draw human attention to items approaching critical stockout status.

### 5. Why is monitoring supplier delivery lead time variance critical for procurement teams?
A. To pick paint colors for trucks
B. Suppliers with highly unpredictable lead times force organizations to carry expensive excess safety stock to protect against delivery stockouts
C. Lead times do not affect inventory
D. It is required by web browsers
**Answer:** B
**Explanation:** Unreliable suppliers increase lead time variance, compelling companies to tie up cash flow in large buffer stocks.

---
